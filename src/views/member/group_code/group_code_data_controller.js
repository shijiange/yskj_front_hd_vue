/**
 * Created by win 10 on 2020/7/21.
 */
import { Toast } from 'vant';

import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data(){
    return {
      activeName:1,
      groupCodeData:{},
      listData:[],

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
    };
  },
  created(){

  },
  mounted(){
    this.getData();
  },
  activated(){
    this.initData();
    this.getData();
  },
  methods:{
    initData(){
      this.page = 1;
      this.isLoadMore=true;
      this.total_page=0;
    },
    async getData(){
      Toast.loading({
        message: '加载中',
        forbidClick: true,
      });
      let res = await $http.get("plugin.group-code.api.group-code.my-group-code-statistic",{
        id:this.$route.query.groupCodeId
      });
      Toast.clear();
      if(res.result != 1){
        Toast( res.msg);
        return ;
      }

      this.groupCodeData = res.data.data;

      this.listData = res.data.list.data;
      this.isLoadMore = true;
      this.total_page = res.data.list.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }


    },
    //加载更多数据
    getMoreData(){
   
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.group-code.api.group-code.my-group-code-statistic",{
            id:this.$route.query.groupCodeId,
            page:this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.list.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;

            }
          });
      }
    },
  },

};
