<template>
  <div id="distributor">
    <c-title :hide="false" :text="'下单'"> </c-title>
    <div class="head-bg">
      <p style="font-weight: bold; font-size: 16px;">下单</p>
      <p>共{{ order_data.length }}件商品</p>
    </div>
    <div class="address-box" :class="{ 'PCstyle': fun.getPhoneEnv() == 3}" @click="showAddressFun">
      <div style="flex: 1;">
        <p class="name">
          <span>收件人:{{ realname }}</span> <span>{{ mobile }}</span>
        </p>
        <p class="address">地址：{{ address }}</p>
      </div>
      <div style="display: flex; align-self: center;">
        <i class="iconfont icon-advertise-next"></i>
      </div>
    </div>
    <div v-for="(item, index) in order_data" :key="index">
      <ul class="goods-box">
        <li v-for="(items, indexs) in item.order_goods" :key="indexs">
          <div class="left">
            <img :src="items.thumb" alt="" />
          </div>
          <div class="right">
            <p class="title">{{ items.title }}</p>
            <p class="bottom">
              <span class="stock">规格:{{ items.goods_option_title }}</span>
              <span class="number">x{{ items.total }}</span>
            </p>
          </div>
        </li>
      </ul>
      <div class="talk-box">
        <p class="title">留言</p>
        <input
          placeholder="50字以内（选填）"
          v-model.lazy="note[item.pre_id]"
          @change="noteHandle($event, item, note[item.pre_id])"
          maxlength="50"
          type="text"
          title=""
        />
      </div>
    </div>

    <div
      class="car-btn"
      :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }"
      :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
    >
      <div class="buy" @click="submit">确认下单</div>
    </div>
    <!-- 快递地址选择器 -->
    <yz-address-list v-model="showAddress" v-on:confirm="confirmSelectAddress"></yz-address-list>
    <!-- 快递地址选择器 end -->

  </div>
</template>

<script>
import place_order_controller from './place_order_controller';
export default place_order_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #distributor {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 100px;
  }

  .head-bg {
    background-image: url('../../assets/images/kc_orderbg@2x.png');
    background-repeat: no-repeat;
    background-size: contain;
    width: 100%;
    height: 6.25rem;
    color: #fff;
    text-align: left;
    padding: 1rem;
  }

  .address-box {
    width: 90%;
    min-height: 5.844rem;
    background-color: #fff;
    box-shadow: 0 0 0.563rem 0 rgba(120, 120, 120, 0.27);
    border-radius: 5px;
    position: absolute;
    top: 6.5rem;
    left: 5%;
    display: flex;
    text-align: left;
    padding: 0.7rem;

    .name {
      display: flex;
      margin-bottom: 0.5rem;
      font-weight: bold;

      span {
        flex: 1;
      }

      span:last-child {
        text-align: right;
      }
    }

    .icon-advertise-next {
      font-size: 24px;
      font-weight: bold;
      color: #999;
    }

    &.PCstyle {
      width: 375px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .goods-box {
    padding: 1rem;
    margin-top: 3.5rem;
    text-align: left;

    li {
      display: flex;
      margin-bottom: 0.5rem;

      .left {
        flex: 0 0 4rem;

        img {
          width: 4rem;
          height: 4rem;
          border-radius: 5px;
        }
      }

      .right {
        margin-left: 0.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0.2rem;
        justify-content: space-between;

        .title {
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .bottom {
          display: flex;
        }

        .stock {
          color: #9f9f9f;
          flex: 1;
        }

        .number {
          flex: 1;
          text-align: right;
        }
      }
    }
  }

  .talk-box {
    text-align: left;
    padding: 0 1rem 1rem;

    .title {
      font-weight: bold;
    }

    input {
      background-color: #f8f8f8;
      border: none;
      outline: none;
      width: 100%;
      height: 2rem;
      line-height: 2rem;
      margin-top: 0.5rem;
      padding: 0 0.5rem;
      border-radius: 5px;
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

    .buy {
      font-weight: bold;
      width: 5.125rem;
      height: 2rem;
      line-height: 2rem;
      background-image: linear-gradient(90deg, #f74c4c 0%, #f20b0b 100%), linear-gradient(#000, #000);
      background-blend-mode: normal, normal;
      border-radius: 1rem;
      color: #fff;
      margin-left: 75%;
    }
  }

  .add-info {
    overflow-y: scroll;
    width: 100%;
    background: #fff;
    max-height: 50vh;
    padding-top: 0.625rem;
  }

  input {
    border: none;
  }

  .text_adderss {
    background-color: #fff;

    input {
      text-wrap: unset;
      padding: 0.625rem 0.875rem;
      font-size: 14px;
      line-height: 1.5rem;
      width: 100%;
      min-height: 3.25rem;
    }
  }

  .pcStyle {
    left: 50%;
    transform: translateX(-50%);
  }

  .default-address {
    .van-cell {
      height: 50px;
      padding: 0 12px;

      .van-cell__title {
        text-align: left;
        flex: none;
      }

      .van-cell__value {
        input {
          width: 100%;
        }
      }
    }
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }

</style>
