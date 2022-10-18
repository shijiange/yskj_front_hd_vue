
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      info: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  methods: {
    getMoreData() {
      var that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.cloud-warehouse.frontend.warehouse-goods-manage.unblock-log",
            {},
            "加载中"
          )
          .then(response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.info = this.info.concat(myData);
              that.isLoadMore = true;
            } else {
              that.isLoadMore = false;
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }

    },
    getData() {
      var that = this;
      $http
        .get(
          "plugin.cloud-warehouse.frontend.warehouse-goods-manage.unblock-log",
          {},
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            that.info = response.data.data;
            that.total_page = response.data.last_page;
            console.log(response);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  activated() {
    this.getData();
  },
  components: { cTitle }
};