<template>
  <div class="page">
    <c-title text="收入报表"></c-title>

    <div class="header">
      <div class="info">
        <div class="c1">
          <p class="price" v-if="bouns != null">{{ bouns.balance }}</p>
          <p class="ps">账户余额(元)</p>
        </div>

        <div class="btn" @click="$router.push(fun.getUrl('withdrawal'))">立即提现</div>
      </div>
      <div class="descItems" v-if="bouns != null">
        <div class="descItem">
          <div class="c1">{{ bouns.grand_total }}</div>
          <div class="c2">累计收益</div>
        </div>
        <div class="descItem">
          <div class="c1">{{ bouns.settled_total }}</div>
          <div class="c2">已提现金额</div>
        </div>
        <div class="descItem">
          <div class="c1">{{ bouns.usable_total }}</div>
          <div class="c2">未结算</div>
        </div>
      </div>
      <div class="tabs">
        <van-tabs v-model="activeIndex" @change="changeVanTabIndex">
          <van-tab title="今日"></van-tab>
          <van-tab title="昨日"></van-tab>
          <van-tab title="本月"></van-tab>
          <van-tab title="上月"></van-tab>
        </van-tabs>
      </div>
    </div>
    <div class="tabContainer" v-if="bouns != null && bouns.list">
      <div class="income">结算收入：{{ $i18n.t("money") }}{{ bouns.list.price }}</div>
      <div class="equity">
        <div class="equity_name">我的订单权益</div>
        <div class="equityContent">
          <div class="item">
            <div class="num">{{ bouns.list.project_count }}</div>
            <div class="desc">订单数量</div>
          </div>
          <div class="line"></div>
          <div class="item">
            <div class="num">{{ bouns.list.project_price }}</div>
            <div class="desc">预估收益</div>
          </div>
        </div>
      </div>
    </div>

    <div class="link" @click="$router.push(fun.getUrl('detailed'))">余额明细</div>
    <div class="link" @click="$router.push(fun.getUrl('presentationRecord', {}, { extension: 'extension' }))">提现明细</div>
  </div>
</template>

<script>
import collageReportformController from "./collage_reportform_controller";

export default collageReportformController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(246, 248, 252);
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.header {
  padding-top: 0.59rem;
  background: #fff;

  .info {
    text-align: left;
    margin: 0 auto;
    width: 21.781rem;
    height: 6.438rem;
    background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pd_income_bg@2x.png);
    background-size: 21.781rem 6.438rem;
    border-radius: 0.406rem;
    padding: 0 0.59rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .c1 {
      .price {
        color: #956416;
        font-size: 1.5rem;
      }

      .ps {
        padding-left: 0.3rem;
        color: #a67322;
        font-size: 0.875rem;
      }
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.094rem;
      color: #956416;
      font-size: 0.738rem;
      width: 4.688rem;
      height: 1.813rem;
      background-color: #fff;
      border-radius: 0.906rem;
    }
  }

  .descItems {
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-around;

    .c1 {
      color: #010101;
      font-size: 0.875rem;
    }

    .c2 {
      color: #333;
      font-size: 0.813rem;
    }
  }

  .tabs {
    margin-top: 0.5rem;
  }
}

.tabContainer {
  padding: 1.156rem 1.469rem 0;
  text-align: left;

  .income {
    color: #333;
    font-size: 0.813rem;
  }

  .equity {
    margin-top: 0.875rem;
    width: 20.625rem;
    height: 7.719rem;
    background-color: #fff;
    border-radius: 0.594rem;
    padding-top: 0.781rem;

    .equity_name {
      padding-left: 0.625rem;
      font-size: 0.875rem;
      color: #333;
    }

    .equityContent {
      display: flex;
      justify-content: space-evenly;
      padding-top: 1rem;

      .line {
        width: 0.031rem;
        height: 2.438rem;
        align-self: flex-end;
        background-color: #e0e0e0;
      }

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .num {
          font-size: 1.25rem;
          color: #333;
        }

        .desc {
          margin-top: 0.5rem;
          font-size: 0.813rem;
          color: #333;
        }
      }
    }
  }
}

.link {
  margin-top: 0.9rem;
  padding-left: 1.438rem;
  font-size: 0.875rem;
  color: #333;
  width: 23.438rem;
  height: 2.656rem;
  display: flex;
  align-items: center;
  background-color: #fff;
}
</style>
