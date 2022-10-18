import cTitle from "components/title";
import { Toast } from "vant";
import cDyPopup from "../../goods/diyFormPopup";
import diyfrom from "components/diyform";
import customMessage from "./components/customMessage";
import offlineOrderDetail from "./components/offlineOrder";
import overseastag from 'components/overseas/tag';
import realnameAuth from 'components/overseas/realname-auth';
import gift from "components/goods/gift";
/**
 * _PAGE_API 常量，详情页面接口集合，对象类型
 * 请求不同页面时，根据 orderType 作为 _PAGE_API对象 的 key, 去获取 对应的value 作为 插件页面的 接口
 * @key {string} - 插件页面的 orderType值， 建议为$route.params.orderType的值
 * @value {string}  - orderType对应的插件接口
 */
const _PAGE_API = {
  shop: "order.detail", //商城默认接口
  cashier: "plugin.store-cashier.frontend.Order.detail",
  store: "plugin.store-cashier.frontend.store.order-detail",
  supplier: "plugin.supplier.frontend.order.detail",
  hotel: "plugin.hotel.frontend.hotel.detail",
  onlineCar: "plugin.net-car.frontend.order-detail.index",
  hotel_center: "plugin.hotel.frontend.hotel.center.order-detail",
  hotelcashier: "plugin.hotel.frontend.Order.detail",
  lease_toy: "plugin.lease-toy.api.order.order-detail.index",
  serviceReplenish: "plugin.service-station.frontend.order-detail.index",
  groups: "plugin.fight-groups.frontend.controllers.detail.index", //拼团
  verifier: "plugin.package-deliver.frontend.clerk-order-detail.index", //自提点核销员
  package_delivery: "plugin.package-delivery.frontend.detail.index",
  o2oVerifier: "plugin.package-deliver.frontend.clerk-order-detail.index", //门店自提点提货核销员，dispatch_type_id为12
  auction: "plugin.auction.api.order-detail", //拍卖
  auctioneer: "plugin.auction.api.order-detail",
  subsidiary: "plugin.subsidiary.frontend.order.detail",
  commission_activity: "plugin.commission-activity.api.activity-inquire.order-detail",
  pickup_card: "plugin.picking-card.frontend.detail",
  "picking-card-one": "plugin.picking-card-one.frontend.detail",
  groupsBuy: "plugin.together-purchase.api.index.getTogetherData",
  grabGroup: "plugin.snatch-regiment.api.index.getSnatchData",
  communityBuy: "plugin.package-deliver.frontend.order.detail.index",
  "luck-draw": "plugin.luck-draw.frontend.index.myPrizeDetail",
  newRetail: "plugin.new-retail.frontend.orderData.detail",
  zhpGroup: "plugin.zhp-group-lottery.frontend.detail.index",
  warehouseTakeDelivery: "plugin.warehouse.frontend.controllers.takeDelivery.order-detail",
  warehousePurchasing: "plugin.warehouse.frontend.controllers.purchasing.order-detail",
  storeMang: "plugin.shop-assistant.frontend.order.order-detail",
  ysSystem: "plugin.ys-system.frontend.history-order.ys-detail",
  reserve_simple: "plugin.reserve-simple.frontend.reserve-order.get-detail"
};
export default {
  data() {
    return {
      buttonParamsData: {}, //底部按钮操作所需公用数据
      regional: "请选择快递公司",
      dateshow_1: false,
      columns: [],
      order_id: "",
      order_data: "",
      bottomStatus: "",
      selected: "1",
      allLoaded: false,
      isVirtual: false,
      receiver: "",
      mobile: "",
      address: "",
      pay_type_id: "",
      orderType: "shop",
      order_pay_id: "",
      dispatch_type_id: "",
      qrcode: "",
      showQrcode: false,
      // 确认发货
      dialogVisible: false,
      expressName: "",
      numberName: "",
      addresseeInfo: "",
      options: [],

      hotel_start: "",
      hotel_end: "",
      night_day: "",
      hotel_name: "",

      showBarter: false,
      showBarter_value: null,

      jurisdiction_set: "", //供应商订单是否显示会员信息

      showDFData: false, //商品自定义表单
      dfData: {},

      showPhotoGoodsArr: false, //显示相册商品图片预览
      PhotoGoodsArr: [],

      service_station: {}, // 服务站信息
      package_deliver: {}, //自提点（杨朗）

      // 是否使用权益标识
      // isRight:false
      showID: "",
      hasPacket: false,
      showPacket: false,
      timer: null,
      shrinkPacket: false,

      showKefu: false,
      cservice: "",
      service_QRcode: "",
      service_mobile: "",

      blindBoxInfo: {
        show: false,
        goods: []
        //盲盒相关数据
      },
      // 话费慢充
      phone_bill: {},
      reserveDate: "",

      // 自定义字段
      customForm: [],
      refundShow: false, //退款原因
      refundText: "",

      integral: window.localStorage.getItem("integral") || "积分",

      custom_receipt_confirmation_show: false, //自定义确认收货弹窗
      custom_receipt_confirmation_btn: {}, //自定义确认收货弹窗按钮
      custom_receipt_confirmation_item: {}, //自定义确认收货弹窗item
      custom_receipt_confirmation_html: "", //自定义确认收货弹窗内容
      electricity_bill_pro: null,
      toi: this.fun.getKeyByI(),

      //S 申请存货弹窗
      inventoryApplyPopup: false, //存货申请弹窗
      inventoryApplyList: [], //仓库列表
      inventoryApplyRadio: null,
      //E 申请存货弹窗
      aggregation_cps_recharge_bill: false,

      oil_recharge: {}, //油卡充值
      vip_show:JSON.parse(window.localStorage.getItem("globalParameter")).vip_show?JSON.parse(window.localStorage.getItem("globalParameter")).vip_show:false,
      isAuthStatus: false, // 是否已实名认证
      isAuthInit: false // 是否已实名初始化完成
    };
  },
  beforeRouteEnter(to, from, next) {
    zhuge.track('进入商品订单详情页');
    next();
  },
  methods: {
    copySuccess(){
      this.$toast.success("复制成功")
    },
    copyError(){
      this.$toast.fail("复制失败")
    },
    clickPhone(phone){
      this.$dialog.confirm({
        title: '提示',
        message: `确定拨打电话：${phone}？`,
        confirmButtonColor: '#09BB07'
      })
        .then(() => {
          // on confirm
          this.$refs.telPhone.click();
          this.$dialog.close();
        })
        .catch(() => {
          // on cancel
        })
    },
    showMore(order_sn) {
      if (this.showID == order_sn) {
        this.showID = "";
      } else {
        this.showID = order_sn;
      }
    },
    // 初始化
    init() {
      console.log(this.vip_show)
      this.order_id = "";
      this.order_data = "";
      this.bottomStatus = "";
      this.selected = "1";
      this.allLoaded = false;
      this.isVirtual = false;
      this.receiver = "";
      this.mobile = "";
      this.address = "";
      this.qrcode = "";
      this.showQrcode = false;
      this.dialogVisible = false;
      this.options = [];
      this.regional = "请选择快递公司";
      this.dateshow_1 = false;
      this.columns = [];
      this.hotel_start = "";
      this.hotel_end = "";
      this.night_day = "";
      this.hotel_name = "";
      this.service_station = "";
      this.showDFData = false;
      this.dfData = {};
      this.jurisdiction_set = "";

      this.showPacket = false;
      this.hasPacket = false;
      this.electricity_bill_pro = null;
    },

    operation(btn, order) {
      try {
        this.orderPayId = order.id || this.$route.params.order_id;
        this.buttonParamsData = { order: order, btn: btn };
      } catch (error) {
        console.log(error);
      }

      if(btn.value == 'overseas'){
        if (! this.isAuthed) {
          Toast('购买海外商品请先进行实名认证！');
          return;
        }
      }


      let _buttonType = btn.value; //当前的按钮类型
      let __SET_DATA = {};

      /**
       * _NAVIGATE_TO 常量，Map数据结构，
       * 用于处理按钮为$router.push跳转，在这个Map里添加
       * 格式 [key, { name: "", params: {}, query: {} }]
       * @key {string} - 当前的btn.value
       * @name {string}  - 跳转路由名routerName
       * @params {string}  - $route.params
       * @query {string}  - $route.query
       */
      let _NAVIGATE_TO = new Map([
        [1, { name: "orderpay", params: { status: 1, order_ids: order.id }, query: { api: btn.api } }],
        [3, { name: "OrderReturn", params: { id: order.id } }],
        [4, { name: "OrderReturnSure", params: { id: order.id } }], // 待确定
        [10, { name: "comment", params: { order: order }, query: {} }], // 评价订单
        [13, { name: "refund", params: { order: order, order_type: 1 }, query: { value: btn.value } }], // 退款
        [18, { name: "aftersales", params: { refund_id: order.refund_id } }], // 退款中
        [21, { name: "OrderRecord", params: { order_id: this.$route.params.order_id } }], // 汇款记录
        [27, { name: "DeliveryEvaluate", params: { order_id: order.id, api: btn.api, name: "distributor" } }],
        [28, { name: "TruckList", params: { order_id: order.id } }], // 卡密
        [40, { name: "OrderReturnCheck", params: { id: order.id } }], // 退还跳转
        [50, { name: "Invoice", params: { order_id: order.id } }], // 查看发票
        [51, { name: "cpsPwd", params: { order_id: order.id } }],
        [54, { name: "refund", params: { order: order, order_type: 1 }, query: { value: btn.value } }], // 退款
        [101, { name: "pickUpCardReimburse", params: { order_id: order.id, type: 1, plugin: this.orderType == "picking-card-one" ? "one" : "" } }],
        [140, { name: "cardVoucherInfo", params: { order_id: order.id } }], // 卡券信息
        ["snatch_regiment_pay", { name: "orderpay", params: { status: 1, order_ids: order.id }, query: { api: btn.api } }],
        ["together_purchase_pay", { name: "orderpay", params: { status: 1, order_ids: order.id }, query: { api: btn.api } }],
        ["snatch_regiment_refund", { name: "refund", params: { order: order, order_type: 3 }, query: { value: btn.value } }], // 退款
        ["verification_code", { name: "orderVerification", params: { order_id: order.id, api: btn.api } }], // 验证核销
        ["coupon", { name: "couponShare", params: { order_id: order.id } }], // 分享优惠券
        ["lease_toy_apply_adopt", { name: "OrderReturn", params: { id: order.id } }], // 填写归还
        ["lease_toy_return_info", { name: "orderruturninfo", params: { id: order.id } }], // 归还详情
        ["city_delivery_detail", { name: "orderLogisticsDetails", params: { id: order.id } }],
        ["overseas", { name: "orderpay", params: { status: 1, order_ids: order.id }, query: { api: btn.api } }], //海外订单，去支付
        //  ... 更多
      ]);

      // 先通过has()判断_NAVIGATE_TO 是否包含 btn.value
      if (_NAVIGATE_TO.has(btn.value)) {
        // 有，说明该 btn.value 是跳转页面的按钮
        _buttonType = "toUrl";
        __SET_DATA = _NAVIGATE_TO.get(btn.value);
      } else {
        // .....更多其他场景补充
      }

      // _GET_MAP_DATA 设置btn.value,对应的方法和参数
      const _GET_MAP_DATA = new Map([
        ["toUrl", ["goToUrl", __SET_DATA]], //通过$router.push跳转页面的处理
        [8, ["checklogistics"]],
        [9, ["publicMessage", { type: "back" }]], //取消订单，type="back" 成功后返回上一页
        [12, ["publicMessage", { type: "back" }]], //删除订单，type="back" 成功后返回上一页
        // 原先的value==22 废弃改到 20 那里 plugin.store-cashier.frontend.store.center.order-operation.pay
        [20, ["publicMessage", { json: { order_pay_id: this.order_pay_id }, api: "plugin.store-cashier.frontend.store.order-operation.pay", text: "确认支付该订单" }]], // 现金付款 确认支付
        [23, ["sendOutOrder"]], // 确认发货
        [53, ["getBlindBoxGoods"]], //获取盲盒商品
        [60, ["sendOutOrder"]], // 确认发货
        ["snatch_regiment_barter", ["openBarterPopup"]], // 抢团易货兑换
        ["close_reason", ["openRefundPopup"]],
        ["snatch_regiment_express", ["checklogistics"]],
        ["expediting_delivery", ["publicMessage", { text: "提醒商家发货" }]], //催发货按钮，自定义弹出框提示文案text
        ["cashierPay", ["publicMessage", { json: { order_pay_id: this.order_pay_id }, type: "back", text: "确定此订单已付款" }]], // 退款中, 请求参数json需要多传order_pay_id
        ["inventory_apply", ["getWarehouseList_CH"]], //获取仓库列表(申请存货)
        // .....更多补充
      ]);

      if (_GET_MAP_DATA.has(_buttonType)) {
        // 如果_GET_MAP_DATA 常量中存在了当前的 btn.value，即走Map结构设置的
        let _GET_CONFIG = _GET_MAP_DATA.get(_buttonType);
        let _METHODS_NAME = _GET_CONFIG[0] || ""; //取 方法名
        let _PARAMS_DATA = _GET_CONFIG[1] || {}; // 取 设置的参数
        // let _QUERY_DATA = _GET_CONFIG[2];
        this[_METHODS_NAME](_PARAMS_DATA); //调用方法并传参
      } else if (this.isConfirmWriteOff(btn.value)) {
        // 确认核销 显示核销码弹窗
        this.confirmWriteOff();
      } else if (btn.value == 41) {
        // 398售后
        window.location.href = btn.api;
      } else if (btn.value == 26) {
        // 关闭订单
        this.closeOrderPay(order, btn);
      } else {
        // 其他，走publicMessage默认流程：Dialog提示框显示=》确认按钮=》请求接口成功=》刷新页面或返回上一页...
        this.publicMessage();
      }
    },

    isConfirmWriteOff(value) {
      // 是否为确认核销按钮
      const _ARR = ["clerk_code", "package_deliver", "package_delivery_confirm_code", "store_package_deliver", "reserve_simple"];
      if (_ARR.indexOf(value) > -1) return true;
    },

    goToUrl(_data) {
      // 跳转页面
      let { name, params = {}, query = {} } = _data;
      if (!name) return;
      this.$router.push(this.fun.getUrl(name, params, query));
    },

    publicMessage(option = {}) {
      // 流程：Dialog提示框显示=》确认按钮=》请求接口成功=》刷新或者跳转页面...
      let { order = {}, btn = {} } = this.buttonParamsData; //{order:{...}, btn:{...}}
      let { api = "", text = "", type = "refresh", json = {} } = option; //type: refresh刷新页面&&back返回上一页
      let order_id = this.orderPayId;
      const REQUESE_Data = { order_id, ...json }; //接口请求参数
      const TEXT = text || btn.name; //可自定义text参数，提示框提示文字，默认值为接口button_models里的name字段
      const REQUESE_URL = api || btn.api; //可自定义api参数，按钮点击请求事件的接口，默认值为接口button_models里的api字段

      if (!REQUESE_URL) {
        console.log("error：：publicMessage方法出错，当前按钮接口没有返回api，请和后端人员确认");
        return;
      }

      if ((order.plugin_id == 0 || order.plugin_id == 44) && btn.value == 5 && this.custom_receipt_confirmation_html !== "") {
        this.custom_receipt_confirmation_show = true;
        return;
      }

      this.$dialog.confirm({ message: `您确定${TEXT}？` }).then(() => {
        if (this.noMoreClick) {
          return;
        }
        this.noMoreClick = true;
        $http.get(REQUESE_URL, REQUESE_Data).then(
          response => {
            this.noMoreClick = false;
            if (response.result == 1) {
              this.$notify({
                background: "#f0f9eb",
                message: `${TEXT}成功`,
                color: "#67c23a"
              });
              if (order.is_boss) {
                // is_boss：true是店长,店长跳转门店订单列表页
                this.$router.push(this.fun.getUrl("orderlist", { orderType: "store", status: "0" }));
                return;
              }
              if (type == "refresh") {
                this.getNetData(); //刷新页面
              } else if (type == "back") {
                // 返回上一页
                if (window.history.length <= 1) {
                  this.$router.push(this.fun.getUrl("home", {}));
                } else {
                  this.$router.go(-1);
                }
              }
            } else {
              this.$dialog.alert({ message: response.msg });
            }
          },
          response => {
            this.noMoreClick = false;
            console.log(response);
          }
        );
      }).catch(()=>{
        console.log('取消');
      });
    },

    sendOutOrder() {
      // 确认发货
      let { order = {} } = this.buttonParamsData; //buttonParamsData格式： {order:{...}, btn:{...}}
      if (order.dispatch_type_id == 3) {
        this.sendGoogs();
      } else {
        this.getCompany();
        this.dialogVisible = true;
      }
      this.expressName = "";
      this.numberName = "";
    },

    // 客服
    getKefu() {
      let goods_id;
      if (this.order_data.has_many_order_goods.length > 0) {
        goods_id = this.order_data.has_many_order_goods[0].goods_id;
      }
      $http.get("goods.customer-service.index", { goods_id: goods_id }).then(response => {
        if (response.result == 1) {
          this.cservice = response.data.cservice;
          this.service_QRcode = response.data.service_QRcode;
          this.service_mobile = response.data.service_mobile;
          this.showKefu = true;
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },
    // 易货兑换
    confirmBarter() {
      $http.get("plugin.snatch-regiment.api.order.barter", { order_id: this.orderPayId }).then(response => {
        if (response.result == 1) {
          this.$notify({
            background: "#f0f9eb",
            message: `易货兑换成功`,
            color: "#67c23a"
          });
          this.getNetData();
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },
    // 易货兑换取消按钮
    cancelBarter() {
      this.showBarter = false;
      this.showBarter_value = null;
    },
    // 抢团易货兑换
    openBarterPopup() {
      this.showBarter = true;
      this.showBarter_value = this.order_data.barter;
    },
    openRefundPopup() {
      let { order = {} } = this.buttonParamsData; //{order:{...}, btn:{...}}
      this.refundShow = true;
      this.refundText = order.close_reason;
    },

    // 确认核销
    confirmWriteOff() {
      let { btn = {} } = this.buttonParamsData; //{order:{...}, btn:{...}}
      let url = "";
      let json = {};
      if (btn.value == "clerk_code") {
        url = "plugin.delivery-station.frontend.order.detail.qr-code-url";
        json = { order_id: this.orderPayId };
      } else if (btn.value == "reserve_simple") {
        url = btn.api;
        json = { id: this.orderPayId };
      } else {
        url = btn.api;
        json = { order_id: this.orderPayId };
      }
      $http.get(url, json, "正在获取核销码").then(
        response => {
          if (response.result == 1) {
            if (btn.value == "clerk_code") {
              this.qrcode = response.data.qrcode_url;
            } else if (response.data.hasOwnProperty("qr_code_url")) {
              this.qrcode = response.data.qr_code_url;
            }
            this.showQrcode = true;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    // 关闭订单
    closeOrderPay(order, btn) {
      let that = this;
      this.$dialog.confirm({ message: "确定关闭订单?" }).then(() => {
        let json = {
          order_id: that.$route.params.order_id
        };
        $http.get(btn.api, json).then(function(response) {
          if (response.result == 1) {
            if (that.orderType == "supplier") {
              that.$router.go(-1);
            } else {
              that.$router.push(
                that.fun.getUrl("storeOrderlist", {
                  status: "0",
                  orderType: "store"
                })
              );
            }
            that.$notify({
              background: "#f0f9eb",
              message: "关闭订单成功",
              color: "#67c23a"
            });
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        });
      });
    },

    // 获取快递公司
    getCompany() {
      var urls = "";
      if (this.orderType == "supplier") {
        urls = "plugin.supplier.frontend.order.express-company";
      } else if (this.orderType == "serviceReplenish") {
        urls = "plugin.service-station.frontend.order-list.express";
      } else if (this.orderType == "subsidiary") {
        urls = "plugin.subsidiary.frontend.order.express-company";
      } else if (this.orderType == "storeMang") {
        urls = "plugin.shop-assistant.frontend.order.expressCompanies";
      } else {
        urls = "plugin.store-cashier.frontend.store.center.sendOrder";
      }
      $http
        .get(urls, {
          order_id: this.$route.params.order_id
        })
        .then(response => {
          if (response.result === 1) {
            this.options = [];
            this.options = response.data.express_companies;
            var arrayOfSquares = this.options.map(function(item) {
              return item.name;
            });
            this.columns = arrayOfSquares;
            this.addresseeInfo = response.data.address;
            this.address = response.data.address.address;
            this.mobile = response.data.address.mobile;
            this.receiver = response.data.address.realname;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    // 选择快递公司监听
    selectCompany(value) {
      console.log(value, this.expressName);
    },

    // 确认发货取消
    sendCancel() {
      this.dialogVisible = false;
    },
    // 确认发货
    sendGoogs() {
      // if (this.expressName == "" && this.numberName == "") {
      //   this.$notify("请选择快递公司和输入快递单号")
      //   return
      // } else if (this.expressName == "") {
      //   this.$notify("请选择快递公司")
      //   return
      // } else if (this.numberName == "") {
      //   this.$notify("请输入快递单号")
      //   return
      // }

      let json = {
        order_id: this.$route.params.order_id,
        express_code: this.expressName,
        express_sn: this.numberName
      };
      if (this.orderType == "store" || this.orderType == "cashier") {
        json.express_company_name = this.expressName.name;
      }
      let _urls = "";
      if (this.orderType == "supplier") {
        _urls = "plugin.supplier.frontend.order.send";
      } else if (this.orderType == "serviceReplenish") {
        _urls = "plugin.service-station.frontend.order.order-operation.send";
      } else if (this.orderType == "subsidiary") {
        _urls = "plugin.subsidiary.frontend.order.send";
      } else if (this.orderType == "storeMang") {
        _urls = "plugin.shop-assistant.frontend.order.send";
      } else {
        _urls = "plugin.store-cashier.frontend.store.center.order-operation.send";
      }
      $http.get(_urls, json).then(response => {
        if (response.result == 1) {
          this.dialogVisible = false;
          this.getNetData();
          this.$notify({
            background: "#f0f9eb",
            message: "发货成功",
            color: "#67c23a"
          });
        } else {
          this.$dialog.alert({ message: response.msg });
        }
      });
    },

    // 查看物流
    checklogistics() {
      let { btn = {}, order: item = {} } = this.buttonParamsData; //{order:{...}, btn:{...}}
      if (item.dispatch_type_id == 7 && JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open == "1") {
        this.$router.push(this.fun.getUrl("track", { id: item.id }));
      }
      if (item.is_all_send_goods == 0) {
        this.$router.push(this.fun.getUrl("logistics", { id: item.id, fromGrab: 1, api: btn.api }));
      } else {
        //跳转多包裹路由
        // item.is_all_send_goods == 1 || item.is_all_send_goods == 2
        // //传送订单id到多包裹页面
        this.$router.push(this.fun.getUrl("multiplePackages", { order_id: item.id }));
      }
    },

    getCpsDetail(goods) {
      $http.get("plugin.aggregation-cps.api.web.getGoodsUrl", { goods_id: goods.goods_id }, "正在获取订单").then(
        response => {
          if (response.result === 1) {
            window.location.href = response.data.another_web_url;
          } else {
            Toast(response.msg);
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
      );
    },
    // 跳转商品详情页面
    toGoodsDetail(goods, isshow, showCourse) {
      const N0_NAVIGATE_TO = [107, 77, 150, 31]; //扫码商品、盲盒商品不能跳转
      if (N0_NAVIGATE_TO.indexOf(this.order_data.plugin_id) > -1) {
        return;
      }

      if (this.order_data.plugin_id == 71) {
        // cps请求接口，跳转卡卷
        this.getCpsDetail(goods);
        return;
      }
      if ((this.order_data.deposit_ladder && this.order_data.deposit_ladder.activity_id) || (this.order_data.deposit_ladder_dj && this.order_data.deposit_ladder_dj.activity_id)) {
        let activity_id = this.order_data.deposit_ladder && this.order_data.deposit_ladder.activity_id ? this.order_data.deposit_ladder.activity_id : this.order_data.deposit_ladder_dj.activity_id;
        //尾款商品跳转详情
        //id:活动id
        this.$router.push(this.fun.getUrl("depositGroupActivity", {}, { id: activity_id }));
        return;
      }
      if (this.order_data.plugin_id == 54) {
        this.$router.push(this.fun.getUrl("GroupGoods", { id: "0", store_id: goods.store_id || 0 }, { fight_groups: goods.goods_id }));
      } else {
        this.$router.push(this.fun.getUrl("goods", { id: goods.goods_id }));
      }
      // 下面的不知道这么判断干嘛  先注释
      // if (this.orderType == "lease_toy") {
      //   this.$router.push(
      //     this.fun.getUrl("goods", {
      //       id: goods.goods_id
      //     })
      //   );
      //   return;
      // }
      // if (isshow == 0) {
      //   if (showCourse == 1) {
      //     this.$router.push(
      //       this.fun.getUrl("CourseDetail", {
      //         id: goods.goods_id
      //       })
      //     );
      //   } else if (showCourse == 0) {
      //     if (this.order_data.plugin_id == 32) {
      //       this.$router.push(
      //         this.fun.getUrl("goodsO2O", {
      //           id: goods.goods_id,
      //           tag: "o2o",
      //           store_id: goods.store_id
      //         })
      //       );
      //     } else if (this.order_data.plugin_id == 54) {
      //       this.$router.push(
      //         this.fun.getUrl(
      //           "GroupGoods",
      //           {
      //             id: "0", //活动id
      //             store_id: goods.store_id || 0
      //           },
      //           { fight_groups: goods.goods_id }
      //         )
      //       );
      //     } else {
      //       this.$router.push(
      //         this.fun.getUrl("goods", {
      //           id: goods.goods_id
      //         })
      //       );
      //     }
      //   }
      // }
    },

    // 发起http请求
    getNetData() {
      let json = {};
      if (this.fun.getKey("is_clerk")) {
        json = {
          order_id: this.$route.params.order_id,
          is_clerk: this.fun.getKey("is_clerk")
        };
      } else if (this.orderType == "commission_activity") {
        json = {
          activity_id: this.$route.params.order_id
        };
      } else {
        json = {
          order_id: this.$route.params.order_id
        };
      }

      let url = "";
      try {
        if (_PAGE_API[this.orderType]) {
          url = _PAGE_API[this.orderType];
        }else{
          url = "order.detail";
        }
      } catch (error) {
        console.log("error:: getNetData()方法里 _PAGE_API[this.orderType] 取值设置接口报错,当前orderType值为：", this.orderType);
        url = "order.detail";
      }

      $http.get(url, json, "正在获取订单").then(
        response => {
          if (response.result === 1) {
            let myData = {};
            if (this.orderType == "groupsBuy" || this.orderType == "grabGroup") {
              myData = response.data.orderDetail;
            } else {
              myData = response.data;
            }
            if (myData.custom && this.fun.getKey("is_clerk") == 1) {
              this.customForm = myData.custom.form;
            }
            this.order_data = myData;
            this.order_pay_id = myData.order_pay_id;
            this.dispatch_type_id = myData.dispatch_type_id;
            this.custom_receipt_confirmation_html = myData.receipt_goods_notice || '';
            if (this.orderType == "zhpGroup") {
              for (let i = 0; i < myData.button_models.length; i++) {
                if (myData.button_models[i].api == "refund.apply.store") {
                  myData.button_models.splice(i, 1);
                }
              }
            }
            // cps话费
            if (myData.aggregation_cps_recharge_bill && !this.fun.isTextEmpty(myData.aggregation_cps_recharge_bill.recharge_number)) {
              this.aggregation_cps_recharge_bill = myData.aggregation_cps_recharge_bill.recharge_number;
            }
            // 电费充值
            if (myData.electricity_bill_pro) {
              this.electricity_bill_pro = myData.electricity_bill_pro;
            }
            //预约商品
            if (myData.reserve_date) {
              this.reserveDate = myData.reserve_date;
            }
            // 话费慢充
            if (myData.phone_bill) {
              this.phone_bill = myData.phone_bill;
            }
            // 话费慢充
            if (myData.phone_bill_pro) {
              this.phone_bill = myData.phone_bill_pro;
            }
            console.log(myData.oil_recharge);
            //油卡充值
            if (myData.oil_recharge) {
              this.oil_recharge = myData.oil_recharge;
            }
            // 供应商
            if (this.orderType == "supplier") {
              this.jurisdiction_set = myData.jurisdiction_set;
            }
            if (myData.address) {
              // 供应商
              this.address = myData.address.address;
              this.mobile = myData.address.mobile;
              this.receiver = myData.address.realname;
            } else if (myData.address_info && !myData.address_info.address) {
              this.address = myData.address_info.store_address;
              this.mobile = myData.address_info.member_mobile;
              this.receiver = myData.address_info.member_realname;
            } else if (myData.address_info) {
              this.address = myData.address_info.address;
              this.mobile = myData.address_info.mobile;
              this.receiver = myData.address_info.realname;
            }

            this.pay_type_id = myData.pay_type_id;
            if (this.orderType == "hotel") {
              this.hotel_start = myData.hotel_order.enter_at.split(" ")[0];
              this.hotel_end = myData.hotel_order.leave_at.split(" ")[0];
              this.hotel_name = myData.hotel_order.has_one_hotel.hotel_name;
              this.getDays(this.hotel_start, this.hotel_end);
            }

            if (this.orderType == "DeliveryReplenish") {
              this.service_station = myData.service_station;
            }
            if (myData.dispatch_type_id == 8) {
              this.package_deliver = myData.package_deliver;
            }
            if (myData.dispatch_type_id == 15) {
              this.package_deliver = myData.package_delivery;
            }

            if (!this.fun.isTextEmpty(myData.photo_order_thumbs)) {
              this.PhotoGoodsArr = myData.photo_order_thumbs;
            }
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              if (response.msg != "请登录") {
                this.$router.go(-1);
              }
            });
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
        }
      );
    },

    // 查看表单
    lookDFData(_data) {
      console.log(_data);
      this.dfData = _data;
      this.$nextTick(() => {
        this.showDFData = true;
      });
    },

    /*以下都是下拉快递选择相关方法*/
    seleRegional: function() {
      this.dateshow_1 = true;
    },
    onCancelbtn: function(val, index) {
      this.dateshow_1 = false;
    },
    onConfirmbtn: function(val, index) {
      this.dateshow_1 = false;
      this.regional = val;
      var array = this.options;
      this.expressName = array[index];
    },
    /*下拉快递选择相关方法end*/

    // 时间日期
    getDays(strDateStart, strDateEnd) {
      let strSeparator = "-"; // 日期分隔符
      let oDate1, oDate2, iDays;
      oDate1 = strDateStart.split(strSeparator);
      oDate2 = strDateEnd.split(strSeparator);
      let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
      this.night_day = iDays;
    },

    // 消费红包
    toPacket() {
      this.$router.push(this.fun.getUrl("ConsumePacketSuccess", {}, { order_id: this.order_id }));
    },
    startRotate() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.shrinkPacket = !this.shrinkPacket;
      }, 150);
    },
    checkoutConsumePacket() {
      let order_id = this.order_id.toString().split(",");
      $http.post("plugin.consume-red-packet.Frontend.Modules.Packet.Controllers.has.index", { order_id: order_id }, "loading").then(response => {
        if (response.result == 1) {
          this.hasPacket = true;
          this.startRotate();
        }
      });
    },
    // 消费红包end

    //value 53 获取盲盒商品
    getBlindBoxGoods() {
      $http.get("plugin.blind-box.api.index.blind-box-goods", { order_id: this.orderPayId }, "").then(res => {
        if (res.result == 1) {
          this.blindBoxInfo.show = true;
          this.blindBoxInfo.goods = res.data.order;
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },

    // 导航
    goToAdress() {
      let point = this.fun.bd_decrypt(this.package_deliver.lng, this.package_deliver.lat);
      this.fun.goToWXAdress(point, this.package_deliver.deliver_name, "详细地址");
    },

    // 跳转评价
    evaluateOpration(btn, item, order) {
      //value-0 value-1追加评价 value-2查看评价详情
      if (btn.value == 0) {
        this.$router.push({ name: "evaluate", params: { order_id: order.id, id: item.id }, query: { i: this.toi } });
      } else if (btn.value == 1) {
        this.$router.push({ name: "addevaluate", params: { order_id: order.id, item: item }, query: { i: this.toi } });
      } else if (btn.value == 2) {
        //CommentDetails
        this.$router.push({
          name: "CommentDetails",
          params: {
            order_id: order.id,
            goods_id: item.goods_id,
            comment_id: 0,
            order_goods_id: item.id,
            uid: 0
          },
          query: { i: this.toi }
        });
      }
    },
    getWarehouseList_CH() {
      $http
        .get("plugin.order-inventory.frontend.index.warehouse-list", {}, ".")
        .then(response => {
          if (response.result == 1) {
            this.inventoryApplyList = response.data.list; //仓库列表
            this.inventoryApplyRadio = response.data.list[0].id;
            this.inventoryApplyPopup = true; //存货申请弹窗
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    confirmInventoryApply() {
      $http
        .get("plugin.order-inventory.frontend.index.inventory-apply", { warehouse_id: this.inventoryApplyRadio, order_id: this.orderPayId }, ".")
        .then(response => {
          this.$dialog.alert({ message: response.msg });
          this.$emit("ConfrimOrderNotification", "pay");
        })
        .catch(err => {
          console.log(err);
        });
    },
    postMsg([key, value]) {
      this[key] = value;
    },
  },

  activated() {
    if (this.$route.query.orderType) {
      // 不建议在 query 上带 orderType参数
      this.orderType = this.$route.query.orderType;
    } else if (this.$route.params.orderType) {
      this.orderType = this.$route.params.orderType;
    } else {
      this.orderType = "shop";
    }

    this.init();
    this.getNetData();
    if (JSON.parse(window.localStorage.getItem("globalParameter")).consume_red_packet_status == 1) {
      // 判断消费红包开启再请求
      this.checkoutConsumePacket();
    }
  },
  computed:{
    // 是否认证
    isAuthed() {
      if (this.order_data.overseas) {
        return this.isAuthStatus && this.isAuthInit;
      } else {
        return true;
      }
    }
  },
  components: {
    cTitle,
    cDyPopup,
    customMessage,
    offlineOrderDetail,
    diyfrom,
    overseastag,
    gift,
    realnameAuth
  }
};
