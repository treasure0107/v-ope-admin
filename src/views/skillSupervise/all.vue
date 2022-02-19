<!--
 * @Author: JTune
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
              切换场站：<el-select v-model="checkStation" placeholder="请选择场站" size="mini" @change="(val)=>{initTableData(val)}">
                <el-option
                  v-for="item in StationList"
                  :key="item.id"
                  :label="item.nodeName"
                  :value="item.id">
                </el-option>
              </el-select>
              <!-- <el-button type="primary" size="small" @click="newProject">创建</el-button>
              <el-button size="small" @click="deleteClick">删除</el-button> -->
            </el-col>
            <el-col style="width:unset;">
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
      :dialogTitle="toEditTableItem ? '编辑' : '创建'"
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
            <el-col :span="24">
              <el-form-item
                label="标题："
                :label-width="formLabelWidth"
                prop="fileTitle"
              >
                <el-input
                  v-model="personForm.fileTitle"
                  maxlength="20"
                  placeholder="请输入标题"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item
                label="上传时间："
                :label-width="formLabelWidth"
                prop="uploadDate"
              >
                 <el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                  v-model="personForm.uploadDate"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                label="描述："
                :label-width="formLabelWidth"
                prop="fileDescribe"
              >
                <el-input
                  v-model="personForm.fileDescribe"
                  maxlength="20"
                  placeholder="请输入描述"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                label="上传附件："
                :label-width="formLabelWidth"
                prop="fileId"
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
                        :show-file-list="false"
                      >
                        <el-button
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
                        v-model="alerdyUloadName"
                      ></el-input>
                      <el-input v-model="personForm.fileId" v-show="false"></el-input>
                    </div>
                </div>
              </el-form-item>
            </el-col>
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
import { baseUrl } from '@/config/env';
import { localstorageGet } from '@/utils/auth';
import Api from '@/api';
const stationId = localstorageGet('stationId');
export default {
  name: '',
  components: { DyTable, DyDialog },
  data() {
    return {
      StationList: [],
      checkStation: '',
      StationIdList: [],
      stationId: localstorageGet('stationId'),
      toEditTableItem: false,
      alerdyUloadName: '',
      pdfUploading: false,
      pdfAction: `${baseUrl}web/file/api/file/uploadFile?sid=${localstorageGet('token')}&platformCode=400001`, // 默认    file/uploadFile
      uploadHeaders: {}, // { sid: localstorageGet('token') },
      fileData: {
        // platformCode: '400001',
        // sid: localstorageGet('token'),
        fileType: 'ordinaryFile'
      },
      fileList: [],
      newProjectDialogWidth: '900px',
      formLabelWidth: '130px',
      personDialogVisible: false,
      downSelect: '',
      searchValue: undefined,
      dateVal: [],
      loading: false,
      tableData: [],
      colKey: {
        fileTitle: '标题',
        createDate: '上传时间',
        createrName: '上传人',
        fileDescribe: '描述',
        fileName: '文件'
      },
      pagination: {
        pagination: true,
        total: 0,
        pages: 1,
        size: 10
      },
      multiActions: [
        {
          header: '下载',
          actions: [
            {
              width: '90px',
              label: '下载',
              action: (row) => {
                this.downloadPdf(row.fileUrl, row.fileName);
              }
            }
          ]
        }
        // {
        //   header: '操作',
        //   actions: [
        //     {
        //       width: '90px',
        //       label: '编辑',
        //       action: (row) => {
        //         this.personDialogVisible = true;
        //         this.toEditTableItem = true;
        //         this.$nextTick(function () {
        //           this.personForm.fileTitle = row.fileTitle;
        //           // this.personForm.uploadDate = row.uploadDate;
        //           this.personForm.fileDescribe = row.fileDescribe;
        //           this.personForm.fileId = row.fileId;
        //           this.alerdyUloadName = row.fileName;
        //           this.personForm.id = row.id;
        //         });
        //         // this.handleEdit(row);
        //       }
        //     }
        //   ]
        // }
      ],
      personForm: {
        fileTitle: '',
        // uploadDate: '',
        fileDescribe: '',
        fileId: '',
        relationId: stationId
      },
      personFormRules: {
        wind_power_plant: [{ required: true, message: '请输入', trigger: 'change' }],
        fileTitle: [{ required: true, message: '请输入', trigger: 'blur' }],
        fileId: [{ required: true, message: '请选择', trigger: 'blur' }],
        role: [{ required: true, message: '请选择', trigger: 'change' }],
        // uploadDate: [{ required: true, message: '请输入', trigger: 'blur' }],
        fileDescribe: [{ required: true, message: '请输入', trigger: 'change' }]
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getStationList();
  },
  mounted() {
    console.log(this.colKey.__ob__.dep);
  },
  methods: {
    getStationList() {
      // 查询场站
      this.$axios.post(
        Api.windFarmManage.getWindFarmList,
        {
          data: {
            // platformCode: '400001'
            nodeName: ''
          },
          searchArea: true,
          pagination: false
        },
        res => {
          if (res.isSuccess) {
            this.StationList = res.data;
            this.checkStation = res.data[0].id;
            this.initTableData(res.data[0].id);
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    downloadPdf(url, urlname) {
      // for (var i in [{ fileName: 'test', fileUrl: 'url' }, 98, 56]) {
      //   test('https://file.runshihua.com/files/c/100100/20210714/1b74f5bf9c9047ef9908a58f29bbc245.pdf', i);
      // }
      // const urlname = '巡检管理下载测试';
      (function test(url, urlname) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) { // 4:请求已完成，且响应已就绪
            if (xhr.status == 200) { // 200:成功
              console.log(xhr.responseText);
            } else {
              alert('文件服务器请求错误！');
            }
          }
        };
        xhr.send();
        xhr.onload = function() {
          const fileBlob = xhr.response;
          const fileUrl = URL.createObjectURL(fileBlob);
          var aElement = document.createElement('a');
          aElement.setAttribute('href', fileUrl);
          aElement.download = urlname;
          aElement.click();
          URL.revokeObjectURL(fileUrl);
          aElement = undefined;
          xhr = undefined;
        };
      })(url, urlname);
    },
    initTableData(id) {
      this.tableData = [];
      this.$axios.post(Api.file.findByRelationIdsList, {
        data: { fileTitle: this.searchValue },
        ids: [id],
        ...this.pagination
      }, (res) => {
        if (res.isSuccess) {
          this.tableData = res.data.dataList || [];
          // this.$refs.munuFlowForm.resetFields();
          // this.personDialogVisible = false;
          // this.initTableData();
          this.pagination.total = res.data.total;
        } else {
          this.$message.error({ duration: 9000, message: res.message });
        }
      });
    },
    beforeUpload(file) {
      if (!/\.pdf$/.test(file.name)) {
        this.$message.error('请上传.pdf格式文件');
        return false;
      }
      this.pdfUploading = true;
    },
    onSuccess(res, file, fileList) {
      if (res.code == 'RESP200') {
        this.personForm.fileId = res.data.id;
        this.alerdyUloadName = res.data.fileName;
        // this.personForm.contractUrl = res.data.data.absolutelyFileUrl;
        // this.$message.success(`文件上传成功`);
        this.pdfUploading = false;
      } else {
        this.$message.error({ duration: 9000, message: res.message });
        // this.$message.error(`文件上传失败,请重新上传`);
      }
    },
    onError(res, file, fileList) {
      this.$message.error(`文件上传失败，请重新上传`);
    },
    handleEdit() {

    },
    cancelPersonDialogPopup() {
      this.$refs.personForm.resetFields();
      this.personDialogVisible = false;
      this.alerdyUloadName = '';
    },
    closePersonDialogPopup() {
      this.$refs.personForm.resetFields();
      this.personDialogVisible = false;
      this.alerdyUloadName = '';
    },
    surePersonDialogPopup() {
      if (!this.toEditTableItem && this.personForm.id) {
        delete this.personForm.id;
      }
      this.$refs.personForm.validate((valid) => {
        if (valid) {
          // this.searchThatTable();
          console.log(this.personForm);
          this.create();
        } else {
          // _this.$refs.munuFlowForm.resetFields();
          // alert('error submit!!');
          return false;
        }
      });
      // this.personDialogVisible = false;
      // this.$refs.personForm.resetFields();
    },
    create() {
      this.$axios.post(Api.file.skillSuperviseCreate, {
        data: { ...this.personForm }
      }, (res) => {
        if (res.isSuccess) {
          // this.$refs.munuFlowForm.resetFields();
          this.closePersonDialogPopup();
          this.initTableData();
        } else {
          this.$message.error({ duration: 4000, message: res.message });
        }
      });
    },
    newProject() {
      this.toEditTableItem = false;
      this.personDialogVisible = true;
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
        this.$axios.post(Api.file.deleteIdsList, {
          data: {},
          ids: this.selectDatas.map(item => item.id)
        }, (res) => {
          if (res.isSuccess) {
          // this.$refs.munuFlowForm.resetFields();
            this.personDialogVisible = false;
            this.initTableData();
          } else {
            this.$message.error({ duration: 4000, message: res.message });
          }
        });
        // this.$message.success('确定');
      }).catch(() => {
        // this.$message.info('取消');
      });
    },
    handleDateChange() {

    },
    handleAdd() {

    },
    fetchData() {

    },
    selectDataEvent(val) {
      console.log(val);
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
.el-main{
  padding: 0;
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
</style>
