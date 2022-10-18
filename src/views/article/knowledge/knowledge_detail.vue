<template>
  <div class="knowledge_detail">
    <c-title :hide="false" :text="article_name || '知识库详情'">
      <router-link :to="fun.getUrl('knowledgeIndex')" slot="left">
        <span style="margin-left: .8rem;">主页</span>
      </router-link>
      <slot name="edit" slot="edit"><span @click="showtime(!show)">{{show?"收拢目录":"展开目录"}} </span></slot>
    </c-title>
    <div id="a_content" v-if="article" v-html="article" @click="handleHtml($event)"></div>
    <div style="margin: 0 auto;" v-if="!article">
      <van-empty description="暂无内容" />
    </div>
    <div class="score">
      <van-icon size="1.4rem" name="good-job-o" :color="articleData.is_love?'#3a75f4':''" @click="clicklove"/>
      <p class="love_count">{{love_count}}人点赞</p>
      <div class="img">
        <div v-for="(item,i) in love_member" :key="i">
          <van-image v-if="i<14" :src="item" width="1.6rem" height="1.6rem"></van-image>
        </div>
        <div v-if="love_member&&love_member.length>=14">...</div>
      </div>
    </div>
    <div class="page-up-down" v-show="article_list&&article_list.length>0">
      <div class="page-operation" :class="{'page-up':isStart}" @click="operationPage('upPage')">上一章</div>
      <div class="page-operation" :class="{'page-down':isEnd}" @click="operationPage('nextPage')">下一章</div>
    </div>
    <div class="foort" @click="showtime(true)">
      <div class="img">
        <van-image :src="base.image_url" width="5.7rem" height="3.4rem"></van-image>
      </div>
      <div class="comten">
        <div class="base_name van-ellipsis">{{base.name}}</div>
        <div class="ptag">{{base.desc}}</div>
      </div>
    </div>
    <div style="height: 1rem;"></div>
    <template v-if="isActivated">
      <van-popup v-model="show" position="left" style="height: 100%; width: 75%;">
        <div class="popup" @click="show=false">
          <van-icon style="margin-right: 10px;" name="arrow-left"/>
          <span>{{base.name}}</span>
        </div>
        <collapse :base_id="this.$route.query.base_id" :list="article_list"></collapse>
      </van-popup>
    </template>
    <!-- 图片放大start -->
    <van-image-preview v-model="showBigImg" :images="bigImages" :start-position="imgStart"></van-image-preview>
    <!-- 图片放大 end -->
  </div>
</template>

