<template>
  <div id="microhomepage">
    <c-title :hide="false" text="个人主页"></c-title>
    <!--<div style="height: 20px;display: block;background: #fff;"></div>-->
    <div class="header">
      <div class="header_content">
        <div class="header_left">
          <img :src="homepageData.avatar" alt="" />
        </div>
        <div class="headet_right">
          <div class="headet_right_top">
            <div class="name">{{ homepageData.nickname }}</div>
            <div v-if="homepageData.is_own != 1" class="attention" @click="attentionBtn">{{ homepageData.is_follow ? "已关注" : "+关注" }}</div>
          </div>
          <div class="bottom bottom2" @click="introductionInp" v-if="homepageData.is_own == 1">
            <template v-if="homepageData.signature"> {{ homepageData.signature }}</template>
            <template v-else>
              <div class="b_left">个性签名</div>
              <div class="b_right"><img src="../../assets/images/micro_communities/home_autograph@2x.png" /></div>
            </template>
          </div>
          <div class="headet_right_bottom  bottom2" v-if="homepageData.is_own != 1">{{ homepageData.signature }}</div>
        </div>
      </div>
      <!-- 李晓红 (和对应的css) start -->
      <div class="tabMicroVideo">
        <div class="nowActive  tabItem"  @click="toMicroHomePage()">社区</div>
        <div class="tabItem"   @click="toMyVideoPage()">视频</div>
      </div>
      <!-- 李晓红  end -->
    </div>
    <div class="display_page">
      <div class="page_nav">
        <ul>
          <li>
            <div class="left" @click="gotoFanList()">关注</div>
            <div class="right">{{ homepageData.follow_num }}</div>
          </li>
          <li>
            <div class="left" @click="gotoFanList()">粉丝</div>
            <div class="right">{{ homepageData.fans_num }}</div>
          </li>
          <li>
            <div class="left">获赞</div>
            <div class="right">{{ homepageData.harvest_num }}</div>
          </li>
        </ul>
      </div>
      <div v-if="homepageData.is_own != 1" class="page_nav_content">
        <ul class="nav_label" v-if="homepageData.trick_num">
          <li>全部帖子({{ homepageData.trick_num }})</li>
        </ul>
        <!-- <div class="video_list"> -->
        <!-- <c-flow :list='catelist_list' @loadMore="loadMore" :showLoading="listloading"></c-flow> -->
        <!-- ==================================================== -->
        <!-- <ul v-if="false">
            <li v-for="(item,index) in catelist"
                @click="jumpDetails(item.has_many_image[0].stick_id)">
              <div class="top">
                <img :src="item.has_many_image[0].url"
                     alt="">
              </div>
              <div class="bottom">
                <div class="title">{{item.title}}</div>
                <div class="content">
                  <div class="headmessage">
                    <div class="left">
                      <img :src="item.has_one_stick_user.avatar"
                           alt="">
                    </div>
                    <div class="name">{{item.has_one_stick_user.nickname}}</div>
                  </div>
                  <div class="thumbup">
                    <div class="right">
                      <img src="../../assets/images/micro_communities/detail_praise@2x.png"
                           alt="">
                    </div>
                    <div class="num">{{item.praise_num}}</div>
                  </div>
                </div>
              </div>
            </li>
          </ul> -->
        <!-- </div> -->
      </div>
      <template v-if="homepageData.is_own == 1">
        <van-sticky>
          <van-tabs v-model="active" @change="getClassificationBtn" style="background: #f9f5f5;" swipeable>
            <van-tab :title="'帖子(' + (homepageData.review_true_num || 0) + ')'"></van-tab>
            <van-tab :title="'未审核帖子(' + (homepageData.review_false_num || 0) + ')'"></van-tab>
            <van-tab :title="'赞过(' + (homepageData.praise_num || 0) + ')'"></van-tab>
          </van-tabs>
        </van-sticky>
      </template>
      <div class="video_list">
        <c-flow
          :list="catelist_list"
          @loadMore="loadMore"
          @isclickfun="isclickfun"
          :showLoading="listloading"
          :isclick="isclick"
          :nowClick="homepageData.is_own == 1 && active == 1 ? true : false"
          :fatherTitle="fatherTitle"
        ></c-flow>
      </div>
    </div>
    <van-popup v-model="mainCommentShow" position="bottom">
      <div class="replyMainComment">
        <div class="left">
          <van-field v-model="maincomment"  rows="1" autosize type="textarea" placeholder="请留下你的简介吧" />
        </div>
        <div class="right" @click="subMainBtn">发送</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import microhomepage_controller from "./microhomepage_controller";
