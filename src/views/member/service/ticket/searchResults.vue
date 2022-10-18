<template>
	<div id="searchResults" :class="'searchResults'+$store.state.service.lang">
		<c-title :hide="false" :text="jsonInfo.fromStation+'-'+jsonInfo.toStation"></c-title>
		<div class="date">
			<div class="left" @click="getYestoday">
				<i class="fa fa-angle-left" v-if="$store.state.service.lang=='ch'"></i>
				<i class="iconfont icon-right1" v-if="$store.state.service.lang=='wei'"></i>
				<span>
					{{language.yestoday}}
					<!--<br /><b>{{$i18n.t('money')}}730</b>-->
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
					<!--<br /><b>{{$i18n.t('money')}}730</b>-->
				</span>
			</div>
		</div>

		<ul class="flight">

			<li v-for="(item,index) in firNumber" :key='index' @click="toOrder(index)" class="list">
					<div class="top">
						<ul class="flightNum">
							<li class="time">
								<span class="fromTime">{{item.depTime}}</span>
								<span class="toTime">{{item.arriTime}}</span>
							</li>
							<li class="address">
								<span class="fromAddr">{{item.orgCityName}}</span>
								<span class="toAddr">{{item.dstCityName}}</span>
							</li>
						</ul>
						<div class="price">
							<p>
								<span><small>{{$i18n.t('money')}}</small></span>
								<span class="sortNum">{{item.parPrice}}</span>
							</p>
						</div>
					</div>
					<div class="bottom_name">
						<div class="addr">
							<span>{{item.flightCompanyName}}</span>
							<span>{{item.flightNo}}</span>
							<!-- <span>|</span>-->
							<!--<span>波音701-9</span> <span>(大)</span>-->
						</div>
					</div>
			</li>

			<!--
				<li>
					<div class="top">
						<div class="flightNum">
							<div> <span class="fromTime">22:10</span> <span class="toTime">01:10</span> </div>
							<p> <span class="fromAddr">白云机场T3</span> <span class="toAddr">首都机场T1</span> </p>
						</div>
						<div class="price">
							<p><span>{{$i18n.t('money')}}</span><span class="sortNum">799</span></p>
							<span>总价</span>
						</div>
					</div>
					<div class="bottom">
						<span class="circle left"></span>
						<span class="circle right"></span>
						<div class="addr">
							<span>海南航空</span> <span>HU2014</span>  <span>|</span>
							<span>波音701-9</span> <span>(大)</span>
						</div>
					</div>
				</li>-->

		</ul>

		<ul class="m-footer" v-if="false">
			<li @click="chooseColor($event)" :class="{active:isColor}">
				<i class="iconfont icon-shijian"></i>
				<span>{{language.time}}</span>
			</li>
			<!--<li @click="chooseColor($event)"><i class="iconfont icon-shaixuan"></i> <span>{{language.fliter}}</span></li>
				<li @click="chooseColor($event)"><i class="iconfont icon-jiage"></i> <span>{{language.price}}</span></li>-->
		</ul>

		<van-popup v-model="popupVisible" position="bottom">
			<div class="pop">
				<p>
					<span class="left" @click="popDisplay">{{language.cancel}}</span>
					<span @click="reseted">{{language.reseted}}</span>
					<span class="right">{{language.confirm}}</span>
				</p>
				<div class="content">
					<!--起飞时间-->
					<p>{{language.flyTime}}</p>
					<ul id="flyTime">
						<li :key='i' v-for="(time,i) in times" @click="filterStyle($event)">{{time.flyTime}}</li>
					</ul>
					<!--航空公司-->
					<p>{{language.airline}}</p>
					<ul id="airline">
						<li  :key='i' v-for="(airline,i) in airlines" @click="filterStyle2($event)"> {{airline.line}}</li>
					</ul>
					<!--起飞机场-->
					<p>{{language.startPort}}</p>
					<ul id="startAirport">
						<li :key='i' v-for="(startAirport,i) in startAirports" @click="filterStyle3($event)">{{startAirport.port}}</li>
					</ul>
					<!--到达机场-->
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
import searchResults_controller from './searchResults_controller';
export default searchResults_controller;
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

.searchResultsch {
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
      i {
        font-size: 24px;
        float: right;
        line-height: 2.8125rem;
        color: #f15353;
        margin-left: 0.625rem;
      }

      span {
        float: left;
        text-align: left;
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
        padding: 0.625rem 0.875rem;
        height: 90px;
        background: #fff;
        display: flex;
        justify-content: space-between;

        .flightNum {
          width: 68%;
          float: left;

          .time {
            clear: both;
            padding: 0.875rem 0 0;
            line-height: 2.25rem;
            overflow: hidden;
            font-size: 20px;
            background: url(../../../../assets/images/airline.png) no-repeat 50% 1.75rem;
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
          }

          .address {
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
          }
        }

        .price {
          width: 25%;
          float: left;

          p {
            line-height: 4.25rem;
            text-align: right;
            font-size: 20px;
            color: #f15353;

            small {
              font-size: 14px;
            }
          }
        }
      }

      .bottom_name {
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
          border-top: solid 1px #ebebeb;
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

.searchResultswei {
  .time {
    background: #fff;
    overflow: hidden;
    height: 2.8125rem;
    line-height: 2.8125rem;
    color: #fff;

    .left {
      width: 22%;
      float: right;
      margin-left: 3%;

      i {
        float: right;
        line-height: 35px;
        color: #f15353;
        position: absolute;
        z-index: 66;
        right: 0.9375rem;
      }

      span {
        float: left;
        text-align: left;

        b {
          font-weight: normal;
          font-size: 16px;
        }
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
    }

    .right {
      width: 22%;
      float: right;
      margin-right: 3%;

      i {
        float: left;
        line-height: 2.1875rem;
        color: #55e6cd;
        position: absolute;
        z-index: 66;
        left: 0.9375rem;
      }

      span {
        float: right;
        text-align: right;

        b {
          font-weight: normal;
          font-size: 16px;
        }
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

        .flightNum {
          width: 68%;
          float: right;

          div {
            height: 3.125rem;
            padding: 0.9375rem 0.9375rem 0;
            line-height: 2.1875rem;
            overflow: hidden;
            font-size: 18px;
            background: url(../../../../assets/images/airlineLeft.png) no-repeat 50% 1.75rem;

            .fromTime {
              float: right;
            }

            .toTime {
              float: left;
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
          }
        }

        .price {
          width: 25%;
          float: right;
          margin-top: 0.9375rem;

          p {
            line-height: 2.1875rem;
            font-size: 16px;
            color: #ff951b;
          }
        }
      }

      .bottom_name {
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
