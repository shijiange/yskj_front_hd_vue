
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 1,
      inputs: '',
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      show:false,
      info:[]
    };
  },
  methods: {
    search() {
      console.log(this.inputs);
      this.getData();
    },
    hidebox() {
    },
    enterSearch(e) {
      console.log(e);
    },
    goback() {
      this.$router.go(-1);
    },
    tapDetail(id){
      console.log(id);
      if(this.active == 2){
        return;
      }
      this.$router.push(
        this.fun.getUrl("pickUp", {id: id,active:this.active})
      );
    },
    togoods(id){
      this.$router.push(
        this.fun.getUrl("goods", {
          id: id
        })
      );
    },
    init(){
      this.inputs = '';
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    closeShow(e){
      this.show = false;
    },
    onClick(e) {
      this.init();
      this.getData();
    },
    getCondition(kid){
      $http
        .get(
          "plugin.cloud-warehouse.frontend.warehouse-goods-manage.remove-condition",
          {
            goods_id: kid
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            this.show = true;
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      var that = this;
      let url = '';
      if (that.active == '1') {
        url = "plugin.cloud-warehouse.frontend.warehouse-goods-manage.deposit-area";
      } else {
        url = "plugin.cloud-warehouse.frontend.warehouse-goods-manage.seal-area";
      }
      $http
        .get(
          url,
          {
            name: that.inputs
          },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            that.list = response.data.data;
            that.total_page = response.data.last_page;
            this.isLoadMore = true;
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
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let url = '';
      if (that.active == '1') {
        url = "plugin.cloud-warehouse.frontend.warehouse-goods-manage.deposit-area";
      } else {
        url = "plugin.cloud-warehouse.frontend.warehouse-goods-manage.seal-area";
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            url,
            {
              page: that.page
            },
            "加载中"
          )
          .then((response) => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function (response) {
            // error callback
          }
          );
      }
    },
  },
  activated() {
    this.show = false;
    this.getData();
  },
  components: { cTitle }
};