<template>

	<div class="page">
		<c-title :text="titleName"></c-title>


		<div class="items">
			<div class="item type1" v-for="item in listData" :key="item._id" @click="goPages(item.url)">
				<p class="time">{{item.created_at}}</p>
				<div class="wrapper">

					<div class="name">{{item.title}}</div>
					<p class="c1 ca">{{item.desc}}</p>
					<div class="botm" v-if="item.msg_body.length==0">
						<span>查看详情</span>
						<i class="iconfont icon-advertise-next"></i>
					</div>

					<div class="anchor" v-else>
						<div class="face">
							<img :src="item.msg_body.img" alt="">
						</div>
						<div class="desc">
							<p class="name">{{item.msg_body.title}}</p>
							<p class="tips">{{item.msg_body.desc}}</p>
						</div>
					</div>

				</div>
			</div>

		</div>



	</div>
</template>

<script>

import stationNoticeExamineController from './station_notice_examine_controller.js';

export default stationNoticeExamineController;

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    background: rgb(250, 250, 250);
    min-height: 100vh;
    padding-bottom: 4.0625rem;
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

        .botm {
          margin-top: 0.813rem;
          border-top: 0.031rem solid #f4f4f4;
          height: 1.938rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          letter-spacing: 0.022rem;
          color: #666;
          font-size: 0.875rem;
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
    }
  }

</style>