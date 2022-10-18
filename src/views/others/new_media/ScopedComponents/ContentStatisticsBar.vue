<template>
  <div>
    <d-fixed-container :bottom="bottom" :left="left" :right="right" :placeholder="placeholder" :height="height" :width="width" :fixed="fixed" rootEl="#ADDetails">
      <ul class="content-statistics" :class="{ 'content-statistics_column': direction == 'column' }">
        <li class="content-statistics-item">
          <i class="iconfont icon-massage_order"></i>
          <div class="content-statistics_count ellipsis1">{{ data.read_count }}</div>
        </li>
        <li class="content-statistics-item" :class="{ 'content-statistics-item_active': data.is_like }" @click="likeContent">
          <i class="iconfont icon-fontclass-dianzan"></i>
          <div class="content-statistics_count ellipsis1">{{ data.like_count }}</div>
        </li>
        <li class="content-statistics-item" :class="{ 'content-statistics-item_active': data.is_favorites }" @click="faviorteContent">
          <i class="iconfont icon-fontclass-pingfen"></i>
          <div class="content-statistics_count ellipsis1">{{ data.favorites_count }}</div>
        </li>
        <li class="content-statistics-item" :class="{ 'content-statistics-item_active': showCommentPopup }" @click="displayCommentPopup">
          <i class="iconfont icon-fontclass-pinglun1"></i>
          <div class="content-statistics_count ellipsis1">{{ data.comment_count }}</div>
        </li>
        <li class="content-statistics-item" :class="{ 'content-statistics-item_active': showShare }" @click="shareContent">
          <i class="iconfont icon-share"></i>
          <div class="content-statistics_count ellipsis1">{{ data.share_count }}</div>
        </li>
      </ul>
    </d-fixed-container>
    <van-popup v-model="showAwardPopup" class="award-popup" position="center">
      <div class="award-popup-content">
        <h1>恭喜获得{{ actionName }}奖励</h1>
        <div class="award-content">
          <span>{{ awardCount }}</span>
          {{ awardName }}
        </div>
        <golden-button class="award-confirm" @click="showAwardPopup = false">确认</golden-button>
      </div>
      <img class="award-popup-decoration" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/award_popup_bg1.png" />
    </van-popup>
    <comment-group
      v-model="showCommentPopup"
      v-on:onMore="getComments"
      :loading="commentPagination.loading"
      :finished="commentPagination.finished"
      :length="String(comments.length)"
      v-on:sendComment="sendComment"
      v-on:delComment="delComment"
    >
      <comment-cell
        v-for="(item, index) in comments"
        :key="item.id"
        :index="index"
        :reply_num="item.has_many_comment.length"
        :avatar="item.avatar"
        :nickname="item.nickname"
        :time="item.created_at"
        :content="item.comment"
        :isAuthority="item.is_current_member == 1 ? true : false"
        v-on:getRely="getComments"
      >
        <comment-cell-item
          v-for="(itemChild, itemIndex) in item.has_many_comment"
          :key="itemChild.id"
          :childIndex="itemIndex"
          :index="index"
          :avatar="itemChild.avatar"
          :nickname="itemChild.nickname"
          :time="itemChild.created_at"
          :content="itemChild.comment"
          :isAuthority="itemChild.is_current_member == 1 ? true : false"
          :Responder="itemChild.subordinate_name"
        >
          <template v-slot:cell-item-other>
            <!--二级评论右侧插槽 do some code -->
            <!-- domo 例如添加 点赞、打赏、踩-->
            <div class="comment-like">
              <img
                :src="
                  itemChild.is_like
                    ? 'https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/micro_communities/home_praise_cur@2x.png'
                    : 'https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/micro_communities/home_praise@2x.png'
                "
                @click.stop="likeComment(itemChild)"
              />
              <div>{{ itemChild.like_count }}</div>
            </div>
          </template>
        </comment-cell-item>
        <template v-slot:cell-other>
          <!--一级评论右侧插槽 do some code -->
          <!-- domo 例如添加 点赞、打赏、踩-->
          <div class="comment-like">
            <img
              :src="
                item.is_like
                  ? 'https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/micro_communities/home_praise_cur@2x.png'
                  : 'https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/micro_communities/home_praise@2x.png'
              "
              @click.stop="likeComment(item)"
            />
            <div>{{ item.like_count }}</div>
          </div>
        </template>
      </comment-cell>
    </comment-group>
    <share v-model="showShare" />
  </div>
</template>

