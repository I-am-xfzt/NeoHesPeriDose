import * as THREE from 'three';
import {
  Raycaster,
  Vector2,
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  WebGLRenderer,
  MeshLambertMaterial,
} from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

//Sets up the IFC loading
const ifcModels = [];

const subsets = {}; // 存储已创建的子集

// 创建子集材料
const preselectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff88ff,
  depthTest: false,
});
// Reference to the previous selection
let preselectModel = { id: -1 };

/**
 * 配置IFCLoader
 */
async function setUpIFCLoader() {
  try {
    loadIfcModel();
  } catch (err) {
    console.log(err);
    loadIfcModel();
  }
}


// Gets all the items of a category
async function getAll(category) {
  // return window.ifcLoader.ifcManager.getAllItemsOfType(0, category, false);
}

/**
 * 模型上材质
*/
function addMaterial(mesh, materialUrl) {
  const geometry = mesh.geometry; // 获取立方体的几何体

  var material;
  if (!materialUrl) {
    const texture = new THREE.TextureLoader().load(materialUrl); // 创建立方体的材质，并将材质数组传入构造函数
    material = new THREE.MeshBasicMaterial({ map: texture });
  } else {
    material = new THREE.MeshBasicMaterial({
      color: 0x00ffff, // 设置材质颜色为蓝色
      opacity: 0.5, // 设置材质透明度为0.5
      transparent: true, // 开启材质透明
      blending: THREE.AdditiveBlending, // 设置材质混合模式为加法混合
      depthWrite: false, // 关闭深度写入，避免发光部分被遮挡
      map: null, // 关闭材质贴图，不需要使用纹理贴图
      emissive: 0x00ffff, // 设置发光颜色为蓝色
      emissiveIntensity: 0.2 // 设置发光强度为0.2
    });
  }

  // 创建新的立方体的网格模型，并将几何体和材质传入构造函数
  const newMesh = new THREE.Mesh(geometry, material);
  return newMesh;
}

function createEffectComposer() {
  const { clientHeight, clientWidth } = this.container
  // 场景渲染器
  this.effectComposer = new EffectComposer(this.renderer)
  const renderPass = new RenderPass(this.scene, this.camera)
  this.effectComposer.addPass(renderPass)
  //创建辉光效果
  this.unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(clientWidth, clientHeight), 0, 0, 0)
  this.unrealBloomPass.threshold = 1 // 辉光强度
  this.unrealBloomPass.strength = 0 // 辉光阈值
  this.unrealBloomPass.radius = 1 //辉光半径
  this.unrealBloomPass.renderToScreen = false // 
  // 辉光合成器
  this.glowComposer = new EffectComposer(this.renderer)
  this.glowComposer.renderToScreen = false
  this.glowComposer.addPass(new RenderPass(this.scene, this.camera))
  this.glowComposer.addPass(this.unrealBloomPass)
  // 着色器
  let shaderPass = new ShaderPass(new THREE.ShaderMaterial({
    uniforms: {
      baseTexture: { value: null },
      bloomTexture: { value: this.glowComposer.renderTarget2.texture },
      tDiffuse: {
        value: null
      }
    },
    vertexShader: '\t\t\tvarying vec2 vUv;\n' +
      '\n' +
      '\t\t\tvoid main() {\n' +
      '\n' +
      '\t\t\t\tvUv = uv;\n' +
      '\n' +
      '\t\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n' +
      '\n' +
      '\t\t\t}',
    fragmentShader: '\t\t\tuniform sampler2D baseTexture;\n' +
      '\t\t\tuniform sampler2D bloomTexture;\n' +
      '\n' +
      '\t\t\tvarying vec2 vUv;\n' +
      '\n' +
      '\t\t\tvoid main() {\n' +
      '\n' +
      '\t\t\t\tgl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );\n' +
      '\n' +
      '\t\t\t}',
    defines: {}
  }), 'baseTexture')

  shaderPass.renderToScreen = true
  shaderPass.needsSwap = true
  this.effectComposer.addPass(shaderPass)
}


/**
 * 停止requestAnimationFrame动画
 * 
*/
export function stopAnimationFrame() {
  window.cancelAnimationFrame(animationFrameId);
}

/**
 * 释放所有的IFCLoader内存
 * 
*/


