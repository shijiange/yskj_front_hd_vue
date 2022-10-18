import cTitle from "components/title";
import { Toast } from 'vant';
import BScroll from "better-scroll";
export default {
  data() {
    return {
      city: "",
      value: "",
      goodsInfo: [],
      categories: [],
      recommand: [],
      discount: [],
      hot: [],
      now: "",

      set:{}
    };
  },
  created() {},
  activated() {
    this.initPageData();
    this.now = String(Date.parse(new Date())).substr(0, 10);
    this.ready();
    this.getSlide();
    this.getcategories();
  },
  mounted() {},
  methods: {
    bannerTo(item) {
      if (item.link.length > 0) {
        window.location.href = item.link;
      }
    },
    toEnroll(item) {
      this.$router.push(
        this.fun.getUrl("enrollEnter", {
          id: item.id
        })
      );
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    search() {
      this.$router.push(
        this.fun.getUrl("searchResult", {
          city: this.city
        })
      );
    },
    initPageData() {
      this.value = "";
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes()) + ":";
      let s = this.change(date.getSeconds());
      return Y + M + D + h + m + s;
    },
    getDate(obj) {
      var date = new Date(obj * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate());
      return M + D;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    getData() {
      let json = {
        city_name: this.city
      };
      $http
        .get("plugin.activity-apply.api.index.getActivity", json, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.recommand = response.data.$recommand;
            this.discount = response.data.discount;
            this.hot = response.data.hot;
            this.set = response.data.set;
            this.$nextTick(() => {
              let timer = setTimeout(() => {
                // 其实我也不想写这个定时器的，这相当于又嵌套了一层$nextTick，但是不这么写会失败
                if (timer) {
                  clearTimeout(timer);
                  this.verScroll();
                }
              }, 0);
              let timerOne = setTimeout(() => {
                // 其实我也不想写这个定时器的，这相当于又嵌套了一层$nextTick，但是不这么写会失败
                if (timerOne) {
                  clearTimeout(timerOne);
                  this.hotScroll();
                }
              }, 0);
            });
            this.fun.wxShare(
              "",
              {},
              {
                title: this.set && !this.fun.isTextEmpty(this.set.share_title) ? this.set.share_title : "",
                imgUrl: this.set && !this.fun.isTextEmpty(this.set.share_thumb) ? this.set.share_thumb : "",
                description: this.set && !this.fun.isTextEmpty(this.set.share_desc) ? this.set.share_desc : ""
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSlide() {
      $http
        .get("plugin.activity-apply.api.index.getLantetnSlide", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.goodsInfo = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getcategories() {
      $http
        .get("plugin.activity-apply.api.index.getCalssify", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.categories = response.data.reverse();
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取更多数据
    verScroll() {
      let width = (this.discount.length + 1) * 7 + "rem"; // 动态计算出滚动区域的大小，前面已经说过了，产生滚动的原因是滚动区域宽度大于父盒子宽度
      this.$refs.cont.style.width = width; // 修改滚动区域的宽度
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.personTab, {
            startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical"
          });
        } else {
          this.scroll.refresh(); //如果dom结构发生改变调用该方法
        }
      });
    },
    hotScroll() {
      let width = (this.hot.length + 0.2) * 7 + "rem"; // 动态计算出滚动区域的大小，前面已经说过了，产生滚动的原因是滚动区域宽度大于父盒子宽度
      this.$refs.hotCon.style.width = width; // 修改滚动区域的宽度
      this.$nextTick(() => {
        if (!this.scrollOne) {
          this.scrollOne = new BScroll(this.$refs.hotTab, {
            startX: 0, // 配置的详细信息请参考better-scroll的官方文档，这里不再赘述
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical"
          });
        } else {
          this.scrollOne.refresh(); //如果dom结构发生改变调用该方法
        }
      });
    },
    toSort(item) {
      this.$router.push(
        this.fun.getUrl("Sort",{},{
          id: item.id,
        })
      );
    },
    least() {
      if(!this.city){
        Toast('请先选择城市');
        return;
      }
      this.$router.push(
        this.fun.getUrl("Sort", {},{
          title: "近期热门",
        })
      );
    },
    concentration() {
      if(!this.city){
        Toast('请先选择城市');
        return;
      }

      this.$router.push(
        this.fun.getUrl("Sort",{},{
          title: "人气精选",
        })
      );
    },
    routerGo() {
      this.$router.push(
        this.fun.getUrl("o2oLocation", {}, { tag: "activity" })
      );
    },
    ready() {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   //this.$store.commit('updateLocation', myLocation);
      //   //this.$store.commit('setLocation', myLocation);
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
        that.ready();
      }

      function onError(obj) {
        console.log(obj);
      }
    }
  },
  components: {
    cTitle
  }
};
