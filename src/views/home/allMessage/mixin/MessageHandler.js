/*
 * @Author: chenjz
 * @Date: 2021-09-29 10:49:35
 * @Description:
 */
import { localstorageGet } from '@/utils/auth';
import { sendWebsocket, closeWebsocket } from '@/utils/webSocket.js';
import { wsUrl } from '@/config/env.js';
import Api from '@/api';
import Bus from '@/bus';
const messagePath = ['/home', '/allMessage']; // 在当前路由时，需要更新消息列表

export default {
  data () {
    return {
      isSend: false,
      timeoutId: null,
      messageList: []
    };
  },
  computed: {
    currentPath () {
      return this.$route.path;
    }
  },
  watch: {
    '$route' (n, o) {
      // this.switchWs();
    }
  },
  mounted () {
    this.switchWs();
  },
  methods: {
    switchWs () {
      // 页面销毁时关闭ws。因为有可能ws连接接收数据尚未完成，用户就跳转了页面
      // 在需要主动关闭ws的地方都可以调用该方法
      this.requstWs();
      // if (messagePath.includes(this.currentPath)) {
      //   this.requstWs();
      // } else {
      //   closeWebsocket();
      // }
    },
    // 更新ws数据
    updateWsData(res) {
      const module = res.module;
      const data = res.data;
      this.messageList.push(data.id);
      switch (module) {
        // 消息
        case 'message':
          this.$notify({
            title: data.title || '-',
            message: data.content || '-',
            iconClass: 'el-icon-s-tools',
            onClick: () => {
              // TODO: 跳转到对应信息页面
              console.log('message');
            },
            onClose: () => {
              this.$axios.post(Api.messages.closeMessage, { data: data }, res => {
                this.messageList.splice(this.messageList.findIndex(i => i.id == data.id));
              });
            },
            duration: 0
          });
          break;
      }
    },
    // ws连接成功，后台返回的ws数据，组件要拿数据渲染页面等操作
    wsMessage(res) {
      const data = res;
      this.updateWsData(data);
      // 这里写拿到数据后的业务代码
      if (messagePath.includes(this.currentPath)) {
        // 同一时刻推送多条新消息时，只更新一次消息列表
        if (!this.isSend) {
          Bus.$emit('newMessage');
          this.isSend = true;
          setTimeout(() => {
            this.isSend = false;
          }, 1000);
        }
      }
    },
    // ws连接失败，组件要执行的代码
    wsError() {
      console.log('wsError');
      // 比如取消页面的loading
    },
    requstWs() {
      // 防止用户多次连续点击发起请求，所以要先关闭上次的ws请求。
      closeWebsocket();
      const postUrl = `${wsUrl}ws/message`;
      var data = {
        sid: localstorageGet('token'),
        ids: this.messageList
      };
      // 发起ws请求 ws:http;wss:https
      var toSend = sendWebsocket(postUrl, JSON.stringify(data), this.wsMessage, this.wsError);
      // 30秒检测是否有新消息推送
      clearInterval(this.timeoutId);

      this.timeoutId = setInterval(() => {
        toSend(JSON.stringify(data));
      }, 5 * 1000);
    }
  }
};
