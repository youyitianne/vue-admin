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

export function createProjectConfig(param) {
  return request({
    url: '/api/projectconfig',
    method: 'post',
    data:param
  })
}

export function getProjectConfig(param) {
  return request({
    url: '/api/projectconfig/'+param.start+'/'+param.end,
    method: 'get',
  })
}

export function updateProjectConfig(param) {
  return request({
    url: '/api/projectconfig/'+param.id,
    method: 'patch',
    data:param
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

export function getProjectConfigPublish() {
  return request({
    url: '/api/projectconfig_publish',
    method: 'get',
  })
}


export function getProject() {
  return request({
    url: '/project',
    method: 'get',
  })
}
