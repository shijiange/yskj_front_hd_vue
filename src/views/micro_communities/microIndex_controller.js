import { Toast } from "vant";
import cTitle from "components/title";
import { scrollMixin } from "utils/mixin";
import cFlow from "components/Waterfalls_flow";
import yz_home_button from "components/ui_components/yz_homeButton";

//import BMap from 'BMap';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      topContent: {},
      bannerContent: {},
      functionList: {},
      cate: [],
      cateList: [],
      newClassification: "",
      nearbyClassification: "",
      address: "",
      city: "",
      point: "",
      poster: "",
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      getMoreDataType: "newClassification",
      cateMoreData: {},
      showLoading: false,

      newArray1: [],
      newArray2: [],
      video_path: "",
      closeNearby: false, //是否关闭附近
      fatherTitle:"社区首页"
    };
  },
  deactivated() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  activated() {
    zhuge.track('进入社区首页');
    // this.getHomePageData();
  },
  created(){
    this.getHomePageData();
  },
  mounted() {},
  methods: {
    getHomePageData() {
      $http.get("plugin.micro-communities.api.index.index").then(response => {
        if (response.result == 1) {
          if (response.data.set) {
            this.topContent = {
              micro_top: response.data.set.micro_top,
              micro_top_jump: response.data.set.micro_top_jump,
              browse_num: response.data.browse_num,
              trick_num: response.data.trick_num
            };
            this.bannerContent = {
              micro_home_one: response.data.set.micro_home_one,
              micro_home_one_jump: response.data.set.micro_home_one_jump,
              micro_home_two: response.data.set.micro_home_two,
              micro_home_two_jump: response.data.set.micro_home_two_jump,
              micro_home_three: response.data.set.micro_home_three,
              micro_home_three_jump: response.data.set.micro_home_three_jump
            };
            this.functionList = {
              show_sign: response.data.set.show_sign == 1 ? true : false,
              show_clock: response.data.set.show_clock == 1 ? true : false,
              show_video: response.data.set.show_video == 1 ? true : false,
              show_qr: response.data.set.show_qr == 1 ? true : false
            };
          }
          if (response.data.video_set) {
            if (response.data.video_set.video_path) {
              this.video_path = response.data.video_set.video_path;
            }
          }
          this.cate = response.data.cate;
          this.closeNearby = response.data.nearby_close ? Number(response.data.nearby_close) : false;
          if (!this.closeNearby) this.locationInit();
          for (let i = 0; i < this.cate.length; i++) {
            this.cateList.push([]);
          }

          let is_default = true;
          if (this.fun.getKey("cat_id")) {
            // 通过分类id进入
            let cate_index = null;
            let child_flag = false;
            this.cate.map((item, i) => {
              if (item.id == this.fun.getKey("cat_id")) {
                cate_index = i;
              }
              item.child.map(child => {
                if (child.id == this.fun.getKey("cat_id")) {
                  cate_index = i;
                  child_flag = true;
                }
              });
            });
            if (cate_index !== null) {
              is_default = false;
              this.$nextTick(() => {
                this.active = cate_index + 2;
                if (child_flag) {
                  this.getCateChild(this.fun.getKey("cat_id"),{});
                } else {
                  this.getClassificationBtn(this.active, "");
                }
              });
            }
          }

          if (is_default) {
            this.getClassification("newClassification");
          }
        } else {
          Toast(response.msg);
        }
      });
    },
    locationInit() {
      this.fun
        .getLocation()
        .then(res => {
          this.city = res.city;
          this.address = res.title;
          this.point = res.point;
        })
        .catch(err => {
          console.log(err);
        });
    },
    jumpAddress(url) {
      if (url) {
        zhuge.track('社区首页-点击广告位');
        window.location.href = url;
      }
    },
    goClassification(item) {
      //console.log(item);
      zhuge.track('社区首页-点击5*1 icon',{
        'icon名称':item.name
      });
      this.$router.push(
        this.fun.getUrl(
          "microClassification",
          {},
          {
            cateId:item.id
          }
        )
      );
    },
    getClassificationBtn(index, title) {
      //console.log('99987');
      if (title == "最新") {
        this.getClassification("newClassification");
        this.getMoreDataType = "newClassification";
      } else if (title == "附近") {
        this.getClassification("nearbyClassification");
        this.getMoreDataType = "nearbyClassification";
      } else {
        let indexData = this.closeNearby?index -1 : index - 2;
        this.getClassification("", this.cate[indexData].id, indexData);
        this.getMoreDataType = "cate";
        this.cateMoreData = {
          type: "",
          id: this.cate[indexData].id,
          index: indexData
        };
      }
      zhuge.track('社区首页-点击选择帖子标签一级标签',{
        '一级标签名称':title
      });
    },
    getClassification(type, id, index) {
      let dataJson = {};
      this.showLoading = false;
      this.isLoadMore = false;
      this.pageInit();
      if (id) {
        dataJson.cat_id = id;
      } else {
        if (type == "newClassification") {
          dataJson.trick_new = 1;
        } else if (type == "nearbyClassification") {
          let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
          dataJson.lng = p.lng;
          dataJson.lat = p.lat;
          dataJson.city_name = this.city;
          dataJson.address = this.city;
        }
      }
      dataJson.stick_type = 1;
      $http.post("plugin.micro-communities.api.index.getStick", dataJson, "").then(response => {
        this.showLoading = true;
        if (response.result == 1) {
          this.total_page = response.data.last_page;
          if (id) {
            this.cateList.splice(index, 1, response.data.data);
          } else {
            if (type == "newClassification") {
              this.newClassification = response.data.data;
            } else if (type == "nearbyClassification") {
              this.nearbyClassification = response.data.data;
            }
          }
        } else {
          Toast(response.msg);
          this.showLoading = true;
          this.isLoadMore = false;
        }
      });
    },
    getCateChild(id,item) {
      let indexData = this.closeNearby ? this.active - 1 : this.active -2;
      this.getCateChildData("", id, indexData);
      this.getMoreDataType = "cate";
      this.cateMoreData = {
        type: "",
        id: id,
        index: indexData
      };
      //console.log(indexData);//一级分类标签在数组中的下标
     // console.log(this.cate);
      let titleZhuge = '';
      for(let i=0;i<this.cate.length;i++){
          if(i == indexData){
            titleZhuge=this.cate[i].name;
          }
      }
      zhuge.track('社区首页-点击选择帖子标签',{
        '一级标签名称':titleZhuge,
        '二级标签名称':item.name
      });
    },
    getCateChildData(type, id, index) {
      let dataJson = {};
      this.showLoading = false;
      this.isLoadMore = false;
      this.pageInit();
      if (id) {
        dataJson.cat_id = id;
      }
      this.cateList[index] = [];
      dataJson.stick_type = 1;
      $http.post("plugin.micro-communities.api.index.getStick", dataJson, "").then(response => {
        this.showLoading = true;
        if (response.result == 1) {
          this.total_page = response.data.last_page;
          if (id) {
            this.cateList.splice(index, 1, response.data.data);
          }
        } else {
          Toast(response.msg);
          this.showLoading = true;
          this.isLoadMore = false;
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
    jumpToSearch() {
      zhuge.track('社区首页-点击帖子搜索栏');
      this.$router.push(this.fun.getUrl("microSearchIndex"));
    },
    toVideo() {
      console.log(this.video_path);
      if (this.video_path == "videoDetail") {
        this.$router.push(this.fun.getUrl("VideoDetail"));
      } else {
        this.$router.push(this.fun.getUrl("VideoList"));
      }
    },
    goToUrl(name) {
      this.$router.push(this.fun.getUrl(name));
    },
    openQrCode(e) {
      if (!this.poster && e !== "none") {
        if (!this.timer) {
          this.getPoster(e);
          this.timer = setInterval(() => {
            this.getPoster(e);
          }, 3000);
        } else {
          this.$refs.hook.style.display = e;
        }
      } else {
        this.$refs.hook.style.display = e;
        clearInterval(this.timer);
      }
    },
    getPoster(e) {
      $http.get("member.poster").then(
        response => {
          if (response.result === 1) {
            this.poster = response.data.image_url;
            this.$refs.hook.style.display = e;
            if (this.poster && this.timer) {
              clearInterval(this.timer);
            }
          } else {
            Toast(response.msg);
            if (this.timer) {
              clearInterval(this.timer);
            }
          }
        },
        response => {
          console.log(response.msg);
          if (this.timer) {
            clearInterval(this.timer);
          }
        }
      );
    },
    pageInit() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      //this.newClassification = [];
    },
    loadMore() {
      this.isLoadMore = true;
    },
    //获取更多数据
    getMoreData() {
      let json = {};
      if (this.getMoreDataType == "newClassification") {
        json.trick_new = 1;
      } else if (this.getMoreDataType == "nearbyClassification") {
        let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
        json.lng = p.lng;
        json.lat = p.lat;
        json.city_name = this.city;
        json.address = this.city;
      } else {
        json.cat_id = this.cateMoreData.id;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // this.showLoading = true;
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        this.showLoading = false;
        json.stick_type = 1;
        $http.post("plugin.micro-communities.api.index.getStick", json, "加载中...").then(
          response => {
            this.showLoading = true;
            if (response.result === 1) {
              var myData = response.data.data;
              if (this.getMoreDataType == "newClassification") {
                this.newClassification = this.newClassification.concat(myData);
              } else if (this.getMoreDataType == "nearbyClassification") {
                this.nearbyClassification = this.nearbyClassification.concat(myData);
              } else {
                this.cateList[this.cateMoreData.index] = this.cateList[this.cateMoreData.index].concat(myData);
              }
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          response => {
            this.showLoading = true;
          }
        );
      }
    }
  },
  components: {
    cTitle,
    cFlow,
    yz_home_button
  }
};
