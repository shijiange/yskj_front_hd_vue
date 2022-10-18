<template>
  <div class="data-list-box" :class="className">
    <div v-html="css"></div>
    <div class="count-box">
      <div class="no-data" v-if="datas.show_list <= 0">
        请选择显示数据
      </div>
      <div v-for="item in datas.show_list" :key="item.value" class="count-item">
        <i class="iconfont icon-submit"></i><span class="data-title">{{item.label}}：</span><span
        class="price">{{countData[item.value] !== undefined ? countData[item.value] || 0 : '加载中'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 自定义样式
const css = function () {
  if (this.datas.preview_color) {
    const {
      padding_top,
      padding_bottom,
      padding_left,
      padding_right,
      preview_color,
      font_size,
      font_color
    } = this.datas;

    return `
      .component-c${this.parent_id}-${this.id} .count-box {
          background-color: ${preview_color.color};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image : ''});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          padding-top: ${padding_top}px;
          padding-bottom: ${padding_bottom}px;
          padding-left: ${padding_left}px;
          padding-right: ${padding_right}px;
      }

      .component-c${this.parent_id}-${this.id} .count-box{
          font-size: ${font_size}px;
          color: ${font_color};
      }
  `;
  }
};

export default {
  props: ["id", "parent_id", "datas"],
  data() {
    return {
      countData: {},  //统计数据
      region_name: '',  //省/市/区   名称
    };
  },
  mounted() {
    // let myLocation = this.$store.state.o2oLocation;
    // if (myLocation.addressComponent) {
    //   this.region_name = myLocation.addressComponent ? myLocation.addressComponent[this.datas.city_type] : '';
    //   this.getData();
    // } else {
    this.fun.getLocation()
      .then((res)=> {
        this.region_name = res.addressComponent ? res.addressComponent[this.datas.city_type] : '';
        if(res.addressComponent) {
          this.recordLocation(res);
        }
        this.getData();
      })
      .catch((err)=> {
        this.getData();
        console.log(err);
      });
    // this.getLocation();
    // }
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-c${this.parent_id}-${this.id}`];
      return name;
    },
  },
  methods: {
    //获取数据
    getData() {
      $http
        .post("plugin.store-cashier.frontend.store.store.get-store-count", { city_type: this.datas.city_type, region_name: this.region_name })
        .then(res => {
          if (res.result === 1) {
            this.countData = {
              all_stores_count: this.transform(parseInt(res.data.sotreCount + this.datas.all_stores_count)),
              all_fans_count: this.transform(parseInt(res.data.memberCount + this.datas.all_fans_count)),
              local_stores_count: this.transform(parseInt(res.data.sotreCityCount + this.datas.local_stores_count)),
              local_fans_count: this.transform(parseInt(res.data.memberCityCount + this.datas.local_fans_count))
            };
          } else {
            this.countData = {
              all_stores_count: 0,
              all_fans_count: 0,
              local_stores_count: 0,
              local_fans_count: 0
            };
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    recordLocation(obj = {}) {
      // 后台记录会员的定位
      let point = this.fun.bd_encrypt(obj.point.lng, obj.point.lat);
      $http
        .post("member.member.save-member-location", {
          province_name: obj.addressComponent.province,
          city_name: obj.addressComponent.city,
          district_name: obj.addressComponent.district,
          longitude: point.lng,
          latitude: point.lat,
        })
        .then(res => {})
        .catch(error => {
          console.log(error);
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
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

        that.region_name = obj.addressComponent[that.datas.city_type];

        var pos = {
          addressComponent: obj.addressComponent,
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        that.recordLocation(pos);
        that.getData();
      }

      function onError(obj) {
        console.log(obj);
        that.getData();
      }
    },
    transform(value) {
      let newValue = ["", "", ""];
      let fr = 1000;
      // const ad = 1;
      let num = 3;
      let fm = 1;
      while (value / fr >= 1) {
        fr *= 10;
        num += 1;
      }
      if (num <= 4) { // 千
        newValue[1] = "千";
        newValue[0] = parseFloat(value / 1000) + "";
      } else if (num <= 8) { // 万
        const text1 = parseInt(num - 4) / 3 > 1 ? "千万" : "万";
        fm = "万" === text1 ? 10000 : 10000000;
        newValue[1] = text1;
        newValue[0] = (value / fm) + "";
      } else if (num <= 16) {// 亿
        let text1 = (num - 8) / 3 > 1 ? "千亿" : "亿";
        text1 = (num - 8) / 4 > 1 ? "万亿" : text1;
        text1 = (num - 8) / 7 > 1 ? "千万亿" : text1;
        fm = 1;
        if ("亿" === text1) {
          fm = 100000000;
        } else if ("千亿" === text1) {
          fm = 100000000000;
        } else if ("万亿" === text1) {
          fm = 1000000000000;
        } else if ("千万亿" === text1) {
          fm = 1000000000000000;
        }
        newValue[1] = text1;
        newValue[0] = parseFloat(value / fm) + "";
      }
      if (value < 1000) {
        newValue[1] = "";
        newValue[0] = value + "";
      }
      return newValue.join("");
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .count-box {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }

  .count-item {
    width: 50%;
    padding: 5px 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-data {
    width: 100%;
    padding: 5px;
    text-align: center;
  }
</style>
