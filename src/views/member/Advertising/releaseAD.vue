<!-- 广告发布 -->
<template>
  <div id="releaseAD">
    <c-title :hide="false" text="发布广告"></c-title>
    <van-cell-group>
      <van-field v-model="title" :border="false" label="标题" required placeholder="请输入标题" />

      <van-cell required :border="false" value="上传视频封面" />
      <yz_uploader v-model="video_cover" :max_count="1" size_text="建议尺寸：160*190px" :styles="{ width: '105px', height: '130px' }" :isCustomStyle="true">
        <div class="certificate-img">
          <i class="iconfont icon-life-game-plus" style="line-height: 130px; font-size: 48px;"></i>
        </div>
      </yz_uploader>

      <van-cell required :border="false" value="上传视频" />
      <!-- <yz_uploader v-model="fileList1" :size_text="'视频长度限制' + configInfo.video_limit + ' 秒'"> </yz_uploader> -->
      <div style="display: flex;">
        <div class="uploader-video" style="padding-left: 0.875rem;" v-show="videoUrl != ''">
          <video
            preload="metadata"
            controlslist="nodownload"
            width="103px"
            height="130px"
            custom-cache="false"
            ref="video"
            webkit-playsinline="true"
            x5-video-player-type="h5"
            playsinline
            x5-playsinline=""
            x5-video-orientation="portrait"
            x5-video-player-fullscreen=""
            autoplay
            :src="videoUrl"
            id="video"
            muted
            v-show="videoUrl"
            @loadeddata="onloadeddata"
            style="background: #fff;"
          >
            <source :src="videoUrl" type="video/ogg" />
            <source :src="videoUrl" type="video/mp4" />
            <source :src="videoUrl" type="video/webm" />
            你的浏览器不支持video标签！
          </video>
        </div>
        <!-- :after-read="afterReadVideo" -->
        <van-uploader :preview-image="false" v-model="videoModel" accept="video/*" :before-read="beforeReadVideo">
          <div class="uploader-video">
            <i class="iconfont icon-life-game-plus" style="line-height: 130px; font-size: 48px;"></i>
          </div>
          <div class="size-text-box">视频长度限制{{ configInfo.video_limit }}秒</div>
        </van-uploader>
      </div>
      <van-cell value="底部广告" :border="false">
        <template #extra>
          <van-radio-group v-model="bottomADradio" direction="horizontal">
            <van-radio name="1" checked-color="#ee0a24">开</van-radio>
            <van-radio name="0" checked-color="#ee0a24">关</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <template v-if="bottomADradio == '1'">
        <van-cell :border="false" value="上传图片" />
        <yz_uploader v-model="bottom_banner" max_count="1" :styles="{ width: '105px', height: '130px' }" :isCustomStyle="true">
          <div class="certificate-img">
            <i class="iconfont icon-life-game-plus" style="line-height: 130px; font-size: 48px;"></i>
          </div>
        </yz_uploader>

        <van-field v-model="bottom_title" :border="false" label="标题" placeholder="请输入标题" />

        <van-field v-model="bottom_remark" border rows="3" autosize type="textarea" placeholder="请输入描述" class="textarea-bg-color" />

        <van-field v-model="bottom_link" autosize type="textarea" label="链接" placeholder="请输入链接" />
      </template>
    </van-cell-group>

    <div class="submit-btn">
      <van-button type="warning" color="#ef3532" round size="large" @click="sumbitAD()">提交</van-button>
    </div>
  </div>
</template>

