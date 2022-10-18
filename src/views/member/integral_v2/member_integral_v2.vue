<template>
  <div id="balance">
    <c-title
      :hide="false"
      :text="integral ? integral : '积分'"
      tolink="integrallist"
      :totext="'查看明细'"
    ></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="my_balance">
        <li class="balance_a">
          <i class="iconfont icon-wealth-b"></i
          ><span>我的{{ integral ? integral : "积分" }}</span>
        </li>
        <li class="balance_b">{{ credit1 }}</li>
      </ul>
      <ul class="list_box">
        <!--没有这两功能-->
        <!--<li v-if="false" @click="chargeHandel">-->
        <!--<i class="iconfont icon-balance_b"></i>充值-->
        <!--<i class="fa fa-angle-right"></i>-->
        <!--</li>-->
        <!--<li v-if="false" @click="withdrawHandel">-->
        <!--<i class="iconfont icon-balance_a"></i>提现-->
        <!--<i class="fa fa-angle-right"></i>-->
        <!--</li>-->
        <li @click="transferHandel" v-if="transfer">
          <i class="iconfont icon-balance_c"></i>转账
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
      <ul class="list_box_b">
        <li @click="toIntegral" v-if="activity">
          <i class="iconfont icon-balance_l"></i
          >{{ integral ? integral : "积分" }}活动
          <i class="fa fa-angle-right"></i>
        </li>
		<li @click="toIntegralBlueCattle" v-if="lan_plugin">
          <i class="iconfont icon-fontclass-lanniujifen" style="font-size: 1.2rem; padding-left: 6px; padding-right: 6px;"></i
          >{{ lan_name ? lan_name : "蓝牛积分" }}
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>



    </div>
  </div>
</template>
<script>
import member_integral_v2Controller from "./member_integral_v2Controller";

export default member_integral_v2Controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#balance {
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
            url("../../../assets/images/member/member_a(18).png")
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
    }

    .list_box,
    .list_box_b {
      background: #fff;

      //border-bottom: solid 0.0625rem #ebebeb;
      li {
        padding-left: 0.875rem;
        border-top: solid 0.0625rem #ebebeb;
        //border-bottom: solid 0.0625rem #ebebeb;
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
          color: #f27435;
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
        border-bottom: solid 0.0625rem #ebebeb;
      }
    }

    .list_box_b {
      margin-top: 10px;
    }
  }
}

button {
  width: 90%;
  height: 2.875rem;
  font-size: 16px;
  margin-bottom: 12px;
}

i {
  font-size: 4.375rem;
  color: #ffd147;
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
  font-size: 24px;
}
</style>
