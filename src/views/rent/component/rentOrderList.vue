<template>
  <div id="rentOrderList">

    <div class="shop">
      <div class="item" v-for="(item,i) in datasource" :key='i'>
        <div class="rentDate">
          <p v-if="item.lease_order"><i class="iconfont icon-shijian"></i>&nbsp;距离归还日期还剩 &nbsp;&nbsp;{{item.lease_order.time_lift}}
          </p>
        </div>

        <div class="rentDetail" @click="routeJump(item)" :key='i' v-for="(goods,i) in item.has_many_order_goods">
          <img :src="goods.thumb" alt="图片"/>
          <div class="title">
            {{goods.title}}
          </div>
        </div>

        <div class="rentTotal">
          <span>{{item.status_name}}</span>
          合计: <b>{{$i18n.t("money")}}{{item.price}}</b>
        </div>
        <div class="btns">
          <button :key='i' v-for="(bt,i) in item.button_models" class="rt"
                  @click="operation(bt,item)">{{bt.name}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import rentOrderList_controller from "./rentOrderList_controller";

export default rentOrderList_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .olis {
    height: 100vh;
  }

  #rentOrderList {
    .shop {
      .item {
        margin: 0.625rem 0;

        .rentDate {
          background: #fff;
          padding: 0.3125rem;
          text-align: left;

          p {
            text-align: left;
            line-height: 1.875rem;

            i {
              font-size: 16px;
              vertical-align: middle;
            }
          }

          h3 {
            font-size: 14px;
            font-weight: normal;
            color: #ff9800;
          }
        }

        .rentDetail {
          background: #f8f8f8;
          padding: 0.625rem;
          overflow: hidden;
          display: flex;
          flex-flow: row;

          img {
            width: 4.375rem;
            height: 4.375rem;
          }

          .title {
            text-align: left;
            flex: 1;
            margin: 0 0.625rem;
          }
        }

        .rentTotal {
          background: #fff;
          height: 2.5rem;
          line-height: 2.5rem;
          text-align: right;
          padding-right: 0.9375rem;

          span {
            padding: 0.0625rem 0.25rem;
            border-radius: 0.375rem;
            background: #2baf2b;
            font-size: 12px;
            font-weight: normal;
            display: inline-block;
            margin: 0.625rem 0.1875rem;
            color: #fff;
            float: left;
            line-height: 1.25rem;
          }
        }

        .btns {
          background: #fff;
          height: 2.5rem;
          padding-right: 0.9375rem;

          button {
            padding: 0.25rem 0.375rem;
            border-radius: 0.375rem;
            margin-right: 0.625rem;
            outline: 0;
            border: 0.0625rem solid #bbb;
          }
        }
      }
    }
  }
</style>
