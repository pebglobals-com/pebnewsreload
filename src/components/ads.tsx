import { Crown, Leaf } from 'lucide-react'
import { AdLabel } from './ui'

interface AdProps {
  className?: string
}

function RiversideMark({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b3d66] ${className}`}
    >
      <span className="h-[18px] w-[18px] rounded-full border-2 border-[#5bd3a0]" />
      <span className="absolute h-[6px] w-[6px] rounded-full bg-[#f2c94c]" />
      <span className="absolute h-[22px] w-[22px] rounded-full border-t border-[#4c8dff]/70" />
    </span>
  )
}

function DeltaBuildMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7 fill-white"
    >
      <path d="M13.6 3.4 21 20.6h-6.2l-4.2-9.8-2.4 5.4H3L8.8 3.4h4.8Z" />
      <path d="M13.9 15.6h4.2l1.4 3.4h-4.2l-1.4-3.4Z" opacity=".55" />
    </svg>
  )
}

export function LeaderboardAd({ className = '' }: AdProps) {
  return (
    <aside
      aria-label="Advertisement"
      className={`relative hidden h-[96px] overflow-hidden rounded-[3px] border border-line bg-[#032b5b] lg:flex ${className}`}
    >
      <img
        src="/images/story-solar.jpg"
        alt=""
        className="absolute inset-y-0 left-[43%] h-full w-[44%] object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#032b5b] from-40% via-[#032b5b]/90 via-60% to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-[57%] items-center gap-5 pl-5">
        <div className="min-w-0">
          <AdLabel className="text-white/45" />
          <h2 className="mt-1 font-serif text-[20px] font-bold leading-[1.1] tracking-[-0.01em] text-white">
            Powering a cleaner, brighter Niger Delta
          </h2>
          <p className="mt-0.5 text-[11px] text-white/60">
            Sustainable energy for stronger communities.
          </p>
        </div>
        <a
          href="#"
          className="inline-flex h-8 shrink-0 items-center rounded-[3px] bg-[#0060f8] px-3 text-[10.5px] font-semibold text-white transition-colors hover:bg-[#0051d4]"
        >
          Learn more
        </a>
      </div>

      <div className="relative z-10 ml-auto flex h-full w-[220px] shrink-0 items-center gap-2.5 border-l border-white/15 bg-[#032b5b] px-4">
        <RiversideMark />
        <div className="leading-none">
          <p className="text-[12.5px] font-semibold text-white">Riverside</p>
          <p className="mt-0.5 text-[8.5px] font-medium uppercase tracking-[0.12em] text-white/55">
            Energy Solutions
          </p>
          <p className="mt-1.5 text-[8.5px] leading-[1.4] text-white/45">
            Clean Energy.
            <br />
            Brighter Communities.
          </p>
        </div>
      </div>
    </aside>
  )
}

export function MobileTopAd({ className = '' }: AdProps) {
  return (
    <aside
      aria-label="Advertisement"
      className={`relative overflow-hidden rounded-[3px] border border-line bg-[#032b5b] lg:hidden ${className}`}
    >
      <img
        src="/images/story-solar.jpg"
        alt=""
        className="h-[184px] w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#032b5b] via-[#032b5b]/80 to-[#032b5b]/10"
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 left-0 flex max-w-[80%] flex-col justify-center p-4">
        <AdLabel className="text-white/45" />
        <h2 className="mt-1 font-serif text-[22px] font-bold leading-[1.05] text-white">
          Powering a cleaner, brighter Niger Delta
        </h2>
        <p className="mt-1 text-[11px] text-white/60">
          Sustainable energy for stronger communities.
        </p>
        <a
          href="#"
          className="mt-2.5 inline-flex h-8 w-fit items-center rounded-[3px] bg-white px-3 text-[10.5px] font-semibold text-[#032b5b]"
        >
          Learn more
        </a>
      </div>
    </aside>
  )
}

