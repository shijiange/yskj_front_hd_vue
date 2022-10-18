<template>
	<div id="rentDepositDetail">
		<c-title :hide="false" text='押金明细'></c-title>
		<div id="tabs">
			<van-tabs v-model="activeName">
				<van-tab name="first">
					<span slot="title" @click="handleClick('0')">全部</span>
				</van-tab>
				<van-tab name="second">
					<span slot="title" @click="handleClick('1')">{{income_name_text}}</span>
				</van-tab>
				<van-tab name="third">
					<span slot="title" @click="handleClick('2')" >支出</span>
				</van-tab>
			</van-tabs>
			<div>
			<!-- <mt-tab-container v-model="activeName"> -->
			<!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
				<!--<el-tab-pane label="全部" name="first">-->
				<div v-show="activeName=='first'">
				<!-- <mt-tab-container-item id="first"> -->
					<ul class="all">
						<li v-for="(item,i) in all" :key='i'>
							<div class="lf">
								<h3>{{item.source_name}}</h3>
								<p>{{item.created_at}}</p>
							</div>
							<div class="rt">{{item.money}}</div>
						</li>
					</ul>
				<!-- </mt-tab-container-item> -->
				</div>
				<!--</el-tab-pane>-->
				<div v-show="activeName=='second'">
				<!-- <mt-tab-container-item id="second"> -->
				<!--<el-tab-pane label="收入" name="second">-->
					<ul class="all">
						<li v-for="(item,i) in all" :key='i'>
							<div class="lf">
								<h3>{{item.source_name}}</h3>
								<p>{{item.created_at}}</p>
							</div>
							<div class="rt">{{item.money}}</div>
						</li>
					</ul>
				<!--</el-tab-pane>-->
				<!-- </mt-tab-container-item> -->
				</div>
				<div v-show="activeName=='third'">
				<!-- <mt-tab-container-item id="third"> -->
				<!--<el-tab-pane label="支出" name="third">-->
					<ul class="all">
						<li v-for="(item,i) in all" :key='i'>
							<div class="lf">
								<h3>{{item.source_name}}</h3>
								<p>{{item.created_at}}</p>
							</div>
							<div class="rt">{{item.money}}</div>
						</li>
					</ul>
				<!--</el-tab-pane>-->
				<!-- </mt-tab-container-item> -->
				</div>
			<!--</el-tabs>-->
			<!-- </mt-tab-container> -->
			</div>
		</div>
	</div>
</template>

<script>
import rentDepositDetail_controller from './rentDepositDetail_controller';
export default rentDepositDetail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#rentDepositDetail {
  #tabs {
    min-height: 100vh;

    #goods_content {
      img {
        width: 100%;
      }
    }
  }

  .mint-navbar {
    /* margin-top: 2.8125rem; */
  }

  .all {
    background: #fff;

    li {
      height: 4.375rem;
      padding: 0 3%;
      border-top: 0.0625rem solid #ccc;

      div.lf {
        width: 74%;

        h3 {
          text-align: left;
          font-weight: normal;
          line-height: 1.875rem;
          padding-top: 0.625rem;
        }

        p {
          text-align: left;
        }
      }

      div.rt {
        width: 20%;
        text-align: right;
        line-height: 4.375rem;
      }
    }

    li:last-child {
      border-bottom: 0.0625rem solid #ccc;
    }
  }
}
</style>