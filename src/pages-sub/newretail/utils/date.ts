/**
 * 响应日期类，用于处理时间戳转换
 */
export class ResponseDate {
  private date: Date

  constructor(timestamp?: number) {
    this.date = timestamp ? new Date(timestamp) : new Date()
  }

  /**
   * 获取时间戳
   */
  getTime(): number {
    return this.date.getTime()
  }

  /**
   * 获取年份
   */
  getFullYear(): number {
    return this.date.getFullYear()
  }

  /**
   * 获取月份 (0-11)
   */
  getMonth(): number {
    return this.date.getMonth()
  }

  /**
   * 获取日期 (1-31)
   */
  getDate(): number {
    return this.date.getDate()
  }

  /**
   * 获取小时 (0-23)
   */
  getHours(): number {
    return this.date.getHours()
  }

  /**
   * 获取分钟 (0-59)
   */
  getMinutes(): number {
    return this.date.getMinutes()
  }

  /**
   * 获取秒数 (0-59)
   */
  getSeconds(): number {
    return this.date.getSeconds()
  }

  /**
   * 获取星期几 (0-6, 0代表星期日)
   */
  getDay(): number {
    return this.date.getDay()
  }

  /**
   * 格式化日期时间
   * @param format 格式字符串，支持: YYYY, MM, DD, HH, mm, ss
   */
  format(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    const year = this.getFullYear()
    const month = this.getMonth() + 1
    const day = this.getDate()
    const hour = this.getHours()
    const minute = this.getMinutes()
    const second = this.getSeconds()

    return format
      .replace('YYYY', year.toString())
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('HH', hour.toString().padStart(2, '0'))
      .replace('mm', minute.toString().padStart(2, '0'))
      .replace('ss', second.toString().padStart(2, '0'))
  }

  /**
   * 添加时间
   * @param value 时间值
   * @param unit 时间单位 (seconds, minutes, hours, days, months, years)
   */
  add(value: number, unit: string): ResponseDate {
    const newDate = new Date(this.date)
    
    switch (unit) {
      case 'seconds':
        newDate.setSeconds(newDate.getSeconds() + value)
        break
      case 'minutes':
        newDate.setMinutes(newDate.getMinutes() + value)
        break
      case 'hours':
        newDate.setHours(newDate.getHours() + value)
        break
      case 'days':
        newDate.setDate(newDate.getDate() + value)
        break
      case 'months':
        newDate.setMonth(newDate.getMonth() + value)
        break
      case 'years':
        newDate.setFullYear(newDate.getFullYear() + value)
        break
      default:
        throw new Error(`不支持的日期单位: ${unit}`)
    }
    
    return new ResponseDate(newDate.getTime())
  }

  /**
   * 获取时间差（毫秒）
   * @param otherDate 另一个日期
   */
  diff(otherDate: ResponseDate): number {
    return this.getTime() - otherDate.getTime()
  }

  /**
   * 检查是否在某个日期之前
   * @param otherDate 另一个日期
   */
  isBefore(otherDate: ResponseDate): boolean {
    return this.getTime() < otherDate.getTime()
  }

  /**
   * 检查是否在某个日期之后
   * @param otherDate 另一个日期
   */
  isAfter(otherDate: ResponseDate): boolean {
    return this.getTime() > otherDate.getTime()
  }

  /**
   * 转换为ISO字符串
   */
  toISOString(): string {
    return this.date.toISOString()
  }

  /**
   * 转换为本地字符串
   */
  toLocaleString(): string {
    return this.date.toLocaleString()
  }
}

export default ResponseDate