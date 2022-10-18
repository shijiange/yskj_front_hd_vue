<template>
  <div id="material_search">
    <c-title :hide="false" :text="'素材搜索'"></c-title>
    <div class="content">
      <div class="sousuoWrap">
        <i class="iconfont icon-sousuo1" @click="getData"></i>
        <input type="text" v-model="search_title" @keypress="enterSearch" placeholder="请输入素材标题" style="display: flex; flex: 1; margin-left: 10px;" />
      </div>

      <template v-if="list.length > 0">
        <div class="user_info" v-for="(item,i) in list" :key='i'>
          <div class="user_name">
            <div class="user">
              <img :src="item.logo" />
            </div>
            <ul class="right">
              <li class="name">{{ item.name }}</li>
              <li class="time">{{ item.created_at }}</li>
            </ul>
          </div>
          <p class="share_text" v-html="item.content1">
            <!-- {{ item.content }} -->
          </p>
          <viewer :images="item.images" class="goods_box">
            <div class="img" v-for="(img,i) in item.images" :key='i'>
              <img :src="img" />
            </div>
            <div class="video">
              <video :src="item.videos.video_url" :poster="item.videos.video_image" controls></video>
            </div>
          </viewer>
          <div class="goods_lik" v-if="item.goods" @click="toGoods(item.goods.id)">
            <div class="goods_img">
              <img :src="item.goods.thumb" />
            </div>
            <ul class="goods_name">
              <li class="name" style="-webkit-box-orient: vertical;">
                {{ item.goods.title | escapeTitle }}
              </li>
              <li class="number">{{$i18n.t('money')}}{{ item.goods.price }}</li>
            </ul>
          </div>
          <div class="goods_share">
            <div class="left" @click="update(item.id)" v-clipboard:copy="item.content" v-clipboard:success="onCopy" v-clipboard:error="onError">
              <i class="iconfont icon-ht_operation_copypage"></i>
              <span>复制文案</span>
            </div>
            <div class="right" @click="postShow(item.goods.id)">
              <i class="iconfont icon-material_goodsCode"></i>
              <span>商品码</span>
            </div>
          </div>
        </div>
      </template>
      <van-empty description="空空如也"></van-empty>

    </div>
    <van-popup v-model="posterShow" position="center" round :style="{width:'320px',background: 'transparent',overflow: 'inherit'}" @click.stop>
      <div class="goods_code_popup">
        <img :src="'data:'+posterImg.mime+';base64,'+posterImg.base64Image" v-if="posterImg.base64Image" style="width: 100%; border-radius: 0.375rem;" />
        <img src="../../assets/images/img_default.png" v-if="!posterImg.base64Image" style="width: 100%; height: 100%; border-radius: 0.375rem;" />
        <div class="close" @click="posterShow = false">
          <img src="../../assets/images/material_close.png" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import material_search_controller from "./material_search_controller";

export default material_search_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#material_search {
  background-color: #fff;
  min-height: 100vh;

  .content {
    background-color: #fff;

    .sousuoWrap {
      width: 15.625rem;
      border-radius: 1.5625rem;
      background-color: rgba(240, 240, 240, 100);
      color: rgba(16, 16, 16, 100);
      margin: 0 auto;
      height: 1.875rem;
      display: flex;
      align-items: center;
      padding-left: 0.9375rem;
      margin-top: 0.9375rem;
      margin-bottom: 0.9375rem;

      input {
        outline: none;
        border: none;
      }
    }

    .user_info {
      padding: 0 0.9375rem;
      background: #fff;
      border-top: solid 0.0625rem #ebebeb;
      border-bottom: solid 0.0625rem #ebebeb;
      margin-bottom: 0.625rem;

      .user_name {
        display: flex;
        padding-top: 0.9375rem;

        .user {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 1.375rem;
          border: solid 0.0625rem #ebebeb;
          overflow: hidden;
          background: #f2f2f2;
          margin-right: 0.9375rem;

          img {
            width: 100%;
          }
        }

        .right {
          text-align: left;

          .name {
            font-size: 16px;
            margin-bottom: 0.5rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .time {
            font-size: 14px;
            color: #999;
          }
        }
      }

      .share_text {
        font-size: 16px;
        line-height: 1.5rem;
        text-align: left;
        margin-top: 0.625rem;
        margin-bottom: 0.625rem;
      }

      .goods_box {
        display: flex;
        flex-wrap: wrap;
        max-height: 21.875rem;
        overflow: hidden;

        .video {
          width: 6.9375rem;
          height: 6.9375rem;
          overflow: hidden;
          margin-bottom: 0.375rem;
          position: relative;

          video {
            width: 100%;
            height: 100%;
          }
        }

        .img {
          width: 6.9375rem;
          height: 6.9375rem;
          overflow: hidden;
          background: #f2f2f2;
          margin-right: 0.375rem;
          margin-bottom: 0.375rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .img:nth-child(3n) {
          margin: 0;
        }
      }

      .goods_lik {
        background: #f8f8f8;
        margin-top: 0.25rem;
        display: flex;

        .goods_img {
          width: 4rem;
          height: 4rem;
          overflow: hidden;
          background: #f2f2f2;
          margin-right: 0.9375rem;

          img {
            width: 100%;
          }
        }

        .goods_name {
          text-align: left;
          font-size: 14px;
          width: 16.625rem;

          .name {
            line-height: 2rem;
            height: 2rem;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .number {
            font-size: 14px;
            line-height: 2rem;
            height: 2rem;
          }
        }
      }

      .goods_share {
        margin-top: 0.625rem;
        border-top: solid 0.0625rem #ebebeb;
        display: flex;
        align-items: center;
        padding: 0.625rem 0;

        .left,
        .right {
          display: flex;
          width: 50%;
          border-right: solid 0.0625rem #ebebeb;
          font-size: 14px;
          color: #666;
          justify-content: center;

          .iconfont {
            margin-right: 0.375rem;
            color: #666;
            font-size: 1.125rem;
          }
        }

        .right {
          border: none;
        }
      }
    }
  }

  .goods_code_popup {
    background: #fff;
    border-radius: 0.5rem;
    position: relative;
    width: 90%;
    display: inline-block;
    margin: 0 auto;

    .goods_img {
      width: 20rem;
      height: 20rem;
      background: #f2f2f2;
      overflow: hidden;
      padding: 0.25rem;
      border-radius: 0.375rem 0.375rem 0 0;

      img {
        width: 85%;
      }
    }

    .goods_info {
      display: flex;
      justify-content: space-between;
      padding: 0.625rem;

      .info_left {
        width: 12.5rem;

        .name {
          font-size: 14px;
          line-height: 1.25rem;
          height: 2.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .price {
          font-size: 24px;
          color: #f15353;
          text-align: left;
          margin-top: 0.75rem;
          font-weight: bold;

          span {
            font-size: 14px;
            color: #8c8c8c;
            text-decoration: line-through;
            margin-left: 0.9375rem;
            font-weight: normal;
          }

          font {
            font-size: 14px;
          }
        }
      }

      .info_right {
        .code_img {
          width: 5.5rem;
          height: 5.5rem;
          background: #f2f2f2;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        span {
          font-size: 12px;
          line-height: 1.25rem;
        }
      }
    }

    .close {
      position: absolute;
      top: -1rem;
      right: -1rem;
      width: 2.75rem;
      height: 2.75rem;
      overflow: hidden;

      img {
        width: 80%;
      }
    }
  }
}
</style>
