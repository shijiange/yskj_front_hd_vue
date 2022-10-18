<template>
  <div class="distributionEntrance">
    <c-title :hide="false" text="配送入口"></c-title>
    <van-search v-model="keyWord" placeholder="收货人姓名、手机号、订单编号" @input="searchGo" />
    <van-tabs v-model="delivery_status" @change="tapStatus">
      <van-tab :title="`待配送(${waitOrderTotal})`"></van-tab>
      <van-tab :title="`已完成(${finishedOrderTotal})`"></van-tab>
    </van-tabs>
    <div class="loaction" @click="tolocation">
      <div class="loactionAdress">
        <i class="iconfont icon-dizhi"></i> <span class="adress">{{ address }}</span>
      </div>
      <i class="iconfont icon-member_right"></i>
    </div>
    <entrance :infoData="listData" @ListenChild="reverseGet" :delivery_status="delivery_status" :point="point"></entrance>
  </div>
</template>
<script>
import entrance from "./components/Entrance";
import { scrollMixin } from "utils/mixin";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      delivery_status: 0,
      keyWord: "",
      info: [],
      waitOrderTotal: 0,
      finishedOrderTotal: 0,
      point: {
        lng: "",
        lat: ""
      },
      address: "",
      listData: [],
      timer:null,
      
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.init();
    this.fun
      .getLocation("正在定位")
      .then(res => {
        this.address = res.title;
        this.point = this.fun.bd_encrypt(res.point.lng, res.point.lat);
        this.getdata(this.point);
      })
      .catch(err => {
        this.getdata();
      });
  },
  methods: {
    init() {
      this.listData = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    searchGo(e) {
      this.keyWord = e;
      this.init();
      // 防抖
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.debounce(this.getdata(this.point));
      }, 500);
    },
    reverseGet(e) {
      this.getdata(this.point);
    },
    tolocation() {
      this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: "suppligoodsOrde" }));
    },
    tapStatus(e) {
      this.init();
      this.delivery_status = e;
      this.getdata(this.point);
    },
    getdata(point) {
      $http
        .get(
          "plugin.supplier-driver-distribution.frontend.delivery-order.deliveryOrderList",
          {
            keyWord: this.keyWord,
            delivery_status: this.delivery_status + 1,
            lng: point.lng,
            lat: point.lat,
            page: this.page
          },
          ""
        )
        .then(res => {
          if (res.result == 1) {
            this.info = res.data;
            this.listData = res.data.list.data;
            this.waitOrderTotal = res.data.waitOrderTotal ? res.data.waitOrderTotal : "0";
            this.finishedOrderTotal = res.data.finishedOrderTotal ? res.data.finishedOrderTotal : "0";
            this.total_page = res.data.list.last_page;
            this.isLoadMore = true;
          } else {
            Toast(res.msg);
          }
        });
    },
    getMoreData() {
      this.isLoadMore = false;
      if (this.page >= this.total_page) {
        return;
      } else {
        $http
          .get(
            "plugin.supplier-driver-distribution.frontend.delivery-order.deliveryOrderList",
            {
              keyWord: this.keyWord,
              delivery_status: this.delivery_status == 0 ? 1 : 2,
              lng: this.point.lng,
              lat: this.point.lat,
              page: this.page + 1
            },
            ""
          )
          .then(res => {
            if (res.result == 1) {
              this.total_page = res.data.list.last_page;
              this.isLoadMore = true;
              this.listData = this.listData.concat(res.data.list.data);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              Toast(res.msg);
            }
          });
      }
    },
  },
  components: { entrance }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.loaction {
  height: 2.63rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.94rem;
  box-sizing: border-box;
  color: #797878;
  overflow: hidden;
  .loactionAdress {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .adress {
      margin-left: 0.36rem;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>