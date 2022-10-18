<template>
  <div>
    <div class="search_box" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
      <ul class="search">
        <li class="left">
          <i @click="goBack" style="padding-right: 1.5rem;" class="iconfont icon-back"></i>
          <span>发货</span>
        </li>
        <li class="right">
          <input v-model="kwd" type="text" title="搜索" placeholder="搜索商品" />
          <i class="iconfont icon-sousuo" @click="getData"></i>
        </li>
      </ul>
    </div>

    <div style="height: 2.75rem;"></div>

    <ul class="goods-box" style="padding-top: 0.5rem;">
      <van-checkbox-group v-model="selectCheck" ref="checkboxGroup">
        <van-checkbox
          :name="item"
          checked-color="#f01818"
          class="border_1px"
          @click="toggleAll"
          icon-size="15px"
          v-for="(item, index) in list"
          :key="index"
        >
          <li>
            <div class="left">
              <img :src="item.goods ? item.goods.thumb : ''" alt="" />
            </div>
            <div class="right">
              <p class="title">{{ item.goods ? item.goods.title : '' }}</p>
              <span class="spec text-over">规格:{{ item.goods_option ? item.goods_option.title : '无' }}</span>
              <p class="stock">
                进货价:<em style="color: #f01818;">{{ $i18n.t('money') }}</em
                ><span class="price">{{ item.goods ? item.goods.price : '' }}</span>
                <span class="repertory">库存 {{ item.stock }}</span>
              </p>
            </div>
          </li>
        </van-checkbox>
      </van-checkbox-group>
    </ul>

    <div
      class="car-btn"
      :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }"
      :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
    >
      <div class="all">
        <van-checkbox v-model="checked" @change="checkAll" checked-color="#f01818" icon-size="18px">全选</van-checkbox>
      </div>
      <div class="buy" :style="{ background: !fun.isTextEmpty(selectCheck) ? '#f74c4c' : '#999999' }" @click="addOrder">
        下单
      </div>
    </div>
  </div>
</template>

<script>
import deliver_goods_controller from './deliver_goods_controller';

export default deliver_goods_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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
  padding: 0.875rem;
  padding-bottom: 4rem;
  min-height: 100vh;

  .border_1px {
    border-bottom: 0.0625rem solid #efefef;
  }

  li {
    padding: 0.5rem 0;
    display: flex;

    .left {
      flex: 0 0 6.125rem;
      width: 6.125rem;

      img {
        width: 6.125rem;
        height: 6.125rem;
        border-radius: 0.313rem;
      }
    }

    .right {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      margin: 0 0 0 0.5rem;
      font-size: 12px;
    }

    .title {
      font-weight: bold;
      font-size: 12px;
      line-height: 1.25rem;
      height: 2.5rem;
      margin-bottom: 0;
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
      font-size: 0.625rem;
    }

    .price {
      color: #f01818;
      font-size: 1rem;
      font-weight: bold;
    }

    .repertory {
      color: #9f9f9f;
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
    // background-image: linear-gradient(90deg,
    //   #f74c4c 0%,
    //   #f20b0b 100%),
    // linear-gradient(
    //     #000000,
    //     #000000);
    // background-blend-mode: normal,
    // normal;
    background: #f74c4c;
    border-radius: 1rem;
    color: #fff;
  }
}

.pcStyle {
  left: 50%;
  transform: translateX(-50%);
}
</style>
