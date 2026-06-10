#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# Vendoriza en app-src/ el subconjunto del design system de la Flickflow App
# que necesita el sandbox para compilar SIN depender de un symlink (para que
# Vercel/cualquier clon pueda construirlo). Ejecuta cuando la app cambie:
#   pnpm sync:ds
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")/.."

APP="../Flickflow App/flick-flow-next/src"
DST="app-src"

if [ ! -d "$APP" ]; then
  echo "✗ No encuentro la app en '$APP'. Ajusta la ruta APP en este script." >&2
  exit 1
fi

rm -rf "$DST"
mkdir -p \
  "$DST/modules/ai/styles" \
  "$DST/app/fonts" \
  "$DST/design-system/icons" \
  "$DST/design-system/lib/helpers" \
  "$DST/design-system/lib/constants" \
  "$DST/design-system/lib/types" \
  "$DST/shared/lib/helpers"

# tokens + bridge
cp "$APP/modules/ai/styles/theme.css"          "$DST/modules/ai/styles/"
cp "$APP/modules/ai/styles/tailwind-bridge.css" "$DST/modules/ai/styles/"
# fuentes reales
cp "$APP"/app/fonts/*.woff2                     "$DST/app/fonts/"
# iconos + helpers (cadena de createIcon)
cp "$APP"/design-system/icons/index.*           "$DST/design-system/icons/"
cp "$APP"/design-system/lib/helpers/icons.*     "$DST/design-system/lib/helpers/"
cp "$APP"/design-system/lib/constants/icons.*   "$DST/design-system/lib/constants/"
cp "$APP"/design-system/lib/types/icons.*       "$DST/design-system/lib/types/"
cp "$APP"/shared/lib/helpers/strings.*          "$DST/shared/lib/helpers/"

echo "✓ Vendorizado el design system en $DST/"
