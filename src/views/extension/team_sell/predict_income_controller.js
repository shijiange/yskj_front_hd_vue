import cTitle from 'components/title';
export default {
  data() {
    return {
      title:[],
      isLoadMore: true,
      page: 1,
      total_page: 0,
      datas: [],
      name: '',
      loading: false,
      dividend_type:'0'
    };
  },

  activated() {
    this.getData();
  },
  mounted() { },

  methods: {
    handleClick(){
      this.initData();
      this.getData();
    },
    initData() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.datas = [];
    },
    getData() {
      let that = this;
      this.loading = true;
      let json = { page: this.page, dividend_type: this.dividend_type };
      $http.get('plugin.team-sales.api.dividend.month', json, '加载中...').then(
        function (response) {
          that.loading = false;
          if (response.result == 1) {
            that.total_page = response.data.last_page;
            that.title=response.data.title;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.data;
            
            console.log(that.datas);
          } else {
            console.log(response.msg);
          }
        },
        function (response) {
          that.loading = false;
          console.log(response);
        }
      );
    },
    //获取更多数据
    getMoreData() {
      let json = { page: this.page, dividend_type: this.dividend_type };
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.loading = true;
        this.page = this.page + 1;
        $http
          .get('plugin.team-sales.api.dividend.month', json, '加载中')
          .then(
            response => {
              this.loading = false;
              this.isLoadMore = true;
              if (response.result === 1) {
                let myData = response.data.data;
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
            this.loading = false;
            console.error(err);
          });
      }
    }
  },
  components: { cTitle }
};
