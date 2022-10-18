//window.localStorage.isWeiXin
import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      card_type:'',
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
    initData(){
      this.card_type='';
      this.page=1;
      this.isLoadMore=true;
      this.last_page=0;
      this.datas=[];
    },
    getMoreData() {
      let json = {
        card_type	:this.card_type,
        page:this.page
      };
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.last_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http
          .get('plugin.energy-cabin.frontend.user-terminal.use-log', json, "加载中")
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
        card_type	:this.card_type,
        page:this.page
      };
      $http.get('plugin.energy-cabin.frontend.user-terminal.use-log', json, '加载中...').then(
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
    this.initData();
    if(this.$route.params.card_type){
      this.card_type=this.$route.params.card_type;
    }
    this.getData();
  }
};
