<template>
  <div id="exchangeDetail">
    <c-title :hide="false" :text="'换货'"> </c-title>

    <div class="good-box">
      <div class="left">
        <img :src="popThumb" alt="" />
      </div>
      <div class="right">
        <p class="title">{{ goodsInfo.title }}</p>
        <div class="ticket">
          <p class="number text-over">
            兑换券 {{ goodsInfo.goods_change ? goodsInfo.goods_change.certificate : '0' }}张
          </p>
        </div>
      </div>
    </div>

    <div class="good-content shopinfo noVantRadio" v-if="!fun.isTextEmpty(goodsInfo.has_many_options)">
      <dl v-for="(specs, i) in goodsInfo.has_many_specs" :key="i">
        <dt>{{ specs.title }}</dt>
        <dd>
          <van-radio-group v-model="specs.description" checked-color="#f15353" @change="selectSpecs">
            <van-radio
              :class="{ vantRadioshow: specs.description == specitem }"
              :disabled="specitem.c"
              v-for="(specitem, i) in specs.specitem"
              :name="specitem"
              :key="i"
            >
              {{ specitem.title }}
            </van-radio>
          </van-radio-group>
        </dd>
      </dl>
    </div>

    <div class="change-num">
      <p style="flex: 1; font-weight: bold;">兑换商品数量</p>
      <div class="cart">
        <span class="del" @click.stop="reduceGoods">-</span>
        <input class="input" type="number" placeholder="1" v-model.lazy="goodsCount" />
        <span class="add" @click.stop="addGoods">+</span>
      </div>
    </div>

    <div
      class="car-btn"
      :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }"
      :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
    >
      <div class="orange" @click="gotoMyRepertory">
        <span>换取兑换券</span><span style="font-size: 12px;">（当前兑换券：{{ certificate }}）</span>
      </div>
      <div class="change" @click="goExchange"><div>兑换</div></div>
    </div>
  </div>
</template>

<script>
import exchange_detail_controller from './exchange_detail_controller';

export default exchange_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.noVantRadio {
  .van-radio-group {
    display: flex;
    flex-wrap: wrap;

    .van-radio {
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      background: #fff;
      border: 1px solid #efefef;
      text-align: center;
      box-sizing: border-box;
      border-radius: 0.25rem;
    }

    .vantRadioshow {
      background-color: rgb(241, 83, 83);
      border-color: rgb(241, 83, 83);
      box-shadow: rgb(241, 83, 83) -1px 0 0 0;
    }

    .van-radio__label {
      color: #000;
    }
  }
}

#exchangeDetail {
  background: #fff;
  min-height: 100vh;
  padding: 1rem;

  .shopinfo {
    text-align: left;
    padding-left: 0.625rem;
    margin: 1rem 0 1rem 0;
    max-height: 50vh;
    overflow: scroll;

    dl {
      dt {
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #000;
      }

      dd {
        margin-bottom: 0.3125rem;
      }
    }
  }
}

.good-box {
  padding-bottom: 0.5rem;
  display: flex;

  .left {
    flex: 0 0 5rem;

    img {
      width: 5rem;
      height: 5rem;
      border-radius: 0.5rem;
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

  .ticket {
    margin-top: 0.75rem;
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

.good-content {
  text-align: left;

  .title {
    font-weight: bold;
  }
}

.spec_box {
  display: flex;
  flex-wrap: wrap;
  margin: 0.5rem 0 1rem 0;

  span {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0.1rem 0.4rem;
    display: inline-block;
    margin: 0.5rem 0.5rem 0 0;
    word-break: break-all;
  }

  .red {
    color: #f01818;
    border: 1px solid #f01818;
  }

  .gray {
    color: #999;
    background: #f6f6f6;
  }
}

.change-num {
  display: flex;
  text-align: left;

  input {
    border: none;
    outline: none;
  }
}

.cart {
  width: 5rem;
  height: 1.25rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;

  .input {
    width: 2rem;
    text-align: center;
    border: 1px solid #eee;
  }

  .del,
  .add {
    width: 1rem;
    display: inline-block;
  }
}

.car-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  color: #fff;

  div {
    flex: 1;
    padding: 0.5rem 0;
  }

  .orange {
    display: flex;
    flex-direction: column;
    background-color: #ffae00;
  }

  .change {
    background-color: #ff4e00;
  }
}

.pcStyle {
  left: 50%;
  transform: translateX(-50%);
}
</style>
