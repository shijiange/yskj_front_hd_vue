<template>
  <div id="distribution">
    <c-title :hide="false" :text="'活动列表'"></c-title>
    <div class="search">
      <div class="search-box">
        <form @submit.prevent action="#">
          <input
            type="search"
            placeholder="搜索活动标题"
            v-model="keyword"
            style="width: 150%;"
          />
        </form>
        <i
          class="iconfont icon-sousuo1"
          style="color: #ccc;"
          @click="search"
        ></i>
      </div>
    </div>

    <div class="new">
      <div class="list" v-if="list.length>0">
        <div class="list-li" v-for="(item,index) in list" :key="index" @click="gotoDetail(index)">
          <div class="img">
            <img
              :src="item.cover"
              alt=""
            />
          </div>
          <div class="content">
            <div class="content-word">
              {{item.title}}
            </div>
            <div class="price">
              {{item.join_num?item.join_num:0}} 人参与
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <img src="../../../assets/images/no-more-product.png" alt="" style="width: 5rem; height: 5rem;">
      </div>
    </div>
  </div>
</template>

<script>
import index_controller from "./search_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#distribution {
  background: #fff;
  min-height: 100vh;

  #search {
    background: #fff;
    padding: 0.375rem 1.25rem;

    #soso {
      width: 100%;
      height: 1.75rem;
      line-height: 1.75rem;
      background: #f5f5f5;
      padding: 0 0.625rem;
      text-align: left;
      border-radius: 1rem;
      color: #8c8c8c;
      margin-top: 0.5rem;

      i {
        color: #999;
        line-height: 1.75rem;
        margin-right: 0.375rem;
        font-size: 16px;
      }

      i.style1 {
        float: right;
      }
    }
  }

  .new {
    margin: 0 0.5rem;

    .list {
      margin: 0.5rem 0;

      .list-li {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 0.5rem;
        width: 100%;

        .img {
          flex: 0 0 7rem;
          height: 7rem;
          margin-right: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .content {
          flex: 1;
          text-align: left;
          position: relative;
          height: 7rem;

          .content-word {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }

          .price {
            display: inline-block;
            background: #fca830;
            // #ff7554
            background: linear-gradient(to right, #fca830 0%, #ff7554 100%);
            border-top-right-radius: 1rem;
            border-bottom-right-radius: 1rem;
            color: #fff;
            padding: 0.25rem 0.5rem;
            position: absolute;
            bottom: 0;
          }
        }
      }
    }
  }

  .search {
    height: 2.8125rem;
    margin-top: 2.5rem;
    line-height: 2.8125rem;
    position: relative;
    display: flex;
    overflow: hidden;
    background: #fff;

    .back {
      width: 2.8125rem;

      i {
        line-height: 2.8125rem;
        font-size: 1.5rem;
      }
    }

    .search-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 85%;
      margin-left: 7.5%;
      margin-top: 0.5rem;
      padding: 0 0.625rem;
      background-color: #f2f2f2;
      height: 1.75rem;
      line-height: 1.75rem;
      border-radius: 0.875rem;

      input {
        flex: 1;
        line-height: 1.75rem;
        border: none;
        color: #333;
      }

      i {
        position: absolute;
        right: 1rem;
        flex: 0 0 1.5rem;
      }
    }
  }
}
</style>