<script>
import DFixedContainer from "../../../../components/other/common/DFixedContainer";
import GoldenButton from "./GoldenButton";
import commentGroup from "@/components/ui_components/yz_comment_popup/commentGroup"; //评论父组件
import commentCell from "@/components/ui_components/yz_comment_popup/commentCell"; //一级评论组件
import commentCellItem from "@/components/ui_components/yz_comment_popup/commentCellItem"; //二级评论组件
import share from "@/components/ui_components/yz_wechatShareImg";
export default {
  props: {
    data: {
      type: Object
    },
    direction: {
      type: String,
      default: "row"
    },
    height: {
      type: String,
      default: "3.32rem"
    },
    width: {
      type: String,
      default: "100%"
    },
    bottom: {
      type: String,
      default: "0px"
    },
    left: {
      type: String,
      default: "0px"
    },
    right: {
      type: String,
      default: "0px"
    },
    placeholder: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: true
    },
    reload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      memberId: null,
      showAwardPopup: false,
      awardName: "",
      awardCount: 0,
      showCommentPopup: false,
      comments: [],
      actionName: "",
      commentPagination: {
        pages: 1,
        loading: false,
        finished: false
      },
      showShare: false
    };
  },
  mounted() {
    let shareUrl = location.href.replace(/mid=\d+/, "mid=" + window.localStorage.uid);
    if (!/from_share|share_tag/g.test(shareUrl)) {
      shareUrl += "&from_share=1";
    }

    this.fun.wxShare(
      shareUrl,
      {},
      {
        title: this.data.title,
        imgUrl: this.data.cover_picture,
        link: shareUrl
      }
    );
    this.memebrId = Number(this.$route.query.mid);
    if (this.$route.query.from_share || this.$route.query.share_tag) {
      this.checkShareAward();
    }
    if (this.data.behavioral.is_reward) {
      this.actionName = "阅读";
      this.awardName = this.data.behavioral.rewardName;
      this.awardCount = this.data.behavioral.rewardValue;
      this.showAwardPopup = true;
    }
  },
  methods: {
    likeContent() {
      $http
        .post("plugin.new-media-advertising.frontend.media-advertisingt.like", {
          advertisingt_id: this.data.id
        })
        .then(({ result, msg, data: { is_reward, rewardName, rewardValue } }) => {
          if (result === 0) {
            this.$toast(msg);
            return;
          }
          if (this.data.is_like) {
            // eslint-disable-next-line vue/no-mutating-props
            this.data.like_count--;
          } else {
            // eslint-disable-next-line vue/no-mutating-props
            this.data.like_count++;
          }
          // eslint-disable-next-line vue/no-mutating-props
          this.data.is_like = !this.data.is_like;
          if (is_reward == 1) {
            this.actionName = "点赞";
            this.awardName = rewardName;
            this.awardCount = rewardValue;
            this.showAwardPopup = true;
          }
        });
    },
    faviorteContent() {
      $http
        .post("plugin.new-media-advertising.frontend.media-advertisingt.favorites", {
          advertisingt_id: this.data.id
        })
        .then(({ result, msg, data: { is_reward, rewardName, rewardValue } }) => {
          if (result === 0) {
            this.$toast(msg);
            return;
          }
          if (this.data.is_favorites) {
            // eslint-disable-next-line vue/no-mutating-props
            this.data.favorites_count--;
          } else {
            // eslint-disable-next-line vue/no-mutating-props
            this.data.favorites_count++;
          }
          // eslint-disable-next-line vue/no-mutating-props
          this.data.is_favorites = !this.data.is_favorites;
          if (is_reward == 1) {
            this.actionName = "收藏";
            this.awardName = rewardName;
            this.awardCount = rewardValue;
            this.showAwardPopup = true;
          }
        });
    },
    displayCommentPopup() {
      this.showCommentPopup = true;
      if (this.comments.length == 0) {
        this.getComments();
      }
    },
    getComments() {
      let getLoading = this.$toast.loading({
        duration: 0
      });
      $http
        .get("plugin.new-media-advertising.frontend.comment.get-comment-list", {
          advertisingt_id: this.data.id,
          page: this.commentPagination.pages
        })
        .then(({ data: { data, last_page, current_page } }) => {
          getLoading.clear();
          this.commentPagination.loading = false;
          this.commentPagination.pages++;
          if (last_page == current_page) {
            this.commentPagination.finished = true;
          }
          for (const comment of data) {
            for (const childItem of comment.has_many_comment) {
              if (!childItem.like_count) {
                childItem.like_count = 0;
              }
            }
          }
          this.comments.push(...data);
        })
        .catch(() => {
          getLoading.clear();
        });
    },
    sendComment({ text, imgs, options }) {
      let submitData = {
        advertisingt_id: this.data.id,
        comment: text
      };
      if (options.type === "reply" || options.type == "childReply") {
        let firstComment = this.comments[options.index];
        submitData["parent_id"] = firstComment["id"];
        if (options.type == "childReply") {
          let secondComment = firstComment["has_many_comment"][options.childIndex];
          submitData["subordinate_id"] = secondComment.id;
        }
      }
      $http.post("plugin.new-media-advertising.frontend.comment.comment", submitData).then(res => {
        if (res.result === 0) {
          this.$toast(res.msg);
          return;
        }
        if (res.data.is_reward) {
          this.actionName = "评论";
          this.awardName = res.data.rewardName;
          this.awardCount = res.data.rewardValue;
          this.showAwardPopup = true;
        }
        // eslint-disable-next-line vue/no-mutating-props
        this.data.comment_count++;
        this.reGetComments();
      });
    },
    delComment({ index, childIndex, type }) {
      let commentId = null;
      if (type === "reply" || type == "childReply") {
        let firstComment = this.comments[index];
        commentId = firstComment["id"];
        if (type == "childReply") {
          let secondComment = firstComment["has_many_comment"][childIndex];
          commentId = secondComment.id;
        }
      }
      let deleteLoading = this.$toast.loading({
        duration: 0
      });
      $http
        .post("plugin.new-media-advertising.frontend.comment.delete-comment", {
          comment_id: commentId
        })
        .then(res => {
          deleteLoading.clear();
          if (res.result == 0) {
            this.$toast(res.msg);
            return;
          }
          // eslint-disable-next-line vue/no-mutating-props
          this.data.comment_count--;
          this.$toast("删除成功");
          this.reGetComments();
        })
        .catch(() => {
          deleteLoading.clear();
        });
    },
    likeComment(comment) {
      let loading = this.$toast.loading({
        duration: 0
      });
      $http
        .post("plugin.new-media-advertising.frontend.comment.comment-like", {
          comment_id: comment.id,
          advertisingt_id: this.data.id
        })
        .then(res => {
          loading.clear();
          if (res.result == 0) {
            this.$toast(res.msg);
            return;
          }
          comment.is_like = 1;
          comment.like_count++;
          this.$toast("点赞成功");
        });
    },
    reGetComments() {
      this.commentPagination.pages = 1;
      this.commentPagination.loading = false;
      this.commentPagination.finished = false;
      this.comments = [];
      // this.getComments();
    },
    shareContent() {
      let shareLoading = this.$toast.loading({
        duration: 0
      });
      $http
        .get("plugin.new-media-advertising.frontend.media-advertisingt.forward", {
          advertisingt_id: this.data.id
        })
        .then(res => {
          shareLoading.clear();
          this.showShare = true;
        })
        .catch(() => {
          shareLoading.clear();
        });
    },
    checkShareAward() {
      $http
        .get("plugin.new-media-advertising.frontend.media-advertisingt.forward-reward", {
          advertisingt_id: this.data.id,
          mid: this.memebrId
        })
        .then(({ result, msg, data: { is_reward, rewardName, rewardValue } }) => {
          if (result === 0) {
            this.$toast(msg);
            return;
          }
          // if (is_reward == 1) {
          //   this.actionName = "分享";
          //   this.awardName = rewardName;
          //   this.awardCount = rewardValue;
          //   this.showAwardPopup = true;
          // }
        });
    }
  },
  watch: {
    reload(newV) {
      if (newV) {
        this.commentPagination.pages = 1;
        this.commentPagination.loading = false;
        this.commentPagination.finished = false;
        this.comments = [];
      }
    }
  },
  components: {
    DFixedContainer,
    GoldenButton,
    commentGroup,
    commentCell,
    commentCellItem,
    share
  }
};
</script>
<style>
#ADDetails .yz_commentInput-main .operate-boxs,
#ADVideo .yz_commentInput-main .operate-boxs {
  display: none;
}