export default microhomepage_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#microhomepage {
  .header {
    padding-top: 0.94rem;
    padding-bottom: 0.63rem;
    background-color: #fff;

    .tabMicroVideo{
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      background-color: #fff;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      box-sizing: content-box;
      height: 100%;
      padding-bottom: 15px;
      margin-top: 1rem;

      .tabItem{
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0 4px;
        color: #646566;
        font-size: 14px;
        line-height: 20px;
        cursor: pointer;
      }

    .nowActive{border-bottom:1px solid #ee0a24;}
  }

    .header_content {
      width: 21.94rem;
      height: 6.25rem;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 0.5rem;
      box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.2);
      padding-left: 0.63rem;
      padding-right: 0.66rem;
      display: flex;
      justify-content: space-between;
      padding-top: 1.25rem;

      .header_left {
        width: 3.75rem;
        height: 3.75rem;
        margin-right: 0.66rem;

        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }

      .headet_right {
        flex: 1;

        .headet_right_top {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.66rem;

          .name {
            font-size: 1rem;
            height: 1.63rem;
            line-height: 1.63rem;
            color: #333;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 8rem;
            text-align: left;
          }

          .attention {
            width: 5rem;
            height: 1.63rem;
            background-color: #f15353;
            border-radius: 0.81rem;
            line-height: 1.63rem;
            font-size: 0.88rem;
            color: #fff;
          }
        }

        .headet_right_bottom {
          width: 100%;
          font-size: 0.88rem;
          line-height: 0.75rem;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
        }

        .bottom {
          display: flex;
          align-items: center;

          .b_left {
            color: #999;
            font-size: 0.88rem;
          }

          .b_right {
            width: 0.9rem;
            height: 0.9rem;

            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
        }
        .bottom2{
          color:#999!important;
        }
      }
    }
  }

  .display_page {
    .page_nav {
      background: #fff;
      border-bottom: 0.06rem solid #e5e5e5;

      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 1.34rem;
        padding-right: 1.34rem;

        li {
          height: 2.5rem;
          line-height: 2.5rem;
          font-size: 1rem;
          display: flex;
          align-items: center;
        }
      }
    }

    .page_nav_content {
      .nav_label {
        background: #fff;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding-left: 0.75rem;
        padding-top: 0.63rem;
        padding-right: 0.75rem;

        li {
          background-color: #f9f9f9;
          border-radius: 0.75rem;
          height: 1.5rem;
          line-height: 1.5rem;
          font-size: 0.88rem;
          padding-left: 0.63rem;
          padding-right: 0.63rem;
          margin-bottom: 0.63rem;
          margin-right: 0.63rem;
        }
      }
    }

    .video_list {
      ul {
        margin-top: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        justify-content: space-between;

        li {
          border-radius: 0.38rem;
          width: 10.59rem;
          background-color: #fff;
          padding-bottom: 0.69rem;
          margin-bottom: 0.75rem;
          overflow: hidden;

          .top {
            min-height: 14.06rem;

            img {
              width: 100%;
            }
          }

          .bottom {
            padding-left: 0.59rem;

            .title {
              padding-top: 0.63rem;
              font-size: 0.84rem;
              line-height: 0.84rem;
              display: -webkit-box;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              text-align: left;
              margin-bottom: 0.59rem;
            }

            .content {
              display: flex;
              justify-content: space-between;

              .headmessage {
                display: flex;

                .left {
                  width: 1.13rem;
                  height: 1.13rem;
                  border-radius: 50%;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .name {
                  margin-left: 0.31rem;
                  height: 1.13rem;
                  line-height: 1.13rem;
                  text-align: left;
                  color: #8c8c8c;
                  font-size: 0.69rem;
                }
              }

              .thumbup {
                display: flex;
                padding-top: 0.16rem;

                .right {
                  width: 0.81rem;
                  height: 0.84rem;
                  margin-right: 0.38rem;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .num {
                  min-width: 2rem;
                  max-width: 8rem;
                  text-align: left;
                  color: #333;
                  font-size: 0.75rem;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
      }
    }
  }

    .replyMainComment {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      padding-left: 1rem;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      .left {
        width: 18.13rem;
        background-color: #f5f5f5;
        padding: 0.2rem;
        .van-cell{
          padding:5px;
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
