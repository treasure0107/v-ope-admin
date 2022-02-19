<!--
 * @Author: JTune
 * @Date: 2021-08-12 11:12:36
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-28 16:19:18
 * @Description: 待发事项
-->
<template>
  <div class="wind-farm-container">
    <div>
      <div class="operateSearch">
        <div class="operate">
          <el-button
            type="primary"
            size="small"
            @click="handleCreate"
          >创建场站</el-button>
        </div>
        <div class="search">
          <el-input
            style="width:200px;margin-right:5px"
            size="small"
            v-model.trim="searchKey"
            @keyup.enter.native="getWindFarmList"
            placeholder="请输入搜索风场名称"
          >
            <i
              slot="suffix"
              style="cursor:pointer"
              @click="getWindFarmList"
              class="el-input__icon el-icon-search"
            ></i>
          </el-input>
        </div>
      </div>
      <dy-table
        :keys="colKey"
        :multiActions="multiActions"
        :loading="loading"
        :fetchData="fetchData"
        :isPagination="true"
        :pagination="pagination"
        :list="tableData"
      >
      </dy-table>
      <DyDialog
        :dialogTitle="dialogTitle"
        :visible.sync="dialogVisible"
        :width="'800px'"
        @cancelDialogPopup="handleClose('windFarmForm')"
        @closeDialogPopup="handleClose('windFarmForm')"
        @sureDialogPopup="handleCreateSubmit('windFarmForm')"
      >
        <el-form
          :model="windFarmForm"
          :rules="rules"
          ref="windFarmForm"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="风电场名称"
                :label-width="formLabelWidth"
                prop="windFarmName"
              >
                <el-input
                  placeholder="风电场名称"
                  v-model.trim="windFarmForm.windFarmName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="场站编码"
                :label-width="formLabelWidth"
                prop="nodeCode"
              >
                <el-input
                  placeholder="场站编码"
                  v-model.trim="windFarmForm.nodeCode"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item
                label="所属区域："
                :label-width="formLabelWidth"
                prop="areaInfo"
              >
                <div>
                  <el-select
                    placeholder="选择省份"
                    v-model="windFarmForm.provinceInfo"
                    @change="handleProvinceChange"
                  >
                    <el-option
                      v-for="(province) in provinceOptions"
                      :key="province.id"
                      :label="province.areaName"
                      :value="province.areaName + '_' + province.areaCode"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="windFarmForm.cityInfo"
                    @change="handleCityChange"
                  >
                    <el-option
                      v-for="(city) in cityOptions"
                      :key="city.id"
                      :label="city.areaName"
                      :value="city.areaName + '_' + city.areaCode"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="windFarmForm.countyInfo"
                    @change="handleCountyChange"
                  >
                    <el-option
                      v-for="(county) in countyOptions"
                      :key="county.id"
                      :label="county.areaName"
                      :value="county.areaName + '_' + county.areaCode"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="装机容量"
                :label-width="formLabelWidth"
                prop="capacity"
              >
                <el-input
                  placeholder="装机容量"
                  v-model.trim="windFarmForm.capacity"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="详细地址"
                :label-width="formLabelWidth"
                prop="address"
              >
                <el-input
                  placeholder="地址"
                  v-model.trim="windFarmForm.address"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </DyDialog>
    </div>
  </div>
</template>
<script>
import DyTable from '@/components/DyTable';
import DyDialog from '@/components/DyDialog';
import { localstorageGet } from '@/utils/auth';
import Api from '@/api';

