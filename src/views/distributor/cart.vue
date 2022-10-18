<!-- 渠道商没有租赁商品，只能是平台或供应商商品，js可删除租赁 -->
<template>
  <div class="cart" id="cart" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyleCart' : '']">
    <c-title :hide="false" text="购物车">
      <template slot="edit" v-if="isShowList">
        <div class="to-edit" @click="onCartDelete">
          {{ !cartDelete ? "编辑" : "完成" }}
        </div>
      </template>
    </c-title>

    <div class="cart_main" v-if="isShowList" style="margin: 0;">
      <van-checkbox-group v-model="checkList" @change="allSelectHandle">
        <div class="cart_good" v-for="(good, index) in goods" v-if="good.goods" @click.stop="selectBolfun(0)" :key="index">
          <div class="ico" v-show="edit">
            <i class="fa fa-trash-o"></i>
          </div>
          <van-checkbox checked-color="#f15353" :key="good" :name="good" @change="selectGood" :disabled="isbuhuo && good.total < good.replenish_number ? true : false">&nbsp;</van-checkbox>
          <div class="right">
            <div class="img">
              <img :src="good.goods.thumb" />
            </div>
            <div class="info">
              <ul class="inner">
                <h1 class="name" style="-webkit-box-orient: vertical;">
                  {{ good.goods.title | escapeTitle }}
                </h1>
                <li class="introduction" style="margin: 0;">{{ good.option_str }}</li>
                <li class="introduction" style="margin: 0; color: #ff4949; text-align: right;" v-if="isbuhuo && good.total < good.replenish_number">最少补货量：{{ good.replenish_number }}</li>
              </ul>
              <div class="other">
                <div class="price">
                  {{ $i18n.t("money") }}<span>{{ good.goods.price }}</span>
                </div>
                <div class="num">
                  <div class="leftnav" @click.stop="numberLeft(index)">
                    -
                  </div>
                  <!-- <input type="number"
                             class="shownum"
                             v-model.lazy="good.total"
                             @blur="changeCount(good.id, good.total, index)" /> -->
                  <input type="number" class="shownum" v-model.lazy="good.total" @focus="getActiveOldTotal(index)" @keyup="getActiveNewTotal" ref="tcInput" />
                  <div class="rightnav" @click.stop="numberRight(index)">
                    +
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-checkbox-group>
      <div class="cart_pay" v-show="!cartDelete">
        <div class="all" sel="1">
          <div class="checkall" @click.stop="selectBolfun(1)">
            <van-checkbox checked-color="#f15353" v-model="checkAll" :checked="checkAll" name="全选" @change="allSelect">全选</van-checkbox>
            <span class="t"></span>
          </div>
        </div>
        <ul class="text">
          <li class="freight">
            <span style="color: #999; font-size: 12px;">(不含运费)</span>
          </li>
          <li>
            合计：<span style="font-size: 14px; color: #f15353;">{{ $i18n.t("money") }}</span
            ><span class="totalprice">{{ total }}</span>
          </li>
        </ul>
        <div class="paysub " @click="submitGoods">
          结算<small class="total" style="font-size: 12px;">({{ count }})</small>
        </div>
      </div>
    </div>
    <div class="cart_del" v-show="cartDelete">
      <div class="checkall" @click.stop="selectBolfun(1)">
        <van-checkbox checked-color="#f15353" v-model="checkAll" :checked="checkAll" name="全选" @change="allSelect">全选 </van-checkbox>
      </div>
      <span @click="deleteGoods">删除</span>
    </div>
    <div id="nocard" v-if="!isShowList">
      <div class="card_no">
        <img src="../../assets/images/cart.png" style="width: 6.25rem; height: 6.25rem;" alt="购物车" />
        <!--<i class="fa fa-shopping-cart" style="font-size:6.25rem;"></i>-->
        <br /><span style="line-height: 1.125rem; font-size: 16px;">购物车快饿瘪了</span> <br />主人快去给我找点东西吧
      </div>
      <div class="card_no_menu">
        <router-link :to="fun.getUrl('member', {})">
          <div class="card_no_nav">个人中心</div>
        </router-link>
        <router-link :to="fun.getUrl('home', {})">
          <div class="card_no_nav togo">去逛逛</div>
        </router-link>
      </div>
    </div>

    <div style="height: 6.13rem;"></div>
  </div>
</template>

<script>
import cart from "./cart_controller";
export default cart;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/cart.scss";

.cart_main {
  background: #fff;
  padding: 0.875rem;

  .cart_good {
    padding-bottom: 0.75rem;
  }
}

.cart_pay,
.cart_del {
  bottom: 0 !important;
}
</style>
