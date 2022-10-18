<template>
  <div id="baseInfo">
    <!-- 主内容区域 -->
    <div v-if="showBox == 'main'">
      <c-title :hide="false" :text="(shoplang?shoplang:'微店')+'设置'"></c-title>

      <ul class="nav">
        <li @click="changeActive(true)" :class="{ active22: showInfo }">
          基本信息
        </li>
        <li @click="changeActive(false)" :class="{ active22: !showInfo }">
          自选商品
        </li>
      </ul>

      <!-- 基本信息板块 -->
      <div v-if="showInfo" class="info">
        <div class="list">
          <div
            class=" tou2"
            @click="manageShop()"
            style="border-bottom: solid 0.0625rem #ebebeb;"
          >
            <span>商品管理</span>
            <i class="fa fa-angle-right"></i>
          </div>
          <div class=" tou2" @click="changeShowBox('店招背景')">
            <span>店招背景</span>
            <i class="fa fa-angle-right"></i>
          </div>
        </div>

        <li>
          个性签名
          <textarea
            name="个性签名"
            id="个性签名"
            cols="30"
            rows="10"
            v-model="shopModle.signature"
            maxlength="120"
          ></textarea>
        </li>
        <div class="btn" @click="changeActive(false, 1)">
          确 定
        </div>
      </div>

      <!-- 自选商品板块 -->
      <div v-else class="selectGoods">
        <div class="content">
          <img :src="bannerImg" alt="" />
        </div>
        <router-link :to="fun.getUrl('micro_shop_add_category')">
          <div class="add">
            <div>
              <i>+</i>
              <span class="font">&nbsp;&nbsp;选择 商品</span>
            </div>
          </div>
        </router-link>

        <p>
         {{ `店主可以通过选择商品就可以生成${(shoplang?shoplang:'微店')}，将${(shoplang?shoplang:'微店')}分享给好友，好友通过自己的${(shoplang?shoplang:'微店')}链接进入购买商品就可以获得分红啦~`}}
          <br />{{`快去选择您的${(shoplang?shoplang:'微店')}商品吧！`}}
        </p>
      </div>
    </div>

    <div class="popupInput" v-else-if="showBox == 'upLoadBox'">
      <c-title :hide="false" text="店招背景"></c-title>
      <div style="width: 100%; height: 2.5rem;"></div>
      <div class="m_header">
        <span class="iconfont icon-left" @click="closePopInput()"></span>
        修改{{ changeType }}
      </div>
      <div class="inputBox">
        <van-uploader
          :after-read="onRead"
        >
          <img
            v-if="bgImg"
            :src="
              bgImg == '0'
                ? require('../../../assets/images/mircro_img.png')
                : bgImg
            "
            class="avatar"
          />
          <div v-else style="width: 100%; height: 100%;"></div>
        </van-uploader>
      </div>
      <div class="notes"><p>请上传不大于4M的jpeg或者png格式的图片。</p></div>
      <div class="bottom-btn">
        <van-uploader
          class="bg-btn"
          :after-read="onRead"
        >
          <em>更换背景</em>
        </van-uploader>
        <button @click="closePopInput">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import baseInfo_controller from "./baseInfo_controller";
