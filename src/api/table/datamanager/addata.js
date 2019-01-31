import request from '@/utils/request'

export function getList(param) {
  return request({
    url: '/file/'+param.start+'_'+param.end+'_'+param.name,
    method: 'get',
  })
}

export function getName() {
  return request({
    url: '/names',
    method: 'get',
  })
}

export function getListdata(param) {
  return request({
    url: '/data/' + param.start + '_' + param.end + '_' + param.name,
    method: 'get',
  })
}

  export function getdownload(param) {
    return request({
      url: '/file',
      method: 'post',
      data:param,
      responseType: "blob"
    })

}

export function getResourceName(param) {
  return request({
    url: '/api/getresourcelist',
    method: 'post',
    params:param
  })
}

export function getarpufile(param) {
  return request({
    url: '/arpufile/'+param.start+'_'+param.end+'_'+param.name,
    method: 'get',
    responseType: "blob",
    params:param
  })
}

export function getProject() {
  return request({
    url: '/project',
    method: 'get',
  })
}

export function getarpufile1(param) {
  return request({
    url: '/arpufile/'+param.start+'_'+param.end,
    method: 'post',
    responseType: "blob",
    params:param,
    data:param
  })
}

export function getProjectList() {
  return request({
    url: '/projectList',
    method: 'get',
  })
}
