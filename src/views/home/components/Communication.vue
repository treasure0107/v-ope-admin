<!--
 * @Author: your name
 * @Date: 2021-07-26 09:42:37
 * @LastEditTime: 2021-11-24 15:27:09
 * @LastEditors: JTune
 * @Description: In User Settings Edit
 * @FilePath: \operation-admin\src\views\home\components\communication.vue
-->
<template>
  <div class="content-com">
    <div class="tit">
      <span>通讯录 </span>
      <div>
        <!-- <el-input
          style="width:unset"
          class="mr-20"
          placeholder="请输入关键字"
          v-model="key"
          size="mini"
        >
          <i
            @click="search"
            slot="suffix"
            class="el-input__icon el-icon-search"
          ></i>
        </el-input> -->
      </div>
    </div>
       <div class="table-con communicationTree">
      <!-- <dy-table
        maxTableHeight="350px"
        :keys="colKey"
        :loading="loading"
        :fetchData="fetchData"
        :pagination="pagination"
        :list="tableData"
        :isShowConfigHeader="false"
      >
      </dy-table> -->
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="true"
          :indent="7"
        >
          <!-- node-key="id" 后端返回的id有重复，先注释掉看看能不能不要也能用-->
          <span slot-scope="{node,data}">
            <span>{{data.name}}</span>
            <span style="color:gray;margin-left: 10px;">{{(data.roleName || '') + ' ' + (data.companyPhone || '')}}</span>
          </span>
        </el-tree>
    </div>
  </div>
</template>

<script>
// import DyTable from '@/components/DyTable';
import { localstorageGet } from '@/utils/auth';
import Api from '@/api';
export default {
  name: '',
  components: { },
  data() {
    return {
      treeData: [],
      key: '',
      loading: false,
      tableData: [],
      pagination: {
        total: 0,
        pages: 1,
        size: 10
      },
      colKey: {
        name: '姓名',
        phone: '电话'
      },
      defaultProps: {
        // children: 'children',
        children: 'childrenList',
        label(data) {
          return data.name;
        }
      }
    };
  },
  computed: {},
  watch: {},
  created() {
    // this.getData();
  },
  mounted() {
    this.getCompanyTree();
  },
  methods: {
    getCompanyTree() { // 获取公司部门架构数据
      this.$axios.post(
        Api.frameworkInfo.getCompanyDepartTree,
        {
          data: {
            flag: 3,
            id: this.$store.state.user.companyId // 公司id localstorageGet('companyId')
          }
        },
        res => {
          if (res.isSuccess) {
            this.treeData = res.data;
          } else {
            this.$message.error(res.message);
          }
        }
      );
    },
    getData() {
      this.$axios.post(
        // 'http://192.168.1.218:9999/web/user/api/user/findByCompanyIdUserList',
        Api.roleManage.getCompanyUser,
        {
          data: {
            // name: localstorageGet('userName') || ''
            companyId: localstorageGet('companyId') || ''
          },
          // platformCode: '400001',
          pages: 1,
          size: 99999
        },
        (res) => {
          this.loading = false;
          if (res.isSuccess) {
            this.tableData = res.data.dataList || [];
          }
        }
      );
    },
    search() {},
    fetchData() {
      this.tableData = [{
        theme: '交接班记录',
        initiator: '小六',
        start_time: '54684651321641654',
        receipt_time: '2021-04-06 11:00'
      }, {
        theme: '运行日志',
        initiator: '小六',
        start_time: '54684651321641654',
        receipt_time: '2021-04-06 11:00'
      },
      {
        theme: '交接班记录',
        initiator: '小六',
        start_time: '54684651321641654',
        receipt_time: '2021-04-06 11:00'
      }, {
        theme: '运行日志',
        initiator: '小六',
        start_time: '54684651321641654',
        receipt_time: '2021-04-06 11:00'
      },
      {
        theme: '交接班记录',
        initiator: '小六',
        start_time: '54684651321641654',
        receipt_time: '2021-04-06 11:00'
      }, {
        theme: '运行日志',
        initiator: '小六',
        start_time: '54684651321641654',
        receipt_time: '2021-04-06 11:00'
      }
      ];
    }
  }
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
::v-deep .el-table--scrollable-y .el-table__body-wrapper{
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-track {
      background: rgb(239, 239, 239);
      border-radius: 0px;
    }
    &::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: rgb(51, 51, 51);
    }
    &::-webkit-scrollbar-corner {
      background: #179a16;
    }
}
.content-com {
  min-width: 400px;
  height: 413px;
  background-color: #fff;
  .tit {
    display: flex;
    font-size: 14px;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    border-bottom: 1px solid #ebedf0;
    span {
      flex: 1;
      font-weight: bold;
      color: #000000;
    }
    > div {
      flex: 1;
      text-align: right;
      ::v-deep .el-input {
        width: 160px;
      }
    }
  }
    .table-con {
    height: 350px;
    padding: 0 20px;
    overflow: hidden;
  }
  .communicationTree{
    overflow:scroll;
  }
}
</style>
