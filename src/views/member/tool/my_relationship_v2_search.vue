<template>
	<div id="myrelationship">
		<c-title :hide="false" text='我的关系'></c-title>
		<div class="search">
            <!-- <div v-for=" (item,index) in first_content">
							<div class="tbs" @click='toggle($event,index)'>
								<div class="li1"><img :src="item.avatar" /></div>
								<div class="li2">
									<p>昵称:{{item.nickname}}[id:{{item.id}}]</p>
									<p>金额:{{item.order_price}}</p>

								</div>
								<div class="li4">
										<i class='fa' :class="{'fa-angle-down':sort==index,'fa-angle-right':sort!=index}"></i>
									</div>
							</div>
							<transition name="fade">
								<div class="tbs3" v-show='sort==index'>
									<div class="left">粉丝数量：{{item.agent_total}}</div>
									<div class="right">粉丝订单金额：{{item.agent_order_price}}元</div>
									<div class="left1">推广角色：{{item.role}}</div>
								</div>
							</transition>
			</div> -->

            <div>
							<div class="tbs" @click='toggle($event,index)'>
								<div class="li1"><img/></div>
								<div class="li2">
									<p>昵称:111[id:111]</p>
									<p>金额:100</p>

								</div>
								<div class="li4">
										<i class='fa' :class="{'fa-angle-down':sort==index,'fa-angle-right':sort!=index}"></i>
									</div>
							</div>
							<transition name="fade">
								<div class="tbs3" v-show='sort==index'>
									<div class="left">粉丝数量：{{activeName}}</div>
									<div class="right">粉丝订单金额：{{$i18n.t('元')}}</div>
									<div class="left1">推广角色：{{myReferral}}</div>
								</div>
							</transition>
			</div>


		</div>

	</div>
</template>
<script>
import my_relationship_v2_search_controller from "./my_relationship_v2_search_controller";
export default my_relationship_v2_search_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#myrelationship {
  width: 100%;
  height: 100%;

  /* .search { */

  /* } */

  .relation-people {
    margin-top: 2.5rem;

    h3 {
      color: #666;
      font-size: 12px;
      margin: 0;
      padding: 0.625rem;
      text-align: left;
      font-weight: normal;
      background: #fff;
    }
  }

  .relation-people-info {
    padding: 0.625rem;
    float: left;
    width: 100%;

    .relation-people-info-img {
      width: 3.125rem;
      height: 3.125rem;
      // margin-top:10px;
      // margin-left:10px;
      float: left;
      line-height: 3.125rem;
      background: #ccc;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .relation-people-information {
      float: left;
      height: 3.125rem;

      p {
        margin: 0.4375rem;
      }
    }
  }

  .relation-people-row {
    background: #fff;
    clear: both;

    h3 {
      color: #666;
      font-size: 12px;
      margin: 0;
      padding: 0.625rem;
      text-align: left;
      font-weight: normal;
      background: #fff;
    }
  }

  .relation-people-amount {
    background: #fff;
    height: 2.3125rem;
    line-height: 2.3125rem;

    span {
      color: #666;
      font-size: 12px;
      padding-left: 0.625rem;
      text-align: left;
      font-weight: normal;
      float: left;
    }

    a {
      float: right;
      margin-right: 3%;
    }
  }

  a {
    float: right;
    margin-right: 3%;
  }
}

.tbs2 {
  background: #f5f5f5;
  align-items: center;
  border-bottom: #e8e8e8 0.0625rem solid;
  padding: 0 0.625rem;

  .left {
    width: 46%;
    text-align: left;
    height: 2.8125rem;
    display: inline-block;
    line-height: 2.8125rem;

    img {
      width: 30%;
    }
  }

  .right {
    width: 46%;
    display: inline-block;
    text-align: right;
  }
}

.tbs {
  align-items: center;
  border-bottom: #e8e8e8 0.0625rem solid;
  padding: 0.625rem;
  float: left;
  width: 100%;
  background: #fff;

  .left {
    font-size: 12px;
    box-sizing: border-box;
    width: 50%;
    text-align: left;
    height: 2.8125rem;
    line-height: 2.8125rem;
    float: left;

    img {
      width: 30%;
      float: left;
    }
  }

  .right {
    width: 50%;
    text-align: right;
  }

  a {
    color: #000;
  }

  .relation {
    color: #666;
  }

  .id,
  .level {
    font-size: 14px;
    line-height: 2.8125rem;
  }

  .fa.fa-search {
    color: #999;
    font-size: 20px;
  }

  i {
    font-size: 24px;
  }

  .img {
    margin: 0.625rem 0;
  }

  .li1 {
    width: 3.125rem;
    height: 3.125rem;
    // margin-top:10px;
    // margin-left:10px;
    float: left;
    line-height: 3.125rem;
    background: #ccc;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .li2 {
    float: left;
    height: 3.125rem;

    p {
      margin-top: 0.4375rem;
      margin-left: 0.4375rem;
      text-align: left;
    }
  }

  .li3 {
    flex: 30%;
    width: 30%;

    span {
      border: #b1a6a6 solid 0.0625rem;
      padding: 0.3125rem 1.25rem;
      border-radius: 0.4375rem;
      display: none;
    }
  }

  .li4 {
    // flex: 5%;
    // width: 5%;
    float: right;
    height: 3.125rem;
    line-height: 3.125rem;
  }
}

