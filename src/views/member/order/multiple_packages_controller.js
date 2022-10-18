import cTitle from "components/title";

export default {
  data() {
    return {
      packagesList: [],
      order_id: "",
      logistics_api: null
    };
  },

  methods: {
    // 获取多包裹列表信息
    getPackagesList() {
      let json = { order_id: this.order_id };
      let api = "dispatch.express.getOrderMultiplePackages";

      if (this.$route.query.from && this.$route.query.from == "resend") {
        delete json.order_id;
        api = "refund.express.resend-list";
        json.refund_id = this.order_id;
      } else if (this.$route.query.api) {
        api = this.$route.query.api;
      }

      $http.get(api, json, "正在获取多包裹...").then(
        response => {
          console.log(response);
          if (response.result === 1) {
            this.packagesList = response.data;
            if (response.data.logistics_api) this.logistics_api = response.data.logistics_api;
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // 跳转物流详情页
    toLogistics(item) {
      let that = this;
      let _json = {};
      if (this.$route.query.from && this.$route.query.from == "resend") {
        _json = {
          refund_id: this.order_id,
          express_id: item.express_id,
          from: "resend"
        };
      } else {
        _json = {
          id: that.order_id,
          order_express_id: item.order_express_id
        };
      }
      if (this.logistics_api) _json.api = this.logistics_api;
      this.$router.push(this.fun.getUrl("logistics", _json));
    }
  },

  activated() {
    this.order_id = this.$route.params.order_id; //接受orderList传送过来的订单id
    this.getPackagesList();
  },

  components: { cTitle }
};
