<!--
 * @Author: JTune
 * @Date: 2021-08-13
 * @LastEditTime: 2021-08-03 10:07:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\roleManagement\index.vue
-->
<template>
 <div>
   <div id="printTest">
    <el-container style="height: 780px;">
      <el-aside width="200px" style="border-right:0.5px #a8a8a8 solid">
        <el-tree node-key="id" :default-expand-all="true" :highlight-current="true" :data="treeData" ref="OperationTree" :props="treeDataProps" @node-click="beforeTreeClick"></el-tree>
      </el-aside>
      <el-container class="serachthat" style="margin-left:7px">
          <taskFormManage :operationFlowCodeandState="operationFlowCodeandState" style="width:100%" v-if="showTaskFormManage"></taskFormManage>
          <el-empty v-else style="width: 100%;" description=" "></el-empty>
      </el-container>
    </el-container>
   </div>

    <!-- <div class="tit_btn">
      <el-button
        type="primary"
        size="small"
        v-print="'#printTest'"
      >打印</el-button>
    </div> -->
 </div>
</template>

<script>
import taskFormManage from '@/views/taskFormManage/index.vue';
import Api from '@/api';
// import DyTable from '@/components/DyTable';
// import DyDialog from '@/components/DyDialog';
export default {
  name: 'Operationn',
  components: { taskFormManage },
  data() {
    return {
      OperationTicketManagementName: 'OperationTicketManagementName',
      showTaskFormManage: false,
      treeData: undefined,
      treeDataProps: {
        children: 'childrens',
        label: 'name'
      },
      operationFlowCodeandState: {
        state: true,
        flowcode: '',
        deviceId: '',
        showAllandNotCreate: false,
        activatedTabIndex: '1',
        myThis: this,
        groupgetInitTree(val) {
          this.myThis.$axios.post(
            Api.operationTicket.getInitTree,
            {
              data: {
                nodeId: val
                // nodeId: this.myThis.$store.state.user.stationId,
                // resourceId: '246c17f6366c4855be62d380a74dbe4e'
              }
            },
            res => {
              if (res.isSuccess) {
                this.myThis.treeData = res.data || [];
                if (this.myThis.treeData && !(this.myThis.treeData.length == 0)) {
                  var initTreeNode = res.data[0].childrens[0].childrens[0];
                }
                if (initTreeNode) {
                  this.myThis.$nextTick(function () {
                    this.$refs.OperationTree.setCurrentKey(initTreeNode.id);
                    this.operationFlowCodeandState.deviceId = initTreeNode.id;
                  });
                };
              } else {
                this.myThis.$message.error({ duration: 4000, message: res.message });
              }
            }
          );
          // console.log(rejOrres, 'rejOrres-jjj');
          // return jj;
        }
      },
      newProjectDialogWidth: '900px',
      formLabelWidth: '130px',
      personDialogVisible: false,
      downSelect: '',
      searchValue: '',
      dateVal: [],
      loading: false,
      tableData: [],
      colKey: {
        windPowerPlant: '厂商',
        name: '姓名',
        dutyName: '岗位',
        phone: '电话'
      },
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      multiActions: [
        {
          header: '检修计划',
          actions: [
            {
              width: '90px',
              label: '上传',
              action: (row) => {
                this.handleEdit(row);
              }
            },
            {
              width: '90px',
              label: '预览',
              action: (row) => {
                this.handleEdit(row);
              }
            }

          ]
        },
        {
          header: '消缺记录',
          actions: [
            {
              width: '90px',
              label: '上传',
              action: (row) => {
                this.handleEdit(row);
              }
            },
            {
              width: '90px',
              label: '预览',
              action: (row) => {
                this.handleEdit(row);
              }
            }

          ]
        },
        {
          header: '检修报告',
          actions: [
            {
              width: '90px',
              label: '上传',
              action: (row) => {
                this.handleEdit(row);
              }
            },
            {
              width: '90px',
              label: '预览',
              action: (row) => {
                this.handleEdit(row);
              }
            }

          ]
        },
        {
          header: '检修对比',
          actions: [
            {
              width: '90px',
              label: '附件',
              action: (row) => {
                this.handleEdit(row);
              }
            },
            {
              width: '90px',
              label: '预览',
              action: (row) => {
                this.handleEdit(row);
              }
            }

          ]
        },
        {
          header: '操作',
          actions: [
            {
              width: '90px',
              label: '编辑',
              action: (row) => {
                this.handleEdit(row);
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
        phone: [{ required: true, message: '请选择', trigger: 'blur' }],
        superior: [{ required: true, message: '请选择直属上级', trigger: 'change' }]

      }
    };
  },
  provide() {
    return { operationFlowCodeandState: this.operationFlowCodeandState };
  },
  computed: {
    isGroup() {
      return this.$route.path.includes('groupManagement');
    }
  },
  watch: {},
  created() {
    this.showTaskFormManage = this.isGroup;
  },
  mounted() {
    this.isGroup || this.getInitTree();
  },
  methods: {
    getInitTree() {
      this.$axios.post(
        Api.operationTicket.getInitTree,
        {
          data: {
            nodeId: this.$store.state.user.stationId,
            resourceId: this.$store.state.flow.resourceId
          }
        },
        res => {
          if (res.isSuccess) {
            this.treeData = res.data || [];
            if (this.treeData && !(this.treeData.length == 0)) { var initTreeNode = res.data[0].childrens[0].childrens[0]; }
            if (initTreeNode) {
              // this.operationFlowCodeandState.flowcode = initFlowCode;
              // // this.operationFlowCodeandState.deviceId = deviceId;
              // this.showTaskFormManage = false;
              // setTimeout(() => {
              //   this.showTaskFormManage = true;
              // }, 0);
              this.$nextTick(function () {
                this.$refs.OperationTree.setCurrentKey(initTreeNode.id);
                this.handleTreeClick(initTreeNode);
              });
            };
          } else {
            this.$message.error({ duration: 4000, message: res.message });
          }
        }
      );
    },
    beforeTreeClick(val) {
      this.isGroup ? this.grouphandleTreeClick(val) : this.handleTreeClick(val);
    },
    grouphandleTreeClick(val) {
      if (!val.id) {
        this.operationFlowCodeandState.completedthis.tableData = [];
      } else {
        this.operationFlowCodeandState.showAllandNotCreate = true;
        this.operationFlowCodeandState.flowcode = val.flowCode;
        this.operationFlowCodeandState.deviceId = val.id;
        this.operationFlowCodeandState.opDeviceId = val.id;
        this.operationFlowCodeandState.getTaskList();
      }
    },
    handleTreeClick(val) {
      if (!val.childrens) {
        this.operationFlowCodeandState.showAllandNotCreate = true;
        this.operationFlowCodeandState.flowcode = val.flowCode;
        this.operationFlowCodeandState.deviceId = val.id;
        this.showTaskFormManage = false;
        setTimeout(() => {
          this.showTaskFormManage = true;
        }, 0);
        return false;
      }
      this.operationFlowCodeandState.showAllandNotCreate = false;
      this.operationFlowCodeandState.deviceId = undefined;
      this.showTaskFormManage = false;
      // setTimeout(() => {
      //   this.showTaskFormManage = true;
      // }, 0);
    },
    handleEdit() {

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
    handleDateChange() {

    },
    handleAdd() {

    },
    fetchData() {
      this.tableData = [
        {
          windPowerPlant: '庚熙山',
          name: 'wer',
          dutyName: '前锋',
          phone: '13900001111'
        }
      ];
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
/* ::v-deep .tree{
      overflow-y: hidden;
      overflow-x: scroll;
      width:80px;
      height: 500px;
  } */
 ::v-deep .el-tree {
     min-width: 100%;
     display:inline-block !important;
 }
::v-deep [role='treeitem']{
  /* white-space: unset; */
  line-height: 13px;
}
::v-deep .el-header{
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0;
}
::v-deep .el-main{
  padding: 0;
}
.mysearch:hover{
  color: red;
}
.mysearch:active{
  color: transparent;
}
::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #d6eefa;
}
</style>
