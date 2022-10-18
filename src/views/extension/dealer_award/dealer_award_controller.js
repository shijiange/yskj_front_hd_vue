import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      isLoading:false,
      level_name:'',//等级
      total_dividend:0,//总金额
      page:1, 
      award:[], //奖励列表数据
      isLoadMore:true,//判断是否能够加载更多
      last_page:0 ,//总页数
      isShowNoTest:false  //无数据时的判断
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    // 下拉刷新
    loadTop() {
      this.initPageData();
      this.getData();
      // this.$refs.award_loadmore.onTopLoaded();
    },
    initPageData(){
      this.level_name='',
      this.total_dividend=0,
      this.page=1,
      this.award=[],
      this.isLoadMore=true,
      this.last_page=0,
      this.isShowNoTest=false;
    },
    getData(){
      let json={
        page:1
      };
      $http.get('plugin.team-management.api.team-management.index',json,'加载中').then(response=>{
        if(response.result===1){
          this.isLoadMore = true;
          this.level_name=response.data.level_name;
          this.total_dividend=response.data.total_dividend;
          this.last_page=response.data.list.last_page;
          if(!this.last_page){
            this.last_page=0;
          }
          if(response.data.list.data.length>0){
            this.isShowNoTest=false;
            this.award=response.data.list.data;
          }else{
            this.isShowNoTest=true;
          }              
          this.isLoading = false;
        }
        else{
          this.isLoading = false;
          Toast(response.msg);
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    detailTo(Id){
      this.$router.push(
        this.fun.getUrl(
          "DriverDetail",
          { id: Id},
        )
      ); 
    },
    getMoreData(){
      this.isLoadMore = false; // 防止多次请求分页数据
      let json={
        page:this.page
      };
      if(this.page>=this.last_page){
        return; 
      }else{
        this.page=this.page+1;
        json.page=this.page;
        $http.get('plugin.team-management.api.team-management.index',json,'加载中').then((response)=>{
          this.isLoadMore = true;
          if(response.result===1){
            this.award=this.award.concat(response.data.list.data);
          }else {
            this.page = this.page - 1;
            this.isLoadMore = false;
            return;
          }
        }).catch((err)=>{
          console.log(err);
        });
      }
    }
  },
  components: { cTitle }
};
