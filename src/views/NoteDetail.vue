<template>
  <div class="note-detail-page">
    <div class="container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-content">
        <el-loading-spinner />
        <p>加载中...</p>
      </div>
      
      <!-- 笔记内容 -->
      <div v-else-if="note" class="detail-content">
        <div class="note-header">
          <div class="quality-badge" :class="`quality-${note.quality}`">
            {{ qualityText }}
          </div>
          <span class="file-type">{{ fileTypeText }}</span>
        </div>

        <h1 class="note-title">{{ note.title }}</h1>

        <div class="note-meta">
          <span class="meta-item">
            <el-icon><Reading /></el-icon>
            {{ note.course }}
          </span>
          <span class="meta-item">
            <el-icon><OfficeBuilding /></el-icon>
            {{ note.major }}
          </span>
          <span class="meta-item">
            <el-icon><School /></el-icon>
            {{ note.grade }}
          </span>
        </div>

        <div class="author-section">
          <div class="author-info">
            <div class="author-avatar">
              <el-icon><User /></el-icon>
            </div>
            <div class="author-detail">
              <span class="author-name">{{ note.author }}</span>
              <span class="author-meta">{{ note.major }} · {{ note.grade }}</span>
            </div>
          </div>
          <div class="author-stats">
            <span>上传 {{ note.authorId * 12 }} 份笔记</span>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <el-icon><Download /></el-icon>
            <span>下载 {{ note.downloadCount }}</span>
          </div>
          <div class="stat-item">
            <el-icon><Star /></el-icon>
            <span>评分 {{ note.rating }}</span>
          </div>
          <div class="stat-item">
            <el-icon><Message /></el-icon>
            <span>{{ note.reviewCount }} 条评论</span>
          </div>
          <div class="stat-item">
            <el-icon><Calendar /></el-icon>
            <span>{{ note.uploadTime }}</span>
          </div>
        </div>

        <div class="tags-section">
          <span class="tags-label">标签</span>
          <span v-for="tag in note.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="preview-section">
          <h3>内容预览</h3>
          <div class="preview-content">
            {{ note.content }}
          </div>
        </div>

        <div class="actions-section">
          <div class="price-display">
            <span v-if="note.price === 0" class="free">免费</span>
            <span v-else class="price">{{ note.price }} 积分</span>
            <span class="user-points">您当前有 {{ userPoints }} 积分</span>
          </div>
          <div class="action-buttons">
            <el-button
              class="collect-action-btn"
              :class="{ collected: noteCollected }"
              @click="onToggleCollect"
              size="large"
            >
              <el-icon><StarFilled v-if="noteCollected" /><Star v-else /></el-icon>
              {{ noteCollected ? '已收藏' : '收藏' }}
            </el-button>
            <el-button
              v-if="noteDownloaded"
              type="success"
              size="large"
              @click="onViewPdf"
            >
              <el-icon><View /></el-icon>
              查看PDF
            </el-button>
            <el-button
              v-else
              type="primary"
              size="large"
              @click="onDownload"
              :disabled="userPoints < note.price || !canDownloadNow"
            >
              <el-icon><Download /></el-icon>
              立即下载
            </el-button>
          </div>
        </div>

        <div class="review-section">
          <h3>用户评价 ({{ reviews.length }})</h3>

          <!-- 发表评论 -->
          <div class="review-form">
            <h4>发表评价</h4>
            <div class="rating-input">
              <span class="rating-label">评分：</span>
              <el-rate v-model="newRating" :max="5" show-score />
            </div>
            <el-input
              v-model="newReviewContent"
              type="textarea"
              :rows="3"
              placeholder="写下你对这份笔记的评价..."
              maxlength="500"
              show-word-limit
            />
            <el-button
              type="primary"
              class="submit-review-btn"
              :disabled="!newReviewContent.trim() || newRating === 0"
              @click="onSubmitReview"
            >
              发表评价
            </el-button>
          </div>

          <div class="review-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="reviewer-info">
                  <div class="reviewer-avatar">
                    <el-icon><User /></el-icon>
                  </div>
                  <div>
                    <span class="reviewer-name">{{ review.userName }}</span>
                    <span class="review-time">{{ review.createTime }}</span>
                  </div>
                </div>
                <div class="review-rating">
                  <el-icon v-for="i in 5" :key="i" class="star" :class="{ filled: i <= review.rating }">
                    <Star />
                  </el-icon>
                </div>
              </div>
              <p class="review-content">{{ review.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <el-icon class="empty-icon"><HelpFilled /></el-icon>
        <p>笔记不存在或已被删除</p>
        <el-button @click="$router.back()">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import {
  Reading, OfficeBuilding, School, User, Download,
  Star, StarFilled, Message, Calendar, View, HelpFilled
} from '@element-plus/icons-vue'
import { mockNotes } from '@/data/mockData'
import { uploadedNotes } from '@/data/userState'

// 合并所有笔记
const allNotes = computed(() => [...mockNotes, ...uploadedNotes.value])
import type { Note } from '@/types'
import {
  userPoints, handleDownload, isNoteDownloaded, canDownload,
  toggleCollect, isNoteCollected, currentUsername, addReview, getReviewsForNote
} from '@/data/userState'
import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

// 正确处理 vfs_fonts 的导入
const vfsData = (pdfFonts as any).default?.pdfMake?.vfs || (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs || {}
if (Object.keys(vfsData).length > 0) {
  Object.assign((pdfMake as any).vfs, vfsData)
}

const route = useRoute()
const note = ref<Note | null>(null)
const noteDownloaded = ref(false)
const noteCollected = ref(false)
const loading = ref(true)

// 评论相关
const newRating = ref(0)
const newReviewContent = ref('')

// Mock评论（所有43条笔记各有3条不同评论）
const mockReviews = [
  // 笔记1：Python编程
  { id: 1, noteId: 1, userId: 101, userName: '何诗涵', content: '笔记非常详细，知识点覆盖全面，期末复习全靠它了！', rating: 5, createTime: '2026-01-16' },
  { id: 2, noteId: 1, userId: 102, userName: '陈冠宇', content: '内容很清晰，作者辛苦了！', rating: 5, createTime: '2026-01-15' },
  { id: 3, noteId: 1, userId: 103, userName: '黄', content: '例题讲解很到位，推荐！', rating: 4, createTime: '2026-01-14' },
  // 笔记2：Java程序设计
  { id: 4, noteId: 2, userId: 104, userName: '张小明', content: '继承和多态讲得很清楚，终于理解了！', rating: 5, createTime: '2026-01-15' },
  { id: 5, noteId: 2, userId: 105, userName: '李小红', content: '代码示例很实用，收藏了！', rating: 4, createTime: '2026-01-14' },
  { id: 6, noteId: 2, userId: 106, userName: '王磊', content: '设计模式部分讲得很深入，感谢分享！', rating: 5, createTime: '2026-01-13' },
  // 笔记3：数据挖掘
  { id: 7, noteId: 3, userId: 107, userName: '刘洋', content: '聚类算法讲解很详细，适合进阶学习！', rating: 5, createTime: '2026-01-18' },
  { id: 8, noteId: 3, userId: 108, userName: '陈思思', content: '关联规则挖掘部分稍微难懂，其他都很棒！', rating: 4, createTime: '2026-01-17' },
  { id: 9, noteId: 3, userId: 109, userName: '赵文', content: '案例分析很有价值，帮我完成了课程项目！', rating: 5, createTime: '2026-01-16' },
  // 笔记4：Web开发
  { id: 10, noteId: 4, userId: 110, userName: '孙丽', content: '免费笔记质量这么好，太良心了！', rating: 5, createTime: '2026-01-20' },
  { id: 11, noteId: 4, userId: 111, userName: '周强', content: 'HTML和CSS部分讲得很系统，适合入门！', rating: 4, createTime: '2026-01-19' },
  { id: 12, noteId: 4, userId: 112, userName: '吴涛', content: 'JavaScript部分希望能再详细一些', rating: 4, createTime: '2026-01-18' },
  // 笔记5：人工智能
  { id: 13, noteId: 5, userId: 113, userName: '郑华', content: '神经网络讲解通俗易懂，入门首选！', rating: 5, createTime: '2026-01-21' },
  { id: 14, noteId: 5, userId: 114, userName: '杨帆', content: '深度学习框架介绍很全面，值得学习！', rating: 5, createTime: '2026-01-20' },
  { id: 15, noteId: 5, userId: 115, userName: '林立', content: '机器学习算法部分稍微有点深奥', rating: 4, createTime: '2026-01-19' },
  // 笔记6：软件工程
  { id: 16, noteId: 6, userId: 116, userName: '赵敏', content: '敏捷开发流程讲得很清楚，对工作很有帮助！', rating: 5, createTime: '2026-01-22' },
  { id: 17, noteId: 6, userId: 117, userName: '王磊', content: '项目管理部分很实用，收藏了！', rating: 4, createTime: '2026-01-21' },
  { id: 18, noteId: 6, userId: 118, userName: '陈强', content: '测试方法总结得很到位！', rating: 5, createTime: '2026-01-20' },
  // 笔记7：高等数学
  { id: 19, noteId: 7, userId: 119, userName: '沈燕', content: '免费笔记太良心了，知识点总结很全！', rating: 5, createTime: '2026-01-17' },
  { id: 20, noteId: 7, userId: 120, userName: '梁浩', content: '极限和导数部分讲解很细致！', rating: 5, createTime: '2026-01-16' },
  { id: 21, noteId: 7, userId: 121, userName: '钟鸣', content: '积分练习题答案很详细，复习的好帮手！', rating: 4, createTime: '2026-01-15' },
  // 笔记8：线性代数
  { id: 22, noteId: 8, userId: 122, userName: '胡强', content: '矩阵运算技巧总结得很实用！', rating: 5, createTime: '2026-01-18' },
  { id: 23, noteId: 8, userId: 123, userName: '罗琳', content: '特征值和特征向量讲得很清楚！', rating: 5, createTime: '2026-01-17' },
  { id: 24, noteId: 8, userId: 124, userName: '宋杰', content: '向量空间部分稍微有点难懂', rating: 4, createTime: '2026-01-16' },
  // 笔记9：概率论
  { id: 25, noteId: 9, userId: 125, userName: '唐静', content: '随机变量部分讲解很透彻！', rating: 5, createTime: '2026-01-19' },
  { id: 26, noteId: 9, userId: 126, userName: '邓伟', content: '假设检验部分配有例题，很好理解！', rating: 4, createTime: '2026-01-18' },
  { id: 27, noteId: 9, userId: 127, userName: '彭丽', content: '参数估计部分稍微有点简略', rating: 4, createTime: '2026-01-17' },
  // 笔记10：数据结构与算法
  { id: 28, noteId: 10, userId: 128, userName: '廖峰', content: '排序算法复杂度分析很详细！', rating: 5, createTime: '2026-01-15' },
  { id: 29, noteId: 10, userId: 129, userName: '谭敏', content: '二叉树和图的部分讲得很好！', rating: 5, createTime: '2026-01-14' },
  { id: 30, noteId: 10, userId: 130, userName: '周萍', content: '期末考试全靠这份笔记了，感谢！', rating: 5, createTime: '2026-01-13' },
  // 笔记11：操作系统
  { id: 31, noteId: 11, userId: 131, userName: '吴涛', content: '进程管理讲解很清晰！', rating: 5, createTime: '2026-01-10' },
  { id: 32, noteId: 11, userId: 132, userName: '郑华', content: '内存管理部分稍微有点深奥', rating: 4, createTime: '2026-01-09' },
  { id: 33, noteId: 11, userId: 133, userName: '杨帆', content: '文件系统部分总结得很到位！', rating: 5, createTime: '2026-01-08' },
  // 笔记12：计算机网络
  { id: 34, noteId: 12, userId: 134, userName: '林立', content: 'TCP/IP协议栈讲解很系统！', rating: 5, createTime: '2026-01-12' },
  { id: 35, noteId: 12, userId: 135, userName: '赵敏', content: 'HTTP协议部分很详细！', rating: 5, createTime: '2026-01-11' },
  { id: 36, noteId: 12, userId: 136, userName: '王磊', content: '网络安全部分稍微简略了一些', rating: 4, createTime: '2026-01-10' },
  // 笔记13：数据库系统
  { id: 37, noteId: 13, userId: 137, userName: '陈强', content: 'SQL语句练习题很实用！', rating: 5, createTime: '2026-01-08' },
  { id: 38, noteId: 13, userId: 138, userName: '沈燕', content: '数据库设计范式讲得很清楚！', rating: 5, createTime: '2026-01-07' },
  { id: 39, noteId: 13, userId: 139, userName: '梁浩', content: '事务管理部分需要再详细一些', rating: 4, createTime: '2026-01-06' },
  // 笔记14：微观经济学
  { id: 40, noteId: 14, userId: 140, userName: '钟鸣', content: '供需理论讲解很生动！', rating: 5, createTime: '2026-01-05' },
  { id: 41, noteId: 14, userId: 141, userName: '胡强', content: '弹性分析部分配有图表，很好理解！', rating: 5, createTime: '2026-01-04' },
  { id: 42, noteId: 14, userId: 142, userName: '罗琳', content: '市场结构分析很全面！', rating: 4, createTime: '2026-01-03' },
  // 笔记15：宏观经济学
  { id: 43, noteId: 15, userId: 143, userName: '宋杰', content: 'IS-LM模型讲解很透彻！', rating: 5, createTime: '2026-01-14' },
  { id: 44, noteId: 15, userId: 144, userName: '唐静', content: '货币政策分析很详细！', rating: 5, createTime: '2026-01-13' },
  { id: 45, noteId: 15, userId: 145, userName: '邓伟', content: '通货膨胀部分稍微难懂', rating: 4, createTime: '2026-01-12' },
  // 笔记16：计量经济学
  { id: 46, noteId: 16, userId: 146, userName: '彭丽', content: '回归分析讲解很专业！', rating: 5, createTime: '2026-01-11' },
  { id: 47, noteId: 16, userId: 147, userName: '廖峰', content: 'Stata操作指南很实用！', rating: 5, createTime: '2026-01-10' },
  { id: 48, noteId: 16, userId: 148, userName: '谭敏', content: '时间序列分析部分很深入！', rating: 5, createTime: '2026-01-09' },
  // 笔记17：国际经济学
  { id: 49, noteId: 17, userId: 149, userName: '周萍', content: '国际贸易理论很系统！', rating: 4, createTime: '2026-01-09' },
  { id: 50, noteId: 17, userId: 150, userName: '吴涛', content: '汇率决定理论讲得很清楚！', rating: 5, createTime: '2026-01-08' },
  { id: 51, noteId: 17, userId: 151, userName: '郑华', content: '内容很全面，推荐！', rating: 4, createTime: '2026-01-07' },
  // 笔记18：管理学原理
  { id: 52, noteId: 18, userId: 152, userName: '杨帆', content: '组织理论讲解很清晰！', rating: 5, createTime: '2026-01-13' },
  { id: 53, noteId: 18, userId: 153, userName: '林立', content: '领导理论部分很实用！', rating: 4, createTime: '2026-01-12' },
  { id: 54, noteId: 18, userId: 154, userName: '赵敏', content: '决策方法总结得很到位！', rating: 5, createTime: '2026-01-11' },
  // 笔记19：人力资源管理
  { id: 55, noteId: 19, userId: 155, userName: '王磊', content: '招聘与选拔技巧很实用！', rating: 4, createTime: '2026-01-16' },
  { id: 56, noteId: 19, userId: 156, userName: '陈强', content: '绩效管理部分讲得很好！', rating: 5, createTime: '2026-01-15' },
  { id: 57, noteId: 19, userId: 157, userName: '沈燕', content: '薪酬管理部分稍微简略了一些', rating: 4, createTime: '2026-01-14' },
  // 笔记20：财务管理
  { id: 58, noteId: 20, userId: 158, userName: '梁浩', content: '财务报表分析很详细！', rating: 5, createTime: '2026-01-07' },
  { id: 59, noteId: 20, userId: 159, userName: '钟鸣', content: '投资决策部分讲得很透彻！', rating: 5, createTime: '2026-01-06' },
  { id: 60, noteId: 20, userId: 160, userName: '胡强', content: '资本结构理论很专业！', rating: 4, createTime: '2026-01-05' },
  // 笔记21：市场营销
  { id: 61, noteId: 21, userId: 161, userName: '罗琳', content: '4P营销策略讲得很系统！', rating: 5, createTime: '2026-01-06' },
  { id: 62, noteId: 21, userId: 162, userName: '宋杰', content: '消费者行为分析很深入！', rating: 4, createTime: '2026-01-05' },
  { id: 63, noteId: 21, userId: 163, userName: '唐静', content: '品牌管理部分稍微有点浅', rating: 4, createTime: '2026-01-04' },
  // 笔记22：大学英语四级
  { id: 64, noteId: 22, userId: 164, userName: '邓伟', content: '免费词汇表太良心了！', rating: 5, createTime: '2026-01-04' },
  { id: 65, noteId: 22, userId: 165, userName: '彭丽', content: '按字母顺序排列很方便背诵！', rating: 5, createTime: '2026-01-03' },
  { id: 66, noteId: 22, userId: 166, userName: '廖峰', content: '例句很地道，对写作很有帮助！', rating: 5, createTime: '2026-01-02' },
  // 笔记23：专业英语
  { id: 67, noteId: 23, userId: 167, userName: '谭敏', content: '计算机专业术语很全面！', rating: 5, createTime: '2026-01-03' },
  { id: 68, noteId: 23, userId: 168, userName: '周萍', content: '翻译技巧很实用！', rating: 4, createTime: '2026-01-02' },
  { id: 69, noteId: 23, userId: 169, userName: '吴涛', content: '科技英语写作指南很到位！', rating: 5, createTime: '2026-01-01' },
  // 笔记24：商务英语
  { id: 70, noteId: 24, userId: 170, userName: '郑华', content: '商务邮件写作模板很实用！', rating: 5, createTime: '2026-01-02' },
  { id: 71, noteId: 24, userId: 171, userName: '杨帆', content: '合同撰写指南很专业！', rating: 4, createTime: '2026-01-01' },
  { id: 72, noteId: 24, userId: 172, userName: '林立', content: '商务报告格式很规范！', rating: 4, createTime: '2025-12-31' },
  // 笔记25：量子力学
  { id: 73, noteId: 25, userId: 173, userName: '赵敏', content: '波粒二象性讲解很透彻！', rating: 5, createTime: '2026-01-01' },
  { id: 74, noteId: 25, userId: 174, userName: '王磊', content: '薛定谔方程推导很详细！', rating: 5, createTime: '2025-12-31' },
  { id: 75, noteId: 25, userId: 175, userName: '陈强', content: '量子态部分稍微有点难', rating: 4, createTime: '2025-12-30' },
  // 笔记26：热学
  { id: 76, noteId: 26, userId: 176, userName: '沈燕', content: '热力学定律总结得很清晰！', rating: 5, createTime: '2026-01-17' },
  { id: 77, noteId: 26, userId: 177, userName: '梁浩', content: '统计物理学基础讲得很好！', rating: 4, createTime: '2026-01-16' },
  { id: 78, noteId: 26, userId: 178, userName: '钟鸣', content: '熵的概念解释很到位！', rating: 5, createTime: '2026-01-15' },
  // 笔记27：大学物理
  { id: 79, noteId: 27, userId: 179, userName: '胡强', content: '免费习题解答太良心了！', rating: 5, createTime: '2026-01-18' },
  { id: 80, noteId: 27, userId: 180, userName: '罗琳', content: '力学部分讲得很详细！', rating: 5, createTime: '2026-01-17' },
  { id: 81, noteId: 27, userId: 181, userName: '宋杰', content: '电磁学习题解答很完整！', rating: 4, createTime: '2026-01-16' },
  // 笔记28：无机化学
  { id: 82, noteId: 28, userId: 182, userName: '唐静', content: '元素周期律总结得很系统！', rating: 5, createTime: '2026-01-17' },
  { id: 83, noteId: 28, userId: 183, userName: '邓伟', content: '化学键部分讲解很清晰！', rating: 4, createTime: '2026-01-16' },
  { id: 84, noteId: 28, userId: 184, userName: '彭丽', content: '化学反应方程式很全面！', rating: 5, createTime: '2026-01-15' },
  // 笔记29：有机化学
  { id: 85, noteId: 29, userId: 185, userName: '廖峰', content: '官能团性质讲得很详细！', rating: 5, createTime: '2026-01-18' },
  { id: 86, noteId: 29, userId: 186, userName: '谭敏', content: '反应机理分析很透彻！', rating: 5, createTime: '2026-01-17' },
  { id: 87, noteId: 29, userId: 187, userName: '周萍', content: '烃类化合物总结很到位！', rating: 4, createTime: '2026-01-16' },
  // 笔记30：分析化学
  { id: 88, noteId: 30, userId: 188, userName: '吴涛', content: '滴定分析操作步骤很详细！', rating: 5, createTime: '2026-01-19' },
  { id: 89, noteId: 30, userId: 189, userName: '郑华', content: '光谱分析部分很专业！', rating: 4, createTime: '2026-01-18' },
  { id: 90, noteId: 30, userId: 190, userName: '杨帆', content: '色谱分析数据处理很实用！', rating: 4, createTime: '2026-01-17' },
  // 笔记31：刑法学
  { id: 91, noteId: 31, userId: 191, userName: '林立', content: '犯罪构成要件讲得很清晰！', rating: 5, createTime: '2026-01-17' },
  { id: 92, noteId: 31, userId: 192, userName: '赵敏', content: '刑罚体系总结很系统！', rating: 5, createTime: '2026-01-16' },
  { id: 93, noteId: 31, userId: 193, userName: '王磊', content: '案例分析很有参考价值！', rating: 5, createTime: '2026-01-15' },
  // 笔记32：民法学
  { id: 94, noteId: 32, userId: 194, userName: '陈强', content: '物权法讲解很详细！', rating: 5, createTime: '2026-01-18' },
  { id: 95, noteId: 32, userId: 195, userName: '沈燕', content: '债权法部分很全面！', rating: 5, createTime: '2026-01-17' },
  { id: 96, noteId: 32, userId: 196, userName: '梁浩', content: '合同法要点总结很到位！', rating: 4, createTime: '2026-01-16' },
  // 笔记33：法律基础
  { id: 97, noteId: 33, userId: 197, userName: '钟鸣', content: '免费法律笔记太良心了！', rating: 5, createTime: '2026-01-07' },
  { id: 98, noteId: 33, userId: 198, userName: '胡强', content: '各部门法概述很清晰！', rating: 4, createTime: '2026-01-06' },
  { id: 99, noteId: 33, userId: 199, userName: '罗琳', content: '宪法基础部分讲得很好！', rating: 5, createTime: '2026-01-05' },
  // 笔记34：复变函数
  { id: 100, noteId: 34, userId: 200, userName: '宋杰', content: '解析函数性质讲得很透彻！', rating: 5, createTime: '2026-01-17' },
  { id: 101, noteId: 34, userId: 201, userName: '唐静', content: '复积分方法总结很到位！', rating: 5, createTime: '2026-01-16' },
  { id: 102, noteId: 34, userId: 202, userName: '邓伟', content: '级数展开部分稍微有点难', rating: 4, createTime: '2026-01-15' },
  // 笔记35：实变函数
  { id: 103, noteId: 35, userId: 203, userName: '彭丽', content: '测度论讲解很深入！', rating: 5, createTime: '2026-01-18' },
  { id: 104, noteId: 35, userId: 204, userName: '廖峰', content: '勒贝格积分讲得很清晰！', rating: 5, createTime: '2026-01-17' },
  { id: 105, noteId: 35, userId: 205, userName: '谭敏', content: '函数空间部分很专业！', rating: 5, createTime: '2026-01-16' },
  // 笔记36：常微分方程
  { id: 106, noteId: 36, userId: 206, userName: '周萍', content: '一阶方程求解方法很系统！', rating: 5, createTime: '2026-01-19' },
  { id: 107, noteId: 36, userId: 207, userName: '吴涛', content: '线性方程组部分讲得很好！', rating: 5, createTime: '2026-01-18' },
  { id: 108, noteId: 36, userId: 208, userName: '郑华', content: '稳定性分析稍微有点深奥', rating: 4, createTime: '2026-01-17' },
  // 笔记37：电路原理
  { id: 109, noteId: 37, userId: 209, userName: '杨帆', content: '基尔霍夫定律讲解很清晰！', rating: 5, createTime: '2026-01-15' },
  { id: 110, noteId: 37, userId: 210, userName: '林立', content: '交流电路分析很详细！', rating: 4, createTime: '2026-01-14' },
  { id: 111, noteId: 37, userId: 211, userName: '赵敏', content: '三相电路部分很实用！', rating: 5, createTime: '2026-01-13' },
  // 笔记38：模拟电子
  { id: 112, noteId: 38, userId: 212, userName: '王磊', content: '晶体管原理讲得很透彻！', rating: 5, createTime: '2026-01-13' },
  { id: 113, noteId: 38, userId: 213, userName: '陈强', content: '放大电路分析很详细！', rating: 5, createTime: '2026-01-12' },
  { id: 114, noteId: 38, userId: 214, userName: '沈燕', content: '滤波电路设计很实用！', rating: 4, createTime: '2026-01-11' },
  // 笔记39：会计学
  { id: 115, noteId: 39, userId: 215, userName: '梁浩', content: '会计科目设置很清晰！', rating: 5, createTime: '2026-01-09' },
  { id: 116, noteId: 39, userId: 216, userName: '钟鸣', content: '记账方法讲解很系统！', rating: 4, createTime: '2026-01-08' },
  { id: 117, noteId: 39, userId: 217, userName: '胡强', content: '财务报表编制很详细！', rating: 5, createTime: '2026-01-07' },
  // 笔记40：数值分析
  { id: 118, noteId: 40, userId: 218, userName: '罗琳', content: '插值法讲解很详细！', rating: 5, createTime: '2026-01-08' },
  { id: 119, noteId: 40, userId: 219, userName: '宋杰', content: '数值积分方法很实用！', rating: 5, createTime: '2026-01-07' },
  { id: 120, noteId: 40, userId: 220, userName: '唐静', content: '方程求解算法很全面！', rating: 4, createTime: '2026-01-06' }
]

// 评论列表（初始为空，根据笔记ID加载对应的mock评论）
const reviews = ref<any[]>([])

const qualityText = computed(() => {
  const map: Record<string, string> = {
    'excellent': '精品',
    'good': '优质',
    'normal': '普通'
  }
  return note.value ? map[note.value.quality] || '普通' : ''
})

const fileTypeText = computed(() => {
  return 'PDF文档'
})

const canDownloadNow = computed(() => {
  return canDownload()
})

// 发表评论
const onSubmitReview = () => {
  if (!note.value || !newReviewContent.value.trim() || newRating.value === 0) return

  const userName = currentUsername.value || '匿名用户'
  
  // 添加到全局评论存储
  addReview(note.value.id, newReviewContent.value.trim(), newRating.value, userName)
  
  // 添加到本地评论列表
  const newReview = {
    id: Date.now(),
    noteId: note.value.id,
    userId: 999,
    userName,
    content: newReviewContent.value.trim(),
    rating: newRating.value,
    createTime: new Date().toISOString().split('T')[0]
  }

  reviews.value.unshift(newReview)
  newReviewContent.value = ''
  newRating.value = 0
}

// 收藏切换
const onToggleCollect = () => {
  if (!note.value) return
  const result = toggleCollect(note.value)
  noteCollected.value = result
}

const onDownload = () => {
  if (!note.value) return

  const price = note.value.price
  const priceMsg = price === 0 ? '免费下载' : `扣除 ${price} 积分`

  if (handleDownload(note.value)) {
    noteDownloaded.value = true
    generatePdf(note.value)
    alert(`下载成功！${priceMsg}\n\n笔记标题: ${note.value.title}\n课程: ${note.value.course}\n作者: ${note.value.author}`)
  }
}

// 根据课程获取对应的内容
const getCourseContent = (courseName: string) => {
  const courseData: Record<string, {
    intro: string
    keyPoints: string[]
    detailedContent: { point: string; importance: string; requirement: string }[]
    summary: string[]
  }> = {
    'Python编程': {
      intro: 'Python is a high-level programming language known for its simplicity and readability. This course covers the fundamentals of Python programming, including syntax, data types, control structures, functions, and object-oriented programming. Python is widely used in web development, data science, artificial intelligence, and automation.',
      keyPoints: [
        'Python syntax and basic data types (int, float, string, list, tuple, dictionary)',
        'Control structures: if-else, loops (for, while), break, continue',
        'Functions: definition, parameters, return values, lambda functions',
        'Object-Oriented Programming: classes, objects, inheritance, polymorphism',
        'File handling and exception handling'
      ],
      detailedContent: [
        { point: 'Basic Syntax', importance: '★★★★★', requirement: 'Master' },
        { point: 'Data Structures', importance: '★★★★★', requirement: 'Master' },
        { point: 'Functions', importance: '★★★★★', requirement: 'Master' },
        { point: 'OOP Concepts', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'File I/O', importance: '★★★☆☆', requirement: 'Know' }
      ],
      summary: [
        'Python is versatile and beginner-friendly',
        'Mastery of basic syntax is essential',
        'OOP concepts are important for larger projects',
        'Python has rich libraries for various domains'
      ]
    },
    'Java程序设计': {
      intro: 'Java is a popular object-oriented programming language used for building enterprise applications, Android apps, and large-scale systems. This course covers Java fundamentals, including classes, objects, inheritance, exception handling, multithreading, and Java collections framework.',
      keyPoints: [
        'Java syntax and primitive data types',
        'Object-Oriented Programming: classes, objects, encapsulation',
        'Inheritance, polymorphism, and interfaces',
        'Exception handling and error management',
        'Multithreading and concurrency'
      ],
      detailedContent: [
        { point: 'Java Basics', importance: '★★★★★', requirement: 'Master' },
        { point: 'OOP Principles', importance: '★★★★★', requirement: 'Master' },
        { point: 'Exception Handling', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Multithreading', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Collections Framework', importance: '★★★★☆', requirement: 'Master' }
      ],
      summary: [
        'Java is platform-independent (Write Once, Run Anywhere)',
        'Strong OOP foundation is crucial',
        'Exception handling improves code robustness',
        'Multithreading enables concurrent programming'
      ]
    },
    '数据挖掘': {
      intro: 'Data Mining is the process of discovering patterns and extracting useful information from large datasets. This course covers data preprocessing, exploratory data analysis, classification, clustering, association rules, and evaluation metrics.',
      keyPoints: [
        'Data preprocessing: cleaning, transformation, normalization',
        'Exploratory Data Analysis (EDA) techniques',
        'Classification algorithms: decision trees, SVM, Naive Bayes',
        'Clustering algorithms: K-means, hierarchical clustering',
        'Association rule mining: Apriori algorithm'
      ],
      detailedContent: [
        { point: 'Data Preprocessing', importance: '★★★★★', requirement: 'Master' },
        { point: 'EDA Techniques', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Classification', importance: '★★★★★', requirement: 'Master' },
        { point: 'Clustering', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Association Rules', importance: '★★★☆☆', requirement: 'Know' }
      ],
      summary: [
        'Data quality is crucial for mining success',
        'EDA helps understand data characteristics',
        'Choose appropriate algorithms based on data type',
        'Evaluation metrics validate model performance'
      ]
    },
    'Web开发': {
      intro: 'Web Development involves creating websites and web applications. This course covers HTML, CSS, JavaScript, frontend frameworks, backend development, and database integration.',
      keyPoints: [
        'HTML5 structure and semantic tags',
        'CSS3 styling, Flexbox, Grid layouts',
        'JavaScript fundamentals and ES6+ features',
        'Frontend frameworks: Vue.js, React, Angular',
        'Backend development with Node.js and databases'
      ],
      detailedContent: [
        { point: 'HTML/CSS', importance: '★★★★★', requirement: 'Master' },
        { point: 'JavaScript', importance: '★★★★★', requirement: 'Master' },
        { point: 'Frontend Frameworks', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Backend Development', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Database Integration', importance: '★★★☆☆', requirement: 'Know' }
      ],
      summary: [
        'HTML provides structure, CSS provides style',
        'JavaScript adds interactivity',
        'Frameworks improve development efficiency',
        'Full-stack development requires both frontend and backend skills'
      ]
    },
    '人工智能': {
      intro: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines. This course covers machine learning fundamentals, neural networks, deep learning, natural language processing, and computer vision.',
      keyPoints: [
        'Machine learning fundamentals: supervised and unsupervised learning',
        'Neural networks and deep learning architectures',
        'Convolutional Neural Networks (CNNs) for computer vision',
        'Recurrent Neural Networks (RNNs) for sequence data',
        'Natural Language Processing (NLP) techniques'
      ],
      detailedContent: [
        { point: 'ML Fundamentals', importance: '★★★★★', requirement: 'Master' },
        { point: 'Neural Networks', importance: '★★★★★', requirement: 'Master' },
        { point: 'CNNs', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'RNNs', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'NLP', importance: '★★★☆☆', requirement: 'Know' }
      ],
      summary: [
        'AI is transforming various industries',
        'Machine learning is the foundation of modern AI',
        'Deep learning achieves state-of-the-art results',
        'Ethical considerations are important in AI development'
      ]
    },
    '高等数学': {
      intro: 'Advanced Mathematics covers calculus, linear algebra, and differential equations. This course provides the mathematical foundation necessary for science, engineering, and computer science students.',
      keyPoints: [
        'Limits and continuity of functions',
        'Differential calculus: derivatives and applications',
        'Integral calculus: definite and indefinite integrals',
        'Series and sequences',
        'Multivariable calculus'
      ],
      detailedContent: [
        { point: 'Limits & Continuity', importance: '★★★★★', requirement: 'Master' },
        { point: 'Differential Calculus', importance: '★★★★★', requirement: 'Master' },
        { point: 'Integral Calculus', importance: '★★★★★', requirement: 'Master' },
        { point: 'Series', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Multivariable Calculus', importance: '★★★☆☆', requirement: 'Know' }
      ],
      summary: [
        'Mathematics is the language of science',
        'Calculus is essential for understanding change',
        'Practice is key to mastering mathematical concepts',
        'Mathematical skills are valuable in many fields'
      ]
    },
    '数据结构与算法': {
      intro: 'Data Structures and Algorithms are fundamental to efficient programming. This course covers common data structures (arrays, linked lists, stacks, queues, trees, graphs) and algorithms for sorting, searching, and graph traversal.',
      keyPoints: [
        'Basic data structures: arrays, linked lists, stacks, queues',
        'Advanced data structures: trees, heaps, graphs',
        'Sorting algorithms: bubble, insertion, selection, quicksort, mergesort',
        'Searching algorithms: linear search, binary search',
        'Graph algorithms: BFS, DFS, shortest path'
      ],
      detailedContent: [
        { point: 'Basic DS', importance: '★★★★★', requirement: 'Master' },
        { point: 'Trees & Graphs', importance: '★★★★★', requirement: 'Master' },
        { point: 'Sorting', importance: '★★★★★', requirement: 'Master' },
        { point: 'Searching', importance: '★★★★★', requirement: 'Master' },
        { point: 'Complexity Analysis', importance: '★★★☆☆', requirement: 'Know' }
      ],
      summary: [
        'Data structures organize and store data efficiently',
        'Algorithms solve computational problems',
        'Time and space complexity analysis is crucial',
        'Practice problems improve problem-solving skills'
      ]
    },
    '操作系统': {
      intro: 'Operating Systems manage computer hardware and software resources. This course covers process management, memory management, file systems, and concurrency control.',
      keyPoints: [
        'Process management and scheduling algorithms',
        'Memory management: paging, segmentation, virtual memory',
        'File systems and storage management',
        'Concurrency control and synchronization',
        'Deadlock detection and prevention'
      ],
      detailedContent: [
        { point: 'Process Management', importance: '★★★★★', requirement: 'Master' },
        { point: 'Memory Management', importance: '★★★★★', requirement: 'Master' },
        { point: 'File Systems', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Concurrency', importance: '★★★★☆', requirement: 'Understand' },
        { point: 'Deadlocks', importance: '★★★☆☆', requirement: 'Know' }
      ],
      summary: [
        'OS acts as an intermediary between hardware and applications',
        'Efficient resource management is key',
        'Concurrency enables multitasking',
        'Understanding OS helps write better applications'
      ]
    }
  }

  const defaultContent = {
    intro: `This course covers the fundamental concepts of ${courseName}. It provides students with essential knowledge and practical skills in this field. The course includes theoretical foundations, practical exercises, and real-world applications.`,
    keyPoints: [
      `Introduction to ${courseName}`,
      `Core concepts and principles`,
      `Practical applications and case studies`,
      `Advanced topics and emerging trends`,
      `Hands-on projects and exercises`
    ],
    detailedContent: [
      { point: 'Basic Concepts', importance: '★★★★★', requirement: 'Master' },
      { point: 'Core Principles', importance: '★★★★★', requirement: 'Master' },
      { point: 'Applications', importance: '★★★★☆', requirement: 'Understand' },
      { point: 'Advanced Topics', importance: '★★★☆☆', requirement: 'Know' },
      { point: 'Practical Skills', importance: '★★★★☆', requirement: 'Understand' }
    ],
    summary: [
      `Mastery of ${courseName} fundamentals is essential`,
      `Practical application reinforces theoretical knowledge`,
      `Continuous learning keeps skills up-to-date`,
      `Projects help consolidate learning outcomes`
    ]
  }

  return courseData[courseName] || defaultContent
}

// 生成PDF文档
const generatePdf = (note: Note) => {
  const courseContent = getCourseContent(note.course)
  
  // 使用canvas生成包含中文的图片，然后插入到PDF中
  const generateTextImage = (text: string, fontSize: number = 14, isBold: boolean = false) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    // 设置字体
    const fontWeight = isBold ? 'bold' : 'normal'
    ctx.font = `${fontWeight} ${fontSize}px "Microsoft YaHei", "PingFang SC", sans-serif`
    
    // 计算文本宽度和高度
    const metrics = ctx.measureText(text)
    const width = metrics.width + 20
    const height = fontSize * 1.5
    
    canvas.width = width
    canvas.height = height
    
    // 重新设置字体并绘制
    ctx.font = `${fontWeight} ${fontSize}px "Microsoft YaHei", "PingFang SC", sans-serif`
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(text, 10, 5)
    
    return canvas.toDataURL('image/png')
  }
  
  // 生成标题图片
  const titleImage = generateTextImage(note.title, 28, true)
  const courseImage = generateTextImage('课程: ' + note.course, 16)
  const authorImage = generateTextImage('作者: ' + note.author, 16)
  const majorImage = generateTextImage('专业: ' + note.major, 16)
  
  const tocTitle = generateTextImage('目录', 20, true)
  const chapter1Title = generateTextImage('第一章', 16, true)
  const chapter1Desc = generateTextImage('课程介绍', 14)
  const chapter2Title = generateTextImage('第二章', 16, true)
  const chapter2Desc = generateTextImage('重点知识点', 14)
  const chapter3Title = generateTextImage('第三章', 16, true)
  const chapter3Desc = generateTextImage('详细内容', 14)
  const chapter4Title = generateTextImage('第四章', 16, true)
  const chapter4Desc = generateTextImage('总结', 14)
  
  const introTitle = generateTextImage('第一章: 课程介绍', 18, true)
  const introContent = generateTextImage(courseContent.intro, 12)
  
  const keyPointsTitle = generateTextImage('第二章: 重点知识点', 18, true)
  
  const detailedTitle = generateTextImage('第三章: 详细内容', 18, true)
  
  const summaryTitle = generateTextImage('第四章: 总结', 18, true)
  
  const endText = generateTextImage('--- 结束 ---', 12)
  
  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      {
        image: titleImage,
        alignment: 'center',
        margin: [0, 50, 0, 20]
      },
      {
        image: courseImage,
        alignment: 'center',
        margin: [0, 10, 0, 5]
      },
      {
        image: authorImage,
        alignment: 'center',
        margin: [0, 5, 0, 5]
      },
      {
        image: majorImage,
        alignment: 'center',
        margin: [0, 5, 0, 30]
      },
      {
        text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        alignment: 'center',
        color: '#d1d5db',
        margin: [0, 0, 0, 30]
      },
      { text: '', pageBreak: 'after' },
      
      // 目录页
      {
        image: tocTitle,
        alignment: 'center',
        margin: [0, 30, 0, 30]
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [{ image: chapter1Title }, { image: chapter1Desc }],
            [{ image: chapter2Title }, { image: chapter2Desc }],
            [{ image: chapter3Title }, { image: chapter3Desc }],
            [{ image: chapter4Title }, { image: chapter4Desc }]
          ]
        },
        layout: 'noBorders'
      },
      { text: '', pageBreak: 'after' },
      
      // 第一章
      {
        image: introTitle,
        margin: [0, 30, 0, 20]
      },
      {
        image: introContent,
        margin: [0, 0, 0, 30]
      },
      { text: '', pageBreak: 'after' },
      
      // 第二章
      {
        image: keyPointsTitle,
        margin: [0, 30, 0, 20]
      },
      ...courseContent.keyPoints.map((point: string) => ({
        image: generateTextImage('• ' + point, 12),
        margin: [20, 5, 0, 5]
      })),
      { text: '', pageBreak: 'after' },
      
      // 第三章
      {
        image: detailedTitle,
        margin: [0, 30, 0, 20]
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: [
            [
              { image: generateTextImage('知识点', 12, true) },
              { image: generateTextImage('重要性', 12, true) },
              { image: generateTextImage('要求', 12, true) }
            ],
            ...courseContent.detailedContent.map(item => [
              { image: generateTextImage(item.point, 12) },
              { image: generateTextImage(item.importance, 12) },
              { image: generateTextImage(item.requirement, 12) }
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 30]
      },
      { text: '', pageBreak: 'after' },
      
      // 第四章
      {
        image: summaryTitle,
        margin: [0, 30, 0, 20]
      },
      ...courseContent.summary.map((item: string) => ({
        image: generateTextImage('• ' + item, 12),
        margin: [20, 5, 0, 5]
      })),
      {
        image: endText,
        alignment: 'center',
        margin: [0, 50, 0, 0]
      }
    ]
  }

  try {
    const pdf = pdfMake.createPdf(docDefinition)
    pdf.download(`${note.title.replace(/[\\/:*?"<>|]/g, '_')}.pdf`)
  } catch (e) {
    console.error('PDF generation failed:', e)
    alert('PDF generation failed, please try again')
  }
}

// 查看已下载的PDF
const onViewPdf = () => {
  if (!note.value) return
  generatePdf(note.value)
}

const loadNote = async () => {
  loading.value = true
  await nextTick()
  const noteId = parseInt(route.params.id as string)
  if (isNaN(noteId)) {
    note.value = null
    loading.value = false
    return
  }
  const foundNote = allNotes.value.find(n => n.id === noteId) || null
  note.value = foundNote
  if (foundNote) {
    noteDownloaded.value = isNoteDownloaded(noteId)
    noteCollected.value = isNoteCollected(noteId)
    
    // 清空之前的评论，重新加载
    reviews.value = []
    
    // 加载该笔记的mock评论
    const noteMockReviews = mockReviews.filter(r => r.noteId === noteId)
    reviews.value.push(...noteMockReviews)
    
    // 从全局评论存储中加载所有评论
    const savedReviews = getReviewsForNote(noteId)
    if (savedReviews.length > 0) {
      // 添加全局评论（排除已存在的mock评论）
      savedReviews.forEach(savedReview => {
        const existingIndex = reviews.value.findIndex(r => r.id === savedReview.id)
        if (existingIndex === -1) {
          reviews.value.unshift(savedReview)
        }
      })
    }
  }
  loading.value = false
}

onMounted(() => {
  loadNote()
})

watch(() => route.params.id, () => {
  loadNote()
})
</script>

<style scoped>
.note-detail-page {
  min-height: calc(100vh - 180px);
  padding: 40px 0;
}

.detail-content {
  max-width: 800px;
  margin: 0 auto;
}

.note-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.quality-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
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
  padding: 6px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 12px;
  color: #6b7280;
}

.note-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  line-height: 1.4;
}

.note-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
}

.author-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 24px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.author-detail {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #1f2937;
}

.author-meta {
  font-size: 12px;
  color: #6b7280;
}

.author-stats {
  font-size: 14px;
  color: #6b7280;
}

.stats-row {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
}

.tags-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.tags-label {
  font-size: 14px;
  color: #6b7280;
}

.tag {
  padding: 4px 12px;
  background: #eef2ff;
  color: #4f46e5;
  border-radius: 20px;
  font-size: 12px;
}

.preview-section {
  background: #f9fafb;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.preview-section h3 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #1f2937;
}

.preview-content {
  font-size: 14px;
  line-height: 2;
  color: #4b5563;
  white-space: pre-wrap;
}

.actions-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.collect-action-btn {
  border: 1px solid #e5e7eb;
  background: white;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.collect-action-btn:hover {
  color: #f59e0b;
  border-color: #f59e0b;
}

.collect-action-btn.collected {
  color: #f59e0b;
  border-color: #f59e0b;
  background: #fef3c7;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.free {
  font-size: 20px;
  font-weight: 700;
  color: #10b981;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #f59e0b;
}

.user-points {
  font-size: 14px;
  color: #6b7280;
}

.review-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 32px;
}

.review-section h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 24px;
}

.review-form {
  background: #f9fafb;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
}

.review-form h4 {
  font-size: 16px;
  color: #1f2937;
  margin-bottom: 16px;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.rating-label {
  font-size: 14px;
  color: #6b7280;
}

.submit-review-btn {
  margin-top: 12px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviewer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.reviewer-name {
  font-weight: 600;
  color: #1f2937;
}

.review-time {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 8px;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #e5e7eb;
}

.star.filled {
  color: #fbbf24;
}

.review-content {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.8;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state p {
  color: #9ca3af;
  margin-bottom: 20px;
}

.loading-content {
  text-align: center;
  padding: 80px 0;
}

.loading-content p {
  color: #9ca3af;
  margin-top: 16px;
}
</style>