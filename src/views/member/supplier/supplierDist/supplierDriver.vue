<template>
  <div class="supplierDriver">
    <c-title :hide="false" text="配送入口"></c-title>
    <div class="driver">
      <div class="driverUser">
        <div class="driverUserImg">
          <img src="../../../../assets/images/suppliserdist/toux.png" alt="" />
        </div>
        <div class="driverUsetDetail">
          <span class="name" v-if="info.consigneeInfo">{{ info.consigneeInfo.realname }}</span>
          <span class="phone" v-if="info.consigneeInfo"
            >{{ info.consigneeInfo.mobile }}
            <!-- 详情内容 start -->
            <a :href="`tel:${info.consigneeInfo.mobile}`"><i class="iconfont icon-zx_map_tel" v-if="!isCode"></i></a>
            <!-- 详情内容 end -->
          </span>
        </div>
      </div>
      <div class="loaction">
        <div class="loactionDetail">
          <i class="iconfont icon-icon_location"></i>
          <span class="toponyms" v-if="isCode">{{ info.consigneeInfo ? info.consigneeInfo.address:'' }}</span>
          <span class="toponyms" v-if="!isCode">{{ info.deliveryInfo ? (info.deliveryInfo.has_one_relevance_order ? info.deliveryInfo.has_one_relevance_order.address : '') : '' }}</span>
        </div>
        <!-- 详情内容 start-->
        <i class="iconfont icon-fontclass-tuiguang2" v-if="!isCode" @click="goToAdress(info)"></i>
        <!-- 详情内容 end-->
      </div>
    </div>
    <!-- 详情内容 start -->
    <div class="detail" v-if="!isCode">
      <div class="detail_box">
        <span class="text_1">订单号</span>
        <span class="text" v-if="info.deliveryInfo">{{ info.deliveryInfo.order_sn }}</span>
      </div>
      <div class="detail_box">
        <span class="text_1">发货时间</span>
        <span class="text" v-if="info.deliveryInfo">{{ this.fun.timestampToTime(info.deliveryInfo.scan_time) }}</span>
      </div>
      <div class="detail_box">
        <span class="text_1">状态</span>
        <span class="text" v-if="info.deliveryInfo">{{ info.deliveryInfo.delivery_status_text }}</span>
      </div>
    </div>
    <!-- 详情内容 end-->
    <div class="products" v-if="info.orderGoodsInfo">
      <shop-list :infoData="info.orderGoodsInfo"></shop-list>
    </div>
    <template v-if="!isCode">
      <div class="products_img products" v-if="info.deliveryInfo && info.deliveryInfo.confirm_credentials">
        <div class="shop_title">图片</div>
        <div class="imgbox">
          <div class="minImgBox" v-for="(item, ind) in info.deliveryInfo.confirm_credentials" :key="ind">
            <img :src="item" alt="" />
          </div>
        </div>
      </div>
    </template>
    <div class="btn" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <!-- is_send == 1可以发货 -->
      <div class="btnBox" @click="sureTap" v-if="isCode && info.is_send == 1">确认</div>
      <div class="btnBox" @click="sureTap_iscode(info.deliveryInfo.id)" v-if="!isCode && info.deliveryInfo && info.deliveryInfo.delivery_status == 1">确认收货</div>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '17.59rem' }">
      <div class="popBox">
        <div class="popTop">
          <div></div>
          <span>确认收货</span>
          <i class="iconfont icon-close11" @click="show = false"></i>
        </div>
        <yz_uploader v-model="fileList1"></yz_uploader>
        <div class="btn" @click="confirm">确认收货</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
