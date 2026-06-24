<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <div class="logo">📚</div>
        <h1>校园笔记通</h1>
        <p>大学生学习笔记智能共享平台</p>
      </div>
      
      <div class="login-form">
        <h2>欢迎登录</h2>
        
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            placeholder="请输入用户名"
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
          />
        </div>
        
        <button @click="handleLogin" class="login-btn">
          登录
        </button>
        
        <div class="quick-login">
          <span>快速登录：</span>
          <button @click="loginAsVip" class="quick-btn vip-btn">VIP会员</button>
          <button @click="loginAsNormal" class="quick-btn normal-btn">普通用户</button>
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
      
      <div class="test-accounts">
        <h3>测试账号</h3>
        <div class="account-item vip">
          <span class="label">VIP会员：</span>
          <span class="info">用户名: vip001 | 密码: vip123</span>
        </div>
        <div class="account-item normal">
          <span class="label">普通用户：</span>
          <span class="info">用户名: user001 | 密码: user123</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../data/userState'

onMounted(() => {
  document.body.classList.add('login-page')
})

onUnmounted(() => {
  document.body.classList.remove('login-page')
})

const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

// 测试账号列表
const testAccounts = [
  { username: 'vip001', password: 'vip123', isVip: true, points: 1000 },
  { username: 'user001', password: 'user123', isVip: false, points: 100 }
]

const handleLogin = () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码'
    return
  }
  
  const account = testAccounts.find(
    acc => acc.username === username.value && acc.password === password.value
  )
  
  if (account) {
    login(account.username, account.isVip, account.points)
    router.push('/')
  } else {
    errorMessage.value = '用户名或密码错误'
  }
}

const loginAsVip = () => {
  username.value = 'vip001'
  password.value = 'vip123'
  handleLogin()
}

const loginAsNormal = () => {
  username.value = 'user001'
  password.value = 'user123'
  handleLogin()
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 64px;
  margin-bottom: 15px;
}

.logo-section h1 {
  font-size: 28px;
  color: #333;
  margin: 0 0 8px 0;
}

.logo-section p {
  color: #666;
  margin: 0;
}

.login-form h2 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  font-size: 22px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.quick-login {
  margin-top: 15px;
  text-align: center;
  color: #666;
}

.quick-btn {
  margin-left: 8px;
  padding: 6px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.vip-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #8b4513;
}

.normal-btn {
  background: #e0e0e0;
  color: #555;
}

.quick-btn:hover {
  transform: scale(1.05);
}

.error-message {
  margin-top: 15px;
  padding: 12px;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  text-align: center;
}

.test-accounts {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.test-accounts h3 {
  color: #555;
  font-size: 14px;
  margin-bottom: 12px;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 13px;
}

.account-item.vip {
  background: #fff8e1;
}

.account-item.normal {
  background: #f5f5f5;
}

.account-item .label {
  font-weight: 600;
  margin-right: 8px;
}

.account-item.vip .label {
  color: #ff9800;
}

.account-item.normal .label {
  color: #666;
}

.account-item .info {
  color: #555;
}
</style>