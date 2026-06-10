import { useMemo, useState } from 'react'
import type { ResourceMeta } from '~/registry'

export const meta: ResourceMeta = {
  title: 'Iconos Índices',
  description:
    'Iconos de índice dentro del desplegable real del chart (tokens del SDK, chrome calcado del runtime). Conmuta entre el badge real (coral) y propuestas de diferenciación.',
  group: 'Iconos',
  status: 'review',
  surface: 'none',
}

// ═════════════════════════════════════════════════════════════════════════
// Datos
// ═════════════════════════════════════════════════════════════════════════
type Glyph = 'nuclear' | 'solar' | 'wind'

interface IndexItem {
  ticker: string
  code: string
  name: string
  group: string
  /** Monograma para los estilos por color (más legible que recortar el ticker). */
  mono: string
  glyph?: Glyph
  /** Color de marca para el estilo "región". */
  color: string
}

const INDICES: IndexItem[] = [
  { ticker: 'SPX', code: 'SPX', name: 'S&P 500', group: 'Renta variable', mono: 'SPX', color: '#3d6fe0' },
  { ticker: 'NQ', code: 'US100', name: 'Nasdaq 100', group: 'Renta variable', mono: 'NQ', color: '#6366f1' },
  { ticker: 'DJI', code: 'INDU', name: 'Dow Jones', group: 'Renta variable', mono: 'DJI', color: '#3f73b5' },
  { ticker: 'EU50', code: 'SX5E', name: 'Euro Stoxx 50', group: 'Renta variable', mono: 'EU', color: '#2f86c9' },
  { ticker: 'DAX', code: 'DAX', name: 'DAX', group: 'Renta variable', mono: 'DAX', color: '#c4554d' },
  { ticker: 'GB100', code: 'UKX', name: 'FTSE 100', group: 'Renta variable', mono: 'UK', color: '#2d5bb8' },
  { ticker: 'FR40', code: 'CAC', name: 'CAC 40', group: 'Renta variable', mono: 'FR', color: '#4670d8' },
  { ticker: 'ES35', code: 'IBEX', name: 'IBEX 35', group: 'Renta variable', mono: 'ES', color: '#d98a3a' },
  { ticker: 'IT40', code: 'FTSEMIB', name: 'FTSE MIB', group: 'Renta variable', mono: 'IT', color: '#3a9e6f' },
  { ticker: 'JP225', code: 'NKY', name: 'Nikkei 225', group: 'Renta variable', mono: 'JP', color: '#c14a44' },
  { ticker: 'CRB', code: 'CRB', name: 'CRB Index', group: 'Materias primas', mono: 'CRB', color: '#c08a3e' },
  { ticker: 'GSCI', code: 'GSCI', name: 'GSCI', group: 'Materias primas', mono: 'GS', color: '#b87333' },
  { ticker: 'SSECOM', code: 'SSECC', name: 'SSECOM', group: 'Materias primas', mono: 'SSE', color: '#a9762e' },
  { ticker: 'WCI', code: 'WCI', name: 'World Container Index', group: 'Transporte', mono: 'WCI', color: '#2f9c8e' },
  { ticker: 'SCFI', code: 'SCFI', name: 'Shanghai Freight Index', group: 'Transporte', mono: 'SCF', color: '#2c8aa0' },
  { ticker: 'NUCLEAR', code: 'NUCLEAR', name: 'Nuclear', group: 'Energía', mono: 'NUC', glyph: 'nuclear', color: '#5aa84f' },
  { ticker: 'SOLAR', code: 'SOLAR', name: 'Solar', group: 'Energía', mono: 'SOL', glyph: 'solar', color: '#e0a13a' },
  { ticker: 'WIND', code: 'WIND', name: 'Eólica', group: 'Energía', mono: 'WND', glyph: 'wind', color: '#4aa3c9' },
]

const GROUP_ORDER = ['Renta variable', 'Materias primas', 'Transporte', 'Energía']

type BadgeStyle = 'real' | 'region' | 'glyph'

