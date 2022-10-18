<template>
  <div id="order-list">
    <van-search v-model="json.keyword" placeholder="搜索订单" @search="search" shape="round"></van-search>
    <div class="select-order">
      <van-sidebar v-model="typeIndex" @change="changeOrderType" v-if="order_tabs.length > 0">
        <van-sidebar-item
          v-for="order in order_tabs" :key="order.name" :name="order.name" :title="order.title"
        ></van-sidebar-item>
      </van-sidebar>
      <div class="right-content">
        <van-tabs v-if="orderStatusTabs.length > 0" v-model="json.status" class="order-status" line-width="25" swipe-threshold="3" @click="changeOrderStatus">
          <van-tab
            v-for="(item, index) in orderStatusTabs" :key="index"
            :title="item.status_name" :name="item.status"
          ></van-tab>
        </van-tabs>
        <div class="list">
        <van-list
          v-if="orderList.length > 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="loadMore"
        >
          <!-- 售后订单 -->
          <template v-if="json.order_type === 'refund_order'">
            <aftersales-item v-for="(item, index) in orderList" :key="index" :goodsItem="item"></aftersales-item>
          </template>
          <!-- 商品订单 -->
          <template v-else>
            <goods-item
              v-for="(item, index) in orderList"
              :order="item"
              :detailUrl="detailUrl"
              :orderType="orderType"
              :key="index">
            </goods-item>
          </template>
        </van-list>
        <van-empty v-else description="空空如也"></van-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import goodsItem from "../myComponents/goodsItem";
