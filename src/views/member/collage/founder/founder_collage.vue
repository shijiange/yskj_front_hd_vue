<template>
	<div class="page">
		<c-title text="拼单"></c-title>
		<van-tabs v-model="activeIndex" @change="changeActiveIndex">
			<van-tab title="全部">
				
			</van-tab>
			<van-tab title="待拼单">
				<div class="searchContainer">
					<div class="searchBg">
						<i class="iconfont icon-all_search_2"></i>
						<form action="javascript:void 0;" style="display: flex; flex: 1;" >
							<input class="input" type="search" v-model="searchText" @keyup.13="sendSearch" placeholder="搜索客户名称" >
						</form>
					</div>
				</div>
<!-- 				
				<div class="LatelyProjectList">
					<collage-item1 @delProject="delProject"></collage-item1>
					<collage-item1 @delProject="delProject"></collage-item1>
					<collage-item1 @delProject="delProject"></collage-item1>
				</div> -->
			</van-tab>
			<van-tab title="审核中">
				<!-- <div class="LatelyProjectList">
					<collage-item1 @delProject="delProject"></collage-item1>
					<collage-item1 @delProject="delProject"></collage-item1>
					<collage-item1 @delProject="delProject"></collage-item1>
				</div> -->
			</van-tab>
			<van-tab title="拼单中">
				<div class="tag3Container" v-if="power==1">
					<div class="tag3Item" v-for="(item,key) in tag3Items" :key="key" :class="[tag3Index==key ? 'active' : '']" @click="setTag3Index(key)">{{item}}</div>
				</div>
				<!-- <div class="LatelyProjectList">
					<collage-item2></collage-item2>
					<collage-item2></collage-item2>
					<collage-item2></collage-item2>
				</div> -->
			</van-tab>
			<van-tab title="已完成">
				<!-- <div class="LatelyProjectList">
					<collage-item3></collage-item3>
					<collage-item3></collage-item3>
					<collage-item3></collage-item3>
					<collage-item3></collage-item3>
				</div> -->
			</van-tab>
		</van-tabs>

		<div class="LatelyProjectList">
			<template v-for="item in listData">
				<collage-item1 v-if="item.project_shell_type==1" :power="power" :item="item" :key="item.id" @delProject="delProject" @addCollage="addCollage"></collage-item1>
				<collage-item2 v-if="item.project_shell_type==2" :power="power" :item="item" :key="item.id" @delProject="delProject" @addCollage="addCollage"></collage-item2>
				<collage-item3 v-if="item.project_shell_type==3" :power="power" :item="item" :key="item.id" @delProject="delProject" @addCollage="addCollage"></collage-item3>
			</template>
			
		</div>


		
	</div>
</template>

<script>
import founderCollageController from './founder_collage_controller';

export default founderCollageController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: rgb(255, 255, 255); min-height: 100vh; }

  .LatelyProjectList {
    padding-left: 0.844rem;
    padding-right: 0.875rem;
    background: #fff;
    border-bottom: 0.031rem solid #ededed;
  }

  .searchContainer {
    padding: 0 1.406rem;
    background: #fff;
    padding-top: 1rem;

    .searchBg {
      width: 100%;
      height: 1.906rem;
      background-color: #f4f6f6;
      border-radius: 0.953rem;
      display: flex;
      align-items: center;
      padding-left: 1.156rem;

      .iconfont {
        color: #acacac;
      }

      .input {
        height: 1.906rem;
        margin-left: 0.656rem;
        display: flex;
        flex: 1;
        font-size: 0.875rem;
        color: #767676;
        letter-spacing: 0.044rem;
        padding-right: 0.656rem;
        border: none;
      }
    }
  }

  .tag3Container {
    background: #fff;
    display: flex;
    overflow: scroll;
    padding-left: 1rem;

    .tag3Item {
      display: flex;
      margin-right: 1rem;
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

</style>