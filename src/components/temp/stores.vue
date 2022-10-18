<template>
  <div>
    <div class="store-list" @click="toRouter(items)" v-for="(items, i) in stores" :key="i" :style="{ 'background-color': datas.params.bgcolor }">
      <div class="newList">
        <div class="store-img">
          <a class="store-logo">
            <span class="img-mask" v-if="items.operating_state === 1"></span>
            <span class="img-text" v-if="items.operating_state === 1">商家休息中</span>
            <img v-lazy="items.thumb" :style="{borderRadius: (items.logo_style?'0':'50%')}" />
          </a>
          <div class="store-category">
            <span @click.stop="toClassify(items.has_one_category.id)" class="da store-category-name" :style="{ color: datas.params.catecolor, backgroundColor: datas.params.classcolor }">{{
              items.has_one_category.name
            }}</span>
            <span class="da store-category-name" :style="{ color: datas.params.catecolor, backgroundColor: datas.params.classcolor }" v-if="!items.has_one_category">暂无分类</span>
          </div>
        </div>
        <!--new-->
        <div class="store-intro2">
          <h2 :style="{ color: datas.params.namecolor }">{{ items.store_name }}</h2>
          <div class="score-box">
            <div class="score-left">
              <i class="iconfont icon-card_collect_b"></i>
              <span>{{ items.average_score }}分</span>
              <span v-if="datas.params.showsale != '0'" style="margin-left: 0.5rem;">已售{{ items.order_total }}单</span>
            </div>
            <div class="score-right" :style="{ color: datas.params.discolor }" @click.stop="goToAdress(items)" v-if="items.distance">
              {{ items.distance }}{{ items.unit }} <i class="iconfont icon-all_daohang"></i>
            </div>
          </div>
          <div class="discount-box">
            <p class="discount-item" v-if="items.has_many_coupon && items.has_many_coupon.length > 0">
              <span class="red" :style="{ color: datas.params.titlecolor }">优惠</span>
              <span style="margin-left: 0.5rem;" :style="{ color: datas.params.salecolor }" v-for="(coupon, index) in items.has_many_coupon" :key="index" v-if="index <= 2">{{ coupon.name }}</span>
            </p>
            <p class="discount-item" v-if="(datas.params.showscore != '0' || datas.params.showlove == 1) && (items.store_point.point_switch != 0 || items.store_love.award == 1)">
              <span class="red" :style="{ color: datas.params.titlecolor }">赠送</span>
              <span style="margin-left: 0.5rem;" :style="{ color: datas.params.salecolor }" v-if="datas.params.showscore == '0' || items.store_point.point_switch == 0 ? false : true">{{
                items.store_point.point
              }}</span>
              <span style="margin-left: 0.5rem;" :style="{ color: datas.params.salecolor }" v-if="datas.params.showlove == 1 && items.store_love.award == 1 ? true : false">{{
                items.store_love.award_proportion
              }}</span>
            </p>
            <p class="discount-item" v-if="(datas.params.showscore != '0' || datas.params.showlove == 1) && (items.store_point.point_deduct_switch != 0 || items.store_love.deduction == 1)">
              <span class="red" :style="{ color: datas.params.titlecolor }">抵扣</span>
              <span style="margin-left: 0.5rem;" :style="{ color: datas.params.salecolor }" v-if="datas.params.showlove == 1 && items.store_love.deduction == 1 ? true : false">{{
                items.store_love.deduction_proportion
              }}</span>
              <span style="margin-left: 0.5rem;" :style="{ color: datas.params.salecolor }" v-if="datas.params.showscore == 0 || items.store_point.point_deduct_switch == 0 ? false : true">{{
                items.store_point.max_point_deduct
              }}</span>
            </p>
          </div>
          <div class="dispatch-box" v-if="items.dispatchs">
            <span v-for="dispatch in items.dispatchs" :style="{ color: datas.params.shipcolor, borderColor: datas.params.shipcolor }" :key="dispatch">{{ dispatch }}</span>
          </div>
        </div>
      </div>

      <div class="goods-box" v-if="items.recommend_goods && items.recommend_goods.length > 0">
        <div class="good-item" v-for="(good, i) in items.recommend_goods" :key="i" @click.stop="toGood(good.goods_id)">
          <div class="good-img">
            <img v-lazy="good.thumb" alt />
          </div>
          <p class="good-title">{{ good.title }}</p>
          <p class="good-price">{{ $i18n.t("money") }}{{ good.price }}</p>
        </div>
      </div>

      <!--new end-->
    </div>
    <div id="allmap"></div>
    <div v-if="showMore">
      <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="loading" @click="getMoreStores">{{ $i18n.t("加载更多") }}</div>
      <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="!loading">{{ $i18n.t("没有更多了") }}~</div>
    </div>
  </div>
