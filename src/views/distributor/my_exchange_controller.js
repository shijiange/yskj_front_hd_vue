import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list:[],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.isLoadMore= true;
    this.page= 1;
    this.total_page= 0;
    this.getData();
  },
  methods: {
    getData(){
      let that = this;
      that.list = [];
      $http
        .post('plugin.channel.frontend.exchange-log.index',{},"").then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.list.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.list = response.data.list.data;
          } else {
            Toast(response.msg);
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
          page: this.page
        };
        $http.get("plugin.channel.frontend.exchange-log.index",json,"").then((response)=> {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.list.data;
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
