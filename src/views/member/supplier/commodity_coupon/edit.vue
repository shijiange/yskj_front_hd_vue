<template>
  <div id="coupon_edit"
       :class="[this.fun.getPhoneEnv() == 3?'pcStyle':''] ">
    <van-popup v-model="taponew" position="bottom" :style="{ width: '100vw' }" :overlay="false">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        title="选择完整时间"
        :min-date="minDate"
        @cancel="taponew = false"
				@confirm="taponewSet"
      />
    </van-popup>
    <van-popup v-model="taptwow" position="bottom" :style="{ width: '100vw' }" :overlay="false">
      <van-datetime-picker
        v-model="currentDate2"
        type="datetime"
        title="选择完整时间"
        :min-date="minDate"
        @cancel="taponew = false"
				@confirm="taptwowSet"
      />
    </van-popup>
    <c-title :hide="false"
             :text="headTitles"></c-title>
    <div class="content">
      <div class="coupon_open">
        <h1>优惠券</h1>
        <ul class="list">
          <li>
            <span>排序</span>
            <input type="text"
                   placeholder="请输入优惠券排序"
                   v-model="display_order"
                   @blur="clearSrcoll()">
          </li>
          <li>
            <span>名称</span>
            <input type="text"
                   placeholder="请输入优惠券名称"
                   v-model="name"
                   @blur="clearSrcoll()">
          </li>
          <li>
            <span>是否开启</span>
            <van-radio-group v-model="status" checked-color="#f15353">
              <van-radio :name="1">开启</van-radio>
              <van-radio :name="0">不开启</van-radio>
            </van-radio-group>
          </li>
        </ul>
      </div>
      <div class="coupon_condition">
        <h1>使用条件</h1>
        <ul class="list">
          <li>
            <span>订单金额</span>
            <input type="text"
                   placeholder="消费满多少金额才可以使用该优惠券"
                   v-model="enough"
                   @blur="clearSrcoll()">
          </li>
          <li class="member-level">
            <span>会员等级</span>
            <input type="text"
                   @click="show1 = true"
                   readonly
                   placeholder="选择会员等级"
                   :value="chooseVip">
            <i class="fa fa-angle-right"></i>
          </li>
          <li>
            <span>使用时间限制</span>
            <van-radio-group v-model="time_limit" checked-color="#f15353">
              <van-radio :name="0">有效天数</van-radio>
              <van-radio :name="1">日期</van-radio>
            </van-radio-group>
          </li>
          <li v-if="time_limit===0">
            <span>有效期</span>
            <input type="text"
                   placeholder="0为不限时间"
                   v-model="time_days"
                   @blur="clearSrcoll()">
          </li>
          <li v-if="time_limit===1"
              class="timeLimitOne" @click="taponew = true">
            <span>开始时间</span>
            <div class="right">{{time_start}}</div>
            <i class="fa fa-angle-right"></i>
          </li>
          <li v-if="time_limit===1" @click="taptwow = true"
              class="timeLimitTwo">
            <span>结束时间</span>
            <div class="right">{{time_end}}</div>
            <i class="fa fa-angle-right"></i>
          </li>
          <li>
            <span>使用方式</span>
            <van-radio-group v-model="is_complex" checked-color="#f15353">
              <van-radio :name="0">单张使用</van-radio>
              <van-radio :name="1">多张一起使用</van-radio>
            </van-radio-group>
          </li>
          <li>
            <span>优惠方式</span>
            <van-radio-group v-model="coupon_method" checked-color="#f15353">
              <van-radio :name="1">立减</van-radio>
              <van-radio :name="2">打折</van-radio>
            </van-radio-group>
          </li>
          <li class="sum"
              v-if="coupon_method===1">
            <div class="box">
              立减
              <input type="text"
                     placeholder="请输入金额"
                     v-model="deduct"
                     @blur="clearSrcoll()">元
            </div>
          </li>
          <li class="sum"
              v-if="coupon_method===2">
            <div class="box">
              打折
              <input type="text"
                     placeholder="请输入范围"
                     v-model="discount"
                     @blur="clearSrcoll()">折
            </div>
          </li>
          <li>
            <span>使用范围</span>
            <van-radio-group v-model="use_type" checked-color="#f15353" >
              <van-radio :name="5" style="margin-top: 5px; margin-bottom: 5px;">全类适用</van-radio>
              <van-radio :name="1" style="margin-bottom: 5px;">指定分类适用</van-radio>
              <van-radio :name="2" style="margin-bottom: 5px;">指定商品</van-radio>
            </van-radio-group>
          </li>
          <li class="range">
            <span></span>
            <button type="button"
                    v-if="use_type==1"
                    @click="inniClassify()">
              <i class="iconfont icon-life-game-plus"></i>添加分类
            </button>
            <button type="button"
                    v-if="use_type==2"
                    @click="inniGoods()">
              <i class="iconfont icon-life-game-plus"></i>添加商品
            </button>
          </li>
          <li class="fenleisort"
              v-if="fenleirange.length>0&&use_type===1&&Id==='abc'">
            <span>添加的分类</span>
            <div class="item">
              <p v-for="(item,index) in fenleirange"
                 :key="index"><span class="name">{{item.name}}</span><span class="delete"
                      @click="classifyDelete(item)">X</span></p>
            </div>
          </li>
          <li class="fenleisort"
              v-if="category.length>0&&use_type===1&&Id!='abc'">
            <span>添加的分类</span>
            <div class="item">
              <p v-for="(item,index) in category"
                 :key="index"><span class="name">{{item.name}}</span><span class="delete"
                      @click="classifyDDelete(item)">X</span></p>
            </div>
          </li>
          <li class="goodssort"
              v-if="goodsrange.length>0&&use_type===2&&Id==='abc'">
            <span>添加的商品</span>
            <div class="item">
              <p v-for="(item,index) in goodsrange"
                 :key="index"><span class="name">{{item.title}}</span><span class="delete"
                      @click="goodsDelete(item)">X</span></p>
            </div>
          </li>
          <li class="goodssort"
              v-if="goods.length>0&&use_type===2&&Id!='abc'">
            <span>添加的商品</span>
            <div class="item">
              <p v-for="(item,index) in goods"
                 :key="index"><span class="name">{{item.title}}</span><span class="delete"
                      @click="goodsDDelete(item)">X</span></p>
            </div>
          </li>
        </ul>
      </div>
      <div class="coupon_receive">
        <h1>领取发放</h1>
        <ul class="list">
          <li>
            <span>可否领取</span>
            <van-radio-group v-model="get_type" checked-color="#f15353">
              <van-radio :name="1">可以</van-radio>
              <van-radio :name="0">不可以</van-radio>
            </van-radio-group>
          </li>
          <li v-if="get_type===1">
            <span>限领张数</span>
            <input type="text" style="text-align: right;"
                   placeholder="1"
                   v-model="get_max"
                   @blur="clearSrcoll()">
          </li>
          <li>
            <span>发放总数</span>
            <input type="text" style="text-align: right;"
                   placeholder="1"
                   v-model="total"
                   @blur="clearSrcoll()">
          </li>
          <li>
            <span>每人每日限领</span>
            <input type="text" style="text-align: right;"
                   placeholder=""
                   v-model="onceTotal"
                   @blur="clearSrcoll()">
          </li>
        </ul>
      </div>
      <van-popup v-model="show1"
                 position="bottom"
                 v-if="show1===true"
                 class="fenlei">
        <div class="select_box">
          <div class="title">
            <h2>选择会员等级</h2>
            <i class="iconfont icon-guanbi"
               @click="close()"></i>
          </div>
          <div class="list">
            <van-radio-group v-model="level_limit"  checked-color="#f15353">
              <van-radio :name="-1" style="padding: 0.5rem;">所有会员</van-radio>
              <van-radio v-for="(item,index) in Vip"
                         style="padding: 0.5rem;"
                         :key="index"
                         :name="item.id">会员{{item.level_name}}</van-radio>
            </van-radio-group>
          </div>
          <div class="select_btn"
               @click="finish()">
            <button type="button">完成</button>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="show2"
                 position="bottom"
                 v-if="show2===true"
                 class="fenlei">
        <div class="selectBox">
          <div class="title">
            <h2>添加分类</h2>
            <i class="iconfont icon-guanbi"
               @click="closeClassify()"></i>
          </div>
          <div>
            <div class="input">
              <div class="classify">
                <input type="text"
                       class="sousuo"
                       v-model="keyword"
                       @blur="clearSrcoll()">
              </div>
              <span class="classify_span"
                    @click="ClassifySousuo()"
                    v-if="use_type===1&& Id === 'abc'">搜索</span>
              <span class="classify_span"
                    @click="categorySousuo()"
                    v-if="use_type===1&& Id != 'abc' ">搜索</span>
            </div>
          </div>
          <div class="list">
            <van-checkbox-group v-model="fenleiSelect">
              <van-checkbox v-for="(item,index) in sousuoInfo"
                            :key="index"
                            :name="item"
                            checked-color="#f15353">{{ item.name }}</van-checkbox>
            </van-checkbox-group>
          </div>
          <div class="select_btn"
               @click="finishClassify()"
               v-if="Id==='abc'">
            <button type="button">确定</button>
          </div>
          <div class="select_btn"
               @click="finishcategory()"
               v-if="Id!=='abc'">
            <button type="button">确定</button>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="show3"
                 position="bottom"
                 v-if="show3===true"
                 class="fenlei">
        <div class="selectBox">
          <div class="title">
            <h2>添加商品</h2>
            <i class="iconfont icon-guanbi"
               @click="closeGoods()"></i>
          </div>
          <div>
            <div class="input">
              <div class="classify">
                <input type="text"
                       class="sousuo"
                       v-model="goodsKeyword"
                       @blur="clearSrcoll()">
              </div>
              <span class="classify_span"
                    @click="goodsousuo()"
                    v-if="use_type===2&&Id==='abc'">搜索</span>
              <span class="classify_span"
                    @click="goodSousuo()"
                    v-if="use_type===2&&Id!='abc'">搜索</span>
            </div>
          </div>
          <div class="list">
            <van-checkbox-group v-model="goodsSelect">
              <van-checkbox v-for="(item,index) in goodsSousuo"
                            :key="index"
                            :name="item"
                            checked-color="#f15353">{{ item.title }}</van-checkbox>
            </van-checkbox-group>
          </div>
          <div class="select_btn"
               @click="finishGoods()"
               v-if="Id==='abc'">
            <button type="button">确定</button>
          </div>
          <div class="select_btn"
               @click="finishgoods()"
               v-if="Id!=='abc'">
            <button type="button">确定</button>
          </div>
        </div>
      </van-popup>
    </div>
    <div id="btn">
      <button type="button"
              v-if="Id==='abc'"
              @click="publishInfo()">确认发布</button>
      <button type="button"
              v-else
              @click="editInfo()">确认编辑</button>
    </div>
  </div>
