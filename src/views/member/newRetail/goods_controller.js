// import { mapState } from 'vuex';
import { Toast } from "vant";
import { Swipe, SwipeItem } from "components/meswipe";
import cComment from "components/goods/children/comment";
import cCommentlist from "components/goods/children/commentList";
import cFreightpricing from "components/goods/children/freightPricing";
import cMyswipe from "components/myswipe";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import yzSpecs from "components/ui_components/yz_specs";
// import BScroll from 'better-scroll';

var goods_id = "";
var share_tag = "-1";
var is_third_content = false;
var start = 0;
var last_distance = 0;

//商品详情
export default {
  data() {
    return {
      showBigImg: false,
      bigImages: [], //商品详情富文本图片预览
      showss: false,
      show1: false,

      selected: "1",
      // 初始评论页数
      commentPage: 1,
      // 是否有更多评论
      noMoreComment: false,
      //是否是o2o
      is_o2o: false,
      integral: window.localStorage.integral || "积分",
      title: "商品详情",
      hoet: false,
      goodTop: false,
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
      posterImg: null,
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
      //柜子商品--结束
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
      projects: [],

      //供应商
      supplierData: {},

      //* 云库存商品
      fromStock: "",
      showShare: false, //分享弹窗
      showVideoLink: false,
      article_url: "", //视频号链接

      popupSpecs: false,
      levelModel: 0,
      buyType: null,
      oldPrice: 0
    };
  },

  activated() {
    this.posterShow = false;
    this.goodTop = false;
    if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
      share_tag = this.fun.getKey("share_tag");
    }
    this.fromStock = this.$route.query.fromStock;
    console.log(this.$route.query);

    this.initData1();
    this.supplierData = {};

    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }

    goods_id = this.$route.params.id;

    //柜子商品
    if (!this.fun.isTextEmpty(this.$route.params.mark)) {
      this.isCup = false;
    } else {
      this.isCup = true;
    }

    //商品详情 初始化参数
    this.initData();

    this.getGoodsPage();
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttleFn);
    });
  },

  mounted() {
    console.log("mounted：：");
  },
  beforeDestroy() {
    console.log("beforeDestroy");
  },
  deactivated() {
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);

    document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
    document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
    document.getElementById("main").removeEventListener("touchend", this.handleTouchend);

    window.removeEventListener("scroll", this.throttleFn);
  },

  methods: {
    initData1() {
      this.showGood = false;
      //初始化一下参数
      this.showBigImg = false;
      this.goodsInfo = {};
      this.isGoods = false;
      this.goodsCount = 1;
      this.popupSpecs = false;
      this.popupSpecs2 = false;
      this.isGoodsLove = false;
      this.isMarginBottom = false;

      this.isRent = false;

      this.isRentBuyShow = false;
      this.commentPage = 1; //由于首次进来执行getCommentData后该参数已经变为2，所以在每次进入需要先初始化这个参数为1，否则会获取不到数据

      this.commentLimit = [];
      this.goodDetail = {};
      this.timer = null;
      this.last = null;
      this.now = null;
      this.showComment = false;
      this.showPageB = false;
      this.showMember = true;

      this.popupSpecs = false;
      this.levelModel = 0;
      this.buyType = null;
    },

    gotoMiniAppCs() {
      var params = "";
      var path = "/pages/cs/index" + params;
      //通过JSSDK的api使小程序跳转到指定的小程序页面
      wx.miniProgram.navigateTo({ url: path });
    },

    slider() {
      let that = this;
      window.onscroll = function() {
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
        if (document.documentElement.scrollHeight == document.documentElement.clientHeight + top) {
          //alert("Touch_Buttom!");
          document.addEventListener("touchstart", this.move, false);

          document.addEventListener("touchmove", this.move, false);
        }
      };
    },

    goto() {
      console.log("share_tag", share_tag);
      if (share_tag == "-1") {
        this.$router.go(-1);
      } else {
        //this.$router.push({ name: 'home', params: {}, query: { i: this.toi } });
        this.$router.push(this.fun.getUrl("home", {}));
      }
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },

    handleTopChange(status) {
      this.topStatus = status;
    },

    getGoodsPage(data) {
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
            this.getData(response.data.goods);
            this.showGood = true;
            this.slider();
            // this.showMember = data.display_page == "1" ? true : false;
            // if (data.is_favorite) {
            //   this.favorite = data.is_favorite.status == 1 ? true : false;
            // }
          }
        })
        .catch(err => {
          console.log(err);
        });
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

      this.fun.wxShare(
        "",
        { mid: this.fun.getKeyByMid(), goods_id: goods_id },
        {
          title: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_title ? this.goodsInfo.has_one_share.share_title : this.goodsInfo.title,
          imgUrl: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_thumb ? this.goodsInfo.has_one_share.share_thumb : this.goodsInfo.thumb,
          description: this.goodsInfo.has_one_share && this.goodsInfo.has_one_share.share_desc ? this.goodsInfo.has_one_share.share_desc : ""
        }
      );
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
      // let store_id = '';

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

      //供应商
      this.supplierData = data.supplier;
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
        function(response) {
          if (response.result === 1) {
            //已收藏
            that.favorite = response.data.status == 1 ? true : false;
          }
        },
        function(response) {
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
        function(response) {
          if (response.result == 1) {
            that.favorite = true;
            Toast("收藏成功");
          }
        },
        function(response) {
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
        function(response) {
          if (response.result == 1) {
            that.favorite = false;
            Toast("取消收藏");
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //足迹记录
    footSet(_goods_id, _store_id) {
      if (!this.isGoods) {
        return;
      }

      let json = {
        goods_id: _goods_id,
        mid: this.fun.getKeyByMid(),
        owner_id: _store_id,
        mark: this.fun.getKey("mark"),
        mark_id: this.fun.getKey("mark_id")
      };
      $http.get("member.member-history.store", json).then(
        function(response) {
          console.log(response.msg);
        },
        function(response) {
          console.log(response);
        }
      );
    },

    isShowSharePopup() {
      this.showShare = true;
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
      this.$dialog.alert({ message: "请点击右上角微信分享" });
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
        function(response) {
          if (response.result == 1) {
            that.appShare(response.data);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(data) {
      var that = this;
      var _title = that.fun.isTextEmpty(that.goodsInfo.has_one_share.share_title) ? that.goodsInfo.title : that.goodsInfo.has_one_share.share_title;
      var _link = document.location.href + "&share_tag=2";
      _link = that.fun.isMid(_link, data.info.uid);

      var _imgUrl = that.fun.isTextEmpty(that.goodsInfo.has_one_share.share_thumb) ? that.goodsInfo.thumb : that.goodsInfo.has_one_share.share_thumb;
      var _desc = that.fun.isTextEmpty(that.goodsInfo.has_one_share.share_desc) ? data.shop.shop.name : that.goodsInfo.has_one_share.share_desc;
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },
    // 生成视频号链接
    getVideoLink() {
      $http
        .get("plugin.wx-video-link.frontend.index.index", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            if (this.fun.isTextEmpty(response.data.article_url)) {
              //为空则需要继续请求，直到返回数据
              this.getVideoLink();
            } else {
              this.article_url = response.data.article_url;
              this.showVideoLink = true;
              this.showShare = false;
              return;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 复制链接
    onCopy() {
      this.showVideoLink = false;
      Toast({
        message: "复制成功",
        position: "bottom",
        duration: 2000
      });
      this.article_url = "";
    },

    //初始化商品详情参数
    initData() {
      this.show1 = false;
      this.firstActivityCon = "";
      this.openVip = "2";
      // currentTabIndex = '0';
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

      this.posterImg = null;

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
            that.showComment = true;
            is_third_content = true;
            // that.$emit("showComment", true);
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

    //是否有爱心值
    setIsLove() {
      if (this.goodsInfo.goods_love) {
        this.isGoodsLove = true;
        let love_cash = this.goodsInfo.price - this.goodsInfo.goods_love.love_coin.amountOfMoney;
        this.goods_love_cash = Number(love_cash.toString().match(/^\d+(?:\.\d{0,2})?/));
        //this.goods_love_cash = (this.goodsInfo.price - this.goodsInfo.goods_love.love_coin.amountOfMoney);
        this.goods_love_deduction = this.goodsInfo.goods_love.love_coin.amountOfCoin;
        this.goods_love_name = this.goodsInfo.goods_love.love_coin.name;
      } else {
        this.isGoodsLove = false;
      }
    },

    //跳转优惠券领取
    gotoCoupon() {
      this.$router.push(this.fun.getUrl("couponStore"));
    },
    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg)) {
        this.posterShow = true;
      } else {
        let toastPoster = Toast({
          duration: -1, // 持续展示 toast
          message: "正在为您生成海报中"
        });
        $http
          .get("plugin.new-retail.frontend.goodsPoster.generateGoodsPoster", { id: this.$route.params.id, is_retail_goods: this.$route.params.mode }, "")
          .then(response => {
            toastPoster.clear();
            if (response.result == 1) {
              this.posterImg = `${response.data.image_url}?${Date.now()}`;
              this.posterShow = true;
            } else {
              this.posterShow = false;
              this.$dialog.alert({ message: response.msg });
            }
          })
          .catch(error => {
            toastPoster.clear();
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
    activityShowFun() {
      this.activityShow = true;
    },

    //显示商城活动默认活动
    showDefaultActivity(val) {
      if (val.first_strip_key == "coupon") {
        this.firstActivityBtn = "购买返券";
        this.firstActivityCon = "商品订单完成返优惠券";
      } else if (val.first_strip_key == "deduction_proportion" || val.first_strip_key == "award_proportion") {
        this.firstActivityBtn = val.love_name;
        this.firstActivityCon = "最高抵扣" + val.love_name + val.deduction_proportion + ",购买赠送" + val.award_proportion + val.love_name;
      } else if (val.first_strip_key == "max_point_deduct" || val.first_strip_key == "point") {
        this.firstActivityBtn = val.point_name;
        this.firstActivityCon = "最高抵扣" + val.point_name + val.max_point_deduct + ",购买赠送" + val.point + val.point_name;
      } else if (val.first_strip_key == "ed_full") {
        this.firstActivityBtn = "满减";
        this.firstActivityCon = "本商品满{{$i18n.t('money')}}" + val.ed_full + "立减{{$i18n.t('money')}}" + val.ed_reduction + "";
      } else if (val.first_strip_key == "ed_money" || val.first_strip_key == "ed_num") {
        this.firstActivityBtn = "包邮";
        if (val.first_strip_key == "ed_money" && val.ed_num == 0) {
          this.firstActivityCon = "本商品满{{$i18n.t('money')}}" + val.ed_money + "元包邮";
        } else if (val.first_strip_key == "ed_num" && val.ed_money == 0) {
          this.firstActivityCon = "本商品满" + val.ed_num + "件包邮";
        } else {
          this.firstActivityCon = "本商品满{{$i18n.t('money')}}" + val.ed_money + "元包邮" + ",满" + val.ed_num + "件包邮";
        }
      } else if (val.first_strip_key == "award_balance") {
        this.firstActivityBtn = "余额";
        this.firstActivityCon = "购买赠送余额" + val.award_balance + "元";
      } else if (val.first_strip_key == "commission_show") {
        this.firstActivityBtn = "分销佣金";
        if (val.commission_show_level == "1") {
          this.firstActivityCon = "一级佣金:" + val.first_commission + "元";
        } else if (val.commission_show_level == "2") {
          this.firstActivityCon = "一级佣金:" + val.first_commission + "元" + " " + "二级佣金:" + val.second_commission + "元";
        } else if (val.commission_show_level == "3") {
          this.firstActivityCon = "一级佣金:" + val.first_commission + "元" + " " + "二级佣金:" + val.second_commission + "元" + " " + "三级佣金:" + val.third_commission + "元";
        }
      }
    },

    //推广商品跳转
    pushGoodGoto(val) {
      if (val.is_course == 1) {
        this.$router.push(this.fun.getUrl("CourseDetail", { id: val.id }));
      } else if (val.is_course == 0) {
        this.$router.push(this.fun.getUrl("goods", { id: val.id }));
      } else {
        return;
      }
    },

    goToAdress() {
      let point = this.fun.bd_decrypt(this.o2oLng, this.o2oLat);
      this.fun.goToWXAdress(point, this.o2oName, "详细地址");
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

    //品牌跳转
    toBrandDetail(val) {
      this.$router.push(this.fun.getUrl("GoodsBrand", { id: val }));
    },

    //租赁立即购买

    toRentBuy(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    },
    gotoMemberGradeList(o) {
      if (o == "1") {
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

    gotoSupplier() {
      this.$router.push(
        this.fun.getUrl("SupplierShop", {
          id: this.supplierData.id,
          fromHome: 1
        })
      );
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
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
      } else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
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
      // e.preventDefault();   //注释原因：当触底不展开时，click事件无效
      start = e.changedTouches[0].pageY;
    },
    handleTouchmove(e) {
      const cur_move = e.changedTouches[0].pageY - start;
      const move_distance = last_distance + cur_move;
      if (last_distance > 0) {
        this.isPullUp = false;
        document.getElementById("main").style.cssText = `transition-duration:400ms;transform:translateY(0);`;
        last_distance = 0;
      } else if (move_distance < 0 && move_distance > -(0 + 65)) {
        document.getElementById("main").style.cssText = `transition-duration:0ms;transform:translateY(${move_distance}px);`;
        this.isPullUp = false;
      } else if (move_distance <= -(0 + 65)) {
        document.getElementById("main").style.cssText = `transition-duration:0ms;transform:translateY(${move_distance}px);`;
        this.isPullUp = true;
      }
    },
    handleTouchend(e) {
      const cur_move = e.changedTouches[0].pageY - start;
      last_distance += cur_move;
      document.getElementById("main").style.cssText = `transition-duration:400ms;transform:translateY(0);`;
      if (last_distance > 0) {
        this.isPullUp = false;

        last_distance = 0;
      } else if (last_distance < 0 && last_distance > -(0 + 65)) {
        this.isPullUp = false;
        last_distance = 0;
      } else if (last_distance <= -(0 + 65)) {
        //切换到下一个页面
        console.log("切换到下一个页面");
        document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
        document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
        document.getElementById("main").removeEventListener("touchend", this.handleTouchend);
        last_distance = 0;
        if (!this.showPageB) {
          this.getDetailData();
        }
      }
    },
    dataScroll() {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
      //滚动事件触发
      if (this.getScrollTop() + this.getClientHeight() + 5 > this.getScrollHeight()) {
        //此处发起请求
        if (!this.showPageB) {
          console.log("触底了");
          document.getElementById("main").addEventListener("touchstart", this.handleTouchstart);
          document.getElementById("main").addEventListener("touchmove", this.handleTouchmove);
          document.getElementById("main").addEventListener("touchend", this.handleTouchend);
        }
      } else {
        document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
        document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
        document.getElementById("main").removeEventListener("touchend", this.handleTouchend);
      }
    },
    jump(index) {
      if ((index == 2 || index == 3) && !this.showPageB) {
        this.getDetailData(index, true);
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

    close_yz_specs_popup(_optionsId, goodsCount, clicktype) {
      this.popupSpecs = false;
      this.oldPrice = this.$refs.goodSku.popPrice;
      let _json = {
        orderType: "newRetail",
        tag: "-2",
        goodsId: this.$route.params.id,
        optionsId: _optionsId,
        total: goodsCount
      };
      if (clicktype == 1) {
        //clicktype == 1：点击规格弹窗的确认按钮
        if (this.$refs.goodSku.popPrice == 0 || this.goodsInfo.price == 0) {
          Toast("价格设置有误，请联系客服！");
          return;
        }
        if (this.$route.params.mode == 2 && this.levelModel == 0) {
          Toast("请选择等级套餐！");
          return;
        }

        //自主进货下单：相当于不需要配送方式的虚拟商品
        //retail_state: 0-自由零售 1-成为代理商订单 2-自由发货 3-线上零售 4-进货订单 5-销售代理套餐订单
        let retail_state = null;
        if (this.$route.params.mode == 3 && this.buyType == 2) {
          //自由进货
          retail_state = 4;
        } else if (this.$route.params.mode == 2 && this.buyType == 2) {
          //代理套餐 的 立即购买
          _json.NRLevelId = this.levelModel;
          retail_state = 1;
        } else if (this.$route.params.mode == 1 && this.buyType == 2) {
          //自由零售
          retail_state = 0;
        } else if (this.$route.params.mode == 2 && this.buyType == 1) {
          //代理套餐 的代理销售。跳转二维码页面
          retail_state = 5;
          this.agentSales(_optionsId, goodsCount);
          return;
        }
        _json.retail_state = retail_state;
        this.$router.push(this.fun.getUrl("goodsorder", {}, _json));
      }
    },
    gotoBuy(_type) {
      // _type: 代理套餐||1，立即购买||2
      this.buyType = _type;
      this.popupSpecs = true;
      if (this.$route.params.mode == 2) {
        this.levelModel = 0;
        // this.$nextTick(() => {
        //   //解决代理套餐弹窗非第一次点击等级套餐时，显示价格不是套餐价和没有禁用步进器
        //   this.$refs.goodSku.popPrice = this.oldPrice;
        //   this.$refs.goodSku.$refs.yz_specs_stepper.disabled = true;
        // });
      }
    },
    clickLevelModel(item) {
      // 点击等级套餐,数量、价格变为套餐设定的
      this.$refs.goodSku.popPrice = item.level_unit_total_price;
      this.$refs.goodSku.goodsCount = item.level_num;
      this.$nextTick(() => {
        this.$refs.goodSku.$refs.yz_specs_stepper.disabled = true;
      });
    },
    agentSales(_optionsId, goodsCount) {
      $http
        .post(
          "plugin.new-retail.frontend.index.agentSales",
          { goods_id: this.$route.params.id, goods_option: _optionsId, goods_num: goodsCount, level_id: this.levelModel, goods_name: this.goodsInfo.title },
          ""
        )
        .then(response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl("newRetail_agencyPackage", { id: response.data.id }));
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  watch: {
    scroll() {
      this.loadSroll();
    }
  },

  components: { Swipe, SwipeItem, cMyswipe, cComment, cCommentlist, cFreightpricing, yzGoodsposter, yzSpecs },

  computed: {}
};
