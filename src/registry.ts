import type { ComponentType } from 'react'

/**
 * Optional metadata a resource can export to describe itself in the gallery.
 * Export it as `export const meta: ResourceMeta = { ... }` from preview.tsx.
 */
export interface ResourceMeta {
  /** Display name. Falls back to the folder name. */
  title?: string
  /** One-line description shown under the title. */
  description?: string
  /** Group/section in the sidebar (e.g. "Iconos", "Componentes"). */
  group?: string
  /** Surface the preview sits on: page bg (default) or a raised card. */
  surface?: 'base' | 'card' | 'none'
  /** Status tag shown next to the title. */
  status?: 'wip' | 'review' | 'done'
}

export interface Resource {
  id: string
  folder: string
  meta: ResourceMeta
  Component: ComponentType
}

// Every resources/<name>/preview.tsx becomes a gallery entry automatically.
const modules = import.meta.glob<{
  default: ComponentType
  meta?: ResourceMeta
}>('../resources/**/preview.tsx', { eager: true })

export const resources: Resource[] = Object.entries(modules)
  .map(([path, mod]) => {
    // ../resources/<folder>/preview.tsx  →  <folder>
    const folder = path.replace('../resources/', '').replace('/preview.tsx', '')
    const meta = mod.meta ?? {}
    return {
      id: folder,
      folder,
      meta,
      Component: mod.default,
    }
  })
  .filter((r) => typeof r.Component === 'function')
  .sort((a, b) => a.folder.localeCompare(b.folder))

export const groups = (): Record<string, Resource[]> => {
  const out: Record<string, Resource[]> = {}
  for (const r of resources) {
    const g = r.meta.group ?? 'Sin agrupar'
    ;(out[g] ??= []).push(r)
  }
  return out
}
