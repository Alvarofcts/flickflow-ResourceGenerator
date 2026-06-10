import {
  Atom,
  Bean,
  Candy,
  Coffee,
  Container,
  Download,
  Droplet,
  Egg,
  Flame,
  Flower2,
  type LucideIcon,
  RotateCcw,
  Sprout,
  Wheat,
} from 'lucide-react'
import { useState } from 'react'
import { downloadIconsZip, svgString } from '~/lib/iconExport'
import { useMode } from '~/lib/useMode'
import type { ResourceMeta } from '~/registry'

export const meta: ResourceMeta = {
  title: 'Iconos Commodities',
  description:
    'Port del desplegable de commodities hecho en Figma Make. Badge = color de la materia prima + glifo Lucide en tinte claro. Fiel a la estética original, dentro del sistema.',
  group: 'Iconos',
  status: 'review',
  surface: 'none',
}

// ═════════════════════════════════════════════════════════════════════════
// Datos — tal cual el Figma Make original (icono Lucide + color + tinte)
// ═════════════════════════════════════════════════════════════════════════
interface Commodity {
  en: string
  es: string
  icon: LucideIcon
  color: string
  iconColor: string
}

const COMMODITIES: Commodity[] = [
  { en: 'Aluminum', es: 'Aluminio', icon: Container, color: '#52525B', iconColor: '#E5E7EB' },
  { en: 'Brent Crude Oil', es: 'Petróleo Brent', icon: Droplet, color: '#27272A', iconColor: '#E5E7EB' },
  { en: 'Cocoa', es: 'Cacao', icon: Egg, color: '#92400E', iconColor: '#FED7AA' },
  { en: 'Coffee', es: 'Café', icon: Coffee, color: '#A16207', iconColor: '#FDE68A' },
  { en: 'Copper', es: 'Cobre', icon: Container, color: '#B45309', iconColor: '#FCD34D' },
  { en: 'Corn', es: 'Maíz', icon: Sprout, color: '#EAB308', iconColor: '#FFFBEB' },
  { en: 'Cotton', es: 'Algodón', icon: Flower2, color: '#94A3B8', iconColor: '#F1F5F9' },
  { en: 'Gold', es: 'Oro', icon: Container, color: '#F59E0B', iconColor: '#FDE68A' },
  { en: 'Iron Ore', es: 'Mineral de Hierro', icon: Container, color: '#DC2626', iconColor: '#FCA5A5' },
  { en: 'Natural Gas', es: 'Gas Natural', icon: Flame, color: '#3B82F6', iconColor: '#DBEAFE' },
  { en: 'Silver', es: 'Plata', icon: Container, color: '#9CA3AF', iconColor: '#E5E7EB' },
  { en: 'Soybeans', es: 'Soja', icon: Bean, color: '#84CC16', iconColor: '#D9F99D' },
  { en: 'Sugar', es: 'Azúcar', icon: Candy, color: '#A3A3A3', iconColor: '#F5F5F5' },
  { en: 'Uranium', es: 'Uranio', icon: Atom, color: '#00CC00', iconColor: '#CCFFCC' },
  { en: 'Wheat', es: 'Trigo', icon: Wheat, color: '#D97706', iconColor: '#FDE68A' },
  { en: 'WTI Oil', es: 'Petróleo WTI', icon: Droplet, color: '#27272A', iconColor: '#E5E7EB' },
]

type Lang = 'es' | 'en'

// ═════════════════════════════════════════════════════════════════════════
// Badge — color sólido (0.8) + glifo en tinte claro (como el original)
// ═════════════════════════════════════════════════════════════════════════
function CommodityBadge({ item, size = 20 }: { item: Commodity; size?: number }) {
  const Icon = item.icon
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full" style={{ backgroundColor: item.color, opacity: 0.8 }} />
      <Icon
        strokeWidth={2}
        style={{ color: item.iconColor, width: size * 0.6, height: size * 0.6, position: 'relative', zIndex: 10 }}
      />
    </span>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Desplegable — reproducción fiel del Figma Make
// ═════════════════════════════════════════════════════════════════════════
function CommodityRow({
  item,
  lang,
  theme,
  selected,
  onSelect,
}: {
  item: Commodity
  lang: Lang
  theme: 'light' | 'dark'
  selected: boolean
  onSelect: () => void
}) {
  const textColor = theme === 'light' ? '#1a1a1a' : '#e4e1de'
  const hoverBg = theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex h-8 w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 transition-colors"
      style={{ backgroundColor: selected ? hoverBg : 'transparent' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBg
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = selected ? hoverBg : 'transparent'
      }}
    >
      <CommodityBadge item={item} size={20} />
      <span className="whitespace-nowrap text-[12px] font-medium tracking-[0.12px]" style={{ color: textColor }}>
        {item[lang]}
      </span>
    </button>
  )
}