import shopList from "./components/list";
import yz_uploader from "components/ui_components/yz_uploader";
export default {
  data() {
    return {
      // 是否是扫码进入的
      isCode: "",
      info: [],
      show: false,
      fileList1: [],
      order_id: "",
      point: {
        lng: "",
        lat: ""
      },
      address: "",
    };
  },
  methods: {
    goToAdress(e) {
      let info = e.deliveryInfo.has_one_relevance_order;
      // let point = this.fun.bd_decrypt(info.longitude, info.latitude);
      let point = {
        lat: "",
        lng: ""
      };
      point.lat = info.latitude;
      point.lng = info.longitude;
      this.fun.goToWXAdress(point, "", info.address);
    },
    // 司机扫码入口
    codeGetData() {
      $http
        .get(
          "plugin.supplier-driver-distribution.frontend.delivery-order.driverScanCodePage",
          {
            delivery_order_id: this.$route.params.id
          },
          ""
        )
        .then(res => {
          if (res.result == 1) {
            this.info = res.data;
          } else {
            Toast(res.msg);
          }
        });
    },
    // 配送订单详情入口
    getDetail() {
      $http
        .get(
          "plugin.supplier-driver-distribution.frontend.delivery-order.deliveryOrderDetail",
          {
            delivery_order_id: this.$route.params.id
          },
          ""
        )
        .then(res => {
          if (res.result == 1) {
            this.info = res.data;
          } else {
            Toast(res.msg);
          }
        });
    },
    // 扫码确认
    sureTap() {
      $http
        .get(
          "plugin.supplier-driver-distribution.frontend.delivery-order.confirmScanAction",
          {
            delivery_order_id: this.$route.params.id
          },
          ""
        )
        .then(res => {
          if (res.result == 1) {
            Toast(res.msg);
            this.codeGetData();
            setTimeout(() => {
              // 只用于手机端先不加限制了
              wx.scanQRCode({
                needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                  // var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                }
              });
            }, 500);
          } else {
            Toast(res.msg);
          }
        });
    },
    sureTap_iscode(id) {
      // 确认收货
      this.show = true;
      this.order_id = id;
    },
    // 确认收货
    confirm() {
      $http
        .get(
          "plugin.supplier-driver-distribution.frontend.delivery-order.confirmReceive",
          {
            delivery_order_id: this.order_id,
            confirm_credentials: JSON.stringify(this.fileList1),
            lng: this.point.lng,
            lat: this.point.lat
          },
          ""
        )
        .then(res => {
          if (res.result == 1) {
            // 确认收货完成
            this.show = false;
            this.getDetail();
            Toast(res.msg);
            if (res.data.next_delivery_address.length == 0) {
              // console.log(res.data.next_delivery_address)
              return;
            } else {
              let point = {
                lat: res.data.next_delivery_address.latitude,
                lng: res.data.next_delivery_address.longitude
              };
              this.fun.goToWXAdress(point, "", res.data.next_delivery_address.address);
            }
          } else {
            Toast(res.msg);
          }
        });
    }
  },
  activated() {
    // 有code是扫码页面
    if (this.$route.params.code) {
      this.isCode = true;
      this.codeGetData();
    } else {
      // 没有是详情
      this.isCode = false;
      this.fun
        .getLocation("正在定位")
        .then(res => {
          this.address = res.title;
          this.point = this.fun.bd_encrypt(res.point.lng, res.point.lat);
        })
        .catch(err => {
        });
      this.getDetail();
    }
  },
  components: { shopList, yz_uploader }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.pcStyle {
  width: 375px !important;
}
.products_img {
  padding: 0.94rem;
  box-sizing: border-box;
  .imgbox {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .minImgBox {
      width: 4.06rem;
      height: 4.06rem;
      margin-right: 0.25rem;
      margin-bottom: 0.3rem;
      img {
        width: 4.06rem;
        height: 4.06rem;
      }
    }
  }
  .shop_title {
    text-align: left;
    font-size: 0.88rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
}
.btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3.13rem;
  background-color: #ffffff;
  box-shadow: 0rem -0.12rem 0.28rem 0rem rgba(205, 205, 205, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  .btnBox {
    width: 20.63rem;
    height: 2.19rem;
    background-color: #f15354;
    border-radius: 1.09rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
}
.supplierDriver {
  padding-bottom: 3rem;
  .detail {
    padding: 0.94rem 0.97rem;
    box-sizing: border-box;
    background: #fff;
    margin: 0.63rem 0 0.63rem;
    .detail_box:last-child {
      margin-bottom: 0;
    }
    .detail_box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.09rem;
      span {
        flex-shrink: 0;
        font-size: 0.81rem;
      }
      .text_1 {
        color: #787878;
      }
    }
  }
  .products {
    margin-top: 0.63rem;
    background-color: #fff;
    .productTxt {
      text-align: left;
      width: 100%;
    }
  }
  .driver {
    padding-left: 0.91rem;
    padding-top: 1.09rem;
    padding-right: 0.91rem;
    padding-bottom: 1.06rem;
    box-sizing: border-box;
    background-color: #fff;
    .loaction {
      display: flex;
      align-items: center;
      margin-top: 0.94rem;
      justify-content: space-between;
      .iconfont {
        color: #ff6b1b;
      }
      .loactionDetail {
        display: flex;
        align-items: center;
        overflow: hidden;
        .toponyms {
          font-size: 0.81rem;
          color: #202020;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .driverUser {
      display: flex;
      align-items: center;
      .driverUsetDetail {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .name {
          width: 100%;
          text-align: left;
          font-size: 0.94rem;
        }
        .phone {
          font-size: 0.75rem;
          width: 100%;
          text-align: left;
          .iconfont {
            color: #ff6b1b;
          }
        }
      }
      .driverUserImg {
        width: 2.06rem;
        height: 2.06rem;
        border-radius: 100%;
        margin-right: 0.56rem;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
    }
  }
}
.popBox {
  width: 100%;
  height: 100%;
  padding: 1.28rem 1.31rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 4rem;
  .btn {
    width: 20.63rem;
    height: 2.19rem;
    background-color: #f15354;
    border-radius: 1.09rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 0.94rem;
    margin: 0 auto;
    margin-top: 1.13rem;
    position: fixed;
    bottom: 0.94rem;
    left: 1.41rem;
  }
  .photoBox {
    flex: 1;
    overflow-y: auto;
    width: 100%;
    display: flex;
    margin-top: 1.5rem;
    flex-wrap: wrap;
    padding-top: 0.5rem;
    .showImage {
      width: 4.06rem;
      height: 4.06rem;
      border-radius: 0.13rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      background: #000;
      position: relative;
      .iconfont {
        position: absolute;
        top: -7px;
        right: -6px;
        color: #a4a4a4;
      }
    }
    .upLoadBox {
      width: 4.06rem;
      height: 4.06rem;
      border-radius: 0.13rem;
      border: dashed 0.03rem #dedede;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #999999;
      margin-right: 0.5rem;
      .iconfont {
        font-size: 2rem;
      }
    }
  }
  .popTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 1rem;
    }
    .iconfont {
      font-size: 0.6rem;
      color: rgba(177, 177, 177, 0.71);
    }
  }
}
</style>