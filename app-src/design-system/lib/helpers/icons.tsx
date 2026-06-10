import { createElement, forwardRef } from 'react'
import { DEFAULT_ATTRIBUTES } from '@/design-system/lib/constants/icons'
import type { IconComponentProps, IconNode, IconProps } from '@/design-system/lib/types/icons'
import { toPascalCase } from '@/shared/lib/helpers/strings'

/**
 * Check if the props contain any accessibility-related attributes
 * @param props - props to check
 * @returns true if any accessibility-related attributes are found, false otherwise
 */
const hasA11yProp = (props: Record<string, any>) => {
  for (const prop in props) {
    if (prop.startsWith('aria-') || prop === 'role' || prop === 'title') {
      return true
    }
  }
  return false
}

const mapIconNodes = (iconNodes: IconNode): React.ReactNode[] =>
  iconNodes.map(([tag, attrs, children], index) => {
    const nestedChildren = children ? mapIconNodes(children) : undefined
    return createElement(tag, { key: index, ...attrs }, nestedChildren)
  })

/**
 * Icon component
 */
const Icon = forwardRef<SVGSVGElement, IconComponentProps>(
  ({ size, strokeWidth, absoluteStrokeWidth, className = '', children, iconNode, ...rest }, ref) =>
    createElement(
      'svg',
      {
        ref,
        ...DEFAULT_ATTRIBUTES,
        width: size,
        height: size,
        strokeWidth: absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
        className,
        ...(!children && !hasA11yProp(rest) && { 'aria-hidden': 'true' }),
        ...rest,
      },
      [...mapIconNodes(iconNode), ...(Array.isArray(children) ? children : [children])],
    ),
)

interface CreateIconOptionsParam {
  viewBox?: string
  defaultSize?: number | string
}

/**
 * Create a icon component
 * @returns Icon component
 * @example
 * 
  const __iconNode = [
    ["path", { d: "m14 12 4 4 4-4", key: "buelq4" }],
    ["path", { d: "M18 16V7", key: "ty0viw" }],
    ["path", { d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16", key: "d5nyq2" }],
    ["path", { d: "M3.304 13h6.392", key: "1q3zxz" }]
  ];
  const AArrowDown = createIcon("a-arrow-down", __iconNode);
 */
export const createIcon = (
  iconName: string,
  iconNode: IconNode,
  { viewBox = '0 0 24 24', defaultSize = 24 }: CreateIconOptionsParam = {},
) => {
  const Component = forwardRef<SVGSVGElement, IconProps>((props, ref) =>
    createElement(Icon, {
      ref,
      iconNode,
      size: defaultSize,
      viewBox,
      ...props,
    }),
  )

  Component.displayName = toPascalCase(iconName)

  return Component
}
