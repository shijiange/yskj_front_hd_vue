import { Toast } from 'vant';
import cTitle from "components/title";
import hotelList from "components/hotel/list";
import { scrollMixin } from "../../utils/mixin";

const SEARCH_URL = "plugin.hotel.frontend.hotel.goods.get-hotel-goods-by-title";

export default {
  mixins: [scrollMixin],
  data() {
    return {
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,

      list_arr: [],
      location: {},
      search_value: "",

      toolbar: false,

      start_time: "",
      end_time: "",
      PageNameList: {},
      isLoading:false
    };
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.toolbar = false;

      this.initData();

      this.start_time = this.$route.query.start || "";
      this.end_time = this.$route.query.end || "";

      // this.location = this.$store.state.o2oLocation;
      this.showToolbar = false;

      this.getCustomizeHotelHead();

      // if (this.fun.isTextEmpty(this.location)) {
      //   this.getLocation();
      // } else {
      //   this.search();
      // }
      this.fun.getLocation()
        .then((res)=> {
          this.location = res;
          this.search();
        })
        .catch((err)=> {
          console.log(err);
        });
    }
  },
  activated() {
    if (this.$route.params.fromHome === 1) {
      this.toolbar = false;

      this.initData();

      this.start_time = this.$route.query.start || "";
      this.end_time = this.$route.query.end || "";

      // this.location = this.$store.state.o2oLocation;
      this.showToolbar = false;

      this.getCustomizeHotelHead();

      // if (this.fun.isTextEmpty(this.location)) {
      //   this.getLocation();
      // } else {
      //   this.search();
      // }

      this.fun.getLocation()
        .then((res)=> {
          this.location = res;
          this.search();
        })
        .catch((err)=> {
          console.log(err);
        });
    }else{
      if (window.location.href.indexOf("#/hotel/search") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.homesearchScrollTop);
        }, 200);
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    window.homesearchScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  mounted() {
    window.homesearchScrollTop = 0;
  },
  methods: {
    //附近搜索
    search() {
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      let json = {
        lng: p.lng,
        lat: p.lat,
        city_name: this.location.city,
        page: this.page,
        entrance_time: this.$route.query.start || "",
        price: this.$route.query.price || "",
        star_rated: this.$route.query.star || "",
        category_id: this.$route.query.category || "",
        leave_at: this.$route.query.end || "",
        kwd: this.search_value
      };
      $http
        .get(SEARCH_URL, json, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.list_arr = res.data.data;
            // this.total_page = res.data.last_page;
            this.isLoading = false;
            this.page = 1;
            this.isLoadMore = true;
            this.total_page = res.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //获取酒店自定义字段
    getCustomizeHotelHead() {
      var isQuestHotel = localStorage.getItem("customizeHotelHead");
      if (!this.fun.isTextEmpty(isQuestHotel)) {
        this.PageNameList = JSON.parse(
          localStorage.getItem("customizeHotelHead")
        );
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
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page == that.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
        let json = {
          lng: p.lng,
          lat: p.lat,
          city_name: this.location.city,
          page: this.page,
          entrance_time: this.$route.query.start || "",
          price: this.$route.query.price || "",
          star_rated: this.$route.query.star || "",
          category_id: this.$route.query.category || "",
          leave_at: this.$route.query.end || "",
          kwd: this.search_value
        };
        $http
          .get(SEARCH_URL, json, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              this.list_arr = this.list_arr.concat(res.data.data); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    searchMore() {
      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        this.loading = true;
        this.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
        let json = {
          lng: p.lng,
          lat: p.lat,
          city_name: this.location.city,
          page: this.page,
          entrance_time: this.$route.query.start || "",
          price: this.$route.query.price || "",
          star_rated: this.$route.query.star || "",
          category_id: this.$route.query.category || "",
          leave_at: this.$route.query.end || "",
          kwd: this.search_value
        };
        $http
          .get(SEARCH_URL, json, "加载中...")
          .then(res => {
            if (res.result == 1) {
              this.loading = false;
              this.allLoaded = false;
              this.list_arr = this.list_arr.concat(res.data.data); //数组拼接
            } else {
              this.page = this.page - 1;
              this.loading = true;
              this.allLoaded = true;
              this.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.list_arr = [];
    },

    loadTop() {
      this.initData();
      this.search();
      // this.$refs.hotel_loadmore.onTopLoaded();
    },

    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.isLoadMore) {
        this.searchMore();
        this.$refs.hotel_loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    },

    //定位
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
        // //alert(JSON.stringify(obj.addressComponent, null, 4));
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

        var pos = {
          address: obj.formattedAddress,
          city: city,
          title: obj.formattedAddress,
          point: point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        that.location = pos;
        that.search();
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        //alert.log(obj.info);
        Toast("定位失败,请手动切换位置");
      }
    },

    gotoSearch() {
      this.initData();
      this.search();
    },

    showToolbar() {
      this.toolbar = !this.toolbar;
    }
  },
  components: { cTitle, hotelList }
};
