import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      info: [],
      list: [],
      link: "",
      posterShow: false,

      plugin_name:'问卷调查'
    };
  },
  activated() {
    // this.page = 1;
    this.init();
    this.getData();
  },
  mouted() {},
  methods: {
    init() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    goback() {
      this.$router.go(-1);
    },
    goSearch() {
      this.$router.push(this.fun.getUrl("questionsSearch", {}));
    },
    gohistory() {
      this.$router.push(this.fun.getUrl("questioHistory", {}));
    },
    goDetail(item) {
      if(this.fun.getPhoneEnv() == 1){
        item.start_time = item.start_time.replace(/\./g, "/");
        item.end_time = item.end_time.replace(/\./g, "/");
      }
      if (!this.fun.isTextEmpty(item.start_time) && !this.fun.isTextEmpty(item.end_time)) {
        let timestamp = Date.parse(new Date());
        if (timestamp < Date.parse(new Date(item.start_time))) {
          Toast(`${this.plugin_name}未开始`);
          return;
        }
        if (timestamp > Date.parse(new Date(item.end_time))) {
          Toast(`${this.plugin_name}已结束`);
          return;
        }
      }
      let id = item.id;
      this.$router.push(this.fun.getUrl("questions", { id: id, tag: "index" }));
    },
    goBanner() {
      if (!this.fun.isTextEmpty(this.link)) {
        window.location.href = this.link;
      }
    },
    getData() {
      let that = this;
      $http
        .post("plugin.questionnaire.api.index.indexInfo", { page: that.page, index: "index" }, "")
        .then(
          response => {
            if (response.result === 1) {
              let res = response.data;
              that.info = res.index;
              that.list = res.index.list.data;
              that.link = res.index.link;
              that.total_page = res.index.list.last_page;
              this.plugin_name = res.plugin_name;
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
              index: "index",
              page: that.page,
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.index.list.data;
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
    },
  },
  components: {
    cTitle
  }
};
