<style lang="scss" rel="stylesheet/scss" scoped>
#rentReturnGoods {
  .title {
    width: 100%;
    box-sizing: border-box;
    padding: 0 0.9375rem;
    line-height: 2.5rem;
    background-color: #edebfe;
    font-weight: 400;
    color: #18173a;
    font-size: 16px;

    b {
      color: #688498;
      float: left;
      font-size: 14px;
      font-weight: normal;
    }

    i {
      color: #e06a71;
      float: right;
      font-style: normal;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .content {
    width: 100%;
    height: 12.5rem;
    background: #fff;
    box-sizing: border-box;
    padding-top: 0.625rem;

    li {
      width: 80%;
      margin: 0.9375rem auto;
      line-height: 1.25rem;
      text-align: right;

      span {
        float: left;
        font-size: 14px;
        display: inline-block;
        color: #333;
        height: 1.25rem;
        line-height: 1.25rem;
        padding-top: 0.1875rem;
      }

      .orderNum {
        width: 11.25rem;
        height: 1.8125rem;
        border: 0.0625rem solid #bfcbd9;
        outline: red;
        border-radius: 0.3125rem;
        padding: 0.1875rem 0.625rem;
        box-sizing: border-box;
      }

      input::-webkit-input-placeholder {
        color: #97a8be;
      }
    }

    li::after {
      content: "";
      display: block;
      clear: both;
    }
  }

  .info {
    width: 100%;
    height: 7.5rem;
    margin-top: 0.0625rem;
    background: #fff;
    padding-top: 1.25rem;
    box-sizing: border-box;

    li {
      width: 80%;
      margin: 0.9375rem auto;
      line-height: 1.25rem;
      font-size: 14px;
      text-align: left;

      .tel {
        width: 40%;

        /* text-align: right; */
        padding-left: 1.25rem;
        float: right;
        height: 100%;
        background-image: url(./../../assets/images/tel.png);
        background-repeat: no-repeat;
        background-size: 1.125rem 1.125rem;
      }
    }
  }
}
</style>
<template>
	<div id="rentReturnGoods">
		<header class="title">
			<b @click="back()">取消</b>
			归还
			<i @click="ensure()">确定</i>
		</header>
	
		<ul class="content">
			<li>
				<span>填写归还物流信息</span>
			</li>
			<li>
				<span>快递公司</span>
				<!--<el-select v-model="expressName" clearable placeholder="请选择快递公司">-->
					<!--<el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">-->
					<!--</el-option>-->
				<!--</el-select>-->
				<van-button style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 10rem;" plain type="primary" @click="seleRegional">{{regional}}</van-button>
			</li>
			<li>
				<span>快递单号</span>
				<input class="orderNum" v-model='orderNum' type="number" placeholder="请输入快递单号" />
			</li>
		</ul>
	
		<ul class="info">
			<li>
				收货人:{{addInfo.realname}}
				<div class="tel">{{addInfo.mobile}}</div>
			</li>
			<li>归还地址:{{addInfo.address}}</li>
		</ul>
		<van-popup v-model="dateshow_1" position="bottom" :overlay="true">
			<van-picker :columns="columns" @change="onChange"  @cancel="onCancelbtn" @confirm="onConfirmbtn" show-toolbar/>
		</van-popup>
	</div>
</template>


<script>
import rentReturnGoodsController from './rentReturnGoodsController';
export default rentReturnGoodsController;

</script>
