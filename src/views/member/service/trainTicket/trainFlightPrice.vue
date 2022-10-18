<template>
	<div id="trainFlightPrice" :class="'trainFlightPrice'+$store.state.service.lang">
		<c-title :hide="false" :text="jsonInfo.fromStation+' - '+jsonInfo.toStation"></c-title>

		<div class="flight">
			<div class="top">
				<span>{{jsonInfo.date}}</span>
				<span>{{week}}</span>
			</div>
			<div class="flightNum">
				<div>
					<span class="fromTime">{{trainTicketInfo.startTime}}</span>
					<span class="addOne">{{trainTicketInfo.trainNumber}}</span>
					<span class="toTime">{{trainTicketInfo.endTime}}</span>
				</div>
				<p>
					<span class="fromAddr">{{trainTicketInfo.currentStartStationName}}</span>
					<span class="during">{{trainTicketInfo.runTime|trainRunTime}}</span>
					<span class="toAddr">{{trainTicketInfo.currentEndStationName}}</span>
				</p>
			</div>
		</div>

		<ul class="flyList">
			<li v-for="(trainSeat,index) in trainSeats" :key='index'>
				<div class="left">
					<h2>
						<span>{{$i18n.t('money')}}</span>
						{{trainSeat.seatPrice}}
					</h2>
					<p>
						<span>{{trainSeat.seatName}}</span>
						<span>|</span>
						<span>仅剩{{trainSeat.remainderTrainTickets}}张</span>
					</p>
				</div>
				<div class="right"  @click="toOrder(index)">

						<span cl>{{language.booked}}</span>

				</div>
			</li>
		</ul>

	</div>
</template>

<script>
import trainFlightPrice_controller from './trainFlightPrice_controller';
export default trainFlightPrice_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.trainFlightPricech {
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
      background-color: #fff;
      height: 4.375rem;
      background: url(../../../../assets/images/airline-a.png) no-repeat 50% 1.75rem;
      background-size: 3.75rem;

      div {
        padding: 0.3125rem 0.9375rem 0;
        line-height: 2.25rem;
        overflow: hidden;
        font-size: 22px;

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

.trainFlightPricewei {
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
          color: #ff951b;
          font-size: 22px;
        }

        p {
          padding-top: 0.3125rem;

          span {
            padding-right: 0.3125rem;
            color: #666;
            font-size: 12px;
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





