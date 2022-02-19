/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-13 11:15:54
 */
import request from '@/utils/request';

export function login(username, password) {
  return request({
    url: '/mock/login.json',
    method: 'get',
    data: {}
  });
}
export function getPermissionList() {
  return request({
    url: '/mock/permission.json',
    method: 'get',
    data: {}
  });
}
export function getFlowWork() {
  return request({
    url: '/mock/data.json',
    method: 'get',
    data: {}
  });
}
export function getFlowData() {
  return request({
    url: '/mock/flowData.json',
    method: 'get',
    data: {}
  });
}
export function getFormDataTem() {
  return request({
    url: '/mock/formDataTem.json',
    method: 'get',
    data: {}
  });
}
