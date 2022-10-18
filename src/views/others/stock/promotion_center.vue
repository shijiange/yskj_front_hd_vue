<template>
  <div class="promotion-center">
    <c-title text="推广中心"></c-title>
    <van-tabs v-model="currentShowTabTypeId" @change="switchType">
      <van-tab title="走货奖励" name="1"></van-tab>
      <van-tab title="直推代理奖" name="2">
        <div class="tab-content">
          <d-list
            :loading="moreData.isLoading"
            :finished="moreData.loadFinished"
            @load="loadMoreData"
          >
            <ul>
              <li class="proxy-item" v-for="orderItem in orderList" :key="orderItem.id">
                <div class="proxy-header">
                  <img
                    :src="orderItem.avatar"
                    :alt="orderItem.nickname"
                    class="proxy-member-avatar"
                  />
                  <div class="proxy-order-info">
                    <div>
                      <span class="proxy-member-nickname">{{ orderItem.nickname }}</span>
                      <span class="proxy-order-amount" v-amount>{{ orderItem.award_amount }}</span>
                    </div>
                    <div class="proxy-order-info-footer">
                      <span class="proxy-member-level">{{ orderItem.level_name }}</span>
                      <span class="proxy-order-status">{{ orderItem.award_status_text }}</span>
                    </div>
                  </div>
                </div>
                <div class="proxy-order-time">{{ orderItem.created_at }}</div>
              </li>
            </ul>
          </d-list>
        </div>
      </van-tab>
      <van-tab title="直推奖" name="3"></van-tab>
      <van-tab title="平级奖" name="4"></van-tab>
    </van-tabs>
    <div class="tab-content" v-show="[1,3,4].includes(Number(currentShowTabTypeId))">
      <d-list :loading="moreData.isLoading" :finished="moreData.loadFinished" @load="loadMoreData">
        <ul class="order-list">
          <order-item v-for="orderItem in orderList" :key="orderItem.id" :data="orderItem" />
        </ul>
      </d-list>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs, Toast } from "vant";
import OrderItem from "@/components/member/stock/order_item.vue";
import DList from "@/components/dlist";

function getAwardStatusText(status) {
  switch (status) {
  case 1:
    return "未结算";
  case 2:
    return "已结算";
  case 3:
    return "失效";
  }
}

export default {
  beforeMount() {
    this.loadMoreData();
  },
  activated() {
    this.loadMoreData();
  },
  data() {
    return {
      orderList: [],
      moreData: { //* 加载更多
        page: 1, //* 当前页数
        loadFinished: false, //* 是否加载完成
        isLoading: false //* 是否加载中
      },
      currentShowTabTypeId: 0 //* tab的name记录
    };
  },
  directives: {
    amount: { //* 指令 先转成数值类型，然后保留两位小数点数字
      inserted(el) {
        el.innerText = Number(el.innerText).toFixed(2);
      }
    }
  },
  methods: {
    switchType() {
      this.moreData = {
        page: 1,
        loadFinished: false,
        isLoading: false
      };
      this.orderList = [];
      this.loadMoreData();
    },
    loadMoreData() {
      if (this.moreData.isLoading === true) {
        return;
      }
      this.moreData.isLoading = true;
      $http
        .get(
          "plugin.agency.api.award.get-list",
          {
            page: this.moreData.page,
            agency_type: this.currentShowTabTypeId
          },
          "加载中"
        )
        .then(({ data, result, msg }) => {
          if (result == 0) {
            Toast.fail(msg);
            this.$router.push(this.fun.getUrl("member"));
            return;
          }
          this.moreData.page++;
          if (data.last_page === this.moreData.page || data.data.length < data.per_page) {
            this.moreData.loadFinished = true;
          }
          let awards = data.data;
          for (const item of awards) {
            item["award_status_text"] = getAwardStatusText(item["award_status"]);
          }
          this.orderList.push(...awards);
          this.moreData.isLoading = false;
        });
    }
  },
  components: {
    VanTab: Tab,
    VanTabs: Tabs,
    OrderItem,
    DList
  }
};
</script>

<style scoped>
/* 改页面是子路由，引入了两次title组件 */
.promotion-center {
  /* margin-top: 0.625rem; */
  margin-top: -2rem;
}

.tab-content {
  padding: 0 0.9375rem;
  border-top: 1px solid #ebebeb;
  background-color: white;
}

/* 直推代理奖列表 */
.proxy-item {
  padding: 0.875rem 0;
  color: #f15353;
  border-bottom: 1px solid #ebebeb;
}

.proxy-item:last-child {
  border-bottom: none;
}

.proxy-header {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.proxy-member-avatar {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.proxy-order-info {
  flex-grow: 1;
  margin-left: 0.5rem;
}

.proxy-order-info div {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.proxy-order-info-footer {
  margin-top: 0.1875rem;
  font-size: 0.75rem;
}

.proxy-order-status {
  color: #8c8c8c;
}

.proxy-member-nickname {
  color: #333;
}

.proxy-order-amount {
  font-size: 0.9375rem;
}

.proxy-order-time {
  margin-top: 0.6563rem;
  font-size: 0.6875rem;
  color: #8c8c8c;
  text-align: left;
}

.proxy-order-time span {
  padding-left: 0.5938rem;
}

.proxy-order-status {
  margin-top: -0.25rem;
}

.goods-item {
  padding: 0.625rem 0;
}
</style>