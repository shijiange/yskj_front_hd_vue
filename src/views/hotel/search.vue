<template>
  <div id="hotel_search">
    <c-title :hide="false" :text="PageNameList.hotels + '搜索页'"></c-title>
    <div id="content">
      <div class="search_box">
        <div class="box">
          <i class="iconfont icon-sousuo1"></i>
          <input
            type="text"
            :placeholder="'关键字/位置/品牌/' + PageNameList.hotel_find_name"
            v-model="search_value"
          />
        </div>
        <span @click="gotoSearch">搜索</span>
      </div>
      <div class="like_box">
        <div class="title">
          <div class="line_left"></div>
          <h2>猜你喜欢</h2>
          <div class="line_right"></div>
        </div>
        <div class="goods_box">
          <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
            <hotel-list
              :datas="list_arr"
              :show="true"
              :start="start_time"
              :end="end_time"
            ></hotel-list>
          </van-pull-refresh>
        </div>
      </div>
      <div
        class="y5"
        bottommenus=""
        @click.stop="showToolbar"
        style="bottom: 7.1875rem;"
      >
        <div class="y6" bottomlinks="" v-show="toolbar">
          <router-link class="y8" :to="fun.getUrl('home')">
            首页
          </router-link>
          <router-link
            class="yb"
            :to="fun.getUrl('orderlist', { status: '0' })"
          >
            订单
          </router-link>
          <router-link class="yc" :to="fun.getUrl('member')">
            我的
          </router-link>
          <i class="yd"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./search_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#hotel_search {
  #content {
    background: #fff;

    .search_box {
      width: 100%;
      border-bottom: solid 0.0625rem #ebebeb;
      padding: 0.375rem 0.9375rem;
      display: flex;
      justify-content: space-between;

      .box {
        display: flex;
        width: 18.75rem;
        height: 1.875rem;
        border-radius: 0.375rem;
        background: #f5f5f5;
        padding: 0 0.625rem;

        i {
          font-size: 1rem;
          color: #999;
          line-height: 1.875rem;
          margin-right: 0.625rem;
        }

        input {
          width: 15rem;
          border: none;
          font-size: 15px;
        }
      }

      span {
        font-size: 15px;
        line-height: 1.875rem;
      }
    }

    .like_box {
      background: #fff;

      .title {
        height: 2.5rem;
        line-height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .line_left {
          width: 3.125rem;
          height: 0.0625rem;
          border: dashed 0.0625rem #ebebeb;
          margin-right: 0.625rem;
        }

        h2 {
          font-size: 18px;
        }

        .line_right {
          width: 3.125rem;
          height: 0.0625rem;
          border: dashed 0.0625rem #ebebeb;
          margin-left: 0.625rem;
        }
      }

      .goods_box {
        padding: 0.625rem 0;

        .goods {
          display: flex;
          margin-bottom: 0.625rem;

          .img {
            width: 6.25rem;
            height: 8.75rem;
            background: #f8f8f8;
            overflow: hidden;
            margin: 0 0.625rem;

            img {
              width: 100%;
            }
          }

          .info {
            text-align: left;
            width: 16rem;
            padding-right: 0.625rem;
            border-bottom: solid 0.0625rem #ebebeb;
            padding-bottom: 0.625rem;

            .info_a {
              font-size: 16px;
              font-weight: bold;
              line-height: 1.5rem;
              max-height: 3rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;

              font {
                font-size: 12px;
                color: #8c8c8c;
                font-weight: normal;
                margin-left: 0.625rem;
              }
            }

            .info_b {
              font-size: 14px;
              color: #8c8c8c;

              span {
                font-size: 20px;
                color: #337ef9;
                font-weight: bold;
                margin-right: 0.625rem;

                font {
                  font-size: 12px;
                  font-weight: normal;
                }
              }
            }

            .goods_box {
              padding: 0.625rem 0;

              .goods {
                display: flex;
                margin-bottom: 0.625rem;

                .img {
                  width: 6.25rem;
                  height: 6.25rem;
                  background: #f8f8f8;
                  overflow: hidden;
                  margin: 0 0.625rem;

                  img {
                    width: 100%;
                  }
                }

                .info {
                  text-align: left;
                  width: 16rem;
                  padding-right: 0.625rem;
                  border-bottom: solid 0.0625rem #ebebeb;
                  padding-bottom: 0.625rem;

                  .info_a {
                    font-size: 16px;
                    font-weight: bold;
                    line-height: 1.5rem;
                    max-height: 3rem;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;

                    font {
                      font-size: 12px;
                      color: #8c8c8c;
                      font-weight: normal;
                      margin-left: 0.625rem;
                    }
                  }

                  .info_b {
                    font-size: 14px;
                    color: #8c8c8c;

                    span {
                      font-size: 20px;
                      color: #337ef9;
                      font-weight: bold;
                      margin-right: 0.625rem;

                      font {
                        font-size: 12px;
                        font-weight: normal;
                      }
                    }
                  }

                  .info_c {
                    font-size: 12px;
                    color: #8c8c8c;
                  }

                  .info_d {
                    font-size: 12px;
                    color: #259b24;
                  }

                  .info_e {
                    color: #f15353;

                    span {
                      font-size: 20px;
                      font-weight: bold;
                    }

                    font:last-child {
                      color: #8c8c8c;
                    }
                  }
                }
              }
            }

            .info_d {
              font-size: 12px;
              color: #259b24;
            }

            .info_e {
              color: #f15353;

              span {
                font-size: 20px;
                font-weight: bold;
              }

              font:last-child {
                color: #8c8c8c;
              }
            }
          }
        }
      }
    }

    .y5 {
      position: fixed;
      z-index: 1000;
      right: 0;
      bottom: 3.75rem;
      width: 2.25rem;
      height: 2.25rem;
      background:
        rgba(0, 0, 0, 0.8)
        url(//static-o2o.360buyimg.com/daojia/new/images/menu/bm.png) 0.4375rem
        0.4375rem no-repeat;
      background-size: 4.0625rem 1.25rem;
      border: 0.0625rem solid #757575;
      border-radius: 0.25rem 0 0 0.25rem;
    }

    .y6 {
      position: absolute;
      right: -0.0625rem;
      bottom: 2.25rem;
      width: 5.9375rem;
      border: 0.0625rem solid #757575;
      background: rgba(0, 0, 0, 0.8);
    }

    .y6 a {
      display: block;
      border-bottom: 0.0625rem solid #4b4b4b;
      line-height: 2.1875rem;
      height: 2.1875rem;
      color: #fff;
      background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/bmenu.png);
      background-repeat: no-repeat;
      background-size: 1rem 18.75rem;
    }
  }
}
</style>
