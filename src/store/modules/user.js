/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-14 14:22:24
 */
// import {getToken, setToken, removeToken,} from '@/utils/auth';
// import { login } from '@/api/user';
import { localstorageSet, localstorageGet, localstorageRemove } from '@/utils/auth';
const getDefaultState = () => {
  return {
    // token: getToken(),
    token: localstorageGet('token') || '',
    userName: localstorageGet('userName') || '',
    companyId: localstorageGet('companyId') || '',
    userId: localstorageGet('userId') || '',
    identity: localstorageGet('identity') || '',
    stationId: localstorageGet('stationId') || '',
    platformCode: localstorageGet('platformCode') || '',
    customerCode: localstorageGet('customerCode') || ''
  };
};
const state = getDefaultState();
const mutations = {
  SET_TOKEN: (state, payload) => {
    state.token = payload;
    localstorageSet('token', payload);
  },
  SET_IDENTITY: (state, payload) => {
    state.identity = payload;
    localstorageSet('identity', payload);
  },
  CHANGE_USER_NAME: (state, payload) => {
    state.userName = payload;
    localstorageSet('userName', payload);
  },
  SET_COMPANY_ID: (state, payload) => {
    state.companyId = payload;
    localstorageSet('companyId', payload);
  },
  SET_USER_ID: (state, payload) => {
    state.userId = payload;
    localstorageSet('userId', payload);
  },
  SET_STATION_ID: (state, payload) => {
    state.stationId = payload;
    localstorageSet('stationId', payload);
  },
  SET_PLATFORMCODE: (state, payload) => {
    state.platformCode = payload;
    localstorageSet('platformCode', payload);
  },
  SET_CUSTOMERCODE: (state, payload) => {
    state.customerCode = payload;
    localstorageSet('customerCode', payload);
  },
  // 初始化
  RESET_STATE: (state) => {
    state.userName = '';
    state.companyId = '';
    state.token = '';
    state.identity = '';
    state.userId = '';
    state.stationId = '';
    state.platformCode = '';
    state.customerCode = '';
    localstorageRemove('token');
    localstorageRemove('userName');
    localstorageRemove('companyId');
    localstorageRemove('identity');
    localstorageRemove('userId');
    localstorageRemove('stationId');
    localstorageRemove('platformCode');
    localstorageRemove('customerCode');
  }
};

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   return new Promise((resolve, reject) => {
  //     login().then(res => {
  //       const token = res.data.token;
  //       commit('SET_TOKEN', token);
  //       setToken(token);
  //       resolve();
  //     }).catch(error => {
  //       reject(error);
  //     });
  //   });
  // },
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     removeToken();
  //     resolve();
  //   });
  // }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

