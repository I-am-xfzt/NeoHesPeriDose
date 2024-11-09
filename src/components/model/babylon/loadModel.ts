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
    Mesh,
    MeshBuilder,
    StandardMaterial,
    AbstractMesh,
    CubeTexture,
    Animation,
    Quaternion,
    ActionManager,
    SceneLoader,
    Axis,
    Color3,
    Color4,
    CircleEase,
    CubicEase,
    ExecuteCodeAction,
    EasingFunction,
    BloomEffect,
    DefaultRenderingPipeline
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
    handleMeshNames = []
export const theVector3 = (val: number[]): Vector3 => {
    return new Vector3(...val)
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
    // Lights: LightsInterface;
    DirectionalLight: LightsInterface['DirectionalLight'];
    ground = MeshBuilder;
    constructor(position: MyTuple, eleId: string) {
        this.canvas = document.getElementById(eleId) as HTMLCanvasElement
        this.engine = new Engine(this.canvas, true)
        this.scene = new Scene(this.engine, sceneOptions);  // 创建babylonjs场景
        // this.scene.clearColor = new Color4(220, 225, 232)
        this.camera = new MyArcRotateCamera('cameraA', Math.PI / 2, Math.PI / 2, 100, theVector3(position), this.scene); // 相机
        // this.mesh = new Mesh('MeshA', this.scene); // 网格模型对象Mesh
        //this.renderer = new WebGLRenderer({ antialias: true, alpha: true });; // 渲染器
        this.mouse = new Vector2(); // 鼠标的桌面二维坐标
        this.eleId = eleId
        this.glbInfos = null;
        this.mixer = null;
        this.animationModel = []
        // this.Lights = {
        //      SpotLight: new SpotLight('SpotLightA', theVector3([1, 1, 1]), theVector3([1, 1, 1]), Math.PI / 3, 2, this.scene),
        //      DirectionalLight: new DirectionalLight('DirectionalLight', theVector3([-0.6108653, 1.2217305, -0.5235988]), this.scene),
        //      HemisphericLight: new HemisphericLight('HemisphericLightA', theVector3([1, 1, 1]), this.scene)
        // }; // 存储已创建的子集
        this.DirectionalLight = new DirectionalLight('DirectionalLight', theVector3([-1.3089969389957472, -2.111848394913139, -0.06981317007977318]), this.scene);
        // this.DirectionalLight.diffuse = new Color3(0, 1, 0)
        this.DirectionalLight.intensity = 2
        // this.DirectionalLight.spotAngle = 0.8
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
        this.camera.setTarget(theVector3([-1.4253374946157686, 0, 0.2181730460431169]))
        this.camera.lowerAlphaLimit = Math.PI / 3; // 最小alpha值
        this.camera.upperAlphaLimit = Math.PI; // 最大alpha值
        this.camera.lowerBetaLimit = Math.PI / 6; // 最小beta值，限制从下方看上方的角度
        this.camera.upperBetaLimit = Math.PI / 2; // 最大beta值，限制从上方看下方的角度
        this.camera.lowerRadiusLimit = 50
        this.camera.upperRadiusLimit = 250
        // this.camera.speed = 20

        this.camera.useAutoRotationBehavior = false
        // this.cameraHelper()
        this.camera.spinTo("alpha", Math.PI / 2, 50); // 在1秒内将alpha旋转到90度
        this.camera.spinTo("beta", Math.PI / 2, 50); // 在1秒内将beta旋转到105度
        this.camera.spinTo("radius", 250, 50); // 在1秒内将半径缩放到250
        this.camera.attachControl(this.canvas, true); // 控制器
    }
    public initGroundAndSky(): void {
        this.ground.CreateGroundFromHeightMap('HeightMapA', "bg.0caf100e.png", {
            width: 20, height: 20, subdivisions: 250, maxHeight: 10, minHeight: 2
        }, this.scene)
        this.ground.CreateTiledGround("CreateTiledGround", {
            xmin: 3,
            zmin: 3,
            xmax: 9,
            zmax: 9,
            subdivisions: {
                w: 20,
                h: 20
            },
            precision: {
                w: 20,
                h: 20
            }
        }, this.scene)
    }
    public initSkyBox(): void {
        const skybox = this.ground.CreateBox("skyBox", { size: 10000 }, this.scene)
            , skyMaterial = new SkyMaterial("skyBox", this.scene);
        skyMaterial.backFaceCulling = false;
        skybox.material = skyMaterial;
        skybox.infiniteDistance = true;
        skyMaterial.turbidity = 2;
        skyMaterial.inclination = 0.5
        skyMaterial.rayleigh = 2
        skyMaterial.luminance = 1
        // Manually set the sun position
        skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
        skyMaterial.sunPosition = theVector3([0, 100, 0]);
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
    public loadModel(modelArry: string[] = ['主体2.glb', '图书馆.glb', '紧急疏散点.glb'], rotation: MyTuple = [0, Math.PI, 0], position: MyTuple = [-8.260836601257324, 1.139329195022583, -22.13763427734375], scaling: MyTuple = [0.5, 0.5, -0.5]): void {
        /**
         * @description 限制模型旋转的范围
         * @param {AbstractMesh} pilot 模型
         */
        const limitModelHandle = (pilot: AbstractMesh) => {
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
        const _func = (res: ISceneLoaderAsyncResult) => {
            res.animationGroups.forEach(animation => {
                // animation && animation.play(true)
            })
            const model = res.meshes[0];
            // model.rotation = theVector3(rotation);
            model.position = theVector3(position)
            model.scaling = theVector3(scaling)

            // const modelManager = new ActionManager(this.scene)
            // modelManager.registerAction(new ExecuteCodeAction({
            //     trigger: ActionManager.OnPickTrigger,
            //     parameter: (evt: any) => {
            //         console.log(evt);
            //     }
            // }, (evt) => {
            //     console.log(evt, 12);
            // }))
            limitModelHandle(model)
            // this.modelHelper(model)
            console.log(res);
        }
        for (const fileName of modelArry) {
            fileName === '紧急疏散点.glb' && SceneLoader.ImportMeshAsync('', '/FLVS/uploads/', fileName, this.scene).then(res => _func(res))
        }
    }
    public clearSceneEvery(): void {
        this.scene.dispose();
    }
    public init(): void {
        // this.initGroundAndSky();
        this.render();
        this.loadModel()
        this.initSkyBox()
    }
}