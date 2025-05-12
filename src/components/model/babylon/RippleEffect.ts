import * as BABYLON from '@babylonjs/core'
export class WorkingCircleWave {
  private scene: BABYLON.Scene
  private currentTime = 0
  private ripples: { center: BABYLON.Vector2; startTime: number }[] = []
  private material: BABYLON.ShaderMaterial
  private plane: BABYLON.Mesh

  constructor(scene: BABYLON.Scene) {
    this.scene = scene
    this.init()
  }

  private init() {
    // 1. 创建平面网格
    this.plane = BABYLON.MeshBuilder.CreatePlane(
      'plane',
      {
        size: 5,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      },
      this.scene
    )

    // 2. 创建绝对正确的着色器
    const shaderCode = {
      vertex: `
                precision highp float;
                attribute vec3 position;
                attribute vec2 uv;
                uniform mat4 worldViewProjection;
                varying vec2 vUV;
                void main() {
                    vUV = uv;
                    gl_Position = worldViewProjection * vec4(position, 1.0);
                }
            `,
      fragment: `
                precision highp float;
                varying vec2 vUV;
                uniform float time;
                
                void main() {
                    // 测试着色器 - 显示UV坐标
                    gl_FragColor = vec4(vUV.x, vUV.y, 0.0, 1.0);
                    
                    // 当确认UV显示正常后，替换为波纹着色器代码
                    /*
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(vUV, center);
                    float ripple = sin(dist * 20.0 - time * 5.0);
                    gl_FragColor = vec4(0.2, 0.6, 1.0, ripple * 0.5 + 0.5);
                    */
                }
            `,
    }

    // 3. 创建材质
    this.material = new BABYLON.ShaderMaterial(
      'waveMat',
      this.scene,
      {
        vertexSource: shaderCode.vertex,
        fragmentSource: shaderCode.fragment,
      },
      {
        attributes: ['position', 'uv'],
        uniforms: ['worldViewProjection', 'time'],
        needAlphaBlending: true,
      }
    )

    this.plane.material = this.material

    // 4. 添加发光层
    const glow = new BABYLON.GlowLayer('glow', this.scene)
    glow.intensity = 1.5
    glow.referenceMeshToUseItsOwnMaterial(this.plane)

    // 5. 动画循环
    this.scene.registerBeforeRender(() => {
      this.currentTime += this.scene.getEngine().getDeltaTime() / 1000

      const effect = this.material.getEffect()
      if (effect && effect.isReady()) {
        effect.setFloat('time', this.currentTime)
      }
    })

    // 6. 点击交互
    this.scene.onPointerDown = (evt, pickResult) => {
      if (pickResult?.hit && pickResult.pickedMesh === this.plane) {
        const uv = pickResult.getTextureCoordinates()
        if (uv) {
          this.addRipple(uv.x, uv.y)
        }
      }
    }
  }

  private addRipple(x: number, y: number) {
    this.ripples.push({
      center: new BABYLON.Vector2(x, y),
      startTime: this.currentTime,
    })

    // 保持最多2个波纹
    if (this.ripples.length > 2) {
      this.ripples.shift()
    }
  }
}
