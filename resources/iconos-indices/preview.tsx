import {
  Activity,
  Atom,
  Boxes,
  Check,
  ChevronDown,
  Container,
  Download,
  Factory,
  Fuel,
  type LucideIcon,
  Search,
  Ship,
  Sun,
  Wind,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { downloadIconsZip, svgString } from '~/lib/iconExport'
import type { ResourceMeta } from '~/registry'

export const meta: ResourceMeta = {
  title: 'Iconos Índices',
  description:
    'Sistema híbrido: el icono se deriva del valor. País→bandera, concepto→glifo (lucide), letras+color donde el tema se repite.',
  group: 'Iconos',
  status: 'review',
  surface: 'none',
}

// ═════════════════════════════════════════════════════════════════════════
// Datos
// ═════════════════════════════════════════════════════════════════════════
type FlagCode = 'de' | 'uk' | 'fr' | 'es' | 'it' | 'jp' | 'eu'

type IconSpec =
  | { kind: 'mono'; mono: string; color: string }
  | { kind: 'flag'; flag: FlagCode }
  | { kind: 'glyph'; Icon: LucideIcon; color: string }

interface IndexItem {
  ticker: string
  code: string
  name: string
  group: string
  icon: IconSpec
}

const INDICES: IndexItem[] = [
  { ticker: 'SPX', code: 'SPX', name: 'S&P 500', group: 'Renta variable', icon: { kind: 'mono', mono: 'SPX', color: '#d8453d' } },
  { ticker: 'NQ', code: 'US100', name: 'Nasdaq 100', group: 'Renta variable', icon: { kind: 'mono', mono: 'NQ', color: '#0a9cd8' } },
  { ticker: 'DJI', code: 'INDU', name: 'Dow Jones', group: 'Renta variable', icon: { kind: 'mono', mono: 'DJI', color: '#1f4ea3' } },
  { ticker: 'EU50', code: 'SX5E', name: 'Euro Stoxx 50', group: 'Renta variable', icon: { kind: 'flag', flag: 'eu' } },
  { ticker: 'DAX', code: 'DAX', name: 'DAX', group: 'Renta variable', icon: { kind: 'flag', flag: 'de' } },
  { ticker: 'GB100', code: 'UKX', name: 'FTSE 100', group: 'Renta variable', icon: { kind: 'flag', flag: 'uk' } },
  { ticker: 'FR40', code: 'CAC', name: 'CAC 40', group: 'Renta variable', icon: { kind: 'flag', flag: 'fr' } },
  { ticker: 'ES35', code: 'IBEX', name: 'IBEX 35', group: 'Renta variable', icon: { kind: 'flag', flag: 'es' } },
  { ticker: 'IT40', code: 'FTSEMIB', name: 'FTSE MIB', group: 'Renta variable', icon: { kind: 'flag', flag: 'it' } },
  { ticker: 'JP225', code: 'NKY', name: 'Nikkei 225', group: 'Renta variable', icon: { kind: 'flag', flag: 'jp' } },
  { ticker: 'CRB', code: 'CRB', name: 'CRB Index', group: 'Materias primas', icon: { kind: 'glyph', Icon: Boxes, color: '#c0883e' } },
  { ticker: 'GSCI', code: 'GSCI', name: 'GSCI', group: 'Materias primas', icon: { kind: 'glyph', Icon: Fuel, color: '#b07a34' } },
  { ticker: 'SSECOM', code: 'SSECC', name: 'SSECOM', group: 'Materias primas', icon: { kind: 'glyph', Icon: Factory, color: '#a06d2c' } },
  { ticker: 'WCI', code: 'WCI', name: 'World Container Index', group: 'Transporte', icon: { kind: 'glyph', Icon: Ship, color: '#2f9c8e' } },
  { ticker: 'SCFI', code: 'SCFI', name: 'Shanghai Freight Index', group: 'Transporte', icon: { kind: 'glyph', Icon: Container, color: '#2c8aa0' } },
  { ticker: 'NUCLEAR', code: 'NUCLEAR', name: 'Nuclear', group: 'Energía', icon: { kind: 'glyph', Icon: Atom, color: '#4e9e54' } },
  { ticker: 'SOLAR', code: 'SOLAR', name: 'Solar', group: 'Energía', icon: { kind: 'glyph', Icon: Sun, color: '#e0a13a' } },
  { ticker: 'WIND', code: 'WIND', name: 'Eólica', group: 'Energía', icon: { kind: 'glyph', Icon: Wind, color: '#4aa3c9' } },
]

const GROUP_ORDER = ['Renta variable', 'Materias primas', 'Transporte', 'Energía']

// ═════════════════════════════════════════════════════════════════════════
// Iconos chrome (lucide-react · tamaños del SDK: w-3 / w-3.5)
// ═════════════════════════════════════════════════════════════════════════
const IconChevron = () => <ChevronDown className="w-3 h-3 text-text-muted shrink-0" strokeWidth={2.5} />
const IconSearch = () => <Search className="w-3.5 h-3.5 text-text-muted shrink-0" strokeWidth={2} />
const IconCheck = () => <Check className="w-3 h-3 text-accent-orange ml-auto shrink-0" strokeWidth={3} />
const IconLine = () => <Activity className="w-3.5 h-3.5 text-text-primary shrink-0" strokeWidth={2} />

// ═════════════════════════════════════════════════════════════════════════
// Glifos energía (lucide) y banderas (custom; lucide no tiene banderas)
// ═════════════════════════════════════════════════════════════════════════
function GlyphIcon({ Icon, s }: { Icon: LucideIcon; s: number }) {
  return <Icon strokeWidth={2} style={{ width: s, height: s, color: '#fff' }} />
}

function FlagSvg({ code, size }: { code: FlagCode; size?: number }) {
  const box = {
    width: size ?? '100%',
    height: size ?? '100%',
    viewBox: '0 0 24 24',
    preserveAspectRatio: 'xMidYMid slice' as const,
  }
  switch (code) {
    case 'de':
      return (
        <svg {...box}>
          <rect width="24" height="8" fill="#111" />
          <rect y="8" width="24" height="8" fill="#D00" />
          <rect y="16" width="24" height="8" fill="#FFCE00" />
        </svg>
      )
    case 'fr':
      return (
        <svg {...box}>
          <rect width="8" height="24" fill="#002395" />
          <rect x="8" width="8" height="24" fill="#fff" />
          <rect x="16" width="8" height="24" fill="#ED2939" />
        </svg>
      )
    case 'it':
      return (
        <svg {...box}>
          <rect width="8" height="24" fill="#008C45" />
          <rect x="8" width="8" height="24" fill="#F4F5F0" />
          <rect x="16" width="8" height="24" fill="#CD212A" />
        </svg>
      )
    case 'es':
      return (
        <svg {...box}>
          <rect width="24" height="24" fill="#AA151B" />
          <rect y="6" width="24" height="12" fill="#F1BF00" />
        </svg>
      )
    case 'jp':
      return (
        <svg {...box}>
          <rect width="24" height="24" fill="#fff" />
          <circle cx="12" cy="12" r="6" fill="#BC002D" />
          {/* outline sutil — define el círculo blanco tanto en dark como en light */}
          <circle cx="12" cy="12" r="11.4" fill="none" stroke="rgba(128,128,128,0.4)" strokeWidth="0.9" />
        </svg>
      )
    case 'uk':
      return (
        <svg {...box}>
          <rect width="24" height="24" fill="#012169" />
          <path d="M0 0 24 24M24 0 0 24" stroke="#fff" strokeWidth="5" />
          <path d="M0 0 24 24M24 0 0 24" stroke="#C8102E" strokeWidth="2" />
          <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="7" />
          <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="3.5" />
        </svg>
      )
    case 'eu':
      return (
        <svg {...box}>
          <rect width="24" height="24" fill="#003399" />
          {Array.from({ length: 12 }).map((_, k) => {
            const a = (k * Math.PI) / 6
            return <circle key={k} cx={12 + 7 * Math.sin(a)} cy={12 - 7 * Math.cos(a)} r="1.05" fill="#FFCC00" />
          })}
        </svg>
      )
  }
}

// ═════════════════════════════════════════════════════════════════════════
// Badge — ocupa el lugar del <AssetLogo> (real: 16px trigger · 20px opción)
// ═════════════════════════════════════════════════════════════════════════
function MonoText({ text, size }: { text: string; size: number }) {
  const fontSize = size * (text.length >= 3 ? 0.33 : text.length === 2 ? 0.4 : 0.46)
  return (
    <span className="font-bold text-white leading-none" style={{ fontSize, letterSpacing: '-0.02em' }}>
      {text}
    </span>
  )
}

function IndexBadge({ item, size = 20 }: { item: IndexItem; size?: number }) {
  const spec = item.icon
  if (spec.kind === 'flag') {
    return (
      <span
        className="relative inline-flex shrink-0 overflow-hidden rounded-full"
        style={{ width: size, height: size }}
      >
        <FlagSvg code={spec.flag} />
      </span>
    )
  }
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: spec.color }}
    >
      {spec.kind === 'glyph' ? <GlyphIcon Icon={spec.Icon} s={size * 0.58} /> : <MonoText text={spec.mono} size={size} />}
    </span>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Pill (trigger) — h-9 · text-[13px] (SDK: h-10 text-[13px])
