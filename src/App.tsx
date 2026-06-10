import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { resources } from './registry'

const STATUS_LABEL: Record<string, string> = {
  wip: 'WIP',
  review: 'Review',
  done: 'Done',
}

function useHashRoute() {
  const [id, setId] = useState<string>(() => window.location.hash.slice(1))
  useEffect(() => {
    const onHash = () => setId(window.location.hash.slice(1))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const go = (next: string) => {
    window.location.hash = next
  }
  return [id, go] as const
}

export function App() {
  const [id, go] = useHashRoute()
  const [light, setLight] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', light ? 'light' : 'dark')
  }, [light])

  const active = resources.find((r) => r.id === id)

  return (
    <div className="flex h-full w-full flex-col">
      <TopBar
        light={light}
        onToggleLight={() => setLight((v) => !v)}
        crumb={active?.meta.title ?? active?.folder}
        onHome={() => go('')}
      />
      <div className="min-h-0 flex-1 overflow-auto">
        {active ? <Detail key={active.id} resource={active} /> : <Home onOpen={go} />}
      </div>
    </div>
  )
}

function TopBar({
  light,
  onToggleLight,
  crumb,
  onHome,
}: {
  light: boolean
  onToggleLight: () => void
  crumb?: string
  onHome: () => void
}) {
  return (
    <header className="flex shrink-0 items-center justify-between border-ff-border-subtle border-b px-6 py-3.5">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={onHome}
          className="font-semibold text-ff-text-primary tracking-tight transition-colors hover:text-ff-accent-orange"
        >
          Resource Generator
        </button>
        {crumb && (
          <>
            <span className="text-ff-text-tertiary">/</span>
            <span className="text-ff-text-secondary">{crumb}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="w-8 text-right text-ff-text-tertiary text-xs">{light ? 'Light' : 'Dark'}</span>
        <button
          type="button"
          role="switch"
          aria-checked={light}
          onClick={onToggleLight}
          className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-ff-border-subtle bg-ff-bg-ghost transition-colors"
        >
          <span
            className={`flex size-5 items-center justify-center rounded-full bg-ff-bg-surface shadow-sm transition-transform ${
              light ? 'translate-x-[22px]' : 'translate-x-0.5'
            }`}
          >
            {light ? (
              <Sun className="size-3 text-ff-accent-orange" strokeWidth={2} />
            ) : (
              <Moon className="size-3 text-ff-text-secondary" strokeWidth={2} />
            )}
          </span>
        </button>
      </div>
    </header>
  )
}

// ── Home · retícula de proyectos ──────────────────────────────────────────
function Home({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {resources.length === 0 ? (
        <p className="text-ff-text-tertiary text-sm">
          No hay proyectos todavía. Crea{' '}
          <code className="text-ff-text-secondary">resources/&lt;nombre&gt;/preview.tsx</code>.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <ProjectCard key={r.id} resource={r} onOpen={() => onOpen(r.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({
  resource,
  onOpen,
}: {
  resource: (typeof resources)[number]
  onOpen: () => void
}) {
  const { meta, folder, Component } = resource
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col overflow-hidden rounded-xl border border-ff-border-subtle bg-ff-bg-surface text-left transition-all hover:border-ff-border-default hover:bg-ff-bg-elevated"
    >
      {/* Thumbnail — render real del recurso ocupando todo el ancho */}
      <div className="relative h-48 overflow-hidden border-ff-border-subtle border-b bg-ff-bg-base">
        <div
          className="pointer-events-none absolute top-0 left-0 origin-top-left"
          style={{ width: '300%', transform: 'scale(0.3333)' }}
        >
          <Component />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ff-bg-surface/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold text-ff-text-primary text-sm tracking-tight">
            {meta.title ?? folder}
          </h2>
          {meta.status && (
            <span className="shrink-0 rounded-full bg-ff-bg-ghost px-2 py-0.5 text-[10px] text-ff-text-tertiary">
              {STATUS_LABEL[meta.status]}
            </span>
          )}
        </div>
        {meta.description && (
          <p className="line-clamp-2 text-ff-text-secondary text-xs leading-relaxed">
            {meta.description}
          </p>
        )}
        {meta.group && (
          <span className="mt-1 font-medium text-ff-text-tertiary text-[11px] uppercase tracking-wider">
            {meta.group}
          </span>
        )}
      </div>
    </button>
  )
}

// ── Detalle · trabajamos dentro del proyecto ──────────────────────────────
function Detail({ resource }: { resource: (typeof resources)[number] }) {
  const surface = resource.meta.surface ?? 'base'
  return (
    <>
      <div className="border-ff-border-subtle border-b px-8 py-5">
        <h1 className="font-semibold text-ff-text-primary text-lg tracking-tight">
          {resource.meta.title ?? resource.folder}
        </h1>
        {resource.meta.description && (
          <p className="mt-1 max-w-2xl text-ff-text-secondary text-sm leading-relaxed">
            {resource.meta.description}
          </p>
        )}
        <p className="mt-1 font-mono text-ff-text-tertiary text-xs">
          resources/{resource.folder}/preview.tsx
        </p>
      </div>
      <div className="p-8">
        <Stage surface={surface}>
          <resource.Component />
        </Stage>
      </div>
    </>
  )
}

function Stage({ surface, children }: { surface: string; children: React.ReactNode }) {
  if (surface === 'none') return <>{children}</>
  if (surface === 'card') {
    return (
      <div className="mx-auto max-w-4xl rounded-xl border border-ff-border-subtle bg-ff-bg-surface p-8 shadow-lg">
        {children}
      </div>
    )
  }
  return <div className="mx-auto max-w-5xl">{children}</div>
}
