import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      total_amount:'',
      current: 0,
      bonus: {},
      first_content: [],
      isLoadMore: true,
      activeName:'first',
      page: 1,
      total_page: 0
    };
  },

  activated() {
    this.initData();
    this.current = 0;
    this.getData();
  },

  components: { cTitle },
  computed: {},
  methods: {
    loadTop() {
      this.initData();
      this.getData();
      this.$refs.award_loadmore.onTopLoaded();
    },
    change(item) {
      item.status = !item.status;
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.first_content = [];
    },
    handleClick() {

    },
    getData() {
      let that = this;
      let url = "plugin.ordinary-dividend.frontend.ordinary.getOrdinaryList";
      let json = {
        page: 1
      };
      $http.get(url,json, "获取中").then(
        response => {
          if (response.result == 1) {
            that.total_amount = response.data.total_amount;
            
            that.first_content = response.data.record.data;
            that.total_page = response.data.record.last_page;
            that.page = response.data.record.current_page;
            that.record = response.data.record;

            that.isLoadMore = true;
            that.total_page = response.data.record.last_page;
            if (!that.total_page) {
              that.total_page = 0;
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
    getMoreData(page) {
      this.isLoadMore = false; // 防止多次请求分页数据
      let that = this;
      let url = "plugin.ordinary-dividend.frontend.ordinary.getOrdinaryList";
      if (this.page === this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        this.page = this.page + 1;
        $http.get(url, json, "加载中").then(
          function(response) {
            if (response.result === 1) {
              that.isLoadMore = true;
              that.total_page = response.data.record.last_page;
              let arr = response.data.record.data;
              that.first_content = that.first_content.concat(arr);
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
    }
  }
};