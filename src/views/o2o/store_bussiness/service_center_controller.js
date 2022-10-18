import { Toast } from "vant";
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      regionsList:[],
      district_id:0,

      listData:[],
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      store_num:'',
      store_amount:''

    };
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
    this.getRegionsList();
  },
  beforeDestroy(){
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    //获取数据
    getRegionsList() {
      $http
        .get("plugin.store-business-alliance.frontend.index.get-regions", {})
        .then(response => {
          if (response.result == 1) {
            console.log(response.data);
            this.regionsList = response.data;
            this.district_id = this.regionsList[0].district_id;
            this.store_num = this.regionsList[0].store_num;
            this.store_amount = this.regionsList[0].store_amount;
            this.getDate();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    handTab(item){
      if(item.district_id == this.district_id) return;
      this.district_id = item.district_id;
      this.store_num = item.store_num;
      this.store_amount = item.store_amount;
      this.getDate();
    },

    //获取数据
    getDate() {
      $http
        .get("plugin.store-business-alliance.frontend.index.get-regions-store", {district_id:this.district_id})
        .then(response => {
          if (response.result != 1) return Toast(response.msg);
          console.log(response.data);
          this.listData = response.data.data;
          this.isLoadMore = true;
          this.total_page = response.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
        })
        .catch(error => {
          console.log(error);
        });
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
          .get("plugin.store-business-alliance.frontend.index.get-regions-store",{
            page:this.page,district_id:this.district_id
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;
              this.listData = this.listData.concat(nextPageData);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
  }
};
