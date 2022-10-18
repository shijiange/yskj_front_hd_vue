import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from 'utils/mixin';


export default {
  mixins: [scrollMixin],
  data() {
    return {
      active: '全部',
      loading:false,
      isLoadMore: true, //判断是否要加载更多的标识
      total_page: 0, //总共有多少页
      cartList:[],
      allCarList:[],
      notUsedCartList:[],
      alreadyCartList:[],
      state:0,//全部
      page:1,
      noData:false,
      noneMore:false,
      activatedStatus:false,
      timer:null
    };
  },

  mounted() {
   
  },
  activated() {
    window.scrollTo(0,0);
    this.activatedStatus = false;
    this.active = '全部';
    this.noData = false;
    this.isLoadMore=true;
    this.noneMore = false;
    this.page = 1;
    this.getCartList();
  },
  methods: {
    // handleScroll() {
    // console.log(document.body.scrollTop,'0000000000000')
    // document.documentElement.scrollTop = 0 
    // },
    getCartList(state) {
      $http.get("plugin.store-card.Frontend.Modules.Card.Controllers.records.index",{state:state?state:this.state,page:this.page}).then(response => {
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.allCarList = response.data.data;
          this.loading = true;
          this.noneMore = true;
          window.scrollTo(0,0);
          if(this.allCarList.length == 0) {
            this.noData = true;
          }
        } else {
          Toast(response.msg);
        }
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
        $http
          .get(
            "plugin.store-card.Frontend.Modules.Card.Controllers.records.index",{state:this.state,page:this.page},
            { page: this.page, id: this.$route.params.id },
            '加载中'
          )
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.allCarList = that.allCarList.concat(myData); //数组拼接
                that.noneMore = true;
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    handleTab(name,title) {
      this.noData = false;
      this.noneMore = false;
      this.isLoadMore=true;
      this.allCarList= [];
      this.page = 1;
      this.getCartList(name);
    },
    handleUse(id) {

      this.$router.push(this.fun.getUrl('storeConsumeStore', {id:id}));
      window.scrollTo(0,0);
    }
  },
  components: { cTitle }
};
