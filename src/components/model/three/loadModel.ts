import * as THREE from 'three';
import {
  Raycaster,
  Vector2,
  AmbientLight,
  AxesHelper,
  CubeTextureLoader,
  DirectionalLight,
  AnimationMixer,
  SpotLight,
  GridHelper,
  TextureLoader,
  MeshBasicMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  MeshLambertMaterial,
  Fog
} from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import { ref } from 'vue';
import { NextLoading } from "@/utils/loading.ts"
export const progress = ref<number>(0)
// const CompositionOptions = Object.keys(import.meta.glob('/public/THREE/*.glb')).map(v => (v.split('/')).at(-1)) as readonly string[];
// console.log(CompositionOptions)
// export const glbModelFiles = CompositionOptions;
export const glbModelFiles = ['实景7-ys.glb', '风机-实景-ys.glb', '科技场景-uv动画4-ys.glb', '风机科技3-ys.glb', '风机-展开5-ys.glb'] as const;

/**
 * @description 获取三维向量
 * @param {* Vector3Tuple } args 
 * @returns 三维向量 {x: 0.6, y: 0.6, z: 0.6}
 */
export const theVector3 = (...args: Vector3Tuple): Vector3 => {
  return new Vector3(...args)
}

interface LightsInterface {
  'SpotLight': SpotLight;
  'DirectionalLight': DirectionalLight;
  'AmbientLight': AmbientLight;
  [key: string]: SpotLight | DirectionalLight | AmbientLight; // 索引签名
}
type GLTF = {
  scene: THREE.Group | THREE.Object3D;
  scenes: THREE.Group[];
  cameras: THREE.Camera[];
  animations: THREE.AnimationClip[];
  asset: any; // 可以根据需要进一步细化这个类型
};
export type loadModelOptionsType = (data: GlbModelFilesType[]) => Array<[GlbModelFilesType, boolean, Vector3Tuple]>;
export type GlbModelFilesType = ModelFilesNameType<typeof glbModelFiles>;
export interface LightsOptionsType {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  color: THREE.Color;
  intensity: number;
  spotAngle: number;
  unSetOther?: boolean;
}
const createModelObject = <K extends GlbModelFilesType, V = GLTF>(key: K, value: V): Record<K, V> => ({ [key]: value } as Record<K, V>);
type ModelObject = ReturnType<typeof createModelObject<GlbModelFilesType, GLTF>>;
/**
 * @author fanyonghao 
 * @class ThreeModel 类用于创建和管理Three.js场景，包括加载模型、初始化相机、渲染器、控制器和灯光等。
 * @constructor
 */
