import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      memberId: '',
      toi: this.fun.getKeyByI(),
      selected: "1",
      display: 1,
      pagesize: 1,
      //待使用
      wait_used: [],
      //已过期
      overdue: [],
      used: [],
      loading: false,
      allLoaded: false,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isPresenter: false,

      types: [],
      typesIndex: 0,
      share_coupon: false,
      write_off_coupon: false,
    };
  },
  methods: {
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.loading = true;
      this.allLoaded = false;
      this.isLoadMore = true;
      this.typesIndex = 0;
      this.isPresenter = false;
    },
    // 加载更多
    loadBottom() {
      if (this.isLoadMore) {
        this.getMoreData(this.page, this.selected);
        this.$refs.coupon_loadmore.onBottomLoaded();
      } else {
        console.log("没有更多数据");
      }
    },

    setTypesIndex(ind) {
      if (this.typesIndex == ind) {
        return;
      }
      this.typesIndex = ind;
      this.getNetData(this.selected, this.typesIndex);
    },
    //发起http请求
    getNetData(type, typesIndex) {
      var that = this;
      $http
        .get(
          "plugin.shop-assistant.frontend.coupon.coupon-list",
          { uid: this.memberId, status_request: type, page: 1, coupon_type: typesIndex },
          "正在获取"
        )
        .then(
          response => {
            if (response.result == 1) {
              var myData = response.data;
              that.total_page = response.data.total;
              that.isPresenter = response.data.set ? response.data.set.transfer : '';
              that.types = response.data.search_array;
              for (let i = 0; i < myData.list.length; i++) {
                if (myData.list[i].belongs_to_coupon.coupon_type_name == '平台商品') {
                  myData.list[i].type = 1;
                } else if (myData.list[i].belongs_to_coupon.coupon_type_name == '兑换券') {
                  myData.list[i].type = 2;
                } else if (myData.list[i].belongs_to_coupon.coupon_type_name == '分类商品') {
                  myData.list[i].type = 3;
                } else if (myData.list[i].belongs_to_coupon.coupon_type_name == '指定商品') {
                  myData.list[i].type = 4;
                } else if (myData.list[i].belongs_to_coupon.coupon_type_name == '酒店商品') {
                  myData.list[i].type = 5;
                } else if (myData.list[i].belongs_to_coupon.coupon_type_name == '门店商品') {
                  myData.list[i].type = 6;
                } else if (myData.list[i].belongs_to_coupon.coupon_type_name == '商品和门店') {
                  myData.list[i].type = 8;
                }
              }
              if (!this.fun.isTextEmpty(myData.write_off_coupon)) {
                this.write_off_coupon = myData.write_off_coupon;
              } else { this.write_off_coupon = false; }
              if (!this.fun.isTextEmpty(myData.share_coupon)) {
                this.share_coupon = myData.share_coupon;
              } else { this.share_coupon = false; }
              if(!this.fun.isTextEmpty(myData.combine_show)){
                this.combine_show = myData.combine_show;
              }else{ this.combine_show = false;}
              if (type == 1) {
                that.wait_used = myData.list;
              } else if (type == 2) {
                that.overdue = myData.list;
              } else {
                that.used = myData.list;
              }
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function (response) {
            // error callback
          }
        );
    },
    getMoreData(page, type) {
      var that = this;
      if (this.page == this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        that.loading = true;
        that.allLoaded = true;
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.shop-assistant.frontend.coupon.coupon-list",
            {
              uid: this.memberId,
              status_request: type,
              page: this.page,
              coupon_type: typesIndex,
              i: this.fun.getKeyByI(),
              type: this.fun.getTyep()
            },
            "正在获取更多"
          )
          .then(
            function (response) {
              that.isPresenter = response.data.set ? response.data.set.transfer : '';
              if (response.result == 1) {
                var myData = response.data;

                that.loading = false;
                that.allLoaded = false;
                if (index == 1) {
                  that.wait_used = that.wait_used.concat(myData.list); //数组拼接
                } else if (index == 2) {
                  tthat.overdue = that.overdue.concat(myData.list);
                } else {
                  that.used = that.used.concat(myData.list);
                }
              } else {
                that.page = that.page - 1;
                that.loading = true;
                that.allLoaded = true;
                that.isLoadMore = false;
                return;
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
    this.initData();
    this.toi = this.fun.getKeyByI();
    this.used = [];
    this.wait_used = [];
    this.overdue = [];
    this.selected = '1';
    this.memberId = this.$route.params.id;

    this.getNetData(1, this.typesIndex);
  },
  components: { yzBlank },
};
