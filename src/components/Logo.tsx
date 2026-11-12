interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <a
      href="#top"
      aria-label="PEB News home"
      className={`inline-flex shrink-0 flex-col ${className}`}
    >
      <span className="flex items-center gap-[1px] leading-none">
        <svg
          viewBox="0 0 32 26"
          aria-hidden="true"
          className="mr-0.5 h-[21px] w-[25px] fill-brand sm:h-[24px] sm:w-[29px]"
        >
          <path d="M8.7 0H15l-6 26H2.7L8.7 0Z" />
          <path d="M21.1 0h6.3l-6 26h-6.3l6-26Z" />
        </svg>
        <span className="text-[26px] font-extrabold italic leading-none tracking-[-0.06em] text-white sm:text-[30px]">
          PEB
        </span>
        <span className="ml-0.5 bg-brand px-1.5 pb-[3px] pt-[2px] text-[26px] font-extrabold italic leading-none tracking-[-0.06em] text-white sm:text-[30px]">
          NEWS
        </span>
      </span>
      {!compact && (
        <span className="mt-[5px] hidden text-[8px] font-semibold uppercase tracking-[0.18em] text-white/65 sm:block">
          Latest news. Real stories. Impactful reporting.
        </span>
      )}
    </a>
  )
}