export default baseInfo_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#baseInfo {
  .bottom-btn {
    margin-top: 1.25rem;

    .bg-btn,
    button {
      margin-top: 0.625rem;
      width: 80%;
      height: 2.25rem;
      border: solid 0.0625rem #ccc;
      border-radius: 0.25rem;
      margin-left: 10%;
      color: #333;
      line-height: 2.25rem;
      text-align: center;
    }
  }

  /* 上传头像的样式 */
  .avatar-uploader .el-upload {
    border: 0.0625rem dashed #d9d9d9;
    border-radius: 0.375rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 11.125rem;
    height: 11.125rem;
    line-height: 11.125rem;
    text-align: center;
  }

  .avatar {
    width: 100%;
    max-height: 16rem;
    display: block;
  }

  position: relative;
  width: 100%;
  height: 100%;

  .popupInput {
    position: relative;
    text-align: left;

    .notes {
      width: 100%;
      background-color: #ebebeb;
      height: 2.5rem;
      padding: 0 0.75rem;
    }

    p {
      color: #f15353;
      line-height: 2.5rem;
      font-size: 14px;
    }

    .inputBox {
      background: #fff;
      height: 15.625rem;

      .avatar-uploader {
        position: relative;

        i {
          font-style: normal;
          position: absolute;
          top: 0.9375rem;
          color: blue;
          right: 0.9375rem;
        }

        div {
          width: 5rem;
          height: 5rem;
          background: rgb(241, 83, 83);
        }

        img {
          width: 100%;
        }
      }
    }

    span {
      display: inline-block;
      margin-right: 1.875rem;
    }
  }

  .m_header {
    width: 100%;
    height: 2.5rem;
    padding: 0 0.75rem;
    box-sizing: border-box;
    border-bottom: solid 0.0625rem #e2e2e2;
    line-height: 2.5rem;
    text-align: left;
    font-size: 14px;

    button {
      color: #fff;
      background: green;
      border-radius: 0.25rem;
      width: 3.75rem;
      border: none;
      font-size: 12px;
      float: right;
      line-height: 2.25rem;
    }

    span {
      display: inline-block;
      float: left;
      font-size: 28px;
    }

    i {
      font-size: 14px;
      float: right;
      font-style: normal;
    }
  }

  .nav {
    padding: 0.9375rem 0.75rem;

    li {
      width: calc(50% - 0.125rem);
      display: inline-block;
      text-align: center;
      font-size: 14px;
      line-height: 2.5rem;
      background: #fff;
      color: #f15353;
    }

    li:first-child {
      border-radius: 0.3125rem 0 0 0.3125rem;
    }

    li:last-child {
      border-radius: 0 0.3125rem 0.3125rem 0;
    }
  }

  .info {
    li::after {
      content: "";
      display: block;
      clear: both;
    }

    li:first-child {
      border-bottom: 0.0625rem solid #ccc;
    }

    li {
      padding: 0.75rem;
      font-size: 14px;
      text-align: left;
      background: #fff;
      line-height: 1.25rem;
      margin-top: 0.625rem;

      .right {
        float: right;
        text-align: right;
        border: none !important;

        .img {
          width: 2.1875rem;
          height: 2.1875rem;
          border: none !important;

          img {
            width: 2.1875rem;
            height: 2.1875rem;
            vertical-align: middle;
            border: 0;
            margin-top: -0.1875rem;
          }
        }
      }

      input {
        width: 70%;
        border: none;
        outline: none;
        line-height: 1.25rem;
        float: right;
        text-align: right;
        font-size: 14px;
        position: relative;
        top: -0.125rem;
      }
    }

    .tou {
      line-height: 2.25rem;
      padding-bottom: 0.625rem;
    }

    .list {
      padding-left: 0.75rem;
      background-color: #fff;

      .tou2 {
        height: 2.75rem;
        padding-right: 0.75rem;

        span {
          line-height: 2.75rem;
          float: left;
          font-size: 15px;
          color: #333;
        }

        i {
          line-height: 2.75rem;
          float: right;
          font-size: 1.5rem;
          color: #c9c9c9;
        }
      }
    }

    textarea {
      width: 100%;
      height: 7.5rem;
      border: solid 0.0625rem #e2e2e2;
      background-color: #f9f9f9;
      border-radius: 0.25rem;
      line-height: 1.5rem;
      padding: 0.625rem;
      color: #8c8c8c;
      margin-top: 0.75rem;
    }

    .btn {
      margin: 1.25rem auto;
      border-radius: 0.25rem;
      width: 80%;
      height: 2.875rem;
      line-height: 2.875rem;
      text-align: center;
      background: #f15353;
      font-size: 16px;
      color: #fff;
    }
  }

  .selectGoods {
    overflow: hidden;

    .selectedGood {
      li {
        float: left;
        width: 2.5rem;
        margin: 0.625rem;

        img {
          width: 2.5rem;
        }
      }
    }

    .selectedGood::after {
      content: "";
      display: block;
      clear: both;
    }

    .content {
      font-size: 14px;
      background: #fff;
      text-align: center;

      img {
        width: 100%;
      }
    }

    p {
      padding: 0 0.9375rem;
    }

    .add {
      width: 100%;
      box-sizing: border-box;
      padding: 1.25rem;

      div {
        width: 80%;
        font-size: 16px;
        color: #fff;
        background-color: #f15353;
        margin: 0 auto;
        border-radius: 0.25rem;
        height: 2.5rem;

        i {
          font-size: 1.5rem;
          display: inline-block;
          top: 0.125rem;
          position: relative;
          z-index: 22;
        }

        .font {
          line-height: 2.5rem;
        }
      }
    }

    .btn {
      margin: 1.25rem auto;
      border-radius: 0.25rem;
      width: 80%;
      padding: 0.75rem;
      text-align: center;
      background: #f15353;
      font-size: 20px;
      color: #fff;
    }

    p {
      margin-top: 0.9375rem;
      line-height: 1.25rem;
      text-align: left;
      font-size: 12px;

      /* padding: 15px; */
    }
  }
}

.active22 {
  color: #fff !important;
  background: #f15353 !important;
}
</style>
