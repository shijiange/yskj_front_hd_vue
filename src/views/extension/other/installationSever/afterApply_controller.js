import yz_uploader from "components/ui_components/yz_uploader";
export default {
  data() {
    return {
      message: "",
      fileList1: [],
      status: false //防止重复提交
    };
  },
  activated() {},

  components: { yz_uploader },
  computed: {},
  methods: {
    sendBtn() {
      if (status) return;
      this.status = true;
      $http
        .post("plugin.live-install.frontend.order.applyAfterSale", { install_order_goods_id: this.$route.params.id, refund_reason: this.message, refund_image: this.fileList1 }, "加载中...")
        .then(res => {
          if (res.result == 1) {
            if (window.history.length <= 1) {
              this.$router.push(this.fun.getUrl("home", {}));
            } else {
              this.$router.go(-1);
            }
          } else {
            this.status = false;
            Toast(res.msg);
            return;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
