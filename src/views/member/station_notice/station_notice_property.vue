<template>

	<div class="page">
		<c-title :text="titleName"></c-title>

		<van-tabs v-model="active"  @click="changeTags">
			<van-tab  v-for="item in subTypeList" :key="item.sub_type" :title="item.sub_title">
				<div class="items">
					<div class="item" v-for="item in listData" :key="item._id" @click="goPages(item.url)">
						<p class="time">{{item.created_at}}</p>
						<div class="wrapper">

							<div class="name">{{item.title}}</div>
							<p class="c1 ca">{{item.desc}}</p>
							<p class="c2 ca" v-for="(val,k) in item.msg_body" :key="k">{{msg_body[k]}}{{val}}</p>

							<div class="botm">
								<span>查看详情</span>
								<i class="iconfont icon-advertise-next"></i>
							</div>

						</div>
					</div>
				</div>
			</van-tab>

		</van-tabs>


	</div>
</template>

<script>

import stationNoticePropertyController from './station_notice_property_controller.js';

export default stationNoticePropertyController;

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
      }
    }
  }

</style>