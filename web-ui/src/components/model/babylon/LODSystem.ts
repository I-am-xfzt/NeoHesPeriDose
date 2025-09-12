// 通用LOD级别定义 - 兼容多种3D引擎
export interface LODConfig {
  distance: number
  quality: 'high' | 'medium' | 'low'
  meshSimplification?: number
  textureSize?: number
  engineType?: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM'
}

// 通用LOD配置 - 支持多引擎
export const LOD_LEVELS: LODConfig[] = [
  { distance: 50, quality: 'high', meshSimplification: 1.0, textureSize: 2048 },
  { distance: 200, quality: 'medium', meshSimplification: 0.5, textureSize: 1024 },
  { distance: 500, quality: 'low', meshSimplification: 0.25, textureSize: 512 }
]

// 通用LOD网格类 - 兼容多种3D引擎
export class UniversalLODMesh {
  private meshes: Map<number, any> = new Map() // 通用网格存储
  private currentLevel = 0
  public position: any // 通用位置对象
  private engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM'
  private scene: any
  
  constructor(
    public name: string, 
    scene: any, 
    engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM'
  ) {
    this.scene = scene
    this.engineType = engineType
    this.position = this.createPositionObject()
  }
  
  private createPositionObject(): any {
    switch (this.engineType) {
      case '3D_ENGINE_BABYLON':
        // Babylon.js Vector3
        return { x: 0, y: 0, z: 0, clone: () => ({ ...this.position }) }
        
      case '3D_ENGINE_THREE':
        // THREE.js Vector3
        return { x: 0, y: 0, z: 0, clone: () => ({ ...this.position }) }
        
      case '3D_ENGINE_CESIUM':
        // Cesium Cartesian3
        return { x: 0, y: 0, z: 0, clone: () => ({ ...this.position }) }
        
      default:
        return { x: 0, y: 0, z: 0 }
    }
  }
  
  addLODLevel(distance: number, mesh: any): void {
    this.meshes.set(distance, mesh)
    this.setMeshEnabled(mesh, false) // 默认禁用
  }
  
  updateLOD(cameraDistance: number): void {
    let targetMesh: any | undefined
    let minDistance = Infinity
    
    this.meshes.forEach((mesh, distance) => {
      if (cameraDistance >= distance && distance < minDistance) {
        minDistance = distance
        targetMesh = mesh
      }
    })
    
    // 只显示当前LOD级别的网格
    this.meshes.forEach((mesh) => {
      this.setMeshEnabled(mesh, mesh === targetMesh)
    })
  }
  
  private setMeshEnabled(mesh: any, enabled: boolean): void {
    switch (this.engineType) {
      case '3D_ENGINE_BABYLON':
        if (mesh.setEnabled) {
          mesh.setEnabled(enabled)
        }
        break
        
      case '3D_ENGINE_THREE':
        mesh.visible = enabled
        break
        
      case '3D_ENGINE_CESIUM':
        if (mesh.show !== undefined) {
          mesh.show = enabled
        }
        break
    }
  }
  
  dispose(): void {
    this.meshes.forEach((mesh) => {
      this.disposeMesh(mesh)
    })
    this.meshes.clear()
  }
  
  private disposeMesh(mesh: any): void {
    switch (this.engineType) {
      case '3D_ENGINE_BABYLON':
        if (mesh.dispose) {
          mesh.dispose()
        }
        break
        
      case '3D_ENGINE_THREE':
        if (mesh.geometry) mesh.geometry.dispose()
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: any) => mat.dispose())
          } else {
            mesh.material.dispose()
          }
        }
        break
        
      case '3D_ENGINE_CESIUM':
        // Cesium 的清理逗辑
        if (mesh.destroy) {
          mesh.destroy()
        }
        break
    }
  }
}

// 兼容性别名，保持向后兼容
export const CustomLODMesh = UniversalLODMesh