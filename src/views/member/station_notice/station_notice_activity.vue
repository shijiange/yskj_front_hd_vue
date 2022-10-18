<template>

	<div class="page">
		<c-title :text="titleName"></c-title>

		<div class="items">
			<div class="item" v-for="item in listData" :key="item._id" @click="goPages(item.url)">
				<p class="time">{{item.created_at}}</p>
				<div class="wrapper">
					<div class="face" v-if="item.msg_img_src!=''">
						<img :src="item.msg_img_src" alt="">
					</div>
					<div class="name">{{item.title}}</div>
					<div class="desc">{{item.desc}}</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>

import stationNoticeActivityController from './station_notice_activity_constroller.js';

export default stationNoticeActivityController;

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    background: rgb(250, 250, 250);
    min-height: 100vh;
    padding-bottom: 3.0625rem;
    text-align: left;
  }

  .items {
    padding: 0 0.781rem;

    .item {
      .time {
        height: 2.75rem;
        line-height: 2.75rem;
        letter-spacing: 0.019rem;
        color: #666;
        font-size: 0.75rem;
        text-align: center;
      }

      .wrapper {
        background-color: #fff;
        border-radius: 0.25rem;
        width: 100%;
        padding: 0.844rem 0.875rem 1.031rem 0.969rem;

        .face {
          img {
            width: 20.563rem;
            height: 8.281rem;
            background-color: #eeecec;
          }
        }

        .name {
          margin-top: 0.813rem;
          color: #000;
          font-size: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .desc {
          margin-top: 0.625rem;
          font-size: 0.75rem;
          letter-spacing: 0.019rem;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }

</style>