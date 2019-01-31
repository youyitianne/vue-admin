import request from '@/utils/request'


export function getName() {
  return request({
    url: '/names',
    method: 'get',
  })
}

export function getChannel() {
  return request({
    url: '/channel',
    method: 'get',
  })
}

export function getProject() {
  return request({
    url: '/project',
    method: 'get',
  })
}

export function createProject(param) {
  return request({
    url: '/project',
    method: 'post',
    data:param
  })
}

export function updateProject(param) {
  return request({
    url: '/project/'+param.id,
    method: 'patch',
    data:param
  })
}

export function deleteProject(param) {
  return request({
    url: '/project/'+param.id,
    method: 'delete',
    data:param
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

export function getProjectConfig(param) {
  return request({
    url: '/api/projectconfig/'+param.start+'/'+param.end,
    method: 'get',
  })
}
