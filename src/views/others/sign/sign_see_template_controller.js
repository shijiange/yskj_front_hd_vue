export default {
  data() {
    return {
      tid: 0,
      contract_template_img_data: [],
      swipeIndex: 0
    };
  },
  activated() {
    if (this.$route.query && this.$route.query.tid) {
      this.tid = this.$route.query.tid;
    }
    this.getDetails();
  },
  methods: {
    getDetails() {
      $http.get("plugin.yun-sign.frontend.h5.contract.templateDetail", { id: this.tid }).then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }
        this.contract_template_img_data = res.data.template.contract_template_img_data;
      });
    },

    onChangeSwipeIndex(index) {
      this.swipeIndex = index;
    },

    gotoLaunchSign() {
      this.$router.push(this.fun.getUrl("launchSign", { template_id: this.tid }));
    }
  }
};
