<template>
  <div id="team_rewards_record">
    <c-title :hide="false" text="见点奖励"> </c-title>
    <div class="header_box">
      <div class="left">
        <div class="header">
          <img :src="member.avatar" />
        </div>
        <div class="name">
          <div>{{ member.nickname }}</div>
          <span class="padcAls" v-if="member.level">{{ member.level }}</span>
        </div>
      </div>
    </div>
    <div class="totalPrice">
      累计奖励金额:<span>{{ $i18n.t("money") }}{{ member.total }}</span>
    </div>
    <van-tabs :active="active">
      <van-tab title="奖励记录"></van-tab>
    </van-tabs>
    <div class="listbox">
      <div class="lis" v-for="item in recordsList" :key="item.id">
        <div class="left_lis">
          <div class="order_lis">订单号:{{ item.order_sn }}</div>
          <div class="time">时间:{{ item.created_at }}</div>
        </div>
        <div class="right_lis">
          奖励金额:<span>{{ $i18n.t("money") }}{{ item.amounts }}</span>
        </div>
      </div>
    </div>
    <div class="blank" v-if="recordsList.length <= 0">
      <img src="@/assets/images/blank.png" />
      <span>还没有记录哦</span>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
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
      $http.post("plugin.find-point-reward.frontend.controllers.center", { page: 1 }, " ").then(
        response => {
          if (response.result === 1) {
            this.member = response.data.info;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = response.data.list.data;
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
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
            "plugin.find-point-reward.frontend.controllers.center",
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
            function (response) {
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
    // goRewardsRecordDetail() {
    //   this.$router.push(this.fun.getUrl("RewardsRecordDetail"));
    // }
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#team_rewards_record {
  .listbox {
    background: #fff;
    .lis {
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      border: 1px solid #ebebeb;
      padding: 0.56rem 0.875rem;
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
          margin-bottom: 0.56rem;
          text-align: left;
        }
      }
      .right_lis {
        flex: 0.8;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          color: #f15353;
        }
      }
    }
  }
  .totalPrice {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0 0.875rem;
    background: #fff;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      color: #f15353;
      margin-left: 0.95rem;
    }
  }
  .blank {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 6rem;
      height: 6rem;
    }

    span {
      margin-top: 15px;
      color: #ccc;
      font-size: 14px;
    }
  }

  .header_box {
    background: #ff590c;
    color: #fff;
    padding: 1.25rem 0.875rem;
    display: flex;
    align-items: center;
    .padcAls {
      padding: 0.1rem;
      background-color: rgba(244, 221, 154, 0.5);
      border-radius: 0.25rem;
    }
    .left {
      flex: 1;
      display: flex;
    }

    .right {
      flex: 1;
    }

    .header {
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
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      height: 3.25rem;

      .name_b {
        line-height: 1.375rem;
        text-align: left;
      }
    }
  }
}
</style>
