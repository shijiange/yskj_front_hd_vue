<template>
  <div id="evaluate">
    <c-title :hide="false" text="评价"></c-title>
    <div id="shop">
      <div class="goods">
        <div class="img">
          <img
            src="http://www.heliaigou.com/attachment/images/0/2016/12/Nw93tt3t5T9v3C5527Rjw9Xwwr22W9.jpg"
          />
        </div>
        <div class="inner">
          <div class="name">
            奥康增高男鞋 新款真皮系带隐形内增高皮鞋韩版休闲鞋透气低帮鞋
          </div>
          <div class="option">规格: 兰色+37</div>
        </div>
        <div class="price">
          {{$i18n.t('money')}}299<br />
          ×1
        </div>
      </div>
    </div>
    <div id="pjall">
      <div id="pj" class="clearfloat">
        <span>评分:</span>
        <van-rate v-model="star" @change="getStar" />
        <span>{{ ratetext }}</span>
      </div>
      <div style="height: 0.625rem;"></div>
      <van-cell-group>
        <van-field
          v-model="comment"
          type="textarea"
          placeholder="请输入评论内容"
          rows="2"
        />
      </van-cell-group>
    </div>
    <van-button type="primary" color="#f15353" style="width: 90%; margin: 0 auto;" @click="toComment">提交评价</van-button>
  </div>
</template>
<script>
import order_list_evaluatecontroller from "./order_list_evaluatecontroller";
export default order_list_evaluatecontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#evaluate {
  #shop {
    background: #fff;
    padding: 0.625rem;
  }

  .goods {
    display: flex;
    align-items: stretch;
    flex-flow: row wrap;
    background: #efeded;
    padding: 0.3125rem;
    margin-bottom: 0.3125rem;

    .img {
      flex: 3;

      img {
        width: 100%;
      }
    }

    .inner {
      flex: 5;
      padding: 0 0.3125rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .name {
      flex: 5;
      text-align: left;
    }

    .price {
      flex: 2;
      align-items: center;
    }

    .option {
      color: #888;
      font-size: 12px;
      flex: 1;
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

      .van-rate {
        float: left;
      }
    }

    .van-cell-group {
      border: 1px solid #bfcbd9;
      border-radius: 4px;

      .van-cell {
        border-radius: 4px;
      }
    }
  }

  button {
    width: 100%;
  }

  /* 清除浮动代码 */
  .clearfloat::after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }

  .clearfloat {
    zoom: 1;
  }
}
</style>