export class ThreeModel {
  constructor(scale, position, elemId) {
    this.scene = new THREE.Scene();  // 创建Three.js场景
    this.mesh = null; // 网格模型对象Mesh
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });; // 渲染器
    this.camera = null; // 相机
    this.controls = null; // 控制器
    this.threeCanvas = null; // 渲染场景的canvas元素
    this.scaleVector3 = new THREE.Vector3(...scale)
    this.positionVector3 = new THREE.Vector3(...position)
    this.raycaster = new Raycaster(); // 光线投射，用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
    this.dracoLoader = new DRACOLoader()
    this.loader = new GLTFLoader().setPath("/uploads/")
    this.raycaster.firstHitOnly = true;
    this.mouse = new Vector2(); // 鼠标的桌面二维坐标
    this.elemId = elemId
    this.glbInfos = null;
    this.mixer = null;
    this.animationModel = []
    this.Lights = {
      SpotLight: new THREE.SpotLight(0xff0000, 10.0),
      // PointLight: null,
      DirectionalLight: new THREE.DirectionalLight(0xffffff, 2),
      AmbientLight: new AmbientLight(0xffffff, 20)
    }; // 存储已创建的子集
  }
  initCamera(val = [45, window.innerWidth / window.innerHeight, 0.1, 1000]) {
    this.camera = new PerspectiveCamera(...val);
    this.camera.position.set(-10, 100, -10.065529508318049)
    this.camera.lookAt(this.positionVector3);
  }
  /**
   * 计算鼠标在屏幕上的位置
   * 
  */
  cast(event) {
    const bounds = this.threeCanvas.getBoundingClientRect();
    const x1 = event.clientX - bounds.left;
    const x2 = bounds.right - bounds.left;
    this.mouse.x = (x1 / x2) * 2 - 1;

    const y1 = event.clientY - bounds.top;
    const y2 = bounds.bottom - bounds.top;
    this.mouse.y = -(y1 / y2) * 2 + 1;

    // 将其放置在指向鼠标的相机上
    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 投射射线
    console.log(this.raycaster.intersectObjects([this.mesh]));

    return this.raycaster.intersectObjects([this.mesh]);
  }
  /**
   * 元素高亮
  */
  highlight(event, material, model) {
    const found = this.cast(event)[0];
    if (found) {
      // 获取模型ID
      model.id = found.object.modelID;
      // 获取快递ID
      const index = found.faceIndex;
      const geometry = found.object.geometry;
    } else {
      // 移除之前的高亮部分
    }
  }
  /**
   * 加载模型
  */
  loadModel(callBack, modelName = '建筑2.glb', setAnimation = true, scale = [
    1,
    1,
    -1
  ], position = [-8.260836601257324,
    1.139329195022583,
  -22.13763427734375]) {
    this.dracoLoader.setDecoderPath('/uploads/draco/')
    this.dracoLoader.setDecoderConfig({ type: "js" }); //使用兼容性强的draco_decoder.js解码器
    this.dracoLoader.preload();
    this.loader.setDRACOLoader(this.dracoLoader)
    return new Promise((resolve, reject) => {
      this.loader.load(modelName, (glbFile) => {
        console.log(glbFile);
        glbFile.scene.scale.set(...scale);
        glbFile.scene.position.set(...position);
        glbFile.scene.rotation.set(0, Math.PI, 0);
        if (setAnimation) {

        }
        this.scene.add(glbFile.scene)
        resolve(glbFile);
        glbFile = null;
      }, callBack, (err) => {
        reject(err)
      })
    })
  }
  /**
   * 鼠标拾取（双击）
   * 
  */
  pick = (event) => {
    const found = this.cast(event)[0];
    console.log(found, event);

    if (found) {
      const index = found.faceIndex;
      const geometry = found.object.geometry;
      const ifc = this.glbInfos;
      const id = ifc.getExpressId(geometry, index);
      console.log(id);
      const modelID = found.object.modelID;
      const output = document.getElementById('output');
      output.innerHTML = JSON.stringify(props, null, 2);
      console.log(props);
      console.log(type);
      console.log(materials);
      // console.log(spaces);
      console.log(typeProps);
      console.log(propSets);
      // logAllSlabs( modelID );

    }

  }
  /**
   * 渲染
  */
  initRender() {
    // antialias 抗锯齿 || alpha 控制默认的透明值
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById(this.elemId)?.appendChild(this.renderer.domElement);
    this.threeCanvas = document.getElementById(this.elemId);
    this.threeCanvas.ondblclick = this.pick;
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
    console.log(geometry, '1212');

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
    this.Lights.SpotLight.target = this.glbInfos.scene
    this.Lights.SpotLight.position.set(50, 80, 0)
    console.log(this.Lights.SpotLight, '聚光');
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
    // 获取模型边界框
    const boundingBox = new THREE.Box3().expandByObject(this.mesh);
    // 获取中心位置
    const center = boundingBox.getCenter(new THREE.Vector3());
    // 获取模型高度
    const height = boundingBox.max.y - boundingBox.min.y;
    // 计算相机位置
    const cameraPosition = new THREE.Vector3(0, height / 2.8, height * 2); // x, y, z
    // 计算相机目标点
    const target = new THREE.Vector3(center.x, center.y, center.z);
    // 计算模型绕 y 轴逆时针旋转 45 度的四元数。
    const angle = Math.PI / 4; // 将相机向左偏转 45 度
    const axis = new THREE.Vector3(0, 1, 0); // 绕 y 轴旋转
    const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    this.mesh.applyQuaternion(quaternion);
    // 将模型偏移原先坐标位置，可能会引发一系列的问题
    const offset = center.clone().negate(); // 计算模型在屏幕中心的偏移量，即将模型平移到屏幕中心的向量。
    this.mesh.position.add(offset); // 将模型平移到屏幕中心。
    this.controls.setAngle(1.4, -0.8, height * 2); // 控制器视角：有点俯视，且逆时针旋转30°左右
    this.controls.target.copy(center); // 将视角的目标点移到包围盒的中心点
    this.controls.update(); // 更新视角的位置
    // 设置相机位置和目标点
    this.camera.position.set(cameraPosition);// 设置相机位置 —— 这里好像没有发挥作用
    this.camera.position.copy(cameraPosition); // 将源摄像机的属性复制到新摄像机中。—— 这个去掉导致会看不到模型
    this.camera.lookAt(target); // camera.lookAt 与 orbitcontrol冲突不能使用，要用controls.target代替 //controls.target = new THREE.Vector3(0,-100,0);
    // camera.rotation.y = angle; //物体的均匀从左到又平移可以用相机旋转Y轴来实现 —— 这里好像没有发挥作用
    // camera.fov = 100; // 摄像机视锥体垂直视野角度，从视图的底部到顶部，以角度来表示。默认值是50。这个值是用来确定相机前方的垂直视角，角度越大，我们能够查看的内容就越多。
    console.log('Height：' + height);
  }
  /**
   * 控制器动画
  */
  animate() {
    let mixer = new THREE.AnimationMixer(this.glbInfos.scene);
    this.glbInfos.animations.forEach(v => {
      mixer.clipAction(v, this.glbInfos).setDuration(1).play();
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
      this.controls.update();
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
  init(callBack) {
    this.scene.background = new THREE.Color().setStyle("#141f3d");
    this.initCamera();
    this.initModel();
    this.initHelper();
    this.loadModel(callBack).then((glb) => {
      this.glbInfos = glb
      this.initRender();
      this.initControls();
      this.initLights();
      // this.setCameraView()
      this.animate()
    });
    const that = this
    window.addEventListener('resize', that.onWindowResize);
    window.onclick = (event) => that.highlight(event, preselectMat, preselectModel);
  }
}
/**
 * Three 初始化渲染场景
 *
 * @param {Object} comp vue组件的this对象
 * @param {String} elemId 渲染模型的元素Id
 * @param {Object} config 额外增加的一些配置
 * @param {Object} offsetOption 模型渲染偏移配置
 * @return {void}  无
 */
export function initThree(elemId, comp, config, offsetOption) {
  //Scene
  initScene();

  //Camera
  initCamera();

  //Lights
  initLights();

  //Setup IFC Loader
  setUpIFCLoader();

  //Renderer
  initRender(elemId);

  //Helper
  initHelper();

  //Controls
  initControls();

  setUpMultiThreading();

  //Animation loop
  animate();
}
