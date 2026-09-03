const ITEMS = ['Product thinking', 'Interface design', 'Full-stack engineering', 'Production delivery']

export default function SignatureMarquee() {
  const repeated = [...ITEMS, ...ITEMS]
  return (
    <section aria-label="Core capabilities" className="relative z-10 overflow-hidden border-y border-indigo-400/20 bg-neutral-950 py-5 text-white">
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(79,70,229,.25),transparent_25%,transparent_75%,rgba(217,70,239,.18))]" />
      <div className="marquee-track">
        {repeated.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center">
            <span className="whitespace-nowrap px-8 text-sm font-semibold uppercase tracking-[0.22em] sm:text-base">{item}</span>
            <span className="h-2 w-2 rotate-45 bg-indigo-400" />
          </div>
        ))}
      </div>
    </section>
  )
}
