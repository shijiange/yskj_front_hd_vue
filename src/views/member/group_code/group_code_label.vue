<template>
  <div class="page">
    <c-title :text="label_title"></c-title>
    <div class="wrapper" v-show="isLoadingEnd">
      <div class="image">
        <img :src="groupCodeInfoObj.label_banner_img"
             alt="">
      </div>
      <div class="group">
        <div class="image">
          <img v-if="groupCodeInfoObj.member_id && groupCodeInfoObj.has_one_member"
            :src="groupCodeInfoObj.has_one_member.avatar_image" alt="图片无效" />
          <img v-else :src="shop_log" alt="图片无效" />
        </div>
        <div class="content">
          <p class="name">{{groupCodeInfoObj.code_name}}</p>
          <p class="desc">已有{{groupCodeInfoObj.in_number}}人进群</p>
        </div>
        <div class="share"
             @click="openShare">
          <i class="iconfont icon-share"></i>
        </div>
      </div>
      <div class="group_type">
        <div class="group_top">
          <p class="p1">选择群类型</p>
          <p class="p2"
             v-if="groupCodeInfoObj.explain"
             @click="explainFlag = true">说明</p>
        </div>
        <div class="labels">
          <div class="label"
               @click="selectedLabel(item,key)"
               v-for="(item,key) in groupCodeInfoObj.label_data"
               :key="key">
            {{item}}
          </div>
        </div>
      </div>
    </div>

    <van-overlay :show="shareFlag"
                 @click="shareFlag = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-slide-up">
          <div class="shareWrapper"
               v-show="shareFlag"
               @click.stop>
            <div class="imgContent" v-if="qrCodeCanvasSrc">
              <img :src="qrCodeCanvasSrc" alt="">
            </div>
            <div v-else class="divContent">
              <div class="header">
                <div class="userInfo">
                  <div class="image">
                    <img class="img"
                         v-if="groupCodeInfoObj.member_id && groupCodeInfoObj.has_one_member"
                         :src="groupCodeInfoObj.has_one_member.avatar_image"
                         alt="图片无效" />
                    <img class="img"
                         v-else
                         :src="shop_log"
                         alt="图片无效" />
                  </div>
                  <div class="title" v-if="groupCodeInfoObj.group_code">{{groupCodeInfoObj.group_code.code_name}}</div>
                </div>
                <div class="desc" v-if="groupCodeInfoObj.group_code">
                  {{groupCodeInfoObj.group_code.code_guide}}
                </div>
              </div>
              <div class="footer">
                <share-canvas class="canvas"
                              ref="share_canvas"></share-canvas>
              </div>
            </div>

            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle"
                 @click="shareFlag = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <van-overlay :show="explainFlag" :lock-scroll="false"
                 @click="explainFlag = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-slide-up">
          <div class="explainWrapper"
               v-show="explainFlag"
               @click.stop>
            <div class="header">
              <div class="title">说明</div>
              <i class="iconfont icon-guanbi"
                 @click="explainFlag = false"></i>
            </div>
            <div class="content"
                 v-html="groupCodeInfoObj.explain_content">

            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

  </div>
</template>

<script>
import groupCodeLabelController from './group_code_label_controller.js';

