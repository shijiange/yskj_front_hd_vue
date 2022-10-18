import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      datas: {},
      info: {},
      tag: "", //serviceStation：服务站||deliveryStation： 配送站
      active: "",
      isLoading:false,
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.tag = this.$route.params.orderType;
    this.datas = {};
    this.getData();
    this.changeClick(0);
  },
  methods: {
    //初始化数据
    init() {
      this.info = {};
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    },
    //获取提成数据
    getData() {
      let that = this;
      let url = "";

      if (that.tag == "serviceStation") {
        url = "plugin.service-station.frontend.service-station.dividend";
      } else {
        url = "plugin.delivery-station.frontend.delivery-station.dividend";
      }
      $http.get(url, {}, "加载中").then(
        function(response) {
          if (response.result === 1) {
            console.log(response.data);
            that.datas = response.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    changeClick(avtiveTag) {
      let that = this;
      let url = "";
      let json = {};

      if (this.tag == "serviceStation") {
        url = "plugin.service-station.frontend.service-station.dividend-list";
      } else {
        url = "plugin.delivery-station.frontend.delivery-station.dividend-list";
      }

      if (avtiveTag == 2) {
        json.status = 0; //未结算
      } else if (avtiveTag == 1) {
        json.status = 1; //已结算
      }

      $http.get(url, json, "加载中").then(
        function(response) {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            console.log(response.data);
            that.info = response.data.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      let url = "";
      if (that.tag == "serviceStation") {
        url = "plugin.service-station.frontend.service-station.dividend-list";
      } else {
        url = "plugin.delivery-station.frontend.delivery-station.dividend-list";
      }

      if (that.active == 2) {
        json.status = 0; //未结算
      } else if (that.active == 1) {
        json.status = 1; //已结算
      }

      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        json.page = that.page;

        $http
          .get(url, json, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.info = that.info.concat(nextPageData); //进行数组拼接
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
    //下拉刷新
    loadTop() {
      //console.log("触发下拉", this.active);
      this.init();
      this.changeClick(this.active);
      // this.$refs.loadmore.onTopLoaded();
    }
  },
  components: { cTitle }
};
