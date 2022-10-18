import cMyswipe from "components/myswipe";
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
      member_list: [],
      show_index: -1,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      this.isLoadMore = false;
      $http
        .post("plugin.commission-activity.api.activity-inquire.join-people", {
          activity_id: this.$route.params.id
        })
        .then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              let datas = response.data;
              this.member_list = datas.data;
              this.page = datas.current_page;
              this.total_page = datas.last_page;
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
      const that = this;
      let json = {
        activity_id: this.$route.params.id
      };
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http
          .get(
            "plugin.commission-activity.api.activity-inquire.join-people",
            json
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.member_list = that.member_list.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },

    initData() {
      this.show_index = -1;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.member_list = [];
    },
    showDetial(index) {
      this.show_index = index;
    }
  },
  components: { cTitle, cMyswipe }
};
