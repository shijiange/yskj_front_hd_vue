<template>
  <div id="superior">
    <c-title :hide="false" :text="custom_name"></c-title>
    <div class="r_top_box">
      <div class="image">
        <img :src="info.avatar" alt="" />
      </div>
      <div>
        <div class="r_top_box_name">{{ info.nickname }}</div>
        <div class="r_top_box_leve" v-if="info.level_name">{{ info.level_name }}</div>
      </div>
    </div>
    <div class="r_je">
      <div class="r_je_d">
        <span class="r_je_m">{{ acount0.total }}元</span>
        <span class="r_je_txt">{{ acount0.state_name }}金额</span>
      </div>
      <div class="r_je_d">
        <span class="r_je_m">{{ acount1.total }}元</span>
        <span class="r_je_txt">{{ acount1.state_name }}金额</span>
      </div>
    </div>
    <div class="line"></div>
    <van-tabs v-model="active" @change='tabChange'>
      <van-tab title="全部"></van-tab>
      <van-tab title="未结算"></van-tab>
      <van-tab title="已结算"></van-tab>
    </van-tabs>
    <div v-for="(item,index) in list" :key="index" @click="show(index)">
      <div class="r_ls">
        <div class="r_ls_r" style="text-align: left;">
          <span class="r_li_o">订单号：{{item.order_sn}}</span>
          <span class="r_li_t">时间：{{item.created_at}}</span>
        </div>
        <div class="r_ls_r" style="text-align: right;">
          <span class="r_li_m">{{item.reward_money}}</span>
          <span class="r_li_s">{{item.state_name}}</span>
        </div>
      </div>
      <div v-show="index == ind">
        <div class="s_box">
          <div class="s_box_i">
            <img :src="item.avatar" alt="" />
          </div>
          <div class="s_box_t">{{item.nickname}}</div>
        </div>
        <div class="s_shop">
          <div class="s_shop_i">
            <img :src="item.goods_thumb" alt="" />
          </div>
          <div class="s_shop_r">
            <div>{{item.goods_title}}</div>
            <div>实付 {{ $i18n.t('money') }}{{item.goods_price}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="list.length == 0" style="font-size: 16px; color: #6666; text-align: center; padding-top: 2rem;">没有数据</div>
  </div>
</template>
<script>
import superior_controller from './superior_controller';
export default superior_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#superior {
  width: 100%;
  height: 100vh;
  background: #fff;

  .s_shop {
    height: 5.97rem;
    margin: 0 0.94rem;
    background-color: #fff;
    border-bottom: 0.06rem solid #ebebeb;
    display: flex;
    align-items: center;

    .s_shop_i {
      width: 4.38rem;
      height: 4.38rem;
      background-color: #666;
      margin-right: 0.66rem;

      img {
        width: 4.38rem;
        height: 4.38rem;
      }
    }

    .s_shop_r {
      width: 12.19rem;
      text-align: left;
      height: 4.38rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .s_box {
    height: 4rem;
    margin: 0 0.94rem;
    background-color: #fff;
    border-bottom: 0.06rem solid #ebebeb;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .s_box_t {
      margin-bottom: 1.3rem;
      margin-left: 0.53rem;
    }

    .s_box_i {
      width: 2.5rem;
      height: 2.5rem;
      background-color: #f2f2f2;
      border-radius: 1.25rem;

      img {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 1.25rem;
      }
    }
  }

  .r_ls {
    height: 3.84rem;
    margin: 0 0.94rem;
    background-color: #fff;
    border-bottom: 0.06rem solid #ebebeb;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .r_ls_r {
      display: flex;
      flex-direction: column;

      .r_li_o {
        font-size: 0.75rem;
        color: #333;
      }

      .r_li_t {
        font-size: 0.81rem;
        color: #8c8c8c;
      }

      .r_li_m {
        font-size: 1rem;
        color: #f15353;
      }

      .r_li_s {
        font-size: 0.75rem;
        color: #8c8c8c;
      }
    }
  }

  .line {
    width: 100%;
    height: 0.63rem;
  }

  .r_je {
    width: 100%;
    height: 5.38rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #fff;

    .r_je_d {
      display: flex;
      flex-direction: column;

      .r_je_m {
        font-size: 1rem;
        color: #f15353;
      }

      .r_je_txt {
        font-size: 0.88rem;
        color: #8c8c8c;
      }
    }
  }

  .r_top_box {
    width: 100%;
    height: 6.66rem;
    background-color: #ee2e2b;
    padding: 1.69rem 1.56rem 2.09rem 1.56rem;
    display: flex;
    align-items: center;

    .image {
      width: 2.88rem;
      height: 2.88rem;
      margin-right: 0.69rem;

      img {
        width: 2.88rem;
        height: 2.88rem;
        background-color: #000;
        border-radius: 50%;
      }
    }

    .r_top_box_name {
      font-size: 1rem;
      color: #fff;
      text-align: left;
    }

    .r_top_box_leve {
      background-color: rgba(255, 255, 255, 0.29);
      padding: 5px;
      border-radius: 0.63rem;
      font-size: 0.75rem;
      color: #fff;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
