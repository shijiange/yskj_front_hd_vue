<template>
  <div id="circleIssue">
    <c-title :hide="false" :text="'发布'"></c-title>
    <!-- <div class="cline"></div> -->
    <!-- 头部 -->
    <div class="member" :style="{ 'background-image': 'url(' + bg_img + ')' }">
      <div class="memberUser">
        <van-image :src="circle_img" class="headimg" round fit="cover" />
        <van-uploader
          :after-read="onRead(true)"
          class="edit"
        >
          <van-button>编辑</van-button>
        </van-uploader>
      </div>
      <van-uploader
        :after-read="onRead(false)"
        class="backUpload"
      >
        <van-button icon="plus">上传背景</van-button>
      </van-uploader>
    </div>
    <!-- 中部 -->
    <div class="fromAdd">
      <div class="tip">注：头像建议尺寸 90*90px,背景图建议尺寸 750*294px</div>
      <div class="fromlis">
        <div class="left">圈子名称</div>
        <div class="right">
          <input type="text" v-model="name" placeholder="请输入圈子名称" />
        </div>
      </div>
      <!-- 分类选择 -->
      <div class="fromlis">
        <van-cell is-link title="分类" @click="show = true" class="classify" />
        <p class="hint" @click="show = true">{{ cateName }}</p>
      </div>
      <!-- 简介 -->
      <div class="fromlisa">
        <div class="left">简介</div>
        <van-field
          v-model="synopsis"
          rows="2"
          autosize
          type="textarea"
          placeholder="请输入圈子简介~"
          show-word-limit
        />
      </div>
      <div class="fromlis">
        <div class="left">圈子类型</div>
        <div class="rightRadio">
          <div class="radioOne" @click="is_toll = 0">
            <div :class="[is_toll == 0 ? 'cirle' : 'cirleT']">
              <div :class="[is_toll == 0 ? 'incirle' : 'incirleT']"></div>
            </div>
            <span>免费</span>
          </div>
          <div class="radioOne" @click="is_toll = 1">
            <div :class="[is_toll == 1 ? 'cirle' : 'cirleT']">
              <div :class="[is_toll == 1 ? 'incirle' : 'incirleT']"></div>
            </div>
            <span>付费</span>
          </div>
        </div>
      </div>
      <div class="fromlis" v-if="is_toll == 1">
        <div class="left">费用</div>
        <div class="right">
          <input type="text" v-model="price" placeholder="请输入加入费用" />
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="base">
      <!-- 复选框单选 -->
      <div class="agreement">
        <van-checkbox
          v-model="agree"
          class="c-checkbox"
          checked-color="#f15353"
          icon-size="1.2rem"
        >阅读并同意</van-checkbox>
        <span @click="protocolshow=!protocolshow">《创建圈子协议》</span>
      </div>
      <!-- 提交 -->
      <div class="sumbit" @click="createCircle">提交</div>
    </div>
    <van-popup v-model="protocolshow" position="bottom" style="width: 100vw; height: 75vh;" round>
      <div class="circle-protocal">
        <!-- <div class="circle-protocal-close">
          <van-icon name="close" />
        </div> -->
        <div class="content" v-html="circleProtocol"></div>
      </div>
    </van-popup>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>

<script>
import circleIssue_controller from "./circleIssue_controller";

export default circleIssue_controller;
</script>

<style>
.circle-protocal .content {
  padding: 0.625rem;
  width: 100%;
  overflow: hidden;
  word-break: break-all;
  text-align: left;
}

.circle-protocal img {
  max-width: 100%;
}

