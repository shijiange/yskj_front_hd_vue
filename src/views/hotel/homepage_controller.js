import { Toast } from 'vant';
import cTitle from "components/title";
import datePicker from "components/hotel/date_picker";
import { scrollMixin } from "../../utils/mixin";

const HOME_PAGE_URL =
  "plugin.hotel.frontend.hotel.get-hotel-info.get-info-by-hotel-id";

// const HOME_PAGE_NAME_URL =
//   "plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name";

const ROOM_URL = "plugin.hotel.frontend.hotel.goods.get-goods-to-page";

export default {
  mixins: [scrollMixin],
  data() {
    return {
      data_info: {},
      show1: false, //入店时间弹窗
      show2: false, //离店时间弹窗
      detail: "",
      star_num: "",
      location: {},
      phone: "",
      is_cashier: false,
      PageNameList: {}, //自定义标题

      room_arr: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,

      start: "",
      end: "",
      night_day: "",

      banner_img: "",
      name: "",
      catagory_name: "",

      toolbar: false,
      isLoading:false
    };
  },

  activated() {
    if (this.$route.params.fromHome === 1) {
      // this.location = this.$store.state.o2oLocation;
      // console.log("this.location", this.location);
      this.is_cashier = false;

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

      this.toolbar = false;
      this.getInitTime();
      this.getDays(this.start, this.end);
      this.initData();
      this.getData();

      this.getCustomizeHotelHead();

      this.start = this.$route.query.start;
      this.end = this.$route.query.end;
    } else {
      if (window.location.href.indexOf("#/hotel/home_page/") > -1) {
        setTimeout(() => {
          window.scrollTo(0, window.homepageScrollTop);
        }, 200);
      }
    }

  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      // this.location = this.$store.state.o2oLocation;
      // console.log("this.location", this.location);
      this.is_cashier = false;

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

      this.toolbar = false;
      this.getInitTime();
      this.getDays(this.start, this.end);
      this.initData();
      this.getData();

      this.getCustomizeHotelHead();

      // this.start = this.$route.query.start;
      // this.end = this.$route.query.end;
    }
  },
  mounted() {
    window.homepageScrollTop = 0;
  },
  beforeRouteLeave (to, from, next) {
    window.homepageScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    next();
  },
  methods: {
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
            this.phone = `tel:${res.data.mobile}`;
            //this.detail=res.data.has_one_details.information;
            this.is_cashier = res.data.is_cashier == 1 ? true : false;
            this.getStar(res.data.star_rated);
          }else{
            Toast({
              message: res.msg,
              duration: 1200
            });
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
        this.fun.setWXTitle(this.PageNameList.hotel_home_page);
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
              this.fun.setWXTitle(response.data.hotel_home_page);
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

    //星级
    getStar(vaule) {
      switch (vaule) {
      case 0:
        this.star_num = "未评星";
        break;
      case 2:
        this.star_num = "二星级经济型";
        break;
      case 3:
        this.star_num = "三星级舒适性";
        break;
      case 4:
        this.star_num = "四星级高档型";
        break;
      case 5:
        this.star_num = "五星级豪华型";
        break;
      default:
        break;
      }
    },

    gotoCheckRoom() {
      this.$router.push(
        this.fun.getUrl(
          "HotelChooseRoom",
          { id: this.data_info.id },
          { city: this.$route.query.city }
        )
      );
    },

    goToAdress(lng, lat) {
      let point = this.fun.bd_decrypt(
        // this.location.point.lng,
        // this.location.point.lat
        lng,
        lat
      );
      this.fun.goToWXAdress(point, this.data_info.hotel_name, "详细地址");
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
        // that.location = pos;

        that.getHomePageData(point.lng, point.lat);
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        //alert.log(obj.info);
        Toast("定位失败,请手动切换位置");
      }
    },

    gotoCashier() {
      //HotelCashierPay
      this.$router.push(
        this.fun.getUrl("HotelCashierPay", { hotel_id: this.$route.params.id })
      );
    },

    //查看房型
    getData() {
      let json = {
        page: this.page,
        hotel_id: this.$route.params.id,
        enter_at: this.start,
        leave_at: this.end
      };
      $http
        .get(ROOM_URL, json, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.room_arr = res.data.list.data;

            this.page = 1;
            this.isLoadMore = true;
            this.total_page = res.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }

            if (this.fun.isTextEmpty(this.banner_img)) {
              this.banner_img = res.data.hotel.banner_thumb;
            }
            if (this.fun.isTextEmpty(this.name)) {
              this.name = res.data.hotel.hotel_name;
            }

            if (this.fun.isTextEmpty(this.catagory_name)) {
              this.catagory_name = res.data.hotel.has_one_category.name;
            }
            this.isLoading = false;
          } else {
            this.$dialog.alert({message:res.msg});
            this.isLoading = false;
            this.$router.go(-1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    initData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.room_arr = [];
    },

    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page == that.total_page) {
        return;
      } else {
        that.page = that.page + 1;
        let json = {
          page: that.page,
          hotel_id: that.$route.params.id,
          enter_at: that.start,
          leave_at: that.end
        };
        $http
          .get(ROOM_URL, json, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              let nextPageData = res.data.list.data;
              that.room_arr = that.room_arr.concat(nextPageData);
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

    loadTop() {
      this.initData();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    },

    // loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.isLoadMore) {
    //     console.log("加载更多")
    //     this.getMoreData();
    //     this.$refs.loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },

    getTime() {
      let now = new Date();
      let next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      //this.start=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
      //this.end=`${next.getFullYear()}-${next.getMonth()+1}-${next.getDate()}`;

      this.start = `${now.getFullYear()}-${
        now.getMonth() + 1 < 10
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`
      }-${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`;
      this.end = `${next.getFullYear()}-${
        next.getMonth() + 1 < 10
          ? `0${next.getMonth() + 1}`
          : `${next.getMonth() + 1}`
      }-${next.getDate() < 10 ? `0${next.getDate()}` : `${next.getDate()}`}`;
    },

    acceptTime(type, date) {
      if (type == "离店") {
        this.end = date;
      } else if (type == "入住") {
        this.start = date;
      }

      this.checkDate(type);
    },

    checkDate(type) {
      //入住日期不能为空
      //离店日期不能小于住店日期
      //离店日期不能和住店日期同一天
      let start = new Date(this.start).getTime();
      let end = new Date(this.end).getTime();
      if (this.fun.isTextEmpty(this.start)) {
        this.$notify({
          message: "请先选择入住日期",
          duration: 1000,
          background: "#1989fa"
        });
        this.end = "";
        return;
      } else {
        if (start == end) {
          this.$notify({
            message: "入住和离店日期不能为同一天",
            duration: 1000,
            background: "#1989fa"
          });
          this.end = "";
          return;
        }
        if (start > end) {
          this.$notify({
            message: "离店日期需要大于入店日期",
            duration: 1000,
            background: "#1989fa"
          });
          this.end = "";
          return;
        }

        //关闭弹窗
        if (type == "离店") {
          //计算多少晚
          this.getDays(this.start, this.end);
          this.show2 = false;
          //执行搜索
          this.initData();
          this.getData();
        } else if (type == "入住") {
          this.getDays(this.start, this.end);
          this.show1 = false;
        }
      }
    },

    //时间日期
    getDays(strDateStart, strDateEnd) {
      let strSeparator = "-"; //日期分隔符
      let oDate1, oDate2, iDays;
      oDate1 = strDateStart.split(strSeparator);
      oDate2 = strDateEnd.split(strSeparator);
      let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      console.log(iDays);
      this.night_day = iDays;
    },

    gotoGoods(val) {
      if (this.fun.isTextEmpty(this.start)) {
        Toast("住店时间不能为空");
        return;
      }

      if (this.fun.isTextEmpty(this.end)) {
        Toast("离店时间不能为空");
        return;
      }
      this.$router.push(
        this.fun.getUrl(
          "goods",
          { id: val },
          { start: this.start, end: this.end }
        )
      );
    },

    close(type) {
      if (type == "离店") {
        this.show2 = false;
      } else if (type == "入住") {
        this.show1 = false;
      }
    },

    showToolbar() {
      this.toolbar = !this.toolbar;
    },

    getInitTime() {
      if (
        this.fun.isTextEmpty(this.$route.query.start) ||
        this.fun.isTextEmpty(this.$route.query.end)
      ) {
        this.getTime();
      } else {
        this.start = this.$route.query.start;
        this.end = this.$route.query.end;
      }
    }
  },
  components: { cTitle, datePicker }
};
