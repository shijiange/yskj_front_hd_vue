<template>
  <div class="page">
    <c-title text="店主中心"></c-title>

    <div class="header">
      <div class="header-container">
        <div class="header-face">
          <img :src="details.avatar_image" alt="" />
        </div>
        <div class="header-info">
          <div class="header-info-desc">
            <div class="name">{{ details.nickname }}</div>
            <div class="level" v-if="details.alias">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/orderImport_icon_crown.png" alt="" />
              <span class="text">{{ details.alias }}</span>
            </div>
          </div>
          <div class="header-info-id">ID:{{ details.uid }}</div>
        </div>
      </div>
    </div>

    <div class="wrapper-padding">
      <div class="specific">
        <div class="specific-items">
          <div class="specific-item">
            <div class="text" @click="setShopType(0)" :class="[shop_type == 0 ? 'specific-item-active' : '']">全部</div>
          </div>
          <div class="specific-item">
            <div class="text" @click="setShopType(1)" :class="[shop_type == 1 ? 'specific-item-active' : '']">本土店</div>
          </div>
          <div class="specific-item">
            <div class="text" @click="setShopType(2)" :class="[shop_type == 2 ? 'specific-item-active' : '']">跨境店</div>
          </div>
        </div>
        <div class="split-line"></div>
        <div class="specific-items">
          <div class="specific-item">
            <div class="num">{{ details.today_count || 0 }}</div>
            <div class="text">今日订单数</div>
          </div>
          <p class="hr"></p>
          <div class="specific-item">
            <div class="num">{{ details.today_amount || 0 }}</div>
            <div class="text">今日采购金额</div>
          </div>
          <p class="hr"></p>
          <div class="specific-item">
            <div class="num">{{ details.today_profit || 0 }}</div>
            <div class="text">今日利润</div>
          </div>
        </div>
        <div class="specific-items">
          <div class="specific-item">
            <div class="num">{{ details.month_count || 0 }}</div>
            <div class="text">本月订单数</div>
          </div>
          <p class="hr"></p>
          <div class="specific-item">
            <div class="num">{{ details.month_amount || 0 }}</div>
            <div class="text">本月采购金额</div>
          </div>
          <p class="hr"></p>
          <div class="specific-item">
            <div class="num">{{ details.month_profit || 0 }}</div>
            <div class="text">本月利润</div>
          </div>
        </div>
        <div class="specific-items">
          <div class="specific-item">
            <div class="num">{{ details.count || 0 }}</div>
            <div class="text">累计订单总数</div>
          </div>
          <p class="hr"></p>
          <div class="specific-item">
            <div class="num">{{ details.amount || 0 }}</div>
            <div class="text">累计采购总金额</div>
          </div>
          <p class="hr"></p>
          <div class="specific-item">
            <div class="num">{{ details.profit || 0 }}</div>
            <div class="text">累计总利润</div>
          </div>
        </div>
      </div>

      <div class="pending_order">
        <div class="pending_order_text">待扣款订单总数：{{ details.wait_count }}</div>
        <div class="pending_order_text">待扣款总金额：{{ details.wait_amount }}</div>
        <div class="pending_order_text">待结算总金额：{{ details.wait_settle }}</div>
      </div>

      <div class="record-title">
        记录明细
      </div>

      <div class="tabs">
        <div class="tabs-item" v-for="(item, key) in tabArray" :key="key" :class="{ active: key == tabIndex }" @click="setTabIndex(key)">{{ item.name }}</div>
      </div>

      <div class="listItem">
        <div class="date-wrapper">
          <div class="time-wrapper" @click="startTimeShow = true">
            <div class="time-desc">选择开始时间</div>
            <div class="time-text">{{ startTimeText }}</div>
          </div>
          <div class="time-iconfont">
            <i class="iconfont icon-fontclass-jiantou"></i>
          </div>
          <div class="time-wrapper" @click="endTimeShow = true">
            <div class="time-desc">选择结束时间</div>
            <div class="time-text">{{ endTimeText }}</div>
          </div>
        </div>
        <loading :show="!networkLoading"></loading>
        <template v-if="networkLoading && listData.length > 0">
          <div class="list-item" v-for="item in listData" :key="item.id" @click="handRecord(item.id)">
            <div class="c1 cc">
              <div class="order_sn">订单编号：{{ item.order_sn }}</div>
            </div>
            <div class="cc c2">
              <div class="deduction">{{ item.settle == 0 ? "待扣款" : "已扣款" }}</div>
              <div class="price">{{ item.order_amount }}</div>
            </div>
            <div class="c2 cc">
              <div class="settlement_time">结算时间：{{ item.settle_at }}</div>
              <div class="status" v-if="item.status == 1">待结算</div>
              <div class="status" v-else-if="item.status == 2">已结算</div>
              <div class="status" v-else-if="item.status == -1">失效</div>
            </div>
            <div class="c2 cc">
              <div class="time">时间：{{ item.created_at }}</div>
            </div>
            <div class="details" v-if="sid == item.id" @click.stop>
              <div class="name">{{ item.goods_name }}</div>
              <div class="c3 cc">
                <div class="spec">{{ item.goods_spec }} x{{ item.goods_total }}</div>
                <div class="time">订单日期：{{ item.real_at }}</div>
              </div>
              <div class="c4 cc">
                <div class="text">采购单价：{{ item.goods_price }}</div>
                <div class="text">运费：{{ item.order_freight }}</div>
                <div class="text">采购款：{{ item.goods_amount }}</div>
              </div>
              <div class="c4 cc">
                <div class="text">
                  采购成本合计：<span class="price">{{ item.order_price }}</span>
                </div>
                <div class="text">
                  订单结算合计：<span class="price">{{ item.order_amount }}</span>
                </div>
              </div>
              <div class="c4 cc">
                <div class="store_cateroty">店铺类别：{{ item.shop_type }}</div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="networkLoading && listData.length == 0">
          <yz-blank text="暂无数据" :isBtn="false"></yz-blank>
        </template>
      </div>
    </div>

    <van-popup v-model="startTimeShow" position="bottom">
      <van-datetime-picker v-model="startTimeModel" type="date" title="选择年月日" @cancel="startTimeShow = false" @confirm="confirmTime($event, 'start')" />
    </van-popup>

    <van-popup v-model="endTimeShow" position="bottom">
      <van-datetime-picker v-model="endTimeModel" type="date" title="选择年月日" @cancel="endTimeShow = false" @confirm="confirmTime($event, 'end')" />
    </van-popup>
  </div>
