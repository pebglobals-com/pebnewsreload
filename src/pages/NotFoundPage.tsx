import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <main id="main-content">
      <div className="container-peb flex min-h-[62vh] flex-col items-center justify-center py-16 text-center">
        <span className="font-serif text-[76px] font-bold leading-none tracking-[-0.04em] text-brand sm:text-[96px]">
          404
        </span>
        <span className="category-eyebrow mt-4">Page not found</span>
        <h1 className="mt-2 font-serif text-[30px] font-bold leading-tight text-ink sm:text-[38px]">
          We couldn’t find that page.
        </h1>
        <p className="mt-3 max-w-[480px] text-[14px] leading-relaxed text-ink2">
          The link may be broken, or the page may have been moved. Return to the
          homepage to keep reading the latest stories.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-[3px] bg-action px-4 text-[13px] font-semibold text-white transition-colors hover:bg-action/90"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to homepage
        </Link>
      </div>
    </main>
  )
}
