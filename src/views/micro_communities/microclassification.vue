<template>
  <div id="microclassification">
    <van-sticky offset-top="0">
      <div class="header">
        <div class="left" @click="goBack">
          <i class="fa fa-angle-left"></i>
        </div>
        <div class="search">
          <div class="searchion"><i class="iconfont iconfont icon-sousuo1"></i></div>
          <div class="textinp">
            <van-field v-model="commodityTitle" placeholder="搜索帖子名称" :clearable="true" />
          </div>
        </div>
        <div class="right" @click="searchBtn">搜索</div>
      </div>
      <div class="top">
        <div class="Classification">
          <div class="left">
            <van-tabs v-model="selected">
              <template v-for="(item, index) in catelist">
                <van-tab :name="1 + index + ''" :key="index">
                  <span slot="title" @click="swishTabTItem(item.id, index)">{{ item.name }}</span>
                  <div class="cate-box">
                    <div class="cate-child-box" :class="[cateid == item.id ? 'active-cate-child' : '']" @click.stop="swishTabTItem(item.id, index)">全部</div>
                    <div
                      class="cate-child-box"
                      :class="[cateid == cateChild.id ? 'active-cate-child' : '']"
                      @click.stop="swishTabTItem(cateChild.id, index)"
                      v-for="cateChild in item.child"
                      :key="cateChild.id"
                    >
                      {{ cateChild.name }}
                    </div>
                  </div>
                </van-tab>
              </template>
            </van-tabs>
          </div>
          <div class="right" @click="classificationShow">
            <div class="imgicon" v-if="classificationHide">
              <img src="../../assets/images/micro_communities/class_bottom@2x.png" alt="" />
            </div>
            <div class="imgicon" v-else>
              <img src="../../assets/images/micro_communities/class_top@2x.png" alt="" />
            </div>
          </div>
        </div>

        <div class="all_classification" :class="{ hide: classificationHide }">
          <div class="bottom">
            <ul>
              <li v-for="(item, index) in catelist" :key="index" @click="swishTabTItem(item.id, index)">
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </van-sticky>

    <div class="list">
      <div>
        <template v-for="(item, index) in catelistData">
          <div v-if="load" :key="index">
            <span v-show="selected == 1 + index + ''">
              <div class="video_list" v-if="item && item.length > 0">
                <c-flow :list="item" :showLoading="load" v-if="selected == index + 1" :fatherTitle="fatherTitle" :commodityTitle="commodityTitle"></c-flow>
                <!-- <van-list
                  v-model:loading="load"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                  <c-flow :list="item" :showLoading="load" v-if="selected == index + 1"></c-flow>
                </van-list> -->
              </div>
            </span>
          </div>
        </template>
      </div>
    </div>
    <div class="all_classificationmode" :class="{ hide: classificationHide }" @click="classificationHide = true"></div>
  </div>
</template>

<script>
import microclassification_controller from "./microclassification_controller";
export default microclassification_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#microclassification {
  .header {
    display: flex;
    align-items: center;
    padding-top: 0.63rem;
    padding-bottom: 0.63rem;
    background: #fff;

    .left {
      font-size: 1.5rem;
      margin-left: 1.06rem;
      margin-right: 1.44rem;
    }

    .search {
      display: flex;
      width: 17.19rem;
      height: 1.88rem;
      background-color: #f5f5f5;
      border-radius: 0.94rem;
      align-items: center;

      .searchion {
        font-size: 0.81rem;
        color: #999;
        margin-left: 0.5rem;
        margin-right: 0.41rem;
      }

      .van-cell {
        background-color: transparent;
        padding: 0;
      }
    }

    .right {
      font-size: 1rem;
      color: #1c96fe;
      flex: 1;
    }
  }
  .top {
    position: relative;

    .Classification {
      display: flex;

      .left {
        flex: 1;
        overflow-x: scroll;
        width: 85%;
        background-color: #fff;
      }

      .right {
        background: #fff;
        width: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .imgicon {
          width: 1.88rem;

          img {
            width: 100%;
          }
        }
      }
    }

    .all_classification {
      position: absolute;
      top: 2.65rem;
      left: 0;
      right: 0;
      bottom: 0;
      height: 8rem;
      overflow: auto;
      z-index: 10;
      background: #fff;

      .bottom {
        padding-top: 1.16rem;

        ul {
          padding-left: 0.75rem;
          padding-right: 0.75rem;
          display: flex;
          flex-wrap: wrap;

          li {
            font-size: 0.88rem;
            line-height: 1.88rem;
            height: 1.88rem;
            padding-left: 0.91rem;
            padding-right: 0.91rem;
            margin-right: 0.63rem;
            margin-bottom: 0.63rem;
            background-color: #f5f5f5;
            border-radius: 0.94rem;
          }
        }
      }
    }

    .all_classification.hide {
      display: none;
    }
  }

  .list {


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

  .cate-box {
    display: flex;
    padding: 0.5rem;
    background: #fff;
    width: 100%;
    overflow: scroll;

    .cate-child-box {
      height: 1.25rem;
      line-height: 1.125rem;
      padding: 0 0.5rem;
      background: #f3f3f3;
      border: 1px solid #f3f3f3;
      border-radius: 1rem;
      overflow: hidden;
      margin-right: 0.5rem;
      font-size: 10px;
      color: #666;
      flex-shrink: 0;
    }

    .active-cate-child {
      border: 1px solid #e35151;
      background: #fff;
      color: #e35151;
    }
  }

  .all_classificationmode {
    position: fixed;
    top: 5.89rem;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    background: rgba(0, 0, 0, 0.5);
  }

  .all_classificationmode.hide {
    display: none;
  }
}
</style>
