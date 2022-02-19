<!--
 * @Author: JTune
 * @Date: 2021-08-12 11:12:36
 * @LastEditors: JTune
 * @LastEditTime: 2021-12-28 10:17:22
 * @Description: 待发事项
-->
<template>
  <div>
    <div>
      <div class="operateSearch">
        <div class="operate">
          <el-button
            type="primary"
            size="small"
            @click="handleCreate"
          >创建厂商</el-button>
        </div>
        <div class="search">
          <el-input
            style="width:200px;margin-right:5px"
            size="small"
            v-model.trim="searchKey"
            @keyup.enter.native="getFactoryList"
            placeholder="请输入搜索厂商名称"
          >
            <i
              slot="suffix"
              @click="getFactoryList"
              style="cursor:pointer"
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
        @cancelDialogPopup="handleClose('factoryForm')"
        @closeDialogPopup="handleClose('factoryForm')"
        @sureDialogPopup="handleCreateSubmit('factoryForm')"
      >
        <el-form
          :model="factoryForm"
          :rules="rules"
          v-if="dialogVisible"
          ref="factoryForm"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="厂商名称"
                :label-width="formLabelWidth"
                prop="factoryName"
              >
                <el-input
                  placeholder="厂商名称"
                  v-model.trim="factoryForm.factoryName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="厂商电话"
                :label-width="formLabelWidth"
                prop="phoneNumber"
              >
                <el-input
                  placeholder="厂商电话"
                  v-model.trim="factoryForm.phoneNumber"
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
                    v-model="factoryForm.provinceCode"
                    @change="handleProvinceChange"
                  >
                    <el-option
                      v-for="(province) in provinceOptions"
                      :key="province.id"
                      :label="province.areaName"
                      :value="province.areaCode"
                    ></el-option>
                  </el-select>

                  <el-select
                    placeholder="选择市(直辖市)"
                    v-model="factoryForm.cityCode"
                    @change="handleCityChange"
                  >
                    <el-option
                      v-for="(city) in cityOptions"
                      :key="city.id"
                      :label="city.areaName"
                      :value="city.areaCode"
                    ></el-option>
                  </el-select>

                  <el-select
                    placeholder="选择县(区)"
                    v-model="factoryForm.countyCode"
                    @change="handleCountyChange"
                  >
                    <el-option
                      v-for="(county) in countyOptions"
                      :key="county.id"
                      :label="county.areaName"
                      :value="county.areaCode"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                label="详细地址"
                :label-width="formLabelWidth"
                prop="address"
              >
                <el-input
                  placeholder="厂商详细地址"
                  v-model.trim="factoryForm.address"
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
import Api from '@/api';
import { localstorageGet } from '@/utils/auth';