.imgst {
  background: #f5f5f5;
}

.fade-enter-active {
  transition: 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  height: 0;
}

.tbs3 {
  .left {
    width: 46%;
    text-align: left;
    height: 2.8125rem;
    display: inline-block;
    line-height: 2.8125rem;

    img {
      width: 30%;
    }
  }

  .right {
    width: 46%;
    display: inline-block;
    text-align: right;
    height: 2.8125rem;
    line-height: 2.8125rem;
  }
}

//弹窗
.relation-popup {
  overflow: auto;
  width: 100%;
}

.relation-popup-con {
  h3 {
    color: red;
    font-size: 0.8rem;
    margin: 0;
    padding: 5%;
    text-align: left;
    font-weight: normal;
    background: #fff;
  }

  ul {
    padding: 0 5% 0 5%;

    li {
      width: 30%;
      background: #e8e6e9;
      float: left;
      height: 1.875rem;
      margin-right: 5%;
      margin-bottom: 0.625rem;
      border-radius: 0.3125rem;
      line-height: 1.875rem;
    }

    li:nth-of-type(3n) {
      margin-right: 0;
    }

    .active {
      border: 0.0625rem solid red;
      background: #fff;
    }
  }
}

.relation-popup-lever {
  clear: both;

  h3 {
    color: red;
    font-size: 12px;
    margin: 0;
    padding: 5%;
    text-align: left;
    font-weight: normal;
    background: #fff;
  }

  ul {
    padding: 0 5% 0 5%;

    li {
      width: 30%;
      background: #e8e6e9;
      float: left;
      height: 1.875rem;
      margin-right: 5%;
      margin-bottom: 0.625rem;
      border-radius: 0.3125rem;
      line-height: 1.875rem;
    }

    li:nth-of-type(3n) {
      margin-right: 0;
    }

    .active {
      border: 0.0625rem solid red;
      background: #fff;
    }
    // }

    // li:nth-child(1){
    // 	margin-right:5%;
    // }
  }
}

.tbs2 {
  background: #f5f5f5;
  align-items: center;
  border-bottom: #e8e8e8 0.0625rem solid;
  padding: 0 0.625rem;

  .left {
    width: 46%;
    text-align: left;
    height: 2.8125rem;
    display: inline-block;
    line-height: 2.8125rem;

    img {
      width: 30%;
    }
  }

  .right {
    width: 46%;
    display: inline-block;
    text-align: right;
  }
}

.tbs {
  align-items: center;
  border-bottom: #e8e8e8 0.0625rem solid;
  padding: 0.625rem;
  float: left;
  width: 100%;
  background: #fff;

  .left {
    font-size: 12px;
    box-sizing: border-box;
    width: 50%;
    text-align: left;
    height: 2.8125rem;
    line-height: 2.8125rem;
    float: left;

    img {
      width: 30%;
      float: left;
    }
  }

  .right {
    width: 50%;
    text-align: right;
  }

  a {
    color: #000;
  }

  .relation {
    color: #666;
  }

  .id,
  .level {
    font-size: 14px;
    line-height: 2.8125rem;
  }

  .fa.fa-search {
    color: #999;
    font-size: 20px;
  }

  i {
    font-size: 24px;
  }

  .img {
    margin: 0.625rem 0;
  }

  .li1 {
    width: 3.125rem;
    height: 3.125rem;
    // margin-top:10px;
    // margin-left:10px;
    float: left;
    line-height: 3.125rem;
    background: #ccc;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .li2 {
    float: left;
    height: 3.125rem;

    p {
      margin-top: 0.4375rem;
      margin-left: 0.4375rem;
      text-align: left;
    }
  }

  .li3 {
    flex: 30%;
    width: 30%;

    span {
      border: #b1a6a6 solid 1px;
      padding: 0.3125rem 1.25rem;
      border-radius: 0.4375rem;
      display: none;
    }
  }

  .li4 {
    // flex: 5%;
    // width: 5%;
    float: right;
    height: 3.125rem;
    line-height: 3.125rem;
  }
}

.tbs2 {
  padding: 0.625rem 1.25rem;
}

.imgst {
  background: #f5f5f5;
}

.fade-enter-active {
  transition: 0.5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  height: 0;
}

.tbs3 {
  .left {
    width: 46%;
    text-align: left;
    height: 2.8125rem;
    display: inline-block;
    line-height: 2.8125rem;

    img {
      width: 30%;
    }
  }

  .left1 {
    width: 100%;
    text-align: left;
    height: 2.8125rem;
    padding-left: 0.8125rem;
    display: inline-block;
    line-height: 2.8125rem;

    img {
      width: 30%;
    }
  }

  .right {
    width: 46%;
    display: inline-block;
    text-align: right;
    height: 2.8125rem;
    line-height: 2.8125rem;
  }
}
</style>
