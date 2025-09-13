// 通用网格序列化工具类 - 兼容多种3D引擎
export class UniversalMeshSerializationUtils {
  private scene: any
  private engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM'

  constructor(
    scene: any, 
    engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM'
  ) {
    this.scene = scene
    this.engineType = engineType
  }

  // 通用序列化方法
  serializeMeshData(result: any): any {
    switch (this.engineType) {
      case '3D_ENGINE_BABYLON':
        return this.serializeBabylonMesh(result)
        
      case '3D_ENGINE_THREE':
        return this.serializeThreeMesh(result)
        
      case '3D_ENGINE_CESIUM':
        return this.serializeCesiumMesh(result)
        
      default:
        throw new Error(`不支持的引擎类型: ${this.engineType}`)
    }
  }

  // 通用反序列化方法
  rebuildMeshFromCache(cachedData: any): any {
    if (cachedData.engineType !== this.engineType) {
      throw new Error(`引擎类型不匹配: 期望 ${this.engineType}，实际 ${cachedData.engineType}`)
    }

    switch (this.engineType) {
      case '3D_ENGINE_BABYLON':
        return this.rebuildBabylonMesh(cachedData)
        
      case '3D_ENGINE_THREE':
        return this.rebuildThreeMesh(cachedData)
        
      case '3D_ENGINE_CESIUM':
        return this.rebuildCesiumMesh(cachedData)
        
      default:
        throw new Error(`不支持的引擎类型: ${this.engineType}`)
    }
  }

  // Babylon.js 序列化
  private serializeBabylonMesh(result: any): any {
    try {
      const serializedData = {
        engineType: '3D_ENGINE_BABYLON',
        meshes: result.meshes.map((mesh: any) => {
          const meshData: any = {
            name: mesh.name,
            type: mesh.getClassName(),
            position: mesh.position.asArray(),
            rotation: mesh.rotation.asArray(),
            scaling: mesh.scaling.asArray()
          }
          
          // 序列化几何数据
          if (mesh.getVerticesData) {
            const positions = mesh.getVerticesData('position')
            const normals = mesh.getVerticesData('normal')
            const uvs = mesh.getVerticesData('uv')
            const indices = mesh.getIndices()
            
            if (positions) meshData.positions = Array.from(positions)
            if (normals) meshData.normals = Array.from(normals)
            if (uvs) meshData.uvs = Array.from(uvs)
            if (indices) meshData.indices = Array.from(indices)
          }
          
          return meshData
        })
      }
      
      return serializedData
    } catch (error) {
      console.error('Babylon.js 序列化失败:', error)
      return null
    }
  }

  // THREE.js 序列化
  private serializeThreeMesh(scene: any): any {
    try {
      const meshes: any[] = []
      
      scene.traverse((object: any) => {
        if (object.isMesh || object.isSkinnedMesh) {
          const meshData: any = {
            name: object.name,
            type: object.type,
            position: object.position.toArray(),
            rotation: object.rotation.toArray ? object.rotation.toArray() : [object.rotation.x, object.rotation.y, object.rotation.z],
            scale: object.scale.toArray()
          }
          
          // 序列化几何数据
          if (object.geometry) {
            const geometry = object.geometry
            if (geometry.attributes.position) {
              meshData.positions = Array.from(geometry.attributes.position.array)
            }
            if (geometry.attributes.normal) {
              meshData.normals = Array.from(geometry.attributes.normal.array)
            }
            if (geometry.attributes.uv) {
              meshData.uvs = Array.from(geometry.attributes.uv.array)
            }
            if (geometry.index) {
              meshData.indices = Array.from(geometry.index.array)
            }
          }
          
          meshes.push(meshData)
        }
      })
      
      return {
        engineType: '3D_ENGINE_THREE',
        meshes
      }
    } catch (error) {
      console.error('THREE.js 序列化失败:', error)
      return null
    }
  }

  // Cesium 序列化
  private serializeCesiumMesh(primitives: any): any {
    try {
      return {
        engineType: '3D_ENGINE_CESIUM',
        primitives: []
      }
    } catch (error) {
      console.error('Cesium 序列化失败:', error)
      return null
    }
  }

