<template>
  <div id="confirmOrder">
    <c-title :hide="false" text='确认下单'></c-title>
    <div class="addr" @click="showAddress">
      <div class="lf">
        <p class="one">收货人:{{realname}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{mobile}}</p>
        <p class="two">
          <i class="iconfont icon-fontclass-dizhi"></i>收货地址:{{address}}</p>
      </div>
      <div class="rt">
        <i class="iconfont icon-right"></i>
      </div>
    </div>

    <!--商品订单-->
    <div class="goods-detail">
      <div v-for=" (item, i) in order_data" :key='i'>
        <div class="goods-shop">
          <p>{{item.supplier.username}}</p>
        </div>
        <div class="detail_good">
          <!--	<h3><i class="fa fa-gift"></i>合利爱购</h3>-->
          <div class="goods" :key='i' v-for="(g,i) in item.order.order_goods">
            <div class="img">
              <img :src="g.thumb">
            </div>

            <div class="warp">
              <div class="inner">
                <div class="name">{{g.title|escapeTitle}}</div>
                <div class="option">规格: {{g.goods_option_title}}</div>
              </div>
              <div class="price">
                <p>{{$i18n.t("money")}}{{(g.goods_price/g.total)}}</p>
                <p>×{{g.total}}</p>
              </div>
            </div>

          </div>
        </div>

        <div class="data">
          <div class="lf">
            <i class="iconfont icon-quyufenhong"></i>
            租赁日期
          </div>
          <div class="rt">
            <p>起始：{{item.order.lease_order.start_time}}</p>
            <p>归还：{{item.order.lease_order.end_time}}</p>
            <h3>共计：{{item.order.lease_order.time_lift}}</h3>
          </div>
        </div>

        <div class="send">
          <div class="lf">配送方式：</div>
          <div class="rt">快递</div>
        </div>

        <div class="money">
          <p>
						<span class="lf">租金
							<i @click="rentalTip">?</i>
						</span>
            <span class="rt">{{$i18n.t("money")}}{{item.order.price}}</span>
          </p>
          <p>
						<span class="lf">押金
							<i @click="depositTip">?</i>
						</span>
            <span class="rt">{{$i18n.t("money")}}{{item.order.lease_order.cash}}</span>
          </p>
        </div>
      </div>
    </div>
    <!--商品订单结束-->

    <div>

      <p class="all">
        <span class="lf">运费 </span>
        <span class="rt">{{$i18n.t("money")}}{{dispatch_price}}</span>
      </p>

    </div>

    <div class="content">

      <div class="remark">
        <label for="">备注</label>
        <textarea v-model="remark" name="" rows="" cols="" placeholder="若有送货时间或者其他要，请在这里备注说明"></textarea>
        <!--<input type="text" placeholder="若有送货时间或者其他要，请在这里备注说明"/>-->
      </div>

    </div>
    <div class="footer">
      <div class="check">
        <input type="checkbox" v-model="checkAgree" @click="check"/>我已认真阅读并同意该
        <b @click="rentPop">
          《租赁协议》</b>
      </div>
      <div class="sub">
				<span class="lf">
					合计：
					<b>{{$i18n.t("money")}}{{price}}</b>
				</span>
        <button class="rt" @click="submit">提交订单</button>
      </div>
      <div class="alert" v-show="alert">
        <i class="iconfont icon-sousuo1"></i>请同意 《租赁协议》，再提交订单
      </div>
    </div>
    <!--租赁协议-->
    <van-popup v-model="popupVisible" position="bottom" popup-transition="popup-fade">
      <div class="rentPop">
        <h3>
          <span class="lf" @click="rentPop()">取消</span>租赁协议</h3>
        <p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
        <button @click="rentPopVerify">阅读并同意</button>
      </div>
    </van-popup>
    <!-- 弹窗 -->
    <div class="modal" v-show="rental">
      <div class="modal-dialog">
        <div class="close" @click="closeModal()">
          <img src="../../assets/images/close.png">
        </div>
        <h1 class="title">租金说明</h1>
        <p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="modal" v-show="deposit">
      <div class="modal-dialog">
        <div class="close" @click="closeModal()">
          <img src="../../assets/images/close.png">
        </div>
        <h1 class="title">押金冻结说明</h1>
        <p>如果你无法简洁的表达你的想法，那么说明你还不都了解他---阿尔伯特-爱因斯坦</p>
      </div>
    </div>

    <van-popup v-model="popupSpecs" position="bottom" class="mint-popup-4" closeOnClickModal='true'>
      <div class="add-info">
        <ul>

          <li :key='i' v-for="(item,i) in addressData" @click="selectAddress(item)">
            <div class="liia">
              <font class="name" style="">{{item.username+" "+item.mobile}}</font>
              <br/>
              <font class="address" style="">{{item.province+" "+item.city+" "+item.district}}{{item.address}}
              </font>
            </div>
            <!--<i class="fa fa-trash-o"></i>-->
          </li>

        </ul>
      </div>
      <button class="address-plus" @click="addAddress">新增地址</button>
    </van-popup>

    <div id="AllGood" :class="{animation}">
      <div id="appendAddress" :class="{onclast:onclast}">

        <van-nav-bar
          left-arrow
          title="添加地址"
          fixed
          @click-left="popAddressClose"
          :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        />

        <div style="height: 2.5rem;"></div>
        <van-field label="收件人" v-model="form.username" placeholder="请输入收件人" center clearable :border="false"/>
        <van-field label="联系电话" v-model="form.mobile" placeholder="请输入联系电话" type="tel" center clearable
                   :border="false"/>
        <div class="maleall">
          <label class="males">
            <span>设置默认地址 </span>
            <div class="address" style="">
              <van-switch v-model="form.isdefault" active-color="#f15353" inactive-color="#fff" size="25px"/>
            </div>
          </label>
        </div>
        <div class="maleall">
          <label for="male" class="males">
            <span>所在省份 </span>
            <!--<el-select v-model="provicevalue" placeholder="请选择省份" @change="selectProviceHandle">-->
            <!--<el-option v-for="item in provinceoptions" :label="item.areaname" :value="item">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <van-button plain type="primary"
                        style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 10rem;"
                        @click="seleRegional">{{regional}}
            </van-button>
          </label>
        </div>
        <div class="maleall">
          <label for="male" class="males">
            <span>所在城市 </span>
            <!--<el-select v-model="cityvalue" placeholder="请选择城市" @change="selectCityHandle">-->
            <!--<el-option v-for="item in cityoptions" :label="item.areaname" :value="item">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <van-button plain type="primary"
                        style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 10rem;"
                        :disabled="streetnull" @click="seleRegional_1">{{regiona2}}
            </van-button>
          </label>
        </div>
        <div class="maleall">
          <label for="male" class="males">
            <span>所在街道 </span>
            <!--<el-select v-model="regionvalue" placeholder="请选择区县" @change="selectRegionHandle">-->
            <!--<el-option v-for="item in regionoptions" :label="item.areaname" :value="item">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <van-button plain type="primary"
                        style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 10rem;"
                        :disabled="citynull" @click="seleRegional_2">{{regiona3}}
            </van-button>
          </label>
        </div>

        <van-field label="" v-model="form.address" placeholder="请输入详细地址" center clearable :border="false"/>
        <div style="height: 5rem;"></div>
        <div class="address_addnav" @click="appendAddress">
          <i class="fa fa-plus-circle"></i>
          <span>保存</span>
        </div>

      </div>
    </div>
    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-picker :columns="columns" @change="onChange" @cancel="onCancelbtn" @confirm="onConfirmbtn" show-toolbar/>
    </van-popup>
    <van-popup v-model="dateshow_2" position="bottom" :overlay="true">
      <van-picker :columns="columns_1" @change="onChange_1" @cancel="onCancelbtn_1" @confirm="onConfirmbtn_1"
                  show-toolbar/>
    </van-popup>
    <van-popup v-model="dateshow_3" position="bottom" :overlay="true">
      <van-picker :columns="columns_2" @change="onChange_2" @cancel="onCancelbtn_2" @confirm="onConfirmbtn_2"
                  show-toolbar/>
    </van-popup>
  </div>
