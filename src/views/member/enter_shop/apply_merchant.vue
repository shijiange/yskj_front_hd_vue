<template>
  <div id="enterShop">
    <c-title :hide="false" text="申请商家"></c-title>
    <div id="content">
      <div class="content_a">
        <ul class="flow_a">
          <li>
            <span>1</span>
          </li>
          <li>付款申请</li>
        </ul>
        <div class="arrow_a">
          <i class="iconfont icon-jiantou"></i>
        </div>
        <ul class="flow_b">
          <li>
            <span>2</span>
          </li>
          <li>提交资料</li>
        </ul>
        <div class="arrow_b">
          <i class="iconfont icon-jiantou"></i>
        </div>
        <ul class="flow_c">
          <li>
            <span>3</span>
          </li>
          <li>激活完成</li>
        </ul>
      </div>
      <div class="content_b">
        <!-- <button type="button"></button> -->
        <button type="button" @click="apply">支付{{$i18n.t('money')}}{{ total_price }}</button>
        <div class="agreement">
          <i
            class="iconfont icon-gouxuan normal"
            @click="isshow"
            v-show="isShowColse"
          ></i>
          <i
            class="iconfont icon-gouxuan cur"
            @click="isshow"
            v-show="isShowRead"
          ></i>
          <p>
            我已阅读并同意
            <span @click="getAgreement">《{{ title }}》</span>
          </p>
        </div>
      </div>
      <div class="content_c">
        <div class="img">
          <img :src="enter_goods.thumb" />
        </div>
        <span>{{ enter_goods.footer_content }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import apply_merchant_controller from "./apply_merchant_controller";
export default apply_merchant_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#enterShop {
  background: #fff;
  min-height: 37.5rem;

  #content {
    .content_a {
      padding: 1.25rem;
      display: flex;
      justify-content: space-around;

      .flow_a,
      .flow_b,
      .flow_c {
        li:first-child {
          span {
            display: block;
            width: 3rem;
            height: 3rem;
            line-height: 3rem;
            border-radius: 2.5rem;
            background: #f15353;
            color: #fff;
            font-size: 16px;
            margin: 0 auto;
          }
        }

        li:last-child {
          font-size: 16px;
          line-height: 1.875rem;
        }
      }

      .arrow_a,
      .arrow_b {
        margin-top: 0.625rem;

        i {
          font-size: 1.75rem;
          color: #ccc;
        }
      }
    }

    .content_b {
      margin-top: 7.5rem;

      .agreement {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          margin-right: 0.625rem;
          font-size: 1.5rem;
        }

        .normal {
          color: #999;
        }

        .cur {
          color: #f15353;
        }

        p {
          font-size: 14px;
          color: #8c8c8c;

          span {
            font-weight: bold;
            color: #333;
          }
        }
      }

      button {
        width: 17.5rem;
        height: 2.625rem;
        border-radius: 2.5rem;
        border: none;
        background: #f15353;
        font-size: 18px;
        color: #fff;
        margin-bottom: 1.25rem;
      }
    }

    .content_c {
      width: 100%;
      position: absolute;
      bottom: 1.25rem;

      .img {
        margin: 0.625rem auto;
        width: 3rem;
        height: 3rem;
        border: solid 0.0625rem #ebebeb;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      span {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        line-height: 1.5rem;
      }
    }
  }

  position: relative;
}
</style>
