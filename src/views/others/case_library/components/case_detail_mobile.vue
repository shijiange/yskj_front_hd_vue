<template>
  <div id="case-detail-mobile" v-if="view_show">
    <headTemplate text="案例详情"></headTemplate>
    <div class="all">
      <div class="list">
        <div class="img">
          <img :src="datas.img_src || emptyImage" alt="" />
        </div>
        <div class="right">
          <div class="one">
            {{ datas.case_name }}
          </div>
          <div class="two">
            <span v-for="(item, index) in label" :key="index">
              {{ item.label_name }}
            </span>
          </div>
          <div class="three">
            <div clss="star">
              <van-rate
                v-model="datas.score"
                :size="16"
                color="#ffd21e"
                void-icon="star"
                void-color="#eee"
                readonly
                allow-half
              />
            </div>
            <div class="look">
              <i class="iconfont icon-ht_operation_perview"></i>
              {{ datas.read_num }}
            </div>
          </div>
        </div>
      </div>
      <div class="explain">
        <div class="one">
          <span class="left">分类：</span>
          <span class="right">
            <span v-for="(item, index) in second_category" :key="index">{{ item.category_name }}</span>
          </span>
        </div>
        <div class="one">
          <span class="left">区域：</span>
          <span class="right">
            {{ datas.province ? datas.province.areaname : '' }} {{ datas.city ? datas.city.areaname : '' }}
          </span>
        </div>
        <div class="one">
          <span class="left">发布者：</span>
          <span class="right" v-if="datas.member && datas.member != null">
            {{ datas.member.nickname }}
          </span>
        </div>
        <div class="one">
          <span class="left">发布时间：</span>
          <span class="right">
            {{ datas.created_at }}
          </span>
        </div>
      </div>
      <div class="hr"></div>
      <div class="brief">
        <div class="btitle">简介</div>
        <div class="details" v-html="datas.content"></div>
      </div>
      <div class="image" v-if="screen_shot_src.length > 0">
        <div class="btitle" style="margin: 0 0.9375rem;">{{ datas.case_name }}图片</div>
        <div class="image-li">
          <!-- <div class="li" v-for="(item, index) in screen_shot_src" :key="index"> -->
            <img :src="item || emptyImage" alt=""  class="li" v-for="(item, index) in screen_shot_src" :key="index" @click="showImage(index)" />
          <!-- </div> -->
        </div>
      </div>
      <div class="qr">
        <div class="btitle">立即体验</div>
        <div class="image-li">
          <div class="li">
            <div class="img">
              <img :src="datas.img_h5_src || emptyImage" alt="" />
            </div>
            <div style="padding: 0.25rem 0;">H5/公众号二维码</div>
          </div>
          <div class="li">
            <div class="img">
              <img :src="datas.img_mini_src || emptyImage" alt="" />
            </div>
            <div style="padding: 0.25rem 0;">微信小程序二维码</div>
          </div>
        </div>
      </div>
      <div class="adv" v-if="ad3">
        <div class="img" v-if="ad3.mobile_img">
          <a :href="ad3.url">
            <img :src="ad3.mobile_img || emptyImage" alt="" />
          </a>
        </div>
      </div>
      <div class="more">
        <div class="btitle" style="margin: 0 0.9375rem;">其他人还看了</div>
        <div class="image-li">
          <div class="li" v-for="(item, index) in hotCase" :key="index" @click="gotoOther(item.id)">
            <div class="img">
              <img :src="item.img_src || emptyImage" alt="" />
            </div>
            <div class="title">{{ item.case_name }}</div>
          </div>
        </div>
      </div>
      <div class="score">
        <div class="btitle">评分</div>
        <div class="score1">
          <div class="left">
            <div class="number">{{ datas.score }}分</div>
            <div class="total">
              <div clss="star">
                <van-rate
                  v-model="datas.score"
                  :size="16"
                  color="#ffd21e"
                  void-icon="star"
                  void-color="#eee"
                  readonly
                  allow-half
                />
              </div>
              <div class="people">{{ datas.total_level }}人评分</div>
            </div>
          </div>
          <div class="right">
            <div clss="star">
              <van-rate v-model="star_value" :size="16" color="#ffd21e" void-icon="star" void-color="#eee" />
            </div>
            <div class="tip">请给该案例评分</div>
          </div>
        </div>
        <div class="score2">
          <div style="margin: 10px; display: flex;">
            <div style="padding-right: 10px;">5星</div>
            <van-progress
              pivot-text=""
              color="#f5a623"
              stroke-width="8"
              :percentage="(Number(datas.five_level) / Number(datas.total_level)) * 100"
              style="flex: 1; margin-top: 5px;"
            />
            <div style="padding-left: 10px;">{{ datas.five_level }}条</div>
          </div>
          <div style="margin: 10px; display: flex;">
            <div style="padding-right: 10px;">4星</div>
            <van-progress
              pivot-text=""
              color="#f5a623"
              stroke-width="8"
              :percentage="(Number(datas.four_level) / Number(datas.total_level)) * 100"
              style="flex: 1; margin-top: 5px;"
            />
            <div style="padding-left: 10px;">{{ datas.four_level }}条</div>
          </div>
          <div style="margin: 10px; display: flex;">
            <div style="padding-right: 10px;">3星</div>
            <van-progress
              pivot-text=""
              color="#f5a623"
              stroke-width="8"
              :percentage="(Number(datas.three_level) / Number(datas.total_level)) * 100"
              style="flex: 1; margin-top: 5px;"
            />
            <div style="padding-left: 10px;">{{ datas.three_level }}条</div>
          </div>
          <div style="margin: 10px; display: flex;">
            <div style="padding-right: 10px;">2星</div>
            <van-progress
              pivot-text=""
              color="#f5a623"
              stroke-width="8"
              :percentage="(Number(datas.two_level) / Number(datas.total_level)) * 100"
              style="flex: 1; margin-top: 5px;"
            />
            <div style="padding-left: 10px;">{{ datas.two_level }}条</div>
          </div>
          <div style="margin: 10px; display: flex;">
            <div style="padding-right: 10px;">1星</div>
            <van-progress
              pivot-text=""
              color="#f5a623"
              stroke-width="8"
              :percentage="(Number(datas.one_level) / Number(datas.total_level)) * 100"
              style="flex: 1; margin-top: 5px;"
            />
            <div style="padding-left: 10px;">{{ datas.one_level }}条</div>
          </div>
        </div>
      </div>
      <div class="comment">
        <div class="btitle">评价</div>
        <div class="lists" v-for="(item, index) in comment" :key="index">
          <div class="li">
            <div class="left" v-if="item.member&&item.member!=null">
              <div class="img">
                <img :src="item.member.avatar || emptyImage" alt="" />
              </div>
            </div>
            <div class="right">
              <div class="one">
                <div class="nickname" v-if="item.member&&item.member!=null">
                  <span>{{ item.member.nickname }}</span>
                </div>
                <div class="button">
                  <span @click="openReply(item.id, '2')">
                    <i class="iconfont icon-ht_list_line_allmessage"></i>
                  </span>
                  <span v-if="item.member_id == uid || $store.state.caseLibrary.is_delete_comment == 1" @click="delComment(item.id, 'comment')">
                    <i class="iconfont icon-all_delete_1"></i>
                  </span>
                </div>
              </div>
              <div class="two">
                <div class="time">{{ item.created_at }}</div>
              </div>
              <div class="three">
                {{ item.content }}
              </div>
            </div>
          </div>
          <div class="child-li" v-for="(item1, index1) in item.reply" :key="index1" v-if="item.is_show || index1 == 0">
            <div class="left">
              <div class="img" v-if="item1.member&&item1.member!=null">
                <img :src="item1.member.avatar || emptyImage" alt="" />
              </div>
            </div>
            <div class="right">
              <div class="one">
                <div class="nickname">
                  <span v-if="item1.member&&item1.member!=null">{{ item1.member.nickname }}</span>
                  <span class="reply" v-if="item1.reply_member != null">回复</span>
                  <span v-if="item1.reply_member != null">{{ item1.reply_member.nickname }}</span>
                </div>
                <div class="button">
                  <span @click="openReply(item1.id, '1')">
                    <i class="iconfont icon-ht_list_line_allmessage"></i>
                  </span>
                  <span v-if="uid == item1.member_id || $store.state.caseLibrary.is_delete_comment == 1" @click="delComment(item1.id, 'reply')">
                    <i class="iconfont icon-all_delete_1"></i>
                  </span>
                </div>
              </div>
              <div class="two">
                <div class="time">{{ item1.created_at }}</div>
              </div>
              <div class="three">
                {{ item1.content }}
              </div>
            </div>
          </div>

          <div class="more1" v-if="item.reply.length >= 2" @click="changeReplyLength(index)">
            {{ item.is_show ? '收起' : '展开' + item.reply.length + '条回复' }}
          </div>
        </div>
        <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;">{{ $i18n.t('没有更多了') }}~</div>
      </div>
      <!-- 评论 -->
      <div class="send" v-if="message_show">
        <div class="left">
          <input type="text" ref="commit_text" v-model="commit_text" placeholder="说点什么吧..." />
        </div>
        <div class="right" @click="sendMessage(2)">
          <i class="iconfont icon-zx_map_local" style="font-size: 20px;"></i>
        </div>
      </div>
      <!-- 回复 -->
      <div class="send" v-if="reply_show">
        <div class="left">
          <input type="text" ref="reply_text" v-model="reply_text" placeholder="说点什么吧..." />
        </div>
        <div class="right" @click="sendMessage(1)">
          <i class="iconfont icon-zx_map_local" style="font-size: 20px;"></i>
        </div>
      </div>
      <div class="commit">
        <div class="commit1" @click="openMeaage">
          <div>评论</div>
        </div>
      </div>
      <van-image-preview v-model="showBigImg" :images="screen_shot_src" :start-position="activeSkuIndex"> </van-image-preview>
      <serviceTemplate></serviceTemplate>
      <shareTemplate :title="datas.case_name" :desc="datas.desc" :img="datas.img_src" :id="datas.id" type='case'></shareTemplate>
    </div>
  </div>
