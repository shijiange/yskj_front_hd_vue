<template>
  <div>
    <div class="search_box" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
      <ul class="search">
        <li class="left">
          <i @click="goBack" style="padding-right: 1.5rem;" class="iconfont icon-back"></i>
          <span>我的库存</span>
        </li>
        <li class="right">
          <input v-model="kwd" type="text" title="搜索" placeholder="搜索商品" style="color: #000;" />
          <i class="iconfont icon-sousuo" @click="getData"></i>
        </li>
      </ul>
    </div>

    <div style="height: 2.75rem;"></div>

    <ul class="goods-box">
      <li v-for="(item, index) in list" :key="index" @click.stop="gotoStock(item.goods_id, item.option_id)">
        <div class="left">
          <img :src="item.goods ? item.goods.thumb : ''" alt="" />
        </div>
        <div class="right">
          <p class="title">{{ item.goods ? item.goods.title : '' }}</p>
          <!-- <span class="spec text-over">规格:{{ item.goods_option ? item.goods_option.title : '' }}</span> -->
          <p class="stock">
            进货价:<span class="price">{{ $i18n.t('money') }}{{ item.show_price }}</span>
            <span class="repertory">库存{{ item.stock }}</span>
          </p>
          <div class="ticket">
            <p class="number text-over">
              兑换券
              {{ item.goods_change ? item.goods_change.certificate : '0' }}张
            </p>
            <p
              @click.stop="showPop(item.stock, item.id, item.goods_change.certificate)"
              class="exchange"
              v-if="item.is_exchange"
            >
              兑换券
            </p>
          </div>
        </div>
      </li>
    </ul>

    <div
      class="car-btn"
      :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }"
      :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
    >
      <p @click="gotoOrderGoods">订货</p>
    </div>

    <van-popup v-model="show1" position="bottom" closeable close-icon="close">
      <div class="bottom-popop-box">
        <p class="title">换取兑换券</p>
        <div class="stock-box">
          <p>库存</p>
          <div class="input-num">
            <input type="number" placeholder="请输入数量" v-model="exchangeNum" />
            <p class="allExchange" @click="allExchange">全部兑换</p>
          </div>
          <p>
            可得到<span class="red">{{ canExchangeNum }}</span
            >张兑换券
          </p>
        </div>
        <div class="remain">
          <p style="flex: 1; line-height: 2.5rem;">剩余库存：{{ exchangeStock }}</p>
          <p class="sure-btn" @click="goodsExchange">
            {{ exchangeStatus ? '兑换成功，去换货' : '确定' }}
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import my_repertory_controller from './my_repertory_controller';

export default my_repertory_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search_box {
  position: fixed;
  width: 100%;

  .search {
    height: 2.75rem;
    line-height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.875rem;
    background-color: #fff;

    .left {
      font-size: 16px;
      display: flex;
      font-weight: bold;

      i {
        color: #333;
        font-size: 1rem;
      }

      span {
        display: block;
        margin: 0 0.25rem;
        max-width: 5.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
      }

      i:last-child {
        font-size: 1.125rem;
      }
    }

    .right {
      width: 12.375rem;
      height: 1.875rem;
      background: #f8f8f8;
      display: flex;
      line-height: 1.875rem;
      border-radius: 1rem;
      padding: 0 0.625rem;
      font-size: 14px;
      color: #c9c9c9;

      i {
        font-size: 1.125rem;
        margin-right: 0.375rem;
      }

      input {
        border: none;
        width: 100%;
      }

      input::-webkit-input-placeholder,
      textarea::-webkit-input-placeholder {
        color: #c9c9c9;
      }
    }
  }
}

.bottom-popop-box {
  text-align: left;
  margin: 1rem;

  .red {
    color: #f01818;
  }

  .title {
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 1rem;
  }

  .stock-box {
    display: flex;
    flex-direction: column;
  }

  .input-num {
    display: flex;
    padding: 0.5rem 0;
    margin: 0.5rem 0;
    border-bottom: 1px solid #eee;

    input {
      flex: 1;
      border: none;
      outline: none;
    }
  }

  .allExchange {
    text-align: center;
    font-size: 13px;
    width: 3.781rem;
    height: 1.25rem;
    border-radius: 0.625rem;
    border: solid 1px #f01818;
    color: #f01818;
  }

  .remain {
    display: flex;
    font-weight: bold;
    margin-top: 2rem;

    .sure-btn {
      font-size: 15px;
      text-align: center;
      line-height: 2.5rem;
      width: 8.5rem;
      height: 2.5rem;
      background-color: #f01818;
      border-radius: 1.234rem;
      color: #fff;
    }
  }
}

.text-over {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-box {
  background: #fff;
  padding: 1rem;
  padding-bottom: 4rem;
  min-height: 100vh;

  li {
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

.car-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3.5rem;
  background: #fff;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.09);

  p {
    font-size: 15px;
    font-weight: bold;
    color: #fff;
    background-color: #f01818;
    border-radius: 1.25rem;
    width: 15.625rem;
    height: 2.5rem;
    margin: 0.5rem auto;
    text-align: center;
    line-height: 2.5rem;
  }
}

.pcStyle {
  left: 50%;
  transform: translateX(-50%);
}
</style>
