

import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
            
      listData: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .get("plugin.consumer-reward.frontend.controllers.reward.collection-record")
        .then((res) => {
          if (res.result != 1) return Toast(res.msg);
          this.member = res.data.member;
          this.listData = res.data.data;
          this.totalPrice = res.data.total;
          console.log(res);
          this.total_page = res.data.last_page;
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
          .get("plugin.consumer-reward.frontend.controllers.reward.collection-record", {page:this.page})
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;

            }
          });
      }
    }
  }
};