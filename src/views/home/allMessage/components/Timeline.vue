<!--
 * @Author: chenjz
 * @Date: 2021-09-28 10:49:18
 * @Description: 时间轴组件
-->
<template>
  <div class="wrap" v-loading="loading">
    <template v-if="dataList.length > 0">
      <ul class="infinite-list" :style="{ height }" v-infinite-scroll="load">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in dataList"
            :key="index"
          >
          <div class="timeline-wrap">
            <div class="reminderStartTime">{{ item.reminderStartTime }}</div>
            <div :class="['timeline-content-wrap', item.readStatus.toLowerCase()]" @click="detailMessage(item)">
              <div class="timeline-title">{{ item.title }} </div>
              <div>{{ item.content }}</div>
            </div>
          </div>
          </el-timeline-item>
        </el-timeline>
        <div class="load-text">{{ loadText }}</div>
      </ul>
    </template>
    <div class="no-data" v-else>暂无消息~</div>
  </div>
</template>

<script>
import Api from '@/api';
export default {
  name: 'Timeline',
  props: {
    dataList: {
      type: Array,
      required: true,
      default () {
        return [];
      }
    },
    loading: {
      type: Boolean,
      required: true,
      default: false
    },
    isMoreData: {
      type: Boolean,
      required: true,
      default: false
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  computed: {
    loadText () {
      if (this.loading) {
        return '加载中...';
      } else {
        if (this.isMoreData) {
          return '上拉加载更多';
        } else {
          return '已加载全部数据';
        }
      }
    }
  },
  methods: {
    load () {
      this.$emit('load');
    },
    detailMessage (item) {
      if (item.readStatus === 'UNREAD') {
        const data = {
          data: {
            id: item.id
          }
        };
        this.$axios.post(Api.messages.changeReadState, data, (res) => {
          if (res.isSuccess) {
            item.readStatus = 'READ';
          }
        });
      }
      // TODO: 跳转到对应信息页面
      console.log('detailMessage:', item);
    }
  }
};
</script>

<style lang='scss' scoped>
.infinite-list {
  overflow:auto;
  padding-top: 12px;
  padding-left: 24px;
  .el-timeline {
    ::v-deep .el-timeline-item__wrapper {
      padding-left: 0;
    }
    ::v-deep .el-timeline-item__tail {
      left: 147px;
    }
    ::v-deep .el-timeline-item__node {
      left: 142px;
      border: 1px solid #1890FF;
      background-color: #fff;
    }
    ::v-deep .el-timeline-item {
      padding-top: 5px;
      &:hover {
        background: rgba(0,0,0,0.03);
      }
    }
  }
  .timeline-wrap {
    display:flex;
    word-break: break-all;
    .reminderStartTime {
      white-space: nowrap;
    }
    .timeline-content-wrap {
      margin-left: 20px;
      &:hover {
        cursor: pointer;
        // text-decoration:underline;
      }
      .timeline-title {
        margin-bottom: 10px;
      }
    }
  }
  .load-text {
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .read {
    color: #888;
  }
  .unread {
    font-weight: bold;
    color: #000;
  }
}
.no-data {
  padding: 20px;
}

::-webkit-scrollbar {
  width: 7px;
  height: 5px;
  border-radius:15px;
  -webkit-border-radius:  15px;
}
::-webkit-scrollbar-track-piece {
  background-color: #ffff;
  border-radius:15px;
  -webkit-border-radius:  15px;
}
::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(144, 147, 153, 0.5);
  border-radius: 15px;
  -webkit-border-radius:  15px;
}
::-webkit-scrollbar-thumb:horizontal {
  width: 7px;
  background-color: rgba(144, 147, 153, 0.5);
  border-radius:  15px;
  -webkit-border-radius: 15px;
}
</style>
