import { Toast } from "vant";
import QRCode from "qrcode";

var canvas = "";
/**
 * 目前商城主要有三种订单支付流程
 * 1、recharge充值支付   主要使用订单号ordersn  使用rechargePay方法
 * 2、打赏类的支付（没有订单号） 直接用金额请求接口 使用handleOtherPay方法
 * 3、商城订单支付类型 （有订单号） 支付后触发跳转  使用confirm方法
 *
 *  import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
 *  mixins: [yzPay],
 *
 *  支付弹窗的组件 import yz_pay from "components/ui_components/yz_pay";
 * **/
export const yzPay = {
  data() {
    return {
      confirmPayText: "确定",
      popupSpecs: false,
      showZFBQR: false,
      isZFBQR: false, //是否已生成二维码
      qrcode: "",
      showQR: false,
      alipayShow: false,
      pageUrl: "",

      redirectData: {
        data: {}
      },
      cbHref: {},
      showPacket: false,
      ignoreNotice: 0,
      isclick: false,
      pageTag: ""
    };
  },
  watch: {
    buttons(val) {
      if (val && val.constructor === Array && val.length > 0) {
        val.map(item => {
          if (item.value == 54) {
            this.confirmPayText = "确定";
          }
        });
      }
    }
  },
  activated() {
    this.initPopup();
  },
  methods: {
    // recharge充值支付
    async rechargePay(pay_type, response, ordersn, flag) {
      if (pay_type == 1) {
        // 微信充值
        wx.config(response.data.js);
        this.WXPay(response.data.config);
      } else if (pay_type == 48) {
        // 门店余额充值新增的充值方式
        if (flag === "storeBalance") {
          this.newWXPay(response.data.config, response.data.redirect || "home");
        }
      } else if (pay_type == 49) {
        // 门店余额充值新增的充值方式
        if (flag === "storeBalance") {
          this.$router.push(
            this.fun.getUrl("alipay", {
              status: 49,
              recharge_money: this.money,
              order_pay_id: ordersn,
              uid: window.localStorage.uid,
              pid: window.localStorage.uid
            })
          );
        }
      } else if (pay_type == 3) {
        Toast(response.msg);
        this.$router.push(this.fun.getUrl("auctionLove"));
      } else if (pay_type == 2) {
        if (flag === "recharge") {
          let alipayRes = await $http.post("plugin.credit-inventory.frontend.controllers.recharge.alipay", { order_sn: this.ordersn });
          if (alipayRes.result !== 1) {
            Toast.fail(alipayRes.msg);
            return;
          }
          window.location.href = alipayRes.data;
        } else if (flag === "handSign") {
          let alipayRes = await $http.post("plugin.hand-sign-protocol.frontend.controllers.protocol.alipay", { order_sn: this.ordersn });
          if (alipayRes.result !== 1) {
            Toast.fail(alipayRes.msg);
            return;
          }
          this.$router.push(this.fun.getUrl("alipayCloud", { status: "handSign", url: alipayRes.data }));
        } else if (flag === "storeBalance") {
          // console.log('storeBalance门店独立余额 -- 支付宝');
          // 门店独立余额 -- 支付宝
          let alipayRes = await $http.post("plugin.store-cashier.frontend.store.balance.balance.alipay", { order_sn: this.ordersn });
          if (alipayRes.result !== 1) {
            Toast.fail(alipayRes.msg);
            return;
          }
          this.$router.push(
            this.fun.getUrl("alipayCloud", {
              status: "80",
              url: alipayRes.data
            })
          );
        } else if (flag === "balance") {
          this.$router.push(
            this.fun.getUrl("alipay", {
              status: "1",
              recharge_money: this.money,
              order_pay_id: ordersn,
              uid: window.localStorage.uid,
              pid: window.localStorage.uid
            })
          );
        } else {
          this.$router.push(
            this.fun.getUrl("love_alipay", {
              status: "1",
              recharge_money: this.money,
              order_pay_id: ordersn,
              uid: window.localStorage.uid,
              pid: window.localStorage.uid,
              tag: "love"
            })
          );
        }
      } else if (pay_type == 6) {
        this.getWeChatPayParams2_recharge(ordersn);
      } else if (pay_type == 9) {
        this.appWeiPay_recharge(ordersn);
      } else if (pay_type == 10) {
        this.appAliPay_recharge(response.data.isnewalipay, ordersn);
      } else if (pay_type == 12) {
        this.newWechatPay_recharge(ordersn);
      } else if (pay_type == 7) {
        // 第三方支付宝
        this.newAlipay_recharge(ordersn);
      } else if (pay_type == 19) {
        // eup支付
        this.eupPay(ordersn);
      } else if (pay_type == 21) {
        if (response.data.status == 200) {
          if (!this.fun.isWeiXin()) {
            this.$router.push(
              this.fun.getUrl("wft_balance_recharge", {
                status: "12",
                url: response.data.code_url
              })
            );
          } else {
            this.$router.push(
              this.fun.getUrl("wft_balance_recharge_copy", {
                url: response.data.code_url,
                code_url: response.data.code_img_url
              })
            );
          }
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      } else if (pay_type == 28) {
        // 第三方支付汇聚  微信
        let initial_id = JSON.parse(localStorage.getItem("globalParameter")).initial_id;
        let mini_url = "";
        if (flag === "love") {
          mini_url = "/packageB/member/love/LoveRecharge/LoveRecharge";
        } else if (flag === "balance") {
          mini_url = "/packageA/member/balance/balance_recharge/balance_recharge";
        } else if (flag === "recharge") {
          mini_url = "/packageH/credit_value/recharge/recharge";
        }
        if (initial_id && this.fun.isApp()) {
          this.isclick = false;
          YDB.MiniWX(initial_id, mini_url);
          return;
        }
        if (initial_id && this.fun.isCPS() && this.fun.isCPSAPPI()) {
          this.isclick = false;
          let json = {
            mini_route: mini_url,
            mini_id: initial_id
          };
          if (this.fun.isIosOrAndroid() === "ios") {
            miniWXIOS({ body: "miniWXIOS", json: JSON.stringify(json) });
          } else {
            miniWXAndroid(JSON.stringify(json));
          }
          return;
        }

        if (response.data.data.rc_Result) {
          this.newWXPay(JSON.parse(response.data.data.rc_Result));
        }
      } else if (pay_type == 29) {
        // 第三方支付汇聚  支付宝
        if (flag === "balance") {
          this.$router.push(this.fun.getUrl("alipayCloud", { status: "hj_url", url: response.data.data.rc_Result }));
        } else if (response.data.data.rc_Result) {
          window.location.href = response.data.data.rc_Result;
        } else if (response.data.msg != "") {
          this.$dialog.alert({ message: response.data.msg });
        }
      } else if (pay_type == 23) {
        // 达人链
        this.talentPay(ordersn);
      } else if (pay_type == 33) {
        if (flag === "balance") {
          window.location.href = response.data.url;
        } else {
          this.jueqiAlipay_recharge(ordersn);
        }
      } else if (pay_type == 50) {
        window.location.href = response.data.mweb_url;
      } else if (pay_type == 59) {
        this.getQuick(ordersn, flag);
      } else if (pay_type == 202006) {
        // CMC支付 member_balance_rechargecontroller.js
        this.cmcPay(ordersn);
      } else if (pay_type == 81) {
        // 杉德-支付宝 充值直接跳去第三方
        window.location.href = response.data.pay_msg.link;
      } else if (pay_type == 82) {
        // 杉德-微信
        this.newWXPay(response.data.pay_msg.js_prepay_info);
      } else if (pay_type == 79) {
        this.$router.push(
          this.fun.getUrl("alipayCloud", {
            status: "79",
            url: response.data.pay_msg.qr_code
          })
        );
      } else if(pay_type == 85){
        // 乐刷支付宝直接跳去第三方
        window.location.href = response.data.pay_msg.link;
      } else if(pay_type == 86){
        this.newWXPay(response.data.pay_msg);
      }else if (pay_type == 78) {
        this.newWXPay(response.data.pay_msg.js_prepay_info);
      }
    },
    storeBalance() {
      $http.get("plugin.store-balance.frontend.pay.index", { order_pay_id: this.order_pay_id, store_id: this.$route.params.store_id }, "").then(response => {
        if (response.result == 1) {
          this.checkoutConsumePacket();
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },
    getWeChatPayParams2_recharge(ordersn) {
      // 云微信充值方法
      $http.get("finance.balance.cloudWechatPay", { ordersn: ordersn }, "").then(response => {
        if (response.result == 1) {
          window.location.href = response.data;
        } else {
          this.$dialog.alert({ message: response.msg });
        }
        this.isclick = false;
      });
    },
    appWeiPay_recharge(ordersn) {
      this.isclick = false;
      YDB.SetWxpayInfo(this.$store.state.temp.mailInfo.name, "订单号：" + ordersn, this.money, ordersn, this.fun.getKeyByI());
    },
    appAliPay_recharge(isnewalipay, ordersn) {
      this.isclick = false;
      if (isnewalipay == 1) {
        YDB.SetRSA2AlipayInfo(this.$store.state.temp.mailInfo.name, this.fun.getKeyByI(), this.money, this.fun.getKeyByI() + "_" + ordersn);
      } else {
        YDB.SetAlipayInfo(this.$store.state.temp.mailInfo.name, this.fun.getKeyByI(), this.money, this.fun.getKeyByI() + "_" + ordersn);
      }
    },
    newWechatPay_recharge(ordersn) {
      // 新版微信
      $http.get("order.merge-pay.yunPayWechat", { order_pay_id: ordersn }, "").then(response => {
        if (response.result === 1) {
          this.newWXPay(response.data);
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },
    newAlipay_recharge(ordersn) {
      $http.get("finance.balance.alipay", { order_sn: ordersn }, "").then(response => {
        if (response.result === 1) {
          this.$router.push(
            this.fun.getUrl("alipayCloud", {
              status: "7",
              url: response.data
            })
          );
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },
    eupPay(ordersn) {
      $http
        .get("plugin.eup-pay.api.eup-recharge.index", { order_sn: ordersn }, " ")
        .then(res => {
          if (res.result == 1) {
            window.location.href = res.data.url;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    talentPay(ordersn) {
      // 达人链
      $http
        .get("plugin.pld-pay.api.pld-recharge.index", { order_sn: ordersn }, " ")
        .then(res => {
          if (res.result == 1) {
            window.location.href = res.data.url;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    jueqiAlipay_recharge(ordersn) {
      $http
        .get("order.merge-pay.wechat-pay-jueqi", {
          order_pay_id: ordersn
        })
        .then(response => {
          if (response.result == 1) {
            window.location.href = response.data.url;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    getQuick(ordersn, flag) {
      let status = 3;
      let url = "plugin.converge_pay.frontend.controllers.quick-pay.love-recharge";
      if (flag === "balance") {
        status = 2;
        url = "plugin.converge_pay.frontend.controllers.quick-pay.show-recharge";
      } else if (flag === "recharge") {
        status = 1;
        url = "plugin.converge_pay.frontend.controllers.quick-pay.credit-recharge";
      }
      $http.get(url, { ordersn: ordersn }).then(response => {
        if (response.result == 1) {
          if (response.data.have_bank_card == 0) {
            this.$router.push(this.fun.getUrl("addBankFirst", { order_pay_id: ordersn, status: status }));
          } else {
            this.$router.push(this.fun.getUrl("chooseBank", { order_pay_id: ordersn, status: status }));
          }
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },
    cmcPay(ordersn) {
      $http.get("plugin.cmc-pay.frontend.cmc-recharge.index", { order_sn: ordersn }, "").then(response => {
        if (response.result === 1) {
          this.money = null;
          this.getData();
          this.$dialog.alert({ message: response.msg });
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },
    // recharge充值支付end

    // 打赏类的支付（没有订单号）
    handleOtherPay(btn, response, flag) {
      this.pageTag = flag;
      switch (btn.value) {
        case 1: //微信
          wx.config(response.data.js);
          this.WXPay(response.data.config);
          break;
        case 2: //支付宝
          if (flag === "clockin") {
            // 早起打卡
            this.$router.push(
              this.fun.getUrl("alipayClockin", {
                status: "5",
                url: response.data
              })
            );
          } else {
            this.$router.push(
              this.fun.getUrl("alipayCourse", {
                status: "9",
                url: response.data
              })
            );
          }
          break;
        case 3: //余额
          if (flag === "clockin") {
            // 早起打卡
            if (this.fun.isTextEmpty(response.data.redirect)) {
              this.getTodayClockOn(); // 重新获取
              this.getCurrentPayStatus();

              this.$dialog.alert({ message: response.msg }).then(() => {
                this.$router.push(this.fun.getUrl("home"));
              });
            } else {
              this.getTodayClockOn(); // 重新获取
              this.getCurrentPayStatus();
              Toast(response.msg);
              window.location.href = response.data.redirect;
            }
          } else {
            // 其余都是弹窗一下
            this.isclick = false;
            this.$dialog.alert({ message: response.msg }).then(() => {
              if (flag === "newDraw") {
                // 抽奖
                if (window.history.length <= 1) {
                  this.$router.push(this.fun.getUrl("newDrawIndex", { id: this.info_form.activity_id }));
                } else {
                  this.$router.go(-1);
                }
              } else if (flag === "pay_list") {
                // 文章付费
                if (this.goback) {
                  this.$router.push(this.fun.getUrl("home"));
                } else {
                  if (this.$route.query.fromTarget && this.$route.query.fromTarget == "voiceList") {
                    this.$router.push(this.fun.getUrl("VoiceList"));
                  } else {
                    this.$router.push(this.fun.getUrl("notice"));
                  }
                }
              } else if (flag === "auction") {
                // 拍卖
                this.rewardPayshow = false;
                this.getData();
              } else if (flag === "groupWork") {
                this.$router.push(this.fun.getUrl("groupWorkMy", {}));
                return;
              }
            });
          }
          break;
        case 6: //新版微信 link
          window.location.href = response.data;
          break;
        case 12: //芸支付 微信
          this.newWXPay(response.data.config);
          break;
        case 7: //云收银支付宝
          if (flag === "clockin") {
            this.$router.push(
              this.fun.getUrl("alipayClockin", {
                status: "5",
                url: response.data
              })
            );
          } else {
            this.$router.push(
              this.fun.getUrl("alipayCourse", {
                status: "9",
                url: response.data
              })
            );
          }
          break;
        case 9:
          //微信app
          YDB.SetWxpayInfo(this.$store.state.temp.mailInfo.name, "订单号：" + response.data.order_sn, this.rewardMoney, response.data.order_sn, this.fun.getKeyByI());
          break;
        case 10:
          // 支付宝云打包
          if (response.data.isnewalipay == 1) {
            YDB.SetRSA2AlipayInfo(this.$store.state.temp.mailInfo.name, this.fun.getKeyByI(), this.money, response.data.order_sn);
          } else {
            YDB.SetAlipayInfo(this.$store.state.temp.mailInfo.name, this.fun.getKeyByI(), this.money, response.data.order_sn);
          }
          break;
        case 28: //汇聚 微信
          this.newWXPay(JSON.parse(response.data.data.rc_Result));
          break;
        case 29: //汇聚 支付宝
          this.HJToappliy(response.data);
          break;
        case 50: //微信H5
          window.location.href = response.data.mweb_url;
          break;
        case 81: //杉德-支付宝
          this.OtherPay_sandAlipay();
          break;
        case 82: //杉德-微信
          this.OtherPay_sandWXpay();
          break;
        case 86: //乐刷微信
          this.newWXPay(response.data.pay_msg);
          break;
        case 85://乐刷支付宝
          window.location.href = response.data.pay_msg.link;
        default:
          break;
      }
    },
    OtherPay_sandAlipay() {
      $http.get("order.merge-pay.sandpay-alipay", {}).then(response => {
        if (response.result == 1) {
          window.location.href = response.data.pay_msg.link;
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    OtherPay_sandWXpay() {
      if (!this.fun.isWeiXin()) {
        this.$dialog.alert({
          message: "请在手机微信上点击支付"
        });
        this.isclick = false;
        return;
      }
      $http.get("order.merge-pay.sandpay-wechat", {}, "").then(response => {
        if (response.result == 1) {
          // window.location.href = response.data.pay_msg.qr_code;
          console.log(response.data);
          this.newWXPay(response.data.pay_msg.js_prepay_info);
        } else {
          this.$dialog.alert({
            message: response.msg
          });
        }
        this.isclick = false;
      });
    },
    HJToappliy(data) {
      // 汇聚支付跳转
      if (this.pageTag == "groupWork") {
        this.$router.push(this.fun.getUrl("groupWorkMy", {}));
        return;
      }
      if (data.data.rc_Result) {
        window.location.href = data.data.data.rc_Result;
      } else if (data.data.msg != "") {
        this.$dialog.alert({ message: data.data.msg });
      }
    },
    // 打赏类的支付end

    // 余额支付密码弹窗
    changePopupSpecs(flag) {
      this.popupSpecs = flag;
    },
    initPopup() {
      this.popupSpecs = false;
      this.showZFBQR = false;
      this.isZFBQR = false;
      this.qrcode = "";
      this.showQR = false;
      this.alipayShow = false;

      this.pageUrl = "";
      this.redirectData = {};
      this.cbHref = {};
      this.showPacket = false;

      this.isclick = false;
    },
    closePacket() {
      this.showPacket = false;
      this.toRedirect();
    },
    // 余额支付密码弹窗end

    checkoutConsumePacket() {
      // if (JSON.parse(window.localStorage.getItem("globalParameter")).consume_red_packet_status == 1 && this.order_ids) {
      //   // 判断消费红包开启再请求
      //   $http
      //     .post(
      //       "plugin.consume-red-packet.Frontend.Modules.Packet.Controllers.has.index",
      //       {
      //         order_id: this.order_ids.split(",")
      //       },
      //       "loading"
      //     )
      //     .then(
      //       response => {
      //         if (response.result == 1) {
      //           this.showPacket = true;
      //         } else {
      //           this.toRedirect();
      //         }
      //       },
      //       response => {
      //         this.toRedirect();
      //       }
      //     );
      // } else {
      //   this.toRedirect();
      // }
      this.toRedirect();
    },
    toRedirect() {
      let json = {
        ids: this.order_pay_id
      };
      if (this.is_cps) {
        json.is_cps = this.is_cps;
      } else if (!this.fun.isTextEmpty(this.pageUrl)) {
        json.pageUrl = this.pageUr;
      } else if (this.order_sn) {
        json.sn = this.order_sn;
      }
      //console.log('从这里支付完成');
     // console.log('this.order_pay_id:'+this.order_pay_id);
     // console.log('this.order_sn:'+this.order_sn);

     let that = this;
      $http.get("orderPay.successfulPayment.getOrderGoodsInfo", {order_pay_id:this.order_pay_id}, " ").then(
            res => {
              //console.log('数量:'+res.data.length);
              let orderArr = res.data;
              for(let i=0;i<orderArr.length;i++){
                zhuge.track('订单支付成功',{
                    '订单表ID': ''+that.order_pay_id,
                    '支付流水号': ''+that.order_sn,
                    '商品ID': ''+orderArr[i].goods_id,
                    '购买数量':orderArr[i].total,
                    '用户ID':''+orderArr[i].uid,
                    '用户昵称':orderArr[i].nickname,
                    '商品名称':orderArr[i].title
                  });
              }
      });

      this.$router.push(this.fun.getUrl("payBack", json));



      // 控制支付跳转
      // if (this.is_cps) {
      //   //聚合cps卡密
      //   Toast.success("支付成功");
      //   this.$router.push(this.fun.getUrl("cpsPwd", { order_id: this.order_ids }));
      //   return;
      // }
      // if (!this.fun.isTextEmpty(this.pageUrl)) {
      //   Toast.success("支付成功");
      //   if (this.pageUrl == "enroll") {
      //     this.$router.push(this.fun.getUrl("activityHome"));
      //   } else {
      //     this.$router.push(this.fun.getUrl("Myshaky"));
      //   }
      //   return;
      // }

      // if (this.order_sn) {
      //   this.payCallBack();
      // }

      // if (this.cbHref.cbHref) {
      //   if (this.cbHref.cbHref && this.cbHref.cbHref.indexOf("showBalances") > -1) {
      //     this.goShowBalances();
      //   } else {
      //     Toast.success("支付成功");
      //     window.location.href = this.cbHref.cbHref;
      //   }
      // } else {
      //   if (!this.redirectData.data || this.fun.isTextEmpty(this.redirectData.data.redirect)) {
      //     Toast.success("支付成功");
      //     this.$router.push(this.fun.getUrl("home"));
      //   } else {
      //     if (this.redirectData.data && this.redirectData.data.redirect && this.redirectData.data.redirect.indexOf("showBalances") > -1) {
      //       Toast(this.redirectData.msg);
      //       this.goShowBalances();
      //     } else {
      //       Toast(this.redirectData.msg);
      //       window.location.href = this.redirectData.data.redirect;
      //     }
      //   }
      // }
    },
    payCallBack() {
      // 支付完根据订单号例如order_sn：PN2107291603FE0BF4重定向跳转地址
      $http
        .get(
          "payment.callback-page.index",
          {
            sn: this.order_sn
          },
          "..."
        )
        .then(response => {
          Toast.success("支付成功");
          if (response.result == 1) {
            if (response.data.redirect && response.data.redirect.indexOf("showBalances") > -1) {
              this.goShowBalances();
            } else {
              window.location.href = response.data.redirect;
            }
          } else {
            this.$router.push(this.fun.getUrl("home"));
          }
        });
    },
    goShowBalances() {
      this.$router.push(
        this.fun.getUrl("showBalances", {
          pay_sn: this.order_sn,
          pay_type: "pay"
        })
      );
    },

    // 商城订单支付类型 （有订单号）
    handlePayError() {
      this.isclick = false;
    },
    //支付按钮class
    getIconUrl(item) {
      let icon_url = "";
      switch (item.code) {
        case "wechatPay":
        case "cloudPayWechat":
        case "wechatApp":
        case "yunPayWechat":
        case "wftPay":
        case "yop":
        case "convergePayWechat":
        case "WechatScan":
        case "WechatFace":
        case "WechatJsapi":
        case "wechatAggregatePay":
        case "convergePaySeparate":
        case "wechatCpsAppPay":
          icon_url = "icon-pay_wechat";
          break;
        case "alipay":
        case "cloudPayAlipay":
        case "alipayApp":
        case "yunPayAlipay":
        case "wftAlipay":
        case "convergePayAlipay":
        case "yopAlipay":
        case "AlipayScan":
        case "AlipayFace":
        case "AlipayJsapi":
        case "alipayAggregatePay":
        case "convergeAliPaySeparate":
          icon_url = "icon-pay_alipay";
          break;
        case "balance":
        case "MemberCard":
          icon_url = "icon-pay_yue";
          break;
        case "remittance":
          icon_url = "icon-pay_remittance";
          break;
        case "anotherPay":
          icon_url = "icon-pay_otherpay";
          break;
        case "UsdtPay":
          icon_url = "icon-pay_utsd";
          break;
        case "DepositPay":
          icon_url = "icon-pay_prepay";
          break;
        case "convergeQuickPay":
          icon_url = "icon-pay_quick";
          break;
        case "COD":
          icon_url = "icon-pay_cashondelivery";
          break;
        case "dcmScanPay":
          icon_url = "icon-fontclass-saomazhifu";
          break;
        case "parentPayment":
          icon_url = "icon-fontclass-daifu1";
          break;
        default:
          icon_url = "icon-pay_default";
          break;
      }
      return icon_url;
    },
    btnclass2(type) {
      if (type == 1 || type == 6 || type == 9 || type == 12 || type == 56) {
        return "wei-btn";
      } else if (type == 2 || type == 10 || type == 7) {
        return "zhi-btn";
      } else {
        return "yu-btn";
      }
    },
    btnclass(type) {
      if (type == 1 || type == 6 || type == 9 || type == 12 || type == 20 || type == 22 || type == 48) {
        return "icon-balance_i";
      } else if (type == 2 || type == 10 || type == 49 || type == 52) {
        return "icon-balance_j";
      } else if (type == 18) {
        return "icon-balance_d";
      } else if (type == 19) {
        return "icon-balance_g";
      } else {
        return "icon-balance_h";
      }
    },
    confirm(btn) {
      // 商城有订单号类型的支付
      let type = btn.value;
      // type-1 微信, type-2 支付宝,type-7 APP微信, type-8 APP支付宝 ,type-6 云收银支付,type-3 余额支付 type 28 微信支付-汇聚 type 29 支付宝支付-汇聚
      // type-79 支付宝-商云客聚合,type-78 商云客支付---微信,
      if (this.isclick) {
        // 控制支付请求多次
        Toast("还在请求支付，请等待~");
        return;
      }

      this.isclick = true;
      if (type == 1) {
        this.getWeChatPayParams();
      } else if (type == 2) {
        // 支付宝
        this.$router.push(
          this.fun.getUrl("alipay", {
            status: 2,
            recharge_money: this.money,
            order_pay_id: this.order_pay_id,
            uid: this.uid,
            pid: this.$route.query.pid ? this.$route.query.pid : this.uid
          })
        );
      } else if (type == 9) {
        this.appWeiPay();
      } else if (type == 10) {
        this.appAliPay();
      } else if (type == 6) {
        this.getWeChatPayParams2();
      } else if (type == 3) {
        // 是否开启余额密码支付
        if (btn.need_password == 1) {
          this.popupSpecs = true;
          this.payarr = "";
          this.isclick = false;
        } else {
          this.balancePay(""); // 无密码
        }
      } else if (type == 12) {
        // 新版微信支付
        this.newWechatPay();
      } else if (type == 11 || type == "cashPay") {
        // 到店支付
        this.cashPay(type);
      } else if (type == 8) {
        // 现金支付
        this.cashPay(type);
      } else if (type == 7) {
        // 云收银支付宝
        this.cloudAlipay();
      } else if (type == 14) {
        // 找人代付
        this.otherPay();
      } else if (type == 15) {
        this.yunPayAlipay();
      } else if (type == 16) {
        this.transferAccounts();
      } else if (type == 17) {
        this.payMoney();
      } else if (type == 21) {
        this.alipayMoney();
      } else if (type == 26) {
        this.yihepay();
      } else if (type == 27) {
        // this.usdtPay();
      } else if (type == 28) {
        this.getwechatPay();
      } else if (type == 29) {
        this.getwechatPayAili();
      } else if (type == 31) {
        this.getadvancedeposit();
      } else if (type == 32) {
        this.yiBaoAlipay();
      } else if (type == 33) {
        this.jueqiAlipay();
      } else if (type == 42) {
        // 钱包支付
        this.judge(type);
      } else if (type == 43) {
        // 钱包绑卡支付
        this.judge(type);
      } else if (type == 48) {
        this.wechatJsapiPay(type);
      } else if (type == 49) {
        this.$router.push(
          this.fun.getUrl("alipay", {
            status: 49,
            recharge_money: 22,
            order_pay_id: this.order_pay_id,
            uid: this.uid,
            pid: this.uid
          })
        );
      } else if (type == 60) {
        this.yiBaoProWechat();
      } else if (type == 61) {
        this.yiBaoProAlipay();
      } else if (type == 50) {
        if (this.fun.isAlipay()) {
          this.$router.push(
            this.fun.getUrl(
              "wxpay",
              {
                status: 2
              },
              {
                order_pay_id: this.order_pay_id,
                uid: this.$route.query.pid ? this.$route.query.pid : window.localStorage.getItem("uid"),
                pid: this.$route.query.pid ? this.$route.query.pid : window.localStorage.getItem("uid")
              }
            )
          );
        } else {
          this.H5WechatPay();
        }
      } else if (btn == 54) {
        this.sureBtn();
      } else if (type == 56) {
        this.HKWechatPay();
      } else if (type == 58) {
        this.payPalpay();
      } else if (type == 62) {
        this.isclick = false;
        if (!this.fun.isWeiXin()) {
          this.HKAlipay();
        } else {
          this.alipayShow = true;
        }
      } else if (type == 59) {
        this.quick_pay();
      } else if (type == 63 || type == 64) {
        this.getQingYunPay(type); //门店聚合支付(47385)
      } else if (type == 68) {
        this.scancodeAccount();
      } else if (type == 71) {
        this.isclick = false;
        if (this.fun.isCPS() && this.fun.isCPSAPPI()) {
          let json = { order_pay_id: this.order_pay_id };
          if (this.fun.isIosOrAndroid() === "ios") {
            wxPayIOS({ body: "wxPayIOS", json: JSON.stringify(json) });
          } else {
            wxPayAndroid(JSON.stringify(json));
          }
        }
      } else if (type == 75) {
        // 汇聚微信支付-分账
        this.huiju_wechat(type);
      } else if (type == 76) {
        // 汇聚支付宝支付-分账
        this.huiju_alipay(type);
      } else if (type == 77) {
        this.$router.push(this.fun.getUrl("superiorPaymentIndex", { order_id: this.order_ids }));
      } else if (type == 80) {
        this.storeBalance();
      } else if (type == 79) {
        this.xfpayAlipay(this.order_pay_id);
      } else if (type == 78) {
        this.xfpayWechat(this.order_pay_id);
      } else if (type == 81) {
        this.sandpayAlipay(this.order_pay_id);
      } else if (type == 82) {
        this.sandpayWechat(this.order_pay_id);
      } else if (type == 84) {
        this.lakalaAlipay(this.order_pay_id);
      } else if (type == 83) {
        this.lakalaWechat(this.order_pay_id);
      } else if(type == 85){
        this.Otherleshua_Alipay()
      } else if (type == 86){
        this.Otherleshua_wechat(this.order_pay_id);
      } else if (type == 88){
        // this.getYeePayWeChatPayParams();
        this.certified_show = true;
      }
    },
    getMiniWeChatPayParams() {
      $http
        .get("order.merge-pay.wechatPay", {
          app_type: "wechat",
          client_type: 2,
          order_pay_id: this.order_pay_id,
          pid: this.$route.query.pid ? this.$route.query.pid : this.uid
        })
        .then(response => {
          if (response.result == 1) {
            let pay_data = response.data.config;
            let payParams = {
              timeStamp: pay_data.timestamp,
              nonceStr: pay_data.nonceStr,
              package: pay_data.package,
              signType: pay_data.signType,
              paySign: pay_data.paySign
            };
            this.miniWxPay(payParams);
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
          this.handlePayError();
        });
    },
    miniWxPay(payParams) {
      let params =
        "?timestamp=" +
        payParams.timeStamp +
        "&nonceStr=" +
        payParams.nonceStr +
        "&package=" +
        encodeURIComponent(payParams.package) +
        "&signType=" +
        payParams.signType +
        "&paySign=" +
        payParams.paySign;
      // 定义path 与小程序的支付页面的路径相对应
      let path = "/packageD/buy/orderPay/orderPay" + params;
      // 通过JSSDK的api使小程序跳转到指定的小程序页面
      wx.miniProgram.navigateTo({ url: path });

      this.isclick = false;
    },
    WXPay(payParams, cbHref) {
      let that = this;
      wx.chooseWXPay({
        appId: payParams.appId,
        timestamp: payParams.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payParams.nonceStr, // 支付签名随机串，不长于 32 位
        package: payParams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: payParams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: payParams.paySign, // 支付签名
        success: res => {
          // 支付成功后的回调函数
          if (res.errMsg == "chooseWXPay:ok") {
            if (that.pageTag == "groupWork") {
              that.$router.push(that.fun.getUrl("groupWorkMy", {}));
              return;
            }
            if (!cbHref) {
              Toast.success("支付成功");
              that.$router.go(-1);
            } else {
              that.cbHref = { cbHref: cbHref };
              that.checkoutConsumePacket();
            }
          } else {
            that.$dialog.alert({
              message: "支付失败"
            });
            that.handlePayError();
            console.log(payParams, "支付失败参数咋样");
          }
        },
        cancel: res => {
          // 支付取消
          that.handlePayError();
        },
        fail: res => {
          that.$dialog.alert({
            message: "支付失败，请返回重试"
          });
          that.handlePayError();
        }
      });
    },
    newWXPay(payParams, cbHref) {
      try {
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: payParams.appId, // 公众号名称，由商户传入
            timeStamp: payParams.timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr: payParams.nonceStr, // 随机串
            package: payParams.package,
            signType: payParams.signType, // 微信签名方式：
            paySign: payParams.paySign // 微信签名
          },
          res => {
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              if (this.pageTag == "groupWork") {
                this.$router.push(this.fun.getUrl("groupWorkMy", {}));
                return;
              }
              if (!cbHref) {
                Toast.success("支付成功");
                this.$router.go(-1);
              } else {
                this.cbHref = { cbHref: cbHref };
                this.checkoutConsumePacket();
              }
            } else {
              this.$dialog.alert({
                message: "支付失败"
              });
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
      this.handlePayError();
    },
    getWeChatPayParams() {
      // 微信
      if (window.isMiniprogram) {
        this.getMiniWeChatPayParams();
        this.handlePayError();
        return;
      }

      $http
        .get("order.merge-pay.wechatPay", {
          order_pay_id: this.order_pay_id,
          pid: this.$route.query.pid ? this.$route.query.pid : this.uid
        })
        .then(response => {
          if (response.result == 1) {
            wx.config(response.data.js);
            this.WXPay(response.data.config, response.data.redirect || "home");
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
          this.handlePayError();
        });
    },
    getYeePayWeChatPayParams() {
      // 微信
      let that = this;
      $http.get("plugin.overseas.frontend.merge-pay.wechatPay", {
        order_pay_id: this.order_pay_id,
        ignore_notice: this.ignoreNotice,
        pid: this.$route.query.pid ? this.$route.query.pid : this.uid
      }).then(response => {
        console.log(response.data.should_confirm);
        if (response.result == 1) {
          wx.config(response.data.js);
          let config = response.data.config;
          config['timestamp'] = config['timeStamp'];
          this.WXPay(config, response.data.redirect || "home");
        } else {
          console.log(response.data.should_confirm);
          if(response.data.should_confirm !== undefined && response.data.should_confirm){
            that.$dialog.alert({
              title: '额度提醒',
              message:response.msg
            })
              .then(() => {
                that.ignoreNotice = 1;
                that.getYeePayWeChatPayParams();
                // on confirm
              })
              .catch(() => {
                // on cancel
              });
            return;
          }else{
            this.$dialog.alert({
              message: response.msg
            });
          }
        }
        this.handlePayError();
      });
    },
    appWeiPay() {
      // 云打包微信
      $http
        .get("order.merge-pay.wechatAppPay", {
          order_pay_id: this.order_pay_id,
          pid: this.$route.query.pid ? this.$route.query.pid : this.uid
        })
        .then(response => {
          this.isclick = false;
          if (response.result == 1) {
            YDB.SetWxpayInfo(this.$store.state.temp.mailInfo.name, "订单号：" + this.order_sn, this.money, this.order_sn, this.fun.getKeyByI());
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
        });
    },
    appAliPay() {
      // 云打包支付宝
      $http
        .get("order.merge-pay.alipayAppRay", {
          order_pay_id: this.order_pay_id,
          pid: this.$route.query.pid ? this.$route.query.pid : this.uid
        })
        .then(response => {
          if (response.result == 1) {
            this.isclick = false;
            // order.merge-pay.alipayAppRay  这个接口返回的order_sn是有拼接平台id的
            // 否则要这样that.fun.getKeyByI() +'_'+this.ordersn
            if (response.data.isnewalipay == 1) {
              YDB.SetRSA2AlipayInfo(this.$store.state.temp.mailInfo.name, this.fun.getKeyByI(), this.money, response.data.order_sn);
            } else {
              YDB.SetAlipayInfo(this.$store.state.temp.mailInfo.name, this.fun.getKeyByI(), this.money, response.data.order_sn);
            }
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
        });
    },
    getWeChatPayParams2() {
      // 云微信充值方法
      $http
        .get("order.merge-pay.cloudWechatPay", {
          order_pay_id: this.order_pay_id,
          pid: this.$route.query.pid ? this.$route.query.pid : this.uid
        })
        .then(response => {
          if (response.result == 1) {
            window.location.href = response.data;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
          this.handlePayError();
        });
    },
    balancePay(password) {
      // 余额支付
      let json = {
        order_pay_id: this.order_pay_id,
        pid: this.$route.query.pid ? this.$route.query.pid : this.uid
      };

      if (!this.fun.isTextEmpty(password)) {
        json = {
          order_pay_id: this.order_pay_id,
          payment_password: password,
          pid: this.$route.query.pid ? this.$route.query.pid : this.uid
        };
      }

      $http.get("order.credit-merge-pay.credit2", json, "").then(response => {
        if (response.result == 1) {
          this.redirectData = response;
          this.cbHref = {};
          this.checkoutConsumePacket();
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    newWechatPay() {
      // 新版微信支付
      let json = {
        order_pay_id: this.order_pay_id,
        pid: this.$route.query.pid ? this.$route.query.pid : this.uid
      };
      $http.get("order.merge-pay.yunPayWechat", json, "").then(response => {
        if (response.result == 1) {
          this.newWXPay(response.data, response.data.redirect || "home");
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    cashPay(value) {
      if (value == "8") {
        // 现金支付
        $http
          .get("plugin.store-cashier.frontend.payment.cashPay.cashPay", {
            order_pay_id: this.order_pay_id,
            pid: this.uid
          })
          .then(response => {
            if (response.result == 1) {
              this.$dialog.alert({
                message: response.msg
              });
              this.$router.push(this.fun.getUrl("member"));
            } else {
              this.$dialog.alert({
                message: response.msg
              });
              this.$router.push(this.fun.getUrl("orderdetail", { order_id: this.order_pay_id }));
            }
          });
        return;
      }
      // 到店支付
      this.$router.push(
        this.fun.getUrl("orderCash", {
          order_pay_id: this.order_pay_id,
          pid: this.$route.query.pid ? this.$route.query.pid : this.uid
        })
      );
    },
    cloudAlipay() {
      // 云收银支付宝
      let json = {
        order_pay_id: this.order_pay_id,
        pid: this.$route.query.pid ? this.$route.query.pid : this.uid
      };
      $http.get("order.merge-pay.cloudAliPay", json, "").then(response => {
        if (response.result == 1) {
          this.$router.push(
            this.fun.getUrl("alipayCloud", {
              status: "6",
              url: response.data
            })
          );
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    otherPay() {
      // 找人代付
      this.$router.push(this.fun.getUrl("PayAnother", { order_id: this.order_ids }));
    },
    yunPayAlipay() {
      // 支付宝
      let json = {
        order_pay_id: this.order_pay_id,
        pid: this.$route.query.pid ? this.$route.query.pid : this.uid
      };
      $http.get("order.merge-pay.yunPayAlipay", json, "").then(response => {
        if (response.result == 1) {
          this.$router.push(
            this.fun.getUrl("alipayCloud", {
              status: "6",
              url: response.data
            })
          );
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    transferAccounts() {
      // 转账支付
      this.$router.push(
        this.fun.getUrl("TransferAccount", {
          id: this.order_pay_id,
          order_ids: this.$route.params.order_ids,
          status: "2"
        })
      );
    },
    payMoney() {
      // 货到付款
      $http.get("order.mergePay.COD", { order_pay_id: this.order_pay_id }).then(response => {
        if (response.result == 1) {
          this.redirectData = response;
          this.cbHref = {};
          this.checkoutConsumePacket();
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    alipayMoney() {
      // 支付宝
      $http.get("order.merge-pay.wft-alipay", { order_pay_id: this.order_pay_id }).then(response => {
        if (response.result == 1) {
          if (!this.fun.isTextEmpty(this.pageUrl)) {
            this.toRedirect();
          } else if (this.fun.isTextEmpty(response.data.code_url)) {
            Toast(response.msg);
            this.$router.replace(this.fun.getUrl("home"));
          } else {
            if (response.data.status == 200) {
              if (!this.fun.isWeiXin()) {
                this.$router.push(
                  this.fun.getUrl("wft_balance_recharge", {
                    status: "12",
                    url: response.data.code_url
                  })
                );
              } else {
                this.$router.push(
                  this.fun.getUrl("wft_balance_recharge_copy", {
                    url: response.data.code_url,
                    code_url: response.data.code_img_url
                  })
                );
              }
            } else {
              this.$dialog.alert({
                message: response.msg
              });
            }
          }
        } else {
          this.$dialog.alert({
            message: response.msg
          });
        }
        this.handlePayError();
      });
    },
    yihepay() {
      // 易合支付
      $http.get("order.merge-pay.yop-pay", { order_pay_id: this.order_pay_id }).then(response => {
        if (response.result == 1) {
          this.newWXPay(response.data.resultData);
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    xfpayAlipay(order_pay_id) {
      $http.get("order.merge-pay.xfpay-alipay", { order_pay_id: order_pay_id }).then(response => {
        if (response.result == 1) {
          this.$router.push(
            this.fun.getUrl("alipayCloud", {
              status: "79",
              url: response.data.pay_msg.qr_code
            })
          );
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    sandpayAlipay(order_pay_id) {
      $http.get("order.merge-pay.sandpay-alipay", { order_pay_id: order_pay_id }).then(response => {
        if (response.result == 1) {
          window.location.href = response.data.pay_msg.link;
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    async lakalaAlipay(order_pay_id) {
      $http.get("order.merge-pay.lakala-alipay", { order_pay_id: order_pay_id }).then(response => {
        if (response.result == 1) {
          window.location.href = response.data.pay_msg.link;
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    usdtPay() {
      // usdt支付
      $http.get("order.merge-pay.usdt-pay", { order_pay_id: this.order_pay_id }).then(response => {
        if (response.result === 1) {
          this.usdt_action = response.data.url;
          this.usdt_form = response.data.content;
          this.$nextTick(() => {
            document.getElementById("usdtubmit").submit();
          });
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    getwechatPay() {
      // 第三方支付 微信支付-汇聚
      let initial_id = JSON.parse(localStorage.getItem("globalParameter")).initial_id;
      if (initial_id && this.fun.isApp()) {
        this.isclick = false;
        YDB.MiniWX(initial_id, `/packageD/buy/orderPay/orderPay.html?order_id=${this.order_ids}&status=2`);
        return;
      }
      if (initial_id && this.fun.isCPS() && this.fun.isCPSAPPI()) {
        this.isclick = false;
        let json = {
          mini_route: `/packageD/buy/orderPay/orderPay.html?order_id=${this.order_ids}&status=2`,
          mini_id: initial_id
        };
        if (this.fun.isIosOrAndroid() === "ios") {
          miniWXIOS({ body: "miniWXIOS", json: JSON.stringify(json) });
        } else {
          miniWXAndroid(JSON.stringify(json));
        }
        return;
      }
      let json = { order_pay_id: this.order_pay_id };
      $http.get("order.merge-pay.wechat-pay-hj", json).then(res => {
        if (res.result == 1) {
          this.newWXPay(JSON.parse(res.data.data.rc_Result), res.data.redirect_url || "home");
        } else {
          this.$dialog.alert({
            message: res.msg
          });
          this.handlePayError();
        }
      });
    },
    getwechatPayAili() {
      // 第三方支付 支付宝-汇聚
      this.$router.push(
        this.fun.getUrl("HJalipay", {
          status: 29,
          order_pay_id: this.order_pay_id
        })
      );
    },
    getadvancedeposit() {
      //预存款支付
      $http
        .post("plugin.team-rewards.frontend.controllers.deposit-pay.index", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result === 1) {
            this.toRedirect();
          } else {
            Toast(response.msg);
          }
          this.isclick = false;
        });
    },
    yiBaoAlipay() {
      //易宝支付宝支付
      $http
        .get("order.merge-pay.yop-alipay", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result == 1) {
            window.location.href = response.data.resultData;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    jueqiAlipay() {
      // 崛企一码付
      $http
        .get("order.merge-pay.wechat-pay-jueqi", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result == 1) {
            window.location.href = response.data.url;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    judge(type) {
      $http.get("plugin.dragon-deposit.frontend.lcg-merchant.merchant-exist").then(response => {
        if (response.result == 1) {
          if (type == 42) {
            this.walletPay();
          } else if (type == 43) {
            this.cardPay();
          }
        } else {
          this.$dialog.alert({ message: response.msg }).then(() => {
            this.$router.replace(this.fun.getUrl("myWallet"));
          });
          this.handlePayError();
        }
      });
    },
    walletPay() {
      // 钱包支付
      $http
        .get("order.merge-pay.lcg-balance", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result == 1) {
            this.isclick = false;
            this.dragonPay(response.data);
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    cardPay() {
      // 钱包绑卡支付
      $http
        .get("order.merge-pay.lcg-bank-card", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result == 1) {
            this.isclick = false;
            this.dragonPay(response.data);
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    dragonPay(item) {
      //龙存管公共支付方法
      let obj = item.form_data;
      var form = document.createElement("form");
      form.method = "post";
      form.setAttribute("action", item.action_url);
      let arr = ["INFO", "BODY", "SIGN", "CONTENTTYPE"];
      for (let i of arr) {
        let a = document.createElement("input");
        a.setAttribute("name", i);
        a.setAttribute("value", obj[i]);
        form.appendChild(a);
      }
      document.body.appendChild(form);
      form.style.display = "none";
      form.submit();
      return form;
    },
    wechatJsapiPay(sn) {
      // 微信支付（服务商）
      if (window.isMiniprogram) {
        this.getMiniWeChatPayParams();
        return;
      }
      $http
        .get("order.merge-pay.wechat-jsapi-pay", {
          order_pay_id: this.order_pay_id || sn,
          pid: this.uid,
          store_id: this.$route.params.store_id
        })
        .then(response => {
          if (response.result == 1) {
            this.newWXPay(response.data.config, response.data.redirect || "home");
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              this.$router.replace(this.fun.getUrl("orderdetail", { order_id: this.order_pay_id }));
            });
            this.handlePayError();
          }
        });
    },
    yiBaoProWechat() {
      //易宝Pro微信支付
      $http.get("order.merge-pay.yop-pro-wechat", { order_pay_id: this.order_pay_id }).then(response => {
        if (response.result == 1) {
          this.newWXPay(response.data.resultData);
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    yiBaoProAlipay() {
      //易宝Pro支付宝支付
      $http
        .get("order.merge-pay.yop-pro-alipay", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result == 1) {
            window.location.href = response.data.resultData;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    H5WechatPay() {
      // 微信H5(扫码支付)
      $http
        .get(
          "order.merge-pay.wechat-h5",
          {
            order_pay_id: this.order_pay_id
          },
          "loading"
        )
        .then(response => {
          if (response.result == 1) {
            window.location.href = response.data.mweb_url;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    sureBtn() {
      // value 54  money == '0.00'
      $http
        .get("order.merge-pay.confirm-pay", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result == 1) {
            this.redirectData = response;
            this.checkoutConsumePacket();
          } else {
            this.handlePayError();
            this.$dialog.confirm({ message: response.msg }).then(() => {
              this.$router.push(this.fun.getUrl("home"));
            });
          }
        });
    },
    // 微信香港钱包(扫码支付)
    HKWechatPay() {
      $http
        .get(
          "order.merge-pay.hk-scan-pay",
          {
            order_pay_id: this.order_pay_id
          },
          "loading"
        )
        .then(response => {
          if (response.result == 1) {
            this.qrcode = response.data.qrcode;
            this.showQR = true;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
          this.handlePayError();
        });
    },
    payPalpay() {
      //PayPal支付
      $http
        .get("order.merge-pay.pay-pal", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result == 1) {
            window.location.href = response.data.approval_url;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    HKAlipay() {
      // 支付宝香港支付
      $http
        .get(
          "order.merge-pay.hk-scan-alipay",
          {
            order_pay_id: this.order_pay_id
          },
          "loading"
        )
        .then(response => {
          if (response.result == 1) {
            window.location.href = response.data.pay_url;
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    quick_pay() {
      // 汇聚快捷支付
      $http
        .get(
          "plugin.converge_pay.frontend.controllers.quick-pay.pay",
          {
            order_pay_id: this.order_pay_id
          },
          "loading"
        )
        .then(response => {
          if (response.result == 1) {
            if (response.data.have_bank_card == 0) {
              this.$router.push(this.fun.getUrl("addBankFirst", { order_pay_id: this.order_pay_id }));
            } else {
              this.$router.push(this.fun.getUrl("chooseBank", { order_pay_id: this.order_pay_id }));
            }
          } else {
            this.$dialog.alert({
              message: response.msg
            });
            this.handlePayError();
          }
        });
    },
    getQingYunPay(_type) {
      //只支持门店和门店收银台   聚合支付(47385)
      let _url = _type == 63 ? "plugin.store-aggregate-pay.frontend.aggregate-pay.wechat" : "plugin.store-aggregate-pay.frontend.aggregate-pay.alipay";
      $http
        .get(_url, {
          order_pay_id: this.order_pay_id,
          pid: this.uid
        })
        .then(response => {
          if (response.result == 1) {
            if (_type == 63) {
              // 微信公众号支付改为跳转链接支付 [50143]
              window.location.href = response.data.jsapi_pay_url;
            } else {
              this.showZFBQR = true;
              this.$nextTick(() => {
                canvas = document.getElementById("qrccode-canvas");
                QRCode.toCanvas(canvas, response.data.url, error => {
                  if (error) {
                    console.log(error);
                    Toast("生成支付宝支付二维码失败！");
                  } else {
                    this.isZFBQR = true;
                    console.log("success");
                  }
                });
              });
              this.handlePayError();
            }
            this.isclick = false;
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              this.$router.replace(this.fun.getUrl("orderdetail", { order_id: this.order_pay_id }));
            });
            this.handlePayError();
          }
        });
    },
    scancodeAccount() {
      //扫码支付
      this.$router.push(
        this.fun.getUrl("scancodeAccount", {
          id: this.order_pay_id,
          order_ids: this.$route.params.order_ids,
          status: "2"
        })
      );
    },
    huiju_wechat() {
      // 汇聚微信支付-分账
      if (!this.fun.isWeiXin()) {
        this.$dialog.alert({
          message: "请在手机微信上点击支付"
        });
        this.handlePayError();
        return;
      }
      $http.get("plugin.converge-alloc-funds.frontend.controllers.converge-separate.pay", { order_pay_id: this.order_pay_id }, "").then(response => {
        if (response.result == 1) {
          this.newWXPay(JSON.parse(response.data.rc_Result));
        } else {
          this.$dialog.alert({
            message: response.msg
          });
        }
        this.handlePayError();
      });
    },
    huiju_alipay() {
      // 汇聚支付宝支付-分账
      $http
        .get("plugin.converge-alloc-funds.frontend.controllers.converge-separate.alipay", {
          order_pay_id: this.order_pay_id
        })
        .then(response => {
          if (response.result == 1) {
            this.$router.push(
              this.fun.getUrl("alipayCloud", {
                status: "6",
                url: response.data.rc_Result
              })
            );
          } else {
            this.$dialog.alert({
              message: response.msg
            });
          }
          this.handlePayError();
        });
    },
    xfpayWechat(order_pay_id) {
      //商云客支付---微信
      if (!this.fun.isWeiXin()) {
        this.$dialog.alert({
          message: "请在手机微信上点击支付"
        });
        this.handlePayError();
        return;
      }
      $http.get("order.merge-pay.xfpay-wechat", { order_pay_id: order_pay_id }, "").then(response => {
        if (response.result == 1) {
          // window.location.href = response.data.pay_msg.qr_code;
          this.newWXPay(response.data.pay_msg.js_prepay_info);
        } else {
          this.$dialog.alert({
            message: response.msg
          });
        }
        this.handlePayError();
      });
    },
    async lakalaWechat(order_pay_id) {
      if (!this.fun.isWeiXin()) {
        this.$dialog.alert({
          message: "请在手机微信上点击支付"
        });
        this.handlePayError();
        return;
      }
      $http.get("order.merge-pay.lakala-wechat", { order_pay_id: order_pay_id }, "").then(response => {
        if (response.result == 1) {
          window.location.href = response.data.pay_msg;
        } else {
          this.$dialog.alert({
            message: response.msg
          });
        }
        this.handlePayError();
      });
    },
    // 乐刷支付宝
    Otherleshua_Alipay() {
      let json = {};
      if(this.order_pay_id){
        json = {order_pay_id: this.order_pay_id};
      }
      $http.get("order.merge-pay.leshua-alipay", json).then(response => {
        if (response.result == 1) {
          window.location.href = response.data.pay_msg.link;
        } else {
          this.$dialog.alert({
            message: response.msg
          });
          this.handlePayError();
        }
      });
    },
    // 乐刷微信
    async Otherleshua_wechat(order_pay_id) {
      if (!this.fun.isWeiXin()) {
        this.$dialog.alert({
          message: "请在手机微信上点击支付"
        });
        this.handlePayError();
        return;
      }
      // 不传就是打赏支付
      $http.get("order.merge-pay.leshua-wechat", {order_pay_id: order_pay_id}, "").then(response => {
        if (response.result == 1) {
          window.location.href = response.data.pay_msg;
        } else {
          this.$dialog.alert({
            message: response.msg
          });
        }
        this.handlePayError();
      });
    },
    sandpayWechat(order_pay_id) {
      if (!this.fun.isWeiXin()) {
        this.$dialog.alert({
          message: "请在手机微信上点击支付"
        });
        this.handlePayError();
        return;
      }
      $http.get("order.merge-pay.sandpay-wechat", { order_pay_id: order_pay_id }, "").then(response => {
        if (response.result == 1) {
          // window.location.href = response.data.pay_msg.qr_code;
          console.log(response.data);
          this.newWXPay(response.data.pay_msg);
        } else {
          this.$dialog.alert({
            message: response.msg
          });
        }
        this.handlePayError();
      });
    }
    // 商城订单支付类型 end
  }
};
