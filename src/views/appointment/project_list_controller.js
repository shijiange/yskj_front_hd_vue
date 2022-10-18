import cTitle from "components/title";
import { scrollMixin } from "../../utils/mixin"; //引入加载更多
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      show1: false,
      sort: "asc",
      category: {},
      name: "",

      point: {},
      city: '',
      // more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      titleInfo: "", // 标题
      commentList: [],
      CategoryList: []
    };
  },
  activated() {
    this.init();
    this.fun.getLocation()
      .then((res)=> {
        this.point = res.point;
        this.address = res.title;
        this.city = res.city;
        this.search();
      })
      .catch((err)=> {
        console.log(err);
      });
    this.getCategoryList();
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
    init() {
      this.category = {};
      this.name = "";
      this.sort = "asc";
      this.show1 = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.commentList = [];
    },
    getCategoryList() {
      $http
        .post(
          "plugin.appointment.frontend.project-category.get-list",
          {},
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.CategoryList = response.data;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectionBtn(item) {
      if (!item.name) {
        this.category = {};
      } else {
        this.category = item;
      }

      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.search();
      this.show1 = false;
    },
    goProjectDetails(id) {
      this.$router.push(
        this.fun.getUrl("ProjectDetails", { project_id: id })
      );
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.page = 1;
        this.isLoadMore = true;
        this.total_page = 0;
        this.search();
      }
    },
    search(page) {
      if (page) {
        this.page = page;
        this.isLoadMore = true;
        this.total_page = 0;
      }
      $http
        .post(
          "plugin.appointment.frontend.project.get-list",
          {
            lng: this.point.lng,
            lat: this.point.lat,
            city_name: this.city,
            sort: this.sort,
            category_id: this.category.id,
            name: this.name,
            page: this.page
          },
          "获取中"
        )
        .then(response => {
          this.fun.setWXTitle(this.appointmentLang.project+"详情");
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.commentList = response.data.data;
          } else {
            this.$dialog.alert({message:response.msg});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    showClass() {
      this.show1 ? this.show1 = false : this.show1 = true;
    },
    evaluateBtn() {
      if (this.sort == "asc") {
        this.sort = "desc";
      } else {
        this.sort = "asc";
      }
      this.show1 = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.search();
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .post(
            "plugin.appointment.frontend.project.get-list",
            {
              lng: this.point.lng,
              lat: this.point.lat,
              city_name: this.city,
              sort: this.sort,
              category_id: this.category.id,
              name: this.name,
              page: this.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.commentList = that.commentList.concat(myData); //数组拼接
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
    getLocation() {
      var that = this;
      var mapObj = new AMap.Map("iCenter");
      Toast.loading({
        message: '正在定位',
        forbidClick: true,
      });
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
        Toast.clear();
        that.search();
      }

      function onError(obj) {
        console.log(obj);
        Toast("定位失败");
      }
    }
  },
  components: { cTitle }
};
