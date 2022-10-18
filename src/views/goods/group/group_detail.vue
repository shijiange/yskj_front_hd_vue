<template>
  <div id="group_detail">
    <c-title :hide="false"
             :text="'拼团详情'"></c-title>
    <div class="content">
      <div class="goods_list">
        <div class="goods_box">
          <div class="goods_img">
            <img :src="info.has_one_group.has_one_goods.thumb"
                 @click="gotoGoods">
          </div>
          <ul class="goods_info">
            <li class="name"
                style="-webkit-box-orient: vertical;">
              {{info.has_one_group.title}}
            </li>
            <li class="price">
              <span>{{$i18n.t("money")}}</span>{{popPrice}}
              <span class="text-decoration" v-if="((popPrice * 1) >= (info.has_one_group.max_price * 1)) ? false : true">
                {{$i18n.t("money")}}{{info.has_one_group.max_price}}
              </span>
            </li>
            <li class="number">
              <div class="left">
                <!-- <i class="iconfont icon-info_contacts"></i> -->
                <span v-if="this.status != 3 && this.action != 4">{{info.has_many_success_member_count}}人付款</span>
              </div>

              <div class="go_group">
                {{info.has_one_level.member_num}}人拼团
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="into_group">
        <template v-if="this.isOpen == 1&&this.action != 4">
          <div class="title">
            <div class="line_left"></div>
            <span>距结束</span>
            <div class="line_right"></div>
          </div>
          <div class="time">

            <van-count-down :time="fun.getTimeDifference(info.end_time)" class="bottom_time" format="DD天HH时mm分ss秒"
                            @finish="groupEnd">
              <template #default="timeData">
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.days <10 ? `0${timeData.days}`
                  :timeData.days}}</em> 天
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.hours <10 ? `0${timeData.hours}`
                  :timeData.hours}}
                </em> 时
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes <10 ? `0${timeData.minutes}`
                  :timeData.minutes}}
                </em> 分
                <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.seconds <10 ? `0${timeData.seconds}`
                  :timeData.seconds}}
                </em> 秒
              </template>
            </van-count-down>
          </div>
          <p>拼团中，离成团还差<span>{{info.has_one_level.member_num-info.has_many_success_member_count>0?info.has_one_level.member_num-info.has_many_success_member_count:0}}</span>人</p>
        </template>
        <!-- <template v-if="this.isOpen != 1||this.action != 4"> -->
        <template v-else>
          <h2 style="color: #f15353;">{{activityTest}}</h2>
        </template>
        <button type="button"
                class="btn"
                :class="{'endClass': this.isOpen == 2}"
                @click="clickOpenGroup()">{{btnTest}}
        </button>
      </div>
      <div class="group_user"
           v-if="this.isOpen == 1&&this.status!=3">
        <h2>参团的人</h2>
        <div class="user_box" v-if="!this.fun.isTextEmpty(info.has_many_success_member)">
          <div
            :class="['user', {reward: (child.has_one_lottery ? child.has_one_lottery.is_win : false),}]"
            v-for="(child,i) in info.has_many_success_member" :key='i'
          >
            <div class="img" :class="{current:child.is_leader == 1}">
              <img :src="child.has_one_member.avatar_image">
            </div>
            <!-- <i class="iconfont icon-group_wenhao"></i> -->
            <span v-if="child.is_leader == '1'">团长</span>
          </div>
          <div class="user"
            v-for="(ie,i) in (info.has_one_level.member_num-info.has_many_success_member_count>0?info.has_one_level.member_num-info.has_many_success_member_count:0)" :key='i'
          >
            <div class="img">
              <img src="">
            </div>
            <i class="iconfont icon-group_wenhao"></i>
          </div>
        </div>
      </div>
      <div class="look_btn"
           @click="goHome"
           :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
        <button type="button"> 去商城逛逛</button>
      </div>
    </div>
    <!-- 弹窗 -->
    <van-popup v-model="showOpenGroup"
               :style="{overflow:'visible'}"
               position="bottom"
               class="mint-popup-4"
               closeOnClickModal="true">
      <div class="one_open">
        <div class="img_price">
          <div class="goods">
            <img :src="info.has_one_group.has_one_goods.thumb">
          </div>
          <ul class="price">
            <li class="price_a">{{$i18n.t("money")}}{{popPrice}}</li>
            <li class="price_b">库存：{{popStock}}件</li>
            <li class="price_b">{{ goodsDescription }}</li>
          </ul>
        </div>
        <div class="icon_close"
             @click="showOpenGroup = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <!-- 规格 -->
        <div class="shopinfo noVantRadio"
             v-if="this.goodsInfo.has_option == 1">
          <dl v-for="(specs,i) in goodsInfo.has_many_specs" :key='i'
              v-show="goodsInfo.has_many_specs!==undefined&&goodsInfo.has_many_specs.length>0 ? 1 :0">
            <dt>{{ specs.title }}</dt>
            <dd>
              <van-radio-group v-model="specs.description"
                               checked-color="#f15353"
                               @change="selectSpecs">
                <van-radio :class="{ vantRadioshow: specs.description == specitem }"
                           :disabled="specitem.c"
                           v-for="(specitem,i) in specs.has_many_specs_item"
                           :name="specitem" :key='i'>
                  {{ specitem.title }}
                </van-radio>
              </van-radio-group>
            </dd>
          </dl>
        </div>
        <div class="buy_number">
          <span>购买数量：</span>
          <div class="num">
            <div class="leftnav"
                 @click="reduceGoods">-
            </div>
            <input type="number"
                   class="shownum"
                   placeholder=""
                   v-model.lazy="goodsCount"
                   @blur="changeCount()"/>
            <div class="rightnav"
                 @click="addGoods">+
            </div>
          </div>
        </div>
        <button type="button"
                class="btn"
                @click="joinTeam()">确定
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import group_detail_controller from "./group_detail_controller";

