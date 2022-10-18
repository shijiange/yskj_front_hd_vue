<template>
  <div class="credit-index">
    <c-title :hide="false" :text="'信用值'">
    </c-title>
    <div class="view-detail" ><span @click="toDetail">查看明细</span></div>
    <div class="containe">
      <div class="top-cards">
        <div class="card">
          <div class="value">{{memberInfo.znb?memberInfo.znb:0 }}</div>
          <div class="name">中南呗</div>
          <p class="znb-tip">兑换余额比例 1:0.84</p>
        </div>
        <div class="card">
          <div class="value">{{memberInfo.credit_inventory?memberInfo.credit_inventory:0}}</div>
          <div class="name">信用值</div>
        </div>
        <div class="card" v-if="is_show">
          <div class="value">{{memberInfo.stock||0}}</div>
          <div class="name">库存信用值</div>
        </div>
      </div>
      <div class="list">
        <van-cell class="item" v-if="is_show" title="缴纳服务费" is-link :to="fun.getUrl('creditRecharge')">
          <template #icon>
             <i class="iconfont icon-fontclass-jiaona icon"></i>
          </template>
        </van-cell>
        <van-cell class="item" v-if="is_show" title="赠送" is-link :to="fun.getUrl('creditGive')">
          <template #icon>
             <i class="iconfont icon-fontclass-zengsong icon"></i>
          </template>
        </van-cell>
        <van-cell class="item" title="激活记录" is-link :to="fun.getUrl('activateHistory')">
          <template #icon>
             <i class="iconfont icon-fontclass-jilu1 icon"></i>
          </template>
        </van-cell>
        <van-cell class="item" title="赠送记录" is-link :to="fun.getUrl('giveHistory')">
          <template #icon>
             <i class="iconfont icon-fontclass-jilu2 icon"></i>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import cTitle from "components/title";

export default {
  data() {
    return {
      memberInfo: {},
      is_show: false,
    };
  },
  activated () {
    this.getData();
  },
  methods: {
    async getData () {
      let res = await $http.post(
        "plugin.credit-inventory.frontend.controllers.center.index",
        {},
        "加载中..."
      );
      if (res.result === 0) {
        Toast(res.msg);
        return;
      }
      this.memberInfo = res.data.member;
      this.is_show = res.data.is_show;
    },


    toDetail () {
      this.$router.push(this.fun.getUrl("viewDetails"));
    }
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .credit-index {
    box-sizing: border-box;
    padding-left: 1rem;
    background-color: #fff;
  }

  .view-detail {
    width: 100%;
    height: 3rem;
    text-align: right;
    padding-right: 1rem;
    font-size: 14px;
    line-height: 3rem;
    color: #666;
  }

  .top-cards .card {
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    min-height: 3rem;
    margin-right: 1rem;
    text-align: left;
    padding: 5px 5px 5px 10px;
    border-radius: 10px;
  }

  .card:nth-child(1) {
    background-color: #eaf0fe;
  }

  .card:nth-child(2) {
    background-color: #fff8ee;
  }

  .card:nth-child(3) {
    background-color: #fbf4f5;
  }

  .card .value {
    font-size: 15px;
    font-weight: bold;
    color: #f14e4e;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card .name {
    font-size: 13px;
    font-weight: normal;
    color: #228efa;
  }

  .card .proportion {
    font-size: 10px;
    color: #767c88;
  }

  .znb-tip {
    margin-top: 0.2rem;
    text-align: left;
    font-size: 12px;
    color: #70777d;
  }

  .icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }

  .list {
    text-align: left;
    margin-top: 30px;
  }

  .list .item {
    padding-left: 0;
  }
</style>