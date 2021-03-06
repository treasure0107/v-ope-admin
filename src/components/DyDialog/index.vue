<template>
  <!-- 封装弹框 -->
  <div class="popup">
    <el-dialog
      :title="showTitle ? dialogTitle : ''"
      :visible.sync="dialogVisible"
      :width="width"
      :close-on-click-modal="clickMask"
      :before-close="handleClose"
      :fullscreen="fullscreen"
      :top="top"
      :append-to-body="appendTo"
      :destroy-on-close="destroyClose"
    >
      <div :style="styleArray">
        <slot>
          <!-- <p>弹框自定义的内容</p> -->
        </slot>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="showCancelButton"
          @click="cancel"
        >取 消</el-button>
        <el-button
          type="primary"
          v-if="showSureButton"
          @click="save"
          :disabled="antiShakeDisabled"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      antiShakeDisabled: false
    };
  },
  props: {
    styleArray: {
      type: Array,
      default: () => []
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '550px'
    },
    top: {
      type: String,
      default: '100px'
    },
    // 点击遮罩层是否关闭
    clickMask: {
      type: Boolean,
      default: false
    },
    appendTo: {
      type: Boolean,
      default: false
    },
    // 关闭时销毁 Dialog 中的元素
    destroyClose: {
      type: Boolean,
      default: false
    },
    // 是否展示确认按钮
    showSureButton: {
      type: Boolean,
      default: true
    },
    // 是否展示取消按钮
    showCancelButton: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        // 当visible改变的时候，触发父组件的 updateVisible方法，在该方法中更改传入子组件的 centerDialogVisible的值
        this.$emit('updateVisible', val);
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('cancelDialogPopup');
    },
    save() {
      // 多次点击防抖控制
      this.antiShakeDisabled = true;
      setTimeout(() => {
        this.antiShakeDisabled = false;
      }, 5000);
      this.$emit('sureDialogPopup');
    },
    handleClose() {
      this.$emit('closeDialogPopup');
    }
  }
};
</script>

<style scoped lang="scss">
.popup {
  width: 550px;
  .el-dialog {
    z-index: 10000;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(17, 130, 251, 0.5);
    border-radius: 5px;
    //margin-top: 10% !important;
  }
  .el-dialog__header {
    text-align: center;
    width: 100%;
    height: 40px;
    line-height: 38px;
    border-bottom: 1px solid #f6f7f9;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 16px;
  }
  .el-dialog__close.el-icon.el-icon-close {
    font-size: 20px;
    width: 17px;
    height: 17px;
  }
  .el-button.el-button--default {
    width: 88px;
    color: #1182fb;
    border: 1px solid #1182fb;
  }
  .el-button.el-button--primary {
    width: 88px;
  }
  .el-dialog__body {
    padding: 24px 32px;
    box-sizing: border-box;
    max-height: 800px;
    overflow: auto;
  }
  .el-dialog__headerbtn {
    top: 4px;
  }
  .el-dialog__title {
    color: #3c4354;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    line-height: 16px;
  }
  // ::v-deep .el-dialog__footer {
  //   text-align: center;
  // }
}
</style>
