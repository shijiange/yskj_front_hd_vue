<template>
  <div class="store-manage-index">
    <c-title :hide="false" text="店铺助手"></c-title>
    <div>
      <div class="top-info">
        <div class="left-img">
          <img :src="memberInfo.avatar" alt="">
        </div>
        <div class="right-identity">
          <p class="nick-name overflow">{{memberInfo.nickname}}</p>
          <div class="admin">
            <i class="iconfont icon-fontclass-daili"></i>
            <span>管理员</span>
          </div>
        </div>
      </div>
      <div class="containe">
        <div class="tool-box">
          <router-link :to="fun.getUrl('storeGoodsManagement')" class="manage">
            <div class="icon-font yingyongshichang1">
              <i class="iconfont icon-fontclass-yingyongshichang1"></i>
            </div>
            <p>商品管理</p>
          </router-link>
          <router-link :to="fun.getUrl('orderlist', {status: '0',orderType: 'storeMang'})" class="manage">
            <div class="icon-font shangpindingdan"><i class="iconfont icon-fontclass-shangpindingdan"></i></div>
            <p>订单管理</p>
          </router-link>
          <router-link :to="fun.getUrl('memberManagement')" class="manage">
            <div class="icon-font fx_haoyou"><i class="iconfont icon-fx_haoyou"></i></div>
            <p>会员管理</p>
          </router-link>
          <router-link :to="fun.getUrl('financeManagement')" class="manage">
            <div class="icon-font fufeijilu"><i class="iconfont icon-fontclass-fufeijilu"></i></div>
            <p>财务管理</p>
          </router-link>
        </div>

        <div class="amount-statistics module-style">
          <div class="top">
            <div class="completion-amount">
              <p>成交额</p>
              <p class="num">{{statistics.turnover}}</p>
            </div>
            <div class="time-tab">
              <van-tabs v-model="active" type="card" color="#28b2fa" @change="changeTab">
                <van-tab :name="1" title="今日" title-class="tab"></van-tab>
                <van-tab :name="2" title="昨日" title-class="tab"></van-tab>
                <van-tab :name="0" title="全部" title-class="tab"></van-tab>
              </van-tabs>
            </div>
          </div>
          <div class="statistics">
            <div class="items">
              <p class="statistical-name">已支付订单数</p>
              <p class="statistical-num">{{statistics.pay_count ? statistics.pay_count : 0}}</p>
            </div>
            <div class="items">
              <p class="statistical-name">商品成交数</p>
              <p class="statistical-num">{{statistics.goods_total ? statistics.goods_total : 0}}</p>
            </div>
            <div class="items">
              <p class="statistical-name">支付人数</p>
              <p class="statistical-num">{{statistics.pay_member_count ? statistics.pay_member_count : 0}}</p>
            </div>
            <div class="items">
              <p class="statistical-name">下单人数</p>
              <p class="statistical-num">{{statistics.member_count ? statistics.member_count : 0}}</p>
            </div>
            <div class="items">
              <p class="statistical-name">新增会员数</p>
              <p class="statistical-num">{{statistics.new_member_count ? statistics.new_member_count : 0}}</p>
            </div>

          </div>
        </div>

        <div class="order-statistics module-style">
          <div class="title">数据统计</div>
          <div class="statistics">
            <div class="items">
              <p class="statistical-name">待发货订单</p>
              <p class="statistical-num">{{statistics.wait_send ? statistics.wait_send : 0}}</p>
            </div>
            <div class="items">
              <p class="statistical-name">待付款订单</p>
              <p class="statistical-num">{{statistics.wait_pay ? statistics.wait_pay : 0}}</p>
            </div>
            <div class="items">
              <p class="statistical-name">售后订单</p>
              <p class="statistical-num">{{statistics.refund_count ? statistics.refund_count : 0}}</p>
            </div>
            <div class="items">
              <p class="statistical-name">在售商品数</p>
              <p class="statistical-num">{{statistics.on_shelf ? statistics.on_shelf : 0}}</p>
            </div>
            <div class="items">
              <p class="statistical-name">下架商品数</p>
              <p class="statistical-num">{{statistics.un_shelf ? statistics.un_shelf : 0}}</p>
            </div>
          </div>
        </div>

        <div class="manage-box module-style">
          <div class="title">店铺管理</div>
           <div class="manage-tool">
             <router-link :to="fun.getUrl('storeGoodsCatgory')">
               <i class="iconfont icon-fontclass-yingyongzhongxin"></i>
               <p>商品分类</p>
             </router-link>
             <router-link :to="fun.getUrl('withdrawalList')">
               <i class="iconfont icon-ht_content_tixian"></i>
               <p>提现记录</p>
             </router-link>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      memberInfo: {},
      statistics: {},
      orderStatistics: [
        {name: "代发货订单", number: 56},
        {name: "待付款订单", number: 56},
        {name: "售后订单", number: 56},
        {name: "在售商品订单", number: 56},
        {name: "下架商品数", number: 56},
      ],
    };
  },
  activated () {
    this.getData();
  },

  methods: {
    getData () {
      $http.get("plugin.shop-assistant.frontend.index.index", {time_type: this.active}, 'loading')
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          if (response.data) {
            this.memberInfo = response.data.member;
            this.statistics = response.data.data;
          }
        });
    },
    changeTab () {
      this.getData();
    },
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.store-manage-index {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f6f6f6;
  overflow-y: auto;
  overflow-x: hidden;
  .top-info {
    display: flex;
    width: 100%;
    height: 20vh;
    padding: 1rem;
    background-image: linear-gradient(135deg, #384556 0%, #2a2d39 100%);
    .left-img {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background-color: #ffffff;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right-identity {
      flex: 1;
      width: 0;
      margin-left: 1rem;
      text-align: left;
      .nick-name {
        font-size: 1rem;
        color: #ffffff;
      }
      .admin {
        display: inline-block;
        margin-top: 0.625rem;
        background-image: linear-gradient(90deg, #ffe34a 0%, #ffd150 100%);
        border-radius: 0.325rem;
        padding: 0.15rem 1rem;
      }
    }
  }
  .containe {
    position: absolute;
    width: 100%;
    top: 18vh;
    left: 50%;
    padding: 1rem 1rem 2rem 1rem;
    transform: translateX(-50%);
    .tool-box {
      display: grid;
      grid-template-columns: repeat(4, 25%);
      background-color: #ffffff;
      padding: 1rem;
      border-radius: 0.5rem;
      .icon-font {
        display: inline-flex;
        align-items: flex-end;
        justify-content: center;
        width: 2.19rem;
        height: 2.19rem;
        margin-bottom: 0.5rem;
        background-color: #fdf4e2;
        border-radius: 50%;
        .iconfont{
          font-size: 1.27rem;
        }
      }
      .yingyongshichang1 {
        color: #f78433;
        background-color: #fdf4e2;
      }
      .shangpindingdan {
        color: #5db2f5;
        background-color: #eef7fe;
      }
      .fx_haoyou{
        color: #f56c6d;
        background-color: #feedee;
      }
      .fufeijilu {
        color: #9b8cf2;
        background-color: #f1effb;
      }
    }
    .module-style{
      margin-top: 0.63rem;
      background-color: #ffffff;
      padding: 0.825rem;
      border-radius: 0.5rem;
    }
    .amount-statistics, .order-statistics {
      .top {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
        .completion-amount {
          flex: 1;
          color: #555555;
          text-align: left;
          .num {
            margin-top: 0.8rem;
            font-size: 0.94rem;
            font-weight: bold;
            color: #232424;
            white-space: break-spaces;
            word-break: break-all;
          }
        }
        /deep/ .van-tabs__nav {
          width: 10rem;
          margin: 0;
        }
      }
      .statistics {
        display: grid;
        grid-template-columns: repeat(3, 33.33%);
        gap: 1rem;
        .statistical-name {
          font-size: 0.69rem;
          color: #3f3f3f;
        }
        .statistical-num {
          margin-top: 0.8rem;
          color: #232424;
          font-weight: bold;
          font-size: 0.94rem;
          white-space: break-spaces;
          word-break: break-all;
        }
      }
    }
    .order-statistics {
      .title {
        margin-bottom: 1rem;
        text-align: left;
        font-size: 1rem;
        font-weight: bold;
        color: #1c1c1c;
      }
    }
    .manage-box {
      .title {
        margin-bottom: 1rem;
        text-align: left;
        font-size: 1rem;
        font-weight: bold;
        color: #1c1c1c;
      }
      .manage-tool {
        display: grid;
        grid-template-columns: repeat(auto-fill, 6.5rem);
        .iconfont {
          display: inline-block;
          font-size: 1.27rem;
          margin-bottom: 0.5rem;
        }
        .icon-fontclass-yingyongzhongxin {
          color: #459df2;;
        }
        .icon-ht_content_tixian {
          color: #f9bb3e;
        }
      }
    }
  }
}
</style>