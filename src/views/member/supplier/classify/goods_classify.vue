<template>
  <section id="goods-class">
    <c-title :hide="false"
             text='商品分类'
             :popClose="true"
             @onGoBack="goback">
    </c-title>

    <section class="list"
             v-for="(item,index1) in classify_data" :key='index1'>
      <ul class="box-a"
          @click="oneLevel(1,index1)">
        <li class="left">
          <!-- <section class="img">
                            <img :src="item.thumb">
                        </section> -->
          <span>{{item.name}}</span>
        </li>
        <li class="right">
          <i style="color: #c9c9c9;"
             class="iconfont icon-more"
             @click.stop="levelMore(1,index1)"></i>
          <i style="color: #c9c9c9;"
             class="iconfont icon-member-bottom"
             v-if="item.level_active == false"></i>
          <i style="color: #c9c9c9;"
             class="iconfont icon-member-top"
             v-if="item.level_active == true"></i>
        </li>
        <div class="more"
             v-if="item.btn_active">
          <ul>
            <li @click.stop="classifyRoute(1,2,index1)">
              <van-icon class="iconfont icon-add"
                        color="#fff"
                        size="1.125rem"></van-icon>
              <span>添加</span>
            </li>
            <li @click.stop="classifyRoute(2,1,index1)">
              <van-icon class="iconfont icon-edit"
                        color="#fff"
                        size="1.125rem"></van-icon>
              <span>编辑</span>
            </li>
            <li @click.stop="deleteClassify(1,index1)">
              <van-icon class="iconfont icon-delete"
                        color="#fff"
                        size="1.125rem"></van-icon>
              <span>删除</span>
            </li>
          </ul>
          <div class="icon">
            <van-icon class="iconfont icon-up"
                      custom
                      size="1.5rem"></van-icon>
          </div>
        </div>
      </ul>
      <section v-for="(val,index2) in item.childrens"
               v-show="item.level_active"
               :key='index2'>
        <ul class="box-b">
          <li class="left">
            <!-- <section class="img">
                                <img :src="val.thumb">
                            </section> -->
            <span>{{val.name}}</span>
          </li>
          <li class="right">
            <i style="color: #c9c9c9;"
               class="iconfont icon-more"
               @click.stop="levelMore(2,index1,index2)"></i>
            <i style="color: #c9c9c9;"
               class="iconfont icon-member-top"></i>
          </li>
          <div class="more"
               v-if="val.btn_active">
            <ul>

              <li @click.stop="classifyRoute(2,2,index1,index2)">
                <van-icon class="iconfont icon-edit"
                          color="#fff"
                          size="1.125rem"></van-icon>
                <span>编辑</span>
              </li>
              <li @click.stop="deleteClassify(2,index1,index2)">
                <van-icon class="iconfont icon-delete"
                          color="#fff"
                          size="1.125rem"></van-icon>
                <span>删除</span>
              </li>
            </ul>
            <div class="icon">
              <van-icon class="iconfont icon-up"
                        size="1.5rem"></van-icon>
            </div>
          </div>
        </ul>

      </section>
    </section>

    <!-- 原来实例 -->
    <!-- <section class="list">
                <ul class="box-a">
                    <li class="left">
                        <section class="img">
                            <img src="">
                        </section>
                        <span>【ID3260】商品分类</span>
                    </li>
                    <li class="right">
                        <i class="iconfont icon-more"></i>
                        <i class="iconfont icon-member-bottom"></i>
                    </li>

                </ul>
                <ul class="box-b">
                    <li class="left">
                        <section class="img">
                            <img src="">
                        </section>
                        <span>【ID3260】商品分类</span>
                    </li>
                    <li class="right">
                        <i class="iconfont icon-more"></i>
                        <i class="iconfont icon-member-bottom"></i>
                    </li>
                </ul>
                <ul class="box-c">
                    <li class="left">
                        <section class="img">
                            <img src="">
                        </section>
                        <span>【ID3260】商品分类</span>
                    </li>
                    <li class="right">
                        <i class="iconfont icon-more"></i>
                        <i class="iconfont icon-member-bottom"></i>
                    </li>
                </ul>

            </section> -->

    <section id="bottom"
             :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
      <button type="button"
              @click="addClassify"><i class="iconfont icon-life-game-plus"></i>添加分类
      </button>
    </section>

    <!-- <el-button type="success" @click="classifyRoute(1)">添加分类</el-button>
        <el-button type="info" @click="classifyRoute(2)">一级分类</el-button>
        <el-button type="warning" @click="classifyRoute(3)">二级分类</el-button> -->
  </section>
</template>

<script>
import goodsClassify from "./goods_classify_controller.js";

