import cTitle from 'components/title';
import { Toast } from 'vant';

const RECEIVE_URL = "coupon.share-coupon.receive";
const RECORD_URL = "coupon.share-coupon.log-list";

export default {
  data() {
    return {
      banner: "",
      status: "",//状态为YES（可领取）、RT（已抢完 分享者不可以领取）
      coupon: {},
      limit: "",
      name: "",
      msg: "",
      page: 1,
      total_page: 0,
      isLoading: false,
      isAllLoaded: false,
      record_arr: [],
      max_num: 0
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    getData() {
      $http.get(RECEIVE_URL, { order_ids: this.$route.params.order_id }, "加载中...").then(res => {
        if (res.result == 1) {
          this.banner = res.data.set.banner;
          this.status = res.data.code;
          this.coupon = res.data.coupon;
          this.name = res.data.member_name;
          this.msg = res.data.msg;
          //获取记录
          this.getRecord();
        } else {
          Toast(res.msg);
          this.$router.go(-1);
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getRecord() {
      $http.get(RECORD_URL, { page: this.page, order_ids: this.$route.params.order_id }).then(res => {
        if (res.result == 1) {
          this.max_num = res.data.remainder;
          if (this.page == res.data.last_page) {
            this.isAllLoaded = true;
          }
          this.total_page = res.data.last_page;
          this.record_arr = res.data.data;
        }
      }).catch(error => {
        console.log(error);
      });
    },

    getMoreRecord() {
      if (this.isAllLoaded) {
        return;
      }
      this.page = this.page + 1;
      $http.get(RECORD_URL, { page: this.page, order_ids: this.$route.params.order_id }).then(res => {
        if (res.result == 1) {
          if (this.page == res.data.last_page) {
            this.isAllLoaded = true;
            this.isLoading = false;
          }
          this.isLoading = false;
          this.record_arr = this.record_arr.concat(res.data.data);
        } else {
          this.page = this.page - 1;
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
      });


    },

    initData() {
      this.banner = "";
      this.status = "";
      this.coupon = {};
      this.limit = "";
      this.name = "";
      this.msg = "";
      this.page = 1;
      this.total_page = 0;
      this.isLoading = false;
      this.isAllLoaded = false;
      this.record_arr = [];
      this.max_num = 0;
    },

    goHome() {
      this.$router.push(this.fun.getUrl("home"));
    }
  },
  components: { cTitle }
};
