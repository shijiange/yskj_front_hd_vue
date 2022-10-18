<template>
  <div>
    <div id="position">
      <div class="left"
           @click="showCitys">
        <i class="iconfont icon-icon_location"></i>
        <span>{{ city || '全国' }}</span>
      </div>
      <div class="search_box">
        <i class="iconfont icon-sousuo1"></i>
        <input type="text"
               v-model="address_detail"
               id="suggestId"
               name="address_detail"
               placeholder="输入您所在的地点" />
      </div>
      <div class="right"
           @click="goback">
        <span>取消</span>
      </div>
    </div>

    <ul class="address-list">
      <li @click="goToSelect(item)"
          class="address-list-item"
          v-for="(item,index) in addressList"
          v-show="item.location"
          :key='index'>
        {{item.name}} --- {{item.address}}
      </li>
    </ul>

    <div id="allmap"
         style="width: 100%;"></div>
  </div>
</template>

<script>
import AMap from "AMap";

export default {
  components: {},
  data: () => ({
    headerData: {
      title: "办公地址",
      toLink: ""
    },
    address_detail: null, // 详细地址
    userlocation: { lng: "", lat: "" },
    stores: [],
    city: "广州",
    citys: [],
    isShowCitys: true,
    addressList: []
  }),
  created() {
    // 组件创建完后获取数据，这里和1.0不一样，改成了这个样子
    this.loadMap();
  },
  mounted() {
    // this.getCity();
    this.city = this.$route.query.city;
  },
  activated() {
    this.address_detail = "";
    this.city = this.$route.query.city;
    this.ready();
  },
  methods: {
    goToSelect(item) {
      let point = {
        lat: item.location.lat,
        lng: item.location.lng
      };
      let pos = {
        addressComponent: "",
        address: item.address,
        city: this.city,
        title: item.name,
        point: point,
        timestamp: Math.round(new Date() / 1000)
      };
      localStorage.setItem("myLocation", JSON.stringify(pos));
      this.$store.commit("setSwitchCity", true);
      this.$store.commit("updateLocation", pos);
      this.$store.commit("setLocation", pos);
      if (this.$route.query.tag == "hotel") {
        this.$router.push(this.fun.getUrl("HotelIndex"));
      } else if (this.$route.query.tag == "appointment") {
        this.$router.push(this.fun.getUrl("Appointment"));
      } else if (this.$route.query.tag == "oil") {
        this.$router.push(this.fun.getUrl("easyRefuel"));
      } else if (this.$route.query.tag == "activity") {
        this.$router.push(this.fun.getUrl("activityHome"));
      } else if (this.$route.query.tag == "activitySort") {
        this.$router.go(-2);
      } else if (this.$store.state.referer) {
        window.location.href = this.$store.state.referer;
      }  else {
        this.$router.push(this.fun.getUrl("o2oHome", { fromHome: 1 }));

      }
    },
    loadMap: function() {
      // setTimeout(this.ready, 0)
    },
    goback() {
      this.$router.go(-1);
    },
    ready: function() {
      var that = this;
      // var map = new AMap.Map("container", {
      //   resizeEnable: true
      // });
      //输入提示
      var auto = new AMap.Autocomplete({
        input: "suggestId",
        city: that.city
      });

      let auto2 = new AMap.Autocomplete({
        city: that.city
      });

      auto2.search(that.city, function(status, result) {
        that.addressList = result.tips;
      });

      AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
      function select(e) {
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: that.city
          });

          //var lnglat = [116.396574, 39.992706]
          geocoder.getAddress(e.poi.location, function(status, result) {
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              let point = {
                lat: e.poi.location.lat,
                lng: e.poi.location.lng
              };
              console.log("write9999999", result);
              let pos = {
                addressComponent: result.regeocode.addressComponent,
                address: e.poi.address,
                city: result.regeocode.addressComponent.city ? result.regeocode.addressComponent.city : result.regeocode.addressComponent.province,
                province: result.regeocode.addressComponent.province,
                title: e.poi.name,
                point: point,
                timestamp: Math.round(new Date() / 1000)
              };

              that.$store.commit("setSwitchCity", true);
              localStorage.setItem("myLocation", JSON.stringify(pos));
              that.$store.commit("updateLocation", pos);
              that.$store.commit("setLocation", pos);

              if (that.$route.query.tag == "hotel") {
                that.$router.push(that.fun.getUrl("HotelIndex"));
              } else if (that.$route.query.tag == "appointment") {
                that.$router.push(that.fun.getUrl("Appointment"));
              } else if (that.$route.query.tag == "oil") {
                that.$router.push(that.fun.getUrl("easyRefuel"));
              } else if (that.$route.query.tag == "activity") {
                that.$router.push(that.fun.getUrl("activityHome"));
              } else if (that.$store.state.referer) {
                //that.$router.push(that.$store.state.referer);
                window.location.href = that.$store.state.referer;
              } else {
                that.$router.push(that.fun.getUrl("o2oHome", { fromHome: 1 }));
              }
            }
          });
        });
      }
    },

    showCitys() {
      if (this.isShowCitys) {
        this.isShowCitys = false;
      } else {
        this.isShowCitys = true;
      }
    }

  }
};
</script>

<style>
/* 去掉地图左下角的百度LOGO */
.anchorBL {
  display: none;
}

.mint-cell-wrapper {
  text-align: left !important;
}

.mint-cell-value {
  width: 0 !important;
}

.xk {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  overflow: hidden;
}

.xl {
  position: relative;
  font-size: 14px;
  color: #b0b0b0;
  text-align: center;
  line-height: 2.5rem;
  margin: 0 0.625rem;
}

.xl::before {
  content: "";
  height: 0;
  border-top: 0.0625rem dashed #b0b0b0;
  width: 100%;
  position: absolute;
  top: 50%;
  margin-top: -0.0625rem;
  left: 0;
}

.xl span {
  background-color: #f4f4f4;
  display: inline-block;
  padding: 0 0.375rem;
  position: relative;
  z-index: 1;
}

.xm {
  padding: 0.625rem;
  width: 125%;
  box-sizing: border-box;
  padding-right: 3.875rem;
}

.xm li {
  display: inline-block;
  padding: 0.625rem 0;
  border: 0.0625rem solid #ddd;
  background: #fff;
  color: #333;
  margin: 0 0.625rem 0.625rem 0;
  width: 20%;
  text-align: center;
  float: left;
}

.xm li.curr {
  border: 0.0625rem solid #d0d0d0;
  background: #f3f3f3;
}

#position {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  height: 2.8125rem;
  align-items: center;
  padding: 0 0.625rem;
}

#position .left {
  display: flex;
}

#position .left i {
  color: #666;
  font-size: 1rem;
  margin-right: 0.25rem;
}

#position .left span {
  font-size: 14px;
  width: 4rem;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#position .search_box {
  display: flex;
  justify-content: flex-start;
  padding: 0 0.625rem;
  width: 12.5rem;
  height: 1.875rem;
  line-height: 1.875rem;
  border-radius: 1rem;
  background-color: #f5f5f5;
}

.search_box input {
  border: none;
  margin-left: 0.625rem;
  max-width: 11.25rem;
}

.search_box i {
  color: #999;
  font-size: 1rem;
}

#position .right {
  line-height: 2.8125rem;
  min-width: 2.5rem;
  font-size: 15px;
  color: #8c8c8c;
}

.address-list {
  background: #fff;
  text-align: left;
  padding: 0.3rem 0.5rem;
}

.address-list-item {
  min-height: 2rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid #eee;
}

.address-list-item:hover {
  background: #eee;
}
</style>
