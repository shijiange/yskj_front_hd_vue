import cTitle from "components/title";
import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      value: "",
      express_info: [],
      company_name: "",
      express_sn: "",
      thumb: "",
      tel: "",
      status_name: "",
      // 多包裹id
      order_express_id: ""
    };
  },
  methods: {
    init() {
      this.company_name = "";
      this.express_sn = "";
      this.express_info = [];
      this.tel = "";
      this.status_name = "";
      this.thumb = "";
    },
    getExpress() {
      let json = {
        order_id: this.$route.params.id,
        order_express_id: this.order_express_id ? this.order_express_id : "", //添加多一个多包裹id参数
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      //售后，用户寄回物流信息
      if (this.$route.query.from && this.$route.query.from == "userReturn") {
        delete json.order_id;
        delete json.order_express_id;
        json.refund_id = this.$route.query.refund_id;
        this.api = "refund.express.user-return";
      } else if (this.$route.query.from && this.$route.query.from == "resend") {
        //售后，卖家寄回用户物流信息
        delete json.order_id;
        delete json.order_express_id;
        json.refund_id = this.$route.query.refund_id;
        json.express_id = this.$route.query.express_id;
        this.api = "refund.express.resend";
      }
      $http.get(this.api, json, "正在获取快递信息...").then(
        response => {
          if (response.result === 1) {
            var myData = response.data;
            this.company_name = myData.company_name;
            this.express_sn = myData.express_sn;
            this.express_info = myData.data;
            this.tel = myData.tel;
            this.status_name = myData.status_name;
            this.thumb = myData.thumb;
          } else {
            this.$dialog.confirm({ message: response.msg, confirmButtonText: "返回上一页" }).then(() => {
              this.$router.go(-1);
            });
          }
        },
        function(response) {
          // error callback
        }
      );
    }
  },
  activated() {
    this.init();
    console.log(this.$route.params);
    this.toi = this.fun.getKeyByI();
    if (this.$route.params.fromGrab === 1) {
      this.api = this.$route.params.api;
    } else if (this.$route.params.api) {
      this.api = this.$route.params.api;
    } else {
      this.api = "dispatch.express";
    }
    this.order_express_id = this.$route.params.order_express_id;
    this.getExpress();
  },
  components: {
    cTitle,
    yzBlank
  }
};
