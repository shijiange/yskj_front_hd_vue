import cTitle from "components/title";
import { scrollMixin } from "../../utils/mixin"; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      toi: this.fun.getKeyByI(),
      datas: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.toi = this.fun.getKeyByI();
    this.datas = [];
    this.isLoadMore = true;
    this.total_page = 0;
    this.page = 1;
    this.getData(); //获取数据
  },
  mounted() {
    this.toi = this.fun.getKeyByI();
  },

  methods: {
    //获取数据 已结算佣金
    getData() {
      let that = this;
      let json = {
        commission_type: "3",
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        page: 1
      };
      $http
        .get(
          "plugin.commission.api.commission.get-commission-list",
          json,
          "加载中..."
        )
        .then(
          function(response) {
            console.log(response);
            if (response.result == 1) {
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.datas = response.data.data;
            } else {
              console.log(response.msg);
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
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let json = {
          commission_type: "3",
          i: this.fun.getKeyByI(),
          type: this.fun.getTyep(),
          page: that.page
        };
        $http
          .get(
            "plugin.commission.api.commission.get-commission-list",
            json,
            "加载中..."
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.datas = that.datas.concat(nextPageData); //进行数组拼接
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
    }
  },
  components: { cTitle }
};
