import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  deactivated() {},
  activated() {
    this.list = [];
    this.page = 1;
    this.total_page = 0;
    this.getData();
  },
  methods: {
    golink(key, id) {
      if (key == "list") {
        if(this.active == 0){
          this.$router.push(this.fun.getUrl("personRedListDetail", { id }));
        }
      } else {
        this.$router.push(this.fun.getUrl("personRedrecord", { id }));
      }
    },
    tabChange(e) {
      console.log(this.active);
      this.page = 1;
      this.list = [];
      this.getData();
    },
    getData() {
      let urlStr = "";
      if (this.active == 1) {
        // 领取记录
        urlStr = "plugin.redpack-user.frontend.receiveLog.index";
      } else {
        // 发布记录
        urlStr = "plugin.redpack-user.frontend.sendLog.index";
      }
      $http
        .get(urlStr, { page: this.page }, "")
        .then((response) => {
          if (response.result === 1) {
            this.list = response.data.list.data;
            this.total_page = response.data.list.last_page;
            this.page = response.data.list.current_page;
            this.isLoadMore = true;
            if (this.list.length == 0) {
              this.isLoadMore = false;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getMoreData() {
      let urlStr = "";
      if (this.active == 1) {
        // 领取记录
        urlStr = "plugin.redpack-user.frontend.receiveLog.index";
      } else {
        // 发布记录
        urlStr = "plugin.redpack-user.frontend.sendLog.index";
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        let json = {
          page: this.page,
        };

        $http
          .post(urlStr, json, "")
          .then((response) => {
            this.isLoadMore = true;
            if (response.result == 1) {
              var nextPageData = response.data.list.data;
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
