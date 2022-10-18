import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      redpack_info:[],
      receive_log_list:[],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      balance:''
    };
  },
  deactivated() {},
  activated() {
    this.receive_log_list = [];
    this.page = 1;
    this.total_page = 0;
    this.getData();
    this.balance = localStorage.getItem('balanceLang')?JSON.parse(localStorage.getItem('balanceLang')).balance:"余额";
  },
  methods: {
    getData() {
      $http
        .get("plugin.redpack-user.frontend.sendLogDetail.index", { rid : this.$route.params.id, page : this.page }, "")
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
            this.redpack_info = response.data.redpack_info;
            this.receive_log_list = response.data.receive_log_list.data;
            this.total_page = response.data.receive_log_list.last_page;
            this.page = response.data.receive_log_list.current_page;
            this.isLoadMore = true;
            if (this.receive_log_list.length == 0) {
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
          .post("plugin.redpack-user.frontend.sendLogDetail.index", json, "")
          .then(res => {
            this.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.receive_log_list.data;
              this.receive_log_list = this.receive_log_list.concat(nextPageData); //进行数组拼接
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
