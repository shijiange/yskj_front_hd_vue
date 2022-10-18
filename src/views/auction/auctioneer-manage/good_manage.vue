<template>
  <div id="good_manage">
    <c-title :hide="false" text="拍品管理"></c-title>
    <van-tabs v-model="activeName" @change="handleClick">
    <van-tab title="审核中"
     name="0"></van-tab>
     <van-tab title="竞拍中"
     name="1"
     ></van-tab>
     <van-tab title="即将开始"
      name="2"
     ></van-tab>
     <van-tab title="已结束"
     name="3"
     ></van-tab>
    </van-tabs>
    <div class="content">
        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <template >
            <div class="list" v-for="(item,index) in datas" @click="toDetail(item)" :key="index">
              <div class="image"><img :src="item.has_one_goods.thumb" v-if="item.has_one_goods" ></div>
              <div class="right">
                <div class="title" v-if="item.has_one_goods">{{item.has_one_goods.title}}</div>
                <div class="bottom">
                  <div class="cash" v-if="item.has_one_goods"><span>起拍价</span><span>{{$i18n.t('money')}}{{item.start_price}}</span></div>
                  <i class="iconfont icon-more" @click.stop="moreEvent(index)"></i>
                </div>
              </div>
              <div class="more" v-show="item.edit_active" >
                  <ul>
                    <li @click.stop="Toedit(item.has_one_goods.id)" v-if="activeName!='1'" >
                      <van-icon class="iconfont icon-edit" custom color="#fff" size="1.125rem"></van-icon>
                      <span>编辑</span>
                    </li>
                    <li @click.stop="toUp(item.has_one_goods.id,item.has_one_goods.status)"  v-if="activeName!='0'">
                      <van-icon class="iconfont icon-edit" custom color="#fff" size="1.125rem"></van-icon>
                      <span>{{item.has_one_goods.status=='1'?'下架':'上架'}}</span>
                    </li>
                    <li @click.stop="commodityDelete(index)" >
                      <van-icon class="iconfont icon-delete" color="#fff" size="1.125rem"></van-icon>
                      <span>删除</span>
                    </li>
                  </ul>
                  <div class="icon">
                    <van-icon class="iconfont icon-down" custom size="1.5rem"></van-icon>
                  </div>
                </div>
            </div>
          </template>
        </van-pull-refresh>
    </div>
    <div class="bd" :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']">
        <span>拍品数量:{{total}}</span>
        <div class="btn" @click="toPublish" v-if="is_release_switch!='2'">发布拍品</div>
      </div>
  </div>
</template>

<script>
import good_manage_controller from "./good_manage_controller";

export default good_manage_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#good_manage {
  background-color: #fff;
  height: 100vh;

  .content {
    padding: 0 0.75rem;
    padding-top: 0.75rem;
    background-color: #fff;
    padding-bottom: 3.75rem;

    .list {
      display: flex;
      margin-bottom: 0.75rem;
      position: relative;

      .image {
        display: flex;
        width: 7.9375rem;
        height: 8rem;
        border-radius: 0.3125rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 0.3125rem;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        margin-left: 0.5rem;
        flex: 1;
        justify-content: space-between;

        .title {
          text-align: left;
          font-size: 14px;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .bottom {
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .cash {
            font-size: 12px;

            span:last-child {
              font-size: 16px;
              color: #f01818;
            }
          }
        }
      }

      .more {
        background: rgba(51, 51, 51, 0.9);
        border-radius: 0.25rem;
        color: #f0f0f0;
        width: 7.5rem;
        position: absolute;
        right: 0.375rem;
        top: 3.375rem;
        padding: 0.125rem 0;

        ul {
          display: flex;
          justify-content: center;

          li {
            flex: 1;
            text-align: center;
            font-size: 12px;

            i {
              display: block;
              margin-top: 0.125rem;
            }
          }
        }

        .icon {
          position: absolute;
          right: 0;
          top: 2rem;

          i {
            color: rgba(51, 51, 51, 0.9);
          }
        }
      }
    }

    .list:last-child {
      margin-bottom: 0;
    }

    .blank {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 6rem;
        height: 6rem;
      }

      span {
        margin-top: 15px;
        color: #ccc;
        font-size: 14px;
      }
    }
  }

  .bd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    padding: 0 0.75rem;
    width: 100%;
    height: 3rem;
    z-index: 9999;
    background-color: #fff;
    box-shadow: 0 0 0.4375rem 0 rgba(194, 194, 194, 0.31);

    .btn {
      width: 5.8125rem;
      height: 1.875rem;
      box-sizing: border-box;
      border-radius: 0.9375rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f00;
    }
  }
}

.pc {
  width: 375px !important;
}
</style>
