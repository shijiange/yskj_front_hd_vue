<template>
  <div id="detailed">
    <c-title :hide="false" :text="orderType === 'store' || orderType === 'storeBalance' ? '我的提成' : `我的${this.fun.initWithdrawal()}`"></c-title>

    <ul class="today_bonus" v-if="orderType === 'store' || orderType === 'storeBalance'">
      <li v-for="(item, i) in ratioDatas" :key="i" :class="item.name">
        <span>{{ item.money }}</span>
        <br />
        <b>{{ item.data }}</b>
      </li>
      <li class="line">
        <div class="careat"></div>
      </li>
    </ul>

	<van-tabs v-model="selected" @click="swichTabTItem">
    <template v-if="orderType !== 'storeBalance'">
      <van-tab name="" title="全部" v-if="orderType !== 'store'"></van-tab>
      <van-tab name="3" title="全部" v-if="orderType === 'store'">全部 </van-tab>
      <van-tab name="0" :title="orderType !== 'store' ? '申请中' : '未结算' " ></van-tab>
      <van-tab name="1" :title="orderType !== 'store' ? '待打款' : '已结算'" ></van-tab>
      <van-tab name="2" title="已打款" v-if="orderType !== 'store'"></van-tab>
      <van-tab name="-1" :title="orderType == 'supplier' ? '驳回' : '已失效'" ></van-tab>
    </template>
    <template v-if="orderType === 'storeBalance'">
      <van-tab name="1" title="已结算"></van-tab>
      <van-tab name="2" title="已分账"></van-tab>
      <van-tab name="0" title="全部"></van-tab>
    </template>
      

    </van-tabs>
    <!-- <mt-loadmore v-if="goload"
                 :top-method="loadTop"
                 :bottom-method="loadBottom"
                 :bottom-all-loaded="allLoaded"
                 ref="loadmore"
                 bottomPullText=''
                 bottomDropText='上拉加载...'
                 bottomLoadingText=''
                 :autoFill='true'
                 id='olis'> -->
    <div>
      <div v-show="orderType === 'storeBalance'">
        <div v-for="(model, i) in allBalance" :key="i">
          <div class="tbs">
            <ul class="item2">
              <li>订单号：{{ model.sn }}</li>
              <li>{{ model.created_at }}</li>
            </ul>
            <div class="item3">
              <span class="red">提成+{{ model.amount }}</span>
              <p>{{ model.status_name }}</p>
            </div>
          </div>
        </div>
      </div>
    <!-- <mt-tab-container v-model="selected"> -->
      <div v-show="selected==3">
      <!-- <mt-tab-container-item id="3"> -->
        <div v-for="(model, i) in all" :key="i">
          <!--<router-link v-for="model in all" :to="fun.getUrl('presentationDetails',{ record_id: model.id })">-->
          <div class="tbs">
            <ul class="item2">
              <li>订单号：{{ model.order_sn }}</li>
              <li>{{ model.created_at }}</li>
            </ul>
            <div class="item3">
              <span class="red">提成+{{ model.amount }}</span>
              <p>{{ model.settlement }}</p>
            </div>
          </div>
          <!--</router-link>-->
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==''">
      <!-- <mt-tab-container-item id=""> -->
        <div v-if="orderType === 'supplier'">
          <!--供应商的提现记录-->
          <div v-for="(model, i) in all" :key="i">
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.apply_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ $i18n.t('money') }}{{ model.apply_money }}</span>
                <p v-if="orderType === 'supplier'">{{ model.status_obj.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="orderType === 'extension'">
          <router-link
            v-for="(model, i) in all"
            :key="i"
            :to="fun.getUrl('presentationDetails', { record_id: model.id })"
          >
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.type_name }}</li>
                <li>{{ $i18n.t('money') }}{{ model.amounts }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ model.status_name }}</span>
                <p>{{ model.created_at }}</p>
              </div>
            </div>
          </router-link>
        </div>

        <div v-if="orderType === 'store'">
          <div v-for="(model, i) in all" :key="i">
            <!--<router-link v-for="model in all" :to="fun.getUrl('presentationDetails',{ record_id: model.id })">-->
            <div class="tbs">
              <ul class="item2">
                <li>订单号：{{ model.order_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">提成+{{ model.amount }}</span>
                <p>{{ model.settlement }}</p>
              </div>
            </div>
          </div>
          <!--</router-link>-->
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==0">
      <!-- <mt-tab-container-item id="0"> -->
        <div v-if="orderType === 'supplier'">
          <!--供应商的提现记录-->
          <div v-for="(model, i) in review" :key="i">
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.apply_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ $i18n.t('money') }}{{ model.apply_money }}</span>
                <p v-if="orderType === 'supplier'">{{ model.status_obj.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="orderType === 'extension'">
          <router-link
            v-for="(model, i) in review"
            :key="i"
            :to="fun.getUrl('presentationDetails', { record_id: model.id })"
          >
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.type_name }}</li>
                <li>{{ $i18n.t('money') }}{{ model.amounts }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ model.status_name }}</span>
                <p>{{ model.created_at }}</p>
              </div>
            </div>
          </router-link>
        </div>

        <div v-if="orderType === 'store'">
          <div v-for="(model, i) in review" :key="i">
            <!--<router-link v-for="model in review" :to="fun.getUrl('presentationDetails',{ record_id: model.id})">-->
            <div class="tbs">
              <ul class="item2">
                <li>订单号：{{ model.order_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">提成+{{ model.amount }}</span>
                <p>{{ model.settlement }}</p>
              </div>
            </div>
            <!--</router-link>-->
          </div>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==1">
      <!-- <mt-tab-container-item id="1"> -->
        <div v-if="orderType === 'supplier'">
          <!--供应商的提现记录-->
          <div v-for="(model, i) in waitPay" :key="i">
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.apply_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ $i18n.t('money') }}{{ model.apply_money }}</span>
                <p v-if="orderType === 'supplier'">{{ model.status_obj.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="orderType === 'extension'">
          <router-link
            v-for="(model, i) in waitPay"
            :key="i"
            :to="fun.getUrl('presentationDetails', { record_id: model.id })"
          >
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.type_name }}</li>
                <li>{{ $i18n.t('money') }}{{ model.amounts }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ model.status_name }}</span>
                <p>{{ model.created_at }}</p>
              </div>
            </div>
          </router-link>
        </div>

        <div v-if="orderType === 'store'">
          <div v-for="(model, i) in waitPay" :key="i">
            <!--<router-link v-for="model in waitPay" :to="fun.getUrl('presentationDetails',{ record_id: model.id})">-->
            <div class="tbs">
              <ul class="item2">
                <li>订单号：{{ model.order_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">提成+{{ model.amount }}</span>
                <p>{{ model.settlement }}</p>
              </div>
            </div>
            <!--</router-link>-->
          </div>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==2">
      <!-- <mt-tab-container-item id="2"> -->
        <div v-if="orderType === 'supplier'">
          <!--供应商的提现记录-->
          <div v-for="(model, i) in pay" :key="i">
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.apply_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ $i18n.t('money') }}{{ model.apply_money }}</span>
                <p v-if="orderType === 'supplier'">{{ model.status_obj.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="orderType === 'extension'">
          <router-link
            v-for="(model, i) in pay"
            :key="i"
            :to="fun.getUrl('presentationDetails', { record_id: model.id })"
          >
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.type_name }}</li>
                <li>{{ $i18n.t('money') }}{{ model.amounts }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ model.status_name }}</span>
                <p>{{ model.created_at }}</p>
              </div>
            </div>
          </router-link>
        </div>

        <div v-if="orderType === 'store'">
          <div v-for="(model, i) in pay" :key="i">
            <!--<router-link v-for="model in pay" :to="fun.getUrl('presentationDetails',{ record_id: model.id})">-->
            <div class="tbs">
              <ul class="item2">
                <li>订单号：{{ model.order_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">提成+{{ model.amount }}</span>
                <p>{{ model.settlement }}</p>
              </div>
            </div>
            <!--</router-link>-->
          </div>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==-1">
      <!-- <mt-tab-container-item id="-1"> -->
        <div v-if="orderType === 'supplier'">
          <!--供应商的提现记录-->
          <div v-for="(model, i) in invalid" :key="i">
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.apply_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ $i18n.t('money') }}{{ model.apply_money }}</span>
                <p v-if="orderType === 'supplier'">{{ model.status_obj.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="orderType === 'extension'">
          <router-link
            v-for="(model, i) in invalid"
            :key="i"
            :to="fun.getUrl('presentationDetails', { record_id: model.id })"
          >
            <div class="tbs">
              <ul class="item2">
                <li>{{ model.type_name }}</li>
                <li>{{ $i18n.t('money') }}{{ model.amounts }}</li>
              </ul>
              <div class="item3">
                <span class="red">{{ model.status_name }}</span>
                <p>{{ model.created_at }}</p>
              </div>
            </div>
          </router-link>
        </div>

        <div v-if="orderType === 'store'">
          <div v-for="(model, i) in invalid" :key="i">
            <!--<router-link v-for="model in invalid" :to="fun.getUrl('presentationDetails',{ record_id: model.id})">-->
            <div class="tbs">
              <ul class="item2">
                <li>订单号：{{ model.order_sn }}</li>
                <li>{{ model.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="red">提成+{{ model.amount }}</span>
                <p>{{ model.settlement }}</p>
              </div>
            </div>
            <!--</router-link>-->
          </div>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
    <!-- </mt-tab-container> -->
    </div>
    <!-- </mt-loadmore> -->
  </div>
</template>
<script>
import member_income_presentationRecordcontroller from './member_income_presentationRecordcontroller';

export default member_income_presentationRecordcontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#detailed {
  .today_bonus {
    width: 100%;
    height: 5.125rem;
    margin-top: 0.625rem;
    background: #fff;
    padding: 1rem 0;
    box-sizing: border-box;
    position: relative;
    border-bottom: 0.0625rem solid #e2e2e2;

    li.line {
      position: absolute;
      width: 0.0625rem;
      height: 3.25rem;
      background: #e2e2e2;
      top: 1rem;
      right: 34%;

      .careat {
        width: 0.375rem;
        height: 0.375rem;
        border: 0.0625rem solid #ddd;
        border-left: 0;
        border-bottom: 0;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        background: #fff;
        position: absolute;
        top: 1.4375rem;
        right: -0.1875rem;
      }
    }

    li {
      text-align: center;
      float: left;

      span {
        font-size: 17px;
        line-height: 1.625rem;
        display: inline-block;
        margin-bottom: 0.625rem;
      }

      b {
        font-size: 11px;
        color: #333;
      }
    }

    li.data {
      width: 22%;

      span {
        color: #ffa800;
      }
    }

    li:first-child,
    li:nth-child(2) {
      border-right: 0.0625rem solid #e2e2e2;
    }

    li.mounth {
      width: 34%;

      span {
        color: #fc6a70;
      }
    }
  }

  a {
    color: #000;
  }

  .mint-navbar {
    margin-bottom: 0.125rem;
  }

  .mint-navbar .mint-tab-item {
    padding: 0.875rem 0;
  }

  .times {
    text-align: left;
    text-indent: 0.625rem;
    line-height: 2rem;
    background: #fff;
  }

  .tbs {
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0.625rem 0.875rem;
    border-bottom: 0.0625rem solid #ebebeb;
    font-size: 14px;

    .item2 {
      flex: 3;
      text-align: left;

      li {
        line-height: 1.875rem;
      }
    }

    .item3 {
      flex: 2;
      text-align: right;

      .red {
        color: red;
      }

      .green {
        color: green;
      }

      .yellow {
        color: yellow;
      }

      .reduce {
        color: #e51c23;
      }

      span {
        line-height: 1.875rem;
      }

      p {
        line-height: 1.875rem;
        color: #8c8c8c;
      }
    }
  }
}
</style>
