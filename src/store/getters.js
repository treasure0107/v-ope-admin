/*
 * @Descripttion:getters
 * @Author: JTune
 * @Date: 2021-01-14 14:22:24
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  stationId: state => state.user.stationId,
  permissionList: state => state.permission.permissionList,
  sidebarMenu: state => state.permission.sidebarMenu,
  menuDefaultList: state => state.permission.menuDefaultList,
  topNavList: state => state.permission.topNavList
};
export default getters;
