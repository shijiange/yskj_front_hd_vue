<template>
  <div class="page">
    <c-title text="门店预约"></c-title>

    <div class="header">
      <div class="header-wrapper">
        <div class="face">
          <img :src="details.member_avatar" alt="" />
        </div>
        <div class="name">{{ details.member_nickname }}</div>
      </div>
    </div>
    <div class="cumulative">
      累计收益金额：
      <span class="red">{{ details.total_amount }}</span>
    </div>
    <div class="hr"></div>

    <van-tabs v-model="activeName" @change="tabChange">
      <van-tab title="门店收益"></van-tab>
      <van-tab title="技师收益"></van-tab>
      <van-tab v-if="details.is_open_attract" title="招商员收益"></van-tab>
    </van-tabs>

    <loading :show="!networkLoading"></loading>
    <div class="listData" v-if="networkLoading && listData.length > 0">
      <div class="list-item" v-for="item in listData" :key="item.service_id">
        <div class="cc c1">
          <div class="order_sn">{{ item.order_sn }}</div>
          <div class="price">￥{{ item.amount }}</div>
        </div>
        <div class="cc c2">{{ item.created_time_str }}</div>
        <div class="cc c3">
          预约ID：{{ item.service_id }} <span style="margin-left: 1rem;">{{ item.project_title }}</span>
        </div>
        <div class="cc c4">
          分红总金额：￥{{ item.total_commission }} <span style="margin-left: 1rem;">项目次数：{{ item.total_count }}</span>
        </div>
      </div>
    </div>

    <template v-if="networkLoading && listData.length == 0">
      <yz-blank text="暂无数据" :isBtn="false"></yz-blank>
    </template>
  </div>
</template>

<script>
import { scrollMixin } from "utils/mixin";
import loading from "components/loading";
import yzBlank from "components/ui_components/yz_blank";
export default {
  components: { loading, yzBlank },
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: 0,

      listData: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      networkLoading: false,

      details: {}
    };
  },
  created() {
    this.getDetails();
    this.getListData();
  },
  methods: {
    initPage() {
      this.listData = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.networkLoading = false;
    },
    getDetails() {
      $http.get("plugin.appointment.frontend.income.index").then(res => {
        if (res.result === 1) {
          this.details = res.data;
          console.log(res.data);
        }
      });
    },
    tabChange(e) {
      this.getListData();
    },

    getListData() {
      this.initPage();

      let json = {
        income_type: this.activeName
      };

      $http.get("plugin.appointment.frontend.income.get-list", json).then(res => {
        this.networkLoading = true;
        if (res.result === 1) {
          this.isLoadMore = true;
          this.total_page = res.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }

          this.listData = res.data.data;
          console.log(this.listData);
        }
      });
    },
    //获取更多数据
    getMoreData() {
      let json = {
        income_type: this.activeName
      };
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get("plugin.appointment.frontend.income.get-list", json, "加载中").then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.data;
              this.listData = this.listData.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          response => {
            // error callback
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(235, 235, 235);
  min-height: 100vh;
}

.header {
  display: flex;
  width: 100%;
  height: 7.344rem;
  padding-top: 2rem;
  padding-left: 1.531rem;
  background-color: #ee2e2b;

  .header-wrapper {
    display: flex;

    .face {
      width: 2.875rem;
      height: 2.875rem;

      img {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 50%;
      }
    }

    .name {
      padding-left: 0.688rem;
      font-size: 1rem;
      color: #fff;
    }
  }
}

.cumulative {
  height: 2.844rem;
  display: flex;
  align-items: center;
  padding-left: 0.875rem;
  font-size: 1rem;
  color: #333;
  background: #fff;

  .red {
    color: #ee2e2b;
  }
}

.hr {
  width: 100%;
  height: 0.625rem;
  background-color: #ebebeb;
}

.listData {
  .list-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 6.719rem;
    padding: 0.7rem 0.9rem;
    margin-bottom: 0.625rem;
    background-color: #fff;

    .cc {
      display: flex;
      align-items: center;
      text-align: left;
    }

    .order_sn {
      font-size: 0.813rem;
      color: #333;
    }

    .price {
      font-size: 0.938rem;
      color: #f15353;
    }

    .c2 {
      font-size: 0.75rem;
      color: #8c8c8c;
    }

    .c3 {
      display: inline-block;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.813rem;
      color: #333;
    }

    .c4 {
      font-size: 0.75rem;
      color: #8c8c8c;
    }
  }
}
</style>
