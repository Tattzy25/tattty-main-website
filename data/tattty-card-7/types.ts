export interface Card7Category {
  id: string
  name: string
  label: string
}

export interface CategoryData extends Card7Category {
  labels: string[] // Label options for images
}

export interface Card7Data {
  title: string
  subtitle: string
  description: string
  placeholder: string
  options: string[]
}
