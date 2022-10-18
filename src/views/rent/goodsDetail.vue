<template>
	<transition name="fade2">
		<div id="goods">
			<div id="hoid" @click="goto" :class="{hoet:hoet}">
				<div id="back">
					<i class="iconfont icon-member-left"></i>
				</div>
			</div>

			<c-myswipe style="height: 100vw;" :pagination-visible="true" :slides="goodsInfo.thumb_url" :repeating="true" :auto="0">

				<div v-for="(ithumb,index) in goodsInfo.thumb_url" :key="index">
					<template v-if='ithumb'>
						<img :src="ithumb" width="100%">
					</template>
					<template v-if='!ithumb'>
						<img src="../../assets/images/img_default.png" width="100%">
					</template>
				</div>
			</c-myswipe>

			<!--<el-row>-->
			<van-row>
				<!--<el-col :span="21" id='tilie'>-->
				<van-col :span="21" id='tilie'>
					1{{goodsInfo.title}}
				<!--</el-col>-->
				</van-col>
				<van-col :span="3">
				<!--<el-col :span="3">-->
					<div id='share' @click="shareWeixin" class="rt">
						<i class="fa fa-share-alt" aria-hidden="true"></i>
						<br/>
						<span>分享</span>
					</div>
				<!--</el-col>-->
				</van-col>
			</van-row>
			<!--</el-row>-->

			<!--<el-row>-->
			<van-row>
				<van-col :span="24" id='price'>
				<!--<el-col :span="24" id='price'>-->
					{{$i18n.t('money')}}<span id="price-num">{{(goodsInfo.has_option==1?goodsInfo.min_price+"-"+goodsInfo.max_price:goodsInfo.price)}}</span>
				<!--</el-col>-->
				</van-col>
				<van-col :span="24" id='stockcontainer'>
				<!--<el-col :span="24" id='stockcontainer'>-->
					<van-col :span="12"  v-if="isLeaseGoods">
					<!--<el-col :span="12" v-if="isLeaseGoods">-->
						押金：{{cash}}
					<!--</el-col>-->
					</van-col>
					<van-col :span="12" class="sale">
					<!--<el-col :span="12" class="sale">-->
						库存:{{goodsInfo.stock}}&nbsp;&nbsp;销量:{{goodsInfo.show_sales}}
					<!--</el-col>-->
					</van-col>
				<!--</el-col>-->
				</van-col>
				<van-col :span="24" class="trans" v-if="isCanPresended">
				<!--<el-col :span="24" class="trans" v-if="isCanPresended">-->
					支持转赠<i class="iconfont icon-tishi" @click="changeTransfer"></i>
				<!--</el-col>-->
				</van-col>
			</van-row>
			<!--</el-row>-->

			<!-- 弹窗 -->
			<div class="modal" v-show="transfer">
				<div class="modal-dialog">
					<div class="close" @click="changeTransfer">
						<img src="../../assets/images/close.png">
					</div>
					<h1 class="title">转赠说明</h1>
					<p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
				</div>
			</div>

			<van-popup :style="{overflow:'visible'}" v-model="popupSpecs" position="bottom" class="mint-popup-4" closeOnClickModal='true'>
				<div class="specifications">
					<div class="shopimg">
						<div id="chooser_img">
							<img :src="popThumb">
						</div>
						<div class="right">
							<div class="price">{{$i18n.t('money')}}
								<span id="option_price">{{popPrice}}1</span>
							</div>
							<div class="option">库存{{popStock}}{{goodsInfo.sku}}</div>
							<div class="option">{{goodsDescription}}</div>
						</div>
					</div>

					<div class="shopdata noVantRadio">
						<ul v-if="false">
							<li v-for="(shopdata,index) in shopdatas" :key='index'>
								{{shopdata.title}}租：{{shopdata.day}}{{$i18n.t('元')}}/天
								<span class="rt">{{shopdata.tip}}</span>
							</li>
						</ul>

						<template>
							<van-radio-group v-model="shopdatasItem" checked-color="#f15353" @change="selectRentType">
								<van-radio :class="{vantRadioshow:shopdatasItem==item}" :disabled="item.c" v-for="(item,index) in shopdatas" :key="index" :name="item">{{item.name+" "+item.value+"/"+item.time_unit}}</van-radio>
							</van-radio-group>
							<!--<el-radio-group v-model="shopdatasItem" size='small' fill='#f15353' @change="selectRentType">-->
								<!--<el-radio-button :disabled="item.c" v-for="(item,index) in shopdatas" :label="item">{{item.name+" "+item.value+"/"+item.time_unit}}</el-radio-button>-->
							<!--</el-radio-group>-->
						</template>

						<!--日期-->
						<div class="block">
							<span class="demonstration lf">起借日期</span>
							<!--<el-date-picker v-model="rentDate" type="date" placeholder="选择日期" :picker-options="pickerOptions0" :editable="false" format="yyyy-MM-dd" @change="rentDateChange">-->
							<!--</el-date-picker>-->
							<van-button plain type="primary" style="border-radius: 5px; color: #1f2d3d; min-width: 10rem; margin-right: 4rem; margin-top: 0.2rem;" @click="seleStartTime" >{{startTime}}</van-button>
						</div>

						<!--<el-row>-->
						<van-row>
							<van-col :span="8" id='num'>
							<!--<el-col :span="8" id='num'>-->
								租赁周期：
							<!--</el-col>-->
							</van-col>
							<van-col :span="13">
							<!--<el-col :span="13">-->
								<div class="num">
									<div class="leftnav" @click='reduceDays'>-</div>
									<input type="text" class="shownum" v-model='rentDay'>
									<div class="rightnav" @click='addDays'>+</div>
								</div>
							<!--</el-col>-->
							</van-col>
							<van-col :span="2">
							<!--<el-col :span="2">-->
								<span>{{rentDayType}}</span>
							<!--</el-col>-->
							</van-col>
						</van-row>
						<!--</el-row>-->
					</div>

					<div class="shopinfo noVantRadio" v-if="has_option">
						<dl v-for="(specs,i) in goodsInfo.has_many_specs" :key='i'>
							<dt>{{specs.title}}</dt>
							<dd>
								<van-radio-group v-model="specs.description" checked-color="#f15353" @change="selectSpecs">
									<van-radio :class="{vantRadioshow:specs.description==specitem}" :disabled="specitem.c" v-for="(specitem,index) in specs.specitem" :name="specitem" :key='index'>{{specitem.title}}</van-radio>
								</van-radio-group>
								<!--<el-radio-group v-model="specs.description" size='small' fill='#f15353' @change="selectSpecs">-->
									<!--<el-radio-button :disabled="specitem.c" v-for="(specitem,index) in specs.specitem" :label="specitem">{{specitem.title}}</el-radio-button>-->
								<!--</el-radio-group>-->
							</dd>
						</dl>

					</div>

					<div class="shopcount">
						<van-row>
						<!--<el-row>-->
							<van-col :span="12" id='num'>
							<!--<el-col :span="12" id='num'>-->
								租赁数量：
							<!--</el-col>-->
							</van-col>
							<van-col :span="11">
							<!--<el-col :span="11">-->
								<div class="num">

									<div class="leftnav" @click='reduceGoods'>-</div>
									<input type="text" class="shownum" v-model='goodsCount'>
									<div class="rightnav" @click='addGoods'>+</div>

								</div>
							<!--</el-col>-->
							</van-col>
						<!--</el-row>-->
						</van-row>
					</div>

					<div class="shopconf">
						<div class="allMoney lf" v-if="false">
							<span>合计：
								<b>{{}}</b>
							</span>
						</div>
						<div class="confirm rt" @click='confirm'>确定</div>
						<!--<router-link :to="fun.getUrl('confirmOrder')">
									<div class="confirm rt">确定</div>
								</router-link>-->

					</div>

				</div>
			</van-popup>
			<div id="foot">
				<div class="addfav"  @click="btnsPop=false">
					<template>
						<i class="iconfont icon-guhua"></i>热线
					</template>
					<div class="modal" v-show="btnsPop">
						<div class="btns" @click.stop>
							<button>呼叫</button>
							<button>添加到通讯录</button>
						</div>
					</div>
				</div>
				<div class="cservice">
					<a :href="$store.state.cservice">
						<i class="iconfont icon-kefu"></i>客服</a>
				</div>

				<!--<router-link :to="fun.getUrl('rentCenter')">-->
				<div class="buy cell" @click="buyNow">立即租</div>
				<!--</router-link>-->
			</div>

			<div style="height: 0.625rem;"></div>
			<div id="shopInfo" ref='goodinfo' :class="{goodTop:goodTop==true, 'pcStyle':fun.getPhoneEnv() == 3}">
				<div id="tabs">
					<van-tabs v-model="activeName">
						<van-tab name="first">
							<span @click="handleClick('0')" slot="title">商品介绍</span>
						</van-tab>
						<van-tab name="second">
							<span @click="handleClick('1')" slot="title">商品参数</span>
						</van-tab>
						<van-tab name="third" >
							<span @click="handleClick('2')" slot="title">用户评价</span>
						</van-tab>
					</van-tabs>
					<div>
					<!-- <mt-tab-container v-model="activeName"> -->
					<!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
						<div v-show="activeName=='first'">
						<!-- <mt-tab-container-item id="first"> -->
							<div id="goods_content" v-html='first_content'></div>

						<!-- </mt-tab-container-item> -->
						</div>
						<div v-show="activeName=='second'">
						<!-- <mt-tab-container-item id="second"> -->
							<div class="parameter" :key='i' v-for="(item,i) in second_content">
								<div class="par-info">
									<span class="name">{{item.title}}</span>
									<span class="value">{{item.value}}</span>
								</div>
							</div>
						<!-- </mt-tab-container-item> -->
						</div>
						<div v-show="activeName=='third'">
						<!-- <mt-tab-container-item id="third"> -->
							<div style="margin-bottom: 3.125rem;">
								<div class="pj" :key='i' v-for="(n,i) in third_content">
									<div layout="row" layout-align="start center" id="user">
										<div>
											<img :src="n.head_img_url" />
										</div>
										<div>{{n.nick_name}}</div>
										<div>{{n.created_at}}</div>
									</div>
									<van-rate v-model="n.level" disabled disabled-color="#ff9900" />
									<p>{{n.content}}</p>

									<div v-if="n.append">
										<p class="last_day">追评
											<span>{{n.append.created_at}}</span>
										</p>
										<p class="">{{n.append.content}}</p>
									</div>

									<div class="comment">
										<span>评论数:{{n.reply_count}}</span>
									</div>
								</div>
							</div>

						<!-- </mt-tab-container-item> -->
						</div>
					<!-- </mt-tab-container> -->
					</div>
				</div>
				<div style="height: 3.75rem;"></div>
			</div>

		</div>
		<van-popup v-model="dateshow_1" position="bottom" :overlay="true">
			<van-datetime-picker
					v-model="value1"
					type="date"
					:min-date="minDate"
					@confirm="confirmbtn"
					@cancel="cancelbtn"
			/>
		</van-popup>
	</transition>
