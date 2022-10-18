<template>
	<div id="trainSearchResults" :class="'trainSearchResults'+$store.state.service.lang">
		<c-title :hide="false" :text="jsonInfo.fromStation+' - '+jsonInfo.toStation"></c-title>
		<div class="date">
			<div class="left" @click="getYestoday">
				<i class="fa fa-angle-left" v-if="$store.state.service.lang=='ch'"></i>
				<i class="iconfont icon-right1" v-if="$store.state.service.lang=='wei'"></i>
				<span>
					{{language.yestoday}}
				</span>
			</div>
			<div class="center">
				<i class="iconfont icon-rili"></i>
				<span id="lang0">{{time}}</span>
				<span id="week">{{week}}</span>
			</div>
			<div class="right" @click="getNextday">
				<i class="fa fa-angle-right" v-if="$store.state.service.lang=='ch'"></i>
				<i class="iconfont icon-left11" v-if="$store.state.service.lang=='wei'"></i>
				<span>
					{{language.nextDay}}
				</span>
			</div>
		</div>

		<ul class="flight">

			<li v-for="(item,index) in trainNumber" @click="toOrder(index)" class="list" :key='index'>
					<div class="top">
						<h4 v-if="false">
							<span>车次：</span>
							<span>{{item.trainNumber}}</span>
						</h4>
						<div class="flightNum">
							<div class="time">
								<span class="fromTime">{{item.startTime}}</span>
								<span class="addone">{{item.trainNumber}}</span>
								<span class="toTime">{{item.endTime}}</span>
							</div>
							<p>
								<span class="fromAddr">{{item.currentStartStationName}}</span>
								<span class="during">{{item.runTime|trainRunTime}}</span>
								<span class="toAddr">{{item.currentEndStationName}}</span>
							</p>
						</div>
						<div class="price" v-if="item.min_price">
							<p>
								<span>{{$i18n.t('money')}}</span>
								<span class="sortNum">{{item.min_price}}</span>
								<small>起</small>
							</p>

						</div>
					</div>
					<div class="bottom_add">
						<div class="addr">
							<template v-for="(seat,index) in item.trainSeats.trainSeat">
								<span :key="index">{{seat.seatName}}</span>
								<span :key="index">({{seat.remainderTrainTickets}})</span>
							</template>

						</div>
					</div>
			</li>

		</ul>

		<ul class="m-footer" v-if="false">
			<li @click="chooseColor($event)" class="active">
				<i class="iconfont icon-shijian"></i>
				<span>{{language.time}}</span>
			</li>
			<li @click="chooseColor($event)" v-if="false">
				<i class="iconfont icon-shaixuan"></i>
				<span>{{language.fliter}}</span>
			</li>
			<li @click="chooseColor($event)">
				<i class="iconfont icon-shijian"></i>
				<span>{{language.runTime}}</span>
			</li>
		</ul>

		<van-popup v-model="popupVisible" position="bottom">
			<div class="pop">
				<p>
					<span class="left" @click="popDisplay">{{language.cancel}}</span>
					<span @click="reseted">{{language.reseted}}</span>
					<span class="right">{{language.confirm}}</span>
				</p>
				<div class="content">
					<!--车型选择-->
					<p>{{language.flyTime}}</p>
					<ul id="flyTime">
						<li v-for="(time,i) in times" @click="filterStyle($event)" :key='i'>{{time.flyTime}}</li>
					</ul>
					<!--出发时间-->
					<p>{{language.airline}}</p>
					<ul id="airline">
						<li v-for="(airline,i) in airlines" :key='i' @click="filterStyle2($event)"> {{airline.line}}</li>
					</ul>
					<!--出发车站-->
					<p>{{language.startPort}}</p>
					<ul id="startAirport">
						<li :key='i' v-for="(startAirport,i) in startAirports" @click="filterStyle3($event)">{{startAirport.port}}</li>
					</ul>
					<!--到达车站-->
					<p>{{language.endPort}}</p>
					<ul id="endAirport">
						<li :key='i' v-for="(endAirport,i) in endAirports" @click="filterStyle4($event)">{{endAirport.port}}</li>
					</ul>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
import trainSearchResults_controller from './trainSearchResults_controller';
export default trainSearchResults_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.active {
  color: #1bba9e;
}

.fliterActive {
  background: #1bba9e;
  color: #fff;
}

* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.trainSearchResultsch {
  .date {
    display: flex;
    justify-content: space-between;
    padding: 0 0.875rem;
    background: #fff;
    overflow: hidden;
    height: 2.8125rem;
    line-height: 2.8125rem;
    color: #f15353;
    font-size: 14px;

    .left {
      i {
        font-size: 24px;
        float: left;
        line-height: 2.8125rem;
        color: #f15353;
        margin-right: 0.625rem;
      }

      span {
        float: right;
        text-align: right;
        line-height: 2.8125rem;

        b {
          font-weight: normal;
          font-size: 16px;
        }
      }
    }

    .center {
      width: 7.5rem;
      height: 1.625rem;
      line-height: 1.625rem;
      margin-top: 0.625rem;
      -webkit-border-radius: 0.25rem;
      -moz-border-radius: 0.25rem;
      border-radius: 0.25rem;
      float: left;
      border: solid 0.0625rem #f15353;
    }

    .right {
      float: left;
      text-align: right;

      i {
        font-size: 24px;
        float: right;
        line-height: 2.8125rem;
        color: #f15353;
        margin-left: 0.625rem;
      }

      span {
        float: left;
        text-align: right;
        line-height: 2.8125rem;

        b {
          font-weight: normal;
          font-size: 16px;
        }
      }
    }
  }

  .flight {
    margin-bottom: 0.3125rem;

    a {
      color: #333;
    }

    .list {
      margin: 0.375rem 0;

      .top {
        display: flex;
        justify-content: space-between;
        padding: 0.625rem 0.875rem;
        height: 5.625rem;
        background: #fff;

        h4 {
          font-weight: normal;
          text-align: left;
          color: #49c6b0;
        }

        .flightNum {
          width: 68%;
          float: left;

          .time {
            clear: both;
            padding: 0.875rem 0 0;
            line-height: 2.25rem;
            overflow: hidden;
            font-size: 20px;
            background: url(../../../../assets/images/airline-a.png) no-repeat 50% 1.75rem;
            background-size: 3rem;

            .fromTime {
              float: left;
              width: 6.25rem;
              text-align: left;
            }

            .toTime {
              float: right;
              width: 6.25rem;
              text-align: right;
            }

            .addone {
              color: #333;
              line-height: 18px;
              font-size: 10px;
              position: absolute;
              top: 0.625rem;
              left: 50%;
              -webkit-transform: translateX(-50%);
              -moz-transform: translateX(-50%);
              -ms-transform: translateX(-50%);
              -o-transform: translateX(-50%);
              transform: translateX(-50%);
            }

            position: relative;
          }

          p {
            display: flex;
            justify-content: space-between;
            line-height: 1.125rem;
            font-size: 12px;
            color: #8c8c8c;

            .fromAddr {
              float: left;
              width: 6.25rem;
              text-align: left;
            }

            .toAddr {
              float: right;
              width: 6.25rem;
              text-align: right;
            }

            .during {
              position: absolute;
              top: -0.625rem;
              left: 50%;
              -webkit-transform: translateX(-50%);
              -moz-transform: translateX(-50%);
              -ms-transform: translateX(-50%);
              -o-transform: translateX(-50%);
              transform: translateX(-50%);
            }

            position: relative;
          }
        }

        .price {
          width: 25%;
          float: left;
          text-align: right;

          p {
            line-height: 4.25rem;
            text-align: right;
            font-size: 20px;
            color: #f15353;

            span:first-child {
              font-size: 14px;
            }

            small {
              font-size: 12px;
              color: #8c8c8c;
            }
          }
        }
      }

      .bottom_add {
        background: #fff;
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 14px;
        padding: 0 0.875rem;
        text-align: left;
        position: relative;

        .circle {
          width: 1.25rem;
          height: 1.25rem;
          display: inline-block;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          background: #eee;
          position: absolute;
        }

        .left {
          top: -0.625rem;
          left: -0.625rem;
        }

        .right {
          right: -0.625rem;
          top: -0.625rem;
        }

        .addr {
          border-top: solid 0.0625rem #ebebeb;
          color: #8c8c8c;

          span {
            padding: 0 0.125rem;
          }
        }
      }
    }
  }

  .m-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    background: #fff;

    li {
      flex: 1;
      width: 50%;
      float: left;
    }
  }

  .pop {
    p {
      text-align: center;
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 0.9375rem;
      background: #f3f5f7;

      .left {
        float: left;
      }

      .right {
        float: right;
        color: #1bba9e;
      }
    }

    .content {
      margin-bottom: 0.625rem;

      p {
        height: 1.5625rem;
        line-height: 1.5625rem;
        color: #999;
        font-size: 12px;
        text-align: left;
        background: #fff;
      }

      ul {
        overflow: hidden;
        padding: 0 0.9375rem;
        margin-bottom: 0.625rem;

        li {
          height: 1.625rem;
          line-height: 1.625rem;
          border: 0.0625rem solid #ccc;
          -webkit-border-radius: 0.375rem;
          -moz-border-radius: 0.375rem;
          border-radius: 0.375rem;
          padding: 0 1.125rem;
          display: inline-block;
          float: left;
          margin-right: 0.625rem;
          margin-top: 0.625rem;
        }
      }
    }
  }
}

