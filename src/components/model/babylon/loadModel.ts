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
    // Axis,
    Color3,
    Color4,
    // CircleEase,
    CubicEase,
    // ExecuteCodeAction,
    ParticleSystem,
    EasingFunction,
    BloomEffect,
    DefaultRenderingPipeline,
    Texture,
    // ShaderMaterial,
    // RichTypeColor4
} from '@babylonjs/core';
import "@babylonjs/inspector";
import "@babylonjs/core/Debug/debugLayer";
import { SkyMaterial } from '@babylonjs/materials'
interface LightsInterface {
    SpotLight: SpotLight;
    // PointLight: null,
    DirectionalLight: DirectionalLight;
    HemisphericLight: HemisphericLight;
}
/** 定义 Scene 类初始化参数的接口 */
export interface SceneOptions {
    /**
     * 定义场景是否应保持几何体的映射以通过 uniqueId 快速查找
     * 当几何体数量变得重要时，它将提高性能。
     */
    useGeometryUniqueIdsMap?: boolean;

    /**
     * 定义场景中的每个材质是否应保持引用网格的映射以快速处理
     * 当网格数量变得重要时，它将提高性能，但可能会消耗更多内存。
     */
    useMaterialMeshMap?: boolean;

    /**
     * 定义场景中的每个网格是否应保持引用克隆网格的映射以快速处理
     * 当网格数量变得重要时，它将提高性能，但可能会消耗更多内存。
     */
    useClonedMeshMap?: boolean;

    /** 定义场景的创建是否应影响引擎（例如 UtilityLayer 的场景） */
    virtual?: boolean;
}
const sceneOptions: SceneOptions = {
    useGeometryUniqueIdsMap: true,
    useMaterialMeshMap: false,
    useClonedMeshMap: false,
    virtual: true,
},
    //handleMeshNames = [],
    glbModelFiles = ['充电中车辆.glb', '地下车库.glb', 'UV1.glb', 'UV2.glb']
