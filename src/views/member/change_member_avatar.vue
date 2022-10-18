<template>
  <div class="cropper-content">
    <c-title :hide="false" text="更换头像"></c-title>
    <div class="cropper-box">
      <div class="cropper"  style="width:100%;">
        <vue-cropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :info="option.info"
            :canScale="option.canScale"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :full="option.full"
            :fixedBox="option.fixedBox"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :centerBox="option.centerBox"
            :height="option.height"
            :infoTrue="option.infoTrue"
            :maxImgSize="option.maxImgSize"
            :enlarge="option.enlarge"
            :mode="option.mode"
            @realTime="realTime"
            @imgLoad="imgLoad">
        </vue-cropper>
      </div>
      <!--底部操作工具按钮-->
      <div class="footer-btn">
        <div class="scope-btn">
          <van-button size="normal" type="default" icon="plus"  @click="changeScale(1)">放大</van-button>
          <van-button size="normal" type="default" icon="minus" @click="changeScale(-1)">缩小</van-button>
          <van-button size="normal" type="default"  @click="rotateLeft">↺ 左旋转</van-button>
          <van-button size="normal" type="default"  @click="rotateRight">↻ 右旋转</van-button>
        </div>
        <div class="upload-btn">
          <div  class="btn_box">
            <label class="btn" for="uploads">选择图片</label>
            <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)">
          </div>
          <van-button class="upload_btn"  size="large" type="primary" @click="uploadImg('blob')">上传头像 <i class="el-icon-upload"></i></van-button>
        </div>
      </div>
    </div>
    <!--预览效果图-->
    <div class="show-preview"  v-if="false">
      <div :style="previews.div" class="preview">
        <img :src="previews.url" :style="previews.img">
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
export default {
  data() {
    return {
      name:this.Name,
      previews: {},
      option:{
        img: '',             //裁剪图片的地址
        outputSize: 1,       //裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'jpeg',  //裁剪生成图片的格式（jpeg || png || webp）
        info: true,          //图片大小信息
        canScale: true,      //图片是否允许滚轮缩放
        autoCrop: true,      //是否默认生成截图框
        autoCropWidth: 300,  //默认生成截图框宽度
        autoCropHeight: 300, //默认生成截图框高度
        fixed: true,         //是否开启截图框宽高固定比例
        fixedNumber: [1, 1], //截图框的宽高比例
        full: false,         //false按原比例裁切图片，不失真
        fixedBox: true,      //固定截图框大小，不允许改变
        canMove: false,      //上传图片是否可以移动
        canMoveBox: true,    //截图框能否拖动
        original: false,     //上传图片按照原始比例渲染
        centerBox: false,    //截图框是否被限制在图片里面
        height: true,        //是否按照设备的dpr 输出等比例图片
        infoTrue: false,     //true为展示真实输出图片宽高，false展示看到的截图框宽高
        maxImgSize: 3000,    //限制图片最大宽度和高度
        enlarge: 1,          //图片根据截图框输出比例倍数
        mode: '100%  auto'  //图片默认渲染方式
      }
    };
  },
  mounted() {
  },
  methods: {
    //初始化函数
    imgLoad (msg) {
      console.log("工具初始化函数====="+msg);
    },
    //图片缩放
    changeScale (num) {
      this.$refs.cropper.changeScale(num);
    },
    //向左旋转
    rotateLeft () {
      this.$refs.cropper.rotateLeft();
    },
    //向右旋转
    rotateRight () {
      this.$refs.cropper.rotateRight();
    },
    //实时预览函数
    realTime (data) {
      this.previews = data;
    },
    //选择图片
    selectImg (e) {
      let file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          message: '图片类型要求：jpeg、jpg、png',
          type: "error"
        });
        return false;
      }
      //转化为blob
      let reader = new FileReader();
      reader.onload = (e) => {
        let data;

        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.option.img = data;
      }
      //转化为base64
      reader.readAsDataURL(file);
    },
    //上传图片
    uploadImg (type) {
      let _this = this;
      if (type === 'blob') {
        //获取截图的blob数据
        this.$refs.cropper.getCropBlob(async (data) => {
          let formData = new FormData();
          formData.append('file',data,"DX.jpg");
          console.log(formData.get('file'));
          
          //调用axios上传
         axios.post(this.fun.getRealUrl("upload.uploadAvatar"), formData, {
          headers: { "Content-Type": "multipart/form-data" }
        }).then(
                function(response) {
                 // console.log(response.data.result);
                  if (response.data.result == 1) {
                    Toast("上传成功");
                    setTimeout(() => {
                      _this.$router.push(_this.fun.getUrl("member"));
                    }, 2000);
                  } else {
                    Toast("上传失败！");
                  }
          }
        );

          //let {data: res} = await _this.$http.post('/api/file/imgUpload',formData,config);
         //if(res.result === 1){
            //Toast("上传成功");
            //let data = res.data.replace('[','').replace(']','').split(',');
            //let imgInfo = {
              //name : _this.Name,
              //url : data[0]
            //};
            //_this.$emit('uploadImgSuccess',imgInfo);
          //}else {
            //Toast("文件服务异常！");
          //}
        })
      }
    },
},
components: { cTitle }
}
</script>

<style scoped lang="scss">
.cropper-content{
  .cropper-box{
    width: 100%;
    .cropper{
      width: auto;
      height: 300px;
    }
  }

  .show-preview{
    margin-top:20px;
    .preview{
      width:100%;
      overflow: hidden;
      background: #cccccc;
      margin:0 auto;
      img{width:100%;height:auto;}
    }
  }
  .vue-cropper{
    background-repeat:repeat;
  }
}
.footer-btn{
  margin-top: 30px;
  .scope-btn{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
  }
  .upload-btn{
    display: flex;
    display: -webkit-flex;
    margin-top:20px;
    .btn_box{
      flex:1;
      .btn {
        outline: none;
        /* display: inline-block; */
        line-height: 44px;
        white-space: nowrap;
        cursor: pointer;
        -webkit-appearance: none;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        outline: 0;
        -webkit-transition: .1s;
        transition: .1s;
        font-weight: 500;
        /* padding: 8px 15px; */
        font-size: 16px;
        border-radius: 3px;
        color: #fff;
        background-color: #409EFF;
        border-color: #409EFF;
        margin-right: 10px;
        height: 44px;
        display: block;
      }
    }
    .upload_btn{
      flex:1;
      height:44px;
    }
  }

}
</style>

