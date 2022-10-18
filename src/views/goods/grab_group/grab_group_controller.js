import { Toast, Swipe as VanSwipe, SwipeItem as VanSwipeItem } from "vant";
import { Swipe, SwipeItem } from "components/meswipe";
import cMyswipe from "components/myswipe";
import cComment from "components/goods/children/comment";
import cCommentlist from "components/goods/children/commentList";
import yzSpecs from "components/ui_components/yz_specs";
// var share_tag = "-1"; //顶部导航返回上一级按钮
var is_third_content = false;

var self = null;
var start = 0;
var last_distance = 0;
export default {
  props: ["goods_id"],
  data() {
    return {
      showGood: false,
      buy_type: 1, //团长是否参与中奖
      optionsId: null, //规格id
      showOpenGroup: false,
      showParameter: false,
      show1: false,
      show2: false,
      showShare: false,
      showGoodslist: false,
      isCheckActivity: true, //下单前检查客户今天是否超出限制
      cservice: "",
      // 是否有更多评论
      noMoreComment: false,
      // 初始评论页数
      commentPage: 1,
      posterShow: false, //商品分享二维码显示
      hoet: false,

      popStock: 0, //库存

      posterImg: {},
      gooddatas: {}, //总商品数据
      goodsInfo: {}, //商品详情信息
      goodsId: "",
      group_price: "", //拼团价
      goodsDescription: "",
      goodsCount: 1, //购买数量
      isFromOrderdetail: false, //是否从订单详情进入
      option_level_id: "", //规格层级id

      //商品详情
      first_content: "",
      second_content: "",
      third_content: [],
      activeName: "first",

      groupStock: 1, //当前拼团商品的库存

      isShowDetail: false, //是否展开宝贝详情
      isPullUp: false,
      showPageB: false,
      scroll: "",
      currentClass: 0,
      commentLimit: [], //评论组件，设置最新5条评论
      goodDetail: {},

      timer: null, //throttleFn方法节流，减少性能开支
      last: null,
      now: null,

      showImgPreview: false,
      images: [],

      favorable_rate: null, //拼团暂无
      showComment: false,
      team: [],

      popupSpecs: false,
      leader_partake: 1, //团长是否参与中奖 1-是 2-否
      istimestamp: null, //倒计时
      timestamp: Date.parse(new Date()) / 1000, //获取当前时间戳

      memberTeams: []
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
    this.goods_id = this.$route.params.id; //商品id
    this.getData();
    self = this;
    this.$nextTick(() => {
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
    this.showGood = false;
  },
  methods: {
    //初始化数据
    init() {
      this.gooddatas = {};
      this.goodsInfo = {};
      this.group_price = "";
      this.goodsId = "";
      this.show2 = false;
      this.fight_groups = "";
      this.commentPage = 1;
      is_third_content = false;
      this.firstActivityCon = "";
      this.first_content = "";
      this.second_content = "";
      this.third_content = [];
      this.activeName = "first";
      this.showOpenGroup = false;
      this.posterShow = false;
      this.goodsCount = 1;
      this.groupStock = 1;
      this.option_level_id = "";

      this.commentLimit = [];
      this.goodDetail = {};
      this.timer = null;
      this.last = null;
      this.now = null;
      this.showComment = false;
      this.showPageB = false;
      this.showGoodslist = false;
      this.isCheckActivity = true;
      this.leader_partake = 1;
      this.optionsId = null;
    },
    closeShare() {
      this.showShare = false;
    },
    // 获取拼团商品详情
    getData() {
      let that = this;
      let json = {
        art: "goodsDetail",
        goods_id: this.$route.params.id
      };
      $http.get("plugin.snatch-regiment.api.index.getSnatchData", json, "").then(
        response => {
          this.showGood = true;
          if (response.result === 1) {
            const teamData = JSON.parse(JSON.stringify(response.data.goodsDetail.team)); //* 深拷贝
            const teams = [];
            let startIndex = 0;
            let loopCount = Math.ceil(teamData.length / 2);
            for (let index = 0; index < loopCount; index++) {
              teams.push(teamData.slice(startIndex, startIndex + 2));
              startIndex += 2;
            }
            this.gooddatas = response.data.goodsDetail.goods;
            this.team = teams;
            this.cservice = response.data.goodsDetail.custom_service;
            this.gooddatas.thumb = [this.gooddatas.thumb];
            this.commentLimit = response.data.goodsDetail.comment.data;
            this.leader_partake = response.data.goodsDetail.leader_partake;
            this.istimestamp = this.timestamp < this.gooddatas.start_time ? Number(this.gooddatas.start_time) : Number(this.gooddatas.end_time);
            that.setDataByTabIndex(); //设置商品详情
            // that.initShare();
            that.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid(),
                goods_id: that.goods_id },
              {
                title: that.fun.isTextEmpty(that.gooddatas.share_title) ? that.gooddatas.title : that.gooddatas.share_title,
                imgUrl: that.fun.isTextEmpty(that.gooddatas.share_thumb) ? that.gooddatas.thumb[0] : that.gooddatas.share_thumb,
                description: that.fun.isTextEmpty(that.gooddatas.share_desc) ? "邀请您加入抢团活动" : that.gooddatas.share_desc
              }
            );
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    //获取数据列表
    checkActivity() {
      let that = this;
      $http
        .get(
          "plugin.snatch-regiment.api.index.getSnatchData",
          { art: "inspectOverrun", leader_id: 0, at_id: this.gooddatas.activity_id, option_id: this.optionsId, goods_id: this.$route.params.id, total: this.goodsCount },
          ""
        )
        .then(
          response => {
            if (response.result === 1) {
              that.isCheckActivity = true;
              if (this.buy_type == 1) {
                //团长开团不参与中奖
                this.$dialog
                  .confirm({
                    title: "提示",
                    message: "开团后不参与中奖？"
                  })
                  .then(() => {
                    // on confirm
                    that.OpenLeader();
                  })
                  .catch(() => {
                    // on cancel
                    Toast("已取消");
                  });
              } else if (this.buy_type == 2) {
                //团长开团参与中奖
                this.openGroup();
              }
            } else {
              that.isCheckActivity = false;
              Toast(response.msg);
            }
          },
          response => {}
        );
    },
    //加入该团按钮
    clickAdd(oid) {
      this.$router.push(this.fun.getUrl("grabGroup_detail", { id: oid }));
    },

    //设置选择后的数据
    setDataByTabIndex() {
      if (this.gooddatas.content) {
        let str = this.gooddatas.content.replace(/src=\"http:/gi, 'src="https:');
        let reg1 = /<iframe[^>]*>(.|\n)*<\/iframe>/gi;
        this.gooddatas.content = str.replace(reg1, "");
      }
      this.first_content = this.gooddatas.content;
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
        goods_id: that.goods_id,
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
    //显示去参团列表弹层
    showGroupMore() {
      if (this.team.length == 0) {
        Toast("抱歉，暂无更多可参与的团");
        return;
      }
      this.show2 = true;
    },
    openOrder(_type) {
      this.buy_type = _type;
      this.popupSpecs = true;
    },
    OpenLeader() {
      let that = this;
      $http.get("plugin.snatch-regiment.api.team.OpenLeader", { at_id: this.gooddatas.activity_id, goods_id: that.goods_id }).then(
        response => {
          if (response.result === 1) {
            Toast("开团成功！");
            that.$router.push(that.fun.getUrl("grab_group_my", {}));
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    openGroup() {
      if (!this.isCheckActivity) {
        Toast("抱歉，您已超出限制条件");
        return;
      }
      if (this.goodsCount == 0) {
        Toast("抱歉，库存不足");
        return;
      }
      let that = this;
      let goods = [];
      goods.push(that.goods_id);
      $http.get("from.div-from.isDisplay", { goods_ids: JSON.stringify(goods) }, "加载中").then(
        function(response) {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog
                .confirm({ message: "购买跨境商品,请补充您的个人信息" })
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: "grabGroup_open",
                      goodsId: that.goods_id,
                      at_id: that.gooddatas.activity_id, //活动ID
                      optionsId: that.optionsId,
                      total: that.goodsCount
                    })
                  );
                })
                .catch(() => {});
            } else {
              that.$router.push(
                that.fun.getUrl(
                  "goodsorder",
                  {},
                  {
                    tag: "-2",
                    orderType: "grabGroup_open",
                    optionsId: that.optionsId,
                    goodsId: that.goods_id, //活动商品ID
                    at_id: that.gooddatas.activity_id, //活动ID
                    total: that.goodsCount
                  }
                )
              );
            }
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
          that.isGoods = false;
        }
      );
    },
    close_yz_specs_popup(_optionsId, goodsCount, clicktype) {
      // console.log('aaaaaaaaa', _optionsId, goodsCount)
      this.optionsId = _optionsId;
      this.goodsCount = goodsCount;
      this.popupSpecs = false;
      if (clicktype == 1) {
        //点击确认按钮
        if (this.$refs.goodSku.popPrice == 0) {
          this.$dialog.alert({ message: "开团/参团金额不正确，不能为0" });
          return;
        }
        this.checkActivity();
      }
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
    //跳转聚合页
    gotoGrabGroupHome() {
      this.$router.push(this.fun.getUrl("grab_group_home", {}));
    },
    //跳转主页
    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    gotoShopGoods(_id) {
      this.$router.push(this.fun.getUrl("goods", { id: _id }));
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
        .get("plugin.snatch-regiment.api.GoodsPoster.generateGoodsPoster", { id: this.goods_id }, "加载中")
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
        if (document.documentElement.scrollHeight == document.documentElement.clientHeight + top) {
          //alert("Touch_Buttom!");
          document.addEventListener("touchstart", this.move, false);

          document.addEventListener("touchmove", this.move, false);
        }
      };
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
      this.showShare = true;
    },
    //app分享设置
    appShare(data) {
      var that = this;

      let _title = that.fun.isTextEmpty(that.gooddatas.share_title) ? that.gooddatas.title : that.gooddatas.share_title;
      let _imgUrl = that.fun.isTextEmpty(that.gooddatas.share_thumb) ? that.gooddatas.thumb[0] : that.gooddatas.share_thumb;
      let _desc = that.fun.isTextEmpty(that.gooddatas.share_desc) ? "邀请您加入抢团活动" : that.gooddatas.share_desc;

      let _link = document.location.href;
      _link = that.fun.isMid(_link, data.info.uid);

      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid(),
        goods_id: this.goods_id
      };
      $http.post("member.member.wxJsSdkConfig", json).then(
        response => {
          if (response.result === 1) {
            // var cs = data.shop.cservice;
            if (response.data.config) {
              this.share(response.data);
            }
          } else {
            console.error(response.msg);
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
      wx.config(data.config);
      wx.ready(function() {
        let _titles = that.fun.isTextEmpty(that.gooddatas.share_title) ? that.gooddatas.title : that.gooddatas.share_title;
        let _imgUrls = that.fun.isTextEmpty(that.gooddatas.share_thumb) ? that.gooddatas.thumb[0] : that.gooddatas.share_thumb;
        let _descs = that.fun.isTextEmpty(that.gooddatas.share_desc) ? "邀请您加入抢团活动" : that.gooddatas.share_desc;

        let _links = document.location.href;
        _links = that.fun.isMid(_links, data.info.uid);

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
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
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    hideIdexbb() {
      let nowTimes = Math.round(new Date() / 1000); //获取当前时间戳
      for (let i = 0; i < this.team.length; i++) {
        if (this.team[i].end_time <= nowTimes) {
          if (i == 0) {
            this.team.shift(); //删除并返回数组的第一个元素
            return this.team;
          } else if (i == length - 1) {
            this.team.pop(); //删除并返回数组的最后一个元素
            return this.team;
          } else {
            this.team.splice(i, 1); //删除下标为i的元素
            return this.team;
          }
        }
      }
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
          this.showPageB = true;
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
  computed: {},
  components: { Swipe, SwipeItem, cMyswipe, cComment, cCommentlist, yzSpecs, VanSwipe, VanSwipeItem },
  watch: {
    scroll() {
      this.loadSroll();
    }
  }
};
