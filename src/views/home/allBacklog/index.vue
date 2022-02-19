<!--
 * @Author: JTune
 * @Date: 2021-08-13
 * @LastEditTime: 2021-12-28 10:16:15
 * @LastEditors: JTune
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\roleManagement\index.vue
-->
<template>
 <div>
   <div id="inspectManagement">
     <el-container>
        <el-header style="height:45px;">
          <el-row type="flex" justify="start" align="middle" style="height:100%">
            <el-col style="width:unset;display:flex">
              <el-input
                style="width:unset;"
                size="small"
                placeholder="请输入发起人"
                @keyup.enter.native="getTaskList"
                v-model="searchKey">
                <i slot="suffix" class="el-input__icon el-icon-search mysearch" @click="getTaskList()" title="搜索"></i>
              </el-input>&nbsp;
              <el-date-picker
                v-model="dateVal"
                @change='handleDateChange'
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                class="ml10"
              >
              </el-date-picker>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <dy-table
            :keys="colKey"
            :multiActions="multiActions"
            :loading="loading"
            :fetchData="fetchData"
            :isPagination="true"
            :pagination="pagination"
            :list="tableData"
            :showCheckBox="false"
            @selectDataEvent="selectDataEvent"
            @rowClick="handleCheck"
          >
          </dy-table>
        </el-main>
     </el-container>
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
 </div>
</template>

<script>
import Api from '@/api';
import DyTable from '@/components/DyTable';
import FormContainer from '@/views/taskFormManage/FormContainer.vue';
import { dateTimeFormat } from '@/utils/utils';
export default {
  name: '',
  components: { DyTable, FormContainer },
  data() {
    return {
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
      newProjectDialogWidth: '900px',
      formLabelWidth: '130px',
      personDialogVisible: false,
      downSelect: '',
      searchKey: '',
      startDate: '', // 搜索开始日期
      endDate: '', // 搜索结束日期
      dateVal: [],
      loading: false,
      tableData: [],
      colKey: {
        formName: '主题',
        initiator: '发起人',
        initiatorDate: '发起时间',
        receiptTime: '接收时间'
      },
      pagination: {
        pagination: true,
        total: 0,
        pages: 1,
        size: 10
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
      ],
      personForm: {
        name: '',
        windStation: '',
        phone: '',
        superior: '',
        roleName: ''
      },
      personFormRules: {
        wind_power_plant: [{ required: true, message: '请输入名称', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        post_job: [{ required: true, message: '请选择岗位', trigger: 'change' }],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1[345789]\d{9}$/,
            message: '您输入的手机号码格式有误，请重新输入',
            trigger: 'blur'
          }
        ],
        superior: [{ required: true, message: '请选择直属上级', trigger: 'change' }]

      }
    };
  },
  computed: {},
  created() {
    this.getTaskList();
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
    fetchLogData() {
    },
    getTaskList() {
      this.$axios.post(
        Api.taskFlow.getTaskList,
        {
          data: {
            taskStatus: 'pending',
            initiator: this.searchKey,
            queryStartDate: this.startDate || undefined,
            queryEndDate: this.endDate || undefined,
            flowInstanceBizRelevance: {
              planId: '',
              stationId: this.$store.state.user.stationId,
              resourcesId: ''
            }
          },
          ...this.pagination
        },
        res => {
          if (res.isSuccess) {
            this.tableData = res.data || [];
            this.pagination.total = res.total || 0;
          }
        }
      );
    },
    handleDateChange() {
      console.log(this.startDate, this.endDate);
      if (this.dateVal) {
        this.startDate = dateTimeFormat(this.dateVal[0], 'yyyy-MM-dd');
        this.endDate = dateTimeFormat(this.dateVal[1], 'yyyy-MM-dd');
        this.getTaskList();
      } else {
        this.startDate = null;
        this.endDate = null;
        this.getTaskList();
      }
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
    cancelPersonDialogPopup() {
      this.personDialogVisible = false;
      this.$refs.personForm.resetFields();
    },
    closePersonDialogPopup() {
      this.personDialogVisible = false;
      this.$refs.personForm.resetFields();
    },
    surePersonDialogPopup() {
      this.personDialogVisible = false;
      this.$refs.personForm.resetFields();
    },
    newProject() {
      this.personDialogVisible = true;
    },
    deleteClick() {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('确定');
      }).catch(() => {
        this.$message.info('取消');
      });
    },
    handleAdd() {

    },
    fetchData() {
      this.getTaskList();
      // console.log(this.pagination, 'pagination');
      // this.tableData.length = 30;
      // this.tableData.fill({
      //   windPowerPlant: '王兵',
      //   name: '2021-04-06 11:00',
      //   dutyName: '2021-04-06 11:00'
      // }, 0, 10);
    },
    selectDataEvent(val) {
      console.log(val);
      this.selectDatas = val;
    },
    configHeader(val) {
      this.drawerVisible = true;
    },
    handleSearch() {
      this.$message.info('搜索：' + this.searchValue);
    }
  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
::v-deep .el-header{
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0;
}
.mysearch:hover{
  color: red;
}
.mysearch:active{
  color: transparent;
}
.el-main{
  padding: 0;
}
</style>
