import request from '@/utils/request'

export function getProjectList() {
  return request({
    url: '/projectList',
    method: 'get',
  })
}

export function getName() {
  return request({
    url: '/names',
    method: 'get',
  })
}


export function getarpufile_preview(param) {
  return request({
    url: '/arpufile_preview/'+param.start+'_'+param.end,
    method: 'post',
    params:param,
    data:param
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