#ADDetails .components-comment-list-main .components-comment-list .components-comment-main-right .master-main-content,
#ADVideo .components-comment-list-main .components-comment-list .components-comment-main-right .master-main-content {
  color: #333;
}
</style>
<style scoped>
.content-statistics {
  display: grid;
  grid-template-columns: repeat(5, calc(100% / 5));
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: 3.32rem;
  font-size: 0.63rem;
  color: #4f4f4f;
  box-shadow: 0 -0.22rem 0.75rem 0 rgba(217, 217, 217, 0.46);
  background-color: white;
}

.content-statistics_column {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  box-shadow: none;
  color: white;
  font-size: 0.75rem;
  line-height: 0.75rem;
}

.content-statistics_column .content-statistics-item:not(:last-child) {
  margin-bottom: 1.38rem;
}

.content-statistics_column i.iconfont {
  margin-bottom: 0.56rem;
  font-size: 1.13rem;
  line-height: 1.13rem;
}

.content-statistics-item_active i.iconfont {
  color: #f4a00e;
}

.content-statistics_count {
  margin-top: 0.33rem;
}

/* 奖励 */
.award-popup {
  width: 84%;
  height: 80%;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/new_media/award_popup_bg2.png");
  background-color: transparent;
  background-size: contain;
  background-position: top center;
  background-repeat: no-repeat;
}

.award-popup-content {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  padding: 0.94rem;
  width: 12.5rem;
  height: 14.06rem;
  color: white;
  font-size: 1.06rem;
  background-image: linear-gradient(0deg, #eb160a 0%, #f96822 100%);
  border-radius: 0.64rem;
  box-sizing: border-box;
}

.award-popup-decoration {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 92%;
}

.award-popup h1 {
  margin-top: 2.48rem;
  line-height: 1.06rem;
}

.award-content {
  margin-top: 2.26rem;
  line-height: 1.06rem;
}

.award-content span {
  font-weight: bold;
  font-size: 1.88rem;
}

.award-confirm {
  margin: 2.32rem auto 0;
}

.comment-like {
  text-align: center;
  font-size: 0.75rem;
}

.comment-like img {
  width: 0.9375rem;
}
</style>
