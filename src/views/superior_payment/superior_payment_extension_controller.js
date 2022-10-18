import { Toast } from "vant";
import { scrollMixin } from "../../utils/mixin";
let plugin_name="上级代付";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: "first",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      listData: [],

      basics: {},

      title_name:''
    };
  },
  mounted() {},
  activated() {
    this.getListData();
  },
  methods: {
    toDetailsInfo(id) {
      this.$router.push(
        this.fun.getUrl(
          "superiorPaymentDetails",
          {},
          {
            record_id: id
          }
        )
      );
    },
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    getListData() {
      Toast.loading({
        message: "加载中",
        forbidClick: true
      });
      $http.get("plugin.parent-payment.frontend.modules.payment.controllers.records.index").then(res => {
        Toast.clear();

        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }
        console.log(res.data);
        this.listData = res.data.page_list.data;
        this.basics = res.data.basics;

        this.title_name = this.basics.plugin_name || plugin_name;
        this.fun.setWXTitle(this.title_name);

        this.isLoadMore = true;
        this.total_page = res.data.page_list.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
      });
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.parent-payment.frontend.modules.payment.controllers.records.index", {
            page: this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.page_list.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    }
  }
};
