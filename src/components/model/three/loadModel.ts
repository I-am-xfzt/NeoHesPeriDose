import * as THREE from 'three';
import {
  Raycaster,
  Vector2,
  AmbientLight,
  AxesHelper,
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
} from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
const glbModelFiles = ['实景7-ys.glb', '科技场景-uv动画4-ys.glb', '风机-实景-ys.glb', '风机科技3-ys.glb', '风机-展开5-ys.glb'] as const;

/**
 * @description 获取三维向量
 * @param {* MyTuple } args 
 * @returns {* Vector3 } 三维向量
 */
export const theVector3 = (...args: MyTuple): Vector3 => {
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

type GlbModelFilesType = typeof glbModelFiles[number];
const createModelObject = <K extends GlbModelFilesType, V = GLTF>(key: K, value: V): Record<K, V> => ({ [key]: value } as Record<K, V>);
type ModelObject = ReturnType<typeof createModelObject<GlbModelFilesType, GLTF>>;
export class ThreeModel {
  scene: THREE.Scene;  // 创建Three.js场景
  mesh?: THREE.Mesh; // 网格模型对象Mesh
  renderer: WebGLRenderer; // 渲染器
  camera: PerspectiveCamera; // 相机
  controls?: OrbitControls; // 控制器
  threeCanvas: HTMLCanvasElement; // 渲染场景的canvas元素
  scaleVector3: Vector3
  positionVector3: Vector3
  raycaster: Raycaster; // 光线投射，用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
  dracoLoader: DRACOLoader;
  loader: GLTFLoader;
  mouse: Vector2; // 鼠标的桌面二维坐标
  elemId: string;
  glbInfos?: ModelObject[];
  mixer: null;
  animationModel: [];
  Lights: LightsInterface;
  constructor(scale: MyTuple, position: MyTuple, elemId: string) {
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
  }
  private initCamera() {
    this.camera.position.set(-10, 100, -10.065529508318049)
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
  // ({ loaded, total }) => {
  //   this.loaded += loaded;
  //   this.total += total;
  // }
  /**
   * 加载模型
  */
  loadModel(callBack = () => { }, modelName: GlbModelFilesType, setAnimation = true, scale: MyTuple = [1, 1, -1], position: MyTuple = [-8.260836601257324, 1.139329195022583, -22.13763427734375]): Promise<ModelObject> {
    return new Promise((resolve, reject) => {
      this.loader.load(modelName, (glbFile: GLTF) => {
        console.log(glbFile);
        glbFile.scene.scale.set(...scale);
        glbFile.scene.position.set(...position);
        glbFile.scene.rotation.set(0, Math.PI, 0);
        if (setAnimation) {

        }
        this.scene.add(glbFile.scene)
        const result = createModelObject(modelName, glbFile)
        resolve(result);
      }, callBack, (err) => {
        reject(err)
      })
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
  initModel() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }
  /**
  * 光线
  */
  initLights() {
    // 告诉平行光需要开启阴影投射
    this.Lights.DirectionalLight.position.set(0, 50, 0);
    this.Lights.DirectionalLight.rotation.set(-0.6108653, 1.2217305, -0.5235988)
    // this.Lights.DirectionalLight.castShadow = true;
    this.Lights.SpotLight.angle = 0.8
    const target = this.glbInfos?.find(v => Object.hasOwn(v, 'sm_car.gltf'));
    this.Lights.SpotLight.target = Object.values(target!)[0].scene;
    this.Lights.SpotLight.position.set(50, 80, 0)
    for (const key in this.Lights) {
      this.scene.add(this.Lights[key]);
    }
    this.scene.add(this.Lights.SpotLight.target)
  }
  /**
   * 获取模型的高度，并设置相机初始视角（也初始化控制器的视角）
   * 
  */
  /**
   * 辅助工具
  */
  initHelper() {
    // // grids辅助网格
    // const grid = new GridHelper(50, 30);
    // this.scene.add(grid);

    // // Axes辅助轴线
    // // axes轴（右手坐标系）：红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    // const axes = new AxesHelper();
    // axes.material.depthTest = false;
    // axes.renderOrder = 1;
    // this.scene.add(axes);
  }
  setCameraView() {

  }
  /**
   * 控制器动画
  */
  animate() {
    // let mixer = new AnimationMixer(this.glbInfos?.scene!);
    // this.glbInfos?.animations.forEach(v => {
    //   mixer.clipAction(v, this.glbInfos?.scene).setDuration(1).play();
    // })
    // const _func = () => {
    //   // let v = 0
    //   // v += 0.01
    //   // this.camera.position.x = 100 * Math.cos(v)
    //   // this.camera.position.z = 100 * Math.sin(v)
    //   // this.camera.lookAt(0, 0, 0)
    //   mixer && mixer.update(new THREE.Clock().getDelta())
    //   console.log(mixer, 'donghua');
    //   //更新控制器
    //   this.render();
    //   this.controls?.update();
    // }
    // requestAnimationFrame(_func);  // 使用requestAnimationFrame可以让浏览器根据自身的渲染节奏调整动画的帧率，从而避免过度渲染，优化three.js渲染性能
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
  async init(callBack = () => { }) {
    this.scene.background = new THREE.Color().setStyle("#141f3d");
    this.initCamera();
    this.initModel();
    this.initHelper();
    const res = await Promise.all(glbModelFiles.map((v: GlbModelFilesType) => this.loadModel(callBack, v)))
    this.glbInfos = res
    this.initRender();
    this.initControls();
    this.initLights();
    // this.setCameraView()
    this.animate()
    const that = this
    window.addEventListener('resize', that.onWindowResize);
    // window.onclick = (event) => that.highlight(event, preselectMat, preselectModel);
  }
}
