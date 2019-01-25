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
  console.log(param)
  return request({
    url: '/project/'+param.id,
    method: 'delete',
    data:param
  })
}
