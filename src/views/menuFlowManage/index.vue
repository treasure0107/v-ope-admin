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
   <div id="devicePlan">
     <el-container>
        <el-header style="height:45px;">
          <el-row type="flex" justify="space-between" align="middle" style="height:100%">
            <el-col style="width:unset;display:flex">
              <el-button type="primary" size="small" @click="newProject">创建</el-button>
              <el-button size="small" @click="deleteClick">删除</el-button>
            </el-col>
            <el-col style="width:unset;display:flex" v-if="true">
              <el-input
                style="width:unset;"
                size="small"
                placeholder="请输入内容"
                @keyup.enter.native="handleSearch()"
                v-model="searchValue">
                <i slot="suffix" class="el-input__icon el-icon-search mysearch" @click="handleSearch()" title="搜索"></i>
              </el-input>&nbsp;
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
            :showCheckBox="true"
            @selectDataEvent="selectDataEvent"
          >
          </dy-table>
        </el-main>
     </el-container>
    <DyDialog
      :styleArray="[{minHeight: '400px'},{maxHeight: '80vh'}]"
      :visible="personDialogVisible"
      :width="newProjectDialogWidth"
      :dialogTitle="toEditTableItem ?  '编辑' :'创建'"
      @cancelDialogPopup="cancelPersonDialogPopup"
      @closeDialogPopup="closePersonDialogPopup"
      @sureDialogPopup="surePersonDialogPopup"
    >
      <div>
        <el-form
          :model="allList"
          ref="munuFlowForm"
        >
          <template v-for="(item, index) in allList.menu">
            <el-row :gutter="20" :key="index">
              <el-col :span="12">
                <el-form-item
                  label="模块菜单："
                  :label-width="formLabelWidth"
                  :prop="`menu.${index}.resourcesId`"
                  :rules="{required: true,message: '请选择模块菜单',trigger: 'blur'}"
                >
                  <el-select
                    :disabled="toEditTableItem"
                    v-model="item.resourcesId"
                    placeholder="请选择模块菜单"
                    style="width: 100%"
                    size="mini"
                  >
                    <el-option
                      v-for="(item, index) in menuTree"
                      :key="JSON.stringify(item).slice(index, 60)"
                      :label="item.aliasName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="对应流程："
                  :label-width="formLabelWidth"
                  :prop="`menu.${index}.superior`"
                  :rules="{required: true,message: '请选择对应流程',trigger: 'blur'}"
                >
                  <el-select
                    value-key="id"
                    v-model="item.superior"
                    placeholder="请选择对应流程"
                    style="width: 100%"
                    size="mini"
                  >
                    <el-option
                      v-for="item in flowSelect"
                      :key="JSON.stringify(item)"
                      :label="item.flowName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <span v-if="!toEditTableItem && allList.menu.length > 1" title="删除" style="line-height:40px;font-size:large;" class="el-icon-remove removeRow" @click="removeRow(index)"></span>
          </el-row>
          </template>

        </el-form>
        <div v-if="!toEditTableItem" class="addRow" title="添加" @click="addRow">+ 添加</div>
      </div>
    </DyDialog>
   </div>
 </div>
</template>

