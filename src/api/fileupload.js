import request from '@/utils/request'

export function fetchFileInfo() {
  return request({
    url: '/fileInfo',
    method: 'get',
  })
}

export function fetchKeystoreInfo() {
  return request({
    url: '/keystoreInfo',
    method: 'get',
  })
}

export function getFile(param) {
  return request({
    url: '/getFile',
    method: 'post',
    data:param,
    responseType: "blob"
  })
}

export function delFile(param) {
  return request({
    url: '/delFile',
    method: 'delete',
    data:param,
  })
}

export function updateKeystore(param) {
  return request({
    url: '/updateKeystore',
    method: 'patch',
    data:param,
  })
}


