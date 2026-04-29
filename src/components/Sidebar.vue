<template>
  <el-aside width="264px">
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        router
      >
      <div class="brand">
        <el-image :src="iconUrl" alt="logo" />
        <div class="info-card">
        <h1 class="brand-title">心理健康AI助手</h1>
        <p class="subtitile">管理后台</p>
        </div>
      </div>
        <el-menu-item v-for=" item in router.options.routes[0].children" :key="item.path" :index="item.path">
          <el-icon><component :is="getIcon(item.meta.icon)" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>

      </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { PieChart, ChatLineSquare, Message, User } from '@element-plus/icons-vue'

const router = useRouter()

const iconMap = {
  PieChart,
  ChatLineSquare,
  Message,
  User
}

const getIcon = (iconName) => {
  return iconMap[iconName] || PieChart
}

const iconUrl = new URL ('@/assets/images/机器人.png', import.meta.url).href


const handleOpen = (key) => {
  console.log(key)
}
const handleClose = (key) => {
  console.log(key)
}
</script>
