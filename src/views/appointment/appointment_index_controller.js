import cTitle from "components/title";
import { Toast } from 'vant';

export default {
  data() {
    return {
      address: "",
      showContent: false,
      carousels: [],
      projects: [],
      workers: [],

      point: {},
      city: '',
    };
  },
  activated() {
    this.ready();
  },
  computed: {
    appointmentLang() {
      if(this.$store.state.shopLanguage.appointment) {
        return this.$store.state.shopLanguage.appointment;
      }else {
        return {worker: "技师", project: "项目", service: "服务"};
      }
    },
  },
  methods: {
    toUrl(str, params) {
      this.$router.push(this.fun.getUrl(str, params));
    },
    getData() {
      $http
        .post(
          "plugin.appointment.frontend.index.get-data",
          {
            lng: this.point.lng,
            lat: this.point.lat,
            city_name: this.city
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.carousels = response.data.carousels;
            this.projects = response.data.projects;
            this.workers = response.data.workers;
          } else {
            this.$dialog.alert({message:response.msg});

          }
          this.showContent = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    tolocation() {
      this.$router.push(this.fun.getUrl("o2oLocation", {}, {tag:"appointment"}));
    },
    tosearch() {
      if (!this.city) {
        Toast({
          message: "请先选择城市"
        });
        return;
      }
      this.$router.push(
        this.fun.getUrl("AppointmentSearch", {
          city: this.city,
          point: JSON.stringify(this.point)
        })
      );
    },
    //banner点击
    bannerClick(item) {
      if (!this.fun.isTextEmpty(item.link)) {
        window.location.href = item.link; //跳转
      }
    },
    ready() {
      let myLocation = this.$store.state.o2oLocation;

      if (myLocation.point) {
        this.address = myLocation.title;
        this.city = myLocation.city;
        this.point = myLocation.point;
        //初始化数据
        this.getData();
      } else {
        // 防止首页空白定位前先请求一下接口
        this.getData();
        console.log("location不存在");
        this.fun.getLocation()
          .then((res)=> {
            this.point = res.point;
            this.address = res.title;
            this.city = res.city;
            this.getData();
          })
          .catch((err)=> {
            console.log(err);
            this.getData();
          });
        // this.getLocation();
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
        that.getData();
        console.log(obj);
        Toast("定位失败");
      }
    }
  },
  components: { cTitle }
};
