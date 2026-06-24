<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar">
            <el-icon><User /></el-icon>
          </div>
          <div class="user-info">
            <h2>{{ currentUserInfo.name }}</h2>
            <p>{{ currentUserInfo.major }} · {{ currentUserInfo.grade }}</p>
            <div class="user-tags">
              <span v-if="userIsVip" class="vip-tag">VIP会员</span>
              <span class="level-tag">Lv.{{ Math.floor(userPoints / 100) + 1 }}</span>
            </div>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-box">
            <span class="stat-value">{{ userPoints }}</span>
            <span class="stat-label">积分</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">{{ uploadedNotes.length }}</span>
            <span class="stat-label">上传笔记</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">{{ downloadedNotes.length }}</span>
            <span class="stat-label">下载笔记</span>
          </div>
        </div>
      </div>

      <div class="tabs-section">
        <el-tabs v-model="activeTab" class="profile-tabs">
          <el-tab-pane label="我的上传" name="uploaded">
            <div v-if="uploadedNotes.length === 0" class="empty-state">
              <el-icon><Document /></el-icon>
              <p>还没有上传笔记</p>
              <el-button @click="router.push('/upload')">去上传</el-button>
            </div>
            <div v-else class="notes-table">
              <el-table :data="uploadedNotes" border>
                <el-table-column prop="title" label="笔记标题" min-width="150" />
                <el-table-column prop="course" label="课程" width="120" />
                <el-table-column prop="downloadCount" label="下载量" width="80" />
                <el-table-column prop="rating" label="评分" width="70" />
                <el-table-column prop="uploadTime" label="上传时间" width="110" />
                <el-table-column label="操作" width="200">
                  <template #default="scope">
                    <el-button size="small" @click="startEditNote(scope.row)">编辑</el-button>
                    <el-button size="small" @click="viewNote(scope.row.id)">查看</el-button>
                    <el-button size="small" type="danger" @click="deleteNote(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <el-tab-pane label="我的收藏" name="collected">
            <div v-if="collectedNotes.length === 0" class="empty-state">
              <el-icon><StarFilled /></el-icon>
              <p>还没有收藏笔记</p>
              <el-button @click="router.push('/notes')">去浏览</el-button>
            </div>
            <div v-else class="notes-table">
              <el-table :data="collectedNotes" border>
                <el-table-column prop="title" label="笔记标题" min-width="150" />
                <el-table-column prop="course" label="课程" width="120" />
                <el-table-column prop="author" label="作者" width="100" />
                <el-table-column prop="downloadCount" label="下载量" width="80" />
                <el-table-column prop="rating" label="评分" width="70" />
                <el-table-column label="操作" width="180">
                  <template #default="scope">
                    <el-button size="small" @click="viewNote(scope.row.id)">查看</el-button>
                    <el-button size="small" type="warning" @click="onRemoveCollect(scope.row.id)">取消收藏</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <el-tab-pane label="我的下载" name="downloaded">
            <div v-if="downloadedNotes.length === 0" class="empty-state">
              <el-icon><Download /></el-icon>
              <p>还没有下载笔记</p>
              <el-button @click="router.push('/notes')">去浏览</el-button>
            </div>
            <div v-else class="notes-table">
              <el-table :data="downloadedNotes" border>
                <el-table-column prop="title" label="笔记标题" min-width="150" />
                <el-table-column prop="course" label="课程" width="120" />
                <el-table-column prop="author" label="作者" width="100" />
                <el-table-column label="下载时间" width="120">
                  <template #default="scope">
                    {{ (scope.row as any).downloadTime || '刚刚' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template #default="scope">
                    <el-button size="small" @click="viewNote(scope.row.id)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="actions-section">
        <div class="action-card" @click="router.push('/vip')">
          <div class="action-icon vip-icon">
            <el-icon><Medal /></el-icon>
          </div>
          <div class="action-content">
            <h3>升级VIP会员</h3>
            <p>无限下载、专属客服、优先推荐</p>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>

        <div class="action-card" @click="showRechargeDialog = true">
          <div class="action-icon points-icon">
            <el-icon><Wallet /></el-icon>
          </div>
          <div class="action-content">
            <h3>积分充值</h3>
            <p>1元 = 10积分</p>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <!-- 编辑笔记对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑笔记" width="500px">
      <el-form v-if="editingNote" label-width="100px">
        <el-form-item label="笔记标题">
          <el-input v-model="editingNote.title" placeholder="笔记标题" />
        </el-form-item>
        <el-form-item label="所属课程">
          <el-input v-model="editingNote.course" placeholder="课程名称" />
        </el-form-item>
        <el-form-item label="内容描述">
          <el-input
            v-model="editingNote.content"
            type="textarea"
            :rows="3"
            placeholder="笔记内容描述"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-input
            v-model="editingTagsInput"
            placeholder="输入标签，用逗号分隔"
          />
          <div class="edit-tags-preview">
            <span
              v-for="tag in editingNote.tags"
              :key="tag"
              class="edit-tag"
              @click="removeEditTag(tag)"
            >
              {{ tag }} ✕
            </span>
          </div>
        </el-form-item>
        <el-form-item label="积分定价">
          <el-slider
            v-model="editingNote.price"
            :min="0"
            :max="50"
            :step="1"
          />
          <span class="price-hint">{{ editingNote.price }} 积分</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveEditNote">保存修改</el-button>
      </template>
    </el-dialog>

    <!-- 积分充值对话框 -->
    <el-dialog v-model="showRechargeDialog" title="积分充值" width="420px">
      <div class="recharge-options">
        <div
          v-for="option in rechargeOptions"
          :key="option.amount"
          class="recharge-option"
          :class="{ selected: selectedRecharge === option.amount }"
          @click="selectedRecharge = option.amount"
        >
          <div class="recharge-amount">
            <span class="amount-value">{{ option.points }}</span>
            <span class="amount-unit">积分</span>
          </div>
          <div class="recharge-price">¥{{ option.price }}</div>
          <div v-if="option.bonus" class="recharge-bonus">+{{ option.bonus }}积分赠送</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showRechargeDialog = false">取消</el-button>
        <el-button type="primary" :disabled="!selectedRecharge" @click="onRecharge">
          确认充值
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  Document,
  StarFilled,
  Download,
  Medal,
  Wallet,
  ArrowRight
} from '@element-plus/icons-vue'
import {
  userPoints, userIsVip, currentUserInfo,
  downloadedNotes, uploadedNotes, collectedNotes,
  deleteUploadedNote, toggleCollect, rechargePoints, editUploadedNote
} from '@/data/userState'
import type { Note } from '@/types'

const router = useRouter()
const activeTab = ref('uploaded')

// 编辑笔记
const showEditDialog = ref(false)
const editingNote = ref<Note | null>(null)
const editingTagsInput = ref('')

const startEditNote = (note: Note) => {
  editingNote.value = { ...note }
  editingTagsInput.value = ''
  showEditDialog.value = true
}

const saveEditNote = () => {
  if (!editingNote.value) return
  editUploadedNote(editingNote.value.id, {
    title: editingNote.value.title,
    course: editingNote.value.course,
    content: editingNote.value.content,
    price: editingNote.value.price,
    tags: editingNote.value.tags
  })
  showEditDialog.value = false
  alert('笔记修改成功！')
}

// 编辑标签处理
watch(editingTagsInput, (val) => {
  if (val.includes(',') && editingNote.value) {
    const newTags = val.split(',').filter(t => t.trim())
    editingNote.value.tags = [...new Set([...editingNote.value.tags, ...newTags])]
    editingTagsInput.value = ''
  }
})

const removeEditTag = (tag: string) => {
  if (!editingNote.value) return
  const index = editingNote.value.tags.indexOf(tag)
  if (index > -1) {
    editingNote.value.tags.splice(index, 1)
  }
}

// 积分充值
const showRechargeDialog = ref(false)
const selectedRecharge = ref(0)

const rechargeOptions = [
  { amount: 1, points: 100, price: 10, bonus: 0 },
  { amount: 2, points: 300, price: 30, bonus: 20 },
  { amount: 3, points: 500, price: 50, bonus: 50 },
  { amount: 4, points: 1000, price: 100, bonus: 150 }
]

const onRecharge = () => {
  if (!selectedRecharge.value) return
  const option = rechargeOptions.find(o => o.amount === selectedRecharge.value)
  if (!option) return
  const totalPoints = option.points + option.bonus
  rechargePoints(totalPoints)
  showRechargeDialog.value = false
  selectedRecharge.value = 0
  alert(`充值成功！获得 ${totalPoints} 积分（含${option.bonus}积分赠送）`)
}

// 收藏相关
const onRemoveCollect = (noteId: number) => {
  const note = collectedNotes.value.find(n => n.id === noteId)
  if (note) {
    toggleCollect(note)
  }
}

const viewNote = (id: number) => {
  router.push(`/note/${id}`)
}

const deleteNote = (id: number) => {
  if (confirm('确定要删除这份笔记吗？')) {
    deleteUploadedNote(id)
    alert('笔记已删除')
  }
}
</script>

<style scoped>
.profile-page {
  padding: 30px 0;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 24px;
  color: white;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.avatar :deep(.el-icon) {
  font-size: 40px;
}

.user-info h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-info p {
  opacity: 0.9;
  margin-bottom: 8px;
}

.user-tags {
  display: flex;
  gap: 8px;
}

.vip-tag {
  padding: 4px 12px;
  background-color: #fbbf24;
  color: #92400e;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.level-tag {
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-box {
  text-align: center;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.tabs-section {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.profile-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.empty-state :deep(.el-icon) {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
  margin-bottom: 16px;
}

.notes-table {
  overflow-x: auto;
}

.actions-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.vip-icon {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.vip-icon :deep(.el-icon) {
  color: #92400e;
  font-size: 28px;
}

.points-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.points-icon :deep(.el-icon) {
  color: white;
  font-size: 28px;
}

.action-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.action-content p {
  font-size: 13px;
  color: #666;
}

.arrow-icon {
  margin-left: auto;
  color: #ccc;
}

/* Edit dialog styles */
.edit-tags-preview {
  margin-top: 8px;
}

.edit-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #eef2ff;
  color: #4338ca;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-tag:hover {
  background: #c7d2fe;
}

.price-hint {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

/* Recharge dialog styles */
.recharge-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.recharge-option {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recharge-option:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.recharge-option.selected {
  border-color: #667eea;
  background: #eef2ff;
}

.recharge-amount {
  margin-bottom: 8px;
}

.amount-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.amount-unit {
  font-size: 13px;
  color: #94a3b8;
  margin-left: 4px;
}

.recharge-price {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 4px;
}

.recharge-bonus {
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

@media (max-width: 768px) {
  .actions-section {
    grid-template-columns: 1fr;
  }
  .recharge-options {
    grid-template-columns: 1fr;
  }
}
</style>