export default {
  name: '',
  components: { DyTable, DyDialog },
  data() {
    // 自定义城市验证规则
    var areaRule = (rule, value, callback) => {
      // value 就是 验证那个字段 为空 或者 selectCityValue 为空 验证都不会通过
      if (this.factoryForm.provinceCode == '' && this.factoryForm.cityCode == '' && this.factoryForm.countyCode == '') {
        return callback(new Error('请选择所属区域'));
      } else {
        callback();
      }
    };
    return {
      dialogTitle: '弹窗标题',
      dialogVisible: false,
      formLabelWidth: '120px',
      loading: false,
      tableData: [],
      formOperate: 'create',
      isAdd: false,
      isClick: false,
      searchKey: '',
      selectDatas: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      factoryId: '',
      // 区域选择
      provinceOptions: [],
      cityOptions: [],
      countyOptions: [],
      colKey: {
        name: '厂商名称',
        companyPhone: '厂商电话',
        communicationAddress: '厂商详细地址',
        area: '所属区域'
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
              action: (row) => {
                this.handleDelete(row);
              }
            }
          ]
        }
      ],
      factoryForm: {
        factoryName: '',
        phoneNumber: '',
        address: '',
        provinceCode: '',
        cityCode: '',
        countyCode: ''
      },
      rules: {
        factoryName: [
          {
            required: true,
            message: '请填写风场名称',
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: '请填写厂商电话',
            trigger: 'blur'
          },
          {
            pattern: /^1[345789]\d{9}$/,
            message: '手机号格式有误，请重新输入',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请填写风场地址',
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
    // this.getFactoryList();
    this.getArea();
  },
  methods: {
    fetchData() {
      this.getFactoryList();
    },
    // 获取厂商列表
    getFactoryList() {
      this.$axios.post(
        Api.factoryManage.getFactoryList,
        {
          data: {
            name: this.searchKey,
            companyType: 'COOPERATE_COMPANY'
          },
          platformCode: localstorageGet('platformCode'),
          pages: this.pagination.pages,
          pagination: true,
          size: this.pagination.size
        },
        res => {
          if (res.isSuccess) {
            this.tableData = res.data.dataList;
            res.data.dataList.map((item, index) => {
              this.tableData[index].area = item.registerAddressProvinceName + item.registerAddressCityName + item.registerAddressDistrictName;
            });
            this.pagination.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    // 编辑
    handleEdit(row) {
      this.dialogTitle = '修改厂商信息';
      this.dialogVisible = true;
      this.isAdd = false;
      this.factoryId = row.id;
      this.factoryForm = {
        factoryName: row.name,
        phoneNumber: row.companyPhone,
        address: row.communicationAddress
      };
      this.factoryForm.provinceCode = row.registerAddressProvince;
      this.factoryForm.cityCode = row.registerAddressCity;
      this.factoryForm.countyCode = row.registerAddressDistrict;
      this.handleProvinceChange();
      this.handleCityChange();
    },
    // 创建
    handleCreate() {
      this.dialogTitle = '添加厂商';
      this.isAdd = true;
      this.dialogVisible = true;
    },
    // 处理区域数据
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
    handleProvinceChange() {
      this.$axios.post(
        Api.windFarmManage.getCity,
        {
          data: {
            areaCode: this.factoryForm.provinceCode
          }
        },
        res => {
          if (res.isSuccess) {
            this.cityOptions = res.data;
            // if (!this.isAdd) return;
            if (this.isAdd) {
              this.factoryForm.cityCode = '';
              this.factoryForm.countyCode = '';
            } else {
              const isCityExist = res.data.some((item) => {
                return item.areaCode == this.factoryForm.cityCode;
              });
              if (!isCityExist) {
                this.factoryForm.cityCode = '';
                this.factoryForm.countyCode = '';
              }
            }
          }
        }
      );
    },
    handleCityChange() {
      this.$axios.post(
        Api.windFarmManage.getCounty,
        {
          data: {
            areaCode: this.factoryForm.cityCode
          }
        },
        res => {
          if (res.isSuccess) {
            this.countyOptions = res.data;
            if (this.isAdd) {
              this.factoryForm.countyCode = '';
            } else {
              const isCountyExist = res.data.some((item) => {
                return item.areaCode == this.factoryForm.countyCode;
              });
              if (!isCountyExist) {
                this.factoryForm.countyCode = '';
              }
            }
          }
        }
      );
    },
    handleCountyChange(val) {
      if (val) {
        this.$set(this.factoryForm, this.factoryForm.countyCode, val);
      } else {
        this.$set(this.factoryForm, this.factoryForm.countyCode, '');
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm('是否确定删除该厂商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(
          Api.factoryManage.deleteFactory,
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
              this.getFactoryList();
            } else {
              this.$message.error(res.message);
            }
          }
        );
      })
        .catch(() => { });
    },
    // 关闭弹窗
    handleClose(formName) {
      this.$refs[formName].resetFields();
      this.factoryForm = {
        factoryName: '',
        phoneNumber: '',
        address: '',
        provinceCode: '',
        cityCode: '',
        countyCode: ''
      };
      this.dialogVisible = false;
    },
    // 创建更新厂商
    handleCreateSubmit(formName) {
      const data = {
        flag: '2',
        companyType: 'COOPERATE_COMPANY',
        companyPhone: this.factoryForm.phoneNumber,
        name: this.factoryForm.factoryName,
        communicationAddress: this.factoryForm.address,
        registerAddressProvince: this.factoryForm.provinceCode,
        registerAddressCity: this.factoryForm.cityCode,
        registerAddressDistrict: this.factoryForm.countyCode
        // parentId: localstorageGet('companyId')// 当组织架构种存在多层级公司时会需要
      };
      const flag = this.isAdd;
      if (!flag) data.id = this.factoryId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post(
            Api.factoryManage.saveFactory,
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
                this.getFactoryList();
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
  margin-right: 10px;
}
.el-input {
  width: 85%;
}
</style>
