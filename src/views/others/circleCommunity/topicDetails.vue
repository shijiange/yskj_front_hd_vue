<template>
  <div id="microcommentdetails" v-if="post">
    <div id="hoid" @click="goto" :class="{ hoet: hoet }">
      <div id="back">
        <i class="iconfont icon-member-left"></i>
      </div>
    </div>
    <div id="cart" @click="gotoHome" :class="{ hoet: hoet }">
      <div id="back">
        <i class="iconfont icon-ai-home"></i>
      </div>
    </div>
    <div id="member" @click="shareWeixin" :class="{ hoet: hoet }">
      <div id="back">
        <!-- <i class="fa fa-user"></i> -->
        <i class="iconfont icon-fenxiang"></i>
      </div>
    </div>
    <div class="header"></div>
    <div class="banner" v-if="post.img&&post.img.length>0">
      <van-swipe
        :autoplay="0"
        indicator-color="white"
        :loop="true"
        :show-indicators="false"
        @change="sidingsImg"
      >
        <template v-for="(item, index) in post.img">
          <van-swipe-item :key="index">
            <div class="centerbanner">
              <img :src="item" />
            </div>
          </van-swipe-item>
        </template>
      </van-swipe>
      <div class="bannerindex">{{ bannerindex + '/' + post.img.length }}</div>
    </div>
    <div class="details_show">
      <div class="user_message">
        <div class="user_left" @click="visitMember(post.member_id)">
          <div class="pic">
            <img :src="post.avatar" />
          </div>
          <div class="name_right">
            <div class="name">{{ post.nickname }}</div>
            <div class="createdata">{{ post.created_at }}</div>
          </div>
        </div>
        <div class="uset_right">
          <div
            class="attention"
            @click="followAuthor"
            v-if="!post.is_current_member"
          >{{ post.is_attention ? '已关注' : '关注' }}</div>
          <div class="more" @click="showPostOperate" v-if="post.is_master||post.is_current_member">
            <img src="../../../assets/images/micro_communities/detail_more@2x.png" alt />
          </div>
        </div>
      </div>
      <div class="article" v-html="post.content"></div>
      <div class="article_label">
        <ul>
          <li>#{{ post.cat_name }}</li>
        </ul>
      </div>
      <div class="loca_information">
        <div class="localeft">
          <div class="letimg">
            <img src="../../../assets/images/micro_communities/publish_add_address@2x.png" alt />
          </div>
          <div class="addressname">{{ post.address }}</div>
        </div>
        <div class="locaright">浏览：{{ post.browse_count || 0 }}</div>
      </div>
      <div class="showmessage" v-if="post.store||post.goods">
        <div class="content">
          <div
            class="shopshow"
            @click="gotoStore(post.store[0].id)"
            v-if="displayStore&&post.store&&post.store[0]"
          >
            <div class="leftimg">
              <img :src="post.store[0].thumb" alt />
            </div>
            <div class="shopright">
              <div class="name">{{ post.store[0].store_name }}</div>
              <div class="start_1">
                <img src="../../../assets/images/collect.png" alt />
                <img src="../../../assets/images/collect.png" alt />
                <img src="../../../assets/images/collect.png" alt />
                <img src="../../../assets/images/collect.png" alt />
                <img src="../../../assets/images/collect.png" alt />
              </div>
              <div class="fobottom">
                <div class="area">{{ post.store[0].address }}</div>
              </div>
            </div>
          </div>
          <div class="goodsshow" v-if="displayGoods&&post.goods" @click="gotoGoods(post.goods[0].id)">
            <div class="leftimg">
              <img :src="post.goods[0].thumb" alt />
            </div>
            <div class="goodright">
              <div class="goodsname">{{ post.goods[0].title }}</div>
              <div class="fobottom">
                <div class="foleft">
                  <div class="pic">{{ $i18n.t('money') }}{{ post.goods[0].price }}</div>
                  <div class="delpic">{{ $i18n.t('money') }}{{ post.goods[0].market_price }}</div>
                </div>
                <div class="foright">
                  <div class="sold">已售{{ post.goods[0].show_sales }}件</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="comment_display">
        <div class="comment_top">
          <div class="title">评论({{ post.commentCount||0 }})</div>
          <div class="reply" @click="subMainCommentBtn">
            <div class="reply_right">来都来了，留点什么吧...</div>
          </div>
        </div>
        <d-list
          @load="loadComments"
          :finished="commentPagination.finished"
          :loading="commentPagination.loading"
        >
          <div class="comment_bottom">
            <ul class="maincomment">
              <li v-for="(commentItem, itemIndex) in comments" :key="commentItem.id">
                <div class="maincommentleft" @click="displayCommentActionSheet(itemIndex)">
                  <van-image :src="commentItem.avatar" :alt="commentItem.nickname" round />
                </div>
                <div class="maincommentright">
                  <div class="master_content" @click="displayCommentActionSheet(itemIndex)">
                    <div class="master_content_left">
                      <div class="name">{{ commentItem.nickname }}</div>
                      <div class="createdata">{{ commentItem.created_at }}</div>
                      <div class="review_content">{{ commentItem.comment }}</div>
                    </div>
                    <div class="thumb_up" @click.stop="likeComment(itemIndex)">
                      <div class="thumb_img">
                        <template v-if="commentItem.is_like">
                          <img
                            src="../../../assets/images/micro_communities/home_praise_cur@2x.png"
                            alt
                          />
                        </template>
                        <template v-else>
                          <img
                            src="../../../assets/images/micro_communities/home_praise@2x.png"
                            alt
                          />
                        </template>
                      </div>
                      <div class="thumb_num">{{ commentItem.link_count }}</div>
                    </div>
                  </div>
                  <template v-for="(subComment,subItemIndex) in commentItem.has_many_comment">
                    <div
                      :key="subComment.id"
                      class="deputy_comment"
                      @click="
                     displayCommentActionSheet(itemIndex,subItemIndex)
                    "
                    >
                      <div class="deputy_comment_left">
                        <van-image :src="subComment.avatar" round />
                      </div>
                      <div class="deputy_comment_right">
                        <div class="deputy_message">
                          <div class="name">{{ subComment.nickname }}</div>
                          <div class="createdata">{{ subComment.created_at }}</div>
                          <div class="review_content">
                            <template v-if="subComment.less_name">
                              回复
                              <span class="selecolor">{{ subComment.subordinate_name }}</span>
                            </template>
                            {{ subComment.comment }}
                          </div>
                        </div>
                        <div
                          class="thumb_up"
                          @click.stop="
                          likeComment(itemIndex,subItemIndex)
                        "
                        >
                          <div class="thumb_img">
                            <template v-if="subComment.is_like==1">
                              <img
                                src="../../../assets/images/micro_communities/home_praise_cur@2x.png"
                                alt
                              />
                            </template>
                            <template v-else>
                              <img
                                src="../../../assets/images/micro_communities/home_praise@2x.png"
                                alt
                              />
                            </template>
                          </div>
                          <div class="thumb_num">{{ subComment.link_count }}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- <div v-if="!commentItem['subCommentsPagination']['finished']" @click="loadMoreSubComments(itemIndex)" v-show="!commentItem['subCommentsPagination']['loading']">加载更多</div> -->
                </div>
              </li>
            </ul>
          </div>
        </d-list>
      </div>
    </div>
    <div class="bottom_operation set-pc-styleLeft">
      <div class="content">
        <div class="reply" @click="subMainCommentBtn">
          <div class="reply_left">
            <img src="../../../assets/images/micro_communities/home_autograph@2x.png" alt />
          </div>
          <div class="reply_right">说点什么...</div>
        </div>
        <div class="appreciate" @click="moneyShow" v-if="displayReward">
          <div class="appreciateimg">
            <img src="../../../assets/images/micro_communities/detail_reward@2x.png" alt />
          </div>
          <div class="appreciatenum">赞赏</div>
        </div>
        <div class="thumbup" @click="likePost">
          <div class="thumbupimg">
            <img src="../../../assets/images/micro_communities/detail_praise@2x.png" alt />
          </div>
          <div class="thumbupnum">{{ post.likeCount }}</div>
        </div>
        <div class="comment">
          <div class="commentimg">
            <img src="../../../assets/images/micro_communities/detail_comment@2x.png" alt />
          </div>
          <div class="commentnum">{{ post.commentCount }}</div>
        </div>
      </div>
    </div>

    <van-popup v-model="mainCommentShow" position="bottom" :overlay="true">
      <div class="replyMainComment">
        <div class="left">
          <input type="text" ref="commentInput" v-model="replyContent" placeholder="请留下你的精彩评论吧" />
        </div>
        <div class="right" @click="commentPost">发送</div>
      </div>
    </van-popup>
    <van-popup v-model="replyshow" position="bottom" :overlay="true">
      <div class="replyComment">
        <div class="top">
          <div class="left">
            回复
            <span class="selcolor">@{{ replyName }}</span>
          </div>
        </div>
        <div class="bottom">
          <textarea v-model="replyContent" placeholder="请输入你的回复吧"></textarea>
          <div class="replysubmit" @click="replyComment">发送</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="amountRewardshow" position="bottom" :overlay="true">
      <div class="amountReward">
        <div class="close" @click="amountRewardshow = false">
          <img src="../../../assets/images/micro_communities/detail_clost@2x.png" alt />
        </div>
        <div class="usermessage">
          <div class="top" v-if="detailsData.has_one_stick_user">
            <img :src="detailsData.has_one_stick_user.avatar" alt />
          </div>
          <div
            class="name"
            v-if="detailsData.has_one_stick_user"
          >{{ detailsData.has_one_stick_user.nickname }}</div>
        </div>
        <div class="listAmounts">
          <div class="title">请选择金额打赏</div>
          <ul>
            <li
              v-for="(item, index) in rewardArr"
              :key="index"
              :class="{ sel: rewardArrselect == index }"
              @click="shorewardArrBtn(index)"
            >
              {{ $i18n.t('money') }}{{ item.name }}
              <div class="selimg" v-if="rewardArrselect == index">
                <img src="../../../assets/images/micro_communities/detail_btn_cur@2x.png" alt />
              </div>
            </li>
          </ul>
        </div>
        <div class="custom_amount">
          <div class="top">自定义金额打赏</div>
          <div class="bottom">
            <input
              v-model="rewardArrmoney"
              type="number"
              name
              placeholder="请输入要打赏的金额"
              @focus="rewardArrMoneyBtn"
            />
          </div>
        </div>
        <div class="confirmReward" @click="confirmRewardBtn">确认打赏</div>
      </div>
    </van-popup>
    <van-popup v-model="rewardPayshow" position="bottom" :overlay="true">
      <div class="rewardPay">
        <div class="payMode">
          <ul>
            <li @click="payBtn(item)" v-for="(item, index) in btnData" :key="index">{{ item.name }}</li>
          </ul>
        </div>
        <div class="cancel" @click="rewardPayCancelBtn">取消</div>
      </div>
    </van-popup>
    <van-popup v-model="commentManagement" position="bottom" :overlay="true">
      <div class="rewardPay">
        <div class="content">
          <span>{{ replyName }}:</span>
          {{ replyshowcontent }}
        </div>
        <div class="payMode">
          <ul>
            <li @click="replyBtn">回复</li>
            <li @click="delBtn" v-if="is_own || post.is_master">删除</li>
          </ul>
        </div>
        <div class="cancel" @click="replyCancelBtn">取消</div>
      </div>
    </van-popup>

    <!-- [ 帖子操作 ] -->
    <van-action-sheet
      v-model="showPostOperateMenu"
      :actions="postOperateActionSheets"
      close-on-click-action
      cancel-text="取消"
      @select="selectPostOperateAction"
    ></van-action-sheet>
    <!-- [ 点击任意一个评论弹出的面板 ] -->
    <van-action-sheet
      v-model="showCommentActionSheet"
      :actions="commentActionSheet"
      close-on-click-action
      cancel-text="取消"
      @select="selectCommentActionSheet"
    >
      <div class="reply-content-content" slot="description">{{ replyCommentContent }}</div>
    </van-action-sheet>
  </div>
