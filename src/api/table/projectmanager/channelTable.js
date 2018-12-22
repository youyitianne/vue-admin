import request from '@/utils/request'


export function getChannel() {
  return request({
    url: '/channel',
    method: 'get',
  })
}

export function createChannel(param) {
  return request({
    url: '/channel',
    method: 'post',
    params:param
  })
}

export function updateChannel(param) {
  return request({
    url: '/channel/'+param.id,
    method: 'patch',
    data:{
      name:param.name,
      program_mark:param.program_mark,
      note:param.note,
    }
  })
}

export function deleteChannel(param) {
  return request({
    url: '/channel/'+param.id,
    method: 'delete',
  })
}


