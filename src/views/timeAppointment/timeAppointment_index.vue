<template>
  <div class="timeAppointment_index">
    <c-title :hide="false" text="分时预约"></c-title>
    <div class="headTop">
      <div class="loc" @click="goDw">
        <i class="iconfont icon-fontclass-dizhi"></i>
        <span class="locTxt">{{ address }}</span>
        <i class="iconfont icon-advertise-next"></i>
      </div>
      <div class="search" @click="goSearch(0)">
        <i class="iconfont icon-all_search_2"></i>
        <span>请输入搜索内容</span>
      </div>
    </div>
    <div class="shopStoreConten">
      <div class="shopName">{{ store_info.name }}</div>
      <div class="shopadress">{{ store_info.full_address }}</div>
      <div class="distance">
        <span>距您{{ store_info.distance }}{{ store_info.distance_unit }}</span>
        <div class="rightIcon">
          <i class="iconfont icon-fontclass-yunkefu" @click="cserviceShow = !cserviceShow"></i>
          <div class="line"></div>
          <i class="iconfont icon-fontclass-tuiguang2" @click="goToAdress"></i>
        </div>
      </div>
    </div>

    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in carousels" :key="item.id">
          <img :src="item.thumb" alt="" @click="tapLink(item.link)" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 人气推荐 -->
    <div class="recommend">
      <div class="titleBox">
        <div class="titleBox_left">
          <i class="iconfont icon-fontclass-dianzan" style="color: #ff7500"></i>
          人气推荐
        </div>
        <div class="titleBox_right" @click="goSearch(1)">更多 <i class="iconfont icon-advertise-next"></i></div>
      </div>
      <div class="recommendList">
        <div class="lis" v-for="item in recomm" :key="item.id" @click="goUser(item.id)">
          <div class="image">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="intro">{{ item.description }}</div>
        </div>
      </div>
    </div>
    <div class="lineNone"></div>
    <!-- 精选 -->
    <div class="choiceness">
      <div class="titleBox">
        <div class="titleBox_left">
          <i class="iconfont icon-fontclass-pingfen" style="color: #ff0000"></i>
          为你精选
        </div>
      </div>
      <i-Sort :good="sortGood" @tapJson="getChild"></i-Sort>
    </div>
    <cservice-pop :show="cserviceShow" :cservice="cservice_info.cservice" :service_QRcode="cservice_info.service_QRcode" :service_mobile="cservice_info.service_mobile"></cservice-pop>
  </div>
