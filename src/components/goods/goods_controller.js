// import { mapState } from 'vuex';
import { Toast } from "vant";
import cComment from "components/goods/children/comment";
import cCommentlist from "components/goods/children/commentList";
import cFreightpricing from "components/goods/children/freightPricing";
import cLive from "components/goods/children/liveList";
import floatOrder from "components/goods/children/float_order";
import U_backup from "components/new_diy/backup";
import invitation from "components/goods/children/invitation";
// import BScroll from 'better-scroll';

import goodSwipe from "components/goods/children/goodSwipe"; //轮播
import countDown from "components/goods/children/countDown"; //倒计时
import priceTitleRepertorySales from "components/goods/children/priceTitleRepertorySales"; //标题。价格
import memberDiscount from "components/goods/children/member_discount"; //会员折扣
import selfParameterServicetag from "components/goods/children/selfParameterServicetag"; //商品挂件列表
import goodSpecs from "components/goods/children/goodSpecs"; //规格弹窗
import appointmentPlugin from "components/goods/children/plugin/appointment"; //预约商品
import goodsAction from "components/goods/children/goodsAction"; //商品导航
import goodStep from "components/goods/children/goodStep"; //玩法步骤
import groupList from "components/goods/children/plugin/groupList"; //开团列表
import fixedPrice from "components/goods/children/plugin/fixedPrice"; //一口价插件
import prdocutMarket from "components/goods/children/plugin/prdocutMarket"; //应用插件
import supplierModel from "components/goods/children/plugin/supplierModel"; //供应商插件
import o2oModel from "components/goods/children/plugin/o2oModel"; //门店信息插件（门店拼团）
import snatchRegimentList from "components/goods/children/plugin/snatchRegimentList"; //抢团插件，抢团开团列表
import guessLike from "components/goods/children/guessLike"; //猜你喜欢
import producerM from "components/goods/children/plugin/producerM"; //厂家管理插件
import zhpGroup from "components/goods/children/plugin/zhp-group-lottery"; //厂家管理插件
import grabGroupResult from "components/goods/children/plugin/grabGroupResult"; //抢团结果流程步骤
import participateHistory from "components/goods/children/participateHistory"; // 参与记录
import projectCard from "components/goods/children/plugin/projectCard"; //项目核销插件
import groupWork from "components/goods/children/plugin/groupWork"; //0.1元新拼团

// var specsManage = []; //选择池 用于排序
// var optionsId = ""; //选择后的 规格ID
// var optionsMaxCount = 1;
// const SUBMIT_ACTION_CART = "-1"; //添加到购物车
// const SUBMIT_ACTION_BUY = "-2"; //立即购买
// var submitActionTag = "";

var goods_id = "";

var share_tag = "-1";
//商品详情
var is_third_content = false;

