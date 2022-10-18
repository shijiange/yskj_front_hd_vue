import cTitle from "components/title";
export default {
  data() {
    return {
      // 登陆会员冻结爱心值
      froze: 0,
      //自定义名称
      coin_name: "",
      // 登陆会员可用爱心值
      usable: 0,
      // 转让开关是否开启
      transfer_status: false
    };
  },
  methods: {
    gotoPage(url) {
      this.$router.push(this.fun.getUrl(url));
    },
    getBalance() {
      $http
        .get("plugin.coin.Frontend.Controllers.page.index", {}, "加载中")
        .then(
          response => {
            if (response.result === 1) {
              this.froze = response.data.froze;
              this.coin_name = response.data.coin_name;
              this.usable = response.data.usable;
              this.transfer_status = response.data.transfer_status;
            } else {
              this.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            this.$dialog.alert({message:response.msg});
          }
        );
    }
  },
  activated() {
    this.getBalance();
  },
  components: { cTitle }
};
