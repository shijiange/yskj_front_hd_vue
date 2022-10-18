//import { mapState } from 'vuex';
import cTitle from "components/title";
import cCarcontent from "components/carcontent1";
// import BScroll from "better-scroll";
import { mapState } from "vuex";

export default {
  data() {
    return {
      brandShow: "0",
      categoryShow: "0",
      active: 9999,
      active2: true,
      allLoaded: false,
      topStatus: "",
      err: "",
      turl: "/category",
      arg: { index: 10, item: "pinch" },
      list: [],
      contentlist: {},
      totalGoodsNum: 0
    };
  },
  computed: mapState(["category", "blurst"]),
  methods: {
    allList() {
      this.active2 = true;
      this.active = 9999;
      this.getContentlist2();
    },
    tabsa(n, i) {
      this.$store.commit("setAdvimg", i);

      this.active = n;
      this.active2 = false;
      this.getContentlist(i.id);
    },
    bpfun() {
      this.$router.push(this.fun.getUrl("brand"));
    },
    getList() {
      let getUrl = "";

      getUrl =
        "plugin.micro.frontend.controllers.MicroShop.category.getCategory";

      $http.get(getUrl).then(
        response => {
          if (response.result == 1) {
            // var myData = response.data;
            this.list = response.data.data;
            this.getContentlist(response.data.data[0]); //获取子分类
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    getContentlist(id) {
      let jsons = { parent_id: id };
      let getUrl = "";

      getUrl =
        "plugin.micro.frontend.controllers.MicroShop.category.getChildrenCategory";

      $http.get(getUrl, jsons).then(response => {
        if (response.result == 1) {
          this.err = false;
          this.contentlist = response.data;
          this.contentlist.tjfl = false;
          this.contentlist.set = response.data.set;
        } else {
          this.err = true;
        }
      });
    },
    getContentlist2() {
      $http.get("goods.category.category-home",{},"loading").then(response => {
        if (response.result == 1) {
          this.err = false;
          response.data.recommend.goo = true;
          this.contentlist = response.data.recommend;
          this.contentlist.tjfl = true;
          this.contentlist.set = response.data.set;
          if (response.data.set.cat_brand && response.data.set.cat_brand.length > 0) {
            this.brandShow = response.data.set.cat_brand;
          }
          if (response.data.set.cat_class && response.data.set.cat_class.length > 0) {
            this.categoryShow = response.data.set.cat_class;
          }
        } else {
          this.err = true;
        }
      });
    },
    _initScroll(doc) {
      //this.menuScroll = new BScroll(doc, {click: true})
    }
  },
  mounted() {},
  activated() {
    this.getList();
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}分类`);
    } else {
      this.fun.setWXTitle("微店分类");
    }
    //this.getContentlist2();
  },
  created() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}分类`);
    } else {
      this.fun.setWXTitle("微店分类");
    }
  },
  components: { cTitle, cCarcontent }
};
