import cTitle from "components/title";
import { scrollMixin } from "utils/mixin";
export default {
  components: { cTitle },
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      //
      info: [],
      money:0,
      avatar:'',
      nickname:''
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      $http.get("plugin.room.frontend.code.get-code-profit", {}, "加载中").then(
        function(response) {
          if (response.result == 1) {
            console.log(response);
            that.info = response.data.data;
            that.money = response.data.money;
            that.nickname = response.data.nickname;
            that.avatar = response.data.avatar;
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getMoreData(){
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let json = {
        page: 1
      };
      if (that.page >= that.total_page) {
        that.loading = true;
        return;
      } else {
        that.page = that.page + 1;
        json.page = that.page;
        $http.get("plugin.room.frontend.code.codeDetail", json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.loading = false;
            if (response.result === 1) {
              var myData = response.data.data;
              that.info = that.info.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.loading = true;
              that.isLoadMore = false;
              return;
            }
          },
          function(response) {
            // error callback
            console.log(response);
          }
        );
      }
    }
  }
};