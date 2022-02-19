<!--
 * @Author: JTune
 * @Date: 2021-08-12 11:12:36
 * @LastEditors: JTune
 * @LastEditTime: 2022-01-03 11:47:04
 * @Description: 已办事项
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
          <span v-if="isSupGroup">
            <span style="margin-left:15px;font-size:14px">切换风电场：</span>
            <el-select
              size="mini"
              v-model="checkedWindFarmId"
              @change="beforegetTaskList"
            >
              <el-option
                v-for="item in windFarmList"
                :key="item.id"
                :label="item.nodeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </span>
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
      // basePath: '',
      formVisible: false,
      formLabelWidth: '100px',
      loading: false,
      logDialogVisible: false,
      tableData: [],
      logTableData: [],
      formOperate: 'create',
      flowInstanceId: '', // 流程实例id
      taskFormId: '', // 已建任务的表单id
      searchKey: '', // 搜索关键字
      startDate: '', // 搜索开始日期
      endDate: '', // 搜索结束日期
      windFarmList: [], // 风场列表
      checkedWindFarmId: '', // 切换风电场
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
        currentPendingNodeName: '当前待办',
        executeDate: '处理时间',
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
  props: {
    isSupGroup: {
      type: Boolean,
      default: false
    }
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
  created() {
    this.getWindFarmList();
  },
  mounted() {
  },
  methods: {
    getWindFarmList() {
      this.$axios.post(
        Api.windFarmManage.getWindFarmList,
        {
          data: {
            nodeName: ''
          },
          searchArea: true
        },
        res => {
          if (res.isSuccess) {
            this.windFarmList = res.data;
            this.checkedWindFarmId = res.data[0].id;
            this.beforegetTaskList();
            // this.getTaskList();
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    beforegetTaskList() { // 查询设备树
      if (this.$route.path.includes('groupManagement/operationTicketManagement')) {
        this.operationFlowCodeandState.groupgetInitTree(this.checkedWindFarmId);
        this.operationFlowCodeandState.getTaskList = this.getTaskList;
        this.operationFlowCodeandState.completedthis = this;
        this.$axios.post(
          Api.operationTicket.getInitTree,
          {
            data: {
              nodeId: this.checkedWindFarmId
              // resourceId: '246c17f6366c4855be62d380a74dbe4e'
            }
          },
          res => {
            if (res.isSuccess) {
              this.treeData = res.data || [];
              if (this.treeData && !(this.treeData.length == 0)) { var initTreeNode = res.data[0].childrens[0].childrens[0]; }
              if (initTreeNode) {
                this.operationFlowCodeandState.deviceId = initTreeNode.id;
              };
              this.getTaskList();
            } else {
              this.$message.error({ duration: 4000, message: res.message });
            }
          }
        );
      } else {
        this.getTaskList();
      }
    },
    // 查询已办列表
    getTaskList() {
      console.log(this.checkedWindFarmId);
      const data = {
        taskStatus: 'done',
        initiator: this.searchKey,
        queryStartDate: this.startDate,
        queryEndDate: this.endDate,
        flowInstanceBizRelevance: {
          planId: '',
          // stationId: localstorageGet('stationId'),
          // resourcesId: this.$store.state.flow.resourceId || '',
          deviceId: this.theOperationData.deviceId || undefined
        }
      };
      if (this.isSupGroup) {
        // 集团面板查已办列表————传菜单表单类型——场站传选择的风场
        data.flowInstanceBizRelevance.menuType = this.$store.state.flow.menuType;
        data.flowInstanceBizRelevance.stationId = this.checkedWindFarmId;
      } else {
        // 场站管理面板查已办列表————传菜单id——场站传用户所属场站
        data.flowInstanceBizRelevance.resourcesId = this.$store.state.flow.resourceId || '';
        data.flowInstanceBizRelevance.stationId = localstorageGet('stationId');
        data.executorId = localstorageGet('userId');
      }
      this.$axios.post(
        Api.taskFlow.getTaskList,
        {
          data,
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
      console.log(this.tableData, 'this.tableData');
    },
    handleDateChange() {
      this.startDate = dateTimeFormat(this.dateVal[0], 'yyyy-MM-dd');
      this.endDate = dateTimeFormat(this.dateVal[1], 'yyyy-MM-dd');
      this.getTaskList();
    },
    fetchData() {
      if (this.isSupGroup) {
        return false;
      } else {
        this.getTaskList();
      }
    },
    // 点击行事件
    handleCheck(data) {
      this.formOperate = 'check';
      this.formVisible = true;
      this.flowInstanceId = data.row.flowInstanceId;
      this.taskFormId = data.row.formProxyId;
    },
    // 获取流程日志
    fetchLogData() { },
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
      // this.$refs.ruleForm.resetFields();
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
// .operateSearch {
//   display: flex;
//   justify-content: space-between;
//   .operate {
//     display: flex;
//   }
//   .search {
//     display: flex;
//   }
// }
</style>