</template>

<script>
import goods from './goodsDetail_controller';
export default goods;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/css/goods.scss';

.active {
  background: #f15353;
  border: 0.0625rem solid #f15353;
  color: #fff;
}

.trans {
  text-align: left;
  color: #999;
  height: 1.625rem;
  line-height: 1.625rem;

  i {
    margin-left: 0.3125rem;
    font-size: 20px;
    color: #f15353;
    vertical-align: middle;
  }
}

.addfav {
  i {
    font-size: 30px;
    margin: 0;
    padding: 0;
    display: block;
    color: #f15353;
  }
}

#goods .specifications {
  .shopdata {
    border-bottom: 0.0625rem dotted #ccc;

    ul {
      padding: 0.4375rem 0.9375rem;

      li {
        height: 1.25rem;
        line-height: 1.25rem;
        border: 0.0625rem solid #ccc;
        border-radius: 0.375rem;
        margin: 0.4375rem 0;
        padding: 0.25rem 0.625rem;
        text-align: left;
      }
    }

    .block {
      line-height: 1.875rem;
      padding: 0 0.9375rem;
      display: flex;
      flex-flow: flex;

      span {
        width: 5.625rem;
        text-align: left;
      }

      .el-date-editor.el-input {
        flex: 1;
      }
    }

    .num {
      margin-top: 0.1875rem;
    }
  }

  .shopinfo {
    margin: 0.4375rem 0 0 0;
    padding-left: 0.9375rem;
  }

  .shopcount {
    #num {
      padding: 0 0.3125rem;
      color: #333;
    }

    .el-row {
      padding: 0 0.625rem 0.625rem 0.625rem;
    }

    .van-row {
      padding: 0 0.625rem 0.625rem 0.625rem;
    }
  }
}

