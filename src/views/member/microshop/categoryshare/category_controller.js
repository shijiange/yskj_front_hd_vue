//import { mapState } from 'vuex';
import cTitle from "components/title";
import cCarcontent from "./carcontent";
// import BScroll from "better-scroll";
import { mapState } from "vuex";

export default {
  data() {
    return {
      active: 0,
      active2: true,
      allLoaded: false,
      topStatus: "",
      err: "",
      turl: "/category",
      arg: { index: 10, item: "pinch" },
      list: [],
      contentlist: {},
      shoplang: ""
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
      $http
        .get(
          "plugin.micro.frontend.controllers.MicroShop.CategoryByShare.getCategory"
        )
        .then(
          response => {
            if (response.result == 1) {
              // var myData = response.data;
              this.list = response.data.data;
              this.shoplang = response.data.lang;
              console.log(response.data.data[0]);

              if (
                this.fun.isTextEmpty(response.data) ||
                this.fun.isTextEmpty(response.data.data) ||
                this.fun.isTextEmpty(response.data.data[0])
              ) {
                return;
              }
              this.tabsa(0, response.data.data[0]); //默认获取第一个子分类
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    getContentlist(id) {
      let jsons = { parent_id: id };
      $http
        .get(
          "plugin.micro.frontend.controllers.MicroShop.CategoryByShare.getChildrenCategory",
          jsons
        )
        .then(response => {
          if (response.result == 1) {
            this.err = false;
            this.contentlist = {
              data: response.data.data,
              tjfl: false,
              set: response.data.set
            };
            //						 this.$nextTick(() => {
            //						 	this._initScroll(this.$refs.menucontent)
            //						 })
          } else {
            this.err = true;
          }
        });
    },
    getContentlist2() {
      $http.get("goods.category.category-home",{},"loading").then(response => {
        if (response.result === 1) {
          this.err = false;
          response.data.recommend.goo = true;
          this.contentlist = response.data.recommend;
          this.contentlist.tjfl = true;
          this.contentlist.set = response.data.set;
        } else {
          this.err = true;
        }
      });
    },
    _initScroll(doc) {
      //this.menuScroll = new BScroll(doc, {click: true})
    }
  },
  activated() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}分类`);
    } else {
      this.fun.setWXTitle("微店分类");
    }
  },
  created() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}分类`);
    } else {
      this.fun.setWXTitle("微店分类");
    }
    this.getList();
  },
  components: { cTitle, cCarcontent }
};
