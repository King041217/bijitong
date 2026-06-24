<template>
  <div class="upload-page">
    <div class="container">
      <div class="page-header">
        <h1>上传笔记</h1>
        <p>分享你的学习笔记，帮助更多同学</p>
      </div>

      <el-form :model="form" label-width="120px" class="upload-form">
        <el-form-item label="笔记标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入笔记标题" />
        </el-form-item>

        <el-form-item label="所属课程" prop="course">
          <el-input v-model="form.course" placeholder="如：数据结构与算法" />
        </el-form-item>

        <el-form-item label="专业分类" prop="major">
          <el-select v-model="form.major" placeholder="请选择专业">
            <el-option v-for="major in majors" :key="major" :label="major" :value="major" />
          </el-select>
        </el-form-item>

        <el-form-item label="适用年级" prop="grade">
          <el-select v-model="form.grade" placeholder="请选择年级">
            <el-option label="大一" value="大一" />
            <el-option label="大二" value="大二" />
            <el-option label="大三" value="大三" />
            <el-option label="大四" value="大四" />
          </el-select>
        </el-form-item>

        <el-form-item label="笔记文件" prop="file">
          <el-upload
            class="upload-demo"
            action=""
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="fileList"
            :accept="'.docx,.pdf,.txt,.jpg,.png'"
          >
            <el-button type="primary" icon="Upload">点击上传文件</el-button>
            <div class="upload-tip">支持 Word、PDF、TXT、图片格式</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="内容预览" prop="content">
          <el-textarea
            v-model="form.content"
            :rows="4"
            placeholder="请简要描述笔记内容（便于其他同学了解）"
          />
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-input
            v-model="form.tagsInput"
            placeholder="输入标签，用逗号分隔"
          />
          <div class="tags-preview">
            <span
              v-for="tag in form.tags"
              :key="tag"
              class="tag"
              @click="removeTag(tag)"
            >
              {{ tag }}
              <el-icon class="tag-close"><Close /></el-icon>
            </span>
          </div>
        </el-form-item>

        <el-form-item label="积分定价" prop="price">
          <el-slider
            v-model="form.price"
            :min="0"
            :max="50"
            :step="1"
            :marks="{
              0: '免费',
              10: '10',
              20: '20',
              30: '30',
              40: '40',
              50: '50'
            }"
          />
          <span class="price-value">当前定价：{{ form.price }} 积分</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" class="submit-btn">
            <el-icon><Upload /></el-icon>
            提交上传
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Close } from '@element-plus/icons-vue'
import { categories } from '@/data/mockData'
import { uploadNote, currentUserInfo } from '@/data/userState'

const router = useRouter()

const majors = categories.map(c => c.name)

const form = reactive({
  title: '',
  course: '',
  major: '',
  grade: '',
  content: '',
  tagsInput: '',
  tags: [] as string[],
  price: 5
})

const fileList = reactive<any[]>([])

watch(() => form.tagsInput, (val) => {
  if (val.includes(',')) {
    const newTags = val.split(',').filter(t => t.trim())
    form.tags = [...new Set([...form.tags, ...newTags])]
    form.tagsInput = ''
  }
})

const handleFileChange = (file: any) => {
  // 清空之前的文件列表，只保留最新选择的文件
  fileList.length = 0
  fileList.push(file)
}

const removeTag = (tag: string) => {
  const index = form.tags.indexOf(tag)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

const handleSubmit = () => {
  if (!form.title) {
    alert('请输入笔记标题')
    return
  }
  if (!form.course) {
    alert('请输入所属课程')
    return
  }
  if (!form.major) {
    alert('请选择专业分类')
    return
  }
  if (!form.grade) {
    alert('请选择适用年级')
    return
  }

  // 模拟文件上传
  const fileType = fileList.length > 0 
    ? (fileList[0].name?.endsWith('.docx') ? 'word' : 
       fileList[0].name?.endsWith('.pdf') ? 'pdf' : 
       fileList[0].name?.endsWith('.txt') ? 'txt' : 'pdf')
    : 'pdf'

  // 上传笔记，使用当前用户信息
  uploadNote({
    id: Date.now(),
    title: form.title,
    course: form.course,
    major: form.major,
    grade: form.grade,
    content: form.content || '暂无预览内容',
    tags: form.tags,
    price: form.price,
    fileType: fileType as any,
    author: currentUserInfo.value.name,
    authorId: currentUserInfo.value.authorId,
    uploadTime: new Date().toISOString().split('T')[0],
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    quality: 'normal'
  })

  alert('笔记上传成功！')
  router.push('/profile')
}

const handleReset = () => {
  form.title = ''
  form.course = ''
  form.major = ''
  form.grade = ''
  form.content = ''
  form.tagsInput = ''
  form.tags = []
  form.price = 5
  fileList.length = 0
}
</script>

<style scoped>
.upload-page {
  padding: 30px 0;
}

.page-header {
  margin-bottom: 32px;
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

.upload-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.upload-tip {
  margin-top: 8px;
  font-size: 13px;
  color: #999;
}

.tags-preview {
  margin-top: 12px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background-color: #eef2ff;
  color: #4338ca;
  border-radius: 4px;
  font-size: 13px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.tag-close {
  margin-left: 6px;
  font-size: 12px;
}

.price-value {
  display: block;
  margin-top: 12px;
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

.submit-btn {
  width: 200px;
}
</style>