function CommodityDropdown({ lang, theme }: { lang: Lang; theme: 'light' | 'dark' }) {
  const [selected, setSelected] = useState<string | null>(null)
  const mutedText = theme === 'light' ? 'rgba(26,26,26,0.4)' : 'rgba(228,225,222,0.4)'
  const resetIcon = theme === 'light' ? '#1a1a1a' : '#E4E1DE'
  const outerBg = theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const innerBg = theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'

  return (
    <div
      className="flex h-[460px] w-[260px] flex-col overflow-clip rounded-[24px] p-2 backdrop-blur-[20px]"
      style={{ backgroundColor: outerBg }}
    >
      <div className="flex min-h-px flex-1 flex-col rounded-[16px]" style={{ backgroundColor: innerBg }}>
        <div className="flex size-full flex-col gap-1.5 overflow-y-auto p-3">
          {/* "Todas" + reset */}
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="flex w-full shrink-0 items-center justify-between pb-2"
          >
            <span className="text-[12px] font-medium tracking-[0.12px]" style={{ color: mutedText }}>
              {lang === 'es' ? 'Todas' : 'All'}
            </span>
            <RotateCcw className="h-[11px] w-[11px] opacity-40" style={{ color: resetIcon }} strokeWidth={1.3} />
          </button>

          {/* lista */}
          <div className="flex flex-col gap-1.5">
            {COMMODITIES.map((c) => (
              <CommodityRow
                key={c.en}
                item={c}
                lang={lang}
                theme={theme}
                selected={selected === c.en}
                onSelect={() => setSelected(c.en)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Export — SVG vectorial idéntico al badge (color 0.8 + glifo lucide en tinte)
// ═════════════════════════════════════════════════════════════════════════
const EXPORT_SIZE = 48

function commodityIconSvg(c: Commodity): string {
  const Icon = c.icon
  const g = EXPORT_SIZE * 0.6
  const off = (EXPORT_SIZE - g) / 2
  return svgString(
    <svg xmlns="http://www.w3.org/2000/svg" width={EXPORT_SIZE} height={EXPORT_SIZE} viewBox={`0 0 ${EXPORT_SIZE} ${EXPORT_SIZE}`}>
      <circle cx={EXPORT_SIZE / 2} cy={EXPORT_SIZE / 2} r={EXPORT_SIZE / 2} fill={c.color} fillOpacity={0.8} />
      <Icon x={off} y={off} width={g} height={g} color={c.iconColor} strokeWidth={2} />
    </svg>,
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Catálogo de iconos (retícula cuadrada, como el de Índices)
// ═════════════════════════════════════════════════════════════════════════
function IconGrid({ lang }: { lang: Lang }) {
  const [busy, setBusy] = useState(false)
  const handleDownload = async () => {
    setBusy(true)
    try {
      await downloadIconsZip({
        zipName: 'flickflow-commodities',
        icons: COMMODITIES.map((c) => ({ name: c.en, svg: commodityIconSvg(c) })),
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flickflow-sdk-root rounded-xl border border-white/[0.06] bg-navbar-bg p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h3 className="text-[15px] font-semibold text-text-primary">Catálogo de iconos</h3>
          <span className="text-[12px] text-text-muted">{COMMODITIES.length} materias primas</span>
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
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {COMMODITIES.map((c) => (
          <div
            key={c.en}
            className="flex aspect-square flex-col items-center justify-center gap-2.5 rounded-xl bg-surface-subtle-1 p-3 text-center"
          >
            <CommodityBadge item={c} size={44} />
            <div className="w-full truncate text-[12px] font-medium text-text-primary leading-tight">{c[lang]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════
// Preview
// ═════════════════════════════════════════════════════════════════════════
export default function Commodities() {
  const theme = useMode()
  const [lang, setLang] = useState<Lang>('es')

  return (
    <div className="space-y-4">
      {/* Control de sandbox */}
      <div className="flex items-center gap-2 text-[11px]">
        <span className="font-mono uppercase tracking-wider text-ar-muted">Idioma</span>
        {(['es', 'en'] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={[
              'rounded-md border px-2.5 py-1 uppercase transition-colors',
              lang === l ? 'border-ar-line-strong bg-ar-ink text-ar-paper' : 'border-ar-line text-ar-muted hover:text-ar-ink',
            ].join(' ')}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Desplegable en contexto (fondo que sigue el modo) */}
      <div className="flickflow-sdk-root flex min-h-[540px] w-full items-center justify-center rounded-xl bg-navbar-bg p-8">
        <CommodityDropdown lang={lang} theme={theme} />
      </div>

      <IconGrid lang={lang} />
    </div>
  )
}
