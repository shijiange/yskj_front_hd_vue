<template>
  <div id="project_details">
    <div class="rotation" ref="rotation" :style="{ height: fun.getPhoneEnv() == 3 ? '375px' : '100vw' }">
      <div class="top" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }" :class="{ display: display }">
        <div class="left">
          <div class="little_icon" @click="goBack">
            <i class="iconfont icon-member-left" style="line-height: 1.5rem;"></i>
          </div>
        </div>
        <div class="right">
          <div class="little_icon" @click="gotoPage('home')">
            <i class="iconfont icon-ai-home"></i>
          </div>
          <div class="little_icon" style="margin-left: 0.47rem;" @click="gotoPage('member')">
            <i class="iconfont icon-wode-wode"></i>
          </div>
        </div>
      </div>
      <c-myswipe :style="{ height: fun.getPhoneEnv() == 3 ? '375px' : '100vw' }"
                 :pagination-visible="true"
                 :slides="project.banner_imgs"
                 :repeating="true"
                 :auto="0">
        <div v-for="(ithumb, index) in project.banner_imgs"
             :key="index">
          <template v-if="ithumb">
            <img :src="ithumb"
                 width="100%"/>
          </template>
        </div>
      </c-myswipe>
      <!--      <div style="width: 100%;padding-top: 2rem">-->
      <!--        <img :src="project.thumb" width="100%"/>-->
      <!--      </div>-->

    </div>
    <div class="project_title">
      <p>{{project.title}}</p>
    </div>
    <div class="project_list">
      <van-tabs v-model="active" title-active-color="#f49f19" animated sticky color="#f49f19" @change="tabDataBtn">
        <van-tab title="详情">
          <div class="goods_content" v-html="project.content"></div>
        </van-tab>
        <van-tab title="商品">
          <div class="goodsList">
            <ul>
              <li v-for="(item,index) in goods" :key="index" @click="goGoodsBtn(item.id)">
                <div class="goods_left">
                  <img :src="item.thumb" alt="">
                </div>
                <div class="goods_right">
                  <div class="goods_name" style="-webkit-box-orient: vertical;">
                    {{item.title}}
                  </div>
                  <div class="goods_message">
                    <div class="left">{{$i18n.t("money")}}{{item.price}}</div>
                    <div class="right">已售{{item.show_sales}}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </van-tab>
        <van-tab title="评价">
          <div class="evaluate">
            <ul>
              <li v-for="(item,index) in commentList" :key="index">
                <div class="evaluate_top">
                  <div class="evaluate_left" v-if="item.head_img_url">
                    <img :src="item.head_img_url" alt="">
                  </div>
                  <div class="evaluate_right">
                    <div class="top">
                      <div class="left">
                        <div class="name">{{item.nick_name}}</div>
                        <div class="stella">
                          <van-rate v-model="item.project_level" readonly style="text-align: left;" :size="14"/>
                        </div>
                      </div>
                      <div class="right">{{item.created_at}}</div>
                    </div>
                    <div class="bottom">
                      <div class="assess">{{item.content}}</div>
                      <div class="picture">
                        <div class="picture_li" v-for="(itemChildren,indexChildren) in item.images"
                             :key="indexChildren">
                          <img :src="itemChildren" alt="">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="evaluate_bottom">
                  <div class="many_reply" v-if="item.has_many_reply && item.has_many_reply.length>0">
                    <div v-for="items in item.has_many_reply" :key="items.id">
                      <p style="padding: 0.5rem 1rem; text-align: left;">
                        追加评论： {{items.content}}
                      </p>
                      <div class="imgflex">
                        <div v-for="(val, index) in items.images" :key="index">
                          <div class="photobox">
                            <img
                              :src="val"
                              style="width: 100%; height: 100%; object-fit: contain;"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="comment-time" style="text-align: left;">{{items.created_at}}</div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </van-tab>
        <van-tab :title="appointmentLang.service+'门店'">
          <ul class="store_list">
            <li v-for="(item,index) in store" :key="index" @click="toRouter(item.id)">
              <div class="store_list_left">
                <img :src="item.thumb" alt="">
              </div>
              <div class="store_list_right">
                <div class="top">
                  <div class="name">{{item.store_name}}</div>
                  <div class="distance">{{item.distance}}km</div>
                </div>
                <div style="display: flex;"><span class="time">营业时间:{{item.business_hours_start}}-{{item.business_hours_end}}</span>
                  <div class="consult">咨询</div>
                </div>
                <div style="-webkit-box-orient: vertical;" class="address">
                  <i class="iconfont icon-icon_location" style="font-size: 14px; color: #f4a82e;"></i>
                  {{item.address}}
                </div>
              </div>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import project_details_controller from "./project_details_controller";

