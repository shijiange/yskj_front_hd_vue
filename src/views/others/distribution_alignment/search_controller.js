import cTitle from "components/title";
import { Toast } from 'vant';
import Vue from "vue";
import { Overlay } from "vant";
import { scrollMixin } from "utils/mixin";
Vue.use(Overlay);

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      keyword: "",
      list: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.keyword = "";
    this.list = [];
    this.search();
  },
  methods: {
    search() {
      $http
        .post("plugin.commission-activity.api.index.activity-search", { keyword: this.keyword }, "")
        .then(
          response => {
            if (response.result === 1) {
              let list = response.data;
              this.list = list.data;
              this.page = list.current_page;
              this.total_page = list.last_page;
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    //获取更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .post(
            "plugin.commission-activity.api.index.activity-search",
            {
              page: this.page,
            },
          )
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.activity.data;
                this.activity_list = this.datas.concat(myData); //数组拼接
              } else {
                this.page = this.page - 1;
                this.isLoadMore = false;
              }
            },
            response => {
              // error callback
            }
          )
          .catch(err => {
            console.error(err);
          });
      }
    },
    gotoDetail(i) {
      this.$router.push(
        this.fun.getUrl("DistributionActivityDetail", {
          id: this.list[i].id
        })
      );
    },
  },
  components: { cTitle }
};
