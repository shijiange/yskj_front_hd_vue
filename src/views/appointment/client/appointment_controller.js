import cTitle from "components/title";
import { scrollMixin } from "utils/mixin";
import QRCode from "qrcode";
import { Toast } from 'vant';
var canvas = "";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      num: 0,
      show: false,
      code: "",
      projectList: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.ready();
  },
  mounted() {
    this.$nextTick(function() {
      // DOM操作
      canvas = document.getElementById("qrccode-canvas");
    });
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
    goToAdress(lng,lat,store_name) {
      // let point = this.fun.bd_decrypt(lng, lat);
      let point = { lng: lng, lat: lat };
      this.fun.goToWXAdress(point, store_name);
    },

    gotoEvaluate(item) {
      this.$router.push(this.fun.getUrl("ClientEvaluate", { service_id: item.id }));
    },
    cancelIt(item) {
      this.$dialog.confirm({ message: "您确定要取消此预约吗?"})
        .then(() => {
          this.cancelDate(item.id);
        }).catch(() => {
        });
    },
    cancelDate(id) {
      $http
        .get(
          "plugin.appointment.frontend.appointment-service.cancel-service",
          {
            id: id
          },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.init();
            this.getData();
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    createQrc(item) {
      let _url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/client_verification/" + item.id + "?i=" + this.fun.getKeyByI() + "&type=" + this.fun.getTyep() + "&mid=" + this.fun.getKeyByMid();
      QRCode.toCanvas(canvas, _url, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success");
          this.show = true;
        }
      });
    },
    init() {
      this.projectList = [];
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.show = false;
    },
    getData() {
      $http
        .get(
          "plugin.appointment.frontend.appointment-service.get-list",
          {  lng: this.point.lng, lat: this.point.lat, status: this.num, page: 1 },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.projectList = response.data.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.appointment.frontend.appointment-service.get-list",
            {
              lng: this.point.lng,
              lat: this.point.lat,
              status: this.num,
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.projectList = that.projectList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    //判断tab
    selectTab() {
      this.init();
      this.getData();
    },
    ready() {
      // let myLocation = this.$store.state.o2oLocation;

      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
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
        console.log(obj);
        Toast("定位失败");
      }
    }
  },
  components: { cTitle }
};