</template>
<script>
import ISort from "./component/sortList";
import cservicePop from "@/components/goods/children/plugin/cservicePopup";
import { scrollMixin } from "../../utils/mixin";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      lng: "",
      lat: "",
      address: "",
      store_info: {},
      recomm: [],
      cservice_info: [],
      carousels: [],
      cserviceShow: false,
      sortGood: [],
      postjson: {},

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
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
  activated() {
    window.scrollTo(0, 0);
    // 定位
    this.fun
      .getLocation("正在定位")
      .then(res => {
        this.address = res.title;
        this.lat = res.point.lat;
        this.lng = res.point.lng;
        this.getData();
      })
      .catch(err => {});
    this.initData();
    this.getGood();
  },
  methods: {
    goDw() {
      this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: "timeAppointment_index" }));
    },
    goUser(kid) {
      this.$router.push(this.fun.getUrl("AppointmentUserDe", { id: kid }));
    },
    getChild(e) {
      this.initData();
      this.postjson = e;
      this.postjson.page = this.page;
      this.getGood(this.postjson);
    },
    tapLink(link) {
      if (!link) return;
      window.location.href = link;
    },
    goToAdress() {
      let point = {
        lng: this.store_info.lng,
        lat: this.store_info.lat
      };
      this.fun.goToWXAdress(point, this.store_info.name, this.store_info.full_address);
    },
    goSearch(key) {
      this.$router.push(this.fun.getUrl("timeAppointment_search", { ind: key }));
    },
    getGood(json) {
      if (!json) {
        json = {};
        json.page = this.page;
      }
      $http
        .get("plugin.reserve-simple.frontend.goods.search-goods", json, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.sortGood = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
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
    getData() {
      let p = this.fun.bd_encrypt(this.lng, this.lat);
      let json = {
        lng: p.lng,
        lat: p.lat
      };
      $http
        .get("plugin.reserve-simple.frontend.index.get-data", json, "加载中")
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            this.store_info = response.data.store_info;
            this.cservice_info = response.data.cservice;
            this.carousels = response.data.carousels;
            this.recomm = response.data.recommand_obj_list;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        this.postjson.page = this.page;
        $http.get("plugin.reserve-simple.frontend.goods.search-goods", this.postjson).then(res => {
          this.isLoadMore = true;
          if (res.result === 1) {
            var nextPageData = res.data.data;
            this.listData = this.listData.concat(nextPageData);
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        });
      }
    },
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    }
  },
  components: {
    ISort,
    cservicePop
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.lineNone {
  width: 23.44rem;
  height: 0.63rem;
  background-color: #f6f6f6;
}
.timeAppointment_index {
  .choiceness {
    padding-top: 1.25rem;
    padding-left: 0.91rem;
    padding-bottom: 1.25rem;
    background: #fff;

    .titleBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .titleBox_right {
        margin-right: 0.94rem;
        font-size: 0.75rem;
        color: #666666;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 1.2rem;
          margin-top: 0.16rem;
          color: #000;
        }
      }
      .titleBox_left {
        flex: 1;
        position: relative;
        font-size: 1.06rem;
        color: #353434;
        font-weight: bold;
        text-align: left;
        .iconfont {
          font-size: 1.4rem;
        }
      }
    }
  }
  .recommend {
    padding-top: 1.25rem;
    padding-left: 0.91rem;
    padding-bottom: 1.25rem;
    background: #fff;
    .recommendList {
      overflow-x: scroll;
      width: 100%;
      margin-top: 1.38rem;
      display: flex;
      .lis {
        margin-right: 0.63rem;
        flex-shrink: 0;
        width: 8.13rem;
        height: 9.69rem;
        background-color: #ffffff;
        box-shadow: 0rem 0.06rem 0.25rem 0rem rgba(211, 211, 211, 0.66);
        border-radius: 0.31rem;
        border: solid 0.03rem #d9dadf;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.91rem 0.63rem;
        box-sizing: border-box;
        .image {
          width: 2.81rem;
          height: 2.81rem;
          background-color: #dcdcdc;
          border-radius: 100%;
          margin-bottom: 0.63rem;
          img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
        }
        .name {
          font-size: 0.81rem;
          color: #4f4f4f;
          margin-bottom: 0.3rem;
        }
        .intro {
          color: #666666;
          font-size: 0.69rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-align: left;
        }
      }
    }
    .titleBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .titleBox_right {
        margin-right: 0.94rem;
        font-size: 0.75rem;
        color: #666666;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 1.4rem;
          color: #000;
        }
      }
      .titleBox_left {
        flex: 1;
        font-size: 1.06rem;
        color: #353434;
        font-weight: bold;
        z-index: 999;
        text-align: left;
        .iconfont {
          font-size: 1.4rem;
        }
      }
    }
  }
  .banner {
    width: 100%;
    height: 9.38rem;
    margin-top: 0.63rem;
    .my-swipe {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .shopStoreConten {
    height: 6.41rem;
    background-color: #ffffff;
    border-radius: 0.31rem;
    margin: 0 0.63rem;
    margin-top: -2.13rem;
    padding: 0.97rem 0.94rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .distance {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .rightIcon {
        display: flex;
        align-items: center;
        .line {
          width: 1px;
          height: 1rem;
          background-color: #c3c3c3;
          margin: 0 1.16rem;
        }
        .icon-fontclass-yunkefu {
          color: #fc8200;
        }
        .icon-fontclass-tuiguang2 {
          color: #f42a26;
        }
      }
    }
    .shopName {
      text-align: left;
      font-size: 1rem;
      color: #353434;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shopadress {
      text-align: left;
      font-size: 0.81rem;
      color: #262626;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .headTop {
    height: 8.13rem;
    background-image: linear-gradient(180deg, #ed3836 0%, #f5502b 38%, #fc6720 100%);
    border-radius: 0rem 0rem 1.56rem 1.56rem;
    padding: 1.31rem 0.94rem 2.81rem 0.94rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    .search {
      width: 100%;
      height: 1.88rem;
      background-color: #ffffff;
      border-radius: 0.94rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 1rem;
      color: #999999;
      .iconfont {
        margin-right: 0.38rem;
      }
    }
    .loc {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-advertise-next {
        margin-left: 1.97rem;
        color: #fff;
        font-size: 1.2rem;
      }
      .icon-fontclass-dizhi {
        margin-right: 0.44rem;
        color: #fff;
        font-size: 1.2rem;
      }
      .locTxt {
        text-align: left;
        color: #fff;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>