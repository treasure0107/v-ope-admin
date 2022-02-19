/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-14 11:48:40
 */
import Cookies from 'js-cookie';
import Config from '@/settings';

const TokenKey = Config.TokenKey;

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
const storageKey = 'operation-system-web';
export const localstorageSet = (name, content) => {
  name = `${storageKey}-${name}`;
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};
export const localstorageGet = name => {
  name = `${storageKey}-${name}`;
  if (!name) return;
  return window.localStorage.getItem(name);
};

export const localstorageRemove = name => {
  name = `${storageKey}-${name}`;
  if (!name) return;
  return window.localStorage.removeItem(name);
};

// export const localstorageSet = (name, content) => {
//   if (!name) return;
//   if (typeof content !== 'string') {
//     content = JSON.stringify(content);
//   }
//   window.localStorage.setItem(name, content);
// };
// export const localstorageGet = name => {
//   if (!name) return;
//   return window.localStorage.getItem(name);
// };

// export const localstorageRemove = name => {
//   if (!name) return;
//   return window.localStorage.removeItem(name);
// };
