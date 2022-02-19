<!--
 * @Author: JTune
 * @Date: 2021-09-01 11:07:09
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-22 11:40:08
 * @Description: 组织架构
-->

<template>
  <div class="outside-person-manage">
    <!-- <div v-if="showFlag"> -->
    <div class="container_lf">
      <div class="title">
        <span>厂商</span>
      </div>
      <ul class="factory_list">
        <li
          v-for="(item) in factoryList"
          :class="checkedFactoryId == item.id ? 'active' : ''"
          @click="handleClickFactory(item.id,item.relationId)"
          :key="item.id"
        >
          <span>{{item.departmentName}}</span>
        </li>
      </ul>
    </div>
    <div
      class="main-right-panel"
      v-if="checkedFactoryId"
    >
      <el-tabs v-model="activeTabName">
        <el-tab-pane
          label="人员信息"
          name="person"
        >
          <el-button
            @click="importAddPersonDialog"
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
          >添加人员
          </el-button>
          <el-button
            @click="importDepartment('person')"
            type="primary"
            size="small"
          >批量导入 </el-button>
          <el-button
            @click="updatePersonInfoSort"
            type="primary"
            size="small"
          >{{ personInfoSortTitle }}
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveRoleListResource"
          >批量授权
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deletePerson"
          >删除 </el-button>
          <div class="main-right-personTable">
            <dy-table
              maxTableHeight="600"
              :keys="personColKey"
              :fetchData="fetchData"
              :list="personInfoList"
              :multiActions="personColKeyActionis"
              :showCheckBox="true"
              :isDrag="personInfoIsDrag"
              @selectDataEvent="selectPersonsCheckBox"
              style="padding:0px;"
              ref="companyPersonInfoTable"
            >
            </dy-table>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="岗位信息"
          name="jobs"
        >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="importAddJobDialog"
          >添加岗位
          </el-button>
          <el-button
            @click="importDepartment('job')"
            type="primary"
            size="small"
          >批量导入 </el-button>
          <!-- <el-button>调整部门 </el-button> -->
          <el-button
            @click="updateJobsInfoSort"
            type="primary"
            size="small"
          >{{ jobsInfoSortTitle }}
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteDuty()"
          >删除 </el-button>
          <div class="main-right-personTable">
            <dy-table
              maxTableHeight="600"
              :keys="jobsColKey"
              :fetchData="fetchData"
              :list="jobsInfoList"
              :multiActions="jobsColKeyActions"
              :showCheckBox="true"
              :isDrag="jobsInfoIsDrag"
              @selectDataEvent="selectJobsCheckBox"
              style="padding:0px;"
              ref="companyJobsInfoTable"
            >
            </dy-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="main-right-panel"
      v-else
    >
      <div class="info">
        <div>
          <img :src="testPic">
        </div>
        <span>请选择厂商以进行操作~</span>
      </div>
    </div>
    <PersonDialog
      :visible.sync="addPersonDialogVisible"
      :personOperate.sync="personOperate"
      :checkedFactoryId="checkedFactoryId"
      :pickPersonItem="pickPersonItem"
      :factoryList="factoryList"
      :dutyList="jobsInfoList"
      :companyId="companyId"
      @getPersonInfoData="getPersonInfoData"
      @getJobsInfoData="getJobsInfoData"
    />
    <JobDialog
      :visible.sync="jobDialogVisible"
      :departmentId="checkedFactoryId"
      :jobOperate="jobOperate"
      :pickJobItem="pickJobItem"
      @getJobsInfoData="getJobsInfoData"
    />
    <AssignPermissions
      :visible.sync="AssignPermissionsVisible"
      :companyId="companyId"
      :userId="userId"
      :rolePermission="rolePermission"
      :rolePermissionName="rolePermissionName"
      :roleId="roleId"
      :departmentId="checkedFactoryId"
      :roleSaveType="roleSaveType"
      :checkedIds="checkPersonIds"
      @reGetPersonInfo="getPersonInfoData"
      @clearSelection="clearSelection"
    />
    <ImportDepartment
      :visible.sync="importDepartDialogVisible"
      :departmentId="checkedFactoryId"
      :importDialogTitle='importDialogTitle'
      @reGetPersonInfo="getPersonInfoData"
      @reGetDutyInfo="getJobsInfoData"
    />
  </div>
