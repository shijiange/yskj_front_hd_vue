<!-- 广告播放页 -->
<template>
  <div id="adPlayPage">
    <video
      :src="ADDetails.video_link"
      webkit-playsinline="true"
      controlslist="nodownload"
      playsinline="true"
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      preload="metadata"
      ref="video"
      id="myVideo"
      autoplay
      :muted="isMuted"
      @ended="onEnded"
      @pause="onpause"
      @play="onplay"
      @playing="onplaying"
      @loadeddata="onloadeddata"
      @progress="onprogress"
      @timeupdate="ontimeupdate"
      @canplay="oncanplay"
    >
      <source :src="ADDetails.video_link" />
    </video>

    <div class="video-btn" v-show="Loadeddata" @click.stop="clickADVideo" :style="{ backgroundImage: 'url(' + ADDetails.video_cover + ')' }">
      <i class="icon-bofang1 iconfont" v-show="!isPlaying"></i>
    </div>

    <!-- 广告音频 胶囊按钮-->
    <div class="capsule-box Audio-box" @click.stop>
      <div class="capsule-text">广告</div>
      <div class="capsule-border"></div>
      <i class="iconfont  " :class="[isMuted ? 'icon-fontclass-jingyin' : 'icon-ht_btn_news']" @click="changeMuted"></i>
    </div>

    <!-- 关闭广告 胶囊按钮-->
    <div class="capsule-box clone-box" @click.stop>
      <div class="capsule-text">{{ countdown ? countdown + "s" : "--" }}</div>
      <div class="capsule-border"></div>
      <div class="capsule-text" @click.stop="cloneADs">关闭</div>
    </div>

    <!-- 底部广告 -->
    <div class="bottom-ads-box" @click.stop v-if="ADDetails.bottom_status == 1">
      <div class="ads-box-img" v-if="ADDetails.bottom_banner">
        <img :src="ADDetails.bottom_banner" alt="" />
      </div>
      <div class="ads-box-text">
        <div class="ads-box-title" v-show="ADDetails.bottom_title">{{ ADDetails.bottom_title }}</div>
        <div class="ads-box-description" v-show="ADDetails.bottom_remark">{{ ADDetails.bottom_remark }}</div>
      </div>
      <div class="ads-box-btn" v-show="ADDetails.bottom_link" @click.stop="linkToUrl">点击进入</div>
    </div>

    <van-popup v-model="showReward" class="van-popup-transparent" :close-on-click-overlay="false">
      <div class="reward-box rollback" v-if="showReward">
        <div class="reward-title">恭喜您获得</div>
        <div class="reward-total">
          {{ redpack_amount }}
          <div class="reward-type">{{ balance_name }}</div>
        </div>
        <div class="reward-btn" @click.stop="nextADData">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      Loadeddata: false, //是否视频元数据已加载完成
      myVideo: null,
      isPlaying: false,
      ADDetails: {}, //广告详情数据
      duration: null,
      countdown: null,
      list: [],
      showReward: false,
      redpack_amount: "",
      advertising_id: 0,
      isMuted: false, //是否静音
      balance_name: "", //余额自定义名称

      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  created() {
    this.advertising_id = this.$route.params.aid;
    this.page = this.$route.params.page;
    this.showReward = false;
    this.getData();
  },
  components: {},
  computed: {},
  methods: {
    changeMuted() {
      this.isMuted = !this.isMuted;
    },
    clickADVideo() {
      this.$refs.video.play();
      this.isPlaying = true;
      this.Loadeddata = false;
    },
    onloadeddata(e) {
      this.duration = Math.ceil(e.target.duration);
      this.countdown = Math.ceil(e.target.duration);
      if (!this.isPlaying) this.Loadeddata = true;
      this.isPlaying = false;
      console.log("视频时长+++++++========", e.target.duration);
    },
    oncanplay(e) {
      console.log("oncanplay//////////////////////", e.target.currentTime);
    },
    ontimeupdate(e) {
      console.log("ontimeupdate//////////////////////", e.target.currentTime);
      this.countdown = this.duration - Math.ceil(e.target.currentTime);
    },
    onprogress(e) {
      console.log("onprogress//////////////////////", e);
    },
    onEnded(e) {
      console.log("ended//////////////////////", e);
      this.redpackRewardAction();
    },
    onpause(e) {
      this.isPlaying = false;
      console.log("on pause//////////////////////", e);
    },
    onplay(e) {
      console.log("on play//////////////////////", e);
    },
    onplaying(e) {
      this.isPlaying = true;
      this.Loadeddata = false;
      this.addAdsertisingBrowse(1);
      console.log("on playing//////////////////////", e);
    },
    getADDetails(_first) {
      this.ADDetails = {};
      let that = this;
      this.Loadeddata = false;
      $http
        .get("plugin.ad-serving.frontend.advertising.play.getAdvertisingVideoData", { advertising_id: this.advertising_id }, "加载中")
        .then(res => {
          if (res.result == 1) {
            this.ADDetails = res.data.has_one_advertising_apply;
            console.log("getPhoneEnv===============", _first, this.fun.getPhoneEnv());
            if (_first && this.fun.getPhoneEnv() == "1") {
              //解决苹果不触发onloadeddata,没显示封面和播放按钮
              this.Loadeddata = true;
              this.isPlaying = false;
              console.log(">>>>>>>>解决苹果不触发onloadeddata,没显示封面和播放按钮=============");
            }
            this.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid() },
              {},
              data => {
                //wx.ready后回调方法
                // this.$nextTick(() => {
                //   console.log("wx.ready后回调方法");
                //   try {
                //     //苹果不支持且报错
                //     that.$refs.video.load();
                //     that.$refs.video.play();
                //   } catch (error) {
                //     console.log(error);
                //   }
                // });
              },
              data => {
                //微信分享成功后回调方法
                this.addAdsertisingBrowse(2);
              }
            );
          } else {
            Toast(res.msg);
            // 1--视频，直播删除，下播 ，2--广告超时，下架
            if (res.data.status && res.data.status == 1) {
              //跳转回视频、直播
              this.$router.go(-2);
            } else {
              this.nextADData();
              //下一个广告
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addAdsertisingBrowse(action_type) {
      // 播放量，点击进去就记一次，不管有没有看完，分享量，分享出去算一次，不论有没有人去点击
      $http
        .get("plugin.ad-serving.frontend.advertising.play.addAdsertisingBrowse", { advertising_id: this.advertising_id, action_type: action_type })
        .then(response => {
          if (response.result != 1) {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    cloneADs() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    redpackRewardAction() {
      //播放结束，领取红包
      $http
        .get("plugin.ad-serving.frontend.advertising.play.redpackRewardAction", { advertising_id: this.advertising_id })
        .then(response => {
          if (response.result == 1) {
            this.redpack_amount = response.data.redpack_amount;
            this.balance_name = response.data.name || "余额";
            this.showReward = true;
          } else {
            Toast(response.msg);
            this.nextADData(); //下一个广告
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    nextADData() {
      this.list.splice(0, 1);
      if (this.list.length == 0) {
        this.$dialog.alert({ message: "广告已到底" }).then(() => {
          this.$router.go(-1);
        });
        return;
      }
      this.advertising_id = this.list[0].id;
      this.getADDetails();
      this.redpack_amount = "";
      this.showReward = false;
    },
    linkToUrl() {
      window.location.href = this.ADDetails.bottom_link;
    },
    getData() {
      let json = {};
      if (this.$route.params.id && this.$route.params.id != 0) {
        json.put_in_type = this.$route.params.tag == "video" ? "2" : "1"; //投放类型:1-直播间，2-短视频
        json.put_in_id = this.$route.params.id; //投放短视频/直播间ID
      }
      json.page = this.$route.params.page;
      $http
        .get("plugin.ad-serving.frontend.advertising.index.getList", json)
        .then(response => {
          if (response.result === 1) {
            let list = response.data.list.data;
            for (let i = 0; i < list.length; i++) {
              if (list[i].id == this.advertising_id) {
                list.splice(0, i);
                this.list = list;
                break;
              }
            }
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
            if (this.fun.isTextEmpty(response.data)) {
              this.$router.go(-1);
            }
          }
          this.getADDetails(true);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let json = {};
        if (this.$route.params.id && this.$route.params.id != 0) {
          json.put_in_type = this.$route.params.tag == "video" ? "2" : "1"; //投放类型:1-直播间，2-短视频
          json.put_in_id = this.$route.params.id; //投放短视频/直播间ID
        }
        json.page = that.page;
        $http
          .get("plugin.ad-serving.frontend.advertising.index.getList", json, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.list.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#adPlayPage {
  position: relative;
  height: 100vh;
  max-width: 100%;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: fill;
    overflow: hidden;
    z-index: 1 !important;
  }

  .video-btn {
    width: 100%;
    height: 100%;
    z-index: 99;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    background-color: #000;

    i {
      font-size: 56px;
      font-weight: bold;
      color: #fff;
    }
  }

  .capsule-box {
    z-index: 9999;
    position: fixed;
    top: 0.938rem;
    height: 1.563rem;
    line-height: 1.563rem;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 0.781rem;
    color: #fff;
    font-size: 12px;
    padding: 0 0.5rem;
    display: flex;
    justify-content: space-between;

    i {
      font-size: 12px;
    }

    .capsule-border {
      padding: 0 8px;
      position: relative;
    }

    .capsule-border::after {
      content: "";
      display: block;
      position: absolute;
      width: 1px;
      left: 50%;
      top: 50%;
      height: 10px;
      background-color: #fff;
      transform: scaleX(0.5) translate(-50%, -50%);
    }
  }

  .Audio-box {
    left: 50%;
    transform: translateX(-10rem);
  }

  .clone-box {
    left: auto;
    right: 50%;
    transform: translateX(10rem);
  }

  .bottom-ads-box {
    z-index: 9999;
    width: 21.563rem;
    height: 5rem;
    background-color: #fff;
    border-radius: 0.313rem;
    overflow: hidden;
    position: fixed;
    left: 50%;
    bottom: 1.5rem;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    padding: 0.5rem;

    .ads-box-img {
      width: 4.063rem;
      height: 4.063rem;
      background-color: #ddd;
      border-radius: 0.313rem;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .ads-box-text {
      flex: 1;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      padding: 0 0.5rem;

      .ads-box-title {
        overflow: hidden;
        font-size: 15px;
        color: #202020;
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      .ads-box-description {
        color: #666;
        font-size: 0.75rem;
        line-height: 0.938rem;
      }
    }

    .ads-box-btn {
      width: 4.219rem;
      height: 1.563rem;
      line-height: 1.563rem;
      background-color: #ef3532;
      border-radius: 0.125rem;
      color: #fff;
      font-size: 10px;
    }
  }

  .reward-box {
    width: 19.656rem;
    height: 24.781rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/ads_rewardbg@3x.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .reward-title {
      font-size: 30px;
      color: #fff;
      font-weight: bold;
      padding-top: 12.375rem;
    }

    .reward-total {
      display: flex;
      align-items: baseline;
      justify-content: center;
      color: #feffb3;
      text-shadow: 2px 2px 4px rgba(183, 0, 23, 0.65);
      font-size: 36px;
      line-height: 1.5rem;
      margin-top: 1.875rem;

      .reward-type {
        font-size: 18px;
      }
    }

    .reward-btn {
      width: 12.5rem;
      height: 2.375rem;
      line-height: 2.375rem;
      background-image: linear-gradient(0deg, #ffda53 0%, #ffef93 100%);
      border-radius: 1.183rem;
      border-bottom: 3px solid #ff6b25;
      margin: 2.25rem auto 0;
      color: #fe0106;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .van-popup-transparent {
    background-color: transparent;
  }

  .rollback {
    transition: transform 2s;
    transform-style: preserve-3d;
    animation: PacketRollback 0.5s 0.5s both linear;
  }

  @keyframes PacketRollback {
    0% {
      transform: rotateY(0deg) scale(0);
    }

    30% {
      transform: rotateY(90deg) scale(0.3);
    }

    60% {
      transform: rotateY(180deg) scale(0.6);
    }

    80% {
      transform: rotateY(270deg) scale(0.7);
    }

    to {
      transform: rotateY(360deg) scale(1);
    }
  }
}
</style>
