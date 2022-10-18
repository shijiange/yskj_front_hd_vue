<template>
    <div class="page">
       <c-title text="业绩区域奖励"></c-title>

		<div class="header">
			<div class="face">
				<img :src="info.pic" alt="" v-if="info.pic">
			</div>
			<div class="desc">
				<div class="name">{{info.name}}</div>
				<div class="level">{{info.level_name}}   
				

				<i class="iconfont icon-icon_location" v-if="location.province || location.city"></i>
				<span v-if="location.province">{{location.province}}-</span>
				<span v-if="location.city">{{location.city}}</span>
					
					
				</div>
			</div>
		</div>

		<div class="headerItems">
			<div class="headerItem">
				<div class="price">
					{{$i18n.t('money')}}{{statistics.amount}}
				</div>
				<div class="desc">累计奖励额度</div>
			</div>
			<div class="headerItem">
				<div class="price">
					{{$i18n.t('money')}}{{statistics.already_reward}}
				</div>
				<div class="desc">累计释放额度</div>
			</div>
			<div class="headerItem">
				<div class="price">
					{{$i18n.t('money')}}{{statistics.not_release}}
				</div>
				<div class="desc">未释放额度</div>
			</div>
		</div>

		<div class="spltBorder"></div>

		<div class="recordHeader">
			<div class="recordTitle">奖励额度记录</div>
		</div>

		<div class="recordList" v-if="listData.length>0">
			<div v-for="(item) in listData" :key="item.id" >
				<div class="recordItem">
					<div class="top">
						<span class="c1">ID：{{item.id}}   <span v-if="item.belongs_to_reward">{{item.belongs_to_reward.area_name}}</span></span>
						<div class="c2" @click="gotoAwardsRecord(item.id)">
							查看详情 <i class="iconfont icon-advertise-next"></i>
						</div>
					</div>
					<div class="opts">
						<div class="opt">
							<div class="price">
								{{$i18n.t('money')}}{{item.amount}}
							</div>
							<div class="desc">累计奖励额度</div>
						</div>
						<div class="opt">
							<div class="price">
								{{$i18n.t('money')}}{{item.already_reward}}
							</div>
							<div class="desc">累计释放额度</div>
						</div>
						<div class="opt">
							<div class="price">
								{{$i18n.t('money')}}{{item.not_release}}
							</div>
							<div class="desc">未释放额度</div>
						</div>
					</div>
				</div>
				<div class="spltBorder"></div>
			</div>

		</div>




    </div>
</template>

<script>
import regionalAwardsController from './regional_awards_index_controller';

export default regionalAwardsController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: #fff; min-height: 100vh; padding-bottom: 3.0625rem; }

  .header {
    width: 23.438rem;
    height: 5.5rem;
    background-color: #f15353;
    display: flex;
    align-items: center;
    text-align: left;
    color: #fff;
    padding-left: 1.25rem;

    .face {
      width: 3rem;
      height: 3rem;
      background-color: #f15353;
      border-radius: 50%;
      border: solid 0.125rem #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .desc {
      height: 2.8rem;
      margin-left: 0.625rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        font-size: 1rem;
      }

      .level {
        font-size: 0.813rem;
      }
    }
  }

  .headerItems {
    width: 23.438rem;
    height: 4.875rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: #fff;

    .headerItem {
      .price {
        color: #f15353;
        font-size: 1rem;
        font-weight: bold;
      }

      .desc {
        margin-top: 0.3rem;
        color: #333;
        font-size: 0.75rem;
      }
    }
  }

  .spltBorder {
    width: 23.438rem;
    height: 0.438rem;
    background-color: #ebebeb;
  }

  .recordHeader {
    width: 100%;
    height: 2.5rem;
    border-bottom: 0.063rem solid #ebebeb;
    display: flex;
    justify-content: center;

    .recordTitle {
      height: 2.5rem;
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      color: #f15353;
      padding: 0 1.313rem;
      border-bottom: 0.188rem solid #f15353;
    }
  }

  .recordList {
    .recordItem {
      height: 6rem;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .top {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;

        .c1 {
          color: #202020;
        }

        .c2 {
          display: flex;
          color: #f15353;
        }
      }

      .opts {
        display: flex;
        justify-content: space-between;

        .opt {
          .price {
            color: #333;
            font-size: 0.938rem;
          }

          .desc {
            font-size: 0.75rem;
            color: #666;
          }
        }
      }
    }
  }

</style>
