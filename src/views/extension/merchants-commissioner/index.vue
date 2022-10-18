<template>
  <div class="merchants-commissioner">
    <d-title :title="pageTitle"></d-title>
    <div class="header">
      <div class="header-member" v-if="memberInfo">
        <van-image round :src="memberInfo['avatar_image']" width="46" height="46"></van-image>
        <div class="header-member-nickname van-ellipsis">{{ memberInfo.nickname }}</div>
      </div>
      <div class="header-member-amount van-ellipsis">
        累计金额：
        <span>{{ cumulativeAmount }}</span>
      </div>
    </div>
    <van-tabs v-model="showDataType" @change="switchDataTabs">
      <van-tab title="全部" name="1">
        <d-list class="data-list" @load="loadData" :loading="allPagination.loading" :finished="allPagination.finished">
          <data-item class="data-item" v-for="dataItem in allData" :key="dataItem.order_sn" :data="dataItem"></data-item>
        </d-list>
      </van-tab>
      <van-tab title="自提点" name="2">
        <d-list class="data-list" @load="loadData" :loading="selfPickupPagination.loading" :finished="selfPickupPagination.finished">
          <data-item class="data-item" v-for="dataItem in selfPickupData" :key="dataItem.order_sn" :data="dataItem"></data-item>
        </d-list>
      </van-tab>
      <van-tab title="区域" name="3">
        <d-list class="data-list" @load="loadData" :loading="areaPagination.loading" :finished="areaPagination.finished">
          <data-item class="data-item" v-for="dataItem in areaData" :key="dataItem.order_sn" :data="dataItem"></data-item>
        </d-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import DTitle from "@/components/other/common/dtitle";
import DList from "@/components/dlist";
import { Image as VanImage } from "vant";
import dataItem from "./dataItem";
export default {
  data() {
    return {
      pageTitle: null,
      memberInfo: null,
      cumulativeAmount: 0,
      showDataType: "1",
      allData: [],
      allPagination: {
        page: 1,
        finished: false,
        loading: false
      },
      selfPickupData: [],
      selfPickupPagination: {
        page: 1,
        finished: false,
        loading: false
      },
      areaData: [],
      areaPagination: {
        page: 1,
        finished: false,
        loading: false
      }
    };
  },
  activated() {
    this.getMemberInfo();
    this.loadData();
  },
  methods: {
    getMemberInfo() {
      $http.get("plugin.invest-people.frontend.index.member-info").then(({ data: { member, grand_total_amount, plugin_name } }) => {
        this.memberInfo = member;
        this.cumulativeAmount = Number(grand_total_amount).toFixed(2);
        this.$set(this, "pageTitle", plugin_name);
        this.fun.setWXTitle(plugin_name);
      });
    },
    switchDataTabs() {
      switch (this.showDataType) {
      case "1":
        if (this.allData.length > 0) {
          return;
        }
        break;
      case "2":
        if (this.selfPickupData.length > 0) {
          return;
        }
        break;
      case "3":
        if (this.areaData.length > 0) {
          return;
        }
        break;
      }
      this.loadData();
    },
    loadData() {
      let bounsType = null;
      let typeData = this.allData;
      let typePagination = this.allPagination;
      switch (this.showDataType) {
      case "2":
        typeData = this.selfPickupData;
        typePagination = this.selfPickupPagination;
        bounsType = "packageDeliver";
        break;
      case "3":
        typeData = this.areaData;
        typePagination = this.areaPagination;
        bounsType = "areaDividend";
        break;
      }
      if (typePagination.loading || typePagination.finished) {
        return;
      }
      typePagination.loading = true;
      this.getDividendData(bounsType, {
        page: typePagination.page
      })
        .then(({ data, current_page, last_page, per_page }) => {
          typePagination.loading = false;
          if (current_page == last_page || data.length < per_page) {
            typePagination.finished = true;
          }
          typeData.push(...data.data);
          typePagination.page++;
        })
        .catch(() => {
          typePagination.loading = false;
        });
    },
    async getDividendData(type = null) {
      let requestParams = {};
      if (type) {
        requestParams["bonus_type"] = type;
      }
      return $http.get("plugin.invest-people.frontend.index.dividend", requestParams);
    }
  },
  components: {
    DTitle,
    DList,
    VanImage,
    dataItem
  }
};
</script>

<style scoped>
.header-member {
  padding: 35px 25px;
  color: white;
  text-align: left;
  background: #ee2e2b;
}

.header-member-nickname {
  display: inline-block;
  vertical-align: top;
  margin-left: 11px;
  max-width: 82%;
  color: white;
}

.header-member-amount {
  padding: 15px 14px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
  text-align: left;
  background-color: white;
}

.header-member-amount span {
  color: #ee2e2b;
}

.data-list {
  display: block;
  background-color: white;
}

.data-item:first-of-type {
  padding: 23px 14px 13px;
  margin: 0;
}
</style>
