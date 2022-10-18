import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: "first",
      recordsList: [],
      play_with: [], //待打款
      dataInfo: {},
      love_name: "",
      control: "",
      loadMoreText: "",
      //more
      isLoadMore: false,
      current_page: 1,
      total_page: 1
    };
  },
  activated() {
    this.init(); //初始化数据
    this.activeName == "first" ? this.getData() : this.getPlay();
  },
  methods: {
    init() {
      this.current_page = 1;
      this.isLoadMore = false;
      this.recordsList = [];
      this.play_with = [];
      this.total_page = 1;
    },
    //tab切换
    changeHandle(event) {
      if (event == "first") {
        this.getData(); //奖励记录
      } else {
        this.getPlay();
      }
    },
    //待打款记录
    getPlay() {
      $http
        .get("plugin.period-return.frontend.log.payment-log", { page: 1 }, "加载中")
        .then(res => {
          let data = res.data.list;
          this.isLoadMore = true;
          if (res.result == 1) {
            this.total_page = data.last_page;
            this.play_with = data.data;
            this.current_page = data.current_page;
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //奖励记录
    getData() {
      let that = this;
      $http
        .get("plugin.period-return.frontend.log.index", { page: 1 }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.dataInfo = response.data;
            this.love_name = this.dataInfo.love_name;
            this.current_page = response.data.list.current_page;
            // 后台显示开关 0||null 关闭，1显示
            if (that.fun.isTextEmpty(response.data.control) || response.data.control == "0") {
              this.control = false;
            } else {
              this.control = true;
            }
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.recordsList = response.data.list.data;
          } else {
            console.log(response);
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
    getMoreData() {
      if (this.current_page >= this.total_page) {
        return; //没有更多
      }
      if (this.isLoadMore) {
        return;
      }
      this.current_page = this.current_page + 1;
      let url = "";
      if (this.activeName == "first") {
        url = "plugin.period-return.frontend.log.index";
      } else {
        url = "plugin.period-return.frontend.log.payment-log";
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      $http
        .get(
          url,
          {
            page: this.current_page
          },
          "加载中"
        )
        .then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.data;
              this.current_page = response.data.list.current_page;
              if (this.activeName == "first") {
                this.recordsList = this.recordsList.concat(myData); //数组拼接
              } else {
                this.play_with = this.play_with.concat(myData); //数组拼接
              }
            } else {
              this.current_page = this.current_page - 1;
              this.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
    }
  },
  components: { cTitle }
};
