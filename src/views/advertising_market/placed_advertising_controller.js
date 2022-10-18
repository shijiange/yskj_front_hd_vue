import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show1: false,
      show2: false,
      advertsList: [],
      catrgorys: [],
      districts: [],

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    gotoEdit(id) {
      if (id) {
        this.$router.push(this.fun.getUrl("editAdvertising", { id: id }));
      } else {
        this.$router.push(this.fun.getUrl("addAdvertising"));
      }

    },
    getCity(advert_id) {
      $http.get("plugin.advert-market.frontend.advert.getPutDistricts", { advert_id: advert_id }, "..").then(
        response => {
          if (response.result === 1) {
            this.districts = response.data.districts;
            this.show1 = true;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getClass(advert_id) {
      $http.get("plugin.advert-market.frontend.advert.getPutStoreCatrgorys", { advert_id: advert_id }, "..").then(
        response => {
          if (response.result === 1) {
            this.catrgorys = response.data.store_categorys;
            this.show2 = true;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getData() {
      $http.get("plugin.advert-market.frontend.advert.getMyAdverts", {}, "..").then(
        response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.adverts.last_page;
            this.advertsList = response.data.adverts.data;
          }
        },
        function(response) {
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
            "plugin.advert-market.frontend.advert.getMyAdverts",
            {
              page: that.page
            },
            "加载中"
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.adverts.data;
                that.advertsList = that.recordsList.concat(myData); //数组拼接
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
    }
  },
  components: { cTitle }
};
