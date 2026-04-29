<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <Sidebar/>
      <el-container>
        <el-header>
          <Navbar/>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
</script>

<style lang="scss" scoped>
.backend-layout {
  height: 100vh;
  .main-container{
    height: 100%;
  }
}
</style>
