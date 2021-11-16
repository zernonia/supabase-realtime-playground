export interface User {
  id: string
  name: string
  x: number
  y: number
  message: string
  online: boolean
  color: string
  mobile: boolean
  last_active: string
  image: string
}

export interface Realtime_User {
  name: string
  color: string
  image: string
}

export interface Message {
  id?: string
  name_id: string
  realtime_user: Realtime_User
  created_at?: number
  message: string
}
