import request from '@/utils/request'


export function getName() {
  return request({
    url: '/names',
    method: 'get',
  })
}

export function getResourceName(param) {
  return request({
    url: '/api/getresourcelist',
    method: 'post',
    params:param
  })
}

export function getProjectConfigPublish() {
  return request({
    url: '/api/projectconfig_publish',
    method: 'get',
  })
}


export function getSdkTemplate() {
  return request({
    url: '/api/listtemplate',
    method: 'get',
  })
}

export function getChannel() {
  return request({
    url: '/channel',
    method: 'get',
  })
}
