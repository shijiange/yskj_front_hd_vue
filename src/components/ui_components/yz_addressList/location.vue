<template>
  <div id="yz_location">
    <van-popup v-model="showLocation" round position="bottom" :style="{ height: '80%' }" :close-on-click-overlay="false">
      <!--container-->
      <div id="map" style="width: 100%; height: 100%; overflow: hidden; display: flex; flex-direction: column;">
        <div class="m-t-10" style="width: 100%; height: 3rem;">
          <a class="mint-cell mint-field">
            <div class="mint-cell-wrapper">
              <div style="background: #fff; box-shadow: none; margin-top: 0; padding-right: 0.5rem;" @click="goback">
                <i class="iconfont icon-back"></i>
              </div>
              <div class="search_box" style="font-size: 14px;">
                <i class="iconfont icon-sousuo1"></i>
                <input type="text" id="suggestId" name="address_detail" placeholder="输入您所在的地点" />
              </div>
              <div v-if="center_path" style="margin-left: 10px;" @click.stop="surePoint">确定</div>
            </div>
          </a>
        </div>

        <div class="loading" v-if="showLoading">定位中，可直接输入...</div>

        <div v-show="fromHome !== 1" id="container" style="width: 100%; height: 40%;"></div>
        <div v-show="fromHome !== 1" id="panel" style="width: 100%; height: 53%; flex: 1;"></div>
      </div>
    </van-popup>
    <!--container end-->
  </div>
</template>

<script>
import AMap from "AMap";
import { Toast } from "vant";

var mapListText = [];
//  var geolocation, markers, marker
var map, placeSearch, self, placeSearchOptions, listCount, marker;
var num = [];
var poisArrCopy = [];
var numIndex = 0;

