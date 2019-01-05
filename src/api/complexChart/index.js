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

export function getChannel() {
  return request({
    url: '/channel',
    method: 'get',
  })
}

export function getappdata(param) {
  return request({
    url: '/appdata/'+param.start+'/'+param.end,
    method: 'get',
  })
}
