<template>
  <div id="my_asset">
    <c-title :hide="false" :text="'我的'+lang.capital_name"></c-title>
    <div id="content">
      <div class="content_a">
        <div class="user">
          <div class="user_a">
            <div class="img">
              <img :src="member_info.avatar_image">
            </div>
            <ul class="name">
              <li>
                <span>{{member_info.nickname}}</span>
                <span>会员ID：{{member_info.member_id}}</span>
              </li>
              <li v-if="member_info.invite_code" class="invite">
                <span>邀请码：{{member_info.invite_code}}</span>
                <button class='copybtn' v-clipboard:copy="member_info.invite_code" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button>
              </li>
            </ul>
            <div class="member-box" @click="gotoMemberGrade" style="z-index: 39;">
              <i class="iconfont icon-member-enter"></i>
              <div class="font">会员中心</div>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
          <ul class="user_b">
            <li @click="myKey('blockchain')">
              <i class="iconfont icon-asset_a"></i>
              <span>区块链地址</span>
            </li>
            <li @click="myKey('secret')">
              <i class="iconfont icon-asset_b"></i>
              <button  class="mykey">我的秘钥</button>
            </li>
            <li @click="setPws">
              <i class="iconfont icon-asset_c"></i>
              <button class="pws">交易密码</button>
            </li>
          </ul>
        </div>
        <div class="user_info">
          <div class="left">
            <ul class="left_a">
              <li>{{statistics.hold_count}}</li>
              <li>{{lang.capital_name}}数量</li>
            </ul>
          </div>
          <div class="right">
            <ul class="right_a">
              <li>{{$i18n.t('money')}}{{incomeData.income_amount}}</li>
              <li>累计{{lang.bonus_name || '分红'}}</li>
            </ul>
            <ul class="right_b">
              <li>{{$i18n.t('money')}}{{incomeData.retain_income}}</li>
              <li>未{{fun.initWithdrawal()}}{{lang.bonus_name || '分红'}}</li>
            </ul>
          </div>

        </div>
      </div>
      <div class="content_b">
        <div class="list">
          <ul class="list_box" v-for="(item,index) in assetList" :key="index" @click="toAsset(item)">
            <li>
              <span>{{item.asset_name}}</span>
              <i class="fa fa-angle-right"></i>
            </li>
            <li>
              <span>可用：{{item.usable}}</span>
              <span>冻结：{{item.froze}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import my_asset_controller from "./my_asset_controller";

export default my_asset_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#my_asset {
  #content {
    .content_a {
      .user {
        background: #f7a145;
        color: #fff;
        align-items: center;

        .user_a {
          padding: 1.25rem 0.625rem;
          display: flex;

          .img {
            width: 3.75rem;
            height: 3.75rem;
            border-radius: 1.875rem;
            border: solid 0.0625rem #f5f5f5;
            overflow: hidden;
            margin-right: 0.625rem;
            // background-color:#f5f5f5;
            img {
              width: 100%;
            }
          }

          .copybtn {
            font-size: 14px;
            color: #fff;
            border: solid 0.0625rem #ebebeb;
            border-radius: 2rem;
            margin-left: 0.5rem;
            padding: 0.1rem 0.5rem;
          }

          .name {
            text-align: left;

            li:first-child {
              display: flex;
              align-items: center;

              span:first-child {
                font-size: 18px;
                font-weight: bold;
                line-height: 1.875rem;
                max-width: 6.25rem;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }

              span:last-child {
                font-size: 12px;
                font-weight: normal;
                border-radius: 1rem;
                padding: 0.125rem 0.375rem;
                background: rgba(0, 0, 0, 0.2);
                margin-left: 0.625rem;
              }
            }

            .invite {
              line-height: 1.875rem;
            }
          }

          .member-box {
            align-content: center;
            background: linear-gradient(to right, #3b3b4f, #9898a4);
            border-radius: 3.75rem;
            display: flex;
            position: absolute;
            right: 0.625rem;
            color: #fff;
            padding: 0 0.375rem;
            margin-top: 1.0625rem;

            .font {
              font-size: 12px;
              right: 0.875rem;
              line-height: 1.875rem;
            }

            .iconfont {
              font-size: 1.25rem;
              color: #fff;
              margin-right: 0.25rem;
              line-height: 1.875rem;
            }

            .fa {
              line-height: 1.875rem;
              font-size: 1rem;
              color: #fff;
              margin-left: 0.375rem;
            }

            .img {
              width: 6rem;
              height: 2rem;
              overflow: hidden;
              position: absolute;
              right: 0;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }

        .user_b {
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          padding: 0.5rem 0;

          li {
            display: flex;
            justify-content: center;
            width: 33.33%;
            border-right: solid 1px rgba(255, 255, 255, 0.4);
            font-size: 14px;
            text-align: center;
            height: 1.25rem;
            line-height: 1.25rem;

            .mykey {
              border: none;
              color: #fff;
            }

            .pws {
              border: none;
              color: #fff;
            }

            i {
              font-size: 1.5rem;
              color: #fff;
              margin-right: 0.25rem;
            }
          }

          li:last-child {
            border: none;
          }
        }
      }

      .user_info {
        display: flex;
        background: #fff;

        .left {
          width: 50%;
          border-right: solid 0.0625rem #ebebeb;

          .left_a {
            text-align: center;

            li {
              margin: 0.625rem 0;
              height: 3rem;
              padding: 0.625rem;
              font-size: 32px;
            }

            li:last-child {
              font-size: 14px;
              color: #8c8c8c;
            }
          }
        }

        .right {
          width: 50%;

          .right_a,
          .right_b {
            padding: 0.625rem 0;

            li {
              line-height: 1.5rem;
              text-align: left;
              padding: 0 0.625rem;
              font-size: 16px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            li:last-child {
              color: #8c8c8c;
              font-size: 14px;
            }
          }

          .right_a {
            border-bottom: solid 0.0625rem #ebebeb;
          }
        }
      }
    }

    .content_b {
      background: #fff;
      margin-top: 0.625rem;

      .list {
        padding: 1.25rem 0.875rem;

        .list_box {
          box-shadow: 0 0.0625rem 0.375rem #ccc;
          padding: 0.625rem;
          margin-bottom: 0.875rem;

          li:first-child {
            display: flex;
            justify-content: space-between;
            line-height: 2.25rem;

            span {
              font-size: 16px;
            }

            i {
              font-size: 1.25rem;
              color: #c9c9c9;
              line-height: 2.25rem;
            }
          }

          li:last-child {
            display: flex;
            line-height: 1.5rem;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