export default group_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #group_detail {
    padding-bottom: 60px;

    .content {
      .goods_list {
        background: #fff;
        padding-left: 0.625rem;

        .goods_box {
          display: flex;
          padding: 0.625rem 0.625rem 0.625rem 0;
          border-bottom: solid 0.0625rem #ebebeb;

          .goods_img {
            width: 7.5rem;
            height: 7.5rem;
            background: #f2f2f2;
            overflow: hidden;
            border-radius: 0.25rem;
            margin-right: 0.625rem;

            img {
              width: 100%;
            }
          }

          .goods_info {
            width: 14.0625rem;
            text-align: left;

            .name {
              font-size: 14px;
              line-height: 1.25rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }

            .price {
              font-size: 16px;
              margin-top: 0.375rem;
              color: #f15353;

              span {
                font-size: 12px;
              }


              .text-decoration {
                text-decoration: line-through;
                color: #8c8c8c;
                margin-left: 0.625rem;
              }
            }

            .number {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              margin-top: 1.625rem;

              .left {
                display: flex;
                align-items: center;

                .iconfont {
                  font-size: 1.5rem;
                  color: #f15353;
                  margin-right: 0.375rem;
                }

                span {
                  // color: #f15353;
                  font-size: 14px;
                  // border-left: solid 0.0625rem #ebebeb;
                  padding-left: 0.375rem;
                }
              }

              .go_group {
                height: 1.75rem;
                border-radius: 0.25rem;
                color: #fff;
                background: #f15353;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 0.625rem;
                padding: 0 0.85rem;
              }
            }
          }
        }

        .goods_box:last-child {
          border: none;
        }
      }

      .into_group {
        margin-top: 0.625rem;
        background: #fff;
        padding: 0.875rem;

        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.625rem;

          .line_left,
          .line_right {
            border: solid 0.0625rem #f15353;
            width: 3.75rem;
          }

          span {
            margin: 0 1.25rem;
            font-size: 16px;
            color: #f15353;
          }
        }

        .time {
          em {
            background-color: #f15353;
            color: #fff;
          }
        }

        p {
          margin-top: 0.875rem;
          font-size: 14px;

          span {
            color: #f15353;
          }
        }

        .btn {
          margin-top: 1.25rem;
          width: 18.75rem;
          height: 2.5rem;
          border-radius: 0.375rem;
          color: #fff;
          font-size: 16px;
          background: #f15353;
          border: none;
        }

        .endClass {
          background-color: #969799;
        }
      }

      .group_user {
        background: #fff;
        margin-top: 0.625rem;
        padding: 0.875rem 0.875rem 1.75rem 0.875rem;

        h2 {
          font-weight: normal;
          font-size: 15px;
          margin-bottom: 0.625rem;
          text-align: left;
        }

        .user_box {
          margin-top: 1.25rem;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          max-height: 8.5rem;
          overflow: scroll;

          .user {
            position: relative;
            margin: 0.8rem 0.375rem 0.85rem 0;

            .img {
              width: 3rem;
              height: 3rem;
              background: #fafafa;
              border-radius: 2rem;
              border: dashed 0.0625rem #ebebeb;
              overflow: hidden;
              display: flex;

              img {
                width: 100%;
              }
            }

            .iconfont {
              width: 3rem;
              height: 3rem;
              font-size: 1.5rem;
              color: #ebebeb;
              position: absolute;
              line-height: 3rem;
              top: 0;
              left: 0;
            }

            span {
              width: 3rem;
              height: 1.25rem;
              line-height: 1.25rem;
              border-radius: 2rem;
              background: #ff8340;
              font-size: 12px;
              color: #fff;
              display: block;
              position: absolute;
              bottom: -0.625rem;
            }

            .current {
              border: solid 0.0625rem #ff8340;
            }
          }

          .reward::before {
            position: absolute;
            content: '';
            top: -0.8rem;
            left: 50%;
            transform: translateX(-46%);
            width: 2.7rem;
            height: 1.3rem;
            background-image: url("../../../assets/images/group_reward.png");
            background-size: contain;
            background-repeat: no-repeat;
          }
        }
      }

      .look_btn {
        background: #fff;
        width: 100%;
        position: fixed;
        bottom: 0;
        border-top: solid 0.0625rem #ebebeb;
        padding: 0 0.875rem;

        button {
          border: none;
          background: #f15353;
          font-size: 16px;
          color: #fff;
          width: 100%;
          height: 2.5rem;
          border-radius: 0.375rem;
          margin: 0.375rem auto;
        }
      }
    }

    .mint-popup-4 {
      width: 100%;
    }

    .one_open {
      padding-bottom: 3.75rem;

      .img_price {
        display: flex;
        padding: 0.875rem;

        .goods {
          width: 5.875rem;
          height: 5.875rem;
          background: #f2f2f2;
          border: solid 0.0625rem #ebebeb;
          overflow: hidden;
          border-radius: 0.1875rem;
          position: absolute;
          top: -1.875rem;

          img {
            width: 100%;
          }
        }

        .price {
          margin-left: 6.875rem;
          text-align: left;

          .price_a {
            color: #f15353;
            font-size: 18px;
          }

          .price_b {
            color: #8c8c8c;
            font-size: 12px;
          }
        }
      }

      .icon_close {
        position: absolute;
        top: 0.25rem;
        right: 0;
        width: 2.5rem;
        height: 2.5rem;

        .iconfont {
          line-height: 2.5rem;
          font-size: 1.125rem;
          color: #999;
        }
      }

      .select_box {
        padding: 0.875rem 0.875rem 0 0.875rem;

        .select {
          border-top: solid 0.0625rem #ebebeb;
          display: flex;
          flex-wrap: wrap;
          padding: 0.875rem 0;

          li {
            width: 6.75rem;
            padding: 0.625rem 0;
            border: solid 0.0625rem #ebebeb;
            border-radius: 0.25rem;
            margin-right: 0.625rem;
            margin-bottom: 0.625rem;

            span {
              display: block;
              font-size: 14px;

              font {
                font-size: 18px;
              }
            }
          }

          li:nth-child(3n) {
            margin-right: 0;
          }

          .current {
            border: solid 0.0625rem #f15353;
            color: #f15353;
          }
        }

        .van-radio-group {
          display: flex;
          flex-wrap: wrap;

          .van-radio {
            margin-right: 0.3125rem;
            margin-bottom: 0.3125rem;
            background: #fff;
            border: 1px solid #bfcbd9;
            text-align: center;
            box-sizing: border-box;
            border-radius: 0.25rem;
          }

          .vantRadioshow {
            background-color: rgb(241, 83, 83);
            border-color: rgb(241, 83, 83);
            box-shadow: rgb(241, 83, 83) -1px 0 0 0;
          }
        }
      }

      .noVantRadio {
        padding: 0 1.25rem;

        .van-radio-group {
          .van-radio__label {
            padding: 2rem !important;
          }
        }

        dl {
          margin-bottom: 0.8rem;
          text-align: left;

          dt {
            margin-bottom: 0.5rem;
          }

          .van-radio-group {
            display: flex;
            flex-wrap: wrap;

            .van-radio {
              margin-right: 0.3125rem;
              margin-bottom: 0.3125rem;
              background: #fff;
              border: 1px solid #bfcbd9;
              text-align: center;
              box-sizing: border-box;
              border-radius: 0.25rem;
            }

            .vantRadioshow {
              background-color: rgb(241, 83, 83);
              border-color: rgb(241, 83, 83);
              box-shadow: rgb(241, 83, 83) -1px 0 0 0;
            }
          }
        }
      }

      .buy_number {
        margin: 0 0.875rem;
        height: 3.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: solid 0.0625rem #ebebeb;
        border-bottom: solid 0.0625rem #ebebeb;

        .num {
          border-radius: 0.1875rem;
          float: right;
          background-color: #fff;

          .leftnav {
            height: 1.75rem;
            width: 1.75rem;
            float: left;
            background-color: #f2f2f2;
            color: #999;
            text-align: center;
            border-radius: 0.1875rem;
            line-height: 1.75rem;
            font-size: 18px;
            font-weight: bold;
          }

          .shownum {
            height: 1.75rem;
            width: 2.25rem;
            float: left;
            border: 0;
            margin: 0;
            padding: 0;
            text-align: center;
            color: #333;
          }

          .rightnav {
            height: 1.75rem;
            width: 1.75rem;
            float: right;
            background-color: #f2f2f2;
            color: #999;
            text-align: center;
            border-radius: 0.1875rem;
            line-height: 1.75rem;
            font-size: 18px;
            font-weight: bold;
          }
        }
      }

      .btn {
        background: #f15353;
        height: 3.125rem;
        width: 100%;
        color: #fff;
        font-size: 16px;
        position: fixed;
        bottom: 0;
        left: 0;
        border: none;
      }
    }
  }
</style>