// var start = 0;
// var last_distance = 0;
import { tabScroll } from "components/goods/children/mixin/tabScroll"; //计算顶部导航
export default {
  props: ["goods_id", "goods_type", "goods_info", "is_room", "wx_video_link","fatherTitle"],
  mixins: [tabScroll], //
  provide: function() {
    return {
      goods_type: this.goods_type
    };
  },
  data() {
    return {
      showBigImg: false,
      bigImages: [], //商品详情富文本图片预览
      service_QRcode: "",
      service_mobile: "",
      //live more
      isLoadMore: true,
      live_page: 1,
      total_page: 0,
      showMoreLive: false,
      recordsList: [], //直播间列表
      // 初始评论页数
      commentPage: 1,
      // 是否有更多评论
      noMoreComment: false,
      //是否是o2o
      is_o2o: false,
      hoet: false,
      goodTop: false,
      popupSpecs: false,
      goodsInfo: {},
      goods_plugin: {},

      popStock: 0,
      goodsCount: 1,

      favorite: false,
      isGoods: false,
      cservice: "",
      //商品详情
      third_content: [],

      //底部margin值开关
      isMarginBottom: false,

      //是否租赁商品
      isRent: false,
      isRight: false,
      //立即购买
      isRentBuyShow: false,
      isShowCellNumber: false, //是否显示已选

      //限时购开始时间
      beginTime: 0,
      //显示购结束时间
      endTime: 0,
      endTimeStr: "",
      //限时购开关
      isBuy: false,
      isTime: false,
      //限时购据开始时间开关
      isBegTime: false,
      begTimeStr: "",

      //购物车id
      card_id: 0,

      showGood: false,
      isShowDetail: false, //是否展开宝贝详情

      isPullUp: false,
      showPageB: false,
      scroll: "",
      currentClass: 0,

      // showComment: false,
      commentLimit: [], //评论组件，设置最新5条评论
      totalComment: "", //总评论数
      favorable_rate: "100%", //好评率
      goodDetail: {},

      timer: null, //throttleFn方法节流，减少性能开支
      last: null,
      now: null,

      projects: [],
      freight_pricing: {}, //运费插件

      ActivityId: "", //活动id
      hasActivity: false,
      // 一口价的数据
      pack_price: "",
      goods_count: "",
      prdocut_market: {},

      //供应商
      supplierData: {},

      luck_draw: {}, //新抽奖抽奖luck-draw悬浮按钮
      isShow_memberDiscount: true, //会员折扣模块显隐
      isShow_brand: true, // 品牌介绍
      stepConfig: {}, //组件goodStep配置信息

      team: [], //抢团插件，开团列表数组

      btnFlag: false, //显示回到顶部
      btnData: {
        button_size: 40,
        over_top: 500,
        position_location: "right",
        icon_url: ""
      },

      producer_info: [], //厂家管理
      levelModel: 0, //新零售插件，代理销售等级
      isFavoriteIcon: false,
      is_handleScroll: 0
    };
  },

  activated() {
    console.log(window.scrollArr);
    this.initPages(); //页面初始化配置
  },

  mounted() {
    console.log(window.scrollArr);
    this.initPages(); //页面初始化配置
  },

  deactivated() {
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);

    document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
    document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
    document.getElementById("main").removeEventListener("touchend", this.handleTouchend);

    window.document.removeEventListener("scroll", this.throttleFn);
    let arrinfo = {
      id: Number(goods_id),
      top: this.is_handleScroll
    };
    if (window.scrollArr.length < 3) {
      console.log(window.scrollArr);
      window.scrollArr.push(arrinfo);
    } else {
      console.log("删了第一个，直接插入最后一个-------------------------");
      window.scrollArr.shift();
      window.scrollArr.push(arrinfo);
      console.log(window.scrollArr,'1qassdas');
    }
  },

  methods: {
    initPages() {
      let noRequestName = ["GroupGoods", "grab_group", "managementGoods", "newRetailSalesGood", "zhpGroup", "groupWorkGood"];
      if (noRequestName.indexOf(this.goods_type) > -1) {
        //在组件内独立请求详情页数据，后面接口优化整合
        this.getComponentData(); //获取数据
      } else {
        this.initComponents();
        this.isFavoriteIcon = true;
      }
      if (this.goods_type == "supplierGoods" || this.goods_type == "goods") {
        this.isShowCellNumber = true;
      }
      this.handleScroll();
      console.log(window.scrollArr);
      for (let iterator of window.scrollArr) {
        if (iterator.id == goods_id) {
          if (iterator.top > 0) {
            this.getDetailData();
            setTimeout(() => {
              window.scrollTo(0, iterator.top);
            }, 1000);
          }
        }
      }
    },
    // 监听滚动条
    handleScroll() {
      console.log('scroll ---- top1');
      window.addEventListener("scroll", this.windowScroll);
    },
    windowScroll() {
      let scroll = document.documentElement.scrollTop || document.body.scrollTop;
      this.is_handleScroll = scroll;
    },
    initComponents() {
      this.posterShow = false;
      this.goodTop = false;
      if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
        share_tag = this.fun.getKey("share_tag");
      }

      this.initData1();
      this.supplierData = { id: 0 };

      //门店购物车id
      this.card_id = this.$route.params.cartId;

      goods_id = this.$route.params.id;

      if (this.goods_type == "store_goods") {
        this.is_o2o = true;
      } else {
        this.is_o2o = false;
      }

      //初始化客服参数
      this.initCservice("");
      //商品详情 初始化参数
      this.initData();

      // 配置数据
      this.getGoodsPage(this.goods_info);

      if (this.is_room == 1) {
        this.getLiveList();
      }
      this.$nextTick(() => {
        window.addEventListener("scroll", this.throttleFn);
      });
    },
    initData1() {
      this.showGood = false;
      //初始化一下参数
      this.showBigImg = false;
      this.goodsInfo = {};
      this.goods_plugin = {};
      this.isGoods = false;
      this.goodsCount = 1;
      this.popupSpecs = false;
      this.isGoodsLove = false;
      this.isMarginBottom = false;

      this.isRent = false;

      this.isRentBuyShow = false;
      this.commentPage = 1; //由于首次进来执行getCommentData后该参数已经变为2，所以在每次进入需要先初始化这个参数为1，否则会获取不到数据
      // submitActionTag = "";
      // optionsId = "";
      // specsManage = [];
      // optionsMaxCount = 1;

      this.commentLimit = [];
      this.totalComment = "";
      this.goodDetail = {};
      this.timer = null;
      this.last = null;
      this.now = null;
      // this.showComment = false;
      this.showPageB = false;
      this.recordsList = [];
      this.prdocut_market = {};

      this.configShow(); //处理组件模块显隐条件集合方法
    },
    configShow() {
      if (this.goods_type == "hotelGoods" || this.goods_type == "GroupGoods" || this.goods_type == "zhpGroup") {
        this.isShow_memberDiscount = false;
      }
      if (this.goods_type == "hotelGoods" || this.goods_type == "GroupGoods" || this.goods_type == "zhpGroup") {
        this.isShow_brand = false;
      }
    },
    //初始化客服参数
    initCservice(newCservice, QRcode, mobile) {
      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
        if (!this.fun.isTextEmpty(QRcode)) {
          this.service_QRcode = QRcode;
        }
        if (!this.fun.isTextEmpty(mobile)) {
          this.service_mobile = mobile;
        }
      }
    },

    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;

        that.hoet = top <= 40 ? false : true;
        that.btnFlag = top > 120 ? true : false;

        //滑动到底部禁止反弹
        if (document.documentElement.scrollHeight == document.documentElement.clientHeight + top) {
          //alert("Touch_Buttom!");
          document.addEventListener("touchstart", this.move, false);
          document.addEventListener("touchmove", this.move, false);
        }
      };
    },

    goto() {
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          routeBackUrlIOS({ body: "routeBackUrlIOS" });
        } else {
          routeBackUrlAndroid();
        }
        return;
      }
      if (share_tag == "-1") {
        this.$router.go(-1);
      } else {
        this.$router.push(this.fun.getUrl("home", {}));
      }
    },

    getGoodsPage(data) {
      // data全部数据
      this.getData(data.get_goods);

      // 数据更改plugin
      this.goods_plugin = data.plugin || {};

      if (data.customer_service) {
        // 客服
        this.service_QRcode = data.customer_service.service_QRcode;
        this.service_mobile = data.customer_service.service_mobile;
        this.cservice = data.customer_service.cservice;
      }

      this.luck_draw = data.plugin ? data.plugin.luck_draw : data.luck_draw || {};
      this.showGood = true;
      this.slider();
      if (data.get_goods.is_favorite) {
        this.favorite = data.get_goods.is_favorite.status == 1 ? true : false;
      }
      if (data.freight_pricing) {
        this.freight_pricing = data.freight_pricing;
      }

      // 租赁商品
      if (!this.fun.isTextEmpty(this.goods_plugin.lease_toy)) {
        this.isRent = this.goods_plugin.lease_toy.is_lease == 1 ? true : false;
        this.isRentBuyShow = this.goods_plugin.lease_toy.immed_goods_id == 0 ? false : true;
        if (!this.fun.isTextEmpty(this.goods_plugin.lease_toy.is_rights)) {
          this.isRight = this.goods_plugin.lease_toy.is_rights == 1 ? true : false;
        }
      }

      console.log("isRent222:", this.isRent);
      console.log("isRentBuyShow11:", this.isRentBuyShow);

      if (this.goods_plugin.prdocut_market) {
        // 应用市场
        this.prdocut_market = this.goods_plugin.prdocut_market;
      }

      // 一口价
      if (this.goods_plugin.pack_fixed_price && this.goods_plugin.pack_fixed_price.id) {
        this.hasActivity = true;
      } else {
        //商品未参加一口价
        this.hasActivity = false;
      }
    },
    getDetailData(index, tag) {
      if (this.goodsInfo.content) {
        let str = this.goodsInfo.content.replace(/src=\"http:/gi, 'src="https:');
        this.goodDetail.content = str;
      }
      if (this.goodsInfo.show_push) {
        this.goodDetail.show_push = this.goodsInfo.show_push;
      }
      this.showPageB = true;
      if (tag) {
        this.$nextTick(() => {
          let jump = document.getElementsByClassName("section");
          setTimeout(() => {
            // 获取需要滚动的距离
            let total = jump[index].offsetTop - 50;
            // Chrome
            document.body.scrollTop = total;
            // Firefox
            document.documentElement.scrollTop = total;
            // Safari
            window.pageYOffset = total;
          }, 200);
        });
      }
    },

    //获取数据
    getData(data) {
      // get_goods数据
      this.goodsInfo = data;
      if (this.fun.getPhoneEnv() == 3) {
        this.getDetailData();
        this.showPageB = true;
      }

      if (this.goods_info.get_goods.plugin_id == 44) {
        this.getJHSupplier();
      }

      if (this.goods_info.get_goods.plugin_id == 120) {
        this.getYZSupplier();
      }

      this.fun.wxShare(
        "",
        { mid: this.fun.getKeyByMid(), goods_id: goods_id },
        {
          title: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_title ? this.goodsInfo.has_one_share.share_title : this.goodsInfo.title,
          imgUrl: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_thumb ? this.goodsInfo.has_one_share.share_thumb : this.goodsInfo.thumb,
          description: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_desc ? this.goodsInfo.has_one_share.share_desc : ""
        },
        data => {
          if (!this.fun.isTextEmpty(data.shop && data.shop.shop)) {
            this.initCservice(data.shop.shop.cservice); //客服重新赋值
          }
        }
      );
      // this.setIsAddCart(); //判断是否能加入购物车
      // this.setIsLove(); //判断是否有爱心值
      if (data.comment) {
        this.commentLimit = data.comment.data;
        this.totalComment = data.comment ? data.comment.total : "0";
      } else if (data.get_comment) {
        this.commentLimit = data.get_comment.data;
        this.totalComment = data.get_comment ? data.get_comment.total : "0";
      }

      this.favorable_rate = data.favorable_rate;
      this.isGoods = true;

      try {
        wx.miniProgram && wx.miniProgram.postMessage({
          data: { goods_title: this.goodsInfo.title }
        });
      } catch (error) {
        console.log('wx.miniProgram：：：error',error);
      }


      //let store_id=that.fun.isTextEmpty(that.$route.params.store_id)?"":that.$route.params.store_id;

      this.isMarginBottom = this.fun.isTextEmpty(data.show_push) ? false : true;

      //限时购
      if (!this.fun.isTextEmpty(data.has_one_goods_limit_buy)) {
        this.isBuy = data.has_one_goods_limit_buy.status == 1 ? true : false;
        this.beginTime = data.has_one_goods_limit_buy.start_time;

        console.log("isBuy:", this.isBuy);
        if (this.isBuy) {
          this.timeCompare(this.beginTime);
        }

        console.log("isTime:", this.isTime);

        this.endTime = new Date(parseInt(data.has_one_goods_limit_buy.end_time) * 1000);
        this.endTimeStr = String(this.endTime);
        // this.timeLimit = data.has_one_goods_limit_buy.status;
      }
      //供应商
      if (data.supplier) this.supplierData = data.supplier;
    },

    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7 || this.fun.isCPS()) {
        this.appSharesinit();
        return;
      }
      this.$dialog.alert({ message: "请点击右上角微信分享" });
    },
    //app获取分享数据
    appSharesinit() {
      $http.post("member.member.wxJsSdkConfig", { url: document.location.href }).then(
        response => {
          if (response.result == 1) {
            this.appShare(response.data);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      let _title,
        _imgUrl,
        _desc = "";
      let _link = document.location.href + "&share_tag=2";
      _link = this.fun.isMid(_link, data.info.uid);
      if (this.$route.name == "GroupGoods") {
        // 拼团插件分享
        _title = this.fun.isTextEmpty(this.goods_info.share_title) ? this.goods_info.title : this.goods_info.share_title;
        // _link = this.goods_info.share_url;
        _imgUrl = this.goodsInfo.thumb;
        _desc = this.goods_info.share_content;
      }
      if (this.$route.name == "grab_group") {
        // 抢团插件分享
        _title = this.fun.isTextEmpty(this.goods_info.get_goods.share_title) ? this.goods_info.get_goods.title : this.goods_info.get_goods.share_title;
        _imgUrl = this.fun.isTextEmpty(this.goods_info.get_goods.share_thumb) ? this.goods_info.get_goods.thumb[0] : this.goods_info.get_goods.share_thumb;
        _desc = this.fun.isTextEmpty(this.goods_info.get_goods.share_desc) ? "邀请您加入抢团活动" : this.goods_info.get_goods.share_desc;
      } else if (this.goods_type == "groupWorkGood") {
        _title = this.goods_info.share_title;
        _imgUrl = this.goods_info.get_goods.thumb;
        _desc = this.goods_info.share_content;
      } else {
        _title = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_title) ? this.goodsInfo.title : this.goodsInfo.has_one_share.share_title;
        _imgUrl = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_thumb) ? this.goodsInfo.thumb : this.goodsInfo.has_one_share.share_thumb;
        _desc = this.fun.isTextEmpty(this.goodsInfo.has_one_share.share_desc) ? (data && data.shop ? data.shop.shop.name:'') : this.goodsInfo.has_one_share.share_desc;
      }

      let json = {
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: `${this.fun.getSiteRoot()}/addons/yun_shop/?menu#/${window.location.href.match(/#\/(\S*)\?/)[1]}?i=${this.fun.getKeyByI()}&mid=${data.info.uid}`, // 分享链接
        imgUrl: _imgUrl // 分享图标
      };
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          shareByH5IOS({ body: "shareByH5IOS", json: JSON.stringify(json) });
        } else {
          shareByH5Android(JSON.stringify(json));
        }
      } else {
        YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
      }
    },

    //初始化商品详情参数
    initData() {
      this.service_mobile = "";
      this.service_QRcode = "";
      this.cservice = "";
      this.firstActivityCon = "";

      is_third_content = false;

      this.firstActivityCon = "";
      this.third_content = [];

      this.isAddCart = false;

      this.posterImg = null;

      this.isRentBuyShow = false;
      this.beginTime = 0;

      this.endTime = 0;

      this.endTimeStr = "";

      this.isBuy = false;

      this.isBegTime = false;
      this.showPageB = false;
      this.isPullUp = false;
      this.recordsList = [];

      //this.getCartId();
    },
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    },

    //获取评论数据
    getCommentData() {
      let that = this;
      let json = {
        goods_id: goods_id,
        page: this.commentPage
      };
      $http.get("goods.comment.get-comment", json, "获取中...").then(
        function(response) {
          if (response.result === 1) {
            if (response.data.data.length < 20) {
              that.noMoreComment = true;
            }
            that.commentPage += 1;
            if (!that.third_content) {
              that.third_content = [];
            }
            that.third_content = [...that.third_content, ...response.data.data];
            // that.showComment = true;
            is_third_content = true;
            // that.$emit("showComment", true);
            that.$store.commit("setShowComment", true);
            // that.third_content = response.data.data;
          } else {
            is_third_content = false; //复位
          }
        },
        function(response) {
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

    //跳转个人中心
    gotoMember() {
      //this.$router.push({ name: "member", params: {}, query: { i: this.toi } });
      this.$router.push(this.fun.getUrl("member", {}));
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
        $http
          .post("goods.goods.get-room", { goods_id: that.$route.params.id, page: that.live_page }, "")
          .then(response => {
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

    handleHtml($event) {
      if ($event.target) {
        if ($event.target.nodeName == "IMG") {
          this.bigImages = [];
          this.bigImages.push($event.target.currentSrc);
          this.showBigImg = true;
        }
      }
    },

    //获取时间-限时购
    timeCompare(begin) {
      let beginTime = parseInt(begin) * 1000;

      let now = Date.parse(new Date());
      console.log(parseInt(begin) * 1000);
      console.log(now, beginTime);
      if (now >= beginTime) {
        this.isTime = true;
      } else {
        this.isTime = false;
        this.isBegTime = true;
        this.begTimeStr = String(beginTime - now);
      }
    },

    onFavorite(e) {
      this.$refs.goodsAction.onFavorite(e);
    },
    changeFavorite(e) {
      this.favorite = e;
    },

    //品牌跳转
    toBrandDetail(val) {
      this.$router.push(this.fun.getUrl("GoodsBrand", { id: val }));
    },

    //租赁立即购买

    toRentBuy(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },

    gotoList() {
      this.$router.push(
        this.fun.getUrl("o2oStore_v2", {
          store_id: this.$route.params.store_id
        })
      );
    },
    gotoLuckDraw() {
      this.$router.push(this.fun.getUrl("luckyDraw", { tag: "activity" }, { gid: this.$route.params.id }));
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
    timeEnd() {
      this.goods_info.status = "2";
    },

    FromTo(data) {
      // this.$router.push(this.fun.getUrl("GoodsComment", { id: goods_id }));
      if (!is_third_content) {
        this.getCommentData();
      } else {
        // this.showComment = true;
        // this.$emit("showComment", true);
        this.$store.commit("setShowComment", true);
      }
    },
    CloseComment() {
      // this.showComment = false;
      // this.$emit("showComment", false);
      this.$store.commit("setShowComment", false);
    },
    getJHSupplier() {
      //聚合供应链的商品 根据用户默认地址判断是否有库存可购买，如果没库存不满足购买条件可提示或下单按钮灰色。
      $http.get("plugin.jd-supply.frontend.goods.option", { goods_id: goods_id }).then(
        response => {
          if (response.result == 1) {
            let options_address = response.data;
            this.getArrEqual(options_address, this.goodsInfo.has_many_options);
          }
        },
        response => {
          //alert('网络错误，请稍后再试！')
        }
      );
    },
    getYZSupplier() {
      //芸众供应链的商品 根据用户默认地址判断是否有库存可购买，如果没库存不满足购买条件可提示或下单按钮灰色。
      $http.get("plugin.yz-supply.frontend.goods.option", { goods_id: goods_id }).then(
        response => {
          if (response.result == 1) {
            let options_address = response.data;
            this.getArrEqual(options_address, this.goodsInfo.has_many_options);
          }
        },
        response => {
          //alert('网络错误，请稍后再试！')
        }
      );
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
    },

    close_yz_specs_popup(_optionsId, goodsCount, clicktype, cardId, optionsMaxCount, level_id, option_level_id) {
      // optionsId = _optionsId;
      this.goodsCount = goodsCount;
      this.popupSpecs = false;
      if (clicktype == 1) {
        //clicktype == 1 点击确认按钮
        // level_id 拼团层级id
        // this.submitAction();
        //点击确认按钮
        if (this.goods_type == "grab_group" && this.$refs.goodSku.popPrice == 0) {
          this.$dialog.alert({ message: "开团/参团金额不正确，不能为0" });
          return;
        }
        if (this.goods_type == "newRetailSalesGood") {
          if (this.$refs.goodSku.popPrice == 0 || this.goodsInfo.price == 0) {
            Toast("价格设置有误，请联系客服！");
            return;
          }
          if (this.$route.params.mode == 2 && this.levelModel == 0) {
            Toast("请选择等级套餐！");
            return;
          }
          this.$refs.goodsAction.levelModel = this.levelModel;
        }

        this.$refs.goodsAction.submitAction(_optionsId, goodsCount, cardId, optionsMaxCount, level_id, option_level_id);
      }
    },
    popupModeshowChild(data) {
      // 规格组件弹窗显隐
      this.popupSpecs = data;
    },
    buyNow() {
      this.$refs.goodsAction.buyNow();
    },
    showCustomer() {
      //显示客服
      this.$refs.goodsAction.showCustomer();
    },

    getComponentData() {
      // key: this.goods_type
      // value: 对应调用的Methob
      let enums = new Map([
        ["GroupGoods", "getComponent_groupGoods"],
        ["grab_group", "getComponent_grabGroup"],
        ["managementGoods", "getComponent_managementGoods"],
        ["newRetailSalesGood", "getComponent_newRetail"],
        ["zhpGroup", "getComponent_zhpGroup"],
        ["groupWorkGood", "getComponent_groupWork"]
      ]);
      let handleType = enums.get(this.goods_type);
      this[handleType]();
    },
    // 拼团组件 start =================
    getComponent_groupGoods() {
      let that = this;

      this.stepConfig = {
        title: "拼团玩法",
        list: ["选择商品付款开团/参团", "邀请并等好友支付参团", "达到人数顺利成团"]
      };

      this.activity = this.$route.params.id; //
      this.fight_groups = this.$route.query.fight_groups !== undefined ? this.$route.query.fight_groups : "";
      let json = {};
      if (!this.fun.isTextEmpty(this.fight_groups)) {
        //不为空则从订单详情页进入
        json.id = this.$route.params.id;
        json.fight_groups_goods_id = that.fight_groups;
      } else {
        json.id = this.$route.params.id;
      }
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups-goods.get-goods";
      if (this.$route.params.store_id && Number(this.$route.params.store_id) != 0) {
        json.store_id = this.$route.params.store_id;
        _url = "plugin.fight-groups.frontend.store.frontend-fight-groups-goods.get-goods";
      }
      $http.get(_url, json, "加载中").then(
        response => {
          if (response.result === 1) {
            this.goods_info = response.data;
            this.goods_info.get_goods = response.data.goods_info;
            this.goodsInfo = response.data.goods_info;
            this.initComponents();
            this.goods_id = this.goodsInfo.id;
            goods_id = this.goodsInfo.id;
            this.favorable_rate = response.data.goods_info.favorable_rate ? response.data.goods_info.favorable_rate : null;
            this.commentLimit = response.data.goods_info.favorable_rate ? response.data.goods_info.get_comment.data : [];
            this.totalComment = response.data.goods_info.get_comment.total ? response.data.goods_info.get_comment.total : "0";
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: this.fun.isTextEmpty(this.goods_info.share_title) ? this.goods_info.title : this.goods_info.share_title,
                imgUrl: this.goodsInfo.thumb,
                description: this.goods_info.share_content
              }
            );
            if (that.goods_info.is_lottery && that.goods_info.lottery_desc) {
              that.goods_info.lottery_desc = that.goods_info.lottery_desc.replace(/\n/g, "<br>");
            }
            // 客服
            if (response.data.store) {
              this.service_QRcode = response.data.store.service_QRcode;
              this.service_mobile = response.data.store.service_mobile;
              this.cservice = response.data.store.cservice;
            }
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.go(-1);
            });
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    showGroupList() {
      //显示参团列表组件
      if (this.goods_info.display_team.length == 0) {
        Toast("抱歉，暂无更多可参与的团");
        return;
      }
      this.$refs.groupList.showGroupMore();
    },
    // 抢团组件  ==========

    // 抢团插件  =========================
    getComponent_grabGroup() {
      let that = this;
      let json = {
        art: "goodsDetail",
        goods_id: this.$route.params.id
      };
      this.stepConfig = {
        title: "抢团玩法",
        list: ["选择商品付款开团/参团", "邀请并等好友支付参团", "达到人数抢团"]
      };
      $http.get("plugin.snatch-regiment.api.index.getSnatchData", json, "").then(
        response => {
          this.showGood = true;
          if (response.result === 1) {
            this.goods_info = response.data.goodsDetail;
            this.goods_info.get_goods = response.data.goodsDetail.goods;
            this.goodsInfo = this.goods_info.get_goods;
            this.goodsInfo.price = this.goodsInfo.price_num;
            this.initComponents();
            this.team = response.data.goodsDetail.team;
            this.cservice = response.data.goodsDetail.custom_service;
            this.goods_info.get_goods.thumb = [response.data.goodsDetail.goods.thumb];
            this.commentLimit = response.data.goodsDetail.comment.data;
            this.totalComment = response.data.goodsDetail.comment ? response.data.goodsDetail.comment.total : "0";
            this.leader_partake = response.data.goodsDetail.leader_partake;
            this.istimestamp = this.timestamp < this.goods_info.get_goods.start_time ? Number(this.goods_info.get_goods.start_time) : Number(this.goods_info.get_goods.end_time);
            this.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid(), goods_id: goods_id },
              {
                title: that.fun.isTextEmpty(that.goods_info.get_goods.share_title) ? that.goods_info.get_goods.title : that.goods_info.get_goods.share_title,
                imgUrl: that.fun.isTextEmpty(that.goods_info.get_goods.share_thumb) ? that.goods_info.get_goods.thumb[0] : that.goods_info.get_goods.share_thumb,
                description: that.fun.isTextEmpty(that.goods_info.get_goods.share_desc) ? "邀请您加入抢团活动" : that.goods_info.get_goods.share_desc
              }
            );
            console.log("limit_num=======", this.goodsInfo.limit_num);
          } else {
            this.$dialog.alert({ message: response.msg }).then(() => {
              that.$router.go(-1);
            });
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    //厂家管理插件  ==============
    getComponent_managementGoods() {
      let that = this;
      let json = {
        id: this.$route.params.id,
        producer_id: this.$route.params.kid
      };
      $http.post("plugin.producer.frontend.goods.getGoodsPage", json, " ").then(
        function(res) {
          if (res.result === 1) {
            if (res.data.get_goods.plugin_id == 44) {
              const jd_iframe = document.createElement("script");
              jd_iframe.type = "text/javascript";
              jd_iframe.src = "https://open.jxhh.com/iframechild.js";
              document.body.appendChild(jd_iframe);
            }
            that.producer_info = res.data.producer_info;
            that.goods_info = res.data;
            that.is_room = res.data.is_room ? res.data.is_room : 0;
            that.initComponents();
            console.log("goods_type", that.goods_type);
          } else {
            that.$dialog.alert({ message: res.msg }).then(() => {
              that.$router.go(-1);
            });
          }
        },
        function(res) {
          console.log(res);
        }
      );
    },

    //新零售插件  ====================
    getComponent_newRetail() {
      goods_id = this.$route.params.id;
      $http
        .post(
          "plugin.new-retail.frontend.index.goodsDetail",
          {
            goods_id: goods_id,
            is_retail_goods: this.$route.params.mode
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.goods_info = response.data.goods;
            this.goods_info.get_goods = response.data.goods;
            this.goodsInfo = this.goods_info.get_goods;
            this.initComponents();
            this.commentLimit = response.data.goods.comment.data;
            this.totalComment = response.data.goods.comment ? response.data.goods.comment.total : "0";
          } else {
            Toast.fail({
              message: response.msg,
              onClose: () => {
                if (window.history.length <= 1) {
                  this.$router.push(this.fun.getUrl("home", {}));
                } else {
                  this.$router.go(-1);
                }
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clickLevelModel(item) {
      // 点击等级套餐,数量、价格变为套餐设定的
      this.$refs.goodSku.popPrice = item.level_unit_total_price;
      this.$refs.goodSku.goodsCount = item.level_num;
    },

    //珍惠拼插件（zhp-group-lottery）
    getComponent_zhpGroup() {
      //拼团活动id
      $http
        .post("plugin.zhp-group-lottery.frontend.goods.get-goods", { id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            goods_id = response.data.goods_id;
            this.goods_info = response.data;
            this.initComponents();
            if (response.data.start_time) {
              //活动未开始才返回 start_time
              this.timeCompare(response.data.start_time);
            } else if (response.data.end_time) {
              //活动进行中才返回end_time
              let timestamp = Date.parse(new Date()) / 1000;
              if (timestamp < response.data.end_time) this.isTime = true;
            }
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: this.goods_info.title,
                imgUrl: this.goods_info.get_goods.thumb,
                description: ""
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //0.1元拼团
    getComponent_groupWork() {
      this.stepConfig = {
        title: "拼团玩法",
        list: ["选择商品付款开团/参团", "邀请并等好友支付参团", "达到人数顺利成团"]
      };
      $http
        .post("plugin.group-work.frontend.modules.goods.controllers.detail.index", { record_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            goods_id = response.data.goods_id;
            this.goods_info = response.data;
            this.goods_info.get_goods = response.data.goods_info;
            this.goodsInfo = this.goods_info.get_goods;
            console.log(this.goods_info);
            this.initComponents();
            if (response.data.start_time) {
              //活动未开始才返回 start_time
              this.timeCompare(response.data.start_time);
            } else if (response.data.end_time) {
              //活动进行中才返回end_time
              let timestamp = Date.parse(new Date()) / 1000;
              if (timestamp < response.data.end_time) this.isTime = true;
            }
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: this.goods_info.share_title,
                imgUrl: this.goods_info.get_goods.thumb,
                description: this.goods_info.share_content
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    deactivatedShowGood() {
      this.showGood = false;
    }
  },

  watch: {
    scroll() {
      this.loadSroll();
    }
    // touchClose: function(newVal, oldVal) {
    //   this.showComment = newVal;
    // }
  },

  components: {
    cComment,
    cCommentlist,
    cFreightpricing,
    cLive,
    floatOrder,
    goodSwipe,
    countDown,
    priceTitleRepertorySales,
    memberDiscount,
    selfParameterServicetag,
    goodSpecs,
    appointmentPlugin,
    goodsAction,
    goodStep,
    groupList,
    fixedPrice,
    prdocutMarket,
    supplierModel,
    o2oModel,
    snatchRegimentList,
    U_backup,
    guessLike,
    producerM,
    zhpGroup,
    grabGroupResult,
    participateHistory,
    invitation,
    projectCard,
    groupWork
  },

  computed: {
    showComment() {
      return this.$store.state.isShomegGoodComment;
    }
  }
};