export default {
  model: {
    prop: "showLocation",
    event: "onEmit"
  },
  props: {
    //弹窗是否显示，默认不显示
    showLocation: {
      type: Boolean,
      default: false
    },
    local_city: {
      type: String,
      default: "全国"
    },
    path_list: {
      type: Array
    },
    //根据path_list和center_path判断是不是订单页面的门店配送
    center_path: {
      type: Array
    }
  },
  data() {
    return {
      address_detail: null, // 详细地址
      listCount: listCount,
      listText: mapListText,
      center: { lng: 0, lat: 0 },
      num: num,
      fromHome: 0,
      showLoading: false,
      updatePoint: "",
    };
  },
  created() {
    // 组件创建完后获取数据，这里和1.0不一样，改成了这个样子
    // this.ready() // 如果在此处直接调用this.ready()方法，将无法加载地图
  },
  mounted() {
    self = this;
    // this.ready();
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    showLocation: function(newV, oldV) {
      if (newV) {
        this.$nextTick(() => {
          this.ready();
          this.initFun();
        });
      }
    }
  },
  methods: {
    surePoint() {
      this.$emit("onEmit", false);
      this.$emit("confirm", this.updatePoint);
    },
    initFun() {
      this.address_detail = "";
      this.showLoading = true;

      this.fun.getLocation()
        .then((res) => {
          let promise = new Promise((resolve, reject)=> {
            this.init(res.point);
            resolve();
          });
          promise
            .then(()=> {
              this.searchData(res.point, this.callback);
              this.demo();
            });
        })
        .catch((err)=> {
          this.fromHome = 1;
          console.log(err);
        });
    },
    init(p) {
      let that = this;
      map = new AMap.Map("container", {
        center: [p.lng, p.lat],
        resizeEnable: false,
        zoom: 5
      });
      var icon = new AMap.Icon({
        image: "http://vdata.amap.com/icons/b18/1/2.png",
        size: new AMap.Size(24, 32)
      });
      marker = new AMap.Marker({
        icon: icon,
        position: [p.lng, p.lat],
        // offset: new AMap.Pixel(-13, -30)
      });
      that.updatePoint = {
        point: {
          lng: p.lng,
          lat: p.lat
        }
      };
      map.add(marker);
      if(that.path_list) {
        let path = that.path_list;
        let polygon = new AMap.Polygon({
          path: path,
          strokeColor: '#FF33FF',
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50
        });
        map.add(polygon);
        function showInfoClick(e){
          that.updatePoint = {
            point: {
              lng: e.lnglat.getLng(),
              lat: e.lnglat.getLat()
            }
          };
          marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()]);
          let text = '您在 [ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ] 的位置单击了地图！';
          console.log(text);
        }
        polygon.on('click', showInfoClick);
        map.on('click', showInfoClick);
      }

      AMap.plugin(["AMap.Geolocation", "AMap.PlaceSearch", "AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
      });
    },
    searchData: function(p, callback) {
      let that = this;
      // …………………………………………………………方法选项…………………………………………………………………………………………………………
      placeSearchOptions = {
        // 构造地点查询类
        panel: "panel", // 结果列表将在此容器中进行展示。
        pageSize: 20, // 单页显示结果条数
        pageIndex: 1, // 页码
        // city: that.local_city, // 兴趣点城市 默认全国
        map: map, // 展现结果的地图实例
        // citylimit: true,  //是否强制限制在设置的城市内搜索
        //autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        visible: false
      };

      AMap.service("AMap.PlaceSearch", function() {
        // map.clearMap()  // 清除地图覆盖物
        placeSearch = new AMap.PlaceSearch(placeSearchOptions);
        placeSearch.searchNearBy("", [p.lng, p.lat], 1000, function(status, result) {
          that.showLoading = false;
        });
        AMap.event.addListener(placeSearch, "listElementClick", listElementClick); // 返回定位信息

        function listElementClick(e) {
          AMap.plugin("AMap.Geocoder", function() {
            var geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              city: that.local_city
            });

            //var lnglat = [116.396574, 39.992706]
            geocoder.getAddress(e.data.location, function(status, result) {
              console.log("write9999999r",result);
              if (status === "complete" && result.info === "OK") {
                // result为对应的地理位置详细信息
                let point = {
                  lat: e.data.location.lat,
                  lng: e.data.location.lng
                };
                let pos = {};
                if (result.regeocode.addressComponent.city == "") {
                  pos = {
                    address: e.data.address,
                    city: result.regeocode.addressComponent.province,
                    province: result.regeocode.addressComponent.province,
                    title: e.data.name,
                    point: point
                  };
                } else {
                  pos = {
                    address: e.data.address,
                    city: result.regeocode.addressComponent.city,
                    province: result.regeocode.addressComponent.province,
                    title: e.data.name,
                    point: point
                  };
                }
                console.log("write9999999r",pos);
                that.$store.commit("updateLocation", pos);
                that.$store.commit("setLocation", pos);

                that.$emit("onEmit", false);
                that.$emit("confirm", pos);
              }
            });
          });
        }
      });
      return callback;
    },
    callback: function(status, result) {
      var promise = new Promise(function(resolve, reject) {
        let _result = result;
        const pois = _result.poiList.pois;
        poisArrCopy = pois.copyWithin(0);
        self.num.push(poisArrCopy);
        //  self.listText = pois
        //  self.listCount = _result.poiList.count
        //  placeSearch.M.pageSize = 10
        resolve();
      });
      promise.then(function() {
        console.log("Resolved.");
        return self.demo();
      });
    },
    demo: function() {
      numIndex++;
      if (numIndex > 4) {
        if (self.num.length > 0) {
          return map.clearMap(); // 清除地图覆盖物
        }
      }
    },
    goback() {
      this.$emit("onEmit", false);
    },
    ready: function() {
      let that = this;
      //输入提示
      let auto = new AMap.Autocomplete({
        input: "suggestId",
        city: that.local_city,
        citylimit: true,
      });
      AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
      function select(e) {
        console.log("e:", e);
        if(that.center_path) {
          map.setCenter([e.poi.location.lng,e.poi.location.lat]);
          that.updatePoint = {
            point: {
              lng: e.poi.location.lng,
              lat: e.poi.location.lat
            }
          };
          marker.setPosition([e.poi.location.lng, e.poi.location.lat]);
        }else {
          AMap.plugin("AMap.Geocoder", function() {
            var geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              city: that.local_city
            });
            //var lnglat = [116.396574, 39.992706]
            geocoder.getAddress(e.poi.location, function(status, result) {
              console.log("look55555555", result);
              if (status === "complete" && result.info === "OK") {
                // result为对应的地理位置详细信息
                var point = {
                  lat: e.poi.location.lat,
                  lng: e.poi.location.lng
                };
                var pos = {};
                if (result.regeocode.addressComponent.city == "") {
                  pos = {
                    address: e.poi.address,
                    // city:result.regeocode.addressComponent.district,
                    city: result.regeocode.addressComponent.province,
                    province: result.regeocode.addressComponent.province,
                    title: e.poi.name,
                    point: point
                  };
                } else {
                  pos = {
                    address: e.poi.address,
                    city: result.regeocode.addressComponent.city,
                    province: result.regeocode.addressComponent.province,
                    title: e.poi.name,
                    point: point
                  };
                }

                console.log("look55555555", pos);

                that.$store.commit("updateLocation", pos);
                that.$store.commit("setLocation", pos);

                that.$emit("onEmit", false);
                that.$emit("confirm", pos);
              } else {
                Toast("请输入更详细的地址");
              }
            });
          });

        }

      }
    },
  }
};
</script>

<style>
.amap-sug-result {
  z-index: 2020;
}

#map {
  /* position: absolute; */
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
  width: 18.5rem;
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
  width: 100%;
  max-width: 18.5rem;
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
}
</style>
