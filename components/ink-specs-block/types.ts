export interface InkSpec {
  id: string
  name: string
  label: string
  labels: string[]
}

export interface InkSpecsBlockProps {
  specs: InkSpec[]
  selectedSpecs?: { [key: string]: any[] }
  onSpecChange?: (specId: string, value: any) => void
  className?: string
  variant?: 'default' | 'compact' | 'grid'
}
