<template>
  <div id="home_page">
    <c-title :hide="false" text="酒店主页"></c-title>
    <div id="content">
      <div class="scroll_banner">
        <img :src="data_info.logourl" />
      </div>
      <div class="position">
        <div class="name">
          <h1 style="-webkit-box-orient: vertical;">
            {{data_info.name}}
          </h1>
        </div>
        <ul class="content_a">
          <li class="distance">
            <i class="iconfont icon-service_n"></i>
            <p>
              {{data_info.address}}<span>距离我{{(data_info.distance/1000)+'km'}}</span>
            </p>
            <div class="right"
                 @click="goToAdress(data_info.longitude,data_info.latitude)">
              <span>地图</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </li>
          <li class="phone">
            <i class="iconfont icon-service_m"></i>
            <a :href="phone">{{data_info.tel}}</a>
          </li>
          <!-- 酒店详情/设施 -->
          <li class="hotel_detail">
            <span>酒店设施</span>
            <div class="right">
              <span>{{data_info.other_name}}</span>
            </div>
          </li>
        </ul>
        <!-- 查看房型 -->
        <div class="content_b">
          <div class="type_box">
            <div class="room_box"
                 v-for="(item,i) in data_info.fang_jan"
                 :key='i'>
              <div class="img">
                <img :src="item.image_1" />
              </div>
              <ul class="info_box">
                <li class="info_a">{{ item.name }}</li>
                <li class="info_b">
                  <button type="button"
                          @click="gotoGoods(item.id)">
                    预定
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./homepage_controller";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #home_page {
    #content {
      .scroll_banner {
        background: #f8f8f8;
        overflow: hidden;
        height: 12.5rem;
        position: relative;

        img {
          width: 100%;
        }
      }

      .position {
        position: relative;
        top: 0;

        .name {
          width: 100%;
          background: #fff;
          border-radius: 0;
          margin: 0 auto;
          padding: 0.75rem 0.875rem;
          display: flex;
          justify-content: space-between;

          h1 {
            width: 16.25rem;
            font-size: 18px;
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;

            span {
              font-weight: normal;
              color: #8c8c8c;
              font-size: 14px;
              margin-left: 0.625rem;
            }
          }
        }

        .content_a {
          padding: 0 0.875rem;
          background: #fff;
          margin-top: 0.625rem;

          .distance {
            padding: 0.625rem 0;
            display: flex;
            position: relative;

            i {
              font-size: 1rem;
              color: #666;
              margin-right: 0.375rem;
            }

            p {
              font-size: 14px;
              text-align: left;
              width: 16.875rem;

              span {
                color: #8c8c8c;
                margin-left: 0.625rem;
                font-size: 12px;
              }
            }

            .right {
              position: absolute;
              right: 0;
              display: flex;
              font-size: 14px;
              color: #60a9f3;
              align-items: center;

              .fa {
                font-size: 1rem;
                color: #60a9f3;
                margin-left: 0.375rem;
              }
            }
          }

          .phone {
            display: flex;
            padding: 0.625rem 0;

            i {
              font-size: 1rem;
              color: #666;
              margin-right: 0.375rem;
            }

            span {
              font-size: 16px;
            }
          }

          .hotel_detail {
            height: 2.75rem;
            line-height: 2.75rem;
            display: flex;
            justify-content: space-between;
            border-top: solid 0.0625rem #ebebeb;
            font-size: 16px;

            .right {
              right: 0;
              display: flex;
              font-size: 12px;
              color: #60a9f3;
              align-items: center;

              .fa {
                font-size: 1rem;
                color: #60a9f3;
                margin-left: 0.375rem;
              }
            }
          }
        }

        .content_b {
          background: #fff;
          padding: 0.625rem 0;
          margin-top: 0.625rem;

          h1 {
            padding: 0 0.875rem;
            text-align: left;
            font-size: 16px;
            line-height: 2.5rem;

            span {
              color: #8c8c8c;
              font-size: 14px;
              margin-left: 0.625rem;
              font-weight: normal;
            }
          }

          .time {
            width: 21.5625rem;
            height: 2.75rem;
            margin: 0 auto;
            border-radius: 0.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .time_a,
            .time_c {
              font-size: 16px;
              font-weight: bold;

              span {
                font-size: 12px;
                margin-left: 0.375rem;
                color: #8c8c8c;
                font-weight: normal;
              }
            }

            .time_b {
              span {
                font-size: 13px;
                border: solid 0.0625rem #ebebeb;
                border-radius: 1rem;
                padding: 0.125rem 0.625rem;
              }
            }
          }

          .type_box {
            padding: 0 0.875rem;

            .room_box {
              border-bottom: solid 0.0625rem #ebebeb;
              display: flex;
              padding: 0.875rem 0;

              .img {
                width: 4rem;
                height: 4rem;
                border-radius: 0.25rem;
                overflow: hidden;
                margin-right: 0.625rem;
                background: #f2f2f2;

                img {
                  width: 100%;
                }
              }

              .info_box {
                width: 17.0625rem;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .info_a {
                  font-size: 15px;
                  font-weight: bold;
                  max-width: 150px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .info_b {
                  text-align: right;

                  .price {
                    line-height: 2.125rem;
                    color: #8c8c8c;
                    font-size: 12px;

                    span {
                      font-weight: bold;
                      color: #f15353;
                    }

                    font {
                      font-size: 20px;
                      font-weight: bold;
                      color: #f15353;
                    }
                  }

                  button {
                    background: #f15353;
                    color: #fff;
                    font-size: 14px;
                    width: 4.25rem;
                    height: 1.625rem;
                    border-radius: 1rem;
                    border: none;
                  }
                }
              }
            }

            .room_box:last-child {
              border: 0;
            }
          }
        }

        .info_a {
          background: #fff;
          margin-top: 0.625rem;
          padding-bottom: 0.625rem;

          h3 {
            height: 2.625rem;
            line-height: 2.625rem;
            text-align: left;
            padding: 0 0.875rem;
            font-size: 16px;

            i {
              position: absolute;
              right: 0.875rem;
              font-size: 1.125rem;
              color: #c9c9c9;
              line-height: 2.625rem;
            }
          }

          .time,
          .notice {
            padding: 0 0.875rem;

            .time_a,
            .notice_a {
              display: flex;
              line-height: 1.875rem;
              text-align: left;
              font-size: 14px;
              font-weight: bold;

              i {
                font-size: 1.5rem;
                color: #333;
                margin-right: 0.625rem;
              }
            }

            .time_b,
            .notice_b {
              color: #8c8c8c;
              font-size: 14px;
              text-align: left;
            }

            .notice {
              margin-top: 0.625rem;
            }
          }
        }
      }
    }
  }
</style>
