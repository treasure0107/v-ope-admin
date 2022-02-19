<!--
 * @Author: JTune
 * @Date: 2021-08-13
 * @LastEditTime: 2021-12-28 10:18:17
 * @LastEditors: JTune
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\roleManagement\index.vue
-->
<template>
  <div>
    <div id="stationRole">
      <div class="main_left fl">
        <div class="title">
          <span>风电场</span>
        </div>
        <ul class="station_list">
          <li
            v-for="(item) in windFarmList"
            :class="checkedWindFarmId == item.id ? 'active' : ''"
            @click="handleClickWindFarm(item.id)"
            :key="item.id"
          >
            <span>{{item.nodeName}}</span>
          </li>
        </ul>
      </div>
      <div
        class="main_right fl"
        v-if="checkedWindFarmId"
      >
        <!-- v-if="checkedWindFarmId" -->
        <div class="operate_button">
          <el-button
            type="primary"
            size="small"
            @click="handleAddPerson"
          >关联用户</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleRelateOff"
          >解除关联</el-button>
        </div>
        <DyTable
          :keys="colKey"
          :loading="loading"
          :isPagination="true"
          :fetchData="fetchData"
          :pagination="pagination"
          :list="tableData"
          :showCheckBox="true"
          ref="relateUserListTable"
          @selectDataEvent="selectDataEvent"
        ></DyTable>
      </div>
      <div
        class="main_right fl"
        v-else
      >
        <div class="info">
          <div>
            <img :src="testPic">
          </div>请选择风电场以进行操作~
        </div>
      </div>
      <!-- 人员弹窗---添加 -->
      <DyDialog
        :visible="personDialogVisible"
        width="900px"
        :dialogTitle="dialogTitle"
        @cancelDialogPopup="closePersonDialogPopup"
        @closeDialogPopup="closePersonDialogPopup"
        @sureDialogPopup="surePersonDialogPopup"
      >
        <el-row>
          <el-col :span="8">
            <el-input
              placeholder="请输入搜索人员姓名"
              @keyup.enter.native="innerFetchData"
              clearable
              v-model.trim="searchKey"
            >
              <i
                slot="suffix"
                @click="innerFetchData"
                class="el-input__icon el-icon-search"
              ></i>
            </el-input>
          </el-col>
        </el-row>
        <!-- 添加人员 -->
        <div class="innerDialog">
          <DyTable
            :keys="innerColKey"
            :loading="loading"
            :isPagination="true"
            :fetchData="innerFetchData"
            :pagination="innerPagination"
            :list="innerTableData"
            :showCheckBox="true"
            ref="companyUserListTable"
            @selectDataEvent="innerSelectDataEvent"
          ></DyTable>
        </div>
      </DyDialog>
    </div>
  </div>
</template>

