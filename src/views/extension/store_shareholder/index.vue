<template>
  <div id="storeShareholder">
    <c-title :hide="false" text=" 门店股东"></c-title>
    <div class="share_holder">
      <div class="image">
        <img
          :src="member.avatar"
          alt=""
        />
      </div>
      <div class="title">
        <div class="name">{{member.nickname}}</div>
        <div class="info">
          <div class="level">{{member.level_name}}</div>
          <div class="rate">比例:{{member.ratio}}%</div>
        </div>
      </div>
    </div>
    <div class="total">
      <div class="text">累计金额</div>
      <div class="money">{{ $i18n.t("money") }}{{member.bonus_total}}</div>
    </div>

    <div class="shareholder-order">
      <div id="tabs">
        <van-tabs v-model="activeName">
          <van-tab name="first">
            <span slot="title" @click="handleClick('1')">分红记录</span>
          </van-tab>
        </van-tabs>
        <div>
          <!-- <mt-tab-container v-model="activeName"> -->
          <div v-show="activeName=='first'">
            <!-- <mt-tab-container-item id="first"> -->
            <div class="list">
              <div class="lists" v-for="(item,index) in list" :key="index">
                <div class="left">
                  <div class="li-a">
                    <div class="id">分红ID:{{item.id}}</div>
                    <div class="time">{{item.created_at}}</div>
                  </div>
                  <div class="li-b" v-if="item.has_one_store">{{item.has_one_store.store_name}}</div>
                  <div class="li-c">营业额:{{item.turnover}}</div>
                </div>
                <div class="right">
                  +{{item.amount}}
                </div>
              </div>

            </div>
            <!-- </mt-tab-container-item> -->
          </div>
          <!-- </mt-tab-container> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  $red: #ee2e2b;

  #storeShareholder {
    .share_holder {
      box-sizing: border-box;
      background-color: $red;
      display: flex;
      padding: 1rem 2rem;

      .image {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        margin-right: 0.5rem;

        img {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
        }
      }

      .title {
        flex: 1;
        text-align: left;
        color: #fff;

        .name {
          font-size: 1rem;
          font-weight: 500;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 15rem;
        }

        .info {
          line-height: 1.25rem;
          font-size: 0.75rem;
          padding-top: 0.5rem;

          .level {
            display: inline-block;
            margin-right: 0.5rem;
            background: #f16b68;
            border-radius: 1rem;
            padding: 0 0.5rem;
          }

          .rate {
            display: inline-block;
          }
        }
      }
    }

    .total {
      width: 100%;
      line-height: 2rem;
      background: #fff;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      display: flex;

      .text {
        flex: 1;
        text-align: left;
      }

      .money {
        color: $red;
        font-size: 1rem;
        font-weight: 600;
      }
    }

    .shareholder-order {
      width: 100%;
      background-color: #fff;

      .list {
        background: #fff;
        min-height: calc(100vh - 13rem);

        .lists {
          padding: 1rem 0;
          margin: 0 1rem;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f2f2f9;

          .left {
            flex: 1;
            text-align: left;

            .li-a {
              line-height: 1.5rem;
              display: flex;

              .id {
                font-size: 0.8125rem;
                color: #575757;
                margin-right: 0.5rem;
              }

              .time {
                color: #999;
                font-size: 0.625rem;
              }
            }

            .li-b {
              text-align: left;
              color: #000;
              font-size: 1rem;
              padding: 0.5rem 0;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            .li-c {
              color: #666;
            }
          }

          .right {
            color: $red;
            font-size: 1rem;
            width: 5rem;
            text-align: right;
          }
        }
      }
    }
  }
</style>
