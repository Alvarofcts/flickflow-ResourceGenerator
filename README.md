# Flickflow · Resource Generator

Sandbox para **diseñar y generar recursos de interfaz** (iconos, componentes, menús,
desplegables…) para la Flickflow App, viéndolos renderizados en vivo con los **tokens,
fuentes y helpers reales** del design system de producción. El código se genera para ser
**copy-paste directo** a la app / al chart-sdk.

Stack: **Vite + React 19 + Tailwind v4**.

```bash
pnpm install
pnpm dev          # http://localhost:5273
```

## Cómo funciona

- `app-src/` es un **symlink** → `../Flickflow App/flick-flow-next/src`. El alias `@/*`
  apunta ahí, así que se importan los iconos, helpers y tokens reales de la app.
  Si la app se mueve, recrear: `ln -sfn "../Flickflow App/flick-flow-next/src" app-src`.
- `src/sdk-theme.css` replica los tokens del **Chart Engine SDK** para reproducir
  menús/desplegables del chart con sus clases y valores exactos.
- Cada recurso vive en `resources/<nombre>/preview.tsx` y se descubre automáticamente.
  La pantalla principal es una **galería** (retícula) de proyectos; al entrar, un lienzo
  de trabajo. Toggle Dark/Light que afecta también al preview (spec de Flickflow).

Ver [CLAUDE.md](./CLAUDE.md) para el detalle del design system, reglas de color y convenciones.