</template>

<script>
import case_detail_mobile_controller from './case_detail_mobile_controller';

export default case_detail_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);
$text-color: #202020;

#case-detail-mobile {
  width: 100%;
  background: #fff;
  text-align: left;

  .all {
    padding-bottom: 3.125rem;

    .list {
      display: flex;
      width: 100%;
      overflow: hidden;
      padding: 0.9375rem;
      border-bottom: 1px solid #f6f6f6;

      .img {
        min-width: 4.375rem;
        width: 4.375rem;
        height: 4.375rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 1rem;
        width: calc(100% - 1rem);
        overflow: hidden;

        .one {
          font-size: 0.875rem;
          text-align: left;
          color: #333;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .two {
          overflow: auto;
          white-space: nowrap;
          text-align: left;

          span {
            display: inline-block;
            border-radius: 2px;
            background: #f7f7f7;
            line-height: 1.0625rem;
            padding: 0 0.5rem;
            color: #666;
            font-size: 0.75rem;
            margin-right: 0.625rem;
          }
        }

        .three {
          display: flex;
          // width: 100%;
          .star {
            flex: 1;
            text-align: left;
          }

          .look {
            flex: 1;
            text-align: right;
          }
        }
      }
    }

    .explain {
      background: #fbfbfb;
      border-radius: 0.625rem;
      padding: 0.875rem;
      margin: 0.9375rem;
      text-align: left;

      .one {
        display: flex;
        line-height: 1.75rem;

        .left {
          display: inline-block;
          font-size: 0.9375rem;
          color: #999;
          font-weight: 600;
          min-width: 3rem;
        }

        .right {
          display: inline-block;
          white-space: nowrap;
          overflow: auto;
          color: #3a3a3a;
          font-size: 0.8125rem;

          span {
            margin-right: 0.5rem;
          }
        }
      }
    }

    .hr {
      background: #f2f2f2;
      height: 0.625rem;
    }

    .brief {
      text-align: left;
      padding: 0.9375rem;

      .details {
        padding: 1rem 0;
        width: 100%;

        img {
          width: 100% !important;
        }
      }
    }

    .image {
      // padding: 0 0.9375rem;
      .image-li {
        overflow: auto;
        margin: 0.9375rem 0;
        display: flex;
        flex-wrap: nowrap;
        width: 100%;

        .li {
          width: 6.9rem;
          height: 11.5rem;
          margin: 0 10px;
          // min-width: 8.4375rem;
          border-radius: 0.625rem;
          display: table;
          // img {
          //   min-width: 100%;
          //   width: 100%;
          //   height: 11.5625rem;
          //   border-radius: 0.625rem;
          //   max-width: 100%;
          //   max-height: 11.5625rem;
          // }
        }
      }
    }

    .qr {
      padding: 0.9375rem;

      .image-li {
        overflow: auto;
        margin-top: 0.9375rem;
        display: flex;
        flex-wrap: nowrap;

        .li {
          .img {
            width: 6.25rem;
            height: 6.25rem;
            border-radius: 0.625rem;
            margin-right: 1.5rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 0.625rem;
            }
          }
        }
      }
    }

    .adv {
      padding: 0.9375rem;
      padding-top: 0;

      .img {
        height: 5.3125rem;
        border-radius: 0.625rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 0.625rem;
        }
      }
    }

    .more {
      padding: 0.9375rem 0;

      .image-li {
        overflow: auto;
        margin: 0.9375rem 0;
        display: flex;
        flex-wrap: nowrap;

        .li {
          margin-left: 0.9375rem;

          .img {
            width: 5.625rem;
            height: 5.625rem;
            min-width: 5.625rem;
            border-radius: 0.3125rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 0.3125rem;
            }
          }

          .title {
            width: 5.625rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
            font-size: 0.625rem;
            padding-top: 0.5rem;
          }
        }
      }
    }

    .score {
      padding: 0.9375rem;

      .score1 {
        display: flex;
        padding: 0.9375rem 0;

        .left {
          flex: 5;
          display: flex;
          align-items: center;

          .number {
            line-height: 2.63rem;
            height: 2.63rem;
            border-radius: 5px;
            background: #f5a623;
            color: #fff;
            padding: 0 0.5rem;
            font-size: 1.125rem;
            margin-right: 0.9375rem;
          }

          .total {
            text-align: center;
            margin-right: 0.9375rem;
            color: #666;
          }
        }

        .right {
          flex: 4;
          text-align: center;
          border-left: 1px solid #dedede;

          .tip {
            font-size: $text-color;
            font-size: 0.875rem;
            font-weight: 700;
          }
        }
      }

      .score2 {
        background: #fff9ed;
        padding: 0.625rem;
        border-radius: 0.625rem;
      }
    }

    .comment {
      padding: 0.9375rem;

      .lists {
        padding: 0.9375rem 0;
        border-bottom: 1px solid #f2f2f2;

        .li {
          display: flex;
          width: 100%;
          padding-bottom: 0.9375rem;

          .left {
            width: 3rem;
            min-width: 3rem;
            text-align: center;

            .img {
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 50%;

              img {
                border-radius: 50%;
                width: 100%;
                height: 100%;
              }
            }
          }

          .right {
            flex: 1;

            .one {
              display: flex;
              width: 100%;

              .nickname {
                flex: 2;
                font-size: 1rem;
                color: $text-color;
                font-weight: 700;
              }

              .button {
                flex: 1;
                text-align: right;

                span {
                  margin-left: 1rem;
                }
              }
            }

            .two {
              font-size: 0.75rem;
              color: #767676;
              padding: 0.5rem 0;
            }

            .three {
              font-size: 0.9375rem;
              color: $text-color;
            }
          }
        }

        .child-li {
          display: flex;
          width: 100%;
          padding: 0 0 0.9375rem 0.5rem;
          transition: all 0.3s;

          .left {
            width: 3rem;
            min-width: 3rem;
            text-align: right;

            .img {
              width: 2.5rem;
              height: 1.875rem;
              border-radius: 50%;

              img {
                border-radius: 50%;
                width: 1.875rem;
                height: 100%;
              }
            }
          }

          .right {
            flex: 1;

            .one {
              display: flex;
              width: 100%;

              .nickname {
                flex: 2;
                font-size: 0.875rem;
                color: $text-color;
                font-weight: 600;

                .reply {
                  font-weight: 500;
                  margin: 0 0.5rem;
                }
              }

              .button {
                flex: 1;
                text-align: right;

                span {
                  margin-left: 1rem;
                }
              }
            }

            .two {
              font-size: 0.75rem;
              color: #767676;
              padding: 0.25rem 0;
            }

            .three {
              font-size: 0.875rem;
              color: $text-color;
            }
          }
        }

        .more1 {
          padding-left: 3.5rem;
          color: #4d88df;
        }
      }
    }

    .send {
      height: 3.125rem;
      position: fixed;
      bottom: 0;
      background: #fff;
      width: 100%;
      box-shadow: 0 3px 5px 2px #91bcbcbc;
      display: flex;

      .left {
        flex: 1;
        text-align: center;
        margin: auto;

        input {
          border: 0;
          background: #f5f5f5;
          width: 85%;
          margin: auto;
          border-radius: 3rem;
          height: 2rem;
          line-height: 2rem;
          padding-left: 1.5rem;
        }
      }

      .right {
        width: 3.5625rem;
        line-height: 3.125rem;
        color: #fff;
        background: #ff5c00;
        text-align: center;
      }
    }

    .commit {
      .commit1 {
        position: fixed;
        right: 1.05rem;
        bottom: 11.75rem;
        width: 2.1875rem;
        height: 2.1875rem;
        line-height: 2.1875rem;
        font-size: 12px;
        border-radius: 50%;
        text-align: center;
        color: #fff;
        background: #f15353;
      }
    }
  }

  .btitle {
    font-size: 1rem;
    color: $text-color;
    font-weight: 700;
    border-left: 2px solid $orange;
    padding-left: 0.5rem;
    line-height: 1rem;
  }
}

.pcStyle .commit .commit1 {
  left: 50%;
  margin-left: 130px;
}

.pcStyle #case-detail-mobile .send {
  width: 375px;
}
</style>
<style>
#case-detail-mobile .details img {
  width: 100%;
}

</style>
