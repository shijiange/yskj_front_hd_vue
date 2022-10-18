<!-- 直播举报页面 -->
<template>
  <div id="reportPage">
    <!-- <c-title :hide="false"
             text="举报"></c-title> -->
    <div class="content" v-if="!isSubmitData" @touchmove.stop>
      <div class="userInfo">
        <div class="img">
          <img :src="avatar" alt="">
        </div>
        <div class="leftbox">
          <div>{{nickname}}</div>
          <div style="color: #666; font-size: 0.875rem; font-weight: 400;">直播ID：{{rid}}</div>
        </div>
      </div>
      <div class="selectType">
        <van-radio-group v-model="radio" class="radioStyle">
          <van-cell-group>
            <van-cell title="辱骂，歧视，挑衅，泄露他人隐私等" clickable @click="radio = '1'">
              <van-radio slot="right-icon" name="1" checked-color="#f53939"/>
            </van-cell>
            <van-cell title="垃圾广告信息" clickable @click="radio = '2'">
              <van-radio slot="right-icon" name="2" checked-color="#f53939"/>
            </van-cell>
            <van-cell title="色情，暴力，血腥，政治敏感等违法内容" clickable @click="radio = '3'">
              <van-radio slot="right-icon" name="3" checked-color="#f53939"/>
            </van-cell>
            <van-cell title="迷信活动" clickable @click="radio = '4'">
              <van-radio slot="right-icon" name="4" checked-color="#f53939"/>
            </van-cell>
            <van-cell title="出售违禁品（枪支弹药/危险武器/保护动植物等）" clickable @click="radio = '5'">
              <van-radio slot="right-icon" name="5" checked-color="#f53939"/>
            </van-cell>
            <van-cell title="其他问题" clickable @click="radio = '6'">
              <van-radio slot="right-icon" name="6" checked-color="#f53939"/>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <div class="titleDiv">问题描述</div>
        <van-field
          v-model="message"
          rows="5"
          autosize
          type="textarea"
          placeholder="请输入描述的问题"
          class="textareaClass"
        />
        <div class="titleDiv">上传截图</div>
        <div class="imgBox"
             style="width: 100%; text-align: left; line-height: 5rem;">
          <template v-for="(val, index) in fileList4">
            <div class="photobox" style="float: left; max-width: 25%;" :key="index">
              <img :src="val.url"
                   style="max-width: 5rem;" />
              <van-icon @click="removeImg_1(index)"
                        name="close"
                        style="width: 1.2rem; height: 1.2rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;" />
            </div>
          </template>
          <van-uploader :disabled="fileList4.length >= 5"
                        :after-read="multipleMethod_1" 
                        multiple>
            <div style="padding-left: 1rem; padding-top: 1rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda;">
              <img :src="require('../../assets/images/up_icon.png')"
                   style="max-height: 3rem;"
                   class="avatar" />
            </div>
          </van-uploader>
        </div>
        <div style="text-align: center;">
          <div class="submit" @click="submitData">提交</div>
        </div>
      </div>
    </div>
    <div class="content" v-if="isSubmitData">
      <div class="icon"><i class="iconfont icon-zb_successful"></i></div>
      <p class="titelWarn">您的举报提交已成功</p>
      <div style="text-align: center;">
        <div class="submit" @click="gotoLive">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
