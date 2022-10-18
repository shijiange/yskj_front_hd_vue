<template>
	<div id="addCard" :class="'addCard'+$store.state.service.lang">

		<c-title :hide="false" :text='language.title'></c-title>
		<div class="top">
			<label class="form-help" for="">{{title}}</label>
		</div>
		<div class="content">
			<form action="" method="" class="form">
				<div class="form-group">
					<label class="form-help" for="">{{language.name}}</label>
					<input class="form-controler" type="text" name="" :placeholder="language.placeName" v-model="userName">
				</div>
				<div class="form-group">
					<label class="form-help" for="">{{language.tele}}</label>
					<input class="form-controler" type="text" name="" :placeholder="language.placeTele" v-model="phone">
				</div>
				<div class="form-group">
					<label class="form-help" for="">{{language.oilCard}}</label>
					<input class="form-controler" type="text" name="" :placeholder="language.placeOilCard" v-model="cardNum">
				</div>
			</form>
		</div>

		<!-- <router-link :to="fun.getUrl('oilRecharge',{cardCode:cardNum})"> -->
		<!-- <button class="btn">{{language.btn}}</button>
			</router-link> -->

		<button class="btn" @click="submit">{{language.btn}}</button>
		<div class="footer">
			<span>{{language.tips}}</span>
			<p>{{language.content}}</p>
		</div>
		<!--弹窗-->
		<div class="modal" :class="{hidePopup:hide}">
			<div class="modal-dialog">
				<div class="top">
					<i class="iconfont icon-cuowu"></i>
					<!--<i class="el-icon-warning"></i>-->
					<img src="" alt="" />{{language.modelTip}}
				</div>
				<div class="text">{{language.modelContent}}</div>
				<div class="btn1" @click="hidePop">{{language.modelBtn}}</div>
			</div>
		</div>

	</div>
</template>

<script>
import addCard_controller from './addCard_controller';
export default addCard_controller;
</script>

<style  lang="scss" rel="stylesheet/scss" scoped>
.addCardch {
  /* 弹窗样式 */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;

    .modal-dialog {
      width: 80%;
      height: 10rem;
      background: #fff;
      border-radius: 0.375rem;
      margin: 50% auto;
      position: relative;

      .top {
        padding-left: 1.5625rem;
        line-height: 2.125rem;
        text-align: left;
        border-bottom: 0.0625rem solid #ededed;
      }

      .text {
        line-height: 4.375rem;
        padding-left: 1.5625rem;
        text-align: left;
      }

      .btn1 {
        width: 80%;
        height: 1.875rem;
        line-height: 1.875rem;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        margin: 0.3125rem auto;
        border-radius: 0.3125rem;
        background: #ff951b;
      }
    }
  }

  .top {
    height: 2.25rem;
    line-height: 2.25rem;
    background-color: #fafafa;
    font-weight: bold;
    font-size: 14px;
  }

  .content {
    background: #fff;
    padding-left: 0.875rem;

    .form {
      .form-group {
        padding-right: 0.875rem;
        height: 2.8125rem;
        border-bottom: 0.0625rem solid #ebebeb;
        display: -webkit-flex;

        /* Safari */
        display: flex;
        flex-flow: row;
        font-size: 16px;

        .form-help {
          width: 6.25rem;
          height: 2.8125rem;
          line-height: 2.8125rem;
          text-align: left;
        }

        .form-controler {
          flex: 1;
          height: 2.8125rem;
          float: left;
          border: 0;
          outline: 0;
          color: #8c8c8c;
        }
      }

      .form-group:last-child {
        border: none;
      }
    }
  }

  .btn {
    width: 90%;
    height: 2.875rem;
    line-height: 2.875rem;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 1.25rem auto;
    border-radius: 0.3125rem;
    background: #f15353;
    border: 0;
    outline: 0;
  }

  .footer {
    padding: 0 1rem;
    text-align: left;

    span {
      color: #8c8c8c;
      font-size: 16px;
      font-weight: bold;
    }

    p {
      font-size: 14px;
      line-height: 1.5rem;
      margin-top: 0.625rem;
      color: #8c8c8c;
    }
  }

  .hidePopup {
    display: none;
  }
}

.addCardwei {
  /* 弹窗样式 */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;

    .modal-dialog {
      width: 80%;
      height: 10rem;
      background: #fff;
      border-radius: 0.375rem;
      margin: 50% auto;
      position: relative;

      .top {
        padding-left: 1.5625rem;
        line-height: 2.125rem;
        text-align: left;
        border-bottom: 0.0625rem solid #ededed;
      }

      .text {
        line-height: 4.375rem;
        padding-left: 1.5625rem;
        text-align: left;
      }

      .btn1 {
        width: 80%;
        height: 1.875rem;
        line-height: 1.875rem;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        color: #fff;
        margin: 0.3125rem auto;
        border-radius: 0.3125rem;
        background: #ff951b;
      }
    }
  }

  .content {
    background: #fff;

    .form {
      .form-group {
        padding: 0 0.9375rem;
        height: 2.8125rem;
        margin: 0.25rem;
        border-bottom: 0.0625rem solid #ccc;
        display: -webkit-flex;

        /* Safari */
        display: flex;
        flex-flow: row;

        .form-help {
          order: 2;
          width: 5rem;
          height: 2.8125rem;
          line-height: 2.8125rem;
          text-align: right;
        }

        .form-controler {
          order: 1;
          flex: 1;
          height: 2.5rem;
          text-align: right;
          border: 0;
          outline: 0;
        }
      }
    }
  }

  .btn {
    width: 80%;
    height: 2.75rem;
    line-height: 2.75rem;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 1.4375rem auto;
    border-radius: 0.3125rem;
    background: #ff951b;
    border: 0;
    outline: 0;
  }

  .footer {
    margin-top: 1.25rem;
    padding: 0.9375rem;
    text-align: right;

    span {
      color: #34c1a8;
      font-size: 16px;
    }

    p {
      font-size: 14px;
      line-height: 1.25rem;
      margin-top: 0.625rem;
      color: #7e7e7f;
    }
  }

  .hidePopup {
    display: none;
  }
}
</style>-->
