import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      recordsList: [],
      activity_name: "",
      lotteryId: "",
      amount_word: "",
      love_word: "",
      point_word: "",

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.lotteryId = this.$route.query.lotteryId;
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.activity_name = "";
      this.recordsList = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    getData() {
      $http
        .get(
          "plugin.lucky-draw.frontend.draw.getMyRecord",
          { lotteryId: this.lotteryId },
          " "
        )
        .then(
          response => {
            if (response.result === 1) {
              this.amount_word = response.data.amount_word;
              this.love_word = response.data.love_word;
              this.point_word = response.data.point_word;
              this.isLoadMore = true;
              this.page = 1;
              this.activity_name = response.data.activity_name;
              this.total_page = response.data.my_record.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.recordsList = response.data.my_record.data;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
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
            "plugin.lucky-draw.frontend.draw.getMyRecord",
            {
              page: that.page,
              lotteryId: this.lotteryId
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.my_record.data;
                that.recordsList = that.recordsList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              Toast(response);
            }
          );
      }
    }
  },
  components: { cTitle }
};
