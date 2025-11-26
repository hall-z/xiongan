'use strict'

interface CanvasContextOptions {
  width: number
  height: number
  node: HTMLCanvasElement
}

export default class CanvasContext {
  private ctx: CanvasRenderingContext2D
  private taskList: Array<() => void>

  constructor(res: CanvasContextOptions) {
    const { width, height, node } = res
    const context = node.getContext('2d')
    if (!context) {
      throw new Error('Failed to get 2D context')
    }
    this.ctx = context
    this.ctx.canvas.width = width
    this.ctx.canvas.height = height
    this.taskList = []
  }

  private addTask(fun: () => void): void {
    this.taskList.push(fun)
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    this.addTask(() => this.ctx.fillRect(x, y, w, h))
  }

  stroke(): void {
    this.addTask(() => this.ctx.stroke())
  }

  fill(): void {
    this.addTask(() => this.ctx.fill())
  }

  setFillStyle(color: string): void {
    this.addTask(() => this.ctx.fillStyle = color)
  }

  setStrokeStyle(color: string): void {
    this.addTask(() => this.ctx.strokeStyle = color)
  }

  beginPath(): void {
    this.addTask(() => this.ctx.beginPath())
  }

  moveTo(x: number, y: number): void {
    this.addTask(() => this.ctx.moveTo(x, y))
  }

  lineTo(x: number, y: number): void {
    this.addTask(() => this.ctx.lineTo(x, y))
  }

  setTextAlign(value: CanvasTextAlign): void {
    this.addTask(() => this.ctx.textAlign = value)
  }

  setTextBaseline(value: CanvasTextBaseline): void {
    this.addTask(() => this.ctx.textBaseline = value)
  }

  setFontSize(value: number): void {
    this.addTask(() => this.ctx.font = `${value}px sans-serif`)
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number): void {
    this.addTask(() => this.ctx.arc(x, y, radius, startAngle, endAngle))
  }

  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    this.addTask(() => this.ctx.fillText(text, x, y, maxWidth))
  }

  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
    this.addTask(() => this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y))
  }

  draw(noClear?: boolean, success?: () => void): void {
    if (!noClear) {
      const canvas = this.ctx.canvas
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    this.taskList.forEach(t => t())
    this.taskList.length = 0
    if (typeof success === 'function') {
      success()
    }
  }

  setShadow(offsetX?: number, offsetY?: number, blur?: number, color?: string): void {
    this.addTask(() => {
      if (offsetX !== undefined) this.ctx.shadowOffsetX = offsetX
      if (offsetY !== undefined) this.ctx.shadowOffsetY = offsetY
      if (blur !== undefined) this.ctx.shadowBlur = blur
      if (color !== undefined) this.ctx.shadowColor = color
    })
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    this.addTask(() => this.ctx.clearRect(x, y, w, h))
  }

  // 更多调用方法...
  // 可以添加更多 canvas 方法
  rect(x: number, y: number, w: number, h: number): void {
    this.addTask(() => this.ctx.rect(x, y, w, h))
  }

  closePath(): void {
    this.addTask(() => this.ctx.closePath())
  }

  setLineWidth(width: number): void {
    this.addTask(() => this.ctx.lineWidth = width)
  }

  setGlobalAlpha(alpha: number): void {
    this.addTask(() => this.ctx.globalAlpha = alpha)
  }

  save(): void {
    this.addTask(() => this.ctx.save())
  }

  restore(): void {
    this.addTask(() => this.ctx.restore())
  }

  translate(x: number, y: number): void {
    this.addTask(() => this.ctx.translate(x, y))
  }

  rotate(angle: number): void {
    this.addTask(() => this.ctx.rotate(angle))
  }

  scale(x: number, y: number): void {
    this.addTask(() => this.ctx.scale(x, y))
  }

  drawImage(image: CanvasImageSource, dx: number, dy: number): void
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void
  drawImage(image: CanvasImageSource, ...args: number[]): void {
    this.addTask(() => {
      if (args.length === 2) {
        this.ctx.drawImage(image, args[0], args[1])
      } else if (args.length === 4) {
        this.ctx.drawImage(image, args[0], args[1], args[2], args[3])
      } else if (args.length === 8) {
        this.ctx.drawImage(image, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
      }
    })
  }
}