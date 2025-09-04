/**
 * 类似烟花效果
 * @author 丢失的陈皮糖
 */
import { Color4, MeshBuilder, StandardMaterial, Color3, Mesh } from '@babylonjs/core'
export class createFireWorksRipple {
  constructor(scene, options = {}) {
    this.scene = scene
    this.options = {
      radius: 1,
      speed: 1.5,
      color: new Color4(0.2, 0.5, 1, 0.8),
      lineWidth: 0.1,
      maxCircles: 3,
      ...options,
    }
    this.circles = []
    this.activeCircles = 0
  }

  createCircle(position) {
    if (this.activeCircles >= this.options.maxCircles) return

    const circle = MeshBuilder.CreateDisc(
      'circle',
      {
        radius: 0.1,
        tessellation: 64,
        sideOrientation: Mesh.DOUBLESIDE,
      },
      this.scene
    )

    circle.position = position.clone()
    circle.position.y += 0.01 // 稍微高于地面

    const mat = new StandardMaterial('circleMat', this.scene)
    mat.emissiveColor = new Color3(
      this.options.color.r,
      this.options.color.g,
      this.options.color.b
    )
    mat.alpha = this.options.color.a
    mat.wireframe = true
    mat.disableLighting = true
    circle.material = mat

    this.circles.push({
      mesh: circle,
      progress: 0,
      active: true,
    })
    this.activeCircles++
  }

  update() {
    for (let i = this.circles.length - 1; i >= 0; i--) {
      const circle = this.circles[i]
      if (!circle.active) continue

      circle.progress += 0.01 * this.options.speed

      // 更新大小和透明度
      const scale = 1 + circle.progress * this.options.radius
      circle.mesh.scaling.set(scale, scale, scale)

      const alpha = Math.max(0, this.options.color.a * (1 - circle.progress))
      circle.mesh.material.alpha = alpha

      // 更新线宽效果（通过缩放实现）
      const lineScale = 1 / (1 + circle.progress * 0.5)
      circle.mesh.material.wireframe = lineScale > 0.1

      // 结束条件
      if (circle.progress >= 1) {
        circle.mesh.dispose()
        circle.active = false
        this.activeCircles--
        this.circles.splice(i, 1)
      }
    }
  }
}
