<!-- 微社区关注列表页 -->
<template>
  <div id="micro_attention">
    <div class="nav-top set-pc-style">
      <router-link :to="fun.getUrl('microRelease', {})" tag="div" class="shooting"><img src="../../assets/images/micro_communities/focous_photo.png" alt="" /> 随拍</router-link>
      <span @click="loadTop">关注</span>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop">
      <ul class="list">
        <li v-for="(item, index) in info" :key="index" class="list-li">
          <div class="top-box">
            <div class="img">
              <img @click="gotoHome(item)" :src="item.has_one_stick_user.avatar" alt="" />
              <p>{{ item.has_one_stick_user.nickname }}</p>
            </div>
            <img src="../../assets/images/micro_communities/more_black.png" alt="" @click="showUnsubscribe(item.user_id)" style="padding: 0.625rem 0;" />
          </div>
          <p class="text-box" @click="gotoMicrocommentdetails(item)" style="-webkit-box-orient: vertical;">{{ item.title }}</p>
          <div class="banner">
            <van-swipe :autoplay="0" indicator-color="white" :loop="true" :show-indicators="false" @change="sidingsImg">
              <template>
                <van-swipe-item v-for="(imgs, i) in item.has_many_image" :key="i">
                  <div class="centerbanner">
                    <img :src="imgs.url" alt="" />
                  </div>
                </van-swipe-item>
              </template>
            </van-swipe>
            <div class="bannerindex">{{ bannerindex }} / {{ item.has_many_image | setLength }}</div>
          </div>
          <div class="Features-box">
            <div class="tiem-box">{{ item.created_at | timeSlice }}</div>
            <div class="Features-btn">
              <div class="btnIcon" @click="selectLike(item, item.is_praise, index)">
                <img v-if="item.is_praise == 0" src="../../assets/images/micro_communities/foucus_like.png" alt="" />
                <img v-if="item.is_praise == 1" src="../../assets/images/micro_communities/tab_focus_active.png" alt="" />
                赞
              </div>
              <div class="btnIcon" @click="subMainCommentBtn(item, index)"><img src="../../assets/images/micro_communities/focus_chat.png" alt="" />评论</div>
              <!-- <div class="btnIcon">
              <img src="../../assets/images/micro_communities/focus_share.png"
                   alt="">分享</div> -->
            </div>
          </div>
          <div class="comment-box">
            <p class="comment-num">{{ item.praise_num }}人赞过</p>
            <ul class="comment-list" v-if="item.comment">
              <li v-for="(com, index) in item.comment.slice(0, 3)" :key="index">
                <em style="font-weight: bold;">{{ com.uname }}</em
                >:{{ com.content }}
              </li>
            </ul>
            <span class="look-comment" v-if="item.comment && item.comment.length > 3" @click="gotoMicrocommentdetails(item)">查看全部{{ item.comment | setLength }}条评论</span>
            <span class="look-comment" v-if="item.comment && item.comment.length <= 0">暂无评论,留下您的精彩评论吧...</span>
            <div class="add-comment" @click="subMainCommentBtn(item, index)">
              <img src="../../assets/images/micro_communities/foucus_writechat.png" alt="" />
              添加评论...
            </div>
          </div>
        </li>
        <p v-if="isNOMore" style="text-align: center; color: #999; padding-top: 0.625rem;">没有更多啦~~</p>
      </ul>
      <img style="width: 5rem; margin-top: 3rem;" src="../../assets/images/blank.png" alt="" v-if="fun.isTextEmpty(info)" />
    </van-pull-refresh>
    <van-popup v-model="isUnsubscribe"><span id="unsubID" @click="UnsubscribeMethob">取消关注</span></van-popup>
    <van-popup v-model="mainCommentShow" position="bottom" :overlay="true">
      <div class="replyMainComment">
        <div class="left">
          <input type="text" v-model="maincomment" placeholder="请留下你的精彩评论吧" />
        </div>
        <div class="right" @click="subMainBtn">发送</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import micro_attention_controller from "./micro_attention_controller";
