<template>
  <div id="hand-withdraw">
    <c-title :hide="false"
             :text="`手动${this.fun.initWithdrawal()}`"></c-title>
    <div class="content">
      <div class="address_box"
           @click="show1 = true">
        <i class="iconfont icon-info_position"></i>
        <p style="-webkit-box-orient: vertical;">{{address}}</p>
        <i class="fa fa-angle-right"></i>
      </div>
      <div class="transfer_box">
        <ul class="transfer_info">
          <li class="info_b">
            <span>可{{this.fun.initWithdrawal()}}的{{integral_name}}：</span>
            <span>{{member_integral}}</span>
          </li>
        </ul>
        <div class="transfer_sum">
          <span>{{this.fun.initWithdrawal()}}金额</span>
          <div class="sum">
            {{$i18n.t('money')}}<input type="tel"
                   v-model="cash"
                   placeholder="0.0" />
          </div>
        </div>
      </div>
      <button type="button"
              class="transfer_btn"
              @click="sureCash">确认{{this.fun.initWithdrawal()}}</button>
      <van-popup v-model="show1"
                 position="bottom"
                 height="60%">
        <div class="select_address">
          <ul class="select_box">
            <van-radio-group v-model="radio">
              <li v-for="(item,index) in addressData" :key='index'>
                <p>{{item.address}}</p>
                <van-radio :name="item.id"
                           checked-color="#f15353"
                           @click="selectAddress(item)"></van-radio>
              </li>
            </van-radio-group>
          </ul>
          <button type="button"
                  class="address_btn"
                  @click="toAdd">新增提出地址</button>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import hand_withdraw_controller from "./hand_withdraw_controller";
export default hand_withdraw_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#hand-withdraw {
  .content {
    margin-top: 0.625rem;

    .address_box {
      background: #fff;
      display: flex;
      justify-content: space-between;
      padding: 14px;
      align-items: center;

      .iconfont {
        font-size: 1.5rem;
        color: #333;
      }

      p {
        width: 18.75rem;
        display: block;
        line-height: 2.5rem;
        font-size: 14px;
        text-align: left;
        word-wrap: break-word;
      }

      .fa {
        font-size: 1.5rem;
        color: #c9c9c9;
      }
    }

    .transfer_box {
      margin-top: 0.625rem;
      background: #fff;
      padding-left: 0.875rem;

      .transfer_info {
        background: #fff;
        font-size: 16px;

        .info_a,
        .info_b {
          line-height: 2.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          display: flex;
          justify-content: flex-start;

          span:first-child {
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
        padding: 0.625rem 0.875rem 0.625rem 0;

        span {
          display: block;
          font-size: 16px;
          line-height: 2.5rem;
          text-align: left;
        }

        .sum {
          text-align: left;
          font-size: 24px;

          input {
            margin-left: 0.375rem;
            line-height: 3.75rem;
            width: 90%;
            font-size: 36px;
            border: none;
          }
        }
      }
    }

    .transfer_btn {
      width: 21.5625rem;
      height: 2.875rem;
      margin: 1.25rem auto;
      background: #f15353;
      border-radius: 0.25rem;
      color: #fff;
      font-size: 16px;
      border: none;
    }

    .select_address {
      .select_box {
        padding: 0.875rem;
        max-height: 22.5rem;
        overflow-y: scroll;

        li {
          padding: 7px 0;
          font-size: 14px;
          text-align: left;
          position: relative;
          display: flex;
          justify-content: space-between;
          border-bottom: solid 1px #eee;
          align-items: center;
          word-wrap: break-word;

          p {
            width: 80%;
          }

          .iconfont {
            position: absolute;
            right: 0;
            color: #f15353;
            font-size: 1.5rem;
          }
        }

        li:last-child {
          border-bottom: none;
        }
      }

      .address_btn {
        width: 100%;
        height: 3.125rem;
        background: #f15353;
        border: none;
        font-size: 16px;
        color: #fff;
      }
    }
  }
}
</style>
