<template>
  <div id="goods-coupon">
    <van-sidebar v-model="json.coupon_type" class="left-sidebar" @change="changeCouponType">
      <van-sidebar-item :title="item" v-for="(item, index) in sidebarList" :key="index"></van-sidebar-item>
    </van-sidebar>
    <div class="right-list">
      <van-list
        v-if="couponList.length > 0"
        class="list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadMore"
      >
        <div class="coupon" v-for="(item, index) in couponList" :key="index">
          <div class="left">
            <template v-if="item.belongs_to_coupon.coupon_method == 1">
              <p class="amount">{{ item.belongs_to_coupon.deduct }}</p>
              <p class="rule">满{{ item.belongs_to_coupon.enough }}可用</p>
            </template>
            <template else-if="item.belongs_to_coupon.coupon_method == 2">
              <p class="amount">{{ item.belongs_to_coupon.discount }}折</p>
              <p class="rule">满{{ item.belongs_to_coupon.enough }}立享</p>
            </template>

          </div>
          <div class="right">
            <p class="cop-platform">{{item.belongs_to_coupon.coupon_type_name}}</p>
            <p class="cop-name">{{item.belongs_to_coupon.name}}</p>
            <p class="time">{{ item.time_start }}-{{ item.time_end }}</p>
          </div>
        </div>
      </van-list>
      <van-empty v-else description="空空如也"></van-empty>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      strUrl: 'plugin.wechat-chat-sidebar.frontend.controller.customer.customer.couponsOfMemberByStatusV2',
      getConfig: {client: 'work',type: 17}, //企业微信公共参数
      couponList: [],
      sidebarList: [],
      json: {
        page: 1,
        coupon_type: 0,
      },
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
      this.loading = true;
      try {
        let res = await $http.get(this.strUrl, {...this.json,...this.getConfig}, "loading");
        this.loading = false;
        if (res.result === 1 && res.data.data) {
          let listData = res.data.data;
          if (this.json.page >= listData.last_page || listData.data.length < listData.per_page) {
            this.finished = true;
          }
          this.couponList = listData.data;
          this.sidebarList = res.data.search_array;
          this.json.page = ++this.json.page;
        } else {
          this.finished = true;
          this.$toast(res.msg != '' ? res.msg : '暂无数据');
        }
      } catch (err) {
        this.loading = false;
      }
    },
    changeCouponType () {
      this.getParamInit();
      this.getData();
    },

    loadMore () {
      this.getData();
    },
    getParamInit () {
      this.listData = [];
      this.json.page = 1;
      this.loading = false;
      this.finished = false;
    },
  },

  components: {
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#goods-coupon {
  display: flex;
  height: 28rem;
  background-color: #fff;

  .left-sidebar {
    min-width: 90px;
    border-right: 1px solid #e9e5e5;
  }

  .van-sidebar {
    width: 90px;
    padding: 0 10px;

    .van-sidebar-item--select::before {
      background-color: transparent;
    }

    .van-sidebar-item {
      margin: 10px 0;
      padding: 3px 6px;
      background-color: #fff;
      font-size: 12px;
    }

    .van-sidebar-item--select {
      background-color: #f78b00;
      border-radius: 0.856rem;
    }
  }

  .right-list {
    margin-left: 0.625rem;
    overflow-y: auto;
    padding: 0.3rem 0;

    .coupon {
      position: relative;
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;

      .left {
        width: 5.16rem;
        height: 4.89rem;
        color: #fff;
        padding: 0 0.3rem;
        line-height: 2.5rem;
        background-color: #fbd266;

        .amount {
          font-size: 16px;
          border-bottom-style: dotted;
          border-bottom-width: 2px;
        }
      }

      .right {
        flex: 1;
        // display: flex;
        // flex-direction: column;
        // justify-content: space-evenly;
        line-height: 20px;
        padding: 0.3rem 0 0.2rem 0.625rem;
        text-align: left;

        .cop-platform {
          display: inline-block;
          padding: 0 0.2rem;
          border-radius: 0.2rem;
          color: #fff;
          background-color: #fbd266;
        }

        .cop-name {
          margin: 0.25rem 0;
          font-size: 14px;
          font-weight: bold;
          overflow: hidden;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .time {
          color: #6b6b69;
        }
      }
    }

    .coupon::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #e9e5e5;
      transform: scaleY(0.5);
    }
  }
}
</style>