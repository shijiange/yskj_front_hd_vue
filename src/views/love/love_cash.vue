<template>
  <div id="love_cash">
    <c-title :hide="false"
             :text="`${income_name_text}${this.fun.initWithdrawal()}奖励详情`"></c-title>
    <div style="height: 1.25rem; background-color: #fff;"></div>
    <p>{{income_name_text}}{{this.fun.initWithdrawal()}}奖励({{$i18n.t('元')}})</p>
    <p id="money">+100</p>
    <p id="dingjing">激活</p>
    <div class="tbs">
      <div class="left">{{income_name_text}}{{this.fun.initWithdrawal()}}类型</div>
      <div class="right">100.00{{$i18n.t('元')}}</div>
      <div class="left">{{income_name_text}}{{this.fun.initWithdrawal()}}金额</div>
      <div class="right">20%</div>
      <div class="left">{{this.fun.initWithdrawal()}}手续费</div>
      <div class="right">20.00{{$i18n.t('元')}}</div>
      <div class="left">{{ love_name }}奖励比例</div>
      <div class="right">20%</div>
    </div>
    <div class="lise"></div>
    <div class="tbs">
      <div class="left">{{income_name_text}}{{this.fun.initWithdrawal()}}到账时间</div>
      <div class="right">2017-07-07 12:11:00</div>
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
      balance: 0,
      //是否开启充值
      love_name: "", //爱心值自定义名称
      usable: 0, // 登陆会员可用爱心值
      income_name_text: ""
    };
  },
  methods: {
    getUsable() {
      let that=this;
      $http
        .get("plugin.love.Frontend.Controllers.page.index", {}, "加载中...")
        .then(
          response => {
            if (response.result == 1) {
              this.usable = response.data.usable;
              this.love_name = response.data.love_name;
            } else {
              that.$dialog.alert({message:response.msg});
             
            }
          },
          function(response) {
            that.$dialog.alert({message:response.msg});
            
          }
        );
    },
    getBalance() {
      var that = this;
      $http.get("finance.balance.balance", {}, "加载中...").then(
        function(response) {
          if (response.result == 1) {
            console.log(response.data);
          } else {
            that.$dialog.alert({message:response.msg});
          
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
          
        }
      );
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  activated() {
    this.getUsable();
    this.customizeIncome();
    this.fun.setWXTitle(
      this.income_name_text + `${this.fun.initWithdrawal()}奖励详情`
    );
  },
  components: { cTitle }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#love_cash {
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

    small {
      font-size: 14px;
    }
  }

  #dingjing {
    padding-bottom: 0.625rem;
    background-color: #fff;
    color: #8c8c8c;
    margin: 0 auto;
  }

  .lise {
    margin: 0.625rem 0.9375rem;
    border-bottom: 0.0625rem solid #ebebeb;
    display: block;
  }

  .tbs {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0 0.9375rem;
    flex-flow: row wrap;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 2rem;

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
