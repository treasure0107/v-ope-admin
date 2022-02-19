<!--
 * @Author: JTune
 * @Date: 2021-09-01 11:07:09
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-24 14:25:16
 * @Description: 组织架构
-->

<template>
  <div class="framework-manage-setting-container">
    <!-- <div v-if="showFlag"> -->
    <FrameworkTreeSet
      :treeData="treeData"
      @clickFrameworkTree="clickFrameworkTree"
      @getDepartTree="getDepartTree"
      @getDeptList="getDeptList"
    />
    <div class="main-right-panel">
      <el-tabs
        v-model="activeTabName"
        v-if="treeDataRow && treeDataRow.type == 2"
      >
        <!-- 放开 -->
        <!-- v-if="treeDataRow && treeDataRow.type == 2" -->
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
            @click="openAdjustDepartDialog"
            type="primary"
            size="small"
          >调整部门 </el-button>
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
              :fetchData="getPersonInfoData"
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
            @click="importDepartment('duty')"
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
              :fetchData="getJobsInfoData"
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
        <el-tab-pane
          label="部门职能"
          name="deptFunction"
        >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="importDeptFunctionDialog"
          >添加职能
          </el-button>
          <el-button
            @click="updateDeptFunctionInfoSort"
            type="primary"
            size="small"
          >{{deptFunctionSortTitle}}
          </el-button>
          <div>
            <dy-table
              maxTableHeight="600"
              :keys="deptFunctionColKey"
              :fetchData="getDeptFunctionInfoData"
              :list="deptFunctionInfoList"
              :multiActions="deptFunctionColKeyActions"
              :isDrag="deptFunctionInfoIsDrag"
              style="padding:0px;"
              ref="companyDeptFunctionInfoTable"
            >
            </dy-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <PersonDialog
      :visible.sync="addPersonDialogVisible"
      :personOperate.sync="personOperate"
      :departmentId="departmentId"
      :departmentOption="departmentOption"
      :companyId="companyId"
      :pickPersonItem="pickPersonItem"
      @getPersonInfoData="getPersonInfoData"
    />
    <JobDialog
      :visible.sync="jobDialogVisible"
      :departmentId="departmentId"
      :jobOperate="jobOperate"
      :pickJobItem="pickJobItem"
      @getJobsInfoData="getJobsInfoData"
    />
    <ImportDepartment
      :visible.sync="importDepartDialogVisible"
      :departmentId="departmentId"
      :importContainer='importContainer'
      @reGetPersonInfo="getPersonInfoData"
      @reGetDutyInfo="getJobsInfoData"
    />
    <AdjustDepartment
      :visible.sync="AdjustDepartmentVisible"
      :treeData="treeData"
      :selectRow="personCheckBoxData"
      @reGetPersonInfo="getPersonInfoData"
      @reGetDutyInfo="getJobsInfoData"
    />
    <AssignPermissions
      :visible.sync="AssignPermissionsVisible"
      :companyId="companyId"
      :userId="userId"
      :rolePermission="rolePermission"
      :rolePermissionName="rolePermissionName"
      :roleId="roleId"
      :departmentId="departmentId"
      :roleSaveType="roleSaveType"
      :checkedIds="checkPersonIds"
      @reGetPersonInfo="getPersonInfoData"
      @clearSelection="clearSelection"
    />
    <DeptFunction
      :visible.sync="deptFuncVisible"
      :deptFuncTitle="deptFuncTitle"
      :deptFuncName="deptFuncName"
      :functionId="functionId"
      :departmentId="departmentId"
      @getDeptFunctionInfoData="getDeptFunctionInfoData"
    />
  </div>
</template>

<script>
import Api from '@/api';
import Sortable from 'sortablejs';
import { localstorageGet } from '@/utils/auth';
// 引入公共表单组件
import DyTable from '@/components/DyTable';
import FrameworkTreeSet from './components/FrameworkTreeSet';
import ImportDepartment from './components/ImportDepartment.vue';
import AdjustDepartment from './components/AdjustDepartment';
import PersonDialog from './components/PersonDialog.vue';
import JobDialog from './components/JobDialog.vue';
import AssignPermissions from '../../components/AssignPermissions';
import DeptFunction from '../../components/DeptFunction.vue';

