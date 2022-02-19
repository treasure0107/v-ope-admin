<!--
 * @Author: JTune
 * @Date: 2021-09-01 11:33:42
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-24 14:23:56
 * @Description: 组织架构结构树
-->
<template>
  <div class="main-left-tree">
    <h3 class="frameTitle">
      部门架构
    </h3>
    <el-tree
      class="framework-tree"
      :data="treeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
      :highlight-current="true"
      :expand-on-click-node="false"
      :indent="20"
      node-key="nodeId"
      empty-text="请新增部门"
      default-expand-all
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
      >
        <span>{{ node.label }}</span>
        <span class="span-tree-icons"  v-if="data && data.name !== '领导部门'">
          <el-popover
            style="width:10px;"
            placement="right"
            trigger="hover"
            class="tree-btn-popover"
          >
            <div style="width:100%;">
              <el-button
                size="small"
                type="text"
                v-if="data && data.type == 1"
                @click="openNodeDialog('departmentAdd', node)"
              >
                <i class="el-icon-circle-plus-outline"></i>
                <span style="color:#606266;">添加部门</span>
              </el-button>
            </div>
            <div style="width:100%;">
              <el-button
                size="small"
                type="text"
                @click="openNodeDialog('edit', node)"
              >
                <i class="el-icon-edit"></i>
                <span style="color:#606266;">编辑</span>
              </el-button>
            </div>
            <div style="width:100%;">
              <el-button
                size="small"
                type="text"
                @click="deleteNode(node)"
              >
                <i class="el-icon-delete"></i>
                <span style="color:#606266;">删除</span>
              </el-button>
            </div>
            <!-- <div style="width:100%;">
              <el-button
                v-permission="'/frameworkManage/info/frameworkSetting/addUp'"
                size="small"
                type="text"
                v-if="data && data.type == 1"
                @click="openNodeDialog('parentAdd', node)"
              >
                <i class="el-icon-caret-top"></i>
                <span style="color:#606266;">新建上级</span>
              </el-button>
            </div>
            <div style="width:100%;">
              <el-button
                v-permission="'/frameworkManage/info/frameworkSetting/addDown'"
                size="small"
                type="text"
                v-if="data && data.type == 1"
                @click="openNodeDialog('childrenAdd', node)"
              >
                <i class="el-icon-caret-bottom"></i>
                <span style="color:#606266;">新建下级</span>
              </el-button>
            </div> -->
            <el-button
              slot="reference"
              size="small"
              type="text"
            >
              <i class="el-icon-more"></i>
            </el-button>
          </el-popover>
        </span>
      </span>
    </el-tree>

    <!-- 新建上级，添加部门，编辑 -->
    <el-dialog
      :title="modifyDialogTitle"
      :visible.sync="nodeTreeDialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="nodeTreeForm"
        ref="nodeTreeForm"
        :rules="nodeTreeRules"
        label-width="100px"
      >
        <el-form-item
          label="名称："
          prop="name"
        >
          <el-input
            type="input"
            v-model="nodeTreeForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属组织："
          v-if="treeDataType != 'parentAdd'"
        >
          <!-- 放开 -->
          <div v-if="treeDataRow">{{ companyName }}</div>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="nodeTreeDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="modifynodeTree('nodeTreeForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from '@/api';
export default {
  name: '',
  components: {},
  props: {
    treeData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      companyName: '',
      modifyDialogTitle: '',
      treeDataRow: null,
      treeDataType: null, // edit,parentAdd,childrenAdd，departmentAdd
      // 树结构
      nodeTreeDialogVisible: false,
      nodeTreeForm: {
        name: ''
      },
      nodeTreeRules: {
        name: [
          { required: true, max: 64, message: '请输入名称', trigger: 'blur' }
        ]
      },

      defaultProps: {
        // 放开
        children: 'childrenList',
        // children: 'children',
        label(data) {
          return data.name;
        }
      }
    };
  },
  computed: {},
  watch: {
    treeData() {
      this.companyName = this.treeData[0].name;
    }
  },
  created() { },
  mounted() {
  },
  methods: {
    modifynodeTree(formName) {
      // 新建下级，添加部门，编辑部门提交修改
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          const dataParam = {};
          const tipTxt =
            this.treeDataType == 'edit'
              ? '编辑成功'
              : this.treeDataType == 'parentAdd'
                ? '新建上级成功'
                : '添加成功';
          let url = '';
          if (this.treeDataRow.type == 1) {
            // 公司
            const txt =
              this.treeDataType == 'departmentAdd' ? 'departmentName' : 'name'; // 针对公司在处理部门的时候要调用另外的接口
            // url = 'http://192.168.1.110:9085/userApi/company/save';
            // url = Api.frameworkInfo.saveCompanyFrameworkModify; // 放开
            dataParam[txt] = this.nodeTreeForm.name;

            // flag 为1 添加上级 为2 添加下级，编辑不需要传
            if (this.treeDataType == 'parentAdd') {
              // 添加公司上级
              url = Api.frameworkInfo.saveCompany;
              dataParam.flag = 1;
              dataParam.sonId = this.treeDataRow.id;
            } else if (this.treeDataType == 'childrenAdd') {
              // 添加公司下级
              url = Api.frameworkInfo.saveCompany;
              dataParam.flag = 2;
              dataParam.parentId = this.treeDataRow.id;
            } else if (this.treeDataType == 'edit') {
              // 编辑公司
              url = Api.frameworkInfo.saveCompany;
              dataParam.id = this.treeDataRow.id;
            }

            if (this.treeDataType == 'departmentAdd') {
              // 添加公司部门
              url = Api.frameworkInfo.saveDepartment;
              dataParam.relationId = this.treeDataRow.id;
              dataParam.type = 'company';
              dataParam.isShow = true;
            }
          } else if (this.treeDataRow.type == 2) {
            // 编辑公司下的部门
            url = Api.frameworkInfo.saveDepartment;
            dataParam.departmentName = this.nodeTreeForm.name;
            dataParam.isShow = true;
            if (this.treeDataType == 'edit') {
              dataParam.id = this.treeDataRow.id;
            }
          }

          this.$axios.post(
            url,
            // Api.drawings.saveCatalogue,
            {
              data: dataParam
            },
            res => {
              this.loading = false;
              if (res.isSuccess) {
                this.$message.success(tipTxt);
                if (this.nodeTreeForm.name != '') {
                  this.companyName = this.nodeTreeForm.name;
                }
                this.$emit('getDepartTree');
                this.$emit('getDeptList');
              } else {
                this.$message.error(res.message);
              }
            }
          );
          this.nodeTreeDialogVisible = false;
        } else {
          return false;
        }
      });
    },
    openNodeDialog(type, node) {
      this.modifyDialogTitle =
        type == 'edit'
          ? '编辑'
          : type == 'parentAdd'
            ? '新建上级'
            : type == 'departmentAdd'
              ? '添加部门'
              : '新建下级';
      this.resetForm('nodeTreeForm');
      this.nodeTreeDialogVisible = true;
      this.treeDataType = type;
      if (node) {
        this.treeDataRow = node.data;
      } else {
        this.treeDataRow = null;
      }
      if (type == 'edit') {
        this.nodeTreeForm = {
          name: this.treeDataRow.name
        };
      } else {
        this.nodeTreeForm.name = '';
      }
    },
    handleNodeClick(data, data2, data3) {
      this.treeDataRow = data;
      this.$emit('clickFrameworkTree', data);
    },
    // 重置表单
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    // 删除
    deleteNode(node) {
      this.$confirm('是否确定删除该部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          this.$axios.post(
            // node.data.type == '1' ? Api.frameworkInfo.deleteCompanyFramework : Api.frameworkInfo.deleteDepartment,
            Api.frameworkInfo.deleteDepartment,
            {
              data: {
                id: node.data.id
              }
            },
            res => {
              this.loading = false;
              if (res.isSuccess) {
                this.$message.success('删除成功');
                this.$emit('getDepartTree');
                this.$emit('getDeptList');
              } else {
                this.$message.error(res.message);
              }
            }
          );
        })
        .catch(() => { });
    }
  }
};
</script>
<style lang="scss" scoped>
.main-left-tree {
  height: 100%;
  width: 350px;
  overflow-y: auto;
  background: #fff;
  float: left;
  overflow: auto;
  .frameTitle {
    font-size: 18px;
  }
  .span-tree-icons {
    margin-left: 30px;
  }
  .framework-tree {
    height: 730px;
    overflow-y: auto;
    font-size: 14px;
    & ::v-deep .el-tree-node.is-current > .el-tree-node__content {
      background-color: #f0f7ff;
      color: #1890ff;
      &::after {
        position: absolute;
        content: "";
        width: 3px;
        height: 40px;
        background: #1890ff;
        top: 0px;
        right: 0px;
      }
    }
    & ::v-deep .el-tree-node__content {
      height: 40px;
      position: relative;
    }
    .custom-tree-node {
      position: relative;
      width: 100%;
      .span-tree-icons {
        position: absolute;
        right: 20px;
        top: -4px;
      }
    }
  }
  .tree-btn-popover ::v-depp .el-button {
    width: 100%;
    text-align: left;
  }
}
</style>
