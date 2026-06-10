import type { ComponentType } from 'react'
import * as Icons from '@/design-system/icons'
import type { ResourceMeta } from '~/registry'

export const meta: ResourceMeta = {
  title: 'Design system (referencia)',
  description:
    'Tokens, tipografía e iconos reales de la Flickflow App, importados por symlink. Tu fuente de verdad al generar recursos nuevos.',
  group: 'Referencia',
  surface: 'none',
}

const COLOR_TOKENS = [
  '--ff-bg-base',
  '--ff-bg-surface',
  '--ff-bg-elevated',
  '--ff-bg-ghost',
  '--ff-text-primary',
  '--ff-text-secondary',
  '--ff-text-tertiary',
  '--ff-border-subtle',
  '--ff-border-default',
  '--ff-brand-primary',
  '--ff-accent-orange',
  '--ff-accent-blue',
  '--ff-status-bull',
  '--ff-status-bear',
  '--ff-status-warn',
]

const iconEntries = Object.entries(Icons).filter(
  ([, v]) => typeof v === 'function' || typeof v === 'object',
) as [string, ComponentType<{ size?: number }>][]

export default function DesignSystemReference() {
  return (
    <div className="space-y-12 pb-12">
      {/* Colores */}
      <section>
        <h2 className="mb-4 font-semibold text-ff-text-primary text-sm">Color tokens</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {COLOR_TOKENS.map((token) => (
            <div
              key={token}
              className="overflow-hidden rounded-lg border border-ff-border-subtle bg-ff-bg-surface"
            >
              <div className="h-14 w-full" style={{ background: `var(${token})` }} />
              <div className="px-2.5 py-2 font-mono text-[10px] text-ff-text-tertiary">
                {token.replace('--ff-', '')}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-ff-text-tertiary text-xs leading-relaxed">
          Regla de color: naranja = solo gráficas · azul = solo calendario · UI = neutral ·
          verde/rojo = Δ.
        </p>
      </section>

      {/* Tipografía */}
      <section>
        <h2 className="mb-4 font-semibold text-ff-text-primary text-sm">Tipografía</h2>
        <div className="space-y-2">
          <p
            className="text-ff-text-primary text-2xl"
            style={{ fontFamily: 'var(--ff-primitives-type-family-brand)' }}
          >
            Safiro — brand display
          </p>
          <p className="text-ff-text-primary text-base">Inter — UI sans, cuerpo de interfaz</p>
          <p
            className="text-ff-text-secondary text-sm"
            style={{ fontFamily: 'var(--ff-primitives-type-family-mono)' }}
          >
            JetBrains Mono — datos y código
          </p>
        </div>
      </section>

      {/* Iconos */}
      <section>
        <h2 className="mb-1 font-semibold text-ff-text-primary text-sm">
          Iconos ({iconEntries.length})
        </h2>
        <p className="mb-4 text-ff-text-tertiary text-xs">
          De <code>@/design-system/icons</code>. Genera nuevos con el mismo{' '}
          <code>createIcon()</code>.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
          {iconEntries.map(([name, Icon]) => (
            <div
              key={name}
              title={name}
              className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-ff-border-subtle bg-ff-bg-surface p-2 text-ff-text-secondary transition-colors hover:bg-ff-bg-ghost hover:text-ff-text-primary"
            >
              <Icon size={20} />
              <span className="w-full truncate text-center font-mono text-[9px] text-ff-text-tertiary">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
