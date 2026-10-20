import type { NexonNavLink } from "./types"

export interface NexonFooterContent {
  description: string
  copyright: string
  links: NexonNavLink[]
}

export function NexonFooter({ data }: { data: NexonFooterContent }) {
  const currentDate = new Date()
  const year = currentDate.getFullYear()

  return (
    <footer className="border-t border-white/10" style={{ background: "#0A0D1A" }}>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <a href="/" aria-label="Nexon Group, inicio">
            <img src="/nexon/logotipo_white.svg" alt="Nexon Group" width={120} height={40} className="h-10 w-auto" />
          </a>
          <p className="max-w-md text-sm text-slate-400">{data.description}</p>
          <nav aria-label="Navegación del pie de página">
            <ul className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
              {data.links.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a href={link.href} className="transition hover:text-white">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="h-px w-24 bg-white/10" />
          <p className="text-xs text-slate-500">{data.copyright.split("{YEAR}").join(String(year))}</p>
        </div>
      </div>
    </footer>
  )
}
