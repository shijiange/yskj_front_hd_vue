<template>
  <div id="telephone"
       :class="'telephone'+$store.state.service.lang">
    <c-title :hide="false"
             :text='language.title'
             tolink='rechargeRecord'
             :totext='language.record'></c-title>
    <div class="bg">
      <div class="telep">
        <div id="intel">
          <input :placeholder="language.placeTip"
                 v-model.trim="MobilePhone"
                 type="number"
                 ref='isinput'>
          <!--<i class="fa fa-bars" @click='toMobileBingding'></i>-->
        </div>
        <p id="telInfo"
           v-if='phoneInfo'>{{phoneInfo}}</p>
      </div>

      <div class="content">
        <ul class="box">
          <li v-for="(item,index) in items" :key='index'>
            <div class="par"
                 @click="selectStyle($event,item)"
                 :class="{'active':item.recharge==moneyHotspot}">
              <b>{{item.recharge}}{{language.yuan}}</b>
              <p v-if="item.discount">{{item.discount}}{{language.yuan}}</p> <i></i>
              <div class="info"
                   :class="{'active':item.recharge==moneyHotspot}"></div>
            </div>
          </li>
        </ul>
      </div>
      <div class="m-footer"
           :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
        <p class="subtotal"><span>{{language.subtotal}}</span><span>{{$i18n.t("money")}}{{sourceMoney}}</span></p>
        <div class="clear"></div>
        <div class="integral"
             v-show="offDeductible">
          <div>
            <b>
              <!--{{language.score}}-->{{deductionName}}</b> <span>{{language.scoreTip1}}&nbsp;<font>{{score}}</font>&nbsp;{{language.scoreTip2}}<font>&nbsp;{{scoreMoney}}&nbsp;</font>{{language.yuan}}</span>
          </div>
          <van-switch :class="{rt:$store.state.service.lang=='ch',lf:!$store.state.service.lang=='wei'}"
                      v-model="useScore" active-color="#f15353" inactive-color="#fff"/>
        </div>
        <!--<p class="poundage">注：手续费为{{poundage}}%</p>-->
        <div class="clear"></div>
        <div class="amount"
             :class="{'disableds':disableds}">
          <span>{{language.total}}<b>{{computedMoney}}</b></span>

          <button type="button"
                  @click="goSubmit">{{language.btn}}
          </button>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import telephone_controller from "./telephone_controller";