export default goodsClassify;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #goods-class {
    background-color: #fff;
    margin-bottom: 3.75rem;

    .list {
      .box-a {
        padding-left: 0.875rem;
        border-top: solid 0.0625rem #ebebeb;
        display: flex;
        justify-content: space-between;
        position: relative;

        .left {
          display: flex;
          padding: 0.625rem 0;
          font-size: 16px;

          .img {
            width: 2.5rem;
            height: 2.5rem;
            overflow: hidden;
            background-color: #ccc;
            margin: 0 0.625rem;

            img {
              width: 100%;
              overflow: hidden;
            }
          }

          span {
            line-height: 2.5rem;
          }
        }

        .right {
          display: flex;
          padding: 0.625rem 0;
          margin-right: 0.625rem;

          i {
            font-size: 1.5rem;
            color: #c9c9c9;
            width: 2.5rem;
            line-height: 2.5rem;
            position: relative;
            z-index: 3;
          }
        }

        .more {
          z-index: 2;
          background: rgba(51, 51, 51, 0.9);
          border-radius: 0.25rem;
          color: #f0f0f0;
          width: 7.5rem;
          position: absolute;
          right: 3rem;
          top: 2.625rem;

          ul {
            display: flex;
            justify-content: center;

            li {
              flex: 1;
              text-align: center;

              i {
                display: block;
                margin-top: 0.125rem;
              }
            }
          }

          .icon {
            position: absolute;
            right: 0.625rem;
            top: -0.95rem;

            i {
              color: rgba(51, 51, 51, 0.9);
            }
          }
        }
      }

      .box-b {
        background: #fafafa;
        padding-left: 0.875rem;
        border-top: solid 0.0625rem #ebebeb;
        display: flex;
        justify-content: space-between;
        position: relative;

        .left {
          display: flex;
          margin-left: 1.25rem;
          padding: 0.625rem 0;
          font-size: 16px;

          .img {
            width: 2.5rem;
            height: 2.5rem;
            overflow: hidden;
            background-color: #ccc;
            margin: 0 0.625rem;

            img {
              width: 100%;
              overflow: hidden;
            }
          }

          span {
            line-height: 2.5rem;
          }
        }

        .right {
          display: flex;
          padding: 0.625rem 0;
          margin-right: 0.625rem;

          i {
            font-size: 1.5rem;
            color: #c9c9c9;
            width: 2.5rem;
            line-height: 2.5rem;
            position: relative;
            z-index: 3;
          }
        }
        // 编辑
        .more {
          z-index: 2;
          background: rgba(51, 51, 51, 0.9);
          border-radius: 0.25rem;
          color: #f0f0f0;
          width: 7.5rem;
          position: absolute;
          right: 3rem;
          top: 2.625rem;

          ul {
            display: flex;
            justify-content: center;

            li {
              flex: 1;
              text-align: center;

              i {
                display: block;
                margin-top: 0.125rem;
              }
            }
          }

          .icon {
            position: absolute;
            right: 0.625rem;
            top: -0.95rem;

            i {
              color: rgba(51, 51, 51, 0.9);
            }
          }
        }
      }

      .box-c {
        padding-left: 0.875rem;
        background: #fafafa;
        border-top: solid 0.0625rem #ebebeb;
        display: flex;
        justify-content: space-between;
        position: relative;

        .left {
          display: flex;
          margin-left: 2.5rem;
          padding: 0.625rem 0;
          font-size: 16px;

          .img {
            width: 2.5rem;
            height: 2.5rem;
            overflow: hidden;
            background-color: #ccc;
            margin: 0 0.625rem;

            img {
              width: 100%;
              overflow: hidden;
            }
          }

          span {
            line-height: 2.5rem;
          }
        }

        .right {
          display: flex;
          padding: 0.625rem 0;
          margin-right: 0.625rem;

          i {
            font-size: 1.5rem;
            color: #c9c9c9;
            width: 2.5rem;
            line-height: 2.5rem;
            position: relative;
            z-index: 3;
          }
        }
        // 编辑
        .more {
          z-index: 2;
          background: rgba(51, 51, 51, 0.9);
          border-radius: 0.25rem;
          color: #f0f0f0;
          width: 5.5rem;
          position: absolute;
          right: 3rem;
          top: 2.625rem;

          ul {
            display: flex;
            justify-content: center;

            li {
              flex: 1;
              text-align: center;

              i {
                display: block;
                margin-top: 0.125rem;
              }
            }
          }

          .icon {
            position: absolute;
            right: 0.625rem;
            top: -0.95rem;

            i {
              color: rgba(51, 51, 51, 0.9);
            }
          }
        }
      }
    }

    #bottom {
      border-top: solid 0.0625rem #ebebeb;
      width: 100%;
      position: fixed;
      bottom: 0;
      background-color: #fff;
      padding: 0 0.875rem;
      font-size: 16px;

      button {
        color: #fff;
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        border-radius: 0.1875rem;
        background-color: #f15353;
        border: none;
        margin: 0.375rem 0;
      }
    }
  }
</style>


