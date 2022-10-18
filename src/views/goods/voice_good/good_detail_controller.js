import { Toast } from 'vant';
import { Swipe, SwipeItem } from "components/meswipe";
import cMyswipe from "components/myswipe";
import invitation from "components/goods/children/invitation";

var goods_id = "";
var share_tag = "-1";

// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second;

  if (secondType === "number" || secondType === "string") {
    second = parseInt(second);

    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;

    return (
      hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2)
    );
  } else {
    return "0:00:00";
  }
}

export default {
  // props: ["goods_id", "goods_type", "goods_info"],
  data() {
    return {
      integral: window.localStorage.integral,
      title: "商品详情",
      hoet: false,
      isCup: true,
      goodTop: false,
      popupSpecs: false,
      goodsInfo: {},
      isMiniApp: false,
      showGood: false,
      isPlay: true,
      readyState: 1,
      article_id: 0,
      sliderTime: 0,
      audio_link: [
        "http://mp3.9ku.com/m4a/637791.m4a",
        "https://yikeyide-h5.oss-cn-qingdao.aliyuncs.com/1057489943478468608.mp3"
      ],
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      },
      selectedNum: null,
      songStop: false,
      is_rule: true, //是否有权限播放
      ConnectionInfo: {}
    };
  },

  activated() {
    this.goodTop = false;
    if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
      share_tag = this.fun.getKey("share_tag");
    }

    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }

    goods_id = this.$route.params.id;

    //商品详情 初始化参数
    this.initData();

    this.getGoodsPage();
  },

  mounted() {
    this.goodTop = false;
    if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
      share_tag = this.fun.getKey("share_tag");
    }

    if (window.isMiniprogram) {
      this.isMiniApp = true;
    }

    goods_id = this.$route.params.id;

    this.initData();

    this.getGoodsPage();
  },

  deactivated() {
    window.document.removeEventListener("touchstart", this.move, false);
    window.document.removeEventListener("touchmove", this.move, false);
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    }
  },
  methods: {
    initData() {
      this.showGood = false;
      //初始化一下参数
      this.goodsInfo = {};
      this.isGoods = false;
      this.popupSpecs = false;
      this.selectedNum = null;
      this.songStop = false;
      this.is_rule = true; //是否有权限播放
      this.ConnectionInfo = {};
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
    getGoodsPage() {
      let that = this;
      $http
        .get(
          "plugin.voice-goods.api.voice-goods.getVoiceGoods",
          {
            goods_id: goods_id
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            that.showGood = true;
            that.goodsInfo = response.data;
            this.slider();
            this.is_rule = response.data.is_rule == 1 ? true : false;
            if (!this.is_rule) {
              this.getConnection();
            }
            // this.initShare();
            that.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid(),goods_id: goods_id },
              {
                title: that.goodsInfo.title,
                imgUrl: that.goodsInfo.thumb,
              },
              data => {
                if (!this.fun.isTextEmpty(data.shop && data.shop.shop)) {
                  this.initCservice(data.shop.shop.cservice); //客服重新赋值
                }
              }
            );
          } else {
            this.isGoods = false;
            this.showGood = true;
            this.$dialog.alert({message:response.msg}).then(()=>{
              this.$router.go(-1);
            });
          }
        })
        .catch(err => {
          this.showGood = true;
          console.log(err);
        });
    },
    getConnection() {
      let that = this;
      $http
        .get("plugin.voice-goods.api.voice-goods.getConnection", {}, "")
        .then(response => {
          if (response.result === 1) {
            this.ConnectionInfo = response.data;
            if (!that.fun.isTextEmpty(response.data.people_connect)) {
              that.initCservice(response.data.people_connect); //重新赋值
            }
          } else {
            that.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //初始化客服参数
    initCservice(newCservice) {
      if (!this.fun.isTextEmpty(newCservice)) {
        this.cservice = newCservice;
        return;
      }

      if (!this.fun.isTextEmpty(this.$store.state.temp.mailInfo) &&
        !this.fun.isTextEmpty(this.$store.state.temp.mailInfo.cservice)
      ) {
        this.cservice = this.$store.state.temp.mailInfo.cservice;
      }
    },

    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if (top < that.$refs.goodinfo.offsetTop) {
          that.goodTop = false;
        } else {
          that.goodTop = true;
        }

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

    move(event) {
      // 判断默认行为是否可以被禁用
      if (event.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!event.defaultPrevented) {
          event.preventDefault();
        }
      }
    },
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
        let _title = "";
        let _imgUrl = "";
        let _desc = "";
        //返回的goodsInfo.has_one_share数据中没有相应对象
        _title = that.goodsInfo.title;
        _imgUrl = that.goodsInfo.thumb;
        _desc = data.shop.shop.name;

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
    //分享
    shareWeixin() {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7) {
        this.appSharesinit();
        return;
      }
      this.$dialog.alert({message:"请点击右上角微信分享"});
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
    //跳转首页
    gotoCart() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //跳转个人中心
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    select(ind, src) {
      if (this.selectedNum == ind) {
        if (this.songStop) {
          this.$refs.audio.play(); //继续播放
          this.songStop = false;
        } else {
          this.$refs.audio.pause();
          this.songStop = true;
        }
      } else {
        this.selectedNum = ind;
        this.$refs.audio.src = src; //选择其他音频
        if (this.$refs.audio.paused) {
          this.$refs.audio.play();
        }
      }
    },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      this.readyState = this.$refs.audio.readyState;
      this.audio.playing ? (this.isPlay = true) : (this.isPlay = false);
      return this.audio.playing ? this.pause() : this.play();
    },
    // 播放音频
    play() {
      this.$refs.audio.play();
      this.songStop = false;
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause();
      this.songStop = true;
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true;
    },
    ended() {
      this.selectedNum = Number(this.selectedNum) + 1;

      if (this.selectedNum > Object.keys(this.goodsInfo.curriculum).length) {
        return;
      }
      this.$refs.audio.src = this.goodsInfo.curriculum[
        `${this.selectedNum}`
      ].url;
      this.play();
      console.log(this.$refs.audio.src, "ended");
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
    },
    handleFocus() {
      console.log("focues");
    },
    error(e) {
      this.$dialog.alert({message:"音频出错了"});
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.readyState = this.$refs.audio.readyState;
      this.audio.maxTime = parseInt(res.target.duration);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime;
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      );
    },

    // 进度条格式化toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt((this.audio.maxTime / 100) * index);
      return "进度条: " + realFormatSecond(index);
    },
    handleTouchStart(e) {
      this.setValue(e.touches[0]);

      document.addEventListener("touchmove", this.handleTouchMove);
      document.addEventListener("touchup", this.handleTouchEnd);
      document.addEventListener("touchend", this.handleTouchEnd);
      document.addEventListener("touchcancel", this.handleTouchEnd);
      // e.preventDefault();
      // this.onDragStart(e);
    },
    handleTouchMove(e) {
      this.setValue(e.changedTouches[0]);
    },
    handleTouchEnd(e) {
      this.setValue(e.changedTouches[0]);
      document.removeEventListener("touchmove", this.handleTouchMove);
      document.removeEventListener("touchup", this.handleTouchEnd);
      document.removeEventListener("touchend", this.handleTouchEnd);
      document.removeEventListener("touchcancel", this.handleTouchEnd);
      // this.onDragStop(e);
    },
    // 从点击位置更新 value
    setValue(e) {
      // let that = this;
      const { maxTime, minTime, step } = this.audio;
      let value =
        ((e.clientX - this.$refs.slider[0].offsetLeft) /
          this.$refs.slider[0].offsetWidth) *
        (maxTime - minTime);
      value = Math.round(value / step) * step + minTime;
      value = parseFloat(value.toFixed(5));

      if (value > maxTime) {
        value = maxTime;
      } else if (value < minTime) {
        value = minTime;
      }
      this.$refs.audio.currentTime = value;
    },
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime(index) {
      console.log("拖动进度条");
      this.$refs.audio.currentTime = parseInt(
        (index / 100) * this.audio.maxTime
      );
    },
    gotoGoods(_id) {
      this.$router.push(this.fun.getUrl("goods", { id: _id }));
    }
  },
  components: { Swipe, SwipeItem, cMyswipe,invitation },
};
