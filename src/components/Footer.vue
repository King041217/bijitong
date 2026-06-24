<template>
  <el-footer class="footer">
    <div class="container footer-content">
      <div class="footer-info">
        <p>© 2026 校园笔记通 - 大学生学习笔记智能共享平台</p>
        <p>让学习更轻松</p>
      </div>
      <div class="footer-links">
        <a href="#" class="link">关于我们</a>
        <a href="#" class="link">使用帮助</a>
        <a href="#" class="link">隐私政策</a>
        <a href="#" class="link">联系我们</a>
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background-color: #1a1a2e;
  color: #999;
  padding: 30px 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info p {
  margin: 4px 0;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.link {
  color: #999;
  text-decoration: none;
  transition: color 0.3s;
}

.link:hover {
  color: #fff;
}
</style>