  // Babylon.js 反序列化
  private rebuildBabylonMesh(cachedData: any): any {
    try {
      const meshes: any[] = []
      const particleSystems: any[] = []
      const skeletons: any[] = []
      const animationGroups: any[] = []
      const transformNodes: any[] = []
      const geometries: any[] = []
      const lights: any[] = []
      
      if (cachedData.modelData && cachedData.modelData.meshes) {
        cachedData.modelData.meshes.forEach((meshData: any) => {
          const mesh = this.deserializeBabylonMesh(meshData)
          if (mesh) {
            meshes.push(mesh)
          }
        })
      }
      
      return {
        meshes,
        particleSystems,
        skeletons,
        animationGroups,
        transformNodes,
        geometries,
        lights
      }
    } catch (error) {
      console.error('Babylon.js 反序列化失败:', error)
      throw error
    }
  }

  // THREE.js 反序列化
  private rebuildThreeMesh(cachedData: any): any {
    try {
      const THREE = (globalThis as any).THREE
      if (!THREE) throw new Error('THREE.js 未加载')
      
      const group = new THREE.Group()
      
      if (cachedData.modelData && cachedData.modelData.meshes) {
        cachedData.modelData.meshes.forEach((meshData: any) => {
          const mesh = this.deserializeThreeMesh(meshData)
          if (mesh) {
            group.add(mesh)
          }
        })
      }
      
      return group
    } catch (error) {
      console.error('THREE.js 反序列化失败:', error)
      throw error
    }
  }

  // Cesium 反序列化
  private rebuildCesiumMesh(cachedData: any): any {
    try {
      return {
        primitives: []
      }
    } catch (error) {
      console.error('Cesium 反序列化失败:', error)
      throw error
    }
  }

  // Babylon.js 单个网格反序列化
  private deserializeBabylonMesh(meshData: any): any | null {
    try {
      if (meshData.type === 'Mesh' && (globalThis as any).BABYLON) {
        const mesh = new (globalThis as any).BABYLON.Mesh(meshData.name, this.scene)
        
        if (meshData.positions) {
          mesh.setVerticesData('position', meshData.positions)
        }
        if (meshData.normals) {
          mesh.setVerticesData('normal', meshData.normals)
        }
        if (meshData.uvs) {
          mesh.setVerticesData('uv', meshData.uvs)
        }
        if (meshData.indices) {
          mesh.setIndices(meshData.indices)
        }
        
        if (meshData.position) {
          mesh.position = (globalThis as any).BABYLON.Vector3.FromArray(meshData.position)
        }
        if (meshData.rotation) {
          mesh.rotation = (globalThis as any).BABYLON.Vector3.FromArray(meshData.rotation)
        }
        if (meshData.scaling) {
          mesh.scaling = (globalThis as any).BABYLON.Vector3.FromArray(meshData.scaling)
        }
        
        return mesh
      }
      return null
    } catch (error) {
      console.error('Babylon.js 网格反序列化失败:', error)
      return null
    }
  }

  // THREE.js 单个网格反序列化
  private deserializeThreeMesh(meshData: any): any | null {
    try {
      const THREE = (globalThis as any).THREE
      if (!THREE) return null
      
      const geometry = new THREE.BufferGeometry()
      
      if (meshData.positions) {
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(meshData.positions, 3))
      }
      if (meshData.normals) {
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(meshData.normals, 3))
      }
      if (meshData.uvs) {
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(meshData.uvs, 2))
      }
      if (meshData.indices) {
        geometry.setIndex(meshData.indices)
      }
      
      const material = new THREE.MeshBasicMaterial()
      const mesh = new THREE.Mesh(geometry, material)
      mesh.name = meshData.name
      
      if (meshData.position) {
        mesh.position.fromArray(meshData.position)
      }
      if (meshData.rotation) {
        mesh.rotation.fromArray(meshData.rotation)
      }
      if (meshData.scale) {
        mesh.scale.fromArray(meshData.scale)
      }
      
      return mesh
    } catch (error) {
      console.error('THREE.js 网格反序列化失败:', error)
      return null
    }
  }
}

// 兼容性别名，保持向后兼容
export const MeshSerializationUtils = UniversalMeshSerializationUtils