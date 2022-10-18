import yz_pay from "components/ui_components/yz_pay";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
// import { Toast } from 'vant';

export default {
  mixins: [yzPay],
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

      popupSpecs: false,
      isMiniprogram: false,
    };
  },
  methods: {
    //获取代付会员信息和支付信息
    getPayerInfo() {
      $http.get("order.merge-pay.anotherPayOrder", {
        order_ids: this.$route.query.order_ids,
        mid: this.$route.query.mid,
        pid: this.$route.query.pid ? this.$route.query.pid : window.localStorage.getItem("uid")
      }).then(response => {
        if (response.result == 1) {
          this.payerImg = response.data.member.avatar;
          this.payerName = response.data.member.nickname;
          let arr = response.data.buttons;
          if (response.data.buttons && !(response.data.buttons instanceof Array)) {
            arr = Object.values(response.data.buttons);
          }
          this.btns = arr;
          this.order_pay_id = response.data.order_pay.id;
          this.money = response.data.order_pay.amount;
        } else if (response.result == 0) {
          this.$dialog.alert({message:response.msg}).then(()=>{
            this.$router.push(this.fun.getUrl("home"));
          });
        }
      }).catch(error => {
        console.log(error);
      });
    },

    //获取订单详情
    getOrderDetail() {
      $http.get("order.another-pay-detail", {
        order_id: this.$route.query.order_ids,
        pid: this.$route.query.pid ? this.$route.query.pid : window.localStorage.getItem("uid")
      }).then(response => {
        if (response.result == 1) {
          this.goodList = response.data;
          let numSum = 0;
          response.data.forEach(val => {
            return numSum += val.goods_total;
          });

          this.totalNum = numSum;
          this.order_sn = response.data[0].order_sn;
        } else {
          this.$dialog.alert({message:response.msg});
          this.$router.push(this.fun.getUrl("home"));
        }
      }).catch(error => {
        console.log(error);
      });
    },

    //小程序跳转到小程序端支付
    miniPay() {
      this.$dialog.alert({message:"请点击右上角分享！"});
    },

    //初始化数据
    initData() {
      this.payerImg = "";
      this.goodList = [];
      this.payerName = "";
      this.totalNum = 0;
      this.money = 0;
      this.btns = [];
      this.order_pay_id = "";
    },
  },
  activated() {
    if (window.isMiniprogram) {
      this.isMiniprogram = true;
    }
    this.initData();
    this.getPayerInfo();
    this.getOrderDetail();
  },
  components: { yz_pay }
};
