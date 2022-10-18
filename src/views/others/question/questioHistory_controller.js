import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      //
      list: []
    };
  },
  activated() {
    this.isLoadMore = true;
    this.page = 1;
    this.total_page = 0;
    this.list = [];
    this.getData();
    console.log('11111111');
  },
  mouted() {},
  methods: {
    goback(){
      this.$router.go(-1);
    },
    godetail(item) {
      let id = item.id;
      let qid = item.questionnaire_id;
      this.$router.push(this.fun.getUrl("history_details", { id: id, questionnaire_id: qid }));
    },
    getData() {
      let that = this;
      $http
        .post("plugin.questionnaire.api.index.indexInfo", { page: that.page, record: "record" }, "")
        .then(
          response => {
            if (response.result === 1) {
              let res = response.data;
              that.list = res.record.list.data;
              that.total_page = res.record.list.last_page;
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
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.questionnaire.api.index.indexInfo",
            {
              record: "record",
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.record.list.data;
                that.list = that.list.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              console.error(response.msg);
            }
          );
      }
    }
  },
  components: {
    cTitle
  }
};
