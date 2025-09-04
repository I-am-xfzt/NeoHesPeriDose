import {
  Texture,
  Scene,
  ShaderMaterial,
  DynamicTexture,
  Color3,
  Constants,
} from '@babylonjs/core'
export class createDiffusionRipple {
  constructor(scene, ground) {
    this.createShader(scene, ground)
  }
  createShader(scene, ground) {
    const shaderCode = {
      vertex: `
          precision highp float;
          attribute vec3 position;
          attribute vec2 uv;
          uniform mat4 worldViewProjection;
          varying vec2 vUV;
          varying vec3 vPosition;
          
          void main() {
            vUV = uv;
            vPosition = position;
            gl_Position = worldViewProjection * vec4(position, 1.0);
          }
        `,
      fragment: `
          precision highp float;
          #define uScanOrigin vec3(0.,0.,0.)
          #define uScanWaveRatio1 3.2
          #define uScanWaveRatio2 2.8
          
          varying vec2 vUV;
          varying vec3 vPosition;
          uniform float uTime;
          uniform sampler2D uScanTex;
          uniform vec3 uScanColor;
          uniform vec3 uScanColorDark;
          
          float circleWave(vec3 p, vec3 origin, float distRatio) {
            float t = uTime;
            float dist = distance(p, origin) * distRatio;
            float radialMove = fract(dist - t);
            float fadeOutMask = 1. - smoothstep(1., 3., dist);
            radialMove *= fadeOutMask;
            float cutInitialMask = 1. - step(t, dist);
            radialMove *= cutInitialMask;
            return radialMove;
          }
          
          vec3 getScanColor(vec3 worldPos, vec2 uv, vec3 col) {
            float scanMask = texture2D(uScanTex, uv).r;
            float cw = circleWave(worldPos, uScanOrigin, uScanWaveRatio1);
            float cw2 = circleWave(worldPos, uScanOrigin, uScanWaveRatio2);
            
            float mask1 = smoothstep(.3, 0., 1. - cw);
            mask1 *= (1. + scanMask * .7);
            float mask2 = smoothstep(.07, 0., 1. - cw2) * .8;
            mask1 += mask2;
            float mask3 = smoothstep(.09, 0., 1. - cw) * 1.5;
            mask1 += mask3;
    
            vec3 scanCol = mix(uScanColorDark, uScanColor, mask1);
            return mix(col, scanCol, mask1);
          }
          
          void main() {
            vec3 col = vec3(0.1, 0.1, 0.2);
            vec3 worldPos = vec3(vUV.x * 2.0 - 1.0, 0.0, vUV.y * 2.0 - 1.0);
            gl_FragColor = vec4(getScanColor(worldPos, vUV * 10.0, col), 1.0);
          }
        `,
    }

    // 7. 使用RawShaderMaterial避免自动预处理
    const shaderMaterial = new ShaderMaterial(
      'rippleMaterial',
      scene,
      {
        vertexSource: shaderCode.vertex,
        fragmentSource: shaderCode.fragment,
      },
      {
        attributes: ['position', 'uv'],
        uniforms: [
          'worldViewProjection',
          'uTime',
          'uScanTex',
          'uScanColor',
          'uScanColorDark',
        ],
        samplers: ['uScanTex'],
        needAlphaBlending: true,
      }
    )

    // 8. 设置材质参数
    shaderMaterial.setColor3('uScanColor', new Color3(1, 1, 1))
    shaderMaterial.setColor3('uScanColorDark', new Color3(0.05, 0.2, 0.4))
    shaderMaterial.setTexture('uScanTex', this.createScanTexture(scene))

    // 关键渲染设置
    shaderMaterial.backFaceCulling = false
    shaderMaterial.alphaMode = Constants.ALPHA_ADD
    shaderMaterial.disableDepthWrite = true

    ground.material = shaderMaterial

    // 9. 动画循环
    let time = 0
    scene.registerBeforeRender(() => {
      time += 0.003
      shaderMaterial.setFloat('uTime', time)
    })
  }
  createScanTexture(scene: Scene): Texture {
    const texture = new DynamicTexture('scanTexture', 512, scene)
    const ctx = texture.getContext()

    // 径向渐变背景
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(1, 'rgba(100,100,100,0.2)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    // 添加扫描线
    for (let i = 0; i < 50; i++) {
      const y = i * 10 + Math.random() * 5
      ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(512, y)
      ctx.stroke()
    }

    texture.update()
    return texture
  }
}
