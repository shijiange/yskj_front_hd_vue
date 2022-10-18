<template>
  <div id="my_shaky">
    <c-title :hide="false" text="我的报名"></c-title>
    <div class="content">
      <div class="tab_box">
        <ul class="tab_list">
          <van-tabs v-model="active" @change="onClick" id="tab">
            <van-tab title="全部" :id="0" class="tabChild"></van-tab>
            <van-tab :title="item.name" v-for="(item, index) in categories" :key="index" :id="item.id" class="tabChild"></van-tab>
          </van-tabs>
        </ul>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功" v-if="datas.length > 0">
        <ul class="new_box">
          <li class="new_list" v-for="(item, index) in datas" :key="index">
            <p class="title">
              <span>订单号：{{ item.order_sn }}</span
              ><span class="wait">{{ item.status === 0 ? "待付款" : (item.status == '-1'?"已关闭":"报名成功") }}</span>
            </p>
            <div class="info" @click="toRegistration(item)">
              <div class="left">
                <img :src="item.thumb" />
              </div>
              <div class="right">
                <p class="top-title">{{ item.title }}</p>
                <p class="price" v-if="item.price > 0.0">
                  <span class="fuhao">{{ $i18n.t("money") }}</span
                  >{{ item.price }}
                </p>
                <p class="price" v-if="item.price <= 0.0">免费</p>
              </div>
              <div class="time">
                <i class="iconfont icon-record_time"></i><span>{{ timestampToTime(item.start_time) }}</span
                ><span>至{{ item.end_time }}</span>
              </div>
            </div>
            <div class="count">
              <span style="margin-right: 0.5rem;">共{{ item.goods_total }}人</span><span v-if="item.price > 0.0">实付：¥{{ item.price }}</span>
            </div>
            <div class="status" v-if="item.status != '-1'">
              <div class="pay" @click="checkPay(item)" v-if="item.status === 0">
                <span>支付</span>
              </div>
              <div class="cancel" @click="cancleOrder(item)">
                <span>取消订单</span>
              </div>
              <div class="cancel" @click="toRefund(item)" v-if="item.is_open_refund == 1 ">
                <span>{{ item.refund_id ? ( item.status == -1 ? '已退款' : '退款中' ) : '申请退款' }}</span>
              </div>
            </div>
          </li>
        </ul>
      </van-pull-refresh>
      <div class="blank" v-if="datas.length <= 0">
        <img src="../../../assets/images/blank.png" />
        <span>还没有记录哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import my_shakycontroller from "./my_shakycontroller";
export default my_shakycontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#my_shaky {
  .content {
    .new_box {
      padding-top: 1rem;

      .new_list {
        margin-bottom: 1rem;
        background-color: #fff;

        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;

          .wait {
            color: #f15353;
          }
        }

        .info {
          padding: 0.5rem 1rem;
          display: flex;
          flex-wrap: wrap;

          .left {
            width: 8rem;
            height: 5rem;
            display: flex;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .right {
            margin-left: 5px;
            display: flex;
            flex-direction: column;
            align-items: baseline;
            justify-content: space-between;
            flex: 1;

            .top-title {
              font-size: 16px;
              display: -webkit-box;
              overflow: hidden;
              white-space: normal;
              text-overflow: ellipsis;
              word-wrap: break-word;
              -webkit-line-clamp: 2;

              /* autoprefixer: off */
              -webkit-box-orient: vertical;
              text-align: left;
              margin-bottom: 5px;
              width: 100%;
            }

            .price {
              color: #f15353;
              font-size: 16px;

              .fuhao {
                font-size: 12px;
              }
            }
          }

          .time {
            margin-top: 5px;
            color: #999;
            display: flex;
            align-items: center;
          }
        }

        .count {
          background-color: #fff;
          text-align: right;
          padding: 10px 10px;
          border-bottom: solid 1px #ccc;

          .countSpan {
            min-width: 65px;
            border-radius: 15px;
            border: 0.0625rem solid #666;
            margin-left: 0.625rem;
            padding: 0.25rem 0.625rem;
            text-align: center;
            font-size: 12px;
            margin-bottom: 0.5rem;
            margin-right: 0.5rem;
          }
        }

        .status {
          padding: 10px 5px;
          display: flex;
          justify-content: flex-end;

          .pay {
            width: 3rem;
            height: 2rem;
            box-sizing: border-box;
            border: solid 1px #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 0.8rem;
          }

          .cancel {
            width: 5rem;
            height: 2rem;
            box-sizing: border-box;
            border: solid 1px #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 0.8rem;
          }
        }
      }
    }

    .blank {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 6rem;
        height: 6rem;
      }

      span {
        margin-top: 15px;
        color: #ccc;
        font-size: 14px;
      }
    }
  }
}
</style>
