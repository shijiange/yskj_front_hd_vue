import cTitle from "components/title";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { scrollMixin } from "utils/mixin";
import { Toast } from "vant";
export default {
  components: { cTitle, yzWechatShareImg },
  mixins: [scrollMixin], //加载更多
  data() {
    let that = this;
    return {
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      //
      money: "",
      saleboxShow: false,
      active: 0,
      current: 0,
      activation: false,
      popShow: false,
      showWechatshar: false,
      swiperOption: {
        loop:false,
        initialSlide: 0,
        direction: "horizontal",
        observer: true,
        // width: 325,
        // height: 120,
        watchOverflow: true,
        autoHeight: true,
        autoplay: false,
        pagination: false,
        slidesOffsetBefore: 25,
        slidesOffsetAfter: 35,
        slidesPerView: "auto",
        spaceBetween: 10,
        on: {
          slideChangeTransitionEnd(e) {
            that.onChange(this.realIndex);
          }
        }
      },
      info: []
    };
  },
  activated() {
    this.getData();
    this.init();
  },
  methods: {
    init() {
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.info = [];
      this.saleboxShow = false;
      this.current = 0;
    },
    tapActivate(item) {
      console.log(item);
      let that = this;
      if (item.type == "1") {
        $http.get("plugin.room.frontend.code.activationCode", { id: item.id }, "加载中").then(
          function(response) {
            if (response.result == 1) {
              console.log(response);
              that.getData();
            }
          },
          function(response) {
            console.log(response);
          }
        );
      }
    },
    onChange(index) {
      this.current = index;
    },
    changeActive(e) {
      this.init();
      this.getData();
    },
    // 明细
    goDetail() {
      // let id = this.info[this.current].id; //授权码id
      this.$router.push(this.fun.getUrl("liveAuthorization_detail", {}));
    },
    // 待收款码
    tapCode() {
      console.log(this.current);
      let kid = this.info[this.current].level_id; //授权码id
      console.log(kid);
      this.$router.push(this.fun.getUrl("liveAuthorization_collection", { id: kid }, {}));
    },
    // 出售弹窗显示
    tapSele() {
      this.saleboxShow = true;
    },
    // 出售
    sureBtnTap() {
      let id = this.info[this.current].id; //授权码id
      let kid = this.info[this.current].level_id;
      if(this.info[this.current].code_num == 0){
        Toast("授权码数量不足");
        return;
      }
      if (this.fun.isTextEmpty(this.money)) {
        Toast("请输入出售价格");
        return;
      } else {
        this.sendLogs(id);
        this.$router.push(this.fun.getUrl("liveAuthorization_collection", {id:kid}, {}));
      }
    },

    sendLogs(kid) {
      let that = this;
      let json = {
        money: that.money,
        id: kid
      };
      $http.get("plugin.room.frontend.code.generatePoster", json, "加载中").then(
        function(response) {
          if (response.result == 1) {
            console.log(response);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getData() {
      let url,
        that = this;
      if (that.active == 1) {
        // 可出售
        url = "plugin.room.frontend.code.salabilityCode";
      } else if (that.active == 0) {
        // 已购买
        url = "plugin.room.frontend.code.purchasedCode";
      }
      $http.get(url, {}, "加载中").then(
        function(response) {
          if (response.result == 1) {
            console.log(response);
            if (that.active == "1") {
              that.info = response.data;
            } else if (that.active == "0") {
              that.info = response.data.data;
              that.isLoadMore = true;
              that.total_page = response.data.last_page;
              if (!that.total_page) {
                that.total_page = 0;
              }
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 加载更多
    getMoreData() {
      let that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      let json = {
        page: 1
      };
      if (that.page >= that.total_page) {
        that.loading = true;
        return;
      } else {
        that.page = that.page + 1;
        json.page = that.page;
        $http.get("plugin.room.frontend.code.salabilityCode", json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.loading = false;
            if (response.result === 1) {
              var myData = response.data.data;
              that.info = that.info.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.loading = true;
              that.isLoadMore = false;
              return;
            }
          },
          function(response) {
            // error callback
            console.log(response);
          }
        );
      }
    }
  }
};