<template>
  <div>
    <c-title text="爱心公益">
      <template #edit>
        <div v-if="is_expend_member" class="link-expenditure" @click="toRecord">支出明细</div>
      </template>
    </c-title>
    <div id="public-welfare-fund">
      <div class="header-swipe">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" v-if="hasSwipeImage">
          <template v-for="(item, index) in swipers">
            <van-swipe-item v-if="item.thumb" :key="index" @click="jumpLink(item.link)">
              <img class="swiper-img" :src="item.thumb" alt="" />
            </van-swipe-item>
          </template>
        </van-swipe>
      </div>

      <div class="statistics-box">
        <div class="extension-money-box">
          <div class="extension-money-box-head">
            <div class="time-box">
              <span :class="{ active: activeDate == index }" v-for="(item, index) in dateList" :key="index" @click="changeDate(index)">{{ item }}</span>
            </div>

            <template v-if="is_expend_member">
              <div class="asset-line"></div>
              <div class="asset-right-box" @click="toDonations">
                <i class="iconfont icon-fontclass-shouru"></i>
                <span>公益支出</span>
              </div>
            </template>
          </div>
          <div class="extension-money-box-body">
            <div class="body-head">
              <div class="head-line"></div>
              <div class="head-circle"></div>
              <div class="head-line head-line-right"></div>
            </div>
            <div class="body-money" v-if="extension">
              <div class="body-money-item" v-for="(item, index) in extension" :key="index" @click="clickExtension(index)">
                <span class="money-top van-ellipsis">{{ item.value }}</span>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          <p class="tips">以上资金流向只作为公益使用，不得用于其他途径！</p>
        </div>
      </div>

      <div class="eChats-box">
        <van-tabs v-model="charts_type">
          <van-tab title="公益收益" name="1"></van-tab>
          <van-tab title="公益支出" name="2"></van-tab>
        </van-tabs>
        <div v-show="charts_type === '1'">
          <echarts-income-bar :income="chartsData.income"></echarts-income-bar>
        </div>
        <div v-show="charts_type === '2'">
          <echarts-expend-pie :expend="chartsData.expend"></echarts-expend-pie>
        </div>
      </div>

      <div class="list-box" ref="list-box">
        <van-tabs v-model="listType" @change="changeListType">
          <van-tab title="公益人员" name="0"></van-tab>
          <van-tab title="公益支出" name="2"></van-tab>
          <van-tab title="公益订单" name="1"></van-tab>
        </van-tabs>

        <van-list class="list" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="loadMore">
          <personnel-list v-if="listType == 0" :personnelList="personnelList" @clickItem="scrollAnchor('1')"></personnel-list>
          <expenditure-list v-if="listType == 2" :expendList="expendList"></expenditure-list>
          <order-list v-if="listType == 1" :orderList="orderList"></order-list>
        </van-list>

        <!-- <div >

        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import echartsIncomeBar from "./components/echatrs_income_bar";
import echartsExpendPie from "./components/echatrs_expend_pie";

