export interface User {
  uid: string
  username: string
  profilePicture?: string
  createdAt: number
  updatedAt: number
}

export interface Message {
  id: string
  recipientId: string
  senderId?: string
  content: string
  timestamp: number
  read: boolean
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  profilePicture?: string
  content: string
  timestamp: number
}

export interface Question {
  id: string
  userId: string
  username: string
  profilePicture?: string
  content: string
  timestamp: number
  replyCount: number
}

export interface QuestionReply {
  id: string
  questionId: string
  userId?: string
  username?: string
  content: string
  timestamp: number
}
