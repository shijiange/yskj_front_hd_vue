

import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin";
import cListItem from "./components_list_item.vue";
export default {
  mixins: [scrollMixin], //加载更多
  components:{cListItem},
  data(){
    return {
      searchText:'',
      oldSearchText:'',

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      listData:[]

    };
  },
  created(){


  },
  activated(){
    this.initData();
    this.searchText = '';
    this.oldSearchText = '';
    let searchText = this.$route.query.searchText;
    if(searchText && !this.fun.isTextEmpty(searchText)){
      this.searchText = searchText;
      this.sendSearch();
    }

  },
  methods:{
    initData(){
      this.page = 1;
      this.isLoadMore=true;
      this.total_page=0;
      this.listData=[];
    },
    async sendSearch(){
      if(this.searchText == this.oldSearchText) return;
      this.oldSearchText = this.searchText;
      this.initData();
      Toast.loading({
        message: '搜索中',
        forbidClick: true,
      });
      let res = await $http.get("plugin.group-code.api.group-code.search-list",{
        "search[code_name]": this.searchText
      });
      Toast.clear();
      if(res.result !=1 ){
        Toast(res.msg);
        return;
      }

      this.listData = res.data.list.data;
      this.isLoadMore = true;
      this.total_page =  res.data.list.last_page;
      if (!this.total_page) {
        this.total_page = 0;
      }

      console.log(res);

    },
    //加载更多数据
    async getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        let res = await $http.get("plugin.group-code.api.group-code.search-list",{
          page:this.page,
          "search[code_name]": this.searchText
        });

        this.isLoadMore = true;
        if (res.result === 1) {
          var nextPageData = res.data.list.data;

          this.listData = this.listData.concat(nextPageData);
          //this.status = res.data.status;
        } else {
          this.page = this.page - 1;
          this.isLoadMore = false;

        }
      }
    },
    goto() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    gotoGroupCodeLabel(item){
      this.$router.push(
        this.fun.getUrl("groupCodeLabel",{},{groupCodeId:item.id})
      );
    },
  }


};
