<template>
  <div id="love_push">
    <c-title :hide="false" text="直推奖奖励详情"></c-title>
    <div style="height: 1.25rem; background-color: #fff;"></div>
    <p>直推奖奖励({{$i18n.t('元')}})</p>
    <p id="money">+100</p>
    <p id="dingjing">冻结</p>
    <div class="tbs">
      <div class="left">现团队等级</div>
      <div class="right">社区店</div>
      <div class="left">下级团队代理</div>
      <div class="right">李静</div>
      <div class="left">下级升级至团队等级</div>
      <div class="right">形象店</div>
    </div>
    <div class="lise"></div>
    <div class="tbs">
      <div class="left">升级时间</div>
      <div class="right">6958303457745602122</div>
      <div class="left">奖励时间</div>
      <div class="right">2017-07-07 12:11:00</div>
    </div>
  </div>
</template>
<script>
import cTitle from "components/title";
export default {
  data() {
    return {
      balance: 0
      //是否开启充值
    };
  },
  methods: {
    getBalance() {
      var that = this;
      $http.get("finance.balance.balance", {}, "加载中...").then(
        function(response) {
          if (response.result === 1) {
            console.log(response.data);
          } else {
            that.$dialog.alert({message:response.msg});
         
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
         
        }
      );
    }
  },
  activated() {},
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#love_push {
  padding-bottom: 0.625rem;
  color: #333;
  background-color: #fff;

  p {
    background-color: #fff;
    font-size: 14px;
  }

  #money {
    font-weight: bold;
    color: #333;
    font-size: 28px;
    line-height: 3rem;
  }

  .lise {
    margin: 0.625rem 0.9375rem;
    border-bottom: 0.0625rem solid #ebebeb;
    display: block;
  }

  #dingjing {
    padding-bottom: 0.625rem;
    background-color: #fff;
    color: #8c8c8c;
    margin: 0 auto;
  }

  .tbs {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0 0.9375rem;
    flex-flow: row wrap;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 1.875rem;

    .left {
      flex: 40%;
      text-align: left;
    }

    .right {
      flex: 60%;
      text-align: right;
    }
  }
}
</style>
