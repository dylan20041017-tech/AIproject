/**
 * ECharts 可复用组合式函数
 *
 * 封装图表初始化 / setOption / 销毁 / resize 生命周期管理
 *
 * 用法:
 *   import { useECharts } from '@/composables/useECharts'
 *
 *   const { chartRef, setOption, resize, dispose } = useECharts()
 *   // 模板: <div ref="chartRef" style="height:300px"></div>
 *   // 数据加载后: setOption({ xAxis: {...}, series: [...] })
 */

import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export function useECharts() {
  const chartRef = ref(null)
  const chartInstance = shallowRef(null)
  let resizeObserver = null

  /**
   * 初始化图表实例（挂载到 chartRef 对应的 DOM 上）
   * 如果已有旧实例则先销毁
   */
  function initChart() {
    if (!chartRef.value) return

    dispose()

    chartInstance.value = echarts.init(chartRef.value)
  }

  /**
   * 设置/更新图表配置
   * 首次调用未初始化时会自动 init
   */
  function setOption(option) {
    if (!chartInstance.value) {
      initChart()
    }
    if (chartInstance.value) {
      chartInstance.value.setOption(option, { notMerge: true })
    }
  }

  /**
   * 手动触发 resize（容器尺寸变化时）
   */
  function resize() {
    chartInstance.value?.resize()
  }

  /**
   * 销毁图表实例
   */
  function dispose() {
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
  }

  // 组件挂载时初始化 + 监听 resize
  onMounted(() => {
    initChart()
    // 使用 ResizeObserver 监听容器尺寸变化
    if (chartRef.value) {
      resizeObserver = new ResizeObserver(() => {
        resize()
      })
      resizeObserver.observe(chartRef.value)
    }
    // 兜底：也监听 window resize
    window.addEventListener('resize', resize)
  })

  // 组件卸载时清理
  onUnmounted(() => {
    dispose()
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    window.removeEventListener('resize', resize)
  })

  return {
    chartRef,
    chartInstance,
    initChart,
    setOption,
    resize,
    dispose,
  }
}
