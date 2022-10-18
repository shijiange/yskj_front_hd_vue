import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      listData: [],

      member: {},
      level:{},
      amount:'',
      un_amount:'',

      activeName:0,
      tabsArr:[
        {name:'推荐奖',value:'recommend'},{name:'商家补贴',value:'business'},{name:'服务奖励',value:'service'},
        {name:'运营奖励',value:'operation'},{name:'差价收益',value:'price_difference'},{name:'任务奖励',value:'task'},
        {name:'帮扶奖',value:'support'},{name:'团队提成',value:'team'},{name:'门店奖励',value:'store'}
      ],
      descArr1:['推荐会员','新进会员','门店','下级会员','','','','','门店'],
      descArr2:['推荐等级','新进等级','','','','','','',''],
      settlement:['未结算','已结算']
    };
  },
  created() {
    document.body.scrollTop = 0; document.documentElement.scrollTop = 0;
    console.log("执行");
    this.getData();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy(){
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
   
    getData() {
      this.page=1;
      $http.get("plugin.store-business-alliance.frontend.award.get-award",{award_type:this.tabsArr[this.activeName].value},"").then((res)=>{
        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }
  
        this.member = res.data.member;
        this.level = res.data.level;
        this.amount = res.data.amount;
        this.un_amount = res.data.un_amount;


        this.listData = res.data.award.data;
        console.log(this.listData);
        this.isLoadMore = true;
        this.total_page = res.data.award.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
      });
      
    },
    //加载更多数据
    getMoreData() {
      console.log("执行");
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.store-business-alliance.frontend.award.get-award", {
            award_type:this.tabsArr[this.activeName].value,
            page: this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.award.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },

    changeActive(e){
      console.log(e,this.activeName);
      this.getData();
    },

    gotoAwardsRecord(id) {
      this.$router.push(this.fun.getUrl("regionalAwardsRecord", {}, { quotaId: id }));
    }


  }
};