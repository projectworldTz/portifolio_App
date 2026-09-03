import { useState } from 'react'
import { FaArrowUpRightFromSquare, FaCheck, FaCopy, FaLock } from 'react-icons/fa6'

interface DemoCredentialsProps {
  email?: string | null
  password?: string | null
  demoUrl?: string | null
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copyValue = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-indigo-200">{label}</p>
        <p className="mt-1 truncate font-mono text-sm text-white sm:text-base">{value}</p>
      </div>
      <button
        type="button"
        onClick={copyValue}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        aria-label={`Copy demo ${label.toLowerCase()}`}
      >
        {copied ? <FaCheck className="text-emerald-300" /> : <FaCopy />}
      </button>
    </div>
  )
}

export default function DemoCredentials({ email, password, demoUrl }: DemoCredentialsProps) {
  if (!email && !password) return null

  return (
    <section className="relative mt-10 overflow-hidden rounded-3xl bg-neutral-950 p-6 text-white shadow-[0_28px_80px_-30px_rgba(79,70,229,0.6)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
      <div className="relative">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200">
          <FaLock />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Interactive demo</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Test the system yourself</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-300">
          Use this public demo account to explore the product immediately—no registration or setup needed.
        </p>

        <div className="mt-6 grid gap-3">
          {email && <CredentialRow label="Email / username" value={email} />}
          {password && <CredentialRow label="Password" value={password} />}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-400">Public test account · Please do not enter sensitive information</p>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-indigo-50"
            >
              Open live demo <FaArrowUpRightFromSquare size={12} />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
