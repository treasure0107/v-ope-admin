<!--  -->
<template>
  <div>
    <el-dialog
      title="权限设置"
      width="690px"
      :visible="visible"
      :close-on-click-modal="false"
      @close="handleClose('permissionForm')"
    >
      <el-form
        ref="permissionForm"
        :model="permissionForm"
        style="display:block;height:60px"
      >
        <el-col :span="13">
          <el-form-item
            label="权限名称:"
            prop="permissionName"
            :rules="{
              required: true,
              trigger:'blur',
              message:'请输入权限名称'
            }"
          >
            <el-input
              v-model.trim="permissionForm.permissionName"
              placeholder="请输入权限名称"
              style="width:220px;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-select
            placeholder="请选择权限集"
            v-model="permissionForm.permissionUnionId"
            @change="getRolePermissionUnion(permissionForm.permissionUnionId)"
          >
            <el-option
              v-for="(union,uIndex) in permissionUnionList"
              :key="uIndex"
              :label="union.roleName"
              :value="union.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-form>
      <!-- 权限列表 -->
      <div style="max-height:500px;overflow-y:auto;width: 100%;">
        <el-tree
          ref="displayTree"
          style="height:100%;"
          :data="displayTreeResourceList"
          show-checkbox
          node-key="id"
          :default-expand-all="true"
          highlight-current
          @check="handleCheckPermission"
          :props="defaultProps"
        >
        </el-tree>
      </div>
      <span slot="footer">
        <el-button @click="handleClose('permissionForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="postPermissionSet('permissionForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api';
import { localstorageGet } from '@/utils/auth';
export default {
  name: '',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roleSaveType: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    companyId: {
      type: String,
      default: ''
    },
    departmentId: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    },
    checkedIds: {
      type: Array,
      default: () => {
        return [];
      }
    },
    rolePermission: {
      type: Array,
      default: () => {
        return [];
      }
    },
    rolePermissionName: {
      type: String,
      default: ''
    },
    roleId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      permissionForm: {
        permissionName: '',
        permissionUnionId: ''
      },
      // 权限集列表
      permissionUnionList: null,
      // 最后选中的权限
      checkedPermission: [],
      // 暂存权限集中的权限
      tempRightClickData: [],
      displayTreeResourceList: null,
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      }

    };
  },
  computed: {},
  watch: {
    visible() {
      if (this.visible) {
        this.permissionForm.permissionName = this.rolePermissionName;
      } else {
        this.resetForm('permissionForm');
      }
    },
    rolePermission() {
      if (this.rolePermission) {
        this.rolePermission.map((item) => {
          this.checkRolePermission(item);
        });
      } else {
        return false;
      }
    },
    rolePermissionName() {
      this.permissionForm.permissionName = this.rolePermissionName;
    }
  },
  created() {
  },
  mounted() {
    this.getResourceTree();
    this.getPermissionUnionList();
  },
  methods: {
    handleCheckPermission(data, checked) {
      const halfCheckData = this.$refs.displayTree.getHalfCheckedKeys();
      const allCheckedKeys = checked.checkedKeys.concat(halfCheckData);
      this.checkedPermission = [];
      allCheckedKeys.map(item => {
        this.checkedPermission.push({ resourceId: item });
      });
    },
    /*
        递归--匹配勾选查询到的人员权限
    */
    checkRolePermission(permission) {
      this.$refs.displayTree.setChecked(permission.id, true, false);
      this.checkedPermission.push({ resourceId: permission.id });
      if (permission.resourcesVoList) {
        permission.resourcesVoList.map((vitem) => {
          this.$refs.displayTree.setChecked(vitem.id, true, false);
          this.checkedPermission.push({ resourceId: vitem.id });
          // this.checkRolePermission(vitem);
        });
      }
      if (permission.children) {
        permission.children.map(childItem => {
          this.checkRolePermission(childItem);
        });
      }
    },
    /*
        获取权限资源树
    */
    getResourceTree() {
      this.$axios.post(
        Api.frameworkInfo.getResourceTree,
        {
          data: {
            category: '1', // 1==平台--2==项目部
            platformCode: '400001'
          },
          flag: '1'
        },
        res => {
          if (res.isSuccess) {
            this.test = res.data || [];
            this.displayTreeResourceList = this.test;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    /*
        获取权限集下拉列表
    */
    getPermissionUnionList() {
      this.$axios.post(
        Api.permissionSet.getList,
        {
          data: {
            roleTemplateType: 'company_role_template' // company_role_template平台模板
          }
        },
        res => {
          if (res.isSuccess) {
            this.permissionUnionList = res.data;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    /*
        获取权限集权限
    */
    getRolePermissionUnion(unionId) {
      this.liIsActive = unionId;
      this.checkedPermission = [];
      this.$refs.displayTree.setCheckedKeys([]);
      this.$axios.post(
        Api.permissionSet.findById,
        {
          data: {
            id: this.liIsActive
          }
        },
        res => {
          if (res.isSuccess) {
            this.tempRightClickData = res.data.resources;
            this.cancelEdit();
          } else {
            this.$message.error(res.message);
          }
        }
      );
      unionId == '1' ? this.edit([{ id: 61 }, { id: 110 }, { id: 112 }]) : this.edit([{ id: 150 }, { id: 152 }]);
    },
    /*
         取消已选中--替换成权限集
    */
    cancelEdit() {
      this.$refs.displayTree.setCheckedKeys([]);
      const temp = this.tempRightClickData;
      this.edit(temp);
    },
    /*
        勾选权限集的状态
    */
    edit(val) {
      this.checkedPermission = [];
      this.$nextTick(() => {
        val.map(item => {
          this.$refs.displayTree.setChecked(item.id, true, false);
          this.checkedPermission.push({ resourceId: item.id });
        });
      });
    },

    /* 关闭对话框 */
    handleClose(formName) {
      this.$emit('update:visible', false);
      this.$emit('clearSelection');
      this.checkedPermission = [];
      this.$refs.displayTree.setCheckedKeys([]);
      this.permissionForm.permissionUnionId = '';
      this.resetForm(formName);
    },
    /*
        点击确定提交分配权限
    */
    postPermissionSet(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.checkedPermission.length) {
            this.$message.error('尚未选择权限');
            return;
          }
          const myRoleType = 'SYSTEM_SET_ROLE';
          const dataList = [];
          let postPermissionUrl = '';
          const data = {
            departmentId: this.departmentId,
            roleResourcesVoList: this.checkedPermission
          };
          if (this.roleSaveType == 'single') {
            postPermissionUrl = Api.frameworkInfo.saveRoleResource;
            data.id = this.roleId;
            data.userId = this.userId;
            data.roleName = this.permissionForm.permissionName;
            data.roleType = myRoleType;
            data.companyId = this.companyId;
          } else {
            // 批量授权
            postPermissionUrl = Api.frameworkInfo.saveRoleListResource;
            this.checkedIds.map(item => {
              dataList.push({
                roleName: this.permissionForm.permissionName,
                roleType: myRoleType,
                companyId: this.companyId,
                userId: item
              });
            });
          }
          this.$axios.post(
            postPermissionUrl,
            {
              data,
              dataList
            },
            res => {
              if (res.isSuccess) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.$emit('reGetPersonInfo');
                this.handleClose('permissionForm');
                // 如果操作的是用户本人的权限，需要刷新页面才能开放修改的权限
                if (this.userId == localstorageGet('userId')) {
                  location.reload();
                }
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                });
                this.handleClose('permissionForm');
              }
            }
          );
        }
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
<style lang='scss' scoped>
* {
  user-select: none;
}
.permission-tmp {
  position: absolute;
  right: 20px;
  z-index: 1;
  // height:0px;
  // width:200px
}
::v-deep .el-table__body tr:hover > td {
  background-color: #fff;
}
::v-deep body {
  user-select: none !important;
}
::v-deep .el-table th > .cell {
  font-size: 15px;
  color: #000;
}
::v-deep .tabsss .el-tabs__header {
  margin: 0 0 0px !important;
}
</style>
