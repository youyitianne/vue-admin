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
      url: '/file/'+param.start+'_'+param.end+'_'+param.name,
      method: 'get',
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