</template>

<script>
import confirmOrder_controller from "./confirmOrder_controller";

export default confirmOrder_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #confirmOrder {
    .mint-header {
      background: #fff;
      color: #000;
    }

    #AllGood.animation {
      top: 0;

      header {
        display: flex;
      }

      .address_addnav {
        display: block;
      }
    }

    .add-info {
      overflow-y: scroll;
      width: 100%;
      background: #fff;
      max-height: 50vh;
      padding-top: 0.625rem;
    }

    .mint-popup-4 {
      width: 100%;

      .sure {
        background: #f15353;
        height: 2.5rem;
        line-height: 2.5rem;
        color: #fff;
        width: 50%;
        border: 0;
        float: left;
      }

      .close {
        background: #eee;
        height: 2.5rem;
        line-height: 2.5rem;
        color: #333;
        width: 50%;
        border: 0;
        float: left;
      }

      .address-plus {
        background: #f15353;
        height: 2.5rem;
        line-height: 2.5rem;
        color: #fff;
        width: 100%;
        border: 0;
      }

      ul {
        overflow-y: scroll;
      }

      li {
        padding: 0.625rem 0;
        display: flex;
        position: relative;

        .liia {
          flex: 9;
          text-align: left;
          padding-left: 1.25rem;

          .name {
            font-size: 18px;
            color: #222;
            line-height: 2rem;
          }

          .address {
            font-size: 12px;
            color: #666;
            line-height: 2rem;
          }
        }

        i {
          flex: 1;
        }
      }
    }

    .van-popup--bottom {
      width: 100%;

      .rentPop {
        height: 18.75rem;

        h3 {
          height: 2.0625rem;
          line-height: 2.0625rem;
          padding: 0 0.9375rem;
          font-weight: normal;
          margin-bottom: 1.875rem;
          border-bottom: 0.0625rem solid #ccc;

          span {
            color: #607d8b;
            font-size: 14px;
          }
        }

        p {
          padding: 0 0.9375rem;
          text-align: left;
        }

        button {
          position: fixed;
          bottom: 1.25rem;
          left: 50%;
          transform: translateX(-3.125rem);
          width: 6.25rem;
          height: 1.875rem;
          border-radius: 0.625rem;
          color: #fff;
          border: 0.0625rem solid #f00;
          background: #e84e40;
          outline: 0;
        }
      }
    }

    .addr {
      background: #fff;
      height: 3.75rem;
      padding: 0.625rem 0.9375rem;
      margin-top: 2.5rem;

      div.lf {
        width: 95%;

        p {
          line-height: 1.875rem;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        p.one {
          padding-left: 1.375rem;
        }

        p.two {
          i {
            padding-right: 0.25rem;
          }
        }
      }

      div.rt {
        width: 5%;
        line-height: 3.75rem;
      }
    }

    .goods-detail {
      background: #fff;

      .goods-shop {
        height: 2.1875rem;
        line-height: 2.1875rem;
        text-align: left;
        padding: 0 0.9375rem;
        border-top: 0.0625rem solid #ccc;
      }

      .detail_good {
        background: #e3e3e3;
        padding: 0.9375rem;

        .goods {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-flow: row;
          flex-flow: row;

          .img {
            width: 5rem;
            height: 5rem;
            background: #fff;
          }

          .warp {
            flex: 1;
            padding-left: 0.3125rem;
            text-align: left;

            .inner {
              width: 70%;
              float: left;

              .name {
                max-height: 3.75rem;
                overflow: hidden;
              }

              .option {
                height: 1.25rem;
                line-height: 1.25rem;
                font-size: 10px;
              }
            }

            .price {
              width: 30%;
              float: left;
              text-align: right;
            }
          }
        }
      }

      .data {
        height: 3.75rem;
        padding: 0.625rem 0.9375rem;
        border-bottom: 0.0625rem solid #ccc;

        div.lf {
          line-height: 3.75rem;
        }

        div.rt {
          text-align: right;

          h3 {
            color: #e51c23;
            font-weight: normal;
            font-size: 14px;
            padding-top: 0.25rem;
          }
        }
      }

      .send {
        overflow: hidden;
        height: 4.1875rem;
        line-height: 4.1875rem;
        padding: 0.625rem 0.9375rem;
        border-bottom: 0.0625rem solid #ccc;
      }

      .remark {
        overflow: hidden;
        height: 4.125rem;
        line-height: 2.0625rem;
        padding: 0.625rem 0.9375rem;
        border-bottom: 0.0625rem solid #ccc;

        label {
          float: left;
          width: 20%;
          padding-right: 3%;
        }

        textarea {
          width: 77%;
          height: 3.75rem;
          line-height: 1.6875rem;
          float: left;
          border-radius: 0.375rem;
          outline: 0;
          border: 0.0625rem solid #ccc;
          padding-left: 0.25rem;
          box-sizing: border-box;
        }
      }

      .money {
        overflow: hidden;
        padding-top: 0.625rem;

        p {
          line-height: 1.5625rem;
          height: 1.5625rem;
          padding: 0 0.9375rem;

          span.lf {
            b {
              color: #e51c23;
              font-weight: normal;
            }

            i {
              width: 1.0625rem;
              height: 1.0625rem;
              display: inline-block;
              background: #e51c23;
              border-radius: 50%;
              line-height: 1.0625rem;
              text-align: center;
              color: #fff;
              margin-left: 0.3125rem;
              font-style: normal;
            }
          }

          span.rt {
            color: #e51c23;
          }
        }

        p:nth-child(3) {
          padding-bottom: 0.625rem;
        }
      }
    }

    .all {
      border-bottom: 0.0625rem solid #ccc;
      padding: 0 0.9375rem;
      text-align: right;
      height: 2.0625rem;
      line-height: 2.0625rem;
      background: #fff;

      span.rt {
        color: #e51c23;
      }
    }

    .content {
      background: #fff;

      .send {
        overflow: hidden;
        height: 4.1875rem;
        line-height: 4.1875rem;
        padding: 0.625rem 0.9375rem;
        border-bottom: 0.0625rem solid #ccc;
      }

      .remark {
        overflow: hidden;
        height: 4.125rem;
        line-height: 2.0625rem;
        padding: 0.625rem 0.9375rem;
        border-bottom: 0.0625rem solid #ccc;

        label {
          float: left;
          width: 18%;
          padding-right: 3%;
          text-align: left;
        }

        textarea {
          width: 77%;
          height: 3.75rem;
          line-height: 1.6875rem;
          float: left;
          border-radius: 0.375rem;
          outline: 0;
          border: 0.0625rem solid #ccc;
          padding-left: 0.25rem;
          box-sizing: border-box;
        }
      }
    }

    .footer {
      .check {
        overflow: hidden;
        background: #fff;
        height: 2.5rem;
        line-height: 2.5rem;
        margin: 0.625rem 0;
        text-align: left;
        padding: 0 0.9375rem;

        b {
          color: #e51c23;
          font-weight: normal;
        }
      }

      .sub {
        overflow: hidden;
        background: #fff;
        height: 2.8125rem;
        line-height: 2.5rem;
        padding: 0 0 0 0.9375rem;

        b {
          color: #e51c23;
          font-weight: normal;
        }

        button {
          width: 33%;
          height: 100%;
          background: #dd2727;
          color: #fff;
          border: 0;
          outline: 0;
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

    .alert {
      position: fixed;
      left: 10%;
      bottom: 6.25rem;
      width: 80%;
      height: 2.8125rem;
      text-align: center;
      line-height: 2.8125rem;
      background: #e84e40;
      color: #fff;
      border-radius: 0.625rem;
      border: 0.0625rem solid #f00;

      i {
        padding-right: 0.375rem;
      }
    }

    .address_addnav {
      width: 100%;
      padding: 0 3% 0 6% !important;
      position: fixed;
      bottom: 0;
      left: 0;
      background: #f15353 !important;
      color: #fff !important;
      text-align: center;
      height: 2.75rem !important;
      line-height: 2.75rem !important;
    }

    #AllGood {
      position: fixed;
      top: 200vh;
      height: 100vh;
      overflow: scroll;
      width: 100%;
      background: #fff;
      z-index: 100;
      transition: 0.6s ease-out;
      display: block;

      #appendAddress .mint-field .mint-cell-title {
        text-align: left;
      }

      .address_addnav,
      header {
        display: none;
      }

      .address_addnav span {
        color: #fff;
      }

      .address_addnav i {
        color: #fff;
        font-size: 22px;
        position: absolute;
        top: 50%;
        height: 1.125rem;
        line-height: 1.125rem;
        margin-left: -2.125rem;
        margin-top: -0.5625rem;
      }

      .maleall {
        background: #fff;
        text-align: left;
      }

      #appendAddress .males {
        line-height: 3.125rem;
        display: flex;
        border-top: 0.0625rem solid #d9d9d9;
        margin-left: 0.625rem;
        padding-right: 0.625rem;
        position: relative;

        .address {
          display: inline-block;
          position: relative;
          width: 70%;
          float: right;
          box-sizing: border-box;
          padding-top: 0.5rem;
        }
      }

      .maleall span {
        color: #333;
        font-size: 16px;
        vertical-align: middle;
        width: 6.5625rem;
        -webkit-box-flex: 0;
        -ms-flex: none;
        flex: none;
        display: inline-block;
        line-height: 3.125rem;
      }

      #appendAddress .maleall .males .address {
        position: absolute !important;
        right: 1.25rem !important;
        top: 0;
      }

      .maleall .el-select {
        width: 65%;
        float: right;
        position: relative;
      }

      #address {
        flex: 1;
        line-height: 3.125rem;

        .mint-button--default {
          line-height: 3.125rem;
          text-align: left;
          font-size: 16px;
        }
      }
    }
  }

  .van-nav-bar,
  /deep/ .van-nav-bar__content {
    height: 40px;
  }

  /deep/ .van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/ .van-nav-bar .van-icon {
    color: #666;
  }

  /deep/ .van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
  }

  #appendAddress {
    .van-cell {
      padding: 10px;
      font-size: 16px;

      /deep/ .van-field__label {
        white-space: nowrap;
        color: #333;
        margin-right: 0;
      }

      /deep/ input::placeholder {
        color: #555;
      }
    }

    /deep/ .van-switch {
      float: right;
      top: 0.3rem;
    }
  }

</style>
