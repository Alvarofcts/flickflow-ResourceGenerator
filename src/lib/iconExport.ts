import JSZip from 'jszip'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/** Serializa un elemento React (SVG) a string, garantizando el xmlns. */
export function svgString(el: ReactElement): string {
  const s = renderToStaticMarkup(el)
  return s.includes('xmlns') ? s : s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
}

/** Rasteriza un SVG (string) a PNG del mismo aspecto, a `px` de lado. */
export async function svgToPng(svg: string, px: number): Promise<Blob> {
  // Asegura que las fuentes (Inter) estén listas para que el texto rasterice igual.
  if (document.fonts?.ready) await document.fonts.ready
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  const img = new Image()
  img.width = px
  img.height = px
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = reject
    img.src = url
  })
  const canvas = document.createElement('canvas')
  canvas.width = px
  canvas.height = px
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2D context')
  ctx.clearRect(0, 0, px, px)
  ctx.drawImage(img, 0, 0, px, px)
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
  })
}

export interface ExportIcon {
  name: string
  svg: string
}

/** Genera y descarga un zip con carpetas SVG/ y PNG/ (PNG a `pngSize` px). */
export async function downloadIconsZip(opts: {
  zipName: string
  icons: ExportIcon[]
  pngSize?: number
}) {
  const pngSize = opts.pngSize ?? 256
  const zip = new JSZip()
  const svgDir = zip.folder('SVG')
  const pngDir = zip.folder('PNG')
  if (!svgDir || !pngDir) throw new Error('zip folders')

  for (const ic of opts.icons) {
    svgDir.file(`${ic.name}.svg`, ic.svg)
    pngDir.file(`${ic.name}.png`, await svgToPng(ic.svg, pngSize))
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${opts.zipName}.zip`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
