import collageItem1 from "../components/collage_item_1";
import collageItem2 from "../components/collage_item_2";
import collageItem3 from "../components/collage_item_3";
import { Dialog } from "vant";
import { Toast } from "vant";
import { scrollMixin } from "../../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  components: { collageItem1, collageItem2, collageItem3 },
  data() {
    return {
      tag3Items: ["全部", "未释放", "已释放"],
      tag3Index: 0,
      activeIndex: 0,
      listData: [],
      power: 0,
      searchText: "",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数

    };
  },
  mounted() {

  },
  created() {
    if (this.$route.params.fromHome != 1) {
      let selectIndex = this.$route.query.selectIndex;
      if (selectIndex) {
        this.$nextTick(() => {
          this.activeIndex = parseInt(selectIndex);
        });

      } else {
        this.getData();
      }
    }
  },
  activated() {
    if (this.$route.params.fromHome == 1) {
      let selectIndex = this.$route.query.selectIndex;
      if (selectIndex) {
        this.activeIndex = parseInt(selectIndex);
      } else {
        this.getData(-1);
      }
    }
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    setTag3Index(key) {
      if (this.tag3Index == key) return;
      this.tag3Index = key;
      this.getData();
    },
    sendSearch() {
      this.getData();
    },
    changeActiveIndex(index) {

      this.getData();
    },
    delProject(item) {
      Dialog.confirm({
        title: "删除拼单",
        message: "该操作不可撤回，是否继续？",
        beforeClose: async (action, done) => {
          if (action === "confirm") {
            let res = await $http
              .get("plugin.collage.api.index.In-formation-data", {
                delProject: "delProject",
                id: item.id
              });


            this.$dialog.alert({ message: res.data.delProject });
            if (res.result != 1) return;

            this.listData.forEach((obj, key) => {
              if (obj.id == item.id) {
                this.listData.splice(key, 1);
              }
            });
            done();

          } else {
            done();
          }
        }
      });
    },
    async getData() {
      this.initData();
      Toast.loading({
        message: "请稍等",
        forbidClick: true
      });
      let spell_type = (this.activeIndex - 1);
      let search = {};
      if (spell_type == 0) {
        search.project_full_name = this.searchText;
      }
      if (spell_type == 2) {
        search.locking_type = (this.tag3Index - 1);
      }
      let res = await $http
        .post("plugin.collage.api.index.In-formation-data", {
          getProject: "getProject",
          search,
          spell_type
        });
      Toast.clear();
      if (res.result == 1) {
        this.power = res.data.getProject.power;
        this.listData = res.data.getProject.project.data;

        this.isLoadMore = true;
        this.total_page = res.data.getProject.project.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
      }
      console.log(res);
    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        let spell_type = (this.activeIndex - 1);
        let search = {};
        if (spell_type == 0) {
          search.project_full_name = this.searchText;
        }
        if (spell_type == 2) {
          search.locking_type = (this.tag3Index - 1);
        }
        this.page += 1;
        $http
          .post("plugin.collage.api.index.In-formation-data", {
            page: this.page,
            getProject: "getProject",
            search,
            spell_type
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.getProject.project.data;

              this.listData = this.listData.concat(nextPageData);
              //this.status = res.data.status;
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    },
    async addCollage(item) {
      console.log(item);
      Toast.loading({
        message: "正在加入中",
        forbidClick: true
      });
      let res = await $http
        .post("plugin.collage.api.index.InformationData", {
          addCollage: "addCollage",
          project_id: item.id
        });
      Toast.clear();

      if (res.result == 1) {
        Toast(res.data.addCollage);
        item.is_collage = 1;
      } else {
        Toast(res.msg);
      }
    }
  }
};