<template>
  <div id="zhpFinance">
    <c-title :hide="false" :text="'财务统计'"></c-title>
    <div class="topHead"></div>
    <div class="financeList">
      <div class="financeLis" style="margin-bottom: 0.5rem" v-if="list.shop || list.love">
        <div class="titleBox">商城流量值</div>
        <div class="ceTitle" v-if="list.shop">{{ list.shop.shop_flow_value }}</div>
        <div class="bg" v-if="list.shop">
          <div class="bgtop">
            <div class="litop">{{list.shop.amount_interval_name || "流量区间值"}}</div>
            <div class="litop">明日提现比例</div>
          </div>
          <div class="bgbottom">
            <div class="li" style="border-right: 1.0016px solid #99690b">{{ list.shop.shop_amount }}</div>
            <div class="li">{{ list.shop.withdraw_rate }}%</div>
          </div>
        </div>
        <div class="bg" v-if="list.love">
          <div class="bgtop">
            <div class="litop">{{ list.love.froze_love_name || "冻结爱心值" }}</div>
            <div class="litop">{{ list.love.plugin_name || "可用爱心值" }}</div>
          </div>
          <div class="bgbottom">
            <div class="li" style="border-right: 1.0016px solid #99690b">{{ list.love.froze_Love }}</div>
            <div class="li">{{ list.love.love }}</div>
          </div>
        </div>
        <div class="btn" @click="toLink('love')">去提现</div>
      </div>
      <div class="financeLis" v-if="list.credit">
        <div class="titleBox">{{ list.credit.plugin_name }}</div>
        <div class="bg">
          <div class="bgtop">
            <div class="litop">{{ list.credit.plugin_name }}余额</div>
            <div class="litop">累计待奖励</div>
            <div class="litop">参团金额</div>
            <div class="litop">参团总额</div>
          </div>
          <div class="bgbottom">
            <div class="lis">{{ list.credit.balance }}</div>
            <div class="lis">{{ list.credit.accumulate_wait_reward }}</div>
            <div class="lis line">{{ list.credit.single_join_group_total }}</div>
            <div class="lis">{{ list.credit.join_group_total_amount }}</div>
          </div>
        </div>
      </div>
      <div class="financeLis" v-if="list.integral" style="margin-top: 0.5rem">
        <div class="titleBox">{{ list.integral.plugin_name }}</div>
        <div class="bg">
          <div class="bgtop">
            <div class="litop">{{list.integral.plugin_name}}余额</div>
            <div class="litop">今日收益</div>
            <div class="litop">累计收益</div>
          </div>
          <div class="bgbottom">
            <div class="lis">{{ list.integral.balance }}</div>
            <div class="lis">{{ list.integral.today_earnings }}</div>
            <div class="lis">{{ list.integral.accumulate_earnings }}</div>
          </div>
        </div>
        <div class="btn" @click="toLink('int')">去提现</div>
      </div>

      <div class="financeLis" v-if="list.contribution" style="margin-top: 0.5rem">
        <div class="titleBox">{{ list.contribution.plugin_name }}</div>
        <div class="bg">
          <div class="bgtop">
            <div class="litop">昨日奖励</div>
            <div class="litop">累计奖励</div>
          </div>
          <div class="bgbottom">
            <div class="li" style="border-right: 1.0016px solid #99690b">{{ list.contribution.yesterday_reward }}</div>
            <div class="li">{{ list.contribution.accumulate_reward }}</div>
          </div>
        </div>
        <div class="btn" @click="toLink('contribution')">去提现</div>
      </div>
    </div>
  </div>
</template>
<script>
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: []
    };
  },
  methods: {
    toLink(key) {
      if (key == "contribution") {
        this.$router.push(this.fun.getUrl("withdrawal"));
      } else if (key == "int") {
        this.$router.push(this.fun.getUrl("Integral_love"));
      } else {
        this.$router.push(this.fun.getUrl("love_index"));
      }
    },
    getData() {
      $http
        .post("plugin.zhp-group-lottery.frontend.statistical.get-financial-list", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.list = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  activated() {
    this.getData();
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#zhpFinance {
  width: 100%;
  min-height: 100vh;
  .btn {
    padding: 0.59rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ae0601;
    border-radius: 0.31rem;
    color: #fff;
    margin-top: 0.65rem;
    width: 18.28rem;
  }
  .ceTitle {
    width: 100%;
    text-align: center;
    font-size: 1.25rem;
    color: #202020;
    margin-top: 0.65rem;
  }
  .financeList {
    padding: 0 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-top: -4.22rem;
    padding-bottom: 2rem;
    .financeLis {
      background: #fcdfa0;
      border-radius: 0.47rem;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding-bottom: 0.5rem;

      .bg {
        width: 18.28rem;
        height: 4.44rem;
        background-color: #fff;
        border-radius: 0.31rem;
        border: solid 0.03rem #b80b05;
        margin-top: 0.63rem;

        .bgbottom {
          height: 2.28rem;
          width: 100%;
          display: flex;
          flex-shrink: 0;

          .lis:nth-child(1) {
            border-right: 1.0016px solid #99690b;
          }

          .lis:nth-child(2) {
            border-right: 1.0016px solid #99690b;
          }
          .line {
            border-right: 1.0016px solid #99690b;
          }
          .li {
            flex: 1;
            height: 100%;
            color: #000;
            font-size: 0.75rem;
            padding: 0 0.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 2.28rem;
          }

          .lis {
            width: 33%;
            height: 100%;
            color: #000;
            font-size: 0.75rem;
            padding: 0 0.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 2.28rem;
          }
        }

        .bgtop {
          height: 2.06rem;
          width: 100%;
          background-color: #b80b05;
          display: flex;
          align-items: center;

          .litop {
            flex: 1;
            color: #fff;
            font-size: 0.75rem;
          }
        }
      }

      .titleBox {
        width: 8.13rem;
        height: 1.75rem;
        border-radius: 0.88rem;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.81rem;
        color: #ae0601;
        margin-top: 0.94rem;
      }
    }
  }

  .topHead {
    width: 100%;
    margin-top: 4.5rem;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    font-size: 1.47rem;
    color: #f8dc98;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>