import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      city: '',
      status: false, //弹窗是否显示
      locStatus: "", //是否显示城市
      value: "", //搜索字段
      acText: "", //标题
      datas: [],
      categories: [], //分类
      sortId: "0", //请求数据用的分类id
      showTab: true,
      page: 1,
      isLoadMore: true, //判断是否能够加载更多
      last_page: 0, //总页数,
      url: "",
      now: "",
      isLoading:false
    };
  },
  activated() {
    this.initData();
    this.now = String(Date.parse(new Date())).substr(0, 10);
    this.fun.getLocation()
      .then((res)=> {
        this.point = res.point;
        this.address = res.title;
        this.city = res.city.trim();
        this.getData();
      })
      .catch((err)=> {
        console.log(err);
      });
    this.getcategories();
  },
  mounted() {},
  methods: {
    initPageData() {
      this.datas = [];
      this.isLoadMore = true;
      this.last_page = 0;
      this.page = 1;
    },
    loadTop() {
      this.initPageData();
      this.getData();
      // this.$refs.activity_loadmore.onTopLoaded();
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
    initData() {
      this.value = "";
      this.categories = [];
      this.datas = [];
      this.page = 1;
      this.isLoadMore = true;
      this.last_page = 0;
    },
    getData() {
      let json = {};
      if (this.acText === "近期热门") {
        this.url = "plugin.activity-apply.api.index.getCount";
        json = {
          calssify_id: this.sortId,
          is_hot: 1,
          page: 1,
          city_name: this.city
        };

      } else if (this.acText === "人气精选") {
        this.url = "plugin.activity-apply.api.index.getCount";
        json = {
          calssify_id: this.sortId,
          is_discount: 1,
          page: 1,
          city_name: this.city
        };
      } else if (this.acText === "分类活动") {
        this.url = "plugin.activity-apply.api.index.getAll";
        json = {
          calssify_id: this.sortId,
          page: 1,
          city_name:this.city
        };
      }
      $http
        .post(this.url, json, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.last_page = response.data.last_page;
            if (!this.last_page) {
              this.last_page = 0;
            }
            if (response.data.data.length > 0) {
              this.datas = response.data.data;
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
      let json = {};
      if (this.acText === "近期热门") {
        json = {
          calssify_id: this.sortId,
          is_hot: 1,
          city:this.city
        };
      } else if (this.acText === "人气精选") {
        json = {
          calssify_id: this.sortId,
          is_discount: 1,
          city: this.city
        };
      } else if (this.acText === "分类活动") {
        json = {
          calssify_id: this.sortId,

        };
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.last_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http
          .post(this.url, json, "加载中")
          .then(response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              this.datas = this.datas.concat(response.data.data);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    getcategories() {
      $http
        .get("plugin.activity-apply.api.index.getCalssify", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.categories = response.data.reverse();
            this.initTitle();
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    search() {
      this.$router.push(
        this.fun.getUrl("searchResult", {
          city: this.city || '全国'
        })
      );
    },
    initTitle() {
      console.log(this.$route.query,'ssssssssss');
      if (this.$route.query.id) {
        this.acText = "分类活动";
        let flag = false;
        this.categories.forEach((item, index, key) => {
          if (item.id == this.$route.query.id) {
            this.sortId = String(this.$route.query.id);
            flag = true;
          }
        });
        if(!flag && String(this.$route.query.id) != 0) {
          this.sortId = String(this.$route.query.id);
          this.showTab = false;
        }
        this.locStatus = true;
        this.fun.setWXTitle(this.acText);
        this.getData();
      } else if (this.$route.query.title) {
        this.acText = this.$route.query.title;
        this.locStatus = true;
        this.fun.setWXTitle(this.acText);
        this.sortId = "0";
        this.getData();
      } else if (
        this.acText != "" &&
        !this.$route.query.title &&
        !this.$route.query.id
      ) {
        this.getData();
      } else {
        this.$router.push(this.fun.getUrl("activityHome"));
      }
    },
    changeStatus() {
      this.status = !this.status;
    },
    routerGo() {
      this.$router.push(
        this.fun.getUrl("o2oLocation", {}, { tag: "activitySort" })
      );
    },
    setID(item) {
      this.status = !this.status;
      this.initPageData();
      this.sortId = String(item.id);
      this.categories.map((list, index, key) => {
        if (list.id === this.sortId) {
          this.Id = String(index + 1);
        }
      });
      this.getData();
    },
    onClick(index, title) {
      this.initPageData();
      this.getData();
    }
  },
  components: {
    cTitle
  }
};
