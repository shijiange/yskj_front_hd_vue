import cTitle from "components/title";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {      
      homepageData: {},//李晓红  添加变量还有下面几个
      micuid: "",
      maincomment: "",
      mainCommentShow: false,
      is_open: "",
      review: "",
      release: "",
      activeName: "1",
      videoList: [],
      bannerList: [],
      newArray1: [],
      newArray2: [],
      showLoading: false,
      member: {},
      //more
      isLoadMore: false,
      page: 1,
      isSelf: true, //是否是本人
      total_page: 0
    };
  },
  activated() {
    zhuge.track('进入个人主页222',{
      '用户名':this.homepageData.nickname,
      '用户id':this.micuid
    });
     //李晓红  添加方法
    if (this.$route.params.id) {
      this.micuid = this.$route.params.id;
    }  
    this.initData();
    this.getData();
    this.getHomepageData(); //李晓红  添加方法
  },
  mounted() {},
  methods: {
    deletaVideo(_id) {
      this.$dialog
        .confirm({ message: "删除该短视频" })
        .then(() => {
          $http
            .get("plugin.video-share.frontend.video.del", {
              id: _id
            })
            .then(response => {
              if (response.result === 1) {
                this.getData();
                Toast(response.msg);
              } else {
                Toast(response.msg);
              }
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(() => {});
    },
    initData() {
      this.videoList = [];
      this.newArray1 = [];
      this.newArray2 = [];
      if (this.$route.params.id) this.isSelf = false;
    },
    // 图片加载完回调
    getImg(url, callback, callback2) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(img.width, img.height, Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          callback2();
        };
      }
    },
    getData() {
      this.videoList = [];
      this.page = 1;
      this.isLoadMore = false;
      this.showLoading = false;
      $http
        .get("plugin.video-share.frontend.video.my-video", {
          v_uid: this.$route.params.id || "",
          page: this.page,
          status: this.activeName
        })
        .then(response => {
          if (response.result === 1) {
            this.is_open = !this.$route.params.id ? response.data.is_open : false;
            this.member = response.data.member;
            this.review = response.data.review;
            this.release = response.data.release;
            this.total_page = response.data.video.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            if (this.total_page === 0) {
              this.showLoading = true;
            }
            this.videoList = response.data.video.data;
            this.newArray1 = [];
            this.newArray2 = [];
            this.sort(0, this.videoList);
          } else {
            Toast(response.msg);
            this.page = this.page - 1;
            this.isLoadMore = false;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    sort(arg, list) {
      let that = this;
      let index = arg || 0;
      if (list.length > index) {
        that.getImg(
          list[index].cover,
          function(w, h, r) {
            let boxA = 0;
            let boxB = 0;

            if (document.getElementsByClassName("zq-waterfall-left")[0]) {
              boxA = document.getElementsByClassName("zq-waterfall-left")[0].clientHeight;
            }

            if (document.getElementsByClassName("zq-waterfall-right")[0]) {
              boxB = document.getElementsByClassName("zq-waterfall-right")[0].clientHeight;
            }

            if (boxA <= boxB) {
              that.newArray1.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list); //加载完再递归
              });
            } else {
              that.newArray2.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list);
              });
            }
          },
          function() {
            that.$nextTick(() => {
              that.sort(index + 1, list);
            });
          }
        );
      }
      if (list.length - 1 == index) {
        this.isLoadMore = true;
        this.showLoading = true;
      }
      if (list.length == 0) {
        this.showLoading = true;
      }
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      this.showLoading = false;
      if (this.page >= this.total_page) {
        this.showLoading = true;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.video-share.frontend.video.my-video",
            {
              v_uid: this.$route.params.id || "",
              page: that.page,
              status: this.activeName
            },
            "加载中"
          )
          .then(
            response => {
              if (response.result === 1) {
                let myData = response.data.video.data;
                let oldLength = that.videoList.length;
                that.videoList = that.videoList.concat(myData); //数组拼接
                that.sort(oldLength, that.videoList);
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
              }
            },
            function(response) {
              // error callback
            }
          );
      }
    },
    handleClick() {
      this.initData();
      this.getData();
    },
    toVideo(item) {
      if (this.activeName == "1") {
        let page = this.videoList.findIndex((value, index, arr) => {
          return value.id === item.id;
        });
        //页数
        page = Math.ceil((page + 1) / 20);
        this.$router.push(
          this.fun.getUrl(
            "VideoDetail",
            {},
            {
              vid: item.id,
              page: page,
              from: "me",
              uid: this.member.uid,
              activeName: this.activeName
            }
          )
        );
      } else {
        return false;
      }
    },//李晓红  添加方法  下面
    toMicroHomePage(){
      let that = this;
      this.$router.push(this.fun.getUrl("microhomepage", {}, { micuid: that.micuid }));
    },
    toMyVideoPage(){
      let that = this;
      this.$router.push(this.fun.getUrl("myVideo", {id: that.micuid}));    
   },
    introductionInp(){
      this.mainCommentShow = true;
    },
    subMainBtn(){
      if (!this.maincomment) {
        Toast("请留下你的简介吧");
        return false;
      }
      let that = this;
      let dataJson = {};
      dataJson.contents = this.maincomment;
      $http
        .post("plugin.micro-communities.api.user.upSignature", dataJson, "")
        .then(response => {
          if (response.result == 1) {
            that.$set(that.homepageData, "signature", that.maincomment);
            Toast(response.msg);
            that.mainCommentShow = false;
          } else {
            Toast(response.msg);
            that.mainCommentShow = false;
          }
        });
    },
    getHomepageData() {
      let that = this;
      let dataJson = {};
      if (this.micuid) {
        dataJson.uid = this.micuid;
      }
      $http
        .post("plugin.micro-communities.api.user.index", dataJson, "")
        .then(response => {
          if (response.result == 1) {
            that.homepageData = response.data;
            that.micuid = that.homepageData.uid;
            that.maincomment = response.data.signature
              ? response.data.signature
              : "";
            // that.initShare();
            that.fun.wxShare(
              "",
              {},
              {
                title: that.homepageData.nickname + "的微视频",
                link:document.location.href + "&share_tag=2"+"&micuid="+that.micuid,
                imgUrl: that.homepageData.avatar,
                description: that.homepageData.signature?that.homepageData.signature:''
              }
            );
            that.getClassification();
            return;
          } else {
            Toast(response.msg);
          }
        });
    },
    attentionBtn() {
      if (this.homepageData.is_follow) {
        this.cancelAttention();
      } else {
        this.addAttention();
      }
    },
     cancelAttention() {
      let that = this;
      let dataJson = {
        uid: that.micuid
      };
      $http
        .post("plugin.micro-communities.api.user.delFollow", dataJson)
        .then(response => {
          if (response.result == 1) {
            that.$set(this.homepageData, "is_follow", false); //动态添加
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        });
    },
    addAttention() {
      let that = this;
      let dataJson = {
        user_id: that.micuid
      };
      $http
        .post("plugin.micro-communities.api.user.addFollow", dataJson)
        .then(response => {
          if (response.result == 1) {
            that.$set(that.homepageData, "is_follow", true); //动态添加
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        });
    }
  },
  components: { cTitle }
};
