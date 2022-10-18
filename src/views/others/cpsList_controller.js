import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from 'utils/mixin';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      id: '',
      title:'',
      info:[],
      isLoadMore: true, //判断是否要加载更多的标识
      page: 1, //当前的页数
      total_page: 0, //总共有多少页
    };
  },
  activated() {
    console.log(this.$route.params.id);
    this.id = this.$route.params.id;
    this.title = this.$route.params.title;
    this.getdata();
  },
  mouted() {
  },
  methods: {
    tapDetail(kid){
      this.$router.push(this.fun.getUrl("cpsDetail", { id: kid }));
    },
    getdata() {
      let that = this;
      $http
        .get(
          'plugin.aggregation-cps.api.equity.goods-list',
          {
            brand_id: that.id
          },
          ''
        )
        .then(
          response => {
            if (response.result == 1) {
              console.log(response.data);
              that.info = response.data.data;
              this.isLoadMore = true;
              this.total_page = response.data.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
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
            'plugin.aggregation-cps.api.equity.goods-list',
            { page: this.page, brand_id: that.id },
            '加载中'
          )
          .then(
            response => {
              that.isLoadMore = true;

              if (response.result === 1) {
                var myData = response.data.data;
                that.info = that.info.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              console.log(response);
              // error callback
            }
          );
      }
    },
  },
  components: {
    cTitle,

  }
};