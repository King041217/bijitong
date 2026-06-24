<template>
  <div class="vip-page">
    <div class="container">
      <div class="page-header">
        <h1>VIP会员</h1>
        <p>解锁更多特权，让学习更高效</p>
      </div>

      <div class="plans-section">
        <div class="plan-card" :class="{ active: selectedPlan === 'monthly' }">
          <div class="plan-header">
            <h3>月度会员</h3>
            <div class="price">
              <span class="price-symbol">¥</span>
              <span class="price-value">6.9</span>
              <span class="price-unit">/月</span>
            </div>
          </div>
          <div class="plan-features">
            <div v-for="feature in features" :key="feature" class="feature-item">
              <el-icon class="check-icon"><Check /></el-icon>
              <span>{{ feature }}</span>
            </div>
          </div>
          <el-button
            type="primary"
            :class="{ 'is-active': selectedPlan === 'monthly' }"
            @click="selectedPlan = 'monthly'"
          >
            {{ selectedPlan === 'monthly' ? '已选择' : '选择' }}
          </el-button>
        </div>

        <div class="plan-card popular">
          <div class="popular-badge">推荐</div>
          <div class="plan-header">
            <h3>年度会员</h3>
            <div class="price">
              <span class="price-symbol">¥</span>
              <span class="price-value">59.9</span>
              <span class="price-unit">/年</span>
            </div>
            <div class="discount">立省23.9元</div>
          </div>
          <div class="plan-features">
            <div v-for="feature in features" :key="feature" class="feature-item">
              <el-icon class="check-icon"><Check /></el-icon>
              <span>{{ feature }}</span>
            </div>
            <div class="feature-item exclusive">
              <el-icon class="check-icon"><Check /></el-icon>
              <span>专属学习顾问</span>
            </div>
          </div>
          <el-button
            type="primary"
            :class="{ 'is-active': selectedPlan === 'yearly' }"
            @click="selectedPlan = 'yearly'"
          >
            {{ selectedPlan === 'yearly' ? '已选择' : '选择' }}
          </el-button>
        </div>
      </div>

      <div class="benefits-section">
        <h2>VIP专属特权</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">
              <el-icon><Download /></el-icon>
            </div>
            <h3>无限下载</h3>
            <p>每日下载无限制，获取更多优质笔记</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">
              <el-icon><Lightning /></el-icon>
            </div>
            <h3>优先推荐</h3>
            <p>优质笔记优先推送，更快找到所需资料</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">
              <el-icon><Headset /></el-icon>
            </div>
            <h3>专属客服</h3>
            <p>7x24小时在线客服，及时解答问题</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">
              <el-icon><Present /></el-icon>
            </div>
            <h3>积分奖励</h3>
            <p>每月赠送100积分，可用于下载笔记</p>
          </div>
        </div>
      </div>

      <div class="agreement-section">
        <input type="checkbox" id="agreement" v-model="agree" />
        <label for="agreement">
          我已阅读并同意
          <a href="#" class="link">《会员服务协议》</a>
          和
          <a href="#" class="link">《隐私政策》</a>
        </label>
      </div>

      <div class="action-section">
        <el-button
          type="primary"
          size="large"
          class="subscribe-btn"
          :disabled="!agree"
          @click="handleSubscribe"
        >
          <el-icon><CreditCard /></el-icon>
          立即开通
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Download, Lightning, Headset, Present, CreditCard } from '@element-plus/icons-vue'
import { subscribeVip, userIsVip } from '@/data/userState'

const router = useRouter()
const selectedPlan = ref('yearly')
const agree = ref(false)

const features = [
  '无限下载笔记',
  '优先获取优质笔记',
  '专属客服支持',
  '每月赠送50积分',
  '去除广告干扰'
]

const handleSubscribe = () => {
  if (!agree.value) return

  const planType = selectedPlan.value as 'monthly' | 'yearly'
  const planName = planType === 'yearly' ? '年度' : '月度'
  const bonusPoints = planType === 'yearly' ? 500 : 100

  if (userIsVip.value) {
    alert('您已是VIP会员，无需重复订阅！')
    return
  }

  subscribeVip(planType)
  alert(`恭喜！成功开通${planName}VIP会员！\n赠送 ${bonusPoints} 积分已到账`)
  router.push('/profile')
}
</script>

<style scoped>
.vip-page {
  padding: 30px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  color: #666;
}

.plans-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 800px;
  margin: 0 auto 40px;
}

.plan-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  position: relative;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.plan-card:hover,
.plan-card.active {
  border-color: #667eea;
}

.plan-card.popular {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f59e0b;
  color: #92400e;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.plan-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.price {
  margin-bottom: 8px;
}

.price-symbol {
  font-size: 24px;
  color: #1a1a2e;
}

.price-value {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a2e;
}

.price-unit {
  font-size: 16px;
  color: #666;
}

.discount {
  font-size: 14px;
  color: #ef4444;
  font-weight: 500;
}

.plan-features {
  margin: 24px 0;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  color: #4b5563;
  font-size: 14px;
}

.feature-item.exclusive {
  color: #f59e0b;
  font-weight: 500;
}

.check-icon {
  color: #10b981;
  margin-right: 8px;
}

.benefits-section {
  margin-bottom: 32px;
}

.benefits-section h2 {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 24px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.benefit-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.benefit-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.benefit-icon :deep(.el-icon) {
  color: white;
  font-size: 24px;
}

.benefit-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.benefit-card p {
  font-size: 13px;
  color: #666;
}

.agreement-section {
  text-align: center;
  margin-bottom: 24px;
}

.agreement-section label {
  font-size: 14px;
  color: #666;
}

.link {
  color: #667eea;
}

.action-section {
  text-align: center;
}

.subscribe-btn {
  width: 200px;
  height: 48px;
  font-size: 16px;
}

@media (max-width: 700px) {
  .plans-section {
    grid-template-columns: 1fr;
  }
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
