<template>
  <el-aside width="264px">
    <el-menu
        default-active="2"
        class="menu-style"
      >
      <div class="brand">
        <el-image style="width: 50px; height: 50px;margin-right: 10px;" :src="iconUrl" alt="logo" />
        <div class="info-card">
          <h1 class="brand-title">心理健康AI助手</h1>
          <p class="subtitile">管理后台</p>
        </div>
      </div>
        <el-menu-item @click="selectMenu" v-for=" item in router.options.routes[0].children" :key="item.path" :index="item.path">
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

const selectMenu = (key) => {
  console.log(key)
  const currentRoute = router.options.routes[0]
  // console.log(`${currentRoute.path}/${key.index}`)
  router.push(`${currentRoute.path}/${key.index}`)
}
</script>

<style lang="scss" scoped>
.menu-style{
  height: 100%;
  .brand{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    background-color:#fff;
    border-bottom: 1px solid #e5e7ed;

    .info-card{
      .brand-title{
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #303133;
      }
      .subtitile{
        font-size: 14px;
        font-weight: 400;
        color: #606266;
      }
    }
  }
}
</style>
