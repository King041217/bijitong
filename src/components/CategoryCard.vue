<template>
  <el-card class="category-card" @click="handleClick">
    <div class="category-icon-wrapper">
      <span class="category-icon">{{ category.icon }}</span>
    </div>
    <div class="category-info">
      <h3 class="category-name">{{ category.name }}</h3>
      <p class="category-count">{{ category.count }}份笔记</p>
    </div>
    <div class="category-arrow">
      <el-icon><ArrowRight /></el-icon>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import type { Category } from '@/types'

const props = defineProps<{
  category: Category
}>()

const emit = defineEmits<{
  (e: 'select', id: number): void
}>()

const handleClick = () => {
  emit('select', props.category.id)
}
</script>

<style scoped>
.category-card {
  cursor: pointer;
  border-radius: 20px;
  padding: 24px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.category-card:hover::before {
  transform: scaleX(1);
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(99, 102, 241, 0.12);
}

.category-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.1);
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.category-icon {
  font-size: 32px;
}

.category-info {
  text-align: center;
  flex: 1;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.category-count {
  font-size: 13px;
  color: #94a3b8;
}

.category-arrow {
  margin-top: 12px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(0);
}

.category-arrow :deep(.el-icon) {
  font-size: 16px;
  color: #6366f1;
}
</style>
