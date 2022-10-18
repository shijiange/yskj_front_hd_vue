<template>
  <div id="hot-technician">
    <div class="search_box">
      <ul class="search">
        <li class="left">
          <i @click="goBack" style="padding-right: 1.5rem;" class="iconfont icon-back"></i>
          <span>热门{{appointmentLang.worker}}</span>
        </li>
        <li class="right">
          <input
            v-model="kwd"
            type="text"
            title="搜索"
            :placeholder="'搜索'+appointmentLang.worker"
          />
          <i class="iconfont icon-sousuo" @click="getData"></i>
        </li>
      </ul>
    </div>

    <div class="technician-top" v-if="!search">
      <div class="second" v-if="second.name" @click="gotoWorker(second.id)">
        <div class="header">
          <div class="avatar">
            <img v-if="second.thumb" :src="second.thumb" alt="">
            <img v-if="!second.thumb" src="../../assets/images/img_default.png" alt="">
          </div>
          <img class="no" src="../../assets/images/jijun@2x.png" alt="">
          <p class="num">NO.2</p>
        </div>
        <div class="name">
          <p class="text-over" style="width: 4rem; line-height: 1.5rem;">{{second.name}}</p>
          <!--<span class="tag">{{second.tags[0]}}</span>-->
        </div>
        <div style="margin: 0.1rem auto;">
          <van-rate size="14" v-model="second.score" readonly />
        </div>
        <div style="font-size: 12px;" v-if="second.has_one_store">
          <p class="store">{{second.has_one_store.store_name}}</p>
          <div class="address"><i class="iconfont icon-order_locate"></i><span>{{second.has_one_store.distance}}{{second.has_one_store.unit}}</span></div>
        </div>
        <div class="describe" style="-webkit-box-orient: vertical;"><!--<span class="blue">项</span>--><span class="gray" v-for="(title, i) in second.worker_projects" :key="i">{{title.title}}<em v-if="i<second.worker_projects.length-1">,</em></span>
        </div>
      </div>

      <div class="gold" v-if="gold.name" @click="gotoWorker(gold.id)">
        <div class="header">
          <div class="avatar">
            <img v-if="gold.thumb" :src="gold.thumb" alt="">
            <img v-if="!gold.thumb" src="../../assets/images/img_default.png" alt="">
          </div>
          <img class="no" src="../../assets/images/champion@2x.png" alt="">
          <p class="num">NO.1</p>
        </div>
        <div class="name">
          <p class="text-over" style="width: 4rem; line-height: 1.5rem;">{{gold.name}}</p>
          <!--<span class="tag">{{gold.tags[0]}}</span>-->
        </div>
        <div style="margin: 0.1rem auto;">
          <van-rate size="14" v-model="gold.score" readonly />
        </div>
        <div style="font-size: 12px;" v-if="gold.has_one_store">
          <p class="store">{{gold.has_one_store.store_name}}</p>
          <div class="address"><i class="iconfont icon-order_locate"></i><span>{{gold.has_one_store.distance}}{{gold.has_one_store.unit}}</span>
          </div>
        </div>
        <div class="describe" style="-webkit-box-orient: vertical;"><!--<span class="blue">项</span>--><span class="gray" v-for="(title, i) in gold.worker_projects" :key="i">{{title.title}}<em v-if="i<gold.worker_projects.length-1">,</em></span>
        </div>
      </div>

      <div class="three" v-if="three.name" @click="gotoWorker(three.id)">
        <div class="header">
          <div class="avatar">
            <img v-if="three.thumb" :src="three.thumb" alt="">
            <img v-if="!three.thumb" src="../../assets/images/img_default.png" alt="">
          </div>
          <img class="no" src="../../assets/images/yajun@2x.png" alt="">
          <p class="num">NO.3</p>
        </div>
        <div class="name">
          <p class="text-over" style="width: 4rem;">{{three.name}}</p>
          <!--<span class="tag">{{three.tags[0]}}</span>-->
        </div>
        <div style="margin: 0.1rem auto;">
          <van-rate size="14" v-model="three.score" readonly />
        </div>
        <div style="font-size: 12px;" v-if="three.has_one_store">
          <p class="store">{{three.has_one_store.store_name}}</p>
          <div class="address"><i class="iconfont icon-order_locate"></i><span>{{three.has_one_store.distance}}{{three.has_one_store.unit}}</span></div>
        </div>
        <div class="describe" style="-webkit-box-orient: vertical;"><!--<span class="blue">项</span>--><span class="gray" v-for="(title, i) in three.worker_projects" :key="i">{{title.title}}<em v-if="i<three.worker_projects.length-1">,</em></span>
        </div>
        <div v-if="!three.thumb && second.name" style="position: absolute; z-index: 10; width: 100%; height: 100%; top: 0; background: #fff;"></div>
      </div>
    </div>


    <template v-if="!search">
      <div class="technician-list" v-for="(item,index) in projectList" :key="item.id" v-if="index>=3">
        <div class="technician-item" @click="gotoWorker(item.id)">
          <p class="number">{{index + 1}}</p>
          <div class="pic">
            <img v-if="item.thumb" :src="item.thumb" alt="">
            <img v-if="!item.thumb" src="../../assets/images/img_default.png" alt="">
          </div>
          <div class="technician-right">
            <div class="top">
              <p>{{item.name}}</p>
              <!--<span class="tag" v-for="(tag,j) in item.tags" :key="j" v-if="j<2">{{tag}}</span>-->
              <div class="star">
                <van-rate size="14" v-model="item.score" readonly />
              </div>
            </div>
            <div style="display: flex;" v-if="item.has_one_store">
              <p class="gray">{{item.has_one_store.store_name}}</p>
              <div class="address"><i class="iconfont icon-order_locate"></i><span>{{item.has_one_store.distance}}{{item.has_one_store.unit}}</span>
              </div>
            </div>
            <div class="describe1">
              <!--<span class="tag" v-for="(tag,j) in item.tags" :key="j">{{tag}}</span>-->
              <p class="gray" v-for="(title, i) in item.worker_projects" :key="i"><!--<span class="blue">项</span>--><span class="tag">{{title.has_one_category.name}}</span><span>{{title.title}}</span></p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="search">
      <div class="technician-list" v-for="(item) in projectList" :key="item.id">
        <div class="technician-item" @click="gotoWorker(item.id)">
          <div class="pic" style="margin-left: 2rem;">
            <img v-if="item.thumb" :src="item.thumb" alt="">
            <img v-if="!item.thumb" src="../../assets/images/img_default.png" alt="">
          </div>
          <div class="technician-right">
            <div class="top">
              <p>{{item.name}}</p>
              <!--<span class="tag" v-for="(tag,j) in item.tags" :key="j" v-if="j<2">{{tag}}</span>-->
              <div class="star">
                <van-rate size="14" v-model="item.score" readonly />
              </div>
            </div>
            <div style="display: flex;" v-if="item.has_one_store">
              <p class="gray">{{item.has_one_store.store_name}}</p>
              <div class="address"><i class="iconfont icon-order_locate"></i><span>{{item.has_one_store.distance}}{{item.has_one_store.unit}}</span>
              </div>
            </div>
            <div class="describe1">
              <!--<span class="tag" v-for="(tag,j) in item.tags" :key="j">{{tag}}</span>-->
              <p class="gray" v-for="(title, i) in item.worker_projects" :key="i"><!--<span class="blue">项</span>--><span class="tag">{{title.has_one_category.name}}</span><span>{{title.title}}</span></p>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import hot_technician_controller from "./hot_technician_controller";

