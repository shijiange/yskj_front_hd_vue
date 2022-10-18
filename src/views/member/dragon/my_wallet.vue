<template>
  <div id="my_wallet">
    <c-title :hide="false"
             text="我的钱包"></c-title>
    <div class="content">
      <div class="top-info">
        <div class="absolute"
             v-if="info.nickname"
             @click="gotoMember()">
          <div class="member">
            <div class="back">
              <i class="iconfont icon-wode-wode"></i>
              <span>会员中心</span>
            </div>
          </div>
        </div>
        <div class="user"
             v-if="!fun.isTextEmpty(info)">
          <div class="avator">
            <img :src="info.avatar_image">
          </div>
          <span>{{info.nickname}}</span>
        </div>
        <ul class="item"
            v-if="!fun.isTextEmpty(list)">
          <li v-for="(item,index) in list"
              :key="index">
            <span>{{item.name}}</span>
            <span>{{item.amount}}</span>
          </li>
        </ul>
        <div v-if="fun.isTextEmpty(info)"
             class="empty">您还没开通电子钱包，请点击开通</div>
      </div>
      <ul class="list_box">
        <li @click="toChoose()">
          <i class="iconfont icon-balance_b"></i>企业用户电子钱包开通
          <span v-if="formData.userSts==4">(未开通)</span>
          <span v-if="formData.userSts==-1||formData.userSts==3"
                class="color-span">(审核中)</span>
          <span v-if="formData.userSts==6"
                class="color-span">(审核失败)</span>
          <span v-if="formData.userSts==0"
                class="color-span">(审核成功)</span>
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="toPwd()">
          <i class="iconfont icon-balance_c"></i>修改交易密码
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="toDetail()">
          <i class="iconfont icon-balance_a"></i>电子钱包收支明细
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="towithdraw()">
          <i class="iconfont icon-balance_a_t"></i>提现
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="toDeposit()"
            v-if="formData.platRoleID=='001'">
          <i class="iconfont icon-balance_a_n1"></i>入金
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="toBank()">
          <i class="iconfont icon-balance_card"></i>我的银行卡
          <i class="fa fa-angle-right"></i>
        </li>
        <li @click="toInfo()">
          <i class="iconfont icon-balance_orderlist_record"></i>用户信息变更记录
          <i class="fa fa-angle-right"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import my_wallet_controller from "./my_wallet_controller";
export default my_wallet_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#my_wallet {
  .content {
    background-color: #fff;
    padding-top: 1rem;

    .top-info {
      position: relative;

      .absolute {
        position: absolute;
        right: 0;
        top: 0.5rem;

        .member {
          .back {
            width: 6rem;
            height: 2rem;
            background-color: rgba(251, 100, 60, 0.18);
            border-top-left-radius: 1rem;
            border-bottom-left-radius: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;

            .icon-wode-wode {
              color: #fb643c;
              margin-right: 0.2rem;
            }

            span {
              color: #fb643c;
              font-size: 12px;
            }
          }
        }
      }

      .empty {
        margin-bottom: 3rem;
        margin-top: 2rem;
      }

      .user {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.5rem;
        align-items: center;
        justify-content: center;

        .avator {
          width: 3rem;
          height: 3rem;
          background: #fff;
          border-radius: 50%;
          border: 0.125rem solid #fff;
          box-sizing: border-box;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        span {
          margin-top: 0.5rem;
        }
      }

      .item {
        display: flex;
        flex-wrap: wrap;
        background-color: #fff;

        li {
          display: flex;
          flex-direction: column;
          width: 33.3%;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;

          span {
            font-size: 14px;
          }

          span:first-child {
            margin-bottom: 1rem;
            color: #999;
            font-size: 12px;
          }
        }
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
        font-size: 14px;
        position: relative;
        color: #333;

        .icon-balance_a {
          color: #6cbf6a;
        }

        .icon-balance_a_t {
          color: #467cfd;
        }

        .icon-balance_a_n1 {
          color: #f5c53a;
        }

        .icon-balance_b {
          color: #fac337;
        }

        .icon-balance_c {
          color: #069ce7;
        }

        .icon-balance_card {
          color: #3889ff;
        }

        .icon-balance_orderlist_refund {
          color: #ffaa4a;
        }

        .icon-balance_orderlist_record {
          color: #7fbcff;
        }

        .iconfont {
          font-size: 2rem;
          margin-right: 0.625rem;
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

    .color-span {
      color: #f86d6d;
    }
  }
}
</style>
