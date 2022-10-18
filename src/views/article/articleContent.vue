<template>
  <div class="article-content">
    <c-title :hide="false" text=""></c-title>
    <h4>{{ dataInfo.title }}</h4>
    <div class="time">
      {{ dataInfo.virtual_at ? dataInfo.virtual_at : dataInfo.created_at }}
      {{ dataInfo.author }}
    </div>
    <div class="content">
      <div v-html="content" id="con" @click="handleHtml($event)"></div>
    </div>
    <div class="foot_advs" @click="toAdvs()" v-if="is_advs_type">
      <p class="advs_title">{{ dataInfo.advs_title }}</p>
      <div class="advs_img_bg" v-if="dataInfo.advs_img">
        <img class="advs_img" :src="dataInfo.advs_img" />
      </div>
      <div class="advs_img_bg" v-if="!dataInfo.advs_img">
        <img class="advs_img" src="../../assets/images/img_default.png" />
      </div>
      <div class="advs_desc">{{ dataInfo.advs_title_footer }}</div>
    </div>
    <div class="foot">
      <div>
        <h4 class="read">阅读 {{ read_num }}</h4>
        <h4 class="like" @click="like(like_num)">{{ is_liked ? "已点赞" : "点赞" }} {{ like_num }}</h4>
        <h4 class="like" v-if="comment" style="padding-left: 0.625rem;">评论({{ commentNum }})</h4>
      </div>
      <div v-if="is_report_enabled">
        <h4 class="report" @click="report()">举报</h4>
      </div>
      <div v-if="is_link">
        <h4 class="link" @click="link()">阅读原文</h4>
      </div>
    </div>
    <div class="qrCode" v-if="codeUrl">
      <h3>【二维码】</h3>
      <div class="code">
        <span>长按识别二维码</span>
        <div class="img">
          <img :src="codeUrl" />
        </div>
      </div>
    </div>

    <div class="comment" v-if="comment">
      <div style="width: 100%; height: 0.31rem; background: #f2f2f2;"></div>
      <div class="title">评论详情</div>
      <div class="commentList">
        <div class="firstComment" v-for="(item, ind) in commentList" :key="ind" @click.stop="delComment(item, ind)">
          <div class="userTop">
            <div class="image">
              <img :src="item.head_image" alt="" />
            </div>
            <div class="user">
              <div class="userName">{{ item.nick_name }}</div>
              <div class="dateDay">{{ item.created_at }}</div>
              <div class="contenBox">
                <div class="txt">{{ item.content }}</div>
                <div class="contenImg" v-if="item.comment_images.length > 0" @click.stop="watchImg(item.comment_images)">
                  <img :src="item.comment_images" alt="" />
                </div>
              </div>
            </div>
            <div class="reply" @click.stop="replyBtn(item.nick_name, item, ind)">回复</div>
          </div>
          <!-- 回复的评论 -->
          <div class="commentLis" v-show="item.child" v-for="(info, index) in item.child" :key="index" @click.stop="delComment(info, ind, index, 'child')">
            <div class="userTop">
              <div class="image">
                <img :src="info.head_image" alt="" v-if="info.head_image" />
                <img src="../../assets/images/photo-mr.jpg" alt="" v-else />
              </div>
              <div class="user">
                <div class="userName">{{ info.nick_name }}</div>
                <div class="dateDay">{{ info.updated_at }}</div>
                <div class="contenBox">
                  <div class="txt">
                    <div v-if="info.reply_id != '0' || info.reply_name">回复{{ info.reply_name }}:</div>
                    {{ info.content }}
                  </div>
                  <div class="contenImg" v-show="info.comment_images" @click.stop="watchImg(info.comment_images)">
                    <template v-for="(datas, indkey) in info.comment_images">
                      <img :src="datas" alt="" :key="indkey" />
                    </template>
                  </div>
                </div>
              </div>
              <div class="reply" @click.stop="replyBtn(info.nick_name, info, ind)">回复</div>
            </div>
          </div>
          <!-- 展开更多 加在更多评论 -->
          <div class="commentLis" v-if="item.reply_num > 0 && item.commentShow">
            <div class="commentMore" @click.stop="moreCommentLis(item.id, ind)">
              显示展开{{ item.reply_num }}条回复
              <van-icon name="arrow-down" />
            </div>
          </div>
        </div>
        <div class="commentMore" v-if="commentPage < last_page" @click="getMore">
          展开更多的评论
          <van-icon name="arrow-down" />
        </div>
      </div>
      <!-- 回复输入框 -->
      <div class="replyInp">
        <div class="userImg">
          <img :src="commenMember.avatar_image" alt="" />
        </div>
        <div class="inpNav" @click="subMainCommentBtn">
          <input disabled type="text" placeholder="来都来了，留下点什么吧" />
        </div>
      </div>
      <yz-comment-input v-model="showCommentInput" v-on:confirm="subMainBtn" :options="commentInputOptions">
        <div class="commentInput-slot-style" v-if="commentInputOptions.type == 'reply'">
          回复<span class="selcolor">@{{ replyName }}</span>
        </div>
      </yz-comment-input>
    </div>
    <van-image-preview v-model="showImg" :images="imgList" :start-position="imgStart"></van-image-preview>
  </div>
