<template>
    <div class="editor-viewer">
      <div class="content-viewer">
        <div class="content-list">
          <div v-for="(content, index) in contentList" class="editor-item" :key="index" :tabindex="index" @click="handleClick(index, content)">
              <van-field class="textarea"
                 v-model="content.value"
                 v-if="content.type === 'text'"
                 rows="2" autosize type="textarea"
                 placeholder="给商品添加介绍吧..."
              ></van-field>
              <img v-if="content.type === 'image'" :src="content.value" />
              <div class="editor-item-ops" v-if="content.visible">
                <div class="ops-btn btn-arrow-down" v-if="contentList.length > 1 && index !== contentList.length - 1" @click="moveDown(index)">下移</div>
                <div class="ops-btn btn-arrow-up" v-if="contentList.length > 1 && index !== 0" @click="moveUp(index)">上移</div>
                <div class="ops-btn btn-add" @click="handlerInser(index)">添加</div>
                <div class="ops-btn btn-delete" @click="delOne(index)">删除</div>
              </div>
          </div>
        </div>
      </div>

      <div class="editor-btn-viewer">
        <div class="editor-opt-btns">
          <div class="right">
            <van-uploader
              ref="uploadImg"
              :after-read="onRead_1"
              :before-read="beforeImageUpload"
            >
              <i class="iconfont icon-customform_list_3"></i>
            </van-uploader>
            <i class="iconfont icon-ht_textstyle_blod editor-btn" @click="addAtLast"></i>
          </div>
          <div class="save-btn" @click="saveEdit">保存</div>
        </div>
      </div>

      <van-action-sheet v-model="showAction" :actions="actions" @select="onSelect" />
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
  props: ["contents"],
  data() {
    return {
      contentList: [{ type: 'text', value: '', visible: false }],
      showAction: false,
      actions: [{ name: '文字', type: 'text'}, { name: '图片', type: 'image'}],
    };
  },

  methods: {
    //公共的移动方法
    spliceContent(start, count, added) {
      if (typeof added !== "undefined") {
        return this.contentList.splice(start, count, added);
      } else {
        return this.contentList.splice(start, count);
      }
    },
    //绑定文本修改
    changeText(index, e) {
      this.contentList[index].value = e.target.innerHTML;
    },
    //操作按钮移入时显示
    handleClick(index) {
      this.contentList.forEach((item, currentInd) => {
        this.$set(item, 'visible', (currentInd === index));
      });
    },
    //向下移
    moveDown(index) {
      let cur = this.spliceContent(index, 1);
      this.spliceContent(index + 1, 0, cur[0]);
    },
    //向上移
    moveUp(index) {
      let cur = this.spliceContent(index, 1);
      this.spliceContent(index - 1, 0, cur[0]);
    },
    //删除内容
    delOne(index) {
      this.spliceContent(index, 1);
    },
    // 插入内容
    handlerInser (index) {
      this.showAction = true;
      this.insertIndex = index;
    },
    onSelect (item) {
      this.showAction = false;
      if (item.type === "text") {
        this.spliceContent(this.insertIndex + 1, 0, { type: 'text', value: '', visible: false });
      } else {
        this.$refs.uploadImg.isInsert = true;
        this.$refs.uploadImg.chooseFile();
      }
    },
    //添加内容
    addAtLast() {
      this.contentList.push({ type: "text", value: '', visible: false });
    },

    onRead_1(e, flag) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios.post(this.fun.getRealUrl("upload.uploadPic"),fd,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      )
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            let imageUrl = responseData.data.img_url;
            let insertIndex = That.$refs.uploadImg.isInsert ? That.insertIndex + 1 : That.contentList.length;
            That.spliceContent(insertIndex, 0, { type: "image", value: imageUrl, visible: false });
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
          That.$refs.uploadImg.isInsert = false;
        })
        .catch(error => {
          That.$refs.uploadImg.isInsert = false;
          Toast.clear();
        });
    },
    beforeImageUpload(file) {
      const isJPG = (file.type === "image/jpeg") || (file.type === "image/png");
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$toast("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$toast("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //提交信息
    saveEdit() {
      if (this.contentList.length <= 1 && !this.contentList[0].value) {
        return this.$toast("请先给商品添加介绍吧");
      }
      let jsonStr = '';
      this.contentList.forEach((per, ind) => {
        if (per.type === 'text') {
          jsonStr += `<p>${per.value}</p>`;
        }
        if (per.type === 'image') {
          jsonStr += `<img src="${per.value}"></img>`;
        }
      });
      this.$emit("saveEdit", jsonStr);
    },
  },

  components: {}
};
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.editor-viewer {
  position: relative;
  width: 100%;
  margin-top: 1rem;
  padding-bottom: 50px;
  overflow-y: auto;
  .content-viewer {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    .content-list {
      padding: 5px;
      .editor-item {
        position: relative;
        min-height: 8rem;
        padding: 0.5rem;
        margin-bottom: 2.7rem;
        border-radius: 0.31rem;
        background-color: #f7f7f7;
        overflow: visible !important;
        .textarea, img {
          width: 100%;
          height: auto;
          min-height: 70px;
          text-align: left;
          padding: 8px;
          color: #666666;
          font-size: 13px;
        }
        .textarea {
          min-height: 8rem;
          line-height: 22px;
          outline: 0px;
          background-color: #f7f7f7;
          border: none;
          -webkit-user-select: text;
        }
        .editor-item-ops {
          position: absolute;
          display: flex;
          text-align: left;
          height: 1.44rem;
          right: 6px;
          bottom: -2.4rem;
          z-index: 100;
          .ops-btn {
            height: 1.44rem;
            line-height: 1rem;
            margin-left: 0.3rem;
            padding: 0.2rem 1rem;
            border-radius: 0.13rem;
            color: #ffffff;
          }
          .grey {
            color: #c9c9c9;
          }
          .btn-arrow-down, .btn-arrow-up{
            background-color: #28b2fa;
          }
          .btn-add {
            background-color: #f27c1c;
          }
          .btn-delete {
            background-color: #f15353;
          }
        }
      }
      .editor-item:hover {
        box-shadow: 0 0 10px #ccc;
      }

    }
  }
}


.editor-btn-viewer {
  z-index: 999;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #ffffff;
	box-shadow: 0rem -0.12rem 0.5rem 0rem rgba(202, 202, 202, 0.51);
  .right {
    flex: 1;
    text-align: left;
  }
  .editor-opt-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 1rem;
  }
  .save-btn {
    padding: 0.5rem 3rem;
    color: #ffffff;
    background-color: #f15353;
    border-radius: 1.03rem;
    white-space: nowrap;
  }
  .icon-customform_list_3 {
    font-size: 22px;
    color: #9a9a9a;
  }
  .icon-ht_textstyle_blod {
    font-size: 21px;
    color: #9a9a9a;
  }
  .editor-btn {
    display: inline-block;
    margin-left: 1rem;
  }
  .editor-btn:hover {
    color: #409eff;
    background-color: #ecf5ff;
  }
}
</style>