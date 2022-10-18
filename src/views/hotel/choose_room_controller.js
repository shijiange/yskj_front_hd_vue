import { Toast } from 'vant';
// import cTitle from "components/title";
//import datePicker from "components/hotel/date_picker";
//const ROOM_URL = "plugin.hotel.frontend.hotel.goods.get-goods-to-page";

const HOME_PAGE_URL =
  "plugin.hotel.frontend.hotel.get-hotel-info.get-info-by-hotel-id";

export default {
  data() {
    return {
      show1: true,
      show2: true,

      wxTitie: "",
      PageNameList: {},

      location: {},
      data_info:{},
      hotel_introduce: '',

      // 是否展示所有文本内容
      showTotal: false,
      // 显示展开还是收起
      exchangeButton: true,
      // 是否显示展开收起按钮
      showExchangeButton: false,
    };
  },

  activated() {
    this.getCustomizeHotelHead();

    // this.location = this.$store.state.o2oLocation;
    // if (this.fun.isTextEmpty(this.location.point)) {
    //   this.getLocation();
    // } else {
    //   this.getHomePageData(this.location.point.lng, this.location.point.lat);
    // }

    this.fun.getLocation()
      .then((res)=> {
        this.location = res;
        this.getHomePageData(res.point.lng, res.point.lat, res.city);
      })
      .catch((err)=> {
        console.log(err);
      });
  },

  mounted() {},
  methods: {
    goto() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("HotelHome", {id: this.$route.params.id},{city:this.$route.query.city}));
      } else {
        this.$router.go(-1);
      }
    },
    //获取酒店自定义字段
    getCustomizeHotelHead() {
      var isQuestHotel = localStorage.getItem("customizeHotelHead");
      if (!this.fun.isTextEmpty(isQuestHotel)) {
        this.PageNameList = JSON.parse(
          localStorage.getItem("customizeHotelHead")
        );
        this.fun.setWXTitle(`${this.PageNameList.hotels}详情`);
      } else {
        $http
          .get(
            "plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name",
            {},
            "加载中..."
          )
          .then(response => {
            if (response.result == 1) {
              this.PageNameList = response.data;
              this.fun.setWXTitle(response.data.check_the_room);
              localStorage.setItem(
                "customizeHotelHead",
                JSON.stringify(response.data)
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getHomePageData(lng_val, lat_val) {
      let json = {
        hotel_id: this.$route.params.id,
        lng: lng_val,
        lat: lat_val,
        city_name: this.$route.query.city
      };
      $http
        .get(HOME_PAGE_URL, json, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.data_info = res.data;
            this.hotel_introduce = res.data.hotel_introduce;
          }else{
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //定位
    getLocation() {
      var that = this;
      // var myLocation = this.$store.state.o2oLocation;
      console.log("route.name", this.$route);
      Toast({
        message: "正在定位中",
        duration: 1000
      });
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
        let point = {
          lat: position[1],
          lng: position[0]
        };
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city)? obj.addressComponent.city: obj.addressComponent.province;
        var pos = {
          address: obj.formattedAddress,
          city: citys,
          title: obj.formattedAddress,
          point: point
        };
        console.log("test pos", pos);
        console.log("point",point);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        that.getHomePageData(point.lng, point.lat,that.city);
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        //alert.log(obj.info);
        Toast("定位失败,请手动切换位置");
      }
    },
    toggleShow1() {
      this.show1 = !this.show1;
    },

    toggleShow2() {
      this.show2 = !this.show2;
    },
    showTotalIntro () {
      this.showTotal = !this.showTotal;
      this.exchangeButton = !this.exchangeButton;
    },
  },
  components: {  },
  watch: {
    'hotel_introduce': function () {
      this.$nextTick(function () {
        console.log('nextTick');
        // 判断介绍是否超过四行
        if (!this.hotel_introduce) {
          console.log('喵~，没有简介');
          return;
        }
        let descHeight = document.getElementById("introduceH").offsetHeight;
        console.log('descHeight:' + descHeight);
        //console.log("fontSize",document.documentElement.style.fontSize)
        let htmlRem = document.documentElement.style.fontSize;
        console.log(htmlRem.match(/(\S*)px/)[1]);//截取px的数字
        let Rems = htmlRem.match(/(\S*)px/)[1];
        if (descHeight > 3.375*Rems) {
          console.log("超过了三行");
          // 显示展开收起按钮
          this.showExchangeButton = true;
          this.exchangeButton = true;
          // 不是显示所有
          this.showTotal = false;
        } else {
          // 不显示展开收起按钮
          this.showExchangeButton = false;
          // 没有超过三行就显示所有
          this.showTotal = true;
          console.log('showExchangeButton', this.showExchangeButton);
          console.log('showTotal', this.showTotal);
        }
      }.bind(this));
    }
  }
};
