<template>
  <div id="tokerMerchant">
    <c-title :hide="false" :text="plugin_name" :url="'home'"></c-title>
    <template v-if="!merchant">
      <div class="conten_a">
        <div class="headTop">
          <div class="user">
            <img :src="member.avatar_image" alt="" />
            <div class="usetDetail">
              <div class="userName">{{ member.nickname }}</div>
              <div class="orderNum">订单编号：{{ order.order_sn }}</div>
            </div>
          </div>
        </div>
        <div class="shopDetail">
          <div class="shopLeft">
            <img :src="card.thumb" alt="" />
          </div>
          <div class="shopRight">
            <div class="shopName">{{ card.title }}</div>
            <div class="shopPrice">￥{{ card.price }}</div>
          </div>
        </div>
      </div>
      <!-- 一次性消费 -->
      <div class="onece">
        <div class="title">一次性消费项</div>
        <div class="oneList" v-if="info.once_write_off == '0'">
          <div class="shopDetail" v-for="(item, ind) in info.member_once" :key="ind">
            <van-checkbox v-model="once_form" shape="square" icon-size="14px" @change="onceChange" v-show="ind == 0" ></van-checkbox>
            <div class="shopLeft">
              <img :src="item.full_img_url" alt="" />
            </div>
            <div class="shopRight">
              <div class="shopName">{{ item.name }}</div>
              <div class="bottom">
                <div class="shopPrice">数量:{{ item.quantity }}</div>
                <div class="status">未使用</div>
              </div>
            </div>
          </div>
        </div>
        <div class="already" v-else-if="info.once_write_off == 1">套餐已核销</div>
      </div>
      <!-- 多次消费 -->
      <div class="repeatedly">
        <div class="title">多次性消费项</div>
        <div class="repShop" v-if="info.member_many" >
          <div class="shoplis" v-for="(item, ind) in info.member_many" :key="ind" v-show="item.status != 1">
            <div class="lisTop">
              <van-checkbox v-model="item.checked" :name='ind' shape="square" icon-size="14px" @click="manyChange(ind,item)"></van-checkbox>
              <div class="shopLeft">
                <img :src="item.full_img_url" alt="" />
              </div>
              <div class="shopRight">
                <div class="shopName">{{ item.name }}</div>
                <div class="bottom">
                  <div class="shopNum">数量：{{ item.quantity }}</div>
                  <div class="status">未使用：{{ item.rest_num }}</div>
                  <div class="status">已使用：{{ item.quantity - item.rest_num }}</div>
                </div>
              </div>
            </div>
            <div class="lisBottom">
              <van-stepper v-model="item.num" theme="round" button-size="22" disable-input @change="stepChange(ind, item)" />
            </div>
            <!-- <div class="line"></div> -->
          </div>
        </div>
        <div class="already" v-if="cheackSta" >套餐已核销</div>
      </div>
      <!-- 确认核销按钮 -->
    <div class="fiexdP">
      <div class="btn" @click="submit">确认核销</div>
    </div>
    </template>

    
    <!-- 核销成功 -->
    <div class="box" v-if="merchant">
      <i class="iconfont icon-pm_auction_success iconas"></i>
      <span class="boxspan">核销成功!</span>
    </div>
  </div>
</template>
<script>
import tokerMerchant_controller from "./tokerMerchant_controller";
export default tokerMerchant_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 4.47rem;

  .iconas {
    color: #f15353;
    font-size: 5rem;
  }

  .boxspan {
    font-size: 0.94rem;
  }
}

.already {
  height: 5.25rem;
  width: 21.56rem;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  margin: 0 auto;
}

