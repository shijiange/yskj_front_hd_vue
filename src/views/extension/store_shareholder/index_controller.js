import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "@/utils/mixin";
//标记 防止重复加载
// var is_first_content = false;
// var is_second_content = false;
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: "first",
      member:{},
      list:[],
      isLoadMore: true, //判断是否能够加载更多
      total_page: 0, //总页数
      isShowNoTest: false //无数据时的判断
    };
  },

  mounted() {},

  activated() {
    this.initData(); //初始化参数
    this.getData(); //初始化数据
    //this.setDataByTabIndex();
  },

  methods: {
    //初始化参数
    initData() {
      this.member = {};
      this.list = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    },

    //初始化数据
    getData() {
      let that = this;
      $http
        .get("plugin.store-shareholder.frontend.center.index", { page: 1 }, "")
        .then(
          function(response) {
            if (response.result == 1) {
              that.member = response.data.member || {};
              that.isLoadMore = true;
              that.total_page = response.data.bonus_list.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.list = response.data.bonus_list.data;
              that.total_page = response.data.bonus_list.last_page;

              that.total = response.data.bonus_list.total;
              
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            Toast(response.msg);
          }
        );
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get(
            "plugin.store-shareholder.frontend.center.index",
            { page: that.page },
            "加载中..."
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.bonus_list.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    handleClick(type) {
      
    }
  },
  components: { cTitle }
};
