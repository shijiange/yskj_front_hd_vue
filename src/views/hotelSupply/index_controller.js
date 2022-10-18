import { Toast } from 'vant';
import cTitle from "components/title";
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //定位
      location: {},
      hotelList:[],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 ,//总页数
      frontendData:''
    };
  },

  activated() {
    this.initData();
    // this.location = this.$store.state.o2oLocation;
    // this.location = {
    //   city: "上海市",
    //   province: "上海市",
    //   point: {
    //     lat:'31.301071',
    //     lng:"121.487673"
    //   }
    // }
    // if (this.fun.isTextEmpty(this.location.point)) {
    //   this.getLocation();
    // } else {
    //   this.getList();
    // }
    this.fun.getLocation()
      .then((res)=> {
        this.location = res;
        this.getList();
      })
      .catch((err)=> {
        console.log(err);
      });
    this.getFrontend();
  },
  mounted() {},
  methods: {
    getFrontend(){
      $http
        .get("plugin.hotel-supply.frontend.home.home", {})
        .then(res => {
          if (res.result == 1) {
            this.frontendData = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goPagebtn(url){
      if(url){
        window.location.href =url;
      }
    },
    //
    hotelBtn(id){
      this.$router.push(this.fun.getUrl('HotelSupplyHome',{id:id}));
    },
    getLocation() {
      var that = this;
      // var myLocation = this.$store.state.o2oLocation;
      console.log("route.name", this.$route);

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
        console.log("objjjjj", obj);
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
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        let point = {
          lat: position[1],
          lng: position[0]
        };
        // let address = obj.formattedAddress;
        // let title = obj.formattedAddress;
        let city = !that.fun.isTextEmpty(obj.addressComponent.city)
          ? obj.addressComponent.city
          : obj.addressComponent.province;
        let province = obj.addressComponent.province?obj.addressComponent.province:'';
        var pos = {
          address: obj.formattedAddress,
          city: city,
          title: obj.formattedAddress,
          province:province,
          point: point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        that.location = pos;
        that.getList();
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        //alert.log(obj.info);
        Toast("定位失败,请手动切换位置");
      }
    },
    //路由跳转
    routerGo(value) {
      if (value == "1") {
        this.$router.push(this.fun.getUrl('o2oLocation_loc',{},{tag:"hotelSupply"}));
      }
    },
    //搜索
    gotoSearch() {
      this.$router.push(
        this.fun.getUrl(
          "HotelSupplySearch"
        )
      );
    },
    getList() {
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      let json = {
        lng: p.lng,
        lat: p.lat,
        search:{
          city: this.location.city,
          province:this.location.province,
        },
        page: this.page
      };
      $http
        .post("plugin.hotel-supply.frontend.home.index", json)
        .then(res => {
          if (res.result == 1) {
            this.isLoadMore = true;
            this.total_page = res.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.hotelList = res.data.data;
            console.log(this.hotelList);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
        let json = {
          lng: p.lng,
          lat: p.lat,
          search:{
            city: this.location.city,
            province:this.location.province,
          },
          page: this.page
        };
        $http
          .post("plugin.hotel-supply.frontend.home.index", json)
          .then(res => {
            if (res.result == 1) {
              that.isLoadMore = true;
              if (res.result === 1) {
                var myData = res.data.data;
                that.hotelList = that.hotelList.concat(myData);//数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    initData() {
      this.hotelList = [];
      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
  },
  components: { cTitle}
};
