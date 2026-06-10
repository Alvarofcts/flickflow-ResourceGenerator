import type { RefAttributes, SVGElementType, SVGProps } from 'react'

export type IconNode = [
  elementName: SVGElementType,
  attrs: Record<string, string>,
  children?: IconNode,
][]

export type SVGAttributes = Partial<SVGProps<SVGSVGElement>>
export type ElementAttributes = RefAttributes<SVGSVGElement> & SVGAttributes

export interface IconProps extends ElementAttributes {
  size?: string | number
  absoluteStrokeWidth?: boolean
}

export interface IconComponentProps extends IconProps {
  iconNode: IconNode
}
