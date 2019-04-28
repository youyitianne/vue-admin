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


export function createProjectConfig_pro(param) {
  return request({
    url: '/api/projectconfig_pro',
    method: 'post',
    data:param
  })
}

export function getProjectLimit(param) {
  return request({
    url: '/project/limit',
    method: 'get',
    params:param
  })
}

export function getFileListMeth(param) {
  return request({
    url: '/apkFile',
    method: 'get',
    params:param
  })
}

export function postFileListMeth(param) {
  return request({
    url: '/apkFile',
    method: 'post',
    data:param
  })
}

export function getdownload(param) {
  return request({
    url: '/file',
    method: 'get',
    params:param,
    responseType: "blob"
  })
}

export function getAPKInfoMeth(param) {
  return request({
    url: '/apkInfo',
    method: 'post',
    data:param,
  })
}

export function delAPKInfoMeth(param) {
  return request({
    url: '/apkFile',
    method: 'delete',
    params:param,
  })
}

export function setOnlineAPKMeth(param) {
  return request({
    url: '/onlineAPK',
    method: 'post',
    data:param,
  })
}


