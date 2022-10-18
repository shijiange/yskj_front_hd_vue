import loading from "components/loading";

export default {
  data() {
    return {
      alipay_url: "",
      uid: ""
    };
  },
  methods: {
    //订单支付
    toPayOrder() {
      $http
        .get(
          "order.merge-pay.wechat-h5",
          {
            order_pay_id: this.$route.query.order_pay_id
          },
          "loading"
        )
        .then(
          response => {
            if (response.result == 1) {
              window.location.href = response.data.mweb_url;
              // that.showQR = true;
            } else {
              this.$dialog.alert({
                message: response.msg
              });
            }
            this.isclick = false;
          },
          function(response) {
            // error callback
          }
        );
    }
  },
  activated() {
    // console.log(this.$route.params.status,this.fun.isAlipay());
    // this.$toast("执行"+this.$route.params.status);
    if (!this.fun.isAlipay()) {
      if (this.$route.params.status == "2") {
        //订单支付
        this.toPayOrder();
      }
    }
  },
  components: { loading },
  created() {
    var u = navigator.userAgent;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
      location.href = document.location.protocol + "//" + window.location.host + "/addons/yun_shop/" + "?menu#" + this.$route.fullPath;
    }
    // window.location.href = window.location.href;
    // console.log("ssssssssssss", window.location.href, this.$route);
  }
};
