export interface Transformation {
  id: number
  name: string
  description: string
  ki: string
  image?: string
}

export interface Character {
  id: number
  name: string
  description: string
  transformations: Transformation[]
  image?: string
}

export interface FetchCharactersResponse {
  items: Character[]
  total: number
}