export class ThreeModel {
  /**
   * Three.js 场景对象。
   */
  scene: THREE.Scene;
  /**
   * 网格模型对象。
   */
  mesh?: THREE.Mesh;
  /**
   * WebGL渲染器实例。
   */
  renderer: WebGLRenderer;
  /**
   * 透视相机实例。
   */
  camera: PerspectiveCamera;
  /**
   * 轨道控制器实例，可能未定义。
   */
  controls?: OrbitControls;
  /**
   * 渲染场景的canvas元素。
   */
  threeCanvas: HTMLCanvasElement;
  /**
   * 缩放三维向量。
   */
  scaleVector3: Vector3
  /**
   * 位置三维向量。
   */
  positionVector3: Vector3
  /**
   * 用于鼠标拾取的光线投射器。
   */
  raycaster: Raycaster; // 光线投射，用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
  /**
   * DRACOLoader 实例，用于加载优化的模型。
   */
  dracoLoader: DRACOLoader;
  /**
   * GLTFLoader 实例，用于加载GLTF模型。
   */
  loader: GLTFLoader;
  /**
   * 鼠标的二维坐标。
   */
  mouse: Vector2;
  /**
   * 元素ID，用于获取canvas元素。
   */
  elemId: string;
  /**
   * 模型信息数组。
   */
  glbInfos?: ModelObject[];
  /**
   * 混合器，用于动画控制。
   */
  mixer: null;
  /**
   * 动画模型数组。
   */
  animationModel: [];
  GlbName: GlbModelFilesType[];
  /**
   * 灯光对象，包含不同类型的灯光。
   */
  Lights: LightsInterface;
  /**
   * 灯光的一些配置项。
   */
  LightsOptions: LightsOptionsType;
  /**
   * @constructor 构造函数，初始化ThreeModel实例。
   * @param GlbName - 模型文件名数组。
   * @param scale - 模型缩放向量。
   * @param position - 模型位置向量。
   * @param elemId - 渲染场景的canvas元素ID。
   * @param LightsOptions - 灯光配置选项。
   */
  constructor(GlbName: GlbModelFilesType[], scale: Vector3Tuple, position: Vector3Tuple, elemId: string, LightsOptions: LightsOptionsType) {
    this.GlbName = GlbName;
    this.scene = new THREE.Scene();  // 创建Three.js场景
    this.mesh = undefined; // 网格模型对象Mesh
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });; // 渲染器
    this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000); // 相机
    this.controls = undefined; // 控制器
    this.threeCanvas = document.getElementById(elemId) as HTMLCanvasElement;
    this.scaleVector3 = theVector3(...scale)
    this.positionVector3 = theVector3(...position)
    this.raycaster = new Raycaster(); // 光线投射，用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
    this.dracoLoader = new DRACOLoader()
    this.loader = new GLTFLoader().setPath("THREE/")
    this.loader.setMeshoptDecoder(MeshoptDecoder)
    this.dracoLoader.setDecoderPath('THREE/draco/')
    this.dracoLoader.setDecoderConfig({ type: "js" }); //使用兼容性强的draco_decoder.js解码器
    this.dracoLoader.preload();
    this.loader.setDRACOLoader(this.dracoLoader)
    this.mouse = new Vector2(); // 鼠标的桌面二维坐标
    this.elemId = elemId
    this.glbInfos = undefined;
    this.mixer = null;
    this.animationModel = []
    this.Lights = {
      SpotLight: new SpotLight(0xff0000, 10.0),
      DirectionalLight: new DirectionalLight(0xffffff, 2),
      AmbientLight: new AmbientLight(0xffffff, 20)
    };
    this.LightsOptions = LightsOptions
  }
  private initCamera(lookAt: Vector3Tuple = [10, 200, 10.065529508318049]) {
    this.camera.position.set(...lookAt)
    this.camera.lookAt(this.positionVector3);
  }
  /**
   * 计算鼠标在屏幕上的位置
   * 
  */
  cast(event: any) {
    // const bounds = this.threeCanvas.getBoundingClientRect();
    // const x1 = event.clientX - bounds.left;
    // const x2 = bounds.right - bounds.left;
    // this.mouse.x = (x1 / x2) * 2 - 1;

    // const y1 = event.clientY - bounds.top;
    // const y2 = bounds.bottom - bounds.top;
    // this.mouse.y = -(y1 / y2) * 2 + 1;

    // // 将其放置在指向鼠标的相机上
    // this.raycaster.setFromCamera(this.mouse, this.camera);
    // // 投射射线

    // return this.raycaster.intersectObjects([this.mesh]);
  }
  /**
   * @description 加载模型
   * @param {GlbModelFilesType} modelName 模型名称
   * @param {Boolean} setAnimation 是否执行模型动画
   * @param {Vector3Tuple} position 模型加载后的位置
   * @returns  返回模型对象
  */
  loadModel(modelName: GlbModelFilesType, setAnimation: boolean = true, position: Vector3Tuple = [-8.260836601257324, 1.139329195022583, -22.13763427734375]): Promise<ModelObject> {
    return new Promise((resolve, reject) => {
      this.loader.load(modelName, (glbFile: GLTF) => {
        console.log(glbFile);
        glbFile.scene.scale.set(...Object.values(this.scaleVector3) as Vector3Tuple);
        glbFile.scene.position.set(...position);
        glbFile.scene.rotation.set(0, Math.PI, 0);
        if (setAnimation && glbFile.animations.length > 0) {
          this.animate(glbFile.scene, glbFile.animations)
        }
        this.scene.add(glbFile.scene)
        const result = createModelObject(modelName, glbFile)
        resolve(result);
      }, ({ loaded, total, lengthComputable }) => {
        if (lengthComputable) {
          progress.value = (loaded / total) * 100;
          console.log(`${progress.value.toFixed(2)}% loaded`);
        } else {
          console.log(`Loaded ${loaded} bytes`);
        }
      }, reject)
    })
  }
  /**
   * 鼠标拾取（双击）
   * 
  */
  pick = () => {

  }
  /**
   * 渲染
  */
  initRender() {
    // antialias 抗锯齿 || alpha 控制默认的透明值
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById(this.elemId)?.appendChild(this.renderer.domElement);
    // this.threeCanvas.ondblclick = this.pick;
  }
  /**
   * 控制器
  */
  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera); //执行渲染操作
    });//监听鼠标、键盘事件
    //相关限制方法：
    // this.controls.enablePan = false; //禁止平移
    // this.controls.enableZoom = false;//禁止缩放
    // this.controls.enableRotate = false; //禁止旋转
    // 缩放范围
    this.controls.minZoom = 0.5;
    this.controls.maxZoom = 2;
    // 上下旋转范围
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2;
    // 左右旋转范围
    this.controls.minAzimuthAngle = -Math.PI / 2;
    this.controls.maxAzimuthAngle = Math.PI / 2;
    // /**
    //  * 设置控制器角度
    //  * phi 是俯仰角（0 俯视 --> 大于0，趋于仰视）
    //  * theta 是水平旋转角（小于0，逆时针转；大于0，顺时针转）
    //  * distance 是距离
    //  * 
    // */
    // this.controls.setAngle = (phi, theta, distance) => {
    //   let r = distance || this.controls.object.position.distanceTo(this.controls.target);
    //   let x = r * Math.cos(phi - Math.PI / 2) * Math.sin(theta) + this.controls.target.x;
    //   let y = r * Math.sin(phi + Math.PI / 2) + this.controls.target.y;
    //   let z = r * Math.cos(phi - Math.PI / 2) * Math.cos(theta) + this.controls.target.z;
    //   this.controls.object.position.set(x, y, z);
    //   this.controls.object.lookAt(this.controls.target);
    // };

    this.controls.enableDamping = true; // 使动画循环使用时阻尼或自转 意思是否有惯性
    // controls.autoRotate = true; // 自动旋转
    this.controls.rotateSpeed = 0.5; // 旋转速度(ORBIT的旋转速度，鼠标左键)，默认1
    this.controls.panSpeed = 0.5; // 位移速度(ORBIT的位移速度，鼠标右键)，默认1
    // 请注意，可以通过将 polarAngle 或者 azimuthAngle 的min和max设置为相同的值来禁用单个轴， 这将使得垂直旋转或水平旋转固定为所设置的值。
    // 你能够垂直旋转的角度的上、下限，范围是0到Math.PI，其默认值为Math.PI。
    this.controls.target.set(0, 0, 0);
    this.controls.maxDistance = 200;// 设置相机距离原点的最远距离
  }
  /**
   * 渲染场景
  */
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  /**
  * 光线
  */
  initLights() {
    // 告诉平行光需要开启阴影投射
    const { position, rotation, spotAngle, intensity, unSetOther } = this.LightsOptions
    this.Lights.DirectionalLight.position.set(...position);
    this.Lights.DirectionalLight.rotation.set(...rotation)
    this.Lights.DirectionalLight.intensity = intensity;
    this.scene.add(this.Lights.DirectionalLight)
    if (!unSetOther) {
      this.Lights.SpotLight.angle = spotAngle;
      const target = this.glbInfos?.find(v => Object.hasOwn(v, this.GlbName[0]));
      this.Lights.SpotLight.target = Object.values(target!)[0].scene;
      this.Lights.SpotLight.position.set(...position)
      for (const key in this.Lights) {
        this.scene.add(this.Lights[key]);
      }
      this.scene.add(this.Lights.SpotLight.target)
    }
  }
  /**
   * 获取模型的高度，并设置相机初始视角（也初始化控制器的视角）
   * 
  */
  /**
   * 初始化和场景相关： 天空盒、地面、雾等
  */
  initAboutScene() {
    // 加载天空盒纹理
    const loader = new CubeTextureLoader();
    const skyboxTexture = loader.load([
      'skyBox/skybox_px.jpg', // 正面
      'skyBox/skybox_nx.jpg', // 背面
      'skyBox/skybox_py.jpg', // 上面
      'skyBox/skybox_ny.jpg', // 下面
      'skyBox/skybox_pz.jpg', // 右面
      'skyBox/skybox_nz.jpg', // 左面
    ]);
    // 设置天空盒
    this.scene.background = skyboxTexture;
    this.scene.fog = new Fog(0xcccccc, 52, 300);
  }
  setCameraView() {

  }
  /**
   * 控制器动画
  */
  animate(scene: GLTF['scene'], animations: GLTF['animations']) {
    let mixer = new AnimationMixer(scene);
    animations.forEach(v => {
      const clipAction = mixer.clipAction(v);
      clipAction.setLoop(THREE.LoopRepeat, 2)
      clipAction.play();
    })
    const _func = () => {
      // let v = 0
      // v += 0.01
      // this.camera.position.x = 100 * Math.cos(v)
      // this.camera.position.z = 100 * Math.sin(v)
      // this.camera.lookAt(0, 0, 0)
      mixer && mixer.update(new THREE.Clock().getDelta())
      console.log(mixer, 'donghua');
      //更新控制器
      this.render();
      // this.controls!.update();
    }
    requestAnimationFrame(_func);  // 使用requestAnimationFrame可以让浏览器根据自身的渲染节奏调整动画的帧率，从而避免过度渲染，优化three.js渲染性能
  }
  /**
   * 视窗的尺寸重新变化
  */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }
  /**
   * @description 设置地面
   */
  async initGround() {
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const textureLoader = new TextureLoader();
    // 顶点着色器
    const vertexShader = `
          varying vec2 vUv;
          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`;
    // 片段着色器
    const fragmentShader = `
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        varying vec2 vUv;
        void main() {
            vec4 texColor1 = texture2D(texture1, vUv);
            vec4 texColor2 = texture2D(texture2, vUv);
            gl_FragColor = texColor1 * texColor2;
        }
        `;
    const loadArray = [
      {
        path: "textures/resource2.png"
      },
      {
        path: "textures/resource1.jpg"
      }
    ]
    const res = await Promise.all(loadArray.map(v => textureLoader.load(v.path)))
    const theMaterials = res.map(item => {
      item.wrapS = THREE.RepeatWrapping; // 水平重复
      item.wrapT = THREE.RepeatWrapping; // 垂直重复
      item.repeat.x = 20; // 根据需要调整重复次数       
      item.repeat.y = 20; // 根据需要调整重复次数
      return new MeshBasicMaterial({
        map: item,
        transparent: true,
        color: 0x141f3d,
        side: THREE.DoubleSide
      })
    })
    console.log(res, theMaterials);
    // 创建材质
    const material = new THREE.ShaderMaterial({
      uniforms: {
          texture1: { value: res[0] },
          texture2: { value: res[1] }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    const plane = new THREE.Mesh(geometry, material)
    plane.rotation.x = -Math.PI / 2
    this.scene.add(plane)
  }
  /**
   * @description 设置场景颜色
   * @param color 
   */
  setSceneColor(color: string = "#141f3d") {
    this.scene.background = new THREE.Color().setStyle(color);
  }
  async init(getLoadModelOptions: loadModelOptionsType, unLoad?: EmptyObjectType<boolean>, color?: string) {
    this.setSceneColor(color)
    this.initRender();
    this.initCamera();
    !unLoad!?.notSkyBox && this.initAboutScene();
    this.initControls();
    const res = await Promise.all(getLoadModelOptions(this.GlbName).map((v) => this.loadModel(...v)))
    this.glbInfos = res
    this.initLights();
    // this.setCameraView()
    NextLoading.done(800);
    const that = this
    window.addEventListener('resize', that.onWindowResize);
    // window.onclick = (event) => that.highlight(event, preselectMat, preselectModel);
  }
}