export const theVector3 = (...args: MyTuple): Vector3 => {
    return new Vector3(...args)
}
class MyArcRotateCamera extends ArcRotateCamera {
    public spinTo(whichprop: "alpha" | "beta" | "radius", targetval: number, speed: number) {
        const ease = new CubicEase();
        ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
        Animation.CreateAndStartAnimation('at4', this, whichprop, speed, 120, this[whichprop], targetval, 0, ease);
    }
}
export class BabyLonModel {
    private scene: Scene;  // 创建babylonjs场景
    engine: Engine;
    // mesh: Mesh; // 网格模型对象Mesh
    canvas: HTMLCanvasElement; // 渲染器
    camera: MyArcRotateCamera; // 相机
    controls = null; // 控制器
    // raycaster = new Raycaster(); // 光线投射，用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
    // raycaster.firstHitOnly = true;
    mouse: Vector2; // 鼠标的桌面二维坐标
    eleId: string;
    glbInfos: any;
    mixer = null;
    animationModel = []
    DirectionalLight: LightsInterface['HemisphericLight'];
    ground = MeshBuilder;
    constructor(position: MyTuple, eleId: string) {
        this.canvas = document.getElementById(eleId) as HTMLCanvasElement
        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine, sceneOptions);  // 创建babylonjs场景
        // this.scene.clearColor = new Color4(0.058, 0.082, 0.121, 1)
        this.scene.clearColor = new Color4(10 / 255, 22 / 255, 32 / 255, 1)
        this.camera = new MyArcRotateCamera('cameraA', Math.PI / 2, Math.PI / 2, 100, theVector3(3.1427378820900844, 0, 3.103133270236968), this.scene); // 相机
        this.camera.position = theVector3(...position)
        this.mouse = new Vector2(); // 鼠标的桌面二维坐标
        this.eleId = eleId
        this.glbInfos = null;
        this.mixer = null;
        this.animationModel = [];
        this.DirectionalLight = new HemisphericLight('DirectionalLight', theVector3(0, 1, 0), this.scene);
    }
    public setLight(): void {
        this.DirectionalLight.groundColor = new Color3(0, 0, 1)
        this.DirectionalLight.intensity = 1
    }
    // 场景雾
    public setSceneFog(): void {
        this.scene.fogMode = Scene.FOGMODE_LINEAR;
        this.scene.fogColor = new Color3(160, 177, 187)
        this.scene.fogStart = 60;
        this.scene.fogEnd = 400;
    }
    public setPostProcess(): void {
        const bloomEffect = new BloomEffect(this.scene, 1, 0.15, 64),
            depthOfField = new DefaultRenderingPipeline('DefaultRenderingPipelineA', true, this.scene, this.scene.cameras)
        bloomEffect.threshold = 0.9;
        // bloomEffect.setEnabled(true); // 启用bloom效果
        if (depthOfField.isSupported) {
            // 设置景深 对性能有要求，破电脑带不起来服了。。。
            depthOfField.depthOfFieldEnabled = false;
            depthOfField.depthOfField.focusDistance = 2000
            depthOfField.depthOfField.focalLength = 50;
            depthOfField.depthOfField.fStop = 1.4
        }
    }
    private render(): void {
        // this.setSceneFog()
        this.engine.runRenderLoop(() =>
            (this.initCamera(), setTimeout(() => this.scene.render(true), 0))
        )
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
    public initCamera(): void {
        this.camera.setTarget(theVector3(3.1427378820900844, 0, 3.103133270236968))
        this.camera.lowerAlphaLimit = Math.PI / 3; // 最小alpha值
        this.camera.upperAlphaLimit = Math.PI; // 最大alpha值
        this.camera.lowerBetaLimit = Math.PI / 6; // 最小beta值，限制从下方看上方的角度
        this.camera.upperBetaLimit = Math.PI / 2; // 最大beta值，限制从上方看下方的角度
        this.camera.lowerRadiusLimit = 50
        this.camera.upperRadiusLimit = 500
        this.camera.speed = 20
        this.camera.useAutoRotationBehavior = false
        // this.cameraHelper()
        this.camera.spinTo("alpha", Math.PI / 2, 50); // 在1秒内将alpha旋转到90度
        this.camera.spinTo("beta", Math.PI / 2, 50); // 在1秒内将beta旋转到105度
        this.camera.spinTo("radius", 250, 50); // 在1秒内将半径缩放到250
        this.camera.attachControl(this.canvas, true); // 控制器
    }
    createTexture() {

    }
    public initGround(): void {
        const ground = this.ground.CreateGround("CreateTiledGround", {
            width: 500,
            height: 500,
            subdivisions: 1,
            updatable: true
        }, this.scene),
            shaderMaterial = new StandardMaterial('sta', this.scene)
            ,texture = new Texture("textures/resource.jpg", this.scene)
        shaderMaterial.maxSimultaneousLights = 6
        shaderMaterial.emissiveColor = new Color3(0, 0.003, 0.067)
        texture.uScale = 10;
        texture.vScale = 10;
        texture.uAng = 0; // U轴旋转角度
        texture.vAng = 0; // V轴旋转角度
        texture.wAng = 0; // W轴旋转角度
        texture.onLoadObservable.add(() => (
            shaderMaterial.diffuseTexture = texture,
            ground.material = shaderMaterial
        ))
        // const texture1 = new Texture("textures/dots.png", this.scene),
        //     texture2 = new Texture("textures/resource.jpg", this.scene),
        //     texture3 = new Texture("textures/yuanquan.png", this.scene);
        // [texture1, texture2 ,texture3].forEach(v => {
        //     v.uScale = 20;
        //     v.vScale = 20
        //     v.uAng = 0; // U轴旋转角度
        //     v.vAng = 0; // V轴旋转角度
        //     v.wAng = 0; // W轴旋转角度
        // })

        // this.scene.beginAnimation(texture3, 0, 100, true);
        // shaderMaterial.diffuseTexture = texture1;
        // shaderMaterial.opacityTexture = texture2;
        // shaderMaterial.emissiveTexture = texture3
        // ground.material = shaderMaterial
        // const animTexture3 = new Animation("animTexture3", "uScale", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        // animTexture3.setKeys([{
        //     frame: 0,
        //     value: 1
        // }, {
        //     frame: 100,
        //     value: 2
        // }]);
        // texture3.animations.push(animTexture3);
    }
    system() {
        const starSystem = new ParticleSystem("stars", 5000, this.scene);
        starSystem.particleTexture = new Texture("textures/skybox.png", this.scene);
        starSystem.emitter = theVector3(0, 100, 0); // 星星发射位置
        starSystem.minEmitPower = 0.1;
        starSystem.maxEmitPower = 0.5;
        starSystem.minLifeTime = 0.5;
        starSystem.maxLifeTime = 5;
        starSystem.minSize = 0.5;
        starSystem.maxSize = 2;
        starSystem.minAngularSpeed = 0;
        starSystem.maxAngularSpeed = Math.PI;
        starSystem.minInitialRotation = 0;
        starSystem.maxInitialRotation = Math.PI;
        starSystem.direction1 = theVector3(0, 1, 0);
        starSystem.direction2 = theVector3(0, 1, 0);
        starSystem.gravity = theVector3(0, -9.81, 0);
        starSystem.start();
    }
    public initSkyBox(): void {
        const skybox = this.ground.CreateBox("skyBox", { size: 10000 }, this.scene)
            , skyMaterial = new SkyMaterial("skyBox", this.scene);
        skyMaterial.backFaceCulling = false;
        skyMaterial.turbidity = 3.0;

        // 设置天空的亮度
        skyMaterial.luminance = 1000;

        // 设置太阳的位置，用于计算天空的光照效果
        skyMaterial.inclination = 0; // 太阳的仰角
        skyMaterial.azimuth = 0.25; // 太阳的方位角
        const starSystem = new ParticleSystem("stars", 1, this.scene);
        starSystem.particleTexture = new Texture("textures/yuanquan.png", this.scene);
        starSystem.emitter = theVector3(0, 0, 0)
        starSystem.color1 = new Color4(1, 1, 1, 1); // 蓝色，不透明
        starSystem.color2 = new Color4(1, 1, 1, 1); // 蓝色，不透明
        starSystem.minLifeTime = 0.5;
        starSystem.maxLifeTime = 5;
        starSystem.minSize = 2;
        starSystem.maxSize = 100;
        starSystem.emitRate = 100; // 每秒发射1000个粒子
        starSystem.minEmitPower = 1;
        starSystem.maxEmitPower = 3;
        starSystem.direction1 = new Vector3(-1, 0, -1);
        starSystem.direction2 = new Vector3(1, 0, 1);
        const animSize = new Animation("animSize", "scaling", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        animSize.setKeys([{
            frame: 0,
            value: 0.1
        }, {
            frame: 100,
            value: 2
        }]);

        starSystem.animations.push(animSize);
        this.scene.beginAnimation(starSystem, 0, 100, true);
        starSystem.start()
    }
    private cameraHelper(name: "alpha" | "radius" = "alpha", FPS: number = 30, frameFrom: number = 0, frameTo: number = 60): void {
        const rotationAnimation = new Animation(`${name}Animation`, name, FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT),
            keys = [];
        keys.push({ frame: frameFrom, value: this.camera[name] });
        keys.push({ frame: frameTo, value: this.camera[name] + Math.PI / 2 });
        rotationAnimation.setKeys(keys);
        this.camera.animations.push(rotationAnimation);
        this.scene.beginAnimation(this.camera, frameFrom, frameTo, false);
    }
    /**
    * @description 限制模型旋转的范围
    * @param {AbstractMesh} pilot 模型
    */
    public limitModelHandle(pilot: AbstractMesh) {
        const minAlpha = -Math.PI / 120, // X轴旋转的最小值
            maxAlpha = Math.PI / 120,  // X轴旋转的最大值
            minBeta = -Math.PI / 120,  // Y轴旋转的最小值
            maxBeta = Math.PI / 120,   // Y轴旋转的最大值
            minGamma = -Math.PI / 120, // Z轴旋转的最小值
            maxGamma = Math.PI / 120;  // Z轴旋转的最大值

        pilot.rotationQuaternion = new Quaternion();
        this.scene.registerBeforeRender(() => {
            pilot.rotationQuaternion = Quaternion.RotationYawPitchRoll(pilot.rotation.y, pilot.rotation.x, pilot.rotation.z);
            pilot.rotation.x = Math.max(minAlpha, Math.min(maxAlpha, pilot.rotation.x));
            pilot.rotation.y = Math.max(minBeta, Math.min(maxBeta, pilot.rotation.y));
            pilot.rotation.z = Math.max(minGamma, Math.min(maxGamma, pilot.rotation.z));
            pilot.rotationQuaternion = Quaternion.RotationYawPitchRoll(pilot.rotation.y, pilot.rotation.x, pilot.rotation.z);
        });
    }
    public loadModel(modelArry: string[] = glbModelFiles, rotation: MyTuple = [0, Math.PI, 0], position: MyTuple = [-8.260836601257324, 1.139329195022583, -22.13763427734375], scaling: MyTuple = [1, 1, 1]): void {
        const _func = (res: ISceneLoaderAsyncResult) => {
            res.meshes.forEach((mesh) => {
                mesh.outlineColor = new Color3(1, 0, 0) // new Color3(0.1137, 0.9686, 1)
                mesh.edgesColor = new Color4(0.1137, 0.9686, 1, 1)
            });
            const model = res.meshes[0];
            // model.rotation = theVector3(rotation);
            model.position = theVector3(...position)
            model.scaling = theVector3(...scaling)
            // const modelManager = new ActionManager(this.scene)
            // modelManager.registerAction(new ExecuteCodeAction({
            //     trigger: ActionManager.OnPickTrigger,
            //     parameter: (evt: any) => {
            //         console.log(evt);
            //     }
            // }, (evt) => {
            //     console.log(evt, 12);
            // }))
            this.limitModelHandle(model)
            console.log(res);
        }        
        for (const fileName of modelArry) {
            SceneLoader.ImportMeshAsync('', '/BABYLON/uploads/', fileName, this.scene).then(res => _func(res))
        }
    }
    public clearSceneEvery(): void {
        this.scene.dispose();
    }
    public init(): void {
        this.setLight();
        this.initGround();
        // this.initSkyBox()
        this.render();
        this.loadModel()
    }
}