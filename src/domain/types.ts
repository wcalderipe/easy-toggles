export interface Application {
  name: string,
  features: Feature[]
}

export interface Feature {
  name: string,
  criteria: Criteria
}

export interface Criteria {
  [key: string]: string[]
}

export interface Context {
  [key: string]: string
}

export interface Toggles {
  [key: string]: boolean
}
