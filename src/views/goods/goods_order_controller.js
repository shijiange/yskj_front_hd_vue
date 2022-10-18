import cTitle from "components/title";
import { Toast } from "vant";
// import cDyPopup from "./diyFormPopup";
import deliveryMap from "components/delivery_map";
import yzAddressList from "components/ui_components/yz_addressList/index";
import yzSubscribe from "components/ui_components/yz_subscribe";
import yz_uploader from "components/ui_components/yz_uploader";
import yzMyinfo from "components/ui_components/yz_myinfo";
import location from "components/ui_components/yz_addressList/location";
import order_invoice from "./order_components/invoice";
import addGoodsModule from "./order_components/addGoods";
import diyfrom from "components/diyform";
import invoicePop from "./components/invoice-pop";
import cityDeliveryDay from "./components/city-delivery-day";
import agencySaleman from "./order_components/agency-saleman";
import overseastag from '../../components/overseas/tag';
import realnameAuth from '../../components/overseas/realname-auth';
import labels from '../../components/goods/labels';
import gift from "components/goods/gift";

const TAG_ACTION_BUY = "-2"; // 直接购买
const TAG_ACTION_CART = "-1"; // 1购物车结算
var _goodsId = "";
var _optionsId = "";
var _total = 1;
var currentAddId = "";
var currentAddress = {};
var _cart_ids = [];
var _packagJson = {};

var location_loading = 0; //防止频繁定位，后面考虑优化封装在getLocation()解决

