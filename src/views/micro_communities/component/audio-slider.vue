<!--  -->
<template>
  <div class="audio-slider">
    <!-- 进度条 开始 -->
    <!-- https://test-1251768088.cos.ap-guangzhou.myqcloud.com/audios/15/2022/01/5164edee83ade5afef0fd1fe4e45a7e5.mp3 -->
    <div class="audio-wrapper" v-if="src">
      <div class="icon">
        <img src="@/assets/images/play1.png" alt="" @click="select(0)" v-if="!songStop" />
        <img src="@/assets/images/stop1.png" alt="" @click="select(1)" v-if="songStop" />
      </div>
      <div class="slider" ref="slider" @touchstart="handleTouchStart">
        <div class="slider-track"></div>
        <div class="slider-fill" :style="'width:' + sliderTime + '%'"></div>
        <div class="slider-thumb" :style="'left:' + sliderTime + '%'"></div>
        <div class="time">
          <div class="time_left">{{ audio.currentTime | formatSecond }}</div>
          <div class="time_right">{{ audio.maxTime | formatSecond }}</div>
        </div>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>

    <!--进度条 end -->
    <audio
      v-if="audioSrc"
      id="audio"
      ref="audio"
      :src="audioSrc"
      @playing="onPlaying"
      @pause="onPause"
      @play="onPlay"
      @ended="ended"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
      @onerror="error"
      @progress="onProgress"
      controls="controls"
      style="display: none;"
    >
      您的浏览器不支持 audio 标签！
    </audio>
  </div>
</template>

<script>
import { Toast } from "vant";
// var BenzAMRRecorder = require("benz-amr-recorder");
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
  props: {
    //数据，为空才显示
    src: {
      type: String,
      default: ""
    },
    duration: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
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
      audioSrc: null,
      sliderTime: 0,
      songStop: false,
      amr: null
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {
    if (!(this.src.endsWith(".amr") || this.src.endsWith(".AMR"))) {
      this.audioSrc = this.src;
    } else {
      this.setAmr2wav(this.src);
    }
  },
  destroyed() {
    if (this.songStop) {
      this.$refs.audio.pause();
    }
    this.audioSrc = null;
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    }
  },
  methods: {
    initWithUrl(url) {
      if (this._isInit || this._isInitRecorder) {
        throw new Error("AMR has been initialized. For a new AMR, please generate a new BenzAMRRecorder().");
      }

      const p = new Promise((resolve, reject) => {
        fetch(url, {
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "application/octet-stream" },
          credentials: "include"
        })
          .then(response => {
            if (response.ok) {
              response.blob().then(function(blob) {
                console.log("fetch to blob成功 ===");
                resolve(blob);
              });
            }
          })
          .catch(err => {
            console.log("fetch to blob 失败 ===", err);
            reject(err);
          });
      });
      return p.then(blob => {
        return blob;
      });
    },
    setAmr2wav(voice) {
      // this.amr = new BenzAMRRecorder();
      const that = this;
      console.log("amr的链接", voice);
      // this.amr.initWithUrl("http://localhost:8081/addons/yun_shop/static/app/mario.amr");
      that.initWithUrl(voice).then(data => {
        Recorder.amr2wav(
          data,
          function(blob) {
            that.audioSrc = URL.createObjectURL(blob);
            // let audiosDOM = that.$refs.audio;
            // audiosDOM.src = URL.createObjectURL(blob);
            console.log("已转码成wav播放");
          },
          function(msg) {
            console.log("转码成wav失败：" + msg);
          }
        );
        // console.log("amr.getDuration()获取到的时长：：：", that.amr.getDuration().toFixed(2));
        // that.duration.innerHTML = that.amr.getDuration().toFixed(2) + '\'';
      });
    },

    select(_status) {
      if (!_status) {
        this.play(); //继续播放
      } else {
        this.pause();
      }
    },
    // 播放音频
    play() {
      if (this.fun.getPhoneEnv() == 1) {
        //解决 ios 报错The operation was aborted
        this.$refs.audio.load();
        setTimeout(() => {
          this.$refs.audio.play();
        }, 200);
      } else {
        this.$refs.audio.play();
      }
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause();
    },
    // 当音频播放
    onPlay() {
      console.log("onPlay===========");
    },
    onPlaying() {
      console.log("onPlaying===========");
      this.audio.playing = true;
      this.songStop = true;
    },
    ended() {
      console.log("播放结束");
      this.songStop = false;
      this.sliderTime = 100;
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false;
      this.songStop = false;
    },
    error(e) {
      this.$dialog.alert({ message: "音频出错了" });
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      let _duration = !isNaN(res.target.duration) && res.target.duration != Infinity ? res.target.duration : this.duration;
      console.log("音频时长：：：", res.target.duration, _duration);
      this.audio.maxTime = Math.ceil(_duration);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime;
      this.sliderTime = parseInt((this.audio.currentTime / this.audio.maxTime) * 100);
    },
    onProgress() {
      Toast.loading({
        message: "音频加载中..."
      });
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
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = parseInt((index / 100) * this.audio.maxTime);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.audio-wrapper {
  display: flex;
  align-items: center;
  margin: 0 auto;
  color: #3e3e3e;
  z-index: 999;
  position: relative;

  .icon {
    img {
      width: 1.2rem;
      height: 1.2rem;
      padding: 8px 18px 8px 0;
      display: flex;
      box-sizing: content-box;
    }
  }
}

.slider {
  width: 100%;
  flex: 1;
  position: relative;
  height: 16px;
  margin: 12px 18px 20px 0;
  display: flex;
  cursor: default;
  user-select: none;
  outline: none;
}

.slider-track {
  position: absolute;
  height: 6px;
  left: 0;
  right: 0;
  top: 50%;
  margin-top: -1px;
  background-color: #f5f6f8;
  border-radius: 3px;
}

.slider-fill {
  position: absolute;
  height: 6px;
  width: 100%;
  background-color: #f14e4e;
  left: 0;
  top: 50%;
  border-radius: 3px;
  margin-top: -1px;
}

.slider-thumb {
  position: absolute;
  top: 60%;
  width: 12px;
  height: 12px;
  background-color: #fff;
  color: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 1px 3px 0px rgba(198, 198, 198, 0.46);
  cursor: pointer;
}

.time {
  display: flex;
  color: #bababa;
  font-size: 0.625rem;
  position: absolute;
  bottom: -20px;
  width: 100%;
}

.time_left {
  flex: 1;
  text-align: left;
}

.time_right {
  flex: 1;
  text-align: right;
}
</style>
