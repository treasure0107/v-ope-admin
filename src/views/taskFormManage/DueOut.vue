<!--
 * @Author: JTune
 * @Date: 2021-08-12 11:12:36
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-24 11:38:18
 * @Description: 待发事项
-->
<template>
  <div>
    <div>
      <div class="operateSearch">
        <div class="operate">
          <el-button
            v-if="theOperationData.showAllandNotCreate"
            type="primary"
            size="small"
            @click="handleCreate"
          >创 建</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDel"
          >删 除</el-button>
        </div>
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
            class="ml10"
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
        :showCheckBox="true"
        @rowClick="handleCheck"
        @selectDataEvent="selectDataEvent"
      >
      </dy-table>
    </div>
    <FormContainer
      :dialogVisible.sync="formVisible"
      :formOperate="formOperate"
      :flowInstanceId="flowInstanceId"
      :taskFormId="taskFormId"
      :flowProxyId="flowProxyId"
      :nextAuditType="nextAuditType"
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
      formVisible: false,
      loading: false,
      tableData: [],
      formOperate: '',
      nextAuditType: '', // 重新发送判断下一审批节点类型
      flowInstanceId: '', // 流程实例id
      taskFormId: '', // 已建任务的表单id
      flowProxyId: '', // 流程代理id
      searchFlowStatus: null,
      startDate: '', // 搜索开始日期
      endDate: '', // 搜索结束日期
      isAdd: false,
      isEdit: false,
      isClick: false,
      searchKey: '',
      dateVal: '',
      id: '',
      flowInstanceIdList: [],
      typeList: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      colKey: {
        initiatorDate: '创建时间',
        flowStatus: '当前状态',
        rejectedDesc: {
          label: '原因描述',
          showTooltip: true
        }
        // rejectedDesc: '原因描述'
      },
      multiActions: [
        {
          header: '操作',
          actions: [
            {
              width: '150px',
              label: '编 辑',
              action: (row) => {
                this.handleEdit(row);
              }
            }
          ]
        }
      ],
      flowStatusList: [
        {
          label: '全部状态',
          value: null
        },
        {
          label: '撤销',
          value: 'withdraw'
        },
        {
          label: '驳回',
          value: 'rejected'
        }
      ]
    };
  },
  props: {
  },
  // inject: ['operationFlowCodeandState'], // 数组式组件
  inject: {
    operationFlowCodeandState: {
      // 函数式组件
      default: () => ({ state: false, flowcode: '', showAllandNotCreate: true })
    }
  },
  computed: {
    theOperationData() {
      return this.operationFlowCodeandState || { state: false, flowcode: '', showAllandNotCreate: true };
    }
  },
  watch: {},
  created() { },
  mounted() {
  },
  methods: {
    // 查询待发列表
    getTaskList() {
      this.$axios.post(
        Api.taskFlow.getTaskList,
        {
          data: {
            flowStatus: this.searchFlowStatus,
            taskStatus: 'waiting_send',
            queryStartDate: this.startDate,
            queryEndDate: this.endDate,
            flowInstanceBizRelevance: {
              planId: '',
              stationId: localstorageGet('stationId') || '',
              resourcesId: this.$store.state.flow.resourceId,
              deviceId: this.theOperationData.deviceId || undefined
            }
          },
          pages: this.pagination.pages,
          pagination: true,
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
    // 编辑
    handleEdit(data) {
      this.formOperate = 'edit';
      this.formVisible = true;
      this.taskFormId = data.formProxyId;// 查待发表单模板
      this.flowInstanceId = data.flowInstanceId;// 重新发送
      this.nextAuditType = data.flowNextNodeAuditType;// 下一审批节点类型
      this.flowProxyId = data.flowProxyId;// 查待发权限权限
    },
    // 查看
    handleCheck(data) {
      this.formOperate = 'checkWithInfo';
      this.formVisible = true;
      this.taskFormId = data.row.formProxyId;
      this.flowInstanceId = data.row.flowInstanceId;
    },
    // 创建
    handleCreate() {
      const stationId = localstorageGet('stationId');
      if (!stationId) {
        this.$message.error('未查询到关联的场站,不能发起流程');
        return;
      }
      if (this.theOperationData.state) {
        this.$axios.post(
          Api.operationTicket.getIdFromflowcode,
          {
            data: {},
            flowCode: this.theOperationData.flowcode
          },
          res => {
            if (res.isSuccess) {
              if (res.data && res.data.length > 0 && res.data[0].formTemplateId) {
                this.formOperate = 'create';
                this.formVisible = true;
              } else {
                this.$message({
                  message: '未找到关联的表单,请先关联表单',
                  type: 'warning'
                });
              }
            } else {
              this.$message.error(res.message);
            }
          }
        );
      } else {
        this.$axios.post(
          Api.menuFlowManage.initTable,
          {
            data: {
              formTemplateBizRelevance: {
                stationId: localstorageGet('stationId'),
                projectId: '',
                resourcesId: this.$store.state.flow.resourceId
              }
            }
          },
          res => {
            if (res.isSuccess) {
              if (res.data.length > 0 && res.data[0].formId) {
                this.formOperate = 'create';
                this.formVisible = true;
              } else {
                this.$message({
                  message: '未找到关联的流程表单,请先关联表单',
                  type: 'warning'
                });
              }
            } else {
              this.$message.error(res.message);
            }
          }
        );
      }
    },
    // 已建任务操作状态字符转换
    translateStatus(obj) {
      let chnStatus;
      if (obj.flowStatus) {
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
    // 删除
    handleDel() {
      if (!this.flowInstanceIdList.length) {
        this.$message.error('请先选择要删除的流程实例');
        return;
      }
      this.$confirm('此删除操作不可恢复', '您确定要删除选中数据?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          Api.taskFlow.taskDelete,
          {
            data: {},
            ids: this.flowInstanceIdList
          },
          res => {
            if (res.isSuccess) {
              this.$message.success('删除成功');
              this.getTaskList();
            } else {
              this.$message.error(res.message);
            }
          }
        );
      }).catch(() => {});
    },
    selectDataEvent(val) {
      this.flowInstanceIdList = [];
      val.map(item => {
        this.flowInstanceIdList.push(item.flowInstanceId);
      });
    }
  }
};
</script>
<style scoped lang="scss">
::v-deep .el-table tbody tr:hover>td {
  cursor: pointer;
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
