<template>
  <div>
    <c-title :hide="false" :text="title">
    </c-title>
    <van-tabs v-model="active" title-active-color="#f49f19" sticky @click="selectTab" color="#f49f19">
      <van-tab title="未完成" name="0">
        <div class="blank" v-if="projectList.length<=0">
          <img src="../../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>
        <div class="list-box" v-else>
          <div class="list-item" v-for="(item, i) in projectList" :key="i">
            <div class="top" v-if="item.has_one_order_project">
              <div class="left"><img :src="item.has_one_order_project.project_thumb" alt="">
              </div>
              <div class="right">
                <p class="title">{{item.has_one_order_project.project_title}}</p>
                <p class="store_name" v-if="item.has_one_store">门店名称：{{item.has_one_store.store_name}}</p>
                <div class="name-box" v-if="item.has_one_worker">
                  <div class="name overflow">
                    <i style="color: #f49f19; vertical-align: middle;"  class="iconfont icon-stores_staff"></i>{{item.has_one_worker.name}}
                  </div>
                  <div class="yellow" @click="sure(item.id)">取消预约</div>
                </div>
              </div>
            </div>
            <div class="down">
              <div class="phone">
                <p class="left overflow">顾客名称：{{item.customer_name}}</p>
                <p class="right">联系方式：{{item.customer_tel}}</p>
              </div>
              <p class="time">预约时间：{{item.begin_time}} - {{item.end_time}}</p>
              <p class="time" v-if="item.has_one_order_project&& item.has_one_order_project.rest_count">顾客{{appointmentLang.project}}剩余次数：{{item.has_one_order_project.rest_count}}</p>
              <p class="time" v-if="item.remark">备注：{{item.remark}}</p>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已完成" name="1">
        <div class="blank" v-if="projectList.length<=0">
          <img src="../../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>
        <div class="list-box" v-else>
          <div class="list-item" v-for="(item, i) in projectList" :key="i">
            <div class="top" v-if="item.has_one_order_project">
              <div class="left"><img :src="item.has_one_order_project.project_thumb" alt="">
              </div>
              <div class="right">
                <p class="title">{{item.has_one_order_project.project_title}}</p>
                <div class="name-box" v-if="item.has_one_worker">
                  <div class="name overflow">
                    <i style="color: #f49f19; vertical-align: middle;"  class="iconfont icon-stores_staff"></i>{{item.has_one_worker.name}}
                  </div>
                </div>
              </div>
            </div>
            <div class="down">
              <div class="phone">
                <p class="left overflow">顾客名称：{{item.customer_name}}</p>
                <p class="right">联系方式：{{item.customer_tel}}</p>
              </div>
              <p class="time">预约时间：{{item.begin_time}} - {{item.end_time}}</p>
              <p class="time" v-if="item.has_one_order_project&& item.has_one_order_project.rest_count">顾客{{appointmentLang.project}}剩余次数：{{item.has_one_order_project.rest_count}}</p>
              <p class="time" v-if="item.remark">备注：{{item.remark}}</p>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已取消" name="9">
        <div class="blank" v-if="projectList.length<=0">
          <img src="../../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>
        <div class="list-box" v-else>
          <div class="list-item" v-for="(item, i) in projectList" :key="i">
            <div class="top" v-if="item.has_one_order_project">
              <div class="left"><img :src="item.has_one_order_project.project_thumb" alt="">
              </div>
              <div class="right">
                <p class="title">{{item.has_one_order_project.project_title}}</p>
                <div class="name-box" v-if="item.has_one_worker">
                  <div class="name overflow">
                    <i style="color: #f49f19; vertical-align: middle;"  class="iconfont icon-stores_staff"></i>{{item.has_one_worker.name}}
                  </div>
                </div>
              </div>
            </div>
            <div class="down">
              <div class="phone">
                <p class="left overflow">顾客名称：{{item.customer_name}}</p>
                <p class="right">联系方式：{{item.customer_tel}}</p>
              </div>
              <p class="time">预约时间：{{item.begin_time}} - {{item.end_time}}</p>
              <p class="time" v-if="item.has_one_order_project&& item.has_one_order_project.rest_count">顾客{{appointmentLang.project}}剩余次数：{{item.has_one_order_project.rest_count}}</p>
              <p class="time" v-if="item.remark">备注：{{item.remark}}</p>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import appointment_project_controller from "./appointment_project_controller";

export default appointment_project_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .list-box {
    background-color: #fff;
    padding: 1rem;
  }

  .list-item {
    box-shadow: 0 0 0.469em 0 rgba(0, 0, 0, 0.08);
    border-radius: 0.313em;
    padding: 0.5rem;
    margin-bottom: 1em;
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .top {
    display: flex;

    .left {
      width: 4.344em;
      height: 4.344em;
      border-radius: 0.156em;
      flex: 0 0 4.344em;

      img {
        width: 4.344em;
        height: 4.344em;
        border-radius: 0.156em;
      }
    }

    .right {
      margin-left: 0.5em;
      flex: 1;
      display: flex;
      flex-direction: column;

      .title {
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .store_name {
        font-size: 13px;
        color: #999;
        margin-top: 0.3rem;
      }

      .name-box {
        display: flex;
        font-size: 12px;
        margin-top: 0.3rem;
      }

      .name {
        flex: 1;
        line-height: 1.5rem;
      }
    }
  }

  .yellow {
    flex: 0 0 5rem;
    text-align: center;
    width: 5rem;
    height: 1.5rem;
    line-height: 1.25rem;
    background-color: #f49f19;
    border-radius: 15px;
    color: #fff;
    padding: 0.2rem 0.4rem;
  }

  .down {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    margin-top: 0.5rem;

    .phone {
      display: flex;
      margin-bottom: 0.5rem;
    }

    .left {
      flex: 1;
    }

    .right {
      flex: 0 0 12em;
      text-align: right;
    }

    .time {
      margin: 0.2rem 0;
    }
  }
</style>
