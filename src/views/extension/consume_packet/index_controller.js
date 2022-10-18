import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: "",
      list: [],
      base_data: {},

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.active = '';
    this.initData();
    this.getData();
  },
  methods: {
    changeTab() {
      this.initData();
      this.getData();
    },
    initData() {
      this.list = [];
      //more
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getData() {
      let json = {
        status: this.active
      };
      $http.get("plugin.consume-red-packet.Frontend.Modules.Receive.Controllers.records.index",json,"").then(response => {
        if (response.result === 1) {
          this.base_data = response.data.base_data;
          this.list = response.data.page_list.data;
          this.isLoadMore = true;
          this.total_page = response.data.page_list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
        } else {
          Toast(response.msg);
          this.$router.go(-1);
        }
      })
        .catch(error => {
          console.log(error);
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
        let json = {
          page: this.page,
          status: this.active
        };
        $http.get("plugin.consume-red-packet.Frontend.Modules.Receive.Controllers.records.index",json,"").then((response)=> {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.page_list.data;
            that.list = that.list.concat(myData); //数组拼接
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
          }
        },
        function(response) {
          // error callback
        }
        );
      }
    },
  },
  components: { cTitle }
};
