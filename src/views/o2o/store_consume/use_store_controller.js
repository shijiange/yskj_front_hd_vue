import cTitle from "components/title";
// import {Toast} from 'vant';
import { scrollMixin } from 'utils/mixin';

export default {
  mixins: [scrollMixin],
  data() {
    return {
      value: '',
      isLoadMore: true, //判断是否要加载更多的标识
      total_page: 0, //总共有多少页
      amount: '',
      card_id: '',
      city: '',
      store_name: '',
      page: 1,
      storeList: [],
      // address: {},
      hold_id: '',
      noStore: false,
      locationAddress: '',
      addressState: false,
      lat: '',
      lng: '',
      address: "",
      point: {},
      noneMore:false,
      activatedStatus:false,
    };
  },
  created() {
    // this.ready();
  },
  activated() {
    this.card_id = this.$route.params.id;
    this.activatedStatus = false,
    this.page = 1;
    this.noStore = false;
    this.noneMore = false;
    this.isLoadMore = true;
    this.ready();
    window.scrollTo(0,0);
  },
  mounted() {

  },
  methods: {
    getLocation() {
      var that = this;
      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function () {
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
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        that.point = pos.point;
        that.getCartList(that.card_id, pos.point.lat, pos.point.lng, that.store_name, that.page);
      }

      function onError(obj) {
        console.log(obj);
      }
    },

    ready() {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.address = myLocation.title;
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   this.getCartList(this.card_id, this.point.lat, this.point.lng, this.store_name, this.page);
      // } else {
      //   console.log("location不存在");
      //   this.getLocation();
      // }
      this.fun.getLocation()
        .then((res) => {
          this.address = res.title;
          this.city = res.city;
          this.point = res.point;
          this.getCartList(this.card_id, this.point.lat, this.point.lng, this.store_name, this.page);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getCartList(card_id, lat, lng, store_name, page) {
      let that = this;
      var p = that.fun.bd_encrypt(lng, lat);
      $http.get("plugin.store-card.Frontend.Modules.Card.Controllers.detail.index", {
        card_id: card_id,
        lat: p.lat,
        lng: p.lng,
        store_name: store_name,
        page: page
      }).then(response => {
        if (response.result === 1) {
          that.amount = response.data.amount;
          that.storeList = response.data.page_list.data;
          that.total_page = response.data.page_list.last_page;
          console.log(that.total_page,'1111111111111111111111111111');
          that.noneMore = true;
          if (response.data.page_list.data == null) {
            that.noStore = true;
          } else {
            that.noStore = false;
          }
        } else {
          // Toast(response.msg);
        }
      });
    },

    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      console.log(this.page,this.total_page,'分页有执行吗');
      var p = that.fun.bd_encrypt(that.point.lng, that.point.lat);
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.store-card.Frontend.Modules.Card.Controllers.detail.index", {
              card_id: that.card_id,
              lat: p.lat,
              lng: p.lng,
              store_name: that.store_name,
              page: that.page
            }, {
              page: that.page,
              id: that.$route.params.id
            },
            '加载中'
          )
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.page_list.data;
                that.storeList = Object.assign(that.storeList,myData); //数组拼接
                that.$forceUpdate();
                that.noneMore = true;
                console.log(that.storeList,'看看看这里');
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function (response) {
              // error callback
            }
          );
      }
    },
    handleAddress() {
      this.store_name = '';
      this.$store.commit('setReferer', window.location.href);
      this.$router.push(this.fun.getUrl('o2oLocation',{},{id:this.card_id,tag:"card"}));//传消费卡标识，供跳回来使用
    },
    handleSalse(store_id) {
      console.log(store_id);
      this.$router.push(this.fun.getUrl('storeConsumeShow',{id:store_id,card_id:this.card_id}));
    },
    handleInput(val) {
      this.store_name = val;
      this.page = 1;
      if(val == "") {
        this.noStore = false;
        this.noneMore = false;
        this.isLoadMore = true;
        this.getCartList(this.card_id, this.point.lat, this.point.lng, '', this.page);
        this.$forceUpdate();
      }
    },
    handlBlur() {

    },
    handleEnter(event) {
      if (event.keyCode == 13) {
        this.page = 1;
        let name = event.target.value;
        this.getCartList(this.card_id, this.point.lat, this.point.lng, name, this.page);
      }
    },
    handleClear() {

    }
  },
  components: {
    cTitle
  }
};