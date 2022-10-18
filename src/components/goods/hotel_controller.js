import { Toast } from "vant";
import { Swipe, SwipeItem } from "components/meswipe";
import cComment from "components/goods/children/comment";
import cCommentlist from "components/goods/children/commentList";
import cLive from "components/goods/children/liveList";
import cMyswipe from "components/myswipe";
import floatOrder from "components/goods/children/float_order";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import invitation from "components/goods/children/invitation";

// const DETAIL_URL = 'plugin.hotel.frontend.hotel.goods.get-goods-detail-by-goods-id';
var start = 0;
var last_distance = 0;
var is_third_content = false;
export default {
  props: ["goods_id", "goods_type", "goods_info_hotel", "touchClose", "is_room"],
  data() {
    return {
      show1: false,
      service_QRcode: "",
      service_mobile: "",
      goods_info: {
        thumb_url: []
      },
      hotel_info: {},
      goods_plugin: {},
      comment_data: [],
      posterShow: false,
      posterImg: null,
      isGoods: false,
      favorite: false,
      cservice: "",
      PageNameList: {}, //自定义标题
      showGood: false,
      clientWidths: "",

      commentLimit: [], //评论组件，设置最新5条评论
      favorable_rate: "100%", //好评率
      isShowDetail: false, //是否展开宝贝详情
      isPullUp: false,
      showPageB: false,
      scroll: "",
      currentClass: 0,

      timer: null, //throttleFn方法节流，减少性能开支
      last: null,
      now: null,
      goodDetail: {},
      showComment: false,
      hoet: false,
      //live more
      isLoadMore: true,
      live_page: 1,
      total_page: 0,
      showMoreLive: false,
      recordsList: [] //直播间列表
    };
  },

  activated() {
    this.init();
    this.showGood = false;
    this.getGoodsPage(this.goods_info_hotel);
    this.getCustomizeHotelHead();
    if (this.is_room == 1) {
      this.getLiveList();
    }
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttleFn);
    });
  },

  mounted() {
    this.clientWidths = document.body.clientWidth;

    if (this.is_room == 1) {
      this.getLiveList();
    }
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttleFn);
    });
  },
  deactivated() {
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);

    document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
    document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
    document.getElementById("main").removeEventListener("touchend", this.handleTouchend);

    window.removeEventListener("scroll", this.throttleFn);
    this.CloseComment();
  },
  methods: {
    init() {
      this.service_mobile = "";
      this.service_QRcode = "";
      this.show1 = false;
      this.cservice = "";
    },

    getGoodsPage(data) {
      // data全部数据

      this.goods_plugin = data.plugin || {}; // 数据更改plugin
      this.getData(data.get_goods, data.get_hotel_info);
      this.service_QRcode = data.customer_service.service_QRcode;
      this.service_mobile = data.customer_service.service_mobile;
      this.cservice = data.customer_service.cservice;
      this.showGood = true;
      this.slider();
      if (data.is_favorite) {
        this.favorite = data.is_favorite.status == 1 ? true : false;
      }
    },

    getData(good, data) {
      // get_goods, get_hotel_info

      this.goods_info = { ...good, ...data.goods };
      this.hotel_info = data.hotel;
      this.isGoods = true;
      this.commentLimit = good.get_comment;
      this.favorable_rate = good.favorable_rate;

      if (this.fun.getPhoneEnv() == 3) {
        this.getDetailData();
        this.showPageB = true;
      }
    },

    //获取评论数据
    getCommentData() {
      let that = this;
      let json = {
        goods_id: this.$route.params.id,
        page: 1
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
            that.showComment = true;
            is_third_content = true;
            that.$emit("showComment", true);
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

    itemClick(index) {
      if (index == "用户评价") {
        this.getCommentData();
      }
    },
    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
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
    //分享
    shareWeixin() {
      console.log("share");
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
      let that = this;
      let _url = document.location.href;
      let json = {
        url: _url,
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
      var _title = that.fun.isTextEmpty(that.goods_info.has_one_share.share_title) ? that.goods_info.title : that.goods_info.has_one_share.share_title;
      var _link = document.location.href + "&share_tag=2";
      _link = that.fun.isMid(_link, data.info.uid);

      var _imgUrl = that.fun.isTextEmpty(that.goods_info.has_one_share.share_thumb) ? that.goods_info.thumb : that.goods_info.has_one_share.share_thumb;
      var _desc = that.fun.isTextEmpty(that.goods_info.has_one_share.share_desc) ? (data && data.shop ? data.shop.shop.name:'') : that.goods_info.has_one_share.share_desc;
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        let _imgUrl = "";
        let _desc = "";
        if (that.fun.isTextEmpty(that.goodsInfo.has_one_share)) {
          //返回的goodsInfo.has_one_share：null ,数据中没有相应对象,报错，后期后端会修复
          _title = that.goodsInfo.title;
          _imgUrl = that.goodsInfo.thumb;
          _desc = data.shop.shop.name;
        } else {
          _title = that.fun.isTextEmpty(that.goodsInfo.has_one_share.share_title) ? that.goodsInfo.title : that.goodsInfo.has_one_share.share_title;
          _imgUrl = that.fun.isTextEmpty(that.goodsInfo.has_one_share.share_thumb) ? that.goodsInfo.thumb : that.goodsInfo.has_one_share.share_thumb;
          _desc = that.fun.isTextEmpty(that.goodsInfo.has_one_share.share_desc) ? data.shop.shop.name : that.goodsInfo.has_one_share.share_desc;
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
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
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
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
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
          .get("goods.goods-poster.new-goods-poster", { id: this.$route.params.id, hotel_id: this.goods_info.hotel_id }, "...加载中")
          .then(response => {
            toastPoster.clear();
            if (response.result == 1) {
              this.posterImg = response.data;
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

    //判断是否收藏
    isFavorite() {
      let that = this;
      let json = {
        goods_id: this.$route.params.id,
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.isFavorite", json).then(
        function(response) {
          // console.log(response)
          if (response.result == 1) {
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
      console.log(isFavorite);
    },

    //添加收藏
    addFavorite() {
      let that = this;
      let json = {
        goods_id: this.$route.params.id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.store", json, "处理中...").then(
        function(response) {
          // console.log(response)
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
        goods_id: this.$route.params.id,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      $http.get("member.member-favorite.destroy", json, "处理中...").then(
        response => {
          // console.log(response)
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

    //初始化客服参数
    initCservice(newCservice) {
      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
      }
    },

    gotoService() {
      if (this.fun.isTextEmpty(this.hotel_info.cservice)) {
        Toast("请设置客服");
      }
      window.location.href = this.hotel_info.cservice;
    },

    order() {
      this.$router.push(
        this.fun.getUrl('HotelGoodsOrder', {}, {
          end: this.$route.query.end,
          start: this.$route.query.start,
          id: this.goods_info.hotel_id,
          goods_id: this.$route.params.id
        })
      );
    },

    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },

    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },

    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    //跳转优惠券领取
    gotoCoupon() {
      this.$router.push(
        this.fun.getUrl("hotelCoupon", {
          id: this.goods_info.hotel_id
        })
      );
    },

    getDetailData(tag) {
      if (this.goods_info.content) {
        let str = this.goods_info.content.replace(/src=\"http:/gi, 'src="https:');
        this.goodDetail.content = str;
      }
      console.log(this.goods_info, this.goodDetail);
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
    },
    //推广商品跳转
    pushGoodGoto(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val.id }));
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
      if (this.getScrollTop() + this.getClientHeight() + 105 > this.getScrollHeight()) {
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
    }
  },
  components: { Swipe, SwipeItem, cMyswipe, cComment, cCommentlist, cLive, yzGoodsposter,floatOrder,invitation },
  watch: {
    scroll() {
      this.loadSroll();
    },
    touchClose: function(newVal, oldVal) {
      this.showComment = newVal;
    }
  }
};
