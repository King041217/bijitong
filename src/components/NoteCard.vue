<template>
  <el-card class="note-card" @click="goToDetail">
    <div class="card-header">
      <div class="quality-badge" :class="`quality-${note.quality}`">
        {{ qualityText }}
      </div>
      <div class="header-right">
        <el-button
          class="collect-btn"
          :class="{ collected: isCollected }"
          @click.stop="onToggleCollect"
          size="small"
          circle
        >
          <el-icon><StarFilled v-if="isCollected" /><Star v-else /></el-icon>
        </el-button>
        <div class="file-type-wrapper">
          <el-icon class="file-icon">{{ fileIcon }}</el-icon>
          <span class="file-type">{{ fileTypeText }}</span>
        </div>
      </div>
    </div>

    <h3 class="note-title">{{ note.title }}</h3>

    <div class="note-meta">
      <span class="course-tag">{{ note.course }}</span>
      <span class="meta-divider">·</span>
      <span class="major-tag">{{ note.major }}</span>
      <span class="meta-divider">·</span>
      <span class="grade-tag">{{ note.grade }}</span>
    </div>

    <p class="note-content">{{ note.content }}</p>

    <div class="note-tags">
      <span v-for="tag in note.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <div class="card-footer">
      <div class="author-info">
        <div class="author-avatar">
          <el-icon><User /></el-icon>
        </div>
        <span class="author-name">{{ note.author }}</span>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <el-icon><Download /></el-icon>
          <span>{{ note.downloadCount }}</span>
        </div>
        <div class="stat-item rating">
          <el-icon><Star /></el-icon>
          <span>{{ note.rating }}</span>
        </div>
      </div>

      <div class="price-wrapper">
        <span v-if="note.price === 0" class="price free">免费</span>
        <span v-else class="price">{{ note.price }}<span class="price-unit">积分</span></span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Download, Star, StarFilled, Document, Picture, Files } from '@element-plus/icons-vue'
import type { Note } from '@/types'
import { toggleCollect, isNoteCollected } from '@/data/userState'

const router = useRouter()
const props = defineProps<{
  note: Note
}>()

const isCollected = ref(isNoteCollected(props.note.id))

const qualityText = computed(() => {
  const map: Record<string, string> = {
    excellent: '优质',
    good: '良好',
    normal: '普通'
  }
  return map[props.note.quality]
})

const fileTypeText = computed(() => {
  const map: Record<string, string> = {
    word: 'Word',
    pdf: 'PDF',
    image: '图片',
    txt: '文本'
  }
  return map[props.note.fileType] || 'PDF'
})

const fileIcon = computed(() => {
  const map: Record<string, typeof Document> = {
    word: Document,
    pdf: Document,
    image: Picture,
    txt: Files
  }
  return map[props.note.fileType] || Document
})

const onToggleCollect = () => {
  const result = toggleCollect(props.note)
  isCollected.value = result
}

const goToDetail = () => {
  router.push(`/note/${props.note.id}`)
}
</script>

<style scoped>
.note-card {
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.note-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.collect-btn {
  border: none;
  background: transparent;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.collect-btn:hover {
  color: #f59e0b;
  background: #fef3c7;
}

.collect-btn.collected {
  color: #f59e0b;
}

.collect-btn.collected:hover {
  color: #d97706;
  background: #fef3c7;
}

.quality-badge {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.quality-excellent {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
}

.quality-good {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
}

.quality-normal {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.file-type-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 13px;
}

.file-icon {
  font-size: 14px;
}

.note-title {
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.course-tag {
  padding: 4px 10px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #4338ca;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.major-tag {
  padding: 4px 10px;
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #be185d;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.grade-tag {
  padding: 4px 10px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.meta-divider {
  color: #cbd5e1;
}

.note-content {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  margin-bottom: 16px;
}

.tag {
  display: inline-block;
  padding: 3px 10px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 4px;
  font-size: 11px;
  margin-right: 6px;
  margin-bottom: 4px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-avatar :deep(.el-icon) {
  color: white;
  font-size: 14px;
}

.author-name {
  font-size: 13px;
  color: #64748b;
}

.stats-row {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #94a3b8;
}

.stat-item :deep(.el-icon) {
  font-size: 14px;
}

.stat-item.rating :deep(.el-icon) {
  color: #fbbf24;
}

.stat-item.rating span {
  color: #f59e0b;
  font-weight: 600;
}

.price-wrapper {
  text-align: right;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #6366f1;
}

.price.free {
  color: #10b981;
}

.price-unit {
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
  margin-left: 2px;
}
</style>
