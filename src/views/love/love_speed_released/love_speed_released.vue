<template>
  <div id="sppd_lease">
    <c-title :hide="false" :text="love_name + '加速池释放'" />
    <div class="speed-record-line">
      <van-tabs v-model="speed_type" @click="handleClick">
        <van-tab title="加速池" name="speed_pool"> </van-tab>
        <van-tab title="加速plus池" name="speed_plus_pool"></van-tab>
      </van-tabs>
    </div>
    <header class="header" v-if="speed_type == 'speed_pool'">
      <div class="title">待释放{{ love_name }}</div>
      <div class="amount ">{{ member_surplus ? member_surplus.toFixed(2) : 0 }}</div>
      <div class="header-btn">
        <van-button color="#F65958" @click="draw">领取释放{{ love_name }} </van-button>
        <div v-if="member_surplus == 0" class="play-shop main-c" @click="go_to_pay">购买商品保留权益></div>
      </div>
    </header>
    <header class="header" v-if="speed_type == 'speed_plus_pool'">
      <div class="title">累计收入</div>
      <div class="total_revenue ">{{ amount_total ? amount_total.toFixed(2) : 0 }}</div>
    </header>
    <div class="main">
      <van-tabs v-model="active" @change="changeHandle">
        <van-tab v-if="speed_type == 'speed_pool'" title="加速池记录" name="speed_pool_record"> </van-tab>
        <van-tab v-if="speed_type == 'speed_pool'" title="释放记录" name="released_rocord"></van-tab>
        <van-tab v-if="speed_type == 'speed_plus_pool'" title="收入明细" name="account_balance"> </van-tab>
      </van-tabs>
      <div v-if="speed_type == 'speed_pool' && active == 'speed_pool_record'" class="speed-record-wrapper">
        <ul class="speed-record">
          <li class="speed-pool-wrapper" v-for="(item, index) in speed_pool_record" :key="index">
            <div class="speed-pool-left">
              <span class="speed-pool-order-sn">{{ item.remark }}</span>
              <span class="speed-pool-created-at">{{ item.created_at }}</span>
            </div>
            <div class="speed-pool-right" :class="item.value.includes('-') ? 'spending' : 'success'">{{ item.value.includes("-") ? "" : "+" }}{{ item.value }}</div>
          </li>
        </ul>
      </div>
      <div v-if="speed_type == 'speed_pool' && active == 'released_rocord'">
        <ul class="lease-record-wrapper ">
          <li v-for="(item, index) in released_rocord.data" :key="index" class="lease-wrapper">
            <div class="lease-record-header">
              <p class="C-6A6A6A">{{ item.created_at }}</p>
              <p :class="item.status == 0 ? 'main-c' : 'sucess'">{{ item.status_name }}</p>
            </div>
            <ul class="lease-record-bootm">
              <li class="lease-record-bootm-left">
                <p>{{ item.love_name }}：{{ item.speed_pool_total }}</p>
                <p>激活比例：{{ item.ratio }}</p>
                <p>通证单价：{{ item.api_value }}</p>
                <p v-if="item.fee_ratio !== 0">手续费比例：{{ item.fee_ratio }}%</p>
              </li>
              <li>
                <p class="main-c">+{{ item.usable_love }}</p>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-if="active == 'account_balance'" class="speed-record-wrapper">
        <ul class="speed-record">
          <li class="speed-pool-wrapper" v-for="(item, index) in account_balance.data" :key="index">
            <div class="speed-pool-left">
              <span class="speed-pool-order-sn">{{ item.order_sn }}</span>
              <span class="speed-pool-created-at">订单金额：￥{{item.order_price}}</span>
              <span class="speed-pool-created-at">{{ item.created_at }}</span>
            </div>
            <div class="speed-plus-right">
              <p class="success">￥{{ item.amount }}</p>
              <p class="plus-ratio">plus池抽取比例：{{item.ratio}}%</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <van-overlay :show="show">
      <div class="wrapper" @click="close">
        <div class="block">
          <div class="draw">
            <span class="draw-icon">￥</span>
            <span class="draw-price"> {{ amount ? amount.toFixed(2) : 0 }}</span>
          </div>
          <img src="../../../assets/images/success@2x.png" class="success-img" />
          <div class="block-confirm">请点击确定领取释放的{{ love_name }}</div>
          <div class="success-btn" @click.stop="ToAdvertising">确认</div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin],
  data() {
    return {
      show: false, //遮罩层
      love_name: "",
      active: "speed_pool_record",
      amount: 0, //释放爱心值数量
      member_surplus: 0,
      isLoadMore: false,
      ad_link: "", //广告链接
      amount_total:0,//累计收入
      // 加速池记录
      speed_pool_record: {},
      //释放记录
      released_rocord: {},
      //plus池
      account_balance:{},
      //加速池类型
      speed_type: "speed_pool",
      total_revenue: 0,
      income: 0,
      highlight: ""
    };
  },
  activated() {
    this.initData(); //初始化数据
    this.getData(); //获取数据
  },
  methods: {
    draw() {
      if (this.member_surplus == 0) {
        Toast("暂无释放的爱心值可领取");
      } else {
        this.show = true;
      }
    },
    handleClick() {
      if (this.speed_type == "speed_pool") {
        this.$nextTick(() => {
          this.active = this.highlight;
        });
      }else if(this.speed_type == "speed_plus_pool"){
        this.highlight = this.active;
      }
    },
    initData() {
      this.isLoadMore = false;
      this.show = false;
      this.ad_link = "";
      this.amount = 0;
      this.member_surplus = 0;
    },
    close() {
      this.show = false;
    },
    getData() {
      //首页数据
      $http.get("plugin.love-speed-pool.frontend.home.index", { page: 1 }, "加载中").then(res => {
        this.isLoadMore = true;
        if (res.result == 1) {
          this.speed_pool_record = res.data.speed_pool_record;
          this.released_rocord = res.data.released_rocord;
          this.member_surplus = parseFloat(res.data.member_surplus);
          this.released_rocord.data.forEach(item => {
            item.love_name = res.data.love_name;
          });
        } else {
          Toast(res.msg);
        }
      });
      // 领取释放(获取数量);
      $http.get("plugin.love-speed-pool.frontend.receive.index", {}, "").then(res => {
        if (res.result == 1) {
          this.amount = parseFloat(res.data.amount);
          this.love_name = res.data.love_name;
          this.ad_link = res.data.ad_link;
        } else {
          Toast(res.msg);
        }
      });
      //加速plus池
      $http.get("plugin.love-speed-pool.frontend.plus.index", { page: 1 }, "加载中").then(res => {
        if (res.result == 1) {
          this.account_balance = res.data.list;
          this.amount_total =parseFloat(res.data.amount_total)
        } else {
          Toast(res.msg);
        }
      });
    },
    //领取释放爱心值
    ToAdvertising() {
      $http.get("plugin.love-speed-pool.frontend.receive.handle", {}, "加载中").then(res => {
        Toast(res.msg);
        window.location.href = this.ad_link;
      });
    },
    //购买商品保留权益>
    go_to_pay() {
      this.$router.push(this.fun.getUrl("search", {}, { CommodityRights: "CommodityRights" }));
    },
    getMoreData() {
      this.isLoadMore = false;
      if (this[this.active].current_page >= this[this.active].last_page) {
        return;
      } else {
        let url = '';
        if(this.speed_type == 'speed_plus_pool'){
          url="plugin.love-speed-pool.frontend.plus.index"
        }else{
          url = "plugin.love-speed-pool.frontend.home.index"
        }
        $http.get(url, { page: this[this.active].current_page + 1 }, "加载中").then(res => {
          this.isLoadMore = true;
          if (res.result == 1) {
            if(this.active == 'account_balance'){
              this.account_balance.data = this.account_balance.data.concat(res.data.list.data)
              this[this.active].current_page = res.data.list.current_page
            }else{
              this[this.active].data =  this[this.active].data.concat(res.data[this.active].data);
              this[this.active].current_page = res.data[this.active].current_page;
             this.active == "released_rocord" && this[this.active].data.forEach(item => (item.love_name = res.data.love_name));
            }
          } else {
            Toast(res.msg);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#sppd_lease {
  height: 100%;
  background-color: #fff;
  .plus-ratio {
    color: #5c5c5c;
    padding-top: 0.5rem;
    font-size: 0.6rem;
  }

  .total_revenue {
    margin-bottom: 0.928rem;
    font-size: 2rem;
    color: #f15353;
  }
  .speed-record {
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
  }
  .speed-pool-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 0.8rem;
    border-bottom: solid 0.1rem #ebebeb;
  }
  .speed-pool-order-sn {
    margin-bottom: 0.5rem;
  }
  .speed-pool-created-at {
    color: #5c5c5c;
    padding-bottom: 0.8rem;
    font-size: 0.6rem;
  }
  .speed-pool-left {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .draw {
    color: #f41100;
    position: absolute;
    left: 0;
    right: 0;
    top: 19%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    &-price {
      font-size: 2rem;
    }
    &-icon {
      position: relative;
      bottom: 4px;
    }
  }
  .block {
    position: relative;
    width: 20rem;
    margin: 0 2rem;
    .success-img {
      width: 100%;
    }
    .success-btn {
      width: 9rem;
      height: 2rem;
      position: absolute;
      left: 0;
      right: 0;
      top: 75%;
      margin: 0 auto;
      text-align: center;
      line-height: 2rem;
      background: linear-gradient(#ffe71f, #ffe71f);
      box-shadow: 0rem 0.3rem 0rem 0rem rgba(255, 148, 8, 0.8);
      border-radius: 1rem;
      color: #ff4e00;
    }
    &-confirm {
      position: absolute;
      top: 59%;
      right: 0;
      left: 0;
      text-align: center;
      color: #ffffff;
    }
  }
  .lease-wrapper {
    padding-top: 1rem;
    padding-bottom: 1.2rem;
    border-bottom: solid 0.825rem #ebebeb;
  }
  .C-6A6A6A {
    color: #6a6a6a;
  }
  .sucess {
    color: #478c57;
  }
  .lease-record-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eaeaea;
    padding: 0.1428rem 1.285rem 0.5rem;
  }
  .lease-record-bootm {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.392rem 1.285rem 0;
    text-align: left;
    &-left p {
      margin: 0.2785rem 0;
      color: #414141;
    }
  }
  .play-shop {
    padding-top: 0.908rem;
  }
  .time {
    color: #6a6a6a;
    font-size: 0.807rem;
  }
  .header {
    border-bottom: 0.825rem solid #ebebeb;
  }
  .title {
    padding-top: 1.5rem;
    padding-bottom: 1.2142rem;
  }
  .amount {
    font-size: 2rem;
    color: #f15353;
  }
  .van-button {
    margin-top: 0.928rem;
    width: 12.357rem;
    height: 2.928rem;
    border-radius: 0.35rem;
  }
  .main-c {
    color: #f65958;
  }
  .w-9 {
    width: 9rem;
  }
  .header-btn {
    padding-bottom: 2.428rem;
  }
  .lease-record-wrapper {
    background-color: #fff;
    padding-top: 1rem;
  }
  .success {
    color: #f15353;
  }
  .spending {
    color: #18873f;
  }
  .speed-record-line {
    border-bottom: 1px solid #ececec;
  }
  /deep/.van-tabs {
    border-bottom: 1px solid #ececec;
  }
  .speed-plus-right {
    text-align: right;
  }
}
</style>
