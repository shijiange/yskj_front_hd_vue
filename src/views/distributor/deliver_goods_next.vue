<template>
  <div>
    <div class="search_box" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
      <ul class="search">
        <li class="left">
          <i @click="goBack" style="padding-right: 1.5rem;" class="iconfont icon-back"></i>
          <span>发货</span>
        </li>
      </ul>
    </div>

    <div style="height: 2.75rem;"></div>

    <ul class="goods-box" style="padding-top: 0.5rem;">
      <van-swipe-cell class="aaa" v-for="(item, index) in list" :key="index">
        <li>
          <div class="left">
            <img :src="item.goods.thumb" alt="" />
          </div>
          <div class="right">
            <p class="title">{{ item.goods.title | escapeTitle }}</p>
            <span class="spec text-over">规格:{{ item.option_str ? item.option_str : "无规格" }}</span>
            <p class="stock">
              价格:<span class="price">{{ $i18n.t("money") }}{{ item.goods.price }}</span>
            </p>
            <div class="ticket ">
              <p class="repertory text-over">库存 {{ item.goods.stock }}</p>
              <div class="select">
                <i class="iconfont icon-life-game-sign" @click.stop="numberLeft(index)"></i>
                <!-- <input type="tel" title="number" v-model.lazy="item.total" /> -->
                <input type="number" class="shownum" v-model.lazy="item.total" @focus="getActiveOldTotal(index)" @keyup="getActiveNewTotal" ref="tcInput" />
                <i class="iconfont icon-life-game-plus" @click.stop="numberRight(index)"></i>
              </div>
            </div>
          </div>
        </li>
        <template slot="right">
          <van-button square type="danger" style="height: 100%;" text="删除" @click="delCart(index)" />
        </template>
      </van-swipe-cell>
    </ul>

    <div class="car-btn" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <van-button type="danger" round @click="submitGoods" :disabled="loading" :loading="loading" size="small">{{ loading ? "加载中" : "下一步" }}</van-button>
    </div>
  </div>
</template>

<script>
import deliver_goods_next_controller from "./deliver_goods_next_controller";

export default deliver_goods_next_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.van-button {
  padding: 0 24px;
}

.search_box {
  position: fixed;
  width: 100%;
  z-index: 99;
  border-bottom: 0.0625rem solid #efefef;

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

.text-over {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-box {
  background: #fff;
  padding: 1rem;
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
    }

    .title {
      font-weight: bold;
      color: #000;
      font-size: 0.75rem;
      height: 2.5rem;
      line-height: 1.25rem;
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
      flex: 1;
      align-self: center;
    }

    .ticket {
      display: flex;
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
  display: flex;
  position: fixed;
  flex-direction: row-reverse;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 0.5rem 1rem;

  .all {
    flex: 1;
    text-align: left;
    align-self: center;
  }

  .buy {
    font-weight: bold;
    width: 5.125rem;
    height: 2rem;
    line-height: 2rem;
    background-image: linear-gradient(90deg, #f74c4c 0%, #f20b0b 100%), linear-gradient(#000, #000);
    background-blend-mode: normal, normal;
    border-radius: 1rem;
    color: #fff;
  }
}

.select {
  display: flex;

  span {
    outline: none;
    border: none;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 14px;
    text-align: center;
  }

  input {
    outline: none;
    border: none;
    display: inline-block;
    width: 2rem;
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 14px;
    text-align: center;
  }

  i:first-child {
    background-color: #ccc;
  }

  i:last-child {
    background-color: #ffae00;
  }

  i {
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    line-height: 1.5rem;
    border-radius: 0.75rem;
    color: #fff;
    font-size: 16px;
  }
}

.pcStyle {
  left: 50%;
  transform: translateX(-50%);
}
</style>
