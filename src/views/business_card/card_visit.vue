<template>
  <div id="card_visit">
    <c-title :hide="false" :text="'名片图片'"></c-title>
    <div id="img_box" v-show="loadingImg">
      <div class="banner">
        <img :src="cardData.background" />
      </div>
      <div class="header">
        <div class="img" id="imgDom">
          <img id="card_avatar" :src="cardData.card_avatar" />
        </div>
        <ul class="name">
          <li class="name_a">{{ cardData.card_name }}</li>
          <li class="name_b">{{ role_name.role_name }}&nbsp;&nbsp;&nbsp;<span v-if="role_name.level_name && role_name.level_name != null"
          >|&nbsp;&nbsp;&nbsp;{{ role_name.level_name }}</span>
          </li>
        </ul>
        <div class="fire" v-if="cardData.card_statistics">
          <i class="iconfont card_img_a"></i>
          <span>人气{{ cardData.card_statistics.visit }}</span>
        </div>
      </div>
      <ul class="per_info">
        <li v-if="cardData.card_mobile">
          <i class="iconfont card_img_b"></i>
          <span>{{ cardData.card_mobile }}</span>
        </li>
        <li v-if="cardData.card_wechat">
          <i class="iconfont card_img_c"></i>
          <span>{{ cardData.card_wechat }}</span>
        </li>
        <li class="position"  v-if="area_name">
          <i class="iconfont card_img_d"></i>
          <span>{{ area_name }} </span>
        </li>
      </ul>
      <div class="code_box">
        <div class="code">
          <img :src="cardData.qr_code" />
        </div>
        <ul class="code_text">
          <li class="text_a">
            <span>{{ cardData.card_name }}</span
            >名片码
          </li>
          <li>长按识别名片码保存名片</li>
          <li class="text_c">名片由【{{ cardData.shop_name }}】生成</li>
        </ul>
      </div>
    </div>

    <div style="width: 100%; height: 100%; padding: 1rem;" v-show="!loadingImg">
      <img style="width: 100%; height: 100%;" id="thecanvas" />
    </div>

    <!--<div class="car_btm_btn">-->
      <!--<button type="button">长按图片即可保存名片图片</button>-->
    <!--</div>-->
  </div>
</template>

<script>
import card_visit_controller from "./card_visit_controller";

export default card_visit_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_visit {
  padding-bottom: 64px;

  #img_box {
    width: 21.5625rem;
    margin: 0.9375rem auto 10rem auto;
    padding: 0.625rem;
    background: #fff;

    .banner {
      width: 100%;
      height: 10rem;
      background: #f2f2f2;
      border-radius: 0.5rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .header {
      display: flex;
      margin: 1rem 0;
      position: relative;

      .img {
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 1.875rem;
        overflow: hidden;
        background: #f2f2f2;
        margin-right: 0.625rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        width: 15.3125rem;
        text-align: left;

        .name_a {
          width: 100%;
          font-weight: bold;
          font-size: 18px;
          line-height: 1.875rem;
        }

        .name_b {
          line-height: 1.875rem;
          font-size: 14px;
          color: #8c8c8c;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .fire {
        position: absolute;
        right: 0;
        top: 1.8rem;
        line-height: 1.875rem;
        color: #f15353;
        font-size: 14px;
        display: flex;

        .card_img_a {
          background: url(../../assets/images/card_img_a.png) no-repeat center;
          background-size: 1.75rem;
          width: 1.75rem;
          height: 1.75rem;
        }

        .card_img_a::before {
          content: "";
        }
      }
    }

    .per_info {
      text-align: left;
      margin-top: 0.625rem;

      li {
        line-height: 1.5rem;
        display: flex;

        .card_img_b {
          background: url(../../assets/images/card_img_b.png) no-repeat center;
          background-size: 1.25rem;
          width: 1.75rem;
          height: 1.75rem;
        }

        .card_img_b::before {
          content: "";
        }

        .card_img_c {
          background: url(../../assets/images/card_img_c.png) no-repeat center;
          background-size: 1.25rem;
          width: 1.75rem;
          height: 1.75rem;
        }

        .card_img_c::before {
          content: "";
        }

        .card_img_d {
          background: url(../../assets/images/card_img_d.png) no-repeat center;
          background-size: 1.25rem;
          width: 1.75rem;
          height: 1.75rem;
        }

        .card_img_d::before {
          content: "";
        }

        span {
          font-size: 14px;
          color: #999;
        }
      }

      .position {
        span {
          /* overflow: hidden; */

          /* text-overflow: ellipsis; */

          /* display: -webkit-box; */

          /* -webkit-line-clamp: 2; */
          -webkit-box-orient: vertical;
        }
      }
    }

    .code_box {
      margin-top: 2.5rem;
      display: flex;
      align-items: center;

      .code {
        width: 7.5rem;
        height: 7.5rem;
        background: #fff;
        padding: 0.625rem;
        margin-right: 1.25rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .code_text {
        text-align: left;
        font-size: 14px;

        li {
          line-height: 1.375rem;
        }

        .text_a {
          span {
            color: #50a6f9;
          }
        }

        .text_c {
          color: #8c8c8c;
          font-size: 13px;
        }
      }
    }
  }

  .car_btm_btn {
    background: #fff;
    position: fixed;
    bottom: 0;
    padding: 0.625rem 0.9375rem;
    border-top: solid 0.0625rem #ebebeb;
    width: 100%;

    button {
      width: 100%;
      height: 2.5rem;
      background: #50a6f9;
      font-size: 16px;
      border: none;
      border-radius: 3.75rem;
      color: #fff;
    }
  }
}
</style>
