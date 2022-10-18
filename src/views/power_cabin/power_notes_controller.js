//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      id:1,
      page: 1,
      isLoadMore: true, //判断是否能够加载更多
      last_page: 0, //总页数,
      datas: [],
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    getMoreData() {
      let json = {
        equipment_id:this.id,
        page:this.page
      };
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.last_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http
          .get('plugin.energy-cabin.frontend.dealer-terminal.use-log', json, "加载中")
          .then(response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              this.datas = this.datas.concat(response.data.data);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              return;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    getData() {
      const that = this;
      let json = {
        equipment_id:this.id,
        page:this.page
      };
      $http.get('plugin.energy-cabin.frontend.dealer-terminal.use-log', json, '加载中...').then(
        function(response) {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.last_page = response.data.last_page;
            if (!that.last_page) {
              that.last_page = 0;
            }
            if (response.data.data.length > 0) {
              that.datas = response.data.data;
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
  },
  activated() {
    if(this.$route.params.id){
      this.id=this.$route.params.id;
    }
    this.getData();
  }
};
