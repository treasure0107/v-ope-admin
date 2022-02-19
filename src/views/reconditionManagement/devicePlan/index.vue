<!--
 * @Author: JTune
 * @Date: 2021-08-13
 * @LastEditTime: 2021-12-29 11:44:27
 * @LastEditors: JTune
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
            <!-- <el-col style="width:unset;">
              <el-input
                style="width:unset;"
                size="small"
                placeholder="请输入内容"
                v-model="searchValue">
                <i slot="suffix" class="el-input__icon el-icon-search mysearch" @click="handleSearch()" title="搜索"></i>
              </el-input>&nbsp;
              <el-date-picker
                v-model="dateVal"
                @change='handleDateChange'
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="small"
                class="ml10"
              >
              </el-date-picker>
            </el-col> -->
          </el-row>
        </el-header>
        <el-main>
          <dy-table
            :keys="colKey"
            :multiActions="multiActions"
            :loading="loading"
            :fetchData="fetchData"
            :isPagination="false"
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
          ref="personForm"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="检修名称："
                :label-width="formLabelWidth"
                prop="name"
              >
                <el-input
                  v-model="personForm.name"
                  maxlength="20"
                  placeholder="请输入"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="检修负责人："
                :label-width="formLabelWidth"
                prop="user"
              >
                <el-select
                  v-model="personForm.user"
                  placeholder="请选择检修负责人"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in personList"
                    :key="JSON.stringify(item)"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="计划开始时间："
                :label-width="formLabelWidth"
                prop="startTime"
              >
                <el-date-picker
                  :picker-options="startpickerOptions"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  style="width: 100%"
                  v-model="personForm.startTime"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="计划结束时间："
                :label-width="formLabelWidth"
                prop="endTime"
              >
                <el-date-picker
                  :picker-options="startpickerOptions"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  style="width: 100%"
                  v-model="personForm.endTime"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="检修设备："
                :label-width="formLabelWidth"
                prop="device"
              >
                <el-select
                  v-model="personForm.device"
                  placeholder="请选择检修设备"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in allDevices"
                    :key="JSON.stringify(item)"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="检修状态："
                :label-width="formLabelWidth"
                prop="planType"
              >
                <el-select
                  v-model="personForm.planType"
                  placeholder="请选择检修状态"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in maintenanceCondition"
                    :key="JSON.stringify(item)"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </DyDialog>
    <DyDialog
      :visible="perviewShow"
      width="1200px"
      top="20px"
      dialogTitle="预览"
      :showSureButton="false"
      @cancelDialogPopup="cancelPerviewShow"
      @closeDialogPopup="closePerviewShow"
    >
      <div>
        <pdfShow
          :pdfURLStr="pdfUrl"
          :pdfHeight="'730px'"
          :pdfWidth="'1100px'"
        />
      </div>
    </DyDialog>
    <DyDialog
      :visible="UpLoadShow"
      :width="'500px'"
      top="300px"
      :dialogTitle="'上传'"
      @cancelDialogPopup="cancelUpLoad"
      @closeDialogPopup="closeUpLoad"
      @sureDialogPopup="sureUpLoad"
    >
        <div style="display: flex;align-items: center;">
          <div style="display:inline-block;">
            <el-upload
              ref="upload"
              :action="pdfAction"
              :data="fileData"
              accept=".pdf"
              :headers="uploadHeaders"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              @on-error="onError"
              :multiple="false"
              :limit="1"
              :auto-upload="false"
              :file-list="fileList"
              :show-file-list="false"
              :on-change="uploadOnChange"
            >
              <el-button
                slot="trigger"
                type="primary"
                :loading="pdfUploading"
                :disabled="pdfUploading"
              >选择文件</el-button>
            </el-upload>
          </div>
          <div style="flex:1;margin-left:10px;">
            <el-input
              type="text"
              placeholder="请选择文件"
              readonly
              v-model="FileNameShow"
            ></el-input>
            <el-input v-model="FileUrlSave" v-show="false"></el-input>
          </div>
      </div>
    </DyDialog>
   </div>
 </div>
</template>