export function DeltaBuildAd({ className = '' }: AdProps) {
  return (
    <aside
      aria-label="Advertisement"
      className={`relative overflow-hidden rounded-[3px] border border-line bg-[#032b5b] ${className}`}
    >
      <img
        src="/images/story-coast.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#032b5b] via-[#032b5b]/92 to-[#032b5b]/20"
        aria-hidden="true"
      />

      <div className="relative flex min-h-[124px] items-center justify-between gap-5 px-5 py-4 lg:min-h-[104px] lg:py-0">
        <div>
          <AdLabel className="text-white/45" />
          <h2 className="mt-1 max-w-[390px] font-serif text-[20px] font-bold leading-[1.08] tracking-[-0.01em] text-white sm:text-[22px]">
            Build a stronger tomorrow with reliable infrastructure.
          </h2>
          <p className="mt-1 text-[11px] text-white/55">
            Proudly supporting sustainable growth across Nigeria.
          </p>
          <a
            href="#"
            className="mt-2 inline-flex h-8 items-center rounded-[3px] bg-[#0060f8] px-3 text-[10.5px] font-semibold text-white transition-colors hover:bg-[#0051d4] sm:hidden"
          >
            Learn more
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <a
            href="#"
            className="hidden h-8 items-center rounded-[3px] bg-[#0060f8] px-3 text-[10.5px] font-semibold text-white transition-colors hover:bg-[#0051d4] sm:inline-flex"
          >
            Learn more
          </a>
          <div className="hidden items-center gap-2 border-l border-white/15 pl-4 sm:flex">
            <DeltaBuildMark />
            <div className="leading-none">
              <p className="text-[14px] font-bold text-white">DeltaBuild</p>
              <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.14em] text-white/50">
                Infrastructure for people
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export function RiversideAd({ className = '' }: AdProps) {
  return (
    <aside
      aria-label="Advertisement"
      className={`relative overflow-hidden rounded-[3px] border border-line bg-[#032b5b] lg:hidden ${className}`}
    >
      <img
        src="/images/story-wind.jpg"
        alt=""
        className="absolute inset-y-0 right-0 h-full w-[52%] object-cover opacity-80"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#032b5b] via-[#032b5b]/95 to-[#032b5b]/15"
        aria-hidden="true"
      />
      <div className="relative flex min-h-[180px] flex-col justify-center p-4">
        <AdLabel className="text-white/45" />
        <div className="mt-2 flex items-center gap-2.5">
          <RiversideMark className="h-9 w-9" />
          <div className="leading-none">
            <p className="text-[13px] font-semibold text-white">Riverside</p>
            <p className="mt-1 text-[8.5px] uppercase tracking-[0.12em] text-white/50">
              Energy Solutions
            </p>
          </div>
        </div>
        <p className="mt-3 max-w-[220px] font-serif text-[22px] font-bold leading-[1.05] text-white">
          Clean Energy. Brighter Communities.
        </p>
        <a
          href="#"
          className="mt-3 inline-flex h-8 w-fit items-center rounded-[3px] bg-white px-3 text-[10.5px] font-semibold text-[#032b5b]"
        >
          Learn more
        </a>
      </div>
    </aside>
  )
}

export function GreenDeltaAd({ className = '' }: AdProps) {
  return (
    <aside
      aria-label="Advertisement"
      className={`relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[3px] border border-[#1b5c46]/60 bg-[#073a2b] p-5 ${className}`}
    >
      <img
        src="/images/story-wind.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-right opacity-50"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#04291f] via-[#04291f]/92 to-[#04291f]/25"
        aria-hidden="true"
      />
      <AdLabel className="relative z-10 text-white/50" />
      <div className="relative z-10 mt-6 max-w-[300px]">
        <p className="font-serif text-[27px] font-bold leading-[1.02] tracking-[-0.015em] text-white">
          Greener Communities
          <br />
          Brighter Futures
        </p>
        <p className="mt-2 max-w-[250px] text-[12px] leading-relaxed text-white/65">
          Clean energy. Better lives. A stronger Niger Delta.
        </p>
        <a
          href="#"
          className="mt-4 inline-flex h-8 items-center rounded-[3px] bg-white px-3 text-[10.5px] font-semibold text-[#073a2b] transition-colors hover:bg-white/90"
        >
          Learn more
        </a>
      </div>
      <div className="relative z-10 mt-4 flex items-center justify-end gap-1.5 text-white/80">
        <Leaf size={14} aria-hidden="true" />
        <span className="text-[11.5px] font-semibold">GreenDelta</span>
        <span className="text-[8.5px] font-medium uppercase tracking-[0.16em] text-white/45">
          Energy
        </span>
      </div>
    </aside>
  )
}

export function HotelAd({ className = '' }: AdProps) {
  return (
    <aside
      aria-label="Advertisement"
      className={`relative overflow-hidden rounded-[3px] border border-line bg-[#032b5b] ${className}`}
    >
      <img
        src="/images/ad-hotel.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover lg:inset-y-0 lg:left-auto lg:right-[20%] lg:w-[36%]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#032b5b] via-[#032b5b]/85 to-[#032b5b]/25 lg:right-[20%] lg:via-[#032b5b]/75"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-[210px] flex-col justify-center px-5 py-5 lg:min-h-0 lg:h-[108px] lg:w-[46%] lg:py-0">
        <AdLabel className="text-white/45" />
        <h2 className="mt-1 font-serif text-[22px] font-bold leading-[1.05] tracking-[-0.01em] text-white lg:text-[23px]">
          Relax. Connect. Experience the Niger Delta.
        </h2>
        <p className="mt-1 max-w-[340px] text-[10.5px] leading-relaxed text-white/55">
          Comfortable stays, great hospitality, unforgettable moments.
        </p>
        <a
          href="#"
          className="mt-2.5 inline-flex h-8 w-fit items-center rounded-[3px] bg-white px-3 text-[10.5px] font-semibold text-[#032b5b] transition-colors hover:bg-white/90 lg:mt-2"
        >
          Book Now
        </a>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 text-[#f0b34a] lg:hidden">
        <Crown size={18} aria-hidden="true" />
        <div className="leading-none">
          <p className="font-serif text-[15px] font-bold italic text-[#f5c46a]">
            PEG <span className="text-[9px] not-italic">GLOBAL</span>
          </p>
          <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-[#f0b34a]/75">
            Hotels
          </p>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 z-10 hidden w-[20%] flex-col items-center justify-center border-l border-white/15 bg-[#032b5b] lg:flex">
        <Crown size={21} className="text-[#f0b34a]" aria-hidden="true" />
        <p className="mt-1 font-serif text-[19px] font-bold italic leading-none text-[#f5c46a]">
          PEG <span className="text-[10px] not-italic">GLOBAL</span>
        </p>
        <p className="mt-1 text-[8.5px] uppercase tracking-[0.2em] text-[#f0b34a]/75">
          Hotels
        </p>
      </div>
    </aside>
  )
}
