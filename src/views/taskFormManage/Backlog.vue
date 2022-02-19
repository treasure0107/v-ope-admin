<!--
 * @Author: JTune
 * @Date: 2021-08-12 11:12:36
 * @LastEditors: JTune
 * @LastEditTime: 2021-11-25 17:27:41
 * @Description: file content
-->
<template>
  <div>
    <div>
      <div class="operateSearch">
        <div class="search">
          <el-input
            style="width:200px;margin-right:5px"
            size="small"
            v-model.trim="searchKey"
            @keyup.enter.native="getTaskList"
            placeholder="查找发起人"
          >
            <i
              slot="suffix"
              style="cursor:pointer"
              @click="getTaskList"
              class="el-input__icon el-icon-search"
            ></i>
          </el-input>
          <el-date-picker
            v-model="dateVal"
            @change="handleDateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
          >
          </el-date-picker>
        </div>
      </div>
      <dy-table
        :keys="colKey"
        :multiActions="multiActions"
        :loading="loading"
        :fetchData="fetchData"
        :isPagination="true"
        :pagination="pagination"
        :list="tableData"
        @rowClick="handleCheck"
      >
      </dy-table>
    </div>
    <!-- 流程日志弹窗 -->
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
import DyTable from '@/components/DyTable';
import FormContainer from './FormContainer.vue';
import Api from '@/api';
import { dateTimeFormat } from '@/utils/utils';
import { localstorageGet } from '@/utils/auth';
export default {
  name: '',
  components: { DyTable, FormContainer },
  data() {
    return {
      Interval: undefined,
      // basePath: '',
      formVisible: false,
      formLabelWidth: '100px',
      loading: false,
      logDialogVisible: false,
      tableData: [],
      logTableData: [],
      formOperate: 'create',
      flowInstanceId: '', // 已建任务的流程实例id
      taskFormId: '', // 已建任务的表单id
      flowNodeType: '', // 已建任务的节点类型
      jobTaskId: '', // 待办任务任务id
      nodeProxyId: '', // 待办任务节点id查权限
      searchKey: '', // 搜索关键字
      startDate: '', // 搜索开始日期
      endDate: '', // 搜索结束日期
      approveResult: '',
      id: '',
      dateVal: '',
      selectDatas: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      colKey: {
        initiator: '发起人',
        initiatorDate: '发起时间',
        receiptTime: '接收时间',
        flowStatus: '当前状态'
      },
      logColKey: {
        executorName: {
          label: '操作人',
          width: '150px'
        },
        createDate: '操作时间',
        auditStatus: '操作状态',
        executeDesc: {
          label: '操作描述',
          showTooltip: true
        }
      },
      multiActions: [
        {
          header: '流程日志',
          actions: [
            {
              width: '150px',
              label: '查看流程日志',
              action: (row) => {
                this.handleCheckLog(row);
              }
            }
          ]
        }
      ]
    };
  },
  // inject: ['operationFlowCodeandState'], // 数组式组件
  inject: {
    operationFlowCodeandState: {
      // 函数式组件
      default: () => ({})
    }
  },
  computed: {
    theOperationData() {
      return this.operationFlowCodeandState || { state: false, flowcode: '' };
    }
  },
  watch: {},
  created() { },
  mounted() {
    this.Interval = setInterval(() => {
      this.getTaskList();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.Interval);
  },
  methods: {
    // 查询待办列表
    getTaskList() {
      this.$axios.post(
        Api.taskFlow.getTaskList,
        {
          data: {
            taskStatus: 'pending',
            initiator: this.searchKey,
            queryStartDate: this.startDate,
            queryEndDate: this.endDate,
            flowInstanceBizRelevance: {
              planId: '',
              stationId: localstorageGet('stationId'),
              resourcesId: this.$store.state.flow.resourceId,
              deviceId: this.theOperationData.deviceId || undefined
            }
          },
          pagination: true,
          pages: this.pagination.pages,
          size: this.pagination.size
        },
        res => {
          if (res.isSuccess) {
            this.tableData = res.data;
            this.tableData.map(item => {
              item.flowStatus = this.translateStatus(item);
            });
            this.pagination.size = res.size;
            this.pagination.total = res.total;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    handleDateChange() {
      this.startDate = dateTimeFormat(this.dateVal[0], 'yyyy-MM-dd');
      this.endDate = dateTimeFormat(this.dateVal[1], 'yyyy-MM-dd');
      this.getTaskList();
    },
    fetchData() {
      this.getTaskList();
    },
    // 点击行事件
    handleCheck(data) {
      this.formOperate = 'checkSubmit';
      this.formVisible = true;
      this.flowInstanceId = data.row.flowInstanceId;
      this.taskFormId = data.row.formProxyId;
      this.flowNodeType = data.row.flowNextNodeAuditType;
      this.jobTaskId = data.row.jobTaskId;
      this.nodeProxyId = data.row.flowNodeProxyId;
    },
    // 获取流程日志
    fetchLogData() {
      this.logTableData = [];
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

          case 'withdraw':
            chnStatus = '撤销';
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
    // 重置
    reset() {
      this.dialogTitle = '新增类型';
      this.dialogVisible = false;
      this.isEdit = false;
      this.isAdd = false;
      this.form = {};
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep .el-table tbody tr:hover > td {
  cursor: pointer;
}
.logdialog {
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
}
</style>