</template>

<script>
import Api from '@/api';
import Sortable from 'sortablejs';
// import { localstorageGet } from '@/utils/auth';
// 引入公共表单组件
import DyTable from '@/components/DyTable';
import ImportDepartment from '../frameworkSetting/components/ImportDepartment.vue';
import PersonDialog from './components/PersonDialog.vue';
import AssignPermissions from '../../components/AssignPermissions.vue';
import JobDialog from '../frameworkSetting/components/JobDialog.vue';

export default {
  name: '',
  components: {
    DyTable,
    ImportDepartment,
    PersonDialog,
    JobDialog,
    AssignPermissions
  },
  data() {
    return {
      testPic: require('@/assets/images/no_data.png'),
      AssignPermissionsVisible: false,
      // 分配权限类型
      roleSaveType: '', // 'single'单人 'multiple'批量
      // 分配权限的人员id
      userId: '',
      // 权限id--带入
      roleId: '',
      // 人员的权限--带入时
      rolePermission: [],
      // 权限名称--带入
      rolePermissionName: '',
      factoryList: [], // 厂商列表
      checkedFactoryId: '', // 厂商同名部门id
      companyId: '', // 厂商公司id
      personOperate: '',
      // 岗位操作的类型-create-edit-check
      jobOperate: '',
      // 批量导入对话框title
      importDialogTitle: '',
      // 选中的部门id传给子组件
      departmentId: '',
      // 获取到的部门列表传给子组件
      departmentOption: [],
      // 选中人员item传给子组件
      pickPersonItem: {},
      // 选中岗位item传给子组件
      pickJobItem: {},
      // 选中岗位的id--批量删除
      checkJobIds: [],
      // 选中人员的id--批量删除
      checkPersonIds: [],
      activeTabName: 'person',
      treeData: [],
      tableCheckBoxData: [],
      treeDataRow: {},
      loading: false,
      adjustDepartmentDialog: true,

      // 人员信息
      personColKey: {
        name: '姓名',
        dutyName: '岗位',
        roleName: '权限名称',
        phone: '手机号'
      },
      personColKeyActionis: [
        {
          header: '操作',
          actions: [
            {
              label: '查看',
              // permission: '/frameworkManage/info/frameworkSetting/viewPerson',
              action: row => {
                this.getPickPersonItem(row);
                this.addPersonDialogVisible = true;
                this.personOperate = 'check';
              },
              width: '230px'
            },
            {
              label: '更新资料',
              action: row => {
                this.getPickPersonItem(row);
                this.addPersonDialogVisible = true;
                this.personOperate = 'edit';
              }
            },
            {
              label: '分配权限',
              action: row => {
                this.getRolePermission(row);
                this.AssignPermissionsVisible = true;
                this.roleSaveType = 'single';
              }
            }
          ]
        }
      ],
      personInfoList: [],
      personInfoIsDrag: false,
      personInfoSortTitle: '调整顺序',
      personInfoDragObj: null,
      personCheckBoxData: {},
      // 岗位信息
      jobsColKey: {
        dutyName: '岗位名称',
        total: '岗位人数'
      },
      jobsColKeyActions: [
        {
          header: '操作',
          actions: [
            {
              label: '查看',
              action: row => {
                // 获取选中岗位信息
                this.jobOperate = 'check';
                this.getPickJobItem(row);
                this.jobDialogVisible = true;
              },
              width: '200px'
            },
            {
              label: '编辑',
              action: row => {
                // 获取选中岗位信息
                this.jobOperate = 'edit';
                this.getPickJobItem(row);
                this.jobDialogVisible = true;
              }
            }
          ]
        }
      ],
      jobsInfoList: [],
      jobsInfoIsDrag: false,
      jobsInfoDragObj: null,
      jobsCheckBoxData: [],
      importDepartDialogVisible: false,
      jobsInfoSortTitle: '调整顺序',
      addPersonDialogVisible: false,
      jobDialogVisible: false,
      showFlag: true
    };
  },
  computed: {},
  watch: {
  },
  created() { },
  mounted() {
    this.getFactoryList();
  },
  updated() {
  },
  methods: {
    // 获取厂商列表
    getFactoryList() {
      this.$axios.post(
        Api.factoryManage.getFactoryDeptList,
        {
          data: {
            companyType: 'COOPERATE_COMPANY'
          }
        },
        res => {
          if (res.isSuccess) {
            this.factoryList = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'danger'
            });
          }
        }
      );
    },
    // 点击厂商
    handleClickFactory(factoryId, companyId) {
      this.checkedFactoryId = factoryId;
      this.companyId = companyId;
      this.getPersonInfoData();
      this.getJobsInfoData();
    },
    createParent() {
      this.createParentDialogVisible = true;
    },
    // 选中人员
    selectPersonsCheckBox(data) {
      this.tableCheckBoxData = data;
      this.checkPersonIds = [];
      this.tableCheckBoxData.map((item) => {
        this.checkPersonIds.push(item.id);
      });
    },
    // 删除选中人员
    deletePerson() {
      if (!this.checkPersonIds.length) {
        this.$message({
          message: '请先选择人员！',
          type: 'warning'
        });
        return;
      }
      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          Api.frameworkInfo.deleteUserList,
          {
            data: {
              userIds: this.checkPersonIds
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              // 重新获取人员信息结构
              this.getPersonInfoData();
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              });
              this.$refs.companyPersonInfoTable.handleClearSelection();
            }
            this.tableCheckBoxData = [];
            this.checkPersonIds = [];
          }
        );
      }).catch(() => {
        this.$refs.companyPersonInfoTable.handleClearSelection();
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 批量授权
    saveRoleListResource() {
      if (!this.checkPersonIds.length) {
        this.$message({
          message: '请先选择人员！',
          type: 'warning'
        });
        return;
      }
      this.rolePermissionName = '';
      this.roleId = '';
      this.AssignPermissionsVisible = true;
      this.roleSaveType = 'multiple';
    },
    // 获取人员权限
    getRolePermission(row) {
      this.userId = row.id;
      this.$axios.post(
        Api.frameworkInfo.getRoleResource,
        {
          data: {
            userId: this.userId,
            departmentId: this.checkedFactoryId
          }
        },
        res => {
          if (res.isSuccess) {
            this.rolePermission = res.data;
            this.rolePermissionName = row.roleName;
            this.roleId = row.roleId;
          } else {
            this.rolePermissionName = '';
            this.roleId = '';
            return false;
          }
        }
      );
    },
    // 清除授权后的选中勾子
    clearSelection() {
      this.$refs.companyPersonInfoTable.handleClearSelection();
    },
    // 选中岗位
    selectJobsCheckBox(data) {
      this.tableCheckBoxData = data;
      this.checkJobIds = [];
      this.tableCheckBoxData.map((item) => {
        this.checkJobIds.push({
          id: item.id
        });
      });
      console.log(this.checkJobIds);
    },
    // 删除选中岗位
    deleteDuty() {
      if (!this.checkJobIds.length) {
        this.$message({
          message: '请先选择岗位！',
          type: 'warning'
        });
        return;
      }
      this.$confirm('是否确认执行该删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          Api.frameworkInfo.deleteDutyList,
          {
            data: {
              dutyVos: this.checkJobIds
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              // 重新获取岗位信息结构
              this.getJobsInfoData();
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              });
              this.$refs.companyJobsInfoTable.handleClearSelection();
            }
            this.tableCheckBoxData = [];
            this.checkJobIds = [];
          });
      }).catch(() => {
        this.$refs.companyJobsInfoTable.handleClearSelection();
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 获取人员信息表结构数据
    getPersonInfoData() {
      this.loading = true;
      if (!this.treeDataRow) return;
      this.$axios.post(
        Api.frameworkInfo.getUserList,
        {
          data: {
            departmentId: this.checkedFactoryId
          }
        },
        res => {
          this.loading = false;
          if (res.isSuccess) {
            this.personInfoList = res.data ? res.data : [];
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 获岗位信息表结构数据
    getJobsInfoData() {
      this.loading = true;
      if (!this.treeDataRow) return;
      this.$axios.post(
        Api.frameworkInfo.getDeptDutyList,
        {
          data: {
            departmentId: this.checkedFactoryId
          }
        },
        res => {
          this.loading = false;
          if (res.isSuccess) {
            this.jobsInfoList = res.data ? res.data : [];
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    dealSort() {
      // 处理sortable排序对象
      if (this.personInfoDragObj) {
        this.personInfoDragObj.destroy();
        this.personInfoDragObj = null;
        this.personInfoSortTitle = '调整顺序';
        this.personInfoIsDrag = false;
      }
      if (this.jobsInfoDragObj) {
        this.jobsInfoDragObj.destroy();
        this.jobsInfoDragObj = null;
        this.jobsInfoSortTitle = '调整顺序';
        this.jobsInfoIsDrag = false;
      }
      if (this.deptFunctionDragObj) {
        this.deptFunctionDragObj.destroy();
        this.deptFunctionDragObj = null;
        this.deptFunctionSortTitle = '调整顺序';
        this.deptFunctionInfoIsDrag = false;
      }
    },
    updatePersonInfoSort() {
      this.personInfoSortTitle = this.personInfoIsDrag
        ? '调整顺序'
        : '提交排序';
      this.personInfoIsDrag = !this.personInfoIsDrag;
      if (this.personInfoIsDrag) {
        this.sortablePersonInfoMethods(
          'companyPersonInfoTable',
          this.personInfoList
        );
      } else {
        const newArray = this.personInfoList.map((x, index) => {
          return {
            id: x.userDutyId,
            sort: index
          };
        });
        // 这里提交排序数组给后端
        this.$axios.post(
          Api.frameworkInfo.updatePersonSort,
          {
            data: {
              userDutyVos: newArray
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message.success('排序成功');
            } else {
              this.$message.error(res.message);
            }
          }
        );
      }
    },
    updateJobsInfoSort() {
      this.jobsInfoSortTitle = this.jobsInfoIsDrag ? '调整顺序' : '提交排序';
      this.jobsInfoIsDrag = !this.jobsInfoIsDrag;
      if (this.jobsInfoIsDrag) {
        this.sortableJobsInfoMethods('companyJobsInfoTable', this.jobsInfoList);
      } else {
        // 这里提交排序数组给后端
        const newArray = this.jobsInfoList.map((y, index) => {
          return {
            id: y.id,
            sort: index
          };
        });
        // 这里提交排序数组给后端
        this.$axios.post(
          Api.frameworkInfo.updateDutySort,
          {
            data: {
              dutyVos: newArray
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message.success('排序成功');
            } else {
              this.$message.error(res.message);
            }
          }
        );
      }
    },
    // 调整人员顺序
    sortablePersonInfoMethods(dom, dataArray) {
      // 获取表格row的父节点
      const ele = this.$refs[dom].$el.querySelector('.el-table__body > tbody');
      // 创建拖拽实例
      this.personInfoDragObj = Sortable.create(ele, {
        animation: 150, // 动画
        handle: '.sortable-move', // 指定拖拽目标，点击此目标才可拖拽元素(此例中设置操作按钮拖拽)
        dragClass: 'dragClass', // 设置拖拽样式类名
        ghostClass: 'ghostClass', // 设置拖拽停靠样式类名
        chosenClass: 'chosenClass', // 设置选中样式类名
        onUpdate: function (event) {
          var newIndex = event.newIndex;
          var oldIndex = event.oldIndex;
          var $newItem = ele.children[newIndex];
          var $oldItem = ele.children[oldIndex];
          // 先还原sotable拖拽
          ele.removeChild($newItem);
          if (newIndex > oldIndex) {
            ele.insertBefore($newItem, $oldItem);
          } else {
            ele.insertBefore($newItem, $oldItem.nextSibling);
          }

          var item = dataArray.splice(oldIndex, 1);
          dataArray.splice(newIndex, 0, item[0]);
        }
      });
    },
    // 调整岗位顺序
    sortableJobsInfoMethods(dom, dataArray) {
      // 获取表格row的父节点
      const ele = this.$refs[dom].$el.querySelector('.el-table__body > tbody');
      // 创建拖拽实例
      this.jobsInfoDragObj = Sortable.create(ele, {
        animation: 150, // 动画
        handle: '.sortable-move', // 指定拖拽目标，点击此目标才可拖拽元素(此例中设置操作按钮拖拽)
        dragClass: 'dragClass', // 设置拖拽样式类名
        ghostClass: 'ghostClass', // 设置拖拽停靠样式类名
        chosenClass: 'chosenClass', // 设置选中样式类名
        onUpdate: function (event) {
          var newIndex = event.newIndex;
          var oldIndex = event.oldIndex;
          var $newItem = ele.children[newIndex];
          var $oldItem = ele.children[oldIndex];
          // 先还原sotable拖拽
          ele.removeChild($newItem);
          if (newIndex > oldIndex) {
            ele.insertBefore($newItem, $oldItem);
          } else {
            ele.insertBefore($newItem, $oldItem.nextSibling);
          }

          var item = dataArray.splice(oldIndex, 1);
          dataArray.splice(newIndex, 0, item[0]);
        }
      });
    },
    // 获取选中人员的人员信息
    getPickPersonItem(row) {
      this.$axios.post(
        Api.frameworkInfo.getUserDetail,
        {
          data: {
            id: row.id,
            flag: 'company'
          }
        },
        res => {
          this.pickPersonItem = res.data;
        }
      );
    },
    // 获取选中岗位的岗位信息
    getPickJobItem(row) {
      this.$axios.post(
        Api.frameworkInfo.getDutyDetail,
        {
          data: {
            id: row.id
          }
        },
        res => {
          this.pickJobItem = res.data;
        }
      );
    },
    importDepartment(params) {
      if (params == 'person') {
        this.importDialogTitle = '批量导入人员';
      } else {
        this.importDialogTitle = '批量导入岗位';
      }
      this.importDepartDialogVisible = true;
    },
    // 点击添加人员
    importAddPersonDialog() {
      this.addPersonDialogVisible = true;
      this.personOperate = 'create';
    },
    // 点击添加岗位
    importAddJobDialog() {
      this.jobOperate = 'create';
      this.jobDialogVisible = true;
    },
    fetchData() {
      this.personInfoList = [];
      this.jobsInfoList = [];
    },
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.outside-person-manage {
  min-height: 750px;
  height: 100%;
  cursor: default;
  .container_lf {
    float: left;
    width: 300px;
    .title {
      span {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .factory_list {
      height: 740px;
      overflow-y: auto;
      font-size: 14px;
      margin-top: 10px;
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
  .main-right-panel {
    margin-left: 180px;
    border-left: 2px solid #e4e7ed;
    min-height: 770px;
    height: 100%;
    overflow-y: auto;
    padding-left: 10px;
    background-color: #fff;
    .info {
      text-align: center;
      color: #afaeae;
      padding-top: 160px;
      font-size: 16px;
    }
    .main-right-personTable {
      overflow: hidden;
    }
  }
}
.factory_list::-webkit-scrollbar {
  width: 6px;
}
.factory_list::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
.factory_list::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}
::v-deep .el-dialog.is-fullscreen {
  width: 95%;
  height: 95%;
  margin: 20px auto;
}
</style>
