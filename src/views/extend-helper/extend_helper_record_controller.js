import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      datas: [],
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.datas = [];
      this.loading = false;
      this.allLoaded = false;
      this.goload = true;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    //复制邀请码
    onCopy(e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    onError(e) {
      Toast({
        message: "复制失败",
        duration: 1000
      });
    },
    toCreate() {
      this.$router.push(this.fun.getUrl("extendHelper"));
    },
    toPage(item) {
      this.$router.push(this.fun.getUrl("popularAssistant", { id: item.id }, { mid: item.member_id }));
    },
    getData() {
      let that = this;
      let json = {
        page: 1
      };
      $http.post("plugin.promotion-assistant.api.assistant.get-list", json, " ").then(
        response => {
          if (response.result === 1) {
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        $http.get("plugin.promotion-assistant.api.assistant.get-list", json, "加载中").then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              this.datas = this.datas.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  },
  components: { cTitle }
};
