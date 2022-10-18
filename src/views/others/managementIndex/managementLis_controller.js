import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      tapStart:false,
      show:false,
      info:'',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  deactivated(){

  },
  activated() {
    this.getData();
  },
  methods: {
    toIndex(eid){
      this.$router.push(this.fun.getUrl("managementIndex", {id:eid}));
    },
    toDetail(eid,aid){
      this.$router.push(this.fun.getUrl("managementGoods", {id:eid,kid:aid}));
    },
    getData() {
      $http
        .get(
          "plugin.producer.frontend.producer.getList",
          { page: this.page },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.info = response.data.data.data;
            this.total_page = response.data.data.last_page;
            for(let i = 0;i<this.info.length;i++){
              if(this.info[i].goods_list.length >= 8){
                this.info[i].goods_list = this.info[i].goods_list.slice(0,8);
              }
            }
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
      console.log(this.page, this.total_page);
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.producer.frontend.producer.getList",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function (response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data.data;
                for(let i = 0;i<myData.length;i++){
                  if(myData[i].goods_list.length >= 8){
                    myData[i].goods_list = myData[i].goods_list.slice(0,8);
                  }
                }
                that.info = that.info.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function (response) {
              console.error(response.msg);
            }
          );
      }
    },
  },
  components: { cTitle }
};
