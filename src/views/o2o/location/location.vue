<template>
  <div>
    <!--container-->
    <div id="map" style="width: 100%; height: 100%;">
      <div class="m-t-10" style="width: 100%; height: 3rem;">
        <a class="mint-cell mint-field">
          <div class="mint-cell-wrapper">
            <div style="background: #fff; box-shadow: none; margin-top: 0; padding-right: 0.5rem;" @click="goback">
				<i class="iconfont icon-back"></i>
			</div>
            <div class="search_box"
                 style="font-size: 14px;">
              <i class="iconfont icon-sousuo1"></i>
              <input type="text"
                     v-model="address_detail"
                     id="suggestId"
                     name="address_detail"
                     placeholder="输入您所在的地点" />
            </div>
          </div>
        </a>
      </div>

      <!--<div class="loading" v-if="showLoading">定位中，可直接输入...</div>-->

      <div v-show="fromHome !== 1"
           id="container"
           style="height: 40%;"
           :style="{'width':this.fun.getPhoneEnv() == 3?'375px':'100%'}"
           ></div>
      <div v-show="fromHome !== 1"
           id="panel"
           style=" height: 53%;"
           :style="{'width':this.fun.getPhoneEnv() == 3?'375px':'100%'}"
           ></div>
    </div>

    <!--container end-->
  </div>
</template>

<script>
import AMap from "AMap";
import { Toast } from 'vant';

var mapListText = [];
//  var geolocation, markers, marker
var map, placeSearch, self, placeSearchOptions, listCount, marker;
var num = [];
var poisArrCopy = [];
var numIndex = 0;