// ═════════════════════════════════════════════════════════════════════════
function Pill({ children, maxWidth = 220 }: { children: React.ReactNode; maxWidth?: number }) {
  return (
    <button
      className="h-9 flex items-center gap-2 px-3.5 bg-surface-subtle-2 rounded-full text-[13px] text-text-primary font-medium cursor-pointer hover:bg-surface-hover transition-colors overflow-hidden"
      style={{ maxWidth, minWidth: 80 }}
    >
      {children}
    </button>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Fondo de chart
// ═════════════════════════════════════════════════════════════════════════
function ChartBackdrop() {
  const bars = [0, 0, 0, 180, 120, 210, 100, 150, 75, 165, 115, 195]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-text-primary">
      {[
        { top: '48%', label: '6K' },
        { top: '72%', label: '5K' },
      ].map((g) => (
        <div key={g.label} className="absolute right-0 left-0" style={{ top: g.top }}>
          <div className="h-px w-full bg-current opacity-[0.06]" />
          <span className="absolute left-3 top-[-8px] font-medium text-[11px] text-current opacity-20">{g.label}</span>
        </div>
      ))}
      <div className="absolute inset-x-5 bottom-0 flex items-end justify-between">
        {bars.map((h, i) => (
          <div key={i} className="w-8 rounded-t bg-current opacity-[0.03]" style={{ height: h }} />
        ))}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Export — SVG vectorial idéntico al badge (mismo color, glifo, stroke, forma)
// ═════════════════════════════════════════════════════════════════════════
const EXPORT_SIZE = 48

function ExportBadgeSvg({ item, size }: { item: IndexItem; size: number }) {
  const r = size / 2
  const spec = item.icon

  if (spec.kind === 'flag') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <clipPath id="eclip">
            <circle cx={r} cy={r} r={r} />
          </clipPath>
        </defs>
        <g clipPath="url(#eclip)">
          <FlagSvg code={spec.flag} size={size} />
        </g>
      </svg>
    )
  }

  const g = size * 0.58
  const Glyph = spec.kind === 'glyph' ? spec.Icon : null
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={r} cy={r} r={r} fill={spec.color} />
      {spec.kind === 'glyph' && Glyph ? (
        <Glyph x={(size - g) / 2} y={(size - g) / 2} width={g} height={g} color="#fff" strokeWidth={2} />
      ) : spec.kind === 'mono' ? (
        <text
          x={r}
          y={r}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontFamily="Inter, Arial, sans-serif"
          fontWeight={700}
          fontSize={size * (spec.mono.length >= 3 ? 0.33 : spec.mono.length === 2 ? 0.4 : 0.46)}
          letterSpacing="-0.02em"
        >
          {spec.mono}
        </text>
      ) : null}
    </svg>
  )
}

