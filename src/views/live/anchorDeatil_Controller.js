import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import cVideo from "components/video_waterfall";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      dataInfo: [],
      roomList: [],
      dataList: [],
      titleArr: [],

      newArray1: [],
      newArray2: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      is_concern: 0, //是否已关注：1已关注，0未关注

      activeName: 0
    };
  },
  mounted() {},
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http
        .post("plugin.room.frontend.anchor.get-anchor", { member_id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.dataInfo = response.data;
            this.roomList = response.data.room;
            this.is_concern = response.data.is_concern;
            if (response.data.is_back) {
              this.titleArr.push({
                name: "live",
                url: "plugin.room.frontend.anchor.get-back"
              });
            }
            if (response.data.short_video_display) {
              this.titleArr.push({
                name: "video",
                url: "plugin.room.frontend.anchor.get-video"
              });
            }
            this.titleArr.forEach((val, index) => {
              this.dataList.push({
                isLoadMore: true,
                page: 1,
                total_page: 0,
                list: [],
                url: val.url
              });
            });
            this.handleClick();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoBackPlay(_id, _rid) {
      this.$router.push(this.fun.getUrl("livePage", { id: _rid, backid: _id, memberid: this.$route.params.id, type: "memberPlayBack" }));
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }

      $http
        .post(that.dataList[that.activeName].url, { page: 1, member_id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.data);

            if (this.titleArr[that.activeName].name == "video") {
              this.newArray1 = [];
              this.newArray2 = [];
              this.sort(0, response.data.data);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
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
            list[index].cover = "https://www.yunzmall.com/addons/yun_shop/static/app/img/agreen_video@2x.png";
            that.$nextTick(() => {
              that.sort(index, list);
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
    gotoLive(_status, _id) {
      if (_status == 3) {
        //直播
        this.$router.push(this.fun.getUrl("livePage", { id: _id }));
      } else {
        //预告
        this.$router.push(this.fun.getUrl("foreshow", { id: _id }));
      }
    },
    addConcern() {
      //添加关注
      $http
        .post("plugin.room.frontend.anchor.concern", { member_id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.is_concern = 1;
            Toast("关注成功");
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancelConcern() {
      //取消关注
      $http
        .post("plugin.room.frontend.anchor.cancel-concern", { member_id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.is_concern = 0;
            Toast("已取消关注");
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addNotice(_parameter, _id, _index) {
      let _url = null;
      let that = this;
      if (_parameter == 1) {
        _url = "plugin.room.frontend.live-list.cancel-notice"; //取消开播提醒
      } else {
        _url = "plugin.room.frontend.live-list.play-notice"; //设置开播提醒
      }
      $http
        .post(_url, { id: _id }, "")
        .then(response => {
          if (response.result === 1) {
            if (_parameter == 1) {
              Toast("已取消提醒");
              that.$set(that.roomList[_index], "notice", 0);
            } else {
              Toast("已成功订阅");
              that.$set(that.roomList[_index], "notice", 1);
            }
            //================================
            //进行更新列表操作
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    timeEnd(i) {
      //倒计时结束时触发的回调方法
      console.log("倒计时结束时触发的回调方法，timeEnd()");
    },
    //获取更多数据
    getMoreData() {
      const that = this;

      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {
          member_id: this.$route.params.id
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get(that.dataList[that.activeName].url, _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              let oldLength = that.dataList[that.activeName].list.length;
              var myData = response.data.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接

              if (that.titleArr[that.activeName].name == "video") {
                that.sort(oldLength, that.dataList[that.activeName].list);
              }
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    toVideo(item) {
      let page = this.dataList[this.activeName].list.findIndex((value, index, arr) => {
        return value.video_id === item.video_id;
      });
      //页数
      page = Math.ceil((page + 1) / 10);
      this.$router.push(this.fun.getUrl("VideoDetail", { fromHome: 1 }, { vid: item.video_id, page: page }));
    }
  },
  components: {
    cVideo
  }
};
