// import { Toast } from 'vant';
import cTitle from "components/title";
import { scrollMixin } from "../../utils/mixin";

const COUPON_URL = "plugin.hotel.frontend.hotel.couponList.index";
const GET_COUPIN = "plugin.hotel.frontend.hotel.couponGet.index";

export default {
  mixins: [scrollMixin],
  data() {
    return {
      loading: false,
      allLoaded: false,
      goload: true,
      // isLoadMore: true,
      // page: 1,
      // total_page: 0,

      cupconList: [],
      isLoading:false,
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },

  activated() {
    this.initData();
    this.getData();
  },

  mounted() {},
  methods: {
    initData() {
      this.loading = false;
      this.allLoaded = false;
      this.goload = true;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.cupconList = [];
    },

    getData() {
      $http
        .get(
          COUPON_URL,
          { hotel_id: this.$route.params.id, page: this.page },
          "加载中..."
        )
        .then(res => {
          if (res.result == 1) {
            this.cupconList = res.data.data;
            this.total_page = res.data.last_page;
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
        that.page = that.page + 1;
        let json = {
          hotel_id: this.$route.params.id, page: this.page
        };
        $http
          .get(COUPON_URL, json, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              let nextPageData = res.data.data;
              that.cupconList = that.cupconList.concat(nextPageData);
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
      // this.$refs.coupon_loadmore.onTopLoaded();
    },

    loadBottom() {
      //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
      if (this.isLoadMore) {
        this.getMoreData(this.page);
        // this.$refs.coupon_loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    },

    //领取优惠券
    getCoupon(id, index) {
      $http
        .get(GET_COUPIN, { coupon_id: id }, "领取中...")
        .then(res => {
          if (res.result == 1) {
            this.$set(this.cupconList, index, res.data);
            this.$dialog.alert({message:"领取成功"});
                        
          } else {
            this.$dialog.alert({message:res.msg});
                        
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
