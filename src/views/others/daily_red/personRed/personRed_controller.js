import cTitle from "components/title";
import { Toast } from "vant";
// import { scrollMixin } from "utils/mixin";
export default {
  // mixins: [scrollMixin], //加载更多
  data() {
    return {
      show: false,
      show1: false,
      info: [],
      getinfo: [],
      amount: "",
      getName: "",
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      balance:''
    };
  },
  deactivated() {},
  activated() {
    this.list = [];
    this.page = 1;
    this.total_page = 0;
    this.getData();
    this.balance = localStorage.getItem('balanceLang')?JSON.parse(localStorage.getItem('balanceLang')).balance:"余额";
  },
  methods: {
    goIssue(str) {
      this.$router.push(this.fun.getUrl(str, {}));
    },
    getData() {
      $http
        .get("plugin.redpack-user.frontend.homePage.index", {}, "")
        .then((response) => {
          if (response.result === 1) {
            this.info = response.data;
            // 列表
            this.list = response.data.redpack_list.data;
            this.total_page = response.data.redpack_list.last_page;
            this.page = response.data.redpack_list.current_page;
            this.isLoadMore = true;
            if (this.page >= this.total_page) {
              this.isLoadMore = false;
            }
            if (this.list.length == 0) {
              this.isLoadMore = false;
            }
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getRedpack(item) {
      this.getinfo = [];
      this.getName = "";
      this.amount = "";
      this.show = true;
      this.getinfo = item;
    },
    postRedpack(id) {
      let isApi = "plugin.redpack-user.frontend.receive.index";
      $http
        .get(isApi, { rid: id }, "")
        .then((response) => {
          if (response.result === 1) {
            console.log(response.data);
            this.show = false;
            this.show1 = true;
            this.getName = response.data.nickname;
            this.amount = response.data.amount;
          } else {
            Toast(response.msg);
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    sureGet() {
      this.show1 = false;
      this.getData();
    },
    toList(datas) {
      if (!this.fun.isTextEmpty(datas.api)) {
        // api不为空就是跳去领取记录
        this.$router.push(this.fun.getUrl("personRedrecord", { id: datas.id }));
      }
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        let json = {
          page: this.page,
        };

        $http
          .post("plugin.redpack-user.frontend.homePage.index", json, "")
          .then((response) => {
            this.isLoadMore = true;
            if (response.result == 1) {
              var nextPageData = response.data.redpack_list.data;
              this.list = this.list.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  components: { cTitle },
};
