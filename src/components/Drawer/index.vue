<!--
 * @Author: JTune
 * @Date: 2021-07-21 17:29:24
 * @Description: 抽屉弹窗
 * @FilePath: \operation-admin\src\components\Drawer\index.vue
-->
<template>
  <div class="drawer-con">
    <el-drawer
      title="列表管理"
      :visible.sync="drawer"
      :with-header="withHeader"
      size="20%"
      :modal-append-to-body="true"
      :destroy-on-close="true"
      :wrapperClosable="wrapperClosable"
      :before-close="handleClose"
      :show-close="showClose"
      :checkboxList="checkboxList"
    >
      <el-input class="mr-20" placeholder="请输入关键字" v-model="key" size="small">
        <i @click="search" slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div class="checkbox-con">
        <el-checkbox-group v-model="checkboxGroup">
          <!--  default-expand-all    @change="changeCheckbox(item)"-->
          <p
            v-for="(item, index) in checkboxList"
            :key="index"
            @change="handleChecked(item)"
          >
            <el-checkbox :label="item">{{ item.titleName }}</el-checkbox>
          </p>
        </el-checkbox-group>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="handleSure" size="small">确 认</el-button>
        <el-button @click="handleClose" size="small">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    // 是否需要显示弹窗
    drawerVisible: {
      type: Boolean,
      default: false
    },
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: false
    },
    // 控制是否显示 header 栏
    withHeader: {
      type: Boolean,
      default: true
    },
    // 需要动态配置的表头column
    checkboxList: {
      type: Array,
      default: () => {
        /*
          * titleKey: 表头在table中对应的keyName
          * titleName: 表头在table中对应的名称
        */
        return [
          { titleKey: 'title1', titleName: '标题1' },
          { titleKey: 'title2', titleName: '标题2' }
        ];
      }
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    }
  },
  name: '',
  components: {},
  data() {
    return {
      key: '',
      checkboxGroup: []
      // drawer: true
    };
  },
  computed: {
    drawer: {
      get() {
        return this.drawerVisible;
      },
      set(val) {
        this.$emit('handleUpdateDrawer', val);
      }
    }
  },
  watch: {
    // drawer: function (val) {
    //   console.log('drawerVisible---', val);
    //   this.$emit('handleDrawerVisible', val);
    // }
  },
  created() {},
  mounted() {},
  methods: {
    search() {
      console.log('key', this.key);
    },
    handleChecked(data) {
      console.log('checkboxGroup', this.checkboxGroup);
      console.log('handleChecked......', data);
    },
    handleClose() {
      // this.drawer = false;
      this.$emit('handleCloseDrawer', '000');
    },
    handleSure() {
      // this.drawer = false;
      this.$emit('handleSubmitDrawer', this.checkboxGroup);
    }
  }
};
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.drawer-con {
  width: 400px;
  position: relative;
  ::v-deep .el-drawer__wrapper {
    .el-drawer__header {
      margin-bottom: 0;
    }
    .el-drawer__body {
      width: 300px;
      margin: 30px;
    }
  }
  .checkbox-con {
    p {
      margin-top: 15px;
    }
  }
  .btn-box {
    width: 400px;
    position: absolute;
    left: 0;
    bottom: 19px;
    // transform: translateX(-50%);
    text-align: center;
    padding-top: 19px;
    border-top: 1px solid #ebedf0;
  }
}
</style>