<script>
import yz_uploader from "components/ui_components/yz_uploader";
import { Toast } from "vant";
export default {
  data() {
    return {
      title: "",
      realVideo: {}, //上传的文件
      video_link: "",
      video_cover: [],
      bottom_banner: [],
      bottomADradio: "0",
      bottom_title: "",
      bottom_remark: "",
      configInfo: {
        video_limit: 0
      },
      videoUrl: "", //https://test-1251768088.cos.ap-guangzhou.myqcloud.com/image/4fd4d0d48d0b1bed50215abf52537292.mp4
      videoModel: [],
      video_time: 0 //视频时长
    };
  },

  created() {
    this.getPublishAdvertisingData();
  },

  components: { yz_uploader },

  computed: {},

  methods: {
    afterReadVideo(e) {
      //文件读取完成后的回调函数
      console.log("文件读取 完成后 的回调", e);
      //视频上传
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let uploadAudio = this.fun.getRealUrl("plugin.ad-serving.frontend.advertising.upload.uploadAudio", {});
      let fd = new FormData();
      fd.append("file", this.realVideo); //进度百分比
      axios
        .post(uploadAudio, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          Toast.clear();
          if (response.data.result == 1) {
            this.video_link = response.data.data.audio_url;
            console.log("videoUrl", this.video_link);
          } else {
            console.log(response.data.msg);
            this.videoUrl = null;
          }
        })
        .catch(error => {
          Toast.clear();
          this.videoUrl = null;
          console.log(error);
        });
    },
    beforeReadVideo(e) {
      //文件读取前的回调函数，返回 false 可终止文件读取，支持返回 Promise
      console.log("文件 读取前 的回调", e);
      return new Promise((resolve, reject) => {
        let endsName = !(e.name.endsWith(".mp4") || e.name.endsWith(".MP4") || e.name.endsWith(".mov") || e.name.endsWith(".MOV"));
        if (endsName) {
          this.$dialog.alert({ message: "请上传MP4或MOV格式视频" });
          reject();
        } else {
          this.realVideo = e;
          if (window.createObjectURL != undefined) {
            // basic
            this.videoUrl = window.createObjectURL(e); //类型1
          } else if (window.URL != undefined) {
            // mozilla(firefox)
            this.videoUrl = window.URL.createObjectURL(e); //类型2
          } else if (window.webkitURL != undefined) {
            // webkit or chrome
            this.videoUrl = window.webkitURL.createObjectURL(e); //类型3
          }

          if (this.fun.isIosOrAndroid() == "ios") {
            this.$nextTick(() => {
              this.$dialog.alert({ message: "开始上传" }).then(() => {
                this.$refs.video.play();
                this.$refs.video.pause();
              });
            });
          }

          resolve(e);

          // video.onloadedmetadata = () => {
          //   window.URL.revokeObjectURL(video.src);
          //   let duration = video.duration;
          //   this.video_time = duration;
          //   console.log("==》》》》》视频时长=======", this.configInfo.video_limit, duration);
          //   if (duration > this.configInfo.video_limit) {
          //     Toast(`视频长度限制${this.configInfo.video_limit}秒`);
          //     reject();
          //   }
          //   resolve(e);
          // };
        }
      });
    },
    onloadeddata(e) {
      let duration = e.target.duration;
      this.video_time = duration;
      console.log("==》》》》》视频时长=======", this.configInfo.video_limit, duration);
      if (duration > this.configInfo.video_limit) {
        Toast(`视频长度限制${this.configInfo.video_limit}秒`);
        this.videoUrl = null;
        return;
      }
      this.afterReadVideo();
    },
    getPublishAdvertisingData() {
      $http
        .get("plugin.ad-serving.frontend.advertising.index.getPublishAdvertisingData", {})
        .then(response => {
          if (response.result === 1) {
            this.configInfo = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    sumbitAD() {
      if (this.fun.isTextEmpty(this.title)) {
        Toast("请填写广告标题");
        return;
      }
      if (this.fun.isTextEmpty(this.video_cover)) {
        Toast("请上传视频封面");
        return;
      }
      if (this.fun.isTextEmpty(this.video_link)) {
        Toast("请上传视频");
        return;
      }
      let json = {
        title: this.title,
        video_cover: this.video_cover[0],
        video_link: this.video_link,
        bottom_status: this.bottomADradio,
        bottom_banner: this.bottom_banner[0],
        bottom_title: this.bottom_title,
        bottom_remark: this.bottom_remark,
        bottom_link: this.bottom_link,
        video_time: this.video_time
      };
      $http
        .post("plugin.ad-serving.frontend.advertising.index.publishAdvertisingAction", json)
        .then(response => {
          Toast(response.msg);
          if (response.result === 1) {
            this.configInfo = response.data;
            this.$router.push(this.fun.getUrl("advertisingAdvertisers", {}));
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#releaseAD {
  .textarea-bg-color {
    background: #f6f6f6;
    margin: 0.875rem;
    width: auto;
    border-radius: 5px;
  }

  .submit-btn {
    padding: 0.75rem;
  }

  .van-uploader {
    display: flex;
    padding: 0 0.875rem 0.5rem;

    /deep/.van-uploader__wrapper {
      width: 100%;

      .van-uploader__input-wrapper {
        display: flex;
      }
    }

    /deep/.uploader-video {
      width: 103px;
      overflow: hidden;
      background: #f3f3f3;
      border: 1px dashed #c0ccda;
      margin-right: 0.5rem;
    }

    .size-text-box {
      display: flex;
      flex-direction: column-reverse;
      margin-bottom: 0.5rem;
      color: #333;
      font-size: 10px;
    }
  }
}
</style>
