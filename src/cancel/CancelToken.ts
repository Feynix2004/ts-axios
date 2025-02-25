import { Canceler, CancelExecutor, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ResolvePromise {
  (value: Cancel | PromiseLike<Cancel>): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    executor(message => {
      //防止取消操作重复触发
      if (this.reason) return
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
