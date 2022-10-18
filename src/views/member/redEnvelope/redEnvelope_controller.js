import Longtap from "./longTap";
import { Toast } from "vant";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
var self;
var longPressing;
var tag = true; //防止重复录音
var endtag = false; //防止倒计时组件回调重复请求
const start = function() {
  console.log("触发开始");
  if (tag && self.passWordTest) {
    console.log("开始录音...");
    self.warntexts = "开始录音，请长按说出口令...";
    self.recording = true;
    // Toast({
    //   duration: 1000,
    //   message: "开始录音",
    //   icon: "pause-circle-o"
    // });    //废弃，原因长按时会选中提示框的文字
    wx.startRecord({
      success: function() {
        tag = false;
      },
      fail: function(error) {
        self.warntexts = "录音失败";
        // this.$dialog.alert({ message: "微信录音失败"+ JSON.stringify(error)});
        Toast("微信录音start失败");
        // alert("微信录音失败" + JSON.stringify(error));
        tag = true;
      },
      cancel: function() {
        self.warntexts = "用户拒绝授权录音";
        Toast("用户拒绝授权录音");
        // alert("用户拒绝授权录音");
        tag = true;
      }
    });
  }
};
const stop = function() {
  if (!tag) {
    console.log("录音已停止...");
    self.recording = false;
    wx.stopRecord({
      success: function(res) {
        self.warntexts = "录音已停止";
        self.localId = res.localId;
        self.translateVoice(res.localId);
      },
      fail: function(error) {
        Toast("微信录音stop失败");
        // this.$dialog.alert({ message: "微信录音失败" + JSON.stringify(error)});
        // alert("微信录音失败" + JSON.stringify(error));
        self.warntexts = "";
        tag = true;
      }
    });
  }
};
export default {
  data() {
    return {
      btnStatus: false, //true:喊出口令，false：抽取口令
      showVerification: false, //验证码弹窗
      showCommand: false, //抽取口令弹窗
      showCountdown: false, //活动结束弹窗
      showredEnvelope: false, //红包弹窗
      showredEnvelopes: false, //红包弹窗内部，用于动画
      audio_link: "",
      Verified: false, //是否已经验证手机（当开启参与需要验证时）
      songStop: true, //判断停止还是播放
      localId: null,
      warntexts: "",
      passWordTest: null,
      getPassWord: [],
      showRecord: false, //喊出口令弹窗
      isType: 0, //
      translateResult: null,
      isSucceed: false, //挑战是否成功
      btn_shixiao: false,
      isFirstNewClass: true, //用于判断是否第一次new Longtap,避免重复new
      second: 60, //计时器
      activity_info: {},
      info: {},
      amount: null, //抽取到的奖励
      showCall: false,
      aid: null,
      parent_id: 0, //分享的用户mid
      activityList: [], //活动列表
      recording: false, //是否在录音中
      ranking: [],

      imgcode: "", //图形验证码
      cationCode: false,
      count: "",
      form: {
        mobile: "",
        //验证码
        code: "",
        captcha: ""
      },
      timer: null,
      shopname: "", //商城名称

      autoStop: false,
      integralInfo: {},
      showWechatshar: false,
      showRedeem: false,
      showBuyGoods: false,
      showBuyGoodslist: [],
      Redeemvalue: 1
    };
  },
  created() {
    // self = this;
    // this.aid = this.$route.params.aid;
    // if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
    //   self.parent_id = self.fun.getKeyByMid();
    // }
    // console.log("活动aid：：", this.aid);
    // this.getData(true);
  },
  mounted() {
    // this.autoPlayAudio2();
  },

  methods: {
    getData(_isupdata) {
      const that = this;
      $http.get("plugin.redpack.frontend.activity.getInfo", { aid: that.aid, parent_id: that.parent_id }, "").then(
        function(response) {
          if (response.result === 1) {
            self.info = response.data;
            if (_isupdata) {
              self.activity_info = response.data.activity_info;
              self.audio_link = response.data.activity_info.audio_link;
              self.ranking = response.data.ranking;

              if (response.data.activity_info.default_challenge_number == response.data.challenge_number_total) {
                // that.$nextTick(() => {
                //   that.clearAuthorization();
                // });
                self.initShare(true);
                // setTimeout(() => {
                //   that.clearAuthorization();
                // }, 1000);
              } else {
                self.initShare(false);
                that.autoStop = true;
              }
            }

            if (response.data.challenge_number_total == 0) {
              that.btn_shixiao = true;
            }

            // let saveWord = response.data.activity_info.word[0];
            // self.getNumRandom(saveWord);
          } else {
            Toast(response.msg);
            that.btn_shixiao = true;
            self.getActivityList();
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    clearAuthorization() {
      //开发时找不到判断客户是否授权录音，未授权的会弹出授权框，测试时发现离开长按按钮去点击授权后就开始录音了，不符合 项目要求长按的逻辑（仅仅出现授权时才会）
      //暂时的解决方案是第一次请求接口时判断是否有挑战过（即有挑战次数记录）,默认当有授权录音
      //如有其它解决方案，欢迎@肖
      let that = this;
      console.log("尝试是否录音授权，合并时删除这个提示");
      if (this.isFirstNewClass) {
        console.log("尝试是否录音授权");
        wx.startRecord({
          success: function() {
            tag = false;
            that.autoStop = false; //初始化
            console.log("初始化录音  -----开始成功");
            setTimeout(() => {
              console.log("倒计时结束录音  ===========");
              wx.stopRecord({
                success: function(res) {
                  console.log("初始化录音  -----结束成功");
                  tag = true;
                  that.autoStop = true; //初始化
                },
                fail: function(error) {
                  console.log("初始化录音  -----结束失败");
                  Toast("初始化录音失败。");
                  // alert(JSON.stringify(error));
                }
              });
            }, 2000);
          },
          fail: function(error) {
            console.log("初始化录音  -----开始失败");
            Toast("初始化录音失败!");
            // alert(JSON.stringify(error));
          },
          cancel: function() {
            this.$dialog.alert({ message: "用户拒绝授权录音" });

            // alert("用户拒绝授权录音");
          }
        });

      }
    },
    timeEnd() {
      console.log("活动已结束");
      if (!endtag) {
        self.getActivityList();
      }
    },
    addNumberM(data) {
      if (data.key == "credit") {
        this.integralInfo = data.data;
        this.showRedeem = true;
        return;
      }
      if (data.exchange_status == 0) {
        //未满足领取条件
        if (data.key == "invite") {
          this.showWechatshar = true;
        } else if (data.key == "consume") {
          this.$router.push(this.fun.getUrl("home", {}));
        } else if (data.key == "goods") {
          this.showBuyGoodslist = data.data.goods_list;
          this.showBuyGoods = true;
        } else if (data.key == "invite_people" && data.data.is_max != 1) {
          this.showWechatshar = true;
        }
      } else {
        //已满足
        this.exchangeNum(data.key);
      }
    },
    closedBuyGoodsPopup() {
      this.showBuyGoods = false;
    },
    gotoGoods(id) {
      this.showBuyGoods = false;
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    exchangeNum(_key, _num) {
      let that = this;
      let json = {
        activity_id: this.aid,
        exchange_key: _key
      };
      if (_num) {
        json.times = _num;
      }
      $http.get("plugin.redpack.frontend.activity.exchange", json, "").then(
        function(response) {
          if (response.result === 1) {
            Toast("兑换成功");
            that.showRedeem = false;
            that.getData(false);
          } else {
            Toast(response.data);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    getActivityList() {
      //当活动结束或者关闭时调用，获取活动列表
      let that = this;
      $http.get("plugin.redpack.frontend.activity.getActivityList", {}, "").then(
        function(response) {
          endtag = true;
          if (response.result === 1) {
            that.activityList = response.data.activitys.data;
            that.showCountdown = true;
            console.log(that.activityList);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    // getNumRandom(saveWord) {
    //   //不需要了
    //   let arr = saveWord.split(/[(\r\n)\r\n]+/);
    //   self.getPassWord = arr.sort(function() {
    //     return Math.random() > 0.5 ? -1 : 1;
    //   });
    //   console.log("乱序后的口令", self.getPassWord);
    // },
    setPassWord() {
      this.showCommand = false;
      this.btnStatus = true; //按钮更变为 “喊出口令”
    },
    closeRedPadck() {
      this.btnStatus = false;
      this.passWordTest = null;
      this.showredEnvelope = false;
      this.showredEnvelopes = false;
      this.getData(false); //更新部分数据
    },
    judgePassword(word) {
      // 判断处理识别结果getPassWord
      let that = this;
      $http
        .get(
          "plugin.redpack.frontend.activity.challenge",
          {
            aid: that.aid,
            parent_id: that.parent_id,
            discern_word: word,
            word: that.passWordTest
          },
          ""
        )
        .then(
          response => {
            if (response.result == 1) {
              that.isSucceed = true;
              that.isType = 1;
              that.showredEnvelope = true;
              that.amount = response.data.amount;
              that.showredEnvelopes = true;
            } else {
              Toast(response.msg);
              that.isSucceed = false;
              that.isType = 0;
              that.showredEnvelope = true;
              that.showredEnvelopes = true;
            }
            tag = true;
          },
          function(response) {
            tag = true;
          }
        );
    },
    smokePaddword() {
      if (this.activity_info.countdown_time && this.activity_info.countdown_time.length > 0) {
        if (this.activity_info.countdown_time[0] * 1000 - Date.parse(new Date()) > 0) {
          this.$dialog.alert({ message: "活动还没开始" });
          return;
        } else if (this.activity_info.countdown_time[1] * 1000 - Date.parse(new Date()) < 0) {
          this.$dialog.alert({ message: "活动已经结束" });
          return;
        }
      }
      //抽取口令
      let that = this;
      if (!this.autoStop) {
        return;
        // wx.stopRecord({
        //   success: function (res) {
        //     that.autoStop = true;//初始化
        //   },
        //   fail: function (error) {
        //     console.log("录音停止失败", error);
        //   }
        // });
      }
      if (this.activity_info.verify_mobile == 1 && !this.Verified) {
        self.gotoIncome();
        return;
      }
      console.log("剩余次数", self.info.challenge_number_total);
      if (self.info.challenge_number_total <= 0) {
        Toast("您的抽取次数已用完，赶紧分享邀请好友吧！");
        this.btn_shixiao = true;
        return;
      }
      if (this.isFirstNewClass) {
        setTimeout(() => {
          // 长按方法调用,使用settimeout 避免getElementById获取不到
          longPressing = new Longtap(document.getElementById("longpressBtn"), 800);
          longPressing.longTap(start, stop);
          that.isFirstNewClass = false;
        }, 100);
      } else {
        // longPressing.longTap();
      }
      $http.get("plugin.redpack.frontend.activity.extractWord", { aid: this.aid }, "").then(
        function(response) {
          if (response.result === 1) {
            self.passWordTest = response.data.word;
            self.showCommand = true;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    saidPassword() {
      //喊出口令
      let that = this;
      that.showRecord = true;
    },
    translateVoice(localId) {
      let that = this;
      this.warntexts = "";
      this.showRecord = false;
      wx.translateVoice({
        localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          // let bb = res.translateResult
          //   .replace(/\s/g, "")
          //   .replace(/[^a-zA-Z0-9]/g, "")
          //   .replace(/[^\u4e00-\u9fa5]/g, "");
          // that.translateResult = bb ? bb : "抱歉，识别结果为空";
          var reg = /。$/gi;
          that.translateResult = res.translateResult.replace(reg, "");
          that.judgePassword(that.translateResult);
          // alert(res.translateResult); // 语音识别的结果
        },
        fail: function(error) {
          Toast("翻译出错啦，检测不到您的声音或者录音时间太短了");
          // this.$dialog.alert({ message: "翻译出错啦，检测不到您的声音或者录音时间太短了"});

          // alert("翻译出错啦，检测不到您的声音或者录音时间太短了");
          tag = true;
          // setTimeout(() => {
          //   //防止误触
          //   tag = true;
          // }, 1000);
        }
      });
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
    gotoOther(_id) {
      this.$router.push(this.fun.getUrl("redEnvelope", { aid: _id }));
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    //验证手机身份
    gotoIncome() {
      let that = this;
      that.getimgdata();
      that.showVerification = true;
      // $http.get("member.member.withdrawByMobile", {}, "").then(
      //   function(response) {
      //     if (response.result == 1) {
      //       if (response.data.is_bind_mobile == 0) {
      //         console.log(response.data);
      //         self.Verified = true;
      //         self.smokePaddword();
      //         return;
      //       } else {
      //         self.getimgdata();
      //         self.showVerification = true;
      //         console.log(response.data);
      //       }
      //     } else {
      //       console.log(response.msg);
      //     }
      //   },
      //   function(response) {
      //     console.log(response.msg);
      //   }
      // );
    },
    getimgdata() {
      $http
        .get("home-page.getCaptcha")
        .then(res => {
          if (res.data.captcha.status && res.data.captcha.status == "0") {
            this.imgcode = null;
          }
          if (res.data.captcha.img) {
            this.imgcode = res.data.captcha.img;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 60秒倒计时
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.cationCode = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.cationCode = false;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    // 获取验证码
    VerificationCode() {
      let that = this;
      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast("请填图形验证码");
      }
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("请填写手机号");
      } else {
        Toast("发送中...");
        //发送获取验证码的请求//旧的请求：member.register.sendCodeV2
        $http
          .get("member.register.alySendCode", {
            mobile: this.form.mobile,
            captcha: this.form.captcha,
            code: this.form.code
          })
          .then(
            response => {
              console.log(response);
              if (response.result == 1) {
                that.cationCode = true;
                that.getCode();
                that.sendCodeAnimation();
              } else {
                this.cationCode = false;
                //刷新图形验证码
                Toast(response.msg);
                this.form.captcha = "";
                this.getimgdata();
              }
            },
            response => {
              console.log(response.msg + "nihao");
            }
          );
      }
    },
    //发送验证码 倒计时
    sendCodeAnimation() {
      setTimeout(() => {
        Toast("已发送");
      }, 1000);
    },
    //提交修改手机的请求
    alterAction() {
      var that = this;
      //发送获取验证码的请求
      if (that.fun.isTextEmpty(this.form.mobile)) {
        Toast("手机号码不能为空", "提示");
        return;
      }
      if (that.fun.isMoblie(this.form.mobile)) {
        Toast("请输入正确的手机号");
        return;
      }
      if (that.fun.isTextEmpty(this.form.code)) {
        Toast("请填写验证码", "提示");
        return;
      }
      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast("图形验证码不能为空");
          return;
        }
      }

      $http.post("plugin.redpack.frontend.activity.verifyMobile", this.form, "正在绑定手机..").then(
        response => {
          if (response.result == 1) {
            Toast("验证成功！");
            self.Verified = true;
            self.showVerification = false;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    //初始化分享设置
    initShare(isFirst) {
      // let that = this;
      // that.fun.wxShare(
      //   "",
      //   { mid: that.fun.getKeyByMid() },
      //   {
      //     title: this.fun.isTextEmpty(this.activity_info.share_title) ? "" : this.activity_info.share_title,
      //     imgUrl: this.fun.isTextEmpty(this.activity_info.share_thumb) ? "" : this.activity_info.share_thumb,
      //     description: this.fun.isTextEmpty(this.activity_info.share_content) ? "" : this.activity_info.share_content
      //   },
      //   data => {
      //     if (!this.fun.isTextEmpty(data.shop.shop)) {
      //       this.shopname = data.shop.shop.name; //客服重新赋值
      //     }
      //   }
      // );
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
              this.share(response.data,isFirst);
              this.shopname = response.data.shop.shop.name;
            }
          } else {
            console.error(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    //组装分享设置
    share(data,isFirst) {
      let that = this;
      wx.config(data.config);
      wx.ready(function() {
        that.$refs.audio.play();
        if(isFirst){
          that.clearAuthorization();
        }

        let _title = "";
        let _imgUrl = "";
        let _desc = "";

        _title = that.fun.isTextEmpty(that.activity_info.share_title) ? "" : that.activity_info.share_title;
        _imgUrl = that.fun.isTextEmpty(that.activity_info.share_thumb) ? "" : that.activity_info.share_thumb;
        _desc = that.fun.isTextEmpty(that.activity_info.share_content) ? "" : that.activity_info.share_content;

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
    }
  },
  filters: {
    hidePhone(phone) {
      if (!phone) {
        return "";
      }
      return phone.slice(0, 3) + "*******";
    }
  },
  // watch: {
  //   //监测路由变化
  //   $route(to, from) {
  //     if (from.name == "redEnvelopeRecord" || from.path === "/") {
  //       setTimeout(() => {
  //         self.initShare();
  //       }, 800);
  //     }
  //   }
  // },
  activated() {
    self = this;
    this.aid = this.$route.params.aid;
    if (!this.fun.isTextEmpty(this.fun.getKey("share_tag"))) {
      self.parent_id = self.fun.getKeyByMid();
    }
    console.log("活动aid：：", this.aid);
    this.getData(true);
  },
  deactivated() {},
  components: { yzWechatShareImg }
};
