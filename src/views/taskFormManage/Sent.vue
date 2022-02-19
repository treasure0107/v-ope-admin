<!--
 * @Author: JTune
 * @Date: 2021-07-21 11:35:15
 * @Description: 已发事项
 * @FilePath: \operation-admin\src\views\operationManagement\transitionManagement\components\Sent.vue
-->
<template>
  <div>
    <div>
      <div class="operateSearch">
        <div class="search">
          <el-select
            placeholder="请选择任务状态"
            size="small"
            v-model="searchFlowStatus"
            @change="getTaskList"
          >
            <el-option
              v-for="(status,i) in flowStatusList"
              :key="i"
              :label="status.label"
              :value="status.value"
            ></el-option>
          </el-select>
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
    <!-- 撤销弹窗 -->
    <el-dialog
      title="撤销"
      :visible.sync="cancelDialogVisible"
      @close="handleCloseCancel('cancelForm')"
      width="500px"
    >
      <el-form
        :model="cancelForm"
        :rules="cancelRules"
        ref="cancelForm"
      >
        <el-form-item
          label="撤销原因"
          label-width="80px"
          prop="withdrawDesc"
        >
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model.trim="cancelForm.withdrawDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleCloseCancel('cancelForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSubmitCancel('cancelForm')"
        >撤 销</el-button>
      </div>
    </el-dialog>
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
      :taskFormId="taskFormId"
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
      formVisible: false,
      formLabelWidth: '100px',
      loading: false,
      cancelDialogVisible: false,
      logDialogVisible: false,
      searchFlowStatus: null,
      flowInstanceId: '', // 流程实例id
      taskFormId: '', // 已建任务的表单id
      startDate: '', // 搜索开始日期
      endDate: '', // 搜索结束日期
      tableData: [],
      logTableData: [],
      formOperate: 'create',
      searchKey: '',
      dateVal: '',
      id: '',
      withDrawId: '', // 撤销任务的实例id
      cancelForm: {
        withdrawDesc: ''
      },
      cancelRules: {
        withdrawDesc: [{ required: true, message: '请填写撤回原因', trriger: 'blur' }]
      },
      confirmForm: {
        factory: '',
        name: ''
      },
      confirmRules: {
        factory: [{ required: true, message: '请选择厂商', trriger: 'change' }],
        name: [
          { required: true, message: '请确认您的姓名', trriger: 'change' }
        ]
      },
      selectDatas: [],
      typeList: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      colKey: {
        initiatorDate: '发起时间',
        currentPendingNodeName: '当前待办',
        flowStatus: '当前状态'
      },
      flowStatusList: [
        {
          label: '全部状态',
          value: null
        },
        {
          label: '运行中',
          value: 'run'
        },
        // {
        //   label: '撤销',
        //   value: 'withdraw'
        // },
        // {
        //   label: '终止',
        //   value: 'termination'
        // },
        // {
        //   label: '驳回',
        //   value: 'rejected'
        // },
        {
          label: '完结',
          value: 'end'
        }
      ],
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
              width: '200px',
              label: '查看流程日志',
              action: (row) => {
                this.handleCheckLog(row);
              }
            }
          ]
        },
        {
          header: '操作',
          actions: [
            {
              width: '150px',
              label: '撤 销',
              action: (row) => {
                if (row.flowStatus == '运行中') {
                  this.handleCancel(row);
                } else {
                  this.$message.warning('此任务不在运行中,无法撤销');
                }
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
      // return this.$parent.$parent.$parent.$parent.$parent.$parent.$data.operationFlowCodeandState || { state: false, flowcode: '' };
      return this.operationFlowCodeandState || { state: false, flowcode: '' };
    }
  },
  watch: {},
  created() { },
  mounted() {
  },
  methods: {
    setStatus(row) {
      return true;
    },
    // 查询已发列表
    getTaskList() {
      this.$axios.post(
        Api.taskFlow.getTaskList,
        {
          data: {
            flowStatus: this.searchFlowStatus,
            taskStatus: 'has_been_sent',
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
    fetchLogData() {
    },
    // 点击行事件--查看表单
    handleCheck(data) {
      this.formOperate = 'check';
      this.formVisible = true;
      this.flowInstanceId = data.row.flowInstanceId;
      this.taskFormId = data.row.formProxyId;
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
    // 撤销
    handleCancel(row) {
      this.withDrawId = row.flowInstanceId;
      this.cancelDialogVisible = true;
    },
    // 确认撤销
    handleSubmitCancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post(
            Api.taskFlow.withDraw,
            {
              data: {
                id: this.withDrawId,
                withdrawDesc: this.cancelForm.withdrawDesc
              }
            },
            res => {
              if (res.isSuccess) {
                this.getTaskList();
                this.handleCloseCancel(formName);
              } else {
                this.$message.error(res.message);
              }
            }
          );
        } else {
          this.$message.error('请填写撤销原因');
        }
      });
    },
    // 取消撤销
    handleCloseCancel(formName) {
      this.$refs[formName].resetFields();
      this.cancelDialogVisible = false;
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
.operateSearch {
  display: flex;
  justify-content: space-between;
  .operate {
    display: flex;
  }
  .search {
    display: flex;
    .el-select {
      margin-right: 5px;
    }
  }
}
</style>
