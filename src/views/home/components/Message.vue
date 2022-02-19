<!--
 * @Author: your name
 * @Date: 2021-07-26 09:41:01
 * @LastEditTime: 2021-09-29 14:33:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\home\components\message.vue
-->
<template>
  <div class="content-com">
    <div class="tit">
      <span>消息</span>
      <a
        href="javascript:void(0);"
        @click="showMessage()"
      >全部</a>
    </div>
    <div class="message-con">
      <Timeline
        :dataList="messageList"
        :loading="loading"
        :isMoreData="isMoreData"
        @load="load"
        height="350px"
      ></Timeline>
    </div>
  </div>
</template>

<script>
import Timeline from '../allMessage/components/Timeline.vue';
import { mapGetters } from 'vuex';
import Api from '@/api';
import Bus from '@/bus';

export default {
  name: 'Message',
  components: {
    Timeline
  },
  data() {
    return {
      loading: false,
      isMoreData: false,
      messageList: [],
      pages: 1,
      size: 10
    };
  },
  computed: {
    ...mapGetters([
      'menuDefaultList'
    ])
  },
  mounted() {
    this.fetchData();
    // 有新消息推送，更新信息列表
    Bus.$on('newMessage', () => {
      this.fetchData();
    });
  },
  methods: {
    fetchData () {
      this.loading = true;
      const data = {
        data: { },
        pages: this.pages,
        size: this.size
      };
      this.$axios.post(Api.messages.getList, data, res => {
        this.loading = false;
        if (res.isSuccess) {
          const data = res.data.dataList || [];
          const total = res.data.total;

          if (this.pages > 1) {
            this.messageList.push(...data);
          } else {
            this.messageList = data;
          }

          this.isMoreData = (this.pages * this.size < total);
        }
      });
    },
    load () {
      if (!this.isMoreData) return;
      this.pages += 1;
      this.fetchData();
    },
    showMessage() {
      const path = '/allMessage';
      const arr = this.menuDefaultList.filter(item => item.path == path);
      if (arr.length) {
        this.$router.push({ path });
      } else {
        this.$message.error(`没有配置消息全部权限`);
      }
    }
  }
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.content-com {
  min-width: 400px;
  height: 413px;
  background-color: #fff;
  .tit {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    border-bottom: 1px solid #ebedf0;
    span {
      font-weight: bold;
      color: #000000;
    }
    a {
      text-align: right;
      color: #1989fa;
    }
  }
  .message-con {
    overflow: hidden;
  }
}
</style>
