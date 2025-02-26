import axios from '../../src'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

const instance = axios.create()

function calculatePercentage(loaded: number, total: number) {
  return Math.floor(loaded * 10) / total
}

loadProgressBar()
function loadProgressBar() {
  const setupStartProgress = () => {
    instance.interceptors.request.use(config => {
      NProgress.start()
      return config
    })
  }

  const setupUpdateProgress = () => {
    const update = (e: ProgressEvent) => {
      console.log(e)
      NProgress.set(calculatePercentage(e.loaded, e.total))
    }
    instance.defaults.onDownloadProgress = update
    instance.defaults.onUploadProgress = update
  }

  const setupStopProgress = () => {
    instance.interceptors.response.use(response => {
      NProgress.done()
      return response
    }, error => {
      NProgress.done()
      return Promise.reject(error)
    })
  }

  setupStartProgress()
  setupUpdateProgress()
  setupStopProgress()
}

const downloadEl = document.getElementById('download')

const downloadFileURL = 'https://p5.img.cctvpic.com/photoworkspace/contentimg/2023/03/30/2023033011303020756.jpg'

downloadEl!.addEventListener('click', e => {
  instance.get(downloadFileURL)
    .then(res => {
      console.log(`download file success, data.length: ${res.data.length}, data.url: ${res.config.url}`)
    }).catch(err => console.log(err))
})

const uploadEl = document.getElementById('upload')

uploadEl!.addEventListener('click', e => {
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])
    instance.post('/upload-download/upload', data)
      .then(() => {
        console.log('upload file success, you can see it on ./exapmles/accept-upload-file')
      })
  }
})