export default {
  data: () => ({
    address_detail: null, // 详细地址
    listCount: listCount,
    listText: mapListText,
    center: { lng: 0, lat: 0 },
    num: num,
    fromHome: 0,
    showLoading: false
  }),
  created() {
    // 组件创建完后获取数据，这里和1.0不一样，改成了这个样子
    // this.ready() // 如果在此处直接调用this.ready()方法，将无法加载地图
  },
  mounted() {
    self = this;
    this.ready();
  },
  activated() {
    this.address_detail = "";
    this.fromHome = this.$route.params.fromHome;
    if (this.fromHome !== 1 && this.fun.getKey('error') != 1) {
      this.showLoading = true;
      this.fun.getLocation("定位中，可直接输入")
        .then((res)=> {
          this.address = res.title;
          this.city = res.city;
          this.point = res.point;

          let promise = new Promise((resolve, reject)=> {
            this.init(this.point);
            resolve();
          });
          promise.then(()=> {
            this.searchData(this.point, this.callback);
            this.demo();
          });
        })
        .catch((err)=> {
          this.fromHome = 1;
          console.log(err);
        });
    }
  },
  methods: {
    init(p) {
      map = new AMap.Map("container", {
        center: [p.lng, p.lat],
        resizeEnable: false,
        zoom: 5
      });
      var icon = new AMap.Icon({
        image: "http://vdata.amap.com/icons/b18/1/2.png",
        size: new AMap.Size(24, 24)
      });
      marker = new AMap.Marker({
        icon: icon,
        position: [p.lng, p.lat],
        offset: new AMap.Pixel(-13, -30)
      });
      map.add(marker);
      AMap.plugin(
        ["AMap.Geolocation", "AMap.PlaceSearch", "AMap.ToolBar"],
        function() {
          map.addControl(new AMap.ToolBar());
        }
      );
    },
    searchData(p, callback) {
      // …………………………………………………………方法选项…………………………………………………………………………………………………………
      placeSearchOptions = {
        // 构造地点查询类
        panel: "panel", // 结果列表将在此容器中进行展示。
        pageSize: 20, // 单页显示结果条数
        pageIndex: 1, // 页码
        //city: '020', // 兴趣点城市 默认全国
        map: map, // 展现结果的地图实例
        // citylimit: true,  //是否强制限制在设置的城市内搜索
        //autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        visible: false
      };

      AMap.service("AMap.PlaceSearch", function() {
        // map.clearMap()  // 清除地图覆盖物
        placeSearch = new AMap.PlaceSearch(placeSearchOptions);
        placeSearch.searchNearBy("", [p.lng, p.lat], 1000, function(
          status,
          result
        ) {
          self.showLoading = false;
          // self.$dialog.loading.close();
        });
        AMap.event.addListener(
          placeSearch,
          "listElementClick",
          listElementClick
        ); // 返回定位信息

        function listElementClick(e) {
          // console.log('e:', e);

          AMap.plugin("AMap.Geocoder", function() {
            var geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              city: self.city
            });

            //var lnglat = [116.396574, 39.992706]
            geocoder.getAddress(e.data.location, (status, result)=> {
              console.log(result);
              if (status === "complete" && result.info === "OK") {
                // result为对应的地理位置详细信息
                let point = {
                  lat: e.data.location.lat,
                  lng: e.data.location.lng
                };

                let pos = {
                  addressComponent: result.regeocode.addressComponent,
                  address: e.data.address,
                  city: result.regeocode.addressComponent.city ? result.regeocode.addressComponent.city : result.regeocode.addressComponent.province,
                  province: result.regeocode.addressComponent.province,
                  title: e.data.name,
                  point: point,
                  timestamp: Math.round(new Date() / 1000)
                };
                console.log("write9999999", pos);

                localStorage.setItem("myLocation", JSON.stringify(pos));
                self.$store.commit("updateLocation", pos);
                self.$store.commit("setLocation", pos);

                //跳转回原先页面路径如不需要传递参数的，可使用that.$store.state.referer条件跳转
                //使用$store.state.referer，需要在原先页面跳转前this.$store.commit('setReferer',window.location.href);
                //下面可以优化，注意自测哦
                console.log(self.$route.query.tag);
                if(self.$route.query.tag == "suppligoodsOrde"){
                  self.$router.go(-1);
                } else if (self.$route.query.tag == "hotel") {
                  self.$router.push(self.fun.getUrl("HotelIndex"));
                } else if (self.$route.query.tag == "appointment") {
                  self.$router.push(self.fun.getUrl("Appointment"));
                } else if (
                  self.$route.query.tag == "selfCarry" ||
                  self.$route.query.tag == "goodsDetail"
                ) {
                  self.$router.replace(
                    self.fun.getUrl("SelfCarry_info", {
                      tag: self.$route.params.tag,
                      goodsId: self.$route.params.goodsId,
                      optionsId: self.$route.params.optionsId,
                      total: self.$route.params.total,
                    },{
                      cart_ids: self.$route.params.cart_ids,
                    })
                  );
                } else if (self.$route.query.tag == "goodsorder") {
                  self.$router.replace(
                    self.fun.getUrl("goodsorder",{
                      // 本页面的值
                      address_data: self.$route.params.address_data,
                      create:self.$route.params.create,
                      index:self.$route.params.index,
                      district_id:self.$route.params.district_id,
                      pointId:point,
                    }, {
                      tag: self.$route.params.tag,
                      goodsId: self.$route.params.goodsId,
                      optionsId: self.$route.params.optionsId,
                      total: self.$route.params.total,
                      store_id: self.$route.params.store_id,
                      cart_ids: self.$route.query.cart_ids,
                    })
                  );

                } else if (self.$store.state.referer) {
                  window.location.href = self.$store.state.referer;
                } else if (self.$route.query.tag == "selfCarryApply") {
                  self.$router.push(self.fun.getUrl("SelfCarryApply"));
                } else if (self.$route.query.tag == "storeApply") {
                  self.$router.push(self.fun.getUrl("storeApply"));
                } else if (self.$route.query.tag == "hotelApply") {
                  self.$router.push(self.fun.getUrl("hotelApply"));
                } else if (self.$route.query.tag == "hotelSupply") {
                  self.$router.push(self.fun.getUrl("HotelSupplyIndex"));
                } else if (self.$route.query.tag == "activity") {
                  self.$router.push(self.fun.getUrl("activityHome"));
                } else if (self.$route.query.tag == "oil") {
                  self.$router.push(self.fun.getUrl("easyRefuel"));
                } else if (self.$route.query.tag == "timeAppointment_index"){
                  self.$router.go(-1);
                } else if (self.fun.getKey("error") == 1) {
                  self.$router.go(-1);
                } else {
                  self.$router.push(self.fun.getUrl("o2oHome"));
                }
              }
            });
          });
        }
      });
      return callback;
    },
    callback(status, result) {
      var promise = new Promise(function(resolve, reject) {
        let _result = result;
        const pois = _result.poiList.pois;
        poisArrCopy = pois.copyWithin(0);
        self.num.push(poisArrCopy);
        //          self.listText = pois
        //          self.listCount = _result.poiList.count
        //          placeSearch.M.pageSize = 10
        resolve();
      });
      promise.then(function() {
        console.log("Resolved.");
        return self.demo();
      });
    },
    demo() {
      numIndex++;
      if (numIndex > 4) {
        if (self.num.length > 0) {
          return map.clearMap(); // 清除地图覆盖物
        }
      }
    },
    goback() {
      this.$router.go(-1);
    },
    ready() {
      //输入提示
      var auto = new AMap.Autocomplete({
        input: "suggestId",
        city: self.city
      });

      AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
      function select(e) {
        // console.log("e:", e);

        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: self.city
          });

          //var lnglat = [116.396574, 39.992706]
          geocoder.getAddress(e.poi.location, function(status, result) {
            console.log(result);
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              let point = {
                lat: e.poi.location.lat,
                lng: e.poi.location.lng
              };

              let pos = {
                addressComponent: result.regeocode.addressComponent,
                address: e.poi.address,
                city: result.regeocode.addressComponent.city ? result.regeocode.addressComponent.city : result.regeocode.addressComponent.province,
                province: result.regeocode.addressComponent.province,
                title: e.poi.name,
                point: point,
                timestamp: Math.round(new Date() / 1000)
              };

              console.log("look55555555", pos);

              localStorage.setItem("myLocation", JSON.stringify(pos));
              self.$store.commit("updateLocation", pos);
              self.$store.commit("setLocation", pos);

              //跳转回原先页面路径如不需要传递参数的，可使用th.$store.state.referer条件跳转
              //使用$store.state.referer，需要在原先页面跳转前this.$store.commit('setReferer',window.location.href);
              //下面可以优化，注意自测哦
              if(self.$route.query.tag == "suppligoodsOrde"){
                self.$router.go(-1);
              } else if (self.$route.query.tag == "hotel") {
                self.$router.push(self.fun.getUrl("HotelIndex"));
              } else if (self.$route.query.tag == "appointment") {
                self.$router.push(self.fun.getUrl("Appointment"));
              } else if (
                self.$route.query.tag == "selfCarry" ||
                self.$route.query.tag == "goodsDetail"
              ) {
                self.$router.replace(
                  self.fun.getUrl("SelfCarry_info", {
                    tag: self.$route.params.tag,
                    goodsId: self.$route.params.goodsId,
                    optionsId: self.$route.params.optionsId,
                    total: self.$route.params.total,
                    cart_ids: self.$route.params.cart_ids,
                  })
                );
              } else if (self.$route.query.tag == "goodsorder") {
                self.$router.push(
                  self.fun.getUrl("goodsorder",{
                    // 本页面的值
                    address_data: self.$route.params.address_data,
                    create:self.$route.params.create,
                    index:self.$route.params.index,
                    district_id:self.$route.params.district_id,
                    pointId:point,
                  }, {
                    tag: self.$route.params.tag,
                    goodsId: self.$route.params.goodsId,
                    optionsId: self.$route.params.optionsId,
                    total: self.$route.params.total,
                    store_id: self.$route.params.store_id,
                    cart_ids: self.$route.params.cart_ids,
                  })
                );
              }else if (self.$route.query.tag == "selfCarryApply") {
                self.$router.push(self.fun.getUrl("SelfCarryApply"));
              } else if (self.$route.query.tag == "storeApply") {
                self.$router.push(self.fun.getUrl("storeApply"));
              } else if (self.$route.query.tag == "hotelApply") {
                self.$router.push(self.fun.getUrl("hotelApply"));
              } else if (self.$route.query.tag == "hotelSupply") {
                self.$router.push(self.fun.getUrl("HotelSupplyIndex"));
              } else if (self.$route.query.tag == "activity") {
                self.$router.push(self.fun.getUrl("activityHome"));
              } else if (self.$store.state.referer) {
                //self.$router.push(self.$store.state.referer);
                window.location.href = self.$store.state.referer;
              } else if (self.$route.query.tag == "oil") {
                self.$router.push(self.fun.getUrl("easyRefuel"));
              } else if (self.fun.getKey("error") == 1) {
                self.$router.go(-1);
              } else {
                self.$router.push(self.fun.getUrl("o2oHome"));
              }
            } else {
              Toast("请输入更详细的地址");
            }
          });
        });
      }
    },
  }
};
</script>

<style>
#map {
  position: absolute;
  padding: 0;
  width: 100%;
  background: #fff;
}

#container {
  width: 100%;
  height: 100%;
  font-size: 15px;
}

#panel {
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
  border-bottom: solid 1px silver;
}

#map .search_box {
  display: flex;
  justify-content: flex-start;
  padding: 0 0.625rem;
  width: 19.5rem;
  height: 1.875rem;
  line-height: 1.875rem;
  border-radius: 1rem;
  background-color: #f5f5f5;
}

.loading {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  background-color: rgba(40, 40, 40, 0.85);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  z-index: 99999 !important;
}

.search_box input {
  border: none;
  margin-left: 0.625rem;
  max-width: 19.5rem;
}

.search_box i {
  color: #999;
  font-size: 1rem;
}

.m-t-10 {
  display: flex;
  align-items: center;
}

.mint-cell-wrapper {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}
</style>
