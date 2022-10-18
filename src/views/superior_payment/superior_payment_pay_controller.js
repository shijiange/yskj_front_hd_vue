import orderInfo from "./order_info";
import yz_pay from "components/ui_components/yz_pay";
import { yzPay } from "../../utils/yz_pay"; //引入支付方法

let plugin_name="上级代付";
export default {
  mixins: [yzPay],
  components: { orderInfo, yz_pay },
  data() {
    return {
      payerImg: "",
      payerName: "",
      goodList: [],
      totalNum: 0,
      money: 0,
      btns: [],
      //支付id
      order_pay_id: "",
      order_sn: "",

      isMiniprogram: false,
      title_name:'',

      networkLoading:false
    };
  },
  created() {
    this.getPayerInfo();
    this.getOrderDetail();
  },
  methods: {
    //获取代付会员信息和支付信息
    getPayerInfo() {
      $http
        .get("order.merge-pay.anotherPayOrder", {
          plugin: "parent_payment",
          order_ids: this.$route.query.order_ids,
          pid: this.$route.query.pid ? this.$route.query.pid : window.localStorage.getItem("uid")
        })
        .then(response => {
          if (response.result == 1) {
            this.payerImg = response.data.member.avatar;
            this.payerName = response.data.member.nickname;
            this.order_pay_id = response.data.order_pay.id;
            this.money = response.data.order_pay.amount.toFixed(2);
            let btns = [], buttons = response.data.buttons;
            for (let i in buttons) {
              if (buttons[i].value == 1 || buttons[i].value == 3) {
                btns.push(buttons[i]);
              }
            }
            this.btns = btns;
            this.title_name = response.data.plugin_name || plugin_name;
            this.fun.setWXTitle(this.title_name);
            this.networkLoading = true;
          } else if (response.result == 0) {
            this.$dialog.alert({ message: response.msg }).then(()=>{
              this.$router.push(this.fun.getUrl("home"));
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //获取订单详情
    getOrderDetail() {
      $http
        .get("order.another-pay-detail", {
          plugin: "parent_payment",
          order_id: this.$route.query.order_ids,
          pid: this.$route.query.pid ? this.$route.query.pid : window.localStorage.getItem("uid")
        })
        .then(response => {
          if (response.result == 1) {
            this.formatGoods(response.data);
            this.order_sn = response.data.order_sn;
          } else {
            this.$dialog.alert({ message: response.msg });
            this.$router.push(this.fun.getUrl("home"));
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    formatGoods(list) {
      let numSum = 0;

      list.forEach(val => {
        this.goodList.push(...val.has_many_order_goods);
        return (numSum += val.goods_total);
      });
      console.log(this.goodList);
      this.totalNum = numSum;
    },

  }
};
