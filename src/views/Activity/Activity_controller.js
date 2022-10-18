import cTitle from "components/title";
import { Toast } from 'vant';
import BScroll from "better-scroll";
export default {
  data() {
    return {
      Data: {},
      showAll: false, //内容是否全部展示
      time: "",
      Day: "", //剩余天
      Hour: "", //剩余小时
      Min: "", //剩余分钟
      Sec: "", //剩余秒
      stop: false, //判断活动是否结束
      songStop: true, //判断停止还是播放
      button: 0, //是否开启悬浮按钮
      button_name: "", //悬浮按钮名称
      goods_id: "", //商品id
      is_store: 0, //联盟商家是否开启
      wheels: [], //免费详情数据
      start: "", //活动开始时间
      end: "", //活动结束时间
      commission_amount: [], //排行榜数据
      timeShow: 0, //是否开启倒计时
      stores: [], //返回的联盟商家数据
      business: [], //组装后的联盟商家数据
      link: "",
      readyState: 0, //音频是否加载完成
      clientWidths: "",
      member_count: "", //参与人数
      shareInfo: {},
      isSetShare: 0, //是否开启了自定义分享 ，0||关闭
      setWidth1: 0,
      setWidth2: 0,
    };
  },
  activated() {
    this.initData();
    this.getData();
    this.$nextTick(() => {
      // this.initShare();
      this.fun.wxShare(
        "",
        {},
        {
          title: this.shareInfo.title?this.shareInfo.title:'',
          imgUrl: this.shareInfo.icon?this.shareInfo.icon:'',
          description: this.shareInfo.desc?this.shareInfo.desc:''
        }
      );
    });
    let bodySize = document.getElementsByTagName("html")[0].style.fontSize.substring(0,2);
    this.clientWidths = document.body.clientWidth;
    this.setWidth1 = parseInt(21.5625*bodySize);
    this.setWidth2 = parseInt(19.6875*bodySize);
  },
  mounted() {
    // this.$nextTick(()=>{
    //   this.autoPlay()
    // })
    this.clientWidths = document.body.clientWidth;
    this.autoPlayAudio2();
  },
  methods: {
    replace(item) {
      if (item.indexOf("\n") >= 0) {
        return item.split("\n").join("<br>");
      } else {
        return item;
      }
    },
    initData() {
      this.Data = {};
      this.showAll = false; //内容是否全部展示
      this.time = "";
      this.Day = ""; //剩余天
      this.Hour = ""; //剩余小时
      this.Min = ""; //剩余分钟
      this.Sec = ""; //剩余秒
      this.stop = false; //判断活动是否结束
      this.songStop = true; //判断停止还是播放
      this.button = 0; //是否开启悬浮按钮
      this.button_name = ""; //悬浮按钮名称
      this.goods_id = ""; //商品id
      this.is_store = 0; //联盟商家是否开启
      this.wheels = []; //免费详情数据
      this.start = ""; //活动开始时间
      this.end = ""; //活动结束时间
      this.commission_amount = []; //排行榜数据
      this.timeShow = 0; //是否开启倒计时
      this.stores = []; //返回的联盟商家数据
      this.business = []; //组装后的联盟商家数据
      this.link = "";
      this.readyState = 0;
      this.clientWidths = "";
      this.member_count = "";
      this.shareInfo = {};
      this.isSetShare = 0;
    },
    _initScrollCart() {
      this.storeScroll = new BScroll(this.$refs.store, {
        click: true
      });
    },
    showStore() {
      this.$nextTick(() => {
        if (!this.storeScroll) {
          this._initScrollCart();
        } else {
          this.storeScroll.refresh();
        }
      });
    },
    //组装返回的联盟商家数据
    StoreArr() {
      let n = Math.ceil(this.stores.length / 10);
      for (let i = 1; i <= n; i++) {
        let arr = [];
        arr.push(this.stores.slice((i - 1) * 10, i * 10));
        this.business.push(arr);
      }
    },
    //获取链接上的某个参数的值
    getQueryString(name) {
      return (
        decodeURIComponent(
          (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [,""])[1].replace(/\+/g, "%20")
        ) || null
      );
    },
    //获取数据
    getData() {
      let json = {
        activity_id: this.getQueryString("mark_id")
      };
      $http
        .get(
          "plugin.business-activity.frontend.controllers.activity.getActivityById",
          json,
          "获取中"
        )
        .then(response => {
          if (response.result == 1) {
            let Activity = document.getElementById("Activity");
            this.Data = response.data.activity;
            if (this.Data.audio_link) {
              this.autoPlay();
            }

            this.link = this.Data.link1;
            this.button = response.data.activity.button;
            this.member_count = response.data.member_count;
            this.goods_id = response.data.goods_id;
            this.wheels = response.data.wheels;
            this.is_store_button = response.data.is_store_button;
            this.stores = response.data.stores.concat(response.data.hotels);
            this.commission_amount = response.data.commission_amount;
            this.start = this.Data.countdown_time[0];
            this.end = this.Data.countdown_time[1];
            this.timeShow = this.showTime() ? this.Data.countdown : 0;
            this.isSetShare = response.data.share_status;
            this.shareInfo = response.data.share_data;
            this.fun.setWXTitle(this.Data.name);
            this.showStore();
            this.StoreArr();
            this.countdown();
            if (this.Data.status == 0) {
              Toast("活动未启用");
              this.$router.push(this.fun.getUrl("home"));
              return;
            }
            if (this.Data.is_background == 1) {
              Activity.style.backgroundColor = this.Data.color;
            } else if (this.Data.is_background == 2) {
              Activity.style.backgroundImage =
                "url(" + this.Data.background_thumb + ")";
              Activity.style.backgroundSize = "100% 100%";
              Activity.style.backgroundAttachment = "fixed";
            }
          } else {
            Toast(response.msg);
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
        if (that.isSetShare == 1) {
          //开启自定义分享
          _title = that.fun.isTextEmpty(that.shareInfo.title)
            ? data.share.title
            : that.shareInfo.title;
          _imgUrl = that.fun.isTextEmpty(that.shareInfo.icon)
            ? data.share.icon
            : that.shareInfo.icon;
          _desc = that.fun.isTextEmpty(that.shareInfo.desc)
            ? data.share.desc
            : that.shareInfo.desc;
        } else {
          _title = data.share.title;
          _imgUrl = data.share.icon;
          _desc = data.share.desc;
        }

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
    showTime() {
      let nowTime = new Date().getTime() / 1000;
      let beginTime = this.start;
      if (nowTime >= beginTime) {
        return true;
      } else {
        return false;
      }
    },
    //活动倒计时
    countdown() {
      // 当前时间戳
      const now = Date.parse(new Date()) / 1000;
      if (this.end - now <= 0) {
        this.stop = true;
        return;
      }
      // 相差的秒数
      const msec = this.end - now;
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
      this.$router.push(
        this.fun.getUrl("goods", {
          id: this.goods_id
        })
      );
    },
    swipeToTop(index) {
      if (index === this.commission_amount.length - 2) {
        this.$refs.swipe.swipeTo(0);
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
    linkTo() {
      if (this.fun.isTextEmpty(this.link)) {
        this.$router.push(this.fun.getUrl("storeApply"));
      } else {
        window.location.href = this.link;
      }
    },
    //联盟商家跳转
    toPage(list) {
      if (!this.fun.isTextEmpty(list.store_name)) {
        this.$router.push(this.fun.getUrl("HomeSeller", { store_id: list.id, fromHome: 1 }));
      } else if (!this.fun.isTextEmpty(list.hotel_name)) {
        this.$router.push(
          this.fun.getUrl("HotelHome", { id: list.id, fromHome: 1 })
        );
      }
    }
  },
  components: {
    cTitle
  }
};
