// 通用模型缓存数据接口 - 兼容多种3D引擎
export interface ModelCacheData {
  id: string
  url: string
  modelData: any  // 序列化的模型数据
  engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM' // 引擎类型标识
  timestamp: number
  version: string
  metadata?: {
    vertices?: number
    faces?: number
    materials?: number
    textures?: string[]
  }
}

// 通用模型缓存管理器 - 支持多种3D引擎
export class ModelCacheManager {
  private dbName = 'Multi3DModelCache'
  private version = 2 // 升级版本以支持多引擎
  private storeName = 'models'
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('url', 'url', { unique: false })
          store.createIndex('engineType', 'engineType', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  // 获取模型缓存 - 根据引擎类型过滤
  async getModel(url: string, engineType?: string): Promise<ModelCacheData | null> {
    if (!this.db) return null
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('url')
      const request = index.getAll(url)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const results = request.result as ModelCacheData[]
        
        // 如果指定了引擎类型，过滤结果
        const filteredResults = engineType 
          ? results.filter(r => r.engineType === engineType)
          : results
          
        const validResult = filteredResults.find(r => this.isValidCache(r))
        resolve(validResult || null)
      }
    })
  }

  // 保存模型缓存 - 支持多引擎
  async saveModel(
    url: string, 
    modelData: any, 
    engineType: '3D_ENGINE_BABYLON' | '3D_ENGINE_THREE' | '3D_ENGINE_CESIUM',
    metadata?: ModelCacheData['metadata']
  ): Promise<void> {
    if (!this.db) return
    
    const cacheData: ModelCacheData = {
      id: this.generateId(url, engineType),
      url,
      modelData,
      engineType,
      timestamp: Date.now(),
      version: '2.0',
      metadata
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(cacheData)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) return
    
    const cutoffTime = Date.now() - maxAge
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('timestamp')
      const range = IDBKeyRange.upperBound(cutoffTime)
      const request = index.openCursor(range)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          store.delete(cursor.primaryKey)
          cursor.continue()
        } else {
          resolve()
        }
      }
    })
  }

  private isValidCache(cacheData: ModelCacheData): boolean {
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7天
    return Date.now() - cacheData.timestamp < maxAge
  }

  private generateId(url: string, engineType: string): string {
    return btoa(`${engineType}_${url}`).replace(/[+=\/]/g, '')
  }
  
  // 清理特定引擎类型的缓存
  async clearCacheByEngine(engineType: string): Promise<void> {
    if (!this.db) return
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('engineType')
      const request = index.openCursor(IDBKeyRange.only(engineType))
      
      request.onerror = () => reject(request.error)
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          store.delete(cursor.primaryKey)
          cursor.continue()
        } else {
          resolve()
        }
      }
    })
  }
}