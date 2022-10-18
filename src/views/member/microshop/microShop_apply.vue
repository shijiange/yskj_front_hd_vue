<template>
  <div id="microshop_apply">
    <c-title :hide="false"
             text="店主申请"></c-title>
    <div class="banner">
      <img v-if="bannerImgSrc"
           :src="bannerImgSrc"
           alt="" />
    </div>
    <h3>请选择店主等级</h3>
    <!-- 选择等级优化 -->
    <div class="select_box">
      <div class="select"
           v-for="(elem,i) in data" :key='i'>
        <van-radio-group v-model="goodsID">
          <van-radio label-position="right"
                     checked-color="#f15353"
                     :name="elem.goods_id"
                     :disabled="elem.not_show">
            <div class="item-flex">
              <div class="img">
                <img :src="elem.has_one_goods.thumb" />
              </div>
              <ul class="text">
                <li class="name">{{ elem.level_name }}</li>
                <li class="sum">{{ elem.has_one_goods.price }}元</li>
              </ul>
            </div>
          </van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="explain">
      <h4 @click="open"><i class="iconfont icon-balance_o"></i>店主说明</h4>
      <div v-html="signature"></div>
    </div>

    <div style="height: 5rem; display: block;"></div>
    <div class="bottom_btn set-pc-style">
      <button type="button"
              class="btn custom_color"
              @click="pay">
        立即支付
      </button>
    </div>
  </div>
</template>
<script>
import micro_shop_apply_controller from "./micro_shop_apply_controller";
export default micro_shop_apply_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.applySucHide {
  display: none;
}

#microshop_apply {
  padding-bottom: 80px;

  .shopKeeperInfo {
    color: #aeaeae;
    font-size: 12px;

    span {
      display: inline-block;
      width: 1.125rem;
      height: 1.125rem;
      font-size: 18px;
      line-height: 1.1875rem;
      font-weight: 400;
      color: white;
      background: #fcc15d;
      margin: 0.1875rem 0.3125rem 0.5rem;
      border-radius: 50%;
      position: relative;
      top: 0.125rem;
    }
  }

  .active {
    border-color: #f15959 !important;
  }

  .m_header {
    width: 100%;
    height: 2.8125rem;
    line-height: 2.8125rem;
    background: #fff;
    position: relative;
    border-bottom: 0.0625rem solid #ccc;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      font-weight: normal;
      margin-left: 0.625rem;
      font-size: 30px;
    }

    .el-button {
      width: 20%;
      float: right;
      font-size: 12px;
      font-weight: normal;
      color: #888;
      line-height: 2.8125rem;
      padding: 0;
    }

    span.title {
      width: 60%;
      font-size: 15px;
      font-weight: bold;
      box-sizing: border-box;
      padding-left: 18%;
    }
  }

  .banner {
    overflow: hidden;
    width: 100%;
    height: 12.5rem;
    background: #fff;

    img {
      width: 100%;
      height: 12.5rem;
    }
  }

  h3 {
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    line-height: 2.5rem;
    background: #fff;
    padding: 0 0.875rem;
  }

  .select_box {
    background: #fff;
    padding: 1.25rem 0;

    .select {
      padding: 0 1.25rem;
      margin-bottom: 1.25rem;

      .img {
        width: 6.25rem;
        height: 6.25rem;
        background: #f2f2f2;
        margin-right: 0.625rem;

        img {
          width: 100%;
        }
      }

      .text {
        text-align: left;

        .name {
          font-weight: bold;
          font-size: 16px;
          line-height: 1.875rem;
        }

        .sum {
          color: #f15353;
          font-size: 16px;
          line-height: 1.875rem;
        }
      }
    }

    .select:last-child {
      margin: 0;
    }

    .item-flex {
      display: flex;
    }
  }

  .explain {
    margin-top: 0.625rem;
    color: #8c8c8c;
    padding: 0 1.25rem;
    text-align: left;

    h4 {
      display: flex;
      font-size: 14px;
      line-height: 1.875rem;
    }

    p {
      font-size: 12px;
    }
  }

  .bottom_btn {
    width: 100%;
    background: #fff;
    padding: 0.625rem 0;
    position: fixed;
    bottom: 0;
    border-top: solid 0.0625rem #ebebeb;
    z-index: 10;

    .btn {
      width: 21.5625rem;
      margin: 0 auto;
      height: 2.875rem;
      border-radius: 0.25rem;
      font-size: 16px;
      color: #fff;
      background: #f15353;
      border: none;
    }
  }
}
</style>