export default groupCodeLabelController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background-color: #fff;
    min-height: 100vh;
    padding-bottom: 3.0625rem;
  }

  .wrapper {
    padding-top: 0.3rem;
    padding-left: 0.781rem;
    padding-right: 0.781rem;

    .image {
      display: flex;
      justify-content: center;
      // height: 10rem;
      width: 100%;

      img {
        width: 21.875rem;
        height: 0 auto;
        border-radius: 0.531rem;
      }
    }

    .group {
      display: flex;
      margin-top: 0.75rem;

      .image {
        width: 3.75rem;
        height: 3.75rem;
        background-color: #f6f6f6;
        border-radius: 0.125rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        margin-left: 1rem;
        padding-top: 0.344rem;
        padding-bottom: 0.025rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        text-align: left;

        .name {
          font-size: 1rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.05rem;
          color: #000;
        }

        .desc {
          font-size: 0.75rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0;
          color: #666;
        }
      }

      .share {
        padding-right: 0.563rem;
        padding-top: 0.375rem;
      }
    }

    .group_type {
      margin-top: 1.594rem;

      .group_top {
        display: flex;
        justify-content: space-between;

        .p1 {
          font-size: 1rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.05rem;
          color: #000;
        }

        .p2 {
          padding-right: 0.531rem;
          font-size: 0.875rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.044rem;
          color: #666;
        }
      }

      .labels {
        display: flex;
        flex-wrap: wrap;

        .label {
          margin-top: 1.344rem;
          margin-left: 0.813rem;
          margin-right: 0.813;
          padding: 0.9rem 1.3rem 1.03rem 1.25rem;
          background-color: rgba(217, 243, 234, 0.5);
          border-radius: 0.875rem;
          font-size: 1rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.05rem;
          color: #00b075;
        }
      }
    }
  }

  .explainWrapper {
    width: 21.25rem;
    max-height: 22.625rem;
    background-color: #fff;
    border-radius: 1.531rem;
    padding-bottom: 3rem;
    transition: 0.3s;
    padding-top: 0.5rem;

    .header {
      height: 2.596rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .img {
        width: 2.25rem;
        height: 2.25rem;
        margin-right: 0.625rem;

        img {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
        }
      }

      .title {
        font-size: 1rem;
        letter-spacing: 0.05rem;
        color: #000;
      }

      .icon-guanbi {
        position: absolute;
        top: 0.875rem;
        right: 1.25rem;
        color: #000;
      }
    }

    .content {
      max-height: 11rem;
      padding-top: 0.562rem;
      font-size: 0.875rem;
      letter-spacing: 0.066rem;
      color: #666;
      padding-left: 1.049rem;
      padding-right: 1.469rem;
      text-align: left;
      overflow-y: auto;
      // text-indent: 1.75rem;
      // line-height: 1.5rem;
    }

    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 14rem;

      img {
        width: 13rem;
        height: 13rem;
      }
    }

    .kf_guide {
      max-height: 3rem;
      padding-top: 0.506rem;
      padding-left: 2.688rem;
      padding-right: 2.688rem;
      font-size: 0.875rem;
      letter-spacing: 0;
      color: #666;
      overflow-y: scroll;
    }
  }

  .shareWrapper {
    height: 29rem;
    width: 18rem;

    .imgContent {
      width: 18rem;
      height: 25rem;

      img {
        width: 18rem;
        height: 25rem;
      }
    }

    .divContent {
      width: 18rem;
      height: 25rem;
      padding: 3rem 1rem;
      background-image: url(../../../assets/images/member/qhm_sharepicbg@2x.png);
      background-size: cover;

      .header {
        height: 8rem;
        width: 16rem;

        .userInfo {
          display: flex;
          align-items: center;
          padding: 1rem 0 0 1rem;

          .image {
            .img {
              width: 2rem;
              height: 2rem;
              border-radius: 50%;
            }
          }

          .title {
            margin-left: 1rem;
            font-size: 1rem;
            color: #333;
          }
        }

        .desc {
          height: 4rem;
          text-align: left;
          padding: 0.3rem 1rem 2rem 1rem;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          // display: -webkit-box;
          // -webkit-line-clamp: 3;
          // line-clamp: 3;
          // -webkit-box-orient: vertical;
        }
      }

      .footer {
        width: 7rem;
        height: 7rem;
        margin-top: 2rem;
        margin-left: 1rem;
        background-color: red;

        .canvas {
          width: 7rem;
          height: 7rem;
        }
      }
    }

    .close {
      height: 4rem;
      display: flex;
      align-items: flex-end;
      justify-content: center;

      .icon-adsystem_icon_cancle {
        font-size: 3rem;
        color: #fff;
        width: 3rem;
        height: 3rem;
      }
    }
  }

</style>