export default telephone_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  .telephonech {
    .bg {
      background-color: #fff;
    }

    .poundage {
      color: red;
      font-size: 12px;
    }

    #telInfo {
      text-align: left;
      color: #8c8c8c;
      height: 1.5rem;
      line-height: 1.5rem;
      background: #fff;
      display: block;
    }

    #intel {
      padding-top: 0.625rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      line-height: 2.8125rem;
      height: 2.5rem;

      input {
        flex: 9;
        border: 0;
        outline: 0;
        color: #333;
        font-size: 24px;
        line-height: 1.875rem;
      }

      i {
        flex: 1;
      }
    }

    .telep {
      margin-top: 0.625rem;
      padding: 0 0.875rem;
      background: #fff;

      p {
        height: 2.8125rem;

        b {
          font-size: 22px;
          color: #1bba9e;
          font-weight: normal;
        }

        span {
          font-size: 12px;
          color: #666;
        }

        input {
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          color: #8c8c8c;
          font-size: 24px;
        }
      }
    }

    .content {
      margin-top: 0.625rem;
      background: #fff;
      padding: 0 0.875rem;

      .input {
        margin: 0.4375rem 0.8125rem;
        box-sizing: border-box;

        input {
          width: 100%;
          height: 2.1875rem;
          font-size: 12px;
          border-radius: 0.1875rem;
          border: 0.0625rem solid #ccc;
          padding-left: 4%;
          background: #fff;
          outline: 0;
          color: #000;
        }
      }

      .box {
        border-top: solid 0.0625rem #ebebeb;
        padding: 14px 0;
        overflow: hidden;

        li {
          width: 33.3%;
          float: left;
          height: 4.625rem;
          margin-bottom: 0.625rem;

          div {
            margin: 0.375rem 0.375rem;
            border: 0.0625rem solid #ebebeb;
            height: 100%;
            border-radius: 0.25rem;
            box-sizing: border-box;
            padding-top: 0.875rem;

            b {
              font-size: 24px;
              font-weight: normal;
              color: #666;
            }

            p {
              font-size: 12px;
              color: #999;
            }
          }

          .active {
            border: 0.0625rem solid #f15353;
            position: relative;

            i {
              width: 1.875rem;
              height: 1rem;
              display: inline-block;
              position: absolute;
              right: 0;
              bottom: 0;
              background: url(../../../../assets/images/checke.png) no-repeat 0.0625rem 0;
            }
          }

          .par {
            position: relative;
          }

          .info {
            width: 100%;
            height: 100%;
            z-index: 100;
            position: absolute;
            top: -0.375rem;
            left: -0.375rem;
          }
        }
      }
    }

    .m-footer {
      box-shadow: 0 0 6px 0 rgba(204, 204, 204, 0.4);
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #fff;

      .subtotal {
        height: 2.5rem;
        line-height: 2.5rem;
        margin-left: 0.875rem;
        padding-right: 0.875rem;

        span:first-child {
          color: #333;
          font-size: 16px;
          float: left;
        }

        span:last-child {
          font-size: 16px;
          color: #f15353;
          float: right;
        }
      }

      .integral {
        margin-left: 0.875rem;
        padding-right: 0.875rem;
        border-top: solid 0.0625rem #ebebeb;
        height: 2.8125rem;
        line-height: 2.8125rem;

        div {
          float: left;

          b {
            color: #333;
            font-size: 16px;
            font-weight: noraml;
          }

          span {
            color: #333;
            font-size: 14px;
          }

          font {
            color: #f15353;
            font-size: 16px;
          }
        }
      }

      .amount.disableds {
        button {
          background: #ccc;
        }
      }

      .amount {
        z-index: 10;
        // box-shadow: 6px 0 0 0 rgba(51, 51, 51, .9);
        border-top: solid 0.0625rem #e2e2e2;
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0 0 0.875rem;
        margin-bottom: 0;
        box-sizing: border-box;

        span {
          color: #333;
          font-size: 16px;
          float: left;
        }

        button {
          width: 6.875rem;
          height: 2.8125rem;
          color: #fff;
          font-size: 16px;
          background: #f15353;
          border: 0;
          float: right;
        }
      }
    }
  }

  // .telephonewei{
  // 	.telep{
  //         height:2.8125rem;
  //         padding:0 0.8125rem;
  //         background:#fff;
  //         p{
  //            height:2.8125rem;
  //            b.lf{
  //             font-size:22px;
  //             color:#1bba9e;
  //             font-weight:normal;
  //             }
  //             span.rt{
  //                 font-size:12px;
  //                 color:#666;
  //             }
  //             input{
  //                 width:100%;
  //                 height:100%;
  //                 border:0;
  //                 outline:0;
  //                 color:#1bba9e;
  //                 font-size:18px;
  //                 /*text-align:right;*/
  //             }
  //         }
  //     }
  //     .content{
  //        	background:#fff;
  //        	padding-top:0.625rem;
  //        	margin-top: 0.625rem;
  // 	    .input{
  // 	        margin:0.4375rem 0.8125rem;
  // 	        input{
  // 	            width:100%;
  // 	            height:2.1875rem;
  // 	            font-size:0.75rem;
  // 	            border-radius:0.1875rem;
  // 	            color:#ccc;
  // 	            border:0.0625rem solid #ccc;
  // 	            padding-right:4%;
  // 	            background:#fff;
  // 	            outline:0;
  // 	            color:#000;
  // 	            text-align:right;
  // 	        }
  // 	    }
  // 	    .box{
  // 	        margin:0.4375rem;
  // 	        overflow:hidden;
  // 	        li{
  // 	            width:33.3%;
  // 	            float:right;
  // 	            height:5rem;
  // 	            margin-bottom:0.625rem;
  // 	            div{
  // 	                margin:0.375rem 0.375rem;
  // 	                border:0.0625rem solid #ccc;
  // 	                height:100%;
  // 	                border-radius:0.25rem;
  // 	                box-sizing:border-box;
  // 	                padding-top:1.25rem;
  // 	                b{
  // 	                    font-size:22px;
  // 	                    color:#666;
  // 	                }
  // 	                p{
  // 	                    font-size:10px;
  // 	                    color:#999;
  // 	                }
  // 	            }
  // 	            .active{
  // 	                border:0.0625rem solid #36d2b6;
  // 	                position:relative;
  // 	                i{
  // 	                    width:1.875rem;
  // 	                    height:1rem;
  // 	                    display:inline-block;
  // 	                    position:absolute;
  // 	                    right:0;
  // 	                    bottom:0;
  // 	                    background:url(../../../../assets/images/checkeD.png) no-repeat 0.0625rem 0;
  // 	                }
  // 	            }
  // 	            .par{
  // 	                position: relative;
  // 	            }
  // 	            .info{
  // 	                width: 100%;
  // 	                height: 100%;
  // 	                z-index: 100;
  // 	                position: absolute;
  // 	                top:-0.375rem;
  // 	                left: -0.375rem;
  // 	            }
  // 	        }
  // 	    }
  //     }
  //     .m-footer{
  //         width:100%;
  //         background:#fff;
  //         .subtotal{
  //             height:2.5rem;
  //             line-height:2.5rem;
  //             padding:0 0.8125rem;
  //             border-bottom:0.0625rem solid #ccc;
  //             margin:0;
  //             span:first-child{
  //                 color:#333;
  //                 font-size:16px;
  //                 float:right;
  //             }
  //             span:last-child{
  //                 color:12px;
  //                 color:#333;
  //                 float:left;
  //             }
  //         }
  //         .integral{
  //             height:2.8125rem;
  //             line-height:2.8125rem;
  //             padding:0 0.8125rem;
  //             div{
  //             	float:right;
  //                 b{
  //                     color:#333;
  //                     font-size:16px;
  //                     font-weight:noraml;
  //                     float:right;
  //                 }
  //                 span{
  //                     color:#333;
  //                     font-size:12px;
  //                 }
  //             }
  //         }
  //         .amount{
  //             height:3.125rem;
  //             line-height:3.125rem;
  //             padding:0 0 0 0.8125rem;
  //             margin-bottom:0;
  //             box-sizing:border-box;
  //             span{
  //                 color:#333;
  //                 font-size:16px;
  //                 float:left;
  //             }
  //             button{
  //                 width:6.5625rem;
  //                 height:2.5rem;
  //                 color:#fff;
  //                 font-size:16px;
  //                 background:#ff951b;
  //                 border:0;
  //                 border-radius:0.1875rem;
  //                 margin-top:0.5625rem;
  //                 float:right;
  //             }
  //         }
  //     }
  // }

  /deep/ .van-switch {
    float: right !important;
    top: 0.5rem;
  }

  /deep/ .van-switch__node {
    top: -1px;
  }

</style>