export default micro_attention_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#micro_attention {
  position: relative;
  padding: 3rem 0;

  .nav-top {
    position: fixed;
    width: 100%;
    // height: 3rem;
    line-height: 3rem;
    top: 0;
    left: 0;
    font-weight: bold;
    z-index: 999;
    background: #fff;
    border-bottom: 1px solid #ebebeb;

    .shooting {
      position: absolute;
      left: 1rem;
      font-size: 14px;
      color: #a7a7a7;

      img {
        width: 1.25rem;
        height: 1.125rem;
        vertical-align: sub;
      }
    }

    span {
      display: inline-block;
      height: 100%;
      border-bottom: 0.25rem solid #e35151;
      font-size: 1.125rem;
      color: #333;
      padding: 0 1rem;
    }
  }

  .list {
    text-align: left;

    .list-li {
      padding: 1.5rem 1.25rem 1rem;
      border-bottom: 0.0625rem solid #ebebeb;

      .top-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 2.375rem;
        height: 2.375rem;

        .img {
          display: flex;
          width: 85%;
          font-size: 15px;
          font-weight: bold;
          color: #333;

          img {
            width: 2.375rem;
            height: 2.375rem;
            border-radius: 100%;
            overflow: hidden;
            margin-right: 0.625rem;
          }

          p {
            flex: 1;
            text-align: left;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }
        }

        img {
          margin: 0;
          width: 1.25rem;
        }
      }

      .text-box {
        width: 100%;
        padding-top: 1.25rem;
        line-height: 1.5rem;
        font-size: 1rem;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .banner {
        margin-top: 0.625rem;
        background-color: #fff;
        position: relative;
        border-radius: 5px;
        overflow: hidden;

        .centerbanner {
          img {
            width: 100%;
          }
        }

        .bannerindex {
          text-align: center;
          width: 2.625rem;
          height: 1.375rem;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 0.6rem;
          line-height: 1.375rem;
          color: #fff;
          position: absolute;
          bottom: 0.63rem;
          right: 0.63rem;
          font-size: 12px;
        }
      }

      .Features-box {
        height: 1.25rem;
        line-height: 1.25rem;
        display: flex;
        justify-content: space-between;
        margin-top: 0.625rem;

        .tiem-box {
          color: #686868;
        }

        .Features-btn {
          flex: 1;
          display: flex;
          flex-direction: row-reverse;

          .btnIcon {
            display: flex;
            margin-left: 1rem;

            img {
              width: 1.25rem;
              height: 1.125rem;
              margin-right: 0.25rem;
            }
          }
        }
      }

      .comment-box {
        width: 100%;
        background-color: #f5f5f5;
        color: #333;
        margin-top: 0.625rem;
        padding: 0 0.625rem;

        .comment-num {
          // height: 2rem;
          line-height: 2rem;
          border-bottom: 1px solid #e6e6e6;
        }

        .comment-list {
          li {
            font-size: 14px;
            margin-top: 0.375rem;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }
        }

        .look-comment {
          display: inline-block;
          padding-top: 0.5rem;
        }

        .add-comment {
          display: flex;
          padding: 0.5rem 0;

          img {
            width: 1rem;
            height: 1rem;
            margin: 0 0.75rem 0 0;
          }
        }
      }
    }
  }

  #unsubID {
    display: inline-block;
    width: 18rem;
    // height: 3.25rem;
    line-height: 3.25rem;
    text-align: left;
    text-indent: 1rem;
    font-size: 16px;
  }

  .replyMainComment {
    display: flex;
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
    padding-left: 1rem;

    .left {
      width: 18.13rem;
      height: 1.88rem;
      background-color: #f5f5f5;
      border-radius: 0.94rem;

      input {
        border: none;
        height: 100%;
        width: 100%;
        padding-left: 1rem;
      }
    }

    .right {
      width: 3rem;
      height: 1.88rem;
      font-size: 0.94rem;
      line-height: 1.88rem;
      color: #333;
    }
  }
}
</style>
