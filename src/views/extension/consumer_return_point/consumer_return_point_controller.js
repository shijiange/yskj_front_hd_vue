import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], // 加载更多
  data() {
    return {
      // more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      recordsList:[],
      moreDataType:1,
      recordsTeamList:[],
      trans:''
    };
  },
  created() {

  },
  activated() {
    this.getRecordsListData();
  },
  methods: {
    getRecordsTeamList(){
      var that = this;
      that.isLoadMore=true;
      that.page=1;
      that.total_page=0;
      $http.post("plugin.interval-consumption.Frontend.controllers.records.team-records", {
        page:that.page
      }, "").then(
        function(response) {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.list.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.recordsTeamList = response.data.list.data;
          } else {
            that.$dialog.alert({message:response.msg});
            
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
          
        }
      );
    },
    getRecordsListData(){
      var that = this;
      that.isLoadMore=true;
      that.page=1;
      that.total_page=0;
      $http.post("plugin.interval-consumption.Frontend.controllers.records.index", {
        page:that.page
      }, "").then(
        function(response) {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.list.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.info = response.data.info;
            if(response.data.info&&response.data.info.trans){
              that.trans = response.data.info.trans;
            }
            that.recordsList = response.data.list.data;
          } else {
            that.$dialog.alert({message:response.msg});
            
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
          
        }
      );
    },
    tabHandel(index){
      this.moreDataType = index + 1;
      if(this.moreDataType==1){
        this.getRecordsListData();
      }else if(this.moreDataType==2){
        this.getRecordsTeamList();
      }
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.recordsList=[];
      this.moreDataType=1;
      this.recordsTeamList=[];
      this.trans='';
      // this.fun.setWXTitle(this.WXtitle)
    },
    getMoreData() {
      let url = '';
      if(this.moreDataType==1){
        url = 'plugin.interval-consumption.Frontend.controllers.records.get-personal';
      }else if(this.moreDataType==2) {
        url = 'plugin.interval-consumption.Frontend.controllers.records.get-team';
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http.post(url, {
          page: this.page
        }, "加载中").then(
          response => {
            this.isLoadMore = true;
            let myData = [];
            if (response.result === 1) {
              myData = response.data.data;
              if(this.moreDataType==1){
                this.recordsList = this.recordsList.concat(myData); // 数组拼接
              }else if(this.moreDataType==2) {
                this.recordsTeamList = this.recordsTeamList.concat(myData); // 数组拼接
              }
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          response => {
            Toast(response.msg);
          }
        )
          .catch(err => {
            console.error(err);
          });
      }
    }
  },
  components: { cTitle }
};
