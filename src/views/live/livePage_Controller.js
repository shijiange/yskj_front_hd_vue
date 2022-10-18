// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second;

  if (secondType === "number" || secondType === "string") {
    second = parseInt(second);

    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;

    return hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2);
  } else {
    return "0:00:00";
  }
}

// var ctx = null;
var timer_1,
  timer_2,
  timer_hb,
  powerToast = null; // 循环定时器
var bg, gitCanvas, gitClickLove;
var rewardTag = true;

var onMessageReceived = null;
let videoFirst = 0; //第一次初始化
let firstInitPlay = true;

import CanvasBarrage from "./liveBarrage";
import ClickLove from "./clickLove";
import { Toast } from "vant";
import html2canvas from "html2canvas";
import mReportPage from "./reportPage";

// IM Web SDK
import TIM from "tim-js-sdk";
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let options = null;
let tim = null; // SDK 实例通常用 tim 表示

var self = null;
var player;
var playerPK = null;

var _h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
export default {
  data() {
    let that = this;
    return {
      isShowADLook: true, //广告列表按钮
      isShowADPut: true, //广告投放按钮
      close_reward: 0, //是否关闭打赏，1是，0否
      close_chat: 0, //是否关闭评论，1是，0否
      giftEffectsTime: null, //打赏特效定时器
      specialList: [], //打赏特效
      rewardType: {}, //开启的打赏方式
      activeLiveSetInfo: {}, //当前直播间禁言、禁入、当前讲解的商品
      previewImageUrl: null,
      showMorePopup: false,
      wxPay_money: null,
      checked_wxPay: false,
      showWxpay: false,
      stopLive: false,
      isAddLove: false,
      showReportPopup: false,
      activatPlayType: "livePlay",
      songStop: true,
      showPassword: false,
      showPosterWord: false,
      diyPosterWord: "",
      room_passWord: null,
      sliderTime: 0,
      targetVideo: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      },
      luck_number: 0,
      loadedVideoDataOk: false,
      clientWidths: document.body.clientWidth,
      stopLiveTest: "直播已结束",
      swiperResize: false,
      isOpenIM: false,
      isSuccessIM: false,
      RoomId: null,
      backPlayID: null,
      showUser: false,
      showPoster: false,
      showGoodLift: false,
      showGift: false,
      showactivity: false,
      showavticeFail: false,
      mainCommentShow: false,
      maincomment: "",
      activeGift: 0,
      MemberInfo: {},
      memberId: null,
      giftList: {
        member: {}
      },
      radio: "1",
      dataInfo: {},
      tipsopacity: 0,
      tipsContent: [],
      tipsContentMsssage: {},
      tipsopacityBol: false,
      view_num: 1,
      lasttime: null,
      messageList: [],
      commentMessage: "和主播说点什么...",
      isGiftId: null, //礼物选择id
      selectGiftLN: 0, //选择的礼物爱心值
      selectGiftCN: 0, //选择的礼物积分
      selectGiftYN: 0, //选择的礼物余额
      PosterDatas: {}, //海报数据
      posterImg: [],
      base64Datas: [],

      loadingImg: true,
      failUpload: false,
      dataURL: "",
      activeSwiperIndex: 0,
      liveList: [], //直播列表
      livePoster: null, //视频封面
      liveSrc: "",
      LiveFlvSrc: "",
      liveHeight: _h,
      isPlaying: false,
      activityTimeArray: [],
      activityDataArray: [],
      roomMemberContent: [],
      roomMemberContentArray: [],
      roomMemberTimeArray: [],
      IMmessage: {},
      activityDataBtnBol: false,
      roomMemberBtnBol: false,
      isFirstPlay: false,
      questGiftOk: false, //是否已加载过礼物
      diy_menu: [], //悬浮菜单
      diy_option: [], //更多选项
      diy_set: [], //功能开关，为空时就是全都开启
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      show: false,
      isLivePK: false, //是否正在pk
      openRTC: false, //是否开启rtc协议
      liveRTCSrc: "",
      livePKRTCSrc: "",
      livePKSrc: "", //pk链接 m3u8协议
      livePKData: {},
      startPKTime: null,
      pkTimer: null,
      PKTimed: "00:00:00", //连麦已进行的时长
      mode_button: 0, //0为竖屏，1为横屏
      swiperOption: {
        direction: "vertical",
        observer: true,
        observerParents: true,
        updateOnWindowResize: true,
        initialSlide: 0, //设定初始化时slide的索引。
        width: that.fun.getPhoneEnv() != 3 ? document.documentElement.clientWidth : "375",
        height: that.fun.getPhoneEnv() == 2 ? window.screen.availHeight : window.innerHeight,
        // height:window.innerHeight,
        watchOverflow: true,
        autoHeight: true,
        autoplay: false,
        pagination: false,
        on: {
          reachEnd() {
            //回调函数，当Swiper切换到最后一个Slide时执行。
            if (videoFirst === 1) {
              that.getMoreData();
            }
          },
          slideChangeTransitionEnd() {
            //回调函数，swiper从一个slide过渡到另一个slide结束时执行。
            console.log("回调函数，swiper从一个slide过渡到另一个slide结束时执行。", this.realIndex);
            // that.onPlayerPause();
            that.isLivePK = false;
            if (that.isOpenIM && that.isSuccessIM) {
              that.quitGroup();
              setTimeout(() => {
                that.logout(); //退出聊天室
              }, 1000);
            }
            that.quitRoom(); //退出直播间
            tim.off(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
            that.initData();
            that.activeSwiperIndex = this.realIndex;

            if (this.realIndex === 0) {
              that.liveList[this.realIndex].show = false;
              that.liveList[this.realIndex + 1].show = false;
            } else {
              that.liveList[this.realIndex - 1].show = false;
              that.liveList[this.realIndex].show = false;
              if (that.liveList[this.realIndex + 1]) {
                that.liveList[this.realIndex + 1].show = false;
              }
            }
            if (that.activatPlayType == "livePlay") {
              that.RoomId = that.liveList[this.realIndex].id;
              that.getLiveRoom(this.realIndex);
            } else if (that.activatPlayType == "playBack" || that.activatPlayType == "memberPlayBack") {
              that.RoomId = that.liveList[this.realIndex].room_id;
              that.backPlayID = that.liveList[this.realIndex].id;
              that.getBackRoom(this.realIndex);
            }
            let _liveData = {
              _rid: that.RoomId,
              _bid: that.backPlayID,
              _mid: that.memberId,
              tpye: that.activatPlayType
            };
            window.localStorage.setItem("setLiveInfo", JSON.stringify(_liveData));
            //切换结束时
          },
          resize() {
            //窗口变化了
            that.setSwiperH();
          }
        }
      }
    };
  },
  mounted() {
    firstInitPlay = true;
    player = null;
    this.setOption();
    if (this.fun.isIosOrAndroid() == "ios" && window.sessionStorage.getItem("videoReload") === null) {
      window.sessionStorage.setItem("videoReload", true);
      location.reload();
    }
  },

  activated() {
    self = this;
    player = null;
    this.$store.commit("setReturnLiveBtn", false);
    if (!document.getElementById("TcPlayerJs")) {
      //避免多次引入
      const script = document.createElement("script");
      script.type = "text/javascript";
      if (window.location.host.indexOf("localhost") > -1) {
        script.src = this.fun.getSiteRoot() + "/static/app/TcPlayer-2.4.1.js";
      } else {
        script.src = this.fun.getSiteRoot() + "/addons/yun_shop/static/app/TcPlayer-2.4.1.js";
      }
      script.id = "TcPlayerJs";
      document.body.appendChild(script);
      script.onload = script.onreadystatechange = function() {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
          console.log("js onload");
          self.getIMSDKAppID();
        }
        script.onload = script.onreadystatechange = null; //删除事件处理函数。
      };
    } else {
      self.getIMSDKAppID();
    }

    firstInitPlay = true;
    this.activeSwiperIndex = 0;
    this.initData();

    this.$nextTick(() => {
      this.startMove();
    });
    window.onresize = function() {
      if (!self.mainCommentShow && !self.showGoodLift && !self.showGift) {
        _h = window.screen.availHeight + "px";
        document.querySelector("video").style.height = _h;
        document.getElementsByClassName("vcp-player")[0].style.height = _h;
        return;
      }
    };
  },
  deactivated() {
    // Toast("销毁播放器实例");
    if (player) {
      player.destroy(); //销毁播放器实例
      player = null;
    }
    if (playerPK) {
      playerPK.destroy();
      playerPK = null;
    }
    if (this.pkTimer) {
      clearInterval(this.pkTimer);
      this.pkTimer = null;
    }

    tim.off(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
    if (this.isOpenIM && this.isSuccessIM) {
      this.quitGroup();
    }
    this.quitRoom();
    setTimeout(() => {
      this.logout();
      tim = null;
    }, 80);

    clearInterval(timer_1);
    clearTimeout(timer_hb);
    if (powerToast) {
      //取消海报生成提示，防止退出直播间后还在提示
      powerToast.clear();
    }
    window.onresize = function() {};
  },
  methods: {
    gotoFanList() {
      if (this.MemberInfo.fan_count <= 0) return;
      this.$router.push(this.fun.getUrl("liveFanList", {}, { memberId: this.MemberInfo.member_id }));
    },
    getIMSDKAppID() {
      let that = this;
      $http.get("plugin.room.frontend.im.get-im-sdk", {}, "加载中").then(
        function(response) {
          if (response.result === 1) {
            if (!that.fun.isTextEmpty(response.data.sdkappid)) {
              options = null;
              options = {
                SDKAppID: response.data.sdkappid // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
              };

              // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
              tim = TIM.create(options); // SDK 实例通常用 tim 表示
              // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
              // tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
              tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
            }
            that.questApiMethob();
          } else {
            console.log("error:::SDKAppID");
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    setOption() {
      if (this.fun.getKey("shareType") || this.$route.params.type) {
        this.activatPlayType = this.fun.getKey("shareType") ? this.fun.getKey("shareType") : this.$route.params.type;
        this.RoomId = this.fun.getKey("room_id") ? this.fun.getKey("room_id") : this.$route.params.id;
        if (this.activatPlayType == "playBack") {
          this.backPlayID = this.fun.getKey("backid") ? this.fun.getKey("backid") : this.$route.params.backid;
        } else if (this.activatPlayType == "memberPlayBack") {
          this.backPlayID = this.fun.getKey("backid") ? this.fun.getKey("backid") : this.$route.params.backid;
          this.memberId = this.fun.getKey("memberid") ? this.fun.getKey("memberid") : this.$route.params.memberid;
        }
        let _liveData = {
          _rid: this.RoomId,
          _bid: this.backPlayID,
          _mid: this.memberId,
          tpye: this.activatPlayType
        };
        window.localStorage.setItem("setLiveInfo", JSON.stringify(_liveData));
        this.newMediaLive(3);
        this.newMediaLive(4);
      }
    },
    questApiMethob() {
      if (this.fun.getKey("shareType") || this.$route.params.type) {
        this.activatPlayType = this.fun.getKey("shareType") ? this.fun.getKey("shareType") : this.$route.params.type;
        this.RoomId = this.fun.getKey("room_id") ? this.fun.getKey("room_id") : this.$route.params.id;
        if (this.activatPlayType == "livePlay") {
          this.getLiveList(this.RoomId);
        } else if (this.activatPlayType == "playBack") {
          this.backPlayID = this.fun.getKey("backid") ? this.fun.getKey("backid") : this.$route.params.backid;
          this.getplayBack(this.RoomId, this.backPlayID);
        } else if (this.activatPlayType == "memberPlayBack") {
          this.backPlayID = this.fun.getKey("backid") ? this.fun.getKey("backid") : this.$route.params.backid;
          this.memberId = this.fun.getKey("memberid") ? this.fun.getKey("memberid") : this.$route.params.memberid;
          this.getplayBack(this.RoomId, this.backPlayID);
        }
        console.log("请求主播接口this.RoomId,this.backPlayID,memberid:", this.activatPlayType, this.RoomId, this.backPlayID, this.memberId);
        let _liveData = {
          _rid: this.RoomId,
          _bid: this.backPlayID,
          _mid: this.memberId,
          tpye: this.activatPlayType
        };
        window.localStorage.setItem("setLiveInfo", JSON.stringify(_liveData));
        this.newMediaLive(3);
        this.newMediaLive(4);
      } else if (!this.fun.isTextEmpty(JSON.parse(window.localStorage.getItem("setLiveInfo")).tpye)) {
        let _getLiveData = JSON.parse(window.localStorage.getItem("setLiveInfo"));
        console.log("获取不到router信息,取localStorage", _getLiveData);
        this.RoomId = _getLiveData._rid;
        this.backPlayID = _getLiveData._bid;
        this.memberId = _getLiveData._mid;
        this.activatPlayType = _getLiveData.tpye;
        if (this.activatPlayType == "livePlay") {
          this.getLiveList(this.RoomId);
        } else if (this.activatPlayType == "playBack") {
          this.getplayBack(this.RoomId, this.backPlayID);
        } else if (this.activatPlayType == "memberPlayBack") {
          this.getplayBack(this.RoomId, this.backPlayID);
        }
        console.log("请求主播接口this.RoomId,this.backPlayID,memberid:", this.RoomId, this.backPlayID, this.memberId);
        this.newMediaLive(3);
        this.newMediaLive(4);
      } else {
        this.$router.push(this.fun.getUrl("liveList"));
      }
    },
    resizeH() {
      if (this.fun.getPhoneEnv() == 2) {
        let hh = window.screen.availHeight + "px";
        document.querySelector("video").style.height = hh;
        document.getElementsByClassName("vcp-player")[0].style.height = hh;
      }
    },
    addClickLove() {
      if (!this.isAddLove) {
        this.isAddLove = true;
        $http
          .get("plugin.room.frontend.live.likes", { room_id: this.RoomId }, "")
          .then(response => {
            if (response.result == 1) {
              let newNum = Number(this.dataInfo.like_num) + 1;
              this.$set(this.dataInfo, "like_num", newNum);
              this.newMediaLive(1);
            } else {
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      gitClickLove.likeClick();
    },
    previewImage() {
      if (this.fun.getPhoneEnv() == 1) {
        return;
      }
      let that = this;
      wx.previewImage({
        current: that.previewImageUrl,
        urls: [that.previewImageUrl]
      });
    },
    setTcPlayer() {
      let that = this;
      player = new TcPlayer("videoPlayer", {
        live: this.activatPlayType == "livePlay" ? true : false,
        x5_type: "h5",
        x5_fullscreen: true,
        systemFullscreen: true,
        x5_orientation: 1,
        x5_player: true,
        flash: false,
        webrtc: this.liveRTCSrc,
        m3u8: this.liveSrc, //请替换成实际可用的播放地址
        autoplay: false, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        width: that.fun.getPhoneEnv() != 3 ? window.innerWidth : "375", //视频的显示宽度，请尽量使用视频分辨率宽度
        height: this.liveHeight, //视频的显示高度，请尽量使用视频分辨率高度
        wording: {
          2032: "请求视频失败，请检查网络",
          2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
        },
        controls: "none",
        Flash: false,
        listener: function(msg) {
          // console.log(msg.type);
          if (msg.type == "loadeddata") {
            console.log("loadeddata===============");
            that.resizeH();
            // that.onPlayerPlay();
          }
          if (msg.type == "loadedmetadata") {
            // console.log("loadedmetadata==》》》》》",parseInt(player.video.el.duration));
            // that.targetVideo.maxTime = parseInt(player.video.el.duration);
          }
          if (msg.type == "load") {
            timer_2 = setTimeout(() => {
              that.loadedVideoDataOk = true;
            }, 800);
          }
          if (msg.type == "error") {
            console.log("error::视频播放不了.....");
            Toast("该视频出现问题了！");
            that.show = true;
            that.loadedVideoDataOk = true;
            that.$set(that.liveList[that.activeSwiperIndex], "show", true);
          }
          if (msg.type == "play") {
            that.videoPlaying();
            clearInterval(timer_2);
          }
          if (msg.type == "playing") {
            that.songStop = false;
            that.isFirstPlay = true;
            // that.videoPlaying();
          }
          if (msg.type == "pause") {
            that.songStop = true;
          }
          if (msg.type == "timeupdate") {
            that.targetVideo.currentTime = player.video.el.currentTime;
            that.sliderTime = parseInt((that.targetVideo.currentTime / that.targetVideo.maxTime) * 100);
          }
        }
      });
    },
    setPKPlayer() {
      playerPK = new TcPlayer("videoPlayerPK", {
        live: true,
        x5_type: "h5",
        x5_fullscreen: true,
        systemFullscreen: true,
        x5_orientation: 1,
        x5_player: true,
        flash: false,
        webrtc: this.livePKRTCSrc, //this.liveRTCSrc
        m3u8: this.livePKSrc, //请替换成实际可用的播放地址
        autoplay: true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        // width: that.fun.getPhoneEnv() != 3 ? window.innerWidth : "375", //视频的显示宽度，请尽量使用视频分辨率宽度
        // height: this.liveHeight, //视频的显示高度，请尽量使用视频分辨率高度
        height: "40vh",
        wording: {
          2032: "请求视频失败，请检查网络",
          2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
        },
        controls: "none",
        Flash: false
      });
      playerPK.play();
    },
    playerReadied(player) {
      // var hls = player.tech({ IWillNotUseThisInPlugins: true }).hls;
      player.tech_.hls.xhr.beforeRequest = function(options) {
        // console.log(options)
        return options;
      };
    },
    noAutoPlaying() {
      console.log("触发noAutoPlaying播放方法");
      player.play();
      playerPK.play();
      if (!this.isLivePK) {
        //进入时已在pk的，无需暂停
        setTimeout(() => {
          playerPK.pause();
        }, 50);
      }
    },
    videoPlaying() {
      // if(player.playing()){
      console.log("videoPlaying方法.......");
      let that = this;
      this.show = true;
      this.$set(this.liveList[this.activeSwiperIndex], "show", true);
      this.isPlaying = this.fun.getPhoneEnv() == 2 ? true : false;
      this.$nextTick(() => {
        setTimeout(() => {
          that.CanvasInit(); //防止取不到dom
        }, 500);
      });
      if (player.playing()) {
        console.log("正在播放视频.......");
      }
      // }
    },
    setSwiperH() {
      this.swiperResize = true;
      let that = this;
      setTimeout(() => {
        console.log("setSwiperH方法，SwiperH高度发送变化", window.innerHeight);
        that.swiperOption.height = window.innerHeight;
        that.swiperOption.initialSlide = that.activeSwiperIndex;
        that.swiperResize = false;
      }, 80);
      setTimeout(() => {
        that.CanvasInit(); //防止取不到dom
      }, 500);
    },
    onPlayerPause() {
      // const myPlayer = this.$refs.videoPlayer.player;
      // myPlayer.pause();
      player.pause();
    },
    CanvasInit() {
      //弹幕初始化
      let barrageCanvas = document.getElementById("Barragecanvas");
      // console.log("礼物弹幕初始化",barrageCanvas);
      gitCanvas = new CanvasBarrage(barrageCanvas, {});

      let likeid = document.getElementById("likeid");
      bg = document.getElementById("canvasImg");
      // console.log("点赞初始化",likeid);
      gitClickLove = new ClickLove(likeid, bg);
    },
    initData() {
      // player = null;
      powerToast = null;
      clearTimeout(timer_hb);
      this.previewImageUrl = null;
      this.showMorePopup = false;
      this.stopLive = false;
      this.isAddLove = false;
      this.showReportPopup = false;
      this.loadedVideoDataOk = false;
      this.isOpenIM = false;
      this.isSuccessIM = false;
      this.show = false;
      this.showUser = false;
      this.showPoster = false;
      this.showGoodLift = false;
      this.showGift = false;
      this.showactivity = false;
      this.showavticeFail = false;
      this.mainCommentShow = false;
      this.maincomment = "";
      this.activeGift = 0;
      this.MemberInfo = {};
      this.radio = "1";
      this.dataInfo = {};
      this.tipsopacity = 0;
      this.tipsContent = [];
      this.tipsContentMsssage = {};
      this.tipsopacityBol = false;
      this.view_num = 1;
      this.lasttime = null;
      this.messageList = [];
      this.commentMessage = "和主播说点什么...";
      this.isGiftId = null;
      this.selectGiftLN = 0;
      this.selectGiftCN = 0;
      this.selectGiftYN = 0;
      this.PosterDatas = {};
      this.posterImg = [];
      this.base64Datas = [];
      this.loadingImg = true;
      this.failUpload = false;
      this.dataURL = "";
      this.liveRTCSrc = "";
      this.liveSrc = "";
      this.LiveFlvSrc = "";
      this.questGiftOk = false;
      this.showPassword = false;
      this.room_passWord = null;
      this.roomMemberBtnBol = false;
      this.activityDataBtnBol = false;
      this.songStop = true;
      this.sliderTime = 0;
      this.diy_menu = []; //悬浮菜单
      this.diy_option = []; //更多选项
      this.diy_set = []; //功能开关，为空时就是全都开启
      this.targetVideo = {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      };
      this.activeLiveSetInfo = {};
      this.isShowADLook = true;
      this.isShowADPut = true;
      this.isLivePK = false;
      this.livePKData = {};
      this.startPKTime = null;
      if (this.pkTimer) {
        clearInterval(this.pkTimer);
        this.pkTimer = null;
      }
    },
    logout() {
      let promise = tim.logout();
      promise
        .then(function(imResponse) {})
        .catch(function(imError) {
          console.warn("logout error:", imError);
        });
    },
    //聊天登录
    chatLogin() {
      let that = this;
      let promise = tim.login({
        userID: that.dataInfo.userID.toString(),
        userSig: that.dataInfo.userSig
      });
      promise
        .then(function(imResponse) {
          that.chatJoinGroup();
        })
        .catch(function(imError) {
          console.warn("login error:", imError); // 登录失败的相关信息
        });
    },
    chatEventList() {
      let that = this;
      onMessageReceived = function(event) {
        // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
        // event.name - TIM.EVENT.MESSAGE_RECEIVED
        // event.data - 存储 Message 对象的数组 - [Message]
        //防止重新接受两条信息
        if (event.data[0].type == "TIMCustomElem" && event.data[0].payload && event.data[0].payload.extension == "customText") {
          if (that.lasttime == event.data[0].time) {
            return;
          } else {
            that.lasttime = event.data[0].time;
          }
        }

        let message = event.data;
        message.forEach(function(val, index) {
          let conversationType = val.conversationType;
          //判断消息来源群或者个人
          console.log("有信息===================", val);
          if (conversationType == TIM.TYPES.CONV_GROUP) {
            let data = val;
            //后台发送过来的消息处理
            if (data.from == "administrator") {
              //打赏
              if (data.payload.extension == "reward") {
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  if (json.show_effect == 1) {
                    //开启特效
                    that.specialList.push({
                      nickname: json.nickname,
                      reward_name: "送主播" + json.reward_name,
                      img: json.avatar,
                      effect_time: json.effect_time,
                      effect_type: json.effect_type,
                      effect_gif: `${json.effect_gif}?v=${Date.now()}` //防止gif第二次取缓存不播放
                    });
                    if (that.specialList.length <= 1) that.giftEffectsTimer();
                  } else {
                    gitCanvas.add([
                      {
                        nickname: json.nickname,
                        reward_name: "送主播" + json.reward_name,
                        img: json.avatar
                      }
                    ]);
                  }
                }
              } else if (data.payload.extension == "virtual_view_num") {
                //观看人数
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  that.view_num = json.view_num;
                }
              } else if (data.payload.extension == "concern") {
                //关注
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  that.tipsContent.push({
                    type: "concern",
                    nickname: json.nickname
                  });
                }
              } else if (data.payload.extension == "buy") {
                //正在买
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  that.tipsContent.push({
                    type: "buy",
                    nickname: json.nickname,
                    count: json.count
                  });
                }
              } else if (data.payload.extension == "come") {
                //进入直播间
                // if (data.payload.description) {
                //   let json = JSON.parse(data.payload.description);
                //   that.tipsContent.push({
                //     type: "come",
                //     nickname: json.nickname
                //   });
                // }
              } else if (data.payload.extension == "room_member") {
                //进入活动
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  that.roomMemberContent.push(json);
                  // that.roomMemberContent = roomMemberContent;
                }
                that.getroomMember(that.roomMemberContent.length - 1);
              } else if (data.payload.extension == "end") {
                //直播已结束
                that.stopLive = true;
                that.stopLiveTest = "直播已结束";
              } else if (data.payload.extension == "ban") {
                //直播间被禁
                that.stopLive = true;
                that.stopLiveTest = "直播间被禁";
              } else if (data.payload.extension == "leave") {
                //主播暂时离开
                that.stopLive = true;
                that.stopLiveTest = "主播暂时离开";
              } else if (data.payload.extension == "online") {
                //主播重新连接
                that.stopLiveTest = "主播重新连接中...";
                player.load(this.openRTC ? that.liveRTCSrc : that.liveSrc);
                setTimeout(() => {
                  that.stopLive = false;
                }, 1000);
              } else if (data.payload.extension == "explain_goods") {
                //当前讲解商品x
                let json = JSON.parse(data.payload.description);
                that.activeLiveSetInfo.now_goods = null;
                that.activeLiveSetInfo.now_goods = json;
              } else if (data.payload.extension == "cancel_explain") {
                //取消当前讲解
                that.activeLiveSetInfo.now_goods = null;
              } else if (data.payload.extension == "chat_reply") {
                //取消禁言
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  let member_id = json.member_id;
                  if (that.dataInfo.userID == member_id) {
                    that.activeLiveSetInfo.chat_ban = 0;
                    Toast("您已经解除禁言");
                  }
                }
              } else if (data.payload.extension == "chat_ban") {
                //禁言
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  let member_id = json.member_id;
                  if (that.dataInfo.userID == member_id) {
                    Toast("您已经被禁言");
                    that.activeLiveSetInfo.chat_ban = 1;
                  }
                }
              } else if (data.payload.extension == "room_ban") {
                //踢出直播间
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  let member_id = json.member_id;
                  if (that.dataInfo.userID == member_id) {
                    that.onPlayerPause();
                    that.stopLive = true;
                    that.stopLiveTest = "您已被禁入该直播间！";
                  }
                }
              } else if (data.payload.extension == "welcome") {
                //进入直播间自动回复
                // let json = JSON.parse(data.payload.description);
                // console.log("进入直播间自动回复", json)
                // that.messageList.push(json)
                // that.$nextTick(() => {
                //   that.chatMessagesBottom();
                // })
              } else if (data.type == "TIMCustomElem") {
                if (data.payload.extension == "open_chat") {
                  //开启评论
                  that.close_chat = 0;
                } else if (data.payload.extension == "close_chat") {
                  //开启评论
                  that.close_chat = 1;
                } else if (data.payload.extension == "open_reward") {
                  //开启评论
                  that.close_reward = 0;
                } else if (data.payload.extension == "close_reward") {
                  //开启评论
                  that.close_reward = 1;
                }
              }
            } else if (data.type == "TIMTextElem") {
              // that.messageList.push({
              //   nick: data.nick,
              //   id: data.from,
              //   text: data.payload.text
              // });
              // that.$nextTick(()=>{
              //   that.chatMessagesBottom();
              // })
            } else if (data.type == "TIMCustomElem") {
              //自定义类型解析
              if (data.payload.extension == "customPkGroup") {
                console.log("连麦-----------------");
                that.startPKTime = Date.parse(new Date()) / 1000;
                that.pkTimer = setInterval(function() {
                  that.GetRTime();
                }, 1000);
                that.livePKData = JSON.parse(data.payload.description);
                playerPK.load(that.livePKData.playUrl);
                that.isLivePK = true;
              } else if (data.payload.extension == "customQuitPkGroup") {
                // 结束连麦
                playerPK.pause();
                that.isLivePK = false;
                that.livePKData = {};
                that.PKTimed = "00:00:00";
                clearInterval(that.pkTimer);
              } else if (data.payload.extension == "customText") {
                let messageListData = JSON.parse(data.payload.description);
                console.log("有聊天信息", messageListData);
                that.messageList.push(messageListData);
                that.$nextTick(() => {
                  that.chatMessagesBottom();
                });
              } else if (data.payload.extension == "come") {
                //进入直播间
                if (data.payload.description) {
                  let json = JSON.parse(data.payload.description);
                  that.tipsContent.push({
                    type: "come",
                    nickname: json.nickname
                  });
                }
              } else if (data.payload.extension == "welcome") {
                //进入直播间自动回复
                let json = JSON.parse(data.payload.description);
                console.log("进入直播间自动回复", json);
                that.messageList.push(json);
                that.$nextTick(() => {
                  that.chatMessagesBottom();
                });
              }
            }
          } else if (conversationType == TIM.TYPES.CONV_C2C) {
            console.log("进入直播间自动");
          }
        });
      };
      // 监听事件，例如：
      tim.on(TIM.EVENT.SDK_READY, function(event) {
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        // console.log("收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口")
        that.chatMyProfile();
        // event.name - TIM.EVENT.SDK_READY
      });
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
      tim.on(TIM.EVENT.KICKED_OUT, function(event) {
        // 收到被踢下线通知
        // event.name - TIM.EVENT.KICKED_OUT
        // event.data.type - 被踢下线的原因，例如:
        //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
        //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
        //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
        Toast("下线通知：您的IM在其他设备登录！");
      });
    },
    chatMyProfile() {
      let that = this;
      let promise = tim.getMyProfile();
      promise
        .then(function(imResponse) {
          // console.log("个人资料 - Profile 实例",imResponse.data); // 个人资料 - Profile 实例
          let myData = imResponse.data;
          if (!myData.nick) {
            that.changeMyProfile();
          }
        })
        .catch(function(imError) {
          console.warn("getMyProfile error:", imError); // 获取个人资料失败的相关信息
        });
    },
    //修改我的个人信息
    changeMyProfile() {
      let that = this;
      let promise = tim.updateMyProfile({
        nick: that.dataInfo.userNickname,
        avatar: that.dataInfo.userAvatar
      });
      promise
        .then(function(imResponse) {
          // console.log(imResponse.data); // 更新资料成功
        })
        .catch(function(imError) {
          console.warn("updateMyProfile error:", imError); // 更新资料失败的相关信息
        });
    },
    //获取群详细资料
    chatJoinGroup() {
      let that = this;
      let promise = tim.joinGroup({
        groupID: that.dataInfo.groupId,
        type: TIM.TYPES.GRP_CHATROOM
      });
      promise
        .then(function(imResponse) {
          switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
            break; // 等待管理员同意
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            console.log("加群成功", imResponse.data.group); // 加入的群组资料
            that.isSuccessIM = true;
            that.$nextTick(() => {
              that.comeLiveRoom();
            });
            break;
          default:
            break;
          }
        })
        .catch(function(imError) {
          console.warn("joinGroup error:", imError); // 申请加群失败的相关信息
        });
    },
    quitGroup() {
      //退出群组
      let that = this;
      if (this.isSuccessIM) {
        let promise = tim.quitGroup(that.dataInfo.groupId);
        promise
          .then(function(imResponse) {
            console.log("退出成功的群", imResponse.data.groupID); // 退出成功的群 ID
          })
          .catch(function(imError) {
            console.warn("quitGroup error:", imError); // 退出群组失败的相关信息
          });
      }
      clearTimeout(this.giftEffectsTime);
    },
    //发送聊天
    sendmessage() {
      // let that = this;
      // let message = tim.createTextMessage({
      //   to: that.dataInfo.groupId,
      //   conversationType: TIM.TYPES.CONV_GROUP,
      //   payload: {
      //     text: that.maincomment
      //   }
      // });
      // // 2. 发送消息
      // let promise = tim.sendMessage(message);
      // promise.then(function(imResponse) {
      //   // 发送成功
      //   console.log(imResponse);
      //   that.messageList.push({
      //     nick: that.dataInfo.userNickname,
      //     id: that.dataInfo.userID,
      //     text: that.maincomment,
      //   });
      //   that.clearSend();
      //   that.$nextTick(()=>{
      //     that.chatMessagesBottom();
      //   })
      // }).catch(function(imError) {
      //   // 发送失败
      //   console.warn('sendMessage error:', imError);
      //   that.clearSend();
      // });
      if (!this.isSuccessIM) {
        return;
      }
      if (this.activeLiveSetInfo.chat_ban == 1) {
        Toast("您被禁言了，无法发送信息！");
        return;
      }
      this.catMessage("text", this.maincomment);
    },
    //创建聊天模版
    catMessage(type, text) {
      let that = this;
      let messageData = {};
      let Json = {
        memberId: this.dataInfo.userID ? this.dataInfo.userID : "",
        nickName: this.dataInfo.userNickname ? this.cutNameLimit(this.dataInfo.userNickname) : "",
        memberAvatar: this.dataInfo.userAvatar ? this.dataInfo.userAvatar : "",
        memberLevel: this.dataInfo.member_level ? this.dataInfo.member_level : 0,
        memberLevelName: this.dataInfo.member_level_name ? this.dataInfo.member_level_name.slice(0, 2) : "...",
        text: text ? text : ""
      };
      switch (type) {
      case "text":
        messageData = {
          to: that.dataInfo.groupId,
          conversationType: TIM.TYPES.CONV_GROUP,
          payload: {
            data: "自定义文本", // 用于标识该类型消息
            description: JSON.stringify(Json),
            extension: "customText"
          }
        };
        break;
      }
      let message = tim.createCustomMessage(messageData);
      let promise = tim.sendMessage(message);
      promise
        .then(function(imResponse) {
          // 发送成功
          if (type == "text") {
            that.messageList.push(Json);
            that.clearSend();
            that.$nextTick(() => {
              that.chatMessagesBottom();
            });
          }
          this.newMediaLive(6);
        })
        .catch(function(imError) {
          // 发送失败
          if (type == "text") {
            that.clearSend();
          }
          console.warn("sendMessage error:", imError);
        });
    },
    subMainCommentBtn() {
      let that = this;
      this.mainCommentShow = true;
      setTimeout(() => {
        that.$nextTick(() => {
          that.$refs.commentInput.focus();
        });
      }, 200);
    },
    cutNameLimit(_name) {
      if (_name.length > 8) {
        return _name.slice(0, 8) + "...";
      }
      return _name;
    },
    isFocus() {},
    isBlur() {
      setTimeout(() => {
        this.mainCommentShow = false;
      }, 500);
      this.commentMessage = this.maincomment ? this.maincomment : "和主播说点什么";
      var currentPosition, timerIn;
      var speed = 1; //页面滚动距离
      timerIn = setInterval(function() {
        currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, currentPosition); //页面向上滚动
        currentPosition += speed; //speed变量
        window.scrollTo(0, currentPosition); //页面向下滚动
        clearInterval(timerIn);
      }, 1);
    },
    clearSend() {
      let that = this;
      this.$nextTick(() => {
        that.$refs.commentInput.blur();
      });
      this.maincomment = null;
      this.commentMessage = "和主播说点什么...";
      this.mainCommentShow = false;
    },
    clickMessageOverlay() {
      this.commentMessage = this.maincomment ? this.maincomment : "和主播说点什么...";
    },
    chatMessagesBottom() {
      this.messageList = this.messageList.slice(-100);
      let ele = document.getElementById("chat_messages");
      if (ele) ele.scrollTop = ele.scrollHeight; // 使滚动条保持在底部
    },
    selectLiveGift(_giftData) {
      this.isGiftId = _giftData.id; //选择的打赏礼物id
      if (_giftData.credit1_number) {
        this.selectGiftCN = _giftData.credit1_number;
      }
      if (_giftData.love_number) {
        this.selectGiftLN = _giftData.love_number;
      }
      if (_giftData.credit2_number) {
        this.selectGiftYN = _giftData.credit2_number;
      }
    },
    submitReward() {
      //提交打赏
      if (!rewardTag) {
        console.log("打赏太频繁");
        return;
      }
      if (!this.isGiftId) {
        Toast("请选择礼物！");
        return;
      }
      if (this.radio == "1") {
        if (Number(this.selectGiftCN) <= 0) {
          Toast("请选择其他打赏类型");
          return;
        } else if (Number(this.selectGiftCN) > Number(this.giftList.member.credit1)) {
          // console.log(this.selectGiftCN, this.giftList.member.credit1)
          let _name = this.giftList.member.credit1_name ? this.giftList.member.credit1_name : "积分";
          Toast(`${_name}不足！`);
          return;
        }
      }
      if (this.radio == "2") {
        if (Number(this.selectGiftYN) <= 0) {
          Toast("请选择其他打赏类型");
          return;
        } else if (Number(this.selectGiftYN) > Number(this.giftList.member.credit2)) {
          this.wxPay_money = Number(this.selectGiftYN) - Number(this.giftList.member.credit2);
          this.showWxpay = true;
          this.showGift = false;
          return;
        }
      }
      if (this.radio == "3") {
        if (Number(this.selectGiftLN) <= 0) {
          Toast("请选择其他打赏类型");
          return;
        } else if (Number(this.selectGiftLN) > Number(this.giftList.member.love)) {
          let _love_name = this.giftList.member.love_name ? this.giftList.member.love_name : "爱心值";
          Toast(`${_love_name}不足！`);
          return;
        }
      }
      rewardTag = false;
      $http
        .post("plugin.room.frontend.reward.index", { reward_type: this.radio, reward_id: this.isGiftId, room_id: this.RoomId, number: 1 }, "")
        .then(response => {
          if (response.result === 1) {
            rewardTag = true;
            this.showGift = false;
            Toast("打赏成功！");
            if (this.radio == "1") {
              this.giftList.member.credit1 -= Number(this.selectGiftCN);
            }
            if (this.radio == "2") {
              this.giftList.member.credit2 -= Number(this.selectGiftYN);
            }
            if (this.radio == "3") {
              this.giftList.member.love -= Number(this.selectGiftLN);
            }
          } else {
            rewardTag = true;
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    usewechatpay() {
      let that = this;
      this.wxPay_money = parseFloat(this.wxPay_money);
      if (this.wxPay_money <= 0) {
        that.$dialog.alert({ message: "金额不可低于0元" });
        return;
      }
      let url = "finance.balance.recharge"; // "&client_type=2&app_type=wechat"
      $http.get(url, { pay_type: 1, recharge_money: this.wxPay_money }, "正在充值").then(
        response => {
          if (response.result == 1) {
            // 微信充值
            wx.config(response.data.js);
            that.WXPay(response.data.config);
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    WXPay(payParams) {
      let that = this;
      that.showWxpay = false;
      wx.chooseWXPay({
        appId: payParams.appId,
        timestamp: payParams.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payParams.nonceStr, // 支付签名随机串，不长于 32 位
        package: payParams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: payParams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: payParams.paySign, // 支付签名
        success: function(res) {
          // 支付成功后的回调函数
          if (res.errMsg == "chooseWXPay:ok") {
            Toast("支付成功，打赏中...");
            $http
              .post("plugin.room.frontend.reward.index", { reward_type: 2, reward_id: that.isGiftId, room_id: that.RoomId, number: 1 }, "")
              .then(response => {
                if (response.result === 1) {
                  Toast("打赏成功！");
                  that.giftList.member.credit2 = 0;
                } else {
                  Toast(response.msg);
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            that.$dialog.alert({ message: "充值失败，请返回重试" });
          }
        },
        cancel: function(res) {
          // 支付取消
        },
        fail: function(res) {
          that.$dialog.alert({ message: "充值失败，请返回重试" });
        }
      });
    },
    comeLiveRoom() {
      let that = this;
      if (that.IMmessage.come == 1) {
        that.catComeMessage();
      }
      if (that.IMmessage.welcome == 1) {
        that.catWelcomeMessage();
      }
      // $http.post("plugin.room.frontend.live.come-room", { room_id: this.RoomId }, "")
      //   .then(response => {
      //     if (response.result === 1) {
      //       // let Json = {
      //       //   memberId: this.dataInfo.userID ? this.dataInfo.userID : "",
      //       //   nickName: this.dataInfo.userNickname ? this.dataInfo.userNickname : "",
      //       //   memberAvatar: this.dataInfo.userAvatar ? this.dataInfo.userAvatar : "",
      //       //   memberLevel: this.dataInfo.member_level ? this.dataInfo.member_level : 0,
      //       //   text: '进入直播间！！！'
      //       // }
      //       // this.messageList.push(Json);
      //       this.activeLiveSetInfo = response.data;
      //       if (response.data.room_ban == 1) {
      //         //被禁入直播间
      //         that.onPlayerPause();
      //         that.stopLive = true;
      //         that.stopLiveTest = "您已被禁入该直播间！";
      //       }
      //     } else {
      //       Toast(response.msg);
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    },
    //创建进入直播间自定义模版
    catComeMessage() {
      let that = this;
      let messageData = {};
      let Json = {
        memberId: this.dataInfo.userID ? this.dataInfo.userID : "",
        nickname: this.dataInfo.userNickname ? this.dataInfo.userNickname : ""
      };

      messageData = {
        to: that.dataInfo.groupId,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          data: "自定义文本", // 用于标识该类型消息
          description: JSON.stringify(Json),
          extension: "come"
        }
      };

      let message = tim.createCustomMessage(messageData);
      let promise = tim.sendMessage(message);
      promise
        .then(function(imResponse) {
          // 发送成功
          that.tipsContent.push({
            type: "come",
            nickname: Json.nickname
          });
        })
        .catch(function(imError) {
          // 发送失败
          console.warn("进入直播间提示失败:::", imError);
        });
    },
    //创建进入直播间欢迎文字模版
    catWelcomeMessage() {
      let that = this;
      let messageData = {};
      let Json = {
        content: this.IMmessage.welcome_content
      };

      messageData = {
        to: that.dataInfo.groupId,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          data: "自定义文本", // 用于标识该类型消息
          description: JSON.stringify(Json),
          extension: "welcome"
        }
      };

      let message = tim.createCustomMessage(messageData);
      let promise = tim.sendMessage(message);
      promise
        .then(function(imResponse) {
          // 发送成功
          that.messageList.push(Json);
          that.$nextTick(() => {
            that.chatMessagesBottom();
          });
        })
        .catch(function(imError) {
          // 发送失败
          console.warn("进入直播间自动回复提示失败:::", imError);
        });
    },

    activeRoomSet() {
      let that = this;
      if (this.IMmessage) {
        if (this.IMmessage.now_goods && this.IMmessage.now_goods.goods_id) {
          //当前讲解商品
          that.activeLiveSetInfo.now_goods = that.IMmessage.now_goods;
        }
        if (that.IMmessage.room_ban == 1) {
          //被禁入直播间
          that.onPlayerPause();
          that.stopLive = true;
          that.stopLiveTest = "您已被禁入该直播间！";
        }
        if (that.IMmessage.chat_ban == 1) {
          that.activeLiveSetInfo.chat_ban = 1;
        }
      }
    },

    getLiveList(_activeRid) {
      let that = this;
      this.liveList = [];
      $http
        .post("plugin.room.frontend.live-list.get-live-list", { status: 3, page: 1 }, "")
        .then(response => {
          if (response.result === 1) {
            // if(that.fun.isTextEmpty(response.data.data)){
            //   Toast("没有正在直播的直播间！");
            //   that.$router.push(that.fun.getUrl("liveList"));
            //   return;
            // }
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            let _livelistes = response.data.data;
            // for (let i = 0; i < that.liveList.length; i++) {
            //   if (that.liveList[i].id == _activeRid) {
            //     that.liveList.splice(0, i);
            //   }
            // }
            that.liveList.push({
              id: that.RoomId,
              show: false
            });
            if (_livelistes.length > 0) {
              _livelistes.forEach(x => {
                if (x.id != that.RoomId) {
                  that.liveList.push(x);
                }
              });
            }

            that.getLiveRoom(0);
            that.setSwiperH();
            that.getGift();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getplayBack(_activeRid, _activeBackid) {
      let that = this;
      this.liveList = [];
      let _url = this.activatPlayType == "playBack" ? "plugin.room.frontend.live-list.play-back" : "plugin.room.frontend.anchor.get-back";
      let json = { page: 1 };
      if (this.activatPlayType == "memberPlayBack") {
        json.member_id = this.memberId;
      }
      $http
        .post(_url, json, "")
        .then(response => {
          if (response.result === 1) {
            // if(that.fun.isTextEmpty(response.data.data)){
            //   Toast("没有正在直播的直播间！");
            //   that.$router.push(that.fun.getUrl("liveList"));
            //   return;
            // }
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            let _livelistes = response.data.data;
            // for (let i = 0; i < that.liveList.length; i++) {
            //   if (that.liveList[i].id == _activeBackid) {
            //     that.liveList.splice(0, i);

            //     return;
            //   }
            // }

            that.liveList.push({
              room_id: that.RoomId,
              id: that.backPlayID,
              show: false
            });
            if (_livelistes.length > 0) {
              _livelistes.forEach(x => {
                if (x.id != that.backPlayID) {
                  that.liveList.push(x);
                }
              });
            }

            that.getBackRoom(0);
            that.setSwiperH();
            that.getGift();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMoreData() {
      console.log("触发更多：：：getMoreData");
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // Toast("没有更多了，请稍后刷新！");
        return;
      } else {
        this.page = this.page + 1;
        let _url = null;
        if (this.activatPlayType == "livePlay") {
          _url = "plugin.room.frontend.live-list.get-live-list";
        } else if (this.activatPlayType == "playBack") {
          _url = "plugin.room.frontend.live-list.play-back";
        } else if (this.activatPlayType == "memberPlayBack") {
          _url = "plugin.room.frontend.anchor.get-back";
        }
        let json = { page: this.page };
        if (this.activatPlayType == "livePlay") {
          json.status = 3;
        }
        $http.post(_url, json, "加载中").then(
          function(response) {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.liveList = that.liveList.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    checkPassword() {
      if (this.fun.isTextEmpty(this.room_passWord)) {
        Toast("请输入直播间密码！");
        return;
      }
      if (this.activatPlayType == "livePlay") {
        this.getLiveRoom(0, true);
      } else if (this.activatPlayType == "playBack" || this.activatPlayType == "memberPlayBack") {
        this.getBackRoom(0, true);
      }
    },
    getLiveRoom(_index, _check) {
      // console.log("请求了直播间数据接口",this.RoomId,_index,this.$refs.videoPlayer.player);
      let that = this;
      let _json = { id: this.RoomId };
      if (_check) {
        _json.password = this.room_passWord;
      }
      $http
        .post("plugin.room.frontend.live.room", _json, "")
        .then(response => {
          videoFirst = 1;
          if (response.result === 1) {
            if (response.data.purview == 2) {
              Toast("密码错误!");
              that.stopLive = true;
              that.stopLiveTest = "请输入密码";
              that.showPassword = true;
              that.room_passWord = null;
              return;
            } else if (response.data.purview == 3) {
              //需要密码访问
              that.stopLive = true;
              that.stopLiveTest = "请输入密码";
              that.showPassword = true;
              that.room_passWord = null;
              return;
            } else if (response.data.purview == 4) {
              that.stopLive = true;
              that.stopLiveTest = "您没有该直播间访问权限";
              Toast("没有访问权限!");
              return;
            }
            that.stopLive = false;
            that.showPassword = false;
            that.room_passWord = null;
            that.mode_button = response.data.mode_button || 0; //竖屏横屏
            that.$set(that.liveList[0], "avatar", response.data.avatar);
            that.$set(that.liveList[0], "nickname", response.data.nickname);
            that.$set(that.liveList[0], "cover", response.data.cover);
            that.$set(that.liveList[0], "banner", response.data.banner);
            console.log("直播状态：：", response.data.online_status);
            if (response.data.status == 3) {
              if (response.data.online_status && response.data.online_status == "forbid") {
                that.stopLiveTest = "直播禁用中";
                that.stopLive = true;
                return;
              } else if (response.data.online_status && response.data.online_status == "inactive") {
                that.stopLiveTest = "直播暂时离开";
                that.stopLive = true;
              }

              this.livePoster = response.data.cover;
              this.dataInfo = response.data;
              this.view_num = response.data.view_num ? response.data.view_num : 1;
              this.IMmessage = response.data.message;
              this.luck_number = response.data.luck_number || 0;
              this.openRTC = Number(response.data.voice_open) == 1 ? true : false;
              if (firstInitPlay) {
                this.liveSrc = response.data.play_url_m3u8;
                this.liveRTCSrc = this.openRTC ? response.data.play_url_rtc : ""; //voice_open：是否开启rtc模式
                this.livePKSrc = response.data.voice_status == 0 ? response.data.play_url_m3u8 : response.data.voice_anchor.play_url.play_url_m3u8;
                if (this.openRTC) {
                  //开启rtc
                  //voice_status 是否正在pk
                  this.livePKRTCSrc = response.data.voice_status == 0 ? response.data.play_url_rtc : response.data.voice_anchor.play_url.play_url_rtc; //voice_status==1已经在pk
                } else {
                  //没开启rtc,只是传统的hls模式
                  this.livePKRTCSrc = "";
                }
                this.LiveFlvSrc = response.data.play_url_flv;
                if (response.data.voice_status) {
                  this.livePKData = response.data.voice_anchor;
                  this.isLivePK = true;
                  this.startPKTime = response.data.voice_anchor.start_time;
                  this.pkTimer = setInterval(() => {
                    this.GetRTime();
                  }, 1000);
                }
                console.log("初始化TcPlayer===================");
                that.setTcPlayer();
                that.setPKPlayer();
                firstInitPlay = false;
              } else {
                player.load(this.openRTC ? response.data.play_url_rtc : response.data.play_url_m3u8);
                if (response.data.voice_status) {
                  this.livePKData = response.data.voice_anchor;
                  this.isLivePK = true;
                  playerPK.load(this.openRTC ? response.data.voice_anchor.play_url.play_url_rtc : response.data.voice_anchor.play_url.play_url_m3u8);
                  this.startPKTime = response.data.voice_anchor.start_time;
                  this.pkTimer = setInterval(() => {
                    this.GetRTime();
                  }, 1000);
                } else {
                  playerPK.pause();
                }
              }
              that.activeRoomSet();
              if (response.data.IM == 1 && !this.fun.isTextEmpty(options)) {
                this.isOpenIM = true;
                this.chatEventList(); //加载聊天事件
                setTimeout(() => {
                  that.chatLogin();
                }, 1000);
              } else {
                this.isOpenIM = false;
              }
              this.diy_menu = response.data.diy_menu.reverse();
              this.diy_option = response.data.diy_option;
              this.diy_set = response.data.diy_set;
              this.close_reward = response.data.close_reward || 0;
              this.close_chat = response.data.close_chat || 0;
              setTimeout(() => {
                // that.initShare();
                let _link;
                if (that.activatPlayType == "livePlay") {
                  _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/livePage?i=" + that.fun.getKeyByI() + "&shareType=livePlay" + "&room_id=" + that.RoomId;
                } else if (that.activatPlayType == "playBack") {
                  _link =
                    that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/livePage?i=" + that.fun.getKeyByI() + "&shareType=playBack" + "&room_id=" + that.RoomId + "&backid=" + that.backPlayID;
                } else if (that.activatPlayType == "memberPlayBack") {
                  _link =
                    that.fun.getSiteRoot() +
                    "/addons/yun_shop/" +
                    "?menu#" +
                    "/livePage?i=" +
                    that.fun.getKeyByI() +
                    "&shareType=memberPlayBack" +
                    "&room_id=" +
                    that.RoomId +
                    "&backid=" +
                    that.backPlayID +
                    "&memberid=" +
                    that.memberId;
                }
                that.fun.wxShare(
                  "",
                  {},
                  {
                    title: that.liveList[that.activeSwiperIndex] ? (that.liveList[that.activeSwiperIndex].title ? that.liveList[that.activeSwiperIndex].title : "直播间邀请") : "直播间邀请",
                    link: _link,
                    imgUrl: that.liveList[that.activeSwiperIndex] ? (that.liveList[that.activeSwiperIndex].cover ? that.liveList[that.activeSwiperIndex].cover : "") : "",
                    description: that.dataInfo.userNickname + "邀请您进入" + that.liveList[that.activeSwiperIndex].nickname + "的直播间"
                  }
                );
                if (response.data.is_share_word != 1) {
                  that.getPoster();
                }
              }, 1200);
              if (response.data.view_activity == 1) {
                for (let j = 0; j < that.activityTimeArray.length; j++) {
                  clearTimeout(that.activityTimeArray[j]);
                }
                that.activityTimeArray = [];
                let activityArray = response.data.activity;
                let activityDataArray = [];
                let activityTimeArray = that.activityTimeArray;
                for (let i = 0; i < activityArray.length; i++) {
                  let activity = activityArray[i];
                  let activityList = [];
                  let startTime = 0;
                  if (activity.coupon && activity.coupon.coupon_id) {
                    activity.coupon.coupon_id.forEach((val, index) => {
                      activityList.push({
                        coupon_id: activity.coupon.coupon_id[index],
                        coupon_name: activity.coupon.coupon_name[index],
                        coupon_several: activity.coupon.coupon_several[index],
                        status: 1
                      });
                    });
                  }
                  if (activity.liveTime) {
                    startTime = activity.liveTime * 60 * 1000;
                  }
                  activity.activityList = activityList;
                  activity.pointBonusStatus = 1;
                  activity.loveBonusStatus = 1;
                  activity.balanceBonusStatus = 1;
                  activity.packetBonusStatus = 1;
                  activity.status = 1;
                  activity.showactivity = false;
                  activityDataArray.push({
                    activityData: activity
                  });
                  if (startTime) {
                    let activityTime = null;
                    activityTime = setTimeout(function() {
                      that.$delete(that.activityDataArray[i].activityData, "showactivity");
                      that.$set(that.activityDataArray[i].activityData, "showactivity", true);
                      that.activityDataArray[i].activityData.showactivity = true; //没更新到视图
                    }, startTime);
                    activityTimeArray.push(activityTime);
                  }
                }
                that.activityTimeArray = activityTimeArray;
                that.activityDataArray = activityDataArray;
              }
            } else {
              that.stopLive = true;
              if (response.data.status == 4) {
                // if(that.fun.getKey("shareType")){
                //   that.$router.push(that.fun.getUrl("anchorDetail", {id:that.dataInfo.member_id}));
                //   return;
                // }

                // that.$router.push(that.fun.getUrl("livePage", {id:that.RoomId,backid:response.data.back_id,memberid:response.data.member_id, type:'memberPlayBack'}));
                if (response.data.back_id) {
                  that.stopLiveTest = "直播已结束,播放回放中";
                  that.activatPlayType = "playBack";
                  that.backPlayID = response.data.back_id;
                  that.memberId = response.data.member_id;
                  setTimeout(() => {
                    that.stopLive = false;
                    that.getplayBack(that.RoomId, that.backPlayID);
                  }, 1000);
                } else {
                  that.stopLiveTest = "直播已结束";
                }
              } else if (response.data.status == 1) {
                that.stopLiveTest = "直播正待审核中";
                if (that.fun.getKey("shareType")) {
                  that.$router.push(that.fun.getUrl("foreshow", { id: that.RoomId }));
                  return;
                }
              } else if (response.data.status == 2) {
                that.stopLiveTest = "等待开播";
                if (that.fun.getKey("shareType")) {
                  that.$router.push(that.fun.getUrl("foreshow", { id: that.RoomId }));
                  return;
                }
              }
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getBackRoom(_index, _check) {
      let that = this;
      let _json = { room_id: this.RoomId, back_id: this.backPlayID };
      if (_check) {
        _json.password = this.room_passWord;
      }
      $http
        .post("plugin.room.frontend.live.room-back", _json, "")
        .then(response => {
          videoFirst = 1;
          if (response.result === 1) {
            if (response.data.purview == 2) {
              Toast("密码错误!");
              that.stopLive = true;
              that.stopLiveTest = "请输入密码";
              return;
            } else if (response.data.purview == 3) {
              //需要密码访问
              that.stopLive = true;
              that.stopLiveTest = "请输入密码";
              that.showPassword = true;
              that.room_passWord = null;
              return;
            } else if (response.data.purview == 4) {
              that.stopLive = true;
              that.stopLiveTest = "您没有该直播间访问权限!";
              Toast("没有访问权限!");
              return;
            }
            that.showPassword = false;
            that.room_passWord = null;
            that.stopLive = false;
            that.$set(that.liveList[0], "avatar", response.data.avatar);
            that.$set(that.liveList[0], "nickname", response.data.nickname);
            that.$set(that.liveList[0], "cover", response.data.cover);
            that.$set(that.liveList[0], "banner", response.data.banner);

            this.livePoster = response.data.cover;
            this.mode_button = response.data.mode_button || 0; //竖屏横屏
            that.targetVideo.maxTime = parseInt(response.data.duration);
            this.dataInfo = response.data;
            this.view_num = response.data.view_num ? response.data.view_num : 1;
            this.IMmessage = response.data.message;
            this.luck_number = response.data.luck_number || 0;
            this.close_reward = response.data.close_reward || 0;
            this.close_chat = response.data.close_chat || 0;
            if (firstInitPlay) {
              this.liveSrc = response.data.video_url;
              // this.liveSrc = 'http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8';
              console.log("初始化TcPlayer===================");
              that.setTcPlayer();
              // document.querySelector('video').style.marginLeft = -10 + 'px';
              firstInitPlay = false;
            } else {
              player.load(response.data.video_url);
            }
            // player.load(response.data.video_url);
            that.activeRoomSet();
            if (response.data.IM == 1 && !this.fun.isTextEmpty(options)) {
              this.isOpenIM = true;
              this.chatEventList(); //加载聊天事件
              setTimeout(() => {
                that.chatLogin();
              }, 1000);
            } else {
              this.isOpenIM = false;
            }
            this.diy_menu = response.data.diy_menu.reverse();
            this.diy_option = response.data.diy_option;
            this.diy_set = response.data.diy_set;
            setTimeout(() => {
              // that.initShare();
              let _link;
              if (that.activatPlayType == "livePlay") {
                _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/livePage?i=" + that.fun.getKeyByI() + "&shareType=livePlay" + "&room_id=" + that.RoomId;
              } else if (that.activatPlayType == "playBack") {
                _link =
                  that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/livePage?i=" + that.fun.getKeyByI() + "&shareType=playBack" + "&room_id=" + that.RoomId + "&backid=" + that.backPlayID;
              } else if (that.activatPlayType == "memberPlayBack") {
                _link =
                  that.fun.getSiteRoot() +
                  "/addons/yun_shop/" +
                  "?menu#" +
                  "/livePage?i=" +
                  that.fun.getKeyByI() +
                  "&shareType=memberPlayBack" +
                  "&room_id=" +
                  that.RoomId +
                  "&backid=" +
                  that.backPlayID +
                  "&memberid=" +
                  that.memberId;
              }
              that.fun.wxShare(
                "",
                {},
                {
                  title: that.liveList[that.activeSwiperIndex] ? (that.liveList[that.activeSwiperIndex].title ? that.liveList[that.activeSwiperIndex].title : "直播间邀请") : "直播间邀请",
                  link: _link,
                  imgUrl: that.liveList[that.activeSwiperIndex] ? (that.liveList[that.activeSwiperIndex].cover ? that.liveList[that.activeSwiperIndex].cover : "") : "",
                  description: that.dataInfo.userNickname + "邀请您进入" + that.liveList[that.activeSwiperIndex].nickname + "的直播间"
                }
              );
              if (response.data.is_share_word != 1) {
                that.getPoster();
              }
            }, 1200);
            if (response.data.view_activity == 1) {
              for (let j = 0; j < that.activityTimeArray.length; j++) {
                clearTimeout(that.activityTimeArray[j]);
              }
              that.activityTimeArray = [];
              let activityArray = response.data.activity;
              let activityDataArray = [];
              let activityTimeArray = that.activityTimeArray;
              for (let i = 0; i < activityArray.length; i++) {
                let activity = activityArray[i];
                let activityList = [];
                let startTime = 0;
                if (activity.coupon && activity.coupon.coupon_id) {
                  activity.coupon.coupon_id.forEach((val, index) => {
                    activityList.push({
                      coupon_id: activity.coupon.coupon_id[index],
                      coupon_name: activity.coupon.coupon_name[index],
                      coupon_several: activity.coupon.coupon_several[index],
                      status: 1
                    });
                  });
                }
                if (activity.liveTime) {
                  startTime = activity.liveTime * 60 * 1000;
                }
                activity.activityList = activityList;
                activity.pointBonusStatus = 1;
                activity.loveBonusStatus = 1;
                activity.balanceBonusStatus = 1;
                activity.packetBonusStatus = 1;
                activity.status = 1;
                activity.showactivity = false;
                activityDataArray.push({
                  activityData: activity
                });
                if (startTime) {
                  let activityTime = null;
                  activityTime = setTimeout(function() {
                    that.$delete(that.activityDataArray[i].activityData, "showactivity");
                    that.$set(that.activityDataArray[i].activityData, "showactivity", true);
                    that.activityDataArray[i].activityData.showactivity = true; //没更新到视图
                  }, startTime);
                  activityTimeArray.push(activityTime);
                }
              }
              that.activityTimeArray = activityTimeArray;
              that.activityDataArray = activityDataArray;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    quitRoom() {
      //退出当前直播间、
      $http
        .post("plugin.room.frontend.live.quit-room", { room_id: this.RoomId }, "")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    makePoster() {
      if (this.diyPosterWord != "" || this.oldWord != this.diyPosterWord) {
        this.loadingImg = true;
        this.dataURL = null;
        this.getPoster();
      }
      this.showPosterWord = false;
      this.showPosterMethob(true);
    },
    showPosterMethob(_tag) {
      let that = this;
      if (!_tag && this.dataInfo.is_share_word == 1) {
        this.oldWord = this.diyPosterWord;
        this.showPosterWord = true;
        return;
      }
      // let timer = null;
      if (!this.loadingImg && this.dataURL) {
        clearTimeout(timer_hb);
        if (powerToast) {
          powerToast.clear();
        }

        if (that.failUpload) {
          return;
        }
        this.showPoster = true;
        if (this.fun.getPhoneEnv() == 2) {
          Toast({
            duration: 3500,
            message: "点击海报预览后,可长按保存！"
          });
        }
        return;
      } else {
        if (!powerToast) {
          powerToast = Toast({
            duration: -1, // 持续展示 toast
            message: "正在为您生成海报中，请稍后"
          });
        }
        timer_hb = setTimeout(() => {
          that.showPosterMethob(true);
        }, 800);
      }
    },
    getPoster() {
      $http
        .post("plugin.room.frontend.live-list.room-post", { id: this.RoomId, shareType: this.activatPlayType, backid: this.backPlayID, memberid: this.memberId })
        .then(response => {
          if (response.result === 1) {
            this.PosterDatas = response.data;

            this.posterImg.push(this.PosterDatas.shop_logo, this.PosterDatas.cover, this.dataInfo.avatar, this.PosterDatas.m_avatar, this.PosterDatas.qr_code);
            this.loop();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    async loop() {
      let that = this;
      for (let i = 0; i < that.posterImg.length; i++) {
        await that.onloadImg(that.posterImg[i], i);
      }
      this.$nextTick(() => {
        setTimeout(() => {
          console.log("开始画图");
          that.saveImg();
        }, 1000);
      });
    },
    onloadImg(data, i, type) {
      return new Promise((resolve, reject) => {
        //一定要设置为let，不然图片不显示
        let image = new Image();
        //解决跨域问题
        image.setAttribute("crossOrigin", "anonymous");

        let imageUrl = data;
        // let scale = window.devicePixelRatio; //定义任意放大倍数 支持小数
        image.src = `${imageUrl}?${Date.now()}`;
        let that = this;
        //image.onload为异步加载
        image.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);

          var quality = 0.8;
          //这里的dataurl就是base64类型
          var dataURL = canvas.toDataURL("image/png", quality); //使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
          that.base64Datas.push(dataURL);
          console.log("转换图片成功 =====success=====", i);

          resolve();
        };
        image.onerror = () => {
          that.base64Datas.push("");
          console.log("转换图片报错  ===== error ===", i);
          resolve();
          // that.getError()
        };
      });
    },
    saveImg() {
      var content = document.getElementById("code_box");
      const that = this;
      if (content) {
        html2canvas(content, {
          useCORS: true,
          backgroundColor: null // 解决生成的图片有白边
        }).then(canvas => {
          that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
          document.getElementById("thecanvas").setAttribute("src", that.dataURL);
          that.uploadImageM();
        });
      }
    },
    uploadImageM() {
      //图片上传
      let that = this;
      let uploadImage = this.fun.getRealUrl("upload.uploadPic", {});
      let fd = new FormData();
      fd.append("file", this.dataURItoBlob(this.dataURL));
      axios
        .post(uploadImage, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result == 1) {
            that.previewImageUrl = response.data.data.img_url;
            that.loadingImg = false;
          } else {
            that.loadingImg = false;
            that.failUpload = true;
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    startMove() {
      let that = this;
      if (this.tipsContent.length > 0) {
        this.tipsopacityBol = !this.tipsopacityBol;
      }
      timer_1 = setTimeout(() => {
        if (this.tipsopacityBol) {
          if (this.tipsContent.length > 0) {
            (that.tipsContentMsssage = that.tipsContent.shift()), (that.tipsopacity = 1);
          } else {
            that.tipsopacity = 0;
          }
        } else {
          this.tipsopacity = 0;
        }
        this.startMove();
      }, 2000); // 滚动不需要停顿则将2000改成动画持续时间
    },
    gotoMember() {
      if (!this.MemberInfo.member_id) {
        return;
      }
      this.$router.push(this.fun.getUrl("anchorDetail", { id: this.MemberInfo.member_id }));
    },
    gotoReport() {
      this.$router.push(this.fun.getUrl("LiveReport", { id: this.RoomId }));
    },
    gotoGoodDetail(_id) {
      this.$router.push(this.fun.getUrl("goods", { id: _id }, { liveRoomId: this.RoomId }));
    },
    gotoShop() {
      if (!this.MemberInfo.shop_id) {
        return;
      }
      this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: this.MemberInfo.shop_id }));
    },
    gotoAnchor() {
      if (!this.MemberInfo.member_id) {
        return;
      }
      this.$router.push(this.fun.getUrl("anchorDetail", { id: this.MemberInfo.member_id }));
    },
    showGiftPopup() {
      let that = this;
      if (this.fun.isTextEmpty(this.giftList.list)) {
        Toast("抱歉，没有礼物可进行打赏！");
        return;
      }
      this.$nextTick(() => {
        setTimeout(() => {
          that.showGift = true;
        }, 800);
      });
    },
    getGift() {
      let that = this;
      $http
        .post("plugin.room.frontend.live.reward-list", {})
        .then(response => {
          if (response.result === 1) {
            that.giftList.member = response.data.member;
            that.rewardType = response.data.type;
            that.giftList.list = [];
            let list = response.data.list;
            for (let i = 0; i < list.length; i += 8) {
              that.giftList.list.push(list.slice(i, i + 8));
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    anchorPopup() {
      //主播信息
      $http
        .post("plugin.room.frontend.live.anchor-popup", { room_id: this.RoomId }, "")
        .then(response => {
          if (response.result === 1) {
            this.showUser = true;
            this.MemberInfo = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addConcern() {
      //添加关注
      $http
        .post("plugin.room.frontend.live.concern", { member_id: this.dataInfo.member_id, room_id: this.RoomId }, "")
        .then(response => {
          if (response.result === 1) {
            this.dataInfo.is_concern = 1;
            Toast("关注成功");
            this.newMediaLive(2);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancelConcern() {
      //取消关注
      $http
        .post("plugin.room.frontend.anchor.cancel-concern", { member_id: this.dataInfo.member_id }, "")
        .then(response => {
          if (response.result === 1) {
            this.dataInfo.is_concern = 0;
            this.MemberInfo.is_concern = 0;
            Toast("已取消关注");
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //im的营销活动
    getroomMember(first_index) {
      let that = this;
      let roomMemberContent = that.roomMemberContent[first_index];
      let roomMemberContentArray = that.roomMemberContentArray;
      // let roomMemberTimeArray = that.roomMemberTimeArray;
      if (roomMemberContent) {
        let activity = roomMemberContent;
        let activityList = [];
        // let startTime ;
        if (activity.coupon && activity.coupon.coupon_id) {
          activity.coupon.coupon_id.forEach((val, index) => {
            activityList.push({
              coupon_id: activity.coupon.coupon_id[index],
              coupon_name: activity.coupon.coupon_name[index],
              coupon_several: activity.coupon.coupon_several[index],
              status: 1
            });
          });
        }
        // if (activity.liveTime) {
        //   startTime = activity.liveTime * 60 * 1000;
        // }
        activity.activityList = activityList;
        activity.pointBonusStatus = 1;
        activity.loveBonusStatus = 1;
        activity.balanceBonusStatus = 1;
        activity.packetBonusStatus = 1;
        activity.status = 1;
        activity.showactivity = false;
        roomMemberContentArray.push({
          activityData: activity
        });
        (that.roomMemberContentArray = roomMemberContentArray), (that.roomMemberContentArray[first_index].activityData.showactivity = true);
      }
    },
    //im的营销活动提交
    roomMemberBtn(_index, _id) {
      let id = _id;
      let index = _index;
      if (this.roomMemberBtnBol) {
        return false;
      }
      this.roomMemberBtnBol = true;
      if (this.roomMemberContentArray[index].activityData.status == 2) {
        return false;
      }
      let that = this;
      $http
        .post("plugin.room.frontend.live.room-member-activity", { room_id: this.RoomId, activity_id: id }, "")
        .then(res => {
          if (res.result === 1) {
            Toast(res.msg);
            let activitymessage = res.data;

            if (activitymessage.balanceBonus == 1) {
              that.roomMemberContentArray[index].activityData.balanceBonusStatus = 2;
            } else {
              that.roomMemberContentArray[index].activityData.balanceBonusStatus = 3;
            }

            let activityList = that.roomMemberContentArray[index].activityData.activityList;
            if (activitymessage.coupon == 1) {
              activityList.forEach((val, idx) => {
                activityList[idx].status = 2;
              });
              that.roomMemberContentArray[index].activityData.activityList = activityList;
            } else {
              activityList.forEach((val, idx) => {
                activityList[idx].status = 3;
              });
              that.roomMemberContentArray[index].activityData.activityList = activityList;
            }

            if (activitymessage.loveBonus == 1) {
              that.roomMemberContentArray[index].activityData.loveBonusStatus = 2;
            } else {
              that.roomMemberContentArray[index].activityData.loveBonusStatus = 3;
            }

            if (activitymessage.packetBonus == 1) {
              that.roomMemberContentArray[index].activityData.packetBonusStatus = 2;
            } else {
              that.roomMemberContentArray[index].activityData.packetBonusStatus = 3;
            }

            if (activitymessage.pointBonus == 1) {
              that.roomMemberContentArray[index].activityData.pointBonusStatus = 2;
            } else {
              that.roomMemberContentArray[index].activityData.pointBonusStatus = 3;
            }
            that.roomMemberContentArray[index].activityData.status = 2;

            let updateDatas = that.roomMemberContentArray[index].activityData;
            that.$delete(that.roomMemberContentArray[index], "activityData");
            that.$set(that.roomMemberContentArray[index], "activityData", updateDatas);
            this.roomMemberBtnBol = false;
          } else {
            Toast(res.msg);
            this.roomMemberBtnBol = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //领取直播间营销活动（非IM）
    activityDataBtn(_index, _id) {
      let id = _id;
      let index = _index;
      if (this.activityDataBtnBol) {
        return false;
      }
      this.activityDataBtnBol = true;
      if (this.activityDataArray[index].activityData.status == 2) {
        return false;
      }
      let that = this;
      $http
        .post("plugin.room.frontend.live.member-activity", { room_id: this.RoomId, activity_id: id }, "")
        .then(res => {
          if (res.result === 1) {
            Toast(res.msg);
            let activitymessage = res.data;

            if (activitymessage.balanceBonus == 1) {
              that.activityDataArray[index].activityData.balanceBonusStatus = 2;
            } else {
              that.activityDataArray[index].activityData.balanceBonusStatus = 3;
            }

            let activityList = that.activityDataArray[index].activityData.activityList;
            if (activitymessage.coupon == 1) {
              activityList.forEach((val, idx) => {
                activityList[idx].status = 2;
              });
              that.activityDataArray[index].activityData.activityList = activityList;
            } else {
              activityList.forEach((val, idx) => {
                activityList[idx].status = 3;
              });
              that.activityDataArray[index].activityData.activityList = activityList;
            }

            if (activitymessage.loveBonus == 1) {
              that.activityDataArray[index].activityData.loveBonusStatus = 2;
            } else {
              that.activityDataArray[index].activityData.loveBonusStatus = 3;
            }

            if (activitymessage.packetBonus == 1) {
              that.activityDataArray[index].activityData.packetBonusStatus = 2;
            } else {
              that.activityDataArray[index].activityData.packetBonusStatus = 3;
            }

            if (activitymessage.pointBonus == 1) {
              that.activityDataArray[index].activityData.pointBonusStatus = 2;
            } else {
              that.activityDataArray[index].activityData.pointBonusStatus = 3;
            }
            that.activityDataArray[index].activityData.status = 2;

            let updateDatas = that.activityDataArray[index].activityData;
            that.$delete(that.activityDataArray[index], "activityData");
            that.$set(that.activityDataArray[index], "activityData", updateDatas);
            that.activityDataBtnBol = false;
          } else {
            Toast(res.msg);
            that.activityDataBtnBol = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cloneFloatBtn(index) {
      this.diy_menu.splice(index, 1);
      return;
    },
    showactivityCloseBtn(_index) {
      //关闭营销活动弹窗
      this.activityDataArray[_index].activityData.showactivity = false;
    },
    showactivityCloseBtn_1() {
      this.roomMemberContentArray[_index].activityData.showactivity = false;
    },
    goCoupon() {
      this.$router.push(this.fun.getUrl("coupon", {}));
    },
    goIntegral() {
      this.$router.push(this.fun.getUrl("integral_v2", {}));
    },
    goLoveindex() {
      this.$router.push(this.fun.getUrl("love_index", {}));
    },
    gobalance() {
      this.$router.push(this.fun.getUrl("balance", {}));
    },
    //发送弹幕/礼物
    addBarrage() {
      // this.tipsContent.push({
      //   type: "concern",
      //   nickname: 'ssssssssssss'
      // });

      gitCanvas.add([
        {
          nickname: "是的开发建设",
          reward_name: "送主播一架飞机",
          img: ""
        }
      ]);
    },
    gotoLivelist() {
      if (this.$route.query.from == "back") {
        this.$router.go(-1);
      } else {
        this.$router.push(this.fun.getUrl("liveList", {}));
      }
    },
    gotoPKLiver(_Rid, _streamid) {
      // let name = this.$route.name == "livePage" ? "livePagePK" : "livePage";
      // this.$router.push(this.fun.getUrl(name, { id: _Rid, type: "livePlay" }));
      let _liveData = {
        _rid: _Rid || _streamid,
        tpye: "livePlay"
      };
      window.localStorage.setItem("setLiveInfo", JSON.stringify(_liveData));
      this.$router.go(0); //这样返回上一页为直播列表页
    },
    shareMessage() {
      this.$dialog.alert({ message: "点击生成海报分享给您的好友！" });
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl
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
        let _title = that.liveList[that.activeSwiperIndex] ? (that.liveList[that.activeSwiperIndex].title ? that.liveList[that.activeSwiperIndex].title : "直播间邀请") : "直播间邀请";
        let _imgUrl = that.liveList[that.activeSwiperIndex] ? (that.liveList[that.activeSwiperIndex].cover ? that.liveList[that.activeSwiperIndex].cover : "") : "";
        let _desc = that.dataInfo.userNickname + "邀请您进入" + that.liveList[that.activeSwiperIndex].nickname + "的直播间";
        let _link = null;

        // let _link = location.protocol+'//'+location.host+location.pathname +'?menu#/livePage/'+ that.RoomId +'?i='+ that.fun.getKeyByI() +"&type=" +that.fun.getTyep() + "&share_tag=2";
        if (that.activatPlayType == "livePlay") {
          _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/livePage?i=" + that.fun.getKeyByI() + "&shareType=livePlay" + "&room_id=" + that.RoomId;
        } else if (that.activatPlayType == "playBack") {
          _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/livePage?i=" + that.fun.getKeyByI() + "&shareType=playBack" + "&room_id=" + that.RoomId + "&backid=" + that.backPlayID;
        } else if (that.activatPlayType == "memberPlayBack") {
          _link =
            that.fun.getSiteRoot() +
            "/addons/yun_shop/" +
            "?menu#" +
            "/livePage?i=" +
            that.fun.getKeyByI() +
            "&shareType=memberPlayBack" +
            "&room_id=" +
            that.RoomId +
            "&backid=" +
            that.backPlayID +
            "&memberid=" +
            that.memberId;
        }
        _link = that.fun.isMid(_link, data.info.uid);
        console.log(_link, "link");

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
    reportsave(data) {
      this.showReportPopup = false;
    },
    // 处理进度条start
    changePlayStatus() {
      if (this.songStop) {
        player.play();
      } else {
        player.pause();
      }
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
      let that = this;
      const { maxTime, minTime, step } = that.targetVideo;
      let value = ((e.clientX - that.$refs.slider[0].offsetLeft) / that.$refs.slider[0].offsetWidth) * (maxTime - minTime);
      value = Math.round(value / step) * step + minTime;
      value = parseFloat(value.toFixed(5));

      if (value > maxTime) {
        value = maxTime;
      } else if (value < minTime) {
        value = minTime;
      }
      this.sliderTime = parseInt((value / maxTime) * 100);
      player.currentTime(value);
    },
    isopenBtn(_name) {
      if (this.fun.isTextEmpty(this.diy_set)) {
        //功能开关，为空时就是全都开启
        return true;
      }
      return _name == "1" ? false : true;
    },
    gotoLuckDraw() {
      this.$router.push(this.fun.getUrl("luckyDraw", {}));
    },
    gotoUrl(name, params = {}) {
      if (name == "advertisingPutAD") {
        //投放广告按钮
        if (!params.is_advertiser) {
          this.$router.push(this.fun.getUrl("advertisingApply")); //还不是广告主，跳转申请页
        } else {
          this.$router.push(this.fun.getUrl("advertisingPutAD", { tag: "live", id: params.id }));
        }
        return;
      }
      this.$router.push(this.fun.getUrl(name, params));
    },
    giftEffectsTimer() {
      //打赏礼物特效定时器
      let timer = Number(this.specialList[0].effect_time) > 0 ? Number(this.specialList[0].effect_time) * 1000 : 2000; //特效周期，后台设置，单位/秒
      this.giftEffectsTime = setTimeout(() => {
        this.specialList.splice(0, 1); //特效gif周期到了，删除
        if (this.specialList.length > 0) {
          this.giftEffectsTimer();
        } else {
          clearTimeout(this.giftEffectsTime);
        }
      }, timer);
    },
    GetRTime() {
      let PKTime = this.startPKTime; //PK开始时间
      let NowTime = new Date(); //当前时间
      //后台给我的是10位 精确到秒的  所有下面我就除以了1000，不要小数点后面的
      let t = (NowTime.getTime() / 1000).toFixed(0) - PKTime;
      //如果后台给的是毫秒 上面不用除以1000  下面的计算时间也都要除以1000 这里我去掉1000了
      let d = Math.floor(t / 60 / 60 / 24); //天 var d=Math.floor(t/1000/60/60/24)
      let h = Math.floor((t / 60 / 60) % 24); //时 var h=Math.floor(t/1000/60/60%24)
      let m = Math.floor((t / 60) % 60); //分 var m=Math.floor(t/1000/60%60)
      let s = Math.floor(t % 60); //秒 var s=Math.floor(t/1000%60)
      if (parseInt(d) < 10) d = "0" + d;
      if (parseInt(h) < 10) h = "0" + h;
      if (parseInt(m) < 10) m = "0" + m;
      if (parseInt(s) < 10) s = "0" + s;
      if (parseInt(d) >= 1) {
        this.PKTimed = `${d}:${h}:${m}:${s}`;
      } else {
        this.PKTimed = `${h}:${m}:${s}`;
      }
    },
    newMediaLive(type) {
      $http
        .post("plugin.new-media-advertising.frontend.media-advertisingt.root-behavioral-reward", {
          behavioral: type,
          advertisingt_id: this.RoomId
        })
        .then(res => console.log(res));
    }
  },
  beforeRouteLeave: function(to, from, next) {
    if (self.showReportPopup || self.showGift || self.showPoster) {
      self.showReportPopup = false;
      self.showGift = false;
      self.showPoster = false;
      next(false);
    } else {
      if (to.name != "liveList" && self.activatPlayType == "livePlay") {
        self.$store.commit("setReturnLiveBtn", true);
        next();
      } else {
        self.$store.commit("setReturnLiveBtn", false);
        next();
      }
    }
  },
  computed: {
    // player() {
    //   return this.$refs.videoPlayer.player
    // },
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    playsinline() {
      var ua = navigator.userAgent.toLocaleLowerCase();
      if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
        return false;
      } else {
        return true;
      }
    },
    nameEllipsis() {
      if (this.dataInfo.is_share_word == 1 && this.diyPosterWord != "") {
        return this.diyPosterWord;
      }
      if (this.PosterDatas.m_nickname) {
        return this.PosterDatas.m_nickname + "的分享";
      }
    }
  },
  components: { mReportPage },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    }
  }
};