<script>
import {  Toast, Image as VanImage } from "vant";
export default {
  components: {
    collapse: () => import("./components"),
    VanImage
  },
  data() {
    return {
      showBigImg: false,
      bigImages: [],
      imgStart: 0,
      show: false,
      articleData: {},
      article: "",
      article_name: "",
      article_list: [],
      love_count: 0,//点赞人数
      love_member: [],//点赞人头像
      base: {},//知识库信息
      isStart:true,
      isEnd:true,
      isActivated:false
    };
  },
  activated() {
    this.bigImages = [];
    this.showBigImg = false;
    this.imgStart = 0;
    this.getarticle_list();
    this.getdata();
    this.isActivated = true;
  },
  deactivated(){
    this.show = false;
    this.isActivated = false;
  },
  methods: {
    getIsStart(list){
      this.isStart = list[0]&&this.$route.params.articleId == list[0].id;
      this.isEnd = this.getIsEnd(list,this.$route.params.articleId);
    },
    getIsEnd(list,id){
      if(list && list[list.length-1]){
        let child = list[list.length-1].child;
        if(child&&child.length>0){
          return this.getIsEnd(child,id);
        }
        return list[list.length-1].id == id;
      }
      return true
    },
    toDetail(articleId){
      let base_id = this.$route.query.base_id;
      this.$router.push(this.fun.getUrl("knowledgeDetail", { articleId:articleId }, {base_id: base_id}));
    },
    nextPage(list,articleId){
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.id == articleId) {
          if (item.child.length>=1) {
            this.toDetail(item.child[0].id);
            return false
          }else if(list[i+1]){
            this.toDetail(list[i+1].id);
            return false
          }
          return true;
        }
        if (this.nextPage(item.child,articleId)) {
          if (list[i+1]) {
            this.toDetail(list[i+1].id);
            return false;
          }else return true;
        };
      }
    },
    upPage(list,plist,pindex){
      let articleId = this.$route.params.articleId;
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.id == articleId) {
          let id = i<=0?plist[pindex].id:list[i-1].id;
          this.toDetail(id);
          return false;
        }
        this.upPage(item.child,list,i)
      }
    },
   operationPage(type){
      if (this.article_list&&this.article_list.length>0) {
        if(type=="upPage"){
          if(this.isStart)return this.$toast("文章已经到顶了");
          else this.upPage(this.article_list,this.article_list);
          return false;
        };
        if(type=="nextPage" && this.isEnd) return this.$toast("文章已经到底了");
        let articleId = this.$route.params.articleId;
        for (let i = 0; i < this.article_list.length; i++) {
           let item = this.article_list[i];
           if (item.id == articleId) {
            if (item.child.length>=1) {
              this.toDetail(item.child[0].id);
              return false
            }else if(this.article_list[i+1]){
              this.toDetail(this.article_list[i+1].id);
              return false
            }
            return true;
          }
          if(this.nextPage(item.child,articleId)){
             this.toDetail(this.article_list[i+1].id);
             return false;
          }
        }
      }
    },
    getdata() {
      let article_id = '';
      if(this.$route.params.articleId && this.$route.params.articleId == -1) {
        this.$router.replace(this.fun.getUrl("knowledgeList", {}, { base_id: this.fun.getKey('base_id') }));
        return;
      }

      article_id = this.$route.params.articleId;
      $http.get("plugin.message-base.frontend.article.articleDetail", {
        article_id,
        visit_source: 2
      },'loading').then(res => {
        this.articleData = res.data;
        if(res.data.article) {
          try {
            this.article = decodeURIComponent(res.data.article.article);
          }catch (e) {
            this.article = res.data.article.article;
          }
          this.article_name = res.data.article.article_name;
          this.fun.setWXTitle(this.article_name || '知识库详情');
        }
        this.bigImages = this.getImgSrc(this.article);
        this.love_count = res.data.love_count;
        this.love_member = res.data.love_member;
        this.base = res.data.base || {};
      });
    },
    getarticle_list(){
      let {knowledge} = this.$store.state;
      let base_id = this.$route.query.base_id;
      if (knowledge.baseArticle&&knowledge.base_id==base_id) {
        this.article_list = knowledge.baseArticle.data.article_list.filter(r => {
          return r.article_name != "";
        });
        this.getIsStart(this.article_list);
        return true;
      }
      this.showtime(false);
    },
    showtime(show) {
      if (this.article_list&&this.article_list.length>0) {
        this.show = show;
        return false;
      }
      let base_id =  this.$route.query.base_id;
      $http.get("plugin.message-base.frontend.article.baseArticle", {
        base_id
      }).then(res => {
        if (res.result == 1) {
          this.show = show;
          this.article_list = res.data.article_list.filter(r => {
            return r.article_name != "";
          });
          this.getIsStart(this.article_list);
          this.$store.commit("setBaseArticle", {res,base_id});
        } else {
          Toast.fail("请刷新试试");
        }
      });
    },
    clicklove() {
      $http.get("plugin.message-base.frontend.article.articleLove", {
        article_id: this.$route.params.articleId,
        is_love: this.articleData.is_love ? 0 : 1
      }, "loading").then(res => {
        if (res.result == 1) {
          this.articleData.is_love = !this.articleData.is_love;
          this.articleData.is_love ? this.love_count ++ : this.love_count --;
          this.getdata();
          Toast({
            message: res.msg,
            icon: this.articleData.is_love ? "like":"like-o"
          });
        }
      });
    },
    getImgSrc(richtext) {
      let imgList = [];
      richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
        imgList.push(capture);
      });
      return imgList;
    },
    handleHtml($event) {
      let that = this;
      if ($event.target) {
        if ($event.target.nodeName == "IMG" && $event.target.parentElement.nodeName !== "A") {
          for (let i = 0; i < that.bigImages.length; i++) {
            // 编程式
            if ($event.target.currentSrc.indexOf(that.bigImages[i]) > -1) {
              that.imgStart = i;
              that.showBigImg = true;
              return;
            }
          }
        }
      }
    },
  }
};
</script>

<style lang="scss" scoped>
  .knowledge_detail {
    text-align: left;
    padding: 0 0.8rem;

    #a_content {
      background-color: #fff;
      padding: 5px;
      border-radius: 5px;
      margin-top: 5px;
    }

    .popup {
      border-bottom: #eee 0.05rem solid;
      padding: 10px 16px;
      display: flex;
      align-items: center;
    }

    .score {
      margin-top: 10px;
      padding: 1rem 0;
      background-color: #fff;
      border-radius: 5px;
      text-align: center;

      .love_count {
        color: #404040;
        font-weight: normal;
        font-size: 12px;
      }

      .img {
        > div {
          display: inline-block;
          border-radius: 50%;
          overflow: hidden;
          margin: 0.6rem;
        }
      }
    }

    .foort {
      margin-top: 10px;
      border-radius: 5px;
      background-color: #fff;
      display: flex;
      padding: 0.6rem 0.8rem;

      .img {
        width: 5.7rem;
        height: 3.4rem;
        padding: 0.1rem;

        img {
          width: 100%;
        }
      }

      .comten {
        flex: 1;
        padding-left: 1rem;
        word-break: break-all;
        max-width: 73%;

        .base_name {
          color: #303030;
          font-weight: bold;
          line-height: 24px;
        }

        .ptag {
          color: #838383;
          line-height: 15px;
          font-size: 11px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          word-break: break-all;
          overflow: hidden;
        }
      }
    }

    .page-up-down{
      display: flex;margin-top: 10px;justify-content: space-around;
      .page-operation{ width: 10.5rem;height: 2.625rem;text-align: center;line-height: 2.625rem;color: #3aa98b;border: #3aa98b 1px solid;border-radius: .2rem;}
      .page-up{color: #ccc;border: #ccc 1px solid;}
      .page-down{color: #ccc;border: #ccc 1px solid;}
    }
  }
</style>
