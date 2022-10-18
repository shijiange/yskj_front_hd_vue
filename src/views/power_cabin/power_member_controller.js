//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1,
      isLoadMore: true, //判断是否能够加载更多
      last_page: 0, //总页数,
      datas: [],
      keyword:'',
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    toDetail(item) {
      this.$router.push(this.fun.getUrl('powerDetail',{info:item}));
    },
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.getData();
      }
    },
    getData() {
      this.page = 1;
      let that = this;
      let json = {
        member: this.keyword,
        page: this.page
      };
      $http.get('plugin.energy-cabin.frontend.user-terminal.search-member', json, ' ').then(
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
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          member: this.keyword,
          page: this.page
        };
        $http.get('plugin.energy-cabin.frontend.user-terminal.search-member', json, '加载中').then(
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
    },
  },
  activated() {
    this.getData();
  }
};
