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
            <el-col style="width:unset;">
              <el-button type="primary" size="small" @click="newProject">创建</el-button>
              <el-button size="small" @click="deleteClick">删除</el-button>
            </el-col>
            <el-col style="width:unset;">
              <el-input
                style="width:unset;"
                size="small"
                placeholder="请输入设备名称"
                v-model="searchValue"
                @keyup.enter.native="handleSearch()">
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
      :dialogTitle="toEditTableItem ?  '编辑' : '创建'"
      @cancelDialogPopup="cancelPersonDialogPopup"
      @closeDialogPopup="closePersonDialogPopup"
      @sureDialogPopup="surePersonDialogPopup"
    >
      <div>
        <el-form
          :model="personForm"
          :rules="personFormRules"
          ref="thatForm"
        >
        <el-row :gutter="10" justify="center" style="margin-right:20px">
            <el-form-item
                label="电压等级："
                :label-width="formLabelWidth"
                prop="voltageLevelName"
              >
                <el-select
                  size="small"
                  v-model="personForm.voltageLevelName"
                  placeholder="请选择电压等级"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in voltageLevel"
                    :key="JSON.stringify(item)"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
          </el-row>
          <el-row :gutter="10" justify="center" style="margin-right:20px">
            <el-form-item
                label="设备名称："
                :label-width="formLabelWidth"
                prop="deviceIds"
              >
                <el-select
                  multiple
                  size="small"
                  v-model="personForm.deviceIds"
                  placeholder="请选择设备名称"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in allDevice"
                    :key="JSON.stringify(item)"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
          </el-row>
          <template v-for="(outItem,index) in personForm.deviceStatus">
            <el-row :key="index" :gutter="10" justify="center" style="margin-right:20px">
              <el-col :span="9">
                <el-form-item
                  label="对应表单："
                  :label-width="formLabelWidth"
                  :prop="`deviceStatus.${index}.resourceId`"
                  :rules="{required: true,message: '请选择',trigger: 'blur'}"
                >
                  <el-select
                    size="small"
                    v-model="outItem.resourceId"
                    placeholder="请选择"
                    style="width: 100%"
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
              <el-col :span="7">
                <el-form-item
                  :prop="`deviceStatus.${index}.deviceStatusName`"
                  :rules="{required: true,message: '请选择',trigger: 'blur'}"
                >
                  <el-select
                    size="small"
                    v-model="outItem.deviceStatusName"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in deviceStatus"
                      :key="JSON.stringify(item)"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  :prop="`deviceStatus.${index}.flowCode`"
                  :rules="{required: true,message: '请选择',trigger: 'blur'}"
                >
                  <el-select
                    size="small"
                    v-model="outItem.flowCode"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in flowSelect"
                      :key="JSON.stringify(item)"
                      :label="item.flowName"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            <span v-if="!toEditTableItem && personForm.deviceStatus.length > 1" title="删除" style="line-height:40px;font-size:large;" class="el-icon-remove removeRow" @click="removeRow(index)"></span>
            </el-row>
          </template>
          <el-row :gutter="10" justify="center" style="margin-right:20px">
            <div v-if="!toEditTableItem" class="addIcon" @click="addRow">+ 添加</div>
          </el-row>
          <el-row :gutter="10" justify="center" style="margin-right:20px">
            <el-form-item
                label="序号："
                :label-width="formLabelWidth"
                prop="sort"
              >
                <el-input
                  size="small"
                  v-model.number="personForm.sort"
                  maxlength="20"
                  placeholder="请输入序号"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
          </el-row>
        </el-form>
      </div>
    </DyDialog>
   </div>
 </div>
</template>

