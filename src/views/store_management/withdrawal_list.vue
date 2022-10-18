<template>
  <div class="withdrawal-list">
    <c-title :hide="false" text="提现记录"></c-title>
    <van-sticky :offset-top="40">
      <van-search class="search-box" v-model="keyword" placeholder="搜索会员" shape="round" @search="searchRecord"></van-search>
      <van-tabs v-model="status" @change="changeTabs" class="status-tab">
        <van-tab  v-for="(item, index) in types"
          :key="index"
          :title="item.title" :name="item.name"
        ></van-tab>
      </van-tabs>
    </van-sticky>

    <van-list
      class="list"
      v-model="loading"
      :offset="30"
      :finished="finished"
      :immediate-check="false"
      finished-text="没有更多了"
      @load="loadMore"
    >
      <div class="item" v-for="(item) in recordList" :key="item.id" @click="toDetail(item.id)">
        <div class="top-order">
          <i :class="['iconfont', item.pay_way_icon]"></i>
          <div class="order">
            <p class="order-number">{{item.withdraw_sn}}</p>
            <p class="time">{{item.created_at}}</p>
          </div>
          <div :class="['status', colorClass(item.status)]">{{item.status_name}}</div>
        </div>
        <div class="bottom-member">
          <div class="avatar">
            <img :src="item.has_one_member ? item.has_one_member.avatar : require('../../assets/images/photo-mr.jpg')" alt="">
          </div>
          <div class="name-box">
            <p class="nickname overflow">{{item.has_one_member ? item.has_one_member.nickname : ''}}</p>
            <p class="describe">{{item.type_name}}</p>
          </div>
          <div class="cost">
            <p class="amounts">申请金额：{{item.amounts}}</p>
            <p class="poundage">手续费：{{item.poundage}}</p>
            <p class="payment">应打款：<span class="red-text">{{(item.amounts - item.poundage).toFixed(2)}}</span></p>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      types: [
        {title: "全部记录", name: ''},
        {title: "待审核", name: 0},
        {title: "待打款", name: 1},
        {title: "打款中", name: 4},
        {title: "已打款", name: 2},
        {title: "已驳回", name: 3},
        {title: "无效提现", name: -1},
      ],
      status: '',
      keyword: '',
      recordList: [],

      page: 1,
      loading: false,
      finished: false,
    };
  },

  activated () {
    this.getData();
  },
  methods: {
    getData () {
      if (this.finished || this.loading) {
        return false;
      }
      let json = {};
      json.page = this.page;
      json.search = {
        member: this.keyword,
        status: this.status
      };
      $http.post("plugin.shop-assistant.frontend.withdraw.withdraw-list", {...json}, "loading")
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          let data = response.data;
          this.recordList = data.current_page > 1 ? this.recordList.concat(data.data) : data.data;
          if (data.current_page >= data.last_page && data.data.length < data.per_page) this.finished = true;
          this.page++;
        });
    },
    changeTabs () {
      this.keyword = '';
      this.recordList = [];
      this.page = 1;
      this.finished = false;
      this.loading = false;
      this.getData();
    },
    loadMore () {
      this.getData();
    },
    searchRecord () {
      this.status = '';
      this.recordList = [];
      this.page = 1;
      this.finished = false;
      this.getData();
    },
    toDetail (id) {
      this.$router.push(this.fun.getUrl("withdrawalDetail", {id}));
    },
  },
  computed: {
    colorClass (status) {
      return (status) => {
        switch (parseInt(status)) {
        case -1:
          return 'grey';
        case 0:
          return 'red';
        case 1:
          return 'yellow';
        case 2:
          return 'green';
        case 3:
          return 'orange ';
        case 4:
          return 'blue';
        }
      };
    },
  },
  components: { },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.withdrawal-list {
  position: relative;
  .list {
    padding: 0 0.63rem;
    .item {
      margin-top: 0.65rem;
      padding: 0.69rem 0.94rem;
      background-color: #ffffff;
      border-radius: 0.31rem;
      .top-order {
        display: flex;
        align-items: center;
        text-align: left;
        .iconfont {
          font-size: 1.5rem;
        }
        .icon-all_wechat {
          color: #1cd66c;
        }
        .icon-all_alipay {
          color: #1576ff;
        }
        .icon-pay_yue {
          color: #ff7433;
        }
        .icon-pay_otherpay {
          color: #ffba00;
        }
        .icon-pay_card {
          color: #ffba00;
        }
        .icon-fontclass-deng {
          color: #62d18e;
        }
        .order {
          flex: 1;
          margin-left: 0.5rem;
          .order-number {
            padding-right: 1rem;
            white-space: pre-wrap;
            word-break: break-all;
            font-size: 0.85rem;
            line-height: 1.5rem;
            color: #414141;
          }
          .time {
            font-size: 0.75rem;
            color: #9e9e9e;
          }
        }
        .status {
          color: #ffffff;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 0.13rem;
        }
        .red {
          background-color: #f15353;
        }
        .yellow {
          background-color: #f7c124;
        }
        .blue {
          background-color: #28b2fa;
        }
        .green {
          background-color: #74b23d;
        }
        .orange {
          background-color: #f2852e;
        }
        .grey {
          background-color: #a6a6a6;
        }
      }
      .bottom-member {
        display: flex;
        align-items: center;
        margin-top: 1rem;
        text-align: left;
        .avatar {
          width: 2.19rem;
          height: 2.19rem;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name-box {
          flex: 1;
          width: 0;
          margin-left: 0.47rem;
          .nickname {
            font-size: 0.94rem;
            color: #242424;
          }
          .describe {
            margin-top: 0.8rem;
            font-size: 0.75rem;
            color: #666666;
          }
        }
        .cost {
          font-size: 0.69rem;
          color: #9e9e9e;
          p {
            margin-top: 0.5rem;
          }
        }
      }
    }
    .red-text {
      color: #f15353;
    }
  }

}
</style>