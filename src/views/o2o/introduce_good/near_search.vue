<template>
  <div id="near_search" ref="near_search">
    <c-title :hide="false" text="推荐商品搜索结果"></c-title>
    <div class="content">
        <div class="search" >
        <input placeholder="请输入关键字搜索" type="text" v-model="kwd"></input>
        <i class="iconfont icon-sousuo1" @click="search"></i>
        </div>
        <div class="list">
          <van-checkbox-group v-model="result" checked-color="#ef2844">
            <div class="item" v-for="(item,index) in datas" :key="index">
                <van-checkbox :name="item.id"></van-checkbox>
              <div class="img">
                <img :src="item.thumb">
              </div>
              <div class="info">
                <div class="title">{{item.title}}</div>
                <div class="bottom">
                  <span class="money">{{$i18n.t('money')}}{{item.price}}</span>

                </div>
              </div>
            </div>
          </van-checkbox-group>
          </div>
    </div>
    <div class="fixed">
      <div>商品展示数量:<span style="color: #ef2844;">{{show_num}}</span></div>
      <div class="btn" @click="add">
        确定
      </div>
    </div>
  </div>
</template>

<script>
import near_search_controller from "./near_search_controller";

export default near_search_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#near_search {
  background-color: #fff;
  height: 100vh;

  .content {
    .list {
      margin-top: 1rem;
      padding: 0 0.7813rem;
      padding-bottom: 4.125rem;
      background-color: #fff;

      .item {
        margin-bottom: 1rem;
        display: flex;
        padding: 1rem;
        background-color: #fff;
        box-shadow: 0 0 0.3125rem 0	rgba(0, 0, 0, 0.1);
        border-radius: 0.3125rem;

        .img {
          display: flex;
          width: 3.75rem;
          height: 3.8125rem;
          border-radius: 0.3125rem;
          box-sizing: border-box;
          margin-left: 0.75rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
          margin-left: 0.5rem;
          flex: 1;

          .title {
            font-size: 14px;
            color: #000;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .bottom {
            display: flex;
            justify-content: space-between;

            .money {
              font-size: 12px;
              color: #f01414;
            }
          }
        }
      }
    }

    .search {
      width: 18.75rem;
      height: 2.5rem;
      background-color: #f2f2f2;
      margin: 0 auto;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      color: #999;
      border-radius: 1.3rem;

      input {
        outline: none;
        border: none;
        text-indent: 1rem;
        width: 100%;
        height: 100%;
        font-size: 12px;
      }

      .icon-sousuo1 {
        margin-right: 1rem;
      }
    }
  }

  .fixed {
    position: fixed;
    bottom: 0;
    height: 3.125rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 999;
    padding: 0 1rem;
    box-shadow:
      0 0 5px 0
      rgba(0, 0, 0, 0.1);
    background-color: #fff;

    .btn {
      width: 6.25rem;
      color: #fff;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
      background-color: #f53939;
      border-radius: 1.25rem;
    }
  }
}
</style>
