<!--
 * @Author: JTune
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\roleManagement\index.vue
-->
<template>
 <div>
   <div id="daily">
     <el-container>
        <el-header style="height:45px;">
          <el-row type="flex" justify="space-between" align="middle" style="height:100%">
            <el-col style="width:unset;">
              <el-button type="primary" size="small" @click="newProject">创建</el-button>
              <!-- <el-button size="small" @click="deleteClick">删除</el-button> -->
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
            :loading="loading"
            :multiActions="multiActions"
            :fetchData="fetchData"
            :isPagination="true"
            :pagination="pagination"
            :list="tableData"
            :showCheckBox="true"
            @selectDataEvent="selectDataEvent"
            @rowClick="handleRowCheck"
          >
          </dy-table>
        </el-main>
     </el-container>
    <DyDialog
      :visible="personDialogVisible"
      :width="newProjectDialogWidth"
      :dialogTitle="isEditDialog ?  '编辑' : '创建'"
      @cancelDialogPopup="cancelPersonDialogPopup"
      @closeDialogPopup="closePersonDialogPopup"
      @sureDialogPopup="surePersonDialogPopup"
      top="10px"
      :showSureButton="!noEditAndNoTitle"
      :showTitle="!noEditAndNoTitle"
    >
      <el-button
        v-if="noEditAndNoTitle"
        class="print-btn"
        style="margin-left:10px;margin-bottom:5px"
        type="primary"
        size="small"
        v-print="'#formContainer'"
      >打 印</el-button>
      <div style="height:720px;overflow-y:scroll" >
        <div id="formContainer">
          <fm-generate-form
            :data="jsonData"
            :edit="!noEditAndNoTitle"
            ref="generateForm"
            style="margin-left:0px"
          >
          </fm-generate-form>
        </div>
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
   </div>
 </div>
</template>

