import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      datas: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      banner: [],
      userPhone: "",
      shopName: ""
    };
  },
  activated() {

    this.initData();
    this.ready();
  },
  methods: {
    initData() {
      this.datas = [];
      this.banner = [];
      this.userPhone = "";
      this.shopName = "";
      this.loading=false;
      this.allLoaded=false;
      this.goload=true;
      this.isLoadMore=true;
      this.page=1;
      this.total_page=0;
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
        that.ready();
      }

      function onError(obj) {
        console.log(obj);
      }
    },
    ready() {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   //this.$store.commit('updateLocation', myLocation);
      //   //this.$store.commit('setLocation', myLocation);
      //   //初始化数据
      //   this.getData();
      // } else {
      //   console.log("location不存在");
      //   this.getLocation();
      // }
      this.fun.getLocation()
        .then((res)=> {
          this.point = res.point;
          this.address = res.title;
          this.city = res.city;
          this.getData();
        })
        .catch((err)=> {
          console.log(err);
        });
    },
    tosearch() {
      // console.log(this.point);
      if (!this.city) {
        Toast({
          message: "请先选择城市"
        });
        return;
      }
      this.$router.push(
        this.fun.getUrl("easySearch", {
          city: this.city,
          point: JSON.stringify(this.point)
        })
      );
      //this.$router.push('/search');
    },
    tolocation() {
      this.$router.push(this.fun.getUrl("o2oLocation", {}, { tag: "oil" }));
    },
    toDetail(item) {
      let json = {
        userPhone: this.userPhone,
        latitude: item.latitude,
        longitude: item.longitude,
        stationId: item.stationId
      };
      $http.post("plugin.easy-refuel.frontend.index.detail", json, " ").then(
        response => {
          if (response.result === 1) {
            window.location.href = response.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getData() {
      let that = this;
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      let json = {
        name: "",
        lng: p.lng,
        lat: p.lat,
        cityName: this.city.trim(),
        page: this.page
      };
      $http.post("plugin.easy-refuel.frontend.index.index", json, " ").then(
        response => {
          if (response.result === 1) {
            that.total_page = response.data.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.banner = response.data.banner;
            that.datas = response.data.data.data;
            that.shopName = response.data.shopName;
            that.userPhone = response.data.userPhone;
          } else {
            if (response.data.hasOwnProperty("bindPhone")) {
              Toast(response.msg);
              that.$router.push(that.fun.getUrl("editmobile"));
            } else {
              Toast(response.msg);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 获取更多数据
    getMoreData() {
      if(!this.point){
        return;
      }
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          name: "",
          lng: p.lng,
          lat: p.lat,
          cityName: this.city.trim(),
          page: this.page
        };
        $http
          .get("plugin.easy-refuel.frontend.index.index", json, "加载中")
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data.data;
                this.datas = this.datas.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    }
  },
  components: { cTitle }
};
