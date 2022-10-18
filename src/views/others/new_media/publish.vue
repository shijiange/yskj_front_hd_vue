<template>
  <main>
    <c-title text="发布"></c-title>
    <div class="publish-form">
      <form-item title="标题" class="pulish-form-item" required v-if="publishType === 'video' || publishType === 'audio' || publishType === 'special'">
        <input type="text" placeholder="请输入标题" slot="title-right" v-model="title" />
      </form-item>
      <form-item title="上传封面" class="pulish-form-item" required v-if="publishType == 'default' || publishType == 'audio' || publishType == 'article'">
        <van-row class="publish-form-content" type="flex" align="bottom">
          <van-col :span="12">
            <van-uploader v-model="coverFile" :preview-image="false" :after-read="uploadCover" accept="image/png, image/jpeg, image/jpg, image/gif">
              <upload-button icon="icon-life-game-plus">
                <div class="cover-upload" v-if="contentCoverHasImage">
                  <img class="cover-image" :src="contentCover" v-if="contentCover" />
                </div>
              </upload-button>
            </van-uploader>
          </van-col>
          <van-col :span="12" style="padding-left: 0.44rem; text-align: left; font-size: 0.8rem; color: #333;">建议尺寸:340*453px</van-col>
        </van-row>
      </form-item>
      <form-item class="pulish-form-item" v-if="publishType == 'video' || publishType == 'special'">
        <van-row class="publish-form-content" type="flex" align="bottom">
          <van-col :span="12">
            <van-uploader :preview-image="false" :after-read="uploadVideo" accept="video/mp4">
              <upload-button icon="icon-fontclass-ship">
                <div slot="prompt">
                  <p>视频时长不应超过{{ sets.videoLength }}秒</p>
                </div>
              </upload-button>
              <video
                class="cotent-video"
                ref="contentVideoEl"
                :src="contentVideo"
                v-if="contentVideo"
                webkit-playsinline="true"
                controlslist="nodownload"
                playsinline="true"
                preload="metadata"
                x5-video-player-type="h5"
                x5-playsinline
                x5-video-orientation="portrait"
                x5-video-player-fullscreen
                autoplay="autoplay"
                @click.stop
                muted
                controls
              />
            </van-uploader>
          </van-col>
          <van-col :span="12" style="padding-left: 0.44rem; text-align: left; font-size: 0.8rem; color: #333;">
            <van-uploader v-model="coverFile" :preview-image="false" :after-read="uploadCover" accept="image/png, image/jpeg, image/jpg, image/gif">
              <upload-button icon="icon-fontclass-shengchengjilu">
                <div class="cover-upload" v-if="contentCoverHasImage">
                  <img class="cover-image" :src="contentCover" v-if="contentCover" />
                </div>
                <template #prompt>提示：封面尽量和视频高度一致</template>
              </upload-button>
            </van-uploader>
          </van-col>
        </van-row>
      </form-item>
      <form-item title="标题" class="pulish-form-item" required v-if="publishType === 'default' || publishType === 'article'">
        <input type="text" placeholder="请输入标题" slot="title-right" v-model="title" />
        <textarea class="publish-content" v-model="content" placeholder="添加正文"></textarea>
      </form-item>
      <form-item title="上传音频文件" class="pulish-form-item" required v-if="publishType === 'audio'">
        <!-- <upload-button icon="icon-fontclass-ship"></upload-button> -->
        <audio-content-card :upload="true" @uploaded="getAudioFile" :src="this.audio"></audio-content-card>
      </form-item>

      <div class="publish-details" v-if="publishType === 'special'">
        <form-item title="流量值单价" class="pulish-form-item" required bottomBorder>
          <input type="text" name="请输入流量值" slot="title-right" v-model="contentPrice" />
          <template #tip>最低值{{ sets.minFlowHours }}流量值/小时</template>
        </form-item>
        <form-item title="投放时间(小时)" class="pulish-form-item" required bottomBorder>
          <input type="text" name="请输入投放时间" slot="title-right" v-model="contentDuration" />
        </form-item>
        <form-item title="链接" class="pulish-form-item" bottomBorder>
          <input type="text" name="请输入链接" slot="title-right" v-model="contentLink" placeholder="请输入链接" />
        </form-item>
      </div>

      <form-item class="pulish-form-item new-media_publish-upload-images" v-if="publishType == 'default'">
        <yz_uploader ref="uploader" v-model="uploadImageList" />
      </form-item>
    </div>
    <d-fixed-container bottom="0.84rem" center placeholder width="20.3rem" height="8.5rem">
      <div style="display: flex; justify-content: center; width: 100%;">
        <van-button class="submit-button" block type="primary" color="#ef3532" round @click="saveADContent">提交</van-button>
      </div>
    </d-fixed-container>
    <shortcut-menu right="0.63rem" bottom="5.88rem" :navs="shortcutNavs"></shortcut-menu>
    <van-popup class="fail-popup" v-model="displayFailPopup" round closeable :style="{ height: '17.72rem', width: '17.22rem' }">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/fail_popup_bg.png" />
      <div class="fail-prompt">
        {{ publishFailInfo.title }}
        <p class="fail-keywords">{{ publishFailInfo.content }}</p>
      </div>
    </van-popup>
  </main>
