import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.card_id = this.$route.params.card_id;
    this.getDate();
  },
  methods: {
    toGood(id) {
      this.$router.push(this.fun.getUrl("goods", { id: id }));
    },
    initData() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getDate() {
      $http
        .get(
          "plugin.business-card.frontend.controllers.trace.trace-history.index",
          {
            card_id: this.card_id,
            page: 1
          },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              if (response.result === 1) {
                this.isLoadMore = true;
                this.total_page = response.data.last_page;
                if (!this.total_page) {
                  this.total_page = 0;
                }
                this.list = response.data.data;
              } else {
                Toast(response.msg);
              }
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.business-card.frontend.controllers.trace.trace-history.index",
            {
              card_id: that.card_id,
              page: that.page
            },
            " "
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.data;
                that.list = that.list.concat(myData);
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              console.log(response);
              // error callback
            }
          );
      }
    }
  },
  components: { cTitle }
};
