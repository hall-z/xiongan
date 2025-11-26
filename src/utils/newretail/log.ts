const log = uni.getRealtimeLogManager ? uni.getRealtimeLogManager() : null

interface LogManager {
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
  setFilterMsg?(msg: string): void
  addFilterMsg?(msg: string): void
}

const LOG = {
  info(...args: any[]): void {
    if (!log) return
    if (args.length === 1 && typeof args[0] === 'string') {
      log.info(args[0])
    } else if (args.length > 1) {
      log.info(...args)
    } else {
      log.info(args[0])
    }
  },

  warn(...args: any[]): void {
    if (!log) return
    if (args.length === 1 && typeof args[0] === 'string') {
      log.warn(args[0])
    } else if (args.length > 1) {
      log.warn(...args)
    } else {
      log.warn(args[0])
    }
  },

  error(...args: any[]): void {
    if (!log) return
    if (args.length === 1 && typeof args[0] === 'string') {
      log.error(args[0])
    } else if (args.length > 1) {
      log.error(...args)
    } else {
      log.error(args[0])
    }
  },

  setFilterMsg(msg: string): void {
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    log.setFilterMsg(msg)
  },

  addFilterMsg(msg: string): void {
    if (!log || !log.addFilterMsg) return
    if (typeof msg !== 'string') return
    log.addFilterMsg(msg)
  }
}

export default LOG