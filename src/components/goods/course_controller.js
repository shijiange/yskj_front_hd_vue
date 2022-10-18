import { yzPay } from "../../utils/yz_pay"; //引入支付方法
import cTitle from "components/title";
// import { Toast } from 'vant';
import payKeyboard from "components/payKeyboard";
import { Toast } from "vant";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import U_backup from "components/new_diy/backup";
var submitActionTag = "";

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

export default {
  mixins: [yzPay],
  props: ["goods_type", "goods_info"],
  data() {
    return {
      // 折叠面板
      activeNames: 0,
      show1: false,
      service_QRcode: "",
      service_mobile: "",
      live: false,
      live_title: "",
      info: {},
      is_zhibo: false,
      //标题
      goodTit: "",
      //价格
      goodPrice: "",
      // 价格权限
      vip_level_status: {},
      //章节数
      chapterNum: 0,
      //讲师头像
      teacherImg: "",
      //讲师姓名
      teacherName: "",
      //章节列表
      chapterdigList: [],
      //播放src
      vedioSrc: "",

      is_show: true,
      is_vshow: false,

      isLook: false,
      //商品价格
      goodsPrice: 0,

      //商品详情
      goodsContent: "",

      //推荐商品
      pushGoodList: [],

      active: 9999,
      first_active: 9999,
      is_study: false,

      is_update: false,

      is_buy: false,

      contentShow: false,

      pushShow: false,

      rewardShow: false,
      rewardMoney: "",
      actionSheetItems: [],
      //弹窗按钮控制
      actionSheetShow: false,

      rewardBtnShow: false,

      //分享数据
      courseShare: {},

      //商品图片
      goodsImg: "",

      //客服参数
      cservice: "",

      //课程id
      courseId: "",
      //章节id
      chapter_id: "",

      //tab active class
      tabActive: "",

      //打赏金额选项
      rewardArr: [
        {
          value: 1,
          name: "5元"
        },
        {
          value: 2,
          name: "10元"
        },
        {
          value: 3,
          name: "20元"
        },
        {
          value: 4,
          name: "其他金额"
        }
      ],

      rewardMoneyBtn: false,

      moneyActiveClass: 9999,

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
      sliderTime: 0,
      songStop: true,
      isVoice: false,
      isVideo: false,

      isVideoOn: true,
      showGood: false,
      video_image: null, //视频封面
      is_try_time: null,
      is_questionnaire_time: null,

      rewardPayshow: false,
      popupSpecs: false,
      payarr: "",

      point_goods: "",
      integral: window.localStorage.integral || "积分",
      //问卷调查
      questionnaire_is_open: 0,
      shopName: "",
      plugin_point_name: "",
      // 海报按钮
      btnData2: {
        button_size: 40,
        over_top: 450,
        position_location: "right",
        icon_url: "https://www.yunzmall.com//min_img/bc_eweima.png"
      },
      //海报显隐
      posterShow: false,
      posterImg: null,
      isFrontCanvas: true, //是否前端控制生成海报，false为后端生成
      //end

      styleSetOptions: {}, //后台基础设置-样式设置
      countDownTime: null,
      iscCountDownFinish: false, //课程有效期是否到了
      HasBuyPermissions: false //是否有购买权限，true则不可以下单
    };
  },

  mounted() {
    if (this.$route.name !== "CourseDetail") {
      this.init();
      this.chapter_id = this.fun.getKey("chapter_id");
      this.getDetailInfo();
      if (this.goods_info.plugin && this.goods_info.plugin.point_goods) {
        this.point_goods = this.goods_info.plugin.point_goods;
      }
    }
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    }
  },
  methods: {
    //海报生成
    postShow() {
      if (!this.fun.isTextEmpty(this.posterImg)) {
        this.posterShow = true;
      } else {
        let toastPoster = Toast({
          duration: -1, // 持续展示 toast
          message: "正在为您生成海报中"
        });
        let url = "";
        let Jons = {};
        this.isFrontCanvas = true;
        url = "goods.goods-poster.new-goods-poster";
        Jons = {
          id: this.$route.params.id
        };
        Jons.id = this.$route.params.id;
        $http
          .get(url, Jons, "")
          .then(response => {
            toastPoster.clear();
            if (response.result == 1) {
              // isFrontCanvas 是否需要前端生成海报
              this.posterImg = this.isFrontCanvas ? response.data : `${response.data.image_url}?${Date.now()}`;
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
    //初始化pop
    initPayPassBox() {
      this.pwds = [];
      this.pwd = "";
      this.pw1 = "";
      this.pw2 = "";
      this.pw3 = "";
      this.pw4 = "";
      this.pw5 = "";
      this.pw6 = "";
    },
    //密码组装
    onPassword(value) {
      // if (this.pwd.length < 6) {
      //   this.pwd = this.pwd + value;
      //   this.setPwdView(); //设置密码显示
      // }
      // if (this.pwd.length == 6) {
      //   this.hidePayPassBox();
      //   this.getVerifyPassword(this.pwd); //请求密码验证接口
      //   this.pwd = ""; //复位
      // }
      this.getVerifyPassword(value);
    },
    onDelete(e) {
      if (this.payarr.length > 0) {
        this.payarr = this.payarr.substr(0, this.payarr.length - 1);
      }
    },
    keyboardDone(val) {
      this.popupSpecs = false;
      this.getVerifyPassword(val);
    },

    //验证密码
    getVerifyPassword(pwd) {
      //order.pay.wechatPay
      var that = this;
      $http.get("payment.password.check", { password: pwd }, "").then(
        function(response) {
          if (response.result == 1) {
            that.passwordInfo.need_password = false;
            that.payPost(that.passwordInfo);
          } else {
            that.$dialog
              .confirm({ message: response.msg })
              .then(() => {
                if (response.data.code == 2001) {
                  //商城支付密码设置未开启
                  //that.$router.go(-1);
                } else if (response.data.code == 2002) {
                  //用户未设置支付密码
                  //去设置密码
                  that.$router.push(that.fun.getUrl("set_balance_password", {}));
                } else if (response.data.code == 2003) {
                  //支付密码错误
                }
              })
              .catch(() => {
                if (response.data.code == 2001) {
                  //商城支付密码设置未开启
                } else if (response.data.code == 2002) {
                  //用户未设置支付密码
                } else if (response.data.code == 2003) {
                  //支付密码错误
                }
              });
          }
        },
        function(response) {
          that.$dialog.alert({ message: response.msg });
        }
      );
    },
    rewardPayCancelBtn() {
      this.rewardPayshow = false;
    },
    showPayPassBox() {
      this.rewardPayshow = false;
      this.popupSpecs = true;
      this.payarr = "";
    },

    error(e) {
      this.$dialog.alert({ message: "音频出错了" });
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
      this.sliderTime = parseInt((this.audio.currentTime / this.audio.maxTime) * 100);
    },
    select(src) {
      if (this.songStop) {
        this.$refs.audio.play(); //继续播放
        this.songStop = false;
      } else {
        this.$refs.audio.pause();
        this.songStop = true;
      }
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
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
    },
    ended() {
      this.selectedNum = Number(this.selectedNum) + 1;

      if (this.selectedNum > Object.keys(this.goodsInfo.curriculum).length) {
        return;
      }
      this.$refs.audio.src = this.vedioSrc;
      this.play();
      console.log(this.$refs.audio.src, "ended");
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
      const { maxTime, minTime, step } = this.audio;
      let value = ((e.clientX - this.$refs.slider.offsetLeft) / this.$refs.slider.offsetWidth) * (maxTime - minTime);
      value = Math.round(value / step) * step + minTime;
      value = parseFloat(value.toFixed(5));

      if (value > maxTime) {
        value = maxTime;
      } else if (value < minTime) {
        value = minTime;
      }
      this.$refs.audio.currentTime = value;
    },
    secret(string, code, operation) {
      code = CryptoJS.MD5(code).toString();
      var iv = CryptoJS.enc.Utf8.parse(code.substring(0, 16));
      var key = CryptoJS.enc.Utf8.parse(code.substring(16));
      if (operation) {
        return CryptoJS.AES.decrypt(string, key, { iv: iv, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
      }
      return CryptoJS.AES.encrypt(string, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();
    },
    addzhibo() {
      $http
        .get("plugin.video-demand.api.video-course-goods.get-live-info", { goods_id: this.$route.params.id })
        .then(response => {
          if (response.result === 1) {
            this.info = JSON.parse(this.secret(response.data, "zoQUA@257ggflNmMppKzcU7QgYyp!tU&h54VNN3u!PAU$8FxBW", true));
            this.livezhibo();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    livezhibo() {
      if (!this.is_zhibo) {
        var liveSdk = new PolyvLiveSdk({
          channelId: this.info.channelId,
          sign: this.info.sign, // 频道验证签名
          timestamp: this.info.timestamp, // 毫秒级时间戳
          appId: this.info.appId,
          user: {
            userId: this.info.userId,
            userName: this.teacherName,
            pic: this.goodsImg
          }
        });
        liveSdk.on(PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
          if (data.watchStatus == "live") {
            this.is_zhibo = true;
            this.is_show = false;
            this.is_vshow = false;
            setTimeout(() => {
              liveSdk.setupPlayer({
                el: "#player",
                type: "auto"
              });
            }, 1000);
          } else {
            Toast("直播结束");
          }
        });
      }
    },
    // 问卷调查
    goSurvey() {
      let json = {
        goods_id: this.$route.params.id,
        tag: "video"
      };
      this.$router.push(this.fun.getUrl("questions", json));
    },
    onClose() {
      this.questionnaire_is_open = false;
    },
    //获取详情
    getDetailInfo() {
      $http
        .get("plugin.video-demand.api.video-course-goods.get-course-goods-detail", { goods_id: this.$route.params.id })
        .then(response => {
          if (response.result === 1) {
            this.tabActive = "first";
            this.live = response.data.live;
            this.live_title = response.data.live_title;
            this.service_QRcode = response.data.shopSet.service_QRcode;
            this.service_mobile = response.data.shopSet.service_mobile;
            this.cservice = response.data.shopSet.cservice;
            this.showGood = true;
            this.plugin_point_name = response.data.plugin_point_name ? response.data.plugin_point_name : "积分";
            this.HasBuyPermissions = response.data.buyPermissions || false;
            // if (
            //   this.fun.isTextEmpty(response.data.has_many_dig_chapter) ||
            //   response.data.has_many_dig_chapter.length == 0
            // ) {

            //   this.$router.go(-1);
            // }
            let sec = response.data.questionnaire_time * 1000;
            try {
              this.shopName = this.$store.state.temp.mailInfo.name;
            } catch (error) {
              console.log(error);
            }
            if (response.data.questionnaire_is_open) {
              this.is_questionnaire_time = setTimeout(() => {
                this.questionnaire_is_open = response.data.questionnaire_is_open;
              }, sec);
            }
            if (response.data.has_one_goods.status == 0) {
              this.$dialog.alert({ message: "课程已下架！" }).then(() => {
                this.$router.go(-1);
              });
            } else {
              this.chapterdigList = response.data.has_many_dig_chapter;
            }

            this.rewardBtnShow = response.data.is_reward == 0 ? false : true;

            this.goodTit = response.data.has_one_goods.title;
            if (this.point_goods) {
              this.goodPrice = this.point_goods.point;
            } else {
              this.goodPrice = response.data.has_one_goods.price;
            }

            if (response.data.has_one_goods) {
              this.vip_level_status = response.data.has_one_goods.vip_level_status;
            } else {
              this.vip_level_status = {};
            }

            this.chapterNum = response.data.course_chapter_num;
            this.countDownTime = response.data.course_expiration_time ? this.fun.getTimeDifference(response.data.course_expiration_time) : null;

            if (response.data.has_one_lecturer) {
              let oneLecturer = response.data.has_one_lecturer;
              this.teacherImg = oneLecturer.has_one_member ? oneLecturer.has_one_member.avatar : "";
              this.teacherName = oneLecturer.real_name;
            }

            this.goodsContent = response.data.has_one_goods.content;

            this.contentShow = this.fun.isTextEmpty(response.data.has_one_goods.content) ? false : true;

            let playCourse = "";
            let playActive = 0;
            let first_playActive = 0;
            let has_many_dig_chapter = response.data.has_many_dig_chapter;
            if (this.chapter_id) {
              for (let j = 0; j < has_many_dig_chapter.length; j++) {
                if (has_many_dig_chapter[j].has_many_chapter.length > 0) {
                  for (let i = 0; i < has_many_dig_chapter[j].has_many_chapter.length; i++) {
                    if (has_many_dig_chapter[j].has_many_chapter[i].id === Number(this.chapter_id)) {
                      playCourse = has_many_dig_chapter[j].has_many_chapter[i];
                      first_playActive = j;
                      playActive = i;
                    }
                  }
                }
              }
            } else {
              first_playActive = 0;
              playActive = 0;
              playCourse = has_many_dig_chapter[0].has_many_chapter[0];
            }

            this.chapter_id = playCourse.id;
            this.activeNames = first_playActive;
            this.isLook = playCourse.is_audition == 0 ? false : true;
            // this.isLook =
            //   response.data.has_many_course_chapter[0].is_audition == 0
            //     ? false
            //     : true;
            //this.chapterId=response.data.has_many_course_chapter[0].id;

            //会员升级课程id
            this.courseId = response.data.id;

            if (!this.fun.isTextEmpty(response.data.pushGoods)) {
              this.pushShow = true;
              this.pushGoodList = response.data.pushGoods;
            }

            //分享数据
            this.courseShare = response.data.has_one_goods.has_one_share;

            this.goodsImg = response.data.has_one_goods.thumb;

            this.fun.wxShare(
              "",
              {},
              {
                title: this.fun.isTextEmpty(this.courseShare.share_title) ? this.goodTit : this.courseShare.share_title,
                imgUrl: this.fun.isTextEmpty(this.courseShare.share_thumb) ? this.goodsImg : this.courseShare.share_thumb,
                description: this.fun.isTextEmpty(this.courseShare.share_desc) ? "" : this.courseShare.share_desc,
                link: this.fun.isTextEmpty(this.chapter_id) ? "" : document.location.href + "&share_tag=2&chapter_id=" + this.chapter_id
              },
              data => {}
            );

            switch (response.data.watch) {
              case 0:
                //
                this.is_update = false;
                this.is_study = false;
                this.is_buy = false;
                this.videoInit(playActive, playCourse, first_playActive);

                // this.is_update = true;
                // this.is_buy = true;
                // this.is_study = true;
                break;
              case 1:
                //判断是否免费章节
                // if (response.data.has_many_course_chapter[0].is_audition == 1) {
                if (playCourse.is_audition == 1) {
                  this.is_study = true;
                  this.is_update = false;
                  this.is_buy = false;
                  this.is_show = false;
                  this.is_vshow = true;
                  // this.videoInit(
                  //   0,
                  //   response.data.has_many_course_chapter[0].video_address
                  // );
                  this.videoInit(playActive, playCourse, first_playActive);
                  break;
                } else if (playCourse.is_audition == 0) {
                  this.$dialog.alert({ message: "请升级会员或者购买课程" });
                  this.is_update = true;
                  this.is_buy = true;
                  this.is_study = true;
                  break;
                } else {
                  break;
                }
              // this.is_study = true;
              // this.is_update = false;
              // this.is_buy = false;
              // this.is_show =false;
              // this.is_vshow=true;
              // this.videoInit(0, response.data.has_many_course_chapter[0].video_address);
              // break;
              case 2:
                //
                this.is_update = false;
                this.is_study = false;
                this.is_buy = false;
                this.videoInit(playActive, playCourse, first_playActive);
                break;
              case 3:
              case 4:
                //
                this.is_buy = false;
                this.is_update = false;
                this.is_study = false;
                this.videoInit(playActive, playCourse, first_playActive);
                break;
              default:
                break;
            }

            this.styleSetOptions = response.data.styleSet;
            this.$store.commit("setOrderErrReturnUrl", response.data.not_permit_link);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //根据观看权限
    viewPermission(id, index, course_id, audition, first_index) {
      clearTimeout(this.is_try_time);
      this.is_try_time = null;
      this.is_zhibo = false;
      var box = document.getElementsByClassName("pv-ppt-layout pv-ppt-normal");
      if (box.length > 0) {
        box[0].remove();
      }
      this.is_show = true;
      this.is_vshow = false;
      this.chapter_id = id;
      if (window.yz_share_data) {
        this.share(window.yz_share_data);
      }

      let param = {
        goods_id: this.$route.params.id,
        chapter_id: id
      };
      $http
        .get("plugin.video-demand.api.video-course-goods.get-video-address", param)
        .then(response => {
          if (response.result == 1) {
            this.video_image = response.data.video_cover_address;
            //判断观看类型
            this.viewType(
              response.data.watch,
              index,
              response.data.video_address,
              course_id,
              id,
              audition,
              response.data.video_cover_address,
              first_index,
              response.data.is_try,
              response.data.try_time
            );
          } else {
            console.log(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //观看视频
    videoPlay(index, src, course_id, id, video_image, first_index) {
      this.is_show = false;
      this.is_vshow = true;

      this.vedioSrc = "";
      this.video_image = video_image;
      this.active = index;
      this.first_active = first_index;
      this.vedioSrc = src;

      this.songStop = true;
      this.sliderTime = 0;
      this.audio = {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      };

      //初始化vedio监听事件
      this.removeListenVideo();
      //判断当前路径
      this.isMp4(this.vedioSrc);
      //监听video
      this.listenVideo();
      $http
        .get("plugin.video-demand.api.video-demand-member.set-watch-history", {
          course_id: course_id,
          chapter_id: id
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },

    videoInit(index, item, first_index) {
      this.is_show = false;
      this.is_vshow = true;

      this.vedioSrc = "";
      this.active = index;
      this.first_active = first_index;
      this.viewPermission(item.id, index, item.course_id, item.is_audition, first_index);
      // this.vedioSrc = src;

      // this.isMp4(this.vedioSrc);

      // this.listenVideo();
    },

    viewType(type, index, address, course_id, id, audition, video_image, first_index, is_try, try_time) {
      if (is_try == 1 && type == 1 && audition == 1) {
        this.is_study = true;
        this.is_update = false;
        this.is_buy = false;
        this.isLook = true;
        this.videoPlay(index, address, course_id, id, video_image, first_index);
        return;
      } else if (type != 2 && type != 3 && type != 4 && is_try == 1 && try_time > 0) {
        this.is_study = true;
        this.is_update = false;
        this.is_buy = false;
        this.isLook = true;
        this.videoPlay(index, address, course_id, id, video_image, first_index);
        this.is_try_time = setTimeout(() => {
          this.is_zhibo = false;
          this.is_show = true;
          this.is_vshow = false;
          this.vedioSrc = "";
          this.isNoPlay();
        }, try_time * 1000);
        return;
      }
      switch (type) {
        case 0:
          this.isNoPlay();
          break;
        case 1:
          if (audition == 1) {
            this.is_study = true;
            this.is_update = false;
            this.is_buy = false;
            this.isLook = true;
            this.videoPlay(index, address, course_id, id, video_image, first_index);
            break;
          } else if (audition == 0) {
            this.isNoPlay();
            break;
          } else {
            break;
          }
        // this.is_study = true;
        // this.is_update = false;
        // this.is_buy = false;
        // this.isLook = true;
        // this.videoPlay(index, address,course_id,id);
        // break;
        case 2:
          this.is_update = false;
          this.is_study = false;
          this.is_buy = false;
          this.isLook = true;
          this.videoPlay(index, address, course_id, id, video_image, first_index);
          break;
        case 3:
        case 4:
          this.is_buy = false;
          this.is_study = false;
          this.is_update = false;
          this.isLook = true;
          this.videoPlay(index, address, course_id, id, video_image, first_index);
          break;
        default:
          break;
      }
    },

    isNoPlay() {
      this.is_update = true;
      this.is_buy = true;
      this.is_study = false;
      this.isLook = false;
      if (Number(this.styleSetOptions.buy_now_button)) this.openBuyDialog();
    },
    openBuyDialog() {
      this.$dialog.alert({ message: "请升级会员或者购买课程" });
    },

    //立即学习
    study() {
      this.is_show = false;
      this.is_vshow = true;
    },

    //升级会员
    update() {
      if (JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay == "1" && this.fun.isIphone()) {
        this.$dialog.alert({
          message: "十分抱歉，由于相关规定，你暂时无法在这里充值！"
        });
        return false;
      }
      this.$router.push(this.fun.getUrl("CourseMemberUpdate", { id: this.courseId, goods: this.$route.params.id }));
    },

    //立即购买
    buy() {
      if (this.HasBuyPermissions) {
        this.$dialog.alert({
          message: this.HasBuyPermissions
        });
        return;
      }
      if (JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay == "1" && this.fun.isIphone()) {
        this.$dialog.alert({
          message: "十分抱歉，由于相关规定，你暂时无法在这里充值！"
        });
        return false;
      }
      //价格权限
      if (this.vip_level_status && this.vip_level_status.status == 1) {
        Toast(this.vip_level_status.tips);
        return false;
      }
      submitActionTag = "-2"; //立即购买
      let _optionsId = "";
      let _total = 1;
      let _goodsId = this.$route.params.id;
      this.$router.push(
        this.fun.getUrl(
          "goodsorder",
          {},
          {
            tag: submitActionTag,
            goodsId: _goodsId,
            optionsId: _optionsId,
            total: _total
          }
        )
      );
      //this.$router.push(this.fun.getUrl('goods',{id: this.$route.params.id}));
    },

    //跳转至我的课程
    toMyCourse() {
      this.$router.push(this.fun.getUrl("CourseMy"));
    },

    //打赏 显示
    showPopReward() {
      this.rewardShow = true;
    },

    //打赏 隐藏
    hidePopReward() {
      this.rewardShow = false;
    },
    clearSrcoll() {
      var currentPosition, timer;
      var speed = 1; //页面滚动距离
      timer = setInterval(function() {
        currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0, currentPosition); //页面向上滚动
        currentPosition += speed; //speed变量
        window.scrollTo(0, currentPosition); //页面向下滚动
        clearInterval(timer);
      }, 1);
      console.log("currentPosition");
    },
    //确定打赏
    confirmReward() {
      this.hidePopReward();
      if (this.fun.isTextEmpty(this.rewardMoney)) {
        Toast("请输入或选择打赏金额");
        return;
      }

      if (this.rewardMoney <= 0) {
        Toast("打赏金额必须大于0");
        return;
      }
      this.getPayData();
      console.log(this.rewardMoney);
    },

    //获取支付类型参数
    getPayData() {
      this.actionSheetItems = [];
      $http
        .get("plugin.video-demand.api.lecturer-reward.pay-type", {})
        .then(response => {
          if (response.result == 1) {
            this.btnData = response.data.buttons;
            this.rewardPayshow = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //支付
    payPost(data) {
      if (data.need_password) {
        this.passwordInfo = data;
        this.showPayPassBox();
        return;
      }

      let json = {
        pay_method: data.value,
        amount: this.rewardMoney,
        pay_name: data.name,
        goods_id: this.$route.params.id
      };
      $http
        .get("plugin.video-demand.api.lecturer-reward.run-reward-pay", json, "支付中...")
        .then(response => {
          if (response.result == 1) {
            this.handleOtherPay(data, response);
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          this.$dialog.alert({ message: error });
        });
    },

    //分享
    share(data) {
      let that = this;
      // wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.courseShare.share_title) ? that.goodTit : that.courseShare.share_title;
        //let _link = document.location.href + "&mid=" + data.info.uid + "&share_tag=2";
        //let _link = location.protocol+'//'+location.host+location.pathname +'?i='+ that.fun.getKeyByI() +"&type=" +that.fun.getTyep()+ "&mid=" + data.info.uid + "&share_tag=2";
        let _link = "";
        if (that.fun.isTextEmpty(that.chapter_id)) {
          _link = document.location.href + "&share_tag=2";
        } else {
          _link = document.location.href + "&share_tag=2&chapter_id=" + that.chapter_id;
        }

        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.courseShare.share_thumb) ? that.goodsImg : that.courseShare.share_thumb;
        let _desc = that.fun.isTextEmpty(that.courseShare.share_desc) ? (data.shop.shop.name ? data.shop.shop.name : "") : that.courseShare.share_desc;
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

    init() {
      if (this.is_try_time) {
        clearTimeout(this.is_try_time);
        this.is_try_time = null;
      }
      this.is_questionnaire_time = null;
      this.service_mobile = "";
      this.service_QRcode = "";
      this.show1 = false;
      this.cservice = "";
      this.is_study = false;
      this.is_update = false;
      this.is_buy = false;
      this.is_show = true;
      this.is_vshow = false;
      this.vedioSrc = "";
      this.rewardShow = false;
      this.rewardMoney = "";
      this.payData = [];
      this.actionSheetShow = false;
      this.courseId = "";
      this.chapter_id = "";
      this.showGood = false;
      this.is_zhibo = false;
      this.live = false;
      this.live_title = "";
      this.info = {};
      this.isVideoOn = true;

      this.payarr = "";
      this.popupSpecs = false;
    },

    //推荐商品跳转
    pushGoodGoto(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val.id }));
    },

    //选择打赏金额
    chooseMoney(type, index) {
      this.moneyActiveClass = index;
      this.rewardMoney = "";
      switch (type) {
        case 1:
          this.rewardMoney = 5;
          break;
        case 2:
          this.rewardMoney = 10;
          break;
        case 3:
          this.rewardMoney = 20;
          break;
        case 4:
          this.rewardMoneyBtn = false;
          this.showPopReward();
          break;
        default:
          break;
      }
    },

    moneyShow() {
      this.moneyActiveClass = 9999;
      this.rewardMoneyBtn = true;
      this.rewardMoney = 0;
    },

    //判断是否MP4
    isMp4(src) {
      if (src.endsWith(".mp4")) {
        this.isVoice = false;
        this.isVideo = true;
      } else {
        this.isVideo = false;
        this.isMp3(src);
      }
    },

    //判断是否MP3
    isMp3(src) {
      if (src.endsWith(".mp3") && this.fun.getPhoneEnv() != 3) {
        this.isVoice = true;
      } else {
        this.isVoice = false;
      }
    },

    //监听video
    listenVideo() {
      if (this.isVideo) {
        this.$nextTick(() => {
          //let video=document.querySelector('video');
          this.$refs.video.addEventListener(
            "play",
            () => {
              this.isVideoOn = false;
            },
            false
          );

          this.$refs.video.addEventListener(
            "pause",
            () => {
              this.isVideoOn = true;
            },
            false
          );

          this.$refs.video.addEventListener(
            "end",
            () => {
              this.isVideoOn = true;
            },
            false
          );

          // 注释loadeddata原因，ios在真机上是先触发play，再触发loadeddata，导致isVideoOn显示错误
          // 而isVideoOn的初始值是为true
          // this.$refs.video.addEventListener(
          //   "loadeddata",
          //   () => {
          //     this.isVideoOn = true;
          //   },
          //   false
          // );
        });
      }
    },

    //取消监听video
    removeListenVideo() {
      if (this.isVideo && this.$refs.video) {
        // this.$nextTick(()=>{
        this.$refs.video.removeEventListener("play", this.listenVideo, false);

        this.$refs.video.removeEventListener("pause", this.listenVideo, false);

        this.$refs.video.removeEventListener("end", this.listenVideo, false);

        // this.$refs.video.removeEventListener("loadeddata", this.listenVideo, false);
        // })
      }
    },

    videoClick() {
      let video = this.$refs.video;
      if (video.paused) {
        this.isVideoOn = false;
        video.play();
      } else {
        this.isVideoOn = true;
        video.pause();
      }
    },

    countDownFinish() {
      this.iscCountDownFinish = true;
    }
  },
  activated() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (!document.getElementById("PolyvLiveSdk")) {
      //避免多次引入
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://player.polyv.net/livesdk/polyv-live.min.js";
      script.id = "PolyvLiveSdk";
      document.body.appendChild(script);
      script.onload = script.onreadystatechange = function() {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
          console.log("js onload");
        }
        script.onload = script.onreadystatechange = null; //删除事件处理函数。
      };
    }
    this.init();
    this.chapter_id = this.fun.getKey("chapter_id");
    this.getDetailInfo();
  },

  deactivated() {
    clearTimeout(this.is_try_time);
    this.is_try_time = null;
    clearTimeout(this.is_questionnaire_time);
    this.is_questionnaire_time = null;
    this.removeListenVideo();
  },

  components: { cTitle, payKeyboard, yzGoodsposter, U_backup }
};
