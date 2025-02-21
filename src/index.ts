import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header'
import { bulidURL } from './helpers/url'
import { AxiosPromise, AxiosRequestConfig } from './types'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config
  return processHeaders(headers, data)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return bulidURL(url, params)
}
export default axios

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}
