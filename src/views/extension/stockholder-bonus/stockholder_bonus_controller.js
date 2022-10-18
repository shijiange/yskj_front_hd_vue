import cTitle from "components/title";
// import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      info: {},
      datas: [],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.getMember();
    this.getData();
  },
  methods: {
    //获取数据
    getMember() {
      let that = this;
      let json = {
        art: "index"
      };
      $http
        .post(
          "plugin.weighted_dividend.api.index.weightedData",
          json,
          "加载中..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.info = response.data.index;
              that.fun.setWXTitle(that.info.weighted_name);
            } else {
              console.log(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取数据
    getData() {
      let that = this;
      let json = {
        art: "getData"
      };
      $http
        .post(
          "plugin.weighted_dividend.api.index.weightedData",
          json,
          "加载中..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.total_page = response.data.getData.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
              that.datas = response.data.getData.data.data;
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
          art: "getData",
          page: this.page
        };
        $http
          .post(
            "plugin.weighted_dividend.api.index.weightedData",
            json,
            "加载中..."
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.getData.data.data;
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
