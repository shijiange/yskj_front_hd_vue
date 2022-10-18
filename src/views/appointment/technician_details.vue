<template>
  <div id="technician">
    <c-title :hide="false" :text="appointmentLang.worker+'详情'">
    </c-title>
    <div class="info_message">
      <div class="head_sculpture">
        <img :src="worker.thumb" alt="">
      </div>
      <div class="message">
        <div class="name">{{worker.name}}</div>
      </div>
      <div class="star_level">
        <van-rate v-model="worker.score" style="text-align: left;" readonly  :size="14" />
      </div>
      <div style="text-align: center;">
        <div v-show="worker.tags" class="tag" v-for="(item,index) in worker.tags" :key="index">{{item}}</div>
      </div>
    </div>
    <div class="bespoke">
        <div class="tips">前面有{{worker.has_appointment_count}}人预约</div>
        <div class="time_selection" @click="toUrl('showAppointment',{worker_id: worker.id})">
          <div class="left">可预约日期</div>
          <div class="right">
            <i class="fa fa-angle-right" style="font-size: 1.5rem;"></i>
          </div>
        </div>
    </div>
    <div class="store_list">
      <div class="store_list_li" v-show="pullDownBtnShow?(index==0):true" v-for="(item,index) in store" :key="index" @click="toRouter(item.id)">
        <div class="left">
          <div class="top">
            <div class="name">{{item.store_name}}</div>
          </div>
          <div class="bottom">
            <div class="start">
              <van-rate v-model="item.score" style="text-align: left;" readonly  :size="14" />
            </div>
            <div class="distance">
              <van-icon slot="icon" name="location-o" size="1.125rem" color="#ccc"></van-icon>
              <div class="distance_right">{{item.distance}}km</div>
            </div>
          </div>
        </div>
        <div class="right">
          <i class="fa fa-angle-right" style="font-size: 1.5rem;"></i>
        </div>
      </div>
      <div class="pull_down" v-if="store && store.length>1" @click.stop="pullDownBtn">
        <i class="fa fa-angle-down" style="font-size: 1.2rem;" v-if="pullDownBtnShow"></i>
        <i class="fa fa-angle-up" style="font-size: 1rem;" v-else></i>
      </div>
    </div>
    <div class="message_list">
      <van-tabs v-model="active" title-active-color="#f49f19" animated sticky color="#f49f19" @change="tabDataBtn">
        <van-tab title="详情">
          <div class="goods_content" v-html="worker.content"></div>
        </van-tab>
        <van-tab :title="appointmentLang.project">
          <ul class="project"  v-for="(item,index) in projects" :key="index" @click="goProject(item.id)">
            <li>
                <div class="left">
                  <img :src="item.thumb" alt="">
                </div>
                <div class="right">
                  <div class="top">{{item.title}}</div>
<!--                  <div class="bottom">通过美容仪器,打造小V脸,告别大饼脸打造小V脸,告别大饼脸</div>-->
                </div>
            </li>
          </ul>
        </van-tab>
        <van-tab title="评价">
          <div class="evaluate">
            <ul>
              <li v-for="(item,index) in commentList" :key="index">
                <div class="evaluate_left">
                  <img :src="item.head_img_url" alt="">
                </div>
                <div class="evaluate_right">
                    <div class="top">
                      <div class="left">
                        <div class="name">{{item.nick_name}}</div>
                        <div class="stella">
                          <van-rate v-model="item.worker_level" style="text-align: left;" readonly  :size="14" />
                        </div>
                      </div>
                      <div class="right">{{item.created_at}}</div>
                    </div>
                    <div class="bottom">
                        <div class="assess">{{item.content}}</div>
                        <div class="picture">
                          <div class="picture_li" v-for="(itemChildren,indexChildren) in item.images" :key="indexChildren">
                            <img :src="itemChildren" alt="">
                          </div>
                        </div>
                    </div>
                </div>
              </li>
            </ul>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import technician_details_controller from "./technician_details_controller";
