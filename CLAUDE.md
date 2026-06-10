# Flickflow · Resource Generator

Sandbox aislado para **diseñar y generar recursos de interfaz** (iconos, componentes,
menús, desplegables, layouts) para la **Flickflow App** y su **Chart Engine**, viéndolos
renderizados en vivo con los **tokens, fuentes y helpers reales** de producción. El código
generado está pensado para ser **copy-paste directo** a la app / al chart-sdk.

- **Repo:** `Alvarofcts/flickflow-ResourceGenerator` (push SIEMPRE con la cuenta **Alvarofcts**).
- **Deploy:** https://flickflow-resource-generator.vercel.app (Vercel auto-deploya en cada push a `main`).
- **Local:** `pnpm install && pnpm dev` → http://localhost:5273

## Stack y arquitectura

- **Vite + React 19 + Tailwind v4** (mismo stack visual que la app).
- `app-src/` = **snapshot vendorizado** del subconjunto del design system de la app
  (tokens, fuentes, `design-system/icons`, helper `createIcon`). Alias `@/*` → `app-src`.
  - Se **versiona en el repo** (NO es symlink) para que Vercel/cualquier clon compile.
  - Refrescar desde la app local: `pnpm sync:ds` (`scripts/sync-design-system.sh`).
- `~/*` → código local del sandbox (`src/`).
- **Dos sistemas de tokens** importados en `src/styles.css`:
  1. App (`ff-*`): `theme.css` + `tailwind-bridge.css` → utilidades `bg-ff-bg-surface`,
     `text-ff-text-primary`, `text-ff-accent-orange`…
  2. **Chart Engine SDK** (`src/sdk-theme.css`): tokens legacy (`surface-2`, `surface-subtle-1/2`,
     `surface-hover`, `text-muted`, `accent-orange`, `navbar-bg`…) **escopados a
     `.flickflow-sdk-root`**. Para reproducir menús/desplegables del chart con sus clases y
     valores EXACTOS, envolver el recurso en `<div class="flickflow-sdk-root">`.

## Dónde están los componentes reales (para clavar el contexto)

- App Next: `/Users/alvarorodriguezvigil/Freelance/Unfiltrade/Flickflow/Flickflow App/flick-flow-next`
  (design-system en `src/design-system`, tokens en `src/modules/ai/styles/`).
- Chart Engine (fuente del desplegable de índices/assets): `…/Flickflow/Chart Engine Dashboard/flick-flow-charts-v2`
  → `packages/chart-sdk/src` (`CustomSelect.tsx`, `AssetLogo.tsx`, `styles.css` con los tokens del SDK).

## Galería de recursos

Cada recurso vive en `resources/<nombre>/preview.tsx` y se **autodescubre** (`src/registry.ts`,
`import.meta.glob`). El home (`src/App.tsx`) es una **retícula** de proyectos con thumbnail en vivo;
al entrar, un lienzo de trabajo. `preview.tsx` exporta:
- `default` → componente React del recurso.
- `meta: ResourceMeta` → `title`, `description` (solo contexto de qué es, NO notas internas),
  `group`, `status` (`wip|review|done`), `surface` (`base|card|none`).

**Dark/Light:** el switch de la TopBar pone `data-mode` en `<html>`. Los tokens `ff-*` y los del
SDK flipan solos. Para colores en JS, leer el modo con `useMode()` (`~/lib/useMode`).

## Iconos — REGLAS

- **Usar SIEMPRE `lucide-react`** para los iconos (es la librería por defecto de la app).
  Excepción: **banderas de países** (no existen en lucide) → SVG propio.
- Para iconos propios de la app se puede usar `createIcon(name, iconNode, {viewBox, defaultSize})`
  de `@/design-system/lib/helpers/icons` (formato `[tag, attrs, children?]`, stroke 1.5).

### Export de iconos (`src/lib/iconExport.ts`)

Botón "Descargar" arriba a la derecha del catálogo → zip con carpetas **`SVG/`** y **`PNG/`**.
Clave: el export NO es captura; se **reconstruye cada icono como SVG vectorial** con los MISMOS
parámetros del badge en pantalla (color, glifo lucide, `strokeWidth`, forma/bandera/texto) vía
`renderToStaticMarkup`; el PNG se rasteriza de ese SVG. Cada proyecto define su `ExportBadgeSvg`
espejo del badge. Iconos planos (sin sombras).

## Proyectos actuales

- **Iconos Índices** (`resources/iconos-indices`): selector de índices en el desplegable REAL del
  chart (chrome con tokens del SDK + catálogo). Sistema **híbrido** (el icono se deriva del valor):
  país → bandera · EE.UU. (SPX/NQ/DJI, mismo país ×3) → letras con color de marca (S&P rojo,
  Nasdaq azul, Dow azul marino) · materias primas/transporte → glifo lucide + color de categoría
  (bronce/teal) · energía → glifo (Atom/Sun/Wind). Japón lleva outline gris sutil para light.
- **Iconos Commodities** (`resources/commodities`): port del Figma Make
  (`~/Downloads/Crear desplegable de commodities`). Badge = color de la materia prima (0.8) + glifo
  lucide en tinte claro. Lista "Todas"+reset, bilingüe es/en, dark/light.

## Componentes (cuando toque)

- Variantes con `cva` (import `'cva'`), clases con `cn` (`@/design-system/lib/helpers/cn`),
  `Slot` para `asChild`. Atomic design en `@/design-system/components`.

## Flujo típico

1. Encargo ("iconos para X", "diseño del componente Y").
2. `resources/<encargo>/preview.tsx` con helpers/tokens reales + chrome real si es un componente del producto.
3. Iterar en la galería (tamaños, estados, dark/light).
4. Al aprobar, copiar el código a su sitio en la app / chart-sdk.
