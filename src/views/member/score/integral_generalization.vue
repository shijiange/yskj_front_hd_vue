<template>
  <div id="build_active">
    <c-title :hide="false" :text="integral?integral:'积分'">
    </c-title>
    <div id="content">
      <ul class="need_active">
        <li><h1>-{{total}}<span>{{integral?integral:'积分'}}</span></h1></li>
        <li>当前创建活动所需要的{{integral?integral:'积分'}}</li>
      </ul>
      <ul class="active_info">
        <li>
          <span>当前{{integral?integral:'积分'}}：</span>
          <span>{{credit1}}</span>
        </li>
        <li>
          <span>活动名称：</span>
          <input v-model="activityName" type="text" placeholder="填写名称">
        </li>
        <li>
          <span>每人赠送：</span>
          <input v-model="average" @keyup="average=average.replace(/[^\d]/g,'')" type="tel" placeholder="填写数量">
        </li>
        <li>
          <span>赠送数量：</span>
          <input v-model="personNumber" @keyup="personNumber=personNumber.replace(/[^\d]/g,'')" type="tel"
                 placeholder="填写人数">
        </li>
      </ul>
      <div class="btn">
        <button type="button" @click="createActivity">确认创建</button>
      </div>
    </div>
  </div>
</template>
<script>
import Integral_generalization_controller from "./integral_generalization_controller";

export default Integral_generalization_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #build_active {
    #content {
      .need_active {
        background-color: #fff;
        margin-top: 0.625rem;
        padding: 0.625rem 0.875rem;
        text-align: left;

        li {
          line-height: 1.875rem;
          font-size: 14px;
          display: flex;

          span {
            font-size: 14px;
            font-weight: normal;
          }

          h1 {
            font-size: 24px;
          }
        }

        li:last-child {
          color: #8c8c8c;
        }
      }

      .active_info {
        background-color: #fff;
        padding-left: 0.875rem;
        margin-top: 0.625rem;

        li {
          height: 2.8125rem;
          line-height: 2.8125rem;
          padding-right: 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          display: flex;
          font-size: 16px;

          span:first-child {
            text-align: left;
            width: 7.75rem;
            white-space: nowrap;
            overflow: hidden;
          }

          span:last-child {
            width: 15.4375rem;
            text-align: left;
            font-size: 18px;
            color: #f15353;
          }

          input {
            width: 15.4375rem;
            border: none;
          }
        }

        li:last-child {
          border: none;
        }
      }

      .btn {
        margin-top: 1.25rem;

        button {
          color: #fff;
          width: 90%;
          height: 2.875rem;
          background-color: #f15353;
          border-radius: 0.375rem;
          font-size: 16px;
          border: none;
        }
      }
    }
  }
</style>