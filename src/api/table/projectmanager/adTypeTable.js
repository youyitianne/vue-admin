import request from '@/utils/request'


export function getAdType() {
  return request({
    url: '/adtype',
    method: 'get',
  })
}

export function createAdType(param) {
  return request({
    url: '/adtype',
    method: 'post',
    params:param
  })
}

export function updateAdType(param) {
  console.log(param.name)
  return request({
    url: '/adtype/'+param.id,
    method: 'patch',
    data:{
      name:param.name,
      program_mark:param.program_mark,
      note:param.note,
      introduce:param.introduce,
    }
  })
}

export function deleteAdType(param) {
  return request({
    url: '/adtype/'+param.id,
    method: 'delete',
  })
}