export default hot_technician_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #hot-technician {
    background-color: #ffa300;

    .text-over {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .technician-top {
      margin-top: 1.8rem;
      padding-bottom: 1rem;
      position: relative;
      display: flex;
      justify-content: center;
    }

    .second,
    .gold,
    .three {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 7.5rem;
      padding: 1rem 0.5rem;
      min-height: 11.5rem;
      background-color: #fff;
      border-radius: 0.313rem 0.313rem 0 0;
      box-shadow: 0 0 1.344rem 0 rgba(169, 169, 169, 0.24);
    }

    .second {
      margin-right: 7.5rem;
    }

    .gold {
      position: absolute;
      left: 50%;
      top: -7%;
      transform: translateX(-50%);
      z-index: 100;
      width: 8rem;
      padding-bottom: 1.8rem;
    }

    .avatar {
      position: absolute;
      top: 5%;
      left: 50%;
      transform: translateX(-50%);
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: solid 2px #b7cfeb;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .no {
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translateX(-50%);
      width: 5.594rem;
      height: 1.531rem;
    }

    .num {
      color: #fff;
      position: absolute;
      top: 26%;
      left: 50%;
      transform: translateX(-50%);
    }

    .name {
      margin: 4.5rem auto 0 auto;
      display: flex;

      p {
        font-weight: bold;
      }
    }

    .address {
      i {
        color: #ccc;
        vertical-align: middle;
      }
    }

    .store {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      justify-self: center;
      border-radius: 2.5px;
      background-color: #6eabff;
      color: #fff;
    }

    .technician-list {
      background-color: #fff;
      padding-top: 1rem;
    }

    .tag {
      display: inline-block;
      border-radius: 12px;
      border: solid 0.5px #f4a82e;
      padding: 0.1rem 0.3rem;
      color: #f4a82e;
      font-size: 12px;
      max-width: 6rem;
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
        width: 16rem;

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
          width: 3rem;
          text-align: left;
          line-height: 1.3rem;
          margin-right: 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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

        span {
          align-self: center;
        }

        .tag {
          margin: 0 0.2rem;
          vertical-align: middle;
        }

        .gray {
          margin-top: 0.3rem;
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
      background-color: #ffa300;

      .left {
        font-size: 16px;
        display: flex;
        font-weight: bold;

        i {
          color: #fff;
          font-size: 1rem;
        }

        span {
          display: block;
          margin: 0 0.25rem;
          max-width: 5.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
        }

        i:last-child {
          font-size: 1.125rem;
        }
      }

      .right {
        width: 12.375rem;
        height: 1.875rem;
        background: rgba(255, 255, 255, 0.25);
        display: flex;
        line-height: 1.875rem;
        border-radius: 1rem;
        padding: 0 0.625rem;
        font-size: 14px;
        color: #fff;

        i {
          font-size: 1.125rem;
          margin-right: 0.375rem;
        }

        input {
          border: none;
          width: 100%;
        }

        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          color: #fff;
        }
      }
    }
  }
</style>
