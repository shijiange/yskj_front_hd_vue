import cTitle from "components/title";
import { Toast } from 'vant';
import yz_pay from "components/ui_components/yz_pay";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
var clicktag = 0;
export default {
  mixins: [yzPay],
  data() {
    return {
      credit2: 0,
      buttons: [],
      typename: "",
      recharge: "", //开启账号充值
      ordersn: "",
      money: "",
      activatDes: {},

      // 选择的充值方式
      pay_type: "",
      // 余额字样
      balanceLang: this.fun.getBalanceLang(),

      isOpenCmc: false, //首次需要验证是否开启cmc
      // 门店独立余额
      title: '',
      proportion_status: 0,
      show_activity: 0,
      radio: '',
      payMuch: "",
      store: '',
      // 充值创建订单
      payPrice: 0,
      confirmOrderStatus: false,
      isdisabled: false,
      is_open_recharge_order: false,
      show1: false,
      checkCouponList: [],
      checkDeductionList: [],
      isClick: 0,
      payType: [],
      isShowCoupon: true, //是否显示优惠券
      coupons: null,
      // 订单数据
      datas: {},
      service: null,
      loadDiscount: false,
      goods_price: 0.0,
      dispatch_price: 0.0,
      cashier_type: "",
      discount_price: 0,
      price: 0.0,
      order_data: [],
      showQR: false,
      qrcode: "",
      showZFBQR: false,
      isZFBQR: false, //是否已生成二维码
      balanceNow: '',
      //是否显示支付协议
      agreementPayData: "",
      agreementPay: false,
      agreementPayShow: false,
    };
  },

  computed: {
    discountType(num) {
      return num => {
        num = num ? num : 0;
        if (this.proportion_status == 0) {
          return num + '元';
        } else {
          return num + '元';
        }
      };
    }
  },
  methods: {
    selectSpecs(e) {
      this.radio = e;
    },
    getStoreBalance() {
      $http.get("plugin.store-cashier.frontend.store.balance.balance.index", { store_id: this.$route.params.store_id }).then(
        (response) => {
          if (response.result == 1) {
            this.store = response.data.store;
            this.credit2 = response.data.member_balance;
            this.show_activity = response.data.show_activity;
            this.activatDes = response.data.activity;
            this.buttons = response.data.pay_buttons;
            this.title = response.data.title;
            this.proportion_status = response.data.proportion_status;
            this.is_open_recharge_order = response.data.is_open_recharge_order == 0 ? false : true;
            for (let key in response.data.pay_buttons) {
              this.radio = response.data.pay_buttons[key].value;
              return;
            }
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    confirmOrder() {
      console.log(this.payMuch);
      var val = this.payMuch;
      if (val && val > 0) {
        this.payPrice = val;
        this.preGoodsBuy();
        this.confirmOrderStatus = true;
        this.isdisabled = true;
      } else {
        this.$dialog.alert({ message: "请输入正确的付款金额！" });

        this.confirmOrderStatus = false;
        this.isdisabled = false;
      }
    },
    // 确认充值
    confirm_store() {
      this.pay_type = this.radio;
      // if (!this.money || this.money <= 0) {
      //   this.$dialog.alert({ message: "输入值不能小于0" });
      //   return;
      // }
      if (this.pay_type == 202006 && !this.isOpenCmc) {
        this.isHaveCmcInfo();
        return;
      }
      // this.money = parseFloat(this.money);
      let url = "plugin.store-cashier.frontend.store.balance.balance.recharge";
      if (window.isMiniprogram) {
        url += "&client_type=2&app_type=wechat";
      }
      $http.get(url, { pay_type_id: this.pay_type, recharge_money: this.money, store_id: this.$route.params.store_id }, "正在充值").then(
        response => {
          if (response.result == 1) {
            if (this.fun.isTextEmpty(response.data.ordersn)) {
              this.$dialog.alert({ message: "参数错误" });
              return false;
            }
            this.ordersn = response.data.ordersn;
            this.rechargePay(this.pay_type, response, this.ordersn, "storeBalance");
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    isHaveCmcInfo() {
      $http.get("plugin.cmc-pay.frontend.account.get-cmc-account", {}, "").then(
        (response) => {
          if (response.result === 1) {
            this.isOpenCmc = true;
            this.confirm(202006);
          } else {
            this.$dialog.alert({ message: "没有CMC账号！" });
            this.$router.push(this.fun.getUrl("cmcPayInfo", {}));
          }
        });
    },
    btnclass(type) {
      if (type == 1 || type == 6 || type == 9 || type == 12 || type == 20 || type == 22 || type == 28 || type == 48) {
        return "icon-balance_i";
      } else if (type == 2 || type == 10 || type == 29) {
        return "icon-balance_j";
      } else if (type == 18) {
        return "icon-balance_d";
      } else if (type == 19) {
        return "icon-balance_g";
      } else {
        return "icon-balance_h";
      }
    },
    //处理按键
    _handleKeyPress(num) {
      //不同按键处理逻辑
      // -1 代表无效按键，直接返回
      if (num == -1) return false;
      switch (String(num)) {
        //小数点
        case ".":
          this._handleDecimalPoint();
          break;
        //删除键
        case "D":
          this._handleDeleteKey();
          break;
        //确认键
        case "S":
          this._handleConfirmKey();
          break;
        default:
          this._handleNumberKey(num);
          break;
      }
    },
    //处理数字
    _handleNumberKey(num) {
      let S = this.payMuch;
      //如果有小数点且小数点位数不小于2
      if (S.indexOf(".") > -1 && S.substring(S.indexOf(".") + 1).length < 2) this.payMuch = S + num;
      //没有小数点
      if (!(S.indexOf(".") > -1)) {
        //如果第一位是0，只能输入小数点
        if (num == 0 && S.length == 0) this.payMuch = "0.";
        else {
          if (S.length && Number(S.charAt(0)) === 0) {
            this.payMuch = num;
            return;
          }
          this.payMuch = S + num;
        }
      }
    },
    _handleConfirmKey() {
      if (this.store) {
        let S = this.payMuch;
        //未输入
        if (!S.length || Number(S) === 0) {
          Toast("您目前未输入!");
          return false;
        }
        //将 8. 这种转换成 8.00
        if (S.indexOf(".") > -1 && S.indexOf(".") === S.length - 1) S = Number(S.substring(0, S.length - 1)).toFixed(2);
        //保留两位
        S = Number(S).toFixed(2);
        this.money = S;
        console.log(this.is_open_recharge_order);
        if (this.is_open_recharge_order) {
          this.confirmOrder();
        } else {
          this.confirm_store();
        }
      }
    },
    //处理小数点函数
    _handleDecimalPoint() {
      //如果包含小数点，直接返回
      if (this.payMuch.indexOf(".") > -1) return false;
      //如果小数点是第一位，补0
      if (!this.payMuch.length) this.payMuch = "0.";
      //如果不是，添加一个小数点
      else this.payMuch = this.payMuch + ".";
    },
    //处理删除键
    _handleDeleteKey() {
      let S = this.payMuch;
      //如果没有输入，直接返回
      if (S.length <= 1) return (this.payMuch = "0");
      //否则删除最后一个
      this.payMuch = S.substring(0, S.length - 1);
    },
    getAgreement() {
      let url = "plugin.store-cashier.frontend.cashier.center.getPaySet";
      let json = {
        store_id: this.$route.params.store_id
      };
      $http
        .get(url, json, "生成中")
        .then((response) => {
          if (response.result === 1) {
            this.agreementPayData = response.data.get_pay_protocol;
            console.log(this.agreementPayData, 'ssssssss');
          } else {
            Toast(response.msg);
          }
        },
          function (response) {
            console.log(response);
          }
        )
        .catch(err => {
          console.log(err);
        });
    },
    //直接购买
    preGoodsBuy() {
      this.getAgreement();
      let that = this;
      let url = "",
        json = {};
      url = "plugin.store-cashier.frontend.store.balance.goodsBuy.index";
      json = {
        price: this.payPrice,
        store_id: this.$route.params.store_id,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
      };

      if (that.isClick === 0) {
        that.isClick = 1;
        $http
          .get(url, json, "生成中")
          .then(
            function (response) {
              if (response.result === 1) {
                if (response.data.balance) {
                  that.balanceNow = response.data.balance;
                }
                //that.order = response.data.order;
                //that.dispatch = response.data.dispatch;
                that.setViewData(response.data); //设置界面
                /*that.setAddressViewData(response.data.dispatch.default_member_address);//设置地址界面*/
                that.initCoupon(response.data.discount); //设置优惠券信息

                that.initPayType(response.data.total_price);
              } else {
                Toast(response.msg);
                // that.$router.go(-1);
              }
              setTimeout(() => {
                that.isClick = 0;
              }, 1000);
            },
            function (response) {
              console.log(response);
            }
          )
          .catch(err => {
            console.log(err);
          });
      }
    },
    //组装优惠券json信息
    assembleCoupons() {
      let coupons = [];

      for (let i = 0; i < this.checkCouponList.length; i++) {
        coupons.push(this.checkCouponList[i].id);
      }

      return coupons;
    },
    //组装优惠抵扣信息
    assembleDeduction() {
      let deductions = [];
      for (let i = 0; i < this.checkDeductionList.length; i++) {
        //this.checkDeductionList[i].deduction_ids = this.checkDeductionList[i].deduction_ids.join(',');
        deductions.push(this.checkDeductionList[i]);
      }

      return deductions;
    },
    //设置界面
    setViewData(data) {
      this.datas = data;
      this.service = data.fee_items;
      this.order_data = data.orders;
      console.log('sssss', this.order_data[0]);
      this.loadDiscount = true;
      this.goods_price = data.total_goods_price; //设置商品总价格
      this.dispatch_price = data.total_dispatch_price; //设置总运费价格
      if (this.cashier_type != "hotel") {
        this.discount_price = data.total_discount_price; //设置总优惠价格
      }
      // this.deduction_price = data.total_deduction_price; //设置总抵扣价格
      this.deduction_price = 0.0; //初始化总抵扣价格

      this.price = data.total_price; //设置总价格（合计）
      // this.goods = data.order.order_goods;
      // this.goods_price = data.order.goods_price;
      // this.dispatch_price = data.order.dispatch_price;
      // this.price = data.order.price;
    },
    //初始化优惠券
    initCoupon(coupon) {
      this.isShowCoupon = coupon.whether_show_coupon == "1" ? true : false;
      if (coupon.member_coupons != undefined && coupon.member_coupons != "" && coupon.member_coupons != null) {
        this.coupon_size = coupon.member_coupons.length;
      }
      this.coupons = coupon.member_coupons;
    },
    initPayType(price) {
      let url = "",
        json = {};
      url = "plugin.store-cashier.frontend.store.balance.payment.getList";
      json = {
        store_id: this.$route.params.store_id,
        price: price
      };

      if (this.fun.isCPS() && this.fun.isCPSAPPI()) {
        json.wechat_app_pay_type = "cps";
      }

      $http.get(url, json, "生成中").then(
        (response) => {
          if (response.result === 1) {
            this.payType = response.data;
            let typeArr = [];
            for (let i = 0; i < this.payType.length; i++) {
              typeArr.push(this.payType[i]);
            }
            this.payType = typeArr;
            console.log(this.payType);
            this.typename = "支付";
            this.show1 = true;
          } else {
            Toast(response.msg);
          }
        });
    },
    //提交订单
    submit(val) {
      let json = {};
      if (val.value == 28 || val.value == 29) {
        json = this.assembleJson(val.value);
      } else {
        json = this.assembleJson();
      }
      let that = this;

      let url = "plugin.store-cashier.frontend.store.balance.create.index";

      if (clicktag == 0) {
        clicktag = 1;
        if (this.agreementPayData) {
          if (!this.agreementPay) {
            clicktag = 0;
            that.$dialog.alert({ message: "请先勾选支付协议" });
            return;
          }
        }

        if (this.isPayClick) {
          // 控制支付请求多次
          Toast("还在请求支付，请等待~");
          return;
        }

        this.isPayClick = true;
        $http.get(url, json, "提交中").then(
          (response) => {
            this.isPayClick = false;
            if (response.result === 1) {
              that.order_ids = response.data.order_ids;
              that.getMultipleOrderInfo(val);
              setTimeout(function () {
                clicktag = 0;
              }, 1000);
            } else {
              this.isPayClick = false;
              Toast(response.msg);
            }
          });
      }
    },
    //多订单合并支付获取信息接口方法
    getMultipleOrderInfo(val) {
      //order.pay.wechatPay
      $http
        .get(
          "order.merge-pay",
          {
            order_ids: this.order_ids,
            pid: this.uid
          },
          "loading"
        )
        .then(
          (response) => {
            if (response.result == 1) {
              this.order_sn = response.data.order_pay.pay_sn;
              this.balance = response.data.member.credit2;
              this.money = response.data.order_pay.amount;
              this.uid = response.data.order_pay.uid;
              this.order_pay_id = response.data.order_pay.id; //支付id
              this.buttons = response.data.buttons;
              this.confirm(val);
            } else {
              this.$dialog
                .confirm({ message: response.msg })
                .then(() => {
                  this.$router.push(this.fun.getUrl("home"));
                })
                .catch(() => { });
            }
          });
    },
    //组装json数据
    assembleJson(val) {
      let json = {};
      json = {
        price: this.payPrice,
        store_id: this.$route.params.store_id,
        member_coupon_ids: JSON.stringify(this.assembleCoupons()),
        orders: JSON.stringify(this.assembleDeduction()),
      };
      return json;
    },
    //抵扣选择响应
    discountHandle(item, value) {
      if (this.isClick === 0) {
        //处理选择
        this.screenDiscount(item, value);

        //重新计算
        this.preGoodsBuy(); //直接购买
      }
    },
    //筛选抵扣
    screenDiscount(item, value) {
      this.deductionListHandle(item, value);
    },
    deductionListHandle(item, value) {
      let isHasPreId = false;
      if (this.checkDeductionList.length > 0) {
        this.checkDeductionList.forEach((deduction, index) => {
          if (deduction && deduction.pre_id == item.pre_id) {
            isHasPreId = true;
            if (value && value.checked) {
              // 选中的时候检查是否有对应的code
              if (deduction.deduction_ids && deduction.deduction_ids.indexOf(value.code) == -1) {
                deduction.deduction_ids.push(value.code);
              }
            } else if (value && !value.checked) {
              // 取消选中的时候检查去掉对应的code
              if (deduction.deduction_ids && deduction.deduction_ids.indexOf(value.code) > -1) {
                deduction.deduction_ids.splice(deduction.deduction_ids.indexOf(value.code), 1);
              }
            }

            // 留言和安装选项重新赋值
            // deduction.service_fee = this.service_fee[item.pre_id];
            // deduction.note = this.note[item.pre_id];
          }
        });
      }
      if (!isHasPreId) {
        this.checkDeductionList.push({
          deduction_ids: value && value.code ? [value.code] : [],
          pre_id: item.pre_id,
        });
      }
      this.checkDeductionList.reverse(); // 更新数组
      // console.log('checkDeductionList:', this.checkDeductionList)
    },
    showPay() {
      this.agreementPayShow = true;
    },
    closePop() {
      this.show1 = false;
      this.isPayClick = false;
    },
  },
  mounted() {
    this.isClick = 0;
    this.popupSpecs = false;
  },
  activated() {
    window.scrollTo(0, 0);
    console.log(this.$route.params, '111');
    this.pay_type = "";
    this.money = "";
    if (this.$route.params.num) {
      this.money = this.$route.params.num;
    }
    this.getStoreBalance();
  },
  components: { cTitle, yz_pay }
};
