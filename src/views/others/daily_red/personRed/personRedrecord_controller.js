import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      info: [],
      receive_logs:[]
    };
  },
  deactivated() {},
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .get("plugin.redpack-user.frontend.receiveLogDetail.index", { rid: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.info = response.data;
            this.receive_logs = response.data.receive_logs.data;
            this.total_page = response.data.receive_logs.last_page;
            this.page = response.data.receive_logs.current_page;
            this.isLoadMore = true;
            if (this.receive_logs.length == 0) {
              this.isLoadMore = false;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page += 1;
        let json = {
          page : this.page
        };

        $http
          .post("plugin.redpack-user.frontend.receiveLogDetail.index", json, "")
          .then(res => {
            this.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.receive_logs.data;
              this.receive_logs = this.receive_logs.concat(nextPageData); //进行数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  components: { cTitle }
};
