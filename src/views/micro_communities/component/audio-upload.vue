<!-- 上传音频 -->
<template>
  <div class="audio-upload">
    <div class="left">音频</div>
    <div class="right" style="display: flex;justify-content: flex-end;">
      <van-uploader accept="audio/mp3,audio/m4a" :after-read="uploaderAudio">
        <div class="audio-button">上传音频</div>
      </van-uploader>
      <!-- 微信录音功能 -->
      <div class="audio-button" v-if="this.fun.isWeiXin()" @click="show = true">开始录音</div>
    </div>

    <van-popup v-model="show" :close-on-click-overlay="false" position="bottom" :style="{ height: '45%' }">
      <div class="record-popup">
        <!-- 微信录音web支持60秒 -->
        <div class="record-time">00:{{ time >= 10 ? time : `0${time}` }}</div>
        <div class="record-main">
          <i style="font-size:24px;color:#fc6726;" class="iconfont icon-all_filldelete" @click="cancel"></i>
          <div class="record-btn ">
            <div class=" wave" :class="{ animate: !recordStop }">
              <!-- 水波动画 -->
              <div class="w1"></div>
              <div class="w2"></div>
              <div class="w3"></div>
              <div class="w4"></div>
            </div>
            <i style="font-size:45px;color:#4ba5fd;" v-if="recordStop" class="iconfont icon-fontclass-bofang" @click="startRecord"></i>
            <i style="font-size:45px;color:#4ba5fd;" v-if="!recordStop" class="iconfont icon-video_recording" @click="stopRecord"></i>
          </div>
          <i style="font-size:24px;color:#f14e4e;" class="iconfont icon-wancheng" @click="upVoice"></i>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      show: false,
      time: 0,
      timer: null,
      localIdL: null, //返回音频的本地ID
      recordStop: true
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    uploaderAudio(e) {
      if (e.file.type.split("/")[1].includes("mp3")) {
        this.$toast("请上传mp3格式的音频文件");
        return;
      }
      let uploadForm = new FormData();
      uploadForm.append("upload_type", "audio");
      uploadForm.append("file", e.file);
      let uploadLoading = this.$toast.loading({
        message: "上传中",
        duration: 0
      });
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), uploadForm)
        .then(
          ({
            data: {
              data: { img, img_url }
            }
          }) => {
            uploadLoading.clear();
            this.$toast("上传成功");
            console.log("文件上传", img, img_url);
            this.$emit("uploaderAudio", img, img_url);
          }
        )
        .catch(() => {
          uploadLoading.clear();
        });
    },
    startRecord() {
      let that = this;
      this.time = 0;
      wx.startRecord({
        success: function() {
          that.recordStop = false;
          console.log("初始化录音  -----开始成功");
          that.$toast("开始录音，微信限制时长60秒");
          that.timer = setInterval(() => {
            that.time++;
          }, 1000);
          that.vicoeEnd();
        },
        fail: function(error) {
          console.log("初始化录音  -----开始失败", error);
          that.$dialog.alert({ message: "初始化录音失败" });
        },
        cancel: function() {
          that.$dialog.alert({ message: "您拒绝授权录音" });
        }
      });
    },
    stopRecord() {
      let that = this;
      wx.stopRecord({
        success: function(res) {
          clearInterval(that.timer);
          that.localId = res.localId;
          that.recordStop = true;
          that.$toast("已停止录音");
        },
        fail: function(error) {
          that.localId = null;
          that.$toast("微信录音stop失败");
        }
      });
    },
    // 取消录音
    cancel() {
      if (!this.localId) {
        this.show = false;
        return;
      }
      wx.stopRecord({
        success: res => {},
        fail: function(error) {}
      });
      this.initRecordData();
      this.$toast("取消录音成功");
      this.show = false;
    },
    initRecordData() {
      if (this.timer) clearInterval(this.timer);
      this.localId = null;
      this.recordStop = true;
      this.time = 0;
    },
    // 60秒监听
    vicoeEnd() {
      let that = this;
      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function(res) {
          that.$toast("录音最长为60秒");
          clearInterval(that.timer);
          that.recordStop = true;
          that.localId = res.localId;
        }
      });
    },
    // 上传语音
    upVoice() {
      if (!this.localId) {
        this.$toast("请录音完成后再进行上传");
        return;
      }
      let that = this;
      wx.uploadVoice({
        localId: that.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          Toast.loading({
            message: "上传录音中",
            forbidClick: true
          });
          axios
            .post(
              that.fun.getRealUrl("wechat.media.get-temporary"),
              { media_id: res.serverId, plugin: "micro-communities" },
              {
                headers: { "Content-Type": "application/json" }
              }
            )
            .then(response => {
              Toast.clear();
              let responseData = response.data;
              console.log(responseData.data);
              if (responseData.result === 1) {
                // that.$emit("uploaderAudio", responseData.data.file, responseData.data.file_url, that.timer);
                that.loadDemoBtn(responseData.data.file_url);
                that.initRecordData();
                that.show = false;
              } else {
                Toast(responseData.msg);
              }
            })
            .catch(error => {
              Toast.clear();
              console.log(error);
            });
        }
      });
    },

    loadDemoBtn(voice) {
      // this.amr = new BenzAMRRecorder();
      const that = this;
      // http://localhost:8081/static/app/mario.amr
      // https://dev1.yunzshop.com/addons/yun_shop/storage/app/public/business_card/3f91e0ce6866d86639e81aab8f4951a2_5.amr
      that.initWithUrl(voice).then(data => {
        Recorder.amr2wav(
          data,
          function(blob) {
            console.log("已转码成wav播放", blob);
            that.uploaderAudio_wav(blob);
            console.log("已转码成wav播放");
          },
          function(msg) {
            console.log("转码成wav失败：" + msg);
          }
        );
      });
    },
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
                console.log(blob);
                resolve(blob);
              });
            }
          })
          .catch(err => {
            reject(err);
          });
      });
      return p.then(blob => {
        return blob;
      });
    },
    uploaderAudio_wav(e) {
      let uploadForm = new FormData();
      uploadForm.append("upload_type", "audio");
      uploadForm.append("file", e);
      let uploadLoading = this.$toast.loading({
        message: "上传中",
        duration: 0
      });
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), uploadForm)
        .then(
          ({
            data: {
              data: { img, img_url }
            }
          }) => {
            uploadLoading.clear();
            this.$toast("上传成功");
            console.log("文件上传", img, img_url);
            this.$emit("uploaderAudio", img, img_url, this.timer);
          }
        )
        .catch(() => {
          uploadLoading.clear();
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.audio-upload {
  display: flex;
  line-height: 3.38rem;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  .left {
    display: flex;
    align-items: center;
    margin-right: 0.63rem;
  }
  .right {
    display: flex;
    flex: 1;
    .audio-button {
      padding: 0 12px;
      // height: 1.5rem;
      line-height: 1.5rem;
      border-radius: 0.25rem;
      font-size: 12px;
      color: #f14e4e;
      border: solid 1px #f14e4e;
      margin-left: 0.625rem;
      &:last-child {
        background: #f14e4e;
        color: #fff;
      }
    }
  }
}
.record-popup {
  .record-time {
    padding: 56px 0 20px;
    font-size: 17px;
    color: #4ba5fd;
  }
  .record-main {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .record-btn {
      width: 125px;
      height: 125px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .icon-video_recording,
    .icon-fontclass-bofang {
      background: #fff;
      z-index: 9;
      border-radius: 50%;
    }
  }
}
.animate * {
  border: 1px solid #4ba5fd;
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-animation: opac 4s infinite;
}
@-webkit-keyframes opac {
  from {
    opacity: 1;
    width: 0;
    height: 0;
  }
  to {
    opacity: 0;
    width: 100%;
    height: 100%;
  }
}
.animate .w2 {
  /*延迟1s*/
  -webkit-animation-delay: 1s;
}
.animate .w3 {
  -webkit-animation-delay: 2s;
}
.animate .w4 {
  -webkit-animation-delay: 3s;
}
</style>
