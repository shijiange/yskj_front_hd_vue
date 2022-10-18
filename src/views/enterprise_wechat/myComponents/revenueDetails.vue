<template>
  <div id="revenue-detail">
    <div class="statistics">
      <div class="li" v-for="(item, index) in statistic" :key="index">
        <p class="amount">
          {{$i18n.t('money')}}
          {{ item.value ? item.value : 0}}
        </p>
        <p class="title">{{item.title}}</p>
      </div>
    </div>
    <div class="top-box">
      <van-tabs
        v-model="revenueType"
        class="tab"
        type="card"
        title-active-color="#fff"
        title-inactive-color="#535353"
        @change="changeRevenueType"
      >
        <van-tab title="收入明细" name="0"></van-tab>
        <van-tab title="提现明细" name="1"></van-tab>
      </van-tabs>
      <template v-if="revenueType == 0">
        <div class="screen-form" v-if="actions.length > 0">
          <span>筛选</span>
          <van-field :value="this.typeText" placeholder="请选择类型" @click="showTypeSheet = true" readonly>
            <template #button>
              <van-icon name="arrow-down" />
            </template>
          </van-field>
          <div class="bnt-search" @click="search">搜索</div>
        </div>
      </template>
      <template v-else>
        <van-tabs
          v-model="json.status"
          @change="changeTabsStatus"
        >
          <van-tab title="全部" name=""></van-tab>
          <van-tab title="申请中" name="0"></van-tab>
          <van-tab title="待打款" name="1"></van-tab>
          <van-tab title="已打款" name="2"></van-tab>
          <van-tab title="已失效" name="-1"></van-tab>
        </van-tabs>
      </template>

    </div>
    <van-list
      v-if="recordList.length > 0"
      class="record-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
    >
      <div class="item" v-for="(item,index) in recordList" :key="index">
        <p class="record">
          <span class="title">{{item.type_name}}</span>
          <span v-if="item.amount > 0" class="num red-text">+{{item.amount}}</span>
          <span v-else class="num green-text">-{{item.amount}}</span>
        </p>
        <p class="time">
         {{item.created_at}}
        </p>
      </div>
    </van-list>
    <van-empty v-else description="空空如也"></van-empty>
    <van-action-sheet v-model="showTypeSheet" :actions="actions" @select="onSelect"></van-action-sheet>
  </div>
</template>

<script>
export default {
  data () {
    return {
      strUrl: 'plugin.wechat-chat-sidebar.frontend.controller.customer.customer.income-record',
      getConfig: {client: 'work',type: 17}, //企业微信公共参数
      showTypeSheet:false,
      actions: [],
      recordList: [],
      statistic: [],
      revenueType: 0,
      json: {
        page: 1,
        income_type: '',
        status: ''
      },
      typeText: '',
      loading: false,
      finished: false,
    };
  },
  mounted () {
    this.getData();
  },
  methods: {
    async getData () {
      if (this.finished && this.loading) {
        return;
      }
      let queryObj = {};
      if (this.revenueType == 0) {
        queryObj = {
          page: this.json.page,
          income_type: this.json.income_type,
        };
        this.strUrl = "plugin.wechat-chat-sidebar.frontend.controller.customer.customer.income-record";
      } else {
        queryObj = {
          page: this.json.page,
          status: this.json.status,
        };
        this.strUrl = "plugin.wechat-chat-sidebar.frontend.controller.customer.customer.get-withdraw-log";
      }
      this.loading = true;
      try {
        let res = await $http.post(this.strUrl, {...queryObj,...this.getConfig}, "loading");
        this.loading = false;
        if (res.result === 1 && res.data.data) {
          if (this.json.page >= res.data.last_page || res.data.data.length < res.data.per_page) {
            this.finished = true;
          }
          this.recordList = this.json.page > 1 ? this.recordList.concat(res.data.data) : res.data.data;
          if (this.actions.length === 0) {
            this.setActions(res.data.income_type);
          }
          this.statistic = res.data.get_withdraw;
          this.json.page = ++this.json.page;
        } else {
          this.finished = true;
          this.$toast(res.msg);
        }
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    loadMore () {
      this.getData();
    },
    setActions (data) {
      let recordArr = [];
      for (let item in data) {
        recordArr.push({name: data[item].title, value: data[item].type});
      }
      recordArr.unshift({name: '默认选项', value: '', color: '#8f8686'});
      this.actions = recordArr;
    },
    changeRevenueType () {
      this.json.income_type = '';
      this.paramsInit();
      this.getData();
    },
    changeTabsStatus () {
      this.json.page = 1;
      this.loading = false;
      this.finished = false;
      this.recordList = [];
      this.getData();
    },
    search () {
      this.paramsInit();
      this.getData();
    },
    paramsInit () {
      this.json.page = 1;
      this.loading = false;
      this.finished = false;
      this.recordList = [];
      this.statistic = [];
    },
    onSelect (event) {
      this.showTypeSheet = false;
      this.typeText = event.value ? event.name : '';
      this.json.income_type = event.value;
    },

  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#revenue-detail {
  overflow: hidden;
  background-color: #fff;

  .statistics::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #eff0f1;
  }

  .statistics {
    display: flex;
    background-color: #fff;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 0.4rem;
    padding: 0.875rem;
    line-height: 20px;

    .li {
      flex: 1;
    }

    .amount {
      font-size: 14px;
      font-weight: bold;
    }

    .title {
      font-size: 12px;
      color: #7d7d7d;
    }
  }

  .top-box {
    padding: 0.875rem;
    background-color: #fff;

    .tab {
      margin: 0 auto;
      width: 15.625rem;

      /deep/ .van-tabs__nav--card {
        border-radius: 0.313rem;
        border: 1px solid #d8d8d8;
        overflow: hidden;

        .van-tab {
          font-size: 12px;
          border-right: none;
        }

        .van-tab--active {
          background-color: #f59a1f;
        }
      }

      /deep/ .van-search__content {
        background-color: #eff0f1;
      }
    }

    .screen-form {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      .van-cell {
        width: 180px;
        padding: 3px 16px;
        border-radius: 0.313rem;
        border: solid 0.031rem #e9e5e5;
      }

      .bnt-search {
        font-size: 14px;
        color: #fff;
        padding: 0.3rem 0.7rem;
        background-color: #f59a1f;
        border-radius: 0.313rem;
      }
    }
  }

  .record-list {
    padding: 1rem 0.875rem 0.3rem 0.875rem;
    text-align: left;

    .item {
      position: relative;
      padding: 0.42rem 0;

      .record {
        display: flex;
        justify-content: space-between;

        .title {
          font-size: 14px;
          font-weight: bold;
          color: #2d2c2c;
        }

        .num {
          font-size: 14px;
        }
      }

      .time {
        margin-top: 0.325rem;
        font-size: 12px;
        color: #7d7d7d;
      }
    }

    .item::after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #eff0f1;
    }

    .red-text {
      color: #f14e4e;
    }

    .green-text {
      color: #378105;
    }
  }
}

</style>