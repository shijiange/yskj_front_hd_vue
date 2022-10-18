<template>
  <div id="teamPerformance">
    <c-title :hide="false" :text="headTitle">
    </c-title>

    <van-tabs v-model="activeName" @change="handleChange" v-if="is_show">
      <van-tab name="team">
        <span slot="title">团队业绩</span>
      </van-tab>
      <van-tab name="people">
        <span slot="title">个人业绩</span>
      </van-tab>
    </van-tabs>

    <div class="content">
      <ul class='rationList'>
        <li v-for="(elem,i) in recordsList" :key='i'>

          <div class="detail">
            <div class="header">
              <p class="month"><span>订单编号</span><span class="order_number">{{elem.order_sn}}</span></p>
              <p class="month"><span>订单金额</span><span class="number">{{elem.price}}</span></p>
              <p class="month"><span>商品数量</span><span class="number">{{elem.goods_total}}</span></p>
            </div>
            <div class="list_box">
              <div class="list" v-for="(item,i) in elem.has_many_order_goods" :key='i'>
                <div class="info">
                  <img :src="item.thumb" alt="商品图片">
                  <span>{{item.title}}</span>
                </div>
                <p class="price">{{item.price}}</p>
                <p>{{item.total}}</p>
              </div>
            </div>

          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import teamPerformance_controller from "./teamPerformance_controller";

export default teamPerformance_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #teamPerformance {
    .rationList {
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 0.5rem;

        .detail {
          background: #fff;
        }

        .header {
          display: flex;
          padding: 0.625rem 0;
          border-bottom: 0.0625rem solid #ebebeb;

          p {
            flex: 1;
            display: flex;
            flex-direction: column;

            span:first-child {
              color: #8c8c8c;
            }

            span {
              line-height: 1.75rem;
            }

            .number {
              font-size: 16px;
            }

            .order_number {
              padding: 0 8px;
              font-size: 12px;
            }
          }
        }

        .list_box {
          padding: 0 0.625rem;
        }

        .list {
          display: flex;
          font-size: 18px;

          p {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .info {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
          background: #fff;
          font-size: 14px;

          img {
            flex: 0 0 1.875rem;
            width: 1.875rem;
            height: 1.875rem;
            border-radius: 1rem;
            margin-right: 0.5rem;
          }

          span {
            flex: 1;
            text-align: left;
            max-width: 5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    /deep/ .van-tabs__line {
      z-index: 0;
    }
  }

</style>