#tokerMerchant {
  .fiexdP {
    position: fixed;
    bottom: 1.09rem;
    width: 100%;

    .btn {
      margin: 0 auto;
      width: 19.06rem;
      height: 2.5rem;
      background-color: #f14e4e;
      border-radius: 1.25rem;
      text-align: center;
      line-height: 2.5rem;
      font-size: 0.94rem;
      color: #fff;
    }
  }

  .repeatedly {
    margin-top: 0.63rem;
    padding-bottom: 6rem;

    .title {
      margin: 0 auto;
      width: 21.56rem;
      height: 1.88rem;
      background-color: #feebeb;
      border-radius: 0.47rem 0.47rem 0 0;
      text-align: center;
      font-size: 0.81rem;
      color: #333;
      line-height: 1.88rem;
    }

    .repShop {
      .shoplis:last-child {
        border: none;
      }

      .shoplis {
        height: 7rem;
        margin: 0 0.94rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        border-bottom: 1px solid #ece8e8;

        .lisBottom {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-right: 0.75rem;
        }

        .lisTop {
          display: flex;
          height: 3.59rem;
          width: 100%;
          padding: 0.69rem 1.19rem 0 0.5rem;

          .shopLeft {
            width: 3.59rem;
            height: 3.59rem;
            background-color: #f5f5f5;
            margin-left: 0.59rem;
            margin-right: 0.53rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .shopRight {
            flex: 1;
            height: 3.59rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .bottom {
              display: flex;

              .shopNum {
                font-size: 0.75rem;
                color: #999;
              }

              .status {
                font-size: 0.75rem;
                color: #f15353;
                margin-left: 0.3rem;
              }
            }

            .shopName {
              text-align: left;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
        }

        .line {
          border-top: 1px solid #ece8e8;
          margin: 0 0.75rem;
        }
      }
    }
  }

  .onece {
    margin-top: 0.63rem;

    .title {
      margin: 0 auto;
      width: 21.56rem;
      height: 1.88rem;
      background-color: #feebeb;
      border-radius: 0.47rem 0.47rem 0 0;
      text-align: center;
      font-size: 0.81rem;
      color: #333;
      line-height: 1.88rem;
    }

    .shopDetail {
      .shopRight {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        margin-left: 0.5rem;

        .bottom {
          display: flex;
          align-items: center;

          .shopPrice {
            font-size: 0.75rem;
            color: #999;
          }

          .status {
            font-size: 0.75rem;
            color: #f15353;
            margin-left: 0.3rem;
          }
        }

        .shopName {
          text-align: left;
          font-size: 0.81rem;
          color: #333;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }

      .shopLeft {
        width: 3.59rem;
        height: 3.59rem;
        margin-left: 0.59rem;
        background-color: #f5f5f5;

        img {
          width: 100%;
          height: 100%;
        }
      }

      width: 21.56rem;
      height: 5.16rem;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      padding: 0.69rem 1.19rem 0.75rem 0.5rem;
    }
  }

  .conten_a {
    .shopDetail {
      .shopRight {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        margin-left: 0.5rem;

        .shopPrice {
          font-size: 0.75rem;
          color: #f15353;
        }

        .shopName {
          text-align: left;
          font-size: 0.81rem;
          color: #333;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }

      .shopLeft {
        width: 3.59rem;
        height: 3.59rem;
        background-color: #f5f5f5;

        img {
          width: 100%;
          height: 100%;
        }
      }

      width: 21.56rem;
      height: 5.16rem;
      background-color: #fff;
      padding: 0.75rem 1.25rem 0.75rem 0.91rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      margin-top: -2.94rem;
    }

    .headTop {
      width: 100%;
      height: 8.38rem;
      background-color: #ff3e38;
      border-radius: 0 0 1.69rem 1.69rem;
      padding: 0.94rem 0.94rem 0 0.94rem;

      .user {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .usetDetail {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-left: 0.66rem;
          overflow: hidden;

          .userName {
            font-size: 1rem;
            color: #fefefe;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            text-align: left;
          }

          .orderNum {
            font-size: 0.75rem;
            color: #ececec;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            width: 100%;
          }
        }

        img {
          width: 3.56rem;
          height: 3.56rem;
          background-color: #f0f1f6;
          border-radius: 100%;
        }
      }
    }
  }
}
</style>