<script>
import DyTable from '@/components/DyTable';
import DyDialog from '@/components/DyDialog'; // prop="superior"
import Api from '@/api';
import { localstorageGet } from '@/utils/auth';
export default {
  name: '',
  components: { DyTable, DyDialog },
  data() {
    return {
      stationId: localstorageGet('stationId'),
      selectDatas: undefined,
      toEditTableItem: false,
      flowSelect: [],
      menuTree: [],
      newProjectDialogWidth: '900px',
      formLabelWidth: '110px',
      personDialogVisible: false,
      downSelect: '',
      searchValue: '',
      dateVal: [],
      loading: false,
      tableData: [],
      colKey: {
        resourcesName: '菜单名称',
        flowName: '表单流程名称'
      },
      pagination: {
        total: 0,
        pages: 1,
        size: 10,
        pagination: true
      },
      multiActions: [
        {
          header: '操作',
          actions: [
            {
              width: '90px',
              label: '编辑',
              action: (row) => {
                // this.handleEdit(row);
                this.allList.menu[0].clickRow = row.id;
                this.allList.menu[0].resourcesId = row.resourcesId;
                this.allList.menu[0].superior = this.flowSelect.find(item => item.code == row.flowTemplateCode);
                this.personDialogVisible = true;
                this.toEditTableItem = true;
              }
            }
          ]
        }
      ],
      allList: {
        menu: [{
          superior: '',
          resourcesId: ''
        }]
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initSelectData();
  },
  mounted() {
    // console.log(this.$nextTick, 'this.$nextTick');
  },
  methods: {
    initTableData() {
      this.$axios.post( // 获取table列表
        // 'http://192.168.1.218:9999/web/formTemplateApi/cusQueryAllByBizData',
        Api.menuFlowManage.initTable,
        {
          data: {
            formTemplateBizRelevance: {
              stationId: this.stationId,
              projectId: '',
              resourcesId: true,
              formName: this.searchValue
            }
          },
          pagination: true,
          pages: this.pagination.pages, // pages
          size: this.pagination.size
        },
        (res) => {
          if (res.isSuccess) {
            this.tableData = res.data || [];
            const { total } = res;
            // this.pagination = { ...this.pagination, pages, size, total };
            this.pagination.total = total || res.data.length;
            // this.$message.success(`成功`);
          } else {
            this.$message.error({ duration: 9000, message: res.message });
          }
        }
      );
    },
    initSelectData() { // 查找两个下拉框
      // this.flowSelect = [{ flowName: 'testflow', id: 'testid' }];
      this.$axios.post(// 获取流程下拉选择
        // 'http://192.168.1.218:9999/web/flowTemplateApi/list',
        Api.deviceManagement.getFlowSelect,
        {
          data: {},
          formTemplateBizRelevance: { stationId: this.stationId },
          platformCode: '400001',
          pagination: true,
          pages: this.pagination.pages,
          size: this.pagination.size
        },
        (res) => {
          if (res.isSuccess) {
            this.flowSelect = res.data || [];
            // this.$message.success(`成功`);
          } else {
            this.$message.error({ duration: 4000, message: res.message });
          }
        }
      );

      this.$axios.post(// 获取菜单下拉选择
        // 'http://192.168.1.218:9999/web/user/api/resources/getResourceTree',
        Api.deviceManagement.getMenuSelect,
        {
          data: { category: '1', platformCode: '400001' }
        },
        (res) => {
          if (res.isSuccess) {
            // this.$message.success(`成功`);
            const newdata = this.menuTree;
            const fn = (source) => {
              source.forEach(el => {
                newdata.push(el);
                if (el.href == '/home' || el.type == 'top' || !el.isShow || el.children.length > 0 || el.href == '/groupManagement/monthly' || el.href == '/groupManagement/daily' || el.href == '/groupManagement/windFarmManage' || el.href == '/groupManagement/windFarmManage' || el.href == '/groupManagement/factoryManagement' || el.href == '/personnelManagement/roleManagement' || el.href == '/personnelManagement/permission' || el.href == '/personnelManagement/outsideStationPerson' || el.href == '/personnelManagement/windStationPersonManage' || el.href == '/personnelManagement/frameworkSettng' || el.href == '/depotManagement/formSet/workflowEngine' || el.href == '/depotManagement/formSet/formDesign' || el.href == '/depotManagement/formSet/formLibrary' || el.href == '/depotManagement/skillSupervise' || el.href == '/depotManagement/provincialManagement' || el.href == '/depotManagement/menuPlanManage' || el.href == '/depotManagement/menuFlowManage' || el.href == '/depotManagement/deviceManagement' || el.href == '/depotManagement/reconditionManagement/devicePlan' || el.href == '/depotManagement/reconditionManagement/stationPlan' || el.href == '/depotManagement/reconditionManagement/deviceRecord' || el.href == '/depotManagement/inspectManagement' || el.href == '/groupManagement/windFarmManage' || el.href == '/groupManagement/factoryManagement' || el.href == '/personnelManagement/roleManagement' || el.href == '/personnelManagement/permission' || el.href == '/personnelManagement/outsideStationPerson' || el.href == '/personnelManagement/windStationPersonManage' || el.href == '/personnelManagement/frameworkSettng' || el.href == '/depotManagement/formSet/workflowEngine' || el.href == '/depotManagement/formSet/formDesign' || el.href == '/depotManagement/formSet/formLibrary' || el.href == '/depotManagement/skillSupervise' || el.href == '/depotManagement/provincialManagement' || el.href == '/depotManagement/menuPlanManage' || el.href == '/depotManagement/menuFlowManage' || el.href == '/depotManagement/deviceManagement' || el.href == '/depotManagement/reconditionManagement/devicePlan' || el.href == '/depotManagement/reconditionManagement/stationPlan' || el.href == '/depotManagement/reconditionManagement/deviceRecord' || el.href == '/depotManagement/operationTicketManagement') newdata.pop();
                (el.children) && (el.children.length > 0) ? fn(el.children) : console.dir();
              });
            };
            fn(res.data || []);
            // console.log(this.menuTree, 'newdata');
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    addRow() {
      this.allList.menu.push({
        superior: '',
        resourcesId: ''
      });
    },
    removeRow(index) {
      if (this.allList.menu.length == 1) {
        this.$message.info('只有一条数据');
        return;
      }
      this.allList.menu.splice(index, 1);
    },
    handleEdit() {

    },
    cancelPersonDialogPopup() {
      this.personDialogVisible = false;
      const _this = this;

      _this.$refs.munuFlowForm.resetFields();
      this.$nextTick(function () { // 敲敲
      });
      _this.allList.menu = [{
        superior: '',
        resourcesId: ''
      }];
    },
    closePersonDialogPopup() {
      this.personDialogVisible = false;
      const _this = this;
      // this.$nextTick(function () {
      //   _this.$refs.munuFlowForm.resetFields();
      // });
      _this.allList.menu = [{
        superior: '',
        resourcesId: ''
      }];
    },
    surePersonDialogPopup(isDelete) {
      // this.personDialogVisible = false;
      // this.$refs.munuFlowForm.resetFields();
      this.$refs.munuFlowForm.validate((valid) => {
        if (valid) {
          this.searchThatTable();
        } else {
          // _this.$refs.munuFlowForm.resetFields();
          // alert('error submit!!');
          return false;
        }
      });
    },
    searchThatTable(isDelete) {
      const _this = this;
      // console.log(this.allList.menu, 'this.allList.menu');
      const formTemplateBizRelevanceList = this.allList.menu.map(item => {
        const obj = { stationId: _this.stationId };
        if (this.toEditTableItem || isDelete == 'Delete') obj.id = item.clickRow;
        if (isDelete == 'Delete') obj.isDelete = true;
        obj.flowTemplateCode = item.superior.code;
        obj.formTemplateCode = item.superior.formTemplateList[0].code;
        obj.resourcesId = item.resourcesId;
        return obj;
      });
      // console.log(formTemplateBizRelevance, 'temptemptemp');
      this.$axios.post( // 删除 修改 创建
        // 'http://192.168.1.218:9999/web/formTemplateApi/relevanceBiz',
        Api.menuFlowManage.update,
        {
          data: {},
          formTemplateBizRelevanceList
        },
        (res) => {
          if (res.isSuccess) {
            if (isDelete == 'Delete') {
              this.$message.success(`删除成功`);
            } else if (this.toEditTableItem) {
              this.$message.success(`修改成功`);
            } else {
              this.$message.success(`创建成功`);
            }
            _this.allList.menu = [{
              superior: '',
              resourcesId: ''
            }];
            _this.personDialogVisible = false;
            _this.initTableData();
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    newProject() {
      this.personDialogVisible = true;
      this.toEditTableItem = false;
    },
    deleteClick() {
      if (this.selectDatas == undefined || this.selectDatas.length == 0) {
        this.$message.info('未选择');
        return ;
      };
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.selectDatas == undefined || this.selectDatas.length == 0) {
          this.$message.info('未选择');
          return ;
        };
        const _this = this;
        this.allList.menu = this.selectDatas.map(outerItem => {
          const obj = {};
          obj.clickRow = outerItem.id;
          obj.resourcesId = outerItem.resourcesId;
          obj.superior = _this.flowSelect.find(item => item.code == outerItem.flowTemplateCode);
          return obj;
        });
        this.searchThatTable('Delete');
        // this.$message.success('确定');
      }).catch(() => {
        this.allList.menu = [{
          superior: '',
          resourcesId: ''
        }];
      });
    },
    handleDateChange() {

    },
    handleAdd() {

    },
    fetchData() {
      this.initTableData();
      // this.tableData = [
      //   {
      //     resourcesName: '交接班记录',
      //     flowName: '交接班记录流程'
      //   }
      // ];
    },
    selectDataEvent(val) {
      this.selectDatas = val;
    },
    configHeader(val) {
      this.drawerVisible = true;
    },
    handleSearch() {
      this.initTableData();
      // this.$message.info('搜索：' + this.searchValue);
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
.removeRow:hover{
  color:blue;
  zoom:1.1;
}
.removeRow:active{
  color:gray;
}
.addRow{
  user-select: none;
  width: 83%;
  height: 40px;
  text-align: center;
  margin: 0 auto;
  border: 1px dashed #303133;
  line-height: 40px;
  border-radius: 10px;
}
.addRow:hover{
    background-color: #e6f7ff;
}
.addRow:active{
    zoom: 0.98;
    background-color: #e6f7ff;
}
.el-col-12{
  width: 48%;
}
.el-main{
  padding: 0;
}
.mysearch:hover{
  color: red;
}
.mysearch:active{
  color: transparent;
}
</style>