</template>
<script>
import articleContent_controller from "./articleContent_controller";
export default articleContent_controller;
</script>

<style>
/* 覆盖内联样式 */
.article-content .content {
  word-break: break-all;
}

.article-content .content div,
.article-content .content section,
.article-content .content p,
.article-content .content ul,
.article-content .content ol {
  max-width: 100%;
}

.article-content .content ul {
  list-style-type: disc;
}

.article-content .content ol {
  list-style-type: decimal;
}

.article-content .content img {
  display: block;
  max-width: 100% !important;
  height: auto !important;
}

</style>
<style lang="scss" rel="stylesheet/scss" scoped>
.article-content {
  background: #fff;
  padding: 1rem;
  overflow-x: hidden;

  .contenBox {
    padding: 0.625rem;
  }

  .foot_advs {
    margin-bottom: 1.25rem;
    height: auto;
    border: 0.0625rem solid #ddd;
    padding: 0.3125rem;
    background: #fff;
    width: 100%;
    border-radius: 0;
  }

  .qrCode {
    background: #fff;
    margin-top: 0.625rem;
    padding-bottom: 1.25rem;

    h3 {
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 16px;
      text-align: left;
      padding: 0 0.875rem;
    }

    .code {
      span {
        color: #8c8c8c;
      }

      .img {
        width: 7.5rem;
        height: 7.5rem;
        overflow: hidden;
        background: #f5f5f5;
        margin: 0.625rem auto;

        img {
          width: 100%;
        }
      }
    }
  }

  .foot {
    height: 1.875rem;
  }

  h4 {
    text-align: left;
    font-size: 18px;
  }

  h4.like {
    float: left;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  h4.read {
    padding-right: 0.625rem;
    float: left;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  h4.report {
    padding-right: 0.625rem;
    float: right;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  h4.link {
    padding-right: 0.625rem;
    float: right;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  h4.copy {
    padding-right: 0.625rem;
    float: left;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  .time {
    font-size: 14px;
    color: #8a8a8a;
    text-align: left;
    line-height: 1.5625rem;
    height: 1.5625rem;
  }

  .content {
    width: 100%;
    font-size: 16px;
    text-align: left;
    padding-top: 0.625rem;
    padding-bottom: 1.875rem;
    word-break: break-all;

    img {
      width: 100%;
    }

    li {
      list-style: inherit;
    }
  }

  .advs_img_bg {
    width: 100%;
    margin-bottom: 0.625rem;
    padding-top: 0.3125rem;
    padding-bottom: 0.3125rem;
  }

  .advs_img {
    width: 100%;
  }

  p.advs_title {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    text-align: left;
    height: 1.875rem;
    line-height: 1.875rem;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
  }

  .advs_desc {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    text-align: left;
    font-size: 14px;
    color: #8a8a8a;
  }
}
// 文章评论
.commentInput-slot-style {
  height: 1.5rem;
  line-height: 2rem;
  text-align: left;
  padding-left: 0.875rem;

  .selcolor {
    color: #1c96fe;
  }
}

.commentMore {
  font-size: 0.81rem;
  color: #4d88df;
  display: flex;
  justify-content: center;
  align-items: center;
}

.comment {
  background-color: #fff;
  padding-bottom: 1.94rem;

  .replyInp {
    width: 100%;
    height: 3.13rem;
    background-color: #fff;
    padding-left: 0.94rem;
    padding-right: 1.28rem;
    display: flex;
    align-items: center;
    box-shadow: -0.01rem 0.09rem 0.91rem 0 rgba(188, 188, 188, 0.57);

    .userImg {
      width: 2.19rem;
      height: 2.19rem;
      border-radius: 100%;

      img {
        width: 2.19rem;
        height: 2.19rem;
        border-radius: 100%;
      }
    }

    .inpNav {
      flex: 1;
      height: 1.88rem;
      background: #f5f5f5;
      border-radius: 0.94rem;
      padding-left: 0.97rem;
      margin-left: 0.66rem;

      input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
      }
    }
  }

  .title {
    font-size: 1rem;
    color: #202020;
    text-align: left;
    padding-top: 1.06rem;
    padding-left: 0.97rem;
    padding-bottom: 1.16rem;
    box-sizing: border-box;
  }

  .commentList {
    padding: 1.13rem 0.94rem;

    .firstComment {
      .userTop {
        display: flex;

        .user {
          flex: 1;
          text-align: left;
          height: 100%;

          .userName {
            font-size: 1rem;
            color: #2e2e2e;
          }

          .dateDay {
            font-size: 0.63rem;
            color: #767676;
          }

          .contenBox {
            margin-top: 0.88rem;
            width: 100%;

            .txt {
              font-size: 0.94rem;
              color: #2e2e2e;
              margin-bottom: 0.63rem;
              display: flex;
            }

            .contenImg {
              display: flex;
              justify-content: flex-start;

              img {
                width: 3rem;
                height: 3rem;
                background-color: #c1c1c1;
                border-radius: 0.13rem;
                margin: 0;
                margin-right: 0.25rem;
              }
            }
          }
        }

        .image {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #b5b5b5;
          border-radius: 50%;
          margin-right: 0.63rem;

          img {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
          }
        }

        .reply {
          font-size: 0.88rem;
          line-height: 1.27rem;
          letter-spacing: 0.02rem;
          color: #f15353;
        }
      }

      .commentLis {
        margin-top: 0.94rem;
        margin-left: 1.16rem;

        .userTop {
          display: flex;

          .user {
            flex: 1;
            text-align: left;
            height: 100%;

            .userName {
              font-size: 0.88rem;
              color: #2e2e2e;
            }

            .dateDay {
              font-size: 0.63rem;
              color: #767676;
            }

            .contenBox {
              margin-top: 0.88rem;
              width: 100%;

              .txt {
                font-size: 0.88rem;
                color: #2e2e2e;
                margin-bottom: 0.63rem;
              }

              .contenImg {
                display: flex;
                justify-content: flex-start;

                img {
                  width: 3rem;
                  height: 3rem;
                  background-color: #c1c1c1;
                  border-radius: 0.13rem;
                  margin: 0;
                  margin-right: 0.25rem;
                }
              }
            }
          }

          .image {
            width: 1.88rem;
            height: 1.88rem;
            background-color: #b5b5b5;
            border-radius: 50%;
            margin-right: 0.63rem;

            img {
              width: 1.88rem;
              height: 1.88rem;
              border-radius: 50%;
            }
          }

          .reply {
            font-size: 0.69rem;
            line-height: 1.27rem;
            letter-spacing: 0.02rem;
            color: #f15353;
          }
        }
      }
    }
  }
}
</style>
