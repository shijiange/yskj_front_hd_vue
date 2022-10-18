<template>
  <div id="get_coupon">
    <c-title :hide="false" :text="'红包分享'">
    </c-title>
    <div id="get_content">
        <div class="coupon_info">
            <div class="banner">
                <img :src="banner" style="height: 100%;"/>
            </div>
            <!-- 领取 -->
            <div class="coupon_get" v-if="status == 'YES'">
                <ul class="coupon_a">
                    <li class="sun_name">
                        <span class="sum">{{coupon.coupon_method == 1?`${$i18n.t('money')}${coupon.deduct}`:`${coupon.discount}折`}}</span>
                        <span class="name">{{coupon.name}}</span>
                    </li>
                    <li class="limit_time">
                        <span class="limit">满{{coupon.enough}}立减</span>
                        <span class="time">有效期：{{coupon.time_start}}-{{coupon.time_end}}</span>
                    </li>
                </ul>
                <p class="coupon_b">{{coupon.api_limit}}</p>
                <div class="left_circle"></div>
                <div class="right_circle"></div>
            </div>
            <!-- 不可领和已抢光 -->
            <div class="coupon_noget" v-if="status == 'RT'">
                <div class="state">
                    <div class="left_line"></div>
                    <p class="text">{{msg}}</p>
                    <div class="right_line"></div>
                </div>
            </div>
            <p class="into_user">{{status == "YES"?`红包已放入账号：${name}`:`领券账号：${name}`}}</p>
            <button type="button" class="get_btn" @click="goHome">{{status == "YES"?"立即使用":"看看其它活动"}}</button>
        </div>
        <div class="get_list">
            <p class="pack_number">还剩{{max_num}}个红包</p>
            <div class="red_pack">
              <van-pull-refresh v-model="isLoading" @refresh="getMoreRecord" :disabled="isAllLoaded">
                <div class="list" v-for="(item,i) in record_arr" :key='i'>
                    <div class="user">
                        <img :src="item.receive_member.avatar">
                    </div>
                    <ul class="user_info">
                        <li class="name"><span class="name_a">{{item.receive_member.nickname}}</span><span class="name_b">{{item.remark}}</span></li>
                        <li class="time">{{item.created_at}}</li>
                    </ul>
                </div>
              </van-pull-refresh>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import get_coupon_controller from "./get_coupon_controller";

export default get_coupon_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#get_coupon {
  #get_content {
    .coupon_info {
      background: #fff;
      padding-bottom: 1.25rem;

      .banner {
        height: 18.75rem;
        width: 100%;
        overflow: hidden;

        img {
          width: 100%;
        }
      }
      // 领取
      .coupon_get {
        position: relative;
        margin: 0.9375rem 0.9375rem 0 0.9375rem;
        background: #faf7f7;
        border-radius: 0.375rem;
        padding: 0.625rem 0.875rem 0 0.875rem;

        .coupon_a {
          padding: 0.625rem 0;

          .sun_name {
            color: #f15353;
            line-height: 1.875rem;
            text-align: left;
            display: flex;

            .sum {
              display: inline-block;
              width: 6.875rem;
              font-size: 24px;
            }

            .name {
              display: inline-block;
              font-size: 16px;
            }
          }

          .limit_time {
            color: #8c8c8c;
            font-size: 13px;
            line-height: 1.5rem;
            text-align: left;

            .limit {
              display: inline-block;
              width: 6.875rem;
            }

            .time {
              display: inline-block;
              font-size: 12px;
            }
          }
        }

        .coupon_b {
          line-height: 1.875rem;
          text-align: left;
          font-size: 13px;
          border-top: dashed #ebebeb 0.0625rem;
          color: #8c8c8c;
        }

        .left_circle {
          position: absolute;
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 0.375rem;
          background: #fff;
          left: -0.3125rem;
          bottom: 1.5625rem;
        }

        .right_circle {
          position: absolute;
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 0.375rem;
          background: #fff;
          right: -0.3125rem;
          bottom: 1.5625rem;
        }
      }
      // 已抢光
      .coupon_none {
        background: #faf7f7;
        border-radius: 0.375rem;
        margin: 0.9375rem 0.9375rem 0 0.9375rem;
        padding: 0.625rem 0.875rem;

        .state {
          display: flex;
          justify-content: center;
          align-items: center;

          .left_line,
          .right_line {
            width: 2.5rem;
            height: 0.0625rem;
            border: solid 0.0625rem #ebebeb;
          }

          .text {
            font-size: 18px;
            color: #8c8c8c;
            margin: 0 1.25rem;
            font-weight: bold;
            line-height: 4.5rem;
          }
        }
      }
      // 不可领
      .coupon_noget {
        background: #faf7f7;
        border-radius: 0.375rem;
        margin: 0.9375rem 0.9375rem 0 0.9375rem;
        padding: 0.625rem 0.875rem;

        .state {
          display: flex;
          justify-content: center;
          align-items: center;

          .left_line,
          .right_line {
            width: 2.5rem;
            height: 0.0625rem;
            border: solid 0.0625rem #ebebeb;
          }

          .text {
            font-size: 18px;
            color: #8c8c8c;
            margin: 0 1.25rem;
            font-weight: bold;
            line-height: 4.5rem;
          }
        }
      }

      .into_user {
        line-height: 2.5rem;
        font-size: 15px;
        text-align: center;
      }

      .get_btn {
        width: 21.5625rem;
        height: 2.625rem;
        border-radius: 0.375rem;
        background-color: #f15353;
        color: #fff;
        font-size: 16px;
        border: none;
      }
    }

    .get_list {
      margin-top: 0.625rem;
      background: #fff;
      padding: 0.625rem 0.875rem;

      .pack_number {
        background: #faf7f7;
        line-height: 1.875rem;
        font-size: 14px;
        padding: 0 0.625rem;
        color: #8c8c8c;
        border-radius: 0.125rem;
        text-align: left;
      }

      .red_pack {
        margin-top: 0.625rem;

        .list {
          display: flex;
          padding: 0.625rem 0;
          border-bottom: solid 0.0625rem #ebebeb;

          .user {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 1.25rem;
            overflow: hidden;
            background: #faf5f5;
            margin-right: 10px;

            img {
              width: 100%;
            }
          }

          .user_info {
            width: 19.1875rem;

            .name {
              line-height: 1.25rem;
              display: flex;
              justify-content: space-between;

              .name_a {
                font-size: 15px;
                max-width: 13.75rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .name_b {
                color: #f15353;
                font-size: 16px;
              }
            }

            .time {
              line-height: 1.25rem;
              color: #8c8c8c;
              font-size: 12px;
              text-align: left;
            }
          }
        }
      }
    }
  }
}
</style>
