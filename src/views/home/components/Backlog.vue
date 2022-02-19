<!--
 * @Author: your name
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\home\components\backlog.vue
-->
<template>
  <div class="content-com">
    <div class="tit">
      <span>待办事项</span>
      <a
        href="javascript:void(0);"
        @click="allBacklog"
      >全部</a>
    </div>
    <div class="table-con">
      <dy-table
        maxTableHeight="350px"
        :keys="colKey"
        :loading="loading"
        :fetchData="fetchData"
        :pagination="pagination"
        :list="tableData"
        :isShowConfigHeader="false"
        :multiActions="multiActions"
        @rowClick="handleCheck"
      >
      </dy-table>
    </div>
         <el-dialog
      title="流程日志"
      :visible.sync="logDialogVisible"
      @close="logDialogVisible = false"
      width="700px"
    >
      <div class="logdialog">
        <dy-table
          :keys="logColKey"
          :loading="loading"
          :fetchData="fetchLogData"
          :list="logTableData"
        >
        </dy-table>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="logDialogVisible = false"
        >关 闭</el-button>
      </div>
    </el-dialog>
     <FormContainer
      :dialogVisible.sync="formVisible"
      :formOperate="formOperate"
      :flowInstanceId="flowInstanceId"
      :jobTaskId="jobTaskId"
      :taskFormId="taskFormId"
      :nodeProxyId="nodeProxyId"
      :flowNodeType="flowNodeType"
      @reGetTaskList="getTaskList"
    ></FormContainer>
  </div>
</template>

<script>
import Api from '@/api';
import DyTable from '@/components/DyTable';
import FormContainer from '@/views/taskFormManage/FormContainer.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'Backlog',
  components: { DyTable, FormContainer },
  data() {
    return {
      setIntervalSearch: undefined,
      formOperate: '',
      formVisible: false,
      flowInstanceId: '',
      taskFormId: '',
      flowNodeType: '',
      jobTaskId: '',
      nodeProxyId: '',
      logTableData: [],
      logColKey: {
        executorName: {
          label: '操作人',
          width: '150px'
        },
        createDate: '操作时间',
        auditStatus: '操作状态',
        executeDesc: '操作描述'
      },
      logDialogVisible: false,
      loading: false,
      tableData: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      colKey: {
        formName: '主题',
        initiator: '发起人',
        initiatorDate: '发起时间',
        receiptTime: '接收时间'
      },
      multiActions: [
        {
          header: '流程日志',
          actions: [
            {
              width: '90px',
              label: '查看',
              action: (row) => {
                this.handleCheckLog(row);
              }
            }

          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'menuDefaultList'
    ])
  },
  watch: {},
  created() {
    this.getTaskList();
    this.setIntervalSearch = setInterval(() => {
      this.getTaskList();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.setIntervalSearch);
  },
  deactivated() {
    clearInterval(this.setIntervalSearch);
  },
  mounted() {
  },
  methods: {
    handleCheck(data) {
      this.formOperate = 'checkSubmit';
      this.formVisible = true;
      this.flowInstanceId = data.row.flowInstanceId;
      this.taskFormId = data.row.formProxyId;
      this.flowNodeType = data.row.flowNextNodeAuditType;
      this.jobTaskId = data.row.jobTaskId;
      this.nodeProxyId = data.row.flowNodeProxyId;
    },
    // 查看流程日志
    handleCheckLog(row) {
      this.logDialogVisible = true;
      this.$axios.post(
        Api.taskFlow.findRecord,
        {
          data: {
            flowInstanceId: row.flowInstanceId
          }
        },
        res => {
          if (res.isSuccess) {
            this.logTableData = res.data;
            this.logTableData.map(item => {
              item.auditStatus = this.translateStatus(item);
            });
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 已建任务和流程日志操作状态字符转换
    translateStatus(obj) {
      let chnStatus;
      if (obj.auditStatus) {
        switch (obj.auditStatus) {
          case 'pass':
            chnStatus = '通过';
            break;

          case 'no_pass':
            chnStatus = '驳回';
            break;

          default:
            chnStatus = '';
            break;
        }
      } else if (obj.flowStatus) {
        switch (obj.flowStatus) {
          case 'await_sent':
            chnStatus = '待发';
            break;

          case 'run':
            chnStatus = '运行中';
            break;

          case 'withdraw':
            chnStatus = '撤销';
            break;

          case 'termination':
            chnStatus = '终止';
            break;

          case 'rejected':
            chnStatus = '驳回';
            break;

          case 'end':
            chnStatus = '完结';
            break;

          default:
            chnStatus = '';
            break;
        };
      }
      return chnStatus;
    },
    fetchLogData() {
    },
    getTaskList() {
      this.$axios.post(
        Api.taskFlow.getTaskList,
        {
          data: {
            taskStatus: 'pending',
            flowInstanceBizRelevance: {
              planId: '',
              stationId: this.$store.state.user.stationId,
              resourcesId: ''
            }
          },
          pagination: true,
          page: 1,
          size: 999
        },
        res => {
          if (res.isSuccess) {
            this.tableData = res.data || [];
          }
        }
      );
    },
    allBacklog() {
      const path = '/allBacklog';
      const arr = this.menuDefaultList.filter(item => item.path == path);
      if (arr.length) {
        this.$router.push({ path });
      } else {
        this.$message.error(`没有配置待办事项全部权限`);
      }
    },
    fetchData() {
    }
  }
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
::v-deep .el-table--scrollable-y .el-table__body-wrapper{
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 0px;
    }
    &::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgb(51, 51, 51);
    }
    &::-webkit-scrollbar-corner {
      background: #179a16;
    }
}
.content-com {
  min-width: 400px;
  height: 413px;
  background-color: #fff;
  // overflow: hidden;
  .tit {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    font-size: 14px;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    border-bottom: 1px solid #ebedf0;
    span {
      flex: 1;
      font-weight: bold;
      color: #000000;
    }
    a {
      flex: 1;
      text-align: right;
      color: #1989fa;
    }
  }
  .table-con {
    height: 350px;
    padding: 0 20px;
    overflow: hidden;
  }
}
</style>
