import { Toast } from "vant";
// import QRCode from "qrcode";
import yz_pay from "components/ui_components/yz_pay";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法

var self = null;
export default {
  mixins: [yzPay],
  beforeRouteLeave: function(to, from, next) {
    if (to.name == "HotelGoodsOrder") {
      this.$dialog
        .confirm({ message: "您还没完成支付，确认离开?" })
        .then(() => {
          self.$router.push(self.fun.getUrl("home", {}));
          next();
        })
        .catch(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  data() {
    return {
      balance: 0,
      payParams: "",
      info_form: {},
      order_sn: "",
      money: "",
      buttons: [],
      typename: "",
      pay_sn: "订单编号",
      order_pay_id: "",
      uid: "",
      // 余额字样
      balanceLang: this.fun.getBalanceLang(),

      is_cps: false,
      certified_show:false,
      certified_info:{
        real_name:'',
        idcard:'',
      }
    };
  },
  methods: {
    // 多订单合并支付获取信息接口方法
    getMultipleOrderInfo() {
      // order.pay.wechatPay
      let _url = "plugin.overseas.frontend.merge-pay";
      try {
        if (!this.fun.isTextEmpty(this.$route.query.api) && this.$route.query.api != "order.operation.pay") {
          _url = this.$route.query.api;
        }
      } catch (error) {
        console.log(error);
      }

      let json = {
        order_ids: this.order_ids,
        pid: this.$route.query.pid ? this.$route.query.pid : this.uid
      };

      if (this.fun.isCPS() && this.fun.isCPSAPPI()) {
        json.wechat_app_pay_type = "cps";
      }
      console.log(this.$route.params.store_id);
      if(this.$route.params.store_id){
        json.store_id = this.$route.params.store_id;
      }

      $http
        .get(_url,json,"...")
        .then(
          (response)=> {
            if (response.result == 1) {
              this.order_sn = response.data.order_pay.pay_sn;
              this.balance = Number(response.data.member.credit2).toFixed(2);
              this.money = Number(response.data.order_pay.amount).toFixed(2);
              this.uid = response.data.order_pay.uid;
              this.order_pay_id = response.data.order_pay.id; // 支付id
              this.buttons = response.data.buttons;
              this.typename = response.data.typename;
              //this.order_sn_zhuge = '';
              //for(let i=0;i<response.data.order_pay.orders.length;i++){
               // this.order_sn_zhuge += this.order_sn_zhuge ? ','+response.data.order_pay.orders[i].order_sn :response.data.order_pay.orders[i].order_sn;
             // }
              console.log(this.buttons);
              if(this.buttons.some(function(item){
                return item.code === 'yeepay';
              })){
                this.getMember();
              }
              if(response.data.buttons && response.data.buttons.length == 0){
                this.$dialog.alert({message:"平台未开启任何支付方式，请联系客服！"})
              }
            } else {

              this.$dialog
                .confirm({ message: response.msg })
                .then(() => {
                  this.$router.back();
                  // this.$router.replace(this.fun.getUrl("home"));
                })
                .catch(() => {});
            }
          },
          (response)=> {
            Toast(response.msg);
          }
        );
    },
    // //单个订单支付获取信息接口方法
    // getOrderInfo() {
    //   //order.pay.wechatPay
    //   var that = this
    //   $http.get('order.pay', { order_id: this.$route.params.order_id, "i": this.fun.getKeyByI(), "type": this.fun.getTyep() }).then( (response)=> {
    //     if (response.result == 1) {
    //       that.order_sn = response.data.order.order_sn
    //       that.balance = response.data.member.credit2
    //       that.money = response.data.order.price
    //       that.buttons = response.data.buttons
    //     } else {

    //     }
    //   }, (response)=> {
    //     // error callback
    //   })
    // },
    //获取会员信息
    getMember() {
      $http
          .get('plugin.overseas.frontend.cert.getMemberInfo', '...')
          .then((response) => {
            if (response.result === 1) {
              this.certified_info.realname = response.data.realname
              this.certified_info.idcard = response.data.idcard
              if (!this.certified_info.realname || !this.certified_info.idcard) {
                Toast('您还未进行实名认证，请先进行实名认证！')
              }
            } else {
              Toast(response.msg)
            }
          })
          .catch((error) => {
            console.log(error)
          })
    },
    getShopSign() {
      $http.get("plugin.shop-esign.frontend.contract.get-order-contract", { order_ids: this.order_ids }, "...").then(
        response => {
          if (response.result === 1) {
            let flag = false;
            //this.order_sn_zhuge = response.data[0].order_sn;
            response.data.map(item => {
              if (item.need_sign === 1 && item.contract_id && !flag) {
                flag = true;
                this.$dialog
                  .alert({ message: `您的订单(订单号:${item.order_sn})在支付前需要签署电子合同` })
                  .then(() => {
                    this.$router.push(this.fun.getUrl("signPagePlu", { id: item.contract_id }, { fromOrder: 1 }));
                  })
                  .catch(() => {});
              }
            });

            if (!flag) {
              this.getMultipleOrderInfo();
            }
          } else {
            this.getMultipleOrderInfo();
          }
        });
    }
  },
  activated() {
    if (this.$route.params.iscps) {
      this.is_cps = true;
    }
    if (this.$route.params.status == 2) {
      this.order_ids = decodeURI(this.$route.params.order_ids); // JSON.parse(this.$route.params.order_ids)
    } else {
      this.order_ids = this.$route.params.order_ids;
      if (this.$route.params.route) {
        this.pageUrl = this.$route.params.route;
      }
    }
    self = this;

    if (JSON.parse(window.localStorage.getItem("globalParameter")) && JSON.parse(window.localStorage.getItem("globalParameter")).is_open_shop_esign == "1") {
      this.getShopSign();
    } else {
      this.getMultipleOrderInfo();
    }
    //console.log(5555);
    //console.log(this.order_sn_zhuge);
    //console.log(66666);

   //setTimeout(() => {
      //zhuge.track('进入订单支付页面',{
        //'支付流水号':this.order_sn,
       // '订单号':this.order_sn_zhuge,
        //'支付金额':this.money
      //});
     // this.order_sn_zhuge = '';
   //}, 3000);
  },
  components: {
    yz_pay
  }
};
