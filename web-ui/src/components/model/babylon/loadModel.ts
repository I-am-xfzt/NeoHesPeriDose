import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  Vector2,
  DirectionalLight,
  ISceneLoaderAsyncResult,
  HemisphericLight,
  SpotLight,
  MeshBuilder,
  StandardMaterial,
  AbstractMesh,
  // DynamicTexture,
  Animation,
  Quaternion,
  // ActionManager,
  SceneLoader,
  Axis,
  Color3,
  Color4,
  MultiMaterial,
  CubicEase,
  Mesh,
  ParticleSystem,
  EasingFunction,
  BloomEffect,
  DefaultRenderingPipeline,
  Texture,
  Tools,
  PostProcess,
  ShaderMaterial,
  Effect,
  GlowLayer,
  SceneSerializer,
} from '@babylonjs/core'
import '@babylonjs/inspector'
import '@babylonjs/core/Debug/debugLayer'
import { SkyMaterial } from '@babylonjs/materials'
import { NextLoading } from '@/utils/loading'
import { WorkingCircleWave } from './RippleEffect'

// 类型定义
type Vector3Tuple = [number, number, number]
type ModelFilesNameType<T extends readonly string[]> = T[number]
type BabylonCameraNameType = 'ArcRotateCamera'
type loadModelOptionsType<T> = Array<[T, boolean?, Vector3Tuple?]>

interface CameraInitParams {
  target: Vector3Tuple
  position: Vector3Tuple
  other: ArcRotateHelperOptions
}

interface SetLightParams {
  direction: Vector3Tuple
  intensity: number
  color: string
}

interface LightsInterface {
  SpotLight: SpotLight
  // PointLight: null,
  DirectionalLight: DirectionalLight
  HemisphericLight: HemisphericLight
}
/** 定义 Scene 类初始化参数的接口 */
export interface SceneOptions {
  /**
   * 定义场景是否应保持几何体的映射以通过 uniqueId 快速查找
   * 当几何体数量变得重要时，它将提高性能。
   */
  useGeometryUniqueIdsMap?: boolean

  /**
   * 定义场景中的每个材质是否应保持引用网格的映射以快速处理
   * 当网格数量变得重要时，它将提高性能，但可能会消耗更多内存。
   */
  useMaterialMeshMap?: boolean

  /**
   * 定义场景中的每个网格是否应保持引用克隆网格的映射以快速处理
   * 当网格数量变得重要时，它将提高性能，但可能会消耗更多内存。
   */
  useClonedMeshMap?: boolean

  /** 定义场景的创建是否应影响引擎（例如 UtilityLayer 的场景） */
  virtual?: boolean
}
export interface LightsOptions {
  direction?: Vector3Tuple
  position?: Vector3Tuple
  color: string
  intensity: number
  spotAngle: number
}

export interface ArcRotateHelperOptions {
  minPolarAngle: number
  maxPolarAngle: number
  rotateSpeed: number
  roam?: boolean
  roamSpeed?: number
}
export const sceneOptions: SceneOptions = {
    useGeometryUniqueIdsMap: true,
    useMaterialMeshMap: false,
    useClonedMeshMap: false,
    virtual: true,
  },
  //handleMeshNames = [],
  glbModelFiles = [
    'UV3.glb',
    'UV4.glb',
    'chargingvwhicle.glb',
    'underground.glb',
    '管道布局12.13改细1_3.glb'
  ] as const
export type GlbModelFilesType = ModelFilesNameType<typeof glbModelFiles>
export const theVector3 = (...args: Vector3Tuple): Vector3 => {
  return new Vector3(...args)
}

class MyArcRotateCamera extends ArcRotateCamera {
  public spinTo(
    whichprop: 'alpha' | 'beta' | 'radius',
    targetval: number,
    speed: number
  ) {
    const ease = new CubicEase()
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
    Animation.CreateAndStartAnimation(
      'at4',
      this,
      whichprop,
      speed,
      120,
      this[whichprop],
      targetval,
      0,
      ease
    )
  }
}

