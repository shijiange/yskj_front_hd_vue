<template>
  <div id="custom_queue">
    <c-title :hide="false"
             :text="titleInfo"></c-title>
    <div class="content">
      <div class="header_box">
        <div class="img">
          <img :src="MemberData.avatar_image" />
        </div>
        <div class="head_name">
          <span>{{ MemberData.nickname }}</span>
        </div>
      </div>
      <div class="reward_box">
        <ul class="reward_a">
          <li><span>{{$i18n.t('money')}}</span>{{ rewardsData.amountTotal || 0 }}</li>
          <li>累计奖励</li>
        </ul>
        <ul class="reward_b">
          <li><span>{{$i18n.t('money')}}</span>{{ rewardsData.amountSurplusTotal || 0 }}</li>
          <li>待奖励</li>
        </ul>
      </div>
      <van-tabs v-model="active"
                @change="handleClick">
        <van-tab title="权益队列">
          <div class="queue_box"
               v-for="(item,i) in recordsList"
               :key='i'>
            <div class="queue_a">
              <span>权益排序：{{ item.sort }}</span>
            </div>
            <div class="queue_b">
              <div class="queue_center">
                <ul class="reward_queue_a">
                  <li><span>{{$i18n.t('money')}}</span>{{ item.amount }}</li>
                  <li>奖励金额</li>
                </ul>
                <ul class="reward_queue_b">
                  <li><span>{{$i18n.t('money')}}</span>{{ item.finish_amount }}</li>
                  <li>已奖励</li>
                </ul>
                <ul class="reward_queue_c">
                  <li>{{ item.status_name }}</li>
                </ul>
              </div>
            </div>
            <div class="queue_c"
                 @click="showMore(item)">
              <span>展示完整信息</span>
              <i v-if="amount_id == item.id && item.show"
                 class="iconfont icon-down"></i>
              <i v-else
                 class="iconfont icon-up"></i>
            </div>
            <div class="button_box"
                 v-if="amount_id == item.id && item.show">
              <ul class="queue_c_down">
                <li>
                  <span>权益金额</span>
                  <span>{{ item.amount }}</span>
                </li>
                <li>
                  <span>订单商品金额</span>
                  <span>{{$i18n.t('money')}}{{ item.goods_price }}</span>
                </li>
                <li>
                  <span>奖励比例：</span>
                  <span>{{ item.ratio }}%</span>
                </li>
                <li>
                  <span>时间：</span>
                  <span class="time">{{ item.created_at }}</span>
                </li>
                <div class="queue_bottom">

                  <van-button class="button_side"
                           v-if="!fun.isTextEmpty(item.button)"
                             @click.native="show(item)">
                    兑换
                  </van-button>
                </div>
              </ul>
            </div>

          </div>
        </van-tab>
        <van-tab title="奖励记录">
          <div class="queue_box"
               v-for="(item,i) in recordsList"
               :key='i'>
            <div class="queue_a">
              <span>奖励队列：{{ item.queue_id }}</span>
              <span class="sum">{{$i18n.t('money')}}{{ item.amount }}</span>
            </div>
            <div class="queue_b">
              <div class="queue_center"
                   v-if="item.has_one_queue">
                <ul class="reward_queue_a">
                  <li><span>{{$i18n.t('money')}}</span>{{ item.has_one_queue.finish_amount }}</li>
                  <li>已奖励金额</li>
                </ul>
                <ul class="reward_queue_b">
                  <li><span>{{$i18n.t('money')}}</span>{{ item.has_one_queue.surplus_amount }}</li>
                  <li>未奖励金额</li>
                </ul>
                <ul class="reward_queue_c">
                  <li>{{ item.has_one_queue.status_name }}</li>
                </ul>
              </div>
            </div>
            <div class="queue_c"
                 @click="showMore(item)">
              <span>展示完整信息</span>
              <i v-if="amount_id == item.id && item.show"
                 class="iconfont icon-down"></i>
              <i v-else
                 class="iconfont icon-up"></i>
            </div>
            <div class="button_box"
                 v-if="amount_id == item.id && item.show">
              <ul class="queue_c_down">
                <li v-if="item.has_one_order">
                  <span>订单编号</span>
                  <span>{{ item.has_one_order.order_sn }}</span>
                </li>
                <li>
                  <span>订单商品金额</span>
                  <span>{{$i18n.t('money')}}{{ item.goods_price }}</span>
                </li>
                <li>
                  <span>奖励比例：</span>
                  <span>{{ item.ratio }}%</span>
                </li>
                <li>
                  <span>时间：</span>
                  <span class="time">{{ item.created_at }}</span>
                </li>
              </ul>
            </div>
          </div>
        </van-tab>
      </van-tabs>
      <van-popup v-model="show3"
                position="bottom"
                :style="{height:'60%'}">
        <div class="queue_type">
          <h1>兑换类型</h1>
          <ul class="selete">
            <li>兑换类型：</li>
            <li>
              <input type="text"
                     v-model="convertType"
                     disabled
                     placeholder="请选择">
            </li>
          </ul>
          <ul class="type"
              v-if="!fun.isTextEmpty(module_type.button)">
            <li v-if="!fun.isTextEmpty(module_type.button.love)"
                @click="chooseType(module_type.button.love)">
              <span>{{module_type.button.love.name}}</span>
              <span :class="convertTypeId===2 ? 'circle choose':'circle'"></span>
            </li>
            <li v-if="!fun.isTextEmpty(module_type.button.point)"
                @click="chooseType(module_type.button.point)">
              <span>{{module_type.button.point.name}}</span>
              <span :class="convertTypeId===1 ? 'circle choose':'circle'"></span>
            </li>
          </ul>
          <ul class="queue_info"
              v-show="convertType">
            <li v-show="convertType">当前兑换比例：1元={{convertTypeUnit}}{{convertType}}</li>
            <li v-show="convertType">可兑换：{{convertTypeExchange_count}}{{convertType}}</li>
          </ul>
          <van-button class="queue_btn"
                     @click.native="SureExchange">确认兑换</van-button>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import custom_queue_controller from "./custom_queue_controller";

