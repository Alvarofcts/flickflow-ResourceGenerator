# Flickflow · Resource Generator

Sandbox aislado para **diseñar y generar recursos de interfaz** (iconos, componentes,
estados, layouts concretos) para la Flickflow App, viendo el resultado renderizado en vivo
con los **tokens, fuentes y helpers reales** del design system de producción.

El código que se genera aquí está pensado para ser **copy-paste directo** a la app.

## Cómo funciona

- Es un proyecto **Vite + React 19 + Tailwind v4**, mismo stack visual que la app.
- `app-src/` es un **snapshot vendorizado** del subconjunto del design system de la app
  (tokens `theme.css` + `tailwind-bridge.css`, fuentes, `design-system/icons`, helper
  `createIcon` y dependencias). El alias `@/*` apunta ahí, así que se importa
  `@/design-system/icons`, `@/design-system/lib/helpers/icons`, etc.
  - Se **versiona en el repo** (no es symlink) para que Vercel/cualquier clon compile sin
    depender de la carpeta hermana "Flickflow App".
  - Para **refrescarlo** desde la app local cuando cambie: `pnpm sync:ds`
    (script `scripts/sync-design-system.sh`; ajustar la ruta `APP` si la app se mueve).
- Los tokens vienen de esos CSS reales, importados en `src/styles.css`.
- `~/*` apunta al código local del sandbox (`src/`).

## Galería de recursos

Cada recurso vive en `resources/<nombre>/preview.tsx` y se descubre **automáticamente**
(no hay que registrar nada). Dentro de su carpeta trabajamos libre (subcomponentes, datos
mock, variantes…).

`preview.tsx` debe:
- `export default` un componente React que renderiza el recurso.
- (opcional) `export const meta: ResourceMeta` con `title`, `description`, `group`,
  `status` (`wip|review|done`), `surface` (`base|card|none`).

Toggle Dark/Light en la cabecera (cambia `data-mode` en `<html>`, como la app).

```
pnpm install
pnpm dev        # http://localhost:5273
```

## Reglas del design system (resumen — la fuente real es theme.css)

Arquitectura de tokens `ff/{layer}/{token}` en 3 capas: primitives → semantic → component.
Ningún token fuera de primitives lleva valor directo.

**Color (regla dura):**
- 🟠 Naranja (`--ff-accent-orange`) → **SOLO** áreas de gráficas.
- 🔵 Azul (`--ff-accent-blue`) → **SOLO** calendario económico.
- ✨ AI → gradiente naranja→teal (`--ff-brand-ai*`).
- Interacción UI (botones primarios, nav activa, CTAs) → **neutral** (`--ff-brand-primary`).
- Δ positivo/negativo → verde/rojo (`--ff-status-bull` / `--ff-status-bear`).
- Series de chart → `--ff-dv-1 … --ff-dv-13`.
- **Dark-first.** Default = dark; light solo bajo `[data-mode="light"]`.

**Utilidades Tailwind:** el bridge mapea cada token a `--color-ff-*`, así que se usan como
`bg-ff-bg-surface`, `text-ff-text-primary`, `border-ff-border-subtle`, `text-ff-accent-orange`…

**Tipografía:** Safiro (brand/display), Inter (UI), JetBrains Mono (datos/código).
Pesos: 400 / 500 / 600.

## Iconos

- Se generan con `createIcon(name, iconNode, { viewBox, defaultSize })` de
  `@/design-system/lib/helpers/icons`.
- `iconNode` = array de `[tag, attrs, children?]`. `stroke="currentColor"`, grosor `1.5`.
- viewBox típico `0 0 18 18` (o `0 0 24 24`). El color sale de `currentColor`.
- Convención de nombres: `Icon{Nombre}{Filled|Outlined}` (PascalCase).
- Catálogo actual + plantilla: ver recursos **Design system (referencia)** y **Ejemplo · icono nuevo**.
- Al aprobar un icono, su bloque `createIcon(...)` se copia a
  `app-src/design-system/icons/index.tsx` en la app.

## Componentes

- Variantes con `cva` (import desde `'cva'`, alias a class-variance-authority).
- Clases con `cn` desde `@/design-system/lib/helpers/cn`.
- `Slot` para `asChild`. Atomic design: atoms / molecules / organisms / templates en
  `@/design-system/components`.

## Flujo de trabajo típico

1. Encargo: "iconos para un desplegable de X" / "diseño del componente Y".
2. Crear `resources/<encargo>/preview.tsx`, generar el recurso usando helpers/tokens reales.
3. Iterar en vivo en la galería (variantes, tamaños, estados, dark/light).
4. Al aprobar, mover el código a su sitio en la app (`app-src/...`).
