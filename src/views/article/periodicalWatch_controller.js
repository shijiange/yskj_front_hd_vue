import cTitle from "components/title";
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { Toast } from "vant";
export default {
  data() {
    let that = this;
    return {
      show: false,
      swiperOption: {
        direction: "horizontal",
        observer: true,
        // width: window.innerWidth,
        // height: window.innerHeight,
        watchOverflow: true,
        autoHeight: true,
        autoplay: false,
        pagination: false,
        loop: false,
        initialSlide: 0,
        on: {
          slideChangeTransitionEnd() {
            that.current = this.realIndex;
            window.scrollTo(0, 0);
          },
        }
      },
      touchInd: "",
      current: "",
      page: 1,
      // url: [],
      before_journal: [],
      article_data: [],
      posterImg: "",
      postShow: false,
      loading: true,
      last_page: "",
      // 客服
      service_mobile: "",
      service_QRcode: "",
      severShow: false,
      cservice: "",
      showWechatshar: false,
      leftMove: false
    };
  },
  activated() {
    Toast("左右滑动可以切换文章");
    console.log(this.$route.params);
    // 先销毁原来初始化的实例，赋值后再挂载实例
    this.current = this.$route.params.ind;
    setTimeout(() => {
      this.$refs.goodSwiper.swiper.destroy();
      this.swiperOption.initialSlide = this.$route.params.ind;
      this.$refs.goodSwiper.mountInstance();
    }, 50);
    this.getdata();
    if (this.fun.isPc) {
      console.log("1111");
      document.getElementsByTagName("body")[0].style.setProperty("--width-primary", "375px");
    } else {
      console.log("222");
      document.getElementsByTagName("body")[0].style.setProperty("--width-primary", "100%");
    }
    this.init();
  },
  deactivated() {},
  mounted() {},

  methods: {
    toAdvs(link){
      console.log(link);
      if (
        !this.fun.isTextEmpty(link) &&
        this.fun.isTextEmpty(link)
      ) {
        return;
      }
      window.location.href = this.fun.funHrefFilters(link);
    },
    getDecoration() {
      console.log(this.$refs.goodSwiper);
    },
    init() {
      this.service_mobile = "";
      this.service_QRcode = "";
      this.severShow = false;
      this.cservice = "";
      this.last_page = "";
      this.loading = true;
      this.postShow = false;
      this.article_data = [];
      this.before_journal = [];
      this.page = 1;
    },
    shareFir() {
      this.showWechatshar = true;
      this.show = false;
    },
    //往期杂志点击跳转
    tapLIst(kid) {
      this.$router.push(this.fun.getUrl("periodicalDetail", { id: kid }));
    },
    toGoBtn(key) {
      if (key == "home") {
        this.$router.push(this.fun.getUrl("periodicalIndex", {}));
      } else if (key == "list") {
        this.$router.push(this.fun.getUrl("periodicalDetail", {}));
      }
    },
    //初始化客服参数
    initCservice(code, datas) {
      console.log(code, datas);
      if (code == "1") {
        if (!this.fun.isTextEmpty(datas)) {
          if (!this.fun.isTextEmpty(datas.cservice)) {
            this.cservice = datas.cservice;
          }
          if (!this.fun.isTextEmpty(datas.service_QRcode)) {
            this.service_QRcode = datas.service_QRcode;
          }
          if (!this.fun.isTextEmpty(datas.service_mobile)) {
            this.service_mobile = datas.service_mobile;
          }
        }
      } else if (code == "2") {
        // 客服插件
        if (!this.fun.isTextEmpty(datas)) {
          this.cservice = datas;
        }
      }
      // if (!this.fun.isTextEmpty(newCservice)) {
      //   this.cservice = newCservice;
      //   if (!this.fun.isTextEmpty(QRcode)) {
      //     this.service_QRcode = QRcode;
      //   }
      //   if (!this.fun.isTextEmpty(mobile)) {
      //     this.service_mobile = mobile;
      //   }
      // }
    },
    getdata() {
      let that = this;
      $http
        .get("plugin.journal.frontend.journal.detail", { journal_id: that.$route.params.id, page: that.page }, "加载中")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            // that.url = response.data.url;
            that.article_data = response.data.article_data;
            that.initCservice(response.data.customer_service.code, response.data.customer_service.data);
            that.before_journal = response.data.before_journal.data;
            that.last_page = response.data.before_journal.last_page;
            if (that.page >= that.last_page) {
              that.loading = false;
            } else {
              that.loading = true;
            }
            that.fun.wxShare(
              "",
              {},
              {
                link:
                  that.fun.getSiteRoot() +
                  "/addons/yun_shop/" +
                  "?menu#" +
                  "/periodicalWatch/" +
                  that.$route.params.id +
                  "/" +
                  that.current +
                  "?i=" +
                  that.fun.getKeyByI() +
                  "&mid=" +
                  that.fun.getKeyByMid(),
                title: that.article_data[that.current].has_one_article.title,
                imgUrl: that.article_data[that.current].has_one_article.thumb,
                description: that.article_data[that.current].has_one_article.title
              },
              data => {
                if (!that.fun.isTextEmpty(data.shop && data.shop.shop)) {
                  that.initCservice("1", data.shop.shop.cservice); //客服重新赋值
                }
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getMoreLis() {
      if (this.last_page == 0) {
        return;
      }
      if (this.loading) {
        this.page = Number(this.page) + 1;
      }
      let that = this;
      $http
        .get("plugin.journal.frontend.journal.detail", { journal_id: that.$route.params.id, page: this.page }, "加载中")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            // that.url = response.data.url;
            if (response.data.before_journal.data.length > 0) {
              that.before_journal = that.before_journal.concat(response.data.before_journal.data);
              that.last_page = response.data.before_journal.last_page;
              if (that.page >= that.last_page) {
                that.loading = false;
              } else {
                that.loading = true;
              }
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getPoste() {
      let that = this;
      console.log(this.article_data[this.current].id);
      let id = this.article_data[this.current].id;
      let json = {
        journal_article_id: id,
        article_key: this.current
      };
      $http
        .get("plugin.journal.frontend.create-new-poster.createPoster", json, "加载中")
        .then(response => {
          if (response.result === 1) {
            console.log(response);
            that.show = false;
            that.posterImg = response.data;
            that.postShow = true;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  components: { cTitle, yzWechatShareImg }
};
