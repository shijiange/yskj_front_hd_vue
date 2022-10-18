<!-- 股东奖励--->
<template>
  <div id="Shareholder_reward">
    <c-title :hide="false" :text="!fun.isTextEmpty(rewards.name) ? rewards.name : ''"></c-title>
    <div class="header_box" v-if="!fun.isTextEmpty(rewards.member)">
      <div class="header">
        <img :src="rewards.member.avatar" />
      </div>
      <ul class="name">
        <li>{{ rewards.member.nickname }}</li>
        <li v-if="!fun.isTextEmpty(rewards.partnerModel)">成为股东时间: {{ rewards.partnerModel.created_at.slice(0, 10) }}</li>
      </ul>
    </div>
    <div class="money">
      <ul class="gongge">
        <li>
          <i class="iconfont icon-weitixian"></i>
          <span>未奖励金额</span>
          <b>{{ not_rewarded }}<em> 元</em> </b>
        </li>
        <li>
          <i class="iconfont icon-yijiesuan"></i>
          <span>已奖励金额</span>
          <b>{{ rewarded }}<em> 元</em> </b>
        </li>
      </ul>
    </div>
    <van-tabs v-model="active" @click="tabHandel">
      <van-tab :title="!fun.isTextEmpty(rewards.name) ? rewards.name : ''">
        <div class="list_box">
          <ul class="box">
            <li v-for="(item, index) in recordsList" :key="index">
              <h2 class="monthClass">{{ item.create_month }}</h2>
              <div v-for="(item_child, indexs) in item.has_many_reward_log" :key="indexs" @click="openDetail(index,indexs)">
                <div class="boxs">
                  <div class="box-child">
                    <span>订单号:{{ item_child.order_sn }}</span>
                    <span style="color: #ffbe5a;">{{ $i18n.t("money") }}{{ item_child.amount }}</span>
                  </div>
                  <div class="box-child">
                    <span>时间:{{ item_child.created_at }}</span>
                    <span>{{ item_child.status_name }}</span>
                  </div>
                </div>
                <div class="detail" v-if="!fun.isTextEmpty(item_child.has_one_order)" v-show="choose_index==indexs&&date_index==index">
                  <div
                    class="team_list"
                    v-if="!fun.isTextEmpty(item_child.has_one_order.has_one_member_shop_info) && !fun.isTextEmpty(item_child.has_one_order.has_one_member_shop_info.has_one_member)"
                  >
                    <div class="img">
                      <img :src="item_child.has_one_order.has_one_member_shop_info.has_one_member.avatar" />
                    </div>
                    <div class="info">
                      {{ item_child.has_one_order.has_one_member_shop_info.has_one_member.nickname }}
                      <br />
                      <span>微信号:{{ item_child.has_one_order.has_one_member_shop_info.wechat ? item_child.has_one_order.has_one_member_shop_info.wechat : "暂无微信号" }}</span>
                    </div>
                  </div>
                  <div class="team_goods" id="distribution-goods" v-for="(goods, i) in item_child.has_one_order.order_goods" :key="i">
                    <div class="img">
                      <img :src="goods.thumb" />
                    </div>
                    <div class="inner">
                      <div class="name">{{ goods.title }}</div>
                    </div>
                    <div class="price">
                      <b
                        >{{ $i18n.t("money") }}{{ goods.goods_price / goods.total }} <br />
                        ×{{ goods.total }}</b
                      >
                      <div class="Total">{{ $i18n.t("money") }}{{ goods.goods_price }}</div>
                    </div>
                  </div>
                  <div class="order_list" v-if="!fun.isTextEmpty(item_child.has_one_order.address)">
                    <div class="person">
                      <span>收货人：{{ item_child.has_one_order.address.realname || "无" }}</span>
                    </div>
                    <div class="mobile">
                      <span>手机:{{ item_child.has_one_order.address.mobile ? item_child.has_one_order.address.mobile : "暂无手机" }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab title="平级奖励">
        <div class="list_box">
          <ul class="box">
            <li v-for="(item, index) in recordsList" :key="index">
              <h2 class="monthClass">{{ item.create_month }}</h2>
              <div v-for="(item_child, indexs) in item.has_many_reward_log" :key="indexs" @click="openDetail(index,indexs)">
                <div class="boxs">
                  <div class="box-child">
                    <span>订单号:{{ item_child.order_sn }}</span>
                    <span style="color: #ffbe5a;">{{ $i18n.t("money") }}{{ item_child.amount }}</span>
                  </div>
                  <div class="box-child">
                    <span>时间:{{ item_child.created_at }}</span>
                    <span>{{ item_child.status_name }}</span>
                  </div>
                </div>
                <div class="detail" v-if="!fun.isTextEmpty(item_child.has_one_order)" v-show="choose_index==indexs&&date_index==index">
                  <div
                    class="team_list"
                    v-if="!fun.isTextEmpty(item_child.has_one_order.has_one_member_shop_info) && !fun.isTextEmpty(item_child.has_one_order.has_one_member_shop_info.has_one_member)"
                  >
                    <div class="img">
                      <img :src="item_child.has_one_order.has_one_member_shop_info.has_one_member.avatar" />
                    </div>
                    <div class="info">
                      {{ item_child.has_one_order.has_one_member_shop_info.has_one_member.nickname }}
                      <br />
                      <span>微信号:{{ item_child.has_one_order.has_one_member_shop_info.wechat ? item_child.has_one_order.has_one_member_shop_info.wechat : "暂无微信号" }}</span>
                    </div>
                  </div>
                  <div class="team_goods" id="distribution-goods" v-for="(goods, i) in item_child.has_one_order.order_goods" :key="i">
                    <div class="img">
                      <img :src="goods.thumb" />
                    </div>
                    <div class="inner">
                      <div class="name">{{ goods.title }}</div>
                    </div>
                    <div class="price">
                      <b
                        >{{ $i18n.t("money") }}{{ goods.goods_price / goods.total }} <br />
                        ×{{ goods.total }}</b
                      >
                      <div class="Total">{{ $i18n.t("money") }}{{ goods.goods_price }}</div>
                    </div>
                  </div>
                  <div class="order_list" v-if="!fun.isTextEmpty(item_child.has_one_order.address)">
                    <div class="person">
                      <span>收货人：{{ item_child.has_one_order.address.realname || "无" }}</span>
                    </div>
                    <div class="mobile">
                      <span>手机:{{ item_child.has_one_order.address.mobile ? item_child.has_one_order.address.mobile : "暂无手机" }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </van-tab>
    </van-tabs>
    <img src="../../../../assets/images/no-more-product.png" alt="" style="width: 5rem; margin-top: 4rem;" v-if="fun.isTextEmpty(recordsList)" />
  </div>
</template>

<script>
import Shareholder_reward_controller from "./Shareholder_reward_controller";

export default Shareholder_reward_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#Shareholder_reward {
  .header_box {
    background: #f15353;
    color: #fff;
    padding: 1.25rem 0.875rem;
    display: flex;
    align-items: center;

    .header {
      width: 3.25rem;
      height: 3.25rem;
      border: solid 0.125rem #fff;
      margin-right: 0.625rem;
      overflow: hidden;
      border-radius: 3.75rem;
      background: #f2f2f2;

      img {
        width: 100%;
      }
    }

    .name {
      width: 12.5rem;
      text-align: left;

      li:first-child {
        text-align: left;
        font-size: 16px;
        line-height: 1.875rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .name_b {
        font-size: 14px;
        line-height: 1.375rem;
        text-align: left;
      }
    }

    .task {
      font-size: 13px;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      right: 0.875rem;
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
    }
  }

  .info_box {
    background: #fff;
    display: flex;

    .left,
    .right {
      width: 50%;
      padding: 0.625rem 0.875rem;

      li {
        line-height: 1.5rem;
        text-align: left;
        font-size: 14px;

        span {
          font-size: 24px;
        }
      }

      li:last-child {
        color: #8c8c8c;
      }
    }
  }

  .rew_detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
    padding: 0.4rem;
    font-size: 18px;
    background: #fff;
  }

  .today_bonus {
    margin-top: 0.625rem;
    width: 100%;
    height: 5.125rem;
    background: #fff;
    padding: 1rem 0;
    box-sizing: border-box;
    position: relative;

    li.line {
      position: absolute;
      width: 0.0625rem;
      height: 3.25rem;
      background: #ddd;
      top: 1rem;
      right: 34%;

      .careat {
        width: 0.375rem;
        height: 0.375rem;
        border: 0.0625rem solid #ddd;
        border-left: 0;
        border-bottom: 0;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        background: #fff;
        position: absolute;
        top: 1.4375rem;
        right: -0.1875rem;
      }
    }

    li {
      text-align: center;
      float: left;

      span {
        font-size: 17px;
        line-height: 1.625rem;
        margin-bottom: 0.625rem;
        display: inline-block;
      }

      b {
        font-size: 11px;
        color: #333;
      }
    }

    .date {
      width: 22%;

      span {
        color: #ffa800;
      }
    }

    li:first-child,
    li:nth-child(2) {
      border-right: 0.0625rem solid #e2e2e2;
    }

    .mounth {
      width: 33%;

      span {
        color: #fc6a70;
      }
    }
  }

  .money {
    margin-top: 0.625rem;
    margin-bottom: 0.625rem;

    .gongge {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      background: #fff;
      column-count: 3;
      padding-bottom: 0.625rem;
      padding-top: 0.625rem;

      li {
        width: 50%;
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 12px;

        i {
          flex: 0 0 1.75rem;
          font-size: 26px;
          color: #999;
          display: inline-block;
          margin-bottom: 0.375rem;
          width: 100%;
        }

        span {
          flex: 0 0 1.4rem;
          color: #333;
          font-size: 12px;
        }

        b {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #f15353;
          font-size: 16px;
        }
      }
    }
  }

  .list_box {
    .box {
      background: #fff;
      //   padding: 0.625rem 0;
      //   border-bottom: solid 0.0625rem #ebebeb;
      li {
        line-height: 1.625rem;
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: space-between;

        font-size: 0.875rem;

        .monthClass {
          padding: 0 0.875rem;
          text-align: left;
          font-weight: 400;
          background: #f4f4f4;
        }

        .boxs {
          padding: 0.625rem 0.875rem;
          border-bottom: 0.0625rem solid #e8e8e8;

          .box-child {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        }

        .detail {
          border-bottom: 0.5rem solid #f5f5f5;

          .team_list {
            background-color: #fff;
            padding: 0.625rem 0.75rem;
            overflow: hidden;

            .img {
              width: 14%;
              float: left;
              text-align: left;
              height: 0;
              padding-bottom: 14%;
              position: relative;

              img {
                width: 100%;
                height: 100%;
                position: absolute;
              }
            }

            .info {
              height: 2.5rem;
              width: 80%;
              float: left;
              font-size: 14px;
              color: #222;
              line-height: 1.429rem;
              text-align: left;
              padding: 0 0.625rem;

              span {
                color: #666;
              }
            }
          }

          #distribution-goods {
            background-color: #fff;
            display: flex;
            align-items: stretch;
            flex-flow: row wrap;
            padding: 0.625rem 0.75rem;
            border-top: 1px solid #e2e2e2;

            .img {
              flex: 1;

              img {
                width: 100%;
              }
            }

            .inner {
              flex: 5;
              padding: 0 0.625rem;
              display: flex;
              align-items: flex-start;
            }

            .name {
              flex: 5;
              text-align: justify;
            }

            .price {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: flex-end;

              b {
                flex: 3;
                text-align: right;
                color: #666;
                font-size: 12px;
                font-weight: normal;
              }

              .evaluate-yet {
                margin: 0;
                color: #888;
                float: right;
                line-height: 1.6rem;
              }
            }
          }

          .order_list {
            display: flex;
            background: #fff;
            padding: 0.625rem 0.75rem;

            div {
              flex: 1;
            }

            .person {
              text-align: left;
            }

            .mobile {
              text-align: right;
            }
          }
        }
      }
    }

    .show_hide_box {
      padding: 0 0.875rem;
      background: #fff;
      margin-bottom: 0.625rem;

      .user_a {
        padding: 0.625rem 0;
        border-bottom: solid 0.0625rem #ebebeb;
        display: flex;

        .header {
          width: 2.5rem;
          height: 2.5rem;
          overflow: hidden;
          background: #f2f2f2;
          margin-right: 10px;

          img {
            width: 100%;
          }
        }

        .name {
          text-align: left;

          li {
            line-height: 1.25rem;
          }

          li:last-child {
            color: #8c8c8c;
            font-size: 12px;
          }
        }
      }

      .goods_a {
        padding: 0.625rem 0;
        display: flex;

        .goods {
          width: 3.75rem;
          height: 3.75rem;
          overflow: hidden;
          background: #f2f2f2;
          margin-right: 0.625rem;

          img {
            width: 100%;
          }
        }

        .name {
          width: 12.5rem;
          text-align: left;
          max-height: 2.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .price {
          width: 4.75rem;
          text-align: right;
          font-size: 12px;
          color: #8c8c8c;

          .big {
            color: #333;
            font-size: 15px;
            margin-top: 0.375rem;
          }
        }
      }
    }
  }
}
</style>
