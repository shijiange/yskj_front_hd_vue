<template>
  <div id="balance">
    <c-title :hide="false"
             :text="balanceLang"
             tolink="detailed"
             :totext="`${balanceLang}明细`"></c-title>

    <div class="content">
      <ul class="my_balance">
        <li class="balance_a">
          <i class="iconfont icon-wealth-a"></i><span>我的{{ balanceLang }}</span>
        </li>
        <li class="balance_b"><small>{{$i18n.t('money')}}</small>{{ member_credit2 }}</li>
      </ul>
      <ul class="list_box">
        <li @click="chargeHandel"
            v-if="dataInfo.recharge&&dataInfo.recharge==1">
          <i class="iconfont icon-balance_b"></i>
          充值
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="transferHandel"
            v-if="dataInfo.transfer&&dataInfo.transfer==1">
          <i class="iconfont icon-balance_c"></i>
          转账
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="withdrawHandel"
            v-if="dataInfo.withdraw&&dataInfo.withdraw==1">
          <i class="iconfont icon-balance_a"></i>
          {{this.fun.initWithdrawal()}}
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="transformingLoveV"
            v-if="dataInfo.convert">
          <i class="iconfont icon-balance_p"></i>
          转化{{dataInfo.love_name}}
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import memberBanlanceController from "./member_banlanceController";
export default memberBanlanceController;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#balance {
  .content {
    background: #fff;

    .my_balance {
      padding: 0.625rem 0;

      .balance_a {
        line-height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-wealth-a {
          background:
            url("../../../assets/images/member/member_a(46).png")
            no-repeat center;
          background-size: 1.125rem;
          width: 1.125rem;
          height: 1.125rem;
          margin-right: 0.375rem;
        }

        .icon-wealth-a::before {
          content: "";
        }

        span {
          font-size: 14px;
        }
      }

      .balance_b {
        line-height: 3.75rem;
        font-size: 36px;

        small {
          font-size: 24px;
        }
      }
    }

    .list_box {
      padding-left: 0.875rem;
      border-top: solid 0.0625rem #ebebeb;
      border-bottom: solid 0.0625rem #ebebeb;

      li {
        border-bottom: solid 0.0625rem #ebebeb;
        padding-right: 0.875rem;
        display: flex;
        align-items: center;
        line-height: 2.875rem;
        font-size: 16px;
        position: relative;

        .icon-balance_a {
          color: #6cbf6a;
        }

        .icon-balance_b {
          color: #fac337;
        }

        .icon-balance_c {
          color: #069ce7;
        }

        .icon-balance_p {
          color: #f15353;
        }

        .iconfont {
          font-size: 2rem;
          margin-right: 0.375rem;
        }

        .fa {
          position: absolute;
          top: 0;
          right: 0.875rem;
          font-size: 1.5rem;
          color: #ccc;
          line-height: 2.875rem;
        }
      }

      li:last-child {
        border: none;
      }
    }
  }
}
// button{width: 90%;margin-bottom:0.75rem;height:2.875rem;}
// i{font-size: 4.375rem;  color: #ffd147;}
// .my-banlance{margin: 1.25rem 0;font-size: 14px;  color: #333;line-height: 2rem;}
// .my-banlance span{font-size: 16px;color: #333;margin-top:0.625rem; }
// .my-banlance span b{font-size: 24px;}
</style>