</template>

<script>
import orderImportIndexController from "./order_import_index_controller.js";

export default orderImportIndexController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(249, 249, 249);
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.header {
  width: 100%;
  height: 9.375rem;
  padding-top: 1.781rem;
  padding-left: 0.938rem;
  background-color: #3b3b3b;

  .header-container {
    display: flex;

    .header-face {
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 50%;

      img {
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 50%;
      }
    }

    .header-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 3.75rem;
      padding-left: 1rem;

      .header-info-desc {
        display: flex;
        align-items: center;

        .name {
          font-size: 1.438rem;
          color: #fff;
          max-width: 8rem;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .level {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 7.5rem;
          margin-left: 0.569rem;
          background-image: linear-gradient(90deg, #ffebc0 0%, #ffc479 100%), linear-gradient(#ffd821, #ffd821);
          background-blend-mode: normal, normal;
          border-radius: 0.969rem;

          img {
            position: absolute;
            left: -0.1rem;
            top: 50%;
            transform: translateY(-50%);
            width: 1.188rem;
            height: 1.094rem;
          }

          .text {
            padding-left: 1.2rem;
            padding-right: 0.375rem;
            font-size: 0.625rem;
            color: #6c2a09;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      }

      .header-info-id {
        text-align: left;
        font-size: 0.813rem;
        color: #fff;
      }
    }
  }
}

.wrapper-padding {
  padding: 0 0.8rem;
}

.specific {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  height: 14.5rem;
  margin-top: -1.406rem;
  background-image: linear-gradient(-90deg, #ff6a48 0%, #ed4046 100%), linear-gradient(#d09d3f, #d09d3f);
  background-blend-mode: normal, normal;
  border-radius: 0.625rem;

  .specific-items {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    .specific-item {
      display: flex;
      flex-direction: column;
      color: #fff;

      .num {
        font-size: 1rem;
      }

      .text {
        margin-top: 0.2rem;
        font-size: 0.8rem;
      }
    }

    .specific-item:nth-of-type(1) {
      flex: 3;
    }

    .specific-item:nth-of-type(2) {
      flex: 4;
    }

    .specific-item:nth-of-type(3) {
      flex: 3;
    }

    .specific-item-active {
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -0.469rem;
        transform: translateX(-50%);
        display: block;
        width: 1.5rem;
        height: 0.1rem;
        background-color: #fff;
        border-radius: 0.094rem;
      }
    }

    .hr {
      width: 0.063rem;
      height: 1.563rem;
      background-color: #fff;
      opacity: 0.5;
    }
  }

  .split-line {
    height: 0.183rem;
    width: 100%;
    margin-top: 0.5rem;
    background-color: #fff;
    opacity: 0.5;
  }
}

.pending_order {
  padding: 0.3rem 0;
  margin-top: 1.06rem;
  background-color: #fff9f2;
  border-radius: 0.313rem;

  .pending_order_text {
    display: flex;
    align-items: center;
    height: 2rem;
    padding: 0 1rem;
    font-size: 13px;
    color: #65635a;
  }
}

.record-title {
  display: flex;
  align-items: center;
  height: 1rem;
  margin-top: 1.406rem;
  padding-left: 0.594rem;
  text-align: left;
  font-size: 1rem;
  color: #f14e4e;
  border-left: 0.219rem solid #f14e4e;
}

.tabs {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 3.75rem;
  margin-top: 0.813rem;
  padding-bottom: 0.7rem;
  background-color: #18192d;
  border-radius: 0.625rem 0.625rem 0 0;

  .tabs-item {
    font-size: 0.875rem;
    color: #fff;

    &.active {
      position: relative;
      color: #f14e4e;

      &::before {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -0.469rem;
        transform: translateX(-50%);
        display: block;
        width: 1.25rem;
        height: 0.188rem;
        background-color: #f14e4e;
        border-radius: 0.094rem;
      }
    }
  }
}

.listItem {
  padding: 0 0.625rem;
  margin-top: -0.6rem;
  background-color: #fff;
  border-radius: 0.625rem 0.625rem 0 0;

  .date-wrapper {
    height: 5.5rem;
    display: flex;
    align-items: center;
    border-bottom: 0.031rem solid #f2f2f2;

    .time-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      height: 3rem;
      padding-left: 1.218rem;
      text-align: left;
      background-color: #fff;
      box-shadow: 0 0 1rem 0 rgba(210, 210, 210, 0.46);
      border-radius: 0.031rem;

      .time-desc {
        font-size: 0.75rem;
        color: #959595;
      }

      .time-text {
        font-size: 0.938rem;
        color: #333;
      }
    }

    .time-iconfont {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.719rem;
      height: 1.719rem;
      margin-left: -0.5rem;
      margin-right: -0.5rem;
      background-color: #010101;
      border-radius: 50%;
      z-index: 2;

      .iconfont {
        color: #fff;
        font-size: 1rem;
        transform-origin: center;
        transform: rotate(90deg);
      }
    }
  }

  .list-item {
    padding: 0.906rem 0;
    border-bottom: 0.031rem solid #f2f2f2;

    .cc {
      display: flex;
      justify-content: space-between;
    }

    .c1 {
      .order_sn {
        font-size: 0.813rem;
        color: #2c2c2c;
      }
    }

    .c2 {
      margin-top: 0.3rem;
      font-size: 0.688rem;

      .time {
        color: #a8a8a8;
      }

      .settlement_time {
        color: #101010;
      }

      .status {
        color: #2c2c2c;
      }

      .price {
        font-size: 0.875rem;
        color: #f14e4e;
      }

      .deduction {
        font-size: 0.875rem;
        color: #dca64d;
      }
    }

    .details {
      height: 7.813rem;
      margin-top: 0.906rem;
      padding: 0.65rem 0.594rem;
      text-align: left;
      background-color: #f7f7f7;

      .name {
        font-size: 0.75rem;
        color: #2c2c2c;
      }
    }

    .c3 {
      margin-top: 0.3rem;
      font-size: 0.688rem;

      .spec {
        color: #333;
      }

      .time {
        color: #7e7e7e;
      }
    }

    .c4 {
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.688rem;
      color: #7e7e7e;

      .price {
        color: #f14e4e;
      }

      .store_cateroty {
        color: #101010;
      }
    }
  }
}
</style>
