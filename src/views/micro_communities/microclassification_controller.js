import { Toast } from "vant";
import cTitle from "components/title";
import cFlow from "components/Waterfalls_flow";

//import BMap from 'BMap';
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      selected: "1",
      commodityTitle: "",
      classificationHide: true,
      catelist: [],
      catelistData: [],
      cateid: "",
      lastindex: 0,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      load: false,
      fatherTitle:"微社区分类页"
    };
  },
  activated() {
    if (this.$route.params.searchdata) {
      this.commodityTitle = this.$route.params.searchdata;
    }
    if (this.$route.query.cateId) {
      this.cateid = this.$route.query.cateId;
    }
    this.classificationLabel();
    zhuge.track('进入微社区分类页面',{
      '关键词':this.$route.params.searchdata
    });
    zhuge.startTrack('微社区分类页停留时长',{
      '关键词':this.$route.params.searchdata
    });
  },
  beforeRouteLeave(to, from, next) {
    //诸葛统计
    zhuge.endTrack('微社区分类页停留时长',{
      '关键词':this.$route.params.searchdata
    });
    next();
  },
  mounted() {},
  methods: {
    classificationShow() {
      this.classificationHide = !this.classificationHide;
    },
    classificationLabel() {
      let that = this;
      $http.get("plugin.micro-communities.api.index.getCate").then(
        function(response) {
          if (response.result == 1) {
            that.catelist = response.data.data;
            // 添加全部选项
            that.catelist.unshift({
              child: [],
              icon: "",
              id: "",
              level: 1,
              name: "全部"
            });
            if (that.catelist && that.catelist.length > 0) {
              for (let i = 0; i < that.catelist.length; i++) {
                that.catelistData.push([]);
              }
              if (that.cateid) {
                for (let i = 0; i < that.catelist.length; i++) {
                  if (that.catelist[i].id == that.cateid) {
                    that.getClassification(true, i);
                    that.lastindex = i;
                    that.selected = i + 1 + "";
                    break;
                  }
                }
              } else {
                that.cateid = that.catelist[0].id;
                that.getClassification(false);
              }
            }
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    pageInit() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    getClassification(setindex, index) {
      let that = this;
      let dataJson = {};
      this.load = false;
      that.pageInit();
      if (this.commodityTitle) {
        dataJson.title = this.commodityTitle;
      }
      if (this.cateid) {
        dataJson.cat_id = this.cateid;
      }
      $http.post("plugin.micro-communities.api.index.getStick", dataJson, "").then(response => {
        that.load = true;
        if (response.result == 1) {
          that.total_page = response.data.last_page;
          if (setindex) {
            that.catelistData.splice(index, 1, response.data.data);
          } else {
            that.catelistData.splice(0, 1, response.data.data);
            that.lastindex = 0;
          }
          if (response.data.current_page >= response.data.last_page || response.data.data.length < response.data.per_page) {
            that.isLoadMore = false;
          }
        } else {
          Toast(response.msg);
        }
      });
    },
    jumpDetails(stick_id) { 
      this.$router.push(
        this.fun.getUrl("microCommentDetails", {
          stickId: stick_id
        })
      );
    },
    swishTabTItem(id, index) {
      this.lastindex = index;
      this.cateid = id;
      this.selected = index + 1 + "";
      this.getClassification(true, index);
      this.classificationHide = true;
    },
    searchBtn() {
      this.getClassification(true, this.lastindex);
    },
    goBack() {
      this.$router.go(-1);
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      let json = {};
      if (this.commodityTitle) {
        json.title = this.commodityTitle;
      }
      if (this.cateid) {
        json.cat_id = this.cateid;
      }
      if (this.page >= this.total_page || this.loading) {
        return;
      } else {
        this.loading = true;
        this.page = this.page + 1;
        json.page = this.page;
        $http.post("plugin.micro-communities.api.index.getStick", json, "加载中...").then(
          function(response) {
            that.loading = false;
            if (response.result != 1) {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
            var myData = response.data.data;
            let list = that.catelistData[that.lastindex].concat(myData);
            that.$set(that.catelistData, that.lastindex, list);
            if (response.data.current_page >= response.data.last_page || myData.length < response.data.per_page) {
              that.isLoadMore = false;
            }
          },
          function(response) {
            that.load = true;
            // error callback
          }
        );
      }
    }
  },

  components: {
    cTitle,
    cFlow
  }
};
