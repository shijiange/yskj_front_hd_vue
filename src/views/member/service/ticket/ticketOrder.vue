<template>
  <div id="ticketOrder" :class="'ticketOrder'+$store.state.service.lang">
    <c-title :hide="false" :text='language.title'></c-title>

    <ul class="list">

      <li class="item" v-for="(item,index) in ticketOrders" :key='index'>
        <div class="addr">
          <i class="iconfont icon-life-plane"></i>
          <span class="left">机票</span>
          <span class="left">&nbsp;&nbsp;</span>
          <span class="left"></span>
          <b class="right">{{item.payDetil}}</b>
        </div>
        <div class="data">
          <!-- <div class="time">
              <div class="left">
                  <p class="one">
                      <span>{{item.data}}</span>&nbsp;&nbsp;
                      <span>{{item.fromTime}}</span> 至 <span>{{item.toTime}}</span>
                  </p>
                  <p class="two"><span>{{item.airline}}</span> <span>{{item.flight}}</span></p>
              </div>
              <div class="right">{{$i18n.t('money')}}{{item.price}}</div>
          </div> -->
          <ul class="time">
            <li class="a"><span>{{item.fromAddr}}&nbsp;-&nbsp;{{item.toAddr}}</span><span>{{$i18n.t("money")}}<b>{{item.price}}</b></span>
            </li>
            <li class="b">{{item.airline}}{{item.flight}}</li>
            <li class="c">{{item.fromTime}}至{{item.toTime}}</li>
          </ul>
          <div class="btns">
            <button type="button" v-for="(btn,i) in item.btns" :key='i' :data-index="btn.type" @click="jump($event)">
              {{btn.btn}}
            </button>
          </div>
        </div>
      </li>
      <router-link :to="fun.getUrl('ticketOrderDetail')">
      </router-link>
    </ul>
  </div>
</template>

<script>
import ticketOrder_controller from "./ticketOrder_controller";

export default ticketOrder_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .ticketOrderch {
    .list {
      .item {
        width: 100%;
        margin-top: 0.625rem;
        background-color: #fff;
        clear: both;

        .addr {
          padding: 0 0.9375rem;
          height: 2.25rem;
          line-height: 2.25rem;
          color: #333;
          font-size: 14px;
          border-bottom: solid 0.0625rem #ebebeb;

          i {
            float: left;
            color: #666;
            font-size: 1.25rem;
            margin-right: 0.625rem;
          }

          span {
            float: left;
          }

          b {
            float: right;
            font-weight: normal;
            color: #f15353;
          }
        }

        .data {
          background: #fff;

          .time {
            padding: 0.625rem 1.25rem;

            .a {
              font-size: 18px;
              line-height: 2.25rem;
              font-weight: bold;
              display: flex;
              justify-content: space-between;

              span:last-child {
                font-size: 14px;
                color: #f15353;

                b {
                  font-size: 18px;
                }
              }
            }

            .b,
            .c {
              text-align: left;
              font-size: 14px;
              color: #8c8c8c;
              line-height: 1.25rem;
            }

            div.left {
              width: 80%;
              text-align: left;
              float: left;

              .one {
                span {
                  color: #333;
                  font-size: 14px;
                  line-height: 2.1875rem;
                }
              }

              .two {
                color: #666;
                font-size: 12px;
              }
            }

            div.right {
              width: 20%;
              float: right;
              color: #f15353;
              font-size: 16px;
              margin-top: 1.25rem;
            }
          }

          .btns {
            width: 100%;
            height: 2.5rem;
            padding-right: 0.875rem;
            border-top: 0.0625rem solid #ebebeb;

            button {
              padding: 0.25rem 0.625rem;
              margin-left: 0.625rem;
              margin-top: 0.5rem;
              color: #333;
              border: 0.0625rem solid #666;
              border-radius: 0.1875rem;
              font-size: 12px;
              float: right;
              background: #fff;
              outline: 0;
            }
          }
        }
      }
    }
  }

  .ticketOrderwei {
    .list {
      margin: 0.625rem 0.9375rem;

      .item {
        box-shadow: 0.125rem 0.125rem 0.125rem 0.125rem #aaa;
        width: 100%;
        height: 8.125rem;
        margin-bottom: 0.9375rem;
        border-radius: 0.375rem;

        .addr {
          padding: 0 0.9375rem;
          height: 1.5625rem;
          line-height: 1.5625rem;
          background: #1bba9e;
          color: #fff;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;

          span {
            float: right;
          }

          b {
            float: left;
            font-weight: normal;
          }
        }

        .data {
          background: #fff;
          height: 6.5625rem;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;

          .time {
            padding: 0 0.9375rem;
            height: 3.75rem;

            div.left {
              width: 80%;
              text-align: right;
              float: right;

              .one {
                span {
                  color: #333;
                  font-size: 14px;
                  line-height: 2.1875rem;
                }
              }

              .two {
                color: #666;
                font-size: 12px;
              }
            }

            div.right {
              width: 20%;
              float: left;
              color: #333;
              font-size: 16px;
              margin-top: 1.25rem;
            }
          }

          .btns {
            width: 100%;
            height: 2.8125rem;
            border-top: 0.0625rem solid #ccc;

            button {
              padding: 0.25rem 0.625rem;
              margin: 0.625rem;
              color: #ff951b;
              border: 0.0625rem solid #ff951b;
              border-radius: 0.25rem;
              font-size: 12px;
              float: left;
              background: #fff;
              outline: 0;
            }
          }
        }
      }
    }
  }

</style>
