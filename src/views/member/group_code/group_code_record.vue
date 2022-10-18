<template>
  <div class="page">
    <c-title text="记录"></c-title>
    <div class="wrapper">
        <div class="items">
          <van-swipe-cell v-for="(item,index) in listData"
                          :key="index">
            <div class="item"
                 @click="gotoGroupCodeLabel(item)">
              <div class="info">
                <div class="id">ID:{{item.id}}</div>
                <p class="time">{{item.created_at}}</p>
              </div>
              <div class="content">
                {{item.code_name}}
              </div>
              <div class="btns">
                <div class="btn share"
                     @click.stop="openShare(item)">分享</div>
                <div class="btn data"
                     @click.stop="gotoGroupCodeData(item)">数据</div>
              </div>
            </div>
            <template #right>
              <div class="optBtns">
                <div class="optBtn edit"
                     @click="gotoGroupCodeEdit(item)">编辑</div>
                <div class="optBtn del"
                     @click="delGroupCode(item)">删除</div>
              </div>
            </template>
          </van-swipe-cell>
          <van-empty v-if="listData.length==0"
                     description="暂无记录" />
        </div>
    </div>

    <van-overlay :show="shareFlag"
                 @click="shareFlag = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-slide-up">
          <div class="shareWrapper"
               v-show="shareFlag"
               @click.stop>
            <div class="imgContent"
                 v-if="qrCodeCanvasSrc">
              <img :src="qrCodeCanvasSrc"
                   alt="">
            </div>
            <div v-else
                 class="divContent">
              <div class="header">
                <div class="userInfo">
                  <div class="image">
                    <img class="img"
                         v-if="shareInfo.member_id"
                         :src="shareInfo.has_one_member.avatar_image"
                         alt="图片无效" />
                    <img class="img"
                         v-else
                         :src="shop_log"
                         alt="图片无效" />
                  </div>
                  <div class="title">{{shareInfo.code_name}}</div>
                </div>
                <div class="desc">
                  {{shareInfo.code_guide}}
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

  </div>
</template>

<script>
import groupCodeRecordController from './group_code_record_controller.js';

export default groupCodeRecordController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background-color: rgb(249, 249, 249);
    min-height: 100vh;
    padding-bottom: 3.0625rem;
  }

  .wrapper {
    .items {
      .item {
        margin-bottom: 0.875rem;
        padding: 1.438rem 0.844rem 0.65rem 1.25rem;
        display: flex;
        flex-direction: column;
        background: #fff;

        .info {
          display: flex;
          justify-content: space-between;

          .id {
            font-size: 0.875rem;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1.5rem;
            letter-spacing: 0.044rem;
            color: #333;
          }

          .time {
            font-size: 0.875rem;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1.5rem;
            letter-spacing: 0;
            color: #999;
          }
        }

        .content {
          text-align: left;
          margin-top: 1.281rem;
          font-size: 1rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.05rem;
          color: #000;
        }

        .btns {
          margin-top: 0.906rem;
          display: flex;
          justify-content: flex-end;

          .btn {
            width: 4.406rem;
            height: 1.625rem;
            border-radius: 0.813rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
          }

          .share {
            margin-right: 1.063rem;
            border: solid 0.031rem #00b075;
            background-color: #e0fef4;
            color: #00b075;
          }

          .data {
            background-color: #00b075;
            color: #fff;
          }
        }
      }

      .optBtns {
        width: 5.062rem;
        height: 100%;
        display: flex;

        .optBtn {
          height: 100%;
          width: 2.531rem;
          display: flex;
          align-items: center;
          color: #fff;
          justify-content: center;
        }

        .edit {
          background-color: #fc8e5e;
        }

        .del {
          background-color: #ff9b6f;
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

        img,
        canvas {
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
      text-indent: 1.75rem;
      line-height: 1.5rem;
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