<script>
import DyTable from '@/components/DyTable';
import DyDialog from '@/components/DyDialog';
import pdfShow from '@/components/PdfShow';
import { baseUrl } from '@/config/env';
import { localstorageGet } from '@/utils/auth';
import Api from '@/api';
export default {
  name: '',
  components: { DyTable, DyDialog, pdfShow },
  data() {
    return {
      startpickerOptions: {
        disabledDate(time) {
          // const seletime = time.getTime();
          // const nowdata = new Date().getTime();
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      theFileTypeId: undefined,
      theClickUploadRow: undefined,
      selectDatas: undefined,
      UpLoadShow: false,
      FileUrlSave: undefined,
      FileNameShow: '',
      pdfAction: `${baseUrl}web/file/api/file/uploadFile?sid=${localstorageGet('token')}&platformCode=400001`, // 默认    file/uploadFile
      uploadHeaders: {}, // { sid: localstorageGet('token') },
      fileData: {
        // platformCode: '400001',
        // sid: localstorageGet('token'),
        fileType: 'ordinaryFile'
      },
      pdfUploading: false,
      fileList: [],
      pdfUrl: '',
      pdfUrl1: 'https://file.runshihua.com/files/c/100100/20210714/1b74f5bf9c9047ef9908a58f29bbc245.pdf',
      perviewShow: false,
      personList: [],
      toEditTableItem: false,
      maintenanceCondition: [
        { id: 'device_yearly_inspection', name: '年检' },
        { id: 'device_500hour_inspection', name: '500小时检' },
        { id: 'device_semi_annual_inspection', name: '半年检' },
        { id: 'device_patrol_inspection', name: '巡检' },
        { id: 'device_random_inspection', name: '抽检' }
      ],
      allDevices: [],
      newProjectDialogWidth: '900px',
      formLabelWidth: '130px',
      personDialogVisible: false,
      downSelect: '',
      searchValue: '',
      dateVal: [],
      loading: false,
      tableData: [],
      colKey: {
        name: {
          label: '检修名称',
          showTooltip: true
        },
        startTime: {
          label: '计划检修开始时间',
          width: 135,
          showTooltip: true
        },
        endTime: {
          label: '计划检修结束时间',
          width: 135,
          showTooltip: true
        },
        planTypeName: {
          label: '检修状态',
          showTooltip: true
        },
        theDevice: {
          label: '检修设备',
          showTooltip: true
        },
        theUser: {
          label: '负责人',
          showTooltip: true
        },
        realsTime: {
          label: '实际检修开始时间',
          width: 135,
          showTooltip: true
        },
        realeTime: {
          label: '实际检修结束时间',
          width: 135,
          showTooltip: true
        }
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
                this.theClickUploadRow = row;
                this.fileData.fileType = 'maintenancePlan';
                this.UpLoadShow = true;
                // this.handleEdit(row);
              }
            },
            {
              width: '90px',
              label: '预览',
              action: (row) => {
                // this.perviewShow = true;
                this.handlePerviewData(row.id, 'maintenancePlan');
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
                this.theClickUploadRow = row;
                this.fileData.fileType = 'defectEliminationRecord';
                this.UpLoadShow = true;
              }
            },
            {
              width: '90px',
              label: '预览',
              action: (row) => {
                this.handlePerviewData(row.id, 'defectEliminationRecord');
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
                this.theClickUploadRow = row;
                this.fileData.fileType = 'maintenanceReport';
                this.UpLoadShow = true;
              }
            },
            {
              width: '90px',
              label: '预览',
              action: (row) => {
                this.handlePerviewData(row.id, 'maintenanceReport');
              }
            }
          ]
        },
        {
          header: '检修对比',
          actions: [
            {
              width: '90px',
              label: '上传',
              action: (row) => {
                this.theClickUploadRow = row;
                this.fileData.fileType = 'maintenanceComparison';
                this.UpLoadShow = true;
              }
            },
            {
              width: '90px',
              label: '预览',
              action: (row) => {
                this.handlePerviewData(row.id, 'maintenanceComparison');
              }
            }
          ]
        },
        {
          header: '检修操作',
          actions: [
            {
              width: '90px',
              label: '--',
              tempThis: this,
              handle: function (scope, createElement, dytableThis) {
                var planState = scope.row.planState;
                planState = planState == 'enabled' ? '开始检修' : planState == 'under_review' ? '完成检修' : planState == 'finish' ? '已完成检修' : '--';
                if (scope.row.planState == 'finish') {
                  return (
                    <span>{planState}</span>
                  );
                }
                return (
                  <el-popconfirm
                    title={'确认' + planState + '?'}
                    on-confirm={
                      () => {
                        this.tempThis.handleOperate(scope.row);
                        // this.action(scope.row);
                      }
                    }
                  >
                    <el-button
                      slot='reference'
                      type='text'
                      size='small'
                    >{planState}
                    </el-button>
                  </el-popconfirm>
                );
              },
              action: (row) => {
                // this.handleOperate(row);
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
                this.personDialogVisible = true;
                this.toEditTableItem = true;
                this.$nextTick(function () {
                  this.personForm.name = row.name;
                  this.personForm.user = row.user.id;
                  this.personForm.device = row.device.id;
                  this.personForm.startTime = row.startTime;
                  this.personForm.endTime = row.endTime;
                  this.personForm.planType = row.planType;
                  this.personForm.id = row.id;
                });
                // this.editDisplay(row);
                // this.handleEdit(row);
              }
            }
          ]
        }
      ],
      personForm: {
        endTime: null,
        name: '',
        user: '',
        startTime: null,
        planType: '',
        device: ''
      },
      personFormRules: {
        user: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        device: [{ required: true, message: '请选择设备', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        planType: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      GetwindsIds: []
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initGetwindS();
    this.initDeviceSelectAndPerson();
  },
  mounted() {
  },
  methods: {
    initGetwindS() {
      this.$axios.post( // 获取预览
        Api.windFarmManage.getRelateUserList,
        {
          data: { nodeId: this.$store.state.user.stationId }
        },
        (res) => {
          if (res.isSuccess) {
            this.GetwindsIds = res.data.map(item => item.id);
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    handleOperate(rowVal) { // 检修计划改变检修状态
      var planState = rowVal.planState;
      planState = planState == 'enabled' ? '开始检修' : planState == 'under_review' ? '完成检修' : planState == 'finish' ? '已完成检修' : '--';
      if (rowVal.planState == 'finish') {
        this.$message.info('已完成检修');
        return;
      }
      this.$axios.post(
        Api.daily.handleState,
        {
          data: { id: rowVal.id }
        },
        (res) => {
          if (res.isSuccess) {
            this.$message.success(planState);
            this.getDeviceList();
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    handlePerviewData(val, perviewItem) {
      this.$axios.post( // 获取预览
        Api.file.findByRelationIdList,
        {
          data: { relationId: val }
        },
        (res) => {
          if (res.isSuccess) {
            const findPdf = res.data.find(item => item.fileType == perviewItem);
            if (findPdf) {
              this.pdfUrl = findPdf.fileUrl || undefined;
            } else {
              this.$message.error('未上传');
              return;
            }
            if (this.pdfUrl) {
              this.perviewShow = true;
            } else {
              this.$message.error('未上传');
            }
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    uploadOnChange(file, fileList) {
      this.FileNameShow = file.name;
    },
    beforeUpload(file, fileList) {
      if (!/\.pdf$/.test(file.name)) {
        this.$message.error('请上传.pdf格式文件');
        return false;
      }
      this.pdfUploading = true;
      this.$axios.post( // 获取预览
        Api.file.findByRelationIdList,
        {
          data: { relationId: this.theClickUploadRow.id }
        },
        (res) => {
          if (res.isSuccess) {
            if (res.data.find(item => item.fileType == this.fileData.fileType)) {
              this.theFileTypeId = res.data.find(item => item.fileType == this.fileData.fileType).id;
            }
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    onSuccess(res, file, fileList) {
      if (res.code == 'RESP200') {
        // this.personForm.fileId = res.data.data.id;
        // this.FileNameShow = res.data.data.fileName;
        // this.FileUrlSave = res.data.data.fileUrl;
        this.$axios.post(
          Api.file.skillSuperviseCreate,
          {
            data: { relationId: this.theClickUploadRow.id, fileId: res.data.id, id: this.theFileTypeId || undefined }
          }, (res) => {
            if (res.isSuccess) {
              this.closeUpLoad();
              this.pdfUploading = false;
            } else {
              this.$message.error({ duration: 4000, message: res.message });
              this.pdfUploading = false;
            }
          });
      } else {
        this.$message.error({ duration: 4000, message: res.message });
        this.pdfUploading = false;
        // this.$message.error(`文件上传失败,请重新上传`);
      }
    },
    onError(res, file, fileList) {
      this.$message.error(`文件上传失败，请重新上传`);
    },
    getDeviceList() {
      this.$axios.post(
        Api.reconditionManagement.getDeviceList,
        {
          data: { node: { id: this.$store.state.user.stationId }}
        },
        res => {
          if (res.isSuccess) {
            this.tableData = res.data || [];
            this.tableData.forEach((outerItem) => {
              outerItem.theDevice = outerItem.device.name;
              outerItem.theUser = outerItem.user.name;
              outerItem.planTypeName = this.maintenanceCondition.find(item => item.id == outerItem.planType).name;
            });
            // this.pagination.total = res.total || res.data.length || 0; // .length报错
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    initDeviceSelectAndPerson() {
      this.$axios.post( // 获取供选择的设备
        // 'http://192.168.1.218:9999/web/deviceInfoApi/deviceInfo/listByNodeId',
        Api.deviceManagement.getSelectDevice,
        {
          data: { nodeId: this.$store.state.user.stationId }
        },
        (res) => {
          if (res.isSuccess) {
            this.allDevices = res.data || [];
          } else {
            this.$message.error(res.message);
          }
        }
      );
      this.$axios.post(
        Api.flowPerson.findAllByPlatformCode,
        {
          data: { customerCode: this.$store.state.user.customerCode }
        },
        res => {
          if (res.isSuccess) {
            this.personList = res.data;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    sureUpLoad() {
      this.$refs.upload.submit();
      // this.UpLoadShow = false;

      // this.FileUrlSave = undefined;
    },
    closeUpLoad() {
      this.FileNameShow = undefined;
      this.fileData.fileType = 'ordinaryFile';
      this.$refs.upload.clearFiles();
      this.UpLoadShow = false;
      this.FileUrlSave = undefined;
    },
    cancelUpLoad() {
      this.FileNameShow = undefined;
      this.fileData.fileType = 'ordinaryFile';
      this.$refs.upload.clearFiles();
      this.UpLoadShow = false;
      this.FileUrlSave = undefined;
    },
    cancelPerviewShow() {
      //   this.pdfUrl = undefined;
      this.perviewShow = false;
    },
    closePerviewShow() {
      //   this.pdfUrl = undefined;
      this.perviewShow = false;
    },
    cancelPersonDialogPopup() {
      this.personDialogVisible = false;
      this.toEditTableItem = false;
      this.$refs.personForm.resetFields();
    },
    closePersonDialogPopup() {
      this.personDialogVisible = false;
      this.toEditTableItem = false;
      this.$refs.personForm.resetFields();
    },
    surePersonDialogPopup() {
      this.$refs.personForm.validate((valid) => {
        if (valid) {
          if (new Date(this.personForm.endTime).getTime() < new Date(this.personForm.startTime).getTime()) {
            this.$message.error({ duration: 4000, message: '结束时间不能小于开始时间' });
            return false;
          }
          if (this.toEditTableItem) {
            this.devideUpdataHandle();
          } else {
            this.createHandle();
          }
        } else {
          // this.$message.error({ duration: 4000, message: '未通过' });
          return false;
        }
      });
      // this.personDialogVisible = false;
      // this.$refs.personForm.resetFields();
    },
    devideUpdataHandle() {
      this.$axios.post(
        Api.reconditionManagement.deviceUpdate,
        {
          data: {
            id: this.personForm.id,
            // node: { id: this.$store.state.user.stationId },
            user: { id: this.personForm.user },
            device: { id: this.personForm.device },
            name: this.personForm.name,
            startTime: this.personForm.startTime,
            endTime: this.personForm.endTime,
            planType: this.personForm.planType
          },
          ids: this.GetwindsIds
        },
        (res) => {
          if (res.isSuccess) {
            this.getDeviceList();
            this.closePersonDialogPopup();
            // this.personDialogVisible = false;
            // this.$refs.personForm.resetFields();
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    createHandle() {
      if (this.personForm.id) delete this.personForm.id;
      this.$axios.post(
        Api.reconditionManagement.deviceSave,
        {
          data: {
            node: { id: this.$store.state.user.stationId },
            user: { id: this.personForm.user },
            device: { id: this.personForm.device },
            name: this.personForm.name,
            startTime: this.personForm.startTime,
            endTime: this.personForm.endTime,
            planType: this.personForm.planType
          },
          ids: this.GetwindsIds
        },
        (res) => {
          if (res.isSuccess) {
            this.getDeviceList();
            this.closePersonDialogPopup();
            // this.personDialogVisible = false;
            // this.$refs.personForm.resetFields();
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    newProject() {
      this.personDialogVisible = true;
    },
    deleteClick() {
      if (this.selectDatas == undefined || this.selectDatas.length == 0) {
        this.$message.info('未选择');
        return ;
      };
      if (this.selectDatas.length > 1) {
        this.$message.info('删除选择一个');
        return ;
      };
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          Api.reconditionManagement.deviceDelete,
          {
            data: { id: this.selectDatas[0].id }
          },
          (res) => {
            if (res.isSuccess) {
              this.getDeviceList();
              // this.closePersonDialogPopup();
            // this.personDialogVisible = false;
            // this.$refs.personForm.resetFields();
            } else {
              this.$message.error(res.message);
            }
          }
        );
        // this.$message.success('确定');
      }).catch(() => {
        this.$message.info('取消');
      });
    },
    handleDateChange() {

    },
    handleAdd() {

    },
    fetchData() {
      this.getDeviceList();
      // this.tableData = [
      //   {
      //     windPowerPlant: '庚熙山',
      //     name: '张翼德',
      //     dutyName: '前锋',
      //     phone: '13900001111',
      //     devi: '检修设备',
      //     person: '负责人',
      //     redalstart: '实际检修开始时间',
      //     realEnd: '实际检修结束时间'
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
