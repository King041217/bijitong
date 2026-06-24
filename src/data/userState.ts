import { ref, watch } from 'vue'
import type { Note } from '@/types'

// 评论数据类型
export interface Review {
  id: number
  noteId: number
  userId: number
  userName: string
  content: string
  rating: number
  createTime: string
}

// 用户数据类型定义
interface UserData {
  username: string
  points: number
  isVip: boolean
  downloadedNotes: Note[]
  uploadedNotes: Note[]
  collectedNotes: Note[]
  dailyDownloads: number
  lastDownloadDate: string
}

// 数据库键名
const DB_KEY = 'campus-notes-db'
const REVIEWS_KEY = 'campus-notes-reviews'
const UPLOADED_NOTES_KEY = 'campus-notes-uploaded'

// 从localStorage读取上传的笔记
const loadUploadedNotes = (): Note[] => {
  const saved = localStorage.getItem(UPLOADED_NOTES_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  }
  return []
}

// 保存上传的笔记到localStorage
const saveUploadedNotes = (notes: Note[]) => {
  localStorage.setItem(UPLOADED_NOTES_KEY, JSON.stringify(notes))
}

// 从localStorage读取整个数据库
const loadDatabase = (): Record<string, UserData> => {
  const saved = localStorage.getItem(DB_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return {}
    }
  }
  return {}
}

// 保存整个数据库到localStorage
const saveDatabase = (db: Record<string, UserData>) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

// 清理旧数据（强制重新初始化）
const cleanOldData = () => {
  const oldKey = 'campus-notes-user'
  const oldData = localStorage.getItem(oldKey)
  if (oldData) {
    try {
      const parsed = JSON.parse(oldData)
      // 如果旧数据有username，说明是旧格式，需要清理
      if (parsed.username) {
        localStorage.removeItem(oldKey)
      }
    } catch {
      localStorage.removeItem(oldKey)
    }
  }
  
  // 强制重新初始化数据库（清除所有用户数据）
  const dbKey = 'campus-notes-db'
  const dbData = localStorage.getItem(dbKey)
  if (dbData) {
    try {
      const parsed = JSON.parse(dbData)
      // 检查是否有用户的isVip为true但不应该为true的情况
      let needsUpdate = false
      for (const key in parsed) {
        const user = parsed[key]
        // 确保普通用户不是VIP
        if (user.username === 'zhangsan' || user.username === 'wangwu') {
          if (user.isVip === true) {
            user.isVip = false
            needsUpdate = true
          }
        }
        // 确保VIP用户是VIP
        if (user.username === 'lisi') {
          if (user.isVip !== true) {
            user.isVip = true
            needsUpdate = true
          }
        }
      }
      if (needsUpdate) {
        saveDatabase(parsed)
      }
    } catch {
      // 数据损坏，直接清除
      localStorage.removeItem(dbKey)
    }
  }
}

// 从localStorage读取评论数据
const loadReviews = (): Review[] => {
  const saved = localStorage.getItem(REVIEWS_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  }
  return []
}

// 保存评论数据到localStorage
const saveReviews = (reviews: Review[]) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

// 初始化数据库（如果不存在则创建默认用户）
const initializeDatabase = () => {
  // 先清理旧数据
  cleanOldData()
  
  let db = loadDatabase()
  
  // 如果数据库为空，创建默认用户
  if (Object.keys(db).length === 0) {
    db = {
      'zhangsan': {
        username: 'zhangsan',
        points: 200,
        isVip: false,
        downloadedNotes: [],
        uploadedNotes: [],
        collectedNotes: [],
        dailyDownloads: 0,
        lastDownloadDate: ''
      },
      'lisi': {
        username: 'lisi',
        points: 500,
        isVip: true,
        downloadedNotes: [],
        uploadedNotes: [],
        collectedNotes: [],
        dailyDownloads: 0,
        lastDownloadDate: ''
      },
      'wangwu': {
        username: 'wangwu',
        points: 100,
        isVip: false,
        downloadedNotes: [],
        uploadedNotes: [],
        collectedNotes: [],
        dailyDownloads: 0,
        lastDownloadDate: ''
      }
    }
    saveDatabase(db)
  }
  
  return db
}