import aftersalesItem from "../myComponents/aftersalesItem";
export default {
  data () {
    return {
      typeIndex: '',
      detailUrl: 'orderdetail',
      orderType: 'shop',
      firstRquery: false,
      json: {
        page: 1,
        keyword: '',
        order_type: 'order',
        status: '1',
      },
      loading: false,
      finished: false,

      order_tabs: [],
      orderList: [],
      orderStatusTabs: [],
      strUrl: 'plugin.wechat-chat-sidebar.frontend.controller.customer.customer.get-order-list',
      getConfig: {client: 'work',type: 17}, //企业微信公共参数

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
      let getObj = {};
      if (this.json.order_type === "refund_order") {
        // 售后订单列表
        getObj = {
          page: this.json.page,
          keyword: this.json.keyword,
          ...this.getConfig
        };
        this.strUrl = "plugin.wechat-chat-sidebar.frontend.controller.customer.customer.refund-apply";
      } else {
        // 其他订单
        getObj = {
          ...this.json,
          ...this.getConfig
        };
        this.strUrl = "plugin.wechat-chat-sidebar.frontend.controller.customer.customer.get-order-list";
      }

      this.loading = true;
      try {
        let res = await $http.get(this.strUrl, getObj, 'loading');
        this.loading = false;
        if (res.result === 1) {
          if (this.json.page >= res.data.last_page || res.data.data.length < res.data.per_page) {
            this.finished = true;
          }
          if (this.order_tabs.length <= 0) {
            this.order_tabs = this.setOrderTabs(res.data);
            this.orderStatusTabs = this.order_tabs[0].list;
          }
          if(res.data) {
            this.orderList = this.json.page > 1 ? this.orderList.concat(res.data.data) : res.data.data;
            this.json.page = ++this.json.page;
          }
        } else {
          this.$toast(res.msg);
        }
      } catch (err) {
        this.loading = false;
        console.log('---err---', err);
      }
    },
    setOrderTabs (data) {
      if (!data.order_name && !data.order) {
        return;
      }

      let NavList = [{status: 1,status_name: "全部"},  {status: 2,status_name: "待付款"},{status: 3,status_name: "待发货"}, {status: 4,status_name: "待收货"}, {status: 5,status_name: "已完成"}];
      // 处理订单列表
      let tablist = [];
      for (let order_key in data.order.json) {
        let flag = true;
        let title = data.order_name[order_key];
        if (order_key) {
          if (order_key === "order") {
            data.order[order_key] = NavList;
          } else if (order_key === "hotel_order"){
            data.order[order_key] = [{status: 1,status_name: "全部"},  {status: 2,status_name: "待付款"},{status: 3,status_name: "待确认"}, {status: 4,status_name: "待入住"}, {status: 5,status_name: "已完成"}, {status: 6,status_name: "待退房"}];
          } else if (order_key === "lease_order"){
            data.order[order_key] = [{status: 1,status_name: "全部"},  {status: 2,status_name: "待支付"},{status: 3,status_name: "待发货"}, {status: 4,status_name: "待收货"}, {status: 5,status_name: "待归还"}, {status: 6,status_name: "已完成"}];
          } else if (order_key === "fight_groups_order"){
            data.order[order_key] = [{status: 1,status_name: "全部"},  {status: 2,status_name: "拼团中"},{status: 3,status_name: "待付款"}, {status: 4,status_name: "待收货"}, {status: 5,status_name: "已完成"}];
          } else if (order_key === "snatch_regiment_order"){
            data.order[order_key] = [{status: 1,status_name: "抢团中"},{status: 2,status_name: "待付款"}, {status: 2,status_name: "待发货"},{status: 3,status_name: "待收货"}, {status: 5,status_name: "已完成"}];
          }else {
            // 其他先不做
            flag = false;
          }
          // else if (order_key === "live_install_order"){
          //   data.order[order_key] = [{status: -1,status_name: "全部"},  {status: 1,status_name: "待支付"},{status: 2,status_name: "待分配"}, {status: 3,status_name: "待取货"}, {status: 4,status_name: "待到付"}, {status: 4,status_name: "待安装"}, {status: 5,status_name: "已完成"}];
          // }
          if(flag) {
            tablist.push({
              name: order_key,
              title: title,
              list: data.order[order_key]
            });
          }

        }
      }
      tablist.push({
        name: "refund_order",
        title: "售后订单",
        list: [],
      });
      return tablist;
    },
    loadMore () {
      this.getData();
    },
    //订单类型
    changeOrderType () {
      this.json.status = "1";
      this.json.order_type = this.order_tabs[this.typeIndex].name;
      this.orderStatusTabs = this.order_tabs[this.typeIndex].list;
      console.log(this.json.order_type);
      if(this.json.order_type === 'order') {
        this.detailUrl = "orderdetail";
        this.orderType = "shop";
      }else if(this.json.order_type === 'hotel_order') {
        this.detailUrl = "HotelOrderDetail";
        this.orderType = "hotel";
      }else if(this.json.order_type === 'lease_order') {
        this.detailUrl = "LeaseToyOrderDetail";
        this.orderType = "lease_toy";
      }else if(this.json.order_type === 'fight_groups_order') {
        this.detailUrl = "groupDetail";
        this.orderType = "groups";
      }else if(this.json.order_type === 'snatch_regiment_order') {
        this.detailUrl = "orderdetail";
        this.orderType = "grabGroup";
      }
      this.getParamInit();
      this.getData();
    },
    //订单状态
    changeOrderStatus (e) {
      console.log(this.json);
      this.getParamInit();
      this.getData();
    },
    search () {
      this.json.page = 1;
      this.loading = false;
      this.finished = false;
      this.getData();
    },
    getParamInit () {
      this.orderList = [];
      this.json.page = 1;
      this.json.keyword = '';
      this.loading = false;
      this.finished = false;
    },
  },

  components: {
    goodsItem,
    aftersalesItem
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#order-list {
  background-color: #fff;

  /deep/ .van-search__content {
    background-color: #eff0f1;
  }

  .select-order {
    display: flex;
    max-height: 30rem;

    .van-sidebar {
      width: 90px;
      padding: 0 10px;

      .van-sidebar-item--select::before {
        background-color: transparent;
        color: #fff;
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

    .right-content {
      position: relative;
      flex: 1;
      overflow: hidden;
      border-left: 1px solid #e9e5e5;

      .list {
        height: calc(100% - 44px);
        overflow-y: auto;
      }

      /deep/ #orderList .blank {
        position: static;
        transform: translate(0, 0);
      }
    }

    .right-content::after {
      // content: '';
      // position: absolute;
      // top: 0;
      // left: 0;
      // width: 1px;
      // height: 80%;
      // background-color: #e9e5e5;
    }
  }
}
</style>