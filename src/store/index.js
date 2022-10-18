/**
 * Created by zhong on 16/10/15.
 */
import { Dialog } from "vant";
import category from "./category";
import ticket from "./ticket";
import memberstate from "./member_model";
import sort_goods from "./sort_goods";
import service from "./service";
import langService from "./service";
import knowledge from "./knowledge";
export default {
  modules: {
    category,
    sort_goods,
    memberstate,
    ticket,
    service,
    langService,
    knowledge
  },
  state: {
    add_cart_now_buy_button:'',//商品详情页，点击购物车或者立即购买
    cart_num: 0, //购物车数量（包括失效）
    shopLanguage: {},
    pop: {},
    // true
    integral: "",
    // 会员装修数据
    member_temp: {},
    // 装修数据
    temp: { item: { janst: "" } },
    foot: false,
    message: "提示",
    cou: 50,
    view: true,
    name: "",
    level: "",
    icon: "",
    sex: 0,
    vip: false,
    islogin: false,
    // 订单列表点击mt-tab-item
    selected_status: false,
    // 订单列表订单状态
    status: 0,
    // 当前发货地址
    currentAddress: {
      dispatch_type_id: 1,
      address: "",
      mobile: "",
      realname: ""
    },
    // 详情页面用到的订单
    detail_order: "",
    // 从服务器请求的地址字符串
    address_info: "",
    // 账户余额
    balance: 0,
    isShow: 0,
    // 服务器请求的全国省份，市，辖区数据
    city: [],
    district: [],
    province: [],
    mailInfo: {}, // 商城信息
    cservice: "", // 客服
    // 插件列表
    plugins: [],
    loginStatus: 0,
    trainCity: [], // 火车对应的城市
    airCity: [], // 飞机对应城市

    shop_id: "",
    mailLanguage: {}, // 自定义语言
    location: {},
    referer: "",
    callback_url: "",

    // 区域id
    zoneId: "",
    o2oLocation: {},

    // zone开关
    zoneShow: 0,

    blockchainLang: {},
    is_Inviter: 0,
    isloadding: false,
    isSwitchCity: false,
    selfCarryApply: [],
    applyModel: {}, //门店/酒店申请
    passwordValidation: 0,
    adApply: false,
    adDevice: false,
    liveRoomID: null, //直播间进入商品详情页购买下单使用
    _isShowReturnLiveBtn: false, //是否显示返回直播按钮
    isWatchDiypage: 1, //会员等级浏览装修页权限
    caseLibrary: null, //案例库

    newDiyData: {},

    isShomegGoodComment: false,
    _isShowCrmBind: false, //是否显示益生crm绑定会员
    orderErrReturnUrl: null //下单页接口返回失败时，提示框确认返回链接
  },

  mutations: {
    //商品详情页，点击购物车或者立即购买
    setAddCartNowBuyButton(state,add_cart_now_buy_button){
      state.add_cart_now_buy_button = add_cart_now_buy_button;
    },
    setShowComment(state, status) {
      state.isShomegGoodComment = status;
    },
    // 存储自定义语言包
    setCartNum(state, cart_num) {
      state.cart_num = cart_num;
    },
    // 存储自定义语言包
    setShopLanguage(state, lang) {
      state.shopLanguage = lang;
    },
    // 存储自定义语言包
    setBlockchainLang(state, lang) {
      state.blockchainLang = lang;
    },
    setLocation(state, o2oLocation) {
      // console.info('=====setLocation======', o2oLocation)

      state.o2oLocation = o2oLocation;
    },
    setWatchDiypage(state, data) {
      console.info("=====setWatchDiypage======", data);
      state.isWatchDiypage = data != undefined ? data : 1;
    },

    setSwitchCity(state, show) {
      state.isSwitchCity = show;
    },
    // 存储shop_id
    setShopId(state, shop_id) {
      state.shop_id = shop_id;
    },
    setLoginStatus(state, info) {
      state.loginStatus = info;
    },
    tempIndex(state, info) {
      state.temp = info;
    },
    tempItemIndex(state, info) {
      state.temp.item = info;
    },
    // 修改商品列表模板id
    puteListCode(state, info) {
      state.temp.item.ViewSet.goodsList.code = `goodsList${info}`;
    },
    membertempIndex(state, info) {
      state.member_temp = info;
    },
    setNewDiyData(state, info) {
      state.newDiyData = info;
    },
    setCservice(state, n) {
      state.cservice = n;
    },
    toIsShow(state, n) {
      state.isShow = n;
    },
    alerts(state, msg) {
      Dialog.alert({ message: msg });
    },
    views(state) {
      state.view = !state.view;
    },
    MESSAGE(state, value) {
      state.message = value || state.message;
    },
    member(state, obj) {
      state.name = obj.name;
      state.level = obj.level;
      state.icon = obj.icon;
    },
    login(state, log) {
      state.islogin = log.login;
    },
    updateBanlace(state, balance) {
      // console.log('账户余额')
      // console.log(balance.balance)
      state.balance = balance.balance;
    },
    updateLocation(state, location) {
      // console.log('账户余额')
      // console.info('=====updateLocation======', location)
      state.location = location;
    },

    setReferer(state, referer) {
      state.referer = referer;
    },
    setCallback(state, callback_url) {
      state.callback_url = callback_url;
    },
    setStatus(state, value) {
      state.status = value.status;
    },
    setCurrentAddress(state, address) {
      state.currentAddress.dispatch_type_id = address.dispatch_type_id;
      state.currentAddress.address = address.address;
      state.currentAddress.mobile = address.mobile;
      state.currentAddress.realname = address.realname;
    },
    savePop(state, pop) {
      state.pop = pop;
    },
    saveAddresssInfo(state, address) {
      // console.log(address)
      state.address_info = address.value;
      state.city = address.city;
      state.district = address.district;
      state.province = address.province;
    },
    setMailInfo(state, mailInfo) {
      // console.log("setMailInfo=", mailInfo)
      state.mailInfo = mailInfo;
    },
    // 设置插件列表
    setPlugins(state, plugins) {
      state.plugins = plugins;
    },
    // 存储火车票对应城市
    setTrainCity(state, trainCity) {
      state.trainCity = trainCity;
    },
    // 存储飞机票对应城市
    setAirCity(state, airCity) {
      state.airCity = airCity;
    },

    // 存储自定义语言包
    setMailLanguage(state, mailLanguage) {
      state.mailLanguage = mailLanguage;
    },

    // 存储区域id
    setZoneId(state, zoneId) {
      state.zoneId = zoneId;
    },

    // 存储区域开关
    setZoneShow(state, zoneShow) {
      state.zoneShow = zoneShow;
    },

    setDefaultMoreData(state, data) {
      state.temp.default.goods.data = state.temp.default.goods.data.concat(data);
    },
    // 旧装修
    setMoreData(state, data) {
      if (state.temp.item.data[data.index].temp == "showgoods" || state.temp.item.data[data.index].temp == "showflashsale") {
        state.temp.item.data[data.index].data = state.temp.item.data[data.index].data.concat(data.data);
      }
    },
    setLoadMore(state, data) {
      state.temp.item.data[data.index].isLoadMore = data.isLoadMore;
    },
    // 附近商品
    setNearData(state, data) {
      state.temp.item.data[data.index].get_info = data.data;
    },
    setNearMoreData(state, data) {
      state.temp.item.data[data.index].get_info.data = state.temp.item.data[data.index].get_info.data.concat(data.data);
    },
    setNearLoadMore(state, data) {
      state.temp.item.data[data.index].isLoadMore = data.isLoadMore;
    },
    setmemberNearMoreData(state, data) {
      state.member_temp.data[data.index].get_info.data = state.member_temp.data[data.index].get_info.data.concat(data.data);
    },
    setmemberNearLoadMore(state, data) {
      state.member_temp.data[data.index].isLoadMore = data.isLoadMore;
    },
    setNearMemberData(state, data) {
      state.member_temp.data[data.index].get_info = data.data;
    },
    // 设置是否第一次进入邀请页面
    setInviter(state, is_Inviter) {
      state.is_Inviter = is_Inviter;
    },
    setSelfCarryApply(state, data) {
      state.selfCarryApply = data;
    },
    setApplyModel(state, data) {
      state.applyModel = data;
    },
    setPasswordValidation(state, data) {
      state.passwordValidation = data;
    },
    setAdApply(state, data) {
      state.adApply = data;
    },
    setLiveRoomID(state, data) {
      state.liveRoomID = data;
    },
    setReturnLiveBtn(state, data) {
      state._isShowReturnLiveBtn = data;
    },
    setAdDevice(state, data) {
      state.adDevice = data;
    },
    // 案例库
    setCaseLibrary(state, datas) {
      state.caseLibrary = datas;
    },
    setCrmBind(state, data) {
      state._isShowCrmBind = data;
    },
    setOrderErrReturnUrl(state, data) {
      state.orderErrReturnUrl = data;
    }
  }
};
