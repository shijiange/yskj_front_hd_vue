<template>
  <div id="case-detail-pc">
    <navigation></navigation>
    <div class="all">
      <div class="nav">
        <span class="home" @click="gotoHome">首页</span> >
        <span class="home" v-if="second_category[0]" @click="gotoCategory(second_category[0].pid,second_category[0].id,2)">{{second_category[0].category_name || ''}}</span> >
        <span class="case">{{ datas.case_name }}</span>
      </div>
      <div class="detail">
        <div class="left">
          <div class="head">
            <div class="img">
              <img :src="datas.img_src || emptyImage" alt="" />
            </div>
            <div class="right">
              <div class="one">
                <div class="title">{{ datas.case_name }}</div>
                <div class="button" @click="creatPoster">
                  <i class="iconfont icon-bc_eweima"></i>
                  生成海报
                </div>
              </div>
              <div class="two">
                <i class="iconfont icon-ht_operation_perview"></i>
                {{ datas.read_num }}
              </div>
              <div class="three">
                <span class="name">分类：</span>
                <span class="category">
                  <span class="category-li" v-for="(item, index) in second_category" :key="index">{{
                    item.category_name
                  }}</span>
                </span>
              </div>
              <div class="four">
                <div class="four1">
                  <span class="name">区域：</span>
                  <span class="category">
                    <span class="category-li">
                      {{ datas.province ? datas.province.areaname : '' }}
                    </span>
                    <span class="category-li">
                      {{ datas.city ? datas.city.areaname : '' }}
                    </span>
                  </span>
                </div>
                <div class="four2" v-if="datas.member && datas.member != null">
                  发布会员：
                  <span>
                    {{ datas.member.nickname }}
                  </span>
                </div>
              </div>
              <div class="four">
                <div class="four1">
                  <span class="name">标签：</span>
                  <span class="category">
                    <span
                      class="category-li"
                      style="cursor: pointer;"
                      @click="gotoLabel(item.id)"
                      v-for="(item, index) in label"
                      :key="index"
                      >{{ item.label_name }}</span
                    >
                  </span>
                </div>
                <div class="four2">发布时间：{{ datas.created_at }}</div>
              </div>
            </div>
          </div>
          <div class="banner" v-if="ad3">
            <a :href="ad3.url">
              <img :src="ad3.pc_img || emptyImage" alt="" />
            </a>
          </div>
          <div class="content" style="margin-top: 30px;">
            <div class="title">
              <span class="title1"></span>
              <span class="title2">{{ datas.case_name }}介绍</span>
            </div>
          </div>
          <div class="content-html" v-html="datas.content"></div>
          <div class="content" style="margin-top: 30px;">
            <div class="title">
              <span class="title1"></span>
              <span class="title2">{{ datas.case_name }}截图</span>
            </div>
          </div>
          <div class="carousel">
            <!-- <el-carousel :autoplay="false" height="450px">
              <el-carousel-item
                v-for="(item, index) in screen_shot_src"
                :key="index"
                v-if="index % 3 == 0"
                style="display:flex;"
              >
                <img
                  v-if="screen_shot_src[index]"
                  :src="screen_shot_src[index]"
                  alt=""
                  style="width: auto;height: auto; max-width: 260px; max-height: 100%;"
                />

                <img
                  v-if="screen_shot_src[index + 1]"
                  :src="screen_shot_src[index + 1]"
                  alt=""
                  style="width: auto;height: auto; max-width: 260px; max-height: 100%;"
                />
                <img
                  v-if="screen_shot_src[index + 2]"
                  :src="screen_shot_src[index + 2]"
                  alt=""
                  style="width: auto;height: auto; max-width: 260px; max-height: 100%;"
                />
              </el-carousel-item>
            </el-carousel> -->
            <div class="image" style="height: 450px; position: relative; overflow: hidden;">
              <div ref="image" style="display: flex; position: relative; transition: all 0.3s; scrollbar-width: none; min-width: 798px;">
                <div :ref="'image'+index" v-for="(item, index) in screen_shot_src" :key="index" style="max-width: 798px; max-height: 450px; height: auto; width: auto; margin-right: 10px;">
                  <img :src="item || emptyImage" alt="" style="max-width: 798px; max-height: 450px; height: 450px; width: auto;" @click="showImage(index)">
                </div>
              </div>
              
              <button @click="goLast()" type="button" class="el-carousel__arrow el-carousel__arrow--left" style="background-color: #ccc;"><i class="el-icon-arrow-left"></i></button>
              <button @click="goNext()" type="button" class="el-carousel__arrow el-carousel__arrow--right" style="background-color: #ccc;"><i class="el-icon-arrow-right"></i></button>
            </div>
          </div>
          <div class="content" style="margin-top: 30px;">
            <div class="title">
              <span class="title1"></span>
              <span class="title2">{{ datas.case_name }}二维码</span>
            </div>
          </div>
          <div class="qr">
            <div class="qrli">
              <div class="img">
                <img :src="datas.img_h5_src || emptyImage" alt="" />
              </div>
              <div class="qrtext">H5/公众号二维码</div>
            </div>
            <div class="qrli">
              <div class="img">
                <img :src="datas.img_mini_src || emptyImage" alt="" />
              </div>
              <div class="qrtext">微信小程序二维码</div>
            </div>
          </div>
          <div class="content">
            <div class="title">
              <span class="title1"></span>
              <span class="title2">{{ datas.case_name }}评分</span>
            </div>
          </div>
          <div class="score">
            <div class="sleft">
              <div class="number">{{ datas.score }}</div>
              <div class="star">
                <div class="star1">
                  <van-rate
                    v-model="datas.score"
                    :size="17"
                    color="#ffd21e"
                    void-icon="star"
                    void-color="#eee"
                    readonly
                    allow-half
                  />
                </div>
                <div class="star2">共收到{{ datas.total_level }}条评论</div>
              </div>
            </div>
            <div class="sright">
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
          <div class="content">
            <div class="title">
              <span class="title1"></span>
              <span class="title2">{{ datas.case_name }}评论</span>
            </div>
          </div>
          <div class="comment">
            <div class="top">
              <span>请给案例库名称打分</span>
              <span>
                <van-rate v-model="star_value" :size="17" color="#ffd21e" void-icon="star" void-color="#eee" />
              </span>
            </div>
            <div>
              <van-field
                v-model="commit_text"
                placeholder="说点什么吧。。。"
                type="textarea"
                style="padding: 15px 0;"
                rows="6"
              />
            </div>
          </div>
          <div class="button">
            <span @click="sendMessage()">发表评论</span>
          </div>
          <div class="comment-ul">
            <div class="comment-li" v-for="(item, index) in comment" :key="index">
              <div class="img" v-if="item.member&&item.member!=null">
                <img :src="item.member.avatar || emptyImage" alt="" />
              </div>
              <div class="right">
                <div class="one">
                  <div class="nickname" v-if="item.member&&item.member!=null">{{ item.member.nickname }}</div>
                  <div class="time">{{ item.created_at }}</div>
                  <div class="li-button">
                    <span @click="openReply(item.id, '2', index)">
                      <i class="iconfont icon-ht_list_line_allmessage"></i>
                    </span>
                    <span v-if="item.member_id == uid || $store.state.caseLibrary.is_delete_comment == 1" @click="delComment(item.id, 'comment')">
                      <i class="iconfont icon-all_delete_1"></i>
                    </span>
                  </div>
                </div>
                <div class="two">
                  <van-rate
                    v-model="item.level"
                    :size="16"
                    color="#ffd21e"
                    void-icon="star"
                    void-color="#eee"
                    readonly
                    allow-half
                  />
                </div>
                <div class="three">
                  {{ item.content }}
                </div>
                <div class="four">
                  <div
                    class="reply-li"
                    v-for="(item1, index1) in item.reply"
                    :key="index1"
                    v-if="item.is_show || index1 == 0"
                  >
                    <div class="img" v-if="item1.member&&item1.member!=null">
                      <img :src="item1.member.avatar || emptyImage" alt="" />
                    </div>
                    <div class="right">
                      <div class="one">
                        <div class="nickname">
                          <span v-if="item1.member&&item1.member!=null">{{ item1.member.nickname }}</span>
                          <span class="reply" v-if="item1.reply_member != null">回复</span>
                          <span v-if="item1.reply_member != null">{{ item1.reply_member.nickname }}</span>
                        </div>
                        <div class="time">{{ item1.created_at }}</div>
                        <div class="li-button">
                          <span @click="openReply(item1.id, '1', index)">
                            <i class="iconfont icon-ht_list_line_allmessage"></i>
                          </span>
                          <span v-if="item1.member_id == uid || $store.state.caseLibrary.is_delete_comment == 1" @click="delComment(item1.id, 'reply')">
                            <i class="iconfont icon-all_delete_1"></i>
                          </span>
                        </div>
                      </div>
                      <div class="three">
                        {{ item1.content }}
                      </div>
                    </div>
                  </div>
                  <div class="more1" v-if="item.reply.length >= 2" @click="changeReplyLength(index)">
                    {{ item.is_show ? '收起' : '展开' + item.reply.length + '条回复' }}
                  </div>
                  <div class="edit-file" style="" v-show="item.text_show">
                    <!-- <van-field
                      v-model="commit_text"
                      placeholder="说点什么吧。。。"
                      type="textarea"
                      style="padding:15px;border:1px solid #eeeeee"
                      rows="3"
                      :ref="'reply_text'+index"
                    /> -->
                    <textarea
                      placeholder="说点什么吧。。。"
                      v-model="reply_text"
                      rows="3"
                      style="padding: 15px; border: 1px solid #eee; width: 100%;"
                      :ref="'reply_text' + index"
                    >
                    </textarea>
                    <div class="button">
                      <span @click="replyMessage()">回复</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="right-one">
            <div class="category-head">
              <span class="left-boredr"></span>
              <span class="name">{{ category_name || '' }}</span>
              <span class="name1" @click="getCategory">换一批⟳</span>
            </div>
            <div class="category-li" v-for="(item, index) in case_data" :key="index" @click="gotoCaseDetail(item.id)">
              <div class="img">
                <img :src="item.img_src || emptyImage" alt="" />
              </div>
              <div class="li-title">
                <div class="name">{{ item.case_name }}</div>
                <div class="rate">
                  <van-rate
                    v-model="item.level"
                    :size="15"
                    color="#ffd21e"
                    void-icon="star"
                    void-color="#eee"
                    readonly
                    allow-half
                  />
                  {{ item.level }}
                </div>
              </div>
            </div>
          </div>
          <div class="right-one">
            <div class="category-head">
              <span class="left-boredr"></span>
              <span class="name">热门案例</span>
            </div>
            <div class="category-li" v-for="(item, index) in hotCase" :key="index" @click="gotoCaseDetail(item.id)">
              <div class="img">
                <img :src="item.img_src || emptyImage" alt="" />
              </div>
              <div class="li-title">
                <div class="name">{{ item.case_name }}</div>
                <div class="rate">
                  <van-rate
                    v-model="item.level"
                    :size="15"
                    color="#ffd21e"
                    void-icon="star"
                    void-color="#eee"
                    readonly
                    allow-half
                  />
                  {{ item.level }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-popup
        v-model="posterShow"
        closeOnClickModal="true"
        style="width: 21.375rem; height: 41.4rem; padding: 0; background: none;"
      >
        <div style="width: 100%; height: 100%; overflow: hidden;" class="code_box">
          <img v-if="img_url" :src="img_url || emptyImage" style="width: 98%; border-radius: 0.375rem;" />
          <!-- 关闭图标 -->
          <div class="icon_close" @click="posterShow = false">
            <i class="iconfont icon-close11"></i>
          </div>
          <!--  -->
        </div>
      </van-popup>
    </div>
    <van-image-preview v-model="showBigImg" :images="screen_shot_src" :start-position="activeSkuIndex"> </van-image-preview>
    <bottomAdv></bottomAdv>
    <template class="bottom">
      <caseBottom v-if="$store.state.caseLibrary && $store.state.caseLibrary != null"></caseBottom>
    </template>
    <secrvicePc></secrvicePc>
  </div>
</template>

<script>
import case_detail_pc_controller from './case_detail_pc_controller';

export default case_detail_pc_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);
$yellow: #f5a623;

