import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
export default {
  name: "recommend-reward",
  mixins: [scrollMixin],
  data() {
    return {
      active: 2,
      info: {}, //用户信息
      amount: {}, //结算金额
      listData: [], //列表数据
      json: {},

      // more
      isLoadMore: true, // 判断是否要加载更多的标识
      page: 1, //当前的页数
      total_page: 0 // 总共有多少页
    };
  },
  activated() {
    this.getIndexData();
  },
  methods: {
    //获取数据
    getIndexData() {
      let json = {};
      json = {
        page: 1
      };
      if(this.active != 2) {
        json.status = this.active;
      }
      $http
        .get("plugin.recommend-reward.frontend.controllers.records.index", json, "加载中...")
        .then(
          response => {
            if (response.result === 1) {
              this.info = response.data.info;
              this.amount = response.data.amount;
              this.listData = response.data.list.data;
              this.total_page = response.data.list.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },

    tabStatus() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.getIndexData();
    },

    //获取更多数据
    getMoreData() {
      let that = this;
      let json = {};
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page = that.page + 1;
        json = {
          page:that.page
        };
        if(this.active != 2) {
          json.status = this.active;
        }
        $http
          .get("plugin.recommend-reward.frontend.controllers.records.search", json, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var myData = res.data.data;
              that.listData = that.listData.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
