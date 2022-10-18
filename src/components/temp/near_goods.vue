<template>
  <div id="goods" v-if="show">
    <div
      class="fe-mod fe-mod-8"
      :style="{ backgroundColor: datas.params.bgcolor }"
    >
      <div
        class="fe-mod-8-title"
        v-show="datas.params.showtitle == 0"
        :style="{
          color: datas.params.titlecolor,
          backgroundColor: datas.params.bgcolor
        }"
      >
        <span v-show="datas.params.title.length > 0">{{
          datas.params.title
        }}</span>
      </div>
      <!-- 默认两种样式 -->
      <div
        v-if="
          datas.params.style !== 'hp' &&
            datas.params.style !== 'hotel' &&
            $store.state.temp.item.data[index]
        "
        class="new-goods"
      >
        <template v-if="$store.state.temp.item.data[index].get_info">
          <div
            v-for="(good, i) in $store.state.temp.item.data[index].get_info
              .data"
            :key="i"
          >
            <div
              class="fe-mod-8-good good-new"
              :style="{
                width:
                  datas.params.style == '100%'
                    ? '98%'
                    : datas.params.style == '50%' ||
                      datas.params.style == '49.5%'
                    ? '49%'
                    : '32%',
                marginRight:
                  (datas.params.style == '50%' ||
                    datas.params.style == '49.5%') &&
                  (i + 1) % 2 == '0'
                    ? '0'
                    : datas.params.style == '33.3%' && (i + 1) % 3 == '0'
                    ? '0'
                    : '2%'
              }"
            >
              <a @click.stop.prevent="gotoDetail(good)" href="javascript:;">
                <div class="fe-mod-8-main">
                  <div
                    class="fe-mod-8-main-img"
                    :class="{
                      oo2: datas.params.style == '50%',
                      oo3: datas.params.style == '33.3%'
                    }"
                    :style="{ backgroundImage: 'url(' + good.img + ')' }"
                  >
                    <!-- <img :src="
                              good.img"
                              class="goodimg"
                              width="100%" /> -->
                    <!-- :style="{
                              height:
                                datas.params.style == '49.5%'
                                  ? '40vw'
                                  : datas.params.style == '33.3%'
                                  ? '25vw'
                                  : datas.params.style == '50%'
                                  ? '40vw'
                                  : '95vw'
                            }" -->
                    <div class="saleimg" :class="[datas.params.option]"></div>
                    <div class="distance" v-if="datas.params.distance=='1'">
                      {{good.distance}}{{good.distance_unit}}
                    </div>
                  </div>
                  <div
                    class="fe-mod-8-main-name"
                    v-show="datas.params.showname == 1"
                  >
                    <div class="fe-mod-8-main-name-name">
                      {{ good.name | escapeTitle }}
                    </div>
                  </div>
                  <!-- vip_level_status为价格权限字段，status为1则无权限查看商品价格 -->
                  <div
                    class="card-price"
                    :class="
                      !(
                        datas.params.style == '100%' ||
                        datas.params.style == '50%' ||
                        datas.params.style == '49.5%'
                      )
                        ? 'spce'
                        : ''
                    "
                    v-show="datas.params.price != 0"
                  >
                    <span
                      v-if="
                        !(
                          datas.params.style == '100%' ||
                          datas.params.style == '50%' ||
                          datas.params.style == '49.5%'
                        )
                      "
                      >现:</span
                    >{{$i18n.t('money')}}{{
                      good.vip_level_status && good.vip_level_status.status == 1
                        ? good.vip_level_status.word
                        : good.pricenow
                    }}
                    <div>
                      <span
                        style="text-decoration: line-through; font-size: 12px; color: #808080;"
                        :class="
                          !(
                            datas.params.style == '100%' ||
                            datas.params.style == '50%' ||
                            datas.params.style == '49.5%'
                          )
                            ? 'block'
                            : ''
                        "
                        v-if="
                          datas.params.price == 3 ||
                            (datas.params.price == 1 &&
                              good.priceold != good.pricenow &&
                              good.priceold > 0)
                        "
                        ><span
                          v-if="
                            !(
                              datas.params.style == '100%' ||
                              datas.params.style == '50%' ||
                              datas.params.style == '49.5%'
                            )
                          "
                          >原:</span
                        >{{$i18n.t('money')}}{{ good.priceold }}</span
                      >
                      <span class="card-price colorBlack spce" v-else
                        >&nbsp;</span
                      >
                    </div>
                    <div
                      class="fe-mod-8-main-name-buy add-cart"
                      :class="datas.params.buysub"
                      v-show="datas.params.buysub"
                    ></div>
                  </div>
                  <div
                    class="card-price colorBlack"
                    :class="
                      !(
                        datas.params.style == '100%' ||
                        datas.params.style == '50%' ||
                        datas.params.style == '49.5%'
                      )
                        ? 'spce'
                        : ''
                    "
                    v-show="datas.params.price == 3"
                  >
                    <span
                      v-if="
                        datas.params.style == '100%' ||
                          datas.params.style == '50%' ||
                          datas.params.style == '49.5%'
                      "
                      >会员价</span
                    ><span v-else>会</span>:{{
                      good.vip_level_status && good.vip_level_status.status == 1
                        ? good.vip_level_status.word
                        : good.price_level == 1
                        ? good.vip_price
                        : good.vip_next_price
                    }}
                  </div>
                  <div
                    class="card-price"
                    v-if="
                      datas.params.love == 1 &&
                        good.award == 1 &&
                        (!good.vip_level_status ||
                          good.vip_level_status.status == 0)
                    "
                  >
                    赠送{{ good.award_proportion }}%{{
                      $store.state.temp.designer.love_name || "爱心值"
                    }}
                  </div>
                  <div class="card-price" v-else></div>
                </div>
              </a>
            </div>
          </div>
        </template>
      </div>
      <!-- 横幅样式 -->
      <div
        v-if="datas.params.style === 'hp' && $store.state.temp.item.data[index]"
        class="new-goods"
      >
        <template v-if="$store.state.temp.item.data[index].get_info">
          <div
            v-for="(good, i) in $store.state.temp.item.data[index].get_info
              .data"
            :key="i"
          >
            <a @click.stop.prevent="gotoDetail(good)" href="javascript:;">
              <div class="fe-mod-8-hp-line">
                <div class="fe-mod-8-hp-line-img">
                  <div class="saleimg" :class="[datas.params.option]"></div>
                  <img :src="good.img" />
                  <div class="distance" v-if="datas.params.distance=='1'">
                    {{good.distance}}{{good.distance_unit}}
                  </div>
                </div>
                <div class="fe-mod-8-hp-line-info">
                  <div class="title">{{ good.name | escapeTitle }}</div>
                  <div class="price fe-mod-8-main-name">
                    <div v-show="datas.params.price != 0">
                      <div
                        class="p1"
                        :style="{ color: datas.params.titlecolor }"
                      >
                        {{$i18n.t('money')}}{{
                          good.vip_level_status &&
                          good.vip_level_status.status == 1
                            ? good.vip_level_status.word
                            : good.pricenow
                        }}
                      </div>

                      <div
                        class="p2"
                        v-show="
                          datas.params.price == 3 || datas.params.price == 1
                        "
                      >
                        <span v-show="parseInt(good.priceold)&&good.priceold!=good.pricenow">{{$i18n.t('money')}}{{ good.priceold }}</span>
                      </div>
                      <div class="p3" v-show="datas.params.price == 3">
                        会员价：{{
                          good.vip_level_status &&
                          good.vip_level_status.status == 1
                            ? good.vip_level_status.word
                            : good.price_level && good.price_level == 1
                            ? good.vip_price
                            : good.vip_next_price
                        }}
                      </div>
                    </div>
                    <div
                      class="p4"
                      v-if="
                        datas.params.love == 1 &&
                          good.award == 1 &&
                          (!good.vip_level_status ||
                            good.vip_level_status.status == 0)
                      "
                    >
                      赠送{{ good.award_proportion }}%{{
                        $store.state.temp.designer.love_name || "爱心值"
                      }}
                    </div>
                    <div
                      class="p3"
                      v-show="
                        good.sales &&
                          datas.params.love != 1 &&
                          datas.params.price != 3
                      "
                    >
                      销量:{{ good.sales }}{{ good.unit }}
                    </div>
                    <div
                      class="fe-mod-8-main-name-buy  buy-1"
                      style="margin-top: 0.375rem;"
                      v-show="datas.params.buysub"
                      :class="[datas.params.buysub]"
                    ></div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </template>
      </div>
      <!--酒店样式2 -->
      <div v-if="datas.params.style === 'hotel'">
        <div
          id="checkinout"
          style=" border: solid #ccc 0.0625rem; border-width: 0.0625rem 0;"
        >
          <a
            id="selinTime"
            style="font-weight: normal; display: block; height: 2.5rem; line-height: 2.5rem; padding: 0 0; background: #fff;"
            :href="datas.sessionurl"
          >
            <div style="float: left; width: 40%;">
              <span
                style="background: #f5f5f5; display: block; float: left; height: 2.5rem; width: 3.75rem; color: #999; padding: 0 0.3125rem 0 0.625rem;"
                >入住:&nbsp;</span
              >
              <span
                id="CheckInDay"
                style="float: left; display: block; padding-left: 0.375rem;"
                >xxxx</span
              >
            </div>
            <div style="float: left; width: 40%;">
              <span
                style="background: #f5f5f5; display: block; float: left; height: 2.5rem; width: 3.75rem; color: #999; padding: 0 0.3125rem 0 0.625rem;"
                >退房:&nbsp;</span
              >
              <span
                id="CheckInDay1"
                style="float: left; display: block; padding-left: 0.375rem;"
                >xxxxx
              </span>
            </div>
            <div style="float: left; width: 20%; background: #f5f5f5;">
              <span
                class="span2"
                style="margin-left: 0.625rem; padding-right: 0.625rem;"
                id="CheckOutDay"
                >住:<span style=" color: #f00; padding: 0 0.1875rem;">xxx</span>晚
              </span>
            </div>
          </a>
        </div>
        <template
          v-if="
            $store.state.temp.item.data[index] &&
              $store.state.temp.item.data[index].get_info
          "
        >
          <div
            v-for="(good, i) in $store.state.temp.item.data[index].get_info
              .data"
            :key="i"
            style="height: 6.875rem;"
          >
            <ul class="jiudroom" style="height: 6.875rem;">
              <li>
                <!-- <router-link :to="{ name: 'goods', params: { id: good.goodid },query:{i:toi,mid:mid}}">
                  <img :src="good.img" alt="" class="roomimg">
                  </router-link> -->
                <a @click.stop.prevent="gotoDetail(good)" href="javascript:;">
                  <img :src="good.img" alt="" class="roomimg" />
                </a>
                <div
                  class="jiudroom-text"
                  style="height: 4.75rem; overflow: hidden;"
                >
                  <h1 style="font-size: 16px; color: #333;">
                    {{ good.name | escapeTitle }}
                  </h1>
                  <span
                    v-for="(prams, i) in good.pram"
                    style="height: 6.875rem;"
                    :key="i"
                  >
                    <p>{{ prams.title }}:{{ prams.value }}</p>
                  </span>
                </div>
                <div class="jiudroom-price pa">
                  <ins
                    >{{$i18n.t('money')}}<i>{{ good.todayoprice }}</i></ins
                  >
                  <del>{{$i18n.t('money')}}{{ good.todaycprice }}</del>
                  <div v-show="good.has == '0'">
                    <a
                      style="display: block; color: #fff;"
                      :href="good.url"
                      class="btnbook"
                      >预定</a
                    >
                  </div>
                  <div v-show="good.has != '0'">
                    <button class="btnbook" style="background: #aaa; color: #fff;">
                      预定
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </div>

      <div v-if="showMore">
        <div
          class="loadMore"
          v-if="
            $store.state.temp.item.data[index] &&
              $store.state.temp.item.data[index].isLoadMore &&
              index < all - 1
          "
          @click="getMoreData"
        >
          {{ $i18n.t("加载更多") }}
        </div>
        <div
          class="loadMore"
          v-if="
            $store.state.temp.item.data[index] &&
              !$store.state.temp.item.data[index].isLoadMore &&
              !isLoadMore &&
              datas.Identification === 1
          "
        >
          {{ $i18n.t("没有更多了") }}~~
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { Toast } from 'vant';
const documentElement = document.documentElement;
const body = document.body;
// var isDone = false;
var self;
var isClick = 0;
export default {
  props: ["datas", "index", "all"],
  data() {
    return {
      isLoadMore: true, //true 可以加载更多
      page: 1,
      total_page: 0,
      showMore: true,
      show:false
    };
  },
  mounted() {
    this.ready();
    this.isLoadMore = this.$store.state.temp.item.data[this.index].isLoadMore;
    self = this;
    // if (this.index >= this.all - 1) {
    //   window.addEventListener("scroll", this.nearScroll);
    // }
    // if(this.datas.get_info){
    //   this.total_page = this.datas.get_info.last_page;
    // }
    // // // 判断商品组件mounted的时候是否需要加载更多
    // this.isLoadMore = this.$store.state.temp.item.data[this.index].isLoadMore;
    // self = this;
    // if(this.index>=this.all-1){
    //   window.addEventListener("scroll", this.handleScroll);
    // }
    // if (!isDone && this.datas.Identification === 1) {
    //   document.addEventListener("touchmove", this.handleScroll, false);
    //   isDone = true;
    // }
  },
  activated() {
    // this.isLoadMore = this.$store.state.temp.item.data[this.index].isLoadMore;
    // // if (!isDone && this.datas.Identification === 1) {
    // //   document.addEventListener("touchmove", this.handleScroll, false);
    // //   isDone = true;
    // // }
    this.ready();
    this.isLoadMore = this.$store.state.temp.item.data[this.index].isLoadMore;
    isClick = 0;
    self = this;
    // if (this.index >= this.all - 1) {
    //   window.addEventListener("scroll", this.nearScroll);
    // }
  },
  deactivated() {
    // if (isDone && this.datas.Identification === 1) {
    //   document.removeEventListener("touchmove", this.handleScroll, false);
    //   isDone = false;
    // }
    // if(this.index>=this.all-1){
    window.removeEventListener("scroll", this.nearScroll);
    // }
  },
  watch: {
    total_page() {
      let data = { index: this.index };
      this.page >= this.total_page
        ? (data.isLoadMore = false)
        : (data.isLoadMore = true);
      this.$store.commit("setNearLoadMore", data);
    },
    page() {
      let data = { index: this.index };
      this.page >= this.total_page
        ? (data.isLoadMore = false)
        : (data.isLoadMore = true);
      this.$store.commit("setNearLoadMore", data);
    }
  },
  methods: {
    ready() {
      //this.getLocation();

      //var myLocation = window.localStorage.getItem('myLocation');
      var myLocation = this.$store.state.o2oLocation;
      this.$store.commit("setReferer", window.location.href);
      //console.log('path::::::', this.$route.path);
      if (myLocation.point) {
        this.address = myLocation.title;
        this.city = myLocation.city;
        this.point = myLocation.point;
        this.getData();
        //初始化数据
        //this.getStores();
        //this.getStoresCategory();
      } else {
        console.log("location不存在");
        this.getLocation();
      }
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
        //   "经纬度：" +
        //   obj.position +
        //   "\n精度范围：" +
        //   obj.accuracy +
        //   "米\n定位结果的来源：" +
        //   obj.location_type +
        //   "\n状态信息：" +
        //   obj.info +
        //   "\n地址：" +
        //   obj.formattedAddress +
        //   "\n地址信息：" +
        //   JSON.stringify(obj.addressComponent, null, 4);
        //alert(res);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
          ? obj.addressComponent.city
          : obj.addressComponent.province;

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        that.getData();
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        console.log(obj);
      }
    },
    getData() {
      var myLocation = this.$store.state.o2oLocation;
      var p = this.fun.bd_encrypt(myLocation.point.lng, myLocation.point.lat);
      var city = myLocation.city;
      const that = this;
      $http
        .get(
          "plugin.nearby-store-goods.frontend.controllers.designer.get-goods",
          {
            page: 1,
            city_name: city,
            lng: p.lng,
            lat: p.lat,
            display_num: that.datas.params.displaynum
          },
          "加载中"
        )
        .then(
          function(response) {
            // that.isLoadMore = true;
            if (response.result === 1) {
              that.show=false;
              if(response.data.data.length>0){
                that.show=true;
              }

              var myData = {
                data: response.data,
                index: that.index,
                isLoadMore: true
              };
              that.total_page = myData.data.last_page;
              that.page = 1;
              that.$store.commit("setNearData", myData);
              that.$store.commit("setNearLoadMore", myData);
              // 判断商品组件mounted的时候是否需要加载更多
              that.isLoadMore =
                that.$store.state.temp.item.data[that.index].isLoadMore;
              //   self = this;
              //   if(this.index>=this.all-1){
              //     window.addEventListener("scroll", this.handleScroll);
              //   }
            }
            if (that.index >= that.all - 1) {
              window.addEventListener("scroll", that.nearScroll);
            }
          },
          function(response) {
            console.error(response);
            // error callback
          }
        );
    },
    //商品跳转
    gotoDetail(good) {
      this.$router.push(this.fun.getUrl("goods", { id: good.goodid }));
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (body.clientHeight && documentElement.clientHeight) {
        clientHeight = Math.min(
          body.clientHeight,
          documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          body.clientHeight,
          documentElement.clientHeight
        );
      }
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(body.scrollHeight, documentElement.scrollHeight);
    },
    nearScroll() {
      //滚动事件触发
      if (
        Number(this.getScrollTop() + this.getClientHeight() + 105) >=
        this.getScrollHeight()
      ) {
        //此处发起请求
        if (
          typeof self.$store.state.temp.item.data[self.index].isLoadMore ===
          "undefined" || self.$store.state.temp.item.data[self.index].isLoadMore == false
        ) {
          self.$store.state.temp.item.data[self.index].isLoadMore = true;
        }
        if (
          self.$store.state.temp.item.data[self.index].isLoadMore &&
          isClick === 0
        ) {
          var myLocation = this.$store.state.o2oLocation;
          if (myLocation.hasOwnProperty("address")) {
            self.getMoreData();
            // isClick = 1;
          }
        } else {
          self.isLoadMore =
            self.$store.state.temp.item.data[self.index].isLoadMore;
          console.log("没有数据了");
        }
      }
    },
    // 获取更多数据
    getMoreData() {
      isClick = 1;
      var myLocation = this.$store.state.o2oLocation;
      var p = this.fun.bd_encrypt(myLocation.point.lng, myLocation.point.lat);
      var city = myLocation.city;
      const that = this;
      let data = { index: this.index, isLoadMore: false };
      that.isLoadMore = false;
      this.$store.commit("setNearLoadMore", data); // 防止多次请求分页数据
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page = that.page + 1;
        $http
          .get(
            "plugin.nearby-store-goods.frontend.controllers.designer.get-goods",
            {
              page: that.page,
              city_name: city,
              lng: p.lng,
              lat: p.lat,
              display_num: that.datas.params.displaynum
            },
            "加载中"
          )
          .then(
            function(response) {
              // that.isLoadMore = true;
              isClick = 0;
              if (response.result === 1) {
                var myData = { data: response.data.data, index: that.index };
                that.$store.commit("setNearMoreData", myData);
                // that.datas.data = that.datas.data.concat(myData);//数组拼接
              } else {
                that.page = that.page - 1;
                let data = { index: that.index, isLoadMore: false };
                that.$store.commit("setNearLoadMore", data);
                return;
              }
            },
            function(response) {
              console.error(response);
              // error callback
            }
          );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#goods {
  .loadMore {
    background: #f5f5f5;
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    clear: both;
  }

  .fe-mod-8-hp-line-info .title {
    text-align: left;
  }

  .fe-mod:hover {
    border: 0.125rem dashed rgba(0, 0, 0, 0);
    cursor: default;
  }

  .fe-mod,
  .fe-mod:hover {
    border: 0;
  }

  .fe-mod-cube td {
    height: auto;
  }

  .jiudroom {
    background: #fff;
  }

  .jiudroom li .roomimg {
    position: absolute;
    height: 5.3125rem;
    width: 5.3125rem;
    left: 0.625rem;
  }

  .jiudroom li {
    position: relative;
    padding: 0.625rem 4.375rem 0.625rem 6.5625rem;
    height: 6.625rem;
    border-bottom: 0.0625rem solid #ececec;
    font-size: 12px;
  }

  .jiudroom-price {
    right: 0.625rem;
    top: 0.625rem;
    width: 4.375rem;
    text-align: center;
  }

  .pa {
    position: absolute !important;
  }

  .jiudroom-price ins {
    text-decoration: none;
    font-size: 12px;
    color: #f88917;
  }

  .jiudroom-price del {
    color: #999;
  }

  .jiudroom-text h1 {
    font-size: 16px;
    margin-bottom: 0.875rem;
    height: 1.25rem;
    line-height: 1.25rem;
    width: 100%;
    overflow: hidden;
    font-weight: normal;
    margin-top: -0.0625rem;
  }

  .btnbook {
    background: #f88917;
    border-radius: 0.1875rem;
    color: #fff;
    border: none;
    width: 100%;
    height: 2.125rem;
    line-height: 2.125rem;
    font-size: 14px;
    margin-top: 0.3125rem;
  }

  .fe-mod-8 {
    height: auto;
    overflow: hidden;

    /* padding: 0.3125rem 0; */
    // background: #fff;
  }

  .fe-mod-8 a,
  .fe-mod-8 a:hover {
    color: inherit;
    text-decoration: none;
  }

  .fe-mod-8-title {
    padding: 0 0.5rem;
    font-size: 16px;
    color: #666;
    text-align: left;
  }

  .fe-mod-8-good {
    height: auto;
    width: 50%;
    box-sizing: border-box;
    float: left;
  }

  .fe-mod-8-main {
    height: auto;
    // padding: 0.3125rem;
    // background: #fff;
  }

  .fe-mod-8-main-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
    background-size: 100% 100% !important;
    background-position: center;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  .fe-mod-8-main-img.oo2 {
    // min-height: 43vw;
    background: #fff;
    position: relative;
    text-align: center;
    width: 100%;
    height: 9.375rem;
  }

  .fe-mod-8-main-img.oo2 img {
    width: 100%;
    height: 100%;
  }

  .fe-mod-8-main-img.oo3 {
    // min-height: 25vw;
    position: relative;
    text-align: center;
    width: 100%;
    height: 6.3875rem;
  }

  .fe-mod-8-main-img.oo3 img {
    width: 100%;
    height: 100%;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  .fe-mod-8 .new {
    height: 1.875rem;
    width: 1.875rem;
    background: url(../../assets/images/ico_new.png) no-repeat;
    background-size: 1.875rem;
    position: absolute;
    top: -0.0625rem;
    left: -0.0625rem;
  }

  .fe-mod-8 .saleimg {
    height: 3.125rem;
    width: 3.125rem;
    position: absolute;
    top: -0.1875rem;
    left: -0.1875rem;
  }

  .fe-mod-8 .distance {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 1rem;
    border-radius: 0.25rem;
    background-color: #ff2c29;
    font-size: 12px;
  }

  .fe-mod-8 .sale-xp {
    background: url(../../assets/images/sale-xp.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-rx {
    background: url(../../assets/images/sale-rx.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-tj {
    background: url(../../assets/images/sale-tj.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-xs {
    background: url(./img/sale-xs.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-by {
    background: url(./img/sale-by.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .sale-cx {
    background: url(./img/sale-cx.png);
    background-size: 3.125rem;
  }

  .fe-mod-8 .recom {
    height: 1.875rem;
    width: 1.875rem;
    background: url(./img/ico_recom.png) no-repeat;
    position: absolute;
    top: -0.0625rem;
    left: -0.0625rem;
  }

  .fe-mod-8 .hot {
    height: 1.875rem;
    width: 1.875rem;
    background: url(./img/ico_hot.png) no-repeat;
    background-size: 1.875rem;
    position: absolute;
    top: -0.0625rem;
    left: -0.0625rem;
  }

  .fe-mod-8-main-name {
    height: auto;
    font-size: 14px;
    text-align: center;
    line-height: 1.25rem;
    color: #999;
    margin-top: 0.3125rem;
  }

  .fe-mod-8-main-name-name {
    height: 2.5rem;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #333;
    margin: 0 0.5rem;
  }

  .fe-mod-8-main-name-buy {
    height: 1.25rem;
    width: 1.875rem;
    float: right;
    background-repeat: no-repeat;
  }

  .fe-mod-8 .buy-1 {
    background: url(./img/ico_buy_1.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8 .buy-2 {
    background: url(./img/ico_buy_2.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8 .buy-3 {
    background: url(./img/ico_buy_3.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8 .buy-4 {
    background: url(./img/ico_buy_4.png);
    background-size: 1.875rem 1.25rem;
  }

  .fe-mod-8-main-price {
    height: 1.5rem;
    width: 100%;
    font-size: 14px;
    text-align: left;
    line-height: 1.5rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.2);
    padding-left: 0.1875rem;
    position: absolute;
    bottom: 0;
    left: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    content: "...";
  }

  .fe-mod-8-hp-line {
    height: 5.625rem;
    background: #fff;
    padding: 0.3125rem;
  }

  .fe-mod-8-hp-line-img {
    height: 5rem;
    width: 5rem;
    background: #ddd;
    float: left;
    position: relative;
  }

  .fe-mod-8-hp-line-img img {
    height: 100%;
    width: 100%;
  }

  .fe-mod-8-hp-line-info {
    height: 5rem;
    background: #fff;
    padding-left: 5.625rem;
  }

  .fe-mod-8-hp-line-info .title {
    height: 2.5rem;
    font-size: 14px;
    color: #333;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .fe-mod-8-hp-line-info .price {
    height: 1.875rem;
    width: 100%;
    margin-top: 0.625rem;
    font-size: 14px;
    color: #bbb;
    line-height: 1.875rem;
    float: left;
    overflow: hidden;
  }

  .fe-mod-8-hp-line-info .price .p1 {
    float: left;
    color: #f60;
  }

  .fe-mod-8-hp-line-info .price .p2 {
    font-size: 12px;
    padding-left: 0.3125rem;
    text-decoration: line-through;
    float: left;
    line-height: 2rem;
  }

  .fe-mod-8-hp-line-info .price .p3 {
    color: #999;
    padding-left: 0.625rem;
    float: left;
    font-size: 12px;
  }

  .fe-mod-8-hp-line-info .price .p4 {
    color: #999;
    padding-left: 0.625rem;
    float: left;
    font-size: 12px;
    width: 5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
  }

  .new-goods {
    // padding: 0.25rem;
    width: calc(98% - 1rem);
    float: left;
    margin: 0.5rem 0.75rem;
    border-radius: 0.5rem;
  }

  .card-price {
    color: #f60;
    overflow: hidden;
    position: relative;
    text-align: left;
    margin: 0 0.5rem;
    line-height: 18px;
  }

  .colorBlack {
    color: #999;
  }

  .good-new {
    // padding: 4px;
    // margin-right:2%;
    margin-bottom: 2%;
    border-radius: 0.5rem;
  }

  .good-new a {
    // border: 0.0625rem solid #e5e5e5;
    display: block;
    background: #fff;
    border-radius: 0.5rem;
  }

  .add-cart {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .fe-mod-8-hp-line {
    border: 0.0625rem solid #e5e5e5;
    display: block;
    background: #fff;
    margin: 0.3125rem 0;
  }

  .block {
    display: block;
  }

  .spce {
    font-size: 12px;
    margin: 0 0.2rem;
  }
}
</style>
