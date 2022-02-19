<!--
 * @Author: JTune
 * @Date: 2021-08-13
 * @LastEditTime: 2021-12-29 17:03:43
 * @LastEditors: JTune
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\roleManagement\index.vue
-->
<template>
  <div>
    <div id="roleManage">
      <div class="main_left fl">
        <div class="tit_btn">
          <el-button
            type="primary"
            size="small"
            @click="handleAddRole"
          >新增角色</el-button>
        </div>
        <ul class="role_list">
          <li
            v-for="(item,index) in roleList"
            :class="checkedRoleId == item.id ? 'active' : ''"
            @click="handleSelectRole(index)"
            :key="item.id"
          >
            <div>
              <!-- <el-tooltip
                class="item"
                effect="light"
                :content="item.name"
                placement="top-start"
              >
              </el-tooltip> -->
                <div>{{item.name}}</div>
            </div>
            <!-- <span>{{item.name}}</span> -->
            <div>
              <el-button
                type="text"
                @click="handleEditRole(index)"
              >编辑</el-button>
              <el-button
                type="text"
                @click="handleDelRole(index)"
                style="color: #f56c6c"
              >删除</el-button>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="main_right fl"
        v-if="checkedRoleId"
      >
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
          </div>
          请选择角色以进行操作~
        </div>
      </div>
      <!-- 角色弹窗 -->
      <DyDialog
        :visible="roleDialogVisible"
        width="500px"
        :dialogTitle="dialogTitle"
        @cancelDialogPopup="closeRoleDialogPopup('roleForm')"
        @closeDialogPopup="closeRoleDialogPopup('roleForm')"
        @sureDialogPopup="sureRoleDialogPopup('roleForm')"
      >
        <div>
          <el-form
            :model="roleForm"
            :rules="roleRules"
            ref="roleForm"
          >
            <el-form-item
              label="角色名称："
              :label-width="formLabelWidth"
              prop="roleName"
            >
              <el-input
                v-model.trim="roleForm.roleName"
                maxlength="20"
                placeholder="请输入角色名称"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </DyDialog>
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
              placeholder="请输入查找人姓名"
              clearable
              @keyup.enter.native="innerFetchData"
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
      checkedRoleId: '', // 选中的角色id
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
        phone: '电话',
        flag: '所属组织'
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
      roleList: [],
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
    checkedRoleId() {
      this.getRoleUserList();
    }
  },
  created() { },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 添加角色
    handleAddRole() {
      this.isAdd = true;
      this.isEdit = false;
      this.setDialogTitle('role');
      this.roleDialogVisible = true;
    },
    // 确认添加--编辑角色
    sureRoleDialogPopup(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const url = this.isAdd ? Api.roleManage.saveRole : Api.roleManage.updateRole;
          const data = {
            name: this.roleForm.roleName
          };
          if (this.isEdit) data.id = this.checkedRoleId;
          this.$axios.post(
            url,
            {
              data
            },
            res => {
              // 添加或者编辑成功执行重新查询列表的回调
              if (res.isSuccess) {
                this.getRoleList();
                this.roleDialogVisible = false;
                this.reset(formName);
              } else {
                this.$message.error(res.message);
              }
            }
          );
        } else {
          this.$message.error('缺少必填的数据或数据格式不正确,提交失败!');
        }
      });
    },
    // 编辑角色
    handleEditRole(index) {
      this.isAdd = false;
      this.isEdit = true;
      this.roleForm.roleName = this.roleList[index].name;
      this.setDialogTitle('role');
      this.roleDialogVisible = true;
    },
    // 删除角色
    handleDelRole(index) {
      if (this.tableData.length) {
        this.$message({
          message: '该角色下存在已关联人员，不支持此操作',
          type: 'warning'
        });
        return;
      }
      this.$confirm('此操作不可恢复, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = [];
        ids.push(this.roleList[index].id);
        this.$axios.post(
          Api.roleManage.deleteRole,
          {
            data: {},
            ids
          },
          res => {
            if (res.isSuccess) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              // 重新获取人员信息结构
              this.getRoleList();
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              });
            }
          }
        );
      });
    },
    // 选择角色
    handleSelectRole(index) {
      this.checkedRoleId = this.roleList[index].id;
      this.checkedRoleName = this.roleList[index].name;
    },
    // 获取角色列表
    getRoleList() {
      this.$axios.post(
        Api.roleManage.getRoleList,
        {
          data: {
            customerCode: this.$store.state.user.customerCode
          }
        },
        res => {
          if (res.isSuccess) {
            this.roleList = res.data;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 添加人员
    handleAddPerson() {
      this.isAdd = true;
      this.isEdit = false;
      this.setDialogTitle('person');
      this.personDialogVisible = true;
    },
    fetchData() {
      this.getRoleUserList();
    },
    // 获取角色人员表格数据
    getRoleUserList() {
      this.$axios.post(
        Api.roleManage.getRoleUserList,
        {
          data: {
            flowRoleId: this.checkedRoleId
          },
          pagination: true,
          pages: this.pagination.pages,
          size: this.pagination.size
        },
        res => {
          if (res.isSuccess) {
            this.tableData = [];
            res.data.map((item, index) => {
              if (item.userVo) {
                this.tableData.push(item.userVo);
                this.tableData[index].relavanceId = item.id;
              }
            });
            this.pagination.total = res.total;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 获取添加人员表格数据-平台人员列表
    innerFetchData() {
      this.$axios.post(
        Api.roleManage.getCompanyUser,
        {
          data: {
            name: this.searchKey,
            companyId: localstorageGet('companyId')
          },
          // platformCode: this.$store.state.user.platformCode,
          pagination: true,
          pages: this.innerPagination.pages,
          size: this.innerPagination.size
        },
        res => {
          if (res.isSuccess) {
            this.innerTableData = res.data.dataList;
            this.innerPagination.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 人员表格--选择角色人员表格数据
    selectDataEvent(val) {
      this.selectedUserIds = [];
      val.map(item => {
        this.selectedUserIds.push(item.relavanceId);
      });
    },
    // 添加人员弹窗--选择公司人员表格数据
    innerSelectDataEvent(val) {
      this.selectedUserIds = [];
      val.map(item => {
        this.selectedUserIds.push(item.id);
      });
    },
    // 关闭角色弹框dialog
    closeRoleDialogPopup(formName) {
      this.roleDialogVisible = false;
      this.reset(formName);
    },
    // 关闭人员弹窗
    closePersonDialogPopup() {
      this.personDialogVisible = false;
      this.$refs.companyUserListTable.handleClearSelection();
    },
    // 确认添加人员至角色
    surePersonDialogPopup() {
      if (!this.selectedUserIds.length) {
        this.$message.warning('请先选择人员');
        return;
      }
      this.$axios.post(
        Api.roleManage.relateUser,
        {
          data: {},
          userIdList: this.selectedUserIds,
          flowRoleId: this.checkedRoleId
        },
        res => {
          if (res.isSuccess) {
            this.getRoleUserList();
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
      this.$confirm('是否确定要解除选中人员与角色的关联关系?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          Api.roleManage.offRelateRole,
          {
            data: {},
            ids: this.selectedUserIds
          },
          res => {
            if (res.isSuccess) {
              this.$message({
                message: '解除关联成功',
                type: 'success'
              });
              // 重新与该角色关联的人员列表
              this.getRoleUserList();
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
    // 弹窗标题
    setDialogTitle(params) {
      if (this.isAdd) {
        this.dialogTitle = params == 'person' ? '添加人员' : '添加角色';
      } else if (this.isEdit) {
        this.dialogTitle = params == 'person' ? '编辑人员信息' : '编辑角色信息';
      }
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
#roleManage {
  .main_left {
    width: 350px;
    min-height: 580px;
    max-height: 100%;
    border-right: 1px solid #ebedf0;
    .tit_btn {
      text-align: center;
    }
    .role_list {
      height: 740px;
      overflow-y: auto;
      font-size: 14px;
      padding: 0 10px;
      margin-top: 10px;
      li {
        height: 40px;
        line-height: 40px;
        padding: 0 5px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        border-top: 1px solid #f2f3f5;
        .el-button {
          visibility: hidden;
        }
        span {
          display: inline-block;
          width: 240px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      li:hover {
        background-color: #f2f3f5;
      }
      .active {
        background-color: #f2f3f5;
        .el-button {
          visibility: visible;
        }
      }
    }
  }
  .main_right {
    width: calc(100% - 350px);
    height: 740px;
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
.role_list::-webkit-scrollbar {
  width: 6px;
}
.role_list::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
.role_list::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}
.innerDialog {
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
