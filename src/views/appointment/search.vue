<template>
  <div id="appointment-search">
    <div class="search_box" :style="{width: fun.getPhoneEnv() == 3 ? '375px' : ''}">
      <ul class="search">
        <li class="left">
          <i class="iconfont icon-back" @click="goBack"></i>
          <span @click.stop="showProject">{{status==="1"? appointmentLang.project:appointmentLang.worker}}</span>
          <i @click.stop="showProject" class="iconfont icon-member-bottom"></i>
          <div class="search-popup-box" v-if="show2">
            <div style="margin: 0.3rem 0.5rem; border-bottom: 1px solid #eee;"><p @click="selectType('1')">{{appointmentLang.project}}</p></div>
            <div style="margin: 0.3rem 0.5rem;"><p @click="selectType('2')">{{appointmentLang.worker}}</p></div>
          </div>
        </li>
        <li class="right">
          <input
            v-model="kwd"
            type="text"
            title="搜索"
            :placeholder="'搜索'+appointmentLang.project+'/'+appointmentLang.worker"
          />
          <i class="iconfont icon-sousuo" @click="getData"></i>
        </li>
      </ul>
      <div class="box" v-if="status !== '2'">
        <div class="box-left" @click="showClass"><span>{{category.name || "全部"}}</span><i
          class="iconfont icon-member-bottom"></i></div>
        <div style="flex: 1;" @click="evaluateBtn">
          <div class="box-right">
            <span :class="[!show1 ? 'activeColour':'']">评价</span>
            <div class="icon-box"><i class="iconfont icon-member-top"
                                     :class="[!show1?(sort == 'asc'?'activeColour':''):'']"></i><i
              class="iconfont icon-member-bottom" :class="[!show1?(sort == 'desc'?'activeColour':''):'']"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :style="{height: status === '2' ? '2.5rem':'5rem'}"></div>

    <template v-if="status !== '2'">
      <div class="list">
        <div class="list-item" v-for="(item) in projectList" :key="item.id" @click="toUrl('ProjectDetails',{project_id: item.id})">
          <div class="item-left">
            <img :src="item.thumb" alt="">
          </div>
          <div class="item-right">
            <p class="title" style="-webkit-box-orient: vertical;">{{item.title}}</p>
            <div class="talk"><i class="iconfont icon-liaotian"></i> <span>{{item.comment_num || 0}}</span></div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="status === '2'">
      <div class="technician-list" v-for="(item) in projectList" :key="item.id" @click="toUrl('TechnicianDetails',{worker_id:item.id})">
        <div class="technician-item">
          <div class="pic" style="margin-left: 2rem;">
            <img :src="item.thumb" alt="">
          </div>
          <div class="technician-right">
            <div class="top">
              <p>{{item.name}}</p>
              <span class="tag" v-for="(tag,j) in item.tags" :key="j">{{tag}}</span>
              <div class="star">
                <van-rate size="14" v-model="item.score" readonly/>
              </div>
            </div>
            <div style="display: flex;" v-if="item.has_one_store">
              <p class="gray">{{item.has_one_store.store_name}}</p>
              <div class="address"><i class="iconfont icon-order_locate"></i><span>{{item.has_one_store.distance}}{{item.has_one_store.unit}}</span>
              </div>
            </div>
            <div class="describe1 text-over">
              <!--<span class="blue">项</span>-->
              <span class="gray" v-for="(title, i) in item.worker_projects" :key="i">{{title.title}}<em v-if="i<item.worker_projects.length-1">,</em></span>
            </div>
          </div>
        </div>
      </div>
    </template>


    <van-popup
      v-model="show1"
      closeable
      close-icon="close"
      position="top"
    >
      <div class="popup-box">
        <div style="margin: 0.3rem 0.5rem;" @click="selectClass('')"><p>全部</p></div>
        <div v-for="item in className" :key="item.id" style="margin: 0.3rem 0.5rem;" @click="selectClass(item)"><p>
          {{item.name}}</p></div>
      </div>
    </van-popup>


    <!--<van-popup-->
      <!--v-model="show2"-->
      <!--closeable-->
      <!--close-icon="close"-->
      <!--round-->
    <!--&gt;-->
      <!--<div class="popup-box">-->
        <!--<div style="margin: 0.3rem 0.5rem;"><p style="padding: 0.2rem 3rem;" @click="selectType('1')">项目</p></div>-->
        <!--<div style="margin: 0.3rem 0.5rem;"><p style="padding: 0.2rem 3rem;" @click="selectType('2')">技师</p></div>-->
      <!--</div>-->
    <!--</van-popup>-->

  </div>
</template>

<script>
import search_controller from "./search_controller";

export default search_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .activeColour {
    color: #ffa300;
  }

  .search_box {
    position: fixed;
    width: 100%;
    z-index: 100;

    .search {
      position: relative;
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
        color: #ffa300;
        font-size: 16px;
        display: flex;

        /* i { */

        /* font-size: 1rem; */

        /* } */
        span {
          display: block;
          margin: 0 0.25rem;
          max-width: 5.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        i:last-child {
          font-size: 1.125rem;
        }

        .icon-back {
          font-size: 1.3rem;
          color: #000;
          margin-right: 1rem;
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

  .search-popup-box {
    position: absolute;
    top: 2.3rem;
    left: 2rem;
    width: 25%;
    color: #3c3c3c;
    background: #fff;
    border-radius: 10px;
    border-bottom: 1px solid #eee;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
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
    padding-top: 0.5rem;
    display: flex;
    background: #fff;
    line-height: 1.5rem;
    position: relative;
  }

  .box-left {
    flex: 1;
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
    margin-right: 0.5rem;

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

  .describe {
    font-size: 12px;
    color: #ccc;
    text-align: left;
    padding-top: 0.3rem;
    border-top: 1px solid #ffc29d;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
  }

  .blue {
    display: inline-block;
    padding: 0 0.1rem;
    border-radius: 2.5px;
    background-color: #6eabff;
    color: #fff;
  }

  .technician-list {
    background-color: #fff;
    padding: 1rem 0;
  }

  .tag {
    display: inline-block;
    border-radius: 12px;
    border: solid 0.5px #f4a82e;
    padding: 0.1rem 0.3rem;
    color: #f4a82e;
    font-size: 12px;
    width: 3rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .technician-item {
    display: flex;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f2f2f7;

    .number {
      font-size: 22px;
      font-weight: bold;
      flex: 0 0 3rem;
      line-height: 4rem;
    }

    .pic {
      width: 3rem;
      height: 3rem;
      flex: 0 0 3rem;
      margin: 0.5rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .technician-right {
      display: flex;
      flex-direction: column;

      .gray {
        flex: 1;
      }

      .address {
        color: #ccc;
      }
    }

    .top {
      display: flex;

      p {
        font-weight: bold;
        line-height: 1.3rem;
        margin-right: 0.5rem;
      }

      .star {
        flex: 1;
        text-align: right;
      }
    }

    .gray {
      font-size: 12px;
      color: #b0b0b0;
      text-align: left;
    }

    .describe1 {
      font-size: 12px;
      color: #ccc;
      text-align: left;
      padding-top: 0.3rem;
      width: 16rem;
    }
  }
</style>
