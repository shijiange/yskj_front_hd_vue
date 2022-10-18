import { Toast } from "vant";
import commentGroup from "components/ui_components/yz_comment_popup/commentGroup";
import commentCell from "components/ui_components/yz_comment_popup/commentCell";
import commentCellItem from "components/ui_components/yz_comment_popup/commentCellItem";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";

let videoFirst = 0; //第一次初始化
var myVideo = null;
var isReset = true; //处理中途观看视频，操作跳转其他页面，返回重新从头观看
var resetRouter = ["goods", "BusinessCard", "livePage", "advertisingApply", "advertisingPutAD",'myVideo']; //进入页面不需要重新请求刷新渲染的router-name

export default {
  data() {
    let that = this;
    return {
      isShowADLook: true, //广告列表按钮
      isShowADPut: true, //广告投放按钮
      activeType: 0,
      realIndex: "",
      swiperOption: {
        direction: "vertical",
        observer: true,
        width: window.innerWidth,
        height: window.innerHeight,
        watchOverflow: true,
        autoHeight: true,
        autoplay: false,
        pagination: false,
        on: {
          reachEnd() {
            if (videoFirst === 1) {
              that.getMoreData();
            }
            // 手指触碰拖动最后一张时执行
          },
          slideChangeTransitionEnd() {
            // that.$refs.video.pause();
            that.changeVideoEvent(this.realIndex);
            //切换结束时
          }
        }
      },
      popularVideo: [],
      showVideo: {},
      show: false,
      like: false,
      likeNum: 0,
      isPlay: false,
      amount_id: "",
      url: "",
      status: "",
      showWechatshar: false,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      minStyle: true,
      wxJsSdkConfig: {},
      card_id: "",
      loading: true,
      videoTime: null,
      is_plugins: false,
      //答题
      AnswerID: 0,
      showVideoAnswer: false,
      successShow: false,
      errorShow: false,
      subject: null,
      integral: 0,
      integral_name: "积分",
      //短视频红包
      reward_type: 0, //奖励类型（ 1观看累计时长 2看完视频发放奖励）
      logID: 0, //视频已观看记录的视频id
      maxTime: 0, //视频总时长
      activity_reward_id: 0,
      redpack_info: {}, //红包设置展示信息
      is_openRedpack: false,
      openRedpackData: [], //短视频红包活动数组
      openRedpackTimes: [], //观看时长集合数组
      showVerification: false, //绑定手机
      showRedpack: false, //红包
      openRedpack: false,
      currentDuration: 0, //当前视频播放时长（重播时复位为0）
      cumulativeDuration: 0, //累计时长
      //绑定手机
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
      // 播放视频时请求记录接口
      old_amount_id: "", //避免播放多次同一视频时重复请求

      BasicSet: {}, //获取视频分享基础设置
      dataList: [],

      pcVideoStyleObject: {
        height: "auto",
        width: 375 + "px",
        margin: "0 auto",
        top: "50%",
        transform: "translateY(-50%)"
      },
      phoneVideoStyleObject: {
        height: window.innerHeight + "px",
        width: window.innerWidth + "px"
      },
      comment_open: "1",
      commentlist: [],
      showYzComment: false,
      commentLoading: false,
      commentFinished: false,
      commentTotal: 0, //评论总数
      commentPage: 1, //评论当前页数
      swiperConStyle: {
        // swiper中悬浮内容样式
        height: window.innerHeight + "px",
        position: "relative"
      },

      points_plugin: 0,
      videoShare: {
        needAnswer: false,
        is_show: false,
        show: false,
        points: 0,
        point_name: ""
      },
      // 分享的索引
      shareInd: 0,
      is_member_enter: true
    };
  },
  beforeRouteEnter(to, from, next) {
    if (resetRouter.includes(from.name)) {
      isReset = false;
      next(vm => {
        if (vm.dataList.length == 0) {
          vm.getBasicSet();
        } else {
          vm.$refs.video && vm.$refs.video.play(); //从指定页面进入。继续播放
        }
      });
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    
    $http
    .get("plugin.video-share.frontend.video.getVideoInfoForEnterVideoPageMaidian", {
      vid: from.query.vid
    })
    .then(response => {
      if (response.result === 1) {
        zhuge.endTrack('视频播放页停留时长',{
          '视频标题':response.data.title,
          '视频id':response.data.id,
          // '视频分类':videoType,
          '发布人':response.data.nickname,
          '发布人id':response.data.uid,
          '标签名称':response.data.category_name
        });
      }
    })

    if (!resetRouter.includes(to.name)) {
      this.show = false;
      this.showVideo = {};
      this.dataList = [];
    } else {
      this.$refs.video && this.$refs.video.pause();
    }

    next();
  },
  created() {
    // this.getBasicSet();
    // this.fun.setWXTitle("发现视频");
  },
  activated() {

    $http
    .get("plugin.video-share.frontend.video.getVideoInfoForEnterVideoPageMaidian", {
      vid: this.$route.query.vid
    })
    .then(response => {
      if (response.result === 1) {
 
        let videoType = '';
        if (this.dataList[this.activeType].code == "follow") {              
          videoType = '关注'; //关注             
        } else if (this.dataList[this.activeType].code == "recommend") {                
          videoType = '推荐'; //推荐              
        } else if (this.dataList[this.activeType].code == "default") {              
          videoType = '最新'; //最新 
        }        

        zhuge.track('进入视频播放页',{
          '视频标题':response.data.title,
          '视频id':response.data.id,
          '视频分类':videoType,          
          '发布人':response.data.nickname,
          '发布人id':response.data.uid,
          '标签名称':response.data.category_name
        });
        
        zhuge.startTrack('视频播放页停留时长',{
          '视频标题':response.data.title,
          '视频id':response.data.id,
          // '视频分类':videoType,
          '发布人':response.data.nickname,
          '发布人id':response.data.uid,
          '标签名称':response.data.category_name
        });

      }
    })

    isReset && this.getBasicSet(); //防止中途观看视频，操作跳转其他页面（广告、商品详情。名片），返回重新从头观看
    isReset = true;
  },
  // deactivated() {},
  mounted() {
    videoFirst = 1;
    window.onresize = () => {
      let innerHeight = window.innerHeight;
      this.swiperConStyle = { height: innerHeight + "px", position: "relative" };
    };
  },
  computed: {
    answerfilter: function() {
      return this.subject.has_many_answer.filter(function(item) {
        return item.content != "";
      });
    },
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    calNum() {
      return value => {
        var num = parseFloat(value);
        if (num < 10000) {
          return num;
        } else {
          num = (num / 10000).toFixed(1);
          return num + "万";
        }
      };
    }
  },
  methods: {
    addevntDuration(e) {
      console.log(e);
      console.log(e.duration);
    },
    onChangeVideoTab() {
      this.show = false;
      this.getData(false, false);
    },
    changeVideoEvent(index) {
      //处理切换视频操作
      let that = this;
      that.show = false;
      that.shareInd = index;
      this.realIndex = index;
      that.showVideo = that.dataList[that.activeType].list[index];
      if (index === 0) {
        that.dataList[that.activeType].list[index].show = false;
        that.dataList[that.activeType].list[index + 1].show = false;
      } else {
        that.dataList[that.activeType].list[index - 1].show = false;
        that.dataList[that.activeType].list[index].show = false;
        if (that.dataList[that.activeType].list[index + 1]) {
          that.dataList[that.activeType].list[index + 1].show = false;
        }
      }
      // that.fun.setWXTitle(that.showVideo.title);
      window.localStorage.setItem("vid", that.showVideo.id);
      that.cumulativeDuration = parseInt(that.cumulativeDuration + that.currentDuration); //切换视频时计算累计
      that.currentDuration = 0;
      that.AnswerID = 0;
      that.logID = 0;
      that.dataList[that.activeType].activeVideoIndex = index;
      that.commentlist = [];
      setTimeout(() => {
        that.$nextTick(() => {
          that.clickSwiper(index);
        });
      }, 300);
    },
    getBasicSet() {
      this.fun.setWXTitle("小视频");
      $http
        .get("plugin.video-share.frontend.video.getBasicSet", {
          vid: this.$route.query.vid
        })
        .then(response => {
          if (response.result === 1) {
            this.BasicSet = response.data.set;
            this.dataList = [];
            this.is_member_enter = response.data.set.is_member_enter == 1 ? true : false;
            console.log(response.data.set);
            if (this.BasicSet.is_show_own_follow && this.BasicSet.is_show_own_follow == "1") {
              // 是否显示我的关注 1-开启
              this.dataList.push({
                isLoadMore: true,
                page: 1,
                total_page: 0,
                list: [],
                code: "follow",
                activeVideoIndex: 0,
                title: "关注"
              });
            }
            if (this.BasicSet.is_show_recommend && this.BasicSet.is_show_recommend == "1") {
              // 是否显示推荐 1-开启
              this.dataList.push({
                isLoadMore: true,
                page: 1,
                total_page: 0,
                list: [],
                code: "recommend",
                activeVideoIndex: 0,
                title: "推荐"
              });
            }
            // 最新，默认开启，当其他两个都不显示时，隐藏顶部标签页
            this.dataList.push({
              isLoadMore: true,
              page: 1,
              total_page: 0,
              list: [],
              code: "default",
              activeVideoIndex: 0,
              title: "最新"
            });
            this.activeType = this.dataList.length - 1;
            this.initData();
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    initData() {
      this.show = false;
      this.showVideo = {};
      this.popularVideo = [];
      this.loading = true;
      this.cumulativeDuration = 0; //计算累计
      this.currentDuration = 0;
      this.showYzComment = false;

      this.amount_id = this.$route.query.vid || null;
      if (this.$route.query.from && this.$route.query.from == "card") {
        this.card_id = this.$route.query.card_id;
      } else if (this.$route.query.from && this.$route.query.from == "me") {
        this.status = this.$route.query.activeName;
      }
      window.localStorage.setItem("vid", this.amount_id);
      this.dataList[this.activeType].page = this.$route.query.page || 1;
      // 判断是否有page和vid   没有vid就是会员中心进入的样式二   有page的肯定是从列表进入
      if (this.$route.query.category) {
        // category == true是列表有分类 任务编号 72060
        this.getDetail();
      } else if (this.$route.query.page || !this.amount_id) {
        this.getData(false, true);
      } else {
        // 有vid就是分享视频详情 任务编号: 42332
        this.getDetail();
      }
      window.scrollTo(0, 0);
    },
    shareVideo(ind) {
      this.shareInd = ind;
      if (this.fun.getTyep() == 7) {
        let uid = window.localStorage.getItem("uid");
        let _url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/videoDetail?i=" + this.fun.getKeyByI() + "&vid=" + this.amount_id;
        let _links = this.fun.isMid(_url, uid);
        let json = {
          title: this.fun.isTextEmpty(this.showVideo.title) ? "视频分享" : this.showVideo.title, // 分享标题
          desc: `我发现了一个不错的视频，快来看看吧~`, // 分享描述
          link: _links, // 分享链接
          imgUrl: this.showVideo.cover // 分享图标
        };
        YDB.Share(json.title, json.desc, json.imgUrl, json.link, "Sharesback");
        return;
      } else {
        this.showWechatshar = true;
      }
    },
    close() {
      this.showWechatshar = false;
    },
    toGood(item) {
      this.$router.push(this.fun.getUrl("goods", { id: item.goods_id }, { vid: item.id }));
    },
    toggleLike(item) {
      $http
        .post("plugin.video-share.frontend.video.like", {
          video_goods_id: item.id
        })
        .then(response => {
          if (response.result === 1) {
            console.log(response.msg);
            // item.member_like == 1已经收藏 / 取消收藏
            if (item.member_like == 0) {
              item.like_num--;
              item.member_like = 1;
            } else {
              item.like_num++;
              item.member_like = 0;

              zhuge.track('视频播放页点击点赞',{
                '视频标题':this.showVideo.title,//'生食更健康吗',
                '视频id':this.showVideo.id,//'12345',
                '视频分类':'',
                '发布人':this.showVideo.member.nickname,//'嘿嘿嘿嘿',
                '发布人id':this.showVideo.member.uid,//'hd001',
                '标签名称':this.showVideo.category_name,//'营养知识、才艺展示',
                '点赞类型':'视频点赞'
              });

            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    chooseUser(item) {
      if (!this.fun.isTextEmpty(this.BasicSet.topLike)) {
        window.location.href = this.BasicSet.topLike;
      } else if (item.member.business_card != 0) {
        this.$router.push(this.fun.getUrl("BusinessCard", {}, { mark_id: item.member.business_card, mark: "card" }));
      }
    },
    // 当加载视频流元数据完成后，会触发该事件的回调函数
    // 视频元数据主要是视频的长度之类的数据
    onLoadedmetadata(res) {
      //单位：秒
      // this.maxTime = parseInt(res.target.duration);
      this.maxTime = parseInt(res);
      console.log("视频总时长", res, this.maxTime);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      // this.currentDuration = res.target.currentTime;
      this.currentDuration = res;
      let minute = parseInt((this.cumulativeDuration + this.currentDuration) / 60);
      // console.log("当前播放时间", this.currentDuration, parseInt(this.cumulativeDuration + this.currentDuration), "累计分钟", minute);
      if (this.openRedpackTimes.indexOf(minute) > -1) {
        //达到累计获奖时长
        this.openRedpackTimes.splice(0, 1);
        console.log("删除一个累计时长条件", this.openRedpackTimes);
        // this.getRedpackReward(1,1)
        this.includeRedpackID("time", minute);
      }
    },
    endedPlay() {
      console.log("播放结束");
      this.AnswerID = 0;
      this.logID = 0;
      this.cumulativeDuration = parseInt(this.cumulativeDuration + this.currentDuration); //结束视频时计算累计
      this.currentDuration = 0;
      this.getSubject();
    },
    clickSwiper(index) {
      if (this.dataList[this.activeType].list[index].show && this.amount_id === this.dataList[this.activeType].list[index].id) {
        // this.show = false;
        this.dataList[this.activeType].list[index].show = false;
        this.$refs.video.pause();
        return;
      }

      this.amount_id = this.dataList[this.activeType].list[index].id;
      this.$set(this.dataList[this.activeType].list[index], "show", true);
      this.$refs.video.play();
      // this.addVideoPlayEnd();
      let that = this;
      this.$nextTick(() => {
        myVideo = document.getElementById("myVideo");
        myVideo.addEventListener("playing", function(e) {
          // 播放的时候才显示视频
          that.$refs.pic[index].offsetHeight > Math.ceil(window.innerHeight * (7 / 8)) ? (that.minStyle = false) : (that.minStyle = true);
          that.show = true;
        });
      });
      this.fun.wxShare(
        "",
        {},
        {
          title: this.fun.isTextEmpty(this.showVideo.title) ? "视频分享" : this.showVideo.title,
          link: this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/videoDetail?i=" + this.fun.getKeyByI() + "&vid=" + this.amount_id,
          imgUrl: this.showVideo.cover,
          description: `我发现了一个不错的视频，快来看看吧~`
        },
        data => {
          this.wxJsSdkConfig = data;
        },
        () => {
          $http
            .get("plugin.video-share.frontend.video.share", {
              video_goods_id: this.showVideo.id
            })
            .then(response => {

              zhuge.track('视频播放页点击分享',{
                '视频标题':this.showVideo.title,//'生食更健康吗',
                '视频id':this.showVideo.id,//'生食更健康吗',
                '发布人':this.showVideo.member.nickname,//'生食更健康吗',
                '发布人id':this.showVideo.member.uid,//'生食更健康吗',
                '标签名称':this.showVideo.category_name//'生食更健康吗'
              });

              console.log(this.dataList[this.activeType].list[0]);
              this.$set(this.dataList[this.activeType].list[this.shareInd], "share_num", response.data);
              console.log(response, "分享成功回调");
            });
        }
      );
      // if(this.wxJsSdkConfig && this.wxJsSdkConfig.config) {
      //   this.share(this.wxJsSdkConfig);
      // }
      // console.log(this.$refs.pic[index].offsetHeight);
    },
    addVideoPlayEnd() {
      if (this.videoTime) clearInterval(this.videoTime);
      console.log(this.amount_id);
      this.videoTime = setInterval(() => {
        let flag = this.$refs.video.ended;
        if (flag) {
          console.log("播放结束");
          this.cumulativeDuration = parseInt(this.cumulativeDuration + this.currentDuration); //结束视频时计算累计
          this.currentDuration = 0;
          this.getSubject();
          clearInterval(this.videoTime);
        }
        console.log(this.$refs.video.ended);
      }, 1000);
    },
    onPlaying() {
      if (this.is_openRedpack && !this.showRedpack) {
        console.log("触发了 onPlaying 1==========================");
        this.getViewTimelog();
      } else {
        console.log("触发了 onPlaying 2==========================");
      }
    },
    getViewTimelog() {
      if (!this.is_openRedpack) {
        return;
      }
      // console.log("////-----------------////////", this.logID, this.amount_id)
      if (this.logID == this.amount_id) {
        return;
      }
      this.logID = this.amount_id;
      console.log("触发了getViewTimelog==========================", this.amount_id, this.maxTime);
      $http
        .get("plugin.video-redpack.frontend.activity.logViewTime", { video_id: this.amount_id, video_length: this.maxTime })
        .then(response => {})
        .catch(err => {
          console.error(err);
        });
    },
    getSubject() {
      if (!this.is_plugins) {
        this.getVideoShareWatch();
        return;
      }
      if (this.AnswerID == this.amount_id) {
        //防止重复一直请求答题
        this.includeRedpackID("vid");
        return;
      }
      this.AnswerID = this.amount_id;
      $http.get("plugin.answer-reward.api.index.get-subject", { vid: this.amount_id }).then(response => {
        if (response.result != 1) {
          this.includeRedpackID("vid", 0, "fail", response.msg);
          return;
        }
        if (response.data.status != 1) {
          Toast(response.msg);
          this.$refs.video.play();
        } else {
          if (response.data.subject != null) {
            this.$refs.video.pause(); //答题播放暂停
            // this.$router.push(this.fun.getUrl("videoAnswer", {}, { vid: this.amount_id }));
            this.integral_name = response.data.integral_name || "积分";
            this.subject = response.data.subject;
            this.showVideoAnswer = true;
            this.videoShare.needAnswer = true; //需要答题，答完题才显示积分弹窗
          } else {
            this.includeRedpackID("vid");
          }
        }
        this.getVideoShareWatch();
      });
    },
    getVideoShareWatch() {
      if (!this.points_plugin) {
        this.includeRedpackID("vid");
        return;
      }
      $http.get("plugin.video-share.frontend.video.watch-video", { video_id: this.amount_id }).then(response => {
        if (response.result != 1) {
          this.includeRedpackID("vid", 0, "fail", response.msg);
          return;
        }
        if (response.data.is_show == false) {
          //  Toast(response.msg);
          this.$refs.video.play();
        } else {
          this.$refs.video.pause(); //答题播放暂停
          // this.$router.push(this.fun.getUrl("videoAnswer", {}, { vid: this.amount_id }));
          this.videoShare.points = response.data.points;
          this.videoShare.point_name = response.data.point_name;
          this.videoShare.is_show = response.data.is_show;
          this.videoShare.days = response.data.days || 0;
          //this.includeRedpackID("vid", 0, "success");
          if (!this.videoShare.needAnswer) {
            this.videoShare.show = this.videoShare.is_show;
          }
          //  this.videoShare.show = true;
        }
      });
    },
    reward(id) {
      //短视频红包开启，设置观看完指定的视频后获得，
      //如果该视频开启了短视频答题，则需要先 答对 题目才可以获得红包奖励，
      //并且和原短视频答题设置的积分奖励同时获得，弹窗 只 弹出红包领取弹窗，不在显示获得积分弹窗！！
      $http
        .get(
          "plugin.answer-reward.api.index.index",
          {
            vid: this.amount_id,
            subject_id: this.subject.id,
            answer_id: id
          },
          "load"
        )
        .then(res => {
          this.showVideoAnswer = false;
          if (res.result != 1) {
            this.errorShow = true;
          } else {
            if (res.data.status == 0) {
              this.$refs.video.play();
              Toast(res.msg);
            } else if (res.data.status == 1) {
              this.includeRedpackID("vid", 0, "success");
              this.integral = res.data.integral;
              // this.successShow = true;
            }
          }
          console.log(res);
        });
    },
    includeRedpackID(type, value, status, text) {
      if (this.is_openRedpack) {
        this.logID = 0;
        if (status === "success") {
          this.showVideoAnswer = false;
        }
        if (type == "time") {
          //累计时长，获取活动id
          for (let i = 0; i < this.openRedpackData.length; i++) {
            if (this.openRedpackData[i].view_time_data === value) {
              this.activity_reward_id = this.openRedpackData[i].activity_id;
              console.log("达到红包累计时长", this.amount_id, this.activity_reward_id);
              this.getRedpackReward(1, 1);
              return;
            }
          }
        } else if (type == "vid") {
          //判断当前视频id是否为短视频红包指定视频
          for (let i = 0; i < this.openRedpackData.length; i++) {
            if (this.openRedpackData[i].view_finish_ids.indexOf(this.amount_id) > -1 && this.openRedpackData[i].view_finish_open_state == "1") {
              this.activity_reward_id = this.openRedpackData[i].activity_id;
              console.log("短视频红包指定视频", this.amount_id, this.activity_reward_id);
              this.getRedpackReward(2, 1);
              return;
            }
          }
        }
        if (this.videoShare.needAnswer && this.points_plugin && this.videoShare.is_show) {
          this.videoShare.show = true;
          return;
        }
        if (status === "success") {
          this.showVideoAnswer = false;
          this.successShow = true;
        } else {
          this.$refs.video.play();
          this.getViewTimelog();
        }

        if (status === "fail") {
          Toast(text);
        }
      } else {
        if (this.videoShare.needAnswer && this.points_plugin && this.videoShare.is_show) {
          this.videoShare.show = true;
          return;
        }
        if (status === "success") {
          this.showVideoAnswer = false;
          this.successShow = true;
        }
        if (status === "fail") {
          Toast(text);
        }
      }
    },
    getRedpackReward(reward_type, request_type) {
      this.reward_type = reward_type;
      $http
        .get("plugin.video-redpack.frontend.activity.reward", { video_id: this.amount_id, activity_id: this.activity_reward_id, reward_type: reward_type, request_type: request_type }, "load")
        .then(response => {
          if (response.result === 1) {
            if (request_type == 1) {
              //确认是否可领
              this.$refs.video.pause(); //答题播放暂停
              this.showRedpack = true;
              this.redpack_info = response.data;
            } else {
              //领取红包
              this.redpack_info.amount = response.data.amount;
              this.openRedpack = true;
            }
          } else {
            Toast(response.msg);
            // this.$refs.video.play();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    resetConfig() {
      this.logID = 0;
      this.AnswerID = 0;
      this.$refs.video.play();
    },
    cloneRedpack() {
      this.showRedpack = false;
      this.openRedpack = false;
      if (this.reward_type == 2) {
        this.getViewTimelog();
      }
      this.resetConfig();
    },
    cloneAnswer() {
      this.errorShow = false;
      this.successShow = false;
      this.resetConfig();
      this.getViewTimelog();
    },
    openRedpackM() {
      if (this.redpack_info.bind_mobile == 1 && this.redpack_info.member_bind_mobile == 0) {
        //开启绑定，但用户未绑定手机
        this.getimgdata();
        this.showVerification = true;
        return;
      } else {
        this.getRedpackReward(this.reward_type, 2);
      }
    },
    getDetail() {
      $http
        .get("plugin.video-share.frontend.video.getVideoGoods", { video_goods_id: this.amount_id }, "load")
        .then(response => {
          if (response.result === 1) {
            this.showVideo = response.data.video_goods;
            this.getData(true, true);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getData(flag, isDefault) {
      let that = this;
      this.commentlist = [];
      if (!this.fun.isTextEmpty(this.dataList[that.activeType].list)) {
        this.isLoadMore = this.dataList[this.activeType].isLoadMore;
        this.$nextTick(() => {
          //切换时，跳转到之前的视频位置记录 activeVideoIndex
          this.changeVideoEvent(that.dataList[that.activeType].activeVideoIndex);
          this.swiper.slideTo(that.dataList[that.activeType].activeVideoIndex, 0);
        });
        return;
      }

      let json = {};
      if (this.dataList[this.activeType].code == "default") {
        //默认列表（最新）
        if (this.$route.query.from && this.$route.query.from == "card") {
          this.url = "plugin.business-card.frontend.controllers.card.paging.videos";
          json.card_id = this.card_id;
        } else if (this.$route.query.from && this.$route.query.from == "me") {
          this.url = "plugin.video-share.frontend.video.my-video";
          json.v_uid = this.$route.query.uid || '',
          json.status = this.status;
        } else {
          this.url = "plugin.video-share.frontend.video.getList";
        }
      } else {
        this.url = "plugin.video-share.frontend.video.getList";
        if (this.dataList[this.activeType].code == "follow") {
          //关注
          json = {
            search: {
              is_follow: 1
            }
          };
        } else if (this.dataList[this.activeType].code == "recommend") {
          //推荐
          json = {
            search: {
              is_recommend: 1
            }
            // "search['is_recommend']": 1
          };
        }
      }
      json.page = this.dataList[this.activeType].page;

      $http
        .post(this.url, json, "load")
        .then(response => {
          this.swiperOption.height = window.innerHeight;
          this.loading = false;
          if (response.result === 1) {
            try {
              if (response.data.is_plugins) {
                this.is_plugins = response.data.is_plugins;
              }
              if (response.data.points_plugin) {
                this.points_plugin = response.data.points_plugin;
              }
              if (response.data.hasOwnProperty("comment_open")) this.comment_open = response.data.comment_open;
            } catch (error) {
              console.log(error);
            }
            this.$set(this.dataList[this.activeType], "isLoadMore", true);

            if (isDefault) {
              //默认。非关注和推荐
              if (this.$route.query.from && this.$route.query.from == "card") {
                this.$set(this.dataList[this.activeType], "total_page", response.data.last_page);
                this.$set(this.dataList[this.activeType], "list", response.data.data);
              } else if (this.$route.query.from && this.$route.query.from == "me") {
                this.$set(this.dataList[this.activeType], "total_page", response.data.video.last_page);
                this.$set(this.dataList[this.activeType], "list", response.data.video.data);
              } else {
                this.$set(this.dataList[this.activeType], "total_page", response.data.list.last_page);
                this.$set(this.dataList[this.activeType], "list", response.data.list.data);
                // console.log('ssssssssssssssssss0',this.dataList[this.activeType].list);
                // console.log('ssssssssssaaaa',this.dataList[this.activeType].list);
                // this.total_page = response.data.list.last_page;
                // this.popularVideo = response.data.list.data;
              }

              if (!flag) {
                if (this.$route.query.vid) {
                  for (let i = 0; i < this.dataList[this.activeType].list.length; i++) {
                    if (this.dataList[this.activeType].list[i].id == this.amount_id) {
                      this.showVideo = this.dataList[this.activeType].list[i];
                      this.dataList[this.activeType].list.splice(0, i);
                      break;
                    }
                  }
                } else {
                  this.amount_id = this.dataList[this.activeType].list[0].id;
                  this.showVideo = this.dataList[this.activeType].list[0];
                }
              } else {
                if (this.$route.query.vid) {
                  for (let i = 0; i < this.dataList[this.activeType].list.length; i++) {
                    if (this.dataList[this.activeType].list[i].id == this.amount_id) {
                      this.dataList[this.activeType].list.splice(i, 1);
                      break;
                    }
                  }
                  this.dataList[this.activeType].list.unshift(this.showVideo);
                }
              }
            } else {
              this.$set(this.dataList[this.activeType], "total_page", response.data.list.last_page);
              this.$set(this.dataList[this.activeType], "list", response.data.list.data);
              if (this.dataList[this.activeType].list.length > 0) {
                this.amount_id = this.dataList[this.activeType].list[0].id;
                this.showVideo = this.dataList[this.activeType].list[0];
              }
            }

            this.$nextTick(() => {
              if (that.dataList[this.activeType].list.length > 0) {
                myVideo = document.getElementById("myVideo");
                myVideo.addEventListener("timeupdate", function(e) {
                  if (e.target.duration > 0) {
                    that.maxTime = parseInt(e.target.duration);
                    if (that.is_openRedpack && !that.showRedpack) {
                      that.getViewTimelog();
                    }
                  }
                  // that.onLoadedmetadata(e.target.duration)
                  that.onTimeupdate(myVideo.currentTime);
                });
                myVideo.addEventListener("playing", function(e) {
                  // 播放记录
                  if (that.amount_id == that.old_amount_id) {
                    return;
                  }
                  that.old_amount_id = that.amount_id;
                  that.addRecord();
                  // that.onPlaying()
                });
                myVideo.addEventListener("ended", function(e) {
                  console.log("视频播放完了//////////////////////");
                  that.endedPlay();
                });
              }
            });
            this.fun.wxShare(
              "",
              {},
              {
                title: this.fun.isTextEmpty(that.showVideo.title) ? "视频分享" : this.showVideo.title,
                link: this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/videoDetail?i=" + this.fun.getKeyByI() + "&vid=" + this.amount_id,
                imgUrl: this.showVideo.cover,
                description: `我发现了一个不错的视频，快来看看吧~`
              },
              data => {
                this.wxJsSdkConfig = data;
              },
              () => {
                $http
                  .get("plugin.video-share.frontend.video.share", {
                    video_goods_id: this.showVideo.id
                  })
                  .then(response => {
                    console.log(this.dataList[this.activeType].list[0]);
                    this.$set(this.dataList[this.activeType].list[this.shareInd], "share_num", response.data);
                    console.log(response, "分享成功回调");
                  });
              }
            );

            //短视频红包
            try {
              if (response.data.video_redpack && response.data.video_redpack.is_open === 1) {
                this.is_openRedpack = true;
                this.openRedpackData = response.data.video_redpack.data;
                for (let i = 0; i < this.openRedpackData.length; i++) {
                  if (this.openRedpackData[i].view_time_open_state === "1") {
                    that.openRedpackTimes.push(this.openRedpackData[i].view_time_data);
                  }
                }
                this.openRedpackTimes = this.openRedpackTimes.sort(function(a, b) {
                  return a - b;
                });
                console.log("短视频红包累计观看时长数组", that.openRedpackTimes);
              }
            } catch (e) {
              console.log(e);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          this.loading = false;
          console.error(err);
        });
    },
    getMoreData() {
      const that = this;
      this.dataList[this.activeType].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.dataList[this.activeType].page >= this.dataList[this.activeType].total_page) {
        return;
      } else {
        this.dataList[this.activeType].page = this.dataList[this.activeType].page + 1;
        let json = {};
        if (this.dataList[this.activeType].code == "follow") {
          //关注
          json = {
            search: {
              is_follow: 1
            }
          };
        } else if (this.dataList[this.activeType].code == "recommend") {
          //推荐
          json = {
            search: {
              is_recommend: 1
            }
          };
        } else {
          if (this.$route.query.from && this.$route.query.from == "card") {
            json = { card_id: this.card_id };
          } else if (this.$route.query.from && this.$route.query.from == "me") {
            json = {
              status: this.status,
              v_uid: this.$route.query.uid || ''
            };
          }
        }
        json.page = this.dataList[this.activeType].page;

        $http.post(this.url, json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeType].isLoadMore = true;
            if (response.result === 1) {
              let myData = [];
              if (this.dataList[this.activeType].code == "default") {
                if (this.$route.query.from && this.$route.query.from == "card") {
                  myData = response.data.data;
                } else if (this.$route.query.from && this.$route.query.from == "me") {
                  myData = response.data.video.data;
                } else {
                  myData = response.data.list.data;
                }
              } else {
                myData = response.data.list.data;
              }

              that.dataList[that.activeType].list = that.dataList[that.activeType].list.concat(myData); //数组拼接
            } else {
              that.dataList[that.dataList.length - 1].page = that.dataList[that.dataList.length - 1].page - 1;
              that.dataList[that.activeType].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            console.log(response);
          }
        );
      }
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

      $http.post("plugin.video-redpack.frontend.activity.bindMobile", this.form, "正在绑定手机..").then(
        response => {
          if (response.result == 1) {
            Toast("验证成功！");
            that.showVerification = false;
            that.showRedpack = true;
            that.getRedpackReward(that.reward_type, 2);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    addRecord() {
      $http
        .get("plugin.video-share.frontend.video.addRecord", {
          video_id: this.amount_id
        })
        .then(
          response => {
            if (response.result == 1) {
              console.log("播放记录成功");
            } else {
              console.log("播放记录失败");
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    },
    onIconLink() {
      //后台设置自定义图标跳转链接
      if (this.fun.isTextEmpty(this.BasicSet.iconLink)) return;
      window.location.href = this.BasicSet.iconLink;
    },
    gotoLiveRoom(roomid) {
      //进入直播间
      this.$router.push(this.fun.getUrl("livePage", { id: roomid, type: "livePlay" }));
    },
    followMember(uid, isfollow, index) {

      let videoType = '';
      if (this.dataList[this.activeType].code == "follow") {              
        videoType = '关注'; //关注             
      } else if (this.dataList[this.activeType].code == "recommend") {                
        videoType = '推荐'; //推荐              
      } else if (this.dataList[this.activeType].code == "default") {              
        videoType = '最新'; //最新 
      }
      zhuge.track('视频播放页点击关注',{
        '视频标题':this.showVideo.title,//'生食更健康吗'
        '视频id':this.showVideo.id,//'12345'
        '视频分类':videoType,//'关注、最新、推荐'
        '发布人':this.showVideo.member.nickname,//'嘿嘿嘿嘿'
        '发布人id':this.showVideo.member.uid,//'hd001',
        '标签名称':this.showVideo.category_name//'营养知识、才艺展示' 
      });

      //关注或取关
      $http
        .get("plugin.video-share.frontend.video.editFollow", {
          member_id: uid,
          follow_type: isfollow == 1 ? 2 : 1
        })
        .then(
          response => {
            if (response.result == 1) {
              let follow = isfollow == 1 ? 0 : 1;
              for (let index = 0; index < this.dataList.length; index++) {
                //遍历查找列表中改会员。设置为已修改的状态
                for (let i = 0; i < this.dataList[index].list.length; i++) {
                  if (this.dataList[index].list[i].member.uid == uid) {
                    this.$set(this.dataList[index].list[i], "is_follow", follow);
                  }
                }
              }
              let msg = isfollow == 1 ? "已取消关注" : "关注成功";
              Toast(msg);
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    },
    gotoUrl(name, params = {}) {
      if (name == "advertisingPutAD") {
        //投放广告按钮
        let ad_serving_button_status = params.item.ad_serving_button_status;
        if (!ad_serving_button_status.is_advertiser) {
          this.$router.push(this.fun.getUrl("advertisingApply")); //还不是广告主，跳转申请页
        } else {
          this.$router.push(this.fun.getUrl("advertisingPutAD", { tag: "video", id: params.item.id }));
        }
        return;
      }
      this.$router.push(this.fun.getUrl(name, params));
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl("home"));
    },
    gotoMember() {
      this.$router.push(this.fun.getUrl("member"));
    },
    goMyVideo(_id) {
      this.$router.push(this.fun.getUrl("myVideo", {id: _id}));
    },
    backPage() {
      this.$router.go(-1);
    },

    toComment() {

      //视频播放页点击评论
      let videoTitle = this.showVideo.title;
      let videoType = '';
      if (this.dataList[this.activeType].code == "follow") {              
        videoType = '关注'; //关注             
      } else if (this.dataList[this.activeType].code == "recommend") {                
        videoType = '推荐'; //推荐              
      } else if (this.dataList[this.activeType].code == "default") {              
        videoType = '最新'; //最新 
      }

      zhuge.track('视频播放页点击评论',{
        '视频标题':videoTitle,
        '视频id':this.amount_id,
        '视频分类':videoType,
        '发布人':this.showVideo.member.nickname,
        '发布人id':this.showVideo.member.uid,
        '标签名称':this.showVideo.category_name,
       });

      //显示评论弹窗组件
      if (this.commentlist.length > 0) {
        this.showYzComment = true;
        return;
      }
      this.getCommentData();
    },
    getCommentData() {
      this.commentLoading = true;
      this.showYzComment = true;
      this.commentPage = 1;
      $http
        .get("plugin.video-share.frontend.comment.comment-list", { video_id: this.amount_id }, "...")
        .then(response => {
          this.commentLoading = false;
          if (response.result === 1) {
            this.commentlist = response.data.list.data;
            this.commentTotal = response.data.num;
            if (response.data.list.last_page <= 1) {
              this.commentFinished = true;
            }
          } else {
            Toast(response.msg);
            this.commentFinished = true; //防止没有高度一直触发van-list加载
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onCommentMore() {
      console.log("触发加载更多");
      if (this.commentFinished || this.commentLoading) {
        return;
      }
      this.commentLoading = true;
      $http
        .get("plugin.video-share.frontend.comment.comment-list", { video_id: this.amount_id, page: this.commentPage + 1 }, "...")
        .then(response => {
          this.commentLoading = false;
          if (response.result === 1) {
            this.commentlist = this.commentlist.concat(response.data.list.data);
            if (response.data.list.current_page >= response.data.list.last_page) {
              this.commentFinished = true;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          this.commentLoading = false;
          console.log(err);
        });
    },
    getRely(e) {
      let _commentId = this.commentlist[e.index].id;
      let page = Math.floor(this.commentlist[e.index].append_arr.length / 5) + 1;
      $http
        .get("plugin.video-share.frontend.comment.get-replys", { comment_id: _commentId, page: page }, "...")
        .then(response => {
          this.commentLoading = false;
          if (response.result === 1) {
            this.commentlist[e.index].append_arr = this.commentlist[e.index].append_arr.concat(response.data.data);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    sendComment(e) {

      //视频播放页点击发送评论
      let commmentType = '';
      let uid = localStorage.getItem('uid');
      let videoTitle = this.showVideo.title;
      let videoType = '';
      if (this.dataList[this.activeType].code == "follow") {              
         videoType = '关注'; //关注             
      } else if (this.dataList[this.activeType].code == "recommend") {                
        videoType = '推荐'; //推荐              
      } else if (this.dataList[this.activeType].code == "default") {              
        videoType = '最新'; //最新 
      }

      let Json = {
        content: e.text
      };
      let _URL = "plugin.video-share.frontend.comment.create-comment"; //创建主评论
      if (e.options.type == "main") {
        //主评论
        Json.video_id = this.amount_id;
      } else if (e.options.type == "reply") {
        Json.comment_id = this.commentlist[e.options.index].id;
        _URL = "plugin.video-share.frontend.comment.reply-comment"; //回复父评论
      } else if (e.options.type == "childReply") {
        Json.comment_id = this.commentlist[e.options.index].append_arr[e.options.childIndex].id;
        _URL = "plugin.video-share.frontend.comment.reply-comment"; //回复子评论
      }
      $http
        .post(_URL, Json, "...")
        .then(response => {
          if (response.result === 1) {
            Toast("评论成功");
            if (response.data.type == "1") {
              //主评论
              this.commentlist.unshift({
                append_arr: [],
                id: response.data.id,
                support_num: 0,
                head_image: response.data.head_img_url,
                nick_name: response.data.nick_name,
                created_at: response.data.created_at,
                content: response.data.content,
                can_del: 1
              });
              this.commentTotal += 1;
              commmentType = '帖子评论';
            } else if (response.data.type == "2") {
              this.commentlist[e.options.index].append_arr.unshift({
                id: response.data.reply_comment_id,
                support_num: 0,
                head_image: response.data.head_img_url,
                nick_name: response.data.nick_name,
                created_at: response.data.created_at,
                content: response.data.content,
                can_del: 1,
                reply_name: response.data.reply_name
              });
              commmentType = '回复评论';
            }

            zhuge.track('视频播放页点击发送评论',{
              '视频标题':videoTitle,
              '视频id':this.showVideo.id,
              '视频分类':videoType,
              '发布人':this.showVideo.member.nickname,
              '发布人id':this.showVideo.member.uid,
              '标签名称':this.showVideo.category_name,
              '评论类型':commmentType,
              '评论人':response.data.nick_name,
              '评论人id':uid,
              '评论时间':response.data.created_at
            });

            this.$set(this.dataList[this.activeType].list[this.realIndex], "comment_num", this.commentlist.length);
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delComment(e) {
      console.log("删除评论===========", e);
      let Json = {};
      if (e.type == "reply") {
        Json.comment_id = this.commentlist[e.index].id;
      } else if (e.type == "childReply") {
        Json.comment_id = this.commentlist[e.index].append_arr[e.childIndex].id;
      }
      $http
        .post("plugin.video-share.frontend.comment.del", Json, "...")
        .then(response => {
          if (response.result === 1) {
            Toast("已删除");
            if (e.type == "reply") {
              this.commentlist.splice(e.index, 1);
              this.commentTotal--;
            } else if (e.type == "childReply") {
              this.commentlist[e.index].append_arr.splice(e.childIndex, 1);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clickLikeItem(index, itemIndex, status) {
      console.log(".....点赞||取消点赞.....", index, itemIndex);
      let Json = {
        comment_id: this.commentlist[index].id //点赞主评论
      };
      if (itemIndex != null && itemIndex !== "") {
        //点赞子评论
        Json.comment_id = this.commentlist[index].append_arr[itemIndex].id;
      }
      $http
        .post("plugin.video-share.frontend.comment.support", Json, "...")
        .then(response => {
          if (response.result === 1) {

            let videoTitle = this.showVideo.title;
            let videoType = '';
            if (this.dataList[this.activeType].code == "follow") {              
              videoType = '关注'; //关注             
            } else if (this.dataList[this.activeType].code == "recommend") {                
              videoType = '推荐'; //推荐              
            } else if (this.dataList[this.activeType].code == "default") {              
              videoType = '最新'; //最新 
            }

            if (itemIndex != null && itemIndex !== "") {

              if(this.commentlist[index].append_arr[itemIndex].is_support === false){
                zhuge.track('视频播放页点击点赞',{
                  '视频标题':videoTitle,
                  '视频id':this.amount_id,
                  '视频分类':videoType,
                  '发布人':this.showVideo.member.nickname,
                  '发布人id':this.showVideo.member.uid,
                  '标签名称':this.showVideo.category_name,
                  '点赞类型':'评论点赞',
                  '评论人':this.commentlist[index].append_arr[itemIndex].nick_name,
                  '评论人id':this.commentlist[index].append_arr[itemIndex].uid,
                  '评论时间':this.commentlist[index].append_arr[itemIndex].created_at
                 });
              }

              //点赞子评论
              this.$set(this.commentlist[index].append_arr[itemIndex], "is_support", !status);
              let support_num = this.commentlist[index].append_arr[itemIndex].support_num;
              this.$set(this.commentlist[index].append_arr[itemIndex], "support_num", status ? --support_num : ++support_num);
            } else {

              if(this.commentlist[index].is_support === false){
                zhuge.track('视频播放页点击点赞',{
                  '视频标题':videoTitle,
                  '视频id':this.amount_id,
                  '视频分类':videoType,
                  '发布人':this.showVideo.member.nickname,
                  '发布人id':this.showVideo.member.uid,
                  '标签名称':this.showVideo.category_name,
                  '点赞类型':'评论点赞',
                  '评论人':this.commentlist[index].nick_name,
                  '评论人id':this.commentlist[index].uid,
                  '评论时间':this.commentlist[index].created_at
                 });
              }

              this.$set(this.commentlist[index], "is_support", !status);
              let num = this.commentlist[index].support_num;
              this.$set(this.commentlist[index], "support_num", status ? --num : ++num);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: { commentGroup, commentCell, commentCellItem, yzWechatShareImg }
};
