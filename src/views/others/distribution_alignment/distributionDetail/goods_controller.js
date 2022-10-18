// import { mapState } from "vuex";
import { Toast } from 'vant';
import { Swipe, SwipeItem } from "components/meswipe";
import cComment from "components/goods/children/comment";
import cCommentlist from "components/goods/children/commentList";
import cLive from "components/goods/children/liveList";
import cMyswipe from "components/myswipe";
// import BScroll from "better-scroll";

var specsManage = []; //选择池 用于排序
var optionsId = ""; //选择后的 规格ID
var optionsMaxCount = 1;

const SUBMIT_ACTION_CART = "-1"; //添加到购物车
const SUBMIT_ACTION_BUY = "-2"; //立即购买
var submitActionTag = "";

var goods_id = "";

// var share_tag = "-1";
//商品详情
// var currentTabIndex = "0";
//标记 防止重复加载
// var is_first_content = false;
// var is_second_content = false;
var is_third_content = false;
// var isPullingUp = false;
// var isPullingDown = false;

var start = 0;
var last_distance = 0;

//商品详情

//wx.config(response.data.js); 微信认证
export default {
  props: ["goods_id", "goods_type", "goods_info", "touchClose", 'is_room'],
  data() {
    return {
      show1: false,
      service_QRcode: '',
      service_mobile: '',
      //live more
      isLoadMore: true,
      live_page: 1,
      total_page: 0,
      showMoreLive: false,
      recordsList: [],//直播间列表
      selected: "1",
      // 初始评论页数
      commentPage: 1,
      // 是否有更多评论
      noMoreComment: false,
      //是否是o2o
      is_o2o: false,
      integral: window.localStorage.integral,
      title: "商品详情",
      hoet: false,
      goodTop: false,
      popupSpecs: false,
      radio: "",
      openVip: "2",
      goodsInfo: {},
      popThumb: "",
      popStock: 0,
      popPrice: 0,
      goodsDescription: "",
      goodsCount: 1,
      favorite: false,
      isGoods: false,
      cservice: "",
      //商品详情
      first_content: "",
      second_content: "",
      third_content: [],
      activeName: "first",
      show: true,
      //商品详情
      isAddCart: false,
      popupSpecs2: false, //无规格选择商品数量
      isGoodsLove: false, //是否显示爱心值
      goods_love_cash: 0, //爱心值 现金
      goods_love_deduction: 0, //爱心值抵扣
      goods_love_name: "", //爱心值title
      showMember: true, //是否可以进入会员权益页面

      //海报显隐
      posterShow: false,
      posterImg: {},
      //活动显示隐藏
      activityShow: false,
      //商城活动
      activityItem: {},

      //商城活动默认第一个
      firstActivityBtn: "",
      //商城活动默认第一个内容
      firstActivityCon: "",

      //商城活动点击开关
      activitySwitch: false,

      //底部margin值开关
      isMarginBottom: false,

      //是否租赁商品
      isRent: false,

      isRight: false,

      //立即购买
      isRentBuyShow: false,

      //限时购开始时间
      beginTime: 0,

      //显示购结束时间

      endTime: 0,

      endTimeStr: "",

      //限时购开关
      isBuy: false,

      isTime: false,
      //o2o购物车显示

      showCart: false,

      //
      cartsNum: 0,

      carts: [],

      cartsTotal: 0.0,

      goodsCarts: [],

      //购物车id
      card_id: 0,

      //o2o商品数量
      o2oCount: 0,

      //门店名字
      o2oName: "",

      //门店电话

      o2oPhone: "",

      o2oLat: "",

      o2olng: "",

      timeLimit: "",

      //柜子商品--开始

      //柜子商品--标记

      isCup: true,
      nocart: true,
      //柜子商品--结束

      isPendingOrder: false, //挂单商品

      isMiniApp: false,
      showGood: false,

      //商城活动数组
      activityArr: [],
      //限时购据开始时间开关
      isBegTime: false,
      begTimeStr: "",
      showParameter: false, //商品参数弹窗

      isShowDetail: false, //是否展开宝贝详情
      isPullUp: false,
      showPageB: false,
      scroll: "",
      currentClass: 0,
      commentLimit: [], //评论组件，设置最新5条评论
      favorable_rate: "100%", //好评率
      labelList: {}, //服务标签
      goodDetail: {},

      timer: null, //throttleFn方法节流，减少性能开支
      last: null,
      now: null,

      showComment: false,
      showProjects: false,
      projects: []
    };
  },

  activated() {
    this.posterShow = false;

    this.goodTop = false;
    // if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
    //   share_tag = this.fun.getKey("share_tag");
    // }

    this.initData1();

    //alert(window.isMiniprogram);
    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }

    //门店购物车id
    this.card_id = this.$route.params.cartId;

    goods_id = this.$route.params.id;

    //todo, 通过接口判断类型吧
    if (this.goods_type == "store_goods") {
      this.is_o2o = true;
      // console.log(this.is_o2o);
    } else {
      this.is_o2o = false;
      // console.log(this.is_o2o);
    }
    if (!this.fun.isTextEmpty(this.$route.query.nocart)) {
      this.nocart = false;
    } else {
      this.nocart = true;
    }
    //柜子商品
    if (!this.fun.isTextEmpty(this.$route.params.mark)) {
      this.isCup = false;
    } else {
      this.isCup = true;
    }
    //alert(this.isCup);
    //挂单商品
    if (
      !this.fun.isTextEmpty(this.$route.query.kind) &&
      this.$route.query.kind == "POrder"
    ) {
      this.isPendingOrder = true;
    } else {
      this.isPendingOrder = false;
    }

    //初始化客服参数
    this.initCservice("");
    //商品详情 初始化参数
    this.initData();

    this.getGoodsPage(this.goods_info);
    // this.getData(); //获取数据
    // this.isFavorite(); //获取是否收藏

    // this.$nextTick(()=>{
    //   this.listenTouchEvent();
    // })
    if (this.goods_type === "appointment_goods") {
      this.getProject();
    }
    if (this.is_room == 1) {
      this.getLiveList();
    }
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttleFn);
    });
  },

  mounted() {
    this.posterShow = false;
    this.goodTop = false;
    // if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
    //   share_tag = this.fun.getKey("share_tag");
    // }

    this.initData1();

    //alert(window.isMiniprogram);
    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }

    //门店购物车id
    this.card_id = this.$route.params.cartId;

    goods_id = this.$route.params.id;

    //todo, 通过接口判断类型吧
    if (this.goods_type == "store_goods") {
      this.is_o2o = true;
      // console.log(this.is_o2o);
    } else {
      this.is_o2o = false;
      // console.log(this.is_o2o);
    }
    if (!this.fun.isTextEmpty(this.$route.query.nocart)) {
      this.nocart = false;
    } else {
      this.nocart = true;
    }
    //柜子商品
    if (!this.fun.isTextEmpty(this.$route.params.mark)) {
      this.isCup = false;
    } else {
      this.isCup = true;
    }
    //alert(this.isCup);

    //挂单商品
    if (
      !this.fun.isTextEmpty(this.$route.query.kind) &&
      this.$route.query.kind == "POrder"
    ) {
      this.isPendingOrder = true;
    } else {
      this.isPendingOrder = false;
    }

    //初始化客服参数
    this.initCservice("");
    //商品详情 初始化参数
    this.initData();

    this.getGoodsPage(this.goods_info);
    // this.getData(); //获取数据
    // this.isFavorite(); //获取是否收藏
    if (this.goods_type === "appointment_goods") {
      this.getProject();
    }
    // console.log(this.zoneId);
    if (this.is_room == 1) {
      this.getLiveList();
    }
    this.$nextTick(() => {
      // window.addEventListener("scroll", this.dataScroll);
      window.addEventListener("scroll", this.throttleFn);
    });
  },

  deactivated() {
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);
    window.removeEventListener("scroll", this.throttleFn);
  },

  methods: {
    goProjectDetails(id) {
      this.$router.push(
        this.fun.getUrl("ProjectDetails", { project_id: id })
      );
    },
    gotoProjects() {
      this.showProjects = true;
    },
    getProject() {
      $http
        .get(
          "plugin.appointment.frontend.project.get-list-by-goods-id",
          { goods_id: this.$route.params.id })
        .then(response => {
          if (response.result === 1) {
            this.projects = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initData1() {
      this.showGood = false;
      //初始化一下参数
      this.goodsInfo = {};
      this.isGoods = false;
      this.goodsCount = 1;
      this.popupSpecs = false;
      this.popupSpecs2 = false;
      this.isGoodsLove = false;
      this.isMarginBottom = false;

      this.isRent = false;

      this.isRentBuyShow = false;
      this.isPendingOrder = false;
      this.commentPage = 1; //由于首次进来执行getCommentData后该参数已经变为2，所以在每次进入需要先初始化这个参数为1，否则会获取不到数据
      submitActionTag = "";
      optionsId = "";
      specsManage = [];
      optionsMaxCount = 1;

      this.commentLimit = [];
      this.goodDetail = {};
      this.timer = null;
      this.last = null;
      this.now = null;
      this.showComment = false;
      this.showPageB = false;
      this.showMember = true;
      this.recordsList = [];
    },
    //初始化客服参数
    initCservice(newCservice) {
      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
        return;
      }
      if (this.$store.state.temp.mailInfo.hasOwnProperty('cservice')) {
        this.cservice = this.$store.state.temp.mailInfo.cservice;
      }
      if (this.$store.state.temp.mailInfo.hasOwnProperty('service_QRcode')) {
        this.service_QRcode = this.$store.state.temp.mailInfo.service_QRcode;
      }
      if (this.$store.state.temp.mailInfo.hasOwnProperty('service_mobile')) {
        this.service_mobile = this.$store.state.temp.mailInfo.service_mobile;
      }
    },

    slider() {
      let that = this;
      window.onscroll = function () {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        // if (top < that.$refs.goodinfo.offsetTop) {
        //   that.goodTop = false;
        // } else {
        //   that.goodTop = true;
        // }

        if (top <= 40) {
          that.hoet = false;
        } else {
          that.hoet = true;
        }
        //滑动到底部禁止反弹
        if (
          document.documentElement.scrollHeight ==
          document.documentElement.clientHeight + top
        ) {
          //alert("Touch_Buttom!");
          document.addEventListener("touchstart", this.move, false);

          document.addEventListener("touchmove", this.move, false);
        }
      };
    },

    handleChange() { },

    goto() {
      // console.log("share_tag", share_tag);
      // if (share_tag == "-1") {
      this.$router.go(-1);
      // } else {
      //this.$router.push({ name: 'home', params: {}, query: { i: this.toi } });
      this.$router.push(this.fun.getUrl("home", {}));
      // }
    },

    handleTopChange(status) {
      this.topStatus = status;
    },

    getGoodsPage(data) {
      this.getData(data.get_goods);
      // this.initShare(response.data.wx_js_sdk_config);
      this.showGood = true;
      this.slider();
      // this.showMember = data.display_page == "1" ? true : false;
      if (data.is_favorite) {
        this.favorite = data.is_favorite.status == 1 ? true : false;
      }
    },
    getDetailData(tag) {
      // $http
      //   .post(
      //     "goods.goods.show-Push",
      //     {
      //       id: goods_id,
      //       mark: this.fun.getKey("mark"),
      //       mark_id: this.fun.getKey("mark_id")
      //     },
      //     ""
      //   )
      //   .then(response => {
      //     if (response.result === 1) {
      if (this.goodsInfo.content) {
        let str = this.goodsInfo.content.replace(/src=\"http:/gi,
          "src=\"https:");
        this.goodDetail.content = str;
      }
      if (this.goodsInfo.show_push) {
        this.goodDetail.show_push = this.goodsInfo.show_push;
      }
      this.showPageB = true;
      if (tag) {
        this.$nextTick(() => {
          let jump = document.getElementsByClassName("section");
          // 获取需要滚动的距离
          let total = jump[2].offsetTop - 50;
          // Chrome
          document.body.scrollTop = total;
          // Firefox
          document.documentElement.scrollTop = total;
          // Safari
          window.pageYOffset = total;
        });
      }
      //   } else {

      //   }
      // })
      // .catch(err => {
      //   this.isPullUp = false;
      //   this.showPageB = false;
      //   this.showGood = true;
      //   console.log(err);
      // });
    },

    //获取数据
    getData(data) {
      // let that = this;
      // let json = {
      //   id: goods_id,
      //   mid: this.fun.getKeyByMid()
      // };
      // $http.get("goods.goods.get-goods", json, "加载中").then(
      //   function(response) {
      // console.log("====getData=====:", response);

      // if (response.result == 1) {
      this.goodsInfo = data;
      if (this.fun.getPhoneEnv() == 3) {
        this.getDetailData();
        this.showPageB = true;
      }

      if (this.goodsInfo.member_discount) {
        if (this.fun.isTextEmpty(this.goodsInfo.member_discount.discount)) {
          this.openVip = 1;
        } else {
          this.openVip = this.goodsInfo.member_discount.discount;
        }
      }

      this.initPopView(); //初始化弹窗view
      this.initPopView2(); //初始化弹窗view2 无规格

      if (this.goods_info.get_goods.plugin_id == 44) {
        this.getJHSupplier();
      }

      // this.initShare(); //初始化分享设置
      this.fun.wxShare(
        "",
        { mid: this.fun.getKeyByMid(),
          goods_id: goods_id },
        {
          title: !this.fun.isTextEmpty(this.goodsInfo.has_one_share) && !this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_title)?this.goodsInfo.has_one_share.share_title:this.goodsInfo.title,
          imgUrl: !this.fun.isTextEmpty(this.goodsInfo.has_one_share) && !this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_thumb)?this.goodsInfo.has_one_share.share_thumb:this.goodsInfo.thumb,
          description: this.goodsInfo.has_one_share.share_desc
        },
        data => {
          if (!this.fun.isTextEmpty(data.shop && data.shop.shop)) {
            this.initCservice(data.shop.shop.cservice); //客服重新赋值
          }
        }
      );
      this.setIsAddCart(); //判断是否能加入购物车
      this.setIsLove(); //判断是否有爱心值
      this.commentLimit = data.get_comment;
      this.favorable_rate = data.favorable_rate;
      this.isGoods = true;
      this.labelList = data.label;

      wx.miniProgram && wx.miniProgram.postMessage({
        data: { goods_title: this.goodsInfo.title }
      });

      //let store_id=that.fun.isTextEmpty(that.$route.params.store_id)?"":that.$route.params.store_id;
      //todo, 通过接口获取store_id吧
      // let store_id = "";

      // this.footSet(goods_id, store_id); //设置足迹数据//描述title路径share

      this.isMarginBottom = this.fun.isTextEmpty(data.show_push) ? false : true;

      if (!this.fun.isTextEmpty(data.lease_toy)) {
        this.isRent = data.lease_toy.is_lease == 1 ? true : false;
        this.isRentBuyShow = data.lease_toy.immed_goods_id == 0 ? false : true;
      }

      if (!this.fun.isTextEmpty(data.lease_toy)) {
        if (!this.fun.isTextEmpty(data.lease_toy.is_rights)) {
          this.isRight = data.lease_toy.is_rights == 1 ? true : false;
        }
      }
      console.log("isRent222:", this.isRent);
      console.log("isRentBuyShow11:", this.isRentBuyShow);
      //限时购

      if (!this.fun.isTextEmpty(data.has_one_goods_limit_buy)) {
        this.isBuy = data.has_one_goods_limit_buy.status == 1 ? true : false;

        this.beginTime = data.has_one_goods_limit_buy.start_time;
        console.log("isBuy:", this.isBuy);

        if(this.isBuy) {
          this.timeCompare(this.beginTime);
        }

        console.log("isTime:", this.isTime);

        this.endTime = new Date(
          parseInt(data.has_one_goods_limit_buy.end_time) * 1000
        );

        this.endTimeStr = String(this.endTime);

        this.timeLimit = data.has_one_goods_limit_buy.status;
      }

      //商城活动
      if (data.goods_sale && data.goods_sale.sale_count != 0) {
        this.firstActivityBtn = data.goods_sale.first_strip_key.name;

        if (data.goods_sale.first_strip_key.type == "array") {
          data.goods_sale.first_strip_key.value.forEach((item, index) => {
            if (index == 0) {
              this.firstActivityCon += item;
            } else {
              this.firstActivityCon += "," + item;
            }
          });
        } else {
          this.firstActivityCon = data.goods_sale.first_strip_key.value;
        }

        this.activitySwitch = true;

        this.activityArr = data.goods_sale.sale;
      } else {
        this.activitySwitch = false;
      }
      // } else {
      //   console.log(response.msg);
      //   that.isGoods = false;

      //     }
      //   },
      //   function(response) {
      //     Toast(response.msg);
      //     that.isGoods = false;
      //   }
      // );
    },

    //初始化弹窗view
    initPopView() {
      this.popThumb = this.goodsInfo.thumb; //设置默认图片
      this.popStock = this.goodsInfo.stock; //设置默认库存
      if (this.goodsInfo.has_option == 1) {
        this.popPrice =
          this.goodsInfo.min_price + "-" + this.goodsInfo.max_price; //设置默认价格
      } else {
        this.popPrice = this.goodsInfo.price; //设置默认价格
      }

      this.goodsDescription = "选择";
      for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        this.goodsDescription += " " + this.goodsInfo.has_many_specs[i].title;
      }
    },

    initPopView2() {
      if (this.goodsInfo.has_option != 1) {
        this.popThumb = this.goodsInfo.thumb; //设置默认图片
        this.popStock = this.goodsInfo.stock; //设置默认库存
        this.popPrice = this.goodsInfo.price; //设置默认价格
        this.goodsDescription = "";
        optionsMaxCount = this.goodsInfo.stock; //设置最大购买量
      }
    },

    //加入购物车
    addCart() {
      if (this.isBegTime) {
        Toast("该商品还没到购买时间");
        return false;
      }
      //价格权限
      if (
        this.goodsInfo.vip_level_status &&
        this.goodsInfo.vip_level_status.status == 1
      ) {
        Toast(this.goodsInfo.vip_level_status.tips);
        return false;
      }
      $http.get("member.member.isValidatePageGoods", {}).then(response => {
        if (response.result === 1) {
          if (
            this.goodsInfo.has_one_invite_page &&
            this.goodsInfo.has_one_invite_page.status === 1 &&
            response.data.is_invite === 0
          ) {
            this.$router.push(this.fun.getUrl("Inviter", {}, { fromGood: 1 }));
            return;
          }
          if (!this.isAddCart) {
            return;
          }
          if (!this.isGoods) {
            Toast("商品已下架或不存在");
            return;
          }

          //是o2o商品
          if (this.is_o2o) {
            this.addCartByO2O();
            return;
          }

          submitActionTag = SUBMIT_ACTION_CART;

          //判断是否有规格

          if (this.goodsInfo.has_option == 1) {
            //有规格
            this.popupSpecs = true;
            if (!optionsId) {
              // 默认选择第一个
              for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
                this.goodsInfo.has_many_specs[i].description = this.goodsInfo.has_many_specs[i].specitem[0];
                this.selectSpecs(this.goodsInfo.has_many_specs[i].specitem[0]);
              }
            }
          } else {
            //无规格
            //处理参数
            optionsId = "";
            this.addCartRequest(goods_id, optionsId, this.goodsCount);
          }
        }
      });
    },

    //加入购物车 o2o
    addCartByO2O() {
      let that = this;
      if (this.fun.isTextEmpty(this.$route.params.store_id)) {

        this.$dialog.alert({ message:"门店参数错误"});
        return;
      }
      let store_id = this.$route.params.store_id;
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.store", {
          goods_id: goods_id,
          total: 1,
          store_id: store_id
        })
        .then(
          response => {
            if (response.result == 1) {
              Toast(response.msg);
              that.$router.go(-1);
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          response => {
            that.$dialog.alert({message:response.msg});

          }
        );
    },

    //立即购买
    buyNow() {
      if (this.isBegTime) {
        Toast("该商品还没到购买时间");
        return false;
      }
      //价格权限
      if (
        this.goodsInfo.vip_level_status &&
        this.goodsInfo.vip_level_status.status == 1
      ) {
        Toast(this.goodsInfo.vip_level_status.tips);
        return false;
      }
      if (this.goods_type === "appointment_goods") {
        submitActionTag = "appointment_goods";
      } else {
        submitActionTag = SUBMIT_ACTION_BUY;
      }
      $http.get("member.member.isValidatePageGoods", {}).then(
        response => {
          if (response.result === 1) {
            if (
              this.goodsInfo.has_one_invite_page &&
              this.goodsInfo.has_one_invite_page.status === 1 &&
              response.data.is_invite === 0
            ) {
              this.$router.push(
                this.fun.getUrl("Inviter", {}, { fromGood: 1 })
              );
              return;
            }
            if (!this.isGoods) {
              Toast("商品已下架或不存在");
              return;
            }
            //判断是否有规格

            if (this.goodsInfo.has_option == 1) {
              //有规格 但是还未选择
              this.popupSpecs = true;
              if (!optionsId) {
                // 默认选择第一个
                for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
                  this.goodsInfo.has_many_specs[
                    i
                  ].description = this.goodsInfo.has_many_specs[i].specitem[0];
                  this.selectSpecs(
                    this.goodsInfo.has_many_specs[i].specitem[0]
                  );
                }
              }
            }
            // else if (
            //   this.goodsInfo.has_option == 1 &&
            //   !this.fun.isTextEmpty(optionsId)
            // ) {
            //   //有规格 但是已选择
            //
            //   if (this.goodsCount <= 0) {
            //     this.popupSpecs = true;
            //     return;
            //   }
            //   //处理参数
            //   this.buyNowRequest(goods_id, optionsId, this.goodsCount);
            // }
            else if (this.goodsInfo.has_option == 0) {
              //无规格
              //新处理 显示增加数量
              this.showPopView2();

              //处理参数
              //this.buyNowRequest(goods_id, optionsId, this.goodsCount);
            }
          } else {
            this.$dialog.alert({message:response.msg});

          }
        },
        response => {
          this.$dialog.alert({message:response.msg});

        }
      );
    },

    //提交确认
    submitAction() {
      if (specsManage.length < this.goodsInfo.has_many_specs.length) {
        // console.log(this.goodsDescription);
        this.popupSpecs = false;
        Toast(this.goodsDescription);
        return;
      }

      if (submitActionTag == SUBMIT_ACTION_CART) {
        //购物车网络处理
        this.popupSpecs = false;
        //处理参数
        // if(this.goodsCount<=0){
        //   this.popupSpecs = true;
        //   return
        // }
        this.addCartRequest(goods_id, optionsId, this.goodsCount);
      } else if (submitActionTag == SUBMIT_ACTION_BUY) {
        //立即购买处理
        this.popupSpecs = false;
        //处理参数

        // if(this.goodsCount<=0){
        //   this.popupSpecs = true;
        //   return
        // }
        this.buyNowRequest(goods_id, optionsId, this.goodsCount);
      }
    },

    //加入购物车网络操作
    addCartRequest(_goodsId, _optionsId, _total) {
      if (optionsMaxCount == 0) {
        //库存不足
        Toast("商品库存不足");
        return;
      }
      if (_total <= 0) {
        this.popupSpecs = false;
        Toast("请选择商品数量");
        return;
      }

      let that = this;
      let goods = [];
      goods.push(_goodsId);
      let jsons = {
        goods_ids: JSON.stringify(goods),
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中").then(
        function (response) {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog.confirm({ message: "购买跨境商品,请补充您的个人信息"})
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: "cart",
                      goodsId: _goodsId,
                      optionsId: _optionsId,
                      total: _total
                    })
                  );
                }).catch(() => {});
            } else {
              that.addCartReq(_goodsId, _optionsId, _total);
            }
          } else {
            console.log(response.msg);
          }
        },
        function (response) {
          console.log(response);
          that.isGoods = false;
        }
      );
    },

    addCartReq(_goodsId, _optionsId, _total) {
      if (this.isRent) {
        let json = { goods_id: _goodsId, total: _total, option_id: _optionsId };
        $http
          .get("plugin.lease-toy.api.member-cart.store", json, "添加中...")
          .then(response => {
            if (response.result == 1) {
              console.log("添加购物车成功");
              Toast(response.msg);
            } else {
              this.$dialog.alert({message:response.msg});
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        let that = this;
        let json = { goods_id: _goodsId, total: _total, option_id: _optionsId };
        $http.get("member.member-cart.store", json, "添加中...").then(
          function (response) {
            if (response.result == 1) {
              Toast(response.msg);
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function (response) {
            console.log(response);
          }
        );
      }
    },

    //立即购买网络操作
    buyNowRequest(_goodsId, _optionsId, _total) {
      if (optionsMaxCount == 0) {
        //库存不足
        Toast("商品库存不足");
        return;
      }
      if (_total <= 0) {
        Toast("请选择商品数量");
        return;
      }

      console.log(submitActionTag, "submitActionTag");

      //请求保税商品接口
      let that = this;
      let goods = [];
      goods.push(_goodsId);
      let jsons = {
        goods_ids: JSON.stringify(goods),
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中...").then(
        function (response) {
          if (response.result == 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog.confirm({ message: "购买此商品,请补充您的个人信息"})
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: submitActionTag,
                      goodsId: _goodsId,
                      optionsId: _optionsId,
                      total: _total
                    })
                  );
                }).catch(() => {});
            } else {
              //普通商品
              console.log(that.$route.params.activity_id);
              that.$router.push(
                that.fun.getUrl("goodsorder",{}, {
                  tag: submitActionTag,
                  goodsId: _goodsId,
                  optionsId: _optionsId,
                  total: _total,
                  activity_id: that.$route.params.activity_id,
                })
              );
              // 暂时只做普通商品的下单

            }
          } else {
            console.log(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //界面选择规格触发事件
    selectSpecs(data) {
      // var specid = data.specid; //对其他数据筛选 不筛选同级
      //console.log(specid);
      //处理选择池
      this.manageSpecs(data);

      //处理规格组合选择状态
      this.setGoodsSpecs(data);

      //设置选择规格后的 价格、照片、库存
      this.setGoodsSpecsChangeInfo();

      //判断当前购买总量与库存的关系
      this.getMaxCount();
    },

    //判断当前购买总量与库存的关系
    getMaxCount() {
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        // console.log(optionsMaxCount);
        // console.log(this.goodsCount);
        if (optionsMaxCount == 0) {
          //库存不足
          this.goodsCount = 0;
        }
        if (this.goodsCount > optionsMaxCount) {
          this.goodsCount = optionsMaxCount;
        }
      }
    },

    //设置选择规格后的 价格、照片、库存
    setGoodsSpecsChangeInfo() {
      //根据ID 排序 specsManage.sort();
      specsManage.sort(function (a, b) {
        return a.id - b.id;
      });
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        let goodsSpecs = "";
        for (let j = 0; j < specsManage.length; j++) {
          goodsSpecs += specsManage[j].id + "_";
        }
        goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"
        // console.log("goodsSpecs", goodsSpecs);
        for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
          if (
            goodsSpecs ==
            this.setGoodsSpecsBySort(this.goodsInfo.has_many_options[i].specs)
          ) {
            this.popPrice = this.goodsInfo.has_many_options[i].product_price; //设置价格
            this.popThumb = this.fun.isTextEmpty(
              this.goodsInfo.has_many_options[i].thumb
            )
              ? this.goodsInfo.thumb
              : this.goodsInfo.has_many_options[i].thumb; //设置图片
            this.popStock = this.goodsInfo.has_many_options[i].stock; //设置库存

            optionsId = this.goodsInfo.has_many_options[i].id; //设置规格ID，用于生成订单
            optionsMaxCount = this.goodsInfo.has_many_options[i].stock; //库存最大数 用于切换更改买家购买数量
            if (optionsMaxCount > 0) {
              this.goodsCount = 1;
            }

            break;
          }
        }
      }
    },

    //处理商品goodsSpecs 并排序 新方法
    setGoodsSpecsBySort(specs) {
      let _specs = specs.split("_"); //先变成数组
      //_specs.sort();//排序
      _specs.sort(function (a, b) {
        return a - b;
      });

      // 在组装回去
      let goodsSpecs = "";
      for (let j = 0; j < _specs.length; j++) {
        goodsSpecs += _specs[j] + "_";
      }
      goodsSpecs = goodsSpecs.substring(0, goodsSpecs.length - 1); //处理"_"

      return goodsSpecs;
    },

    //处理选择池
    manageSpecs(data) {
      var specsObject = {};
      specsObject.id = data.id;
      specsObject.specid = data.specid;
      specsObject.title = data.title;

      if (specsManage.length > 0) {
        for (let i = 0; i < specsManage.length; i++) {
          if (specsManage[i].specid == specsObject.specid) {
            specsManage.splice(i, 1);
          }
        }
        specsManage.push(specsObject);
      } else {
        specsManage.push(specsObject);
      }

      //排序
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        var newSpecsManage = [];
        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id == specsManage[j].specid) {
              newSpecsManage.push(specsManage[j]);
              break;
            }
          }
        }
        specsManage = newSpecsManage;
      }
      this.setGoodsDescription();
    },

    //处理goodsDescription 数据
    setGoodsDescription() {
      var description = "";
      //相等代表全选了 体现语句
      if (specsManage.length == this.goodsInfo.has_many_specs.length) {
        description = "已选择 ";
        for (let i = 0; i < specsManage.length; i++) {
          description += specsManage[i].title + " ";
        }
        this.goodsDescription = description;
      } else {
        description = "请选择 ";

        for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
          for (let j = 0; j < specsManage.length; j++) {
            if (this.goodsInfo.has_many_specs[i].id != specsManage[j].specid) {
              description += this.goodsInfo.has_many_specs[i].title + " ";
              break;
            }
          }
        }
        this.goodsDescription = description;
      }
    },

    //处理规格组合选择状态 过滤数据
    setGoodsSpecs(specs) {
      for (let i = 0; i < this.goodsInfo.has_many_specs.length; i++) {
        if (specs.specid != this.goodsInfo.has_many_specs[i].id) {
          this.setGoodsSpecsStatus(
            this.goodsInfo.has_many_specs[i].specitem,
            specs.id
          );
        }
      }
    },

    //处理规格组合选择状态 处理状态 specitem 组合数组(未选中的) id当前选中的ID 根据ID 组合算是否有当前组合
    setGoodsSpecsStatus(specitem, id) {
      // console.log(specitem);
      // console.log(id);
      let options = []; //数据池

      for (let i = 0; i < this.goodsInfo.has_many_options.length; i++) {
        // console.log(this.goodsInfo.has_many_options[i].specs);
        let _specs = this.goodsInfo.has_many_options[i].specs.split("_");
        //console.log(_specs);
        //判断是否包含
        for (let j = 0; j < _specs.length; j++) {
          if (_specs[j] == id) {
            options.push(this.goodsInfo.has_many_options[i]);
            return;
          }
        }
      }

      //关键处理方式 后期要优化 效率低
      for (let m = 0; m < options.length; m++) {
        let _specs = options[m].specs.split("_");
        for (let y = 0; y < _specs.length; y++) {
          if (_specs[y] != id && options[m].stock == 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = true;
                return;
              }
            }
          } else if (_specs[y] != id && options[m].stock > 0) {
            for (let n = 0; n < specitem.length; n++) {
              if (_specs[y] == specitem[n].id) {
                specitem[n].c = false;
                return;
              }
            }
          }
        }
      }

      console.log(options);
    },

    //增加
    addGoods() {
      console.log("增加");
      if (
        specsManage.length == this.goodsInfo.has_many_specs.length &&
        this.goodsCount == optionsMaxCount
      ) {
        console.log("数量超出范围");
        Toast("库存不足");
        console.log("max=" + this.goodsCount);
        return;
      }
      this.goodsCount++;
    },

    //减少
    reduceGoods() {
      if (this.goodsCount == 1 || this.goodsCount == 0) {
        return;
      }
      this.goodsCount--;
    },

    //判断是否收藏
    isFavorite() {
      let that = this;
      let json = {
        goods_id: goods_id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.isFavorite", json).then(
        function (response) {
          if (response.result === 1) {
            //已收藏
            that.favorite = response.data.status == 1 ? true : false;
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //收藏操作
    onFavorite(isFavorite) {
      if (!this.isGoods) {
        Toast("商品已下架或不存在");
        return;
      }
      isFavorite ? this.removeFavorite() : this.addFavorite();
      // console.log(isFavorite,'isFavorite');
    },

    //添加收藏
    addFavorite() {
      console.log("addFavorite");
      let that = this;
      let json = {
        goods_id: goods_id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.store", json, "处理中...").then(
        function (response) {
          if (response.result == 1) {
            that.favorite = true;
            Toast("收藏成功");
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //移除收藏
    removeFavorite() {
      let that = this;
      let json = {
        goods_id: goods_id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.destroy", json, "处理中...").then(
        function (response) {
          if (response.result == 1) {
            that.favorite = false;
            Toast("取消收藏");
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //足迹记录 弃用
    // footSet(_goods_id, _store_id) {
    //   if (!this.isGoods) {
    //     return;
    //   }
    //
    //   let json = {
    //     goods_id: _goods_id,
    //     mid: this.fun.getKeyByMid(),
    //     owner_id: _store_id,
    //     mark: this.fun.getKey("mark"),
    //     mark_id: this.fun.getKey("mark_id")
    //   };
    //   $http.get("member.member-history.store", json).then(
    //     function (response) {
    //       if (response.result === 1) {
    //       }
    //     },
    //     function (response) {
    //       console.log(response);
    //     }
    //   );
    // },

    //初始化分享设置
    initShare() {
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl,
        mid: this.fun.getKeyByMid(),
        goods_id: goods_id
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            // var cs = data.shop.cservice;
            if (response.data.config) {
              this.share(response.data);
            }
            if (!this.fun.isTextEmpty(response.data.shop)) {
              this.initCservice(response.data.shop.cservice); //重新赋值
            }
            // else {
            //   $http
            //     .get(
            //       "plugin.area-store.frontend.store.get-costom-service-by-store-id",
            //       { as_id: this.zoneId }
            //     )
            //     .then(response => {
            //       if (response.result === 1) {
            //         this.initCservice(response.data.link);
            //       } else {
            //         console.log(cs);
            //         this.initCservice(cs);
            //       }
            //     });
            // }
          } else {
            console.error(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appSharesinit();
        return;
      }
      this.$dialog.alert({ message:"请点击右上角微信分享"});

    },
    //app获取分享数据
    appSharesinit() {
      var that = this;
      var _url = document.location.href;
      var json = {
        url: _url,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function (response) {
          if (response.result == 1) {
            that.appShare(response.data);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      var that = this;
      var _title = that.fun.isTextEmpty(
        that.goodsInfo.has_one_share.share_title
      )
        ? that.goodsInfo.title
        : that.goodsInfo.has_one_share.share_title;
      var _link = document.location.href + "&share_tag=2";
      _link = that.fun.isMid(_link, data.info.uid);

      var _imgUrl = that.fun.isTextEmpty(
        that.goodsInfo.has_one_share.share_thumb
      )
        ? that.goodsInfo.thumb
        : that.goodsInfo.has_one_share.share_thumb;
      var _desc = that.fun.isTextEmpty(that.goodsInfo.has_one_share.share_desc)
        ? data.shop.shop.name
        : that.goodsInfo.has_one_share.share_desc;
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {
        let _title = "";
        let _imgUrl = "";
        let _desc = "";
        if (that.fun.isTextEmpty(that.goodsInfo.has_one_share)) {
          //返回的goodsInfo.has_one_share数据中没有相应对象
          _title = that.goodsInfo.title;
          _imgUrl = that.goodsInfo.thumb;
          _desc = data.shop.shop.name;
        } else {
          _title = that.fun.isTextEmpty(
            that.goodsInfo.has_one_share.share_title
          )
            ? that.goodsInfo.title
            : that.goodsInfo.has_one_share.share_title;
          _imgUrl = that.fun.isTextEmpty(
            that.goodsInfo.has_one_share.share_thumb
          )
            ? that.goodsInfo.thumb
            : that.goodsInfo.has_one_share.share_thumb;
          _desc = that.fun.isTextEmpty(that.goodsInfo.has_one_share.share_desc)
            ? data.shop.shop.name
            : that.goodsInfo.has_one_share.share_desc;
        }

        //let _link = document.location.href + "&mid=" + data.info.uid + "&share_tag=2";
        //let _link = location.protocol+'//'+location.host+location.pathname +'?i='+ that.fun.getKeyByI() +"&type=" +that.fun.getTyep()+ "&mid=" + data.info.uid + "&share_tag=2";

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });
      });
    },

    //初始化商品详情参数
    initData() {
      this.service_mobile = '';
      this.service_QRcode = '';
      this.show1 = false;
      this.cservice = '';
      this.firstActivityCon = "";
      this.openVip = "2";
      // currentTabIndex = "0";
      // is_first_content = false;
      // is_second_content = false;
      is_third_content = false;

      this.firstActivityCon = "";
      this.first_content = "";
      this.second_content = "";
      this.third_content = [];
      this.activeName = "first";
      this.show = true;

      this.isAddCart = false;

      this.posterImg = {};

      this.isRentBuyShow = false;
      this.beginTime = 0;

      this.endTime = 0;

      this.endTimeStr = "";

      this.isBuy = false;
      this.cartsNum = 0;

      this.carts = [];
      this.isBegTime = false;
      this.showPageB = false;
      this.isPullUp = false;
      this.cartsTotal = 0.0;
      this.goodsCarts = [];
      this.recordsList = [];

      if (
        !this.fun.isTextEmpty(this.$route.params.tag) &&
        this.$route.params.tag == "o2o"
      ) {
        this.init();
      }

      //this.getCartId();
    },

    //获取评论数据
    getCommentData() {
      let that = this;
      let json = {
        goods_id: goods_id,
        page: this.commentPage,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      // console.log(json);
      $http.get("goods.comment.get-comment", json, "获取中...").then(
        function (response) {
          if (response.result === 1) {
            if (response.data.data.length < 20) {
              that.noMoreComment = true;
            }
            that.commentPage += 1;
            if (!that.third_content) {
              that.third_content = [];
            }
            that.third_content = [...that.third_content, ...response.data.data];
            that.showComment = true;
            is_third_content = true;
            that.$emit("showComment", true);
            // that.third_content = response.data.data;
          } else {
            is_third_content = false; //复位
          }
        },
        function (response) {
          is_third_content = false; //复位
          console.log(response);
        }
      );
    },
    //跳转评论详情
    toContentInfo(data) {
      //this.$router.push({ name: "CommentDetails", params: { order_id: data.order_id, goods_id: data.goods_id, uid: data.uid }, query: { i: this.toi } });
      this.$router.push(
        this.fun.getUrl("CommentDetails", {
          order_id: data.order_id,
          goods_id: data.goods_id,
          comment_id: data.id,
          uid: data.uid
        })
      );
    },

    //跳转购物车
    gotoCart() {
      //this.$router.push({ name: "cart", params: {}, query: { i: this.toi } });
      this.$router.push(this.fun.getUrl("home", {}));
    },

    gotoCart1() {
      this.$router.push(this.fun.getUrl("cart", {}));
    },
    //跳转个人中心
    gotoMember() {
      //this.$router.push({ name: "member", params: {}, query: { i: this.toi } });
      this.$router.push(this.fun.getUrl("member", {}));
    },

    //判断是否能加入购物车
    setIsAddCart() {
      //为空是老数据默认值问题
      if (
        this.fun.isTextEmpty(this.goodsInfo.buy_way) ||
        this.goodsInfo.buy_way == "0"
      ) {
        this.isAddCart = true;
      }

      //不能加入 金币产品
      if (this.goodsInfo.buy_way == 1) {
        this.isAddCart = false;
      }
    },

    //无规格选择 增加数量
    showPopView2() {
      this.popupSpecs2 = true;
    },

    hidePopView2() {
      this.popupSpecs2 = false;
    },

    //新处理立即购买
    buyNowNew() {
      this.hidePopView2();
      //处理参数

      this.buyNowRequest(goods_id, optionsId, this.goodsCount);
    },

    //是否有爱心值
    setIsLove() {
      if (this.goodsInfo.goods_love) {
        this.isGoodsLove = true;
        let love_cash =
          this.goodsInfo.price -
          this.goodsInfo.goods_love.love_coin.amountOfMoney;
        this.goods_love_cash = Number(
          love_cash.toString().match(/^\d+(?:\.\d{0,2})?/)
        );
        //this.goods_love_cash = (this.goodsInfo.price - this.goodsInfo.goods_love.love_coin.amountOfMoney);
        this.goods_love_deduction = this.goodsInfo.goods_love.love_coin.amountOfCoin;
        this.goods_love_name = this.goodsInfo.goods_love.love_coin.name;
      } else {
        this.isGoodsLove = false;
      }
    },

    getLiveList(more) {
      let that = this;
      if (!this.isLoadMore) {
        return;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (more && this.live_page >= this.total_page) {
        that.showMoreLive = false;
        console.log("没有更多直播间数据！");
        return;
      } else {
        that.live_page = more ? that.live_page + 1 : 1;
        $http.post("goods.goods.get-room", { goods_id: that.$route.params.id, page: that.live_page }, "").then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            if (!more && that.total_page >= 2) {
              that.showMoreLive = true;
            }
            that.recordsList = [...that.recordsList, ...response.data.data];
          } else {
            Toast(response.msg);
          }
        })
          .catch(error => {
            console.log(error);
          });
      }
    },

    //跳转优惠券领取
    gotoCoupon() {
      this.$router.push(this.fun.getUrl("couponStore"));
    },
    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg.base64Image)) {
        this.posterShow = true;
      } else {
        let toastPoster = Toast({
          duration: -1, // 持续展示 toast
          message: '正在为您生成海报中'
        });
        $http
          .get(
            "goods.goods-poster.generate-goods-poster",
            { id: this.$route.params.id },
            ""
          )
          .then(response => {
            toastPoster.clear();
            if (response.result == 1) {
              this.posterImg = response.data;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$dialog.alert({message:response.msg});

            }
          })
          .catch(error => {
            toastPoster.clear();
            console.log(error);
          });
      }
    },

    activityShowFun() {
      this.activityShow = true;
    },

    //显示商城活动默认活动
    showDefaultActivity(val) {
      if (val.first_strip_key == "coupon") {
        this.firstActivityBtn = "购买返券";
        this.firstActivityCon = "商品订单完成返优惠券";
      } else if (
        val.first_strip_key == "deduction_proportion" ||
        val.first_strip_key == "award_proportion"
      ) {
        this.firstActivityBtn = val.love_name;
        this.firstActivityCon =
          "最高抵扣" +
          val.love_name +
          val.deduction_proportion +
          ",购买赠送" +
          val.award_proportion +
          val.love_name;
      } else if (
        val.first_strip_key == "max_point_deduct" ||
        val.first_strip_key == "point"
      ) {
        this.firstActivityBtn = val.point_name;
        this.firstActivityCon =
          "最高抵扣" +
          val.point_name +
          val.max_point_deduct +
          ",购买赠送" +
          val.point +
          val.point_name;
      } else if (val.first_strip_key == "ed_full") {
        this.firstActivityBtn = "满减";
        this.firstActivityCon =
          "本商品满" + $i18n.t('money') + val.ed_full + "立减" + $i18n.t('money') + val.ed_reduction + "";
      } else if (
        val.first_strip_key == "ed_money" ||
        val.first_strip_key == "ed_num"
      ) {
        this.firstActivityBtn = "包邮";
        if (val.first_strip_key == "ed_money" && val.ed_num == 0) {
          this.firstActivityCon = "本商品满" + $i18n.t('money') + val.ed_money + "元包邮";
        } else if (val.first_strip_key == "ed_num" && val.ed_money == 0) {
          this.firstActivityCon = "本商品满" + val.ed_num + "件包邮";
        } else {
          this.firstActivityCon =
            "本商品满" + $i18n.t('money') +
            val.ed_money +
            "元包邮" +
            ",满" +
            val.ed_num +
            "件包邮";
        }
      } else if (val.first_strip_key == "award_balance") {
        this.firstActivityBtn = "余额";
        this.firstActivityCon = "购买赠送余额" + val.award_balance + "元";
      } else if (val.first_strip_key == "commission_show") {
        this.firstActivityBtn = "分销佣金";
        if (val.commission_show_level == "1") {
          this.firstActivityCon = "一级佣金:" + val.first_commission + "元";
        } else if (val.commission_show_level == "2") {
          this.firstActivityCon =
            "一级佣金:" +
            val.first_commission +
            "元" +
            " " +
            "二级佣金:" +
            val.second_commission +
            "元";
        } else if (val.commission_show_level == "3") {
          this.firstActivityCon =
            "一级佣金:" +
            val.first_commission +
            "元" +
            " " +
            "二级佣金:" +
            val.second_commission +
            "元" +
            " " +
            "三级佣金:" +
            val.third_commission +
            "元";
        }
      } else {
        return;
      }
    },

    //推广商品跳转
    pushGoodGoto(val) {
      if (val.is_course == 1) {
        this.$router.push(
          this.fun.getUrl("CourseDetail", { id: val.id })
        );
      } else if (val.is_course == 0) {
        this.$router.push(this.fun.getUrl("goods", { id: val.id }));
      } else {
        return;
      }
    },

    o2oCart() {
      this.o2oCartShow = true;
    },

    o2oGotoOrder() {
      this.o2oCartShow = false;

      if (this.fun.isTextEmpty(this.$route.params.store_id)) {
        this.$dialog.alert({message:"门店参数错误"});
        return;
      }

      if (this.goodsCount == 0 && this.goodsCount < 0) {
        this.$dialog.alert({message:"数量不能小于1"});
        return;
      }

      let store_id = this.$route.params.store_id;
      $http
        .get("plugin.store-cashier.frontend.shoppingCart.member-cart.store", {
          goods_id: goods_id,
          total: this.goodsCount,
          store_id: store_id
        })
        .then(response => {
          if (response.result === 1) {
            this.$router.push(
              this.fun.getUrl("goodsorder",{}, {
                store_id: this.$route.params.store_id,
                tag: "store"
              })
            );
          } else {
            this.$dialog.alert({message:response.msg});

          }
        }),
      response => {
        this.$dialog.alert({message:response.msg});

      };
    },

    goShowCart() {
      if (!this.showCart && this.cartsNum > 0) {
        this.showCart = true;
      } else {
        this.showCart = false;
      }
    },

    getCart(goods) {
      var that = this;
      // console.log("getCart...");
      // console.log("goods...", goods);
      that.cartsNum = 0;
      that.cartsTotal = 0;
      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.index",
          { store_id: this.$route.params.store_id },
          "加载中..."
        )
        .then(response => {
          if (response.result == 1) {
            that.carts = response.data;
            that.goodsCarts = [];
            that.carts.forEach(item => {
              this.$set(that.goodsCarts, item.goods_id, item);
              if (goods && goods.id == item.goods_id) {
                goods.buyNum = item.total;
              }
              that.cartsNum += item.total;

              // console.log(that.cartsNum);

              // console.log(item);
              that.cartsTotal += item.total * item.goods.price;
            });

            //计算当前商品数量

            // console.log(that.carts);

            let good = that.carts.find(
              item => item.goods_id == this.$route.params.id
            );
            // console.log(good);
            if (good == undefined) {
              that.o2oCount = 0;
            }
            that.carts.forEach(item => {
              if (item.goods_id == this.$route.params.id) {
                that.o2oCount = item.total;
                console.log(item.id);
              }
            });

            that.cartsTotal = parseFloat(that.cartsTotal).toFixed(2);
            // console.log("cart.result", response.data);
            // console.log("goodsCarts...", that.goodsCarts);

            //获取购物车id
          } else {
            //Toast("请输入提货人信息");
            //return;
          }
        }),
      response => {
        //alert('网络错误，请稍后再试！')
      };
    },

    updateCart(id, num) {
      // console.log("reduceCart...");
      // console.log("cart...", this.carts);
      // console.log("cart id...", id);
      if (num < 0) {
        var total = 0;
        this.carts.forEach(item => {
          if (item.goods_id == id) {
            total = item.total;
          }
        });
        // console.log(total + num);
        if (total + num <= 0) {
          this.delItemByCart(id);
          return;
        }
      }
      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.updateNum",
          {
            num: num,
            store_id: this.$route.params.store_id,
            goods_id: id
          },
          "加载中..."
        )
        .then(response => {
          if (response.result == 1) {
            // console.log("response.result", response.result);
            this.getCart();
          } else {
            this.$dialog.alert({message:response.msg});

          }
        }),
      response => { };
    },

    delItemByCart(cart_id) {
      var that = this;
      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.destroy",
          {
            store_id: this.$route.params.store_id,
            goods_id: cart_id
          },
          "删除中..."
        )
        .then(response => {
          if (response.result == 1) {
            that.getCart();

            //that.getCartId();
            that.showCart = false;
          } else {
            that.$dialog.alert({message:response.msg});
            //alert('无商品');

          }
        }),
      response => {
        //alert('网络错误，请稍后再试！')
      };
    },

    addCart1(goods) {
      // console.log("addcart...");
      $http
        .get(
          "plugin.store-cashier.frontend.shoppingCart.member-cart.store",
          {
            goods_id: goods.id,
            total: 1,
            store_id: this.$route.params.store_id
          },
          "加载中..."
        )
        .then(response => {
          if (response.result == 1) {
            //goods.buyNum += 1;
            // console.log("response.result", response.result);
            this.getCart();
          } else {
            this.$dialog.alert({message:response.msg});
            //alert('无商品');

          }
        }),
      response => {
        //alert('网络错误，请稍后再试！')
      };
    },

    //获取购物车id
    // getCartId(){
    //   $http.get("plugin.store-cashier.frontend.shoppingCart.member-cart.getCartId",{goods_id:this.$route.params.id,store_id:this.$route.params.store_id}).then(response =>{
    //     console.log(response);
    //     if(response.result == 1){
    //       this.card_id=response.data.cart_id;

    //       this.getCart();
    //     }
    //   }).catch(error =>{
    //     console.log(error);
    //   })
    // },

    init() {
      $http
        .get(
          "plugin.store-cashier.frontend.store.get-store-info.get-info-by-store-id",
          { store_id: this.$route.params.store_id }
        )
        .then(response => {
          if (response.result == 1) {
            this.getCart();
            this.o2oName = response.data.store_name;
            this.o2oPhone = "tel:" + response.data.store_mobile;
            this.o2oLat = response.data.lat;
            this.o2oLng = response.data.lng;
            // console.log(this.o2oPhone);
          }
        },
        response => {
          //alert('网络错误，请稍后再试！')
        });
    },

    goodsOrder(val) {
      // console.log(this.carts);
      let sum = 0;

      this.carts.forEach(val => {
        sum += val.total;
      });

      if (sum == 0) {
        return;
      }

      if (val.length == 0 || this.carts.length == 0) {
        return;
      } else {
        this.$router.push(
          this.fun.getUrl("goodsorder",{}, {
            store_id: this.$route.params.store_id,
            tag: "store"
          })
        );
      }
    },

    //全选
    lg() {
      console.log("lg");
    },

    //选中 取消
    checkCart(id) {
      console.log(id);
    },

    goToAdress() {
      let point = this.fun.bd_decrypt(this.o2oLng, this.o2oLat);
      this.fun.goToWXAdress(point, this.o2oName, "详细地址");
    },

    //获取时间-限时购
    timeCompare(begin) {
      let beginTime = new Date(parseInt(begin) * 1000);

      let now = new Date();

      if (now >= beginTime) {
        this.isTime = true;
      } else {
        this.isTime = false;
        this.isBegTime = true;
        this.begTimeStr = String(beginTime);
      }
    },

    //品牌跳转
    toBrandDetail(val) {
      this.$router.push(this.fun.getUrl("GoodsBrand", { id: val }));
    },

    //租赁立即购买

    toRentBuy(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },
    gotoMemberGradeList(o) {
      if (o == '1') {
        this.$router.push(this.fun.getUrl("MemberGradeList", {}));
      }
    },

    //倒计时callback

    timeUp() {
      // if(this.timeLimit){
      // }
    },

    gotoList() {
      this.$router.push(
        this.fun.getUrl("o2oStore_v2", {
          store_id: this.$route.params.store_id
        })
      );
    },

    move(event) {
      // 判断默认行为是否可以被禁用
      if (event.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!event.defaultPrevented) {
          event.preventDefault();
        }
      }
    },
    begTimeBtn() {
      this.isTime = true;
      this.isBegTime = false;
    },

    //==========================================================================================================
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop + 55;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    },
    throttleFn() {
      // 节流
      let that = this;
      let interval = 100;
      that.now = +new Date();
      if (that.last && that.now - that.last < interval) {
        clearTimeout(that.timer);
        that.timer = setTimeout(() => {
          that.last = that.now;
          that.dataScroll();
        }, interval);
      } else {
        that.last = that.now;
        that.dataScroll();
      }
    },
    handleTouchstart(e) {
      start = e.changedTouches[0].pageY;
    },
    handleTouchmove(e) {
      const cur_move = e.changedTouches[0].pageY - start;
      const move_distance = last_distance + cur_move;
      if (last_distance > 0) {
        this.isPullUp = false;
        document.getElementById(
          "main"
        ).style.cssText = `transition-duration:400ms;transform:translateY(0);`;
        last_distance = 0;
      } else if (move_distance < 0 && move_distance > -(0 + 65)) {
        document.getElementById(
          "main"
        ).style.cssText = `transition-duration:0ms;transform:translateY(${move_distance}px);`;
        this.isPullUp = false;
      } else if (move_distance <= -(0 + 65)) {
        document.getElementById(
          "main"
        ).style.cssText = `transition-duration:0ms;transform:translateY(${move_distance}px);`;
        this.isPullUp = true;
      }
    },
    handleTouchend(e) {
      const cur_move = e.changedTouches[0].pageY - start;
      last_distance += cur_move;
      document.getElementById(
        "main"
      ).style.cssText = `transition-duration:400ms;transform:translateY(0);`;
      if (last_distance > 0) {
        this.isPullUp = false;

        last_distance = 0;
      } else if (last_distance < 0 && last_distance > -(0 + 65)) {
        this.isPullUp = false;
        last_distance = 0;
      } else if (last_distance <= -(0 + 65)) {
        //切换到下一个页面
        console.log("切换到下一个页面");
        document
          .getElementById("main")
          .removeEventListener("touchstart", this.handleTouchstart);
        document
          .getElementById("main")
          .removeEventListener("touchmove", this.handleTouchmove);
        document
          .getElementById("main")
          .removeEventListener("touchend", this.handleTouchend);
        last_distance = 0;
        if (!this.showPageB) {
          this.getDetailData();
        }
      }
    },
    dataScroll() {
      this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      //滚动事件触发
      if ( this.getScrollTop() + this.getClientHeight() + 105 >  this.getScrollHeight() ) {
        //此处发起请求
        if (!this.showPageB) {
          console.log("触底了");
          document
            .getElementById("main")
            .addEventListener("touchstart", this.handleTouchstart);
          document
            .getElementById("main")
            .addEventListener("touchmove", this.handleTouchmove);
          document
            .getElementById("main")
            .addEventListener("touchend", this.handleTouchend);
        }
      } else {
        document
          .getElementById("main")
          .removeEventListener("touchstart", this.handleTouchstart);
        document
          .getElementById("main")
          .removeEventListener("touchmove", this.handleTouchmove);
        document
          .getElementById("main")
          .removeEventListener("touchend", this.handleTouchend);
      }
    },
    jump(index) {
      if (index == 2 && !this.showPageB) {
        this.getDetailData(true);
        return;
      }
      setTimeout(() => {
        this.$nextTick(() => {
          let jump = document.getElementsByClassName("section");
          // 获取需要滚动的距离
          let total = jump[index].offsetTop - 50;
          // Chrome
          document.body.scrollTop = total;
          // Firefox
          document.documentElement.scrollTop = total;
          // Safari
          window.pageYOffset = total;
        });
      }, 20);
    },
    loadSroll() {
      let that = this;
      var sections = document.getElementsByClassName("section");
      for (let i = sections.length - 1; i >= 0; i--) {
        if (that.scroll >= sections[i].offsetTop - 100) {
          that.currentClass = i;
          return;
        }
      }
    },
    FromTo(data) {
      // this.$router.push(this.fun.getUrl("GoodsComment", { id: goods_id }));
      if (!is_third_content) {
        this.getCommentData();
      } else {
        this.showComment = true;
        this.$emit("showComment", true);
      }
    },
    CloseComment() {
      this.showComment = false;
      this.$emit("showComment", false);
    },
    getJHSupplier() {
      //聚合供应链的商品 根据用户默认地址判断是否有库存可购买，如果没库存不满足购买条件可提示或下单按钮灰色。
      $http
        .get(
          "plugin.jd-supply.frontend.goods.option",
          { goods_id: goods_id }
        )
        .then(response => {
          if (response.result == 1) {
            let options_address = response.data;
            this.getArrEqual(options_address, this.goodsInfo.has_many_options);
          }
        },
        response => {
          //alert('网络错误，请稍后再试！')
        });
    },
    getArrEqual(arr1, arr2) {
      //聚合供应链的商品，plugin.jd-supply.frontend.goods.option接口返回为1的才去取库存，返回为0的就库存直接是0
      let that = this;
      for (let i = 0; i < arr2.length; i++) {
        if (arr1[arr2[i].id] == 0) {
          that.goodsInfo.has_many_options[i].stock = 0;
        }
      }
      this.popStock = this.goodsInfo.has_many_options[0].stock; //设置库存
    }
  },

  watch: {
    // $route(to, from) {
    //   let a = to;
    //   console.log(to);
    //   // 对路由变化作出响应...
    //   if(to.name=="goods" && from.name=="goods"){
    //     this.slider();
    //     this.toi = this.fun.getKeyByI();
    //     this.goodTop = false;
    //     if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
    //       share_tag = this.fun.getKey("share_tag");
    //     }
    //     //初始化一下参数
    //     this.goodsInfo = {};
    //     this.isGoods = false;
    //     this.goodsCount = 1;
    //     this.popupSpecs = false;
    //     this.popupSpecs2 = false;
    //     this.isGoodsLove = false;
    //     submitActionTag = "";
    //     optionsId = "";
    //     specsManage = [];
    //     optionsMaxCount = 1;
    //     this.cartsNum=0;
    //     goods_id = this.$route.params.id;
    //     console.log('watch:', goods_id);
    //     if (!this.fun.isTextEmpty(this.$route.params.tag) && this.$route.params.tag == "o2o") {
    //       this.is_o2o = true;
    //     } else {
    //       this.is_o2o = false;
    //     }
    //     //初始化客服参数
    //     this.initCservice("");
    //     //商品详情 初始化参数
    //     this.initData();
    //     this.getData();//获取数据
    //     this.isFavorite();//获取是否收藏
    //     this.footSet(goods_id);//设置足迹数据
    //   }
    // }
    scroll() {
      this.loadSroll();
    },
    touchClose: function (newVal, oldVal) {
      this.showComment = newVal;
    }
  },

  components: { Swipe, SwipeItem, cMyswipe, cComment, cCommentlist, cLive },

  computed: {
    minicartStyle: function () {
      if (this.showCart) {
        return "display: block;transform: translateY(-100%)";
      }
    },
    leftPrice() {
      if (this.showCart) {
        return "transform: translateX(-60px);";
      }
    },
    showLogo: function () {
      if (this.showCart) {
        return "show";
      }
    }
  }
};