import personnelList from "./components/personnelList.vue";
import expenditureList from "./components/expenditureList.vue";
import orderList from "./components/orderList.vue";
export default {
  data() {
    return {
      charts_type: "1",
      listType: "0",
      activeDate: "0",
      dateList: ["全部", "今日", "昨日", "本周", "上周", "本月"],

      finished: false,
      loading: false,
      page: 1,

      is_expend_member: "",
      swipers: {},
      extension: {},
      chartsData: {},

      personnelList: [],
      expendList: [],
      orderList: []
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      $http
        .get(
          "plugin.public-fund.frontend.controllers.fund.index",
          {
            page: 1,
            date_type: this.activeDate
          },
          "loading"
        )
        .then(res => {
          if (res.result != 1) {
            this.$totas(res.msg);
          }
          let data = res.data;
          let { is_expend_member, set, head, middle, bottom } = data;
          this.is_expend_member = is_expend_member;
          this.swipers = set;
          this.extension = head;
          this.chartsData = middle;
          this.personnelList = bottom.fund_human_list.data;
          let bottomData = bottom.fund_human_list;
          if (bottomData.current_page >= bottomData.last_page || bottomData.data.length < bottomData.per_page) {
            this.finished = true;
          }
        });
    },

    changeDate(index) {
      if (index == this.activeDate) return;
      this.activeDate = index;
      this.initLoad();
      if (this.listType == 0) {
        this.getData();
      } else {
        this.getData();
        this.getOrderData(this.listType);
      }
    },

    clickExtension(key) {
      if (key == "amount_total" || key == "order_total") {
        this.scrollAnchor("1");
      } else if (key == "surplus_amount_total") {
        this.$router.push(this.fun.getUrl("welfareRecord", { type: 2 }));
      } else if (key == "expend_amount_total" || key == "expend_times_total") {
        this.scrollAnchor("2");
      } else if (key == "member_total") {
        this.scrollAnchor("0");
      }
    },

    scrollAnchor(index) {
      let scrollBackcall = () => {
        let target = this.$refs["list-box"];
        window.scrollTo({
          top: target.offsetTop,
          behavior: "smooth"
        });
        // target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      };

      if (this.listType != index) {
        console.log("设置了");
        this.listType = index;
        this.changeListType(scrollBackcall);
      } else {
        scrollBackcall();
      }
    },

    toRecord() {
      this.$router.push(this.fun.getUrl("welfareRecord", { type: 1 }));
    },

    toDonations() {
      this.$router.push(this.fun.getUrl("welfareDonations"));
    },

    changeListType(scrollBackcall) {
      this.initLoad();

      if (this.listType == 0) {
        this.getPersonnelData(scrollBackcall);
      } else {
        console.log(this.listType);
        this.getOrderData(this.listType, scrollBackcall);
      }
    },

    // 公益人员列表
    getPersonnelData(scrollBackcall) {
      if (this.finished || this.loading) {
        return false;
      }
      this.loading = true;
      $http
        .get(
          "plugin.public-fund.frontend.controllers.fund.index",
          {
            page: this.page,
            date_type: this.activeDate
          },
          "loading"
        )
        .then(res => {
          this.loading = false;
          if (res.result != 1) {
            this.$totas(res.msg);
          }
          let { bottom } = res.data;
          let data = bottom.fund_human_list;
          if (data.current_page >= data.last_page || data.data.length < data.per_page) {
            this.finished = true;
          }
          this.personnelList = this.page > 1 ? this.personnelList.concat(data.data) : data.data;
          this.page++;

          typeof scrollBackcall === "function" ? scrollBackcall() : "";
        });
    },

    // 公益支出，公益订单
    getOrderData(changeType, scrollBackcall) {
      if (this.finished || this.loading) {
        return false;
      }
      this.loading = true;
      $http
        .get(
          "plugin.public-fund.frontend.controllers.fund.amountList",
          {
            page: this.page,
            date_type: this.activeDate,
            change_type: changeType
          },
          "loading"
        )
        .then(res => {
          this.loading = false;
          if (res.result != 1) {
            this.$totas(res.msg);
          }
          let data = res.data.list;
          if (data.current_page >= data.last_page || data.data.length < data.per_page) {
            this.finished = true;
          }
          if (changeType == 1) {
            this.orderList = this.page > 1 ? this.orderList.concat(data.data) : data.data;
          } else {
            this.expendList = this.page > 1 ? this.expendList.concat(data.data) : data.data;
          }
          this.page++;
          typeof scrollBackcall === "function" ? scrollBackcall() : "";
        });
    },

    loadMore() {
      if (this.listType == 0) {
        this.getPersonnelData();
      } else {
        this.getOrderData(this.listType);
      }
    },

    jumpLink(link) {
      if (!link) {
        return false;
      }
      window.location.href = link;
    },

    initLoad() {
      this.page = 1;
      this.finished = false;
      this.loading = false;
    }
  },

  computed: {
    hasSwipeImage() {
      let isEmpty = this.swipers ? Object.values(this.swipers).some(item => item.thumb) : false;
      return isEmpty;
    }
  },

  components: {
    echartsIncomeBar,
    echartsExpendPie,
    personnelList,
    expenditureList,
    orderList
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.link-expenditure {
  font-size: 0.85rem;
  color: #363636;
  text-align: right;
  font-weight: bold;
  padding: 1rem;
  // background-color: #ffffff;
}
#public-welfare-fund {
  --color: #fde074;
  scroll-behavior: smooth;
  .header-swipe {
    .my-swipe {
      height: 12.365rem;
      background-color: #959595;
    }

    .swiper-img {
      width: 100%;
    }
  }

  .statistics-box {
    padding: 1rem;
    color: #382c0a;
    background-color: #fff;
  }

  .statistics-box,
  .eChats-box {
    background-color: #fff;
    border-radius: 10px;
    margin: 0.625rem;
    padding: 10px;
  }

  .extension-money-box {
    background-color: #fff;
    border-radius: 0.625rem;
    .extension-money-box-head {
      display: flex;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
    }

    .time-box {
      width: 80%;
      color: #cb5701;
      display: flex;
      align-items: center;
      overflow-x: scroll;

      span {
        word-break: keep-all;
        margin: 0 8px;
        font-size: 12px;
      }

      .active {
        background-color: var(--color);
        border-radius: 12px;
        color: #333;
        padding: 3px 10px;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .asset-line {
      width: 2px;
      background-color: #d4d4d4;
      background-image: radial-gradient(#d4d4d4 5%, #fff 80%, #fff 15%);
    }

    .asset-right-box {
      width: 22%;
      display: flex;
      flex-direction: column;
      font-size: 12px;

      .icon-fontclass-shouru {
        font-size: 26px;
        color: #f15353;
      }

      span {
        color: #757272;
      }
    }

    .body-head {
      margin-top: 10px;
      display: flex;
      justify-content: center;

      .head-circle {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: var(--color);
      }

      .head-line {
        width: 2px;
        height: 20px;
        background-color: rgba(255, 193, 30, 0.1);
        transform: rotate(45deg);
      }

      .head-line-right {
        transform: rotate(-45deg);
      }
    }

    .body-money {
      margin-top: -3px;
      background-color: #fff4e9;
      border-radius: 5px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px;

      .body-money-item {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        width: 33.3333%;
        padding: 4px 4px 12px 4px;

        .money-top {
          font-weight: bold;
          font-size: 15px;
          margin-bottom: 5px;
        }
      }
    }

    .tips {
      text-align: left;
      font-size: 12px;
      color: #eb8c2d;
      margin-top: 10px;
    }
  }

  .eChats-box {
    padding: 0.625rem;
  }

  .list-box {
    margin: 0.625rem;
    padding-bottom: 3rem;
  }
  /deep/ .van-tabs {
    .van-tabs__wrap {
      width: 18rem;
      height: 39px;
      margin: 0 auto;
      border-radius: 0.469rem;
    }
    .van-tabs__nav {
      background-color: #e9e9e9;
    }

    .van-tab__text {
      color: #6f6f6f;
      font-weight: bold;
    }

    .van-tab--active {
      background-color: #fde074;
    }

    .van-tab--active > .van-tab__text {
      color: #cb5701;
    }

    .van-tabs__line {
      display: none;
    }
  }
}
</style>