export class BabyLonModel {
  private scene: Scene // 创建babylonjs场景
  engine: Engine
  // mesh: Mesh; // 网格模型对象Mesh
  canvas: HTMLCanvasElement // 渲染器
  camera!: ArcRotateCamera // 相机
  controls = null // 控制器
  // raycaster = new Raycaster(); // 光线投射，用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
  mouse: Vector2 // 鼠标的桌面二维坐标
  eleId: string
  glbInfos: any
  mixer = null
  animationModel = []
  DirectionalLight!: LightsInterface['HemisphericLight']
  ground = MeshBuilder
  constructor(eleId: string, sceneColor: string) {
    !window.nextLoading && NextLoading.start()
    this.canvas = document.getElementById(eleId) as HTMLCanvasElement
    this.engine = new Engine(this.canvas, true)
    this.scene = new Scene(this.engine, sceneOptions) // 创建babylonjs场景
    // this.scene.clearColor = new Color4(0.058, 0.082, 0.121, 1)
    const sceneColor3 = new Color3().fromHexString(sceneColor)
    this.scene.clearColor = new Color4(sceneColor3.r, sceneColor3.g, sceneColor3.b, 1)
    this.mouse = new Vector2() // 鼠标的桌面二维坐标
    this.eleId = eleId
    this.glbInfos = null
    this.mixer = null
    this.animationModel = []
  }
  public setLight({ direction, intensity, color }: SetLightParams): void {
    this.DirectionalLight = new HemisphericLight(
      'DirectionalLight',
      theVector3(...direction),
      this.scene
    )
    this.DirectionalLight.groundColor = new Color3().fromHexString(color)
    this.DirectionalLight.intensity = intensity
  }
  // 场景雾
  public setSceneFog(): void {
    this.scene.fogMode = Scene.FOGMODE_LINEAR
    this.scene.fogColor = new Color3(160, 177, 187)
    this.scene.fogStart = 60
    this.scene.fogEnd = 400
  }
  public setPostProcess(): void {
    const bloomEffect = new BloomEffect(this.scene, 1, 0.15, 64),
      depthOfField = new DefaultRenderingPipeline(
        'DefaultRenderingPipelineA',
        true,
        this.scene,
        this.scene.cameras
      )
    bloomEffect.threshold = 0.9
    // bloomEffect.setEnabled(true); // 启用bloom效果
    if (depthOfField.isSupported) {
      // 设置景深 对性能有要求，破电脑带不起来服了。。。
      depthOfField.depthOfFieldEnabled = false
      depthOfField.depthOfField.focusDistance = 2000
      depthOfField.depthOfField.focalLength = 50
      depthOfField.depthOfField.fStop = 1.4
    }
  }
  private render(): void {
    let frameCount = 0
    const renderFrequency = 2 // 每 2 帧渲染一次
    this.engine.runRenderLoop(() => {
      if (frameCount % renderFrequency === 0) this.scene.render(true)
      frameCount++
    })
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }
  public initCamera(
    { target, position, other }: CameraInitParams,
    type: BabylonCameraNameType = 'ArcRotateCamera'
  ): void {
    const cameraType = {
      ArcRotateCamera: {
        init: () =>
          new ArcRotateCamera(
            'cameraA',
            Math.PI / 2,
            Math.PI / 2,
            500,
            theVector3(...target),
            this.scene
          ),
        helper: (params: ArcRotateHelperOptions) => this.ArcRotateHelper(params),
      }, // 相机
    }
    this.camera = cameraType[type].init()
    this.camera.inertia = 0.9
    this.camera.position = theVector3(...position)
    
    cameraType[type]['helper'](other)
    this.camera.attachControl(this.canvas, true) // 控制器
  }
  createTexture() {}
  public initGround(): void {
    const ground = this.ground.CreateGround(
        'CreateTiledGround',
        {
          width: 500,
          height: 500,
          subdivisions: 1,
          updatable: true,
        },
        this.scene
      ),
      shaderMaterial = new StandardMaterial('sta', this.scene),
      texture = new Texture('textures/resource.jpg', this.scene)
    shaderMaterial.maxSimultaneousLights = 6
    shaderMaterial.emissiveColor = new Color3(0, 0.003, 0.067)
    texture.uScale = 10
    texture.vScale = 10
    texture.uAng = 0 // U轴旋转角度
    texture.vAng = 0 // V轴旋转角度
    texture.wAng = 0 // W轴旋转角度
    texture.onLoadObservable.add(
      () => (
        (shaderMaterial.diffuseTexture = texture),
        (ground.material = shaderMaterial)
      )
    )
  }
  system() {
    const starSystem = new ParticleSystem('stars', 5000, this.scene)
    starSystem.particleTexture = new Texture('textures/skybox.png', this.scene)
    starSystem.emitter = theVector3(0, 100, 0) // 星星发射位置
    starSystem.minEmitPower = 0.1
    starSystem.maxEmitPower = 0.5
    starSystem.minLifeTime = 0.5
    starSystem.maxLifeTime = 5
    starSystem.minSize = 0.5
    starSystem.maxSize = 2
    starSystem.minAngularSpeed = 0
    starSystem.maxAngularSpeed = Math.PI
    starSystem.minInitialRotation = 0
    starSystem.maxInitialRotation = Math.PI
    starSystem.direction1 = theVector3(0, 1, 0)
    starSystem.direction2 = theVector3(0, 1, 0)
    starSystem.gravity = theVector3(0, -9.81, 0)
    starSystem.start()
  }
  public initSkyBox(): void {
    const skybox = this.ground.CreateBox('skyBox', { size: 10000 }, this.scene),
      skyMaterial = new SkyMaterial('skyBox', this.scene)
    skyMaterial.backFaceCulling = false
    skyMaterial.turbidity = 3.0

    // 设置天空的亮度
    skyMaterial.luminance = 1000

    // 设置太阳的位置，用于计算天空的光照效果
    skyMaterial.inclination = 0 // 太阳的仰角
    skyMaterial.azimuth = 0.25 // 太阳的方位角
    const starSystem = new ParticleSystem('stars', 1, this.scene)
    starSystem.particleTexture = new Texture(
      'textures/yuanquan.png',
      this.scene
    )
    starSystem.emitter = theVector3(0, 0, 0)
    starSystem.color1 = new Color4(1, 1, 1, 1) // 蓝色，不透明
    starSystem.color2 = new Color4(1, 1, 1, 1) // 蓝色，不透明
    starSystem.minLifeTime = 0.5
    starSystem.maxLifeTime = 5
    starSystem.minSize = 2
    starSystem.maxSize = 100
    starSystem.emitRate = 100 // 每秒发射1000个粒子
    starSystem.minEmitPower = 1
    starSystem.maxEmitPower = 3
    starSystem.direction1 = new Vector3(-1, 0, -1)
    starSystem.direction2 = new Vector3(1, 0, 1)
    const animSize = new Animation(
      'animSize',
      'scaling',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    )
    animSize.setKeys([
      {
        frame: 0,
        value: 0.1,
      },
      {
        frame: 100,
        value: 2,
      },
    ])

    starSystem.animations.push(animSize)
    this.scene.beginAnimation(starSystem, 0, 100, true)
    starSystem.start()
  }
  private cameraRoam(speed: number): void {
    const that = this
    // 控制相机 前后左右移动
    window.addEventListener('keydown', function (event) {
      const step = speed / 10,
        forward = that.camera.getDirection(Axis.Z),
        right = that.camera.getDirection(Axis.X)
      switch (event.key) {
        case 'w':
        case 'W':
          // 向前移动
          that.camera.target.addInPlace(forward.scale(step))
          break
        case 's':
        case 'S':
          // 向后移动
          that.camera.target.addInPlace(forward.scale(-step))
          break
        case 'a':
        case 'A':
          // 向左移动
          that.camera.target.addInPlace(right.scale(-step))
          break
        case 'd':
        case 'D':
          // 向右移动
          that.camera.target.addInPlace(right.scale(step))
          break
      }
    })
  }
  private ArcRotateHelper({
    minPolarAngle,
    maxPolarAngle,
    rotateSpeed,
    roam,
    roamSpeed,
  }: ArcRotateHelperOptions): void {
    this.camera.lowerBetaLimit = Math.PI / (180 / minPolarAngle)
    this.camera.upperBetaLimit = Math.PI / (180 / maxPolarAngle)
    this.camera.angularSensibilityX = 2000 / rotateSpeed // 水平旋转速度
    this.camera.angularSensibilityY = 2000 / rotateSpeed // 垂直旋转速度
    roam && roamSpeed && this.cameraRoam(roamSpeed)
  }
  /**
   * @description 限制模型旋转的范围
   * @param {AbstractMesh} pilot 模型
   */
  public limitModelHandle(pilot: AbstractMesh) {
    const minAlpha = -Math.PI / 120, // X轴旋转的最小值
      maxAlpha = Math.PI / 120, // X轴旋转的最大值
      minBeta = -Math.PI / 120, // Y轴旋转的最小值
      maxBeta = Math.PI / 120, // Y轴旋转的最大值
      minGamma = -Math.PI / 120, // Z轴旋转的最小值
      maxGamma = Math.PI / 120 // Z轴旋转的最大值

    pilot.rotationQuaternion = new Quaternion()
    this.scene.registerBeforeRender(() => {
      pilot.rotationQuaternion = Quaternion.RotationYawPitchRoll(
        pilot.rotation.y,
        pilot.rotation.x,
        pilot.rotation.z
      )
      pilot.rotation.x = Math.max(
        minAlpha,
        Math.min(maxAlpha, pilot.rotation.x)
      )
      pilot.rotation.y = Math.max(minBeta, Math.min(maxBeta, pilot.rotation.y))
      pilot.rotation.z = Math.max(
        minGamma,
        Math.min(maxGamma, pilot.rotation.z)
      )
      pilot.rotationQuaternion = Quaternion.RotationYawPitchRoll(
        pilot.rotation.y,
        pilot.rotation.x,
        pilot.rotation.z
      )
    })
  }
  public loadModel(
    modelName: GlbModelFilesType,
    optimize: boolean = true,
    position: Vector3Tuple = [0, 0, 0]
  ): Promise<ISceneLoaderAsyncResult> {
    const _func = (res: ISceneLoaderAsyncResult) => {
      res.meshes.forEach((mesh) => {
        mesh.outlineColor = new Color3(1, 0, 0) // new Color3(0.1137, 0.9686, 1)
        mesh.edgesColor = new Color4(0.1137, 0.9686, 1, 1)
      })
      const model = res.meshes[0]
      // model.rotation = theVector3(rotation);
      model.position = theVector3(...position)
      const updateLOD = () => {
        const distance = this.camera.radius
        if (distance < 5) {
          // 高细节设置
          model.renderingGroupId = 0
        } else if (distance < 15) {
          // 中细节设置
          model.renderingGroupId = 1
        } else {
          // 低细节设置
          model.renderingGroupId = 2
        }
      }
      if (optimize) {
        this.camera.onViewMatrixChangedObservable.add(updateLOD)
        model.isPickable = false // 如果不需要拾取模型，可以设置为 false
        model.doNotSyncBoundingInfo = true // 减少边界框同步的开销
      }
      return res
    }
    return new Promise((resolve, reject) => {
      SceneLoader.ImportMeshAsync(
        '',
        '/BABYLON/uploads/',
        modelName,
        this.scene
      )
        .then((res) => resolve(_func(res)))
        .catch(reject)
    })
  }
  /**
   * 导出场景或者模型为.babylon文件（json格式）
   * @param {string} filename - 文件名
   * @param {string} mOrs - 'scene' 或 'mesh'
   */
  public downLoadScene(filename = '模型场景', mOrs: 'scene' | 'mesh' = 'scene'): void {
    let objectUrl
    if (objectUrl) {
      window.URL.revokeObjectURL(objectUrl)
    }
    const target = mOrs === 'scene' ? this.scene : (this as any)[mOrs]?.[0]
    if (!target) {
      console.warn(`无法找到指定的对象: ${mOrs}`)
      return
    }
    const serializedMesh = SceneSerializer.SerializeMesh(target)
    const strMesh = JSON.stringify(serializedMesh)
    if (
      filename.toLowerCase().lastIndexOf('.babylon') !== filename.length - 8 ||
      filename.length < 9
    ) {
      filename += '.babylon'
    }
    const blob = new Blob([strMesh], { type: 'octet/stream' })
    Tools.Download(blob, filename)
  }
  // 创建自定义后期处理效果
  createAuraPostProcess() {
    // 1. 首先创建带纹理的基础材质

    // 创建波纹效果
    new WorkingCircleWave(this.scene)
    // const glowLayer = new GlowLayer('glowLayer', this.scene)
    // glowLayer.intensity = 0.5
    // glowLayer.referenceMeshToUseItsOwnMaterial(ground)
  }
  public clearSceneEvery(): void {
    this.scene.dispose()
    // 销毁引擎
    this.engine.dispose()
  }
  public async init(
    getLoadModelOptions: loadModelOptionsType<GlbModelFilesType>
  ): Promise<ISceneLoaderAsyncResult[]> {

    this.render()
    NextLoading.done(500)
    return await Promise.all(getLoadModelOptions.map((v) => this.loadModel(...v)))
  }
}