<script>
import DyTable from '@/components/DyTable';
import DyDialog from '@/components/DyDialog';
import Api from '@/api';
import { localstorageGet } from '@/utils/auth';
import store from '@/store';
import { baseUrl } from '@/config/env';
import pdfShow from '@/components/PdfShow';
const stationId = localstorageGet('stationId');
const testStation = store.state.user.stationId;
export default {
  name: '',
  components: { DyTable, DyDialog, pdfShow },
  data() {
    return {
      noEditAndNoTitle: false,
      isRightDuty: false,
      perviewShow: false,
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
      isEditDialog: false,
      nowEditdataId: '',
      clickStationButton: '',
      jsonData: undefined,
      stationId: this.$store.state.user.stationId,
      newProjectDialogWidth: '1100px',
      formLabelWidth: '130px',
      personDialogVisible: false,
      downSelect: '',
      searchValue: '',
      test: testStation,
      dateVal: [],
      loading: false,
      tableData: [],
      colKey: {
        updateDate: '巡视时间',
        nodeName: '巡视人'
      },
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      multiActions: [
        // {
        //   header: '巡检记录',
        //   actions: [
        //     {
        //       width: '90px',
        //       label: '预览',
        //       action: (row) => {
        //         this.handleEdit(row);
        //       }
        //     }
        //   ]
        // },
        {
          header: '巡检报告',
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
                this.theClickUploadRow = row;
                if (!row.task) {
                  this.$message.error('forthend:无data.task');
                  return;
                }
                if (!row.task.id) {
                  this.$message.error('forthend:无data.task.id');
                  return;
                }
                this.handlePerviewData(row.task.id, 'maintenanceReport');
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
                this.isEditDialog = true;
                this.nowEditdataId = row.formData.dataId;
                this.getFormJson(row.form.code);
                setTimeout(() => {
                  this.getFormDate(row.formData.dataId);
                }, 100);
              }
            }
          ]
        }],
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
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1[345789]\d{9}$/,
            message: '您输入的手机号码格式有误，请重新输入',
            trigger: 'blur'
          }
        ],
        superior: [{ required: true, message: '请选择直属上级', trigger: 'change' }],
        match: 'dd'

      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.initSearchData();
  },
  mounted() {
  },
  methods: {
    handleRowCheck(row) {
      this.noEditAndNoTitle = true;
      row = row.row;
      this.isEditDialog = true;
      this.nowEditdataId = row.formData.dataId;
      this.getFormJson(row.form.code);
      setTimeout(() => {
        this.getFormDate(row.formData.dataId);
      }, 100);
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
      if (!this.theClickUploadRow.task) {
        this.$message.error('forthend:无data.task');
        return;
      }
      if (!this.theClickUploadRow.task || !this.theClickUploadRow.task.id) {
        this.$message.error('forthend:无task.id');
        return;
      }
      this.pdfUploading = true;
      this.$axios.post( // 获取预览
        Api.file.findByRelationIdList,
        {
          data: { relationId: this.theClickUploadRow.task.id }
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
        this.$axios.post(
          Api.file.skillSuperviseCreate,
          {
            data: { relationId: this.theClickUploadRow.task.id, fileId: res.data.id, id: this.theFileTypeId || undefined }
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
    sureUpLoad() {
      this.$refs.upload.submit();
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
      // this.pdfUrl = undefined;
      this.perviewShow = false;
    },
    closePerviewShow() {
      // this.pdfUrl = undefined;
      this.perviewShow = false;
    },
    getFormDate(val) {
      this.$axios.post(
        Api.daily.getFormData,
        {
          data: {
            dataId: val
          }
        },
        res => {
          if (res.isSuccess) {
            this.$refs.generateForm.setData(res.data.data.data);
            // this.jsonData = JSON.parse(res.data.templateData);
            // this.$refs.generateForm.refresh();
          }
        }
      );
    },
    getFormJson(val) {
      if (!val) return;
      this.$axios.post(
        Api.form.findById,
        {
          data: {
            code: val
          }
        },
        res => {
          if (res.isSuccess) {
            this.jsonData = JSON.parse(res.data.templateData);
            // this.$refs.generateForm.refresh();
            this.personDialogVisible = true;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    initSearchData() {
      this.$axios.post(
        Api.daily.searchInit,
        {
          data: {
            // node: { id: stationId },
            planType: 'three_data_report_everyday',
            nodeIds: [stationId]
          }
        },
        res => {
          if (res.isSuccess) {
            // if (res.data) this.tableData = res.data.map(item => item.node);
            if (res.data) {
              const temp = res.data;
              temp.forEach(item => {
                item.updateDate = item.createDate;
                item.nodeName = item.node.nodeName;
              });
              this.tableData = temp;
            }
            if (res.data) this.pagination.total = res.total || res.data.length;
            // res.data.canReport && this.getFormJson(res.data.form.id);
          } else {
            this.$message.error({ duration: 4000, message: res.message });
          }
        }
      );
    },
    handleEdit() {

    },
    cancelPersonDialogPopup() {
      this.noEditAndNoTitle = false;
      this.personDialogVisible = false;
      this.$refs.generateForm.reset();
      this.isEditDialog = false;
    },
    closePersonDialogPopup() {
      this.noEditAndNoTitle = false;
      this.personDialogVisible = false;
      this.$refs.generateForm.reset();
      this.isEditDialog = false;
    },
    async surePersonDialogPopup() {
      const formData = await this.$refs.generateForm.getData();
      this.createItem(formData);
    },
    createItem(val) {
      if (this.isEditDialog) {
        this.$axios.post(
          Api.daily.saveFormData,
          {
            data: {
              dataId: this.nowEditdataId,
              data: { data: val }
            }
          },
          res => {
            if (res.isSuccess) {
              this.personDialogVisible = false;
              this.$refs.generateForm.reset();
              this.initSearchData();
            } else {
              this.$message.error(res.message);
            }
          }
        );
      } else {
        this.$axios.post(
          Api.daily.create,
          {
            data: {
              id: this.clickStationButton.id,
              formData: { data: { data: val }}
            }
          },
          res => {
            if (res.isSuccess) {
              this.personDialogVisible = false;
              this.$refs.generateForm.reset();
              this.initSearchData();
            } else {
              this.$message.error(res.message);
            }
          }
        );
      }
    },
    newProject() {
      this.$axios.post(
        Api.frameworkInfo.getUserDetail,
        { data: { id: this.$store.state.user.userId, flag: 'company' }},
        (res) => {
          if (res.isSuccess) {
            const allDutyIds = res.data.userDutyVos.map(item => item.dutyId);
            this.openCreate(allDutyIds);
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    openCreate(getdutyId) {
      this.$axios.post(
        Api.daily.getFormJsonBystationIdandType,
        {
          data: {
            planType: 'three_data_report_everyday',
            node: { id: stationId }
          }
        },
        res => {
          if (res.isSuccess) {
            if (!getdutyId.some(item => item == res.data.duty.id)) {
              this.$message.error('当前用户岗位无法创建，请在计划管理中配置岗位再创建');
              return;
            }
            if (res.data.form) {
              this.jsonData = JSON.parse(res.data.form.templateData);
              this.clickStationButton = res.data;
              this.personDialogVisible = true;
              return;
            }
            this.$message.error('无formTemplateData');
            // this.$refs.generateForm.refresh();
          } else {
            this.$message.error(res.message);
          }
        }
      );
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
      // this.tableData = [
      //   {
      //     windPowerPlant: '电厂名称',
      //     name: '日期',
      //     dutyName: '值班人',
      //     phone: '当值班长',
      //     sdf: '接班值长'
      //   }
      // ];
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
<style lang="scss" scoped>
@media print {
  #formContainer {
    max-width: 1055px;
    ::v-deep input {
      border: none;
      outline: none;
    }
    ::v-deep textarea {
      border: none;
      padding: 0;
    }
    // 默认栅格布局下的input框带下划线
    ::v-deep .el-row--flex .el-input .el-input__inner {
      border-bottom: 1px solid #999999;
      border-radius: 0;
    }
    // 栅格布局下的input框不要下划线
    ::v-deep .el-row--flex .el-form-item.noBorder .el-input .el-input__inner {
      border: none;
    }
    // 打印时隐藏placeholder内容
    ::v-deep input::placeholder {
      visibility: hidden;
    }
    ::v-deep input::-webkit-input-placeholder {
      visibility: hidden;
    }

    ::v-deep input::-moz-placeholder {
      visibility: hidden;
    }

    ::v-deep input:-ms-input-placeholder {
      visibility: hidden;
    }
  }
  .print-btn {
    display: none;
  }
  .message {
    display: none;
  }
}

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

::v-deep .noBorder {
  .el-input input {
    outline: none !important;
    border: none;
    padding: 0 !important;
    margin: 0;
  }
  textarea {
    border: none;
    padding: 0 !important;
  }
}
#formOperate {
  .topConfig {
  margin-bottom: 20px;
    .text {
      font-size: 14px;
    }
    .el-select {
      margin-right: 5px;
    }
  }
  .title {
    background-color:#fafafa;
    font-size:14px;
    line-height:45px;
    text-indent: 1rem;
    border-bottom: 1px solid #ddd;
  }
  .bottomBtn {
    margin: 15px 0 0 10px;
  }
}
</style>
