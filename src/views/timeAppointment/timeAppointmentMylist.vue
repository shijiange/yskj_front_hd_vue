<template>
  <div class="timeAppointmentMylist">
    <c-title :hide="false" :text="listStatus == 1 ? '我的预约' : appointmentLang.reserve_obj+'记录'"></c-title>
    <van-tabs v-model="active" @change="tabChange">
      <van-tab title="全部"></van-tab>
      <van-tab title="待核销"></van-tab>
      <van-tab title="已完成"></van-tab>
    </van-tabs>
    <div class="list-item">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="face">
          <img :src="item.goods_thumb" />
        </div>
        <div class="content">
          <div class="order">
            <div class="order_sn">{{ item.order_sn }}</div>
            <div class="status">{{ checkStatus(item.status) }}</div>
          </div>
          <div class="text text-overHide">{{ appointmentLang.service }}：{{ item.goods_title }}</div>
          <div class="text" v-if="listStatus == 1 || (listStatus == 2 && is_boss == 1)">{{ appointmentLang.reserve_obj }}：{{ item.obj_name }}</div>
          <div class="text" v-if="listStatus == 2 && is_boss == 1">客户：{{ item.customer_name }} ({{ item.customer_tel }})</div>
          <div class="text">预约时间：{{ item.begin_time_str }}</div>
          <div class="operation" v-if="operationList(item)">
            <div class="icon" @click="goToAdress">
              <i class="iconfont icon-fontclass-daohang"></i>
            </div>
            <div class="btns">
              <div class="btn-item" @click="tapPost(item)" v-if="(item.status == 0 || item.status == 9) && item.refund_id == 0">核销</div>
              <div class="btn-item" @click="toRefundDetail(item)" v-if="item.refund_id != 0 && item.status != 3&& item.status != 1">售后中</div>
              <div class="btn-item cancel" @click="sure(item.order_id)" v-if="(item.status == 0 || item.status == 9) && item.refund_id == 0">取消预约</div>
            </div>
          </div>
        </div>
      </div>
      <div class="loadNomore" v-show="list.length == 0 || !isLoadMore">
        <img src="@/assets/images/no-more-product.png" />
      </div>
    </div>
    <van-popup v-model="codeShow" round closeable>
      <div class="codeBox">
        <span class="txt">请核销员扫码</span>
        <div class="codeimg" @click="handImagePreview">
          <img :src="qr_code_url" alt="" />
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
import { scrollMixin } from "../../utils/mixin";
import { Toast ,Dialog } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      listStatus: "",
      list: [],
      is_boss: 0,
      store_info: "",
      // lat: "",
      // lng: "",
      // address: "",
      codeShow: false,
      qr_code_url: "",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.listStatus = this.$route.params.status;
    if (this.listStatus == 1) {
      this.fun.setWXTitle("我的预约");
      // this.fun
      //   .getLocation("正在定位")
      //   .then(res => {
      //     this.address = res.title;
      //     this.lat = res.point.lat;
      //     this.lng = res.point.lng;
      //   })
      //   .catch(err => {});
    } else {
      this.fun.setWXTitle(`${this.appointmentLang.reserve_obj}记录`);
    }
    this.getData();
    this.getStore();
  },
  methods: {
    toRefundDetail(item) {
      this.$router.push(
        this.fun.getUrl("aftersales", {
          refund_id: item.refund_id
        })
      );
    },
    handImagePreview() {
      let url = this.qr_code_url;
      ImagePreview({
        images: [url],
        startPosition: 0
      });
    },
    sure(ids){
      Dialog.confirm({
        title: '',
        message:
          '您确定要取消此预约吗',
      })
        .then(() => {
          this.$router.push(this.fun.getUrl("refund", { order_id: ids, order_type: 1 }, { }));
        })
        .catch((err) => {
          console.log(err);
        });

    },
    tapPost(item) {
      let order_id = item.order_id;
      $http
        .get("plugin.reserve-simple.frontend.reserve-order.qr-code-url", { id: order_id })
        .then(response => {
          if (response.result === 1) {
            this.qr_code_url = response.data.qr_code_url;
            this.codeShow = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goToAdress() {
      let point = this.fun.bd_decrypt(this.store_info.lng, this.store_info.lat);
      this.fun.goToWXAdress(point, this.store_info.name, this.store_info.full_address);
    },
    tabChange() {
      this.initData();
      this.getData();
    },
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.list = [];
    },
    getStore() {
      $http
        .get("plugin.reserve-simple.frontend.index.get-shop-info", {})
        .then(response => {
          if (response.result === 1) {
            this.store_info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      let url = "";
      if (this.listStatus == 1) {
        // 我的预约
        url = "plugin.reserve-simple.frontend.reserve-order.get-my-list";
      } else {
        // 预约人员记录
        url = "plugin.reserve-simple.frontend.reserve-order.get-all-list";
      }
      $http
        .get(url, { reserve_type: this.active }, "加载中")
        .then(response => {
          if (response.result === 1) {
            if (this.listStatus == 1) {
              this.list = response.data.data;
            } else {
              this.list = response.data.list.data;
              this.is_boss = response.data.is_boss;
            }
            this.isLoadMore = true;
            this.total_page = this.listStatus == 1 ? response.data.last_page : response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      let url = "";
      if (this.listStatus == 1) {
        url = "plugin.reserve-simple.frontend.reserve-order.get-my-list";
      } else {
        url = "plugin.reserve-simple.frontend.reserve-order.get-all-list";
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        $http.get(url, { reserve_type: this.active, page: this.page }, "加载中").then(res => {
          this.isLoadMore = true;
          if (res.result === 1) {
            var nextPageData = [];
            if (this.listStatus == 1) {
              nextPageData = res.data.data;
            } else {
              nextPageData = res.data.list.data;
            }
            if (this.page == this.total_page) {
              this.isLoadMore = false;
            }
            this.list = this.list.concat(nextPageData);
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        });
      }
    },
    checkStatus(sta) {
      if (sta == 0) {
        return "未完成";
      } else if (sta == 1) {
        return "已完成";
      } else if (sta == 2) {
        return "申请取消";
      } else if (sta == 3) {
        return "取消成功";
      } else if (sta == 9) {
        return "取消失败";
      }
    },
    operationList(item) {
      if (this.listStatus == 1) {
        return true;
      }
    },
    operation(item) {
      if (item.status == 0 || item.status == 2 || item.status == 9) {
        return true;
      } else {
        return false;
      }
    }
  },
  computed: {
    appointmentLang() {
      if (this.$store.state.shopLanguage?.reserve_simple) {
        return this.$store.state.shopLanguage.reserve_simple;
      } else {
        return { reserve_obj: "预约人员", service: "服务" };
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.loadNomore {
  display: flex;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    width: 5rem;
    height: 5rem;
  }
}
.codeBox {
  width: 13rem;
  height: 15rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .txt {
    color: #fe5e56;
    font-size: 1.3rem;
  }
  .codeimg {
    width: 10rem;
    height: 10rem;
    background: #666666;
    margin-top: 1rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.list-item {
  padding-bottom: 2rem;
}
.list-item .item {
  display: flex;
  padding: 1.0938rem 0.9375rem 0.9375rem 0.9375rem;
  margin-bottom: 0.625rem;
  background-color: #fff;
}
.list-item .item .face {
  width: 5.3125rem;
  height: 5.3125rem;
  border-radius: 0.3125rem;
}
.list-item .item .face img {
  width: 5.3125rem;
  height: 5.3125rem;
  border-radius: 0.3125rem;
}
.list-item .item .content {
  flex: 1;
  padding-left: 0.5625rem;
  overflow: hidden;
}
.list-item .item .content .order {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.list-item .item .content .order .order_sn {
  font-size: 0.6875rem;
  color: #666666;
}
.list-item .item .content .order .status {
  font-size: 0.6875rem;
  color: #fe5e56;
}
.list-item .item .content .text {
  text-align: left;
  margin-top: 0.363rem;
  font-size: 0.75rem;
  color: #333333;
}
.list-item .item .content .operation {
  display: flex;
  padding-top: 0.625rem;
}
.list-item .item .content .operation .icon {
  flex: 1;
  text-align: left;
}
.list-item .item .content .operation .icon .iconfont {
  color: #fc8200;
}
.list-item .item .content .operation .btns {
  display: flex;
}
.list-item .item .content .operation .btns .btn-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.75rem;
  height: 1.3125rem;
  font-size: 0.6875rem;
  color: #fe5e56;
  border-radius: 0.6563rem;
  border: solid 0.0313rem #fe5e56;
}
.list-item .item .content .operation .btns .btn-item.cancel {
  margin-left: 0.625rem;
  color: #666666;
  border: solid 0.0313rem #a7a7a7;
}
</style>