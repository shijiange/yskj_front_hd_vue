<template>
  <div id="refund">
    <c-title :hide="false" :text="plugin_name"></c-title>
    <!-- 安装商品 -->
    <div class="installShop">
      <div class="shopTitle">
        <div>订单号：{{ info.order_sn }}</div>
        <div style="color: #f15354;">{{ info.state_name }}</div>
      </div>
      <div class="shopList" v-for="(item, index) in info.goods_list" :key="index">
        <div class="shoplis">
          <div class="imgbox">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="shoptxt">{{ item.title }}</div>
        </div>
        <div class="total">数量：x{{ item.total }}</div>
        <div class="posBtn goodbtn">
          <div class="btn" @click.stop="clickBotton(btn, item.install_order_goods_id)" v-for="btn in item.button_group" :key="btn.code">{{ btn.name }}</div>
        </div>
      </div>
      <div class="severPrice">
        <div>
          {{ info.another_name && info.another_name.plugin_name }}费：<span style="color: #f15354;">{{ $i18n.t("money") }}{{ info.service_amount }}</span>
        </div>
        <div>
          订单实付金额：<span style="color: #f15354;">{{ $i18n.t("money") }}{{ info.price }}</span>
        </div>
      </div>
    </div>
    <!-- 安装商品end -->
    <!-- 订单信息 -->
    <div class="orderDetail">
      <div class="detailTxt">
        <span class="txt">订单类型：</span><span>{{ info.order_type_name }}</span>
      </div>
      <div class="detailTxt">
        <span class="txt">预约安装时间：</span><span>{{ info.reserve_time }}</span>
      </div>
      <div class="detailTxt">
        <span class="txt">买家留言：</span><span>{{ info.install_comment }}</span>
      </div>
    </div>
    <!-- 订单信息end -->
    <!-- 流程 -->
    <div class="flowPath">
      <div class="pathItem" :class="{ 'color-red': info.worker_time }">
        <div class="pathTime">
          <template v-if="info.worker_time">
            <span class="time">{{ info.worker_time.slice(11, 16) }}</span>
            <span class="day">{{ info.worker_time.slice(0, 10) }}</span>
          </template>
        </div>
        <div class="circle">
          <i class="iconfont icon-fontclass-shangpindingdan"></i>
        </div>
        <span>接单</span>
      </div>
      <div class="pathDetail">
        <div class="line"></div>
        <div class="connection">
          <span v-if="info.worker_name">{{ info.another_name.worker_name }}：{{ info.worker_name }}</span>
          <span v-if="info.worker_mobile"
            >联系电话：<a :href="`tel:${info.worker_mobile}`">{{ info.worker_mobile }}</a></span
          >
        </div>
      </div>

      <div class="pathItem" :class="{ 'color-red': info.take_time }">
        <div class="pathTime">
          <template v-if="info.take_time">
            <span class="time">{{ info.take_time.slice(11, 16) }}</span>
            <span class="day">{{ info.take_time.slice(0, 10) }}</span>
          </template>
        </div>
        <div class="circle">
          <i class="iconfont icon-fontclass-kucun"></i>
        </div>
        <span>取货</span>
      </div>
      <div class="pathDetail">
        <div class="line"></div>
      </div>

      <div class="pathItem" :class="{ 'color-red': info.install_start_time }">
        <div class="pathTime">
          <template v-if="info.install_start_time">
            <span class="time">{{ info.install_start_time.slice(11, 16) }}</span>
            <span class="day">{{ info.install_start_time.slice(0, 10) }}</span>
          </template>
        </div>
        <div class="circle">
          <i class="iconfont icon-fontclass-anzhuang"></i>
        </div>
        <span>上门安装</span>
      </div>
      <div class="pathDetail">
        <div class="line"></div>
      </div>

      <div class="pathItem" :class="{ 'color-red': info.finish_time }">
        <div class="pathTime">
          <template v-if="info.finish_time">
            <span class="time">{{ info.finish_time.slice(11, 16) }}</span>
            <span class="day">{{ info.finish_time.slice(0, 10) }}</span>
          </template>
        </div>
        <div class="circle">
          <i class="iconfont icon-fontclass-shouchu"></i>
        </div>
        <span>完成安装</span>
      </div>
    </div>
    <!-- 安装完成后图片 -->
    <div class="imageBox" v-if="!fun.isTextEmpty(info.finish_image)">
      <div class="tit">安装完成图片</div>
      <div class="imglist">
        <div class="img" v-for="(item, index) in info.finish_image" :key="index" @click="imgPreview(info.finish_image)">
          <img :src="item" alt="" />
        </div>
      </div>
    </div>
    <!-- 售后 -->
    <!-- <div class="afterSale">
      <span style="font-size: 0.94rem;">售后</span>
      <van-icon name="arrow" />
    </div> -->
    <div style="width: 100%; height: 6rem;"></div>
    <!-- 按钮 -->
    <div class="posBtn set-pc-styleLeft">
      <div class="btn" @click.stop="clickBotton(btn, info.order_id)" v-for="btn in info.button_group" :key="btn.code">{{ btn.name }}</div>
    </div>
  </div>
