<template>
  <div id="love_index">
    <c-title :hide="false"
             :text="coin_name"
             tolink="overseas_list"
             totext="查看明细"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="my_balance">
        <li class="balance_a">
          <i class="iconfont icon-wealth-b"></i>
          <span>可用{{ coin_name }}（{{$i18n.t('元')}}）</span>
        </li>
        <li class="balance_b">{{ usable }}</li>
        <li class="balance_c">冻结{{ coin_name }}{{ froze }}{{$i18n.t('元')}}</li>
      </ul>
      <ul class="list_box">
        <li @click="gotoPage('overseas_transfer')"
            v-if="transfer_status">
          <i class="iconfont icon-balance_c"></i>转账
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="gotoPage('overseas_balance_withdrawals')">
          <i class="iconfont icon-balance_a"></i>{{this.fun.initWithdrawal()}}
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
      <ul class="list_box_b">
        <li @click="gotoPage('overseas_record')">
          <i class="iconfont icon-balance_m"></i>激活记录
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
      <div class="explain"
           @click="gotoPage('overseas_explain')">
        <i class="iconfont icon-balance_o"></i>
        <span>{{ coin_name }}说明</span>
      </div>
    </div>
  </div>
</template>
<script>
import overseas_index_Controller from "./overseas_index_Controller";
export default overseas_index_Controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#love_index {
  .content {
    .my_balance {
      background: #fff;
      padding: 0.625rem 0;

      .balance_a {
        line-height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon-wealth-b {
          background:
            url("../../assets/images/member/member_a(14).png")
            no-repeat center;
          background-size: 1.125rem;
          width: 1.125rem;
          height: 1.125rem;
          margin-right: 0.375rem;
        }

        .icon-wealth-b::before {
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

      .balance_c {
        font-size: 14px;
        color: #8c8c8c;
      }
    }

    .list_box,
    .list_box_b {
      background: #fff;
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

        .icon-balance_l {
          color: #ee4343;
        }

        .icon-balance_m {
          color: #418be0;
        }

        .icon-balance_n {
          color: #ff855c;
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

    .list_box_b {
      margin-top: 0.625rem;
    }

    .explain {
      width: 100%;
      position: fixed;
      display: flex;
      justify-content: center;
      bottom: 0.625rem;

      i {
        font-size: 1.125rem;
        color: #658299;
        margin-right: 0.375rem;
      }

      span {
        color: #658299;
        font-size: 13px;
      }
    }
  }

  button {
    width: 70%;
    margin: 0.3125rem 0;
  }

  i {
    font-size: 4.375rem;
    color: #fc0;
  }

  .my-banlance {
    margin: 1.25rem 0;
    font-size: 14px;
    color: #333;
    line-height: 2rem;
  }

  .my-banlance span {
    font-size: 14px;
    color: #333;
    margin-top: 0.625rem;
  }

  .my-banlance span b {
    font-size: 26px;
  }

  #djj {
    margin: 0.9375rem 0;
    font-size: 18px;
  }

  #jh {
    margin-top: 0.3125rem;

    #jhst {
      border-right: 0.0625rem solid #8c8c8c;
      padding-right: 0.9375rem;
    }

    span {
      padding: 0 0.9375rem;
    }
  }

  #helps {
    position: fixed;
    bottom: 0.625rem;
    left: 0;
    right: 0;

    a {
      color: #607d8b;
      font-size: 12px;
    }

    p {
      background: #f15353;
      color: #fff;
      border-radius: 50%;
      width: 1.25rem;
      height: 1.25rem;
      line-height: 1.25rem;
      margin: 0 auto;
      margin-bottom: 0.25rem;
    }
  }
}
</style>
