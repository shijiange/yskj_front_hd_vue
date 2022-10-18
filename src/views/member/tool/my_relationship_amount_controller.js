import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
// import { Toast } from 'vant';

export default {
  mixins: [scrollMixin],
  data() {
    return {
      type: "",
      url: "",
      level_id: "",
      level_index: 0,
      default_level_name: "",
      agent: {}, //语言包
      title_name: "",

      projectList: [],
      levelList: [],

      // more
      allLoad: false,
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  activated() {
    this.type = this.$route.params.type;
    this.agent = JSON.parse(window.localStorage.getItem("mailLanguage")).agent ? JSON.parse(window.localStorage.getItem("mailLanguage")).agent : {};
    if (this.type == "first") {
      this.url = "plugin.member-center-agent.api.index.my-agent";
      this.title_name = this.agent.agent_num || "客户数量";
    } else if (this.type == "all") {
      this.url = "plugin.member-center-agent.api.index.my-agent-all";
      this.title_name = this.agent.agent_count || "总客户数";
    }
    this.fun.setWXTitle(this.title_name);

    this.getData();
  },
  methods: {
    init() {
      this.allLoad = false;
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.projectList = [];
    },
    chooseLevel(id, index) {
      this.level_id = id;
      this.level_index = index;
      this.getData();
    },

    getData() {
      this.init();
      let json = {
        page: this.page,
      };
      if(this.level_id !== "") {
        json.level_id = this.level_id;
      }
      $http
        .post(
          this.url,
          json,
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.child.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.projectList = response.data.child.data;
            this.default_level_name = response.data.default_level_name;
            if (this.levelList.length <= 0) {
              this.levelList = response.data.level;
              this.levelList.unshift({ id: "", level_name: "全部", yz_member_count: 0 });
              if (!this.level_id) {
                //全部数量
                this.levelList[0].yz_member_count = response.data.child.total;
              }
            }
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.allLoad = true;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page,
        };
        if(this.level_id !== "") {
          json.level_id = this.level_id;
        }
        $http
          .post(
            this.url,
            json,
            "加载中"
          )
          .then(
            response => {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.child.data;
                that.projectList = that.projectList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            response => {
              // error callback
            }
          );
      }
    },
    gotoDetail(uid) {
      this.$router.push(this.fun.getUrl("MyRelationshipDetail", { uid: uid }));
    }
  },
  components: {}
};
