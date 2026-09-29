/** Camera-viewfinder corner bracket, top-left (and optionally bottom-right). */
export function Corners({ both = false }: { both?: boolean }) {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute left-4 top-4 h-7 w-7 border-l border-t border-white/60 md:left-5 md:top-5 md:h-9 md:w-9" />
      {both && (
        <span aria-hidden className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 border-b border-r border-white/60 md:bottom-5 md:right-5 md:h-9 md:w-9" />
      )}
    </>
  );
}

export function PlayButton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`flex items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent ${className}`}
    >
      <svg viewBox="0 0 24 24" className="ml-[8%] h-[34%] w-[34%]" fill="currentColor">
        <path d="M7 4.5v15l13-7.5z" />
      </svg>
    </span>
  );
}