// 初始化数据库
const db = initializeDatabase()

// 全局评论存储（所有用户共享）
export const allReviews = ref<Review[]>(loadReviews())

// 当前用户数据（内存中）
export const isLoggedIn = ref(false)
export const currentUsername = ref('')
export const userPoints = ref(100)
export const userIsVip = ref(false)
export const currentUserInfo = ref({
  name: '校园用户',
  major: '计算机科学',
  grade: '大三',
  authorId: 100
})
export const downloadedNotes = ref<Note[]>([])
// 全局上传笔记存储（所有用户共享）
export const uploadedNotes = ref<Note[]>(loadUploadedNotes())

// 监听上传笔记变化并保存
watch(uploadedNotes, (newNotes) => {
  saveUploadedNotes(newNotes)
}, { deep: true })
export const collectedNotes = ref<Note[]>([])
const dailyDownloads = ref(0)
const lastDownloadDate = ref('')

// 更新当前用户信息
const updateUserInfo = () => {
  currentUserInfo.value = {
    name: currentUsername.value || '校园用户',
    major: '计算机科学',
    grade: userIsVip.value ? 'VIP会员' : '大三',
    authorId: userIsVip.value ? 101 : 100
  }
}

// 监听用户数据变化并自动保存到数据库
watch([currentUsername, userPoints, userIsVip, downloadedNotes, uploadedNotes, collectedNotes, dailyDownloads, lastDownloadDate], () => {
  if (isLoggedIn.value && currentUsername.value) {
    // 更新当前用户在数据库中的数据
    db[currentUsername.value] = {
      username: currentUsername.value,
      points: userPoints.value,
      isVip: userIsVip.value,
      downloadedNotes: downloadedNotes.value,
      uploadedNotes: uploadedNotes.value,
      collectedNotes: collectedNotes.value,
      dailyDownloads: dailyDownloads.value,
      lastDownloadDate: lastDownloadDate.value
    }
    saveDatabase(db)
  }
}, { deep: true })

// 监听评论变化并自动保存
watch(allReviews, (newReviews) => {
  saveReviews(newReviews)
}, { deep: true })

// 登录 - 从数据库加载用户数据
export const login = (username: string, isVip: boolean, points: number) => {
  // 检查用户是否存在于数据库
  if (db[username]) {
    // 用户存在，加载其数据
    const userData = db[username]
    currentUsername.value = userData.username
    userPoints.value = userData.points
    userIsVip.value = userData.isVip
    downloadedNotes.value = userData.downloadedNotes || []
    uploadedNotes.value = userData.uploadedNotes || []
    collectedNotes.value = userData.collectedNotes || []
    dailyDownloads.value = userData.dailyDownloads || 0
    lastDownloadDate.value = userData.lastDownloadDate || ''
  } else {
    // 用户不存在，创建新用户
    currentUsername.value = username
    userPoints.value = points
    userIsVip.value = isVip
    downloadedNotes.value = []
    uploadedNotes.value = []
    collectedNotes.value = []
    dailyDownloads.value = 0
    lastDownloadDate.value = ''
    
    // 保存新用户到数据库
    db[username] = {
      username,
      points,
      isVip,
      downloadedNotes: [],
      uploadedNotes: [],
      collectedNotes: [],
      dailyDownloads: 0,
      lastDownloadDate: ''
    }
    saveDatabase(db)
  }
  
  isLoggedIn.value = true
  updateUserInfo()
}

// 登出 - 清理内存中的用户状态
export const logout = () => {
  isLoggedIn.value = false
  currentUsername.value = ''
  userPoints.value = 100
  userIsVip.value = false
  downloadedNotes.value = []
  uploadedNotes.value = []
  collectedNotes.value = []
  dailyDownloads.value = 0
  lastDownloadDate.value = ''
  currentUserInfo.value = {
    name: '校园用户',
    major: '计算机科学',
    grade: '大三',
    authorId: 100
  }
}

