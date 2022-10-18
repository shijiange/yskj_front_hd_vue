<template>
  <div class="audio-content-card">
    <h1 class="content-title" v-if="upload === false">{{ title }}</h1>
    <content-author-bar
      class="content-author"
      v-if="upload === false"
      :avatar="author.avatar"
      :nickname="author.nickname"
      :attention="author.is_attention"
      :self="author.is_self"
      @follow="followAuthor"
    ></content-author-bar>
    <div class="audio-player">
      <div class="audio-play_button iconfont icon-member_look" v-show="audioPlaying === false" @click="playAudio"></div>
      <img class="audio-play_button" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/audio.svg" v-show="audioPlaying" @click="pauseAudio" />
      <div class="audio-play_progress">
        <div class="audio-play_progress-bar" ref="audioProgressBar">
          <div class="audio-play_progress-slider" :style="{ left: AudioPlayElDistance + 'px' }" ref="audioProgressSlide"></div>
          <div class="audio-play_progress-current" :style="{ width: AudioPlayElDistance + 'px' }" ref="audioCurrentProgressEl"></div>
          <div class="audio-play_progress-total"></div>
        </div>
        <ul class="audio-play_time">
          <li class="audio-play_time-item">{{ audioPlayProgress }}</li>
          <li class="audio-play_time-item upload-audio_button" v-if="upload">
            <van-uploader accept="audio/mp3" :after-read="uploadAudio">{{ audio ? "重新上传" : "上传" }}</van-uploader>
          </li>
          <li class="audio-play_time-item">{{ audioLength }}</li>
        </ul>
      </div>
    </div>
    <audio :src="audio" controls ref="audioEl" style="display: none;"></audio>
  </div>
</template>

<script>
import ContentAuthorBar from "./ContentAuthorBar";
import Date from "../../../../fun/modules/date";
import { verifyFileType } from "../common";
const AudioEl = new Audio("");
let AudioPlayTimer = null;
export default {
  props: {
    upload: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    author: {
      type: Object,
      default() {
        return {
          avatar: "",
          nickname: "",
          attention: false,
          self: false
        };
      }
    }
  },
  data() {
    return {
      audio: "",
      audioPlayProgress: "0:00",
      audioLength: "0:00",
      audioPlaying: false,
      AudioPlayElDistance: 0
    };
  },
  mounted() {
    if (this.src) {
      this.resetAudio(this.src);
    }
  },
  deactivated() {
    this.audio = "";
  },
  methods: {
    followAuthor() {
      this.$emit("follow");
    },
    uploadAudio(files) {
      this.pauseAudio();

      if (verifyFileType(files.file, ["mp3"])) {
        this.$toast("请上传mp3格式的音频文件");
        return;
      }
      let uploadForm = new FormData();
      uploadForm.append("upload_type", "audio");
      uploadForm.append("file", files.file);
      let uploadLoading = this.$toast.loading({
        message: "上传中",
        duration: 0
      });
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), uploadForm)
        .then(
          ({
            data: {
              data: { img_url }
            }
          }) => {
            this.$toast("上传成功");
            this.audioPlayProgress = "0:00";
            this.AudioPlayElDistance = 0;

            this.resetAudio(img_url);
          }
        )
        .catch(() => {
          uploadLoading.clear();
        });
    },
    playAudio() {
      AudioEl.play();
      this.$refs["audioEl"].play();
      this.audioPlaying = true;
      let add = this.$refs["audioProgressBar"].clientWidth / AudioEl.duration;
      AudioPlayTimer = setInterval(() => {
        let times = Date.getTimeElByMillisecond(AudioEl.currentTime * 1000);
        this.audioPlayProgress = `${times.hours ? times.hours + ":" : ""}${times.minutes}:${times.seconds}`;
        this.AudioPlayElDistance += add;
      }, 1000);
    },
    pauseAudio() {
      AudioEl.pause();
      this.$refs["audioEl"].pause();
      clearInterval(AudioPlayTimer);
      AudioPlayTimer = null;
      this.audioPlaying = false;
    },
    resetAudio(audioUrl) {
      this.audio = audioUrl;
      AudioEl.src = audioUrl;
      this.$emit("uploaded", {
        uploadedUrl: audioUrl
      });
      AudioEl.addEventListener("canplay", () => {
        let times = Date.getTimeElByMillisecond(AudioEl.duration * 1000);
        this.audioLength = `${times.hours ? times.hours + ":" : ""}${times.minutes}:${times.seconds}`;
      });
      AudioEl.addEventListener("ended", () => {
        clearInterval(AudioPlayTimer);
        AudioPlayTimer = null;
        this.audioPlaying = false;
      });
    }
  },
  components: {
    ContentAuthorBar
  }
};
</script>

<style scoped>
.audio-content-card {
  padding: 0.94rem;
  word-break: break-all;
  text-align: left;
  background-color: #fff;
  border-radius: 0.47rem;
}

.content-author {
  margin: 1.16rem 0 1.78rem;
}

/* 播放器 */
.audio-player {
  display: flex;
}

.audio-play_button {
  flex-shrink: 0;
  width: 1.44rem;
  height: 1.44rem;
  line-height: 1.44rem;
  color: white;
  text-align: center;
  font-size: 0.6rem;
  border-radius: 50%;
  background-image: linear-gradient(145deg, #ff8a50 0%, #ff2826 85%);
}

img.audio-play_button {
  margin: 0;
  padding: 0.2rem;
  box-sizing: border-box;
}

.audio-play_progress {
  flex-grow: 1;
  margin: 0.55rem 0.98rem 0;
}

.audio-play_progress-bar {
  position: relative;
}

.audio-play_progress-total {
  height: 0.38rem;
  background-color: #f5f6f8;
  border-radius: 0.2rem;
}

.audio-play_progress-slider {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0%;
  bottom: 0;
  margin: auto 0;
  width: 0.75rem;
  height: 0.75rem;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0.06rem 0.19rem 0 rgba(198, 198, 198, 0.46);
  transition: all 0.2s linear;
}

.audio-play_progress-current {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  margin: auto 0;
  width: 0%;
  height: 0.38rem;
  border-radius: 4rem;
  background-image: linear-gradient(145deg, #ff8a50 0%, #ff2826 85%);
  transition: all 0.2s linear;
}

.audio-play_time {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 0.75rem;
  color: #bababa;
  font-size: 1rem;
}
</style>
