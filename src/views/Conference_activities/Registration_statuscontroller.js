import cTitle from "components/title";
import DList from "@/components/dlist";
import { Toast } from 'vant';
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      total:'',//报名总人数
      id: "",
      page: 1,
      Registration: [],
      isLoadMore: true, //判断是否能够加载更多
      last_page: 0, //总页数
      isLoading:false,
      isPullLoad:false, // 下拉加载更多
    };
  },
  activated() {
    if (!this.$route.params.id) {
      this.$router.go(-1);
    } else {
      this.id = this.$route.params.id;
      this.initPageData();
      this.getData();
    }
  },
  mounted() {},
  methods: {
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
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    loadTop() {
      this.initPageData();
      this.getData();
      // this.$refs.Registration_loadmore.onTopLoaded();
    },
    // 初始化数据
    initPageData() {
      this.Registration = [];
      this.isLoadMore = true;
      this.last_page = 0;
      this.page = 1;
      this.isPullLoad = false;
    },
    getData() {
      let json = {
        activity_id: this.id,
        page: 1
      };
      $http
        .get("plugin.activity-apply.api.activity.getDetails", json, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.last_page = response.data.last_page;
            if (!this.last_page) {
              this.last_page = 0;
            }
            this.total = response.data.total;
            if (response.data.data.length > 0) {
              this.Registration = response.data.data;
            }
            this.isLoading = false;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
        });
    },
    // 获取更多数据
    getMoreData() {
      if (this.isLoading) return;
      let json = {
        activity_id: this.id,
        page: this.page
      };
      if (this.page >= this.last_page) {
        this.isLoadMore = false;
        return;
      } else {
        this.isLoading = true;
        this.page = this.page + 1;
        json.page = this.page;
        $http
          .get("plugin.activity-apply.api.activity.getDetails", json, "加载中")
          .then(response => {
            this.isLoading = false;
            this.isLoadMore = true;
            if (response.result === 1) {
              this.Registration = this.Registration.concat(response.data.data);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              return;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  components: {
    cTitle,
    DList
  }
};