<script>
import DyTable from '@/components/DyTable';
import DyDialog from '@/components/DyDialog';
import { localstorageGet } from '@/utils/auth';
import Api from '@/api';
export default {
  name: '',
  components: { DyTable, DyDialog },
  data() {
    return {
      testPic: require('@/assets/images/no_data.png'),
      checkedWindFarmId: '', // 选中的风电场id
      checkedRoleName: '', // 选中的角色名
      searchKey: '',
      roleDialogVisible: false,
      personDialogVisible: false,
      selectedUserIds: [], // 选中要关联角色或要解除关联的用户id集合
      dialogTitle: '默认标题',
      formLabelWidth: '100px',
      isAdd: false,
      isEdit: false,
      innerColKey: {
        name: '姓名',
        dutyName: '岗位',
        phone: '电话'
      },
      innerPagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      innerTableData: [],
      colKey: {
        name: '姓名',
        dutyName: '岗位'
      },
      loading: false,
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      tableData: [],
      windFarmList: [], // 风场列表
      roleForm: {
        roleName: ''
      },
      roleRules: {
        roleName: [{ required: true, message: '请填写角色名称', trigger: 'blur' }]
      }
    };
  },
  computed: {},
  watch: {
    checkedWindFarmId() {
      this.getRelateUserList();
    }
  },
  created() { },
  mounted() {
    this.getWindFarmList();
  },
  methods: {
    // 选择风电场
    handleClickWindFarm(id) {
      if (this.checkedWindFarmId != id) {
        this.checkedWindFarmId = id;
        this.pagination.pages = 1;
      }
    },
    // 查询风场列表
    getWindFarmList() {
      this.$axios.post(
        Api.windFarmManage.getWindFarmList,
        {
          data: {
          },
          searchArea: true,
          pagination: false
        },
        res => {
          if (res.isSuccess) {
            this.windFarmList = res.data;
          }
        }
      );
    },
    // 关联人员
    handleAddPerson() {
      this.isAdd = true;
      this.isEdit = false;
      this.dialogTitle = '关联人员';
      this.personDialogVisible = true;
    },
    fetchData() {
      this.getRelateUserList();
    },
    // 获取风场关联人员的列表
    getRelateUserList() {
      this.$axios.post(
        Api.windFarmManage.getRelateUserList,
        {
          data: {
            nodeId: this.checkedWindFarmId
          },
          pagination: true,
          current: this.pagination.pages,
          size: this.pagination.size
        },
        res => {
          if (res.isSuccess) {
            this.tableData = res.data;
            this.pagination.total = res.total;
          }
        }
      );
    },
    // 获取添加人员表格数据-公司人员列表
    innerFetchData() {
      this.$axios.post(
        Api.roleManage.getCompanyUser,
        {
          data: {
            name: this.searchKey,
            companyId: localstorageGet('companyId')
          },
          pagination: true,
          pages: this.innerPagination.pages,
          size: this.innerPagination.size
        },
        res => {
          if (res.isSuccess) {
            this.innerTableData = res.data.dataList;
            this.innerPagination.total = res.data.total;
          }
        }
      );
    },
    // 人员表格--选择关联人员表格数据
    selectDataEvent(val) {
      this.selectedUserIds = [];
      val.map(item => {
        this.selectedUserIds.push(item.id);
      });
    },
    // 添加人员弹窗--选择公司人员表格数据
    innerSelectDataEvent(val) {
      this.selectedUserIds = [];
      val.map(item => {
        this.selectedUserIds.push(item.id);
      });
    },
    // 关闭人员弹窗
    closePersonDialogPopup() {
      this.personDialogVisible = false;
      this.$refs.companyUserListTable.handleClearSelection();
    },
    // 确认关联人员至风场
    surePersonDialogPopup() {
      const nodeUsers = [];
      this.selectedUserIds.map(item => {
        nodeUsers.push({
          userId: item
        });
      });
      this.$axios.post(
        Api.windFarmManage.relateFarm,
        {
          data: {
            nodeId: this.checkedWindFarmId,
            nodeUsers
          }
        },
        res => {
          if (res.isSuccess) {
            this.getRelateUserList();
            this.$message.success('关联成功');
          } else {
            this.$message.error(res.message);
          }
          this.$refs.companyUserListTable.handleClearSelection();
        }
      );
      this.personDialogVisible = false;
    },
    // 解除关联
    handleRelateOff() {
      if (this.selectedUserIds.length == 0) {
        this.$message({
          message: '请选择人员再进行操作',
          type: 'warning'
        }
        );
        return;
      }
      this.$confirm('是否确定要解除选中人员与该风电场的关联关系?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const nodeUsers = [];
        this.selectedUserIds.map(item => {
          nodeUsers.push({
            userId: item
          });
        });
        this.$axios.post(
          Api.windFarmManage.disRelate,
          {
            data: {
              nodeId: this.checkedWindFarmId,
              nodeUsers
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message({
                message: '解除关联成功',
                type: 'success'
              });
              // 刷新与该角色关联的人员列表
              if (nodeUsers.length == this.tableData.length) {
                this.pagination.pages = 1;
              }
              this.getRelateUserList();
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              });
            }
            this.tableCheckBoxData = [];
            this.checkPersonIds = [];
          }
        );
      }).catch(() => {
        this.$refs.relateUserListTable.handleClearSelection();
      });
    },
    // 重置
    reset(formName) {
      this.dialogTitle = '默认标题';
      this.isEdit = false;
      this.isAdd = false;
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
#stationRole {
  .title {
    span {
      font-size: 18px;
      font-weight: bold;
    }
  }
  .main_left {
    width: 300px;
    border-right: 1px solid #ebedf0;
    .tit_btn {
      text-align: center;
    }
    .station_list {
      min-height: 580px;
      max-height: 750px;
      overflow-y: auto;
      font-size: 14px;
      padding: 10px 10px 0;
      li {
        padding: 10px 10px;
        cursor: pointer;
        border-top: 1px solid #f0f7ff;
        span {
          display: inline-block;
          width: 160px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      li:hover {
        background-color: #f2f3f5;
      }
      .active {
        background-color: #f0f7ff;
        color: #1890ff;
      }
    }
  }
  .main_right {
    width: calc(100% - 300px);
    min-height: 580px;
    max-height: 750px;
    overflow-y: auto;
    .operate_button {
      margin-left: 8px;
    }
    .info {
      text-align: center;
      color: #afaeae;
      padding-top: 160px;
      font-size: 16px;
    }
  }
}
.innerDialog {
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
