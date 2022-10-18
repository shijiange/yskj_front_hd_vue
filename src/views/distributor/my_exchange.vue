<template>
  <div>
    <c-title :hide="false" :text="'换货记录'"> </c-title>
    <ul class="goods-box" v-if="!fun.isTextEmpty(list)">
      <li v-for="(item, index) in list" :key="index">
        <p class="time">{{ item.created_at }}</p>
        <div class="item">
          <div class="left">
            <img :src="item.goods ? item.goods.thumb : ''" alt="" />
          </div>
          <div class="right">
            <p class="title">{{ item.goods ? item.goods.title : '' }}</p>
            <span class="spec text-over">规格:{{ item.goods_option ? item.goods_option.title : '无' }}</span>
            <div class="stock">
              <span
                >变动库存:<em class="price">{{ item.change_stock }}</em></span
              >
              <span class="repertory">变动后库存 {{ item.after_stock }}</span>
            </div>
            <div class="ticket ">
              <p class="number text-over">剩余兑换券 {{ item.certificate_unit }}张</p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <img
      v-if="fun.isTextEmpty(list)"
      src="../../assets/images/blank.png"
      alt=""
      style="width: 5rem; margin: 2rem auto; display: block;"
    />
  </div>
</template>

<script>
import my_exchange_controller from './my_exchange_controller';

export default my_exchange_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.goods-box {
  background: #fff;
  padding: 1rem;
  min-height: 100vh;

  .time {
    font-size: 17px;
    text-align: left;
  }

  .item {
    padding-bottom: 0.5rem;
    display: flex;

    .left {
      flex: 0 0 8rem;

      img {
        width: 8rem;
        height: 8rem;
        border-radius: 0.313rem;
      }
    }

    .right {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      margin: 0.5rem 0 0.5rem 0.5rem;
      font-size: 12px;
      width: 13rem;
    }

    .title {
      font-weight: bold;
      font-size: 15px;
      margin-bottom: 0.3rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .spec {
      color: #9f9f9f;
    }

    .stock {
      margin-top: 1rem;
      margin-bottom: 0.3rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .price {
      color: #f01818;
      font-size: 15px;
    }

    .repertory {
      color: #9f9f9f;
    }

    .ticket {
      display: flex;
    }

    .number {
      flex: 1;
      color: #fb9a00;
      align-self: center;
    }

    .exchange {
      background-color: #ffae00;
      border-radius: 15px;
      color: #fff;
      padding: 2px 0.5rem;
      line-height: 1rem;
    }
  }
}
</style>