// ═════════════════════════════════════════════════════════════════════════
// Iconos chrome del SDK
// ═════════════════════════════════════════════════════════════════════════
const IconChevron = () => (
  <svg className="w-3.5 h-3.5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)
const IconSearch = () => (
  <svg className="w-[18px] h-[18px] text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const IconCheck = () => (
  <svg className="w-4 h-4 text-accent-orange ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)
const IconLine = () => (
  <svg className="w-4 h-4 text-text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15l4.5-5 3.5 3L18 7l3 3" />
  </svg>
)

// ═════════════════════════════════════════════════════════════════════════
// Glifos temáticos (energía)
// ═════════════════════════════════════════════════════════════════════════
function GlyphSvg({ glyph, s }: { glyph: Glyph; s: number }) {
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none' } as const
  if (glyph === 'nuclear')
    return (
      <svg {...common} aria-hidden>
        <circle cx="12" cy="12" r="2" fill="#fff" />
        <path d="M12 10.2 9.6 6a6 6 0 0 1 4.8 0L12 10.2ZM13.5 13l4.3.9a6 6 0 0 1-2.4 4.1L13.5 13ZM10.5 13l-1.9 5a6 6 0 0 1-2.4-4.1l4.3-.9Z" fill="#fff" />
      </svg>
    )
  if (glyph === 'solar')
    return (
      <svg {...common} aria-hidden>
        <circle cx="12" cy="12" r="3.4" fill="#fff" />
        <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6" />
        </g>
      </svg>
    )
  return (
    <svg {...common} aria-hidden>
      <g stroke="#fff" strokeWidth="1.7" strokeLinecap="round" fill="none">
        <path d="M4 9h10a2.4 2.4 0 1 0-2.4-2.4" />
        <path d="M4 14h14a2.6 2.6 0 1 1-2.6 2.6" />
      </g>
    </svg>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// El badge — ocupa el lugar del <AssetLogo>. 3 estilos a comparar.
// ═════════════════════════════════════════════════════════════════════════
function IndexBadge({ item, size = 26, style }: { item: IndexItem; size?: number; style: BadgeStyle }) {
  // "real": coral sólido + 3 primeras letras del ticker (como producción)
  const realMono = item.ticker.slice(0, 3).toUpperCase()
  const mono = style === 'real' ? realMono : item.mono
  const bg = style === 'real' ? 'var(--color-accent-orange-light, #f4763f)' : item.color
  const useGlyph = style === 'glyph' && item.glyph
  const len = mono.length
  const fontSize = size * (len >= 3 ? 0.3 : len === 2 ? 0.38 : 0.42)

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: bg,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.2)',
      }}
    >
      {useGlyph ? (
        <GlyphSvg glyph={item.glyph!} s={size * 0.62} />
      ) : (
        <span className="font-bold text-white leading-none" style={{ fontSize, letterSpacing: '-0.02em' }}>
          {mono}
        </span>
      )}
    </span>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Pill (trigger) — bg-surface-subtle-2 rounded-full (token real del SDK)
// ═════════════════════════════════════════════════════════════════════════
function Pill({ children, maxWidth = 260 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <button
      className="h-11 flex items-center gap-2.5 px-4 bg-surface-subtle-2 rounded-full text-[15px] text-text-primary font-medium cursor-pointer hover:bg-surface-hover transition-colors overflow-hidden"
      style={{ maxWidth, minWidth: 90 }}
    >
      {children}
    </button>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Fondo de chart
// ═════════════════════════════════════════════════════════════════════════
function ChartBackdrop() {
  const bars = [0, 0, 0, 220, 150, 260, 120, 180, 90, 200, 140, 240]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-text-primary">
      {[
        { top: '46%', label: '6K' },
        { top: '70%', label: '5K' },
      ].map((g) => (
        <div key={g.label} className="absolute right-0 left-0" style={{ top: g.top }}>
          <div className="h-px w-full bg-current opacity-[0.06]" />
          <span className="absolute left-4 top-[-10px] font-medium text-[14px] text-current opacity-20">
            {g.label}
          </span>
        </div>
      ))}
      <div className="absolute inset-x-6 bottom-0 flex items-end justify-between">
        {bars.map((h, i) => (
          <div key={i} className="w-10 rounded-t bg-current opacity-[0.03]" style={{ height: h }} />
        ))}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Preview
// ═════════════════════════════════════════════════════════════════════════
export default function IconosIndices() {
  const [selected, setSelected] = useState('SPX')
  const [search, setSearch] = useState('')
  const [style, setStyle] = useState<BadgeStyle>('real')

  const active = INDICES.find((i) => i.ticker === selected) ?? INDICES[0]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return INDICES
    return INDICES.filter((i) => [i.ticker, i.code, i.name].some((f) => f.toLowerCase().includes(q)))
  }, [search])

  const byGroup = useMemo(() => {
    const m: Record<string, IndexItem[]> = {}
    for (const i of filtered) (m[i.group] ??= []).push(i)
    return m
  }, [filtered])

  return (
    <div className="space-y-4">
      {/* Control de sandbox (no es parte del diseño) */}
      <div className="flex items-center gap-2 text-[11px]">
        <span className="font-mono uppercase tracking-wider text-ar-muted">Estilo de icono</span>
        {(['real', 'region', 'glyph'] as BadgeStyle[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStyle(s)}
            className={[
              'rounded-md border px-2.5 py-1 transition-colors',
              style === s
                ? 'border-ar-line-strong bg-ar-ink text-ar-paper'
                : 'border-ar-line text-ar-muted hover:text-ar-ink',
            ].join(' ')}
          >
            {s === 'real' ? 'Real (coral)' : s === 'region' ? 'Color por región' : 'Glifos energía'}
          </button>
        ))}
      </div>

      {/* Chart runtime — tokens del SDK · sigue el toggle dark/light del sandbox */}
      <div className="flickflow-sdk-root relative min-h-[640px] w-full overflow-hidden rounded-xl bg-navbar-bg">
        <ChartBackdrop />

        {/* Título + last values (como el screenshot) */}
        <div className="relative flex items-center gap-3 px-7 pt-7">
          <h2 className="text-[26px] font-semibold tracking-tight text-text-primary">Tasa de Desempleo</h2>
          <div className="ml-2 flex items-center gap-2.5">
            <div className="h-10 flex items-center gap-2 rounded-xl bg-surface-subtle-1 px-3.5 text-[14px]">
              <span className="text-text-muted">Valor:</span>
              <span className="font-semibold text-text-primary">4.30%</span>
            </div>
            <div className="h-10 flex items-center gap-2 rounded-xl bg-surface-subtle-1 px-3.5 text-[14px]">
              <span className="text-text-muted">Cambio %:</span>
              <span className="font-semibold text-text-primary">-0.10%</span>
            </div>
          </div>
        </div>

        {/* Pills */}
        <div className="relative mt-6 flex items-center gap-3 px-7">
          <Pill maxWidth={150}>
            <IconLine />
            <span className="truncate flex-1 text-left">Index</span>
            <IconChevron />
          </Pill>
          <Pill maxWidth={260}>
            <IndexBadge item={active} size={22} style={style} />
            <span className="truncate flex-1 text-left">
              {active.ticker} — {active.name}
            </span>
            <IconChevron />
          </Pill>
        </div>

        {/* Dropdown — chrome calcado del runtime */}
        <div className="relative mt-2 ml-[182px] w-[392px]">
          <div className="rounded-[22px] border border-white/[0.06] bg-surface-2 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            {/* search (sin borde inferior) */}
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-2.5">
              <IconSearch />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="flex-1 bg-transparent text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>

            {/* lista */}
            <div className="max-h-[440px] overflow-y-auto px-2 pb-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-[13px] text-text-muted text-center">Sin resultados</div>
              ) : (
                GROUP_ORDER.filter((g) => byGroup[g]?.length).map((g) => (
                  <div key={g}>
                    <div className="px-3 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                      {g}
                    </div>
                    {byGroup[g].map((item) => {
                      const isSelected = item.ticker === selected
                      return (
                        <button
                          key={item.ticker}
                          onClick={() => setSelected(item.ticker)}
                          className={[
                            'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors',
                            isSelected
                              ? 'bg-surface-subtle-2 text-text-primary'
                              : 'text-text-primary hover:bg-surface-subtle-1',
                          ].join(' ')}
                          style={
                            isSelected
                              ? {
                                  border: '1px solid rgba(255,255,255,0.07)',
                                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                                }
                              : { border: '1px solid transparent' }
                          }
                        >
                          <IndexBadge item={item} size={26} style={style} />
                          <span className="truncate">
                            {item.ticker} — {item.name}
                          </span>
                          {isSelected && <IconCheck />}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
