import cTitle from "components/title";
import { scrollMixin } from "utils/mixin";
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      status: "1",
      category: {},
      show1: false,
      show2: false,
      className: [],
      url: "",
      json: {},
      sort: "asc",
      point: {},
      city: '',

      kwd: "",
      projectList: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.init();
    this.getClass();
    // this.getData();
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
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    evaluateBtn() {
      if (this.sort == "asc") {
        this.sort = "desc";
      } else {
        this.sort = "asc";
      }
      this.show1 = false;
      this.getData();
    },
    selectType(type) {
      if (type == this.status) {
        this.show2 = false;
        return;
      }
      this.status = type;
      this.projectList = [];
      this.getData();

      if (this.status === "2") {
        this.category = {};
      }
      this.show2 = false;
    },
    selectClass(item) {
      if (!item.id) {
        this.category = {};
      } else {
        this.category = item;
      }
      this.getData();
      this.show1 = false;
    },
    getClass() {
      $http
        .get(
          "plugin.appointment.frontend.project-category.get-list",
          {},
          "获取中"
        )
        .then(response => {
          this.fun.setWXTitle("搜索"+this.appointmentLang.project+"/"+this.appointmentLang.worker);
          if (response.result === 1) {
            this.className = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showClass() {
      if (this.status === "2") {
        return;
      }
      this.show2 = false;
      this.show1 ? this.show1 = false : this.show1 = true;
    },
    showProject() {
      this.show1 = false;
      this.show2 ? this.show2 = false : this.show2 = true;
    },
    toUrl(str, params) {
      this.$router.push(this.fun.getUrl(str, params));
    },
    init() {
      this.projectList = [];
      this.kwd = "";
      this.category = {};
      this.status = "1";
      this.show1 = false;
      this.show2 = false;
      this.sort = "asc";
      this.isLoadMore = true;
      this.json.page = 1;
      this.total_page = 0;
    },
    getData() {
      if (!this.point.lng) {
        this.ready();
        return;
      }
      if (this.status === "1") {
        this.url = "plugin.appointment.frontend.project.get-list";
        this.json = {
          lng: this.point.lng,
          lat: this.point.lat,
          city_name: this.city,
          sort: this.sort,
          category_id: this.category.id,
          name: this.kwd,
          page: 1
        };
      } else {
        this.url = "plugin.appointment.frontend.worker.get-workers-by-name";
        this.json = {
          lng: this.point.lng,
          lat: this.point.lat,
          city_name: this.city,
          kwd: this.kwd,
          page: 1
        };
      }

      $http
        .get(this.url, this.json, "加载中")
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
      if (this.json.page >= this.total_page) {
        return;
      } else {
        this.json.page = this.json.page + 1;
        $http
          .get(this.url, this.json, "加载中")
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.projectList = that.projectList.concat(myData); //数组拼接
              } else {
                that.json.page = that.json.page - 1;
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
    ready() {
      // let myLocation = this.$store.state.o2oLocation;

      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   //初始化数据
      //   this.getData();
      // } else {
      // console.log("location不存在");
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
      // this.getLocation();
      // }
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
