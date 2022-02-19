<template>
  <div class="container">
    <el-container style="height:747px;">
      <!-- 左侧边栏区  权限集列表 -->
      <el-aside width="150px">
        <strong class="asideheader" style="font-size:medium">权限集
          <i
            class='el-icon-circle-plus'
            title="新增权限集"
            @click="addRightClick"
          ></i>
        </strong>
        <ul style="list-style：none;">
          <li
            :class="{'activeLi': item.id == liIsActive}"
            v-for="(item,index) in rightsSet"
            :key="index"
            @click.stop="rightsListChange(item)"
          >{{item.roleName || '""'}}
            <!-- 修改名称或删除目录弹出  -->
            <el-popover
              style="width:10px;float:right;margin-right: 10px;"
              placement="right"
              ref='popoverRef'
              trigger="click"
            >
              <div>
                <el-button
                  size="small"
                  type="text"
                  @click="handleEditOrDelete('edit',item)"
                >
                  <i class="el-icon-edit"></i>
                  <span style="color:#606266;">修改名称</span>
                </el-button>
              </div>
              <div>
                <el-button
                  size="small"
                  type="text"
                  @click="handleEditOrDelete('delete',item)"
                >
                  <i class="el-icon-delete"></i>
                  <span style="color:#606266;">删除目录</span>
                </el-button>
              </div>
              <el-button
                slot="reference"
                size="small"
                type="text"
                @click.stop="popoverClick(index)"
              >
                <i
                  class="el-icon-more"
                  v-if="item.id == liIsActive"
                ></i>
              </el-button>
            </el-popover>
          </li>
        </ul>
      </el-aside>
      <!-- 右侧权限表格内容区 -->
      <el-main>
        <h3
          class="mainheader"
          style=""
        >
          <span style="display:inline-block;height:20px">{{rightsSetCheckLi}}</span>
          <div
            style="float:right;position: relative;height:0px;width:200px"
            class="ddvv"
          >
            <span style="position: relative;top:36px;z-index:10">
              <el-button
                type='primary'
                size="medium"
                :loading="updateLoading"
                @click='updateEdit'
              >更新</el-button>
              <el-button
                type='primary'
                size="medium"
                @click='cancelEdit'
              >取消选中</el-button>
            </span>
          </div>
        </h3>
        <el-tabs
          v-model="activeName"
          type="card"
          style="padding-left: 20px;"
          class="tabsss"
        >

          <el-tab-pane
            label="操作权限"
            name="first"
            style="height:100%;"
          >
            <el-tree
              ref="displayTree"
              style="height:100%;"
              :data="displayTreeResourceList"
              show-checkbox
              node-key="id"
              highlight-current
              check-strictly
              @check="checkdisplay"
              :props="defaultProps"
            >
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <!-- 修改名称 -->
      <el-dialog
        title="修改名称"
        :visible.sync="editDialogVisible"
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
            label="名称"
            prop="name"
          >
            <el-input
              type="input"
              v-model="nodeTreeForm.name"
            ></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="toEditRights('nodeTreeForm',nodeTreeForm)"
          >确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="添加权限集"
        :visible.sync="addRightDialogVisible"
        width="30%"
        :close-on-click-modal="false"
        center
        @close='handleCloseAddRight'
      >
        <el-form
          :model="addRightForm"
          ref="addRightForm"
          :rules="addRightFormRule"
          label-width="100px"
        >
          <el-form-item
            label="名称"
            prop="name"
          >
            <el-input
              type="input"
              v-model="addRightForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择权限">
            <el-tree
              ref="tree"
              style="height:100%;"
              :data="resourceList"
              show-checkbox
              node-key="id"
              highlight-current
              check-strictly
              @check="check"
              :props="defaultProps"
            >
            </el-tree>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="handleCloseAddRight">取 消</el-button>
          <el-button
            type="primary"
            @click="addRight('addRightForm')"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-container>

  </div>
</template>

