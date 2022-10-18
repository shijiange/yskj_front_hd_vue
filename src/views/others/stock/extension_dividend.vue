<template>
  <div id="extension_dividend">
    <c-title :hide="false" text="销售员分红"> </c-title>
    <div class="header_box">
      <div class="member-box">
        <div class="avatar">
          <img :src="member.avatar" />
        </div>
        <div class="name">
          <div>{{ member.nickname }}</div>
          <span class="padcAls" v-if="member.agencyLevel">{{ member.agencyLevel }}</span>
        </div>
      </div>
    </div>
    <div class="totalPrice">
      累计分红金额:<span>{{ $i18n.t("money") }}{{ accumulate_reward }}</span>
    </div>
    <van-tabs v-model="active" sticky offset-top="40">
      <van-tab title="奖励记录"></van-tab>
    </van-tabs>
    <div class="listbox">
      <div class="lis" v-for="item in recordsList" :key="item.id">
        <div class="left_lis">
          <div class="order_lis">订单号{{ item.order_sn }}</div>
          <div class="time" style="font-size:10px;color:#999;">{{ item.created_at }}</div>
        </div>
        <div class="right_lis">
          <span>{{ $i18n.t("money") }}{{ item.reward_amount }}</span>
        </div>
      </div>
    </div>

    <yz-blank :datas="recordsList" text="没找到相关记录"></yz-blank>
  </div>
</template>

<script>
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      accumulate_reward: "--",
      member: {},
      recordsList: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    getData() {
      $http.post("plugin.salesman-dividend.frontend.reward-log.get-reward-list", { page: 1 }, " ").then(
        response => {
          if (response.result === 1) {
            this.member = response.data.memberInfo;
            this.accumulate_reward = response.data.accumulate_reward;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            this.recordsList = response.data.list.data;
          } else {
            this.$toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.salesman-dividend.frontend.reward-log.get-reward-list",
            {
              page: this.page
            },
            "加载中"
          )
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.list.data;
                this.recordsList = this.recordsList.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    initData() {
      this.recordsList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    }
  },
  components: { yzBlank }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#extension_dividend {
  .header_box {
    background: #ff590c;
    color: #fff;
    padding: 1.25rem 0.875rem;
    display: flex;
    align-items: center;
    .padcAls {
      padding: 0.1rem 0.5rem;
      background-color: rgba(244, 221, 154, 0.5);
      border-radius: 0.25rem;
    }
    .member-box {
      flex: 1;
      display: flex;
    }

    .avatar {
      width: 3.25rem;
      height: 3.25rem;
      border: solid 0.125rem #fff;
      margin-right: 0.625rem;
      overflow: hidden;
      border-radius: 3.75rem;
      background: #f2f2f2;

      img {
        width: 100%;
      }
    }

    .name {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      min-height: 3.25rem;

      .name_b {
        line-height: 1.375rem;
        text-align: left;
      }
    }
  }
  .listbox {
    background: #fff;

    .lis {
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      padding: 0.5rem 0.875rem;
      position: relative;
      .left_lis {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        overflow: hidden;
        .order_lis {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 0.5rem;
          text-align: left;
        }
      }
      .right_lis {
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        span {
          color: #f15353;
          font-size: 14px;
        }
      }
    }
  }
  .lis::after {
    height: 1px;
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: 0;
    content: "";
    width: 100%;
    background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
  }
  .totalPrice {
    margin-bottom: 0.625rem;
    padding: 0 0.875rem;
    background: #fff;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      color: #f15353;
      margin-left: 0.95rem;
    }
  }
}
</style>
