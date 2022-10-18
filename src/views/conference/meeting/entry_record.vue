<template>
	<div id="all">
		<c-title :hide="false" text='报名记录'></c-title>
		<div id="content">
			<div class="box" v-for="(item,i) in list" :key='i'>
				<div class="active_info">
					<div class="img">
						<img :src="item.thumb">
					</div>
					<ul class="text">
						<li class="text_a">{{item.title}}</li>
						<li class="text_b">{{item.status}}</li>
						<li class="text_c">报名时间：{{item.enrol_time}}</li>
					</ul>
				</div>
				<div class="btn">
					<button type="button" @click="routerGo(item.conference_id,item.member_id)">查看报名</button>
					<button type="button" @click="goExtendList(item.conference_id,item.member_id)">推广报名</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import controller from './entry_record_controller';
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
        padding: 1rem;
        display: flex;

        .img {
          width: 6.875rem;
          height: 0 auto;
          max-height: 4.75rem;
          overflow: hidden;
          margin-right: 0.625rem;
          background: #f5f5f5;

          img {
            width: 100%;
          }
        }

        .text {
          width: 13.9375rem;
          text-align: left;

          .text_a {
            font-size: 16px;
            line-height: 1.5rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-bottom: 0.75rem;
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
