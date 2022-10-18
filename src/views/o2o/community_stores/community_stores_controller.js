import { Toast } from "vant";
import DList from "@/components/dlist";

export default {
  data() {
    return {
      loading: false,
      page: 1,
      isLoadMore: true,
      communityStoreList: [],

      store_title: "",
      search: "",
      address: "",
      city: "",
      point: {}
    };
  },
  mounted() {
    this.ready();
  },
  activated() {
    if(this.$store.state.referer) {
      this.$store.commit('setReferer', "");
      this.initData();
      this.ready();
    }
  },
  methods: {
    initData() {
      this.loading = false;
      this.page = 1;
      this.isLoadMore = true;
      this.communityStoreList = [];
    },
    chooseCommunityStore(item) { // 跳转社区详情
      this.$router.push(this.fun.getUrl("communityStoreDetails",{fromHome: 1}, {id: item.id}));
    },
    tolocation() {
      this.$store.commit('setReferer',window.location.href);
      this.$router.push(this.fun.getUrl("o2oLocation",{},{tag:'community'}));
    },
    searchStore() {
      this.initData();
      this.getCommunityStoreListByPosition();
    },
    getCommunityStoreListByPosition() { // 获取社区数据
      if (!this.city) {
        Toast('请先选择定位');
        return;
      }
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }
      this.loading = true;
      let urls = "plugin.store-community.frontend.community.getList"; // 请求地址
      $http.get(urls, {
        lng: this.point.lng,
        lat: this.point.lat,
        city_name: this.city,
        page: this.page,
        kwd: this.search
      }, "").then(res => {
        if (res.result === 1) {
          this.store_title = res.data.plugin_name || '社区门店';
          this.fun.setWXTitle(this.store_title);
          this.page++;
          if (res.data.list.current_page === res.data.list.last_page || res.data.list.data.length === 0 || res.data.list.data.length < res.data.list.per_page) {
            this.isLoadMore = false;
          }
          this.communityStoreList = this.communityStoreList.concat(res.data.list.data);
          this.loading = false;
        } else {
          Toast(res.msg);
        }
      }).catch(error => {
        console.error(error);
      });
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.searchStore();
      }
    },
    ready() {
      // let myLocation = this.$store.state.o2oLocation;
      // console.info(myLocation);
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.point = myLocation.point;
      //   this.city = myLocation.city;
      //   this.getCommunityStoreListByPosition();
      // } else {
      //   console.info("location不存在");
      //   this.getLocation();
      // }

      this.fun.getLocation()
        .then((res) => {
          this.address = res.title;
          this.point = res.point;
          this.city = res.city;
          this.getCommunityStoreListByPosition();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getLocation() {
      let that = this;
      //加载地图，调用浏览器定位服务
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

      //解析定位结果
      function onComplete(obj) {
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

        let pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        that.getCommunityStoreListByPosition();
      }

      function onError(obj) {
        Toast("定位失败,请手动切换位置");
        console.log(obj);
      }
    }
  },
  components: {
    DList
  }
};