export default technician_details_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    #technician {
      background: #fff;
      padding-top: 0.5rem;

      .info_message {
        padding-top: 0.72rem;
        width: 21.56rem;
        background-color: #fff;
        box-shadow:
          0 0 1.25rem 0
          rgba(108, 108, 108, 0.1);
        border-radius: 0.16rem;
        margin: 0 auto 1rem;

        .head_sculpture {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          margin: 0 auto 0.44rem;

          img {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
          }
        }

        .message {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 0.34rem;

          .name {
            height: 0.91rem;
            line-height: 0.91rem;
            font-size: 16px;
            text-align: center;
            flex: 0 0 6rem;
          }
        }

        .tag {
          line-height: 0.91rem;
          text-align: center;
          border-radius: 0.9rem;
          border: solid 0.05rem #f4a82e;
          padding: 0.2rem 0.3rem;
          font-size: 14px;
          margin: 0.2rem;
          color: #f4a82e;
          display: inline-block;
        }
      }

      .bespoke {
        margin-left: 0.78rem;
        margin-right: 0.78rem;
        margin-bottom: 1.09rem;

        .tips {
          margin-left: 0.41rem;
          text-align: left;
          height: 0.78rem;
          line-height: 0.78rem;
          font-size: 15px;
          color: #999;
          margin-bottom: 0.63rem;
        }

        .time_selection {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 2.25rem;
          background-color: #fff;
          box-shadow:
            0 0 0.5rem 0
            rgba(108, 108, 108, 0.1);
          border-radius: 0.16rem;
          font-size: 16px;
          padding-left: 0.41rem;
          padding-right: 0.34rem;
        }
      }

      .store_list {
        position: relative;
        margin-left: 0.78rem;
        margin-right: 0.78rem;
        background-color: #fff;
        box-shadow: 0 0 0.5rem 0 rgba(108, 108, 108, 0.1);
        border-radius: 0.16rem;
        margin-bottom: 0.73rem;

        .store_list_li {
          position: relative;
          z-index: 2;
          text-align: left;
          display: flex;
          align-items: center;
          padding: 0.53rem  0.38rem  0.47rem 0.41rem;
          justify-content: space-between;

          .left {
            .name {
              font-size: 16px;
              color: #000;
              margin-bottom: 0.56rem;
              height: 1.2rem;
            }

            .bottom {
              padding-left: 0.41rem;
              display: flex;
              align-items: center;

              .distance {
                display: flex;
                height: 1.5rem;
                align-items: center;
                font-size: 14px;
                margin-left: 0.53rem;
                padding-left: 0.59rem;
                border-left: 1px solid #f2f2f7;

                .distance_right {
                  line-height: 1.5rem;
                  height: 1.5rem;
                }
              }
            }
          }
        }

        .pull_down {
          position: absolute;
          left: 50%;
          bottom: -0.53rem;
          margin-left: -1.375rem;
          width: 3.47rem;
          height: 1rem;
          z-index: 10;
          background-color: #fff;
          box-shadow:
            0.09rem 0.08rem 0.46rem 0.04rem
            rgba(108, 108, 108, 0.07);
          border-radius: 0.44rem;
        }
      }

      .message_list {
        background: #fff;
        min-height: 100vh;

        .goods_content {
          padding: 0.5rem 1rem;
        }

        .goods_content img {
          width: 100%;
        }

        .project {
          li {
            padding-top: 0.59rem;
            padding-bottom: 0.56rem;
            margin-left: 0.81rem;
            margin-right: 0.81rem;
            display: flex;
            background: #fff;

            .left {
              width: 5.06rem;
              height: 5.09rem;
              border-radius: 0.38rem;

              img {
                width: 5.06rem;
                height: 5.06rem;
              }
            }

            .right {
              text-align: left;
              padding: 0.5rem;

              .top {
                flex: 1;
                display: -webkit-box;
                line-height: 1rem;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                margin-bottom: 0.3rem;
                font-size: 1rem;
              }

              .bottom {
                padding-top: 0.31rem;
                flex: 1;
                height: 3.76rem;
                font-size: 14px;
                line-height: 0.94rem;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 5;
                overflow: hidden;
                color: #999;
              }
            }
          }
        }

        .evaluate {
          margin: 0.5rem;

          ul {
            li {
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
                    text-align: left;

                    .name {
                      width: 9rem;
                      font-size: 16px;
                      line-height: 1rem;
                      height: 1rem;
                      text-align: left;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
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
          }
        }
      }
    }
</style>
