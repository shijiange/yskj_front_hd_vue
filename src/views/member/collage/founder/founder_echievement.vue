<template>
	<div class="page">
		<c-title text="业绩表单"></c-title>
		<div class="headerTag">
			<div class="headerTagItem" v-if="power==1" :class="[headerTagIndex==0 ? 'active' : '']" @click="setHeaderTagIndex(0)">
				<span>团队业绩</span>
			</div>
			<div class="headerTagItem" :class="[headerTagIndex==1 ? 'active' : '']" @click="setHeaderTagIndex(1)">
				<span>个人业绩</span>
			</div>
		</div>

		<div class="team">
			<van-tabs v-model="vanTagIndex" @change="changeVanTabIndex">
				<van-tab title="今日">
					
				</van-tab>
				<van-tab title="昨日">
					
				</van-tab>
				<van-tab title="近7日">
					
				</van-tab>
				<van-tab>
					<template #title>{{currentSelectedMonth==0 ? '当' : currentSelectedMonth}}月 <i class="iconfont icon-ht_more_bottom" @click="openMonth" style="font-size: 0.8rem;"></i></template>
				</van-tab>
			</van-tabs>
		</div>

		<!-- <div class="personal" v-show="headerTagIndex==1">
			<van-tabs v-model="active" @change="changeVanTabIndex">
				<van-tab title="今日">
					
				</van-tab>
				<van-tab title="昨日">
					
				</van-tab>
				<van-tab title="近7日">
					
				</van-tab>
				<van-tab>
					<template #title>{{currentSelectedMonth==0 ? '当' : currentSelectedMonth}}月 <i class="iconfont icon-ht_more_bottom" @click="openMonth" style="font-size:0.8rem;"></i></template>
				</van-tab>
			</van-tabs>
		</div> -->

		<month v-show="monthShow" @selectedMonth="selectedMonth"></month>

		<div class="tag3">
			<div class="tag3Container">
				<div class="tag3Item" v-for="(item,key) in tag3Items" :key="key" :class="[tag3Index==key ? 'active' : '']" @click="setTag3Index(key)">{{item}}</div>
			</div>
		</div>

		<div class="listItems" v-if="headerTagIndex==0">
			<template v-for="item in listData" >
				<echievement-list-item1 :item="item" :key="item.id"></echievement-list-item1>
			</template>
			
		</div>
		<div class="listItems" v-if="headerTagIndex==1">
			<template v-for="item in listData" >
				<echievement-list-item2 :key="item.id" :item="item" v-if="tag3Index==4 || tag3Index==5"></echievement-list-item2>
				<echievement-list-item3 :key="item.id" :item="item" v-else></echievement-list-item3>
			</template>
			<!-- <echievement-list-item3></echievement-list-item3>
			<echievement-list-item1></echievement-list-item1> -->

		</div>

		
	</div>
</template>

<script>
import founderEchievementController from './founder_echievement_controller';

export default founderEchievementController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: rgb(246, 248, 252); min-height: 100vh; padding-bottom: 3.0625rem; }

  .headerTag {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.594rem;
    background: rgb(246, 248, 252);

    .headerTagItem {
      height: 2.594rem;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;
      font-size: 0.875rem;
      font-weight: bold;

      &.active {
        position: relative;
        color: #ff2c29;

        &::after {
          content: '';
          display: block;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
          border-bottom: 0.469rem solid #fff;
          border-left: 0.469rem solid transparent;
          border-right: 0.469rem solid transparent;
        }
      }
    }
  }

  .tag3 {
    padding: 0.844rem 1.156rem;
    background: #fff;

    .tag3Container {
      display: flex;
      justify-content: space-between;
      overflow: scroll;

      .tag3Item {
        display: flex;
        margin-right: 0.5rem;
        white-space: nowrap;
        align-items: center;
        justify-content: center;
        padding: 0.238rem 0.575rem;
        background-color: #f5f7fb;
        border-radius: 0.828rem;
        font-size: 0.75rem;
        color: #6e6f6f;

        &.active {
          color: #ff2c29;
          background-color: #fee;
        }
      }
    }
  }

</style>