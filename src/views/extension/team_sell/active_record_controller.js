import cTitle from 'components/title';
import { scrollMixin } from '../../../utils/mixin'; //引入加载更多

export default {
  mixins: [scrollMixin],
  data() {
    return {
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas: []
    };
  },

  activated() {
    this.initData();
    this.getData();
  },
  mounted() {},

  methods: {
    initData() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.datas = [];
    },
    getData() {
      let that = this;
      let json = { page: this.page };
      $http.get('plugin.team-sales.api.active.log', json, '加载中...').then(
        function(response) {
          if (response.result == 1) {
            that.total_page = response.data.list.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.list.data;
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      let json = { page: this.page };
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get('plugin.team-sales.api.active.log', json, '加载中')
          .then(
            response => {
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.list.data;
                this.datas = this.datas.concat(myData); //数组拼接
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
    }
  },
  components: { cTitle }
};
