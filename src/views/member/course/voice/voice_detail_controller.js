import cTitle from 'components/title';
import { Toast } from 'vant';

// var that = {};

// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second;

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second);

    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;

    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2);
  } else {
    return '0:00:00';
  }
}

export default {
  data() {
    return {
      dataInfo: {
        audio_link: ''
      },

      // 是否有权限看
      isShow: 1,
      isPlay: true,
      readyState: 1,
      article_id: 0,
      codeUrl: '',

      sliderTime: 0,
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      }
    };
  },
  mounted() {
    this.$nextTick(() => {

    });
  },
  activated() {
    // that = this;
    this.init();
    this.getData();
    this.getQrCode();
  },
  methods: {
    init() {
      this.isPlay = true;
      this.readyState = 1;
      this.codeUrl = '';
      this.isShow = 1;
      this.article_id = this.$route.params.article_id;
    },
    getQrCode() {
      $http.get('member.member.getArticleQr', {}, "").then((response) => {
        if (response.result === 1) {
          this.codeUrl = response.data;
        } else {
          console.log(response.msg);
        }

      }, function (response) {
        console.log(response);
      });
    },
    //获取数据
    getData() {
      const that = this;
      let share_uid = this.fun.getKey("share_uid");
      share_uid = (this.fun.isTextEmpty(share_uid)) ? "" : share_uid;
      console.log("share_uid", share_uid);
      let json = {article_id: this.article_id, "share_uid": share_uid};

      $http.get('plugin.article.api.article.get-article', json, "").then((response) => {
        if (response.result === 1) {
          that.dataInfo = response.data;
          that.fun.setWXTitle(that.dataInfo.title);
          // that.initShare();
          this.fun.wxShare(
            "",
            { mid: this.fun.getKeyByMid() },
            {
              title: that.fun.isTextEmpty(that.dataInfo.title) ? '文章' : that.dataInfo.title,
              imgUrl:  that.fun.isTextEmpty(that.dataInfo.thumb) ? "" : that.dataInfo.thumb,
              description: that.fun.isTextEmpty(that.dataInfo.desc) ? "简介" : that.dataInfo.desc
            }
          );
        } else {
          this.isShow = 0;
          that.$dialog.alert({message:response.msg}).then(()=>{
            that.$router.go(-1);
          });

        }

      }, function (response) {
        console.log(response);
      });
    },
    //初始化分享设置
    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = {url: _url, "mid": this.fun.getKeyByMid()};
      $http.post('member.member.wxJsSdkConfig', json).then(function (response) {
        if (response.result === 1) {
          that.share(response.data);
        } else {
          that.$dialog.alert({message:response.msg});

        }
      }, function (response) {
        console.log(response);
      });
    },

    //组装分享设置
    share(data) {
      let that = this;
      wx.config(data.config);
      wx.ready(function () {

        let _title = (that.fun.isTextEmpty(that.dataInfo.title)) ? '文章' : that.dataInfo.title;
        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = (that.fun.isTextEmpty(that.dataInfo.thumb)) ? "" : that.dataInfo.thumb;
        let _desc = (that.fun.isTextEmpty(that.dataInfo.desc)) ? "简介" : that.dataInfo.desc;
        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            Toast("分享成功");
          },
          cancel: function () {
            Toast("取消分享");
          }
        });

      });
    },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      this.readyState = this.$refs.audio.readyState;
      this.audio.playing ? this.isPlay = true : this.isPlay = false;
      return this.audio.playing ? this.pause() : this.play();
    },
    // 播放音频
    play() {
      this.$refs.audio.play();
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause();
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true;
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
    },
    handleFocus() {
      console.log('focues');
    },
    error(e) {
      this.$dialog.alert({message:'音频出错了'});

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
      this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100);
    },

    // 进度条格式化toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt(this.audio.maxTime / 100 * index);
      return '进度条: ' + realFormatSecond(index);
    },

    handleTouchStart(e) {
      this.setValue(e.touches[0]);

      document.addEventListener('touchmove', this.handleTouchMove);
      document.addEventListener('touchup', this.handleTouchEnd);
      document.addEventListener('touchend', this.handleTouchEnd);
      document.addEventListener('touchcancel', this.handleTouchEnd);
      // e.preventDefault();
      // this.onDragStart(e);
    },
    handleTouchMove(e) {
      this.setValue(e.changedTouches[0]);
    },
    handleTouchEnd(e) {
      this.setValue(e.changedTouches[0]);
      document.removeEventListener('touchmove', this.handleTouchMove);
      document.removeEventListener('touchup', this.handleTouchEnd);
      document.removeEventListener('touchend', this.handleTouchEnd);
      document.removeEventListener('touchcancel', this.handleTouchEnd);
      // this.onDragStop(e);
    },
    // 从点击位置更新 value
    setValue(e) {
      const {
        maxTime,
        minTime,
        step
      } = this.audio;
      let value = (e.clientX - this.$refs.slider.offsetLeft) / this.$refs.slider.offsetWidth * (maxTime - minTime);
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
      console.log('拖动进度条');
      this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime);
    }
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    }
  },
  components: {cTitle}
};