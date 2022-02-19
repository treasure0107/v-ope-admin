/*
 * @Author: your name
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\config\env.js
 */
let baseUrl = '';
let pdfUrl = '';
let wsUrl = '';
const env = process.env.NODE_ENV;
const flag = process.env.VUE_APP_FLAG;
console.log('process.env', process.env);

if (env == 'production') {
  if (flag == 'dev') {
    // 线上开发环境
    baseUrl = 'http://117.78.8.108:8077/api/'; // 线上开发
    // baseUrl = 'http://119.136.17.18:8077/api/';
    wsUrl = 'ws://117.78.8.108:9187/'; // 正式环境
    pdfUrl = 'http://file.com/files'; // 文件地址
  } else if (flag == 'test') {
    // 测试环境
    baseUrl = 'http://192.168.1.180:8077/api/'; // 测试
    wsUrl = 'ws://192.168.1.180:9187/'; // 测试环境
    pdfUrl = 'http://file.com/files'; // 文件地址址
  } else {
    baseUrl = 'http://117.78.8.108:8077/api/'; // 生产
    wsUrl = 'ws://117.78.8.108:9187/'; // 正式环境
    pdfUrl = 'http://file.com/files'; // 文件地址
  }
} else { // 开发环境
  baseUrl = 'http://192.168.1.218:8077/api/'; // 开发
  wsUrl = 'ws://192.168.1.218:9187/'; // 正式环境
  pdfUrl = 'http://file.com/files'; // 文件地址
}
export {
  baseUrl,
  pdfUrl,
  wsUrl
};