// import cTitle from "components/title";
import { Toast } from 'vant';
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
export default {
  props:["nickname","rid",'avatar'],
  data () {
    return {
      info:{},
      radio:'',
      message:'',
      fileList4:[],
      photosize: 1024 * 1024 * 2, // 图片大小限制,
      uploadUrl:'',
      isSubmitData:false
    };
  },
  components: {

  },
  computed: {
  },
  activated(){
    // this.getData();
    this.uploadUrl = this.fun.getRealUrl('upload.uploadPic', {});
  },
  methods: {
    gotoLive(){
      this.$emit("submitsave", true);
    },
    getData(){
      $http
        .post(
          "plugin.room.frontend.live.report",
          { room_id: this.$route.params.id},
          ""
        )
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitData(){
      if (this.fun.isTextEmpty(this.radio)) {
        Toast("请填写违规类型");
        return;
      }
      if (this.fun.isTextEmpty(this.message)) {
        Toast("请您填写描述问题");
        return;
      }
      if (this.fun.isTextEmpty(this.fileList4)) {
        Toast("请上传相关图片");
        return;
      }
      let json = {
        room_id: this.rid,
        report_type: this.radio,
        desc: this.message,
        image: this.fileList4
      };
      $http.post("plugin.room.frontend.live.report-add",json,"")
        .then(response => {
          if (response.result === 1) {
            this.isSubmitData = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onphotosize(e) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          if (e[i].file.size > this.photosize) {
            console.log("图片超出大小",e[i]);
            this.imgPreview(e[i].file, 2);
          }else{
            this.onRead_2(e[i].file, true);
          }
        }
      } else {
        console.log("图片超出大小",e);
        this.imgPreview(e.file, 2);
      }
    },
    imgPreview(file, callback) {
      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 400,
              maxHeight = 400;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过400x400的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth)
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight)
                );
              }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            canvas.toBlob(function (blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                // self.onRead_1(blob, true)
                self.multipleMethod_1(blob, true);
              }
            }, file.type || 'image/png');
          };
        };
      }
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_2(e[i], flag);
        }
      } else {
        this.onRead_2(e, flag);
      }
    },
    // vant 多其他图片上传
    onRead_2(e, flag) {
      var That = this;
      let fd = new FormData();
      if (flag === true) {
        fd.append('file', e);
      } else {
        fd.append('file', e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      fd.append('attach', 'upload');

      // 添加加载提示
      Toast.loading({
        message: '',
        forbidClick: true,
      });
      axios
        .post(this.uploadUrl, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            That.fileList4.push({
              url: responseData.data.img_url
            });
            // if (flag === true) {
            //   That.fileList4.push({
            //     url: URL.createObjectURL(e)
            //   })
            // } else {
            //   That.fileList4.push({
            //     url: URL.createObjectURL(e.file)
            //   })
            // }
            Toast.clear();
          } else {
            Toast(responseData.msg);
            Toast.clear();
          }
        })
        .catch(error => {
          console.log(error);
          Toast.clear();
        });
    },
    removeImg_1: function (delIndex) {
      this.fileList4.splice(delIndex, 1);
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#reportPage {
  padding-top: 40px;
  width: 100%;

  .content {
    .userInfo {
      display: flex;
      padding: 0.875rem 1.5rem;
      background: #fff;
      margin-bottom: 0.625rem;

      .img {
        width: 3rem;
        height: 3rem;
        border-radius: 100%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: fill;
        }
      }

      .leftbox {
        text-align: left;
        display: flex;
        flex-direction: column;
        padding-left: 0.75rem;
        flex: 1;
        overflow: hidden;

        div {
          line-height: 1.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: bold;
          font-size: 1rem;
          color: #000;
        }
      }
    }

    .icon {
      margin: 1rem auto 0.875rem;
      color: #ef3e3e;

      i {
        font-size: 5rem;
      }
    }

    .titelWarn {
      font-size: 0.875rem;
      color: #000;
      font-weight: bold;
      margin-bottom: 0.875rem;
    }

    .selectType {
      text-align: left;
      padding: 0 0.75rem 1rem;
      background: #fff;

      .textareaClass {
        background: #f6f6f6;
        border-radius: 0.375rem;
      }
    }

    .titleDiv {
      height: 2.625rem;
      line-height: 2.625rem;
      font-size: 1rem;
      font-weight: bold;
      color: #333;
    }

    .imgBox {
      .photobox {
        position: relative;
        width: 5rem;
        height: 5rem;
        border: 1px dashed #c0ccda;

        /* float: left; */
        margin-right: 0.2rem;
        margin-left: 0.2rem;
        margin-bottom: 0.2rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .submit {
      width: 85%;
      height: 2.875rem;
      line-height: 2.875rem;
      background: #f53939;
      color: #fff;
      text-align: center;
      margin: 0 auto;
      display: inline-block;
      border-radius: 1.45rem;
      overflow: hidden;
    }
  }
}
</style>
