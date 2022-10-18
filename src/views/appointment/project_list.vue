<template>
  <div id="appointment-search">
    <div class="search_box" :style="{width: fun.getPhoneEnv() == 3 ? '375px' : ''}">
      <ul class="search">
        <li class="left">
          <span>{{appointmentLang.project}}列表</span>
        </li>
        <li class="right">
          <input
            type="text"
            title="搜索"
            v-model="name"
            :placeholder="'搜索'+appointmentLang.project"
            @keypress="enterSearch"
          />
          <i class="iconfont icon-sousuo" @click="search(1)"></i>
        </li>
      </ul>
      <div class="box">
        <div class="box-left" :class="[show1?'activeColour':'']" @click="showClass"><span>{{category.name || '全部'}}</span><i class="iconfont icon-member-bottom" style="vertical-align: middle;"></i></div>
        <div style="flex: 1;" @click="evaluateBtn">
          <div class="box-right">
            <span  :class="[!show1 ? 'activeColour':'']">评价</span>
            <div class="icon-box"><i class="iconfont icon-member-top" :class="[!show1?(sort == 'asc'?'activeColour':''):'']"></i><i class="iconfont icon-member-bottom" :class="[!show1?(sort == 'desc'?'activeColour':''):'']"></i>
            </div>
          </div>
        </div>
        <van-popup
          v-model="show1"
          closeable
          close-icon="close"
          position="top"
          style="transform: translateX(-50%); left: 50%;"
        >
          <div class="popup-box">
            <div style="margin: 0.3rem 0.5rem;" @click="selectionBtn('')"><p>全部</p></div>
            <div style="margin: 0.3rem 0.5rem;" v-for="(item,index) in CategoryList" :key="index" @click="selectionBtn(item)"><p>{{item.name}}</p></div>
          </div>
        </van-popup>
      </div>
    </div>
    <div style="height: 5rem;"></div>

    <div class="list">
      <div class="list-item"  v-for="(item,index) in commentList" :key="index" @click="goProjectDetails(item.id)">
        <div class="item-left">
          <img :src="item.thumb" alt="">
        </div>
        <div class="item-right">
          <p class="title" style="-webkit-box-orient: vertical;">{{item.title}}</p>
          <div class="talk"><i class="iconfont icon-liaotian"></i><span>{{item.comment_num || 0}}</span></div>
        </div>
      </div>
    </div>

    <div style="height: 4rem;"></div>
    <div class="appointment-bottom" :style="{width: fun.getPhoneEnv() == 3 ? '375px': ''}">
      <div class="item">
        <router-link :to="fun.getUrl('Appointment')">
          <img src="../../assets/images/index-normal@2x.png" alt="">
          <p>首页</p>
        </router-link>
      </div>
      <div class="item active">
        <router-link :to="fun.getUrl('ProjectList')">
          <img src="../../assets/images/project-active@2x.png" alt="">
          <p>{{appointmentLang.project}}</p>
        </router-link>
      </div>
      <div class="item">
        <router-link :to="fun.getUrl('AppointmentMine')">
          <img src="../../assets/images/my-normal@2x.png" alt="">
          <p>我的</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import project_list_controller from "./project_list_controller";

export default project_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .appointment-bottom {
    position: fixed;
    bottom: 0;
    display: flex;
    background-color: #fff;
    text-align: center;
    width: 100%;
    padding: 0.3rem 0;

    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      color: #ccc;

      img {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .active {
      color: #f49f19;
    }
  }

  .search_box {
    position: fixed;
    width: 100%;

    .search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.875rem;
      z-index: 99;
      margin: auto;
      background: #fff;
      text-align: center;
      height: 2.75rem;
      line-height: 2.75rem;

      img {
        width: 10%;
        float: left;
        max-height: 2.5rem;
      }

      .left {
        font-size: 18px;
        display: flex;
        font-weight: bold;

        i {
          color: #999;
          font-size: 1rem;
        }

        span {
          display: block;
          margin: 0 0.25rem;
          max-width: 5.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #000;
        }

        i:last-child {
          font-size: 1.125rem;
        }
      }

      .right {
        width: 14.375rem;
        height: 1.875rem;
        background: #f5f5f5;
        display: flex;
        line-height: 1.875rem;
        border-radius: 1rem;
        padding: 0 0.625rem;
        font-size: 14px;

        i {
          font-size: 1.125rem;
          color: #999;
          margin-right: 0.375rem;
        }

        input {
          border: none;
          width: 100%;
        }
      }
    }
  }

  .popup-box {
    /* position: absolute; */

    /* top: 1.5rem; */

    /* left: 0; */
    width: 100%;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    padding: 1rem;

    p {
      padding: 0.1rem 0.5rem;
      display: inline-block;
      background-color: #fff2e6;
      color: #f4a82e;
      border-radius: 1.094rem;
    }
  }

  .box {
    display: flex;
    background: #fff;
    line-height: 1.5rem;
    position: relative;
  }

  .box-left {
    flex: 1;

    /* color: #ffa300; */
  }

  .activeColour {
    color: #ffa300;
  }

  .box-right {
    flex: 1;
    display: flex;
    margin: 0 auto;
    width: 3.5rem;
    color: #ccc;
  }

  .icon-box {
    display: flex;
    flex-direction: column;
    margin-top: -0.2rem;
  }

  .icon-member-top {
    height: 0.5rem;
  }

  .list {
    background: #fff;
  }

  .list-item {
    display: flex;
    padding: 0.5rem;
  }

  .item-left {
    flex: 0 0 5rem;
    height: 5rem;
    margin-right: 0.2rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 0.375rem;
    }
  }

  .item-right {
    padding: 0.3rem;
    display: flex;
    flex-direction: column;
    text-align: left;
    justify-content: space-between;

    .title {
      font-weight: bold;
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
    }

    .talk {
      color: #ccc;
    }
  }

</style>
