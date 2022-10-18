<template>
  <div id="EntranceA">
    <div class="Entrance" v-for="(item, ind) in infoData" :key="ind" @click="goDetail(item.id)">
      <div class="orderSn">订单号：{{ item.order_sn }}</div>
      <div class="user">
        <div class="userL">
          <div class="userLimg">
            <img src="../../../../../assets/images/suppliserdist/toux.png" alt="" />
          </div>
          <div class="userLD" v-if="item.has_one_order_address">
            <span>{{ item.has_one_order_address.realname }}</span>
            <div class="phone">
              {{ item.has_one_order_address.mobile }}
              <a :href="`tel:${item.has_one_order_address.mobile}`"><i class="iconfont icon-zx_map_tel"></i></a>
            </div>
          </div>
        </div>
        <div class="userR">{{ item.distance }}{{ item.unit }}</div>
      </div>
      <div class="loaction">
        <div class="loactionDetail">
          <i class="iconfont icon-icon_location"></i>
          <span class="toponyms" v-if="item.has_one_relevance_order">{{ item.has_one_relevance_order.address }}</span>
        </div>
        <i class="iconfont icon-fontclass-tuiguang2" @click.stop="goToAdress(item)"></i>
      </div>
      <div class="shop">
        <div class="shopimg">
          <img :src="item.thumb" alt="" />
        </div>
        <span class="txt">共{{ item.goods_total }}件</span>
      </div>
      <div class="btn" @click.stop="tapSure(item.id)" v-if="delivery_status == 0">确认收货</div>
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '17.59rem' }">
      <div class="popBox">
        <div class="popTop">
          <div></div>
          <span>确认收货</span>
          <i class="iconfont icon-close11" @click.stop="show = false"></i>
        </div>
        <yz_uploader v-model="fileList1"></yz_uploader>
        <div class="btn" @click.stop="confirm">确认收货</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import yz_uploader from "components/ui_components/yz_uploader";
import { Toast } from "vant";
export default {
  props: {
    infoData: {
      type: Array
    },
    delivery_status: {
      type: null
    },
    point: {
      type: null
    }
  },
  data() {
    return {
      show: false,
      fileList1: []
    };
  },
  methods: {
    closeTap() {
      this.show = false;
    },
    tapSure(id) {
      this.show = true;
      this.order_id = id;
    },
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
            this.$emit("ListenChild", true);
            Toast(res.msg);
            if (res.data.next_delivery_address.length == 0) {
              return;
            } else {
              let point = {
                lat: res.data.next_delivery_address.latitude,
                lng: res.data.next_delivery_address.longitude
              };
              this.fun.goToWXAdress(point, "", res.data.next_delivery_address.address);
            }
          } else {
            this.show = false;
            this.$emit("ListenChild", true);
            Toast(res.msg);
          }
        });
    },
    goToAdress(item) {
      let point = {
        lat: "",
        lng: ""
      };
      point.lat = item.has_one_relevance_order.latitude;
      point.lng = item.has_one_relevance_order.longitude;
      // let pointa = this.fun.bd_decrypt(point.lng, point.lat);
      this.fun.goToWXAdress(point, "", item.has_one_relevance_order.address);
    },
    goDetail(kid) {
      this.$router.push(this.fun.getUrl("supplierDriver", { id: kid }));
    }
  },
  components: { yz_uploader }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#EntranceA {
  padding-bottom: 2rem;
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
}
.Entrance:first-child {
  margin-top: 0;
}
.Entrance {
  padding: 0.69rem 0.91rem 1.03rem 0.91rem;
  box-sizing: border-box;
  background: #fff;
  margin-top: 0.63rem;
  .btn {
    width: 20rem;
    height: 2.19rem;
    background-color: #f15354;
    border-radius: 0.31rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 0.94rem;
    margin: 0 auto;
    margin-top: 1.13rem;
  }
  .shop {
    width: 21.56rem;
    height: 3.81rem;
    background-color: #f5f5f5;
    border-radius: 0.31rem;
    margin-top: 1.03rem;
    padding: 0.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .txt {
      font-size: 0.81rem;
    }
    .shopimg {
      margin-right: 0.53rem;
      width: 2.81rem;
      height: 2.81rem;
      background-color: #c3c3c3;
      border-radius: 0.31rem;
      img {
        width: 2.81rem;
        height: 2.81rem;
        border-radius: 0.31rem;
      }
    }
  }
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
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.97rem;
    .userR {
      font-size: 0.75rem;
      color: #999999;
    }
    .userL {
      display: flex;
      align-items: center;
      .userLD {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .phone {
          font-size: 0.75rem;
          .iconfont {
            margin-left: 0.4rem;
            color: #ff6b1b;
          }
        }
        span {
          font-size: 0.94rem;
        }
      }
      .userLimg {
        border-radius: 100%;
        width: 2.06rem;
        height: 2.06rem;
        margin-right: 0.56rem;
        img {
          width: 2.06rem;
          border-radius: 100%;
          height: 2.06rem;
        }
      }
    }
  }
  .orderSn {
    font-size: 0.69rem;
    color: #999999;
    text-align: left;
    width: 100%;
  }
}
</style>