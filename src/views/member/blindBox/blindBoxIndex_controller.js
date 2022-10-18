import cTitle from "components/title";
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      listData:[],
      slide:[],
      activity_type:0,
      searchText:'',


      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
    };
  },
  activated() {
    this.getData();
  },
  mouted() {},
  methods: {
    initData(){
      this.page=1;	
    },
    getData() {
      this.initData();
      let json={};
      if(this.activity_type!=0){
        json.activity_type = this.activity_type;
      }
      if(this.searchText!=''){
        json.search = this.searchText;
      }
      $http.post("plugin.blind-box.api.index.activity", json, "").then(
        res => {
          if (res.result == 1) {
            this.listData = res.data.list.data;
            this.slide = res.data.slide;

            this.isLoadMore = true;
            this.total_page = res.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        }
      );
    },
    //加载更多数据
    getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        let json={page:this.page};
        if(this.activity_type!=0){
          json.activity_type = this.activity_type;
        }
        if(this.searchText!=''){
          json.search = this.searchText;
        }
        $http.get("plugin.blind-box.api.index.activity",json).then(res=>{
          this.isLoadMore = true;
          if (res.result === 1) {
            var nextPageData = res.data.list.data;
            this.listData = this.listData.concat(nextPageData);
          } else {
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        });


       
      }
    },
    changeTabs(){
      this.getData();
    },
    gotoDetails(id){
      this.$router.push(this.fun.getUrl('blindBoxDetail', {},{id}));
    },
    gotoOrderList() {
      this.$router.push(this.fun.getUrl("orderlist", { status: 0 }));
    },
	
  },
  components: {
    cTitle
  }
};
