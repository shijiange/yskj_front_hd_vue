<template>
  <div id="AppointmentUserDe">
    <c-title :hide="false" text=""></c-title>
    <div class="userDetail">
      <div class="usetTop">
        <div class="imgbox">
          <img :src="obj_info.thumb" alt="" />
        </div>
        <div class="detail">
          <div class="name">{{ obj_info.name }}</div>
          <div class="total">
            {{ appointmentLang.service }}次数：<span class="num">{{ obj_info.reserve_num }}</span>
          </div>
        </div>
      </div>
      <div :class="[tapShow ? '' : 'hidenShow']" class="intro">简介：{{ obj_info.description }}</div>
      <div class="tapBottin" @click="tapShow = !tapShow" v-if="obj_info.description && obj_info.description.length >52">
        <span>展开</span>
        <van-icon :name="tapShow ? 'arrow-up': 'arrow-down'" color="#888888" />
      </div>
    </div>
    <div class="shop">
      <div class="shoptitle">{{ store_info.name }}</div>
      <div class="address">{{ store_info.full_address }}</div>
      <div class="navBtn">
        <div class="service" @click="cserviceShow = !cserviceShow">
          <i class="iconfont icon-fontclass-yunkefu"></i>
          客服
        </div>
        <div class="line"></div>
        <div class="service" @click="goToAdress">
          <i class="iconfont icon-fontclass-tuiguang2"></i>
          导航
        </div>
      </div>
    </div>
    <div class="shopDateil">
      <div class="shoptitle">
        <i class="iconfont icon-fontclass-shangpindingdan"></i>
        {{ appointmentLang.service }}项目
      </div>
      <div class="shopList">
        <div class="lis" v-for="item in goods" :key="item.id" @click="toGood(item.goods_id)">
          <div class="left">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="right">
            <div class="txt">{{ item.title }}</div>
            <div class="sale">已售{{ item.total_sales }}</div>
            <div class="price" v-if="item.has_option == 1">{{ $i18n.t("money") }}{{ item.min_price }}</div>
            <div class="price" v-else>{{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="introDetail">
      <div class="txt">
        <div class="line dr"></div>
        <span> {{ appointmentLang.service }}人员详情 </span>
        <div class="line dl"></div>
      </div>
      <div id="contenBox" v-html="obj_info.content" v-if="obj_info.content"></div>
    </div>
    <cservice-pop :show="cserviceShow" :cservice="cservice_info.cservice" :service_QRcode="cservice_info.service_QRcode" :service_mobile="cservice_info.service_mobile"></cservice-pop>
  </div>
</template>
<script>
import cservicePop from "@/components/goods/children/plugin/cservicePopup";
import { Toast } from "vant";
export default {
  data() {
    return {
      tapShow: false,
      cservice_info: [],
      goods: [],
      obj_info: [],
      store_info: [],
      cserviceShow: false,
      lat: "",
      lng: "",
      address: ""
    };
  },
  activated() {
    this.fun
      .getLocation("正在定位")
      .then(res => {
        this.address = res.title;
        this.lat = res.point.lat;
        this.lng = res.point.lng;
      })
      .catch(err => {});
    this.getData();
    this.fun.setWXTitle(`${this.appointmentLang.reserve_obj}详情`);
  },
  computed: {
    appointmentLang() {
      if (this.$store.state.shopLanguage?.reserve_simple) {
        return this.$store.state.shopLanguage.reserve_simple;
      } else {
        return { reserve_obj: "预约人员", service: "服务" };
      }
    }
  },
  methods: {
    toGood(key) {
      this.$router.push(this.fun.getUrl("goods", { id: key }));
    },
    goToAdress() {
      let point = this.fun.bd_decrypt(this.store_info.lng, this.store_info.lat);
      this.fun.goToWXAdress(point, this.store_info.name, this.store_info.full_address);
    },
    getData() {
      $http
        .get("plugin.reserve-simple.frontend.obj.detail", { id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            this.obj_info = response.data.obj_info;
            this.cservice_info = response.data.cservice;
            this.store_info = response.data.store_info;
            this.goods = response.data.goods_list;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: {
    cservicePop
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.shopDateil {
  margin: 0 0.63rem;
  margin-top: 0.63rem;
  border-radius: 0.31rem;
  background-color: #ffffff;
  padding: 0.97rem 0.94rem;
  text-align: left;
  .shopList {
    display: flex;
    flex-direction: column;
    .lis {
      display: flex;
      overflow: hidden;
      margin-top: 0.94rem;
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .sale {
          font-size: 0.75rem;
          color: #333333;
        }
        .price {
          font-size: 0.88rem;
          color: #fe5e56;
        }
        .txt {
          font-size: 0.88rem;
          color: #2c2c2c;
          font-weight: bold;
        }
      }
      .left {
        margin-right: 0.63rem;
        width: 5.31rem;
        height: 5.31rem;
        background-color: #9d9d9d;
        border-radius: 0.31rem;
        img {
          width: 5.31rem;
          height: 5.31rem;
          background-color: #9d9d9d;
          border-radius: 0.31rem;
        }
      }
    }
  }
  .shoptitle {
    font-size: 1.06rem;
    color: #353434;
    font-weight: bold;
    .iconfont {
      color: #fc8200;
      font-size: 1.35rem;
    }
  }
}
.introDetail {
  border-radius: 0.31rem;
  padding: 0.44rem;
  background-color: #ffffff;
  margin-top: 0.63rem;
  #contenBox {
    width: 100%;
    overflow: hidden;
    img {
      max-width: 100%;
    }

    /deep/em {
      font-style: italic;
    }
  }
  .txt {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    margin-top: 1rem;
    color: #9a9a99;
    padding: 0 0.69rem;
    box-sizing: border-box;
    overflow: hidden;
    .line {
      background: #ced0d2;
      width: 3rem;
      height: 1px;
    }
    .dr {
      margin-right: 0.8rem;
    }
    .dl {
      margin-left: 0.8rem;
    }
  }
}
.shop {
  margin: 0 0.63rem;
  border-radius: 0.31rem;
  background-color: #ffffff;
  padding: 0.97rem 0.94rem;
  text-align: left;
  .navBtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    .line {
      background-color: #c3c3c3;
      width: 0.03rem;
      height: 1.06rem;
    }
    .service {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont {
        font-size: 1rem;
        margin-right: 0.3rem;
      }
      .icon-fontclass-yunkefu {
        color: #fc8200;
      }
      .icon-fontclass-tuiguang2 {
        color: #f42a26;
      }
    }
  }
  .address {
    font-size: 0.81rem;
    color: #262626;
  }
  .shoptitle {
    font-size: 1rem;
    color: #353434;
    font-weight: bold;
    margin-bottom: 0.4rem;
  }
}
.userDetail {
  border-radius: 0.31rem;
  margin: 0.63rem;
  background: #fff;
  padding: 0.94rem;
  padding-right: 1.03rem;
  box-sizing: border-box;
  overflow: hidden;
  .tapBottin {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888888;
  }
  .hidenShow {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .intro {
    margin-top: 0.66rem;
    text-align: left;
    font-size: 0.75rem;
    color: #666666;
    margin-bottom: 0.72rem;
  }
  .usetTop {
    display: flex;
    .detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .name {
        font-size: 0.88rem;
        color: #4f4f4f;
        font-weight: bold;
      }
      .total {
        font-size: 0.75rem;
        .num {
          color: #f14e4e;
        }
      }
    }
    .imgbox {
      width: 2.81rem;
      height: 2.81rem;
      margin-right: 0.72rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>