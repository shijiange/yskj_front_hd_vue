<template>
  <div id="distributor">
    <c-title :hide="false" :text="'我的下线客户'"> </c-title>
    <ul class="client-box">
      <li>
        <p class="word">
          客户数量<em style="font-size: 10px; color: #999;">(一、二级客户代理商数量)</em> {{ child_agent_count }}人
        </p>
        <van-progress :show-pivot="false" color="#f21010" stroke-width="8" :percentage="child_agent_count_percentage" />
      </li>
      <li>
        <p class="word">
          订单金额<em style="font-size: 10px; color: #999;"
            >(一、二级客户里代理商订单金额（指客户里面代理商的订货和补货的订单金额累加))</em
          >
          {{ child_order_price }}{{ $i18n.t('元') }}
        </p>
        <van-progress :show-pivot="false" color="#f21010" stroke-width="8" :percentage="child_order_price_percentage" />
      </li>
      <li>
        <p class="word">
          订单数量<em style="font-size: 10px; color: #999;"
            >(一、二级客户里代理商订单数量（指客户里代理商的订货和补货的订单数量))</em
          >
          {{ child_order_count }}单
        </p>
        <van-progress :show-pivot="false" color="#f21010" stroke-width="8" :percentage="child_order_count_percentage" />
      </li>
    </ul>

    <div>
      <p class="title">我的客户</p>
      <!-- <div class="member-box">
            <div class="member-item" v-for="(item, index) in info" :key="index">
              <div style="display: flex">
                <div class="left">
                  <img
                    :src="item.member?item.member.avatar_image:''"
                    alt="">
                </div>
                <div class="right">
                  <p class="name">
                    {{item.member?item.member.nickname:''}}
                  </p>
                </div>
              </div>
              <div class="stock">
                <p><em>{{item.stock_count}}</em><span>库存(件)</span></p>
                <p><em>{{item.order_count}}</em><span>订单数(个)</span></p>
                <p><em>{{item.order_price_total}}</em><span>订单总额(元)</span></p>
              </div>
            </div>
            <img v-if="fun.isTextEmpty(info)" src="../../assets/images/blank.png" alt="" style="width:5rem;margin:2rem auto;display: block;">
          </div> -->
      <van-tabs v-model="active" animated swipeable sticky @click="getData">
        <van-tab title="直推客户">
          <div class="member-box">
            <div class="member-item" v-for="(item, index) in info" :key="index">
              <div style="display: flex;">
                <div class="left">
                  <img :src="item.member ? item.member.avatar_image : ''" alt="" />
                </div>
                <div class="right">
                  <p class="name">
                    {{ item.member ? item.member.nickname : '' }}
                  </p>
                </div>
              </div>
              <div class="stock">
                <p>
                  <em>{{ item.stock_count }}</em
                  ><span>库存(件)</span>
                </p>
                <p>
                  <em>{{ item.order_count }}</em
                  ><span>订单数(个)</span>
                </p>
                <p>
                  <em>{{ item.order_price_total }}</em
                  ><span>订单总额({{ $i18n.t('元') }})</span>
                </p>
              </div>
            </div>
            <img
              v-if="fun.isTextEmpty(info)"
              src="../../assets/images/blank.png"
              alt=""
              style="width: 5rem; margin: 2rem auto; display: block;"
            />
          </div>
        </van-tab>
        <van-tab title="间推客户">
          <div class="member-box">
            <div class="member-item" v-for="(item, index) in info" :key="index">
              <div style="display: flex;">
                <div class="left">
                  <img :src="item.member ? item.member.avatar_image : ''" alt="" />
                </div>
                <div class="right">
                  <p class="name">
                    {{ item.member ? item.member.nickname : '' }}
                  </p>
                </div>
              </div>
              <div class="stock">
                <p>
                  <em>{{ item.stock_count }}</em
                  ><span>库存(件)</span>
                </p>
                <p>
                  <em>{{ item.order_count }}</em
                  ><span>订单数(个)</span>
                </p>
                <p>
                  <em>{{ item.order_price_total }}</em
                  ><span>订单总额({{ $i18n.t('元') }})</span>
                </p>
              </div>
            </div>
            <img
              v-if="fun.isTextEmpty(info)"
              src="../../assets/images/blank.png"
              alt=""
              style="width: 5rem; margin: 2rem auto; display: block;"
            />
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import my_referrals_controller from './my_referrals_controller';

export default my_referrals_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#distributor {
  background: #fff;
  padding: 1rem;
  min-height: 100vh;
  text-align: left;
}

.client-box {
  li {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;

    .word {
      margin-bottom: 0.4rem;
    }
  }
}

.title {
  font-weight: bold;
  font-size: 18px;
  margin: 1rem 0 0.5rem 0;
}

.member-item {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #eee;
  padding: 0.5rem 0;

  .left {
    width: 3rem;

    img {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
  }

  .right {
    flex: 1;
    align-self: center;
    margin-left: 0.5rem;

    .name {
      font-weight: bold;
    }
  }

  .stock {
    display: flex;
    text-align: center;

    p {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    span {
      color: #999;
    }
  }
}
</style>
