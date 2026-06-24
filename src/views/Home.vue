<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container hero-content">
        <div class="hero-text">
          <h1 class="hero-title">校园笔记通</h1>
          <p class="hero-subtitle">汇聚学霸笔记，让学习更轻松</p>
          <div class="hero-actions">
            <el-button size="large" class="hero-btn primary-btn" @click="goToNotes">
              <el-icon><Search /></el-icon>
              浏览笔记
            </el-button>
            <el-button size="large" class="hero-btn secondary-btn" @click="goToUpload">
              <el-icon><Upload /></el-icon>
              分享笔记
            </el-button>
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat-item">
            <span class="hero-stat-number">{{ totalNotes }}</span>
            <span class="hero-stat-label">份笔记</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-number">{{ totalDownloads }}</span>
            <span class="hero-stat-label">次下载</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-number">8</span>
            <span class="hero-stat-label">个学科</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="section categories-section">
      <div class="container">
        <div class="section-header">
          <h2>学科分类</h2>
          <p>按专业领域浏览你需要的笔记</p>
        </div>
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            @click="handleCategoryClick(category.name)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.count }}份</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Hot Notes Section -->
    <div class="section hot-notes-section">
      <div class="container">
        <div class="section-header">
          <h2>🔥 热门笔记</h2>
          <p>下载量最高的优质笔记</p>
          <el-button text type="primary" @click="goToNotes">
            查看更多 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="notes-grid">
          <div
            v-for="note in hotNotes"
            :key="note.id"
            class="note-card"
            @click="goToNoteDetail(note.id)"
          >
            <div class="note-card-header">
              <span class="quality-badge" :class="`quality-${note.quality}`">
                {{ getQualityText(note.quality) }}
              </span>
              <span class="file-type">{{ note.fileType || 'PDF' }}</span>
            </div>
            <h3 class="note-title">{{ note.title }}</h3>
            <p class="note-course">{{ note.course }}</p>
            <div class="note-meta">
              <span class="meta-item">
                <el-icon><Download /></el-icon>
                {{ note.downloadCount }}
              </span>
              <span class="meta-item">
                <el-icon><Star /></el-icon>
                {{ note.rating }}
              </span>
              <span class="note-price" :class="{ free: note.price === 0 }">
                {{ note.price === 0 ? '免费' : note.price + '积分' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Notes Section -->
    <div class="section latest-notes-section">
      <div class="container">
        <div class="section-header">
          <h2>📝 最新上传</h2>
          <p>同学们刚刚分享的笔记</p>
          <el-button text type="primary" @click="goToNotes">
            查看更多 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="notes-grid">
          <div
            v-for="note in latestNotes"
            :key="note.id"
            class="note-card"
            @click="goToNoteDetail(note.id)"
          >
            <div class="note-card-header">
              <span class="quality-badge" :class="`quality-${note.quality}`">
                {{ getQualityText(note.quality) }}
              </span>
              <span class="file-type">{{ note.fileType || 'PDF' }}</span>
            </div>
            <h3 class="note-title">{{ note.title }}</h3>
            <p class="note-course">{{ note.course }}</p>
            <div class="note-meta">
              <span class="meta-item">
                <el-icon><Download /></el-icon>
                {{ note.downloadCount }}
              </span>
              <span class="meta-item">
                <el-icon><Star /></el-icon>
                {{ note.rating }}
              </span>
              <span class="note-price" :class="{ free: note.price === 0 }">
                {{ note.price === 0 ? '免费' : note.price + '积分' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>准备好分享你的笔记了吗？</h2>
          <p>上传优质笔记，不仅可以帮助其他同学，还能赚取积分！</p>
          <el-button size="large" class="cta-btn" @click="goToUpload">
            <el-icon><Upload /></el-icon>
            立即上传笔记
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Upload, ArrowRight, Download, Star } from '@element-plus/icons-vue'
import { categories, mockNotes } from '@/data/mockData'
import { uploadedNotes } from '@/data/userState'

const router = useRouter()

// 笔记总数 = mock笔记 + 上传的笔记
const totalNotes = computed(() => mockNotes.length + uploadedNotes.value.length)

const totalDownloads = computed(() => {
  return mockNotes.reduce((sum, n) => sum + n.downloadCount, 0)
})

// 热门笔记：下载量最高的6个（合并mock笔记和上传的笔记）
const hotNotes = computed(() => {
  const allNotes = [...mockNotes, ...uploadedNotes.value]
  return allNotes.sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 6)
})

// 最新笔记：按时间排序的6个（合并mock笔记和上传的笔记）
const latestNotes = computed(() => {
  const allNotes = [...mockNotes, ...uploadedNotes.value]
  return allNotes.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()).slice(0, 6)
})

const getQualityText = (quality: string) => {
  const map: Record<string, string> = {
    'excellent': '精品',
    'good': '优质',
    'normal': '普通'
  }
  return map[quality] || '普通'
}

const goToNotes = () => {
  router.push('/notes')
}

const goToUpload = () => {
  router.push('/upload')
}

const goToNoteDetail = (noteId: number) => {
  router.push(`/note/${noteId}`)
}

const handleCategoryClick = (categoryName: string) => {
  router.push({ path: '/notes', query: { major: categoryName } })
}
</script>

<style scoped>
.home {
  width: 100%;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.hero-btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  transition: all 0.3s ease;
}

.primary-btn {
  background: white;
  color: #6366f1;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
}

.hero-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-stat-number {
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.hero-stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

/* Section Common */
.section {
  padding: 60px 0;
}

.section-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.section-header p {
  color: #94a3b8;
  font-size: 14px;
}

.section-header .el-button {
  margin-left: auto;
}

/* Categories Section */
.categories-section {
  background: #fff;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  background: #eef2ff;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
}

.category-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 4px;
}

.category-count {
  font-size: 12px;
  color: #94a3b8;
}

/* Notes Grid */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.note-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.note-card-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.quality-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.quality-excellent {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
  color: white;
}

.quality-good {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.quality-normal {
  background: #e5e7eb;
  color: #6b7280;
}

.file-type {
  padding: 4px 10px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 11px;
  color: #6b7280;
}

.note-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
}

.note-course {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
}

.note-price {
  margin-left: auto;
  font-size: 14px;
  font-weight: 600;
  color: #f59e0b;
}

.note-price.free {
  color: #10b981;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.cta-content {
  text-align: center;
}

.cta-content h2 {
  font-size: 28px;
  color: white;
  margin-bottom: 12px;
}

.cta-content p {
  color: #94a3b8;
  font-size: 16px;
  margin-bottom: 32px;
}

.cta-btn {
  padding: 16px 36px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  .hero-stats {
    gap: 24px;
  }
  .hero-stat-number {
    font-size: 24px;
  }
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .notes-grid {
    grid-template-columns: 1fr;
  }
  .section {
    padding: 40px 0;
  }
}
</style>