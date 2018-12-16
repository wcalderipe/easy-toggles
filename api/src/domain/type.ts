export interface Application {
  id?: string
  name: string
  features: Feature[]
}

export interface Feature {
  name: string
  criterias: Criteria[]
}

export interface Criteria {
  name: string
  values: string[]
}

export interface Context {
  [key: string]: string
}

export interface Toggles {
  [key: string]: boolean
}