#case-detail-pc {
  background: #fff;

  .all {
    width: 1200px;
    margin: 0 auto;
    text-align: left;

    .nav {
      margin: 30px 0;

      .home {
        font-size: 14px;
        color: #333;
      }

      .home:hover {
        color: $orange;
        cursor: pointer;
      }

      .case {
        color: $orange;
      }
    }

    .detail {
      display: flex;

      .left {
        width: 860px;
        padding: 30px;
        border: 1px solid #eee;

        .head {
          display: flex;

          .img {
            width: 101px;
            height: 101px;
            min-width: 101px;
            margin: 10px 38px 0 5px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .right {
            flex: 1;

            .one {
              display: flex;
              width: 100%;
              align-items: center;

              .title {
                flex: 1;
                color: #202020;
                font-size: 22px;
                line-height: 27px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .button {
                width: 110px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                background: $orange;
                color: #fff;
                font-size: 16px;
                border-radius: 4px;
                cursor: pointer;
              }
            }

            .two {
              font-size: 12px;
              color: #828282;
            }

            .three {
              padding: 5px 0;

              span {
                display: inline-block;
              }

              .name {
                color: #828282;
                line-height: 24px;
              }

              .category {
                color: #333;
                line-height: 22px;

                .category-li {
                  padding: 0 10px;
                  margin: 0 6px;
                  border-radius: 4px;
                  background: #f4f4f4;
                }
              }
            }

            .four {
              display: flex;
              width: 100%;
              padding: 5px 0;

              .four1 {
                flex: 1;

                span {
                  display: inline-block;
                }

                .name {
                  color: #828282;
                  line-height: 24px;
                }

                .category {
                  color: #333;
                  line-height: 22px;

                  .category-li {
                    padding: 0 10px;
                    margin: 0 6px;
                    border-radius: 4px;
                    background: #f4f4f4;
                  }
                }
              }

              .four2 {
                width: 250px;
                font-size: 14px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }

        .banner {
          width: 800px;
          height: 150px;
          margin: 40px 0 60px 0;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .content {
          margin-bottom: 30px;

          .title {
            display: flex;
            align-items: center;

            .title1 {
              height: 16px;
              width: 2px;
              background: $orange;
              margin-right: 13px;
            }

            .title2 {
              color: #202020;
              font-size: 20px;
              line-height: 36px;
            }
          }
        }

        .qr {
          display: flex;

          .qrli {
            width: 189px;

            .img {
              width: 189px;
              height: 189px;
              padding: 10px;

              img {
                width: 160px;
                height: 160px;
              }
            }

            .qrtext {
              text-align: center;
              color: #202020;
              font-size: 16px;
              line-height: 36px;
            }
          }
        }

        .score {
          display: flex;
          align-items: center;

          .sleft {
            flex: 1;
            min-width: 400px;
            display: flex;
            justify-content: center;
            border-right: 1px dashed #eee;

            .number {
              color: $yellow;
              font-size: 48px;
              font-weight: 700;
            }

            .star {
              margin-left: 30px;

              .star2 {
                color: #333;
                font-size: 16px;
                line-height: 36px;
              }
            }
          }

          .sright {
            flex: 1;
            margin: 0 50px;
          }
        }

        .comment {
          padding: 0 18px;
          box-shadow: 1px 2px 10px #eee;

          .top {
            line-height: 60px;
            border-bottom: 1px dashed #eee;
          }
        }

        .button {
          text-align: right;
          margin-top: 19px;

          span {
            display: inline-block;
            height: 40px;
            line-height: 40px;
            width: 90px;
            border: $orange 1px solid;
            text-align: center;
            color: $orange;
            border-radius: 4px;
            cursor: pointer;
          }
        }

        .comment-ul {
          margin: 30px 0;

          .comment-li {
            padding: 30px 0;
            border-top: 1px dashed #eee;
            display: flex;

            .img {
              width: 46px;
              min-width: 46px;
              height: 46px;
              border-radius: 50%;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .right {
              flex: 1;
              margin-left: 12px;

              .one {
                display: flex;
                flex: 1;

                .nickname {
                  color: #202020;
                  font-size: 16px;
                  font-weight: 700;
                  margin-right: 30px;
                }

                .time {
                  color: #999;
                  font-size: 14px;
                  flex: 1;
                }

                .li-button {
                  text-align: right;
                  width: 150px;

                  span {
                    margin-left: 15px;
                    cursor: pointer;
                  }
                }
              }

              .two {
                padding: 15px 0;
              }

              .three {
                padding: 15px 0;
                color: #666;
                font-weight: 600;
              }

              .four {
                .reply-li {
                  padding: 15px 0;
                  display: flex;

                  .img {
                    width: 40px;
                    min-width: 40px;
                    height: 40px;
                    border-radius: 50%;

                    img {
                      width: 100%;
                      height: 100%;
                      border-radius: 50%;
                    }
                  }

                  .right {
                    flex: 1;
                    margin-left: 12px;

                    .one {
                      display: flex;
                      flex: 1;

                      .nickname {
                        color: #202020;
                        font-size: 16px;
                        font-weight: 700;
                        margin-right: 30px;

                        .reply {
                          margin: 0 10px;
                          font-weight: 500;
                        }
                      }

                      .time {
                        color: #999;
                        font-size: 14px;
                        flex: 1;
                      }

                      .li-button {
                        text-align: right;
                        width: 150px;

                        span {
                          margin-left: 15px;
                          cursor: pointer;
                        }
                      }
                    }

                    .three {
                      padding: 15px 0;
                      color: #666;
                      font-weight: 600;
                    }
                  }
                }

                .more1 {
                  color: $orange;
                  cursor: pointer;
                  margin-left: 52px;
                  padding-bottom: 15px;
                }
              }
            }
          }
        }
      }

      .right {
        width: 330px;
        margin-left: 10px;

        .right-one {
          margin-bottom: 30px;
          border: 1px solid #eee;

          .category-head {
            padding: 0 25px;
            height: 79px;
            line-height: 79px;
            display: flex;
            align-items: center;

            span {
              display: inline-block;
            }

            .left-boredr {
              height: 16px;
              width: 2px;
              background: $orange;
              margin-right: 13px;
            }

            .name {
              font-size: 20px;
              color: #202020;
              flex: 1;
              white-space: nowrap;
            }

            .name1 {
              width: 60px;
              white-space: nowrap;
              text-align: right;
              color: $orange;
              cursor: pointer;
            }
          }

          .category-li {
            padding: 25px;
            border-top: 1px solid #eee;
            display: flex;
            cursor: pointer;

            .img {
              width: 80px;
              min-width: 80px;
              height: 80px;
              margin-right: 16px;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .li-title {
              display: flex;
              justify-content: center;
              // align-items: center;
              flex-direction: column;

              .name {
                font-size: 20px;
                line-height: 48px;
                width: 167px;
                color: #202020;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .rate {
                color: #828282;
              }
            }
          }
        }
      }
    }
  }

  .code_box {
    position: relative;
    display: flex;

    .icon_close {
      position: absolute;
      bottom: 0;
      right: 50%;
      width: 2.5rem;
      height: 2.5rem;
      margin-right: -1.25rem;
      border: 1px solid #fff;
      border-radius: 100%;
      text-align: center;

      i {
        line-height: 2.5rem;
        font-size: 1.125rem;
        color: #fff;
      }
    }
  }

  .color {
    color: $orange;
  }
}
</style>
<style>
#case-detail-pc .content-html img {
  max-width: 100%;
}
</style>