const exportIcons = () =>
  INDICES.map((item) => ({ name: item.ticker, svg: svgString(<ExportBadgeSvg item={item} size={EXPORT_SIZE} />) }))

// ═════════════════════════════════════════════════════════════════════════
// Catálogo de iconos (retícula cuadrada)
// ═════════════════════════════════════════════════════════════════════════
function IconGrid() {
  const [busy, setBusy] = useState(false)
  const handleDownload = async () => {
    setBusy(true)
    try {
      await downloadIconsZip({ zipName: 'flickflow-iconos-indices', icons: exportIcons() })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flickflow-sdk-root rounded-xl border border-white/[0.06] bg-navbar-bg p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h3 className="text-[14px] font-semibold text-text-primary">Catálogo de iconos</h3>
          <span className="text-[11px] text-text-muted">{INDICES.length} índices</span>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-surface-subtle-2 px-2.5 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:bg-surface-subtle-2 hover:text-text-primary disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          {busy ? 'Generando…' : 'Descargar'}
        </button>
      </div>
      <div className="space-y-5">
        {GROUP_ORDER.map((g) => {
          const items = INDICES.filter((i) => i.group === g)
          return (
            <div key={g}>
              <div className="mb-2.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">{g}</div>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6">
                {items.map((item) => (
                  <div
                    key={item.ticker}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl bg-surface-subtle-1 p-3 text-center"
                  >
                    <IndexBadge item={item} size={36} />
                    <div className="text-[12px] font-semibold text-text-primary leading-none">{item.ticker}</div>
                    <div className="w-full truncate text-[10px] text-text-muted leading-none">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
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
      {/* Chart runtime — tokens del SDK · sigue el toggle dark/light */}
      <div className="flickflow-sdk-root relative min-h-[540px] w-full overflow-hidden rounded-xl bg-navbar-bg">
        <ChartBackdrop />

        {/* Título + last values (tamaños reales: text-sm, p-2, rounded-md) */}
        <div className="relative flex items-center gap-3 px-6 pt-6">
          <h2 className="text-[16px] font-semibold tracking-tight text-text-primary">Tasa de Desempleo</h2>
          <div className="ml-1 flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 rounded-md bg-surface-subtle-2 p-2 text-[13px]">
              <span className="text-text-muted">Valor:</span>
              <span className="font-semibold text-text-primary">4.30%</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-md bg-surface-subtle-2 p-2 text-[13px]">
              <span className="text-text-muted">Cambio %:</span>
              <span className="font-semibold text-text-primary">-0.10%</span>
            </div>
          </div>
        </div>

        {/* Pills + dropdown anclado al pill de asset */}
        <div className="relative z-10 mt-5 flex items-start gap-2.5 px-6">
          <Pill maxWidth={120}>
            <IconLine />
            <span className="truncate flex-1 text-left">Index</span>
            <IconChevron />
          </Pill>

          <div className="relative">
            <Pill maxWidth={220}>
              <IndexBadge item={active} size={16} />
              <span className="truncate flex-1 text-left">
                {active.ticker} — {active.name}
              </span>
              <IconChevron />
            </Pill>

            {/* Dropdown — chrome calcado del runtime, cuelga del pill */}
            <div className="absolute top-full left-0 mt-1.5 w-[300px] rounded-[18px] border border-white/[0.06] bg-surface-2 shadow-[0_16px_44px_-16px_rgba(0,0,0,0.4),0_4px_12px_-8px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              {/* search — icono en slot de 22px para alinear con la columna de badges */}
              <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                <span className="flex w-[22px] justify-center">
                  <IconSearch />
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>

              {/* lista */}
              <div className="max-h-[300px] overflow-y-auto px-1.5 pb-1.5">
                {filtered.length === 0 ? (
                  <div className="px-2.5 py-2 text-[12px] text-text-muted text-center">Sin resultados</div>
                ) : (
                  GROUP_ORDER.filter((g) => byGroup[g]?.length).map((g) => (
                    <div key={g}>
                      <div className="px-2.5 pt-2.5 pb-1 text-[10px] font-medium uppercase tracking-wide text-text-muted">{g}</div>
                      {byGroup[g].map((item) => {
                        const isSelected = item.ticker === selected
                        return (
                          <button
                            key={item.ticker}
                            onClick={() => setSelected(item.ticker)}
                            className={[
                              'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
                              isSelected ? 'bg-surface-subtle-2 text-text-primary' : 'text-text-primary hover:bg-surface-subtle-1',
                            ].join(' ')}
                            style={
                              isSelected
                                ? { border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }
                                : { border: '1px solid transparent' }
                            }
                          >
                            <IndexBadge item={item} size={22} />
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

      <IconGrid />
    </div>
  )
}