#goods .shopdata .el-row {
  padding: 0.3125rem;
  line-height: 1.75rem;

  #num {
    color: #333;
  }

  span {
    font-size: 12px;
    color: #e51c23;
    text-align: center;
  }
}

#goods .shopdata .van-row {
  padding: 0.3125rem;
  line-height: 1.75rem;

  #num {
    color: #333;
  }

  span {
    font-size: 12px;
    color: #e51c23;
    text-align: center;
  }
}

.allMoney {
  height: 2.8125rem;
  line-height: 2.8125rem;
  text-align: left;
  border-top: 0.0625rem solid #ccc;
  width: 67%;
  padding-left: 0.9375rem;
  box-sizing: border-box;

  b {
    color: #f15353;
    font-weight: normal;
  }
}

.confirm {
  height: 2.8125rem;
  width: 33%;
  border-top: 0.0625rem solid #ccc;
  background: #f15353;
  color: #fff;
  line-height: 2.8125rem;
}




/* 弹窗样式 */

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;

  .btns {
    margin: 60% 15%;
    width: 70%;

    button {
      width: 100%;
      height: 2.1875rem;
      text-align: left;
      line-height: 2.1875rem;
      background: #fff;
      border: 0;
      outline: 0;
    }

    button:first-child {
      border-bottom: 0.0625rem solid #ccc;
    }
  }

  .modal-dialog {
    width: 80%;
    height: 11.875rem;
    background: #fff;
    border-radius: 0.375rem;
    border-top: 0.625rem solid #f15353;
    margin: 50% auto;
    position: relative;

    .close {
      position: absolute;
      top: -3.125rem;
      right: 0;
    }

    .title {
      color: #666;
      font-size: 14px;
      font-weight: bold;
      line-height: 2.1875rem;
      text-align: left;
      padding-left: 1.5625rem;
      padding-top: 0.625rem;
    }

    p {
      padding: 0 0.9375rem;
      text-align: left;
    }
  }
}

.noVantRadio {
  .van-radio-group {
    display: flex;
    flex-wrap: wrap;

    .van-radio {
      margin-right: 0.3125rem;
      margin-bottom: 0.3125rem;
      background: #fff;
      border: 1px solid #bfcbd9;
      text-align: center;
      box-sizing: border-box;
      border-radius: 0.25rem;
    }

    .vantRadioshow {
      background-color: rgb(241, 83, 83);
      border-color: rgb(241, 83, 83);
      box-shadow: rgb(241, 83, 83) -1px 0 0 0;
    }
  }
}
</style>