export default {
  name: '',
  components: { DyTable, DyDialog },
  data() {
    // 自定义城市验证规则
    var areaRule = (rule, value, callback) => {
      // value 就是 验证那个字段 为空 或者 selectCityValue 为空 验证都不会通过
      if (this.windFarmForm.provinceInfo == '' && this.windFarmForm.cityInfo == '' && this.windFarmForm.countyInfo == '') {
        return callback(new Error('请选择所属区域'));
      } else {
        callback();
      }
    };
    return {
      isClick: false,
      dialogTitle: '弹窗标题',
      dialogVisible: false,
      formLabelWidth: '100px',
      loading: false,
      tableData: [],
      formOperate: 'create',
      isAdd: false,
      searchKey: '',
      selectDatas: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      windFarmId: '',
      provinceText: '',
      provinceCode: '',
      cityText: '',
      cityCode: '',
      countyText: '',
      countyCode: '',
      // 区域选择
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],
      colKey: {
        nodeName: '风场名称',
        zjrl: '装机容量',
        address: {
          label: '地址',
          width: '350px'
        },
        fullAreaText: {
          label: '所属区域',
          width: '300px'
        },
        nodeCode: '风场编码'
      },
      multiActions: [
        {
          header: '操作',
          actions: [
            {
              width: '90px',
              label: '编 辑',
              action: (row) => {
                this.handleEdit(row);
              }
            },
            {
              width: '90px',
              label: '删 除',
              clas: 'danger',
              action: (row) => {
                this.handleDelete(row);
              }
            }
          ]
        }
      ],
      windFarmForm: {
        windFarmName: '',
        capacity: '',
        address: '',
        provinceInfo: '',
        cityInfo: '',
        countyInfo: '',
        nodeCode: ''
      },
      rules: {
        windFarmName: [
          {
            required: true,
            message: '请填写风场名称',
            trigger: 'blur'
          }
        ],
        capacity: [
          {
            required: true,
            message: '请填写装机容量',
            trigger: 'blur'
          }
          // {
          //   pattern: /^\d+(\.\d{1,2})?$/,
          //   message: '最多只能有两位小数',
          //   trigger: 'blur'
          // }
        ],
        address: [
          {
            required: true,
            message: '请填写风场地址',
            trigger: 'blur'
          }
        ],
        nodeCode: [
          {
            required: true,
            message: '请填写风场名称',
            trigger: 'blur'
          }
        ],
        areaInfo: [
          {
            required: true,
            validator: areaRule,
            trigger: 'change'
          }
        ]
      }
    };
  },
  props: {
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.getArea();
  },
  methods: {
    fetchData() {
      this.getWindFarmList();
    },
    // 编辑
    handleEdit(row) {
      this.dialogTitle = '修改风场信息';
      this.dialogVisible = true;
      this.isAdd = false;
      this.windFarmId = row.id;
      this.windFarmForm = {
        windFarmName: row.nodeName,
        capacity: row.zjrl,
        address: row.address,
        area: row.fullAreaText,
        nodeCode: row.nodeCode
      };
      this.windFarmForm.provinceInfo = row.areaProvinceText + '_' + row.areaProvince;
      this.provinceCode = row.areaProvince;
      this.windFarmForm.cityInfo = row.areaCityText + '_' + row.areaCity;
      this.cityCode = row.areaCity;
      this.windFarmForm.countyInfo = row.areaDistrictText + '_' + row.areaDistrict;
      this.countyCode = row.areaDistrict;
      this.handleProvinceChange();
      this.handleCityChange();
      this.handleCountyChange();
    },
    // 创建
    handleCreate() {
      this.dialogTitle = '添加风电场';
      this.dialogVisible = true;
      this.isAdd = true;
    },
    // 查询省区域数据
    getArea() {
      this.$axios.post(
        Api.windFarmManage.getProvince,
        {
          data: {
          }
        },
        res => {
          if (res.isSuccess) {
            this.provinceOptions = res.data;
          }
        }
      );
    },
    // 查询风场列表
    getWindFarmList() {
      this.$axios.post(
        Api.windFarmManage.getWindFarmList,
        {
          data: {
            nodeName: this.searchKey
          },
          platformCode: localstorageGet('platformCode'),
          searchArea: true,
          current: this.pagination.pages,
          pagination: true,
          size: this.pagination.size
        },
        res => {
          if (res.isSuccess) {
            this.tableData = res.data;
            this.pagination.total = res.total;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    handleProvinceChange() {
      this.provinceText = this.windFarmForm.provinceInfo.split('_')[0];
      this.provinceCode = this.windFarmForm.provinceInfo.split('_')[1];
      this.cityText = '';
      this.cityCode = '';
      this.countyText = '';
      this.countyCode = '';
      this.$axios.post(
        Api.windFarmManage.getCity,
        {
          data: {
            areaCode: this.provinceCode
          }
        },
        res => {
          if (res.isSuccess) {
            this.cityOptions = res.data;
            if (this.isAdd) {
              this.windFarmForm.cityInfo = '';
              this.windFarmForm.countyInfo = '';
            } else {
              const isCityExist = res.data.some((item) => {
                return item.areaCode == this.cityCode;
              });
              if (!isCityExist) {
                this.windFarmForm.cityInfo = '';
                this.windFarmForm.countyInfo = '';
              }
            }
          }
        }
      );
    },
    handleCityChange() {
      this.cityText = this.windFarmForm.cityInfo.split('_')[0];
      this.cityCode = this.windFarmForm.cityInfo.split('_')[1];
      this.countyText = '';
      this.countyCode = '';
      this.$axios.post(
        Api.windFarmManage.getCounty,
        {
          data: {
            areaCode: this.cityCode
          }
        },
        res => {
          if (res.isSuccess) {
            this.countyOptions = res.data;
            if (this.isAdd) {
              this.windFarmForm.countyInfo = '';
            } else {
              const isCountyExist = res.data.some((item) => {
                return item.areaCode == this.countyCode;
              });
              if (!isCountyExist) {
                this.windFarmForm.countyInfo = '';
              }
            }
          }
        }
      );
    },
    handleCountyChange(val) {
      if (val) {
        // console.log(val);
        this.$set(this.windFarmForm, this.windFarmForm.countyInfo, val);
      } else {
        // console.log('kong');
        // this.$set(this.factoryForm, this.windFarmForm.countyInfo, '');
      }
      this.countyText = this.windFarmForm.countyInfo.split('_')[0];
      this.countyCode = this.windFarmForm.countyInfo.split('_')[1];
    },
    // 创建---更新
    handleCreateSubmit(formName) {
      const data = {
        nodeDatas: [
          {
            dataName: '装机容量',
            dataCode: 'ZJRL',
            dataType: 'String',
            dataVal: this.windFarmForm.capacity
          }
        ],
        nodeName: this.windFarmForm.windFarmName,
        address: this.windFarmForm.address,
        nodeCode: this.windFarmForm.nodeCode,
        areaDistrict: this.countyCode,
        areaDistrictText: this.countyText,
        areaCity: this.cityCode,
        areaCityText: this.cityText,
        areaProvince: this.provinceCode,
        areaProvinceText: this.provinceText
      };
      let postUrl = '';
      const flag = this.isAdd;
      if (flag) {
        postUrl = Api.windFarmManage.saveWindFarm;
      } else {
        postUrl = Api.windFarmManage.updateWindFarm;
        data.id = this.windFarmId;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleClose(formName);
          this.$axios.post(
            postUrl,
            {
              data
            },
            res => {
              if (res.isSuccess) {
                const message = this.isAdd ? '创建成功' : '修改成功';
                this.$message({
                  message: message,
                  type: 'success'
                });
                this.getWindFarmList();
                this.handleClose(formName);
              } else {
                this.$message({
                  message: res.message,
                  type: 'danger'
                });
              }
            }
          );
        } else {
          this.$message.error('校验失败');
          return false;
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确定删除该场站, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          Api.windFarmManage.deleteWindFarm,
          {
            data: {
              id: row.id
            }
          },
          res => {
            if (res.isSuccess) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getWindFarmList();
            } else {
              this.$message({
                message: res.message,
                type: 'danger'
              });
            }
          }
        );
      }).catch(() => { });
    },
    // 关闭弹窗
    handleClose(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
      this.windFarmForm = {
        windFarmName: '',
        capacity: '',
        address: '',
        provinceInfo: '',
        cityInfo: '',
        countyInfo: '',
        nodeCode: ''
      };
    }
  }
};
</script>
<style scoped lang="scss">
.operateSearch {
  display: flex;
  justify-content: space-between;
  .operate {
    display: flex;
  }
  .search {
    display: flex;
  }
}
.el-select {
  // width: 50%;
  // margin-bottom: 5px;
  // margin-right: 5px;
  margin-right: 10px;
}
.el-input {
  width: 85%;
}
</style>
