export interface User {
  name: string
  x: number
  y: number
  message: string
  online: boolean
}

export interface Message {
  id?: string
  name: string
  created_at?: number
  message: string
}
