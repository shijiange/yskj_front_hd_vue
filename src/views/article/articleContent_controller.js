import cTitle from "components/title";
import { Toast } from "vant";
import yzCommentInput from "components/ui_components/yz_commentInput";
let self = null;
export default {
  data() {
    return {
      id: "",
      dataInfo: {},
      content: "",
      like_num: 0,
      read_num: 0,
      is_advs_type: false,
      is_report_enabled: false,
      is_no_copy_url: false,
      is_no_share: false,
      is_no_share_to_friend: false,
      is_liked: false,
      is_link: false,
      title: "",
      codeUrl: "",
      imgList: [],
      showImg: false,
      imgStart: 0,
      menuLists: [],
      //微信要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
      // 文章评论
      showCommentInput: false,
      commentInputOptions: {},
      replyName: "",
      commentPage: 1,
      commentList: [],
      last_page: 1,
      commenMember: [],
      commentListMore: [],
      keyInd: 0,
      comment_id: 0,
      comment: false,
      commentNum:0
    };
  },
  beforeRouteLeave(to, from, next) {

    zhuge.endTrack('文章详情页停留时长',{
      '文章名称':this.title,
      '文章id':this.id,
      '发布人':this.dataInfo.author,     
      '发布人id':'',    
      '发布时间':this.dataInfo.created_at,
      '所属板块':this.dataInfo.belongs_to_category.name
    });

    // 注意：从商品详情页跳转到商品详情页不触发，to、from不变
    if (self.showImg) {
      self.showImg = false;
      next(false);
    } else {
      next();
    }
  },
  activated() {
    self = this;
    this.id = this.$route.params.id;
    this.codeUrl = "";
    this.menuLists = [];
    this.imgList = [];
    this.showImg = false;
    this.imgStart = 0;
    //获取数据
    this.getData();
    this.getQrCode();
  },
  mounted() {
    this.dataInfo = {};
    this.title = "";
  },

  methods: {
    getQrCode() {
      $http.get("member.member.getArticleQr", {}, "").then(
        response => {
          if (response.result === 1) {
            this.codeUrl = response.data;
          } else {
            this.codeUrl = false;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    subStringMulti(text, begin, end){
         let regex;
         if (end == '\\n')
             regex = new RegExp(begin + '(.+)', "g");
         else
             regex = new RegExp(begin + '([\\s\\S]+?)' + end, "g");
         try {
             let result;
             let blocks = [];
             while ((result = regex.exec(text)) != null) {
                 blocks.push(result[1]);
             }
             return blocks;
             // return text.match(regex);
         } catch (err) {
             return null;
         }
     },
    //获取数据
    getData() {
      let that = this;
      let share_uid = this.fun.getKey("share_uid");
      share_uid = this.fun.isTextEmpty(share_uid) ? "" : share_uid;
      let json = { article_id: this.id, share_uid: share_uid };

      $http.get("plugin.article.api.article.get-article", json, "").then(
        function(response) {
          if (response.result == 1) {

            zhuge.startTrack('文章详情页停留时长',{
              '文章名称':response.data.title,
              '文章id':response.data.id,
              '发布人':response.data.author, 
              '发布人id':'',    
              '发布时间':response.data.created_at,
              '所属板块':response.data.belongs_to_category.name
            });

            zhuge.track('进入文章详情页',{
              '文章名称':response.data.title,
              '文章id':response.data.id,
              '发布人':response.data.author, 
              '发布人id':'',    
              '发布时间':response.data.created_at,
              '所属标签':response.data.belongs_to_category.name
            });

            that.title = response.data.title;
            if(response.data.comment){
              that.comment = response.data.comment;
              that.getComment();
            }
            that.dataInfo = response.data;
            
            //把接口返回的内容字符串里面的iframe标签包含音频视频的替换成video标签，包含图片的替换成img
            let contentBeforeStr =response.data.content;
            //console.log('content:'+contentBeforeStr);

            if(contentBeforeStr.indexOf('</iframe>') != -1){//存在iframe标签
              let  contentBefore =that.subStringMulti(contentBeforeStr,'<iframe','</iframe>');
              //console.log('符合的字符串：'+contentBefore);

              let  arr=[];
              
              for(let i=0;i<contentBefore.length;i++){
                //console.log('截取出来的字符串：'+contentBefore[i]);
                if(contentBefore[i].indexOf('.jpg') != -1  || contentBefore[i].indexOf('.png') != -1){//存在图片
                  arr[i] = '<img '+contentBefore[i]+'';
                }else if(contentBefore[i].indexOf('.mp3') != -1 || contentBefore[i].indexOf('.wav') != -1 ){
                  //console.log('有音频');
                  arr[i] = "<audio   controls  controlsList='nodownload'    style='width:100%;height:50px;max-height:50px;margin-top:5px;margin-bottom:5px;' "+contentBefore[i]+"</audio>";
                }  
                 //console.log('替换字符串：'+arr[i]);                       
              }

                //把对应的部分  替换掉
                for(let j=0;j<contentBefore.length;j++){
                  //console.log(arr[j]);
                  //console.log(contentBeforeStr.indexOf('<iframe'+contentBefore[j]+'</iframe>'));
                  if(that.content==''){
                    that.content =  contentBeforeStr.replace('<iframe'+contentBefore[j]+'</iframe>',arr[j]);
                  }else{
                    that.content =  that.content.replace('<iframe'+contentBefore[j]+'</iframe>',arr[j]);
                  }
                  //console.log(that.content);
                }
            }else{
              that.content = contentBeforeStr;
              //console.log(that.content);
            }
            if(that.content.indexOf('</video>') != -1){//包含MP4，视频是video标签直接包裹的，不是iframe
              //console.log(that.content);
              let  contentBeforemmm =that.subStringMulti(that.content,'<video','</video>');
              //console.log(contentBeforemmm.length);
              that.content=that.content.replace("<video","<video  controlsList='nodownload'   preload='metadata' style='border:1px solid #eee;' poster='https://iyeecare.oss-cn-beijing.aliyuncs.com/images/2/2022/03/60cec0ce782f1a24f64454901bc201fe.jpg'  ");
            }  

            that.is_advs_type = response.data.advs_type == 0 ? false : true;
            that.is_report_enabled = response.data.report_enabled == 0 ? false : true;

            that.is_no_copy_url = response.data.no_copy_url == 1 ? true : false; //禁止复制链接
            that.is_no_share = response.data.no_share == 1 ? true : false; //禁止分享至朋友圈
            that.is_no_share_to_friend = response.data.no_share_to_friend == 1 ? true : false; //禁止分享给好友

            that.is_liked = response.data.liked == 0 ? false : true;
            that.is_link = !that.fun.isTextEmpty(response.data.link);
            that.like_num = response.data.like_num + response.data.virtual_like_num;
            that.read_num = response.data.read_num + response.data.virtual_read_num;
            // that.initShare();
            if (that.is_no_copy_url) {
              that.menuLists.push("menuItem:copyUrl");
            }
            if (that.is_no_share) {
              that.menuLists.push("menuItem:share:timeline");
            }
            if (that.is_no_share_to_friend) {
              that.menuLists.push("menuItem:share:appMessage");
            }
            that.fun.wxShare(
              "",
              { mid: that.fun.getKeyByMid() },
              {
                title: that.fun.isTextEmpty(that.dataInfo.title) ? "" : that.dataInfo.title,
                imgUrl: that.fun.isTextEmpty(that.dataInfo.thumb) ? "" : that.dataInfo.thumb,
                description: that.fun.isTextEmpty(that.dataInfo.desc) ? "" : that.dataInfo.desc,
                hideMenu: that.menuLists
              }
            );
            that.fun.setWXTitle(that.dataInfo.title || "详情");
            that.imgList = that.getImgSrc(response.data.content);
          } else {
            if (response.msg == "您尚未购买该文章内容,无法观看") {
              that.$dialog.alert({ message: response.msg });
              that.$router.replace(that.fun.getUrl("payList", { id: that.id }));
            } else {
              that.$dialog
                .alert({ message: response.msg })
                .then(() => {
                  that.$router.push(that.fun.getUrl("notice"));
                })
                .catch(() => {});
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    handleHtml($event) {
      console.log($event);
      let that = this;
      if ($event.target) {
        if ($event.target.nodeName == "IMG" && $event.target.parentElement.nodeName !== "A") {
          for (let i = 0; i < that.imgList.length; i++) {
            // 编程式
            if ($event.target.currentSrc.indexOf(that.imgList[i]) > -1) {
              that.imgStart = i;
              that.showImg = true;
              return;
            }
          }
        }
      }
    },
    getImgSrc(richtext) {
      let imgList = [];
      richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
        imgList.push(capture);
      });
      return imgList;
    },
    //查看营销
    toAdvs() {
      if (!this.fun.isTextEmpty(this.dataInfo) && this.fun.isTextEmpty(this.dataInfo.advs_link)) {
        return;
      }
      window.location.href = this.fun.funHrefFilters(this.dataInfo.advs_link);
    },

    //点赞
    like(like_num) {
      zhuge.track('文章详情页点击点赞',{
        '文章名称':this.title,
        '文章id':this.id,
        '发布人':this.dataInfo.author,     
        '发布人id':'',    
        '发布时间':this.dataInfo.created_at,
        '所属板块':this.dataInfo.belongs_to_category.name   
      });
      let that = this;
      let json = { article_id: this.id };

      $http.get("plugin.article.api.article.like", json, "").then(
        function(response) {
          if (response.result === 1) {
            if (response.data.liked == 1) {
              that.is_liked = true;
              that.like_num = like_num + 1;
              Toast("点赞成功");
            } else {
              that.is_liked = false;
              that.like_num = like_num - 1;
              if (that.like_num < 0) {
                that.like_num = 0;
              }
              Toast("取消点赞");
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //举报
    report() {
      this.$router.push(this.fun.getUrl("noticeReport", { id: this.id }));
    },

    //阅读原文
    link() {
      window.location.href = this.fun.funHrefFilters(this.dataInfo.link);
    },

    //初始化分享设置
    initShare() {
      let that = this;
      let _url = document.location.href;
      let json = { url: _url, mid: this.fun.getKeyByMid() };
      $http.post("member.member.wxJsSdkConfig", json).then(
        function(response) {
          if (response.result === 1) {
            if (response.data.config) {
              that.share(response.data);
            }
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    //组装分享设置
    share(data) {
      let that = this;

      if (that.is_no_copy_url) {
        that.menuLists.push("menuItem:copyUrl");
      }
      if (that.is_no_share) {
        that.menuLists.push("menuItem:share:timeline");
      }
      if (that.is_no_share_to_friend) {
        that.menuLists.push("menuItem:share:appMessage");
      }

      wx.config(data.config);
      wx.ready(function() {
        let _title = that.fun.isTextEmpty(that.dataInfo.title) ? "文章" : that.dataInfo.title;
        let _link = document.location.href;
        _link = that.fun.isMid(_link, data.info.uid);

        let _imgUrl = that.fun.isTextEmpty(that.dataInfo.thumb) ? "" : that.dataInfo.thumb;
        let _desc = that.fun.isTextEmpty(that.dataInfo.desc) ? "简介" : that.dataInfo.desc;
        wx.showOptionMenu();

        wx.hideMenuItems({
          menuList: that.menuLists
        });

        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            Toast("分享成功");
          },
          cancel: function() {
            Toast("取消分享");
          }
        });
      });
    },
    //  -----------------------  文章评论 ---------------
    getComment() {
      $http
        .post(
          "plugin.article.api.comment.comment-list",
          {
            page: this.commentPage,
            article_id: this.id
          },
          ""
        )
        .then(response => {
          if (response.result == 1) {
            this.commentList = response.data.list.data;
            for (let i = 0; i < this.commentList.length; i++) {
              if (this.commentList[i].reply_num > 0) {
                this.$set(this.commentList[i], "commentShow", true);
              } else {
                this.$set(this.commentList[i], "commentShow", false);
              }
              this.$set(this.commentList[i], "commenMorePage", "1");
            }
            this.last_page = response.data.list.last_page;
            this.commenMember = response.data.member;
            this.commentNum = response.data.num;
          } else {
            Toast(response.msg);
          }
        });
    },
    watchImg(item){
      this.imgList = item;
      this.showImg = true;
    },
    getMore() {
      this.commentPage = this.commentPage + 1;
      $http
        .post(
          "plugin.article.api.comment.comment-list",
          {
            page: this.commentPage,
            article_id: this.id
          },
          ""
        )
        .then(response => {
          if (response.result == 1) {
            let dataMore = response.data.list.data;
            this.commentList = this.commentList.concat(dataMore);
            for (let i = 0; i < this.commentList.length; i++) {
              if (this.commentList[i].reply_num > 0) {
                this.$set(this.commentList[i], "commentShow", true);
              } else {
                this.$set(this.commentList[i], "commentShow", false);
              }
              this.$set(this.commentList[i], "commenMorePage", 1);
            }
            console.log(this.commentList);
            this.last_page = response.data.list.last_page;
          } else {
            Toast(response.msg);
          }
        });
    },
    // 加载子评论
    moreCommentLis(id, ind) {
      let url = "plugin.article.api.comment.get-replys";
      // 当前主评论的加载页数 is_page
      let is_page = Number(this.commentList[ind].commenMorePage);
      let dataJson = {
        page: is_page,
        comment_id: id
      };
      $http.post(url, dataJson, "").then(response => {
        if (response.result == 1) {
          let child = response.data.data;
          if (is_page >= 1 && this.commentList[ind].child) {
            child = this.commentList[ind].child.concat(child);
          }
          this.$set(this.commentList[ind], "child", child);
          let mun = this.commentList[ind].reply_num - response.data.data.length;
          this.$set(this.commentList[ind], "reply_num", mun);
          let moreLast_page = response.data.last_page;
          if (is_page >= moreLast_page) {
            is_page = 1;
          } else {
            is_page = is_page + 1;
          }
          this.$set(this.commentList[ind], "commenMorePage", is_page);
        } else {
          Toast(response.msg);
        }
      });
    },
    // 发送
    subMainBtn(e) {
      if (e) {
        //console.log("1111111111111111111", e);
        this.showCommentInput = false;
        this.getReplyComments(e);
      }
    },
    // 发送请求
    getReplyComments(e) {
      let that = this;
      let url;
      let dataJson = {
        images: JSON.stringify(e.imgs),
        content: e.text
      };

      let c_num = dataJson.content.length;
      //console.log("e.options.type", e.options.type);
      // main 是创建评论  reply 是回复评论
      if (e.options.type == "reply") {

      this.commentList.forEach((item)=>{
          if(item.id === this.replyId){
            let replay_uid = item.uid;
            let replay_name = item.nick_name;
            let replay_time = item.created_at;
            zhuge.track('文章详情页点击发送评论',{
              '文章名称':this.title,
              '文章id':this.id,
              '发布人':this.dataInfo.author,
              '发布人id':'',     
              '发布时间':this.dataInfo.created_at,
              '所属板块':this.dataInfo.belongs_to_category.name,
              '评论字数':c_num,
              '评论类型':'回复评论',
              '回复评论人':replay_name,  
              '回复评论人id':replay_uid,
              '回复评论时间':replay_time             
            });
          }
      })        

        url = "plugin.article.api.comment.reply-comment";
        dataJson.comment_id = that.replyId;
      } else if (e.options.type == "main") {

        zhuge.track('文章详情页点击发送评论',{
          '文章名称':this.title,
          '文章id':this.id,
          '发布人':this.dataInfo.author,
          '发布人id':'',
          '发布时间':this.dataInfo.created_at,
          '所属板块':this.dataInfo.belongs_to_category.name,
          '评论字数':c_num,
          '评论类型':'文章评论'
        }); 

        url = "plugin.article.api.comment.create-comment";
        dataJson.article_id = that.id;
      }
      $http.post(url, dataJson,'').then(response => {
        if (response.result == 1) {
          if (e.options.type == "main") {
            that.commentPage = 1;
            that.getComment();
          } else {
            that.updateInfo("getReply", response.data, that.keyInd);
          }
          Toast(response.msg);
          console.log(response.data);
        } else {
          Toast(response.msg);
        }
      });
    },
    // 回复后更新数据
    updateInfo(key, data, ind) {
      let arr = [];
      arr.push(data);
      if (this.commentList[ind].child) {
        this.commentList[ind].child.unshift(arr[0]);
      } else {
        this.$set(this.commentList[ind], "child", arr);
      }
    },
    subMainCommentBtn() {
      zhuge.track('文章详情页点击评论框',{
        '文章名称':this.title,
        '文章id':this.id,
        '发布人':this.dataInfo.author,     
        '发布人id':'',
        '发布时间':this.dataInfo.created_at,
        '所属板块':this.dataInfo.belongs_to_category.name   
      });
      this.showCommentInput = true;
      this.commentInputOptions = {
        type: "main"
      };
    },
    replyBtn(name, item, ind) {
      this.keyInd = ind;
      this.replyId = "";
      // 回复别人的评论
      this.replyId = item.id;
      this.comment_id = item.comment_id == 0 ? item.comment_id : item.id;
      this.replyName = name;
      this.showCommentInput = true;
      this.commentInputOptions = {
        type: "reply",
        placeholder: "请输入你的回复吧"
      };
      this.commentManagement = false;
      zhuge.track('文章详情页点击回复评论',{
        '文章名称':this.title,
        '文章id':this.id,
        '发布人':this.dataInfo.author,
        '发布人id':'',
        '发布时间':this.dataInfo.created_at,
        '回复评论人':this.replyName,  
        '回复评论人id':item.uid,
        '所属板块':this.dataInfo.belongs_to_category.name
      });
    },
    delComment(item, ind, index, key) {
      let id;
      let myUid = window.localStorage.uid;
      id = item.id;
      if (key == "child") {
        console.log(item, "子组件");
        if(item.uid == myUid){
          console.log('可以删除 子评论');
          this.delRequst(id,ind,index,key);
        }
      } else {
        if (item.uid == myUid) {
          console.log('可以删除 主评论');
          this.delRequst(id,ind,index,key);
        }
      }
      
    },
    delRequst(id,ind,index,key) {
      this.$dialog
        .confirm({ message: "是否删除评论?" })
        .then(() => {
          $http
            .post("plugin.article.api.comment.del", {
              comment_id: id
            },'')
            .then(response => {
              if (response.result == 1) {
                if (key == 'child') {
                  this.commentList[ind].child.splice(index, 1);
                  this.$set(this.commentList[ind], "child", this.commentList[ind].child);
                } else {
                  this.commentList.splice(ind, 1);
                }
                Toast(response.data);
              } else {
                Toast(response.msg);
              }
            });
        })
        .catch(() => {});
    }
  },
  components: { cTitle, yzCommentInput }
};
