import request from '@/utils/request'

export function getDailyAdtypeMsg(param) {
  return request({
    url: '/dailyadtype',
    method: 'post',
    responseType: "blob",
    data:param
  })
}

export function getProjectList() {
  return request({
    url: '/projectList',
    method: 'get',
  })
}


export function getDailyAdtypeMsg_preview(param) {
  return request({
    url: '/dailyadtype_preview',
    method: 'post',
    data:param
  })
}