</template>

<script>
import edit_controller from "./edit_controller";

export default edit_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#coupon_edit {
  overflow: scroll;
  -webkit-overflow-scrolling: touch; /* 解决ios滑动不流畅问题 */
  .content {
    .coupon_open {
      background: #fff;
      padding: 0.625rem 0;

      h1 {
        font-size: 16px;
        line-height: 1.875rem;
        text-align: left;
        padding: 0 0.625rem;
      }

      .list {
        padding: 0 0.875rem;

        li {
          display: flex;
          line-height: 2.5rem;
          font-size: 15px;

          span {
            width: 6.25rem;
            text-align: left;
          }

          input {
            border: none;
            width: 15rem;
          }
        }
      }
    }

    .coupon_condition {
      margin-top: 0.625rem;
      background: #fff;
      padding: 0.625rem 0;

      h1 {
        font-size: 16px;
        line-height: 1.875rem;
        text-align: left;
        padding: 0 0.625rem;
      }

      .list {
        padding: 0 0.875rem;

        .timeLimitOne {
          position: relative;
        }

        .timeLimitTwo {
          position: relative;
        }

        .member-level {
          position: relative;
        }

        li {
          display: flex;
          line-height: 2.5rem;
          font-size: 15px;

          span {
            width: 6.25rem;
            text-align: left;
          }

          input {
            border: none;
            width: 15rem;
          }

          .fa {
            position: absolute;
            right: 0.875rem;
            color: #c9c9c9;
            font-size: 18px;
            line-height: 2.5rem;
          }
        }

        .sum {
          align-items: center;
          justify-content: flex-end;

          .box {
            width: 15rem;
            height: 1.875rem;
            background: #f5f5f5;
            border: solid 0.0625rem #ebebeb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.625rem;
            border-radius: 0.25rem;

            input {
              height: 1.75rem;
              width: 8.75rem;
              background: #fff;
              padding: 0 0.625rem;
              border-left: solid 0.0625rem #ebebeb;
              border-right: solid 0.0625rem #ebebeb;
            }
          }
        }

        .range {
          align-items: center;

          button {
            width: 6.25rem;
            justify-content: center;
            align-items: center;
            background: #f15353;
            border: none;
            border-radius: 0.25rem;
            color: #fff;
            display: flex;
            margin-bottom: 15px;

            i {
              font-size: 1rem;
              color: #fff;
              margin-right: 0.25rem;
            }
          }
        }

        .fenleisort {
          display: flex;
          align-items: center;

          .item {
            width: 240px;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            justify-content: space-between;

            p {
              width: 100%;
              color: #fff;
              margin-top: 15px;
              display: flex;
              align-items: center;
              padding: 10px;
              justify-content: space-between;
              border-radius: 0.25rem;
              height: 1.875rem;
              background-color: #f15353;
              margin-right: 10px;

              .delete {
                width: 10px;
                margin-left: 5px;
              }

              .name {
                width: 180px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }

            p:nth-child(2) {
              margin-top: 15px;
              margin-bottom: 0;
            }

            p:first-child {
              margin-top: 0;
            }
          }
        }

        .goodssort {
          display: flex;
          align-items: center;
          margin-top: 10px;

          .item {
            width: 240px;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            justify-content: space-between;

            p {
              width: 100%;
              color: #fff;
              margin-top: 15px;
              display: flex;
              align-items: center;
              padding: 10px;
              justify-content: space-between;
              border-radius: 0.25rem;
              height: 1.875rem;
              background-color: #f15353;
              margin-right: 10px;

              .delete {
                width: 10px;
                margin-left: 5px;
              }

              .name {
                width: 180px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }

            p:nth-child(2) {
              margin-top: 15px;
              margin-bottom: 0;
            }

            p:first-child {
              margin-top: 0;
            }
          }
        }
      }
    }

    .coupon_receive {
      background: #fff;
      padding: 0.625rem 0;
      margin-top: 0.625rem;

      h1 {
        font-size: 16px;
        line-height: 1.875rem;
        text-align: left;
        padding: 0 0.625rem;
      }

      .list {
        padding: 0 0.875rem;

        li {
          display: flex;
          line-height: 2.5rem;
          font-size: 15px;

          span {
            width: 6.25rem;
            text-align: left;
          }

          input {
            border: none;
            width: 15rem;
          }
        }
      }
    }
  }

  .member_list_popup {
    background: #fff;
    padding-top: 3.125rem;
    width: 100%;

    .title {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3.125rem;
      line-height: 3.125rem;
      text-align: center;
      font-size: 16px;
      display: flex;
      justify-content: center;
      border-bottom: solid 0.0625rem #ebebeb;

      i {
        position: absolute;
        right: 0.625rem;
        font-size: 1rem;
        color: #c9c9c9;
      }
    }

    .list {
      padding-left: 0.875rem;

      li {
        line-height: 2.875rem;
        text-align: left;
        border-bottom: solid 0.0625rem #ebebeb;
        font-size: 15px;
      }
    }
  }

  #btn {
    background-color: #fff;
    width: 100%;
    border-top: solid 0.0625rem #ebebeb;
    padding: 0 0.875rem;
    margin-top: 1.25rem;

    button {
      height: 2.5rem;
      line-height: 2.5rem;
      border-radius: 0.1875rem;
      margin: 0.375rem 0;
      width: 100%;
      color: #fff;
      font-size: 16px;
      border: none;
      background-color: #f15353;
    }
  }

  .select_box {
    background: #fff;
    width: 100%;
    padding-bottom: 60px;

    .title {
      width: 100%;
      height: 3.125rem;
      line-height: 3.125rem;
      text-align: center;
      font-size: 16px;
      display: flex;
      justify-content: center;
      border-bottom: solid 0.0625rem #ebebeb;

      i {
        position: absolute;
        right: 0.625rem;
        font-size: 1rem;
        color: #c9c9c9;
      }
    }

    .list {
      position: fixed;
      left: 0;
      top: 3.5rem;
      bottom: 3.7rem;
      width: 100%;
      overflow: scroll;

      .van-checkbox-group {
        .van-checkbox {
          padding-left: 20px;
          line-height: 2.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 15px;
          width: 100%;
          text-align: left;
        }
      }

      .van-radio-group .van-radio:last-child {
        border-bottom: none;
      }

      .van-radio-group {
        width: 100%;

        .van-radio {
          padding-left: 20px;
          line-height: 2.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 15px;
          width: 100%;
        }
      }
    }

    .select_btn {
      background-color: #fff;
      position: absolute;
      width: 100%;
      padding: 0.375rem 0.875rem;
      bottom: 0;
      border-top: solid 0.0625rem #ebebeb;

      button {
        margin: 0 auto;
        width: 100%;
        height: 2.5rem;
        background: #f15353;
        border-radius: 0.1875rem;
        color: #fff;
        border: none;
        font-size: 16px;
      }
    }
  }

  .selectBox {
    width: 100%;
    padding-bottom: 60px;

    .title {
      width: 100%;
      height: 3.125rem;
      line-height: 3.125rem;
      text-align: center;
      font-size: 16px;
      display: flex;
      justify-content: center;
      border-bottom: solid 0.0625rem #ebebeb;

      i {
        position: absolute;
        right: 0.625rem;
        font-size: 1rem;
        color: #c9c9c9;
      }
    }

    .list {
      position: fixed;
      left: 0;
      top: 6.5rem;
      bottom: 3.7rem;
      width: 100%;
      overflow: scroll;

      .van-checkbox-group {
        width: 100%;

        .van-checkbox {
          padding-left: 20px;
          line-height: 2.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 15px;
          width: 100%;
          text-align: left;
        }
      }

      .van-checkbox-group .van-checkbox:last-child {
        border-bottom: none;
      }

      .van-radio-group {
        width: 100%;

        .van-radio {
          padding-left: 20px;
          line-height: 2.875rem;
          border-bottom: solid 0.0625rem #ebebeb;
          font-size: 15px;
          width: 100%;
        }
      }
    }

    .select_btn {
      background-color: #fff;
      position: absolute;
      width: 100%;
      height: 3.2rem;
      padding: 0.375rem 0.875rem;
      bottom: 0;
      border-top: solid 0.0625rem #ebebeb;

      button {
        margin: 0 auto;
        width: 100%;
        height: 2.5rem;
        background: #f15353;
        border-radius: 0.1875rem;
        color: #fff;
        border: none;
        font-size: 16px;
      }
    }

    .input {
      background-color: #fff;
      height: 2.5rem;
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: 20px;
      margin-top: 15px;

      .classify {
        width: 80%;
        height: 30px;
        border: solid 1px #ccc;
        border-radius: 3px;
        display: inline-block;
        overflow: hidden;

        .sousuo {
          padding-left: 20px;
          border: none;
          height: 30px;
          width: 100%;
        }
      }

      .classify_span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 30px;
        background-color: whitesmoke;
        border-radius: 3px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }

  .fenlei {
    position: absolute;
    top: 0;
    // // margin-top: 40px;
    // bottom:0!important;
    width: 100%;
    z-index: 9999;
  }
}

#coupon_edit.pcStyle .fenlei {
  width: 375px;
}
</style>
