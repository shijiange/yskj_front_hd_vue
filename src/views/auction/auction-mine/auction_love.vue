<template>
  <div id="auction_love">
    <c-title :hide="false"
             text="保证金"
            
            >
    </c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="my_balance">
        <li class="balance_a">
          <i class="iconfont icon-wealth-b"></i>
          <span>我的保证金（元）</span>
        </li>
        <li class="balance_b">{{ Data.balance }}</li>
      </ul>
      <ul class="list_box">
        <li 
            @click="toPage('auctionLoveCash')">
          <i class="iconfont icon-balance_a"></i>提现
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="toPage('auctionRecharge')"
          >
          <i class="iconfont icon-integral_top_up"></i>充值
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import auction_love_controller from "./auction_love_controller";

export default auction_love_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#auction_love {
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
            url("../../../assets/images/member/member_a(55).png")
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

        .icon-balance_q {
          color: #ff855c;
        }

        .icon-balance_b {
          color: #ffb34c;
        }

        .icon-balance_m {
          color: #418be0;
        }

        .icon-balance_n {
          color: #ff855c;
        }

        .icon-integral_top_up {
          color: #fe591f;
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

  .mask {
    background-color: rgba(51, 51, 51, 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 888;

    .wrap {
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 11.875rem;
      height: 15rem;
      position: absolute;

      .pop {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 11.875rem;
        height: 12.1875rem;
        background-color: #fff;
        border-radius: 0.5313rem;

        .pop-icon {
          width: 3rem;
          height: 3rem;
          margin: 0 auto;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .high {
          width: 100%;
          font-size: 14px;
          color: #f35353;
          margin-top: 0.5625rem;
          margin-bottom: 2rem;
        }

        .nor {
          font-size: 12px;
        }
      }

      .close {
        width: 1.5rem;
        height: 1.5rem;
        margin: 0 auto;
        margin-top: 0.9063rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.icon {
  font-size: 8rem;
  color: #f15353;
}
</style>
