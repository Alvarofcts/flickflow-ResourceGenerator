import { useEffect, useState } from 'react'

/**
 * Lee el modo dark/light global del sandbox (data-mode en <html>, que controla
 * el toggle de la barra superior) de forma reactiva. Para recursos que pintan
 * sus colores en JS según el tema.
 */
export function useMode(): 'light' | 'dark' {
  const read = () =>
    document.documentElement.getAttribute('data-mode') === 'light' ? 'light' : 'dark'
  const [mode, setMode] = useState<'light' | 'dark'>(read)

  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() => setMode(read()))
    obs.observe(el, { attributes: true, attributeFilter: ['data-mode'] })
    return () => obs.disconnect()
  }, [])

  return mode
}
