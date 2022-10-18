import { Toast } from 'vant';
import cTitle from "components/title";
import datePicker from "components/hotel/date_picker";
import hotelList from "components/hotel/list";
import { scrollMixin } from "../../utils/mixin";

const INDEX_OTHER_URL =
  "plugin.hotel.frontend.hotel.get-default.get-index-data";
const CATAGORY_URL = "plugin.hotel.frontend.hotel.hotel-category.get-list";
const HOTEL_LIST = "plugin.hotel.frontend.hotel.hotel.get-hotel-list-to-page";

export default {
  mixins: [scrollMixin],
  data() {
    return {
      show1: false,
      show2: false,
      show3: false,

      value: 0,
      date_obj_arr: [],

      //入住时间
      start_time: "",
      //离店时间
      end_time: "",
      //入住几晚
      night_day: "",

      //轮播图片
      carousels_arr: [],
      //banner图片
      bannerObj: {},
      //分类
      catagory_arr: [],

      //定位
      location: {},
      //酒店列表
      hotel_arr: [],
      loading: false,
      allLoaded: false,
      goload: true,
      // isLoadMore: true,
      // page: 1,
      // total_page: 0,

      star_arr: [
        { name: "二星及以下/经济型", value: 2 },
        { name: "三星/舒适", value: 3 },
        { name: "四星/高档", value: 4 },
        { name: "五星/豪华", value: 5 },
        { name: "六星", value: 6 },
        { name: "七星", value: 7 },
        { name: "八星", value: 8 },
        { name: "不限", value: 0 }
      ],

      current_index: 0,

      star_value: 0,

      toolbar: false,
      PageNameList: {} ,//标题
      isLoading:false,
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },

  activated() {
    this.toolbar = false;
    // this.location = this.$store.state.o2oLocation;
    this.getInitTime();
    this.getOtherData();
    this.getCatagoryData();

    this.getCustomizeHotelHead();

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
  },

  mounted() {},
  methods: {
    //初始化数据
    initData() {
      this.carousels_arr = [];
      this.bannerObj = {};
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

    //获取酒店自定义字段
    getCustomizeHotelHead() {
      var isQuestHotel = localStorage.getItem("customizeHotelHead");
      if (!this.fun.isTextEmpty(isQuestHotel)) {
        this.PageNameList = JSON.parse(
          localStorage.getItem("customizeHotelHead")
        );
        //this.fun.setWXTitle(this.PageNameList.goods_details);
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
              //this.fun.setWXTitle(response.data.goods_details);
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

    acceptTime(type, date) {
      if (type == "离店") {
        this.end_time = date;
      } else if (type == "入住") {
        this.start_time = date;
      }

      this.checkDate(type);
    },

    checkDate(type) {
      //入住日期不能为空
      //离店日期不能小于住店日期
      //离店日期不能和住店日期同一天
      let start = new Date(this.start_time).getTime();
      let end = new Date(this.end_time).getTime();
      if (this.fun.isTextEmpty(this.start_time)) {
        this.$notify({
          message: "请先选择入住日期",
          duration: 1000,
          background: "#1989fa"
        });
        this.end_time = "";
        return;
      } else {
        if (start == end) {
          this.$notify({
            message: "入住和离店日期不能为同一天",
            duration: 1000,
            background: "#1989fa"
          });
          this.end_time = "";
          return;
        }
        if (start > end) {
          this.$notify({
            message: "离店日期需要大于入店日期",
            duration: 1000,
            background: "#1989fa"
          });
          this.end_time = "";
          return;
        }

        //关闭弹窗
        if (type == "离店") {
          //计算多少晚
          this.getDays(this.start_time, this.end_time);
          this.show3 = false;
        } else if (type == "入住") {
          this.show2 = false;
        }
      }
    },

    //路由跳转
    routerGo(value) {
      if (value == "1") {
        this.$router.push(this.fun.getUrl("o2oLocation", {}, { tag: "hotel" }));
      }
    },

    //图片跳转
    imgHref(value) {
      window.location.href = value;
    },

    //获取轮播 分类数据
    getOtherData() {
      $http
        .get(INDEX_OTHER_URL, {}, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.carousels_arr = res.data.carousels;
            this.bannerObj = res.data.banner;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //获取分类
    getCatagoryData() {
      $http
        .get(CATAGORY_URL, {})
        .then(res => {
          if (res.result == 1) {
            this.catagory_arr = res.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //分类跳转
    goCatagory(value) {
      if (this.fun.isTextEmpty(this.start_time)) {
        Toast("请选择入住时间");
        return;
      }

      if (this.fun.isTextEmpty(this.end_time)) {
        Toast("请选择离店时间");
        return;
      }
      this.$router.push(
        this.fun.getUrl("HotelSearch", {fromHome: 1}, { category: value.id, start: this.start_time, end: this.end_time })
      );
    },

    //酒店列表
    initListData() {
      this.page = 1;
      this.total_page = 0;
      this.goload = true;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.hotel_arr = [];
    },
    getList() {
      let p = this.fun.bd_encrypt(this.location.point.lng, this.location.point.lat);
      let json = {
        lng: p.lng,
        lat: p.lat,
        city_name: this.location.city,
        page: this.page
      };
      $http
        .get(HOTEL_LIST, json)
        .then(res => {
          if (res.result == 1) {
            this.hotel_arr = res.data.data;
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
          page: this.page
        };
        $http
          .get(HOTEL_LIST, json, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              this.hotel_arr = this.hotel_arr.concat(res.data.data);
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
    getMoreList() {
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
          page: this.page
        };
        $http
          .get(HOTEL_LIST, json, "加载中...")
          .then(res => {
            if (res.result == 1) {
              this.loading = false;
              this.allLoaded = false;
              this.hotel_arr = this.hotel_arr.concat(res.data.data);
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

    loadTop() {
      this.initListData();
      this.getList();
      // this.$refs.hotel_loadmore.onTopLoaded();
    },

    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.isLoadMore) {
        this.getMoreList();
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
        that.getList();
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        //alert.log(obj.info);
        Toast("定位失败,请手动切换位置");
      }
    },

    //搜索
    gotoSearch() {
      this.$router.push(
        this.fun.getUrl(
          "HotelSearch",
          {fromHome: 1},
          { start: this.start_time, end: this.end_time }
        )
      );
    },

    //搜索2
    gotoSearch2() {
      if (this.fun.isTextEmpty(this.start_time)) {
        Toast("请选择入住时间");
        return;
      }

      if (this.fun.isTextEmpty(this.end_time)) {
        Toast("请选择离店时间");
        return;
      }
      this.$router.push(
        this.fun.getUrl(
          "HotelSearch",
          {fromHome: 1},
          {
            price: this.value,
            star: this.star_value,
            start: this.start_time,
            end: this.end_time
          }
        )
      );
    },

    starChoose(index, item) {
      this.current_index = index;
      this.star_value = item.value;
    },

    starSubmit(tag) {
      if (tag == "reset") {
        this.current_index = 0;
        this.star_value = 2;
        this.value = 0;
      } else if (tag == "complete") {
        this.show1 = false;
      }
    },

    closeHander(type) {
      if (type == "离店") {
        this.show3 = false;
      } else if (type == "入住") {
        this.show2 = false;
      }
    },

    showToolbar() {
      this.toolbar = !this.toolbar;
    },
    getInitTime() {
      let now = new Date();
      let next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      //this.start=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
      //this.end=`${next.getFullYear()}-${next.getMonth()+1}-${next.getDate()}`;

      this.start_time = `${now.getFullYear()}-${
        now.getMonth() + 1 < 10
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`
      }-${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`;
      this.end_time = `${next.getFullYear()}-${
        next.getMonth() + 1 < 10
          ? `0${next.getMonth() + 1}`
          : `${next.getMonth() + 1}`
      }-${next.getDate() < 10 ? `0${next.getDate()}` : `${next.getDate()}`}`;
    }
  },
  components: { cTitle, datePicker, hotelList }
};
