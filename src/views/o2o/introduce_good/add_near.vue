<template>
  <div id="add_near">
    <c-title :hide="false" text="添加推荐商品"></c-title>
    <div class="content">
        <div class="search" >
        <input placeholder="请输入关键字搜索" type="text" v-model="keyword"></input>
        <i class="iconfont icon-sousuo1" @click="toSearch"></i>
        </div>
        <van-dropdown-menu active-color="#ef2844"  v-if="option1.length>0">
            <van-dropdown-item v-model="first" :options="option1" title="一级分类" v-if="option1.length>0" @change="changeCategory" />
            <van-dropdown-item v-model="second" :options="option2"   title="二级分类"  v-if="option2.length>0" @change="changeSecond" />
        </van-dropdown-menu>
        <div class="list">
          <van-checkbox-group v-model="result" checked-color="#ef2844">
            <div class="item" v-for="(item,index) in datas" :key="index">
                <van-checkbox :name="item.id"></van-checkbox>
              <div class="img">
                <img :src="item.change_thumb">
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
    <div class="fixed " :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']">
      <div>商品展示数量:<span style="color: #ef2844;">{{show_num}}</span></div>
      <div class="btn" @click="add">
        确定
      </div>
    </div>
  </div>
</template>

<script>
import add_near_controller from "./add_near_controller";

export default add_near_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#add_near {
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

    .van-dropdown-menu {
      margin-top: 1rem;
      padding: 0 2.7rem;
    }

    .van-dropdown-menu__item {
      font-size: 14px;
    }

    .van-hairline--top-bottom {
      position: static;
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

.pc {
  width: 375px !important;
}
</style>
