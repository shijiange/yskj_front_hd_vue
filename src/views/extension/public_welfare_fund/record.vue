<template>
  <div>
    <c-title :text="title"></c-title>
    <van-list class="welfare-record-list" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="loadMore">
      <!-- 支出记录 -->
      <div v-if="type == 1">
        <div class="expenditure-item" v-for="(item, index) in expendList" :key="index">
          <div class="row" style="margin-bottom: 0.625rem">
            <span class="remarks van-ellipsis">{{ item.remark }}</span>
            <p class="amount">{{ item.amount }}</p>
          </div>
          <div class="row">
            <span class="remarks-type">公益支出</span>
            <span class="time">{{ item.created_at }}</span>
          </div>
        </div>
        <yz-blank :datas="expendList" text="空空如也"></yz-blank>
      </div>

      <!-- 明细记录 -->
      <div v-else>
        <div class="person-item" v-for="(item, index) in fundList" :key="index">
          <img class="avatar" :src="item.member&&item.member.avatar_image" alt="" />
          <div class="user-nick">
            <p style="display: flex;">
              <span class="name van-ellipsis">{{ item.member&&item.member.username }}</span>
              <span class="user-id">ID：{{ item.member_id }}</span>
            </p>
            <p class="time">{{ item.created_at }}</p>
          </div>
          <div class="amount-statistics">
            <p class="amount">{{ item.amount }}</p>
            <p class="balance">公益可用：{{ item.surplus_amount_total }}</p>
          </div>
        </div>
        <yz-blank :datas="fundList" text="空空如也"></yz-blank>
      </div>
    </van-list>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      title: "",
      type: 1, // 1 公益支出记录 2公益明细

      finished: false,
      loading: false,
      page: 1,

      expendList: [],
      fundList: []
    };
  },

  activated() {
    this.type = this.$route.params.type;
    if (this.type == 1) {
      this.title = "支出记录";
      this.getExpendData();
    } else {
      this.title = "公益明细";
      this.getFundData();
    }
  },

  methods: {
    getExpendData() {
      $http
        .get("plugin.public-fund.frontend.controllers.fund.expendList", {
          page: this.page
        })
        .then(res => {
          if (res.result != 1) {
            this.$totas(res.msg);
          }
          let data = res.data.list;
          if (data.current_page >= data.last_page || data.data.length < data.per_page) {
            this.finished = true;
          }
          this.expendList = this.page > 1 ? this.expendList.concat(data.data) : data.data;
          this.page++;
        });
    },

    getFundData() {
      this.loading = true;
      $http
        .get(
          "plugin.public-fund.frontend.controllers.fund.amountList",
          {
            page: this.page,
            change_type: 1
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
          this.fundList = this.page > 1 ? this.fundList.concat(data.data) : data.data;
          this.page++;
        });
    },

    loadMore() {
      if (this.finished || this.loading) {
        return false;
      }
      if (this.type == 1) {
        this.getExpendData();
      } else {
        this.getFundData();
      }
    }
  },

  components: { yzBlank }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.welfare-record-list {
  @mixin flx {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  $norFontSize: 14px;
  $minFontSize: 12px;

  .person-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    padding: 0.56rem;
    background-color: #ffffff;
    .avatar {
      width: 2.594rem;
      height: 2.594rem;
      border-radius: 50%;
    }
    .user-nick {
      @include flx();
      flex: 1;
      text-align: left;
      margin-left: 0.67rem;
      .name {
        display: inline-block;
        font-size: $norFontSize;
        max-width: 7rem;
        color: #292929;
      }
    }
    .user-id,
    .time {
      font-size: $minFontSize;
      color: #6b6b6b;
    }
    .user-id {
      margin-left: 0.5rem;
    }

    .amount-statistics {
      @include flx();
      text-align: right;
      .amount {
        font-size: $norFontSize;
        font-weight: bold;
        color: #ff5a5a;
      }
      .balance {
        font-size: $minFontSize;
        color: #ff5a5a;
      }
    }
  }

  .expenditure-item {
    padding: 0.56rem;
    background-color: #ffffff;
    // border-radius: 0.313rem;
    .row {
      display: flex;
      justify-content: space-between;
      align-content: space-between;
    }
    .amount {
      font-size: $norFontSize;
      font-weight: bold;
      color: #ff5a5a;
    }
    .remarks-type,
    .time {
      font-size: $minFontSize;
      max-width: 7rem;
      color: #6b6b6b;
      white-space: nowrap;
    }
    .remarks {
      max-width: 12rem;
    }
  }

  .person-item::before,
  .expenditure-item::before {
    position: absolute;
    content: "";
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #6b6b6b;
    transform: scaleY(0.5);
  }
}
</style>
