import request from '@/utils/request'

export function getRepeat() {
  return request({
    url: '/repeat/get',
    method: 'get'
  })
}


export function deldefault() {
  return request({
    url: '/delRepeatDefault',
    method: 'get'
  })
}

export function delrepeat(param) {
  return request({
    url: '/delRepeat',
    method: 'post',
    data:param
  })
}


