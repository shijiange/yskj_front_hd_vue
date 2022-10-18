import cTitle from "components/title";
import goodsDetails from "./components/goodsDetails.vue";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
export default {
  data() {
    return {
      currentTime: parseInt(new Date().getTime() / 1000),

      //组合商品弹窗
      multiplePopupInfo: {
        title: "",
        info: {},
        show: false
      },

      //商品详情弹窗
      goodsDetailsPopupInfo: {
        show: false,
        info: {}
      },

      //单商品弹窗
      singlePopupInfo: {
        title: "",
        show: false,
        info: {}
      },

      //海报弹窗信息
      posterPopupInfo:{
        show:false,
        src:''
      },

      contactShow: false, //联系我们 弹窗

      seePrizeShow: false,
      seePrizeAnimation: false,

      gifShow: false, //动图显示



      goods: [], //商品
      activity: {}, //盲盒详情
      assist: {}, //助力信息
      member: {}, //个人信息

      timer: null, //抽奖倒计时对象
      luckdrawCountDown: 0, //抽奖倒计时

      isBlindBoxTap: true, //盲盒抽取按钮
      isBlindBoxTapPay: false, //盲盒付费按钮
      isInvitePlan: false, //盲盒邀请好友按钮
      isAddress: false, //填写地址按钮

      showWechatshar: false, //微信分享引导
      integral: window.localStorage.getItem('integral') || '积分',

      //盲盒相关数据
      // blindBoxInfo: {
      //   show: false,
      //   pattern: 0,
      //   goods: [],
      //   combination: {}
      // },

      networkLoading:false,		//数据请求完成

    };
  },
  created(){
    this.getData();
  },
  mouted() {},
  watch: {
    seePrizeShow(newVal, oldVal) {
      console.log(newVal);
      if (newVal == true) {
        setTimeout(() => {
          this.seePrizeAnimation = true;
        }, 50);
      } else {
        this.seePrizeAnimation = false;
      }
    }
  },
  methods: {
    getData() {
      $http.get("plugin.blind-box.api.index.activity-info", { id: this.$route.query.id }, "").then(res => {
        if (res.result == 1) {
          this.goods = res.data.goods;
          this.activity = res.data.activity;
          this.assist = res.data.assist;
          this.member = res.data.member;
          this.networkLoading=true;
          // this.initShare();
          if (this.assist && this.assist.expire) {
            console.log("currentTime", this.currentTime, this.assist.expire);
            if (this.currentTime <= this.assist.expire || this.assist.status == 1) {
              this.isBlindBoxTap = false;
              this.isInvitePlan = true;
            } else {
              this.luckdrawCountDown = this.activity.extract_time;
              this.startLuckCountDown();
            }
          } else {
            this.luckdrawCountDown = this.activity.extract_time;
            this.startLuckCountDown();
          }
          console.log("hahahhaha", this.isInvitePlan, this.assist.status);

          this.fun.wxShare(
            "",
            { mid: this.fun.getKeyByMid() },
            {
              title: this.activity.activity_name,
              imgUrl: this.activity.activity_img_src,
              link:this.isInvitePlan && this.assist.status == 0?this.fun.getSiteRoot() +
            "/addons/yun_shop/?menu#/member/blindBoxHelping?i=" +
              this.fun.getKeyByI() +
            "&assist_id=" +
              this.assist.id +
            "&member_id=" +
              this.assist.member_id:''
            }
          );
          console.log(this.activity);
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    openGoodsDetailsPopup(item) {
      console.log(item);
      this.goodsDetailsPopupInfo.info = item;
      this.goodsDetailsPopupInfo.show = true;
    },
    //开始倒计时
    startLuckCountDown() {
      this.timer = setInterval(() => {
        if (this.luckdrawCountDown <= 0) {
          clearInterval(this.timer);
          return;
        }
        this.luckdrawCountDown--;
        console.log("执行");
      }, 1000);
    },
    //开始抽奖
    startLuckDraw() {
      if (this.luckdrawCountDown <= 0) {
        this.$dialog.alert({ message: "请刷新或重新进入" });
        return;
      }
      this.addJoinLog();
      if (this.activity.activity_type == 0) {

        //付费
        setTimeout(() => {

          this.seePrizeShow = true;
          setTimeout(() => {
            this.gifShow = false;
            //this.seePrizeShow = false;
            this.isBlindBoxTap = false;
            this.isBlindBoxTapPay = true;
          }, 1);
        }, 1500);
        this.gifShow = true;
      } else if (this.activity.activity_type == 1) {
        //免费
        this.generateAssist();
      }
    },
    //免费-第一次发起助力
    generateAssist() {
      $http.get("plugin.blind-box.api.assist.generate-assist", { id: this.$route.query.id }, "").then(res => {
        if (res.result == 1) {
          this.isBlindBoxTap = false;
          this.isInvitePlan = true;
          this.assist = res.data.assist;
          this.assist.assist_log_count = this.assist.assist_log.length;
          this.assist.status = 0;
          console.log(this.assist);
          // this.initShare();
          this.fun.wxShare(
            "",
            { mid: this.fun.getKeyByMid() },
            {
              title: this.activity.activity_name,
              imgUrl: this.activity.activity_img_src,
              link:this.isInvitePlan && this.assist.status == 0?this.fun.getSiteRoot() +
              "/addons/yun_shop/?menu#/member/blindBoxHelping?i=" +
                this.fun.getKeyByI() +
              "&assist_id=" +
                this.assist.id +
              "&member_id=" +
                this.assist.member_id:''
            }
          );
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    freePrize() {
      setTimeout(() => {
        this.seePrizeShow = true;
        setTimeout(() => {
          this.gifShow = false;
          //  this.seePrizeShow = false;
          this.isInvitePlan = false;
          this.isAddress = true;
        }, 1);
      }, 1500);
      this.gifShow = true;
    },
    //提示按钮
    seeTips() {
      if (this.activity.tips - this.activity.tips_count <= 0) {
        this.$dialog.confirm({ title: "提示一次需要消耗" + this.activity.tips_consume + this.integral, message: `当前${this.integral}` + this.member.credit1 }).then(result => {
          if (result == "confirm") {
            this.getTips();
          }
        });

        return;
      }
      this.getTips();
    },
    getTips() {
      $http.get("plugin.blind-box.api.tips.get-tips", { id: this.$route.query.id }, "").then(res => {
        if (res.result == 1) {
          this.activity.tips_count++;
          this.singlePopupInfo.title = "不可能抽中";
          this.singlePopupInfo.info = res.data.activityGoods;
          this.singlePopupInfo.show = true;
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    //再抽一次
    onceMore() {
      location.reload();
      // $http.get("plugin.blind-box.api.tips.invalid-tips", { id: this.$route.query.id }, "").then(res => {
      //   if (res.result == 1) {
      //     setTimeout(() => {

      //       this.seePrizeShow = true;
      //       setTimeout(() => {
      //         this.gifShow = false;
      //         this.seePrizeShow = false;
      //       }, 3000);
      //     }, 1500);
      //     this.gifShow = true;
      //   } else {
      //     this.$dialog.alert({ message: res.msg });
      //   }
      // });
    },
    getPoster(){
      if(this.posterPopupInfo.src!=''){
        this.posterPopupInfo.show=true;
        return;
      }
      $http.get("plugin.blind-box.api.index.poster", { activity_id: this.$route.query.id }, "").then(res => {
        if (res.result == 1) {
          console.log(res);
          this.posterPopupInfo.src = res.data.poster;
          this.posterPopupInfo.show=true;
        } else {
          this.$dialog.alert({ message: res.msg });
        }
      });
    },
    addJoinLog(){
      $http.get("plugin.blind-box.api.index.join-log",{id: this.activity.id},"");
    },
    // getBlindBoxGoods(id) {
    //   $http
    //     .get(
    //       "plugin.blind-box.api.index.blind-box-goods",
    //       {
    //         order_id: id
    //       },
    //       ""
    //     )
    //     .then(res => {
    //       console.log(res);
    //       if (res.result == 1) {
    //         this.blindBoxInfo.show=true;
    //         if (res.data.combination == null) {
    //           this.blindBoxInfo.pattern = 0;
    //         } else {
    //           this.blindBoxInfo.pattern = 1;
    //           this.blindBoxInfo.combination = res.data.combination;
    //         }
    //         this.blindBoxInfo.goods = res.data.goods;
    //       }
    //     });
    // },
    gotoOrder() {
      this.$router.push(
        this.fun.getUrl(
          "goodsorder",
          {},
          {
            tag: "blindBox",
            at_id: this.activity.id,
            goodsId: this.activity.goods_id
          }
        )
      );
    },
    gotoOrderList() {
      this.$router.push(this.fun.getUrl("orderlist", { status: 0 }));
    },
    seeCombinationGoods(item) {
      this.multiplePopupInfo.info = item.combination;
      this.multiplePopupInfo.title = item.combination.combination_name;
      this.multiplePopupInfo.show = true;
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
      let _title = that.activity.activity_name;
      let uid = window.localStorage.getItem("uid");
      let _link = document.location.href;
      _link = that.fun.isMid(_link, uid);
      let _imgUrl = that.activity.activity_img_src;
      let _desc = "";
      YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
    },

    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl,
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

        _titles = that.activity.activity_name;

        _links = document.location.href;
        _links = that.fun.isMid(_links, that.fun.getKeyByMid());
        _imgUrls = that.activity.activity_img_src;
        //_descs = that.activity.share_content;
        if (that.isInvitePlan && that.assist.status == 0) {
          _links =
					that.fun.getSiteRoot() +
            "/addons/yun_shop/" +
            "?menu#" +
            "/member/blindBoxHelping/" +
            "?i=" +
            that.fun.getKeyByI() +
            "&assist_id=" +
            that.assist.id +
            "&member_id=" +
						that.assist.member_id;
          _links = that.fun.isMid(_links, that.fun.getKeyByMid());
        }
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
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
  components: {
    cTitle,
    goodsDetails,
    yzWechatShareImg
  }
};
