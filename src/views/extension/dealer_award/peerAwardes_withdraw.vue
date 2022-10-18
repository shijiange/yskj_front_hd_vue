<template>
  <div id="dragon_withdraw">
    <c-title :hide="false"
             text="提现至收入"></c-title>
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>可提现：</span>
          <span>{{withdraw_amount}}{{$i18n.t('元')}}</span>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>提现金额 <em v-if="withdraw_limit"
              style="color: #f15353;">({{`最低提现金额${withdraw_limit}${$i18n.t('元')}`}})</em></span>
        <div class="sum">
          <div>
            {{$i18n.t('money')}}<input type="number"
                   v-model="money"
                   placeholder="0.00" />
          </div>
        </div>
      </div>
      <div class="btn"
           v-show="money>0"
           @click="confirm()">
        确认提现
      </div>
      <div class="btn"
           style="background-color: #999;"
           v-show="money<=0">
        确认提现
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      money: "",
      withdraw_amount: 0,//可提现金额
      withdraw_limit:0//提现额度
    };
  },

  activated() {
    this.money=null;
    this.withdraw_amount = 0;
    this.withdraw_limit = 0;
    this.getData();
  },

  methods: {
    getData() {
      $http
        .get("plugin.team-sideways.frontend.withdraw.index", {}, " ")
        .then(response => {
          if (response.result === 1) {
            this.withdraw_amount = response.data.withdraw_amount||0;
            this.withdraw_limit = response.data.withdraw_limit;//0不可以提现，null不限制，其他，提现金额大于等于额度
          } else {
            this.$dialog.alert({message:response.msg});
            
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //确认提现
    confirm() {
      let that = this;
      if (this.withdraw_limit&&parseFloat(this.withdraw_amount) < parseFloat(this.withdraw_limit)) {
        that.$dialog.alert({message:`提现金额不足`});
        return;
      }

      if (parseFloat(this.withdraw_amount) < parseFloat(this.money)) {
        that.$dialog.alert({message:`提现金额超出`});
        
        return;
      }

      if (this.withdraw_limit&&parseFloat(this.money) < parseFloat(this.withdraw_limit)) {
        that.$dialog.alert({message:`提现金额不小于${this.withdraw_limit}`});
        return;
      }
      $http
        .post("plugin.team-sideways.frontend.withdraw.handle", {
          amount: Number(this.money).toFixed(2)
        })
        .then(
          function(response) {
            if (response.result === 1) {
              Toast("提现成功！");
              that.$router.go(-1);
            } else {
              that.$dialog.alert({message:response.msg});
              
            }
          },
          function(response) {
            // error callback
          }
        );
    }
  },
  components: { cTitle }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#dragon_withdraw {
  .content {
    .transfer_info {
      background: #fff;
      padding-left: 0.875rem;
      font-size: 16px;

      .info_a,
      .info_b {
        line-height: 2.875rem;
        border-bottom: solid 0.0625rem #ebebeb;
        display: flex;
        justify-content: flex-start;

        span:first-child {
          width: 6.875rem;
          display: block;
          text-align: left;
        }

        input {
          border: none;
          width: 15.625rem;
        }
      }
    }

    .transfer_sum {
      background: #fff;
      padding: 0.625rem 0.875rem;

      span {
        display: block;
        font-size: 16px;
        line-height: 2.5rem;
        text-align: left;
      }

      .sum {
        text-align: left;
        font-size: 18px;

        input {
          margin-left: 0.375rem;
          line-height: 2rem;
          color: #666;
          width: 90%;
          font-size: 20px;
          border: none;
        }
      }
    }

    .btn {
      margin: 0 auto;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      width: 80%;
      height: 3rem;
      border-radius: 0.25rem;
      color: #fff;
      background-color: #f15353;
    }
  }
}
</style>