export default project_details_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #project_details {
    .project_title {
      background: #fff;
      padding: 0.5rem;
      font-weight: bold;
      line-height: 1.5rem;
      font-size: 1rem;
      text-align: left;
      color: #333;
      margin-bottom: 0.5rem;

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
      }
    }

    .rotation {
      width: 100%;

      .top {
        position: fixed;
        width: 100%;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem;

        /* background: #FFFFFF; */
        .little_icon {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background-color: #000;
          opacity: 0.3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #fff;
        }

        .left {
          margin-left: 0.78rem;
        }

        .right {
          display: flex;
          align-items: center;
          margin-right: 0.5rem;
        }
      }

      .display {
        display: none;
      }

      img {
        width: 100%;
      }
    }

    .project_list {
      background: #fff;
      min-height: 100vh;

      .goods_content {
        padding: 0.5rem 1rem;
      }

      .goodsList {
        ul {
          li {
            padding: 0.5rem;
            display: flex;

            .goods_left {
              width: 5.06rem;
              height: 5.06rem;
              border-radius: 0.38rem;

              img {
                width: 5.06rem;
                height: 5.06rem;
              }
            }

            .goods_right {
              flex: 1;
              background: #fff;
              padding: 0.5rem;

              .goods_name {
                line-height: 1.2rem;
                font-size: 1rem;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                padding-left: 0.63rem;
                text-align: left;
                margin-bottom: 0.4rem;
              }

              .goods_message {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-left: 0.63rem;

                .left {
                  font-size: 1rem;
                  line-height: 1.5rem;
                  color: #ffac27;
                }

                .right {
                  font-size: 0.8rem;
                  line-height: 1.5rem;
                  color: #ccc;
                }
              }
            }
          }
        }
      }

      .evaluate {
        padding-left: 0.78rem;

        ul {
          li {
            .evaluate_top {
              padding-left: 0.47rem;
              padding-top: 0.41rem;
              display: flex;

              .evaluate_left {
                width: 2rem;
                height: 2rem;

                img {
                  width: 2rem;
                  height: 2rem;
                  border-radius: 50%;
                }
              }

              .evaluate_right {
                flex: 1;
                padding-left: 0.5rem;

                .top {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding-top: 0.09rem;

                  .left {
                    .name {
                      font-size: 16px;
                      line-height: 1rem;
                      height: 1rem;
                      text-align: left;
                    }
                  }

                  .right {
                    line-height: 1rem;
                    height: 1rem;
                    font-size: 14px;
                    color: #999;
                    padding-right: 1.09rem;
                  }
                }

                .bottom {
                  .assess {
                    text-align: left;
                    font-size: 14px;
                    line-height: 0.94rem;
                    max-height: 3.76rem;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 4;
                    overflow: hidden;
                    color: #333;
                    padding-bottom: 0.69rem;
                  }

                  .picture {
                    display: flex;
                    flex-wrap: wrap;
                    margin-bottom: 1.25rem;

                    .picture_li {
                      width: 4.31rem;
                      height: 4.31rem;
                      margin-left: 0.56rem;

                      img {
                        width: 4.31rem;
                        height: 4.31rem;
                      }
                    }
                  }
                }
              }
            }

            .evaluate_bottom {
              .many_reply {
                padding: 0 1rem;

                .comment-time {
                  font-size: 14px;
                  color: #999;
                  padding: 0.5rem 0.875rem;
                }

                .imgflex {
                  display: flex;
                  flex-wrap: wrap;
                  padding: 0 0.875rem;

                  .photobox {
                    position: relative;
                    width: 4.938rem;
                    height: 4.938rem;
                    background-color: #fcfcfc;
                    border-radius: 0.156rem;
                    border: solid 0.031rem #ccc;
                    overflow: hidden;
                    margin-right: 0.25rem;
                    margin-bottom: 0.25rem;
                  }
                }
              }
            }
          }
        }
      }

      .store_list {
        li {
          display: flex;
          padding: 0.59rem 1.16rem 0.63rem 0.63rem;
          border-bottom: 1px solid #f2f2f7;

          .store_list_left {
            width: 5.53rem;
            height: 5.03rem;

            img {
              width: 5.53rem;
              height: 100%;
            }
          }

          .store_list_right {
            margin-left: 0.63rem;

            .top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-top: 0.56rem;
              margin-bottom: 0.4rem;
              font-size: 14px;

              .name {
                font-size: 16px;
                line-height: 1.5rem;
                height: 1.5rem;
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 12rem;
                text-align: left;
              }

              .distance {
                line-height: 1.5rem;
                height: 1.5rem;
                color: #ccc;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 4rem;
              }
            }

            .time {
              text-align: left;
              line-height: 1.5rem;
              color: #666;
              flex: 1;
            }

            .address {
              text-align: left;
              line-height: 1.2rem;
              color: #f4a82e;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;

              /* -webkit-line-clamp: 2; */
            }

            .consult {
              color: #fff;
              width: 2.81rem;
              height: 1.38rem;
              background-color: #f4a82e;
              border-radius: 0.69rem;
              text-align: center;
              line-height: 1.38rem;
              flex: 0 0 3rem;
              margin-right: 0.5rem;
            }
          }
        }
      }
    }
  }
</style>
