<template>
  <div id="hotel_detail">
    <c-title :hide="false"
             :text='title'></c-title>
    <div id="content">
      <div class="header">
        <div class="user">
          <div class="user-head">
            <img :src="thumb">
          </div>
          <ul class="cashier-name">
            <li>{{name}}</li>
          </ul>
          <div class="user-info">
            <div class="user-name">
              <div class="b-tixian"
                   @click="gotoRecharge"><i class="iconfont icon-tixian2"></i>{{this.fun.initWithdrawal()}}</div>
            </div>
          </div>
        </div>
      </div>
      <div id="userinfo">
        <ul>
          <li>
            <span>{{$i18n.t('money')}}{{total}}</span>
            <br>累计实收金额
          </li>

          <li>
            <span>{{$i18n.t('money')}}{{sure}}</span>
            <br>可{{this.fun.initWithdrawal()}}金额
          </li>
        </ul>
      </div>
      <div class="cart">
        <div class="list1"
             @click="gotoCode"
             v-if="title == '收银台'">
          <van-icon class="iconfont icon-member-withdrawals1"
                   size="1.625rem"
                   color="#f15353"
                   style="margin-right: 0.375rem;"></van-icon>
          <span>收款二维码</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="list1"
             @click="gotoOrder">
          <van-icon class="iconfont icon-member-order4"
                   size="1.625rem"
                   color="#f15353"
                   style="margin-right: 0.375rem;"></van-icon>
          <span>我的酒店订单</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="list1"
             @click="gotoRecord">
          <van-icon class="iconfont icon-member-withdrawals1"
                   size="1.625rem"
                   color="#f15353"
                   style="margin-right: 0.375rem;"></van-icon>
          <span>我的提成</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="list1"
             @click="gotoStat"
             v-if="title == '收银台'">
          <van-icon class="iconfont icon-member-withdrawals1"
                   size="1.625rem"
                   color="#f15353"
                   style="margin-right: 0.375rem;"></van-icon>
          <span>统计结算</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import controller from "./manage_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#hotel_detail {
  #content {
    .header {
      height: auto;
      background: #f15353;
      background-size: 100% 100%;
      padding: 1.25rem;
      position: relative;

      .user {
        display: flex;
        text-align: center;

        .cashier-name {
          text-align: left;
          flex: 2;
          margin-left: 0.625rem;
          line-height: 1.875rem;
          color: #fff;
          font-weight: bold;
          font-size: 18px;
        }

        .user-head {
          height: 3.25rem;
          width: 3.25rem;
          background: #fff;
          border-radius: 50%;
          border: 0.125rem solid #fff;
          box-sizing: border-box;
          float: left;
          overflow: hidden;
        }

        .user-head img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .user-info {
          margin-top: 0.6875rem;
          float: left;
          color: #fff;
        }

        .set {
          position: absolute;
          right: 0.625rem;
          top: 0.625rem;
          color: #fff;
          font-size: 14px;
        }

        .user-info .user-name {
          width: auto;
          font-size: 14px;

          .b-tixian {
            display: flex;
            justify-content: center;
            width: 4.75rem;
            margin-top: 0.5rem;
            margin: 0 auto;
            padding: 0.3125rem;
            border-radius: 1.125rem;
            color: #fff;
            background: rgba(255, 255, 255, 0.3);

            i {
              margin-right: 0.375rem;
              font-size: 1rem;
              color: #fff;
            }
          }
        }

        .user-info .user-other {
          height: 1.25rem;
          width: auto;
          font-size: 0.643em;
          line-height: 1.25rem;
          opacity: 0.8;
        }
      }

      .user-gold {
        height: 2.1875rem;
        width: 94%;
        padding: 0.3125rem 3%;
        border-bottom: 0.0625rem solid #f5f3f3;
        background: #fff;
        font-size: 12px;
        line-height: 2.1875rem;
      }

      .user-gold .title {
        height: 2.1875rem;
        width: auto;
        float: left;
        color: #666;
      }

      .user-gold .num {
        height: 2.1875rem;
        width: auto;
        float: left;
        color: #f90;
      }

      .user-gold .draw {
        width: 5rem;
        height: 1.875rem;
        background: #6c9;
        float: right;
      }

      .user-op {
        height: 2.1875rem;
        width: 94%;
        padding: 0.3125rem 3%;
        border-bottom: 0.0625rem solid #f5f3f3;
        background: #fff;
        font-size: 12px;
        line-height: 2.1875rem;
      }
    }

    #userinfo {
      background: #fff;
      margin-bottom: 0.625rem;

      ul {
        padding: 1rem 0;

        li a {
          color: #8c8c8c;
          text-align: center;
          display: block;
        }

        li a span {
          color: #222;
          font-size: 14px;
        }

        li:first-child {
          border-right: solid 0.0625rem #ebebeb;
        }

        li {
          flex: 1;
          float: left;
          width: 50%;
          box-sizing: border-box;
          border: 0;

          span {
            color: #f15353;
            font-size: 18px;
            display: inline-block;
            margin-bottom: 0.375rem;
            font-weight: bold;
          }

          small {
            font-weight: normal;
            font-size: 12px;
          }
        }

        li:last-child {
          border: 0;
        }

        li a {
          color: #8c8c8c;
          text-align: center;
          display: block;
        }

        li a span {
          color: #222;
          font-size: 16px;
          margin-bottom: 0.3125rem;
          display: inline-block;
        }

        li a {
          color: #8c8c8c;
          font-size: 12px;
        }

        li::after {
          content: "";
          display: block;
          clear: both;
        }
      }

      ul::after {
        content: "";
        display: block;
        clear: both;
      }
    }

    .cart {
      height: auto;
      width: 100%;
      background: #fff;

      .list1 {
        height: 2.75rem;
        background: #fff;
        padding-right: 0.875rem;
        margin-left: 0.875rem;
        border-top: 0.0625rem solid #ebebeb;
        font-size: 16px;
        line-height: 2.75rem;
        color: #333;
        text-align: left;
        display: flex;
        align-items: center;

        .fa-angle-right {
          float: right;
          line-height: 2.75rem;
          display: inline-block;
          font-size: 1.5rem;
          color: #c9c9c9;
          text-align: center;
          background-size: 1.25rem;
          position: absolute;
          right: 0.875rem;
        }
      }
    }
  }
}
</style>
