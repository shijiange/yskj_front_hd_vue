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
    //????????????
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
        .get(SEARCH_URL, json, "?????????...")
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

    //???????????????????????????
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
            "?????????..."
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
      this.isLoadMore = false; // ??????????????????????????????
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
          .get(SEARCH_URL, json, "?????????...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              this.list_arr = this.list_arr.concat(res.data.data); //????????????
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
          .get(SEARCH_URL, json, "?????????...")
          .then(res => {
            if (res.result == 1) {
              this.loading = false;
              this.allLoaded = false;
              this.list_arr = this.list_arr.concat(res.data.data); //????????????
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
      //	this.allLoaded = true;// ??????????????????????????????,??????????????????????????????
      if (this.isLoadMore) {
        this.searchMore();
        this.$refs.hotel_loadmore.onBottomLoaded();
      } else {
        console.log("??????????????????");
      }
    },

    //??????
    getLocation() {
      var that = this;
      // var myLocation = this.$store.state.o2oLocation;
      console.log("route.name", this.$route);

      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // ????????????????????????????????????:true
          timeout: 10000, // ??????10???????????????????????????????????????
          maximumAge: 0, // ??????????????????0??????????????????0
          convert: true, // ??????????????????????????????????????????????????????????????????true
          showButton: true, // ??????????????????????????????true
          buttonPosition: "LB", // ????????????????????????????????????'LB'????????????
          buttonOffset: new AMap.Pixel(10, 20), // ????????????????????????????????????????????????????????????Pixel(10, 20)
          showMarker: true, // ???????????????????????????????????????????????????????????????true
          showCircle: true, // ????????????????????????????????????????????????????????????true
          panToLocation: true, // ?????????????????????????????????????????????????????????????????????true
          zoomToAccuracy: true // ????????????????????????????????????????????????????????????????????????????????????????????????false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete); // ??????????????????
        AMap.event.addListener(geolocation, "error", onError); // ????????????????????????
      });

      function onComplete(obj) {
        console.log("objjjjj", obj);
        // var res =
        //   "????????????" +
        //   obj.position +
        //   "\n???????????????" +
        //   obj.accuracy +
        //   "???\n????????????????????????" +
        //   obj.location_type +
        //   "\n???????????????" +
        //   obj.info +
        //   "\n?????????" +
        //   obj.formattedAddress +
        //   "\n???????????????" +
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
        Toast("????????????,?????????????????????");
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
