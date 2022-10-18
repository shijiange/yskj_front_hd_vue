<template>
	<div id="newAddPassenger" :class="'newAddPassenger'+$store.state.service.lang">
		<c-title :hide="false" :text="language.title"></c-title>

		<ul class="content">
			<li @click="choosePassanger" v-if="false">
				<label>{{language.passangeType}}</label>{{passanger}}
				<i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'"></i>
				<i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'"></i>
			</li>

			<div class="form-group">
				<label class="form-help">{{language.name}}</label> <input class="form-controler" type="text" :placeholder="language.placeNameTip" v-model="name" />
			</div>

			<li @click="chooseCrad" v-if="false">
				<label>{{language.cardType}}</label>{{card}}
				<i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'"></i>
				<i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'"></i>
			</li>

			<div class="form-group">
				<label class="form-help">{{language.cardId}}</label> <input class="form-controler" type="number" :placeholder="language.placeCardTip" v-model="cardId" />
			</div>

		</ul>

		<button class="btn" @click="confirm">{{language.btn}}</button>

		<van-popup v-model="popupVisible" position="bottom">
			<div class="popUp">
				<div class="title">
					<span class="left" @click="choosePassanger">{{language.cancle}}</span>{{language.passangeType}}
					<span class="right" @click="choosePassanger">{{language.btn}}</span>
				</div>
        <van-picker  :columns="slots" @change="onValuesChange" />
			</div>
		</van-popup>

		<van-popup v-model="popupVisible2" position="bottom">
			<div class="popUp">
				<div class="title">
					<span class="left" @click="chooseCrad">{{language.cancle}}</span>{{language.cardType}}
					<span class="right" @click="chooseCrad">{{language.btn}}</span>
				</div>
        <van-picker  :columns="slots2" @change="onValuesChange2" />
			</div>
		</van-popup>

	</div>
</template>

<script>
import newAddPassenger_controller from './newAddPassenger_controller';
export default newAddPassenger_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.newAddPassengerch {
  .content {
    margin-top: 0.625rem;
    background-color: #fff;
    padding-left: 0.875rem;
    font-size: 16px;

    li:last-child {
      border: none;
    }

    li {
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding-right: 0.875rem;
      background: #fff;
      text-align: left;
      border-bottom: solid 0.0625rem #ebebeb;

      label {
        width: 6.25rem;
        float: left;
        text-align: left;
      }

      i {
        font-size: 25px;
        float: right;
      }

      input {
        border: 0;
        outline: 0;
        float: left;
        width: 75%;
        height: 2.8125rem;
        line-height: 2.8125rem;
      }
    }

    .form-help:last-child {
      border: none;
    }

    .form-group {
      padding-right: 0.875rem;
      height: 2.8125rem;
      margin-top: 0.625rem;
      border-bottom: solid 0.0625rem #ebebeb;
      background: #fff;
      display: -webkit-flex;

      /* Safari */
      display: flex;
      flex-flow: row;

      .form-help {
        width: 6.25rem;
        height: 2.8125rem;
        line-height: 2.8125rem;
        text-align: left;
      }

      .form-controler {
        flex: 1;
        height: auto;
        line-height: 2.8125rem;
        float: left;
        border: 0;
        outline: 0;
        text-align: left;

        i {
          font-size: 23px;
          float: right;
        }
      }
    }
  }

  .btn {
    width: 90%;
    height: 2.875rem;
    line-height: 2.875rem;
    border: none;
    display: block;
    margin: 0.625rem auto;
    -webkit-border-radius: 0.375rem;
    -moz-border-radius: 0.375rem;
    border-radius: 0.375rem;
    background: #f15353;
    color: #fff;
    font-size: 16px;
    margin-top: 1.25rem;
  }

  .popUp {
    width: 100%;
    background: #fff;

    .title {
      height: 2.8125rem;
      line-height: 2.8125rem;
      border-bottom: 0.0625rem solid #f3f5f7;
      padding: 0 0.9375rem;

      .left {
        float: left;
      }

      .right {
        float: right;
        color: #1bba9e;
      }
    }
  }
}

.newAddPassengerwei {
  .content {
    li {
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding: 0 0.9375rem;
      margin-top: 0.625rem;
      background: #fff;
      text-align: right;

      label {
        width: 25%;
        float: right;
        text-align: right;
      }

      i {
        font-size: 25px;
        float: left;
      }

      input {
        border: 0;
        outline: 0;
        float: right;
        width: 75%;
        height: 2.5rem;
      }
    }
  }

  .btn {
    width: 80%;
    height: 2.5rem;
    line-height: 2.5rem;
    border: 0.0625rem solid #dfdfdf;
    display: block;
    margin: 0.625rem auto;
    -webkit-border-radius: 0.375rem;
    -moz-border-radius: 0.375rem;
    border-radius: 0.375rem;
    background: #ff951b;
    color: #fff;
    font-size: 16px;
    margin-top: 1.875rem;
  }

  .popUp {
    width: 100%;
    background: #fff;

    .title {
      height: 2.8125rem;
      line-height: 2.8125rem;
      border-bottom: 0.0625rem solid #f3f5f7;
      padding: 0 0.9375rem;

      .left {
        float: right;
      }

      .right {
        float: left;
        color: #1bba9e;
      }
    }
  }
}
</style>