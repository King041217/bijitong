<template>
  <div class="notes-page">
    <div class="container">
      <div class="page-header">
        <h1>笔记搜索</h1>
        <p>共找到 {{ filteredNotes.length }} 份笔记</p>
      </div>

      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="输入关键词搜索..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch" icon="Search"></el-button>
          </template>
        </el-input>
      </div>

      <div class="filters">
        <el-select
          v-model="selectedMajor"
          placeholder="选择专业"
          class="filter-select"
          @change="handleFilter"
        >
          <el-option label="全部专业" value="" />
          <el-option v-for="major in majors" :key="major" :label="major" :value="major" />
        </el-select>

        <el-select
          v-model="selectedGrade"
          placeholder="选择年级"
          class="filter-select"
          @change="handleFilter"
        >
          <el-option label="全部年级" value="" />
          <el-option label="大一" value="大一" />
          <el-option label="大二" value="大二" />
          <el-option label="大三" value="大三" />
          <el-option label="大四" value="大四" />
        </el-select>

        <el-select
          v-model="selectedQuality"
          placeholder="质量筛选"
          class="filter-select"
          @change="handleFilter"
        >
          <el-option label="全部质量" value="" />
          <el-option label="优质" value="excellent" />
          <el-option label="良好" value="good" />
          <el-option label="普通" value="normal" />
        </el-select>

        <el-select
          v-model="sortBy"
          placeholder="排序方式"
          class="filter-select"
          @change="handleFilter"
        >
          <el-option label="最新发布" value="time" />
          <el-option label="下载最多" value="download" />
          <el-option label="评分最高" value="rating" />
        </el-select>
      </div>

      <div class="notes-list">
        <div v-if="filteredNotes.length === 0" class="empty-state">
          <el-icon class="empty-icon"><Search /></el-icon>
          <p>没有找到相关笔记</p>
          <el-button @click="resetFilters">清除筛选</el-button>
        </div>
        <NoteCard
          v-for="note in paginatedNotes"
          :key="note.id"
          :note="note"
        />
      </div>

      <div v-if="filteredNotes.length > pageSize" class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredNotes.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import NoteCard from '@/components/NoteCard.vue'
import { mockNotes } from '@/data/mockData'
import { uploadedNotes } from '@/data/userState'

const route = useRoute()

const keyword = ref('')
const selectedMajor = ref('')
const selectedGrade = ref('')
const selectedQuality = ref('')
const sortBy = ref('time')
const currentPage = ref(1)
const pageSize = 6

onMounted(() => {
  const major = route.query.major as string
  const keywordParam = route.query.keyword as string
  
  if (major) {
    selectedMajor.value = major
  }
  
  if (keywordParam) {
    keyword.value = keywordParam
  }
})

const majors = [...new Set(mockNotes.map(note => note.major))]

const filteredNotes = computed(() => {
  // 合并 mockNotes 和用户上传的笔记
  let result = [...mockNotes, ...uploadedNotes.value]

  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(
      note =>
        note.title.toLowerCase().includes(kw) ||
        note.course.toLowerCase().includes(kw) ||
        note.major.toLowerCase().includes(kw) ||
        note.tags.some(tag => tag.toLowerCase().includes(kw))
    )
  }

  if (selectedMajor.value) {
    result = result.filter(note => note.major === selectedMajor.value)
  }

  if (selectedGrade.value) {
    result = result.filter(note => note.grade === selectedGrade.value)
  }

  if (selectedQuality.value) {
    result = result.filter(note => note.quality === selectedQuality.value)
  }

  switch (sortBy.value) {
    case 'download':
      result.sort((a, b) => b.downloadCount - a.downloadCount)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'time':
    default:
      result.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())
  }

  return result
})

const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredNotes.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetFilters = () => {
  keyword.value = ''
  selectedMajor.value = ''
  selectedGrade.value = ''
  selectedQuality.value = ''
  sortBy.value = 'time'
}
</script>

<style scoped>
.notes-page {
  padding: 30px 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
}

.search-bar {
  margin-bottom: 24px;
}

.search-input {
  max-width: 500px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-select {
  width: 140px;
}

.notes-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
}

.empty-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: center;
}

@media (max-width: 900px) {
  .notes-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .notes-list {
    grid-template-columns: 1fr;
  }
}
</style>
