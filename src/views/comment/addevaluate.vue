<template>
  <div id="addevaluate">
    <c-title :hide="false" text="追加评价"></c-title>
    <div id="shop">
      <div class="goods">
        <div class="img"><img :src="good.thumb" /></div>
        <div class="warp" style="flex:1;">
          <div class="ul inner">
            <div class="li name">{{ good.title }}</div>
            <div class="li product_price"><text class="small">￥</text>{{ good.goods_price }}</div>
          </div>
          <div class="ul price">
            <div class="li option">规格: {{ good.goods_option_title }}</div>
            <div class="li option">×{{ good.total }}</div>
          </div>
        </div>
      </div>
      <div style="text-align: left;margin: 0.5rem 0;">
        <div class="name">已好评</div>
        <van-rate v-model="value" disabled-color="#ff9900" disabled />
      </div>
      <div class="option">{{ comment }}</div>
    </div>
    <div id="pjall">
      <div id="pj"><span>追加评价:</span></div>

      <textarea v-model="reComment" placeholder="这次买的商品满意吗？不满意可意追加评价内容。长度在5-100字之间" type="textarea" rows="4"></textarea>
    </div>

    <div class="shai-tu">
      <span>晒图:</span>
      <div class="imgs-box">
        <template v-for="(val, index) in fileList4">
          <div class="photobox" :key="index">
            <img :src="val.url" />
            <van-icon @click="removeImg_1(index)" name="close" class="delete-icon" />
          </div>
        </template>
        <van-uploader :disabled="fileList4.length >= 5" :after-read="multipleMethod_1" multiple>
          <div style="padding-left: 1rem; padding-top: 1rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda;">
            <img :src="require('../../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar" />
          </div>
        </van-uploader>
      </div>
    </div>

    <!--<el-button type="primary" @click="toReComment">发表追评</el-button>-->
    <van-button color="#f15353" type="primary" @click="toReComment">发表追评</van-button>
  </div>
</template>
<script>
import order_list_addevaluatecontroller from "./addevaluatecontroller";
export default order_list_addevaluatecontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#addevaluate {
  #shop {
    background: #fff;
    padding: 0.625rem;
    .option {
      color: #888;
      font-size: 12px;
      text-align: left;
    }
  }

  .goods {
    display: flex;
    align-items: stretch;
    flex-flow: row wrap;
    background: #efeded;
    padding: 0.3125rem;
    margin-bottom: 0.3125rem;

    .wrap {
      width: 70%;
      padding: 0.8rem 1rem 0 0;
    }
    .img {
      width: 6rem;
      height: 6rem;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }
    .inner {
      display: flex;
      justify-content: space-between;
      padding: 0 0.6rem;
      text-align: left;
      .name {
        max-width: 10rem;
        text-align: left;
        color: #333;
        margin-bottom: 0.6rem;
        font-size: 0.8rem;
      }
    }
    .price {
      display: flex;
      justify-content: space-between;
      padding: 0 0.6rem;
      align-items: center;
      color: #333;
    }
  }

  #pjall {
    background: #fff;
    padding: 0.9375rem;
    textarea {
      width: 87%;
      margin-top: 0.625rem;
      padding: 0.625rem;
    }

    #pj {
      text-align: left;
      span {
        float: left;
        font-size: 14px;
        padding-right: 0.625rem;
      }
    }
  }

  .shai-tu {
    background: #fff;
    padding: 0.9375rem;
    text-align: left;
    .imgs-box {
      display: flex;
      margin-top: 0.4rem;
    }
    .photobox {
      position: relative;
      margin: 0 0.5rem 0.5rem 0;
      height: 5rem;
      width: 5rem;
      img {
        width: 100%;
        height: 100%;
      }
      .delete-icon {
        font-size: 1rem;
        width: 1.2rem;
        height: 1.2rem;
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
        color: red;
        font-weight: 900;
      }
    }
  }
  button {
    width: 100%;
  }
}
</style>