<script>
import DyTable from '@/components/DyTable';
import DyDialog from '@/components/DyDialog';
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
      allDevice: [],
      voltageLevel: ['220kv', '110kV', '35kv', '0.4kv', '全场送电', '全场停电', '其他'],
      deviceStatus: ['检修转冷备', '检修转热备', '检修转运行', '冷备转检修', '冷备转热备', '冷备转运行', '热备转检修', '热备转冷备', '热备转运行', '运行转检修', '运行转冷备', '运行转热备'],
      flowSelect: [],
      menuTree: [],
      newProjectDialogWidth: '900px',
      formLabelWidth: '130px',
      personDialogVisible: false,
      downSelect: '',
      searchValue: undefined,
      dateVal: [],
      loading: false,
      tableData: [],
      colKey: {
        sort: '序号',
        deviceCodes: '设备编码',
        voltageLevelName: '电压等级',
        deviceName: '设备名称'
      },
      pagination: {
        pagination: true,
        total: 0,
        pages: 1,
        size: 10
      },
      multiActions: [
        {
          header: '操作',
          actions: [
            {
              width: '90px',
              label: '编辑',
              action: (row) => {
                // this.$refs.thatForm ? this.$refs.thatForm.resetFields() : console.log();;
                // console.log(row, 'rowrow');
                this.personDialogVisible = true;
                this.toEditTableItem = true;
                this.editDisplay(row);
              }
            }
          ]
        }
      ],
      personForm: {
        voltageLevelName: '',
        deviceIds: [],
        deviceStatus: [{ resourceId: '', deviceStatusName: '', flowCode: '' }],
        sort: undefined
      },
      personFormRules: {
        voltageLevelName: [{ required: true, message: '请选择电压等级', trigger: 'change' }],
        deviceIds: [{ required: true, message: '请选择设备名称', trigger: 'change' }],
        deviceStatus: [{ required: true, message: '请选择岗位', trigger: 'change' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'change' }, { type: 'number', message: '必须为数字值', trigger: 'change' }]

      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initSelectData();
  },
  mounted() {

  },
  methods: {
    editDisplay(val) {
      this.$axios.post( // 编辑回显数据查询
        Api.deviceManagement.editSearch,
        {
          data: { id: val.id }
        },
        (res) => {
          if (res.isSuccess) {
            const row = res.data || [];
            this.personForm.voltageLevelName = row.voltageLevelName;
            this.personForm.deviceIds = row.deviceIds;
            this.personForm.sort = row.sort;
            this.personForm.id = val.id;
            row.deviceStatus.forEach((item, index) => {
              if (index > 0) { this.personForm.deviceStatus.push({ resourceId: '', deviceStatusName: '', flowCode: '' }); }
              this.personForm.deviceStatus[index].resourceId = row.deviceStatus[index].resourceId;
              this.personForm.deviceStatus[index].deviceStatusName = row.deviceStatus[index].deviceStatusName;
              this.personForm.deviceStatus[index].flowCode = row.deviceStatus[index].flowCode;
            });
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    initSelectData() {
      this.$axios.post( // 获取供选择的设备
        // 'http://192.168.1.218:9999/web/deviceInfoApi/deviceInfo/listByNodeId',
        Api.deviceManagement.getSelectDevice,
        {
          data: { nodeId: this.stationId }
        },
        (res) => {
          if (res.isSuccess) {
            this.allDevice = res.data || [];
          } else {
            this.$message.error(res.message);
          }
        }
      );
      this.$axios.post( // 获取流程下拉选择
        // 'http://192.168.1.218:9999/web/flowTemplateApi/list',
        Api.deviceManagement.getFlowSelect,
        {
          data: {},
          formTemplateBizRelevance: { stationId: this.$store.state.user.stationId },
          platformCode: '400001'
        },
        (res) => {
          if (res.isSuccess) {
            this.flowSelect = res.data || [];
            // this.$message.success(`成功`);
          } else {
            this.$message.error({ duration: 9000, message: res.message });
          }
        }
      );

      this.$axios.post( // 获取菜单下拉选择
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
                if (el.href == '/home' || el.type == 'top' || !el.isShow || el.children.length > 0 || el.href != '/depotManagement/operationTicketManagement') newdata.pop();
                (el.children) && (el.children.length > 0) ? fn(el.children) : console.log();
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
      this.personForm.deviceStatus.push({ resourceId: '', deviceStatusName: '', flowCode: '' });
    },
    removeRow(index) {
      if (this.personForm.deviceStatus.length == 1) {
        this.$message.info('只有一条数据');
        return;
      }
      this.personForm.deviceStatus.splice(index, 1);
    },
    handleEdit() {

    },
    cancelPersonDialogPopup() {
      this.$refs.thatForm.resetFields();
      // this.$nextTick(function () {
      //   this.$refs.thatForm.resetFields();
      // });
      // this.personForm = {
      //   voltageLevelName: '',
      //   deviceIds: [],
      //   deviceStatus: [{ resourceId: '', deviceStatusName: '', flowCode: '' }],
      //   sort: ''
      // };
      this.personDialogVisible = false;
      this.personForm.deviceStatus = [{ resourceId: '', deviceStatusName: '', flowCode: '' }];
    },
    closePersonDialogPopup() {
      this.$refs.thatForm.resetFields();
      // this.$nextTick(function () {
      //   this.$refs.thatForm.resetFields();
      // });
      // this.personForm = {
      //   voltageLevelName: '',
      //   deviceIds: [],
      //   deviceStatus: [{ resourceId: '', deviceStatusName: '', flowCode: '' }],
      //   sort: ''
      // };
      this.personDialogVisible = false;
      this.personForm.deviceStatus = [{ resourceId: '', deviceStatusName: '', flowCode: '' }];
    },
    surePersonDialogPopup() {
      this.$refs.thatForm.validate((valid) => {
        if (valid) {
          // this.$message.info('sjdfois');
          this.createOrEdit();
          // this.personDialogVisible = false;
        } else {
          // this.$message.error({ duration: 9000, message: '未通过' });
          return false;
        }
      });
      // this.$refs.thatForm.resetFields();
    },
    createOrEdit() {
      if (this.toEditTableItem) {
        const tpmObj = { ...this.personForm, nodeId: this.stationId };
        this.$axios.post( // 修改编辑
          // 'http://192.168.1.218:9999/web/deviceInfoApi/deviceStatusRefFlow/update',
          Api.deviceManagement.edit,
          {
            data: { ...tpmObj }
          },
          (res) => {
            if (res.isSuccess) {
              this.$message.success(`编辑成功`);
              this.personForm.deviceStatus = [{ resourceId: '', deviceStatusName: '', flowCode: '' }];
              this.personDialogVisible = false;
              this.searchTableData(this.searchValue);
            } else {
              this.$message.error(res.message);
            }
          }
        );
      } else {
        if (this.personForm.id) delete this.personForm.id;
        const tpmObj = { ...this.personForm, nodeId: this.stationId };
        this.$axios.post( // 创建保存
          // 'http://192.168.1.218:9999/web/deviceInfoApi/deviceStatusRefFlow/save',
          Api.deviceManagement.create,
          {
            data: { ...tpmObj }
          },
          (res) => {
            if (res.isSuccess) {
              this.$message.success(`创建成功`);
              this.personForm.deviceStatus = [{ resourceId: '', deviceStatusName: '', flowCode: '' }];
              this.personDialogVisible = false;
              this.searchTableData(this.searchValue);
            } else {
              this.$message.error(res.message);
            }
          }
        );
      }
    },
    newProject() {
      this.personDialogVisible = true;
      this.toEditTableItem = false;
      // this.$nextTick(function () {
      //   this.$refs.munuFlowForm.resetFields();
      // });
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
        const ids = this.selectDatas.map(item => item.id);
        this.$axios.post( // 删除
          // 'http://192.168.1.218:9999/web/deviceInfoApi/deviceStatusRefFlow/delete',
          Api.deviceManagement.delete,
          {
            data: {},
            ids
          },
          (res) => {
            if (res.isSuccess) {
              this.$message.success(`删除成功`);
              this.searchTableData(this.searchValue);
            } else {
              this.$message.error({ duration: 9000, message: res.message });
            }
          }
        );
      }).catch(() => {
        this.$message.info('取消');
      });
    },
    handleDateChange() {

    },
    handleAdd() {

    },
    fetchData() {
      this.searchTableData(this.searchValue);
    },
    searchTableData(deviceName = undefined) {
      this.$axios.post( // 获取table列表
        // 'http://192.168.1.218:9999/web/deviceInfoApi/deviceStatusRefFlow/list',
        Api.deviceManagement.initTable,
        {
          data: { nodeId: this.stationId, deviceName },
          pagination: true,
          current: this.pagination.pages,
          size: this.pagination.size
        },
        (res) => {
          if (res.isSuccess) {
            this.tableData = res.data;
            this.pagination = { ...this.pagination, total: res.total, pages: res.current, size: res.size };
            // console.log(this.menuTree, 'newdata');
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    selectDataEvent(val) {
      this.selectDatas = val;
    },
    configHeader(val) {
      this.drawerVisible = true;
    },
    handleSearch() {
      // this.$message.info('搜索：' + this.searchValue);
      this.searchTableData(this.searchValue);
    }
  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.addIcon{
    user-select: none;
    width: 81%;
    height: 31px;
    text-align: center;
    margin: 0px 0 22px 145px;
    border: 1px dashed #303133;
    line-height: 31px;
    border-radius: 10px;
}
.addIcon:hover{
    background-color: #e6f7ff;
}
.addIcon:active{
    zoom: 0.98;
    background-color: #e6f7ff;
}
.removeRow:hover{
  color:red;
  zoom:1.1;
}
.removeRow:active{
  color:gray;
}
::v-deep .el-header{
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0;
}
.mysearch:hover{
  color: red;
}
.mysearch:active{
  color: transparent;
}
.el-main{
  padding: 0;
}
</style>
