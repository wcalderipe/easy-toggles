export interface Application {
  id?: string
  name: string
  features: Feature[]
}

export interface Feature {
  id?: string
  name: string
  criterias: Criteria[]
}

export interface Criteria {
  id?: string
  name: string
  values: string[]
}

export interface Context {
  [key: string]: string
}

export interface Toggle {
  name: string
  isActive: boolean
}
