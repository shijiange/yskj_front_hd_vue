
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active:'',
      id:'',
      buy_member:[],
      info:[]
    };
  },
  activated() {
    this.active = this.$route.params.active;
    this.getData();
  },
  methods: {
    init(){
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getData() {
      let that = this;
      let urlStr = '';
      let json ;
      console.log(this.active);
      if (this.active == 1) {
        urlStr = "plugin.cloud-warehouse.frontend.dividend.wait-unseal-buy-log";
        json = {   
          wg_id:that.$route.params.id,
        };
      } else {
        urlStr = "plugin.cloud-warehouse.frontend.dividend.complete-unseal-buy-log";
        json = {   
          id:that.$route.params.id,
        };
      }
      $http
        .get(
          urlStr,
          json,
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            that.info = response.data;
            console.log(that.info);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取更多数据
  },
  components: { cTitle }
};