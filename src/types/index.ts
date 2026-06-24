export interface Note {
  id: number
  title: string
  course: string
  major: string
  grade: string
  author: string
  authorId: number
  uploadTime: string
  downloadCount: number
  rating: number
  reviewCount: number
  quality: 'excellent' | 'good' | 'normal'
  tags: string[]
  content: string
  fileType: 'word' | 'pdf' | 'image' | 'txt'
  price: number
  downloadUrl?: string
}

export interface User {
  id: number
  name: string
  avatar: string
  major: string
  grade: string
  points: number
  isVip: boolean
  uploadCount: number
  downloadCount: number
}

export interface Category {
  id: number
  name: string
  icon: string
  count: number
}

export interface Review {
  id: number
  noteId: number
  userId: number
  userName: string
  content: string
  rating: number
  createTime: string
}
