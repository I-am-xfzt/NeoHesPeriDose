import { Engine, Scene, UniversalCamera, Vector3, Vector2, DirectionalLight, HemisphericLight, SpotLight, Mesh, MeshBuilder, StandardMaterial, CubeTexture } from 'babylonjs';
interface LightsInterface {
    SpotLight: SpotLight;
    // PointLight: null,
    DirectionalLight: DirectionalLight;
    HemisphericLight: HemisphericLight;
}
export const theVector3 = (val: number[]): Vector3 => {
    return new Vector3(...val)
}
export class BabyLonModel {
    scene: Scene;  // 创建babylonjs场景
    mesh: Mesh; // 网格模型对象Mesh
    canvas: HTMLCanvasElement; // 渲染器
    camera: UniversalCamera; // 相机
    controls = null; // 控制器
    threeCanvas = null; // 渲染场景的canvas元素
    // raycaster = new Raycaster(); // 光线投射，用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
    // raycaster.firstHitOnly = true;
    mouse: Vector2; // 鼠标的桌面二维坐标
    eleId: string;
    glbInfos: any;
    mixer = null;
    animationModel = []
    // Lights: LightsInterface;
    DirectionalLight: LightsInterface['DirectionalLight']
    ground = MeshBuilder;
    constructor(position: number[], eleId: string) {
        this.canvas = document.getElementById(eleId) as HTMLCanvasElement
        const engine = new Engine(this.canvas, true)
        this.scene = new Scene(engine);  // 创建babylonjs场景
        this.mesh = new Mesh('MeshA', this.scene); // 网格模型对象Mesh
        //this.renderer = new WebGLRenderer({ antialias: true, alpha: true });; // 渲染器
        this.threeCanvas = null;
        this.camera = new UniversalCamera('cameraA', theVector3(position), this.scene); // 相机
        // this.raycaster = new Raycaster(); // 光线投射，用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
        // this.dracoLoader = new DRACOLoader()
        // this.loader = new GLTFLoader().setPath("/uploads/")
        // this.raycaster.firstHitOnly = true;
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
        this.DirectionalLight = new DirectionalLight('DirectionalLight', theVector3([-0.6108653, 1.2217305, -0.5235988]), this.scene);
        this.DirectionalLight.intensity = 2
    }
    initCamera(): void {
        this.camera.setTarget(theVector3([0.9834125481551991, 0, -4.034512738720341]))
        this.camera.attachControl(this.canvas, true);; // 控制器
    }
    initGroundAndSky(): void {
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
    initSkyBox(): void {
        const skybox = this.ground.CreateBox("skyBox", { size: 100.0 }, this.scene)
            , skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.disableLighting = true;
    }
}