</template>
<script>
import refund_controller from "./refund_controller";

export default refund_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// 安装商品
.installShop {
  background-color: #fff;
  padding: 0.78rem 0.88rem 0.94rem 0.94rem;
  box-sizing: border-box;

  .shopTitle {
    font-size: 0.69rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #999;
  }

  .shopList {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 0.66rem 0 0 0;
    box-sizing: border-box;
    margin-bottom: 0.94rem;

    .shoplis {
      width: 80%;
      display: flex;
      align-items: center;

      .imgbox {
        width: 2.5rem;
        height: 2.5rem;
        background-color: #c3c3c3;
        margin-right: 0.47rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .shoptxt {
        flex: 1;
        font-size: 0.88rem;
        text-align: left;
      }
    }

    .total {
      color: #202020;
      font-size: 0.69rem;
    }
  }

  .severPrice {
    text-align: right;
    border-top: 1px solid #f2f2f2;
    padding-top: 0.91rem;
    overflow: hidden;
    font-size: 0.94rem;
  }
}
// 订单信息
.orderDetail {
  margin-top: 0.63rem;
  background-color: #fff;
  padding-top: 0.8rem;
  padding-left: 0.94rem;
  padding-right: 0.63rem;
  padding-bottom: 0.88rem;
  box-sizing: border-box;

  .detailTxt {
    text-align: left;
    font-size: 0.88rem;
    margin-bottom: 0.7rem;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    .txt {
      color: #999;
    }

    .price {
      color: #f15354;
    }
  }

  .detailTxt:last-child {
    margin-bottom: 0;
  }
}
// 订单信息end
// 流程
.flowPath {
  margin-top: 0.63rem;
  background: #fff;
  padding: 1.59rem 0 1.63rem 0;

  .pathItem:last-child {
    margin-bottom: 0;
  }

  .pathDetail {
    height: 2.56rem;
    display: flex;
    align-items: center;

    .line {
      width: 0.03rem;
      height: 1.25rem;
      background-color: #c8c8c8;
      margin-left: 6.25rem;
    }

    .connection {
      display: flex;
      flex-direction: column;
      margin-left: 1.91rem;
      align-items: flex-start;
      color: #f15354;
    }
  }

  .pathItem {
    display: flex;
    align-items: center;
    // margin-bottom: 2.56rem;
    box-sizing: border-box;

    .pathTime {
      width: 5.34rem;
      display: flex;
      flex-direction: column;
      align-items: center;

      .time {
        font-size: 0.94rem;
        color: #f15354;
      }

      .day {
        font-size: 0.75rem;
        color: #f15354;
      }
    }

    .circle {
      width: 1.81rem;
      height: 1.81rem;
      border: solid 0.03rem #aaa;
      border-radius: 100%;
      margin-right: 1rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        color: #c9c9c9;
      }

      .icon-fontclass-kucun {
        font-size: 1.4rem;
      }
      // .line {
      //   width: 0.03rem;
      //   height: 1.25rem;
      //   background-color: #c8c8c8;
      //   position: absolute;
      //   left: 50%;
      //   bottom: -2.66rem;
      // }
    }

    span {
      font-size: 1.06rem;
      color: #101010;
    }
  }

  .color-red {
    .circle {
      border-color: #f15354;

      i {
        color: #f15354;
      }
    }

    span {
      color: #f15354;
    }
  }
}
// 按钮
.posBtn {
  width: 100%;
  padding: 0.5rem 0.875rem 0;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row-reverse;
  background: #fff;

  .btn {
    width: 4.125rem;
    height: 1.875rem;
    line-height: 1.875rem;
    background-color: #f15354;
    border-radius: 0.31rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin: 0 0 0.5rem 0.875rem;
  }
}

.goodbtn {
  position: relative;
  padding: 0;

  .btn {
    margin: 0;
  }
}
// 完成后图片
.imageBox {
  background: #fff;
  margin-top: 0.63rem;
  padding: 0.78rem 0.94rem 0.66rem 0.94rem;

  .tit {
    text-align: left;
    font-size: 0.94rem;
    color: #333;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;
  }

  .imglist {
    display: flex;
    flex-wrap: wrap;
    padding-top: 0.63rem;
    padding-bottom: 0.66rem;

    .img {
      width: 4.59rem;
      height: 4.59rem;
      background-color: #929292;
      border-radius: 0.31rem;
      margin-right: 0.72rem;
      margin-bottom: 0.63rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.afterSale {
  display: flex;
  justify-content: space-between;
  padding: 0.91rem 0.97rem 0.94rem 0.91rem;
  box-sizing: border-box;
  background: #fff;
  margin-top: 0.63rem;
}
</style>
