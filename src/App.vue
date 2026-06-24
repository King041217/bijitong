<template>
  <div class="app-container" :class="{ 'login-container': isLoginPage }">
    <Header v-if="!isLoginPage" />
    <main class="main-content" :class="{ 'login-content': isLoginPage }">
      <router-view />
    </main>
    <Footer v-if="!isLoginPage" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container.login-container {
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.main-content {
  flex: 1;
  background-color: #f0f2f5;
}

.main-content.login-content {
  background-color: transparent;
  flex: 1;
}
</style>
