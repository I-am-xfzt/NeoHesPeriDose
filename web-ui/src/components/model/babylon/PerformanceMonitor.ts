// 多引擎性能监控接口
export interface PerformanceMetrics {
  fps: number
  drawCalls: number
  triangleCount: number
  memoryUsage: number
  engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM'
}

// 通用性能监控器 - 支持多种3D引擎
export class PerformanceMonitor {
  private metrics: PerformanceMetrics
  private lastTime = 0
  private frameCount = 0
  private engine: any // 通用引擎引用
  private engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM'
  private scene: any // 通用场景引用

  constructor(
    scene: any, 
    engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM',
    engine?: any
  ) {
    this.scene = scene
    this.engineType = engineType
    this.engine = engine
    this.metrics = {
      fps: 0,
      drawCalls: 0,
      triangleCount: 0,
      memoryUsage: 0,
      engineType
    }
  }

  startMonitoring(): void {
    // 根据不同引擎类型启动监控
    switch (this.engineType) {
      case '3D_ENGINE_BABYLON':
        this.scene.registerBeforeRender(() => {
          this.updateMetrics()
        })
        break
      
      case '3D_ENGINE_THREE':
        // THREE.js 的渲染循环监控
        this.startThreeJSMonitoring()
        break
        
      case '3D_ENGINE_CESIUM':
        // Cesium 的渲染循环监控
        this.startCesiumMonitoring()
        break
    }
  }
  
  private startThreeJSMonitoring(): void {
    const animate = () => {
      this.updateMetrics()
      requestAnimationFrame(animate)
    }
    animate()
  }
  
  private startCesiumMonitoring(): void {
    if (this.scene.postRender) {
      this.scene.postRender.addEventListener(() => {
        this.updateMetrics()
      })
    }
  }

  private updateMetrics(): void {
    const currentTime = performance.now()
    this.frameCount++
    
    if (currentTime - this.lastTime >= 1000) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
      
      // 根据引擎类型获取不同的性能数据
      switch (this.engineType) {
        case '3D_ENGINE_BABYLON':
          this.updateBabylonMetrics()
          break
          
        case '3D_ENGINE_THREE':
          this.updateThreeJSMetrics()
          break
          
        case '3D_ENGINE_CESIUM':
          this.updateCesiumMetrics()
          break
      }
      
      // 检查性能并调整
      this.checkPerformanceAndAdjust()
      
      this.frameCount = 0
      this.lastTime = currentTime
    }
  }
  
  private updateBabylonMetrics(): void {
    if (this.scene.getEngine) {
      this.metrics.drawCalls = (this.scene.getEngine() as any)._drawCalls || 0
      this.metrics.triangleCount = this.scene.getTotalVertices ? this.scene.getTotalVertices() : 0
    }
  }
  
  private updateThreeJSMetrics(): void {
    // THREE.js 性能数据获取
    if (this.engine && this.engine.info) {
      this.metrics.drawCalls = this.engine.info.render.calls || 0
      this.metrics.triangleCount = this.engine.info.render.triangles || 0
    }
    
    // 从场景中统计三角形数量
    if (this.scene.traverse) {
      let triangles = 0
      this.scene.traverse((object: any) => {
        if (object.geometry && object.geometry.attributes.position) {
          triangles += object.geometry.attributes.position.count / 3
        }
      })
      this.metrics.triangleCount = triangles
    }
  }
  
  private updateCesiumMetrics(): void {
    // Cesium 性能数据获取
    if (this.scene.debugShowFramesPerSecond !== undefined) {
      // Cesium 特定的性能监控
      this.metrics.drawCalls = 0 // Cesium 不直接提供 draw calls
      this.metrics.triangleCount = 0 // 需要从 primitives 中统计
    }
  }

  private checkPerformanceAndAdjust(): void {
    if (this.metrics.fps < 30) {
      console.warn(`${this.engineType} 性能低于30FPS，建议降低渲染质量`)
      // 可以根据不同引擎调整优化策略
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
}