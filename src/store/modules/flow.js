/*
 * @Author: JTune
 * @Date: 2021-09-23 16:53:26
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-28 10:34:40
 * @Description: file content
 */
const getDefaultState = () => {
  return {
    resourceId: '',
    menuType: ''
  };
};
const state = getDefaultState();
const mutations = {
  SET_RESOURCEID: (state, payload) => {
    state.resourceId = payload;
  },
  SET_MENUTYPE: (state, payload) => {
    state.menuType = payload;
  },
  // 初始化
  RESET_STATE: (state) => {
    state.resourceId = '';
    state.menuType = '';
  }
};

const actions = {
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
