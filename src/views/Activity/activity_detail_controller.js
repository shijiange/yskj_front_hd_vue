import cTitle from "components/title";
import { Toast } from 'vant';
import BScroll from "better-scroll";

export default {
  data() {
    return {
      Data: {},
      showAll: true, //内容是否全部展示
      time: "",
      Day: "", //剩余天
      Hour: "", //剩余小时
      Min: "", //剩余分钟
      Sec: "", //剩余秒
      stop: false, //判断活动是否结束
      songStop: true, //判断停止还是播放
      end: "", //活动结束时间
      commission_amount: [], //排行榜数据
      orders: [], //返回的订单列表数据
      readyState: 0, //音频是否加载完成
      clientWidths: "",
      browse_count: "", //浏览人数
      award_count: "",
      buy_count: "",
      show: false,
      store_id: '',

      poster_open:0,
      poster_show:false,
      poster_url:''
    };
  },
  activated() {
    this.show = false;
    this.store_id = this.$route.query.store_id;
    this.initData();
    this.getData();

    this.clientWidths = document.body.clientWidth;
  },
  mounted() {
    this.clientWidths = document.body.clientWidth;
    this.autoPlayAudio2();
  },
  methods: {
    initData() {
      this.Data = {};
      this.showAll = true; //内容是否全部展示
      this.time = "";
      this.Day = ""; //剩余天
      this.Hour = ""; //剩余小时
      this.Min = ""; //剩余分钟
      this.Sec = ""; //剩余秒
      this.stop = false; //判断活动是否结束
      this.songStop = true; //判断停止还是播放
      this.browse_member = []; //浏览头像
      this.commission_amount = []; //排行榜数据
      this.orders = []; //返回的订单列表数据
      this.readyState = 0;
      this.clientWidths = "";
      this.browse_count = 0;

      this.poster_open = 0;
      this.poster_show = false;
      this.poster_url = '';
    },
    _initScrollCart() {
      this.storeScroll = new BScroll(this.$refs.store, {
        click: true
      });
    },
    _initScrollCart1() {
      this.storeScroll1 = new BScroll(this.$refs.store1, {
        click: true
      });
    },
    showStore() {
      this.$nextTick(() => {
        if (this.Data.award_list == 1) {
          if (!this.storeScroll) {
            this._initScrollCart();
          } else {
            this.storeScroll.refresh();
          }
        }

        if (this.Data.order_list == 1) {
          if (!this.storeScroll1) {
            this._initScrollCart1();
          } else {
            this.storeScroll1.refresh();
          }
        }

      });
    },
    //获取数据
    getData() {
      let json = {
        activity_id: this.fun.getKey("activity_id")
      };
      $http
        .get(
          "plugin.share-activity.frontend.activity.index",
          json,
          "获取中"
        )
        .then(response => {
          if (response.result == 1) {
            let Activity = document.getElementById("Activity");
            this.Data = response.data;
            if (this.Data.audio_link) {
              this.autoPlay();
            }

            this.store_id = this.Data.store_id;
            this.browse_count = this.Data.browse_count;
            this.browse_member = this.Data.browse_member;
            this.end = this.Data.end_time;
            this.poster_open = this.Data.poster_open||0;
            this.fun.setWXTitle(this.Data.name);
            // this.showStore();
            this.countdown();
            // this.initShare();
            this.fun.wxShare(
              "",
              { },
              {
                title: this.Data.share_title?this.Data.share_title:'',
                imgUrl: this.Data.share_thumb?this.Data.share_thumb:'',
                description: this.Data.share_content?this.Data.share_content:''
              }
            );
            Activity.style.backgroundColor = this.Data.color;
            if (this.Data.order_list == 1) {
              this.getOrderData();
            }
            if (this.Data.award_list == 1) {
              this.getAwardData();
            }
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取购买列表
    getOrderData() {
      let json = {
        activity_id: this.fun.getKey("activity_id")
      };
      $http
        .get(
          "plugin.share-activity.frontend.activity.getOrders",
          json,
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.buy_count = response.data.buy_count;
            this.orders = response.data.orders;
          } else {
            this.$dialog.alert({message:response.msg});

          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取奖励列表
    getAwardData() {
      let json = {
        activity_id: this.fun.getKey("activity_id")
      };
      $http
        .get(
          "plugin.share-activity.frontend.activity.getAwards",
          json,
          "获取中"
        )
        .then(response => {
          if (response.result == 1) {
            this.award_count = response.data.award_count;
            this.commission_amount = response.data.awards;
          } else {
            this.$dialog.alert({message:response.msg});

          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //分享
    initShare() {
      let that = this;
      $http
        .post("member.member.wxJsSdkConfig", {
          url:
            that.fun.isIosOrAndroid() === "android"
              ? window.location.href
              : window.initUrl
        })
        .then(response => {
          if (response.result === 1) {
            setTimeout(() => {
              if (response.data.config) {
                that.share(response.data);
              }
            }, 800);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    share(data) {
      //自定义分享
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = "";
        let _imgUrl = "";
        let _desc = "";

        let _link = document.location.href + "&share_tag=2";
        _link = that.fun.isMid(_link, data.info.uid);
        //开启自定义分享
        _title = that.fun.isTextEmpty(that.Data.share_title)
          ? data.shop.share.title
          : that.Data.share_title;
        _imgUrl = that.fun.isTextEmpty(that.Data.share_thumb)
          ? data.share.icon
          : that.Data.share_thumb;
        _desc = that.fun.isTextEmpty(that.Data.share_content)
          ? data.share.desc
          : that.Data.share_content;

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
    //活动倒计时
    countdown() {
      // 当前时间戳
      const now = Date.parse(new Date()) / 1000;
      if (this.end - now <= 0) {
        this.stop = true;
        return;
      }

      let msec = 0;
      if (now >= this.Data.star_time) {
        // 相差的秒数
        msec = this.end - now;
      } else {
        msec = this.Data.star_time - now;
      }


      // 计算的时间
      let day = parseInt(msec / 60 / 60 / 24);

      let hr = parseInt((msec / 60 / 60) % 24);
      let min = parseInt((msec / 60) % 60);
      let sec = parseInt(msec % 60);
      // 个位数前补零
      hr = hr > 9 ? hr : "0" + hr;
      min = min > 9 ? min : "0" + min;
      sec = sec > 9 ? sec : "0" + sec;
      // 控制台打印
      // this.time=`${day}天 ${hr}小时 ${min}分钟 ${sec}秒`
      (this.Day = day), (this.Hour = hr), (this.Min = min), (this.Sec = sec);
      // 一秒后递归
      setTimeout(() => {
        this.countdown();
      }, 1000);
    },
    onLoadedmetadata(res) {
      this.readyState = this.$refs.audio.readyState;
      this.autoPlay();
    },
    // 歌曲播放
    play() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
        this.songStop = false;
      } else {
        this.$refs.audio.pause();
        this.songStop = true;
      }
    },
    autoPlay() {
      const that = this;
      this.songStop = false;
      this.$refs.audio.play();
      if (this.fun.isWeiXin()) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          function() {
            that.$refs.audio.play();
            that.songStop = false;
          },
          false
        );
      }
    },
    //跳转到商品详情
    toGoods() {
      if (Date.parse(new Date()) / 1000 < this.Data.star_time) {
        this.$dialog.alert({message:"目前还没到开始时间"});
        return;
      }
      if (Date.parse(new Date()) / 1000 > this.Data.end_time) {
        this.$dialog.alert({message:"活动时间已结束"});
        return;
      }
      if (this.Data.diyform_id) {
        this.$router.push(
          this.fun.getUrl("activityDiyForm", {
            id: this.Data.diyform_id,
            // tag: "-2", //立即购买,
            goodsId: this.Data.goods_id,
            optionsId: this.Data.option_id,
            total: this.Data.total
          },{
            store_id: this.store_id
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("goodsorder",{}, {
            tag: "-2", //立即购买,
            goodsId: this.Data.goods_id,
            optionsId: this.Data.option_id,
            total: this.Data.total,
            store_id: this.store_id
          })
        );
      }
    },
    swipeToTop(index) {
      if (index === this.commission_amount.length - 2) {
        this.$refs.swipe.swipeTo(0);
      }
      if (index === this.orders.length - 2) {
        this.$refs.swipe1.swipeTo(0);
      }
    },
    autoPlayAudio2() {
      const that = this;
      wx.config({
        // 配置信息, 即使不正确也能使用 wx.ready
        debug: false,
        appId: "",
        timestamp: 1,
        nonceStr: "",
        signature: "",
        jsApiList: []
      });
      wx.ready(function() {
        that.$refs.audio.play();
      });
    },
    //悬浮按钮跳转
    linkTo(str) {
      if (str == "order") {
        this.$router.push(this.fun.getUrl("orderlist", { status: "0" }));
      } else if (str == "member") {
        this.$router.push(this.fun.getUrl("member"));
      } else {
        this.show = true;
      }
    },
    getPosterImage(){
      if(this.poster_url!='') {
        this.poster_show=true;
        return;
      }
      let json = {
        activity_id: this.fun.getKey("activity_id")
      };
      $http
        .get(
          "plugin.share-activity.frontend.activity.get-poster",
          json,
          "获取中"
        )
        .then(response => {
          if (response.result == 1) {
            console.log(response.data.poster);
            this.poster_url = response.data.poster;
            this.poster_show = true;
          }
        });
    }
  },
  components: {
    cTitle
  }
};
