export interface Application {
  name: string,
  features: Feature[]
}

export interface Feature {
  name: string,
  context: Context
}

export interface Context {
  [key: string]: string[]
}

export interface Given {
  [key: string]: string
}
