import cTitle from "components/title";
import { scrollMixin } from "../../utils/mixin";

export default {
  mixins: [scrollMixin],
  data() {
    return {
      img1: require('../../assets/images/photo-mr.jpg'),
      active: 0,
      showli: false,
      info: [],
      acount0: [],
      acount1: [],
      list: [],
      ind:null,
      custom_name:'上级奖',
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
    };
  },
  activated() {
    this.getData();
  },
  mounted() {

  },
  methods: {
    show(inds){
      if(this.ind == null){
        this.ind = inds;
      }else{
        this.ind = null;
      }
    },
    tabChange(){
      console.log(this.active);
      this.list = '';
      this.page = 1;
      this.getData();
    },
    //获取数据 未结算佣金
    getData() {
      let that = this;
      let json = {
        state: that.active,
        page:1
      };
      $http
        .post(
          "plugin.superior-reward.api.index.index",
          json,
          ""
        )
        .then(
          function (response) {
            if (response.result === 1) {
              if(response.data.custom_name){
                that.fun.setWXTitle(response.data.custom_name);
              }
              that.custom_name = response.data.custom_name;
              console.log(response.data);
              that.info = response.data;
              that.acount0 = response.data.acount[0];
              that.acount1 = response.data.acount[1];
              that.list = response.data.list.data;
              that.isLoadMore = true;
              that.total_page =  response.data.list.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
            } else {
              console.log(response.msg);
            }
          },
          function (response) {
            console.log(response);
          }
        );
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
            "plugin.superior-reward.api.index.index",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.list.data;
                that.list = that.list.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              console.error(response.msg);
            }
          );
      }
    },
  },
  components: { cTitle }
};