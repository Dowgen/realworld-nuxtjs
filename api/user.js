import { request } from '@/plugins/request'


// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

// 用户信息获取
export const getUser = params => {
  return request({
    method: 'GET',
    url: '/api/user',
    params
  })
}

// 用户信息修改
export const editUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}
