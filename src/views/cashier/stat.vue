<template>
  <div id="all">
    <div id="member">
      <c-title :hide="false"
               text="统计结算"></c-title>
      <div class="header">
        <div class="user">
          <div class="user-head">
            <img :src="store.thumb" />
          </div>
          <ul data-v-21e0c5a4=""
              class="cashier-name"
              style="">
            <li>{{ store.name }}</li>
            <li v-if="this.is_distribution"><span>{{store.full_address}}</span></li>
          </ul>

          <div class="clearfix"></div>
        </div>
      </div>

      <div class="data-btn">

          <van-button size="large" type="primary"
                     @click.native="getStat(1)">查看今日数据</van-button>

      </div>
      <!-- 收银台 统计结算 -->
      <div class="cart"
           v-if="!this.is_distribution">
        <!--<router-link to="/member/marketing">
                                <div class="list1" ><div class="ico marketing"></div>
                                    营销工具
                                    <i class="fa fa-angle-right" ></i></div>
                            </router-link>-->
        <!--<router-link to=""><div class="list1" style="margin:0px;"><i class="iconfont icon-article"></i>我的消息<i class="fa fa-angle-right" style="color:#999; font-size:26px; float:right; line-height:44px;"></i></div></router-link>-->

        <div class="listStat" v-for="(item,index) in statList" :key="index">
          <div class="ico extension"></div>
          {{item.name}}
          <i class="statRight">{{$i18n.t('money')}}{{ stat[item.value] }}</i>
        </div>
      </div>
      <!-- 配送站 统计结算 -->
      <div class="cart"
           v-if="this.is_distribution">
        <div class="listStat">
          <div class="ico extension"></div>
          累计配送订单金额
          <i class="statRight">{{$i18n.t('money')}}{{store.order_price}}</i>
        </div>
        <div class="listStat">
          <div class="ico extension"></div>
          累计配送订单数
          <i class="statRight">{{store.order_num}}</i>
        </div>
        <div class="listStat">
          <div class="ico extension"></div>
          累计服务津贴
          <i class="statRight">{{$i18n.t('money')}}{{store.grand_total_amount}}</i>
        </div>
        <div class="listStat">
          <div class="ico extension"></div>
          已{{this.fun.initWithdrawal()}}服务津贴
          <i class="statRight">{{$i18n.t('money')}}{{store.available_total_amount}}</i>
        </div>
        <div class="listStat">
          <div class="ico extension"></div>
          未结算服务津贴
          <i class="statRight">{{$i18n.t('money')}}{{store.wait_amount}}</i>
        </div>
      </div>
      <div style="height: 20px; clear: both;"></div>

      <div style="height: 60px; clear: both;"></div>
    </div>
    <div id="ewm"
         ref="hook"
         @click="openQrCode('none')">
      <div class="pic">
        <img :src="poster"
             alt="" />
      </div>
    </div>
    <div id="jpg"></div>
  </div>
</template>

<script>
import stat from "./stat_controller";
export default stat;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/cashier.scss";

.clearfix {
  clear: both;
}

#member {
  .header {
    .cashier-name {
      li {
        display: flex;

        span {
          font-size: 12px;
          line-height: 1.25rem;
          display: block;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.125rem 0.5rem;
          border-radius: 0.625rem;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