export default {
  name: '',
  components: {
    DyTable,
    FrameworkTreeSet,
    ImportDepartment,
    AssignPermissions,
    DeptFunction,
    PersonDialog,
    JobDialog,
    AdjustDepartment
  },
  data() {
    return {
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
      // 人员操作的类型-create-edit-check
      personOperate: '',
      // 岗位操作的类型-create-edit-check
      jobOperate: '',
      // 批量导入内容
      importContainer: '',
      // 选中的部门id传给子组件
      departmentId: '',
      // 获取到的部门列表传给子组件
      departmentOption: [],
      // 选中的部门的所属公司id传给添加人员子组件
      companyId: '',
      // 选中人员item传给子组件
      pickPersonItem: {},
      // 选中岗位item传给子组件
      pickJobItem: {},
      // 选中岗位的id--批量删除
      checkJobIds: [],
      // 选中人员的id--批量删除/批量授权
      checkPersonIds: [],
      // drawingTableActiveRow: null,
      AssignPermissionsVisible: false,
      AdjustDepartmentVisible: false,
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
        roleName: '权限',
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
      showFlag: true,
      // 部门职能
      deptFunctionSortTitle: '调整顺序',
      deptFunctionDragObj: null,
      deptFuncVisible: false,
      deptFuncTitle: '添加部门职能',
      deptFuncName: '', // 编辑时传给子组件
      functionId: '', // 编辑时传给子组件
      deptFunctionColKey: {
        functionContent: '职能名称'
      },
      deptFunctionColKeyActions: [
        {
          header: '操作',
          actions: [
            {
              label: '编辑',
              action: row => {
                this.deptFuncVisible = true;
                this.deptFuncTitle = '修改职能名称';
                this.deptFuncName = row.functionContent;
                this.functionId = row.id;
              }
            },
            {
              label: '删除',
              action: row => {
                this.deleteDeptFunction(row.id);
              }
            }
          ]
        }
      ],
      deptFunctionInfoList: [],
      deptFunctionInfoIsDrag: false
    };
  },
  computed: {},
  watch: {
    $route: {
      handler: function (route) {
        if (route.name == 'FrameworkSetting') {
          this.showFlag = true;
        } else {
          this.showFlag = false;
        }
      },
      immediate: true
    }
  },
  created() { },
  mounted() {
    this.companyId = localstorageGet('companyId');
    this.getDepartTree();
    this.getDeptList();
  },
  updated() {
  },
  methods: {
    openAdjustDepartDialog() {
      if (this.tableCheckBoxData.length > 1) {
        this.$message.warning('只能选择一个进行操作！');
        this.$refs.companyPersonInfoTable.handleClearSelection();
        return;
      } else if (this.tableCheckBoxData.length == 0) {
        this.$message.warning('请先选择人员！');
        return;
      }
      this.personCheckBoxData = this.tableCheckBoxData[0];
      this.AdjustDepartmentVisible = true;
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
    // 清除授权后的选中勾子
    clearSelection() {
      this.$refs.companyPersonInfoTable.handleClearSelection();
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
    // 选中岗位
    selectJobsCheckBox(data) {
      this.tableCheckBoxData = data;
      this.checkJobIds = [];
      this.tableCheckBoxData.map((item) => {
        this.checkJobIds.push({
          id: item.id
        });
      });
    },
    // 删除选中岗位
    deleteDuty() {
      if (this.checkJobIds.length == 0) {
        this.$message({
          message: '请选择要删除的岗位',
          type: 'warning'
        }
        );
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
    // 获取左侧树形结构数据
    getDepartTree() {
      this.loading = true;
      this.$axios.post(
        Api.frameworkInfo.getDepartTree,
        {
          data: {
            id: this.companyId, // 公司id
            flag: '2' // 公司-部门-岗位 flag为1, 公司-部门 flag2
          }
        },
        res => {
          this.loading = false;
          if (res.isSuccess) {
            this.treeData = res.data;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 获取公司下部门列表信息传给personDialog子组件
    getDeptList() {
      // 结构树中添加部门或编辑部门后触发此事件重新传给子组件
      this.$axios.post(
        Api.frameworkInfo.getDeptList,
        {
          data: {
            relationId: this.companyId,
            type: 'company'
          }
        },
        res => {
          if (res.isSuccess) {
            this.departmentOption = res.data;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    clickFrameworkTree(data) {
      this.treeDataRow = data;
      this.departmentId = this.treeDataRow.id;
      if (data.type == '2') {
        this.companyId = this.treeDataRow.parentId;
        this.getPersonInfoData();
        this.getJobsInfoData();
        this.getDeptFunctionInfoData();
        this.getDeptList();
        this.dealSort();
      } else if (data.type == '1') {
        this.companyId = this.treeDataRow.id;
        this.getDeptList();
      }
    },

    // 获取人员信息表结构数据
    getPersonInfoData() {
      this.loading = true;
      if (!this.treeDataRow) return;
      this.$axios.post(
        Api.frameworkInfo.getUserList,
        {
          data: {
            departmentId: this.departmentId
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
            departmentId: this.departmentId
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
    // 获取部门职能列表数据
    getDeptFunctionInfoData() {
      this.loading = true;
      if (!this.treeDataRow) return;
      this.$axios.post(
        Api.frameworkInfo.getDeptFuncList,
        {
          data: {
            departmentId: this.departmentId
          }
        },
        res => {
          this.loading = false;
          if (res.isSuccess) {
            this.deptFunctionInfoList = res.data ? res.data : [];
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
    // 提交部门职能排序
    updateDeptFunctionInfoSort() {
      this.deptFunctionSortTitle = this.deptFunctionInfoIsDrag
        ? '调整顺序'
        : '提交排序';
      this.deptFunctionInfoIsDrag = !this.deptFunctionInfoIsDrag;
      if (this.deptFunctionInfoIsDrag) {
        this.sortableDeptFuncMethods('companyDeptFunctionInfoTable', this.deptFunctionInfoList);
      } else {
        const newArray = this.deptFunctionInfoList.map((item, index) => {
          return {
            id: item.id,
            sort: index
          };
        });
        // 提交
        this.$axios.post(
          Api.frameworkInfo.updateDeptFuncSort,
          {
            data: {
              departmentFunctionVoList: newArray
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message.success('提交成功');
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
    // 调整职能顺序
    sortableDeptFuncMethods(dom, dataArray) {
      // 获取表格row的父节点
      const ele = this.$refs[dom].$el.querySelector('.el-table__body > tbody');
      // 创建拖拽实例
      this.deptFunctionDragObj = Sortable.create(ele, {
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
    // 获取人员权限
    getRolePermission(row) {
      this.userId = row.id;
      this.$axios.post(
        Api.frameworkInfo.getRoleResource,
        {
          data: {
            userId: this.userId,
            departmentId: this.departmentId
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
            return null;
          }
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
        this.importContainer = 'person';
      } else {
        this.importContainer = 'duty';
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
    // 点击添加部门职能
    importDeptFunctionDialog() {
      this.deptFuncVisible = true;
      this.deptFuncTitle = '添加部门职能';
      this.deptFuncName = '';
      this.functionId = '';
    },
    // 点击删除部门职能
    deleteDeptFunction(functionId) {
      this.$confirm('即将要删除该职能, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          Api.frameworkInfo.deleteDeptFunction,
          {
            data: {
              id: functionId
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getDeptFunctionInfoData();
            } else {
              this.$message.error(res.message);
            }
          }
        );
      }).catch(() => {
      });
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
.framework-manage-setting-container {
  min-height: 750px;
  height: 100%;
  cursor: default;

  .main-right-panel {
    // margin-left: 180px;
    border-left: 2px solid #e4e7ed;
    min-height: 750px;
    height: 100%;
    overflow-y: auto;
    padding-left: 10px;
    background-color: #fff;
    // background-color: #f0f3f5;
    .main-right-personTable {
      // padding: 5px 20px;
      overflow: hidden;
      // margin-top: 10px;
    }
  }
}
::v-deep .el-dialog.is-fullscreen {
  width: 95%;
  height: 95%;
  margin: 20px auto;
}
</style>
