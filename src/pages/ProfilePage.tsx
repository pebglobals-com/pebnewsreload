import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bookmark,
  Camera,
  CheckCircle2,
  Link2,
  Loader2,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  connectGoogleAccount,
  deleteReaderAccount,
  disconnectGoogleAccount,
  requestEmailChange,
  updateReaderProfile,
} from '../lib/api'
import { toFormError } from '../lib/errors'
import { formatStoryDate } from '../lib/article'
import {
  Field,
  firstFieldError,
  FormAlert,
  inputClass,
} from '../components/FormUi'

const FALLBACK_AVATAR = '/images/avatar-author.jpg'
const MAX_AVATAR_BYTES = 2 * 1024 * 1024
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function ProfilePage() {
  useDocumentTitle('Your account')

  const navigate = useNavigate()
  const { reader, signIn, signOut, refresh } = useAuth()

  const [name, setName] = useState(reader?.name ?? '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [profilePending, setProfilePending] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileNotice, setProfileNotice] = useState<string | null>(null)
  const [profileFieldErrors, setProfileFieldErrors] = useState<
    Record<string, string[]>
  >({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newEmail, setNewEmail] = useState('')
  const [emailPending, setEmailPending] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailNotice, setEmailNotice] = useState<string | null>(null)
  const [emailFieldErrors, setEmailFieldErrors] = useState<
    Record<string, string[]>
  >({})

  const [googlePending, setGooglePending] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  const [showDelete, setShowDelete] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deletePending, setDeletePending] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (reader) setName(reader.name)
  }, [reader])

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null)
      return
    }

    const url = URL.createObjectURL(avatarFile)
    setAvatarPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [avatarFile])

  if (!reader) return null

  const resetAvatarInput = () => {
    setAvatarFile(null)
    setRemoveAvatar(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const chooseAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setProfileError(null)
    setProfileNotice(null)

    if (!file) return

    if (!AVATAR_TYPES.includes(file.type)) {
      setProfileError('Choose a JPEG, PNG or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setProfileError('The image must be 2 MB or smaller.')
      event.target.value = ''
      return
    }

    setAvatarFile(file)
    setRemoveAvatar(false)
  }

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      setProfileFieldErrors({ name: ['Enter your name.'] })
      return
    }

    setProfilePending(true)
    setProfileError(null)
    setProfileNotice(null)
    setProfileFieldErrors({})

    const formData = new FormData()
    formData.set('name', name.trim())
    if (avatarFile) formData.set('avatar', avatarFile)
    if (removeAvatar) formData.set('remove_avatar', '1')

    try {
      const updated = await updateReaderProfile(formData)
      signIn(updated)
      resetAvatarInput()
      setProfileNotice('Your profile has been updated.')
    } catch (error) {
      const parsed = toFormError(
        error,
        'Your profile could not be updated.',
      )
      setProfileError(parsed.message)
      setProfileFieldErrors(parsed.fields)
    } finally {
      setProfilePending(false)
    }
  }

  const submitEmailChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEmailPending(true)
    setEmailError(null)
    setEmailNotice(null)
    setEmailFieldErrors({})

    try {
      const response = await requestEmailChange(newEmail.trim())
      setEmailNotice(response.message)
      setNewEmail('')
    } catch (error) {
      const parsed = toFormError(
        error,
        'The email change request could not be sent.',
      )
      setEmailError(parsed.message)
      setEmailFieldErrors(parsed.fields)
    } finally {
      setEmailPending(false)
    }
  }

  const connectGoogle = async () => {
    setGooglePending(true)
    setGoogleError(null)

    try {
      const response = await connectGoogleAccount()
      window.location.assign(response.redirect_url)
    } catch (error) {
      const parsed = toFormError(
        error,
        'Google could not be connected right now.',
      )
      setGoogleError(parsed.message)
      setGooglePending(false)
    }
  }

  const disconnectGoogle = async () => {
    if (
      !window.confirm(
        'Disconnect Google from your account? You will need your password to sign in.',
      )
    ) {
      return
    }

    setGooglePending(true)
    setGoogleError(null)

    try {
      await disconnectGoogleAccount()
      await refresh()
    } catch (error) {
      const parsed = toFormError(
        error,
        'Google could not be disconnected.',
      )
      setGoogleError(parsed.message)
    } finally {
      setGooglePending(false)
    }
  }

  const deleteAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (deleteConfirmation !== 'DELETE') return

    setDeletePending(true)
    setDeleteError(null)

    try {
      await deleteReaderAccount(
        reader.has_password
          ? { current_password: currentPassword }
          : { confirmation: 'DELETE' },
      )
      await signOut()
      navigate('/', { replace: true })
    } catch (error) {
      const parsed = toFormError(
        error,
        'The account could not be deleted.',
      )
      setDeleteError(parsed.message)
      setDeletePending(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const signInMethod = reader.has_password
    ? reader.google_connected
      ? 'Password and Google'
      : 'Password'
    : 'Google'

  return (
    <main id="main-content" className="pb-16">
      <div className="container-peb pt-6">
        <header className="border-b border-line pb-5">
          <span className="category-eyebrow">Reader account</span>
          <h1 className="mt-1.5 font-serif text-[32px] font-bold leading-[1.05] tracking-[-0.025em] text-ink sm:text-[40px]">
            Your account
          </h1>
          <p className="mt-2 max-w-[560px] text-[13.5px] leading-relaxed text-ink2">
            Manage your profile, email address and sign-in methods.
          </p>
        </header>

        {!reader.email_verified && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[#b45309]/30 bg-[#b45309]/10 px-4 py-3 text-[12.5px] text-[#92400e] dark:text-[#fbbf24]">
            <span className="inline-flex items-center gap-2">
              <ShieldAlert size={15} className="shrink-0" aria-hidden="true" />
              Verify your email to change your email, connect Google or delete
              your account.
            </span>
            <Link
              to="/verify-email"
              className="font-semibold underline underline-offset-2"
            >
              Verify now
            </Link>
          </div>
        )}

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="rounded-[5px] border border-line bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <UserRound size={16} className="text-action" aria-hidden="true" />
                <h2 className="font-serif text-[21px] font-bold text-ink">
                  Profile
                </h2>
              </div>

              <form onSubmit={saveProfile} className="mt-5 space-y-5">
                {profileError && <FormAlert>{profileError}</FormAlert>}
                {profileNotice && (
                  <FormAlert tone="success">{profileNotice}</FormAlert>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface-2">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="New profile photo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : !removeAvatar && reader.avatar_url ? (
                      <img
                        src={reader.avatar_url}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_AVATAR
                        }}
                      />
                    ) : (
                      <span className="font-serif text-[24px] font-bold text-ink2">
                        {initials(reader.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[3px] border border-line-strong px-3 text-[12px] font-semibold text-ink2 transition-colors hover:border-action hover:text-ink">
                        <Camera size={13} aria-hidden="true" />
                        Change photo
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={chooseAvatar}
                          className="sr-only"
                        />
                      </label>

                      {reader.avatar_url && !removeAvatar && (
                        <button
                          type="button"
                          onClick={() => {
                            setRemoveAvatar(true)
                            setAvatarFile(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                          className="text-[11.5px] font-medium text-ink3 underline-offset-2 hover:text-brand hover:underline"
                        >
                          Remove photo
                        </button>
                      )}

                      {removeAvatar && (
                        <button
                          type="button"
                          onClick={resetAvatarInput}
                          className="text-[11.5px] font-medium text-action-soft underline-offset-2 hover:underline"
                        >
                          Undo
                        </button>
                      )}
                    </div>
                    <p className="mt-1.5 text-[11px] text-ink3">
                      JPEG, PNG or WebP · 2 MB maximum
                    </p>
                  </div>
                </div>

                <Field
                  id="profile-name"
                  label="Full name"
                  error={firstFieldError(profileFieldErrors, 'name')}
                >
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                    maxLength={255}
                    className={inputClass}
                  />
                </Field>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={profilePending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[3px] bg-action px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-action/90 disabled:cursor-wait disabled:opacity-70"
                  >
                    {profilePending && (
                      <Loader2
                        size={14}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    Save changes
                  </button>
                  {reader.created_at && (
                    <span className="text-[11.5px] text-ink3">
                      Member since {formatStoryDate(reader.created_at)}
                    </span>
                  )}
                </div>
              </form>
            </section>

            <section className="rounded-[5px] border border-line bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="text-action" aria-hidden="true">
                  @
                </span>
                <h2 className="font-serif text-[21px] font-bold text-ink">
                  Email address
                </h2>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-ink">
                <span className="font-medium">{reader.email}</span>
                {reader.email_verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#008751]/10 px-2 py-0.5 text-[10.5px] font-semibold text-[#007a49] dark:text-[#7fe0b0]">
                    <CheckCircle2 size={11} aria-hidden="true" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#b45309]/10 px-2 py-0.5 text-[10.5px] font-semibold text-[#92400e] dark:text-[#fbbf24]">
                    <ShieldAlert size={11} aria-hidden="true" />
                    Unverified
                  </span>
                )}
              </div>

              <form onSubmit={submitEmailChange} className="mt-4 space-y-4">
                {emailError && <FormAlert>{emailError}</FormAlert>}
                {emailNotice && (
                  <FormAlert tone="success">{emailNotice}</FormAlert>
                )}

                <Field
                  id="profile-new-email"
                  label="New email address"
                  hint={
                    reader.email_verified
                      ? 'We will send a confirmation link to the new address. Your current email stays active until then.'
                      : 'Verify your current email address before changing it.'
                  }
                  error={firstFieldError(emailFieldErrors, 'email')}
                >
                  <input
                    id="profile-new-email"
                    type="email"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    autoComplete="email"
                    required
                    maxLength={255}
                    disabled={!reader.email_verified}
                    placeholder="new@example.com"
                    className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={
                    emailPending || !reader.email_verified || !newEmail.trim()
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[3px] bg-action px-5 text-[12.5px] font-semibold text-white transition-colors hover:bg-action/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {emailPending && (
                    <Loader2
                      size={14}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Send confirmation
                </button>
              </form>
            </section>

            <section className="rounded-[5px] border border-line bg-surface p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-action" aria-hidden="true" />
                <h2 className="font-serif text-[21px] font-bold text-ink">
                  Sign-in and security
                </h2>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-line px-3.5 py-3">
                  <div>
                    <p className="text-[12.5px] font-semibold text-ink">
                      Password
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-ink3">
                      {reader.has_password
                        ? 'Your account has a password set.'
                        : 'Your account signs in with Google only.'}
                    </p>
                  </div>
                  {reader.has_password && (
                    <Link
                      to={`/forgot-password?email=${encodeURIComponent(reader.email)}`}
                      className="inline-flex h-8 items-center rounded-[3px] border border-line-strong px-3 text-[11.5px] font-semibold text-ink2 transition-colors hover:border-action hover:text-ink"
                    >
                      Reset password
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-line px-3.5 py-3">
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                      <Link2 size={13} aria-hidden="true" />
                      Google
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-ink3">
                      {reader.google_connected
                        ? 'Google is linked to your account.'
                        : 'Link Google for one-tap sign-in.'}
                    </p>
                  </div>

                  {reader.google_connected ? (
                    <button
                      type="button"
                      onClick={disconnectGoogle}
                      disabled={
                        googlePending ||
                        !reader.has_password ||
                        !reader.email_verified
                      }
                      title={
                        !reader.has_password
                          ? 'Set a password before disconnecting Google.'
                          : undefined
                      }
                      className="inline-flex h-8 items-center gap-2 rounded-[3px] border border-line-strong px-3 text-[11.5px] font-semibold text-ink2 transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {googlePending && (
                        <Loader2
                          size={12}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      )}
                      Disconnect
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={connectGoogle}
                      disabled={googlePending || !reader.email_verified}
                      className="inline-flex h-8 items-center gap-2 rounded-[3px] border border-line-strong px-3 text-[11.5px] font-semibold text-ink2 transition-colors hover:border-action hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {googlePending && (
                        <Loader2
                          size={12}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      )}
                      Connect Google
                    </button>
                  )}
                </div>

                {googleError && <FormAlert>{googleError}</FormAlert>}
                {!reader.has_password && reader.google_connected && (
                  <p className="text-[11px] leading-relaxed text-ink3">
                    To disconnect Google, first set a password using the reset
                    password link.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[5px] border border-brand/25 bg-brand/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Trash2 size={16} className="text-brand" aria-hidden="true" />
                <h2 className="font-serif text-[21px] font-bold text-ink">
                  Delete account
                </h2>
              </div>
              <p className="mt-2 max-w-[560px] text-[12.5px] leading-relaxed text-ink2">
                Permanently delete your account, bookmarks, profile photo and
                linked Google identity. This cannot be undone.
              </p>

              {!showDelete ? (
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="mt-4 inline-flex h-9 items-center rounded-[3px] border border-brand/40 px-4 text-[12px] font-semibold text-brand transition-colors hover:bg-brand/10"
                >
                  Delete my account
                </button>
              ) : (
                <form onSubmit={deleteAccount} className="mt-4 space-y-4">
                  {deleteError && <FormAlert>{deleteError}</FormAlert>}

                  {reader.has_password ? (
                    <Field
                      id="delete-password"
                      label="Confirm your password"
                      error={
                        !reader.email_verified
                          ? 'Verify your email address first.'
                          : undefined
                      }
                    >
                      <input
                        id="delete-password"
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        required
                        disabled={!reader.email_verified}
                        className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                      />
                    </Field>
                  ) : null}

                  <Field
                    id="delete-confirmation"
                    label="Type DELETE to confirm"
                    hint="This action is permanent."
                  >
                    <input
                      id="delete-confirmation"
                      type="text"
                      value={deleteConfirmation}
                      onChange={(event) =>
                        setDeleteConfirmation(event.target.value)
                      }
                      autoComplete="off"
                      placeholder="DELETE"
                      required
                      disabled={!reader.email_verified}
                      className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                    />
                  </Field>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={
                        deletePending ||
                        deleteConfirmation !== 'DELETE' ||
                        !reader.email_verified ||
                        (reader.has_password && !currentPassword)
                      }
                      className="inline-flex h-9 items-center gap-2 rounded-[3px] bg-brand px-4 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletePending && (
                        <Loader2
                          size={13}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      )}
                      Permanently delete account
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDelete(false)
                        setDeleteConfirmation('')
                        setCurrentPassword('')
                        setDeleteError(null)
                      }}
                      className="text-[12px] font-medium text-ink3 hover:text-ink"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[92px] lg:self-start">
            <div className="rounded-[5px] border border-line bg-surface p-5">
              <span className="category-eyebrow">Account summary</span>
              <div className="mt-4 space-y-3 text-[12.5px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-ink3">Name</span>
                  <span className="truncate font-medium text-ink">
                    {reader.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-ink3">Email</span>
                  <span className="truncate font-medium text-ink">
                    {reader.email}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-ink3">Sign-in</span>
                  <span className="font-medium text-ink">{signInMethod}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-ink3">Status</span>
                  <span
                    className={
                      reader.email_verified
                        ? 'font-medium text-[#007a49] dark:text-[#7fe0b0]'
                        : 'font-medium text-[#92400e] dark:text-[#fbbf24]'
                    }
                  >
                    {reader.email_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[5px] border border-line bg-surface p-5">
              <Link
                to="/bookmarks"
                className="flex items-center justify-between gap-3 text-[13px] font-semibold text-ink transition-colors hover:text-action-soft"
              >
                <span className="inline-flex items-center gap-2">
                  <Bookmark size={15} className="text-action" aria-hidden="true" />
                  Saved stories
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[3px] border border-line-strong text-[12.5px] font-semibold text-ink2 transition-colors hover:border-brand hover:text-brand"
            >
              <LogOut size={14} aria-hidden="true" />
              Sign out
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}
