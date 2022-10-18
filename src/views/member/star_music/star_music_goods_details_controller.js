import { Swipe, SwipeItem } from "components/meswipe";
import cMyswipe from "components/myswipe";
import cComment from "components/goods/children/comment";
import cCommentlist from "components/goods/children/commentList";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { Dialog, Toast } from "vant";

// var share_tag = "-1"; //顶部导航返回上一级按钮 标志

//商品详情
// var currentTabIndex = "0";
//标记 防止重复加载
// var is_first_content = false;
// var is_second_content = false;
var is_third_content = false;

var self = null;
var start = 0;
var last_distance = 0;
export default {
  props: ["goods_id"],
  data() {
    return {
      showBigImg: false,
      bigImages: [],//商品详情富文本图片预览

      // 是否有更多评论
      noMoreComment: false,
      // 初始评论页数
      commentPage: 1,
      posterShow: false, //商品分享二维码显示
      hoet: false,
      showGood: false,


      posterImg: {},
      gooddatas: {}, //总商品数据
      goodsInfo: {}, //商品详情信息
      activity: "", //活动id 通过props传递??
      goodsId: "",

      isFromOrderdetail: false, //是否从订单详情进入


      //商品详情
      first_content: "",

      third_content: [],

      isShowDetail: false, //是否展开宝贝详情
      isPullUp: false,
      showPageB: false,
      scroll: "",
      currentClass: 0,
      commentLimit: [], //评论组件，设置最新5条评论

      timer: null, //throttleFn方法节流，减少性能开支
      last: null,
      now: null,

      showImgPreview: false,
      images: [],

      favorable_rate: null, //拼团暂无
      showComment: false,
      showParameter: false, //商品参数弹窗

      showWechatshar: false,
      team: [],
      currentTime: parseInt(new Date().getTime() / 1000)
    };
  },
  beforeRouteLeave(to, from, next) {
    if (self.showComment) {
      console.log("当前页面评论打开");
      self.showComment = false;
      next(false);
    } else {
      console.log("当前页面评论关闭，可以跳转");
      next();
    }
  },
  activated() {
    this.init();
    this.slider();
    // if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
    //   share_tag = this.fun.getKey("share_tag");
    // }
    this.activity = this.$route.params.id; //
    this.fight_groups =
      this.$route.query.fight_groups !== undefined
        ? this.$route.query.fight_groups
        : "";
    this.getData();
    self = this;
    this.$nextTick(() => {
      // window.addEventListener("scroll", this.dataScroll);
      window.addEventListener("scroll", this.throttleFn);
    });
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("scroll", this.throttleFn);
    });
  },

  deactivated() {
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);
    window.removeEventListener("scroll", this.throttleFn);
  },
  methods: {
    //初始化数据
    init() {
      this.showBigImg = false;
      this.gooddatas = {};
      this.goodsInfo = {};
      this.activity = "";
      //  this.group_price = "";
      this.goodsId = "";
      //  this.show2 = false;
      this.showGood = false;
      this.fight_groups = "";
      this.commentPage = 1;
      // currentTabIndex = "0";
      // is_first_content = false;
      // is_second_content = false;
      is_third_content = false;
      this.firstActivityCon = "";
      this.first_content = "";

      this.third_content = [];


      this.posterShow = false;

      this.commentLimit = [];

      this.timer = null;
      this.last = null;
      this.now = null;
      this.showWechatshar = false;
      this.showComment = false;
      this.showPageB = false;
      this.showParameter = false;
      this.currentTime = parseInt(new Date().getTime() / 1000);
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

    getData() {
      let that = this;
      let json = {};
      if (!this.fun.isTextEmpty(this.fight_groups)) {
        //不为空则从订单详情页进入
        json.goods_id = that.activity;
        json.fight_groups_goods_id = that.fight_groups;
      } else {
        json.goods_id = that.activity;
      }
      $http
        .get(
          "plugin.star-spell.frontend.index.goodsDetail",
          json,
          "加载中"
        )
        .then(
          response => {
            if (response.result === 1) {
              console.log(response.data.goods);
              this.gooddatas = response.data.goods;
              this.goodsInfo = response.data.goods;
              //  this.group_price = response.data.goods.min_price;

              this.gooddatas.status = response.data.activity_state;
              this.favorable_rate = response.data.goods.favorable_rate;

              this.goodsId = response.data.goods.goods_id;

              let _team = response.data.team;
              for (let i = _team.length - 1; i >= 0; i--) {
                if (_team[i].end_time <= this.currentTime) {
                  _team.splice(i, 1); //删除下标为i的元素
                }
              }
              this.team = _team.splice(0, 3);

              this.commentLimit = response.data.comment.data;

              this.setDataByTabIndex(); //设置商品详情
              // this.initShare();
              this.fun.wxShare(
                "",
                { mid: this.fun.getKeyByMid() },
                {
                  title: this.fun.isTextEmpty(this.gooddatas.share_title) ? this.gooddatas.activity_name : this.gooddatas.share_title,
                  imgUrl: this.goodsInfo.thumb,
                  description: this.gooddatas.share_content
                }
              );
              this.showPageB = true;
              this.showGood = true;
              if (that.gooddatas.is_lottery && that.gooddatas.lottery_desc) {
                that.gooddatas.lottery_desc = that.gooddatas.lottery_desc.replace(/\n/g, "<br>");
              }
              console.log(this.currentTime, this.goodsInfo.end_time);
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response.msg);
          }
        );

    },
    gotoStarMusicListGroup() {
      if (this.team.length == 0) {
        return Toast("暂无更多可参团");
      }
      this.$router.push(this.fun.getUrl("starMusicListGroup", {}, { id: this.gooddatas.activity_id }));
    },
    gotoStarMusicGroupDetails(id) {
      this.$router.push(this.fun.getUrl("starMusicGroupDetails", { id }));
    },

    //设置选择后的数据
    setDataByTabIndex() {
      if (this.goodsInfo.content) {
        let str = this.goodsInfo.content.replace(/src=\"http:/gi, "src=\"https:");
        this.goodsInfo.content = str;
      }
      this.first_content = this.goodsInfo.content;
      // this.getCommentData();
    },

    imgPreview() {
      this.images = [];
      let _img = this.popThumb == null || this.popThumb == "" || this.popThumb == undefined ? this.goodsInfo.thumb : this.popThumb;
      this.images.push(_img);
      this.showImgPreview = true;
    },
    //获取评论数据
    getCommentData() {
      let that = this;
      let json = {
        goods_id: that.goodsId,
        page: this.commentPage,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        mid: this.fun.getKeyByMid()
      };
      // console.log(json);
      $http.get("goods.comment.get-comment", json, "获取中").then(
        function(response) {
          // console.log(response.data);
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

    timeEnd() {
      //倒计时结束时触发的回调方法
      // console.log("倒计时结束时触发的回调方法，timeEnd()");
      this.gooddatas.status = "2";
    },

    //跳转评论详情
    toContentInfo(data) {
      this.$router.push(
        this.fun.getUrl("CommentDetails", {
          order_id: data.order_id,
          goods_id: data.goods_id,
          comment_id: data.id,
          uid: data.uid
        })
      );
    },
    //顶部返回按钮
    goto() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    //跳转主页
    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    //海报生成
    postShow() {
      let toastPoster = Toast({
        duration: -1, // 持续展示 toast
        message: "正在为您生成海报中"
      });
      $http
        .get(
          "plugin.star-spell.frontend.goods-poster.generateGoodsPoster",
          { id: this.activity },
          "加载中"
        )
        .then(response => {
          toastPoster.close();
          if (response.result == 1) {
            this.posterImg = response.data;
            this.posterShow = true;
          } else {
            this.posterShow = false;
            Dialog({
              title: "提示",
              message: response.msg
            });
          }
        })
        .catch(error => {
          toastPoster.close();
          console.log(error);
        });

    },
    slider() {
      let that = this;
      // let goodinfo = this.$refs.goodinfo.offsetTop;
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
    setShareData(id) {
      let that = this;

      this.shareWeixin();
      wx.ready(function() {
        let _titles = "";
        let _imgUrls = "";
        let _descs = "";
        let _links = "";

        _titles = that.fun.isTextEmpty(that.gooddatas.share_title)
          ? that.gooddatas.activity_name
          : that.gooddatas.share_title;

        _imgUrls = that.goodsInfo.thumb;
        _descs = that.gooddatas.share_content;

        _links =
          that.fun.getSiteRoot() +
          "/addons/yun_shop/" +
          "?menu#" +
          "/member/starMusicGroupDetails/" + id +
          "?i=" + that.fun.getKeyByI() +
          "&type=5";
        _links = that.fun.isMid(_links, that.fun.getKeyByMid());

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            that.showWechatshar = false;
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _titles, // 分享标题
          desc: _descs, // 分享描述
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            that.showWechatshar = false;
            Toast("星拼乐分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
      //YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
      //this.shareWeixin();
    },
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appShare();
        return;
      }
      this.showWechatshar = true;
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
      let _title = that.fun.isTextEmpty(that.gooddatas.share_title)
        ? that.gooddatas.title
        : that.gooddatas.share_title;

      let _link = that.gooddatas.share_url;

      let _imgUrl = that.goodsInfo.thumb;
      let _desc = that.gooddatas.share_content;
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //初始化分享设置
    initShare() {
      let json = {
        url:
          this.fun.isIosOrAndroid() === "android"
            ? window.location.href
            : window.initUrl,
        mid: this.fun.getKeyByMid()
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            if (response.data.config) {
              this.share(response.data);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;
      console.log("调用分享");
      wx.config(data.config);
      wx.ready(function() {
        let _titles = "";
        let _imgUrls = "";
        let _descs = "";
        let _links = "";

        _titles = that.fun.isTextEmpty(that.gooddatas.share_title)
          ? that.gooddatas.activity_name
          : that.gooddatas.share_title;

        _links = document.location.href;
        _links = that.fun.isMid(_links, data.info.uid);
        _imgUrls = that.goodsInfo.thumb;
        _descs = that.gooddatas.share_content;

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            that.showWechatshar = false;
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _titles, // 分享标题
          desc: _descs, // 分享描述
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            that.showWechatshar = false;
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
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
        document.getElementById("main").removeEventListener("touchstart", this.handleTouchstart);
        document.getElementById("main").removeEventListener("touchmove", this.handleTouchmove);
        document.getElementById("main").removeEventListener("touchend", this.handleTouchend);
        last_distance = 0;
        if (!this.showPageB) {
          this.showPageB = true;
        }
      }
    },
    dataScroll() {
      this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      //滚动事件触发
      if (
        this.getScrollTop() + this.getClientHeight() + 105 >
        this.getScrollHeight()
      ) {
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
        this.showPageB = true;
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
    }
  },
  computed: {
    //底部去参团按钮文字
    showStatusText() {
      if (this.gooddatas.status == "0") {
        return "活动未开始";
      } else if (this.gooddatas.status == "2") {
        return "活动已结束";
      }
    }
  },
  components: { Swipe, SwipeItem, cMyswipe, cComment, cCommentlist, yzWechatShareImg },
  watch: {
    scroll() {
      this.loadSroll();
    }
  }
};
