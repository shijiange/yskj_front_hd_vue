import loading from "components/loading";
import { Toast } from "vant";
// import QRCode from "qrcode";
import yz_pay from "components/ui_components/yz_pay";
import { yzPay } from "../../utils/yz_pay"; //引入支付方法

var clicktag = 0;

export default {
  mixins: [yzPay],
  data() {
    return {
      isPayClick: false,
      isClick: 0,
      showZFBQR: false,
      isZFBQR: false, //是否已生成二维码
      showPage: false,
      qrcode: "",
      showQR: false,
      show1: false,
      onclast: false,
      goodsInfo: {},
      order: {},
      dispatch: {},
      realname: "", //收件人
      mobile: "",
      address: "",
      goods: [],
      goods_price: 0.0,
      dispatch_price: 0.0,
      price: 0.0,
      discount_price: 0,
      addressData: [],
      payPrice: 0,
      loadDiscount: false,

      // 订单数据
      datas: {},
      //优惠券
      isShowCoupon: true, //是否显示优惠券
      popupCouponSpecs: false,
      coupon_size: 0,
      checkCouponList: [],
      use_coupon_size: 0,

      //积分抵扣 其他抵扣
      checkDeductionList: [],
      deductionItem: {},

      //支付
      order_ids: "",
      balance: 0,
      payParams: "",
      info_form: {},
      order_sn: "",
      money: "",
      buttons: [],
      pay_sn: "订单编号",
      order_pay_id: "",
      uid: "",
      isdisabled: false,

      payType: [],
      confirmOrderStatus: false,

      store: {
        name: "",
        thumb: ""
      },
      income: {
        money_total: 0.0,
        sure_withdraw_money: 0.0
      },
      store_set: {
        is_cash_pay: "",
        is_open_cashier: "",
        is_write_information: ""
      },
      form: {
        mobile: "",
        realname: ""
      },
      typename: "",

      payMuch: "0",
      //是否显示支付协议
      agreementPayData: "",
      agreementPay: false,
      agreementPayShow: false,

      cashier_type: "",

      showPacket: false,
      redirectData: {
        data: {}
      },
      coupons: null,
      service: null,
      balanceNow:'',

      title_text:"收银台"
    };
  },

  activated() {
    this.isPayClick = false;
    this.isClick = 0;
    this.showQR = false;
    this.showPage = false;
    //优惠券
    this.popupCouponSpecs = false;
    this.isShowCoupon = true;
    this.coupon_size = 0;
    this.use_coupon_size = 0;
    this.checkCouponList = [];
    this.coupons = [];
    this.show1 = false;
    this.agreementPay = false;
    this.agreementPayShow = false;
    this.agreementPayData = "";
    this.cashier_type = "";

    this.redirectData = {
      data: {}
    };
    this.showPacket = false;

    if (this.fun.isTextEmpty(this.$route.params.hotel_id)) {
      this.cashier_type = "store";
    } else {
      this.cashier_type = "hotel";
    }

    if(this.$route.query.cashier_type){
      this.cashier_type = this.$route.query.cashier_type;
    }
    //扫码买单无需再输入金额
    if(this.cashier_type == "scanning_payment"){
      this.payMuch = this.$route.query.price;
      this.show1 = true;
      this.showPage = true;
      this.title_text="扫码买单";
      this.fun.setWXTitle("扫码买单");
      this.preGoodsBuy();
    }else {
      this.getCenter();
    }
    // this.getAgreementPay();
    //抵扣
    this.checkDeductionList = [];

    // this.initStore();
   
  },
  mounted() {
    this.isClick = 0;
    this.popupSpecs = false;
  },
  computed: {},
  methods: {
    closePop() {
      this.show1 = false;
      this.isPayClick = false;
    },
    closePacket() {
      this.showPacket = false;
      this.toRedirect(true);
    },
    checkoutConsumePacket() {
      if (JSON.parse(window.localStorage.getItem("globalParameter")).consume_red_packet_status == 1) {
        // 判断消费红包开启再请求
        $http
          .post(
            "plugin.consume-red-packet.Frontend.Modules.Packet.Controllers.has.index",
            {
              order_id: this.order_ids.split(",")
            },
            "loading"
          )
          .then(
            response => {
              if (response.result == 1) {
                this.show1 = false;
                this.showPacket = true;
                this.getVoiceSet(false);
              } else {
                this.getVoiceSet(true);
              }
            },
            (response)=> {
              this.getVoiceSet(true);
            }
          );
      } else {
        this.getVoiceSet(true);
      }
    },
    toRedirect(_isDialog) {
      if (!_isDialog) {
        //消费红包不需要再次显示提示框
        this.$dialog.alert({ message: this.redirectData.msg || "支付成功" });
      }
      if(this.order_sn) {
        this.payCallBack();
      }
      // if (this.redirectData.cashPay) {
      //   this.$router.push(this.fun.getUrl("member"));
      // } else if (this.fun.isTextEmpty(this.redirectData.data.redirect)) {
      //   this.$router.push(this.fun.getUrl("home"));
      // } else {
      //   if (this.redirectData.data.redirect && this.redirectData.data.redirect.indexOf("showBalances") > -1) {
      //     this.goShowBalances();
      //   } else {
      //     window.location.href = this.redirectData.data.redirect;
      //   }
      // }
    },
    goShowBalances() {
      this.$router.push(
        this.fun.getUrl("showBalances", {
          pay_sn: this.order_sn,
          pay_type: "cashier"
        })
      );
    },
    getVoiceSet(_isredirect) {
      //判断是否开启语音播报
      $http
        .get("plugin.store-cashier.frontend.cashier.voice.index", { order_id: this.order_ids.split(",") }, "load")
        .then(response => {
          if (response.result === 1) {
            this.createVoiceDom(response.data.url, _isredirect);
          } else {
            console.log(response.msg);
            this.toRedirect();
          }
        });
    },
    createVoiceDom(_url, _isredirect) {
      //创建音频dom
      // let that = this;
      let link = document.createElement("audio");
      link.setAttribute("src", _url);
      // link.setAttribute("src", `data:audio/wav;base64,${_url}`);
      // link.setAttribute("src", "https://dev4.yunzmall.com/attachment/audios/0/2021/05/556f15b68d5d2c1886e2e470e6f1cda9.mp3");
      document.body.appendChild(link);
      this.$dialog.alert({
        message: this.redirectData.msg || "支付成功",
        callback: () => {
          link.play();
          if (!_isredirect) {
            //有消费红包，不能马上跳转
            return;
          }
          if(this.order_sn) {
            this.payCallBack();
          }
          // if (that.redirectData.cashPay) {
          //   that.$router.push(that.fun.getUrl("member"));
          // } else if (that.fun.isTextEmpty(that.redirectData.data.redirect)) {
          //   that.$router.push(that.fun.getUrl("home"));
          // } else {
          //   if (that.redirectData.data.redirect && that.redirectData.data.redirect.indexOf("showBalances") > -1) {
          //     that.goShowBalances();
          //   } else {
          //     window.location.href = that.redirectData.data.redirect;
          //   }
          // }
        }
      });
    },
    getCenter() {
      let json = {};
      let url = "";
      if (this.cashier_type === "hotel") {
        json = {
          hotel_id: this.$route.params.hotel_id
        };
        url = "plugin.hotel.frontend.cashier.center.index";
      } else {
        json = {
          store_id: this.$route.params.store_id
        };
        url = "plugin.store-cashier.frontend.cashier.center.getPaySet";
      }
      $http
        .get(url, json, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.showPage = true;
              if (this.cashier_type === "hotel") {
                this.initStore(response.data.get_hotel_info);
              } else {
                this.initStore(response.data.get_store_info);
              }

              this.agreementPayData = response.data.get_pay_protocol;
            } else {
              if (response.data && response.data.login_status !== 0) {
                Toast(response.msg);
              }
            }
          },
          function(response) {
            console.log(response);
          }
        )
        .catch(err => {
          console.log(err);
        });
    },
    showPay() {
      this.agreementPayShow = true;
    },
    //获取是否显示支付协议
    getAgreementPay() {
      $http.get("shop.index.getPayProtocol", {}, " ").then(
        response => {
          if (response.result === 1) {
            this.agreementPayData = response.data;
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
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
      this.confirmOrder();
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
    initStore(data) {
      this.confirmOrderStatus = false;
      this.payMuch = "0";
      this.realname = "";
      this.mobile = "";
      this.popupCouponSpecs = false;
      this.order_ids = "";
      if (this.cashier_type === "hotel") {
        // 酒店没有用到，这是用来统计门店订单的 任务编号: 54992
        // this.store = data.hotel;
        // this.store_set = data.hotel_set;
      } else {
        this.store = data.store;
        this.store_set = data.store_set;
        this.income = data.income;
      }
    },
    initPayType(price) {
      let url = "",
        json = {};
      if (this.cashier_type === "hotel") {
        url = "plugin.hotel.frontend.payment.list";
        json = {
          hotel_id: this.$route.params.hotel_id,
          price: price
        };
      } else if(this.cashier_type == "scanning_payment"){
        url = "plugin.sweep-buy.frontend.controllers.payment.list";
        json={
          price:price
        };
      } else {
        url = "plugin.store-cashier.frontend.payment.list";
        json = {
          store_id: this.$route.params.store_id,
          price: price
        };
      }

      if (this.fun.isCPS() && this.fun.isCPSAPPI()) {
        json.wechat_app_pay_type = "cps";
      }

      $http.get(url, json, "生成中").then(
        (response)=> {
          if (response.result === 1) {
            this.payType = response.data;
            this.buttons = response.data;
            let typeArr = [];
            for (let i = 0; i < this.payType.length; i++) {
              typeArr.push(this.payType[i]);
            }
            this.payType = typeArr;
            this.typename = "支付";
            this.show1 = true;
          } else {
            Toast(response.msg);
          }
        });
    },

    //直接购买
    preGoodsBuy() {
      let that = this;
      let url = "",
        json = {};
      if (this.cashier_type == "hotel") {
        url = "plugin.hotel.frontend.Order.goods-buy";
        json = {
          price: this.payPrice,
          hotel_id: this.$route.params.hotel_id,
          member_coupon_ids: this.assembleCoupons(),
          orders: JSON.stringify(this.assembleDeduction()),
          mobile: this.form.mobile,
          realname: this.form.realname
        };
      } else if(this.cashier_type == "scanning_payment"){
        url = "plugin.sweep-buy.frontend.controllers.goods-buy.index";
        json = {
          price: this.$route.query.price,
          goods_id: this.$route.query.goods_id,
          member_coupon_ids: this.assembleCoupons(),
          orders: JSON.stringify(this.assembleDeduction()),
        };
      } else {
        url = "plugin.store-cashier.frontend.Order.goods-buy";
        json = {
          price: this.payPrice,
          store_id: this.$route.params.store_id,
          member_coupon_ids: this.assembleCoupons(),
          orders: JSON.stringify(this.assembleDeduction()),
          mobile: this.form.mobile,
          realname: this.form.realname
        };
      }

      if (that.isClick === 0) {
        that.isClick = 1;
        $http
          .get(url, json, "生成中")
          .then(
            function(response) {
              if (response.result === 1) {
                if(response.data.balance){
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
            function(response) {
              console.log(response);
            }
          )
          .catch(err => {
            console.log(err);
          });
      }
    },

    //设置界面
    setViewData(data) {
      this.datas = data;
      this.service = data.fee_items;
      this.order_data = data.orders;
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

    //提交订单
    submit(val) {
      let json = {};
      if (val.value == 28 || val.value == 29) {
        json = this.assembleJson(val.value);
      } else {
        json = this.assembleJson();
      }
      let that = this;

      let url = "";
      if (this.cashier_type == "hotel") {
        url = "plugin.hotel.frontend.Order.create";
      } else if(this.cashier_type == "scanning_payment"){
        url = "plugin.sweep-buy.frontend.controllers.create.index";
        json.price = this.$route.query.price;
        json.goods_id = this.$route.query.goods_id;
      } else {
        url = "plugin.store-cashier.frontend.Order.create";
      }

      if (clicktag == 0) {
        clicktag = 1;
        if (this.agreementPayData) {
          if (!this.agreementPay) {
            clicktag = 0;
            that.$dialog.alert({ message: "请先勾选支付协议" });
            return;
          }
        }

        if(this.isPayClick) {
          // 控制支付请求多次
          Toast("还在请求支付，请等待~");
          return;
        }

        this.isPayClick = true;
        $http.get(url, json, "提交中").then(
          (response)=> {
            this.isPayClick = false;
            //$http.get('plugin.store-cashier.frontend.cashier.center.index', json, "提交中...").then(function (response) {
            if (response.result === 1) {
              that.order_ids = response.data.order_ids;

              that.getMultipleOrderInfo(val);
              setTimeout(function() {
                clicktag = 0;
              }, 1000);
              //that.$router.push({ name: "orderlist", params: { status: "1" }});
              //status:"2" 合并支付
              //that.$router.push({ name: "orderpay", params: { status: "2", order_ids: response.data.order_ids }});
            } else {
              this.isPayClick = false;
              Toast(response.msg);
            }
          });
      }
    },

    //组装json数据
    assembleJson(val) {
      let json = {};

      if (this.cashier_type == "hotel") {
        json = {
          price: this.payPrice,
          hotel_id: this.$route.params.hotel_id,
          member_coupon_ids: JSON.stringify(this.assembleCoupons()),
          orders: "",
          mobile: this.form.mobile,
          realname: this.form.realname
        };
      } else if (val) {
        json = {
          price: this.payPrice,
          store_id: this.$route.params.store_id,
          member_coupon_ids: JSON.stringify(this.assembleCoupons()),
          orders: JSON.stringify(this.assembleDeduction()),
          mobile: this.form.mobile,
          realname: this.form.realname
        };
      } else {
        json = {
          price: this.payPrice,
          store_id: this.$route.params.store_id,
          member_coupon_ids: JSON.stringify(this.assembleCoupons()),
          orders: JSON.stringify(this.assembleDeduction()),
          mobile: this.form.mobile,
          realname: this.form.realname
        };
      }
      return json;
    },
    //组装商品信息
    assembleGoods() {
      let newGoods = [];

      for (let j = 0; j < this.goodsInfo.order_data.length; j++) {
        for (let i = 0; i < this.goodsInfo.order_data[j].order.order_goods.length; i++) {
          let model = new Object();
          model.goods_id = this.goodsInfo.order_data[j].order.order_goods[i].goods_id;
          model.total = this.goodsInfo.order_data[j].order.order_goods[i].total;
          model.option_id = this.goodsInfo.order_data[j].order.order_goods[i].goods_option_id;
          newGoods.push(model);
        }
      }
      return newGoods;
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

    //初始化优惠券
    initCoupon(coupon) {
      this.isShowCoupon = coupon.whether_show_coupon == "1" ? true : false;
      if (coupon.member_coupons != undefined && coupon.member_coupons != "" && coupon.member_coupons != null) {
        this.coupon_size = coupon.member_coupons.length;
      }
      this.coupons = coupon.member_coupons;
    },

    //优惠券
    showCoupon() {
      if (this.coupon_size == 0) {
        Toast("暂无优惠券使用");
        return;
      }
      this.popupCouponSpecs = true;
    },

    //选择优惠券
    selectCoupon(value, valObj) {
      //处理选择
      // this.screenCoupon(value);
      //因为换了组件改调用方法
      this.screenCoupon(value, valObj);
      //设置view
      this.setCouponView();

      //重新计算
      this.preGoodsBuy(); //直接购买
    },

    //筛选数据优惠券状态
    screenCoupon(value, valObj) {
      var tarValue = valObj;
      //因为换了组件改调判断
      if (value) {
        //选中添加
        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].id == tarValue.id) {
              this.checkCouponList.splice(i, 1);
            }
          }
          this.checkCouponList.push(tarValue);
        } else {
          this.checkCouponList.push(tarValue);
        }
      } else {
        //取消选中
        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].id == tarValue.id) {
              this.checkCouponList.splice(i, 1);
            }
          }
        }
      }
    },
    //设置view
    setCouponView() {
      this.use_coupon_size = this.checkCouponList.length;
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
    // 处理checkDeductionList响应
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
          (response)=> {
            if (response.result == 1) {
              this.order_sn = response.data.order_pay.pay_sn;
              this.balance = response.data.member.credit2;
              this.money = response.data.order_pay.amount;
              this.uid = response.data.order_pay.uid;
              this.order_pay_id = response.data.order_pay.id; //支付id
              this.confirm(val);
            } else {
              this.$dialog
                .confirm({ message: response.msg })
                .then(() => {
                  this.$router.push(this.fun.getUrl("home"));
                })
                .catch(() => {});
            }
          });
    },

    confirmOrder() {
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
  },
  components: { yz_pay, loading }
};
