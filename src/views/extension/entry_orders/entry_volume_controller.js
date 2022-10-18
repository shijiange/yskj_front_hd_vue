import cTitle from "components/title";

export default {
  data() {
    return {
      userInfo: {} //用户信息
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http.get("plugin.pending-order.frontend.pending-order.index").then(
        response => {
          if (response.result === 1) {
            this.userInfo = response.data;
            this.fun.setWXTitle(response.data.title);
          } else {
            console.log(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    gotoMyVolume() {
      this.$router.push(this.fun.getUrl("MyVolume", {}));
    },
    gotoWholesaleVolume() {
      this.$router.push(this.fun.getUrl("WholesaleVolume", {}));
    },
    gotoMoneyDetail() {
      this.$router.push(this.fun.getUrl("MoneyDetail", {}));
    }
  },
  components: { cTitle }
};