.circle-protocal-close {
  position: fixed;
  right: 10px;
  top: 26vh;
  background-color: white;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
#circleIssue {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #f2f2f2;
  // position: relative;
  // 中部
  .fromAdd {
    width: 21.56rem;
    margin: 0 auto;
    border-radius: 0.63rem;
    background: #fff;
    padding: 0.84rem 0.81rem;
    transform: translateY(-2.5rem);

    .tip {
      font-size: 0.63rem;
      color: #999;
      text-align: left;
    }
    // 简介
    .fromlisa {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .left {
        margin-bottom: 0.78rem;
        margin-top: 1.22rem;
        font-size: 0.94rem;
        color: #202020;
        font-weight: bold;
      }

      /deep/ .van-cell {
        background-color: #f7f7f7;
        height: 7.438rem;
      }
    }

    .fromlis {
      display: flex;
      justify-content: space-between;
      height: 2.97rem;
      align-items: center;
      border-bottom: #f2f2f2 solid 1px;

      .rightRadio {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .cirle {
          width: 0.94rem;
          height: 0.94rem;
          border: solid 0.06rem #f15353;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .incirle {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #f15353;
            border-radius: 100%;
          }
        }

        .cirleT {
          width: 0.94rem;
          height: 0.94rem;
          border: solid 0.06rem #999;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .incirleT {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #999;
            border-radius: 100%;
          }
        }

        .radioOne {
          display: flex;
          align-items: center;
          margin-left: 1.09rem;

          span {
            margin-left: 0.34rem;
            font-size: 0.94rem;
          }
        }
      }

      .left {
        font-size: 0.94rem;
        font-weight: bold;
      }

      .right {
        flex: 1;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .van-icon {
          color: #646464;
        }

        input {
          width: 70%;
          border: none;
          text-align: right;
        }
      }

      /deep/ .classify {
        position: relative;
        display: flex;
        padding: 0 0 0 0;
        justify-content: space-between;

        .van-cell__title {
          // border: 1px solid #000;
          flex: none;
          font-size: 0.938rem;
          font-weight: bold;
          font-stretch: normal;
          letter-spacing: 0;
          color: #202020;

          .van-icon {
            color: #646464;
          }
        }
      }

      .hint {
        // width:100%;
        height: 0.938rem;
        font-size: 0.938rem;
        font-weight: bold;
        font-stretch: normal;
        letter-spacing: 0;
        color: #b7b7b7;
        position: absolute;
        right: 1.656rem;
        top: 5.55rem;
      }
    }
  }
  // 头部
  .member {
    width: 100%;
    height: 9rem;
    background-size: 100%;
    border-bottom-left-radius: 60% 15%;
    border-bottom-right-radius: 60% 15%;
    overflow: hidden;
    position: relative;
    // 上传背景图
    /deep/ .backUpload {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 1.34rem;
      right: 0.94rem;
      padding: 2px;
      font-size: 0.63rem;
      color: #fff;
      // width: 4.25rem;
      // height: 1.344rem;
      border-radius: 0.125rem;
      border: solid 0.031rem #fff;

      .van-uploader__wrapper {
        height: 100%;

        .van-uploader__input-wrapper {
          height: 100%;

          button {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0;
            transform: scale(0.8);
            margin: 0;
            background: none;
            border: none;
            font-size: 0.6rem;
            color: #fff;

            .van-button__content {
              width: 100%;
            }
          }
        }
      }

      .van-uploader__preview {
        display: none;
      }
    }
    // 上传头像
    .memberUser {
      margin-top: 1.4rem;
      text-align: left;
      padding-left: 2rem;
      // 头像
      /deep/ .headimg {
        display: block;
        width: 2.94rem;
        height: 2.94rem;
        border-radius: 50%;
      }
      // 编辑文字
      /deep/ .edit {
        .van-button {
          height: 100%;
          margin-left: 0.5rem;
          margin-top: -0.2rem;
        }

        .van-button--normal {
          padding: 0;
          font-size: 0.875rem;
          color: #fff;
        }

        .van-button--default {
          border: none;
          // opacity: 0.8;
          background: none;
        }

        .van-uploader__preview {
          display: none;
        }
      }
    }
  }
  // 底部
  .base {
    margin: 0 auto;
    width: 21.563rem;
    //同意协议
    .agreement {
      display: flex;
      align-items: center;

      span {
        height: 0.594rem;
        line-height: 0.594rem;
        color: #3175fe;
        font-weight: bold;
        font-size: 14px;
        margin-left: 0.5rem;
        display: block;
        margin-top: 0.08rem;
      }

      a {
        font-size: 0.625rem;
        font-weight: normal;
        color: #f15353;
        height: 0.594rem;
        line-height: 0.594rem;
        display: block;
        // margin-top: 0.09rem;
      }
    }
    // 提交
    .sumbit {
      width: 19.125rem;
      height: 2.5rem;
      background-color: #3175fe;
      border-radius: 1.25rem;
      margin-left: 1.219rem;
      margin-top: 0.938rem;
      text-align: center;
      font-size: 0.938rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 2.5rem;
      letter-spacing: 0;
      color: #fff;
    }
  }

  .cline {
    width: 100%;
    height: 2.5rem;
  }
}

input::-webkit-input-placeholder {
  font-size: 0.94rem;
  font-weight: bold;
  color: #b7b7b7;
}

input:-moz-placeholder {
  font-size: 0.94rem;
  font-weight: bold;
  color: #b7b7b7;
}

input::-moz-placeholder {
  font-size: 0.94rem;
  font-weight: bold;
  color: #b7b7b7;
}

input::-ms-input-placeholder {
  font-size: 0.94rem;
  font-weight: bold;
  color: #b7b7b7;
}

img {
  margin: 0;
}

.van-cell::after {
  border-bottom: none;
}
</style>
