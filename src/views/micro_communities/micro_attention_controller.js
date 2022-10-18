import { Toast } from 'vant';
import { scrollMixin } from "../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      bannerindex: 1,
      info: {},
      mainCommentShow: false,
      maincomment: "",
      uName: null, //当前用户名称，用于发表评论时
      commentId: null,
      activeTid: null, //当前点击的帖子id
      isUnsubscribe: false, //取消关注弹窗
      UnsubscribeId: null, //要取消关注的用户id
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      isLoading:false,
      isNOMore: false //没有更多文本显示
    };
  },
  activated() {
    this.getData();
    zhuge.track('进入社区关注页面');
  },
  methods: {
    getData() {
      $http
        .get("plugin.micro-communities.api.trick.getFollowTrick", {})
        .then(response => {
          if (response.result == 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.uName = response.data.uName;
            this.info = response.data.data;
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    showUnsubscribe(_id) {
      this.UnsubscribeId = _id;
      this.isUnsubscribe = true;
    },
    UnsubscribeMethob() {
      $http
        .get("plugin.micro-communities.api.user.delFollow", {
          uid: this.UnsubscribeId
        })
        .then(response => {
          if (response.result == 1) {
            Toast("已取消关注");
            this.isUnsubscribe = false;
            this.getData();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    gotoMicrocommentdetails(item) {
     // console.log(item);
      //console.log(this);
      zhuge.track('社区关注页面-点击帖子',{
        '发布人':item.has_one_stick_user.nickname,
        '发布人id':item.has_one_stick_user.uid,
        '帖子标题':item.title,
        '帖子id':item.id,
        '帖子所属一级标签':item.has_one_category.cate_name,
        '帖子所属二级标签':item.has_one_category.name
      });
      this.$router.push(
        this.fun.getUrl("microCommentDetails", {
          stickId: item.id
        })
      );
    },
    selectLike(item, status, ind) {
      let that = this;
      if (status == 1) {
        $http
          .get("plugin.micro-communities.api.trick.cancelPraise", {
            tid:item.id
          })
          .then(response => {
            if (response.result == 1) {
              that.info[ind].is_praise = 0;
              Toast("取消点赞");
            } else {
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        $http
          .get("plugin.micro-communities.api.trick.givePraise", {
            tid: item.id
          })
          .then(response => {
            if (response.result == 1) {
              that.info[ind].is_praise = 1;
              this.$set(that.info);
              Toast("点赞成功");
            } else {
              Toast(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      zhuge.track('社区关注页面-点击点赞',{
        '发布人':item.has_one_stick_user.nickname,
        '发布人id':item.has_one_stick_user.uid,
        '帖子标题':item.title,
        '帖子id':item.id,
        '帖子所属一级标签':item.has_one_category.cate_name,
        '帖子所属二级标签':item.has_one_category.name
      });
    },
    sidingsImg(index) {
      this.bannerindex = index + 1;
    },
    subMainCommentBtn(item, _ind) {
      //console.log(item);
      this.commentId =item.id;
      this.maincomment = "";
      this.activeTid = _ind;
      this.mainCommentShow = true;
      zhuge.track('社区关注页面-点击评论',{
        '发布人':item.has_one_stick_user.nickname,
        '发布人id':item.has_one_stick_user.uid,
        '帖子标题':item.title,
        '帖子id':item.id,
        '帖子所属一级标签':item.has_one_category.cate_name,
        '帖子所属二级标签':item.has_one_category.name
      });
    },
    subMainBtn() {
      if (!this.maincomment) {
        Toast("请输入你的精彩评论");
        return;
      }
      this.mainCommentShow = false;
      this.getReplyComments();
    },
    getReplyComments() {
      let that = this;
      let dataJson = {
        tid: that.commentId,
        content: that.maincomment
      };
      $http
        .post("plugin.micro-communities.api.trick.comments", dataJson)
        .then(response => {
          if (response.result == 1) {
            that.info[this.activeTid].comment.unshift({
              content: that.maincomment,
              uname: that.uName
            });
            //console.log(that.info[this.activeTid]);
            //console.log(localStorage.getItem('uid'));
            zhuge.track('社区关注页面-点击发送评论',{
              '发布人':that.info[this.activeTid].has_one_stick_user.nickname,
              '发布人id':that.info[this.activeTid].user_id,
              '帖子标题':that.info[this.activeTid].title,
              '帖子id':that.info[this.activeTid].id,
              '帖子所属一级标签':that.info[this.activeTid].has_one_category.cate_name,
              '帖子所属二级标签':that.info[this.activeTid].has_one_category.name,
              '发布日期':that.info[this.activeTid].created_at,
              '评论字数':that.maincomment.length
            });
            this.$set(that.info);
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        });
    },
    gotoHome(item) {
      //console.log(item);
      zhuge.track('社区关注页面-点击发布人',{
        '发布人':item.has_one_stick_user.nickname,
        '发布人id':item.user_id
      });
      this.$router.push(this.fun.getUrl("microhomepage", {}, { micuid: item.user_id }));
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        this.isNOMore = true;
        return;
      } else {
        that.page += 1;
        $http
          .get(
            "plugin.micro-communities.api.trick.getFollowTrick",
            { page: that.page },
            "加载中..."
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.info = that.info.concat(nextPageData); //进行数组拼接
              that.signNumber = res.data.total;
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //下拉刷新
    loadTop() {
      //console.log('触发下拉');
      this.initPageData();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    },
    // 初始化数据
    initPageData() {
      this.info = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
      this.isNOMore = false;
    }
  },
  filters: {
    setLength: function(value) {
      if (!value) return "0";
      return value.length;
    },
    timeSlice: function(setdateTimeStamp) {
      let minute = 1000 * 60;
      let hour = minute * 60;
      let day = hour * 24;
      // let halfamonth = day * 15;
      let month = day * 30;

      let dateTimeStamp = new Date(setdateTimeStamp);
      let now = new Date().getTime();
      let diffValue = now - dateTimeStamp;
      if (diffValue < 0) {
        //若日期不符则弹出窗口告之
        return "结束日期不能小于开始日期！";
      }
      let monthC = diffValue / month;
      let weekC = diffValue / (7 * day);
      let dayC = diffValue / day;
      let hourC = diffValue / hour;
      let minC = diffValue / minute;
      let result = null;
      if (monthC >= 1 && monthC <= 3) {
        result = setdateTimeStamp.substr(5, 11);
      } else if (weekC >= 1 && weekC <= 3) {
        result = setdateTimeStamp.substr(5, 11);
      } else if (dayC >= 1 && dayC <= 6) {
        result = setdateTimeStamp.substr(5, 11);
      } else if (hourC >= 1 && hourC <= 23) {
        result = parseInt(hourC) + "小时前";
      } else if (minC >= 1 && minC <= 59) {
        result = "今天" + parseInt(minC) + "分钟前";
      } else if (diffValue >= 0 && diffValue <= minute) {
        result = "刚刚";
      } else result = setdateTimeStamp.substr(5, 11);
      return result;
    }
  }
};
