<template>

	<div class="page">
		<c-title :text="titleName"></c-title>


		<div class="items">

			<div class="item" v-for="(item) in listData" :key="item._id" @click="goPages(item.url)">
				<p class="time">{{item.created_at}}</p>
				<div class="wrapper" v-if="item.msg_body!=null" >

					<div class="name">{{item.title}}</div>
					<p class="c1 ca">{{item.desc}}</p>
					<div class="anchor" v-if="item.msg_body && item.msg_body.length!=0">
						<div class="face">
							<img :src="item.msg_body.img" alt="">
						</div>
						<div class="desc">
							<p class="name">{{item.msg_body.title}}</p>
							<p class="tips">点击查看</p>
						</div>
					</div>

				</div>
				<div class="wrapper_activity" v-else>
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

import stationNoticeAnchorController from './station_notice_anchor_controller.js';

export default stationNoticeAnchorController;

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
        padding: 0.844rem 0.875rem 0 0.969rem;

        .name {
          flex: 1;
          color: #000;
          font-size: 1rem;
        }

        .c1 {
          margin-top: 0.519rem;
        }

        .ca {
          font-size: 0.75rem;
          line-height: 1.25rem;
          letter-spacing: 0.019rem;
          color: #666;
        }

        .anchor {
          display: flex;
          height: 6.531rem;
          padding: 1rem 0 1.531rem 0;

          .face {
            img {
              width: 4rem;
              height: 4rem;
              background-color: #999;
            }
          }

          .desc {
            height: 4rem;
            padding-left: 0.531rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .name {
              letter-spacing: 0.019rem;
              color: #000;
              font-size: 0.75rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .tips {
              letter-spacing: 0.019rem;
              font-size: 0.75rem;
              color: #f42a2a;
            }
          }
        }
      }

      .wrapper_activity {
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