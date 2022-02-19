<!--
 * @Author: JTune
 * @Date: 2021-09-01 11:33:42
 * @LastEditors: JTune
 * @LastEditTime: 2021-10-25 15:03:25
 * @Description: 人员信息弹窗
-->
<template>
  <div
    v-if="visible"
    class="add-person-dialog"
  >
    <!-- 添加人员弹窗 -->
    <el-dialog
      :title="personDialogTitle"
      width="700px"
      :top="'100px'"
      :visible="visible"
      :close-on-click-modal="false"
      @close="handleClose('addPersonForm')"
    >
      <el-form
        class="formContainer"
        :model="addPersonForm"
        ref="addPersonForm"
        size="small"
        :disabled="personOperate=='check' ? true : false"
      >
        <h3>基本信息</h3>
        <el-col :span="12">
          <el-form-item
            label="姓名"
            :label-width="formLabelWidth"
            prop="name"
            :rules="{
              required: true,
              message: '请输入姓名',
              trigger: 'blur'
            }"
          >
            <el-input
              v-model.trim="addPersonForm.name"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="手机号"
            :label-width="formLabelWidth"
            prop="phone"
            :rules="[
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              pattern: /^1[345789]\d{9}$/,
              message:'手机号格式有误，请重新输入',
              trigger:'blur'
            }
            ]"
          >
            <el-input
              v-model.trim="addPersonForm.phone"
              placeholder="请输入手机号码"
              :disabled="personOperate=='create' ? false : true"
            ></el-input>
          </el-form-item>
        </el-col>
        <div
          class="deputyPost"
          v-for="(item, index) in addPersonForm.userDutyVos"
          :key="index"
        >
          <div v-if="!item.isDelete">
            <h3>
              {{ item.dutyType=='1'?'主岗':'副岗' }}
              <i
                :class="item.dutyType=='2'?'el-icon-remove':''"
                style="color:#f5222d"
                @click="handleDeletePost(index)"
              ></i>
            </h3>
            <el-col :span="12">
              <el-form-item
                label="所属部门"
                :label-width="formLabelWidth"
                :prop="'userDutyVos.' + index + '.departmentId'"
                :rules="{
                required: true,
                message: '请选择部门',
                trigger: 'change'
              }"
              >
                <el-select
                  v-model="item.departmentId"
                  :disabled="item.dutyType=='1'?true:false"
                  @change="getDutyList(index)"
                >
                  <el-option
                    v-for="(departItem,i) in departmentOption"
                    :key="i"
                    :label="departItem.departmentName"
                    :value="departItem.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="岗位"
                :label-width="formLabelWidth"
                :prop="'userDutyVos.' + index + '.dutyId'"
                :rules="{
                required: true,
                message: '请选择岗位',
                trigger: 'change'
              }"
              >
                <el-select v-model="item.dutyId">
                  <el-option
                    v-for="(dutyItem,i) in dutyOption[index]"
                    :key="i"
                    :label="dutyItem.dutyName"
                    :value="dutyItem.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="部门主管"
                :label-width="formLabelWidth"
                :prop="'userDutyVos.' + index + '.departmentLeader'"
                :rules="{
                required: true,
                message: '请选择部门主管',
                trigger: 'change'
              }"
              >
                <el-select
                  v-model="item.departmentLeader"
                  @change="changeDepaetmentLeader(index)"
                >
                  <el-option
                    label="是"
                    value="2"
                  ></el-option>
                  <el-option
                    label="否"
                    value="1"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="直接上级"
                :label-width="formLabelWidth"
                :class="item.departmentLeader=='2'?'showItem':'hiddenItem'"
                :prop="'userDutyVos.' + index + '.directSuperiorId'"
                :rules="{
                required: item.departmentLeader=='2'? true:false,
                message: '请选择直接上级',
                trigger: 'change'
              }"
              >
                <el-select v-model="item.directSuperiorId">
                  <el-option
                    v-for="(superior,i) in superiorList"
                    :key="i"
                    :label="superior.dutyName +'-'+ superior.name"
                    :value="superior.userDutyId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
        </div>
        <el-button
          class="add-deputy-post"
          size="mini"
          @click="handleAddDeputyPost"
        >添加副岗</el-button>
        <h3>职业信息</h3>
        <el-col :span="12">
          <el-form-item
            label="最高学历"
            :label-width="formLabelWidth"
            prop="education"
            :rules="{
              required: true,
              message: '请选择最高学历',
              trigger: 'change'
            }"
          >
            <el-select v-model="addPersonForm.education">
              <el-option
                v-for="(educationItem,eIndex) in educationList"
                :key="eIndex"
                :label="educationItem.label"
                :value="educationItem.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="工作年限"
            :label-width="formLabelWidth"
            prop="workAge"
            :rules="{
              required: true,
              message: '请填写工作年限',
              trigger: 'blur'
            }"
          >
            <el-input
              placeholder="请输入工作年限"
              v-model.trim="addPersonForm.workAge"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- 入职资料 -->
        <!-- <el-col :span="24">
          <el-form-item
            label="入职资料"
            :label-width="formLabelWidth"
          >
            <el-button
              size="mini"
              @click="qualityVisible = true"
              :class="personOperate=='check'?'hiddenItem':'showItem'"
            >
              上传资质
            </el-button>
            <div :class="addPersonForm.certificationVos==[]?'dispNone':'showItem'">
              <el-col
                :span="12"
                v-for="(certifyItem,cIndex) in addPersonForm.certificationVos"
                :key="cIndex"
              >
                <el-image
                  style="width: 80%"
                  :src="certifyItem.certificationUrl"
                ></el-image>
                <div style="padding-left: 30%">{{certifyItem.certificationName}}</div>
              </el-col>
            </div>
          </el-form-item>
        </el-col> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        v-if="personOperate=='check'"
      >
        <el-button
          type="primary"
          @click="handleClose('addPersonForm')"
        >关 闭</el-button>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        v-else
      >
        <el-button @click="handleClose('addPersonForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addPersonForm')"
        >确 定</el-button>
      </div>
      <!-- 二级对话框-资质 -->
      <!-- <el-dialog
        width="500px"
        title="上传资质"
        :visible.sync="qualityVisible"
        append-to-body
        @close="handleCloseUpload('uploadForm')"
      >
        <el-form
          :model="uploadForm"
          ref="uploadForm"
        >
          <el-form-item
            label="资质名称"
            :label-width="formLabelWidth"
            prop="certificationName"
            :rules="{
              required: true,
              message: '请填写资质名称',
              trigger: 'blur'
            }"
          >
            <el-input v-model="uploadForm.certificationName"></el-input>
          </el-form-item>
          <el-form-item
            label="选择图片"
            :label-width="formLabelWidth"
          >
            <el-upload
              action="#"
              list-type="picture-card"
              :http-request="uploadHttpRequest"
              :on-change="(file,fileList)=>{handleChange(file,fileList)}"
              :on-remove="(file,fileList)=>{handleRemove()}"
              :auto-upload="false"
              :file-list="fileList"
              ref="file"
            >
              <i class="el-icon-plus"></i>
              <div
                slot="tip"
                class="el-upload__tip"
                style="fontSize:14px"
              >** 只能上传一张图片</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            size="small"
            @click="handleSubmitUpload"
          >
            确认添加</el-button>
        </div>
      </el-dialog> -->
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from '@/config/env';
import { localstorageGet } from '@/utils/auth';
import Api from '@/api';
export default {
  name: '',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    personOperate: {
      type: String,
      default: 'create'
    },
    departmentId: {
      type: String,
      default: ''
    },
    companyId: {
      type: String,
      default: ''
    },
    pickPersonItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    departmentOption: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      personDialogTitle: '添加人员',
      addPersonForm: {
        name: '',
        phone: '',
        userDutyVos: [
          {
            dutyType: '1',
            departmentId: this.departmentId,
            dutyId: '',
            isDelete: false,
            directSuperiorId: '',
            departmentLeader: ''
          }
          // {
          //   dutyType: '2',
          //   departmentId: '',
          //   dutyId: '',
          //   isDelete:false,
          //   directSuperiorId: '',
          //   departmentLeader: ''
          // }
        ],
        // certificationVos: [],
        education: '',
        workAge: ''
      },
      qualityVisible: false,
      uploadForm: {
        file: '',
        // 资质
        certificationName: '',
        certificationUrl: '',
        sid: localstorageGet('userToken')
      },
      imgAction: `${baseUrl}/file/uploadFile`, // 默认
      // uploadHeaders: { sid: localstorageGet('userToken') },
      fileList: [], // 缓存区文件
      formLabelWidth: '120px',
      imgDialogVisible: false,
      dialogImageUrl: '',
      qualityImgList: [],
      dutyOption: [],
      superiorList: [],
      leaderOption: [],
      educationList: [
        {
          label: '中专',
          value: '1'
        },
        {
          label: '大专',
          value: '2'
        },
        {
          label: '本科',
          value: '3'
        },
        {
          label: '硕士',
          value: '4'
        },
        {
          label: '博士',
          value: '5'
        }
      ]
    };
  },
  computed: {},
  watch: {
    // 监听属性变化
    visible(val) {
      if (val) {
        this.addPersonForm.userDutyVos[0].departmentId = this.departmentId;
        this.getDutyList(0);
      }
    },
    companyId() { },
    departmentId() {
      // 是公司领导--根据公司id查询领导部门的人员-提供直接上级数据
      this.$axios.post(
        Api.frameworkInfo.getSuperiorUserList,
        {
          data: {
            relationId: this.companyId,
            type: 'company'
          }
        },
        res => {
          this.superiorList = res.data;
        }
      );
    },
    personOperate() {
      this.setDialogTitle();
      this.initFormData();
    },
    pickPersonItem() {
      this.initFormData();
      // 查看和编辑时 要把主岗和副岗数据加载出来进行展示
      if (this.personOperate != 'create') {
        this.pickPersonItem.userDutyVos.map((item, index) => {
          this.getDutyList(index);
        });
      }
    }
  },
  created() {
  },
  mounted() {
  },
  updated() { },
  methods: {
    initFormData() {
      // 添加人员的初始化表单数据
      if (this.personOperate == 'create') {
        this.addPersonForm = {
          id: '',
          name: '',
          phone: '',
          userDutyVos: [
            {
              dutyType: '1',
              departmentId: this.departmentId,
              dutyId: '',
              isDelete: false,
              directSuperiorId: '',
              departmentLeader: ''
            }
            // {
            //   dutyType: '2',
            //   departmentId: '',
            //   dutyId: '',
            //   isDelete:false
            //   directSuperiorId: '',
            //   departmentLeader: ''
            // }
          ],
          // certificationVos: [],
          education: '',
          workAge: ''
        };
      } else {
        this.addPersonForm = this.pickPersonItem;
      }
    },
    // 根据不同部门id获取该部门下的岗位--下拉菜单--岗位
    getDutyList(index) {
      this.$axios.post(
        Api.frameworkInfo.getDeptDutyList,
        {
          data: {
            // 主岗用带入的部门id
            departmentId: this.addPersonForm.userDutyVos[index].departmentId
          }
        },
        res => {
          if (res.isSuccess) {
            this.$set(this.dutyOption, index, res.data);
            if (this.personOperate == 'create') {
              this.addPersonForm.userDutyVos[index].dutyId = '';
            } else if (this.personOperate == 'edit') {
              // 判断当前岗位id是否在岗位列表数据中存在
              const isDutyExist = res.data.some((item) => {
                return item.id == this.addPersonForm.userDutyVos[index].dutyId;
              });
              if (!isDutyExist) this.addPersonForm.userDutyVos[index].dutyId = '';
            }
          }
        }
      );
    },
    // 部门领导切换
    changeDepaetmentLeader(index) {
      if (this.addPersonForm.userDutyVos[index].departmentLeader == '1') {
        // 否-不是部门领导
        this.addPersonForm.userDutyVos[index].directSuperiorId = '';
      }
      // else if (!this.superiorList.length) {

      // }
    },
    submitForm(formName) {
      if (this.personOperate == 'check') {
        this.handleClose('addPersonForm');
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$axios.post(
              Api.frameworkInfo.saveUser,
              {
                data: {
                  id: this.addPersonForm.id,
                  name: this.addPersonForm.name,
                  companyId: this.companyId,
                  phone: this.addPersonForm.phone,
                  workAge: this.addPersonForm.workAge,
                  education: this.addPersonForm.education,
                  userDutyVos: this.addPersonForm.userDutyVos
                  // certificationVos: this.addPersonForm.certificationVos
                }
              },
              res => {
                if (res.isSuccess) {
                  const messageInfo = this.addPersonForm.id == '' ? '添加成功！' : '修改成功';
                  this.$message({
                    message: messageInfo,
                    type: res.isSuccess ? 'success' : 'warning'
                  });
                  this.$emit('update:visible', false);
                  this.$emit('getPersonInfoData');
                  this.initFormData();
                } else {
                  this.$message.error(res.message);
                }
              }
            );
          } else {
            this.$message.error('校验失败');
            return false;
          }
        });
      }
    },
    // 添加副岗
    handleAddDeputyPost() {
      this.addPersonForm.userDutyVos.push({
        dutyType: '2',
        departmentId: '',
        dutyId: '',
        isDelete: false,
        directSuperiorId: '',
        departmentLeader: ''
      });
    },
    // 删除副岗
    handleDeletePost(index) {
      if (this.addPersonForm.userDutyVos[index].id) {
        this.addPersonForm.userDutyVos[index].isDelete = true;
        this.addPersonForm.userDutyVos[index].delete = true;
      } else {
        this.addPersonForm.userDutyVos.splice(index, 1);
      }
    },
    // 关闭对话框
    handleClose(formName) {
      this.$emit('update:visible', false);
      this.initFormData();
      this.$refs[formName].resetFields();
    },
    setDialogTitle() {
      this.personDialogTitle = this.personOperate == 'create' ? '添加人员'
        : this.personOperate == 'edit' ? '修改人员信息' : '查看人员信息';
    }

    /* 上传资质 */
    /* handleChange(file, fileList) {
      this.fileList.push({
        name: file.name,
        url: file.url
      });
      //  限制单张上传，超过限制即覆盖
      if (fileList.length > 1) {
        this.fileList.splice(0, 1);
      }
      const isImage = file.raw.type.includes('image');
      if (!isImage) {
        this.$message.error('上传的格式必须是图片!');
        this.removeUploadedFile();
        return false;
      }
      //  验证通过之后，将缓存区文件存入上传区文件中
      this.uploadForm.file = file.raw;
    },
    //  从缓存区移除文件
    removeUploadedFile() {
      this.$refs.file.clearFiles();
    },
    //  删除文件
    handleRemove() {
      //  删除文件时要移除缓存区文件和上传区文件
      this.fileList = [];
      this.uploadForm.file = '';
    },
    uploadHttpRequest(param) {
      this.uploadFile = param.file;
      this.$refs.file.validateField('file', res => {
        if (res) {
          return true;
        } else {
          return false;
        }
      });
    },
    // 上传
    handleSubmitUpload() {
      //  校验是否选择文件
      if (this.fileList.length === 0) {
        this.$message('未选择任何图片!');
        return false;
      } else {
        //  使用formdata格式
        const formData = new FormData();
        formData.append('file', this.uploadForm.file);
        formData.append('platformCode', '200001');
        this.$refs.uploadForm.validate(valid => {
          if (valid) {
            this.$axios.post(this.imgAction, formData, res => {
              if (res.isSuccess) {
                this.addPersonForm.certificationVos.push({
                  certificationName: this.uploadForm.certificationName,
                  certificationUrl: res.data.fileUrl
                });
                this.$message.success('上传成功');
                this.handleRemove();
                this.handleCloseUpload('uploadForm');
              } else {
                this.$message.warning('上传失败');
              }
            }
            );
          }
        });
      }
    },
    // 关闭上传图片弹窗
    handleCloseUpload(formName) {
      this.$refs[formName].resetFields();
      this.handleRemove();
      this.qualityVisible = false;
    } */

  }
};
</script>

<style scoped lang="scss">
.add-person-dialog {
  background-color: #fff;
  .formContainer {
    min-height: 400px;
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  h3 {
    margin-bottom: 20px;
  }
  .add-deputy-post {
    margin: 20px 45%;
  }
  .showItem {
    visibility: visible;
  }
  .hiddenItem {
    visibility: hidden;
  }
  .dispNone {
    display: none;
  }
  .el-icon-remove {
    cursor: pointer;
  }
}
</style>