.trainSearchResultswei {
  .time {
    padding: 0.9375rem;
    overflow: hidden;
    height: 4.0625rem;
    background: #1bba9e;
    color: #fff;

    .left {
      width: 22%;
      float: right;
      margin-left: 3%;

      i {
        float: right;
        line-height: 2.1875rem;
        color: #55e6cd;
      }

      span {
        float: left;
        text-align: left;
        line-height: 2.125rem;
      }
    }

    .center {
      width: 50%;
      height: 2.1875rem;
      line-height: 2.1875rem;
      -webkit-border-radius: 0.3125rem;
      -moz-border-radius: 0.3125rem;
      border-radius: 0.3125rem;
      float: right;
      background: #158d78;
    }

    .right {
      width: 22%;
      float: right;
      margin-right: 3%;

      i {
        float: left;
        line-height: 2.1875rem;
        color: #55e6cd;
      }

      span {
        float: right;
        text-align: right;
        line-height: 2.125rem;
      }
    }
  }

  .flight {
    margin-bottom: 4.375rem;

    a {
      color: #333;
    }

    li {
      padding: 0 0.9375rem;
      margin: 0.625rem 0;

      .top {
        height: 5.625rem;
        background: #fff;
        border-bottom: 0.0625rem dotted #ccc;
        -webkit-border-radius: 0.375rem;
        -moz-border-radius: 0.375rem;
        border-radius: 0.375rem;
        padding: 0.3125rem 0.9375rem;

        h4 {
          font-weight: normal;
          text-align: right;
          color: #49c6b0;
        }

        .flightNum {
          width: 75%;
          float: right;

          div {
            height: 2.1875rem;
            line-height: 2.1875rem;
            overflow: hidden;
            font-size: 18px;
            background: url(../../../../assets/images/airline-a.png) no-repeat 50% 0.8125rem;

            .fromTime {
              float: left;
            }

            .toTime {
              float: right;
            }

            .addone {
              font-size: 10px;
              position: absolute;
              top: -0.625rem;
              left: 50%;
              -webkit-transform: translateX(-50%);
              -moz-transform: translateX(-50%);
              -ms-transform: translateX(-50%);
              -o-transform: translateX(-50%);
              transform: translateX(-50%);
            }

            position: relative;
          }

          p {
            padding: 0 0.9375rem;
            font-size: 13px;

            .fromAddr {
              float: left;
            }

            .toAddr {
              float: right;
            }

            .during {
              position: absolute;
              top: -0.625rem;
              left: 50%;
              -webkit-transform: translateX(-50%);
              -moz-transform: translateX(-50%);
              -ms-transform: translateX(-50%);
              -o-transform: translateX(-50%);
              transform: translateX(-50%);
            }

            position: relative;
          }
        }

        .price {
          width: 25%;
          float: right;
          text-align: left;

          p {
            line-height: 2.1875rem;
            font-size: 16px;
            color: #ff951b;
          }
        }
      }

      .bottom_add {
        background: #fff;
        height: 1.875rem;
        line-height: 1.875rem;
        -webkit-border-radius: 0.375rem;
        -moz-border-radius: 0.375rem;
        border-radius: 0.375rem;
        position: relative;

        .circle {
          width: 1.25rem;
          height: 1.25rem;
          display: inline-block;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          background: #eee;
          position: absolute;
        }

        .left {
          top: -0.625rem;
          left: -0.625rem;
        }

        .right {
          right: -0.625rem;
          top: -0.625rem;
        }

        .addr {
          span {
            font-size: 12px;
          }

          span:nth-child(2n) {
            padding-left: 0.4375rem;
          }
        }
      }
    }
  }

  .m-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    background: #fff;

    li {
      flex: 1;
      width: 33.3%;
      float: left;
    }
  }

  .pop {
    p {
      text-align: center;
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 0.9375rem;
      background: #f3f5f7;

      .left {
        float: right;
      }

      .right {
        float: left;
        color: #1bba9e;
      }
    }

    .content {
      margin-bottom: 0.625rem;

      p {
        height: 1.5625rem;
        line-height: 1.5625rem;
        color: #999;
        font-size: 12px;
        text-align: right;
        background: #fff;
      }

      ul {
        overflow: hidden;
        padding: 0 0.9375rem;
        margin-bottom: 0.625rem;

        li {
          height: 1.625rem;
          line-height: 1.625rem;
          border: 0.0625rem solid #ccc;
          -webkit-border-radius: 0.375rem;
          -moz-border-radius: 0.375rem;
          border-radius: 0.375rem;
          padding: 0 1.125rem;
          display: inline-block;
          float: right;
          margin-right: 0.625rem;
          margin-top: 0.625rem;
        }
      }
    }
  }
}
</style>