export default {
  data() {
    return {
      root_tag: "", // 预下单的标识
      pre_order_url: "", // 预下单的请求url
      order_url: "", // 提交订单的请求url
      order_other_json: {}, // 每种类型下单的格外的请求数据
      isCartsOrder: false, // 判断是不是购物车下单类型
      favorable_rate: [], //海外好评率
      taxShow: false, //税费详情展示
      taxGoodsList:[], //税费商品列表

      popCode: "",
      showPop: false,

      clicktag: 0,
      good_clicktag: 0,

      order_data: "",
      // 积分自定义名称
      integral: window.localStorage.integral,
      // 爱心值自定义名称
      love_name: window.localStorage.love_name,
      goodsInfo: {},
      order: {},
      realname: "", // 收件人
      mobile: "",
      address: "",
      price: 0,
      showAddress: false,
      yzAddressListOptions: {}, //地址组件配置信息（可选）

      // 优惠券
      coupons: [],
      popupCouponSpecs: false,
      coupon_size: 0,
      checkCouponList: [],
      use_coupon_size: 0,
      stepper_show: 0,
      is_coupon_SELE: false,
      coupons_temp: {}, //折叠优惠券input框model
      timeoutId: null, //防抖，防止折叠优惠券频繁触发

      // 积分抵扣 其他抵扣
      checkDeductionList: [],

      // 跨境
      isTaxGoods: false,
      // explain_title: "",
      // explain_content: "",

      // O2O部分
      storeCarts: [],
      store_id: 0,
      store_info: {},
      linkinfo: {
        mobile: "",
        name: ""
      },
      selected: 0,
      dispatch: [],

      // 个人信息和修改
      getParams_status: false, //是否已请求接口
      myRealname: "",
      myIdcard: "",
      showMyinfo: false,
      showFrom: false,

      isRent: false, // 租赁商品标识
      checkList: [], // 权益商品选择列表
      isRightChoose: false, // 是否选择权益商品

      rentTime: [], // 租期
      rentFree: "", // 可以免租的件数

      isOpenRight: false, // 是否开启会员权益开关

      currentIndex: "999",

      agreement: false, // 同意租赁协议
      agreementShow: false,

      AgreementPay: "", // 是否显示支付协议
      agreementPay: false, // 同意支付协议
      agreementPayShow: false, // 支付协议

      agreeCon: {}, // 租赁协议
      rent_deposit_free: 0, // 免押件数
      rent_free: 0, // 免租件数

      cup_notice: true, // 优惠券标识
      isShowCoupon: true, //是否显示优惠券
      submit_active: true,

      defaultAddress: {},

      note: [], // 留言
      service_fee: [], //服务费、运费说明
      for_serviceFee_status: false, //是否已遍历完成，避免van-checkbox-group 的change

      // 发票
      isShowInvoice: true,
      invoiceData: {
        papery_status: "",
        electron_status: ""
      },
      invoice_list: {
        call: "",
        company_number: "",
        //email: "",
        invoice_type: 0,
        invoice_status: 1,
        phone: "",
        invoice_content:"商品明细"
      },
      addressData:{},//地址数据
      show_address: true,
      recipient_name: "",
      recipient_mobile: "",

      // 续费商品
      goods_id: "",
      // 添加的name
      total_items: [],
      discount_amount_items: [],

      isGetAgreementPay: false, //判断是否已经请求了支付协议接口

      service_fee_items: {}, //服务费

      distributionUserName: "",
      distributionUserMobile: "",

      isOpenTeam: false, //是否为一键开团
      isJoinTeam: false, //是否为去参团

      isPhoto: false, //开启相册商品，true为相册商品
      fileList1: [], //相册路径链接
      max_count: 9, //最大上传张数
      min_count: 1, //最小上传张数
      storeNo_photo: false,

      defaultSelfCarry: "",
      isQuest_ing: true, //是否正在请求数据中
      form_data_id: "", //提交自定义表单后返回的表单id，
      deliverName: "自提点", //自提点自定义名称
      o2odeliverName: "自提点", //门店自提点自定义名称
      o2oSelfCarry: {},

      dyFormPopup: false,
      dfData: {},
      goodDYDormID: null,
      activeDYGoodID: null,
      activeFormDataID: null,
      dyDescription: null,
      dyTiitle: "",
      dyThumb: null, //表单图片
      oldOrder_data: [], //用于保存保存商品自定义表单后的数据

      is_region: 0,

      delivery_note: "", //门店配送说明
      delivery_area: [[116.403322, 39.920255]], // 配送范围经纬度
      locations: [116.403322, 39.920255], //门店经纬度
      is_show_store_delivery: false, //是否显示门店配送范围
      is_open_store_delivery: false, //是否开启门店配送
      locationName: "", //经纬度
      deliveryScopeShow: false,
      district_id: 0, //地址区域id

      show_domain: false,
      shop_domain: "", //绑定域名
      isCueCoupon: false, //提示优惠券选择，只提示一次
      openCueCoupon: false,
      plugin_id: "", //应用市场plugin_id===58的时候要请求另外一个接口

      orderLocationObj: { positioning_success: 0, province: "", city: "" }, //下单添加定位地址（业绩区域）

      fromStock: "", // 是否是云库存商品
      is_cps: false, //聚合cps标识
      cpsType: "2", //1,直冲  2,卡券
      cpsTxt: "", //直冲帐号

      // 话费慢充
      show_recharge_mobile: "",
      recharge_tips: "",
      recharge_mobile: "",

      // 自定义表单
      hasGoodOpenDF: false,
      //上门安装 插件名：live-install
      minDate: new Date(),
      installDate: null, //预约时间(10位时间戳)
      install_comment: "", //安装备注，不要超过120个字符
      location: {}, //定位信息
      showLocation: false,
      showInstallPop: false,

      subTemplate: "",
      storeSearchBtn: {}, //门店搜索插件自定义下单页按钮
      default_deduction: 0, //判断积分抵扣默认是否开启
      reserveName: "",
      reservePhone: "",
      reserveDate: "",
      // 预约扣除积分
      reserve_deduction: "",
      //预约扣除爱心值
      reserve_deduction_love: "",
      delivery_amount: 0, // 起送金额
      // 折扣自定义字段
      deduction_lang: "",
      phone_bill_pro_goods: false, //是否话费充值pro版，根据url是否有mobile来判断
      // supp_adress:'',
      supp_point: {
        lng: "",
        lat: "",
        address: ""
      },
      recommend_goods: [], //满额包邮推荐商品
      // 电费充值规格组合id
      electricity_Guide: "",
      electricity: false,
      // 充值户号
      eleUser: [],
      ele_no_showAdress: false,

      //运费说明
      ferightExplainPop: false,
      freightExplain: {},

      costSpecShow: false,
      selectCommunityShow: false,
      serviceRegionShow: false,

      //同城配送
      cityDelivery: null,
      cityDelivery_community: {},
      cityDelivery_community_id: 0,
      cityDelivery_deliveryTime: {},
      yz_subscribe_disabled: false,

      self_member_id: "",
      plugin_setting: '', //插件信息 获取默认地址
      camilo_resources_coupon_type: '', //插件id：140 卡券商品 1直冲2卡券
      recharge_number: '',
      number_isFocus: false,
      reserve_order:{
        service_id:'',
        obj_id:'',
        begin_time:'',
        customer_name:'',
        customer_tel:''
      },

      addressList_caller:"",  //地址组件调用着，识别是地址调用还是发票插件调用
      //油卡充值
      oil_mobile:"",
      oil_account:"",
      oil_pre_id:"",

      consigneeName: '', // 自提点提货人自定义
      consigneeMobile: '', // 自提点提货人手机号
      vip_show:JSON.parse(window.localStorage.getItem("globalParameter")).vip_show?JSON.parse(window.localStorage.getItem("globalParameter")).vip_show:false,

      payTips: false, // 付款提示
      payTipsContent: '', // 付款提示的内容
      isAuthStatus: false, // 是否已实名认证
      isAuthInit: false, // 是否已实名初始化完成
      ignoreNotice: false, //是否忽略提醒
      activityShow: false,
    };
  },

  /**
   *  预下单页面:
   *  params : packagJson  changeSelfCarry address_data create district_id  pointId exchangeData
   *
   *  query : tag level_id  team_id goodsId  optionsId total store_id  isCash  distributionUserName distributionUserMobile
   *          orderType  mark team_id option_level_id at_id
   *          leader_id  order_id  activity_id cart_ids
   *  */

  activated() {
    this.initData();
    this.handleQueryData();
    // 重新计算
    if (this.selected == "10") {
      // 定位
      this.fun
        .getLocation("正在定位")
        .then(res => {
          // this.supp_adress = res.address;
          let ares = this.fun.bd_encrypt(res.point.lng, res.point.lat);
          this.supp_point.lng = ares.lng;
          this.supp_point.lat = ares.lat;
          this.supp_point.address = res.address;
        })
        .catch(err => {});
    }
  },
  computed: {
    // 是否认证
    isAuthed() {
        if (this.isOverseas) {
            return this.isAuthStatus && this.isAuthInit;
        } else {
            return true;
        }
    },
    // 是否已海外商品
    isOverseas() {
      return this.$route.query.overseas == 1 ? true : false;
    },
    appointmentLang() {
      if (this.$store.state.shopLanguage.reserve_simple) {
        return this.$store.state.shopLanguage.reserve_simple;
      } else {
        return { reserve_obj: "预约人员", service: "服务" };
      }
    }
  },
  methods: {
    // 子组件透传给父级数据
    postMsg([key, value]) {
        this[key] = value;
    },
    vipPriceMethod(vip_price,total){
      console.log(vip_price,total)
      return (Number(vip_price) / Number(total)).toFixed(2)
    },
    setCityDeliveryCommunity() {
      this.cityDelivery_community = this.cityDelivery.community_setting.community_list.find(item => {
        return item.id == this.cityDelivery_community_id;
      });
      this.selectCommunityShow = false;
    },
    openCityDeliveryDay() {
      this.$refs.deliveryTime.setPopShow(true);
    },
    cityDeliveryDayConfirm(detail) {
      this.cityDelivery_deliveryTime = detail;
      this.handleBuy();
    },
    tolocation() {
      this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: "suppligoodsOrde" }));
    },
    //初始化数据 distributionUserName
    initData() {
      this.recharge_mobile = "";
      this.show_recharge_mobile = "";
      this.show_domain = false;
      this.shop_domain = "";
      this.clicktag = 0;
      this.good_clicktag = 0;

      this.submit_active = true;
      //地址清空
      this.realname = "";
      this.mobile = "";
      this.address = "";

      this.linkinfo = {
        mobile: "",
        name: ""
      };
      this.oldOrder_data = [];
      this.order_data = [];
      this.defaultAddress = {};

      this.store_info = {};
      this.storeCarts = [];
      this.store_id = 0;
      this.selected = this.selected == 10 ? this.selected : 0;
      this.showAddress = false;
      this.goodsInfo = {};
      this.order = {};
      this.dispatch = [];

      this.getParams_status = false;
      this.myRealname = "";
      this.myIdcard = "";
      this.showMyinfo = false;
      this.showFrom = false;

      this.isRent = false;
      this.AgreementPay = "";
      this.checkList = [];
      this.isRightChoose = false;
      this.rentTime = [];
      this.rentFree = "";

      this.isOpenRight = false;
      this.agreement = false;
      this.agreementPay = false;
      this.agreementShow = false;
      this.agreementPayShow = false;
      this.agreeCon = {};
      this.note = [];

      // 优惠券
      this.popupCouponSpecs = false;
      this.coupon_size = 0;
      this.use_coupon_size = 0;
      this.checkCouponList = [];
      this.coupons = [];
      this.isShowCoupon = true;

      // 抵扣
      this.checkDeductionList = [];

      // 续费商品
      this.goods_id = "";
      this.isGetAgreementPay = false;

      currentAddId = "";
      currentAddress = {};

      _cart_ids = [];

      //是否保存过自提点提货人和手机号信息，有的话自动填写【任务编号: 35632】
      let _ztdInfo = JSON.parse(window.localStorage.getItem("selfCarryInfo")) || {};
      if (this.$route.query.store_id) {
        //这是门店的
        this.linkinfo.name = !this.fun.isTextEmpty(_ztdInfo.distributionUserName) ? _ztdInfo.distributionUserName : "";
        this.linkinfo.mobile = !this.fun.isTextEmpty(_ztdInfo.distributionUserMobile) ? _ztdInfo.distributionUserMobile : "";
      } else {
        this.distributionUserName = this.$route.query.distributionUserName
          ? this.$route.query.distributionUserName
          : !this.fun.isTextEmpty(_ztdInfo.distributionUserName)
            ? _ztdInfo.distributionUserName
            : "";
        this.distributionUserMobile = this.$route.query.distributionUserMobile
          ? this.$route.query.distributionUserMobile
          : !this.fun.isTextEmpty(_ztdInfo.distributionUserMobile)
            ? _ztdInfo.distributionUserMobile
            : "";
      }

      this.isOpenTeam = false;
      this.isJoinTeam = false;
      this.isCueCoupon = false;
      this.openCueCoupon = false;

      this.fileList1 = []; //相册
      this.isPhoto = false;

      this.defaultSelfCarry = "";
      this.form_data_id = "";
      this.for_serviceFee_status = false;
      this.service_fee = [];
      this.is_show_store_delivery = false;
      this.is_open_store_delivery = false;
      this.locationName = "";
      this.district_id = this.$route.params.district_id || 0;
      this.deliveryScopeShow = false;

      this.pre_order_url = ""; // 预下单的url
      this.order_url = ""; // 提交订单的url
      this.order_other_json = {}; // 每种类型多余的参数
      this.isCartsOrder = false;

      this.isTaxGoods = false;

      this.phone_bill_pro_goods = false;
      // 电费充值
      this.electricity = this.$route.query.electricity == "electricity" ? true : false;
      this.eleUser = [];
      this.ele_no_showAdress = false;
      this.plugin_setting = localStorage.getItem("plugin_setting") ? JSON.parse(localStorage.getItem("plugin_setting")) : '';
    },

    // 处理query数据
    async handleQueryData() {
      // 接收tag参数
      this.root_tag = this.$route.query.tag;
      console.log("this.root_tag", this.root_tag);
      if (this.fun.isTextEmpty(this.root_tag)) {
        // 为空跳回
        this.$router.go(-1);
        return;
      }

      // 云库存预下单
      if (this.$route.query.fromStock) {
        this.fromStock = this.$route.query.fromStock;
      }

      // 话费充值
      if (this.$route.query.mobile) {
        this.phone_bill_pro_goods = true;
        this.recharge_mobile = this.$route.query.mobile;
      }

      //油卡充值
      if(this.$route.query.oil_mobile && this.$route.query.oil_account){
        this.oil_mobile = this.$route.query.oil_mobile;
        this.oil_account = this.$route.query.oil_account;
      }

      // 聚合cps商品预下单
      if (this.$route.query.cpstype) {
        this.cpsType = this.$route.query.cpstype;
      }
      if (this.$route.query.iscps) {
        this.is_cps = true;
      }

      // 商品相册
      if (JSON.parse(window.localStorage.getItem("globalParameter")) && JSON.parse(window.localStorage.getItem("globalParameter")).is_open_photo_order == "1" && this.root_tag == TAG_ACTION_BUY) {
        //需求：商城商品、供应商商品立即购买和门店商品下单才能使用相册上传模块，且一个下单的商品id（新需求去掉购物车，不能使用相册）
        this.isPhoto = true; //开启相册上传模块
        this.$nextTick(() => {
          this.$refs.yzUploader.initData();
        });
        this.setPhotoNum();
      }

      // 拼团
      this.isOpenTeam = !this.fun.isTextEmpty(this.$route.query.level_id); //是否为一键开团
      this.isJoinTeam = !this.fun.isTextEmpty(this.$route.query.team_id); //是否为去参团

      // 自提点
      let fromChange = this.$route.params.changeSelfCarry ? JSON.parse(this.$route.params.changeSelfCarry) : this.$route.query.changeSelfCarry ? JSON.parse(this.$route.query.changeSelfCarry) : null;
      if (fromChange) {
        //从更换自提点列表页面选择后返回 或者 社群团购结算进入tag=communityBuy
        if (this.$route.query.dispatch_id == 12) {
          // 门店自提点
          this.o2oSelfCarry = fromChange;
        } else {
          this.defaultSelfCarry = fromChange;
        }
      }

      if (JSON.parse(window.localStorage.getItem("globalParameter")) && JSON.parse(window.localStorage.getItem("globalParameter")).order_locate == true) {
        this.orderLocationObj = await this.getCurrentOrderLocation();
      }

      // 设置主要参数
      _goodsId = this.$route.query.goodsId || "";
      _optionsId = this.$route.query.optionsId || 0;
      _total = this.$route.query.total || 1;

      if (this.$route.query.hasOwnProperty("cart_ids") && this.$route.query.cart_ids && typeof this.$route.query.cart_ids == "string") {
        // 购物车下单
        _cart_ids = this.$route.query.cart_ids.split(",");
        if (this.fun.isTextEmpty(_cart_ids)) {
          // 为空跳回
          this.$router.go(-1);
          return;
        }
      }

      if (this.root_tag == TAG_ACTION_BUY || this.root_tag == "activity" || this.root_tag == "cps" || this.root_tag == "store" || this.root_tag == "reserve" ) {
        // this.store_id要根据情况赋值
        if (this.$route.query.hasOwnProperty("store_id") && this.$route.query.store_id) {
          // 门店购物车下单
          this.store_id = this.$route.query.store_id;
        }
      }

      if (this.root_tag != "POrder" && this.root_tag != "store") {
        //第请求接口获取配送方式后，取默认第一个的dispatch_type_id再请求预下单接口;  挂单POrder走固定的配送方式
        this.getDispatchMethod();
      } else {
        this.handleBuy();
      }
    },
    // 获取配送方式
    getDispatchMethod(cart_ids) {
      if (this.root_tag == "communityBuy") {
        // 社区团购直接设置，走配送方式接口返回为空，前端自定义，自提点不可更换
        this.dispatch = [{ dispatch_type_id: 8, name: "自提点" }];
        this.selected = 8;
        this.handleBuy();
        return;
      }
      // goods_ids 商品id字符串，多个用逗号分割; cart_ids购物车id
      let json = {
        goods_id: _goodsId ? _goodsId.toString() : "",
        cart_ids: this.$route.query.cart_ids || cart_ids,
        store_id: this.$route.query.store_id || this.$route.query.groupStoreID,
        model: ""
      };
      if (this.root_tag == "store") {
        json.model = "store";
      }
      if (this.root_tag == "warehouse" && this.$route.query.goods) {
        let _goods_ids = [];
        JSON.parse(this.$route.query.goods).forEach(item => {
          _goods_ids.push(item.goods_id);
        });
        json.goods_ids = JSON.stringify(_goods_ids);
      }
      $http
        .post("memberCart.dispatch-type.index", json)
        .then(
          response => {
            if (response.result === 1) {
              this.dispatch = response.data || [];
              if (this.selected == 10) {
                console.log(this.selected, "供应商导航");
              } else {
                this.selected = this.dispatch && this.dispatch.length > 0 ? this.dispatch[0].dispatch_type_id : 0; //默认第一
              }
              this.dispatch.forEach(items => {
                if (items.dispatch_type_id == 8 && this.$route.query.dispatch_id == 8) {
                  // 从自提点列表回来
                  if (this.defaultSelfCarry && this.defaultSelfCarry.id) {
                    this.selected = 8;
                  }
                } else if (this.$route.query.dispatch_id == 12) {
                  //从门店自提点列表选择后来
                  if (this.o2oSelfCarry && this.o2oSelfCarry.id) {
                    this.selected = 12;
                  }
                }
              });
              if (this.root_tag == "store") {
                this.getStoreCartBuy(this.storeCarts);
              } else {
                this.handleBuy();
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.log(err);
        });
    },
    // 判断类型处理预下单方式
    handleBuy(is_again) {
      // is_again判断是否重新请求数据  选择地址后是1   优惠券或者抵扣是2
      switch (this.root_tag) {
      case TAG_ACTION_BUY:
      case "appointment_goods":
      case "yun_sign_goods":
      case "yun_contract_lock_goods":
      case "yunqian_api":
      case "activity":
      case "cps":
      case "channel_buy": //渠道商立即购买
      case "starGroup":
      case "blindBox":
      case "fromExchange":
      case "auction":
      case "zhpGroup":
      case "o2oDeposit":
        // 通常是单个商品的预下单
        if (!is_again) {
          if (this.$route.query.store_id) {
            // 门店拓客  门店预约
            this.initStore("is_activity");
          } else if (this.$route.query.groupStoreID) {
            //门店拼团
            this.initStore();
          }
          // 只为了获取配送方式
        } else if (this.root_tag == "fromExchange" && is_again === "2") {
          //会员中心-兑换中心-去兑换（商城商品）
          this.getDataActionBuy(0);
          return;
        }
        this.getDataActionBuy(); // 直接购买
        break;
      case TAG_ACTION_CART: // 商城购物车结算
      case "-10": // 一口价
      case "communityBuy": // 社区团购
      case "channel": // channel渠道商订货购物车结算
      case "channel_Replenishment":
      case "channel_TCOrder":
      case "packagBuy":
        this.isCartsOrder = true;
        // 通常是购物车的预下单
        if (this.root_tag == "packagBuy") {
          // 套餐购买 使用params不能刷新
          if (!is_again) {
            _packagJson = this.$route.params.packagJson;
            if (this.fun.isTextEmpty(_packagJson)) {
              // 为空跳回
              this.$router.go(-1);
              return;
            }
          }
        }
        this.getDataActionCart();
        break;
      case "store":
        this.isCartsOrder = true;
        if (!is_again) {
          // 门店购物车购买
          if (this.$route.query.isCash === 1) {
            // 门店过期商品下单
            this.getCashGood();
          } else {
            this.initStore();
          }
        } else {
          this.getDataActionStoreCart(); // 门店结算
        }
        break;
      case "rentCartBuy":
      case "rentBuy":
        if (!is_again) {
          // 租赁购物车或租赁预下单
          this.currentIndex = "999";
          this.isRent = true;

          this.getRentDataActionCart([], []);
          this.getRentTimeList();
          this.judgeIsRight();
        } else {
          this.rentGoodBuy();
        }
        break;
      case "POrder":
        //挂单商品
        this.getPendingOrder_type(); //批发区下单页类型判断,即导航栏判断
        break;
      default:
        this.getDataActionBuy(); // 直接购买
      }
    },
    // 处理单个商品的预下单 设置预下单链接  提交订单链接  类型额外的数据
    handleDataActionBuyUrl(json, tag) {
      if (this.isRent) {
        // 租赁
        this.order_url = "plugin.lease-toy.api.order.create";
      } else if (this.isPhoto) {
        this.order_url = "plugin.photo-order.api.create";
      } else if (this.root_tag == "appointment_goods") {
        this.order_url = "plugin.appointment.frontend.order.create";
      } else if (this.root_tag == "yun_sign_goods") {
        this.order_url = "plugin.yun-sign.frontend.order.create";
      } else if (this.root_tag == "yun_contract_lock_goods") {
        this.order_url = "plugin.yun-contract-lock.frontend.order.create";
      } else if (this.root_tag == "yunqian_api") {
        this.order_url = "plugin.yunqian-api.frontend.order.create";
      } else if (this.root_tag == "activity") {
        this.order_url = "plugin.activity-apply.api.create";
      } else if (this.root_tag == "store_projects_goods") {
        this.order_url = "plugin.store-projects.frontend.order.create";
      } else if (this.fromStock == 1) {
        //云库存立即购买
        this.pre_order_url = "plugin.agency.api.goods-buy.index";
        if (this.$route.query.is_retail) {
          this.order_other_json = {
            is_retail: true, //云库存零售传值
            salesman_uid: (this.$refs.agencySaleman && this.$refs.agencySaleman.self_member_id) || "" //销售员id
          };
        }
        this.order_url = "plugin.agency.api.create.index";
      } else if (this.isOpenTeam || this.isJoinTeam) {
        // 拼团
        this.order_other_json = {
          option_level_id: this.$route.query.option_level_id //规格层级id
        };

        if (this.isOpenTeam) {
          this.order_other_json.level_id = this.$route.query.level_id; //一键开团 拼团层级id
          this.pre_order_url = "plugin.fight-groups.frontend.controllers.team.pre-open-team";
        } else if (this.isJoinTeam) {
          this.order_other_json.team_id = this.$route.query.team_id; //一键参团 拼团层级id
          this.pre_order_url = "plugin.fight-groups.frontend.controllers.team.pre-join-team";
        }

        this.order_url = "plugin.fight-groups.frontend.controllers.create.index";

        if (this.$route.query.groupStoreID) {
          this.order_other_json.store_id = this.$route.query.groupStoreID; //门店id
          //门店拼团
          this.pre_order_url = this.isOpenTeam ? "plugin.fight-groups.frontend.store.frontend-team.pre-open-team" : "plugin.fight-groups.frontend.store.frontend-team.pre-join-team";

          this.order_url = "plugin.fight-groups.frontend.store.create.index";
        }
      } else if (this.$route.query.orderType == "groupBuy_open" || this.$route.query.orderType == "groupBuy_join") {
        //拼购商品开团或参团
        this.order_other_json = {
          at_id: this.$route.query.at_id, //活动ID
          leader_id: this.$route.query.leader_id || 0 //团长ID
        };
        delete json.option_id;
        this.pre_order_url = this.$route.query.orderType == "groupBuy_open" ? "plugin.together-purchase.api.team.preOpenTeam" : "plugin.together-purchase.api.team.preJoinTeam";

        this.order_url = "plugin.together-purchase.api.create.index";
      } else if (this.$route.query.orderType == "grabGroup_open" || this.$route.query.orderType == "grabGroup_join") {
        //抢团开团或参团
        this.order_other_json = {
          at_id: this.$route.query.at_id, //活动ID
          leader_id: this.$route.query.leader_id || 0, //团长ID
          snatch_option_id: _optionsId
        };
        json.option_id = 0;
        this.pre_order_url = this.$route.query.orderType == "grabGroup_open" ? "plugin.snatch-regiment.api.team.preOpenTeam" : "plugin.snatch-regiment.api.team.preJoinTeam";

        this.order_url = "plugin.snatch-regiment.api.create.index";
      } else if (this.$route.query.tag == "POrder") {
        //挂单商品
        this.order_other_json = {
          mark: this.$route.query.mark, //规格层级id
          pending_order_type: this.selected //批发订单使用类型
        };
        this.pre_order_url = "plugin.pending-order.frontend.goods-buy.index";

        this.order_url = "plugin.pending-order.frontend.create.index";
      } else if (this.$route.query.tag == "o2oDeposit") {
        //门店定金阶梯团下单（非门店的活动走商城普通商品立即购买下单流程）【#82681】
        this.order_other_json = {
          store_id: this.$route.query.store_id || "" //门店ID
        };
        this.pre_order_url = "plugin.deposit-ladder.frontend.store.activity-buy";
      } else if (this.$route.query.store_id) {
        if (this.$route.query.tag == "reserve") {
          // 门店预约
          this.order_other_json = {
            date_id: this.$route.query.date_id, //日期ID
            store_id: this.$route.query.store_id || 0, //门店ID
            goods_id: _goodsId
          };
          if (tag === "order") {
            this.order_other_json.mobile = this.reservePhone;
            this.order_other_json.realname = this.reserveName;
          }
          this.pre_order_url = "plugin.store-reserve.frontend.GoodsBuy.index";

          this.order_url = "plugin.store-reserve.frontend.create.index";
        } else {
          //门店拓客
          this.order_other_json = {
            store_id: this.$route.query.store_id || 0 //门店ID
          };
          if (tag === "order") {
            this.order_other_json.mobile = this.linkinfo.mobile;
            this.order_other_json.realname = this.linkinfo.name;
            this.order_other_json.cart_ids = [];
          }
          this.pre_order_url = "plugin.store-cashier.frontend.store.goods-buy";

          // 走门店下单
        }
      } else if (this.$route.query.tag == "starGroup") {
        //星拼乐
        this.order_other_json = {
          at_id: this.$route.query.at_id, //活动ID
          leader_id: this.$route.query.leader_id || 0, //团ID
          goods_data: {
            goods_id: _goodsId,
            total: _total,
            option_id: _optionsId
          }
        };
        this.pre_order_url = "plugin.star-spell.frontend.team.joinTeam";

        this.order_url = "plugin.star-spell.frontend.create.index";
      } else if (this.$route.query.tag == "blindBox") {
        this.order_other_json = {
          activity_id: this.$route.query.at_id, //活动ID
          goods_id: _goodsId
        };
        this.pre_order_url = "plugin.blind-box.api.buy";

        this.order_url = "plugin.blind-box.api.create";
      } else if (this.$route.query.tag == "channel_buy") {
        //渠道商立即购买
        this.order_other_json = {
          channel_type: "2" //2进货
        };
        this.pre_order_url = "plugin.channel.frontend.replenish-goods-buy.index";

        this.order_url = "plugin.channel.frontend.replenish-create.index";
      } else if (this.root_tag == "fromExchange") {
        //会员中心-兑换中心
        if (this.$route.query.store_id && this.$route.query.store_id !== undefined) {
          this.order_other_json.store_id = this.$route.query.store_id;
          this.pre_order_url = "plugin.store-cashier.frontend.store.exchange-center";
        } else {
          this.pre_order_url = "coupon.exchange-center.exchange-buy";
        }
      } else if (this.$route.query.orderType == "newRetail") {
        //新零售 0-自由零售 1-成为代理商订单 2-自由发货 3-线上零售 4-进货订单 5-销售代理套餐订单
        this.order_other_json = {
          retail_state: this.$route.query.retail_state,
          level_id: this.$route.query.NRLevelId || 0, //等级id
          sales_id: this.$route.query.sales_id || 0 //记录id
        };
        // if (this.$route.query.retail_state == 2) {
        //   this.order_other_json.goods = JSON.parse(this.$route.query.goods) || []; // 自由发货
        // }
        this.pre_order_url = this.newRetailApi(this.$route.query.retail_state);

        if (this.$route.query.retail_state == 0) {
          this.order_url = "plugin.new-retail.frontend.create.ordinary"; // 自由发货
        } else {
          this.order_url = "plugin.new-retail.frontend.create.index";
        }
      } else if (this.root_tag == "auction") {
        //拍卖商品
        this.order_other_json = {
          fixed_price: this.$route.query.fixed_price,
          auction_sn: this.$route.query.auction_sn
        };
        this.pre_order_url = "plugin.auction.api.goods-buy";

        this.order_url = "plugin.auction.api.order-create";
      } else if (this.root_tag == "zhpGroup") {
        //珍惠拼参团
        this.order_other_json = {
          activity_id: this.$route.query.activity_id,
          option_id: _optionsId
        };
        this.pre_order_url = "plugin.zhp-group-lottery.frontend.goods.get-goods-Info";

        this.order_url = "plugin.zhp-group-lottery.frontend.order.index";
      } else if (this.root_tag == "group-work") {
        this.order_other_json = {
          alliance_detail_id: this.$route.query.alliance_detail_id,
          activity_option_id: this.$route.query.activity_option_id
        };
        this.pre_order_url = "plugin.group-work.frontend.modules.order.controllers.buy.index";
        this.order_url = "plugin.group-work.frontend.modules.order.controllers.create.index";
      } else if (this.root_tag == "warehouse") {
        this.order_other_json = {
          goods: this.$route.query.goods
        };
        this.pre_order_url = "plugin.warehouse.frontend.controllers.takeDelivery.goods-buy";
        this.order_url = "plugin.warehouse.frontend.controllers.takeDelivery.order-create";
      }else if (this.root_tag == "timeAppoint"){
        this.order_url = "plugin.reserve-simple.frontend.order.create";
        this.reserve_order.service_id = this.$route.query.reserveItem?this.$route.query.reserveItem.service_id:'';
        this.reserve_order.obj_id = this.$route.query.reserveItem?this.$route.query.reserveItem.id:'';
        this.reserve_order.begin_time = this.$route.query.reserveDate;
        this.order_other_json = {
          reserve_order: this.reserve_order
        };
      }
      if (this.$route.query.electricity == "electricity") {
        this.order_other_json.account_id = this.$route.query.account_id;
      }
      if (this.$route.query.merchant_meeting) {
        //线下招商会商品下单，多传一个活动id
        this.order_other_json.merchant_meeting = this.$route.query.merchant_meeting;
      }

      if (!this.pre_order_url) {
        this.pre_order_url = "plugin.overseas.frontend.goods-buy";
      }

      if (!this.order_url) {
        if (this.is_cps) {
          // 如果是聚合cps的商品走立即购买换这个接口
          this.order_url = "plugin.aggregation-cps.api.create-order";
        } else {
          this.order_url = "plugin.overseas.frontend.order.create";
        }
      }
      if (this.default_deduction != 0) {
        // 默认积分抵扣
        this.order_other_json.no_deduction_ids = this.default_deduction;
      }

      //同城配送
      if (this.cityDelivery && this.cityDelivery.future_state == 1) {
        if (this.cityDelivery_deliveryTime.start_time && this.cityDelivery_deliveryTime.end_time) {
          json.expect_start_time = this.cityDelivery_deliveryTime.start_time;
          json.expect_end_time = this.cityDelivery_deliveryTime.end_time;
        }
      }

      return Object.assign(json, this.order_other_json);
    },
    // 处理购物车的预下单 设置预下单链接  提交订单链接  类型额外的数据
    handleDataActionCartUrl(json, tag) {
      if (this.root_tag == "-10") {
        // 一口价下单
        this.pre_order_url = "plugin.pack-fixed-price.api.cart-buy.index";
        if (tag === "order") {
          let fixedArr = this.$route.query.cart_ids.split(",");
          this.order_other_json.cart_ids = JSON.stringify(fixedArr);
        }

        this.order_url = "plugin.pack-fixed-price.api.create.index";
      } else if (this.root_tag == "communityBuy") {
        //社区团购
        this.pre_order_url = "plugin.package-deliver.frontend.cartBuy.index";
        this.order_other_json = {
          dispatch_type_id: 8,
          package_deliver_id: this.$route.query.package_deliver_id,
          group_id: this.$route.query.group_id
        };

        this.order_url = "plugin.package-deliver.frontend.create.index";
      } else if (this.root_tag == "channel_TCOrder") {
        // 渠道商订货购物车结算
        // 2:订货 1:补货
        this.order_other_json.channel_type = "2";
        if (tag === "order") {
          this.order_other_json.address = {};
        }
        this.pre_order_url = "plugin.channel.frontend.replenish-cart-buy.index";

        this.order_url = "plugin.channel.frontend.replenish-create.index";
      } else if (this.root_tag == "channel" || this.root_tag == "channel_Replenishment") {
        // 2:订货 1:补货
        this.order_other_json.channel_type = this.root_tag == "channel_Replenishment" ? "1" : "2";
        this.order_other_json.order_id = this.$route.query.order_id;
        if (tag === "order") {
          this.order_other_json.address = {};
        }
        this.pre_order_url = "plugin.channel.frontend.cart-buy.index";

        this.order_url = "plugin.channel.frontend.create.index";
      } else if (this.root_tag == "packagBuy") {
        this.order_other_json.package_id = _packagJson.package_id;
        this.order_other_json.goods = JSON.stringify(_packagJson.goods_list);
        // 套餐购买
        this.pre_order_url = "plugin.goods-package.frontend.package.package-buy.index";
      }

      if (tag === "order" && this.root_tag != "-10" && this.root_tag != "packagBuy") {
        // 购物车下单需要购物车id是数组
        this.order_other_json.cart_ids = JSON.stringify(_cart_ids);
      }

      if (!this.pre_order_url) {
        this.order_other_json.cart_ids = _cart_ids.join(',');
        this.pre_order_url = "plugin.overseas.frontend.cart-buy";
      }

      if (!this.order_url) {
        this.order_url = "plugin.overseas.frontend.order.create";
      }

      if (this.default_deduction != 0) {
        // 默认积分抵扣
        this.order_other_json.no_deduction_ids = this.default_deduction;
      }
      return Object.assign(json, this.order_other_json);
    },

    newRetailApi(states) {
      let state = Number(states);
      //新零售 0-自由零售 1-成为代理商订单 2-自由发货 3-线上零售 4-进货订单 5-销售代理套餐订单c
      if (state == 0) {
        return "plugin.new-retail.frontend.order.ordinaryPay";
      } else if (state == 1) {
        return "plugin.new-retail.frontend.order.purchaseRetailGoods";
      } else if (state == 2) {
        return "plugin.new-retail.frontend.order.freeSend";
      } else if (state == 3) {
        return "plugin.new-retail.frontend.order.retailCodePay";
      } else if (state == 4) {
        return "plugin.new-retail.frontend.order.purchaseStock";
      } else if (state == 5) {
        return "plugin.new-retail.frontend.order.retailCodePay";
      }
    },
    setPhotoNum() {
      //设置相册上传数量，当接口返回result==1时，即当前商品设置了独立的相册数量设置；返回result==0时，即采用插件设置的公共限制数量
      let that = this;
      $http.get("plugin.photo-order.api.photo-goods.getPhotoGoods", { goods_id: that.$route.query.goodsId }, "").then(response => {
        if (response.result == 1) {
          let _max = response.data.goods_max_photo;
          let _min = response.data.goods_min_photo;
          if (_max != 0 && _max >= _min) {
            that.max_count = _max;
          } else {
            that.max_count =
              Number(_min) >= Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_max_pohot)
                ? _min
                : Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_max_pohot);
          }
          that.min_count = _min ? _min : Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot);
          console.log("独立的相册数量设置", that.max_count, that.min_count);
        } else {
          that.max_count = Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_max_pohot); //最大上传张数
          that.min_count = Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot)
            ? Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot)
            : 1; //最小上传张数
          console.log("公共限制数量", that.max_count, that.min_count);
        }
        if (!that.max_count) {
          that.isPhoto = false;
          console.log("没有设置相册最大上传张数，关闭相册上传");
        }
      });
    },
    //获取当前位置信息，用于提交订单
    getCurrentOrderLocation() {
      return new Promise((resolve, reject) => {
        Toast.loading({
          message: "获取位置信息",
          forbidClick: true
        });
        let myLocation = JSON.parse(localStorage.getItem("myLocation"));
        if (myLocation && myLocation.addressComponent) {
          Toast.clear();
          resolve({
            positioning_success: 1,
            province: myLocation.addressComponent.province,
            city: myLocation.addressComponent.city
          });
        } else {
          let mapObj = new AMap.Map("iCenter");
          mapObj.plugin("AMap.Geolocation", () => {
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认:true
              timeout: 10000, // 超过10秒后停止定位，默认：无穷大
              maximumAge: 0, // 定位结果缓存0毫秒，默认：0
              convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
              showButton: true, // 显示定位按钮，默认：true
              buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
              buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
              showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
              panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
              zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapObj.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, "complete", obj => {
              Toast.clear();
              //console.log("执行1");
              if (obj.addressComponent) {
                resolve({
                  positioning_success: 1,
                  province: obj.addressComponent.province,
                  city: obj.addressComponent.city
                });
              } else {
                resolve({
                  positioning_success: 0,
                  province: "",
                  city: ""
                });
              }
            }); // 返回定位信息
            AMap.event.addListener(geolocation, "error", () => {
              Toast.clear();
              //console.log("执行2");
              resolve({
                positioning_success: 0,
                province: "",
                city: ""
              });
            }); // 返回定位出错信息
          });
        }
      });
    },

    // 整合了发票、是否显示个人信息接口
    getParams(cart_ids) {
      let json = {};
      if (this.root_tag == "store" && !cart_ids) {
        return;
      } else if (this.root_tag == "store" && cart_ids) {
        _cart_ids = cart_ids;
      }
      if (cart_ids && this.$route.query.cart_ids && this.$route.query.cart_ids.split) {
        _cart_ids = this.$route.query.cart_ids.split(",");
      }
      let good_ids = [];

      if (this.isCartsOrder) {
        // 购物车商品下单的循环商品
        for (let j = 0; j < this.goodsInfo.orders.length; j++) {
          for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
            good_ids.push(this.goodsInfo.orders[j].order_goods[i].goods_id);
          }
        }
        if (this.fun.isTextEmpty(good_ids)) {
          // 为空跳回
          this.$router.go(-1);
          return;
        }
      } else {
        _goodsId = this.$route.query.goodsId;
        good_ids.push(_goodsId);
      }
      json = {
        goods_ids: JSON.stringify(good_ids)
      };
      $http
        .get("from.div-from.get-params", json, " ")
        .then(
          response => {
            if (response.result === 1) {
              if (this.$route.query.orderType != "groupBuy_open" || this.$route.query.orderType != "groupBuy_join") {
                this.isGetAgreementPay = true;
                // 获取是否显示支付协议
                this.AgreementPay = response.data.getPayProtocol;
              }
              //运费说明
              this.freightExplain = response.data.freightExplain;
              try {
                this.openCueCoupon = response.data.getCouponSet == 0 ? false : true; //是否开启下单优惠券提示
                this.checkTaxGoods(response.data.isDisplay);
                if (response.data.getMemberInfo) this.getMemberInfo(response.data.getMemberInfo);
                // if (response.data.explain) this.getExplain(response.data.explain);

                this.getInvoice(response.data.sinvoice);
                this.storeSearchBtn = response.data.storeSearch || {};
              } catch (error) {
                console.log(error);
              }
            } else {
              this.isGetAgreementPay = false;
            }
          },
          response => {
            this.isGetAgreementPay = false;
            console.log(response);
          }
        )
        .catch(err => {
          this.isGetAgreementPay = false;
          console.log(err);
        });
    },

    //是否海外商品
    checkTaxGoods(data) {
      if (data.status) {
        this.isTaxGoods = true;
        // 显示个人信息
        this.showMyinfo = data.status;
      } else {
        this.isTaxGoods = false;
        // 隐藏个人信息
        this.showMyinfo = false;
      }
    },

    // 配置用户信息
    getMemberInfo(data) {
      // 个人信息
      this.myRealname = data.realname;
      this.myIdcard = data.idcard;
    },

    // getExplain(data) {
    //   this.explain_title = data.explain_title;
    //   this.explain_content = data.explain_content;
    // },

    // 发票数据
    getInvoice(data) {
      console.log(data);

     // this.$refs.invoicePop.initData(data);
       this.invoiceData.papery_status = parseInt(data.invoice.papery);
       this.invoiceData.electron_status = parseInt(data.invoice.electron);
       if (!this.invoiceData.papery_status && !this.invoiceData.electron_status) {
	       this.isShowInvoice = false;
       }
    },
    subInvoice(data) {
      // 弹窗获取发票数据
      this.invoice_list = data;
      //alert(this.invoice_list.invoice_status);
    },

    // 直接购买
    getDataActionBuy(is_exchange) {
      let that = this;
      let json = {
        goods_id: _goodsId,
        total: _total,
        option_id: _optionsId,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: encodeURIComponent(JSON.stringify(currentAddress)), //encodeURIComponent为了解决地址#号问题
        dispatch_type_id: this.selected,
        mark: this.$route.query.mark ? this.$route.query.mark : 0
      };

      //自提点开启
      if (this.selected == "8") {
        json.package_deliver_id = this.defaultSelfCarry.id;
      }
      if (this.selected == "12") {
        // 门店自提点
        json.package_deliver_id = this.o2oSelfCarry.id;
      }

      if (this.root_tag == "fromExchange") {
        //兑换中心商品
        let _exchangeData = this.$route.query.exchangeData;
        if (this.fun.isTextEmpty(_exchangeData)) {
          // 为空跳回
          this.$router.go(-1);
          return;
        }
        json.data = _exchangeData;
        json.is_exchange = is_exchange == 0 ? 0 : 1;
      }

      json = this.handleDataActionBuyUrl(json);
      console.log(json);
      if (this.$route.query.orderType == "newRetail" && this.$route.query.retail_state == 2) {
        json.goods = JSON.parse(this.$route.query.goods) || []; // 自由发货
      }

      if (this.good_clicktag === 0) {
        this.good_clicktag = 1;
        $http.post(this.pre_order_url, json, "生成中").then(
          response => {
            // resule有return操作没有执行这段
            setTimeout(() => {
              that.good_clicktag = 0;
            }, 1000);
            if (response.result === 1) {
              if (this.$route.query.tag == "reserve") {
                // 门店预约商品
                if (response.data.reserve_date) {
                  that.reserveDate = response.data.reserve_date.date;
                }
                if (response.data.reserve_deduction) {
                  that.reserve_deduction = response.data.reserve_deduction;
                }
                if (response.data.reserve_deduction_love) {
                  that.reserve_deduction_love = response.data.reserve_deduction_love;
                }
              }
              if (that.$route.query.orderType == "groupBuy_open" || that.$route.query.orderType == "groupBuy_join") {
                //拼购支付协议
                that.isGetAgreementPay = true;
                that.AgreementPay = that.goodsInfo.together_purchase_agreement;
              }
              that.goodsInfo = response.data;
              that.cup_notice = true;
              that.setViewData(response.data); // 设置界面
              if (this.root_tag == "fromExchange") {
                that.defaultSelectCoupon(response.data.discount.member_coupons); // 设置默认优惠券信息
              } else {
                this.initCoupon(response.data.discount); // 设置优惠券信息
              }
            } else {
              that.cup_notice = true;
              this.$dialog
                .confirm({ message: response.msg })
                .then(() => {
                  if (!response.data.login_status) {
                    // 非跳转登录页才返回上一页
                    let _ReturnUrl = this.$store.state.orderErrReturnUrl;
                    if (_ReturnUrl) {
                      window.location.href = _ReturnUrl;
                      return;
                    }
                    this.$router.go(-1);
                  }
                })
                .catch(() => {
                  this.$router.go(-1);
                });
            }
          },
          response => {
            console.log(response);
          }
        );
      }
    },

    // 购物车结算
    getDataActionCart() {
      let that = this;
      let json = {
        cart_ids: _cart_ids.toString() || [], // 预下单的购物车id是用，逗号拼接的字符串
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: encodeURIComponent(JSON.stringify(currentAddress)),
        dispatch_type_id: this.selected
      };

      //自提点开启
      if (this.selected == "8") {
        json.package_deliver_id = this.defaultSelfCarry.id;
      }
      if (this.selected == "12") {
        // 门店自提点
        json.package_deliver_id = this.o2oSelfCarry.id;
      }

      json = this.handleDataActionCartUrl(json);

      $http.get(this.pre_order_url, json, "生成中").then(
        response => {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.cup_notice = true;
            that.setViewData(response.data); // 设置界面
            that.initCoupon(response.data.discount); // 设置优惠券信息
          } else {
            Toast(response.msg);
            that.$router.go(-1);
            that.cup_notice = true;
          }
        },
        response => {
          console.log(response);
        }
      );
    },

    // 获取门店数据
    initStore(str) {
      const that = this;
      this.recipient_name = "";
      this.recipient_mobile = "";
      $http.get("plugin.store-cashier.frontend.store.get-store-info.get-info-by-store-id", { store_id: this.store_id || this.$route.query.groupStoreID || this.$route.query.store_id }, " ").then(
        response => {
          if (response.result === 1) {
            that.store_info = response.data;
            that.recipient_name = response.data.store_carry.name;
            that.recipient_mobile = response.data.store_carry.number;
            if (str !== "is_activity" && !that.$route.query.groupStoreID) {
              // 门店拓客  门店预约 门店拼团不请求
              that.getDataActionStoreCart();
            }
            //开启门店配送  门店配送数据
            if (that.store_info.dispatch_type.indexOf("3") > -1 || that.store_info.dispatch_type.indexOf(3) > -1) {
              if (that.store_info.store_delivery && that.store_info.store_delivery.delivery_status == 1) {
                that.is_show_store_delivery = true;
              }

              if ((that.store_info.store_delivery && that.store_info.store_delivery.delivery_status == 1) || that.store_info.need_lat == 1) {
                that.is_open_store_delivery = true;
                that.delivery_amount = that.store_info.store_delivery ? that.store_info.store_delivery.delivery_amount : 0;
                that.delivery_note = that.store_info.store_delivery ? that.store_info.store_delivery.delivery_note : "";
                that.delivery_note = that.delivery_note.replace(/\n|\r/g, "<br/>"); //文本域换行处理
                let delivery_area = that.store_info.store_delivery && that.store_info.store_delivery.delivery_area ? that.store_info.store_delivery.delivery_area || [] : [];
                let locations = that.store_info.store_delivery ? that.store_info.store_delivery.locations : {};
                let arr_delivery_area = [];
                delivery_area.forEach((item, index) => {
                  arr_delivery_area.push([Number(item.R), Number(item.Q)]);
                });
                that.delivery_area = arr_delivery_area;
                that.locations = [Number(locations.longitude).toFixed(6), Number(locations.latitude).toFixed(6)];
              }
            }
          } else {
            Toast(response.msg);
            that.$router.go(-1);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    //门店过期商品下单
    getCashGood() {
      $http.get("plugin.store-cashier.frontend.store.enter.getSetGoodsId", {}, "").then(
        response => {
          if (response.result === 1) {
            this.goods_id = response.data.goods_id;
            if (!response.data.store) {
              _goodsId = this.goods_id;
              this.root_tag = "-2";
              this.store_id = 0;
              this.getDataActionBuy();
            } else {
              this.root_tag = "store";

              this.store_info = response.data.store;
              this.store_id = this.store_info.id || this.store_info.store_id;
              this.getDataActionStoreCart();
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    // 门店购物车商品
    getDataActionStoreCart() {
      if (!this.store_id) {
        return;
      }
      if (this.storeCarts.length > 0) {
        // 已经有storeCarts就不重复请求了
        this.cup_notice = true;
        this.getStoreCartBuy(this.storeCarts);
        return;
      }
      let that = this;
      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.index",
          {
            store_id: this.store_id
          },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              that.cup_notice = true;
              that.storeCarts = [];
              response.data.forEach(item => {
                that.storeCarts.push(item.id);
              });
              // 在setViewData的时候调用了 暂时注释
              // if (!that.isGetAgreementPay) {
              //   that.getParams(that.storeCarts);
              // }

              //第请求接口获取配送方式后，取默认第一个的dispatch_type_id再请求预下单接口;  挂单POrder走固定的配送方式
              this.getDispatchMethod(that.storeCarts.toString());
              if (JSON.parse(window.localStorage.getItem("globalParameter")).is_open_photo_order == "1" && that.storeCarts.length == 1) {
                //门店商品仅单个商品下单才可进行上传相册,多个商品购物车结算不开启
                console.log("开启相册上传模块");
                that.isPhoto = true; //开启相册上传模块
                that.$nextTick(() => {
                  that.$refs.yzUploader.initData();
                });
                that.max_count = Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_max_pohot); //最大上传张数
                that.min_count = Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot)
                  ? Number(JSON.parse(window.localStorage.getItem("globalParameter")).photo_order_min_pohot)
                  : 1; //最小上传张数
              } else if (JSON.parse(window.localStorage.getItem("globalParameter")).is_open_photo_order == "1") {
                that.storeNo_photo = true;
              }
            } else {
              that.cup_notice = true;
              alert("无商品");
            }
          },
          response => {}
        );
    },
    // 门店结算
    getStoreCartBuy(cart_ids) {
      let that = this;
      let json = {
        cart_ids: cart_ids,
        store_id: this.store_id,
        dispatch_type_id: this.selected,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: encodeURIComponent(JSON.stringify(currentAddress))
      };
      $http.get("plugin.store-cashier.frontend.store.cart-buy", json, "生成中").then(
        response => {
          if (response.result === 1) {
            that.goodsInfo = response.data;
            that.setViewData(response.data, cart_ids); // 设置界面
            that.initCoupon(response.data.discount); // 设置优惠券信息
          } else {
            // 编辑地址时不提示错误信息
            if (that.showAddress) {
              return;
            }
            if (response.msg === "请完善地址经纬度信息") {
              // 门店配送提示不能返回上一页 #62588
              this.show_address = false;
              that.$dialog.alert({ message: "请完善收件人的地址经纬度信息" });
            } else {
              that.$dialog.alert({ message: response.msg }).then(() => {
                if (response.msg.indexOf("配送范围") < 0) {
                  that.$router.go(-1);
                }
              });
            }
          }
        },
        response => {
          console.log(response);
        }
      );
    },

    // 租赁购物车结算
    getRentDataActionCart(right, rent) {
      let that = this;
      let json = {
        lease_rights: right,
        lease_term: rent,
        member_coupon_ids: this.assembleCoupons(),
        orders: JSON.stringify(this.assembleDeduction()),
        address: encodeURIComponent(JSON.stringify(currentAddress)),
        dispatch_type_id: this.selected,
        mark: this.$route.query.mark ? this.$route.query.mark : 0
      };

      //自提点开启
      if (this.selected == "8") {
        json.package_deliver_id = this.defaultSelfCarry.id;
      }
      if (this.selected == "12") {
        // 门店自提点
        json.package_deliver_id = this.o2oSelfCarry.id;
      }

      if (this.root_tag == "rentCartBuy") {
        json.cart_ids = _cart_ids.toString();

        $http.get("plugin.lease-toy.api.order.cart-buy", json, "生成中").then(
          response => {
            if (response.result == 1) {
              that.goodsInfo = response.data;
              that.cup_notice = true;
              that.setViewData(response.data); // 设置界面
              that.initCoupon(response.data.discount); // 设置优惠券信息
            } else {
              that.cup_notice = true;
              Toast(response.msg);
              that.$router.go(-1);
            }
          },
          response => {
            console.log(response);
          }
        );
      } else if (this.root_tag == "rentBuy") {
        json.goods_id = _goodsId;
        json.total = _total;
        json.option_id = _optionsId;

        $http.get("plugin.lease-toy.api.order.goods-buy", json, "生成中").then(
          response => {
            if (response.result == 1) {
              that.goodsInfo = response.data;
              that.cup_notice = true;
              that.setViewData(response.data); // 设置界面
              that.initCoupon(response.data.discount); // 设置优惠券信息
            } else {
              that.cup_notice = true;
              Toast(response.msg);
              that.$router.go(-1);
            }
          },
          response => {
            console.log(response);
          }
        );
      }
    },
    // 获取租期列表
    getRentTimeList() {
      $http
        .get("plugin.lease-toy.api.lease-term.index", {})
        .then(response => {
          if (response.result == 1) {
            this.rentTime = response.data.list;
            this.rentFree = response.data.level.rent_free;
            this.agreeCon = response.data.lease_toy_set;
            this.rent_deposit_free = response.data.level.deposit_free;
            this.rent_free = response.data.level.rent_free;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //租赁商品预下单
    rentGoodBuy() {
      if (this.isOpenRight) {
        this.getRentDataActionCart(window.localStorage.getItem("rentTimeRight"), []);
      } else {
        if (this.currentIndex == "999") {
          if (!this.fun.isTextEmpty(window.localStorage.getItem("rentTimeSelf"))) {
            let val = window.localStorage.getItem("rentTimeSelf");
            this.getRentDataActionCart([], val);
          } else {
            this.getRentDataActionCart([], []);
          }
        } else {
          if (!this.fun.isTextEmpty(window.localStorage.getItem("rentTimeChoose"))) {
            let param = window.localStorage.getItem("rentTimeChoose");
            this.getRentDataActionCart([], param);
          }
        }
      }
    },

    //获取批发区下单页类型判断--挂单
    getPendingOrder_type() {
      if (this.selected == 1) {
        this.getDataActionBuy();
        return;
      }
      //挂单不适合配送方式
      $http
        .get("plugin.pending-order.frontend.wholesale-area.pending-order-type", {}, "")
        .then(response => {
          if (response.result == 1) {
            if (response.data.status == 0) {
              this.dispatch = [
                { name: "零售", dispatch_type_id: 0 },
                { name: "自用", dispatch_type_id: 1 }
              ];
              this.selected = 0;
            } else {
              this.dispatch = [{ name: "自用", dispatch_type_id: 1 }];
              this.selected = 1;
            }
            this.getDataActionBuy(); // 直接购买
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 应用市场判断域名
    getOrderDomain(_data) {
      for (let j = 0; j < _data.length; j++) {
        if (_data[j].plugin_id === 58) {
          this.plugin_id = 58;
        }
        if (_data[j].domain !== undefined) {
          // 是否应用市场产品的商品
          this.show_domain = true;
        }
      }
      //判断有订单是否有绑定域名  有则取第一个
      //return 已绑定域名
      for (let j = 0; j < _data.length; j++) {
        if (_data[j].domain) {
          console.log("已绑定域名");
          return _data[j].domain;
        }
      }
      return "";
    },
    // 判断是否需要地址
    isOrderAddress_M(_data) {
      //判断是否有订单需要填写地址，有一单需要填写地址则需要填写地址才可以下单
      //return false 提交订单需要填写地址
      for (let j = 0; j < _data.length; j++) {
        if (this.phone_bill_pro_goods) {
          if (!_data[j].not_show_address) {
            // console.log("有订单需要填写地址");
            return false;
          }
        } else if(this.oil_account && this.oil_mobile) {
          if (!_data[j].not_show_address) {
            // console.log("有订单需要填写地址");
            return false;
          }
        } else {
          if (!_data[j].need_address) {
            console.log("有订单需要填写地址");
            return false;
          }
        }
      }
      return true;
    },
    // 设置界面
    setViewData(data, cart_ids) {
      if (data.discount && data.discount.default_deduction && data.discount.default_deduction != 0) {
        // 获取第一次接口默认积分抵扣
        this.default_deduction = data.discount.default_deduction;
      }
      // if (this.$route.query.myinfo) {
      //   // 如果是修改信息页面回来就重新请求
      //   this.getParams_status = false;
      // }
      if (!this.getParams_status) {
        this.getParams_status = true;
        this.getParams(cart_ids);
      }
      this.recommend_goods = data.dispatch.recommend_goods ? data.dispatch.recommend_goods : [];
      this.setAddressViewData(data.dispatch.default_member_address); // 设置地址界面
      this.consigneeName = data.dispatch.custom_data ? data.dispatch.custom_data.custom_consignee : '提货人姓名';
      this.consigneeMobile  = data.dispatch.custom_data ? data.dispatch.custom_data.custom_phone : '提货人手机';
      //判断是否有订单需要填写地址
      this.show_address = this.isOrderAddress_M(data.orders);
      if (data.is_agency_restock && data.is_agency_restock == 1) {
        this.show_address = true;
      }
      if (this.show_address) {
        this.selected = 0;
      }

      this.order_data = data.orders;
      let that = this;
      this.order_data.map(function(order,index){
        console.log(order.order_goods)
        that.favorable_rate[index] = Math.max(...order.order_goods.map(function(goods){
          console.log(goods)
          return goods.favorable_rate ?  goods.favorable_rate : 0;
        }));
      });
      //if (this.default_deduction != 0) { //#70842
      // 默认积分抵扣要获取order_deductions里checked=true的传给第二次接口
      for (let i = 0; i < this.order_data.length; i++) {
        let arr = this.order_data[i].order_deductions;
        if (this.order_data[i].order_deductions && !(this.order_data[i].order_deductions instanceof Array)) {
          arr = Object.values(this.order_data[i].order_deductions);
        }
        if (arr) {
          arr.map(item => {
            if (item.checked) {
              this.screenDiscount(this.order_data[i], item);
            }
          });
        }
      }
      // }

      this.good_clicktag = 0;
      this.service_fee_items = data.service_fee_items;
      // 处理提交表单后，点击积分抵扣和优惠券这些需要重新请求接口数据时，之前保存的表单id被覆盖问题
      if (!this.fun.isTextEmpty(this.oldOrder_data)) {
        for (let index = 0; index < this.goodsInfo.orders.length; index++) {
          this.goodsInfo.orders[index].order_goods = this.oldOrder_data.orders[index].order_goods;
        }
      }

      this.dispatch.forEach(items => {
        if (items.dispatch_type_id == 8) {
          console.log("有自提点配送方式，请求定位获取自提点列表");
          if (!this.$route.params.changeSelfCarry || this.fun.isTextEmpty(this.defaultSelfCarry.id)) {
            this.getLocation("shop");
          }
        }
        if (items.dispatch_type_id == 12) {
          console.log("有门店自提点配送方式，请求定位获取自提点列表", this.o2oSelfCarry);
          if (!this.o2oSelfCarry.id) {
            console.log("eeeeeeeeeeeeee");
            this.getLocation("o2o");
          }
        }
      });
      if(this.selected == 11){
        this.getDeliverySetting()
      }

      //判断有订单是否有绑定域名
      this.shop_domain = this.getOrderDomain(data.orders);
      this.findGoodOpen(); // 循环订单列表是否开启表单和慢充
      this.price = data.total_price; // 设置总价格（合计）
      this.total_items = data.amount_items;
      this.discount_amount_items = data.discount_amount_items;

      if (this.root_tag == "store" && this.price < 0) {
        this.$router.push(this.fun.getUrl("o2oHome"));
        this.$dialog.alert({ message: "下单错误" });
      }
    },
    // 设置地址界面
    setAddressViewData(model) {
      if (this.selected == "11") {
        if (!model.latitude || !model.longitude) {
          this.$dialog.alert({ message: "请重新编辑您的地址，在地图上选择您所在的位置" });
          return;
        }
      }
      if (model == undefined || model == "" || model == []) {
        return;
      }
      // 设置地址id
      currentAddId = model.id || model.address_id;
      currentAddress = model;
      this.realname = this.fun.isTextEmpty(model.username) ? "" : model.username;
      this.mobile = this.fun.isTextEmpty(model.mobile) ? "" : model.mobile;
      this.address = this.fun.isTextEmpty(model.province)
        ? ""
        : model.province + " " + model.city + " " + model.district + " " + (this.fun.isTextEmpty(model.street) ? "" : model.street + " ") + model.address;
      this.addressData = model;
    },

    // 选择地址后重新计算数据
    requestByAddress() {
      // 重新计算
      if (this.selected == "10") {
        // 定位
        this.fun
          .getLocation("正在定位")
          .then(res => {
            console.log(res);
            let ares = this.fun.bd_encrypt(res.point.lng, res.point.lat);
            this.supp_point.lng = ares.lng;
            this.supp_point.lat = ares.lat;
            this.supp_point.address = res.address;
          })
          .catch(err => {});
      }
      if (this.selected == "11") {
        this.is_open_store_delivery = true;
        this.getDeliverySetting();
      } else {
        this.handleBuy("1");
      }
    },

    //选择同城配送时请求
    getDeliverySetting() {
      // if(this.selected=="11"){
      //   if(!currentAddress.latitude || !currentAddress.longitude){
      //     this.$dialog.alert({ message: "请重新编辑您的地址，在地图上选择您所在的位置" });
      //   }
      // }
      if (this.cityDelivery != null) {
        this.handleBuy("1");
        return;
      }
      $http.get("plugin.city-delivery.frontend.order.getDeliverySetting", {}).then(res => {
        if (res.result === 1) {
          this.cityDelivery = res.data;
          this.locations = [Number(res.data.fence_setting.store_longitude).toFixed(6), Number(res.data.fence_setting.store_latitude).toFixed(6)];
          this.delivery_area = res.data.fence_setting.delivery_area;
          this.$refs.deliveryTime.setListData(res.data.time_setting, res.data.default_choose);
          this.order_data.forEach(item => {
            if (res.data.min_amount * 1 > item.goods_price * 1) {
              // *1 只是为了转数字类型
              this.yz_subscribe_disabled = true; //商品价格不够最低配送，按钮灰色不能提交
            }
          });
          if (!res.data.default_choose) {
            this.handleBuy("1");
          }
        }
      });
    },

    //显示地址pop
    showAddressFun() {
      // 获取收货地址
      this.yzAddressListOptions = {
        is_open_store_delivery: this.is_open_store_delivery,
        selected: this.selected
      };
      this.addressList_caller = "express";
      this.showAddress = true;
    },
    //发票插件显示地址
    invoiceShowAddressFun(){
      this.yzAddressListOptions = {
        is_open_store_delivery: this.is_open_store_delivery,
        selected: this.selected
      };
      this.addressList_caller = "invoice";
      this.showAddress = true;
    },
    // 增加/修改地址
    confirmSelectAddress(item) {
      if(this.addressList_caller == "express"){
        this.setAddressViewData(item);
        this.requestByAddress(); // 选择地址后重新计算
        this.showAddress = false;
      }else if(this.addressList_caller == "invoice"){
        this.$refs.invoicePop.setAddress(item);
        this.showAddress = false;
      }
      this.addressData = item;
    },

    // 检查配送方式数据
    checkDispatch() {
      //渠道商订货补货不需要填写地址
      let isNeedAddress = !(this.$route.query.tag == "channel" || this.$route.query.tag == "channel_Replenishment" || this.$route.query.tag == "channel_TCOrder" || this.$route.query.tag == "timeAppoint");

      if (this.selected == "8" || this.selected == "12" || this.selected == "15") {
        if (this.fun.isTextEmpty(this.distributionUserName)) {
          Toast("请填写提货人姓名");
          this.submit_active = true;
          return false;
        }
        if (this.fun.isTextEmpty(this.distributionUserMobile)) {
          Toast("请输入提货人手机");
          this.submit_active = true;
          return false;
        }
      }

      if (this.selected == "8" || this.selected == "12") {
        if ((this.selected == "8" && !this.defaultSelfCarry.id) || (this.selected == "12" && !this.o2oSelfCarry.id)) {
          Toast("请选择自提点");
          this.submit_active = true;
          return false;
        }
        this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
      }

      if (this.selected == "2" && this.store_info.delivery_information == 1) {
        if (this.fun.isTextEmpty(this.linkinfo.name) || this.fun.isTextEmpty(this.linkinfo.mobile)) {
          Toast("请输入提货人信息");
          this.submit_active = true;
          return false;
        } else {
          this.save_ztd_LocalStorage(this.linkinfo.name, this.linkinfo.mobile);
        }
      }

      if (this.selected == "2" && this.fun.isMoblie(this.linkinfo.mobile)) {
        this.$dialog.alert({ message: "请输入正确的手机号" });
        this.submit_active = true;
        return false;
      }
      console.log(this.show_address,isNeedAddress)
      if (!this.show_address && (this.selected == "0" || this.selected == "1" || this.selected == "3") && isNeedAddress && !this.ele_no_showAdress) {
        if (this.fun.isTextEmpty(currentAddId)) {
          Toast("请选择收货地址");
          this.submit_active = true;
          return false;
        }
      }

      return true;
    },
    // 检查提交数据
    checkSubmit() {
      if(this.$route.query.tag == 'timeAppoint'){
        if(this.fun.isTextEmpty(this.reserve_order.customer_name)){
          Toast("请填写联系人");
          return false;
        }
        if(this.fun.isTextEmpty(this.reserve_order.customer_tel)){
          Toast("请填写联系电话");
          return false;
        }
      }
      if (this.isPhoto) {
        //相册模块开启下单时判断 是否符合条件
        if (this.fileList1.length < this.min_count) {
          this.$dialog.alert({ message: `上传图片张数不应少于${this.min_count}张` });
          return false;
        }
      }
      if (this.mustSelectCoupon()) {
        // 提示优惠券【51723】
        return false;
      }
      if (this.cpsType == "1" && this.cpsTxt == "") {
        Toast("请输入帐号");
        return false;
      }

      if (this.camilo_resources_coupon_type == 1) {
        // 卡券商品
        if(!this.recharge_number){
          Toast("请输入充值账号");
          return false;
        }
      }

      if (this.$route.query.orderType == "newRetail" && this.$route.query.retail_state == 3 && this.price == 0) {
        //新零售-自由发货下单不能为0
        Toast("价格有误");
        return false;
      }

      if (this.isAllDFOk()) {
        Toast("请填写表单！");
        this.submit_active = true;
        return false;
      }

      // 手机慢充
      if (this.show_recharge_mobile && !this.recharge_mobile) {
        Toast("请输入充值手机号码！");
        this.submit_active = true;
        return false;
      } else if (this.show_recharge_mobile && this.recharge_mobile) {
        let reg_txt = /^[1][0-9]{10}$/;
        if (!reg_txt.test(this.recharge_mobile)) {
          Toast("请输入正确的充值手机号码！");
          this.submit_active = true;
          return false;
        }
      }

      if (this.show_domain && !this.shop_domain) {
        Toast("请先新增/绑定站点");
        this.submit_active = true;
        return false;
      }

      if (!this.checkDispatch()) {
        return false;
      }

      if (this.AgreementPay && !this.isRent) {
        if (!this.agreementPay) {
          Toast("请勾选支付协议");
          this.submit_active = true;
          return false;
        }
      }

      if (this.isRent && !this.agreement) {
        Toast("请勾选租赁协议");
        this.submit_active = true;
        return false;
      }

      return true;
    },
    // 上门安装
    isHasInstall() {
      //判断是否有勾选了上门安装服务
      for (let j = 0; j < this.service_fee_items.length; j++) {
        if (this.service_fee_items[j].code == "liveInstall") {
          return true;
        }
      }
      return false;
    },
    // 检查上门安装数据
    checkInstall() {
      //有勾选了上门安装服务，需要填写经纬度和时间
      if (!this.installDate) {
        Toast("请选择预约时间！");
        return false;
      }
      if (!this.location || !this.location.point || !this.location.point.lat) {
        Toast("请选择地理位置！");
        return false;
      }
      if (this.fun.isMoblie(this.linkinfo.mobile)) {
        this.$dialog.alert({ message: "请输入正确的手机号" });
        return false;
      }

      return true;
    },
    // 统一商品提交订单
    submit() {
      // 没有认证
      if (!this.isAuthed) {
        this.$dialog.confirm({ message: "购买跨境商品,请补充您的个人信息" }).then(() => {
          this.$refs.realnameAuth.openEdit();
        }).catch(() => {});
        return;
      }

      if (this.yz_subscribe_disabled) return;

      if (!this.goodsInfo.orders) {
        return;
      }

      if (!this.checkSubmit()) {
        return;
      }

      let json = this.assembleJson();
      if (this.store_id && this.$route.query.tag != "reserve") {
        // 门店下单
        if (this.isHasInstall()) {
          //有勾选了上门安装服务，需要填写经纬度和时间
          if (!this.checkInstall) {
            return;
          }
          let live_install_json = {
            live_install: {
              longitude: this.location.point.lng,
              latitude: this.location.point.lat,
              reserve_time: this.fun.getTimestamp(this.installDate),
              install_comment: this.install_comment
            }
          };
          Object.assign(json, live_install_json);
        }

        this.order_url = "plugin.store-cashier.frontend.store.create";
      }

      if (this.selected == "10") {
        if (json.supplier_driver_distribution_address) {
          if (this.fun.isTextEmpty(json.supplier_driver_distribution_address.lat) || this.fun.isTextEmpty(json.supplier_driver_distribution_address.lng)) {
            Toast("请选择供应商配送定位");
            return;
          }
        }
      }
      if (this.selected == "11") {
        // selected == "11" 同城配送
        if (this.cityDelivery.distance_type == 3) {
          if (!this.cityDelivery_community.id) {
            Toast("请选择配送社区");
            return;
          }
          json.community_id = this.cityDelivery_community.id;
        }
        if (this.cityDelivery.future_state == 1) {
          if (!this.cityDelivery_deliveryTime.start_time || !this.cityDelivery_deliveryTime.end_time) {
            Toast("请选择配送时间");
            return;
          }
          json.expect_start_time = this.cityDelivery_deliveryTime.start_time;
          json.expect_end_time = this.cityDelivery_deliveryTime.end_time;
        }
      }
      //console.log("state===res", this.submit_active);
      if (this.submit_active == true) {
        this.submit_active = false;

        if (this.clicktag === 0) {
          this.clicktag = 1;
          var that = this;

          // console.log("我执行了吗",json);
          $http
            .post(this.order_url, json, "提交中")
            .then(
              response => {
                if (response.result === 1) {
                  this.deleteAddressData();
                  if (this.isRent) {
                    this.clearStorage();
                  }

                  let orderJson = {
                    status: "2",
                    order_ids: response.data.order_ids
                  };
                  if (this.store_id && this.$route.query.tag == "store") {
                    orderJson.store_id = this.store_id;
                  }
                  if (this.is_cps) {
                    // 聚合cps商品下单
                    orderJson.iscps = true;
                  }
                  if (this.fun.isCPS()) {
                    if (this.fun.isIosOrAndroid() === "ios") {
                      toGoodBuyIOS({ body: "toGoodBuyIOS" });
                    }
                  }
                  //console.log('从这里开始下单');
                  //console.log('地址'+encodeURIComponent(JSON.stringify(currentAddress)));
                  var assembleGoodsArr = this.assembleGoods();
                  for(let i=0;i<assembleGoodsArr.length;i++){
                    $http.get("goods.goods.getGoodsName", {goods_id:assembleGoodsArr[i].goods_id}, " ").then(
                      res => {
                        //console.log('用户ID:'+res.data.uid);
                        zhuge.track('提交订单',{
                          '商品ID': ''+assembleGoodsArr[i].goods_id,
                          '购买数量':assembleGoodsArr[i].total,
                          '用户ID':''+res.data.uid,
                          '用户昵称':res.data.nickname,
                          '商品名称':res.data.title
                        });
                    });

                  }

                  this.$router.replace(this.fun.getUrl("orderpay", orderJson));
                } else {
                   //console.log('从这里开始下单2');
                  if(response.data.should_confirm !== undefined && response.data.should_confirm){
                    that.$dialog.alert({
                      title: '额度提醒',
                      message:response.msg
                    })
                      .then(() => {
                        that.submit_active = true;
                        that.clicktag = 0;
                        that.ignoreNotice = true;
                        that.submit();
                        // on confirm
                      })
                      .catch(() => {
                        this.submit_active = true;
                        this.clicktag = 0;
                        // on cancel
                      });
                    return;
                  }
                  Toast(response.msg);
                  this.submit_active = true;
                  this.pre_order_url = '';
                  this.clicktag = 0;
                }
              },
              response => {
                this.submit_active = true;
                console.log(response);
              }
            )
            .catch(err => {
              this.submit_active = true;
              console.log(err);
            });
        }
      }
    },

    //删除那个区域代理的地址id
    deleteAddressData() {
      window.localStorage.removeItem("level");
      window.localStorage.removeItem("province_id");
      window.localStorage.removeItem("city_id");
      window.localStorage.removeItem("district_id");
      window.localStorage.removeItem("street_id");
    },

    // 组装json数据
    assembleJson() {
      let json = {
        //公共数据
        address: encodeURIComponent(JSON.stringify(currentAddress)),
        goods: JSON.stringify(this.assembleGoods()),
        member_coupon_ids: JSON.stringify(this.assembleCoupons()),
        orders: JSON.stringify(this.assembleDeduction()),
        // 发票
        invoice_type: this.invoice_list.invoice_type,
        rise_type: this.invoice_list.invoice_status,
        call: this.invoice_list.call,
        // email: this.invoice_list.email,
        // company_number: this.invoice_list.company_number,
        //新的发票-发票插件
        //invoice:this.invoice_list,
	      phone: this.invoice_list.phone,
        company_number: this.invoice_list.company_number,
        invoice_content:"商品明细",
        mark: this.$route.query.mark || 0,
        dispatch_type_id: this.selected, //配送方式 ，1：快递 ||2：门店自提||3：门店配送（送货上门）||8：自提点
        ignore_notice: this.ignoreNotice //忽略超额提醒
      };
      // 分销活动页面购买的商品，带活动id
      if (this.$route.query.activity_id) {
        json.activity_id = this.$route.query.activity_id;
      }

      if (this.$store.state.liveRoomID) {
        json.room_id = this.$store.state.liveRoomID;
      }

      if (this.hasGoodOpenDF) {
        //有商品开启自定义表单
        console.log("有商品开启自定义表单");
        json.order_goods = JSON.stringify(this.assembleGoodsDFData());
      }

      if (this.show_recharge_mobile) {
        //有商品开启话费慢充
        console.log("有商品开启话费慢充");
        json.order_goods = JSON.stringify(this.assembleGoodsTELData());
      }
      if (this.$route.query.electricity == "electricity") {
        json.order_goods = JSON.stringify(this.assembleGoodsTELData());
      }

      //油卡充值
      if(this.oil_account && this.oil_mobile){
        json.order_goods = JSON.stringify(this.assembleGoodsTELData());
      }

      if (this.cpsType == "1") {
        // 直冲需要填写帐号
        json.recharge_number = this.cpsTxt;
      }

      if (this.camilo_resources_coupon_type == 1) {
        // 直冲需要填写帐号
        json.recharge_number = this.recharge_number;
      }

      json = this.handleDataActionBuyUrl(json, "order");
      json = this.handleDataActionCartUrl(json, "order");

      if (this.root_tag == "store") {
        json.store_id = this.store_id;
        json.mobile = this.linkinfo.mobile;
        json.realname = this.linkinfo.name;
        json.cart_ids = JSON.stringify(this.storeCarts);
      } else if (this.root_tag == "rentCartBuy" || this.root_tag == "rentBuy") {
        let right = window.localStorage.getItem("rentTimeRight");
        let choose = window.localStorage.getItem("rentTimeChoose");
        let self = window.localStorage.getItem("rentTimeSelf");
        let lease_term = {};

        if (!this.fun.isTextEmpty(choose)) {
          lease_term = choose;
        } else if (!this.fun.isTextEmpty(self)) {
          lease_term = self;
        }

        json.lease_rights = this.fun.isTextEmpty(right) == null ? [] : right;
        json.lease_term = lease_term;
        json.cart_ids = JSON.stringify(_cart_ids);
      }

      if (this.isPhoto) {
        //相册参数
        json.thumbs = this.fileList1;
        json.is_open_photo_order = 1;
      }

      if (this.selected == "8" || this.selected == "12" || this.selected == "15") {
        json.realname = this.distributionUserName;
        json.mobile = this.distributionUserMobile;
      }

      if (this.selected == "8" || this.selected == "12") {
        // 自提点
        json.package_deliver_id = this.selected == "8" ? this.defaultSelfCarry.id : this.o2oSelfCarry.id;
        delete json.address;
      }

      if (this.selected == "10") {
        json.supplier_driver_distribution_address = this.supp_point;
      }
      if (this.selected == "2") {
        json.mobile = this.linkinfo.mobile;
        json.realname = this.linkinfo.name;

        if(this.root_tag === 'o2oDeposit') {
          // 门店定金  后端需要把门店的地址给传过去 #86280
          currentAddId = 1; //地址没有id  写死一个
          let arr = this.store_info.store_address.split(' ');
          this.setAddressViewData({
            province: arr[0],
            city: arr[1],
            district: arr[2],
            street: arr[3],
            address: arr[4],
            mobile: this.store_info.store_mobile,
            username: this.store_info.store_name
          });
          json.address= encodeURIComponent(JSON.stringify(currentAddress));
          // 设置地址界面
        }
      }
      if (this.selected == "3") {
        json.mobile = this.store_info.store_mobile;
        json.realname = this.store_info.store_name;
      }

      Object.assign(json, this.orderLocationObj); // 定位信息
      return json;
    },
    // 组装商品信息
    assembleGoods() {
      let newGoods = [];

      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          let model = {};
          model.goods_id = this.goodsInfo.orders[j].order_goods[i].goods_id;
          model.total = this.goodsInfo.orders[j].order_goods[i].total;
          model.option_id = this.goodsInfo.orders[j].order_goods[i].goods_option_id;
          model.is_gift = this.goodsInfo.orders[j].order_goods[i].is_gift;
          model.gift_price = this.goodsInfo.orders[j].order_goods[i].gift_price;
          model.marketing_id = this.goodsInfo.orders[j].order_goods[i].member_cart.marketing_id;
          newGoods.push(model);
        }
      }
      return newGoods;
    },
    assembleGoodsDFData() {
      //组装商品自定义表单信息
      let newGoodsDF = [];
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          if (this.goodsInfo.orders[j].order_goods[i].diy_form) {
            let modelDF = {};
            modelDF.pre_id = this.goodsInfo.orders[j].order_goods[i].pre_id;
            modelDF.diyform_data_id = this.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id;
            newGoodsDF.push(modelDF);
          }
        }
      }
      return newGoodsDF;
    },
    assembleGoodsTELData() {
      //组装商品话费慢充信息
      let newGoodsDF = [];
      let modelDF = {};
      if (this.$route.query.electricity == "electricity") {
        modelDF.pre_id = this.electricity_Guide;
        modelDF.account_id = this.$route.query.account_id;
      } else if(this.oil_account && this.oil_mobile){   //油卡充值
        modelDF.pre_id = this.oil_pre_id;
        modelDF.account = this.oil_account;
        modelDF.mobile = this.oil_mobile;
      } else {
        modelDF.pre_id = this.show_recharge_mobile;
        modelDF.mobile = this.recharge_mobile;
      }
      newGoodsDF.push(modelDF);
      return newGoodsDF;
    },
    // 组装优惠券json信息
    assembleCoupons() {
      let coupons = [];
      // console.log("参数==========", this.checkCouponList);
      for (let i = 0; i < this.checkCouponList.length; i++) {
        if (this.is_coupon_SELE) {
          //开启折叠优惠券
          console.log("this.checkCouponList[0].num", this.coupons_temp[this.checkCouponList[i].coupon_id].num);
          let coupon_arr = this.checkCouponList[i].has_conpon_id;
          coupons = coupons.concat(coupon_arr.slice(0, this.coupons_temp[this.checkCouponList[i].coupon_id].num));
          this.use_coupon_size = coupons.length;
        } else {
          coupons.push(this.checkCouponList[i].id);
        }
      }

      return coupons;
    },
    // 组装优惠抵扣信息
    assembleDeduction() {
      let deductions = [];
      for (let i = 0; i < this.checkDeductionList.length; i++) {
        deductions.push(this.checkDeductionList[i]);
      }
      return deductions;
    },

    // 初始化优惠券
    initCoupon(coupon) {
      if (coupon.deduction_lang) {
        this.deduction_lang = coupon.deduction_lang;
      }
      if (!coupon) return;
      this.isShowCoupon = coupon.whether_show_coupon == "1" ? true : false;
      this.is_coupon_SELE = coupon.coupon_show == "1" ? true : false;
      if (coupon.member_coupons) {
        this.coupon_size = coupon.member_coupons.length;
        if (this.is_coupon_SELE) {
          let arr2 = coupon.member_coupons.sort((a, b) => {
            return a.expired_at - b.expired_at;
          });
          // console.log("排序数组-------------------", arr2)
          // this.coupons = coupon.member_coupons;
          this.initSelectCoupon(arr2);
        } else {
          this.coupons = coupon.member_coupons;
        }
      }
    },
    mustSelectCoupon() {
      // 后台设置，下单前判断有优惠券数量但没使用时，是否提示并展开选择优惠券弹窗，只提示一次！
      if (this.openCueCoupon && this.coupon_size > 0 && this.use_coupon_size < 1 && !this.isCueCoupon) {
        //显示优惠券列表弹窗
        this.isCueCoupon = true;
        this.popupCouponSpecs = true;
        return true;
      }
      return false;
    },
    //初始化带有默认选中优惠券
    defaultSelectCoupon(coupon) {
      this.coupon_size = coupon.length;
      this.coupons = coupon;
      this.checkCouponList = [];
      coupon.forEach((item, ind) => {
        if (item.checked == true) {
          this.checkCouponList.push(item);
        }
      });
      this.use_coupon_size = this.checkCouponList.length;
    },
    // 优惠券
    showCoupon() {
      if (this.coupon_size == 0) {
        Toast("暂无优惠券使用");
        return;
      }
      this.popupCouponSpecs = true;
    },
    // 选择优惠券
    selectCoupon(value, valObj, num) {
      // 处理选择
      this.screenCoupon(value, valObj, num);
      // 设置已经使用多少优惠券
      this.use_coupon_size = this.checkCouponList.length;

      // 重新计算
      this.handleBuy("2");
    },
    chooseCoupon(index, valid) {
      if (valid) {
        this.coupons[index].checked = true;
      }
    },
    // 筛选数据优惠券状态
    screenCoupon(value, valObj, num) {
      // console.log(value,valObj,"valObj");
      let tarValue = valObj;
      if (value) {
        // 选中添加
        this.cup_notice = false;
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

        if (this.is_coupon_SELE && value) {
          //开启折叠优惠券并且为点击复选框为选中状态
          this.coupons_temp[tarValue.coupon_id].num = num || 1;
        }
      } else {
        // 取消选中
        this.cup_notice = true;
        if (this.checkCouponList.length > 0) {
          for (let i = 0; i < this.checkCouponList.length; i++) {
            if (this.checkCouponList[i].id == tarValue.id) {
              this.checkCouponList.splice(i, 1);
            }
          }
        }
        if (this.is_coupon_SELE && !value) {
          //开启折叠优惠券并且为点击复选框为选中状态
          this.coupons_temp[tarValue.coupon_id].num = 0;
        }
      }
    },
    //折叠优惠券
    initSelectCoupon(coupon) {
      let coupon_data = coupon;
      let result = [];
      let temp = {};

      for (let i = 0; i < coupon_data.length; i++) {
        let num = 0; //同类型已选中并符合使用条件的优惠券数量
        let valid = 0; //最高限制使用数量
        let has_conpon_id = [coupon_data[i].id];
        if (coupon_data[i].checked) {
          num++;
        }
        if (coupon_data[i].valid) {
          valid++;
        }
        for (let j = i + 1; j < coupon_data.length; j++) {
          // console.log("33333333==================", coupon_data[j].coupon_id)
          if (coupon_data[i].coupon_id == coupon_data[j].coupon_id) {
            if (coupon_data[j].checked) {
              num++;
            }
            if (coupon_data[j].valid) {
              valid++;
            }
            has_conpon_id.push(coupon_data[j].id);
            coupon_data.splice(j, 1);
            j--;
          }
        }
        let _data = coupon_data[i];
        _data.has_conpon_id = has_conpon_id;
        _data.valid_num = valid;
        result.push(_data);
        temp[coupon_data[i].coupon_id] = {};
        temp[coupon_data[i].coupon_id].num = num;
      }
      this.coupons_temp = temp;
      this.coupons = result;
      // console.log(this.coupons, this.coupons_temp,"coupons_temp");
    },
    // 改变优惠券数量
    changeCoupon(num, data) {
      let valObj = data.name;
      // console.log('=================', num, data, valObj.valid_num)
      if (num > valObj.valid_num) {
        Toast(`使用张数已达上限`);
        this.stepper_show = 1; //添加原因van-stepper的value只有第一次有
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          // 注意此时修改 value 后会再次触发 change 事件
          this.coupons_temp[valObj.coupon_id].num = valObj.valid_num;
          this.stepper_show = 0;
        }, 200);

        // this.$set(this.coupons_temp[valObj.coupon_id], "num", valObj.valid_num);
        return;
      } else if (num == "" || num == undefined || num == 0) {
        Toast("暂不使用请取消勾选");
        return;
      } else {
        clearTimeout(this.timer);
        this.coupons_temp[valObj.coupon_id].num = num;
        // console.log(num,this.coupons_temp[valObj.coupon_id].num,this.coupons_temp,"this.coupons_temp");
      }

      let value = {
        target: { checked: true }
      };
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // 先清除之前的延时，并在下面重新开始计算时间
      }
      // clearTimeout方法，以便控制连续触发带来的无用调用
      this.timeoutId = setTimeout(() => {
        // 200毫秒以后执行方法
        this.selectCoupon(value, valObj, num);
      }, 200); // 如果还没有执行就又被触发，会根据上面的clearTimeout来清除并重新开始计算
    },

    // 抵扣选择响应,运费选择
    discountHandle(item, value, tag) {
      console.log(this.service_fee[item.pre_id]);
      if (this.good_clicktag === 0) {
        if (tag == "discount") {
          this.screenDiscount(item, value);
        } else if (tag == "serviceFee") {
          this.serviceFeesHandle(item, value);
        }

        // 重新计算
        this.handleBuy("2");
      }
    },
    switchChange(item, value, tag) {
      if (value.checked) {
        this.service_fee[item.pre_id] = [];
        this.service_fee[item.pre_id].push(value.code);
        if (tag == "serviceFee") {
          this.serviceFeesHandle(item, value);
        }
        this.handleBuy("2");
      } else {
        this.service_fee[item.pre_id] = [];
      }
    },
    // 留言触发抵扣事件
    noteHandle(event, item) {
      this.deductionListHandle(item);
    },
    // 筛选抵扣
    screenDiscount(item, value) {
      this.deductionListHandle(item, value);
    },
    //服务费、运费复选框
    serviceFeesHandle(item, value) {
      //服务费、运费复选框
      if (this.service_fee[item.pre_id].indexOf("liveInstall") > -1 && !location_loading) {
        location_loading = 1;
        this.fun
          .getLocation()
          .then(res => {
            this.location = res;
            location_loading = 2;
          })
          .catch(err => {
            Toast("定位失败，请手动切换定位！");
            location_loading = 2;
            this.location.address = "定位失败，请手动切换！";
            console.log(err);
          });
      }

      this.deductionListHandle(item);
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
            deduction.service_fee = this.service_fee[item.pre_id];
            deduction.note = this.note[item.pre_id];
          }
        });
      }
      if (!isHasPreId) {
        this.checkDeductionList.push({
          deduction_ids: value && value.code ? [value.code] : [],
          pre_id: item.pre_id,
          note: this.note[item.pre_id],
          service_fee: this.service_fee[item.pre_id]
        });
      }
      this.checkDeductionList.reverse(); // 更新数组
      // console.log('checkDeductionList:', this.checkDeductionList)
    },

    // 微信订阅消息
    confirmSub(e) {
      this.submit();
    },
    errorSub(err) {
      this.submit();
    },

    // 修改个人信息
    confirmFrom() {
      this.showFrom = false;
    },
    //更换自提点 （杨朗）
    replaceZT(flag) {
      this.save_ztd_LocalStorage(this.distributionUserName, this.distributionUserMobile);
      let _query = {};
      if (this.$route.query.goods) {
        _query.goods = this.$route.query.goods;
      }
      if (flag === "noLocation") {
        this.toRouter("SelfCarry_info", "replace", { goods: JSON.stringify(this.assembleGoods()), noLocation: 1 }, _query);
      } else {
        this.toRouter("SelfCarry_info", "replace", { goods: JSON.stringify(this.assembleGoods()) }, _query);
      }
      // this.$router.replace(
      //   this.fun.getUrl("SelfCarry_info", {
      //     tag: this.$route.query.tag,
      //     goodsId: this.$route.query.goodsId,
      //     optionsId: this.$route.query.optionsId,
      //     total: this.$route.query.total,  //跳转到其他页面的参数传递逻辑太重复了，后期必须优化统一跳转参数。。。。看看上面的跳转返回alertMyInfo
      //     form_data_id: this.form_data_id,
      //     cart_ids: this.$route.query.cart_ids,
      //     store_id: this.$route.query.store_id
      //   })
      // );
    },
    // 跳转增加域名--应用市场
    toSite() {
      let query = {};
      if (!this.shop_domain) {
        if (this.plugin_id) {
          query = { plugin_id: this.plugin_id };
        }
        this.toRouter("bindingSite", "replace", {}, query);
      }
    },
    toRouter(url, jumpType, params, query) {
      let commonJson = {
        tag: this.$route.query.tag,
        goodsId: this.$route.query.goodsId,
        optionsId: this.$route.query.optionsId,
        total: this.$route.query.total,
        form_data_id: this.form_data_id,
        cart_ids: this.$route.query.cart_ids,
        store_id: this.$route.query.store_id,
        level_id: this.$route.query.level_id,
        team_id: this.$route.query.team_id,
        option_level_id: this.$route.query.option_level_id,
        dispatch_id: this.selected
      };
      if (jumpType === "replace") {
        this.$router.replace(
          this.fun.getUrl(
            url,
            {
              ...commonJson,
              ...params
            },
            { ...query }
          )
        );
      } else {
        this.$router.push(
          this.fun.getUrl(
            url,
            {
              ...commonJson,
              ...params
            },
            { ...query }
          )
        );
      }
    },

    // 权益商品选择事件
    rentSelect() {
      // console.log(this.isOpenRight);
      // 1.判断是否选择权益商品，有则租期按照会员权益日期计算
      this.clearStorage();
      this.judgeIsRight();
      if (this.isOpenRight) {
        let arr = [];

        this.order_data.forEach(val => {
          val.order_goods.forEach(item => {
            // console.log(item)
            let obj = {
              goods_id: item.goods_id,
              total: item.total
            };
            arr.push(obj);
          });
        });

        window.localStorage.setItem("rentTimeRight", JSON.stringify(arr));

        this.getRentDataActionCart(JSON.stringify(arr), []);
      } else if (!this.isOpenRight) {
        this.currentIndex = "999";
        this.getRentDataActionCart([], []);
      }
    },
    // 判断是否选择权益商品
    judgeIsRight() {
      if (this.isOpenRight) {
        this.isRightChoose = false;
      } else {
        this.isRightChoose = true;
      }
    },
    // 选择租期
    rentTimeChoose(item, index) {
      if (this.currentIndex == index) {
        this.currentIndex = "999";
        this.clearStorage();
        this.getRentDataActionCart([], []);
      } else {
        this.clearStorage();
        this.currentIndex = index;

        let obj = {
          days: 0,
          lease_term_id: item.id
        };

        window.localStorage.setItem("rentTimeChoose", JSON.stringify(obj));
        this.getRentDataActionCart([], JSON.stringify(obj));
      }
    },
    // 选择自定义租期
    rentSelfChoose() {
      this.clearStorage();
      this.currentIndex = "999";
      this.showPop = true;
    },
    // 确认选择租期
    activation() {
      if (this.fun.isTextEmpty(this.popCode)) {
        this.$dialog.alert({ message: "租期不能为空" });
        return;
      }

      let obj = {
        days: this.popCode,
        lease_term_id: 0
      };

      window.localStorage.setItem("rentTimeSelf", JSON.stringify(obj));
      this.getRentDataActionCart([], JSON.stringify(obj));
    },
    // 清除租赁localStorage
    clearStorage() {
      window.localStorage.removeItem("rentTimeSelf");
      window.localStorage.removeItem("rentTimeChoose");
      window.localStorage.removeItem("rentTimeRight");
    },

    showAgreement() {
      this.agreementShow = true;
    },

    showPay() {
      this.agreementPayShow = true;
    },

    getLocation(_type) {
      this.fun
        .getLocation()
        .then(res => {
          this.getList(res, _type);
        })
        .catch(err => {
          this.isQuest_ing = false;
        });
    },
    //获取自提点列表（杨朗）
    //_type {shop:杨朗||o2o:门店自提}
    getList(_data, type) {
      let _type = type;
      let that = this;
      let p = _data.point ? this.fun.bd_encrypt(_data.point.lng, _data.point.lat) : {};
      let json = {
        city_name: _data.city,
        lat: p.lat || "",
        lng: p.lng || "",
        kwd: "",
        goods: JSON.stringify(this.assembleGoods())
      };
      if (this.$route.query.package_deliver_id) {
        json.deliver_id = this.$route.query.package_deliver_id;
      }
      this.isQuest_ing = true;
      let _url = "plugin.package-deliver.frontend.deliver.getList";
      if (_type == "o2o") {
        _url = "plugin.package-deliver.frontend.store.deliver.getList";
        json.store_id = this.$route.query.store_id;
      }
      $http.get(_url, json).then(
        response => {
          that.isQuest_ing = false;
          if (response.result === 1) {
            if (_type == "shop") {
              that.deliverName = response.data.name;
              if (that.fun.isTextEmpty(that.defaultSelfCarry.id)) {
                that.defaultSelfCarry = response.data.list.data[0] ? response.data.list.data[0] : ""; //没有就取第一个为默认自提点。。。
              }
            } else if (_type == "o2o") {
              that.o2odeliverName = response.data.name;
              if (that.fun.isTextEmpty(that.o2oSelfCarry.id)) {
                that.o2oSelfCarry = response.data.list.data[0] ? response.data.list.data[0] : ""; //没有就取第一个为默认自提点。。。
              }
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {
          that.isQuest_ing = false;
          console.log(response);
        }
      );
    },

    // 循环订单判断是否开启话费慢充和自定义表单
    findGoodOpen() {
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        if(this.goodsInfo.orders[j].camilo_resources_coupon_type){
          // 卡券商品
          this.camilo_resources_coupon_type = this.goodsInfo.orders[j].camilo_resources_coupon_type;
          if(this.plugin_setting.yz_supply_camilo_resources.is_default_order_address == 1) {
            // 是否开启默认地址
            this.show_address = true;
            currentAddId = 1; //地址没有id  写死一个
            let {address,city,district,province,street,mobile,username} = this.plugin_setting.yz_supply_camilo_resources;
            this.setAddressViewData({
              address,city,district,province,street,mobile,username
            }); // 设置地址界面
          }
        }
        if (this.$route.query.electricity == "electricity") {
          // 如果是电费充值
          this.electricity_Guide = this.goodsInfo.orders[j].order_goods[0].pre_id;
          this.ele_no_showAdress = this.goodsInfo.orders[j].order_goods[0] ? this.goodsInfo.orders[0].not_show_address : "";
          this.eleUser = this.goodsInfo.orders[j].order_goods[0] ? this.goodsInfo.orders[0].user_account : "";
        }
        if (this.goodsInfo.orders[j].require_mobile) {
          console.log("有商品开启话费慢充！！！");
          this.recharge_tips = this.goodsInfo.orders[j].tips;
          this.show_recharge_mobile = this.goodsInfo.orders[j].order_goods[0].pre_id;
        }
        //油卡充值
        if(this.oil_account && this.oil_mobile){
          this.oil_pre_id = this.goodsInfo.orders[j].order_goods[0].pre_id;
        }
        for (let i = 0; i < this.goodsInfo.orders[j].order_goods.length; i++) {
          if (this.goodsInfo.orders[j].order_goods[i].diy_form) {
            console.log("有商品开启自定义表单！！！");
            this.hasGoodOpenDF = true;
          }
        }
      }
    },
    isAllDFOk() {
      //判断是否有商品开启自定义表单但是没有提交的，没提交过的diyform_data_id为0
      let that = this;
      if (this.goodsInfo.orders) {
        for (let j = 0; j < this.goodsInfo.orders.length; j++) {
          for (let i = 0; i < that.goodsInfo.orders[j].order_goods.length; i++) {
            if (that.goodsInfo.orders[j].order_goods[i].diy_form && that.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id == 0) {
              console.log("有未填写的表单！！！");
              return true;
            }
          }
        }
      }
    },
    diyFormSave(_dyData) {
      console.log("diyFormPopup组件它点击提交了,这是它的数据", _dyData);
      let that = this;
      for (let j = 0; j < this.goodsInfo.orders.length; j++) {
        for (let i = 0; i < that.goodsInfo.orders[j].order_goods.length; i++) {
          if (that.goodsInfo.orders[j].order_goods[i].goods_id == that.activeDYGoodID) {
            that.goodsInfo.orders[j].order_goods[i].diy_form.diyform_data_id = _dyData;
            console.log("设置that.goodsInfo", that.goodsInfo);
            that.oldOrder_data = that.goodsInfo;
            that.dyFormPopup = false;
            return;
          }
        }
      }
    },
    getGoodDFData(_gID, _dyID, _fDataID) {
      console.log("表单id;;;;;", _gID, _dyID, _fDataID);
      this.goodDYDormID = _dyID;
      this.activeDYGoodID = _gID;
      this.activeFormDataID = _fDataID;
      let that = this;
      let _json = {
        form_id: _dyID
      };
      if (_fDataID) {
        _json.form_data_id = _fDataID;
      }
      $http.get("plugin.diyform.api.diy-form.getSingleFormData", _json).then(
        response => {
          if (response.result === 1) {
            that.dfData = response.data;
            that.dyThumb = response.data.thumb ? response.data.thumb : null;
            that.dyDescription = response.data.description ? response.data.description : null;
            that.dyTiitle = response.data.title ? response.data.title : "表单信息";
            that.dyFormPopup = true;
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        response => {
          console.log(response);
        }
      );
    },

    //下单页优化提货人姓名和电话自动填上上次填写的信息【任务编号: 35632】
    save_ztd_LocalStorage(_name, _mobile) {
      let _memberInfoes = {
        distributionUserName: _name,
        distributionUserMobile: _mobile
      };
      localStorage.setItem("selfCarryInfo", JSON.stringify(_memberInfoes));
    },
    // 门店配送-查看配送范围
    showDeliveryMap() {
      this.deliveryScopeShow = true;
    },
    showLocationPop() {
      if (location_loading != 2) return;
      this.showLocation = true;
    },
    confirmLocation(data) {
      this.location = data;
    },
    showTax(taxGoodsList){
      this.taxShow = true;
      this.taxGoodsList = taxGoodsList;
    },
    toTaxDetail(){

    }
  },
  components: { cTitle, deliveryMap, yzAddressList, location, yzSubscribe, yz_uploader, yzMyinfo, order_invoice, diyfrom, addGoodsModule,invoicePop,cityDeliveryDay, agencySaleman, overseastag, realnameAuth, labels, gift }
};
