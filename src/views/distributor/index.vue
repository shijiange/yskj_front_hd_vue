<template>
  <div id="distributor">
    <c-title :hide="false" text="渠道商" :url="'member'"></c-title>
    <div class="header">
      <div class="head-left">
        <img :src="memberInfo.avatar" alt="" />
      </div>
      <div class="head-right">
        <p class="name">{{ memberInfo.nickname }}</p>
        <div>
          <p class="red">{{ memberInfo.level_name }}</p>
        </div>
      </div>
      <div class="head_other" v-if="memberInfo.is_show_shop_order">
        <p style="font-size: 10px;">平台直订业绩</p>
        <p style="font-size: 1rem;">{{ memberInfo.shop_order_price_total }}</p>
      </div>
    </div>

    <div class="profit" @click="gotoUrl('accumulatedIncome')">
      <p>
        累计收益 <span class="red-color">{{ $i18n.t("money") }}{{ statistic.amount_total }}</span>
      </p>
      <i class="iconfont icon-advertise-next"></i>
    </div>

    <ul class="flex-box money">
      <li>
        <p>{{ statistic.shipment_total }}</p>
        <span>出货收入</span>
      </li>
      <li v-if="is_openOption.is_open_recommend_award == 1">
        <p>{{ statistic.recommend_total }}</p>
        <span>{{ recommend_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_contribute_award == 1">
        <p>{{ statistic.contribute_total }}</p>
        <span>{{ contribute_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_service_award == 1">
        <p>{{ statistic.service_total }}</p>
        <span>{{ service_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_equal_award == 1">
        <p>{{ statistic.equal_total }}</p>
        <span>{{ equal_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_surpass_award == 1">
        <p>{{ statistic.surpass_total }}</p>
        <span>{{ surpass_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_manage_award == 1">
        <p>{{ statistic.manage_total }}</p>
        <span>{{ manage_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_shareholder_award == 1">
        <p>{{ statistic.shareholder_total }}</p>
        <span>{{ shareholder_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_alike_level == 1">
        <p>{{ statistic.alike_level_total }}</p>
        <span>{{ alike_level_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_equal_alike_level == 1">
        <p>{{ statistic.equal_alike_level_total }}</p>
        <span>{{ equal_alike_level_award_name }}</span>
      </li>
      <li v-if="is_openOption.is_open_direct_recommend == 1">
        <p>{{ statistic.direct_total }}</p>
        <span>{{ direct_recommend_award_name }}</span>
      </li>
    </ul>

    <ul class="flex-box red-box">
      <li @click="gotoUrl('myRepertory')">
        <i class="iconfont icon-kc_wodekucun"></i>
        <span>我的库存</span>
      </li>
      <li @click="gotoUrl('orderGoods')">
        <i class="iconfont icon-kc_dinghuo"></i>
        <span>订货</span>
      </li>
      <li @click="gotoUrl('deliverGoods')" v-if="is_open_freedom == '1'">
        <i class="iconfont icon-kc_fahuo"></i>
        <span>发货</span>
      </li>
      <li @click="gotoUrl('exchangeGoods')" v-if="is_open_exchange == '1'">
        <i class="iconfont icon-kc_huanhuo"></i>
        <span>换货</span>
      </li>
      <li @click="gotoUrl('distributorRank')" v-if="is_openOption.is_ranking == 1">
        <i class="iconfont icon-fontclass-paihangbang"></i>
        <span>排行榜</span>
      </li>
      <li @click="gotoUrl('estimatedIncome')" v-if="show_estimate_award == '1'">
        <i class="iconfont icon-fontclass-yugushouyi"></i>
        <span>预估收益</span>
      </li>
    </ul>

    <p class="title">客户管理</p>

    <ul class="flex-box flex-warp">
      <li @click="gotoUrl('myReferrals')">
        <i class="iconfont icon-kc_line_client"></i>
        <span>我的客户</span>
      </li>
      <li @click="gotoUrl('clientOrder', { status: '0' })">
        <i class="iconfont icon-kc_line_order"></i>
        <span>客户订单</span>
        <div class="Badge" v-show="statistic && Number(statistic.read_count) > 0">
          {{ Number(statistic.read_count) > 99 ? "99+" : Number(statistic.read_count) }}
        </div>
      </li>
      <li @click="gotoUrl('myDeliver', { status: '0', orderType: 'myDeliver' })">
        <i class="iconfont icon-kc_line_fahuo"></i>
        <span>我的发货</span>
      </li>
      <li @click="gotoUrl('myExchange')">
        <i class="iconfont icon-kc_line_huanhuo"></i>
        <span>换货记录</span>
      </li>
      <li @click="gotoUrl('address')">
        <i class="iconfont icon-kc_line_locate"></i>
        <span>地址管理</span>
      </li>
      <li
        @click="
          gotoUrl('dismyReplenishment', {
            status: '0',
            orderType: 'dismyReplenishment'
          })
        "
      >
        <i class="iconfont icon-kc_line_buhuo"></i>
        <span>我的补货</span>
      </li>
      <li @click="gotoUrl('recommendUp')" v-if="is_open_recommend == '1'">
        <i class="iconfont icon-kc_line_update"></i>
        <span>推荐升级</span>
      </li>
    </ul>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#distributor {
  background: #fff;
  padding: 1rem;
  min-height: 100vh;
}

.title {
  text-align: left;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 1rem;
}

.header {
  display: flex;
  margin-top: 1rem;
  align-items: center;

  .head-left {
    flex: 0 0 4rem;

    img {
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
    }
  }

  .head-right {
    margin: 0.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;

    .name {
      font-weight: bold;
      font-size: 16px;
    }

    .red {
      font-size: 12px;
      padding: 0.1rem 0.8rem;
      display: inline-block;
      text-align: center;
      color: #f24d4d;
      background-color: rgba(242, 77, 77, 0.1);
      border-radius: 15px;
    }
  }

  .head_other {
    color: #f24d4d;
    background-color: rgba(242, 77, 77, 0.1);
    border-radius: 2rem 0 0 2rem;
    overflow: hidden;
    padding: 0 1rem;
    height: 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: -1rem;
  }
}

.flex-box {
  display: flex;
  flex-wrap: wrap;

  li {
    margin-bottom: 1rem;
    width: 25%;
    display: flex;
    flex-direction: column;
    position: relative;

    i {
      font-size: 27px;
    }

    .Badge {
      height: 0.875rem;
      line-height: 0.875rem;
      font-size: 0.75rem;
      color: #fff;
      padding: 0 0.25rem;
      border-radius: 1rem;
      background-color: #f15353;
      position: absolute;
      top: -5px;
      left: 55%;
    }
  }
}

.flex-warp {
  flex-wrap: wrap;
}

.profit {
  display: flex;
  margin: 1rem 0;
  font-size: 16px;
  font-weight: bold;

  p {
    flex: 1;
    text-align: left;
  }

  i {
    flex: 0 0 2rem;
  }

  .red-color {
    font-size: 14px;
    color: #f42929;
  }
}

.money {
  p {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 0.5rem;
  }

  span {
    color: #999;
  }
}

.red-box {
  i {
    color: #f42929;
  }
}
</style>