export default custom_queue_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#custom_queue {
  .content {
    .header_box {
      background: #fff;
      display: flex;
      padding: 1.25rem 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .img {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 1.75rem;
        overflow: hidden;
        border: solid 0.0625rem #ebebeb;
        margin-right: 0.625rem;
        background-color: #f8f8f8;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .head_name {
        text-align: left;

        span {
          width: 17.5625rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          font-size: 16px;
          font-weight: bold;
          line-height: 3rem;
        }

        .title {
          color: #999;
          font-size: 16px;
          font-weight: normal;
        }
      }
    }

    .reward_box {
      background: #fff;
      display: flex;
      padding: 0.75rem 0;
      margin-bottom: 0.625rem;

      .reward_a,
      .reward_b {
        width: 50%;
        text-align: center;

        li {
          span {
            font-size: 14px;
          }
        }

        li:first-child {
          height: 1.625rem;
          line-height: 1.625rem;
          font-size: 18px;
          font-weight: bold;
        }

        li:last-child {
          line-height: 1.5rem;
          color: #8c8c8c;
          font-size: 14px;
        }
      }

      .reward_c {
        width: 33.33%;
        line-height: 3.125rem;
        font-size: 16px;

        li {
          display: flex;
          justify-content: flex-end;
          padding-right: 0.875rem;
          width: 100%;
          color: #8c8c8c;

          i {
            font-size: 1.5rem;
            line-height: 3.125rem;
            color: #c9c9c9;
            margin-left: 0.625rem;
          }
        }
      }
    }

    .queue_box {
      margin-bottom: 0.625rem;
      background-color: #fff;

      .queue_a {
        display: flex;
        justify-content: space-between;
        padding: 0.625rem 0.875rem;
        line-height: 2.5rem;
        font-size: 16px;

        span:first-child {
          font-weight: bold;
        }

        .sum {
          color: #f15353;
        }

        span:last-child {
          // color: #f15353;
        }
      }

      .queue_b {
        .queue_center {
          display: flex;

          ul {
            width: 33.33%;
            justify-content: center;
          }

          .reward_queue_a,
          .reward_queue_b {
            li:first-child {
              font-size: 16px;
              height: 1.625rem;
              line-height: 1.625rem;
              font-weight: bold;

              span {
                font-size: 14px;
              }
            }

            li:last-child {
              line-height: 1.5rem;
              color: #8c8c8c;
              font-size: 14px;
            }
          }

          .reward_queue_c {
            font-size: 16px;
            color: #f15353;
            text-align: center;
            line-height: 3.125rem;
          }
        }
      }

      .queue_c {
        display: flex;
        justify-content: center;
        margin-top: 0.75rem;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        font-size: 16px;

        i {
          font-size: 1.5rem;
          color: #666;
        }
      }

      .button_box {
        padding: 0 0.875rem;

        button {
          background: #fff;
          color: #333;
          font-size: 14px;
          border: solid 0.0625rem #ccc;
          border-radius: 1rem;
          height: 1.625rem;
          width: 7.5rem;
          margin: 0 0.625rem;
        }
      }

      .queue_c_down {
        margin-top: 0.75rem;
        border-top: solid 0.0625rem #ebebeb;
        padding: 0.625rem 0;
        font-size: 14px;

        li {
          display: flex;
          justify-content: space-between;
          line-height: 1.75rem;
        }
      }

      .queue_bottom {
        display: flex;
        justify-content: space-around;
        margin-top: 0.625rem;

        .button_side {
          width: 7.5rem;
          height: 1.875rem;
          background-color: #fff;
          color: #333;
          font-size: 15px;
          border: solid 0.0625rem #ebebeb;
          border-radius: 1.5rem;
        }

        .button_line {
          width: 19.25rem;
          height: 1.875rem;
          border-radius: 0.1875rem;
          border: solid 0.0625rem #f15353;
          color: #f15353;
          font-size: 15px;
        }
      }

      .fade-enter-active {
        transition: 0.5s;
      }

      .fade-enter,
      .fade-leave-active {
        opacity: 0;
        height: 0;
      }
    }
  }
}
// 兑换类型css
.queue_type {
  // position: relative;
  height: 25rem;

  h1 {
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    font-size: 15px;
    border-bottom: solid 0.0625rem #ebebeb;
  }

  .selete {
    display: flex;
    justify-content: space-between;
    height: 2.8125rem;
    line-height: 2.8125rem;
    margin-left: 0.875rem;
    font-size: 16px;
    border-bottom: solid 0.0625rem #ebebeb;

    li:first-child {
      text-align: left;
      // flex: 1;
    }

    li:last-child {
      padding-right: 0.875rem;
      // flex: 0 0 6rem;
      flex: 1;
      display: flex;
      justify-content: flex-end;

      input {
        border: none;
        outline: none;
        height: 2.75rem;
        width: 90%;
        font-size: 16px;
        text-align: right;
        margin-right: 0.625rem;
      }

      i {
        line-height: 2.8125rem;
        color: #c9c9c9;
        font-size: 18px;
      }
    }
  }

  .type {
    padding: 0.625rem 0.875rem;

    li {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      height: 2.8125rem;

      span {
        line-height: 2.8125rem;
      }

      .circle {
        width: 20px;
        height: 20px;
        border: 1px solid #ccc;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        top: 0.8rem;
        right: 1rem;
        z-index: 10;
        line-height: 2.8125rem;
        pointer-events: none;
      }

      .choose {
        background: #f15353;
        border: 1px solid #f15353;
      }
    }
  }

  .queue_info {
    background-color: #fafafa;
    padding: 0.625rem 0.875rem;

    li {
      line-height: 1.875rem;
      text-align: left;
      font-size: 15px;
      color: #8c8c8c;
    }
  }

  .queue_btn {
    width: 100%;
    height: 2.8125rem;
    border-radius: 0;
    font-size: 18px;
    background-color: #f15353;
    color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