</template>

<script>
import topicDetails_controller from "./topicDetails_controller";

export default topicDetails_controller;
</script>

<style scoped>
.reply-content-content {
  word-break: break-all;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
.pcStyle {
  #microcommentdetails {
    #member {
      right: 50% !important;
      margin-right: -9.375rem;
    }

    #cart {
      right: 50% !important;
      margin-right: -11.625rem;
    }
  }
}

#microcommentdetails {
  #hoid {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
  }

  #cart {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
    box-sizing: content-box;
  }

  #member {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
    box-sizing: content-box;
  }

  #cart {
    right: 0;
  }

  #member {
    right: 2rem;
  }

  #hoid.hoet {
    transition: 0.1s;
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
  }

  #back {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 100%;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.4);
    text-indent: 0;
    line-height: 1.7rem;
    overflow: hidden;
  }

  .hoet #back {
    transition: 0.1s;
    background-color: rgba(237, 237, 237, 0);
  }

  padding-bottom: 4rem;

  .banner {
    background-color: #fff;
    position: relative;

    .centerbanner {
      img {
        width: 100%;
      }
    }

    .bannerindex {
      width: 2.25rem;
      height: 1.88rem;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0.6rem;
      font-size: 0.88rem;
      line-height: 1.88rem;
      color: #fff;
      position: absolute;
      bottom: 0.63rem;
      right: 0.63rem;
    }
  }

  .details_show {
    background-color: #fff;

    .user_message {
      display: flex;
      justify-content: space-between;
      padding-top: 0.75rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;

      .user_left {
        display: flex;
        align-items: center;

        .pic {
          width: 2.5rem;
          height: 2.5rem;
          margin-right: 0.69rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .name_right {
          .name {
            font-size: 0.88rem;
            line-height: 0.94rem;
            color: #333;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 8rem;
            text-align: left;
            margin-bottom: 0.44rem;
            padding-top: 0.19rem;
          }

          .createdata {
            font-size: 0.75rem;
            line-height: 0.75rem;
            color: #999;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 8rem;
            text-align: left;
          }
        }
      }

      .uset_right {
        display: flex;
        align-items: center;

        .attention {
          width: 3.38rem;
          height: 1.63rem;
          background-color: #fff;
          border-radius: 0.81rem;
          border: solid 0.06rem #f15353;
          line-height: 1.63rem;
          color: #f84b4b;
          font-size: 0.88rem;
          margin-right: 1rem;
        }

        .more {
          width: 1.25rem;
          height: 1.25rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .article {
      padding-top: 0.69rem;
      padding-left: 0.78rem;
      padding-right: 0.78rem;
      font-size: 0.88rem;
      line-height: 1.13rem;
      color: #333;
      text-align: left;
      margin-bottom: 1.16rem;
      word-break: break-all;
      white-space: pre-line;
    }

    .article_label {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-bottom: 0.5rem;

      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          height: 1.5rem;
          background-color: #f2f2f2;
          border-radius: 0.75rem;
          line-height: 1.5rem;
          font-size: 0.75rem;
          color: #1c96fe;
          padding-left: 0.69rem;
          padding-right: 0.69rem;
          margin-right: 0.8rem;
          margin-bottom: 0.63rem;
        }
      }
    }

    .loca_information {
      display: flex;
      justify-content: space-between;
      padding-left: 0.97rem;
      padding-right: 0.84rem;
      padding-bottom: 0.5rem;

      .localeft {
        display: flex;
        align-items: center;

        .letimg {
          width: 0.84rem;
          height: 0.84rem;

          img {
            width: 100%;
            height: 100%;
          }

          margin-right: 0.44rem;
        }

        .addressname {
          font-size: 0.88rem;
          line-height: 1.13rem;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 15rem;
          text-align: left;
        }
      }

      .locaright {
        font-size: 0.88rem;
        line-height: 1.13rem;
        color: #999;
        text-align: left;
      }
    }

    .showmessage {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-bottom: 1.03rem;

      .content {
        background-color: #fafafa;
        border-radius: 0.38rem;
        padding: 0.63rem;

        .shopshow {
          display: flex;
          align-items: center;
          margin-bottom: 1.25rem;

          .leftimg {
            background: #fff;
            width: 3rem;
            height: 3rem;
            border: 0.06rem solid #eee;
            border-radius: 0.8rem;
            margin-right: 0.66rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .shopright {
            .name {
              font-size: 0.84rem;
              line-height: 1rem;
              max-width: 8rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              text-align: left;
              padding-top: 0.2rem;
            }

            .start_1 {
              text-align: left;

              img {
                width: 0.38rem;
                height: 0.38rem;
              }
            }

            .fobottom {
              color: #999;
              font-size: 0.75rem;
            }
          }
        }

        .goodsshow {
          display: flex;
          align-items: center;

          .leftimg {
            flex: 0 0 3rem;
            background: #fff;
            width: 3rem;
            height: 3rem;
            border: 0.06rem solid #eee;
            border-radius: 0.8rem;
            margin-right: 0.66rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .goodright {
            flex: 1;
            max-width: 85%;

            .goodsname {
              font-size: 0.84rem;
              line-height: 1rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              text-align: left;
              margin-bottom: 0.75rem;
              padding-top: 0.2rem;
            }

            .fobottom {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .foleft {
                display: flex;
                align-items: center;
                height: 1rem;
                line-height: 1rem;
                margin-right: 1.69rem;

                .pic {
                  color: #f15353;
                  font-size: 0.88rem;
                  margin-right: 0.59rem;
                }

                .delpic {
                  color: #999;
                  font-size: 0.75rem;
                  text-decoration: line-through;
                }
              }

              .foright {
                display: flex;
                align-items: center;
                height: 1rem;
                line-height: 1rem;

                .sold {
                  color: #999;
                  font-size: 0.75rem;
                }
              }
            }
          }
        }
      }
    }

    .comment_display {
      .comment_top {
        padding-left: 0.81rem;
        padding-right: 0.81rem;
        padding-bottom: 1.31rem;

        .title {
          font-size: 0.75rem;
          line-height: 0.75rem;
          color: #666;
          text-align: left;
          padding-bottom: 0.66rem;
        }

        .reply {
          display: flex;
          align-items: center;

          .reply_left {
            width: 2rem;
            height: 2rem;
            margin-right: 0.72rem;

            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }

          .reply_right {
            width: 19.22rem;
            height: 1.88rem;
            line-height: 1.88rem;
            background-color: #f2f2f2;
            border-radius: 0.94rem;
            font-size: 0.88rem;
            color: #999;
            text-align: left;
            padding-left: 0.63rem;
          }
        }
      }

      .comment_bottom {
        padding-left: 0.81rem;
        padding-right: 0.81rem;

        .maincomment {
          li {
            display: flex;
            margin-top: 0.5rem;

            .maincommentleft {
              width: 2rem;
              height: 2rem;
              border-radius: 50%;
              margin-right: 0.72rem;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .maincommentright {
              flex: 1;
              padding-bottom: 0.5rem;
              border-bottom: 0.06rem solid #eee;

              .master_content {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.4rem;

                .master_content_left {
                  text-align: left;

                  .name {
                    font-size: 0.88rem;
                    line-height: 1.13rem;
                    color: #1c96fe;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 10rem;
                  }

                  .createdata {
                    font-size: 0.75rem;
                    line-height: 1.13rem;
                    color: #999;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 10rem;
                  }

                  .review_content {
                    font-size: 0.88rem;
                    line-height: 1.13rem;
                    color: #333;
                    word-break: break-all;
                  }
                }

                .thumb_up {
                  display: flex;
                  align-items: center;
                  flex-direction: column;

                  .thumb_img {
                    width: 0.94rem;
                    height: 0.94rem;

                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }

                  .thumb_num {
                    font-size: 0.63rem;
                    line-height: 1.13rem;
                    color: #333;
                  }
                }
              }

              .deputy_comment {
                display: flex;
                margin-bottom: 0.4rem;

                .deputy_comment_left {
                  width: 1.5rem;
                  height: 1.5rem;
                  border-radius: 50%;
                  margin-right: 0.41rem;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .deputy_comment_right {
                  flex: 1;
                  display: flex;
                  justify-content: space-between;
                  text-align: left;

                  .deputy_message {
                    flex: 1;

                    .name {
                      font-size: 0.75rem;
                      line-height: 1.13rem;
                      color: #1c96fe;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: 10rem;
                    }

                    .createdata {
                      font-size: 0.63rem;
                      line-height: 1.13rem;
                      color: #999;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: 10rem;
                    }

                    .review_content {
                      font-size: 0.88rem;
                      line-height: 1.13rem;
                      color: #333;

                      .selecolor {
                        color: #1c96fe;
                      }
                    }
                  }

                  .thumb_up {
                    display: flex;
                    align-items: center;
                    flex-direction: column;

                    .thumb_img {
                      width: 0.94rem;
                      height: 0.94rem;

                      img {
                        width: 100%;
                        height: 100%;
                      }
                    }

                    .thumb_num {
                      font-size: 0.63rem;
                      line-height: 1.13rem;
                      color: #333;
                    }
                  }
                }
              }
            }
          }

          li:last-of-type {
            .maincommentright {
              border-bottom: none;
            }
          }
        }
      }

      .multiple_comments {
        padding-top: 0.81rem;
        padding-bottom: 0.81rem;
        font-size: 0.88rem;
        color: #1c96fe;
        border-top: 0.06rem solid #eee;
      }
    }
  }

  .bottom_operation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 3.06rem;
    background-color: #fff;
    text-align: left;

    .content {
      display: flex;
      align-items: center;
      height: 100%;

      .reply {
        display: flex;
        align-items: center;
        width: 8.75rem;
        height: 1.88rem;
        line-height: 1.88rem;
        background-color: #f2f2f2;
        border-radius: 0.94rem;
        font-size: 0.88rem;
        color: #999;
        margin-left: 0.75rem;

        .reply_left {
          width: 1.2rem;
          height: 1.2rem;
          margin-left: 0.75rem;
          margin-right: 0.53rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .appreciate {
        display: flex;
        align-items: center;
        margin-left: 0.78rem;

        .appreciateimg {
          width: 1.31rem;
          height: 1.31rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .appreciatenum {
          font-size: 0.88rem;
          // line-height: 0.75rem;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 0.4rem;
        }
      }

      .thumbup {
        display: flex;
        align-items: center;
        margin-left: 0.78rem;

        .thumbupimg {
          width: 1.28rem;
          height: 1.31rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .thumbupnum {
          font-size: 0.88rem;
          line-height: 0.75rem;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 0.4rem;
        }
      }

      .comment {
        display: flex;
        align-items: center;
        margin-left: 0.78rem;

        .commentimg {
          width: 1.28rem;
          height: 1.31rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .commentnum {
          font-size: 0.88rem;
          line-height: 0.75rem;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 0.4rem;
        }
      }
    }
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

  .replyComment {
    padding: 1rem;

    .top {
      margin-bottom: 0.5rem;

      .left {
        font-size: 0.88rem;
        line-height: 1.13rem;
        color: #333;
        text-align: left;

        .selcolor {
          color: #1c96fe;
        }
      }
    }

    .bottom {
      height: 8rem;
      background-color: #f5f5f5;
      border-radius: 0.94rem;
      position: relative;
      padding: 0.5rem;

      textarea {
        height: 6rem;
        width: 100%;
        overflow: auto;
        background-color: #f5f5f5;
        border: none;
      }

      .replysubmit {
        position: absolute;
        bottom: 0.5rem;
        right: 1rem;
        width: 2.56rem;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.88rem;
      }
    }
  }

  .adminOperation {
    background-color: #f2f2f2;

    .recommend,
    .top_set,
    .delete {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      height: 3.44rem;
      border-bottom: 0.06rem solid #eee;
    }

    .delete {
      border-bottom: none;
      margin-bottom: 0.63rem;
    }

    .recommend_left,
    .top_set_left,
    .delete_left {
      height: 1.22rem;
      width: 1.22rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .recommend_right,
    .top_set_right,
    .delete_right {
      font-size: 1rem;
      color: #333;
      margin-left: 0.28rem;
    }

    .cancel {
      height: 3.44rem;
      background: #fff;
      color: #333;
      font-size: 1rem;
      line-height: 3.44rem;
    }
  }

  .releaseOperation {
    background-color: #f2f2f2;

    .re_edit,
    .delete {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      height: 3.44rem;
      border-bottom: 0.06rem solid #eee;
    }

    .re_edit_left,
    .delete_left {
      height: 1.22rem;
      width: 1.22rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .re_edit_right,
    .delete_right {
      font-size: 1rem;
      color: #333;
      margin-left: 0.28rem;
    }

    .delete {
      border-bottom: none;
      margin-bottom: 0.63rem;
    }

    .cancel {
      height: 3.44rem;
      background: #fff;
      color: #333;
      font-size: 1rem;
      line-height: 3.44rem;
    }
  }

  .amountReward {
    position: relative;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 1.25rem;
    padding-bottom: 1.31rem;

    .close {
      top: 0.97rem;
      right: 1.03rem;
      position: absolute;
      width: 0.84rem;
      height: 0.84rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .usermessage {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1.22rem;

      .top {
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 50%;
        margin-bottom: 0.69rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        font-size: 1rem;
        color: #333;
        line-height: 1rem;
        font-weight: bold;
      }
    }

    .listAmounts {
      .title {
        text-align: left;
        font-size: 0.88rem;
        color: #333;
        font-weight: bold;
        margin-bottom: 0.94rem;
      }

      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          position: relative;
          margin-right: 0.84rem;
          width: 6.75rem;
          height: 2.38rem;
          background-color: #fff;
          border-radius: 0.25rem;
          border: solid 0.06rem #e5e5e5;
          line-height: 2.38rem;
          margin-bottom: 0.66rem;
          font-size: 0.88rem;
          color: #333;

          .selimg {
            position: absolute;
            width: 1.84rem;
            height: 1.19rem;
            top: 0;
            right: 0;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }

        li.sel {
          border-color: #f15353;
          color: #f15353;
        }

        li:nth-of-type(3n) {
          margin-right: 0;
        }
      }
    }

    .custom_amount {
      margin-bottom: 3.09rem;

      .top {
        text-align: left;
        font-size: 0.88rem;
        color: #333;
        font-weight: bold;
        margin-bottom: 0.94rem;
      }

      .bottom {
        height: 2.41rem;
        background-color: #fff;
        border-radius: 0.25rem;
        border: solid 0.06rem #e5e5e5;

        input {
          width: 100%;
          height: 100%;
          padding-left: 0.4rem;
          border: none;
        }
      }
    }

    .confirmReward {
      width: 10rem;
      height: 2.5rem;
      background-color: #f15353;
      border-radius: 0.25rem;
      line-height: 2.5rem;
      font-size: 1rem;
      color: #fff;
      margin: 0 auto;
    }
  }

  .rewardPay {
    background-color: #f2f2f2;

    .content {
      background-color: #fff;

      span {
        color: #1c96fe;
      }

      text-align: left;
      padding: 0.6rem;
      min-height: 3.44rem;
      font-size: 0.8rem;
      line-height: 1rem;
      width: 100%;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
    }

    .payMode {
      ul {
        li {
          background-color: #fff;
          height: 3.44rem;
          border-bottom: 0.06rem solid #eee;
          font-size: 1rem;
          color: #333;
          line-height: 3.44rem;
        }

        li:last-of-type {
          border-bottom: none;
          margin-bottom: 0.69rem;
        }
      }
    }

    .cancel {
      background-color: #fff;
      height: 3.44rem;
      border-bottom: 0.06rem solid #eee;
      font-size: 1rem;
      color: #333;
      line-height: 3.44rem;
    }
  }
}

.pay-psw-info {
  overflow-y: scroll;
  width: 100vw;
  height: auto;
  background: #fff;
  max-height: 80vh;
  padding-top: 0.625rem;

  .pay_content_title {
    width: 100vw;
    height: 1.875rem;
    line-height: 1.875rem;
    margin-bottom: 0.625rem;
    font-size: 1.125rem;
  }

  .pay_content {
    width: 100vw;
    height: 3.125rem;
    margin-bottom: 0.625rem;
  }

  .pay_content_view {
    width: 100vw;
    height: 3.125rem; // margin-left: 0.125rem;
    border-bottom: 0.0625rem solid #ddd;
    border-top: 0.0625rem solid #ddd;
    border-right: 0.0625rem solid #ddd;
  }

  .ipt_pay_p {
    line-height: 3.125rem;
    height: 3.125rem;
    font-size: 1.25rem;
  }

  .ipt_pay {
    float: left;
    width: 16.27%;
    height: 3.125rem;
    text-align: center;
    border-left: 0.0625rem solid #ddd;
  }

  footer {
    position: absolute;
    bottom: 0;
    width: 100vw;
    font-weight: 600;
  }

  .pay_btn {
    border-top: 0.0625rem solid #ddd;
    width: 100vw;
    height: auto;
  }

  .pay_btn li {
    width: 33%;
    float: left;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #fff;
    font-size: 0.875rem;
    border-right: 0.0625rem solid #ddd;
    border-bottom: 0.0625rem solid #ddd;
  }

  .pay_btn li:active {
    background: #c2c2c2;
  }

  .b9:active {
    background: #fff !important;
  }

  .b9 {
    background: #c2c2c2 !important;
  }
}
</style>
