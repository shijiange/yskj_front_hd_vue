<template>
  <div id="course">
    <c-title :hide="false" text="会员升级"></c-title>
      <div class="content">
        <div class="top">
          <div class="left">
            <img :src="course_goods.goods_thumb">
          </div>
          <div class="right">
            <div class="title">
            <div>{{course_goods.goods_title}}</div>
            <div class="num">共{{course_goods.course_chapter_num}}节</div>
            </div>
            <div class="teacher">讲师:{{course_goods.lecturer_name}}</div>
          </div>
        </div>
        <div class="bottom">
            <span class="tit">以下等级可以免费观看</span>
            <template v-if="level_type==2">
              <div class="good-wrap" v-for="(item,index) in level_data" :key="index">
                <div class="good-item">
                  <div class="good-tit">{{item.level_name}}</div>
                  <div class="good" v-for="(list,index) in item.goods" :key="index" @click="gotoBuy(list.id)">
                    <div class="img">
                      <img :src="list.thumb">
                    </div>
                    <div class="bt">
                        <div class="head">{{list.title}}</div>
                        <div class="cash">{{$i18n.t('money')}}{{list.price}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 余额充值 -->
            <template v-if="level_type!=2">
              <div class="wrap">
                  <div class="item" v-for="(item,index) in level_data" :key="index">
                    <div class="level">{{item.level_name}}</div>
                    <div class="al">
                      <span v-if="level_type==0||level_type==1">订单</span>
                      <span  v-if="level_type==3">团队</span><span v-if="level_type==1">数量</span>
                      <span v-if="level_type==0">金额</span><span v-if="level_type==3">业绩</span>
                      <span v-if="level_type==4">余额充值一次性</span>
                      <span>满</span>
                    </div>
                    <div class="amount">
                      <span class="num" v-if="level_type==0">{{item.order_money}}</span>
                      <span class="num" v-if="level_type==1">{{item.order_count}}</span>
                      <span class="num" v-if="level_type==3">{{item.team_performance}}</span>
                      <span class="num" v-if="level_type==4">{{item.balance_recharge}}</span>
                      <span v-if="level_type==1">个</span><span v-if="level_type==0||level_type==3">元</span>
                    </div>
                    <div class="yel" v-if="level_type!=4">
                      <div class="first">
                        您的<span v-if="level_type==0||level_type==1">订单</span>
                        <span  v-if="level_type==3">团队</span>
                        <span v-if="level_type==1">数量</span>
                        <span v-if="level_type==0">金额</span>
                        <span v-if="level_type==3">业绩</span>还差
                      </div>
                      <div class="second">
                          <span class="num" v-if="level_type==0">{{item.member_order_money}}</span>
                          <span class="num" v-if="level_type==1">{{item.member_order_count}}</span>
                          <span class="num" v-if="level_type==3">{{item.member_team_performance}}</span>
                          <span v-if="level_type==1">个</span>
                          <span v-if="level_type==0||level_type==3">元</span>
                      </div>
                    </div>
                    <div class="btn-recharge" v-if="level_type==4" @click.stop="toRecharge(item.balance_recharge)"> 充值 </div>
                  </div>
              </div>
              <div class="toBuy" @click="goto" v-if="level_data.length > 0">去购买</div>
              <yz-blank v-else :datas="level_data" text="什么也没有"></yz-blank>
            </template>
        </div>
      </div>
  </div>
</template>

<script>
import course_member_level_controller from "./course_member_level_controller";
export default course_member_level_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#course {
  padding: 0 0.75rem;

  .content {
    .top {
      margin-top: 0.5rem;
      margin-bottom: 1.125rem;
      display: flex;
      padding: 0.625rem 0.375rem;
      background-color: #fff;
      box-shadow: 0 0 0.4375rem 0 rgba(194, 194, 194, 0.31);
      border-radius: 0.3125rem;

      .left {
        display: flex;
        width: 6.3125rem;
        height: 6.3125rem;
        border-radius: 0.3125rem;
        box-sizing: border-box;

        img {
          border-radius: 0.3125rem;
          width: 100%;
          height: 100%;
        }
      }

      .right {
        display: flex;
        flex: 1;
        margin-left: 1.25rem;
        flex-direction: column;
        justify-content: space-between;

        .title {
          color: #000;
          font-size: 14px;
          text-align: left;

          .num {
            color: #999;
            font-size: 14px;
            margin-top: 0.8rem;
            text-align: left;
          }
        }

        .teacher {
          color: #999;
          font-size: 12px;
          text-align: left;
        }
      }
    }

    .bottom {
      text-align: left;

      .tit {
        font-size: 14px;
        color: #333;
      }

      .wrap {
        margin-top: 1.125rem;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .item {
          background-color: #fff;
          border-radius: 0.875rem;
          border: solid 0.0625rem #ccc;
          margin: 0 2% 0.5rem 0;
          width: 31%;
          padding-top: 1.3125rem;
          padding-left: 0.25rem;
          padding-right: 0.25rem;
          padding-bottom: 0.5rem;
          box-sizing: border-box;
          text-align: center;

          .level {
            color: #000;
            font-size: 16px;
          }

          .al {
            margin-top: 1rem;
            font-size: 12px;
          }

          .amount {
            margin-top: 0.6875rem;
            color: #ff7200;
            font-size: 12px;

            .num {
              font-size: 18px;
            }
          }

          .yel {
            margin-top: 0.5rem;
            width: 6.125rem;
            height: 2.75rem;
            background-color: #fffbf3;
            border-radius: 5px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #ff7200;
            flex-wrap: wrap;

            .first {
              color: #333;
            }
          }
          .btn-recharge {
            display: inline-block;
            color: #fff;
            margin-top: 0.5rem;
            padding: 0 0.8rem;
            background-color: #ff7200;
            border-radius: 0.5rem;
          }
        }
        .item:last-child { margin-right: 0; }
      }

      .toBuy {
        width: 16.9375rem;
        height: 3rem;
        background-color: #ff8b00;
        border-radius: 1.5rem;
        margin: 0 auto;
        margin-top: 2.5rem;
        font-size: 18px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .good-wrap {
        margin-top: 1.125rem;
        width: 100%;

        .good-item {
          border-radius: 0.3125rem;
          padding: 0.75rem 0.25rem;
          background-color: #fff;
          box-sizing: border-box;

          .good-tit {
            font-size: 16px;
            color: #000;
          }

          .good {
            margin-top: 0.75rem;
            display: inline-block;
            width: 48%;
            margin-right: 4%;
            box-shadow: 0 4px 4px 0 	rgba(133, 133, 133, 0.1);
            border-radius: 0.3125rem;

            .img {
              width: 100%;
              height: 10.25rem;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .bt {
              background-color: #fff;
              border-radius: 0.3125rem;

              .head {
                color: #000;
              }

              .cash {
                margin-top: 0.75rem;
                color: #e20606;
                font-size: 12px;
              }
            }
          }
          .good:nth-child(2n-1) { margin-right: 0; }
        }
      }
    }
  }
}
</style>
