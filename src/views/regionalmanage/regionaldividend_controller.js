import cTitle from 'components/title';
import {scrollMixin} from 'utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: 'first',
      member:'',
      level_name:'',
      statistic:'',
      dividendtype:-1,
      all:[],
      Issued:[],
      notIssued:[],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },

  mounted() {

  },

  methods: {
    getmemberData(){
      let that = this;
      $http.get("plugin.team-manage.frontend.bonusStatistic.index").then(
        function(response) {
          if (response.result == 1) {
            let member=response.data.data.member;
            that.member=member;
            let level_name=response.data.data.level_name;
            that.level_name=level_name;
            let statistic=response.data.data.statistic;
            that.statistic=statistic;
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    getList(){
      let that = this;
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      $http.get("plugin.team-manage.frontend.bonusList.index",{
        status:that.dividendtype
      }).then(
        function(response) {
          if (response.result == 1) {
            that.total_page=response.data.list.last_page;
            if(that.dividendtype=== -1){
              that.all=response.data.list.data;
            }else if(that.dividendtype===0){
              that.notIssued=response.data.list.data;
            }else if(that.dividendtype===1){
              that.Issued=response.data.list.data;
            }
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    handleClick(tab) {
      if(tab== 1){
        this.dividendtype = -1;
        this.activeName='first';
      }else if(tab==2){
        this.dividendtype = 1;
        this.activeName='second';
      }else if(tab==3){
        this.dividendtype = 0;
        this.activeName='third';
      }
      this.getList();
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      let json = {
        status:that.dividendtype
      };
      that.isLoadMore = false;  // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get('plugin.team-manage.frontend.bonusList.index', {
          page: that.page
        }, '加载中...').then(function (response) {
          that.isLoadMore = true;
          if (response.result === 1) {
            var myData = response.data.list.data;
            if(that.dividendtype=== -1){
              that.all=that.all.concat(myData);
            }else if(that.dividendtype===0){
              that.notIssued=that.notIssued.concat(myData);
            }else if(that.dividendtype===1){
              that.Issued=that.Issued.concat(myData);
            }
          } else {
            that.page = that.page - 1;
            that.isLoadMore = false;
            return;
          }
        }, function (response) {
          // error callback
        });
      }
    },
    godividends(val){
      this.$router.push(this.fun.getUrl("detailsdividends", { id: val }));
    }
  },

  activated() {
    this.getmemberData();
    this.getList();
  },

  components: { cTitle,  }


};