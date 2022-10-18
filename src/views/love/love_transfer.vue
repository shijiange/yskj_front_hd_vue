<template>
  <div id="love_transfer">
    <c-title :hide="false" :text="loveKey != 'donate'?love_name+'转账':`${love_name}${point_name}转赠`"></c-title>
    <!-- 优化 -->
    <div class="content">
      <ul class="transfer_info">
        <li class="info_a">
          <span>激活{{ love_name }}：</span>
          <span>{{ usable }}</span>
        </li>
        <li class="info_b">
          <span>会员ID：</span>
          <input
            type="number"
            v-model="recharge_search"
            placeholder="请输入受让人ID"
            @keyup="throttleFn"
          />
          <i class="iconfont icon-sousuo1" @click="searchTransfer_1"></i>
        </li>
      </ul>
      <div class="transfer_sum">
        <span>{{ love_name }}</span>
        <div class="sum">
          {{$i18n.t("money")}}<input
          type="text"
          v-model.lazy="recharge_value"
          @change="checkTransfer"
          placeholder="0.00"
        />
        </div>
      </div>
      <ul class="personal_info" v-if="!showSearch">
        <li v-if="memberInfo.nickname">
          <span>会员昵称：</span>
          <span>{{ memberInfo.nickname }}</span>
        </li>
        <li v-if="memberInfo.realname">
          <span>会员姓名：</span>
          <span>{{ memberInfo.realname }}</span>
        </li>
      </ul>
      <button type="button" class="btn custom_color" @click="getBalance">
        确认{{loveKey != 'donate'?'转账':'转赠'}}
      </button>
      <p class="notes" v-if="loveKey != 'donate'">
        注：转账{{ love_name }}不能小于{{ transfer_fetter }}, 且为{{
        transfer_multiple
        }}的整数倍。<br/>
        转让手续费比率为{{ ratio }}%，<br/>
        您实际转账到数为：{{ recharge_value - (recharge_value * ratio) / 100 }}
      </p>

      <!-- 模糊搜索  已取消模糊搜索 任务编号29711 -->
      <!-- <div class="search_list" v-if="showSearch">
        <ul class="list">
          <li>
            {{ search_list }}
          </li>
        </ul>
      </div> -->
    </div>
    <pay-keyboard :payKeyboardShow.sync="payKeyboardShow" @complete="payComplete"></pay-keyboard>
  </div>
</template>
<script>
import love_transfer_controller from "./love_transfer_controller";

export default love_transfer_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #love_transfer {
    .content {
      position: relative;

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
            max-width: 10rem;

            /* width: 6.875rem; */
            display: block;
            text-align: left;
          }

          input {
            border: none;
            width: 15.625rem;
          }

          .icon-sousuo1 {
            position: absolute;
            right: 0;
            font-size: 1.25rem;
            width: 3rem;
            color: #c9c9c9;
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

      .btn {
        width: 21.5625rem;
        margin: 1.25rem auto;
        height: 2.875rem;
        border-radius: 0.25rem;
        font-size: 16px;
        color: #fff;
        background: #f15353;
        border: none;
      }
    }

    .search_list {
      position: absolute;
      top: 6rem;
      width: 100%;
      background: #fff;
      -moz-box-shadow: 0 5px 15px #fbfbfb;
      -webkit-box-shadow: 0 5px 15px #fbfbfb;
      box-shadow: 0 5px 15px #fbfbfb;
      height: 5.25rem;
      overflow-y: scroll;
      z-index: 10;

      .list {
        padding: 0.875rem;

        li {
          // line-height: 2.5rem;
          color: #f15353;
          text-align: left;
          font-size: 1rem;
          // border-bottom: solid 0.0625rem #ebebeb;
        }

        li:last-child {
          border: none;
        }
      }
    }

    .inputs {
      background: #fff;
      width: 100%;
      padding: 0.625rem 0.625rem;
      box-sizing: border-box;
      display: flex;

      input {
        border: 0;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        outline: 0;
        line-height: 1.6;
        font-size: inherit;
        font-size: 16px;
      }

      label {
        font-size: 16px;
        line-height: 1.6;
        display: block;
        text-align: left;
        width: 5rem;
      }
    }

    #love_id {
      border-bottom: 0.0625rem solid #ccc;
    }

    button {
      width: 90%;
      margin: 1.25rem;
      height: 2.875rem;
      font-size: 16px;
    }

    i {
      font-size: 4.375rem;
      color: #f15353;
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
      font-size: 28px;
    }

    #djj {
      margin: 0.9375rem 0;
      font-size: 18px;
    }

    #jh {
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
      bottom: 0;
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
      }
    }

    .transfer {
      display: inline-block;
      height: 2.875rem;
      width: 90%;
      margin: 1rem 0.9375rem;
      color: #fff;
      background-color: #13ce66;
      border-color: #13ce66;
      border-radius: 4px;

      span {
        line-height: 2.875rem;
      }
    }

    .notes {
      color: #8c8c8c;
      line-height: 1.125rem;
    }

    .icon {
      width: 3rem;
      height: 3rem;

      .icon-sousuo1 {
        font-size: 1.5rem;
        color: #c9c9c9;
        line-height: 3rem;
      }
    }

    .personal_info {
      margin-top: 0.625rem;
      background: #fff;
      padding-left: 0.875rem;

      li {
        line-height: 2.875rem;
        display: flex;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;
        text-align: left;

        span:first-child {
          display: block;
          width: 6.875rem;
        }
      }

      li:last-child {
        border: none;
      }
    }
  }
</style>