<script>
import Api from '@/api';
// const cityOptions = ['上海', '北京', '广州', '深圳'];
export default {
  name: '',
  components: {},
  data() {
    return {
      splitList: [],
      tempRightClickData: [],
      test_i: 0,
      tempCheckz: null,
      addRightDialogVisible: false,
      displayTreeResourceList: null,
      test: require('./test.json'),
      // test: [],
      resourceList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      info: { // 添加选择的权限
        roleResourceVoList: [],
        displayTreeCheck: [],
        displayTreeeCheckParentIds: []
      },
      addRightForm: { name: '' },
      addRightFormRule: {
        name: [
          { required: true, max: 64, message: '请输入名称', trigger: 'blur' }
        ]
      },
      nodeTreeRules: { // 修改名称input校验
        name: [
          { required: true, max: 64, message: '请输入名称', trigger: 'blur' }
        ]
      },
      nodeTreeForm: { name: '' }, // 修改名称input绑定值
      editDialogVisible: false, // //修改名称弹窗显示或隐藏
      // rightsSet: [{ id: '1', roleName: '总经理' }, { id: '2', roleName: '技术副总' }], // 权限集列表数据
      rightsSet: [],
      rightsSetCheckLi: '', // 选择的权限集的名字 用于表格头部显示
      updateLoading: false, // 更新按钮是否刷新状态
      temp: [], // 初始所有多选数据暂存数组
      tempCheckAll: [], // 初始所有是否全选数组暂存
      liIsActive: '', // 权限集列表选择的选项
      activeName: 'first', // tab默认选择第一个
      // 权限表格数据
      tableData: [{
        module: '施工管理', // 模块
        page: '进度计划', // 页面
        checkData: ['编辑计划'], // 已选择的数据合集
        checkAll: false, // 是否全选
        child: [{ id: '1', name: '查看计划' }, { id: '2', name: '编辑计划' }, { id: '3', name: '设置计划时间' }, { id: '4', name: '上报进度' }, { id: '5', name: '查看关联表单' }] // 全部选项数据
      }, {
        module: '施工管理',
        page: '流程管理',
        checkData: ['编辑流程'],
        checkAll: false,
        child: [{ id: '1', name: '新建流程' }, { id: '2', name: '编辑流程' }, { id: '3', name: '删除流程' }, { id: '4', name: '啦四流程' }, { id: '5', name: '啦五流程' }]
      }]
    };
  },
  computed: {
    computRef() {
      return this.addRightDialogVisible ? 'tree' : 'displayTree';
    }
  },
  watch: {
    rightsSet: {
      handler(newName, oldName) {
        if (newName.length > 0) {
          this.rightsSetCheckLi = newName[0].roleName;
          this.liIsActive = newName[0].id;
          this.rightsListChange(newName[0]);
        } else {
          this.info.displayTreeCheck = [];
          this.$refs.displayTree.setCheckedKeys([]);
        }
      }
      // deep: true,
      // immediate: true
    }
  },
  created() {
    this.getRoleTemplate();
    this.getResourceTree();
  },
  mounted() {
    // console.log('2394872398749' + this.computRef);
    // console.log(this.test, 'this.test');
    this.resourceList = this.listToTreeTran(this.test, 0);
    this.displayTreeResourceList = this.listToTreeTran(this.test, 0);
    // console.log(this.resourceList, 'this.resourceList');
    // console.log(this.test, 'this.test2222');
    // this.saveTempData();
    // this.setrowspans(this.tableData); // 处理需要合并行的表格
  },
  methods: {
    popoverClick(val) {
      // const temppopoverRef = this.$refs.popoverRef;
      // console.log(this.$refs.popoverRef);
      // const ddd = temppopoverRef.map((item, index, arr) => {
      // console.log(val, item, index, arr, 'item, index, arr');
      // if (index == val) {
      //   return item;
      // }
      // item.showPopper = false;
      // item.doClose();
      // // item.doToggle();
      // if (index == val) {
      //   console.log(index, val, item, 'index, val');
      //   item.doShow();
      // }
      // });
      // console.log(ddd);
      // temppopoverRef[val].doShow();
    },
    getResourceTree() { // 获取平台所有权限的树
      this.$axios.post(
        // 'http://192.168.1.218:9999/web/user/api/resources/getResourceTree',
        Api.permissionSet.getTree,
        {
          data: {
            category: 1,
            platformCode: '400001'
          }
        },
        res => {
          if (res.isSuccess) {
            // console.table(res.data[0], 'console.table console.table');
            this.test = res.data || [];
            // this.test.map(item => {
            //   item.parentId = '0' ;
            // });
            // this.resourceList = this.listToTreeTran(this.test, '0');
            // this.displayTreeResourceList = this.listToTreeTran(this.test, '0');

            const newdata = this.splitList;
            const fn = (source) => {
              source.forEach(el => {
                newdata.push(el);
                (el.children) && (el.children.length > 0) ? fn(el.children) : console.log();
              });
            };
            fn(this.test);

            this.resourceList = this.test;
            this.displayTreeResourceList = this.test;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    addRight(thatRef) { // 新增创建新的权限集
      // console.log(9999999999);
      // console.log(this.addRightForm.name);
      // console.log(this.info.roleResourceVoList);
      this.$refs[thatRef].validate((valid) => {
        if (valid) {
          this.$axios.post(
            // 'http://192.168.1.218:9999/web/user/api/roleTemplate/save',
            Api.permissionSet.create,
            {
              data: {
                roleName: this.addRightForm.name,
                roleTemplateType: 'company_role_template', // 公司模板，project_role_template项目部模板
                resources: this.info.roleResourceVoList
              }
            },
            res => {
              if (res.isSuccess) {
                // console.log(res);
                this.getRoleTemplate();
                this.handleCloseAddRight();
                this.$message.success('添加成功！');
              } else {
                this.$message.error(res.message);
              }
            }
          );
        } else {
          // this.$emit('getProjectDepartList', '创建');
          this.$message.error('校验失败');
          return false;
        }
      });
    },
    handleCloseAddRight() {
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.addRightForm.resetFields();
      this.addRightDialogVisible = false;
    },
    // displayhandleCloseAddRight() {
    //   this.$refs.displayTree.setCheckedKeys([]);
    //   this.$refs.addRightForm.resetFields();
    //   this.addRightDialogVisible = false;
    // },
    addRightClick() {
      this.addRightDialogVisible = true;
      // console.log('2394872398749' + this.computRef);
    },
    // 权限集列表点击，设置active，并查询新数据
    rightsListChange(val) { // 点击权限集角色列表查询对应勾选的权限
      this.liIsActive = val.id;
      this.rightsSetCheckLi = val.roleName;
      this.info.displayTreeCheck = [];
      this.$refs.displayTree.setCheckedKeys([]);
      this.$axios.post(
        // 'http://192.168.1.218:9999/web/user/api/roleTemplate/findById',
        Api.permissionSet.findById,
        {
          data: {
            id: this.liIsActive
          }
        },
        res => {
          if (res.isSuccess) {
            // this.rightsSet = res.data;
            // console.log(res, 'rightsListChange');
            this.tempRightClickData = res.data.resources;
            this.cancelEdit();
            // console.log(this.info.displayTreeCheck, 'this.info.displayTreeCheck');
            // this.tempRightClickData = JSON.parse(JSON.stringify(res.data.resources));
          } else {
            this.$message.error(res.message);
          }
        }
      );
      val.id == '1' ? this.edit([{ id: 61 }, { id: 110 }, { id: 112 }]) : this.edit([{ id: 150 }, { id: 152 }]);
    },
    check(currentObj, treeStatus) {
      // console.log(currentObj);
      // console.log(treeStatus);
      this.info.roleResourceVoList = [];
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中 0选中
      const list = [];
      // 获取关联父级
      this.getParentId(currentObj, list);
      list.map(item => {
        this.$refs.tree.setChecked(item, true, false); // 勾选关联得父级
      });
      if (currentObj.children) {
        if (selected !== -1) {
          // 根据当前状态勾选， 勾选关联子集
          this.deepcheckChildren(currentObj, this.$refs.tree);
        } else {
          // 根据当前状态未勾选， 去掉关联子集勾选
          this.deepclearChildren(currentObj, this.$refs.tree);
        }
      }
      const arr = this.$refs.tree.getCheckedNodes();
      arr.map(item => {
        this.info.roleResourceVoList.push({ id: item.id });
      });
      // console.log(this.info.roleResourceVoList, 'this.info.roleResourceVoList');
    },
    checkdisplay(currentObj, treeStatus) {
      // console.log(this.info.displayTreeeCheckParentIds, 'currentObj');
      // console.log(this.info.displayTreeeCheckParentIds.includes(currentObj.parentId), 'includes');
      // console.log(this.$refs.displayTree.getCheckedNodes(), 'getCheckedNodes');
      this.info.displayTreeCheck = [];
      this.info.displayTreeeCheckParentIds = [];
      // const tempt = this.$refs.displayTree.getCheckedNodes().map((item) => item.parentId);
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中 0选中
      const list = [];

      // const er = [];
      // const che = this.$refs.displayTree.getCheckedNodes();
      // const that = this;
      // function searchTest(val) {
      //   that.test.map((item) => {
      //     if (item.id == val) {
      //       er.push(item.parentId);
      //       searchTest(item.parentId);
      //     }
      //   });
      // }
      // searchTest(currentObj.parentId);
      // console.log(er, 'er-er');
      // 获取关联父级 (1，zxf点击子集的时候选中父级)
      this.getParentId(currentObj, list);
      list.map(item => {
        this.$refs.displayTree.setChecked(item, true, false); // 勾选关联得父级
      });
      // if (selected == 0) {
      //   list.map(item => {
      //     this.$refs.displayTree.setChecked(item, true, false); // 勾选关联得父级
      //   });
      // }
      // if (selected == -1 && !tempt.includes(currentObj.parentId)) {
      //   list.map(item => {
      //     this.$refs.displayTree.setChecked(item, false, false); // 取消勾选关联得父级
      //   });
      // }

      if (currentObj.children) { // (2，zxf点击选择或取消父集的时候选中或取消子集)
        if (selected !== -1) {
          // 根据当前状态勾选， 勾选关联子集 (2.1，zxf选中子集)
          this.deepcheckChildren(currentObj, this.$refs.displayTree);
        } else {
          // 根据当前状态未勾选， 去掉关联子集勾选,2.2，zxf取消子集)
          this.deepclearChildren(currentObj, this.$refs.displayTree);
        }
      }
      const arr = this.$refs.displayTree.getCheckedNodes();
      arr.map(item => {
        this.info.displayTreeCheck.push({ id: item.id });
        this.info.displayTreeeCheckParentIds.push(item.parentId);
      });
      // console.log(this.info.displayTreeCheck, 'this.info.displayTreeCheck');
    },
    // 递归获取关联父级
    getParentId(node, arr) {
      if (node.parentId != 0) {
        this.splitList.map(item => {
          if (item.id == node.parentId) {
            // console.log(this.test_i++);
            arr.push(item);
            this.getParentId(item, arr);
          }
        });
      }
    },
    getChildrenId(node, arr) {
      // 递归求出所有的末级分类
      if (node.children !== undefined && node.children.length !== 0) {
        node.children.forEach(item => {
          if (item.children === undefined) {
            // item.children.length === 0
            arr.push(item);
          } else {
            this.getChildrenId(item, arr);
          }
        });
      } else {
        arr.push(node); // 放到数组中
      }
    },
    deepclearChildren(data, currentTree) {
      // 递归q取消所有勾选子集
      currentTree.setChecked(data, false, false);
      if (data.children) {
        data.children.map(item => {
          currentTree.setChecked(item, false, false);
          this.deepclearChildren(item, currentTree);
        });
      }
    },
    deepcheckChildren(data, currentTree) {
      // 递归都勾选所有子集
      currentTree.setChecked(data, true, true);
      if (data.children) {
        data.children.map(item => {
          currentTree.setChecked(item, true, true);
          this.deepcheckChildren(item, currentTree);
        });
      }
    },
    edit(val) {
      // this.info = {
      //   roleResourceVoList: []
      // };
      // const data = {
      //   data: {
      //     id: row.id
      //   }
      // };
      this.info.displayTreeCheck = [];
      this.$nextTick(() => {
        val.map(item => {
          this.$refs.displayTree.setChecked(item.id, true, false);
          this.info.displayTreeCheck.push({ id: item.id });
        });
      });
      // this.getResource()
      // Promise.all([this.getResource()]).then(val => {
      //   this.$axios.post('/role/selectRoleById', data, (res) => {
      //     if (res.isSuccess) {
      //       this.info = res.data;
      //       const arr = [];
      //       this.getAllCheck(this.info.sysResourceVoList, arr);
      //       this.dialogVisible = true;
      //       this.$nextTick(() => {
      //         arr.map(item => {
      //           this.$refs.tree.setChecked(item.id, true, false);
      //           this.info.roleResourceVoList.push({ resourceId: item.id });
      //         });
      //       });
      //     } else {
      //       this.$message.error(res.message);
      //     }
      //   });
      // });
    },
    /**
* 数组转成树
* @param arr 数组
* @param parentId 第一层id
* @param parent 父级id字段名
* @param id 唯一标识
* @returns {Array}
*/
    listToTreeTran(arr, parentId, parent = 'parentId', id = 'id') {
      //  arr 是返回的数据  parendId 父id
      const temp = [];
      const treeArr = arr;
      treeArr.forEach((item, index) => {
        if (item[parent] === parentId) {
          if (this.listToTreeTran(treeArr, treeArr[index][id], parent, id).length > 0) {
            // 递归调用此函数
            treeArr[index].children = this.listToTreeTran(treeArr, treeArr[index][id], parent, id);
          }
          temp.push(treeArr[index]);
        }
      });
      return temp;
    },
    getRoleTemplate() { // 获取权限集角色列表
      this.$axios.post(
        // 'http://192.168.1.218:9999/web/user/api/roleTemplate/list',
        Api.permissionSet.getList,
        {
          data: {
            roleTemplateType: 'company_role_template'
          }
        },
        res => {
          if (res.isSuccess) {
            this.rightsSet = res.data || [];
            // console.log(res, 'getRoleTemplate');
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 点击确定 校验表单
    toEditRights(formRef, val) { // 权限集选择后更新
      this.$refs[formRef].validate((valid) => {
        if (valid) {
          // console.log(this.nodeTreeForm.name, this.nodeTreeForm.id, 'this.nodeTreeForm.name');
          this.$axios.post(
            // 'http://192.168.1.218:9999/web/user/api/roleTemplate/update',
            Api.permissionSet.update,
            {
              data: {
                id: this.nodeTreeForm.id,
                roleName: this.nodeTreeForm.name
              }
            },
            res => {
              if (res.isSuccess) {
                // this.rightsSet = res.data;
                // console.log(res, 'toEditRights toEditRights');
                this.getRoleTemplate();
                this.$message.success('修改成功');
                this.editDialogVisible = false;
              } else {
                this.$message.error(res.message);
              }
            }
          );
          // this.$emit('update:visible', false);
          // this.editDialogVisible = false;
          // this.handleCloseAddRight();
        } else {
          this.$message.error('校验失败');
          return false;
        }
      });
    },
    // toEditRights(val) {
    //   alert(val.name);
    // },
    // 更新数据方法
    updateEdit() {
      this.updateLoading = true;
      // console.log(this.liIsActive, 'this.liIsActive');
      // console.log(this.info.displayTreeCheck, 'this.info.displayTreeCheck');
      this.rightsSet.length == 0 ? (this.updateLoading = false) : (this.updateLoading = true);
      if (this.rightsSet.length == 0) return;
      this.$axios.post(
        // 'http://192.168.1.218:9999/web/user/api/roleTemplate/update',
        Api.permissionSet.update,
        {
          data: {
            id: this.liIsActive,
            resources: this.info.displayTreeCheck
          }
        },
        res => {
          if (res.isSuccess) {
            // this.rightsSet = res.data;
            // console.log(res, 'updateEdit updateEdit');
            // this.getRoleTemplate();
            this.$message.success('更新成功');
            this.tempRightClickData = this.info.displayTreeCheck;
            setTimeout(() => {
              this.updateLoading = false;
            }, 300);
          } else {
            this.$message.error(res.message);
          }
        }
      );
      // alert(`
      //     进度计划:
      // ${this.tableData[0].checkData}
      //     流程管理:
      // ${this.tableData[1].checkData}
      // `);
    },
    // 修改或删除权限列表
    handleEditOrDelete(state, item) {
      if (state == 'edit') {
        this.editDialogVisible = true;
        this.nodeTreeForm.name = item.roleName;
        this.nodeTreeForm.id = item.id;
        // console.log(item);
      } else {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(item.id, 'delete oi');
          this.$axios.post(
            // 'http://192.168.1.218:9999/web/user/api/roleTemplate/delete',
            Api.permissionSet.delete,
            {
              data: {
                id: item.id
              }
            },
            res => {
              if (res.isSuccess) {
                // this.rightsSet = res.data;
                // console.log(res, 'handleEditOrDelete handleEditOrDelete');
                this.getRoleTemplate();
                this.$message.success('删除成功！');
              } else {
                this.$message.error(res.message);
              }
            }
          );
        }).catch(() => {
          this.$message.info('取消删除');
        });
      }
    },
    // 取消更改  取消选择的多选框
    cancelEdit() {
      this.$refs.displayTree.setCheckedKeys([]);
      const temp = this.tempRightClickData;
      this.edit(temp);
      // console.log(this.info, 'this.infoconst temp = this.tempRightClickData;');
      // const temp = this.temp;
      // const tempCheckAll = this.tempCheckAll;
      // const tempTabel = this.tableData;
      // tempTabel.forEach(function (item1, i) {
      //   item1.checkData = temp[i];
      //   item1.checkAll = tempCheckAll[i];
      // });
    },
    // 暂存初始数据，即默认选择的数据，用于取消更改,及全选状态
    saveTempData() {
      const temp = this.temp;
      const tempCheckAll = this.tempCheckAll;
      this.tableData.forEach(function (item, i) {
        temp.push(item.checkData);
        tempCheckAll.push(item.checkAll);
      });
    },
    onContextShow(i) {

    },
    // 点击全选按钮方法
    handleCheckAllChange(val) {
      if (val.checkAll) {
        // const idd = val.id;
        const tempone = [];
        val.child.forEach(function (item) {
          tempone.push(item.name);
        });
        // console.log(val.checkData);
        // console.log(tempone);
        val.checkData = tempone;
        // const edit = this.tableData.filter(function (item1) {
        //   // retrun item1.id === idd;
        // });
      } else {
        val.checkData = [];
      }
    },
    // 点击具体的每一个多选框的方法
    handleEachItemChange(val) {
      // console.log(val.checkData.length)
      // console.log(val.child.length)
      val.checkAll = val.checkData.length == val.child.length;
    },
    // // table表格合并单元格
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     if (rowIndex % 2 === 0) {
    //       return {
    //         rowspan: 2,
    //         colspan: 1
    //       };
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       };
    //     }
    //   }
    // }
    // table表格合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: row.rowspan,
          colspan: row.rowspan > 0 ? 1 : 0
        };
      }
    },
    // 计算每行数据需要合并的行rowspan，在表格数据更新后进行调用
    setrowspans(list) {
      list.forEach(v => {
        v.rowspan = 1;
      });
      // 双层循环
      for (let i = 0; i < list.length; i++) {
        /**
         * 内层循环，上面已经给所有的行都加了v.rowspan = 1
         * 如果当前行的module和下一行的module相等
         * 就把当前v.rowspan + 1
         * 下一行的v.rowspan - 1
        */
        for (let j = i + 1; j < list.length; j++) {
          // 此处可根据相同字段进行合并
          if (list[i].module === list[j].module) {
            list[i].rowspan++;
            list[j].rowspan--;
          } else {
            break;
          }
        }
        // 这里跳过已经合并的行数据，从下一次需要合并的行开始
        i = i + list[i].rowspan - 1;
      }
    }

  }
};
</script>

<style scoped lang="scss">
* {
  user-select: none;
}
::v-deep .el-table__body tr.current-row > td {
  background-color: #fff;
}
::v-deep .el-table__body tr:hover > td {
  background-color: #fff;
}
::v-deep body {
  user-select: none !important;
}
::v-deep .tabsss .el-tabs__header {
  margin: 0 0 0px !important;
}
.el-icon-circle-plus:hover {
  zoom: 1.05;
  color: blue;
  cursor: pointer;
}
.el-icon-circle-plus:active {
  color: SeaGreen;
}
.asideheader {
  line-height: 44px;
}
.mainheader {
  padding-left: 20px;
  line-height: 44px;
  text-align: left;
}
li {
  //height: 60px;
  line-height: 40px;
}
.activeLi {
  border-right: 4px solid #1890ff;
  color: #1890ff;
  background-color: #e6f7ff;
}
// .container {
//   height: 100% !important;
// }
// .el-container {
//   height: 100%;
//   margin-bottom: 40px;
// }
.el-aside {
  background-color: #fff;
  color: #333;
  text-align: center;
  // line-height: 200px;
  border-right: 1px solid #ebebeb;
}
.el-main {
  background-color: #fff;
  color: #333;
  text-align: center;
  padding: 0px;
  // line-height: 160px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
