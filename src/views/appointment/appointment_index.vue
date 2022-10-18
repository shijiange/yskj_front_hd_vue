<template>
  <div id="appointment-index" v-show="showContent">
    <div class="search_box">
      <ul class="search"  :style="{width: fun.getPhoneEnv() == 3 ? '375px': ''}">
        <li class="left" @click="tolocation">
          <i class="iconfont icon-icon_location"></i>
          <span>{{ address }}</span>
          <i class="iconfont icon-member-bottom"></i>
        </li>
        <li class="right" @click="tosearch">
          <i class="iconfont icon-sousuo"></i>
          <input
            type="text"
            title="搜索"
            readonly="readonly"
            :placeholder="'搜索'+appointmentLang.project+'/'+appointmentLang.worker"
          />
        </li>
      </ul>
    </div>
    <div style="height: 2.75rem;"></div>
    <div class="c-swipe">
      <template v-if="carousels">
        <van-swipe
          :autoplay="4000"
          indicator-color="#f15353"
          stop-propagation="false"
          :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
        >
          <van-swipe-item
            v-for="(slide, index) in carousels"
            :key="index"
            @click.native="bannerClick(slide)"
          >
            <img width="100%" style="height: 11.25rem; border-radius: 10px;" :src="slide.thumb"/>
          </van-swipe-item>
        </van-swipe>
      </template>
    </div>

    <div class="hot">
      <div class="header" @click="toUrl('HotTechnician')">
        <div class="left">
          <img class="avatar" src="../../assets/images/hot@2x.png" alt="">
          <p class="title">热门{{appointmentLang.worker}}</p>
        </div>
        <div class="icon-box">
          <i class="iconfont icon-advertise-next"></i>
        </div>
        <div class="user">
          <div
            class="img"
            v-for="(list, index) in workers"
            :style="{ zIndex: index, right: `${index * 15 + 20}px` }"
            :key="index"
          >
            <template v-if="list.thumb">
              <img :src="list.thumb" alt=""/>
            </template>
          </div>
        </div>
      </div>
      <div class="people">
        <div class="person" v-for="item in workers" :key="item.id" @click="toUrl('TechnicianDetails',{worker_id: item.id})">
          <div style="margin: 0.3rem 0 0.3rem 0;">
            <img v-if="item.thumb" :src="item.thumb" alt="">
            <img v-if="!item.thumb" src="../../assets/images/img_default.png" alt="">
          </div>
          <p style="-webkit-box-orient: vertical;">{{item.name}}</p>
        </div>
      </div>
    </div>

    <div class="recommend">
      <div class="header" @click="toUrl('ProjectList')">
        <div class="left">
          <img class="avatar" src="../../assets/images/recommond@2x.png" alt="">
          <p class="title">推荐{{appointmentLang.project}}</p>
        </div>
        <div class="icon-box">
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>
      <div class="project">
        <div class="project-item" v-for="project in projects" :key="project.id" @click="toUrl('ProjectDetails',{project_id: project.id})">
          <div class="left">
            <img class="left-img" :src="project.thumb" alt="">
          </div>
          <div class="right">
            <p class="headline">{{project.title}}</p>
            <p class="describe" style="-webkit-box-orient: vertical;">{{project.description}}</p>
            <div class="bottom">
              <!--<div>-->
                <!--<div class="hit">-->
                  <!--<span>人气</span>-->
                  <!--<i style="vertical-align: text-top;" class="iconfont icon-card_laud"></i>-->
                <!--</div>-->
              <!--</div>-->
              <div class="comment">
                <i style="vertical-align: middle; margin-right: 0.3rem;" class="iconfont icon-liaotian"></i><span>{{project.comment_num || 0}}</span> <i style="vertical-align: text-top; color: #f49f19;" class="iconfont icon-card_laud"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed-box1" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <router-link class="fixed-item" :to="fun.getUrl('home')">
        <i class="iconfont icon-zhuye2" style="font-size: 34px;"></i>
        <!--<span>首页</span>-->
      </router-link>
    </div>

    <div style="height: 4rem;"></div>
    <div class="appointment-bottom" :style="{width: fun.getPhoneEnv() == 3 ? '375px': ''}">
      <div class="item active">
        <router-link :to="fun.getUrl('Appointment')">
          <img src="../../assets/images/index-active@2x.png" alt="">
          <p>首页</p>
        </router-link>
      </div>
      <div class="item">
        <router-link :to="fun.getUrl('ProjectList')">
          <img src="../../assets/images/project-normal@2x.png" alt="">
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
import appointment_index_controller from "./appointment_index_controller";

