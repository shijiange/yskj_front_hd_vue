<template>
  <div id="all">
    <c-title :hide="false" text="推广报名列表"></c-title>
    <div id="content">
      <div class="box" v-for="(item,i) in list" :key='i'>
        <div class="active_info">
          <div class="img">
            <img
              :src="
                item.has_one_child_member.avatar
                  ? item.has_one_child_member.avatar
                  : require('../../../assets/images/photo-mr.jpg')
              "
            />
          </div>
          <ul class="text">
            <li class="text_a">{{ item.has_one_child_member.nickname }}</li>
            <li class="text_c">
              报名时间：{{ item.has_one_enrol.created_at }}
            </li>
          </ul>
        </div>
        <div class="btn">
          <button
            type="button"
            @click="
              routerGo(
                'MeetingIndexDetail',
                item.has_one_enrol.conference_id,
                item.member_id
              )
            "
          >
            查看报名
          </button>
          <button
            type="button"
            @click="
              goExtendList(item.has_one_enrol.conference_id, item.member_id)
            "
          >
            推广报名
          </button>
        </div>
      </div>
      <!-- <div class="box">
				<div class="active_info">
					<div class="img">
						<img src="../../../assets/images/photo-mr.jpg">
					</div>
					<ul class="text">
						<li class="text_a">经销商积分活动奖励</li>
						<li class="text_c">报名时间：2018-11-22&nbsp;&nbsp;&nbsp;15:28:20</li>
					</ul>
				</div>
				<div class="btn">
					<button type="button">查看报名</button>
					<button type="button">推广报名</button>
				</div>
			</div>
			<div class="box">
				<div class="active_info">
					<div class="img">
						<img src="../../../assets/images/photo-mr.jpg">
					</div>
					<ul class="text">
						<li class="text_a">经销商积分活动奖励</li>
						<li class="text_c">报名时间：2018-11-22&nbsp;&nbsp;&nbsp;15:28:20</li>
					</ul>
				</div>
				<div class="btn">
					<button type="button">查看报名</button>
					<button type="button">推广报名</button>
				</div>
			</div>
			<div class="box">
				<div class="active_info">
					<div class="img">
						<img src="../../../assets/images/photo-mr.jpg">
					</div>
					<ul class="text">
						<li class="text_a">经销商积分活动奖励</li>
						<li class="text_c">报名时间：2018-11-22&nbsp;&nbsp;&nbsp;15:28:20</li>
					</ul>
				</div>
				<div class="btn">
					<button type="button" >查看报名</button>
					<button type="button">推广报名</button>
				</div>
			</div> -->
    </div>
  </div>
</template>

<script>
import controller from "./extend_enroll_list_controller";
export default controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#all {
  #content {
    .box {
      background: #fff;
      margin-bottom: 0.625rem;

      .active_info {
        padding: 1rem 0.875rem;
        display: flex;

        .img {
          width: 3rem;
          height: 3rem;
          border-radius: 2.5rem;
          overflow: hidden;
          margin-right: 0.625rem;
          background: #f5f5f5;

          img {
            width: 100%;
          }
        }

        .text {
          width: 18.0625rem;
          text-align: left;

          .text_a {
            font-size: 16px;
            line-height: 1.5rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-bottom: 0.375rem;
          }

          .text_b {
            font-size: 14px;
          }

          .text_c {
            font-size: 14px;
            color: #8c8c8c;
          }
        }
      }

      .btn {
        border-top: solid 0.0625rem #ebebeb;
        display: flex;

        button {
          width: 50%;
          border: none;
          background: #fff;
          font-size: 16px;
          height: 1.5rem;
          margin: 0.4375rem 0;
        }

        button:first-child {
          border-right: solid 0.0625rem #ebebeb;
        }
      }
    }
  }
}
</style>
