import { Toast } from 'vant';
import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";

//特权折扣
const PD_URL = "plugin.universal-card.frontend.store-discount.privilege";
//平日折扣
const WD_URL = "plugin.universal-card.frontend.store-discount.get-store-list";
//专属礼券
const EC_URL = "plugin.universal-card.frontend.index.couponList.index";
//获取专属礼券
const GET_COUPON = "plugin.universal-card.frontend.index.couponGet.index";
//获取门店分类和日期
const GET_SEARCH = "plugin.universal-card.frontend.store-discount.store-data";

// 一卡通首页
const CARD_INDEX = "plugin.universal-card.api.home.index";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //tab切换
      tabArr: [],

      //特权折扣--搜索条件
      pd_classfy_arr: [], //门店分类
      pd_date_arr: [], //日期数组

      //搜索的键
      pd_category_id: 0, //pd门店分类id
      wd_category_id: 0, //wd门店分类id
      pd_date: {}, //日期对象
      //平日折扣--搜索条件
      //wd_classfy_arr: [], //门店分类

      //特权折扣 平日折扣 专属礼券tab切换显示隐藏
      tabIndex: 0,
      privilege_discount_show: true,
      weekday_discount_show: false,
      exclusive_coupons_show: false,

      //特权折扣--数组和分页数据
      pd_loading: false,
      pd_allLoaded: false,
      pd_goload: true,
      pd_isLoadMore: true,
      pd_page: 1,
      pd_total_page: 0,
      pd_arr: [],

      //平日折扣--数组和分页数据
      wd_loading: false,
      wd_allLoaded: false,
      wd_goload: true,
      wd_isLoadMore: true,
      wd_page: 1,
      wd_total_page: 0,
      wd_arr: [],

      //专属礼券--数组和分页数据
      ec_loading: false,
      ec_allLoaded: false,
      ec_goload: true,
      ec_isLoadMore: true,
      ec_page: 1,
      ec_total_page: 0,
      ec_arr: [],

      //特权折扣和平日折扣index
      pd_index: 0,
      pd_date_index: 0,
      wd_index: 0,

      //定位信息
      location: {},
      //会员权益--折扣
      wd_discount: "",
      //开通状态
      card_status: false,
      card_bk: "",
      //开通会员信息
      info: {},
      isLoading:false,
      isLoadMore:true
    };
  },

  activated() {
    //  this.tabArr=this.tabArr.map(value => {
    //    return value=value+"111";
    //  });

    this.initData();
    // if (this.fun.isTextEmpty(this.$store.state.o2oLocation.point)) {
    //   this.getLocation();
    //   this.getCardIndex();
    // } else {
    //   this.location = this.$store.state.o2oLocation;
    //   this.getCardIndex();
    // }

    this.fun.getLocation()
      .then((res) => {
        this.location = res;
        this.getCardIndex();
      })
      .catch((err) => {
        this.getCardIndex();
        console.log(err);
      });
  },

  mounted() {},
  methods: {
    //tab切换
    toggle(index) {
      this.tabIndex = index;
      if (index == 0) {
        this.privilege_discount_show = true;
        //this.weekday_discount_show = false;
        this.exclusive_coupons_show = false;
      } else if (index == 1) {
        this.privilege_discount_show = false;
        //this.weekday_discount_show = true;
        this.exclusive_coupons_show = true;
      }
      // } else if (index == 2) {
      //   this.privilege_discount_show = false;
      //   this.weekday_discount_show = false;
      //   this.exclusive_coupons_show = true;
      // }
    },
    //初始化数据
    initData() {
      //tab切换初始化数据
      this.privilege_discount_show = true;
      this.weekday_discount_show = false;
      this.exclusive_coupons_show = false;
      //所有idnex初始化值0
      this.tabIndex = 0;
      this.pd_index = 0;
      this.pd_date_index = 0;
      this.wd_index = 0;

      this.pd_classfy_arr = [];
      this.pd_date_arr = [];

      this.pd_category_id = 0; //pd门店分类id
      this.wd_category_id = 0; //wd门店分类id

      this.pd_date = {};

      this.wd_discount = "";

      this.card_status = false;

      this.card_bk = "";

      this.pdInitData();
      //this.wdInitData();
      this.ecInitData();
    },

    //获取--门店分类--日期
    getClassfyData() {
      $http
        .get(GET_SEARCH, {})
        .then(res => {
          if (res.result == 1) {
            this.pd_classfy_arr = res.data.store_category;
            this.pd_date_arr = res.data.date_time;
            //赋初值日期和门店分类id
            this.pd_category_id = this.pd_classfy_arr[0].id;
            this.pd_date = this.pd_date_arr[0];
            this.wd_category_id = this.pd_classfy_arr[0].id;
            //初始化分页数据
            this.pdInitData();
            //this.wdInitData();
            //获取数据
            this.getPdData();
            //this.getWdData();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //特权折扣--分页
    pdInitData() {
      this.pd_loading = false;
      this.pd_allLoaded = false;
      this.pd_goload = true;
      this.pd_isLoadMore = true;
      this.pd_page = 1;
      this.pd_total_page = 0;
      this.pd_arr = [];
    },

    getPdData() {
      let json = {
        lng: this.location.point.lng,
        lat: this.location.point.lat,
        week: this.pd_date.week_num,
        category_id: this.pd_category_id,
        day: this.pd_date.day,
        city_name: this.location.city,
        page: this.pd_page
      };
      $http
        .get(PD_URL, json, "加载中...")
        .then(res => {
          if (res.result == 1) {
            this.pd_total_page = res.data.last_page;
            this.pd_arr = res.data.data;
            this.isLoading = false;
            this.isLoadMore = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getPdMoreData() {
      if (this.pd_page == this.pd_total_page) {
        return;
      }
      if (this.pd_page >= this.pd_total_page) {
        this.pd_loading = true;
        this.pd_allLoaded = true;
        return;
      } else {
        this.pd_page = this.pd_page + 1;
        let json = {
          lng: this.location.point.lng,
          lat: this.location.point.lat,
          week: this.pd_date.week_num,
          category_id: this.pd_category_id,
          day: this.pd_date.day,
          city_name: this.location.city,
          page: this.pd_page
        };
        $http
          .get(PD_URL, json, "加载中...")
          .then(res => {
            if (res.result == 1) {
              this.isLoadMore = true;
              this.pd_loading = false;
              this.pd_allLoaded = false;
              this.pd_arr = this.pd_arr.contact(res.data.data);
              //that.histroyInfo = that.histroyInfo.concat(myData);//数组拼接
            } else {
              this.isLoadMore = false;
              this.pd_page = this.pd_page - 1;
              this.pd_loading = true;
              this.pd_allLoaded = true;
              this.pd_isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    pdLoadTop() {
      this.pdInitData();
      this.getPdData();
      // this.$refs.pd_loadmore.onTopLoaded();
    },
    pdLoadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.pd_isLoadMore) {
        this.getPdMoreData();
        this.$refs.pd_loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    },
    getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.pd_isLoadMore) {
        this.getPdMoreData();
      }
      if (this.ec_isLoadMore) {
        this.getEcMoreData();
      }
    },
    //特权折扣--搜索--门店分类
    pdClassfySearch(index, id) {
      //1.改变选中状态
      this.pd_index = index;
      //2.修改搜索参数--门店分类
      this.pd_category_id = id;
      //3.初始化分页数据
      this.pdInitData();
      //4.执行搜索返回数据（带上日期的搜索值）
      this.getPdData();
    },

    //特权折扣--搜索--日期
    pdDateSearch(index, date) {
      //1.改变选中状态
      this.pd_date_index = index;
      //2.修改搜索参数--日期
      this.pd_date = date;
      //3.初始化分页数据
      this.pdInitData();
      //4.执行搜索返回数据（带上门店分类的搜索值）
      this.getPdData();
    },

    //平日折扣--分页
    wdInitData() {
      this.wd_loading = false;
      this.wd_allLoaded = false;
      this.wd_goload = true;
      this.wd_isLoadMore = true;
      this.wd_page = 1;
      this.wd_total_page = 0;
      this.wd_arr = [];
    },

    getWdData() {
      let json = {
        lng: this.location.point.lng,
        lat: this.location.point.lat,
        category_id: this.wd_category_id,
        city_name: this.location.city,
        page: this.wd_page
      };
      $http
        .get(WD_URL, json)
        .then(res => {
          if (res.result == 1) {
            this.wd_total_page = res.data.store_list.last_page;
            this.wd_arr = res.data.store_list.data;
            this.wd_discount = res.data.discount;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getWdMoreData() {
      if (this.wd_page == this.wd_total_page) {
        return;
      }
      if (this.wd_page >= this.wd_total_page) {
        this.wd_loading = true;
        this.wd_allLoaded = true;
        return;
      } else {
        this.wd_page = this.wd_page + 1;
        let json = {
          lng: this.location.point.lng,
          lat: this.location.point.lat,
          category_id: this.wd_category_id,
          city_name: this.location.city,
          page: this.wd_page
        };
        $http
          .get(WD_URL, json, "加载中...")
          .then(res => {
            if (res.result == 1) {
              this.wd_loading = false;
              this.wd_allLoaded = false;
              this.wd_arr = this.wd_arr.concat(res.data.store_list.data);
              //that.histroyInfo = that.histroyInfo.concat(myData);//数组拼接
            } else {
              this.wd_page = this.wd_page - 1;
              this.wd_loading = true;
              this.wd_allLoaded = true;
              this.wd_isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    wdLoadTop() {
      this.wdInitData();
      this.getWdData();
      this.$refs.wd_loadmore.onTopLoaded();
    },

    wdLoadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.wd_isLoadMore) {
        this.getWdMoreData();
        this.$refs.wd_loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    },

    //平日折扣--搜索--门店分类
    wdClassfySearch(index, id) {
      //1.改变选中状态
      this.wd_index = index;
      //2.修改搜索参数--门店分类
      this.wd_category_id = id;
      //3.初始化分页数据
      this.wdInitData();
      //4.执行搜索返回数据
      this.getWdData();
    },

    //专属礼券--分页
    ecInitData() {
      this.ec_loading = false;
      this.ec_allLoaded = false;
      this.ec_goload = true;
      this.ec_isLoadMore = true;
      this.ec_page = 1;
      this.ec_total_page = 0;
      this.ec_arr = [];
    },

    getEcData() {
      $http
        .get(EC_URL, {
          page: this.ec_page,
          lng: this.location.point.lng,
          lat: this.location.point.lat,
          city_name: this.location.city
        })
        .then(res => {
          if (res.result == 1) {
            this.ec_total_page = res.data.last_page;
            this.ec_arr = res.data.data;
            this.isLoading = false;
            this.isLoadMore = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getEcMoreData() {
      if (this.ec_page == this.ec_total_page) {
        return;
      }
      if (this.ec_page >= this.ec_total_page) {
        this.ec_loading = true;
        this.ec_allLoaded = true;
        return;
      } else {
        this.ec_page = this.ec_page + 1;
        $http
          .get(
            EC_URL,
            {
              page: this.ec_page,
              lng: this.location.point.lng,
              lat: this.location.point.lat,
              city_name: this.location.city
            },
            "加载中..."
          )
          .then(res => {
            if (res.result == 1) {
              this.isLoadMore = true;
              this.ec_loading = false;
              this.ec_allLoaded = false;
              this.ec_arr = this.ec_arr.concat(res.data.data);
              //that.histroyInfo = that.histroyInfo.concat(myData);//数组拼接
            } else {
              this.ec_page = this.ec_page - 1;
              this.ec_loading = true;
              this.ec_allLoaded = true;
              this.ec_isLoadMore = false;
              this.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    ecLoadTop() {
      this.ecInitData();
      this.getEcData();
      // this.$refs.ec_loadmore.onTopLoaded();
    },

    ecLoadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.ec_isLoadMore) {
        this.getEcMoreData();
        // this.$refs.ec_loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    },

    //领取优惠券
    getCoupon(value) {
      $http
        .get(GET_COUPON, { coupon_id: value }, "领取中...")
        .then(res => {
          if (res.result == 1) {
            this.$dialog.alert({message:'领取成功'});
          } else {
            this.$dialog.alert({message:res.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //一卡通首页
    getCardIndex() {
      $http
        .get(CARD_INDEX, {})
        .then(res => {
          if (res.result == 1) {
            this.card_status = true;
            this.info = res.data;

            // this.tabArr.push(this.info.privilege_name,this.tabArr);
            // this.tabArr.push(this.indo.ordinary_name,this.tabArr);
            // this.tabArr.push(this.info.coupon_name,this.tabArr);
            this.tabArr[0] = this.info.privilege_name;
            // this.tabArr[1]=this.info.ordinary_name;
            // this.tabArr[2]=this.info.coupon_name;
            this.tabArr[1] = this.info.coupon_name;
            this.card_title = res.data.title;
            this.fun.setWXTitle(this.card_title);
            //获取门店和日期分类
            this.getClassfyData();
            //获取专属礼券数据
            this.getEcData();
          } else {
            this.card_status = false;
            this.card_bk = res.data.card_thumb;
            this.card_title = res.data.title;
            this.tabArr[0] = this.info.privilege_name;
            this.tabArr[1] = this.info.ordinary_name;
            this.fun.setWXTitle(this.card_title);
            this.getClassfyData();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //立即开通
    gotoOpen() {
      console.log(this.card_title);
      this.$router.push(this.fun.getUrl("CardOpenMembership",{},{title:this.card_title}));
    },

    //已开通--续费
    gotoFare(value) {
      console.log(value);
      if (!this.fun.isTextEmpty(value.goods_spec)) {
        // this.$router.push(
        //   this.fun.getUrl("CardChooseMembership", {
        //     goods_id: value.goods_id,
        //     level_id: value.level_id
        //   })
        // );
        this.$router.push(
          this.fun.getUrl("NewCardList", {
            level_id: value.level_id,
            spec : 'goods_spec'
          })
        );
      } else {
        // this.$router.push(this.fun.getUrl("goods", { id: value.goods_id }));
        this.$router.push(
          this.fun.getUrl("NewCardList", {
            level_id: value.level_id
          })
        );
      }
    },

    //跳转至门店首页
    gotoShop(id) {
      this.$router.push(this.fun.getUrl("o2oStore_v2", { store_id: id }));
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
        that.getCardIndex();
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        //alert.log(obj.info);
        Toast("定位失败,请手动切换位置");
      }
    }
  },
  components: { cTitle }
};