</template>

<script>
import yz_uploader from "@/components/ui_components/yz_uploader";
import DFixedContainer from "@/components/other/common/DFixedContainer";
import ShortcutMenu from "./ScopedComponents/ShortcutMenu";
import UploadButton from "./ScopedComponents/UploadButton";
import FormItem from "./ScopedComponents/FormItem";
import AudioContentCard from "./ScopedComponents/AudioContentCard";
function verifyFileType(file, types) {
  let type = file.type.split("/")[1];
  if (!types.includes(type)) {
    return false;
  }

  return true;
}
export default {
  created() {
    this.fun.setWXTitle("发布");
    this.getSet();
    if (this.fun.isIosOrAndroid() == "ios") {
      this.isIPhoneAndWechat = true;
    }
    switch (Number(this.$route.query.publish_type)) {
      case 2:
        this.publishType = "article";
        break;
      case 3:
        this.publishType = "audio";
        break;
      case 4:
        this.publishType = "video";

        break;
      case 5:
        this.publishType = "special";
        break;
      default:
      case 1:
        this.publishType = "default";
        break;
    }
  },
  data() {
    return {
      publishType: "default",
      contentCoverHasImage: false,
      contentCover: "",
      displayFailPopup: false,
      uploadImageList: [],
      coverFile: [],
      title: "",
      content: "",
      audio: "",
      contentHasVideo: false,
      contentVideo: "",
      contentLink: "",
      contentDuration: null,
      contentPrice: null,
      shortcutNavs: [
        {
          text: "我的",
          icon: "icon-fontclass-huiyuanzhongixn",
          link: "newMediaMy"
        },
        {
          text: "聚合页",
          icon: "icon-fontclass-shouye",
          link: "newMediaGuide"
        }
      ],
      publishFailInfo: {
        title: "",
        content: ""
      },
      sets: {
        videoLength: 0,
        minFlowHours: 0
      },
      videoUploading: false,
      uploadVideoUrl: "",
      isIPhoneAndWechat: false,
      videoFile: null
    };
  },
  methods: {
    getSet() {
      let loadSetLoading = this.$toast.loading({
        message: "加载中",
        duration: 0,
        overlay: true
      });
      $http
        .get("plugin.new-media-advertising.frontend.media-advertisingt.get-set")
        .then(({ result, data, msg }) => {
          loadSetLoading.clear();
          if (result == 0) {
            this.$toast(msg);
            return;
          }
          this.sets.videoLength = data.video_length;
          this.sets.minFlowHours = data.min_stream_hour;
        })
        .catch(() => {
          loadSetLoading.clear();
        });
    },
    uploadCover(uploadFile) {
      if (verifyFileType(uploadFile.file, ["jpeg", "jpg", "png", "gif"]) === false) {
        this.$toast("请上传png、jpg、jpeg、gif格式的图片文件");
        return;
      }

      let uploadLoading = this.$toast.loading({
        duration: 0,
        message: "上传中",
        overlay: true
      });
      this.contentCoverHasImage = true;
      this.contentCover = uploadFile.content;
      let uploadForm = new FormData();
      uploadForm.append("file", uploadFile.file);
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), uploadForm, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(({ data: { data }, result, msg }) => {
          uploadLoading.clear();
          if (result == 0) {
            this.$toast(msg);
            return;
          }
          this.$toast("上传成功");
          this.contentCover = data.img_url;
        });
    },
    getAudioFile(file) {
      this.audio = file.uploadedUrl;
    },
    uploadVideo(files) {
      if (verifyFileType(files.file, ["mp4", "quicktime"]) === false) {
        this.contentVideo = "";
        this.$toast("请上传mp4格式的视频文件");
        return;
      }

      this.videoFile = files.file;
      this.contentVideo = files.content;

      if (this.isIPhoneAndWechat) return;
      let loading = this.$toast.loading({
        message: "加载中",
        duration: 0
      });

      this.$nextTick(() => {
        this.$refs["contentVideoEl"].addEventListener("loadedmetadata", () => {
          if (loading) loading.clear();
          if (this.$refs["contentVideoEl"].duration > this.sets.videoLength) {
            this.$toast("视频长度不可超过" + this.sets.videoLength + "秒");
            this.contentVideo = null;
            this.uploadVideoUrl = null;
            return;
          }
          if (this.videoUploading === false) {
            this.videoUploading = true;
            this.requestUploadVideo(files.file);
          }
        });
      });
    },
    requestUploadVideo(file) {
      let uploadLoading = this.$toast.loading({
        duration: 0,
        message: "上传视频中",
        overlay: true
      });
      let uploadForm = new FormData();
      uploadForm.append("file", file);

      return axios
        .post(this.fun.getRealUrl("upload.uploadPic"), uploadForm, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(({ data: { data } }) => {
          uploadLoading.clear();
          this.$toast("上传成功");
          this.uploadVideoUrl = data.img_url;
          this.videoUploading = false;
        })
        .catch(() => {
          uploadLoading.clear();
          this.videoUploading = false;
        });
    },
    async saveADContent() {
      if (this.isIPhoneAndWechat && (this.publishType === "special" || this.publishType === "video")) {
        await this.requestUploadVideo(this.videoFile);
      }
      if (this.publishType === "special" && this.contentPrice < this.sets.minFlowHours) {
        this.$toast("流量值单价不能小于最低值");
        return;
      }
      let saveLoading = this.$toast.loading({
        title: "发布中",
        overlay: true,
        duration: 0
      });
      $http
        .post("plugin.new-media-advertising.frontend.media-advertisingt.release-advertising", {
          advertising_type: this.publishType === "special" ? 2 : 1,
          genre: Number(this.$route.query.publish_type),
          title: this.title,
          cover_picture: this.contentCover,
          content: this.content,
          images: this.uploadImageList,
          resources_url: this.audio || this.uploadVideoUrl,
          link: this.contentLink,
          duration: this.contentDuration,
          stream_univalent: this.contentPrice
        })
        .then(res => {
          saveLoading.clear();
          if (res.result === 0) {
            this.displayFailPopup = true;
            if (res.data.code === 2) {
              this.publishFailInfo.title = res.data.msg;
              let errorData = res.data.data;
              let errorMessage = "";
              for (const key in errorData) {
                let item = errorData[key];
                errorMessage += item.join(", ");
                errorMessage += "\n";
              }
              this.publishFailInfo.content = errorMessage;
            } else {
              this.publishFailInfo.title = res.msg;
            }
            return;
          }
          this.$toast("发布成功");
          setTimeout(() => {
            this.$router.go(-1);
          }, 500);
        })
        .catch(() => {
          saveLoading.clear();
        });
    }
  },
  components: {
    yz_uploader,
    DFixedContainer,
    ShortcutMenu,
    UploadButton,
    FormItem,
    AudioContentCard
  }
};
</script>

