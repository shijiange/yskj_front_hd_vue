<template>
  <van-dialog
    wrapClassName="dialog-images-manager"
    title="上传图片"
    v-model="visible"
    style="width: 900px;"
    :showConfirmButton="false"
  >
    <!-- dialog-body -->
    <div style="height: 60vh; overflow: auto;">
      <div style="text-align: center;" class="submit_Img">
        <el-upload
          class="avatar-uploader"
          :action="fun.getRealUrl('upload.uploadPic')"
          accept="image/*"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :before-upload="beforeUpload"
        >
          <div class="avatar_box" v-if="thumbnail_url">
            <img :src="thumbnail_url" class="avatar" />
          </div>
          <div v-else class="avatar-uploader-icon">
            <i class="iconfont icon-plus" style="font-size: 50px;"></i>
          </div>
        </el-upload>
      </div>
      <div style="height: 10px;"></div>
      
    </div>
    <div class="van-hairline--top van-dialog__footer">
        <button @click="handle_cancel" type="button" class="van-button van-button--default van-button--large van-dialog__cancel">
          <div class="van-button__content"><span class="van-button__text">取消</span></div></button
        ><button @click="handle_confirm" type="button"  class="van-button van-button--default van-button--large van-dialog__confirm van-hairline--left">
          <div class="van-button__content"><span class="van-button__text">确认</span></div>
        </button>
      </div>
  </van-dialog>
</template>

<script>
export default {
  name: 'images-upload',

  props: {
    // 图片数据
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      //弹框上传图片的路径
      thumbnail_url: '',
      imageUrl: '',
      chooseImg: '',

      //输出的图片链接
      outImg: '',

      radio1: '0', //年
      radio2: '0', //月
      activeName: '1',

      visible: false,
      submit_loading: false,
      // 主页列表
      ImgList: [{}, {}],
      // 主分页的页码
      main_page_pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  watch: {
    value(newVal) {
      // this.imageUrl = newVal;
    }
  },
  methods: {
    show(url = '') {
      this.thumbnail_url = '';
      this.imageUrl = url;
      this.chooseImg = '';
      this.visible = true;
      this.outImg = url;
    },
    /**
     * 弹窗按钮 - 确认
     */
    handle_confirm() {
      console.log(this.thumbnail_url);
      this.outImg = this.thumbnail_url;
      this.$emit('confirm', this.outImg);
      this.visible = false;
    },

    /**
     * 弹窗按钮 - 取消
     */
    handle_cancel() {
      this.visible = false;
    },

    // 输入框值变化
    handle_input_change(e) {
      const url = e.target.value;
      // 判断是否有变更
      if (url === this.outImg) return false;
      // 判断不为空
      if (url != '') {
        // 获取图片大小
        // 	const originalImg = new Image();
        // 	originalImg.src = url;
        // 	originalImg.onload = () => {
        // 		const width = originalImg.width;
        // 		const height = originalImg.height;
        // 		// 检查大小
        // 		const res = this.handle_check_size(Number(width), Number(height));
        // 		if (res) {
        // 			this.$emit("input", url);
        // 		} else {
        // 			e.target.value = "";
        // 			this.$emit("input", "");
        // 			return false;
        // 		}
        // 	};
        // 	originalImg.onerror = () => {
        // 		e.target.value = "";
        // 		this.$emit("input", "");
        // 	};
        // } else {
        this.$emit('input', url);
      }
    },

    callback(key) {
      this.activeName = key;
    },

    uploadSuccess(res, file) {
      if (res.result === 1) {
        this.thumbnail_url = res.data.img_url;
        // this.$message.success('上传成功！')
      } else {
        if (res.msg && res.msg != '') {
          this.$message.error(res.msg);
        }
      }
      this.submit_loading = false;
    },
    beforeUpload(file) {
      this.submit_loading = true;
      // const isLt2M = file.size / 1024 / 1024 < 4;
      // if (!isLt2M) {
      // 	this.$message.error("上传图片大小不能超过 4MB!");
      // 	this.submit_loading = false;
      // }
      // return isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-upload-picture-card-wrapper {
  display: flex;
  justify-content: center;
}

.ant-upload-select-picture-card {
  width: 178px !important;
  height: 178px !important;
}

/* 弹窗上传图片 */
#upload-img {
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .avatar-uploader-box {
    position: relative;
    margin: 20px 0 0 10px;
    width: 110px;
  }

  .icon-close11 {
    position: absolute;
    top: -10px;
    right: 3px;
    color: #999;
    font-size: 18px;
  }
}

/* 上传图片 */

.avatar-uploader .avatar-uploader-icon {
  margin-top: 15px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .avatar-uploader-icon:hover {
  border-color: #29ba9c;
}

.avatar-uploader-icon {
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  font-size: 50px;
  text-align: center;
}

.avatar_box {
  margin: 0 auto;
  width: 200px;

  /* height: 178px; */
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.el-upload-tip {
  width: 178px;
  margin: 0;
  padding: 0;
  color: #999;
  text-align: center;
}

input[type='file'] {
  display: none;
}

.avatar-uploader-box {
  position: relative;
  margin-top: 20px;
  width: 200px;
  display: inline-block;

  .el-icon-circle-close {
    position: absolute;
    top: 10px;
    right: 0;
    color: #999;
  }
}
</style>
<style lang="scss">
.submit_Img .el-upload__input {
  display: none;
}
</style>
