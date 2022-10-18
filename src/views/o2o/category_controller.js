import cStoreList from "components/storeList";
import { Toast } from "vant";
import cTitle from "components/title";
//import BMap from 'BMap';
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "搜索",
      inputs: "",
      amout: false,
      order_by: "",
      order_field: "",
      id: "",

      stores: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      myLocation: {
        point: {}
      },
      point: {},
      openTemplate: 0 ,//门店列表样式
      storeName:''
    };
  },
  activated() {
    // console.log("point");
    // this.id = this.$route.params.id;
    this.storeName = this.$route.params.name;
    this.initData();
    this.getStoresByCategoryId();
  },

  mounted() {
    // this.initData();
    // this.getStoresByCategoryId();
    //this.slider();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getStoresByCategoryId() {
      this.fun
        .getLocation()
        .then(res => {
          this.myLocation = res;
          this.getStoresByCategoryIdLngAndLat(this.myLocation);
        })
        .catch(err => {
          console.log(err);
        });
    },

    getStoresByCategoryIdLngAndLat(r) {
      var that = this;
      var p = this.fun.bd_encrypt(r.point.lng, r.point.lat);
      console.log(p);
      that.$store.commit("setLocation", r);
      let point = {
        point: {
          lat: p.lat,
          lng: p.lng
        },
        city: r.city
      };
      this.locaLng = point;
      if (!p.lng) {
        p.lng = "";
        p.lat = "";
      }
      let json = {
        category_id: this.id,
        // lng: 113.273289,
        // lat: 23.15729,
        // city_name: '广州市',
        lng: p.lng,
        lat: p.lat,
        city_name: r.city,
        page: 1
      };
      // var that = this;
      // let json = {
      //   category_id: this.id,
      //   lng: r.position.getLng(),
      //   lat: r.position.getLat(),
      //   city_name: r.addressComponent.city,
      //   page: this.page
      // };
      $http
        .get("plugin.store-cashier.frontend.store.store.get-store-list-by-category-id-to-page", json, "")
        .then(response => {
          if (response.result == 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.stores = response.data.data;
            that.openTemplate = response.data.store_list_style || 0;
          } else {
            that.stores = [];
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    getMoreData(r) {
      if (!r) {
        if (this.myLocation.lng) {
          r = this.myLocation;
        } else {
          r = this.locaLng;
        }
      }
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          category_id: this.id,
          lng: r.point.lng,
          lat: r.point.lat,
          city_name: r.city,
          page: this.page
        };
        // let json = {
        //   category_id: this.id,
        //   lng: r.position.getLng(),
        //   lat: r.position.getLat(),
        //   city_name: r.addressComponent.city,
        //   page: this.page
        // };
        $http.get("plugin.store-cashier.frontend.store.store.get-store-list-by-category-id-to-page", json, "正在获取更多...").then(
          function(response) {
            if (response.result == 1) {
              that.isLoadMore = true;
              that.stores = that.stores.concat(response.data.data); //数组拼接
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
    changList() {
      this.getMoreData(this.myLocation);
    },

    initData() {
      this.id = this.$route.params.id;
      this.stores = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.point = {};
    }

    // onComplete(data) {
    //   console.log(data.addressComponent.city);
    //   this.point = data;
    //
    //   this.getStoresByCategoryIdLngAndLat(data);
    // },
    //
    // onError(error) {
    //   Toast(error.message);
    // }
  },

  components: {
    cStoreList,
    cTitle
  }
};
