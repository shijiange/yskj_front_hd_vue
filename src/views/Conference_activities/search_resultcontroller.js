import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      isLoading:false,
      keyword: "",
      city: "",
      result: [],
      now: "",
      page: 1,
      isLoadMore: true, //判断是否能够加载更多
      last_page: 0 //总页数
    };
  },
  activated() {
    this.initPageData();
    if (this.$route.params.city) {
      this.city = this.$route.params.city;
      this.now = String(Date.parse(new Date())).substr(0, 10);
    } else {
      this.$dialog.alert({ message: "请先选择城市"}).then(()=>{
        this.$router.go(-1);
      });
    }
  },
  mounted() {},
  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.search();
      }
    },
    initPageData() {
      this.result = [];
      this.isLoadMore = true;
      this.last_page = 0;
      this.page = 1;
    },
    loadTop() {
      this.initPageData();
      this.search();
      // this.$refs.result_loadmore.onTopLoaded();
    },
    toEnroll(item) {
      this.$router.push(
        this.fun.getUrl("enrollEnter", {
          id: item.id
        })
      );
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
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    search() {
      let json = {
        city_name: this.city.trim(),
        keywords: this.keyword,
        page: 1
      };
      $http
        .get("plugin.activity-apply.api.index.getSearch", json, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.last_page = response.data.last_page;
            if (!this.last_page) {
              this.last_page = 0;
            }
            if (response.data.data.length > 0) {
              this.result = response.data.data;
            }
            this.isLoading = false;
          } else {
            this.isLoading = false;
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      let json = {
        city_name: this.city.trim(),
        keywords: this.keyword,
        page: this.page
      };
      if (this.page >= this.last_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http
          .get("plugin.activity-apply.api.index.getSearch", json, "加载中")
          .then(response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              this.result = this.Registration.concat(response.data.data);
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
    cTitle
  }
};
