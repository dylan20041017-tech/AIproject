import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/backendlayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'

const backendRouter = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashborard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
          roles: ['admin'],
        },
      },

      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare',
          roles: ['admin'],
        },
      },

      {
        path: 'consultations',
        component: () => import('@/views/consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message',
          roles: ['admin'],
        },
      },

      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情感日志',
          icon: 'User',
          roles: ['admin'],
        },
      },

    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册',
        },
      },
    ],
  }
]
const frontendRouter = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation.vue'),
        meta: { title: 'AI 咨询' },
      },
      {
        path: 'emotion-diary',
        component: () => import('@/views/emotionDiary.vue'),
        meta: { title: '情绪日记' },
      },
      {
        path: 'knowledge',
        component: () => import('@/views/frontendknowledge.vue'),
        meta: { title: '知识库' },
      },
      {
        path: 'knowledge/article/:id',
        component: () => import('@/views/articleDetail.vue'),
        props: true,
        meta: { title: '文章详情' },
      },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRouter, ...frontendRouter],
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 动态设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title
  }

  if (token) {
    const userInfoStr = localStorage.getItem('userInfo')
    let userinfo = null
    try {
      userinfo = JSON.parse(userInfoStr)
    } catch {
      // 数据损坏，视为未登录
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      next('/auth/login?redirect=' + encodeURIComponent(to.fullPath))
      return
    }

    if (userinfo.userType === 2) {
      // 管理员：只能访问后台路由
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    } else if (userinfo.userType === 1) {
      // 普通用户：不能访问后台和认证路由
      if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
        next('/')
      } else {
        next()
      }
    } else {
      // 未知角色
      next('/auth/login?redirect=' + encodeURIComponent(to.fullPath))
    }
  } else {
    // 未登录用户
    if (to.path.startsWith('/back')) {
      // 访问后台，跳转到登录并携带重定向参数
      next('/auth/login?redirect=' + encodeURIComponent(to.fullPath))
    } else {
      // 前台公开页面，放行
      next()
    }
  }
})
export default router
