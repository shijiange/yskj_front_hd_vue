<template>
  <div id="trainAddOrder" :class="'trainAddOrder' + $store.state.service.lang">
    <c-title :hide="false" :text="jsonInfo.fromStation + ' - ' + jsonInfo.toStation"></c-title>

    <div class="flight">
      <div class="top">
        <i class="iconfont icon-life-plane"></i>
        <span>{{ jsonInfo.date }}</span>
        <span id="week">{{ week }}</span>
      </div>

      <div class="flightNum">
        <div>
          <span class="fromTime">{{ trainInfo.startTime }}</span>
          <span class="addOne">{{ trainInfo.trainNumber }}</span>
          <span class="toTime">{{ trainInfo.endTime }}</span>
        </div>
        <p>
          <span class="fromAddr">{{ trainInfo.currentStartStationName }}</span>
          <span class="during">{{ trainInfo.runTime | trainRunTime }}</span>
          <span class="toAddr">{{ trainInfo.currentEndStationName }}</span>
        </p>
      </div>
    </div>

    <div class="information">
      <div class="trainprice">
        <span>{{ trainNumberItem.seatName }}</span>
        <b>{{ $i18n.t('money') }}{{ trainNumberItem.seatPrice }}</b>
      </div>

      <div class="opportunity">
        <div class="add">
          <span class="left">{{ language.flight }}</span>
          <button class="right" type="button" @click="passenger">{{ language.addFlight }}</button>
        </div>
        <ul class="people">
          <li v-for="(airMan, index) in tempSelectAirMans" :key="index">
            <div class="left" @click="removePeople(airMan)"></div>
            <div class="airman">
              <h3>姓名:{{ airMan.username }}</h3>
              <p>身份证:{{ airMan.ids }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="content">
        <div class="linkman">
          <label>联系人：</label> <input type="text" placeholder="用于接收通知" v-model="linkmanName" />
        </div>
        <div class="linkman1">
          <label>联系手机：</label> <input type="text" placeholder="用于接收通知" v-model="linkmanPhone" />
        </div>
        <ul class="safe" v-if="false">
          <li>
            <div class="left">
              <h3>
                <span>乘意险</span>
                <i class="iconfont icon-tishi" @click="closedelayRisk"></i>
              </h3>
              <p>
                <span>最高赔付200元</span>
                <span>{{ $i18n.t('money') }}20</span>
                <span>X</span>
                <span>1份</span>
                .right
              </p>
            </div>
            <div class="circle" :class="{ active: chooseed }" @click="chooseCircle1"></div>
          </li>
        </ul>
      </div>
      <div class="m-footer">
        <div class="score" v-if="false">
          <div class="left">
            <b>{{ language.score }}</b>
            <span
              >{{ language.useScore }} <i>{{ score }}</i
              >{{ language.scoreDeductible }} <i>{{ scoreMoney }}</i
              >{{ language.yuan }}</span
            >
          </div>
          <van-switch class="right" v-model="useScore"  size="28px" active-color="#f15353" inactive-color="#fff" />
        </div>
        <div class="clear"></div>
        <div class="amount">
          <span class="left"
            >{{ language.total }} {{ $i18n.t('money') }}
            <b>{{ (count * trainNumberItem.seatPrice) | calculate }}</b>
            <i>{{ language.all }} {{ count }}{{ language.people }}</i>
          </span>

          <button class="right" type="button" @click="submit">{{ language.submitOrder }}</button>
        </div>
      </div>
    </div>

    <!--乘意险-->
    <div class="modal" v-show="delayRisk">
      <div class="modal-dialog">
        <h1 class="title"><i class="iconfont icon-tishi"></i> {{ language.delayInsurance }}</h1>
        <ul class="regulations">
          <li>转签规定： <br />不得转签</li>
          <li>改签规定： <br />起飞前4小时意外，收取公布运价的30% <br />起飞前4小时以内，收取公布运价的40%</li>
          <li>退票规定： <br />起飞前4小时意外，收取公布运价的30% <br />起飞前4小时以内，收取公布运价的40%</li>
        </ul>
        <span class="button" @click="closedelayRisk">我知道了</span>
      </div>
    </div>

   <!--增加乘机人-->
		<van-popup v-model="addPassenger" position="bottom">
			<div class="passenger">
				<p class="control">
					<span class="left" @click="closeAirMans">{{language.cancle}}</span>
					<span class="right" @click="addAirMans">{{language.confirm}}
						<b>({{this.count}}</b>/
						<b>{{airMans.length}})</b>
					</span>
				</p>
				<span class="btn" @click="newAddPassenger"><i class="iconfont icon-plus"></i>{{language.btnAddFlight}}</span>
				<ul>
					<li v-for="(airMan,index) in airMans" :key='index'>
						<div class="left">

							<div class="icon">
								<i class="iconfont icon-liuyan"></i>
							</div>

							<div class="infom">
								<p>
									<span>{{language.name}}</span>
									<span>{{airMan.username}}</span>

								</p>
								<p>
									<span>{{language.IDCard}}</span>
									<span>{{airMan.ids}}</span>
								</p>
							</div>
						</div>
						<div class="right">
							<div class="circle" :class="{active:airMans[index].choose}" @click="chooseCircle(index)"></div>
						</div>
					</li>
				</ul>

			</div>
		</van-popup>

		<!--新增加乘机人-->
		<van-popup v-model="newAddPassengerPop" class="mint-popup-3" position="right" closeOnClickModal='true' modal='false' style="z-index: 2004;">
			<div class="new-add-passenger">
           <van-nav-bar
          left-arrow
          :title="language.addTitle"
          fixed
          @click-left="closeNewAddPassenger"
          :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        />
				<ul class="content1">

					<div class="form-group">
						<label class="form-help">{{language.name}}</label> <input class="form-controler" type="text" :placeholder="language.placeNameTip" v-model="name" />
					</div>

					<div class="form-group">
						<label class="form-help">{{language.cardId}}</label> <input class="form-controler" type="number" :placeholder="language.placeCardTip" v-model="cardId" />
					</div>

					<div class="form-group">
						<label class="form-help">{{language.phoneNumber}}</label> <input class="form-controler" type="number" :placeholder="language.placePhoneNumberTip" v-model="phoneNumber" />
					</div>

				</ul>

				<span class="btn1" @click="confirmAddPassenger">{{language.btn}}</span>
			</div>
		</van-popup>

		<!--明细-->
		<div class="modalDetail" v-show="details" @click="closeDetails">
			<div class="modal-dialog" @click.stop>
				<ul>
					<li>
						<span>成人票</span>
						<span class="center">{{$i18n.t('money')}}750</span>
						<span class="right">x1人</span>
					</li>
				</ul>
				<ul>
					<li>
						<span>乘意险</span>
						<span class="center">{{$i18n.t('money')}}20</span>
						<span class="right">x1人</span>
					</li>
				</ul>
			</div>
		</div>

	</div>
</template>
<script>
import trainAddOrder_controller from './trainAddOrder_controller';
export default trainAddOrder_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
b {
  font-weight: normal;
  color: #1e1e1e;
}

.trainAddOrderch {
  .new-add-passenger {
    overflow-y: scroll;
    width: 100vw;
    height: 100vh;
    background: #e8e8e8;
  }

  .mint-header {
    background: none;
    color: #666;
  }

  .is-fixed .mint-header-title {
    font-weight: bold;
  }

  .mint-header.is-fixed {
    border-bottom: 1px solid #e8e8e8;
    background: #fff;
    z-index: 99;
  }

  .is-right a {
    font-size: 12px;
  }

  .content1 {
    margin-top: 3.125rem;

    li {
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding: 0 0.9375rem;
      margin-top: 0.625rem;
      background: #fff;
      text-align: left;

      label {
        width: 25%;
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

    .form-group {
      padding: 0 0.625rem;
      height: 2.8125rem;
      margin-top: 0.625rem;
      background: #fff;
      border-top: 0.0625rem solid #fff;
      display: -webkit-flex;

      /* Safari */
      display: flex;
      flex-flow: row;

      .form-help {
        width: 5rem;
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

  .btn1 {
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

  /* 明细弹窗 */
  .modalDetail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 70;

    .modal-dialog {
      width: 100%;
      padding-bottom: 1.25rem;
      background: #fff;
      z-index: 1200;
      bottom: 6.125rem;
      position: absolute;
      padding-top: 0.625rem;

      ul {
        li {
          padding: 0 0.9375rem;
          height: 1.375rem;
          line-height: 1.375rem;

          span {
            width: 33.3%;
            display: inline-block;
            float: left;
            text-align: left;
          }

          .center {
            text-align: center;
          }

          .right {
            text-align: right;
          }
        }
      }
    }
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

    .modal-dialog {
      width: 80%;
      padding-bottom: 1.25rem;
      background: #fff;
      border-radius: 0.375rem;
      margin: 30% auto;
      position: relative;

      .title {
        i {
          color: #ff951b;
        }

        color: #666;
        font-weight: normal;
        font-size: 14px;
        line-height: 2.1875rem;
        text-align: left;
        padding-left: 1.5625rem;
        border-bottom: 0.0625rem solid #ccc;
      }

      .content {
        padding: 0.625rem;

        li {
          width: 50%;
          line-height: 1.875rem;
          float: left;
          text-align: left;
        }
      }

      .content::after {
        display: table;
        content: '';
        clear: both;
      }

      .regulations {
        padding: 0.625rem;

        li {
          text-align: left;
          padding-top: 0.3125rem;
        }
      }

      .button {
        display: block;
        width: 80%;
        height: 2.1875rem;
        line-height: 2.1875rem;
        background: #ff951b;
        -webkit-border-radius: 0.3125rem;
        -moz-border-radius: 0.3125rem;
        border-radius: 0.3125rem;
        color: #fff;
        margin: 0 auto;
      }
    }
  }

  .flight {
    margin-top: 0.625rem;
    background-color: #fff;

    .top {
      display: flex;
      height: 2.25rem;
      line-height: 2.25rem;
      color: #8c8c8c;
      text-align: left;
      padding-left: 0.875rem;
      font-size: 14px;

      i {
        color: #f15353;
        font-size: 18px;
        margin-right: 0.625rem;
      }
    }

    .flightNum {
      background: #fff;
      height: 4.375rem;

      div {
        padding: 0.3125rem 0.9375rem 0;
        line-height: 2.1875rem;
        overflow: hidden;
        font-size: 22px;
        background: url(../../../../assets/images/airline-a.png) no-repeat 50% 1.75rem;
        background-size: 3.75rem;

        .fromTime {
          width: 40%;
          text-align: center;
          float: left;
        }

        .toTime {
          width: 40%;
          text-align: center;
          float: right;
        }

        .addOne {
          font-size: 12px;
          vertical-align: middle;
        }
      }

      p {
        padding: 0 0.9375rem;
        font-size: 13px;
        color: #8c8c8c;

        .fromAddr {
          width: 40%;
          text-align: center;
          float: left;
        }

        .during {
          font-size: 11px;
        }

        .toAddr {
          width: 40%;
          text-align: center;
          float: right;
        }

        .stopCity {
          color: #1bba9e;
        }
      }
    }
  }

  .information {
    margin-top: 0.625rem;

    button {
      width: 5.5rem;
      height: 1.625rem;
      line-height: 1.625rem;
      color: #fff;
      text-align: center;
      background: #f15353;
      margin-top: 0.5625rem;
      border: 0;
      outline: 0;
      border-radius: 0.1875rem;
    }

    .trainprice {
      height: 2.75rem;
      line-height: 2.75rem;
      padding: 0 0.875rem;
      background: #fff;
      margin-bottom: 0.625rem;

      span {
        float: left;
        font-size: 14px;
      }

      b {
        float: right;
        font-size: 18px;
        color: #f15353;
      }
    }

    .opportunity {
      background: #fff;

      .add {
        font-size: 16px;
        padding: 0 0.875rem;
        height: 2.8125rem;
        line-height: 2.8125rem;

        .left {
          float: left;
        }

        .right {
          float: right;
          font-size: 12px;
          background: #f15353;
          color: #fff;
        }
      }

      .people {
        border-top: 0.0625rem solid #ebebeb;

        li {
          padding: 0.625rem 0.875rem;
          display: flex;
          flex-flow: row;

          div.left {
            width: 2.5rem;
            float: left;
            background: url(../../../../assets/images/delete.png) no-repeat 0 0.9375rem;
          }

          .airman {
            flex: 1;
            height: 100%;
            text-align: left;

            h3 {
              height: 1.5rem;
              line-height: 1.5rem;
              color: #1e1e1e;
              font-size: 14px;
              font-weight: normal;
            }

            p {
              height: 1.5rem;
              line-height: 1.5rem;
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
    }

    .content {
      margin-bottom: 3.125rem;
      margin-top: 0.625rem;
      background: #fff;

      .linkman {
        display: flex;
        height: 2.8125rem;
        line-height: 2.8125rem;
        margin-left: 0.875rem;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;

        label {
          display: block;
          width: 6.25rem;
          text-align: left;
        }

        input {
          flex: 1;
          border: 0;
          outline: 0;
        }
      }

      .linkman1 {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0.9375rem;
        font-size: 16px;
        display: flex;
        flex-flow: row;

        label {
          width: 6.25rem;
          text-align: left;
        }

        input {
          flex: 1;
          border: 0;
          outline: 0;
        }
      }

      .safe {
        background: #fff;

        li {
          padding: 0 0.9375rem;
          border-bottom: 0.0625rem solid #ccc;
          height: 4.375rem;
          text-align: left;

          div.left {
            float: left;

            h3 {
              font-weight: normal;
              overflow: hidden;

              span {
                font-size: 16px;
                width: 6.25rem;
                height: 1.25rem;
                display: inline-block;
                float: left;
              }

              i {
                color: #ff951b;
                font-size: 25px;
                float: left;
              }

              padding-top: 0.9375rem;
              color: #333;
            }

            p {
              color: #666;
              font-size: 12px;

              span {
                padding-right: 0.25rem;
              }
            }
          }

          .circle {
            width: 1.25rem;
            height: 1.25rem;
            line-height: 1.25rem;
            text-align: center;
            display: inline-block;
            border: 0.0625rem solid #aaa;
            border-radius: 50%;
            margin-top: 1.25rem;
            float: right;
          }

          .active {
            border: 0.0625rem solid #36d2b6;
            background: url(../../../../assets/images/mark.png) no-repeat 0.25rem 0.25rem;
          }
        }

        li:last-child {
          border-bottom: none;
        }
      }
    }

    .m-footer {
      width: 100%;
      position: fixed;
      bottom: 0;
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding-left: 0.875rem;
      background: #fff;
      z-index: 200;

      .score {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0.875rem;

        div.left {
          float: left;

          b {
            color: #333;
            font-size: 16px;
          }

          span {
            color: #333;
            font-size: 12px;

            i {
              font-style: normal;
            }
          }
        }

        .right {
          float: right;
        }
      }

      .amount {
        height: auto;
        line-height: 2.8125rem;
        box-sizing: border-box;

        span.left {
          float: left;
          color: #333;
          font-size: 16px;

          i {
            font-style: normal;
            padding-left: 0.625rem;
            color: #666;
            font-size: 12px;
          }

          b {
            font-weight: bold;
          }
        }

        button.right {
          float: right;
          width: 6.875rem;
          height: 2.8125rem;
          line-height: 2.8125rem;
          color: #fff;
          font-size: 16px;
          background: #f15353;
          border: 0;
          border-radius: 0;
          margin: 0;
        }

        span.right {
          float: right;
          padding-right: 0.625rem;
          height: 3.125rem;
          line-height: 3.125rem;

          i {
            font-size: 20px;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .passenger {
    padding-bottom: 0.625rem;

    a {
      color: #333;
    }

    .control {
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .left {
        float: left;
        font-size: 14px;
      }

      .right {
        float: right;
        color: #333;
        font-size: 14px;
      }
    }

    ul {
      border-top: solid 0.0625rem #ebebeb;
      padding: 0 0.875rem;

      li {
        padding: 0.625rem 0;
        text-align: left;
        border-bottom: 0.0625rem solid #ebebeb;
        margin-top: 0.3125rem;
        margin-bottom: 0.3125rem;
        font-size: 14px;
        display: flex;
        justify-content: space-between;

        .left {
          width: 90%;
          float: left;

          .icon {
            height: 3.125rem;
            float: left;
            line-height: 3.125rem;
            padding: 0 0.625rem;

            i {
              color: #ccc;
              width: 30px;
              font-size: 30px;
            }
          }

          .infom {
            float: left;

            p {
              color: #333;
              height: 1.875rem;
              line-height: 1.875rem;
              font-size: 12px;
            }
          }
        }

        .right {
          width: 10%;
          float: left;

          .circle {
            width: 1.25rem;
            height: 1.25rem;
            line-height: 1.25rem;
            text-align: center;
            display: inline-block;
            border: 0.0625rem solid #aaa;
            border-radius: 50%;
            margin-top: 1.25rem;
            float: right;
          }

          .active {
            border: 0.0625rem solid #f15353;
            background: url(../../../../assets/images/mark-a.png) no-repeat 0.25rem 0.25rem;
            background-position: center;
          }
        }
      }
    }

    .btn {
      width: 18.75rem;
      height: 2.5rem;
      line-height: 2.5rem;
      font-size: 14px;
      border: 0.0625rem solid #ebebeb;
      background-color: #fafafa;
      display: block;
      margin: 10px auto;
      -webkit-border-radius: 0.25rem;
      -moz-border-radius: 0.25rem;
      border-radius: 0.25rem;

      i {
        color: #333;
        font-size: 18px;
        margin-right: 0.375rem;
      }
    }
  }
}

.trainAddOrderwei {
  /* 明细弹窗 */
  .modalDetail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 70;

    .modal-dialog {
      width: 100%;
      padding-bottom: 1.25rem;
      background: #fff;
      z-index: 1200;
      bottom: 6rem;
      position: absolute;
      padding-top: 0.625rem;

      ul {
        li {
          padding: 0 0.9375rem;
          height: 1.375rem;
          line-height: 1.375rem;

          span {
            width: 33.3%;
            display: inline-block;
            float: right;
            text-align: right;
          }

          .center {
            text-align: center;
          }

          .right {
            text-align: left;
          }
        }

        .line {
          border-bottom: 0.0625rem solid #eee;
          margin-bottom: 0.625rem;
          padding-bottom: 0.625rem;
        }
      }
    }
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

    .modal-dialog {
      width: 80%;
      padding-bottom: 1.25rem;
      background: #fff;
      border-radius: 0.375rem;
      margin: 30% auto;
      position: relative;

      .title {
        i {
          color: #ff951b;
          font-size: 25px;
          float: right;
        }

        color: #666;
        font-weight: normal;
        font-size: 14px;
        line-height: 2.1875rem;
        text-align: right;
        padding-right: 1.5625rem;
        border-bottom: 0.0625rem solid #ccc;
      }

      .content {
        padding: 0.625rem;

        li {
          width: 50%;
          line-height: 1.875rem;
          float: right;

          span {
            float: right;
          }
        }
      }

      .content::after {
        display: table;
        content: '';
        clear: both;
      }

      .regulations {
        padding: 0.625rem;

        li {
          text-align: right;
          padding-top: 0.3125rem;
        }
      }

      .button {
        display: block;
        width: 80%;
        height: 2.1875rem;
        line-height: 2.1875rem;
        background: #ff951b;
        -webkit-border-radius: 0.3125rem;
        -moz-border-radius: 0.3125rem;
        border-radius: 0.3125rem;
        color: #fff;
        margin: 0 auto;
      }
    }
  }

  .flight {
    margin: 0.625rem 0.9375rem;
    border-radius: 0.375rem;
    box-shadow: 0.125rem 0.125rem 0.125rem 0 #aaa;

    .top {
      background: #1bba9e;
      height: 1.875rem;
      line-height: 1.875rem;
      color: #fff;
      text-align: right;
      padding-right: 0.9375rem;
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;

      span {
        float: right;
      }
    }

    .flightNum {
      background: #fff;
      height: 4.375rem;
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;

      div {
        padding: 0.625rem 0.9375rem 0;
        line-height: 2.1875rem;
        overflow: hidden;
        font-size: 22px;
        background: url(../../../../assets/images/airlineLeft-a.png) no-repeat 50% 1.75rem;

        .fromTime {
          float: right;
        }

        .toTime {
          float: left;
        }

        .addOne {
          font-size: 12px;
          vertical-align: middle;
        }
      }

      p {
        padding: 0 0.9375rem;
        font-size: 13px;

        .fromAddr {
          float: right;
        }

        .toAddr {
          float: left;
        }

        .stopCity {
          color: #1bba9e;
        }
      }
    }
  }

  .information {
    button {
      width: 5.5625rem;
      line-height: 1.6875rem;
      height: 1.6875rem;
      color: #fff;
      text-align: center;
      background: #ff951b;
      margin-top: 0.5625rem;
      border: 0;
      outline: 0;
      border-radius: 0.3125rem;
    }

    .trainprice {
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 0.9375rem;
      background: #fff;
      margin-bottom: 0.625rem;

      span {
        float: right;
      }

      b {
        float: left;
        font-size: 16px;
        color: #ff951b;
      }
    }

    .opportunity {
      background: #fff;

      .add {
        padding: 0 0.9375rem;
        height: 2.8125rem;
        line-height: 2.8125rem;

        .left {
          float: right;
        }

        .right {
          float: left;
        }
      }

      .people {
        border-top: 0.0625rem solid #ccc;

        li {
          padding: 0 0.9375rem;
          height: 3.75rem;
          display: flex;
          flex-flow: row;

          div.left {
            width: 2.5rem;
            order: 2;
            background: url(../../../../assets/images/delete.png) no-repeat 0.9375rem 0.9375rem;
          }

          .airman {
            flex: 1;
            order: 1;
            height: 100%;
            text-align: right;

            h3 {
              height: 2.1875rem;
              line-height: 2.1875rem;
              color: #1e1e1e;
              font-size: 16px;
              font-weight: normal;
            }

            p {
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
    }

    .content {
      margin-bottom: 9.375rem;

      .linkman {
        margin-top: 0.9375rem;
        background: #fff;
        margin-bottom: 0.9375rem;
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 0.9375rem;
        display: flex;
        flex-flow: row;

        label {
          width: 5rem;
          text-align: right;
          order: 2;
        }

        input {
          flex: 1;
          order: 1;
          border: 0;
          outline: 0;
        }
      }

      .safe {
        background: #fff;

        li {
          padding: 0 0.9375rem;
          border-bottom: 0.0625rem solid #ccc;
          height: 4.375rem;
          text-align: right;

          div.left {
            float: right;

            h3 {
              font-weight: normal;
              overflow: hidden;

              span {
                font-size: 16px;
                width: 6.25rem;
                height: 1.25rem;
                display: inline-block;
                float: right;
              }

              i {
                color: #ff951b;
                font-size: 25px;
                float: left;
              }

              padding-top: 0.9375rem;
              color: #333;
            }

            p {
              color: #666;
              font-size: 12px;

              span {
                padding-right: 0.25rem;
              }
            }
          }

          .circle {
            width: 1.25rem;
            height: 1.25rem;
            line-height: 1.25rem;
            text-align: center;
            display: inline-block;
            border: 0.0625rem solid #aaa;
            border-radius: 50%;
            margin-top: 1.25rem;
            float: left;
          }

          .active {
            border: 0.0625rem solid #36d2b6;
            background: url(../../../../assets/images/mark.png) no-repeat 0.25rem 0.25rem;
          }
        }

        li:last-child {
          border-bottom: none;
        }
      }
    }

    .m-footer {
      width: 100%;
      position: fixed;
      bottom: 0;
      background: #fff;
      z-index: 200;

      .score {
        height: 2.8125rem;
        padding: 0 0.8125rem;

        div.left {
          float: right;
          width: 82%;

          b {
            color: #333;
            font-size: 16px;
            font-weight: noraml;
            float: right;
            line-height: 2.8125rem;
          }

          span {
            color: #333;
            font-size: 12px;
            padding-right: 0.625rem;
            line-height: 1.375rem;

            i {
              font-style: normal;
            }
          }
        }

        .right {
          float: left;
          width: 18%;
        }
      }

      .amount {
        height: 3.125rem;
        line-height: 3.125rem;

        /* padding:0 0 0 13px; */
        margin-bottom: 0;
        box-sizing: border-box;

        span.left {
          float: left;
          color: #333;
          font-size: 16px;

          i {
            font-style: normal;
            padding-left: 0.625rem;
            color: #666;
            font-size: 12px;
          }
        }

        button.right {
          float: right;
          width: 6.5625rem;
          height: 2.5rem;
          color: #fff;
          font-size: 16px;
          background: #ff951b;
          border: 0;
          border-radius: 0.1875rem;
          margin-top: 0.5625rem;
        }

        span.right {
          float: right;

          /* padding-right:10px; */
          height: 3.125rem;
          line-height: 3.125rem;

          i {
            font-size: 20px;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .passenger {
    padding: 0 0.9375rem;

    a {
      color: #333;
    }

    .control {
      height: 2.5rem;
      line-height: 2.5rem;

      .left {
        float: right;
      }

      .right {
        float: left;
        color: #36d2b6;
      }
    }

    ul {
      li {
        text-align: right;
        border-bottom: 0.0625rem solid #eee;
        height: 3.125rem;
        margin-top: 0.3125rem;

        .left {
          width: 90%;
          float: right;

          .icon {
            height: 3.125rem;
            float: right;
            line-height: 3.125rem;
            padding: 0 0.625rem;

            i {
              color: #ccc;
              width: 1.875rem;
              font-size: 30px;
            }
          }

          .infom {
            float: right;

            p {
              color: #7c7c7c;
              height: 1.5625rem;
              font-size: 12px;

              span {
                float: right;
              }
            }
          }
        }

        .right {
          width: 10%;
          float: right;

          .circle {
            width: 1.25rem;
            height: 1.25rem;
            line-height: 1.25rem;
            text-align: center;
            display: inline-block;
            border: 0.0625rem solid #aaa;
            border-radius: 50%;
            margin-top: 0.625rem;
            float: right;
          }

          .active {
            border: 0.0625rem solid #36d2b6;
            background: url(../../../../assets/images/mark.png) no-repeat 0.25rem 0.25rem;
          }
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
    }
  }
}

#trainAddOrder {
  .van-nav-bar,
  /deep/.van-nav-bar__content {
    height: 40px;
  }

  /deep/.van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/.van-nav-bar .van-icon {
    color: #666;
  }

  /deep/.van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
  }
}
</style>
