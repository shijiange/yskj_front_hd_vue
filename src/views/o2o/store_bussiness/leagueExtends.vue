<template>
  <div class="page">
    <c-title text="店商联盟"></c-title>

    <div class="header">
      <div class="face">
        <img :src="member.avatar" alt="" v-if="member.avatar" />
      </div>
      <div class="desc">
        <div class="name">{{ member.nickname }}</div>
        <div class="level" v-if="level.has_one_agent_level">{{ level.has_one_agent_level.name }}</div>
      </div>
    </div>

    <div class="headerItems">
      <div class="headerItem">
        <div class="price">{{ $i18n.t("money") }}{{un_amount}}</div>
        <div class="desc">未结算金额</div>
      </div>
      <div class="headerItem">
        <div class="price">{{ $i18n.t("money") }}{{amount}}</div>
        <div class="desc">已结算金额</div>
      </div>
    </div>

    <div class="spltBorder"></div>

    <div class="recordHeader">
      <van-tabs v-model="activeName" @change="changeActive">
        <van-tab v-for="(item, key) in tabsArr" :key="key" :name="key" :title="item.name"></van-tab>
      </van-tabs>
    </div>

    <div class="listData">
      <template v-for="(item,index) in listData">
        <template v-if="activeName == 0 || activeName == 1 || activeName == 3">
          <div class="listItem" :key="index">
            <div class="lt">
              <div class="c1 cc">时间：{{item.created_at}}</div>
              <div class="c2 cc">
                <div class="desc">{{ descArr1[activeName] }}：</div>
                <div class="face" v-if="item.hasOneMember"><img :src="item.hasOneMember.avatar" alt=""></div>
                <div class="name" v-if="item.hasOneMember">{{item.hasOneMember.nickname}}</div>
              </div>
              <div class="c3 cc" v-if="activeName == 0 || activeName == 1">
                <div class="desc">{{ descArr2[activeName] }}：</div>
                <div class="name" v-if="item.hasOneAgentLevel">{{item.hasOneAgentLevel.name}}</div>
              </div>
            </div>
            <div class="rt">
              <div class="price">{{item.reward_amount}}</div>
              <div class="status">{{settlement[item.is_settlement]}}</div>
            </div>
          </div>
        </template>
        <template v-if="activeName == 2 || activeName == 8">
          <div class="listItem" :key="index">
            <div class="lt">
              <div class="c1 cc">时间：{{item.created_at}}</div>
              <div class="c2 cc">
                <div class="desc">{{ descArr1[activeName] }}：</div>
                <div class="face" v-if="item.has_one_store"><img :src="item.has_one_store.thumb" alt=""></div>
                <div class="name" v-if="item.has_one_store">{{item.has_one_store.store_name}}</div>
              </div>
            </div>
            <div class="rt">
              <div class="price">{{item.reward_amount}}</div>
              <div class="status">{{settlement[item.is_settlement]}}</div>
            </div>
          </div>
        </template>
        <template v-if="activeName == 4 || activeName == 5">
          <div class="listItem" :key="index">
            <div class="lt">
              <div class="c1 cc" v-if="activeName == 4 && item.has_one_order">{{item.has_one_order.order_sn}}</div>
              <div class="c2 cc">
                <div class="name">{{item.created_at}}</div>
              </div>
            </div>
            <div class="rt">
              <div class="price">{{item.reward_amount}}</div>
              <div class="status">{{settlement[item.is_settlement]}}</div>
            </div>
          </div>
        </template>
        <template v-if="activeName == 6 || activeName == 7">
          <div class="listItem" :key="index">
            <div class="lt">
              <div class="c1 cc">时间：{{item.created_at}}</div>
              <div class="c2 cc" v-if="activeName == 6">
                <div class="face" v-if="item.hasOneMember"><img :src="item.hasOneMember.avatar" alt=""></div>
                <div class="name" v-if="item.hasOneMember">{{item.hasOneMember.nickname}}</div>
              </div>
              <div class="c3 cc">
                <div class="desc">结算金额：</div>
                <div class="name">￥{{item.reward_amount}} 比例:{{item.reward_ratio}}%</div>
              </div>
            </div>
            <div class="rt">
              <div class="price">{{item.reward_amount}}</div>
              <div class="status">{{settlement[item.is_settlement]}}</div>
            </div>
          </div>
        </template>
      </template>
    </div>

    <!-- <div class="recordList" v-if="listData.length>0">
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

		</div> -->
  </div>
</template>

<script>
import leagueExtendsController from "./leagueExtends_controller";

export default leagueExtendsController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

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
      padding: 0.1rem 0.5rem;
      font-size: 0.813rem;
      border-radius: 0.625rem;
      background: rgba(255, 255, 255, 0.29);
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
}

.listData {
  padding: 0 0.906rem;

  .listItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 0.063rem solid #ebebeb;

    .lt {
      .cc {
        display: flex;

        .desc {
          font-size: 0.813rem;
          color: #333;
        }

        .face {
          width: 1.094rem;
          height: 1.094rem;
          margin-right: 0.2rem;
          border-radius: 50%;
          background-color: #bcbcbc;

          img {
            width: 1.094rem;
            height: 1.094rem;
            border-radius: 50%;
          }
        }

        .name {
          font-size: 0.813rem;
          color: #666;
        }
      }

      .c1 {
        font-size: 0.75rem;
        color: #8c8c8c;
      }

      .c2 {
        margin-top: 0.594rem;
      }

      .c3 {
        margin-top: 0.294rem;
      }
    }

    .rt {
      .price {
        font-size: 1rem;
        color: #f15353;
      }

      .status {
        margin-top: 0.325rem;
        font-size: 0.75rem;
        color: #8c8c8c;
      }
    }
  }
}
</style>