export default appointment_index_controller;
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

  #appointment-index {
    background-color: #fff;

    .van-swipe {
      margin: 0.2rem 0.5rem;
    }

    .hot,
    .recommend {
      margin: 1rem 0.5rem;
      position: relative;
    }

    .header {
      display: flex;
    }

    .icon-box {
      flex: 1;
      text-align: right;
      align-self: center;
    }

    .left {
      display: flex;

      .avatar {
        width: 1rem;
        height: 1rem;
        margin-right: 0.5rem;
      }

      .title {
        font-size: 16px;
        font-weight: bold;
        line-height: 1.5rem;
        color: #000;
      }
    }

    .user {
      .img {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        margin: 0 auto;
        overflow: hidden;
        background: #f2f2f2;
        position: absolute;

        /* bottom: 20px; */
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .people {
      display: flex;
      flex-wrap: wrap;
      margin: 0.5rem 0 0 0.3rem;

      .person {
        padding: 1rem 0 0 0;
        flex: 1;

        /* width: 5.031rem; */
        height: 7.156rem;
        background-color: #fff;
        box-shadow: 0 0 0.563rem 0 rgba(169, 169, 169, 0.24);
        border-radius: 0.781rem;
        display: flex;
        flex-direction: column;
        color: #000;
        margin-right: 0.5rem;

        img {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
        }

        p {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
        }
      }
    }

    .project {
      padding-bottom: 0.5rem;
    }

    .project-item {
      display: flex;
      padding: 1rem 0;
      border-bottom: 1px solid #f2f2f2;

      .left {
        flex: 5.5rem;
        margin-right: 0.2rem;

        .left-img {
          width: 5rem;
          height: 5rem;
          border-radius: 0.375rem;
        }
      }

      .right {
        padding: 0.3rem;
        text-align: left;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .headline {
        font-weight: bold;
        font-size: 16px;
        width: 17rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .describe {
        color: #999;
        margin: 0.1rem 0 0.4rem 0;
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        word-break: break-all;
      }

      .bottom {
        display: flex;

        div {
          flex: 1;
        }

        .hit {
          border-radius: 2.5px;
          border: solid 0.5px #f49f19;
          color: #f49f19;
          display: inline-block;
          padding: 0 0.2rem;
        }

        .comment {
          color: #ccc;

          /* text-align: right */
        }
      }
    }
  }

  .search_box {
    .search {
      height: 2.75rem;
      line-height: 2.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.875rem;
      background-color: #fff;

      .left {
        font-size: 15px;
        display: flex;

        i {
          color: #999;
          font-size: 1rem;
        }

        span {
          display: block;
          margin: 0 0.25rem;
          max-width: 3.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #999;
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

  .search {
    z-index: 99;
    margin: auto;
    background: rgba(201, 21, 35, 0.2);
    text-align: center;
    position: fixed;
    width: 100%;
    height: 2.125rem;
    line-height: 2.125rem;
    //padding-top: 10px;

    img {
      width: 10%;
      float: left;
      max-height: 2.5rem;
    }

    .location {
      margin: 0 3%;
      width: 44%;
      color: #fff;
      //background: rgba(255,255,255,.7);
      //border-radius: 15px;
      height: 1.875rem;
      line-height: 1.875rem;
      overflow: hidden;
      text-align: left;
      padding-left: 0.9375rem;
      font-size: 12px;
      float: left;
      box-sizing: border-box;
    }

    .search-form-box {
      margin: 0 3%;
      width: 34%;
      color: #fff;
      //background: rgba(255,255,255,.7);
      border-radius: 0.9375rem;
      height: 1.875rem;
      line-height: 1.875rem;
      overflow: hidden;
      text-align: left;
      padding-left: 0.9375rem;
      font-size: 12px;
      float: left;
      box-sizing: border-box;
    }
  }

  .fixed-box1 {
    background: #fff;
    position: fixed;
    bottom: 8rem;
    right: 2%;
    color: rgb(244, 159, 25);
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    padding: 2px;
    box-shadow: 0 0.25rem 0.5625rem 0.0625rem rgba(0, 0, 0, 0.06);

    .fixed-item {
      display: flex;
      flex-direction: column;

      i {
        margin-top: -2px;
        line-height: 2.5rem;
        font-size: 24px;
      }
    }
  }

  .fixed-box1.pcStyle {
    left: 60%;
  }
</style>
