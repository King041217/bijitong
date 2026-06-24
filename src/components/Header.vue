<template>
  <el-header class="header">
    <div class="container header-content">
      <div class="logo" @click="$router.push('/')">
        <div class="logo-icon-wrapper">
          <el-icon class="logo-icon"><Document /></el-icon>
        </div>
        <span class="logo-text">校园笔记通</span>
      </div>
      
      <div class="search-wrapper">
        <el-input
          v-model="searchQuery"
          placeholder="搜索课程、专业或知识点..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
          <template #append>
            <el-button @click="handleSearch" class="search-btn" icon="Search"></el-button>
          </template>
        </el-input>
      </div>
      
      <div class="header-actions">
        <el-button 
          @click="$router.push('/upload')" 
          type="primary"
          class="upload-btn"
        >
          <template #icon><Upload /></template>
          上传笔记
        </el-button>
        <div class="user-menu">
          <div class="avatar-wrapper" @click="showMenu = !showMenu">
            <el-icon class="user-icon"><User /></el-icon>
            <span v-if="userPoints > 0" class="points-badge">{{ userPoints }}</span>
          <span v-if="userIsVip" class="vip-badge">VIP</span>
          </div>
          <div v-if="showMenu" class="dropdown-menu">
            <div class="menu-item" @click="$router.push('/profile'); showMenu = false">
              <el-icon><User /></el-icon>
              <span>个人中心</span>
            </div>
            <div class="menu-item" @click="$router.push('/vip'); showMenu = false">
              <el-icon><Star /></el-icon>
              <span>VIP会员</span>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item logout" @click="handleLogout">
              <el-icon><Close /></el-icon>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Search, Upload, User, Star, Close } from '@element-plus/icons-vue'
import { userPoints, userIsVip, logout } from '@/data/userState'

const router = useRouter()
const searchQuery = ref('')
const showMenu = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/notes', query: { keyword: searchQuery.value } })
  }
}

const handleLogout = () => {
  logout()
  showMenu.value = false
  router.push('/login')
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  backdrop-filter: blur(10px);
}

.logo-icon {
  font-size: 22px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.search-wrapper {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;
}

.search-input {
  height: 46px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 12px;
}

.search-icon {
  color: #94a3b8;
}

.search-btn {
  background: transparent;
  border: none;
  color: #6366f1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.user-menu {
  cursor: pointer;
}

.avatar-wrapper {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.avatar-wrapper:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.user-icon {
  font-size: 20px;
}

.points-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.vip-badge {
  position: absolute;
  top: -4px;
  left: -4px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #8b4513;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  overflow: hidden;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  color: #333;
  font-size: 14px;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item el-icon {
  margin-right: 8px;
  font-size: 16px;
}

.menu-item.logout {
  color: #ef4444;
}

.menu-item.logout:hover {
  background: #fef2f2;
}

.menu-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 4px 0;
}

@media (max-width: 768px) {
  .search-wrapper {
    display: none;
  }
  
  .logo-text {
    display: none;
  }
  
  .upload-btn {
    padding: 8px 14px;
    font-size: 13px;
  }
}
</style>