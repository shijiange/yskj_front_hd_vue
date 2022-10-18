// import { Toast } from 'vant';
import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";

const COUPON_URL = "plugin.store-cashier.frontend.store.couponList.index";
const GET_COUPIN = "plugin.store-cashier.frontend.store.couponGet.index";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,

      cupconList: [],
      isLoading:false
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
          { store_id: this.$route.params.id, page: this.page },
          "加载中..."
        )
        .then(res => {
          if (res.result == 1) {
            this.cupconList = res.data.data;
            this.total_page = res.data.last_page;
            this.isLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMoreData() {
      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        this.loading = true;
        this.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            COUPON_URL,
            { store_id: this.$route.params.id, page: this.page },
            "加载中..."
          )
          .then(res => {
            if (res.result == 1) {
              this.loading = false;
              this.allLoaded = false;
              this.cupconList = this.cupconList.concat(res.data.data);
              //that.histroyInfo = that.histroyInfo.concat(myData);//数组拼接
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
      this.initData();
      this.getData();
      // this.$refs.coupon_loadmore.onTopLoaded();
    },

    // loadBottom() {
    //   //	this.allLoaded = true;// 若数据已全部获取完毕,不在显示加载更多组件
    //   if (this.isLoadMore) {
    //     this.getMoreData(this.page);
    //     this.$refs.coupon_loadmore.onBottomLoaded();
    //   } else {
    //     console.log("没有更多数据");
    //   }
    // },

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
