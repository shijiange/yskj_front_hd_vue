import { Toast } from "vant";
import orderInfo from "./order_info";
let plugin_name="上级代付";
export default {
  components: { orderInfo },
  data() {
    return {
      details: {},

      goodList: [],
      totalNum: 0,
      totalPrice: 0,
      title_name:''
    };
  },
  created() {
    this.getDetails();
  },
  methods: {
    getDetails() {
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      $http.get("plugin.parent-payment.frontend.modules.payment.controllers.detail.index", { record_id: this.$route.query.record_id }).then(res => {
        Toast.clear();

        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }
        this.details = res.data;

        this.totalPrice = res.data.price;
        let goodList = res.data.order_goods;
        let total = 0;
        goodList.forEach(item => {
          total += item.total;
        });
        this.totalNum = total;
        this.goodList = goodList;

        this.title_name = this.details.plugin_name || plugin_name;
        this.fun.setWXTitle(this.title_name);

        console.log(res.data);
        //this.details = res.data.basics;
      });
    }
  }
};
