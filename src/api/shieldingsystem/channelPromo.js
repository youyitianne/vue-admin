import request from '@/utils/request'


export function uploadFodder(param) {
  return request({
    url: '/api/system/addfodderinfo',
    method: 'post',
    data:param,
  })
}

export function listFodder() {
  return request({
    url: '/api/system/listfodderinfo',
    method: 'get',
  })
}

export function getChannelPromoEdit() {
  return request({
    url: '/api/system/getChannelPromoEdit',
    method: 'get',
  })
}

export function addChannelPromoEdit(param) {
  return request({
    url: '/api/system/addChannelPromoEdit',
    method: 'post',
    data:param,
  })
}

export function editChannelPromoEdit(param) {
  return request({
    url: '/api/system/EditChannelPromoEdit',
    method: 'patch',
    data:param,
  })
}

export function getPromoList() {
  return request({
    url: '/api/system/getPromoList',
    method: 'get',
  })
}

export function addPromoList(param) {
  return request({
    url: '/api/system/addPromoList',
    method: 'post',
    data:param,
  })
}

export function editPromoList(param) {
  return request({
    url: '/api/system/editPromoList',
    method: 'patch',
    data:param,
  })
}

export function delPromoList(param) {
  return request({
    url: '/api/system/delPromoList',
    method: 'delete',
    params:param,
  })
}

export function addPromoListRecord(param) {
  return request({
    url: '/api/system/addPromoListRecord',
    method: 'post',
    data:param,
  })
}

export function getRowPromoList(param) {
  return request({
    url: '/api/system/getRowPromoList',
    method: 'get',
    params:param
  })
}

export function getQiNiuToken () {
  return request({
    url: '/api/system/getQiNiuToken',
    method: 'get',
  })
}

export function listQiNiufodder() {
  return request({
    url: '/qiniufile',
    method: 'get',
  })
}

export function synchroPromoList(param) {
  return request({
    url: '/api/system/synchroPromoList',
    method: 'post',
    data:param,
  })
}













