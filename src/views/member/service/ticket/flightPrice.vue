<template>
	<div id="flightPrice" :class="'flightPrice'+$store.state.service.lang">
		<c-title :hide="false" :text="jsonInfo.fromStation+' - '+jsonInfo.toStation"></c-title>

		<div class="flight">
			<div class="top">
				<i class="iconfont icon-life-plane"></i>
				<span>{{jsonInfo.airDate}}</span>
				<span>{{week}}</span>
			</div>
			<div class="flightNum">
				<div>
					<span class="fromTime">{{flightInfo.depTime}}</span>
					<!--<span class="addOne">+1天</span>-->
					<span class="toTime">{{flightInfo.arriTime}}</span>
				</div>
				<p>
					<span class="fromAddr">{{flightInfo.orgCityName}}</span>
					<!--<span class="stopCity" @click="closeCity">经停城市</span>-->
					<span class="toAddr">{{flightInfo.dstCityName}}</span>
				</p>
			</div>
			<div class="addr">
				<span>{{flightInfo.flightCompanyName}}</span>
				<span> {{flightInfo.flightNo}}</span>
				<!--<span>准点率：</span> <span>8%</span> -->
				<span>机型:{{flightInfo.planeType}}</span>
			</div>
		</div>

		<ul class="flyList">
			<li v-for="(fly,index) in flyList" :key='index'>
				<div class="left">
					<h2>
						<span>{{$i18n.t('money')}}</span>
						{{fly.parPrice}}
					</h2>
					<p>{{fly.seatMsg}}
						<span>{{fly.discount}}折</span>
						<!--&nbsp;&nbsp;&nbsp;|<span @click="closeRetreat">退改签</span>-->
					</p>
				</div>
				<div class="right"  @click="toOrder(index)">
						<span>{{language.booked}}</span>
				</div>
			</li>
		</ul>

		<!--经停城市-->
		<div class="modal" v-show="city" @click="closeCity">
			<div class="modal-dialog" @click.stop>
				<h1 class="title">
					<i class="iconfont icon-tishi"></i> {{language.stopInformation}}</h1>
				<ul class="content">
					<li>
						<span>{{language.stopCity}}</span>
						<span>天津</span>
					</li>
					<li>
						<span>{{language.stopTime}}</span>
						<span>00:30</span>
					</li>
					<li>
						<span>{{language.startFly}}</span>
						<span>30分钟</span>
					</li>
					<li>
						<span>{{language.endFly}}</span>
						<span>00:30</span>
					</li>
				</ul>
				<span class="button" @click="closeCity">{{language.know}}</span>
			</div>
		</div>
		<!--退改签-->
		<div class="modal" v-show="retreat" @click="closeRetreat">
			<div class="modal-dialog" @click.stop>
				<h1 class="title">
					<i class="iconfont icon-tishi"></i>{{language.regular}}</h1>
				<ul class="regulations">
					<li>转签规定： <br />不得转签</li>
					<li>改签规定： <br />起飞前4小时意外，收取公布运价的30% <br />起飞前4小时以内，收取公布运价的40% </li>
					<li>退票规定： <br />起飞前4小时意外，收取公布运价的30% <br />起飞前4小时以内，收取公布运价的40% </li>
				</ul>
				<span class="button" @click="closeRetreat">{{language.know}}</span>
			</div>
		</div>

	</div>
</template>

<script>
import flightPrice_controller from './flightPrice_controller';
export default flightPrice_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.flightPricech {
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
      margin: 50% auto;
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
        color: #666;
        font-size: 18px;
        margin-right: 0.625rem;
      }
    }

    .flightNum {
      background: #fff;
      height: 4.375rem;

      div {
        padding: 0.3125rem 0.9375rem 0;
        line-height: 2.25rem;
        overflow: hidden;
        font-size: 22px;
        background: url(../../../../assets/images/airline.png) no-repeat 50% 1.75rem;
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
        font-size: 14px;
        color: #8c8c8c;

        .fromAddr {
          width: 40%;
          text-align: center;
          float: left;
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

    .addr {
      font-size: 10px;
      color: #8c8c8c;
      height: 2.25rem;
      line-height: 2.25rem;
    }
  }

  .flyList {
    li {
      padding: 0.625rem 0.875rem;
      margin-top: 0.375rem;
      background: #fff;
      overflow: hidden;
      display: flex;
      justify-content: space-between;

      .left {
        width: 70%;
        float: left;
        text-align: left;

        h2 {
          line-height: 1.5rem;
          color: #f15353;
          font-size: 20px;
          font-weight: normal;

          span {
            font-size: 14px;
          }
        }

        p {
          line-height: 1.5rem;
          color: #8c8c8c;
          font-size: 12px;

          span {
            padding-left: 0.625rem;
          }
        }
      }

      .right {
        float: left;
        text-align: right;
        line-height: 3rem;

        span {
          padding: 0.375rem 0.875rem;
          background: #f15353;
          color: #fff;
          border-radius: 0.1875rem;
        }
      }
    }
  }
}

.flightPricewei {
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
          float: right;
          font-size: 25px;
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
      padding-left: 0.9375rem;
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
      padding-right: 0.625rem;

      span {
        float: right;
        padding: 0 0.1875rem;
      }
    }

    .flightNum {
      background: #fff;
      height: 4.375rem;

      div {
        padding: 0.625rem 0.9375rem 0;
        line-height: 2.1875rem;
        overflow: hidden;
        font-size: 22px;
        background: url(../../../../assets/images/airlineLeft.png) no-repeat 50% 1.75rem;

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

    .addr {
      background: #fff;
      height: 2.1875rem;
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  }

  .flyList {
    li {
      padding: 0.625rem 1.25rem;
      margin: 0.625rem 0;
      background: #fff;
      overflow: hidden;

      .left {
        width: 70%;
        float: right;
        text-align: right;

        h2 {
          font-weight: normal;

          b {
            color: #ff951b;
            font-size: 22px;
            float: right;
          }

          span {
            font-size: 16px;
            padding-right: 1.0625rem;
          }
        }

        p {
          color: #666;
          font-size: 12px;
          padding-top: 0.3125rem;

          span {
            color: #1bba9e;
            padding-left: 0.625rem;
          }
        }
      }

      .right {
        width: 30%;
        float: right;
        text-align: left;
        line-height: 2.9375rem;

        span {
          padding: 0.5rem 0.8125rem;
          background: #ff951b;
          color: #fff;
          border-radius: 0.1875rem;
        }
      }
    }
  }
}
</style>





