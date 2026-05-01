<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-position="top">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" size="large" placeholder="请输入用户名或邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" size="large" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <div class="btn">
          <el-button type="primary" size="large" @click="submitForm(ruleFormRef)">登录账户</el-button>
        </div>
        <div class="footer">
          <p>还没有账户？<router-link to="/auth/register" type="primary">去注册</router-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const ruleFormRef = ref()

const formData = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log(fields)
    }
  })
}
</script>

<style scoped lang="scss">
.container {
  width: 384px;

  .title {
    .back-home {
      margin-bottom: 60px;
    }

    .title-text {
      text-align: center;

      h2 {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      p {
        font-size: 18px;
        color: #666;
      }
    }
  }

  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;

      .el-button {
        width: 100%;
      }
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
   }
}
</style>
