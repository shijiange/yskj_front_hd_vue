<template>
  <div id="work-day" >>
    <c-title :hide="false" :text="'工作时间'">
    </c-title>

    <div class="main">
      <div style="margin-bottom: 1.5rem;">
        <ul class="list-wrap">
          <li v-for="item in store" :key="item.id">
            <div class="time">
              <p class="name">门店： {{item.store_name}}</p>
              <div class="icon-box" @click="addTime(item)">
                <div class="edit"><i class="iconfont icon-appointment_edite"></i>编辑</div>
                <!--<div class="delete"><i class="iconfont icon-appointment_delete"></i>删除</div>-->
              </div>
            </div>
            <p class="gray" v-if="item.show">
              <span v-if="item.times.length <= 0">暂无预约</span>
              <em v-if="item.times.length > 0">预约：</em><span v-for="(time,index) in item.times" :key="index">{{time.date}} {{time.begin_time}}-{{time.end_time}}；</span>
            </p>
            <div class="pull_down" @click="getTime(item)">
              <i class="fa fa-angle-down" style="font-size: 1.2rem;" v-if="!item.show"></i>
              <i class="fa fa-angle-up" style="font-size: 1.2rem;" v-else></i>
            </div>
          </li>
        </ul>
      </div>


    </div>

    <div class="add_stores" :class="[fun.getPhoneEnv() == 3?'PC-style':'']">
      <img  @click="addTime" src="../../../assets/images/appointment_add@2x.png"/>
    </div>
  </div>
</template>

<script>
import work_day_controller from "./work_day_controller";

export default work_day_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #work-day {
    background-color: #fff;
    position: relative;
  }

  .add_stores {
    position: fixed;
    right: 0;
    bottom: 2rem;
  }

  .PC-style {
    width: 375px;
    right: 51%;
    bottom: 6rem;
    transform: translateX(50%);
    text-align: right;
  }

  .add_stores img {
    width: 3rem;
    height: 3rem;
    margin: 0;
  }

  .main {
    text-align: left;
    padding: 0.5rem;
  }

  .black {
    font-size: 16px;
    font-weight: bold;
    margin-right: 1rem;
  }

  .list-wrap {
    li {
      position: relative;
      margin: 1rem 0;
      padding: 0.5rem 0.5rem 1rem 0.5rem;
      box-shadow: 0 0 0.563rem 0 rgba(169, 169, 169, 0.24);
      border-radius: 0.156rem;
    }

    .time {
      display: flex;
    }

    .gray {
      color: #999;
      font-size: 14px;
      margin-top: 0.5rem;
      display: flex;
      flex-wrap: wrap;

      span {
        display: inline-block;
        margin: 0.1rem;
      }
    }

    .icon-box {
      display: flex;
      color: #ccc;
    }

    .edit {
      margin-right: 0.5rem;
    }

    .name {
      flex: 1;
      font-weight: bold;
    }

    .pull_down {
      text-align: center;
      position: absolute;
      left: 50%;
      bottom: -0.2rem;
      margin-left: -1.375rem;
      width: 3.47rem;
      height: 1rem;
      background-color: #fff;
      box-shadow: 0.09rem 0.08rem 0.46rem 0.04rem rgba(108, 108, 108, 0.07);
      border-radius: 0.44rem;
    }
  }
</style>
