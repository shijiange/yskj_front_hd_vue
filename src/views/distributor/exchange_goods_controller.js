import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      kwd: "",
      list:[],
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init(){
      this.kwd = "";
      this.list=[];
      //more
      this.isLoadMore= true;
      this.page= 1;
      this.total_page= 0;
    },
    changeGood(_id) {
      this.$router.push(this.fun.getUrl("exchangeDetail", {id:_id}));
    },
    getData() {
      let json = {};
      if(this.kwd){
        json.kwd = this.kwd;
      }
      $http
        .post("plugin.channel.frontend.goods-change.getList",json,"").then(response => {
          if (response.result === 1) {
            this.list = response.data.list.data;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
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
          page: this.page
        };
        $http.get("plugin.channel.frontend.goods-change.getList",json,"").then((response)=> {
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
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    }
  },
  components: { cTitle }
};