// 注册新用户
export const register = (username: string, isVip: boolean = false) => {
  if (db[username]) {
    return false // 用户已存在
  }
  
  db[username] = {
    username,
    points: 100,
    isVip,
    downloadedNotes: [],
    uploadedNotes: [],
    collectedNotes: [],
    dailyDownloads: 0,
    lastDownloadDate: ''
  }
  saveDatabase(db)
  return true
}

// ============ 评论功能 ============

// 获取指定笔记的所有评论
export const getReviewsForNote = (noteId: number): Review[] => {
  return allReviews.value.filter(r => r.noteId === noteId)
}

// 添加新评论
export const addReview = (noteId: number, content: string, rating: number, userName: string) => {
  const newReview: Review = {
    id: Date.now(),
    noteId,
    userId: isLoggedIn.value ? (userIsVip.value ? 101 : 100) : 999,
    userName: userName || '匿名用户',
    content,
    rating,
    createTime: new Date().toISOString().split('T')[0]
  }
  allReviews.value.unshift(newReview)
}

// ============ 收藏功能 ============

export const toggleCollect = (note: Note): boolean => {
  const index = collectedNotes.value.findIndex(n => n.id === note.id)
  if (index !== -1) {
    collectedNotes.value.splice(index, 1)
    return false
  } else {
    collectedNotes.value.unshift(note)
    return true
  }
}

export const isNoteCollected = (noteId: number): boolean => {
  return collectedNotes.value.some(n => n.id === noteId)
}

// ============ 积分充值 ============

export const rechargePoints = (amount: number): number => {
  userPoints.value += amount
  return userPoints.value
}

// ============ 下载功能 ============

export const canDownload = (): boolean => {
  const today = new Date().toISOString().split('T')[0]
  if (lastDownloadDate.value !== today) {
    dailyDownloads.value = 0
    lastDownloadDate.value = today
  }
  
  if (userIsVip.value) {
    return true
  }
  
  return dailyDownloads.value < 3
}

export const isNoteDownloaded = (noteId: number): boolean => {
  return downloadedNotes.value.some(n => n.id === noteId)
}

export const handleDownload = (note: Note): boolean => {
  if (!canDownload()) {
    return false
  }
  
  const today = new Date().toISOString().split('T')[0]
  if (lastDownloadDate.value !== today) {
    dailyDownloads.value = 0
    lastDownloadDate.value = today
  }
  
  // 扣除积分（免费笔记不扣）
  if (note.price > 0) {
    if (userPoints.value < note.price) {
      return false // 积分不足
    }
    userPoints.value -= note.price
  }
  
  if (!userIsVip.value) {
    dailyDownloads.value++
  }
  
  if (!isNoteDownloaded(note.id)) {
    downloadedNotes.value.unshift(note)
  }
  
  return true
}

// ============ 上传功能 ============

export const addUploadedNote = (note: Note) => {
  uploadedNotes.value.unshift(note)
  userPoints.value += 10
}

export const uploadNote = (note: Note) => {
  uploadedNotes.value.unshift(note)
  userPoints.value += 10
}

export const deleteUploadedNote = (noteId: number) => {
  const index = uploadedNotes.value.findIndex(n => n.id === noteId)
  if (index !== -1) {
    uploadedNotes.value.splice(index, 1)
  }
}

export const editUploadedNote = (noteId: number, updates: Partial<Note>) => {
  const index = uploadedNotes.value.findIndex(n => n.id === noteId)
  if (index !== -1) {
    uploadedNotes.value[index] = { ...uploadedNotes.value[index], ...updates }
  }
}

// ============ VIP订阅功能 ============

export const subscribeVip = (planType: 'monthly' | 'yearly') => {
  userIsVip.value = true
  if (planType === 'yearly') {
    userPoints.value += 500
  } else {
    userPoints.value += 100
  }
}