</template>
<script>
// import cStar from 'components/star';
// import { Toast } from 'vant';
//import BMap from 'BMap';
export default {
  props: ["datas"],
  // components: { cStar },
  data() {
    return {
      mid: this.fun.getKeyByMid(),
      location: this.$store.state.o2oLocation,
      point: {},
      city: "",
      stores: [],
      address: "",
      //setting sun
      //   allLoaded: true,
      //   loading: false,
      //   pageNum: 1,
      //   resState: false,
      //   pageState: false,
      loading: true,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      showMore: false,

      isActivated: false
    };
  },
  mounted() {
    this.initData();
  },
  created() {},
  activated() {
    this.isActivated = this.$store.state.isSwitchCity;
    console.log("切换了城市------------------------", this.isActivated);
    if (this.isActivated) {
      this.initData();
      this.$store.commit("setSwitchCity", false);
    }
  },
  updated() {
    // this.isActivated = true;
  },
  methods: {
    toGood(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    initData() {
      this.location = this.$store.state.o2oLocation;
      console.log("activated-location", this.location);
      if (this.location.point == undefined) {
        console.log("info===== not exists location.");
        this.ready();
      } else {
        this.point = this.location.point;
        this.city = this.location.city;
      }
      this.showMore = false;
      this.stores = [];
      this.loading = true;
      this.allLoaded = false;
      this.goload = true;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.getStores();
    },
    toSeller(id) {
      this.$router.push({
        name: "HomeSeller",
        params: {
          store_id: id,
          fromHome: 1
        }
      });
    },
    //跳转至分类
    toClassify(id) {
      this.$router.push(
        this.fun.getUrl("o2oCategory", {
          id: id
        })
      );
    },
    goToAdress(items) {
      let point = this.fun.bd_decrypt(items.longitude, items.latitude);
      this.fun.goToWXAdress(point, items.store_name, items.address.detailed_address);
    },
    toRouter(item) {
      if (item.specify_show == 1) {
        this.$router.push(
          this.fun.getUrl("o2oStore_v2", {
            store_id: item.id
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("HomeSeller", {
            store_id: item.id,
            fromHome: 1
          })
        );
      }
    },
    ready() {
      //this.getLocation();
      // var myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   console.log("myLocation:", myLocation);
      //   this.$store.commit("updateLocation", myLocation);
      //   //初始化数据
      //   // this.getStores();
      //   //this.getStoresCategory();
      // } else {
      //   console.log("location不存在");
      //   this.getLocation();
      // }
      this.fun.getLocation()
        .then((res)=> {
          this.address = res.title;
          this.city = res.city;
          this.point = res.point;

          this.pageNum = 1;
          this.loading = true;
          this.stores = [];
          this.isLoadMore = true;
          this.page = 1;
          this.total_page = 0;
          this.getStores();
        })
        .catch((err)=> {
          this.pageNum = 1;
          this.loading = true;
          this.stores = [];
          this.isLoadMore = true;
          this.page = 1;
          this.total_page = 0;
          this.getStores();
          console.log(err);
        });
    },
    getLocation() {
      var that = this;
      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete); // 返回定位信息
        AMap.event.addListener(geolocation, "error", onError); // 返回定位出错信息
      });

      function onComplete(obj) {
        // var res =
        //   '经纬度：' +
        //   obj.position +
        //   '\n精度范围：' +
        //   obj.accuracy +
        //   '米\n定位结果的来源：' +
        //   obj.location_type +
        //   '\n状态信息：' +
        //   obj.info +
        //   '\n地址：' +
        //   obj.formattedAddress +
        //   '\n地址信息：' +
        //   JSON.stringify(obj.addressComponent, null, 4);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        //setting sun
        that.pageNum = 1;
        that.loading = true;
        that.stores = [];
        that.getStores();
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        console.log(obj);
      }

      /*var that = this;
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            console.log('temp stores 您的位置ok：', r);
            that.address = r.address.city;
            that.city = r.address.city;
            that.point = r.point;
            var pos = {
              address: that.address,
              city: that.city,
              title: that.address,
              point: that.point,
            }
            //this.balance = this.$store.state.balance;
            that.$store.commit('updateLocation', pos);
            that.$store.commit('setLocation', pos);
            //window.localStorage.setItem("myLocation",JSON.stringify(pos));
            //setting sun
            this.pageNum = 1;
            this.loading = false;
            that.getStores();
          } else {
            //todo, 获取收货地址
            that.getStores();
          }
        }, {
          enableHighAccuracy: true
        })*/
    },
    tolocation() {
      this.$router.push(this.fun.getUrl("o2oLocation"));
    },
    getStores() {
      var that = this;
      var p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      if (!p.lng) {
        p.lng = "";
        p.lat = "";
      }
      //that.getStoresCategory();
      $http
        .get("plugin.store-cashier.frontend.store.store.get-store-list-to-page", {
          page: this.page,
          kwd: "",
          lng: p.lng,
          lat: p.lat,
          city_name: this.city,
          pagesize: this.datas.params.num,
          showshop: that.datas.params.showshop
        })
        .then(
          response => {
            if (response.result === 1) {
              this.showMore = true;
              this.stores = response.data.data;
              if (response.data.last_page) {
                that.total_page = response.data.last_page;
              } else if (response.data.lastPage) {
                that.total_page = response.data.lastPage;
              }
              if (that.page >= that.total_page) {
                that.loading = false;
              } else {
                that.loading = true;
              }
            }
          },
          response => {
            //alert('网络错误，请稍后再试！')
          }
        );
    },
    // upOther(response) {
    //   if (this.pageNum == 1) {
    //     this.stores = [];
    //   }
    //   this.pageNum = Number(this.pageNum) + 1;
    //   this.loading = false;
    //   this.allLoaded = false;
    //   // 搜索结果为空
    //   if (response.data.total <= 0) {
    //     this.loading = true;
    //     this.allLoaded = true;
    //     return;
    //   }
    //   this.stores = this.stores.concat(response.data.data);
    //   console.log("商品内容", this.stores);
    //   if (response.data.current_page == response.data.last_page) {
    //     this.loading = true;
    //     this.allLoaded = true;
    //     return;
    //   }
    // },
    getMoreStores() {
      var that = this;
      if (this.page == this.total_page) {
        that.loading = false;
        return;
      }
      if (this.page > this.total_page) {
        that.loading = false;
        return;
      } else {
        this.page = this.page + 1;
        var p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
        if (!p.lng) {
          p.lng = "";
          p.lat = "";
        }
        $http
          .get(
            "plugin.store-cashier.frontend.store.store.get-store-list-to-page",
            {
              page: that.page,
              kwd: "",
              lng: p.lng,
              lat: p.lat,
              city_name: that.city,
              pagesize: that.datas.params.num,
              showshop: that.datas.params.showshop
            },
            "加载中..."
          )
          .then(
            function(response) {
              if (response.result === 1) {
                var myData = response.data.data;
                that.loading = true;
                that.allLoaded = false;
                that.stores = that.stores.concat(myData); //数组拼接
                if (that.page == that.total_page) {
                  that.loading = false;
                  console.log("最后一页");
                }
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    loadTop() {
      this.initData();
      this.getStores();
      this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.isLoadMore) {
        this.getMoreStores(this.page);
        this.$refs.loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.p1 {
  position: relative !important;
}

.newList {
  display: flex;
}

.zanwBox {
  width: 6rem;
  height: 8rem;
  flex-shrink: 0;
}

.store-category {
  margin-top: 0.5rem;

  span {
    width: 4rem;
    height: 1.25rem;
    display: block;
    word-wrap: break-word;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 1.25rem;
    cursor: pointer;
    background-color: #ff6333;
    border-radius: 0.313rem;
    color: #fff;
  }
}

.store-list {
  // display: flex;
  padding: 0.75rem;
  border-top: 0.0625rem solid #e7e9e4;

  /* width: 97%; */
  background: #fff;
  font-size: 14px;

  /* font-size: .9rem; */
  color: #333;
  text-align: left;
  position: relative;
}

.store-img {
  /* position: relative; */
  display: flex;
  flex-direction: column;
}

.store-img .store-logo {
  /* position: absolute; */

  /* left: 0.625rem; */

  /* top: 0; */

  /* bottom: 0; */

  /* float: none; */
  width: 4rem;
  height: 4rem;

  .img-mask {
    position: relative;
    top: 60%;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 40%;
    border: 0.0625rem solid #e8e8e8;
    display: inline-block;
    margin-right: 0.5rem;
    font-size: 12px;
    background-color: #3b4043;
    opacity: 0.6;
  }

  .img-text {
    position: relative;
    top: 20%;
    left: 3%;
    z-index: 15;
    width: 100%;
    height: 40%;
    display: inline-block;
    margin-right: 0.5rem;
    font-size: 12px;
    color: white;
  }
}

.store-img img {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 4rem;
  height: 4rem;
  border: 0.0625rem solid #e8e8e8;
  display: inline-block;
  border-radius: 50%;
}

/* new */
.store-intro2 {
  flex: 1;
  position: relative;
  margin-left: 0.75rem;
  display: flex;
  flex-direction: column;

  h2 {
    max-width: 17rem;
    font-size: 14px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    margin-top: 0;
    font-weight: bold;
    flex: 1;
  }

  .score-box {
    display: flex;
    width: 100%;
    color: #666;
    padding: 0.2rem 0;

    .score-left {
      flex: 1;
      align-self: center;
      justify-self: center;

      .icon-card_collect_b {
        color: #ffba00;
      }
    }

    .score-right {
      color: #ff2c29;
      flex: 0 0 4rem;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: space-between;

      i {
        font-size: 20px;
      }
    }
  }

  .discount-box {
    display: flex;
    flex-direction: column;

    .red {
      color: #ff2c29;
    }
  }

  .dispatch-box {
    display: flex;
    padding: 0.5rem 0;

    span {
      margin-right: 0.4rem;
      padding: 0 0.3rem;
      color: #666;
      border-radius: 10px;
      border: solid 1px #ff8400;
    }
  }
}

/* new two  */
.goods-box {
  display: flex;
  // width: 17.4rem;
  overflow-x: scroll;

  .good-item {
    width: 6rem;
    margin-right: 0.56rem;
    font-size: 15px;
    text-align: left;

    .good-img {
      width: 6rem;
      height: 6rem;
      border-radius: 5px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }

    .good-title {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }

    .good-price {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 11px;
      color: #ff2c29;
    }
  }
}

/* new end */
</style>
