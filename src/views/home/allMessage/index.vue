<!--
 * @Author: JTune
 * @Date: 2021-08-13
 * @LastEditTime: 2021-10-27 16:37:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\roleManagement\index.vue
-->
<template>
  <div ref="AllMessage" class="all-message">
    <el-container>
      <el-header class="header">
        <el-button type="primary" size="small" @click="clearAllMessage()">清空所有消息</el-button>
        <div class="search-bar">
          <el-input
            size="small"
            @input="handleContentChange"
            placeholder="请输入关键字"
            prefix-icon="el-icon-search"
            clearable
            v-model="content">
          </el-input>&nbsp;
          <el-date-picker
            v-model="dateTime"
            value-format="yyyy-MM-dd"
            @change='handleDateChange'
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          >
          </el-date-picker>
        </div>
      </el-header>
      <el-main>
        <div class="message-con">
          <Timeline
            :dataList="messageList"
            :loading="loading"
            :isMoreData="isMoreData"
            @load="load"
            height="700px"
          ></Timeline>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Timeline from './components/Timeline.vue';
import Api from '@/api';
import Bus from '@/bus';

export default {
  name: 'AllMessage',
  components: {
    Timeline
  },
  data() {
    return {
      loading: false,
      isMoreData: false,
      content: '',
      dateTime: [],
      messageList: [],
      pages: 1,
      size: 10,
      timeoutId: null
    };
  },
  watch: {},
  mounted() {
    this.fetchData();
    // 有新消息推送，更新信息列表
    Bus.$on('newMessage', () => {
      this.pages = 1;
      this.fetchData();
    });
  },
  methods: {
    fetchData () {
      this.loading = true;
      const data = {
        data: {},
        pages: this.pages,
        size: this.size
      };
      if (this.dateTime && this.dateTime.length > 0) {
        const [start, end] = this.dateTime;
        data.data.scopeParam = {
          minVal: start ? start + ' 00:00:00' : '',
          maxVal: end ? end + ' 23:59:59' : ''
        };
      }
      if (this.content) {
        data.data.content = this.content;
      }
      this.$axios.post(Api.messages.getList, data, res => {
        this.loading = false;
        if (res.isSuccess && res.data) {
          const data = res.data.dataList || [];
          const total = res.data.total;

          if (this.pages === 1) {
            this.messageList = data;
          } else {
            this.messageList.push(...data);
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
    clearAllMessage() {
      this.$confirm('确认删除所有消息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData();
      });
    },
    handleContentChange (val) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.pages = 1;
        this.fetchData();
      }, 500);
    },
    handleDateChange (val) {
      this.pages = 1;
      this.fetchData();
    },
    deleteData () {
      const data = {
        data: { }
      };
      this.$axios.post(Api.messages.deleteList, data, (res) => {
        if (res.isSuccess) {
          this.$message.success(res.message);
          this.content = '';
          this.dateTime = [];
          this.pages = 1;
          this.fetchData();
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.all-message {
  ::v-deep .el-header{
    height: 45px !important;
    display: flex;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #e9e9e9;
    padding: 0;
  }
  ::v-deep .el-input {
    width: unset;
  }
  ::v-deep .el-date-editor {
    width: 230px;
  }
}
.message-con {
  overflow: hidden;
}
</style>
