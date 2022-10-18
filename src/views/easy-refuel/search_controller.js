import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "搜索",
      inputs: "",
      userPhone:'',
      shopName:'',
      datas: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.initData();
    this.city = this.$route.params.city;
    this.point = JSON.parse(this.$route.params.point);
    this.search();
  },
  
  mounted() {
   
  },
  methods: {
    initData(){
      this.title="搜索";
      this.inputs="";
      this.userPhone="";
      this.shopName="";
      this.datas=[];
      this.loading=false;
      this.allLoaded=false;
      this.goload=true;
      this.isLoadMore=true;
      this.page=1;
      this.total_page=0;
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    search() {
      let that=this;
      this.page=1;
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      let json={
        name: this.inputs,
        lng: p.lng,
        lat: p.lat,
        page: this.page
      };
      $http.post("plugin.easy-refuel.frontend.index.searchByName", json, " ").then(
        (response) => {
          if (response.result === 1) {   
            that.total_page = response.data.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.banner = response.data.banner;
            that.datas = response.data.data.data;
            that.shopName = response.data.shopName;
            that.userPhone = response.data.userPhone;
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    // 获取更多数据
    getMoreData() {
      let that=this;
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        that.page = this.page + 1;
        let json = {
          name: "",
          lng: p.lng,
          lat: p.lat,
          page: this.page
        };
        $http
          .get("plugin.easy-refuel.frontend.index.searchByName", json, "加载中")
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data.data;
                that.datas = that.datas.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    goback() {
      this.$router.go(-1);
    },
    toDetail(item) {
      let json={
        userPhone:this.userPhone,
        latitude:item.latitude,
        longitude:item.longitude,
        stationId:item.stationId
      };
      $http.post("plugin.easy-refuel.frontend.index.detail", json, " ").then(
        (response) => {
          if (response.result === 1) {
            window.location.href=response.data;
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
  },

  components: {  }
};
