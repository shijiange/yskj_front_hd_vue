import cTitle from "components/title";
export default {
  data() {
    return {
      store_id: "",
      qr_code: ""
    };
  },
  activated() {
    this.store_id = this.$route.params.store_id;
    this.getCode();
  },
  methods: {
    getCode() {
      $http
        .get(
          "plugin.store-cashier.frontend.store.goods-buy.goodsqrcode",
          { id: this.store_id },
          "加载中"
        )
        .then(
          response => {
            if (response.result === 1) {
              this.qr_code = response.data.qrcod;
            } else {
              // 判断权限
              if (response.data.url) {
                this.$notify(response.msg);
                window.location.href = response.data.url;
                return 0;
              } else {
                this.$dialog.alert({message:response.msg});
              }
            }
          },
          function(response) {
            this.$dialog.alert({message:response.msg});
           
          }
        );
    }
  },
  components: { cTitle }
};