<style>
.new-media_publish-upload-images .imgUploader {
  padding: 0;
}

.new-media_publish-upload-images .van-uploader {
  width: 6.56rem !important;
  height: 6.56rem !important;
  background-color: #fbfbfb !important;
  border-radius: 0.31rem !important;
  border: solid 0.06rem #e5e5e5 !important;
}

.new-media_publish-upload-images .van-icon {
  line-height: 6.56rem !important;
}

.new-media_publish-upload-images .photoBox {
  width: 6.56rem !important;
  height: 6.56rem !important;
}
</style>
<style scoped>
main {
  padding: 0 0.94rem;
  min-height: 100vh;
  text-align: left;
  background-color: white;
}

.pulish-form-item:first-child {
  padding-top: 0.88rem;
}

.pulish-form-item:not(:first-child) {
  margin-top: 1.34rem;
}

.publish-content {
  padding: 0.88rem;
  width: 100%;
  height: 8.75rem;
  font-size: 0.94rem;
  border: none;
  background-color: #f6f6f6;
  border-radius: 0.3rem;
}

.publish-details {
  margin-top: 1.5rem;
}

.submit-button {
  margin-top: 6rem;
  width: 20.31rem;
  height: 2.5rem;
}

.fail-popup img {
  width: 100%;
}

.fail-prompt {
  padding: 0 1.16rem 1.16rem;
  color: #333;
  font-size: 1rem;
}

.fail-keywords {
  margin-top: 0.94rem;
}

.cover-upload {
  text-align: center;
}

.cover-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}

.cotent-video {
  position: absolute;
  z-index: 999;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  height: 50%;
}
</style>
