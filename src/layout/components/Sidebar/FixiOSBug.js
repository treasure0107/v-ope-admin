/*
 * @Descripttion:
 * @Author: JTune
 * @Date: 2021-01-14 11:44:30
 */
export default {
  computed: {
    device() {
      return this.$store.state.app.device;
    }
  },
  mounted() {
    this.fixBugIniOS();
  },
  methods: {
    fixBugIniOS() {
      const $subMenu = this.$refs.subMenu;
      if ($subMenu) {
        const handleMouseleave = $subMenu.handleMouseleave;
        $subMenu.handleMouseleave = (e) => {
          if (this.device === 'mobile') {
            return;
          }
          handleMouseleave(e);
        };
      }
    }
  }
};
