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
              <el-button size="small" @click="deleteClick" v-if="environment == 'dev'">删除</el-button>
            </el-col>
            <el-col style="width:unset;display:flex" v-if="false">
              <el-input
                style="width:unset;"
                size="small"
                placeholder="请输入内容"
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
                  label="计划类型："
                  :label-width="formLabelWidth"
                  :prop="`menu.${index}.planType`"
                  :rules="{required: true,message: '计划类型',trigger: 'blur'}"
                >
                  <el-select
                    v-model="item.planType"
                    placeholder="计划类型"
                    style="width: 100%"
                    size="mini"
                  >
                    <el-option
                      v-for="(item, index) in menuTree"
                      :key="JSON.stringify(item).slice(index, 60)"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="计划表单："
                  :label-width="formLabelWidth"
                  :prop="`menu.${index}.form`"
                  :rules="{required: true,message: '请选择对应表单',trigger: 'blur'}"
                >
                  <el-select
                    value-key="id"
                    v-model="item.form"
                    placeholder="请选择对应表单"
                    style="width: 100%"
                    size="mini"
                  >
                    <el-option
                      v-for="item in flowSelect"
                      :key="JSON.stringify(item)"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="对应岗位："
                  :label-width="formLabelWidth"
                  :prop="`menu.${index}.duty`"
                  :rules="{required: true,message: '请选择对应岗位',trigger: ''}"
                >
                <el-cascader
                checkStrictly="true"
                style="width: 100%"
                v-model="allList.menu[index].duty"
                size="mini"
                :options="dutyOptions"
                :props="{label:'name',value: 'id',children: 'childrenList'}"
                :show-all-levels="false">
                </el-cascader>
                  <!-- <el-select
                    value-key="id"
                    v-model="item.duty"
                    placeholder="请选择对应岗位"
                    style="width: 100%"
                    size="mini"
                  >
                    <el-option
                      v-for="item in dutyList"
                      :key="JSON.stringify(item)"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select> -->
                </el-form-item>

              </el-col>
              <span v-if="false" title="删除" style="line-height:40px;font-size:large;" class="el-icon-remove removeRow" @click="removeRow(index)"></span>
          </el-row>
          </template>

        </el-form>
        <div v-if="false" class="addRow" title="添加" @click="addRow">+ 添加</div>
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
const stationId = localstorageGet('stationId');
export default {
  name: '',
  components: { DyTable, DyDialog },
  data() {
    return {
      dutyOptions: [],
      stationId: localstorageGet('stationId'),
      tempObj: [],
      dutyList: [],
      companyId: localstorageGet('companyId'),
      selectDatas: undefined,
      toEditTableItem: false,
      flowSelect: [],
      menuTree: [
        { id: 'data_report_everyday', name: '日报' },
        { id: 'data_report_everymonth', name: '月报' },
        { id: 'dispatch_data_report_everymonth', name: '调度' },
        { id: 'three_data_report_everyday', name: '巡检' }
      ],
      newProjectDialogWidth: '900px',
      formLabelWidth: '110px',
      personDialogVisible: false,
      downSelect: '',
      searchValue: '',
      dateVal: [],
      loading: false,
      tableData: [],
      colKey: {
        name: '计划名称',
        formName: '表单名称',
        dutyName: '岗位'
      },
      pagination: {
        total: 0,
        pages: 1,
        size: 30,
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
                // this.allList.menu[0].clickRow = row.id;
                this.personDialogVisible = true;
                this.toEditTableItem = true;
                this.$nextTick(function () {
                  this.allList.menu[0].planType = row.planType;
                  if (row.form) this.allList.menu[0].form = row.form.code;
                  if (row.duty) this.allList.menu[0].duty = row.duty.id;
                  this.allList.id = row.id;
                });
              }
            }
          ]
        }
      ],
      pageThis: this,
      allList: {
        menu: [{
          form: '',
          planType: '',
          duty: '',
          node: { id: stationId }
        }]
      }
    };
  },
  computed: {
    environment() {
      return process.env.VUE_APP_FLAG;
    }
  },
  watch: {},
  created() {
    this.initSelectData();
  },
  mounted() {
  },
  methods: {
    initTableData() {
      this.$axios.post( // 获取table列表
        // 'http://192.168.1.218:9999/web/formTemplateApi/cusQueryAllByBizData',
        Api.menuPlanPManage.getTableList,
        {
          data: {
            node: {
              id: this.stationId
            }
          }
          // ...this.pagination
        },
        (res) => {
          if (res.isSuccess) {
            const temp = res.data || [];
            temp.forEach((item) => {
              if (item.duty)item.dutyName = item.duty.dutyName;
              if (item.form)item.formName = item.form.name;
            });
            this.tableData = temp;
            // const { pages, size, total } = res;
            // this.pagination = { ...this.pagination, pages, size, total };
            // this.$message.success(`成功`);
          } else {
            this.$message.error({ duration: 4000, message: res.message });
          }
        }
      );
    },
    initSelectData() {
      this.$axios.post(Api.menuPlanPManage.getDutyTree, { // 查询岗位
        data: {
          flag: 4,
          id: this.companyId
        }
      }, (res) => {
        if (res.isSuccess) {
          // this.dutyOptions = res.data;
          this.dutyOptions = res.data;
          const fn = (source) => {
            source.forEach(el => {
              if (el.type == 4) delete el.childrenList;
              (el.childrenList) && (el.childrenList.length > 0) ? fn(el.childrenList) : console.dir();
            });
          };
          fn(this.dutyOptions || []);
        } else {
          this.$message.error({ duration: 4000, message: res.message });
        }
      });

      this.$axios.post(Api.form.planFormList, {
        data: {},
        formTemplateBizRelevance: { stationId },
        platformCode: '400001',
        pagination: false,
        queryFormType: 'common_form'
        // pages: this.pagination.pages,
        // size: this.pagination.sizedevicePlan
      }, (res) => {
        if (res.isSuccess) {
          this.flowSelect = res.data;
          // this.pagination.total = res.total;
        } else {
          this.$message.error({ duration: 4000, message: res.message });
        }
      });
      // this.$axios.post(// 获取菜单下拉选择
      //   // 'http://192.168.1.218:9999/web/user/api/resources/getResourceTree',
      //   Api.deviceManagement.getMenuSelect,
      //   {
      //     data: { category: '1', platformCode: '400001' }
      //   },
      //   (res) => {
      //     if (res.isSuccess) {
      //       // this.$message.success(`成功`);
      //       const newdata = this.menuTree;
      //       const fn = (source) => {
      //         source.forEach(el => {
      //           newdata.push(el);
      //           (el.children) && (el.children.length > 0) ? fn(el.children) : console.log();
      //         });
      //       };
      //       fn(res.data || []);
      //       // console.log(this.menuTree, 'newdata');
      //     } else {
      //       this.$message.error(res.message);
      //     }
      //   }
      // );
    },
    addRow() {
      this.allList.menu.push({
        form: '',
        planType: '',
        duty: ''
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
      this.$nextTick(function () {
        this.allList = {
          menu: [{
            form: '',
            planType: '',
            duty: '',
            node: { id: stationId }
          }]
        };
      });
    },
    closePersonDialogPopup() {
      this.personDialogVisible = false;
      const _this = this;
      _this.$refs.munuFlowForm.resetFields();
      this.$nextTick(function () {
        this.allList = {
          menu: [{
            form: '',
            planType: '',
            duty: '',
            node: { id: stationId }
          }]
        };
      });
    },
    surePersonDialogPopup(isDelete) {
      // this.personDialogVisible = false;
      // this.$refs.munuFlowForm.resetFields();
      // console.log(this.allList, 'this.allListthis.allList');
      this.$refs.munuFlowForm.validate((valid) => {
        if (valid) {
          this.tempObj = JSON.parse(JSON.stringify(this.allList));
          this.tempObj.form = { code: this.tempObj.menu[0].form };
          console.log(this.tempObj.menu[0].duty);
          console.log(typeof this.tempObj.menu[0].duty);
          if (typeof this.tempObj.menu[0].duty == 'object') { // 创建
            this.tempObj.duty = { id: this.tempObj.menu[0].duty[this.tempObj.menu[0].duty.length - 1] };
          } else {
            this.tempObj.duty = { id: this.tempObj.menu[0].duty };
          }
          this.tempObj.node = this.tempObj.menu[0].node;
          this.tempObj.planType = this.tempObj.menu[0].planType;
          delete this.tempObj.menu;
          console.log(this.tempObj);
          this.create();
        } else {
          // _this.$refs.munuFlowForm.resetFields();
          // alert('error submit!!');
          return false;
        }
      });
    },
    create() {
      if (!this.toEditTableItem) { // 创建
        delete this.tempObj.id;
        // console.log(this.tempObj, '创建');
        this.$axios.post(Api.menuPlanPManage.create, {
          data: { ...this.tempObj }
        }, (res) => {
          if (res.isSuccess) {
            this.$refs.munuFlowForm.resetFields();
            this.personDialogVisible = false;
            this.initTableData();
          } else {
            this.$message.error({ duration: 9000, message: res.message });
          }
        });
      } else { // 编辑
        // delete this.tempObj.node;
        // console.log(this.tempObj, '编辑');
        this.$axios.post(Api.menuPlanPManage.update, {
          data: { ...this.tempObj }
        }, (res) => {
          if (res.isSuccess) {
            this.$refs.munuFlowForm.resetFields();
            this.personDialogVisible = false;
            this.initTableData();
          } else {
            this.$message.error({ duration: 4000, message: res.message });
          }
        });
      }
    },
    searchThatTable(isDelete) {
      const _this = this;
      // console.log(this.allList.menu, 'this.allList.menu');
      const formTemplateBizRelevanceList = this.allList.menu.map(item => {
        const obj = { stationId: _this.stationId };
        if (this.toEditTableItem || isDelete == 'Delete') obj.id = item.clickRow;
        if (isDelete == 'Delete') obj.isDelete = true;
        obj.flowTemplateCode = item.form.code;
        obj.formTemplateCode = item.form.formTemplateList[0].code;
        obj.planType = item.planType;
        return obj;
      });
      // console.log(formTemplateBizRelevance, 'temptemptemp');
      this.$axios.post( // 删除 修改 创建
        // 'http://192.168.1.218:9999/web/formTemplateApi/relevanceBiz',
        Api.menuPlanPManage.update,
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
              form: '',
              planType: '',
              duty: ''
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
        if (this.selectDatas.length > 1) {
          this.$message.info('删除选择一个');
          return ;
        }
        this.$axios.post(Api.menuPlanPManage.delete, {
          data: { id: this.selectDatas[0].id }
        }, (res) => {
          if (res.isSuccess) {
            this.$message.success('删除成功');
            this.initTableData();
          } else {
            this.$message.error({ duration: 4000, message: res.message });
          }
        });
      }).catch(() => {

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
      this.$message.info('搜索：' + this.searchValue);
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
