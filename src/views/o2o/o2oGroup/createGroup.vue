<!-- 创建拼团活动 -->
<template>
  <div id="createGroup">
    <div v-show="step == 1">
      <c-title :hide="false" :text="titleText"></c-title>
      <van-cell-group>
        <van-field required v-model="form.title" input-align="right" label="活动标题" placeholder="请输入活动标题" />
        <van-field required v-model="has_one_goods.title" :disabled="disableds" label="活动商品" placeholder="请选择活动商品" input-align="right" is-link readonly @click="getCategoryOne" />
      </van-cell-group>
      <div class="upload-img-box" v-if="has_one_goods.title">
        <div class="selest-goods">
          <img :src="has_one_goods.thumb" alt="" />
          <div class="goods-right">
            <div class="g-titles" style="font-size: 0.875rem;">{{ has_one_goods.title }}</div>
            <div class="g-titles">库存：{{ has_one_goods.stock }}</div>
            <div class="g-titles">价格：{{ $i18n.t("money") }}{{ has_one_goods.price }}</div>
          </div>
        </div>
      </div>
      <van-field required v-model="start_time" :disabled="disableds" label="开始时间" placeholder="请选择开始时间" input-align="right" is-link readonly @click="showTime(1)" />
      <van-field v-model="end_time" :disabled="disableds" @click="showTime(2)" label="结束时间" placeholder="请选择结束时间" input-align="right" is-link readonly />
      <div class="text">
        PS:结束时间可不填，若不填商品详情页也不展示结束时间；不填则活动不会自动结束，需手动结束！
      </div>

      <div class="level-box">
        <div class="big-titel">
          <div>拼团层级</div>
          <div class="btn-class bg-color add-margin" @click="addTier" v-if="!disableds">+ 新增一个拼团层级</div>
          <div class="small-text">最多可设置3个阶梯</div>
        </div>
        <div class="add-level">
          <div class="add-level-title">
            <div class="w20">层级</div>
            <div class="w30">拼团人数</div>
            <div class="w30">拼团时间</div>
            <div class="w20">操作</div>
          </div>
          <div class="edit-level">
            <!-- <div class="small-text no-blank">暂无数据</div> -->
            <div class="level-edit" v-for="(item, i) in form.has_many_level" :key="i">
              <div class="w20">{{ item.level_num }}</div>
              <div class="w30"><input type="number" :disabled="disableds" v-model="item.member_num" :class="[disableds ? 'disableds-input' : '']" />人</div>
              <div class="w30"><input type="number" v-model="item.expire_in" />小时</div>
              <div class="w20 del-color" v-if="!disableds" @click="delTier(i)">删除</div>
            </div>
          </div>
        </div>
      </div>

      <van-field name="checkbox" label="展示设置">
        <template #input>
          <van-checkbox checked-color="#ee0a24" v-model="form.menu_show" shape="square" icon-size="18px">隐藏开关 <i class="iconfont icon-ht_tips" @click.stop="showTextPopup"></i></van-checkbox>
        </template>
      </van-field>
      <div v-if="form.menu_show" class="file-diystyle">当可参的团数达到<van-field v-if="form.menu_show" v-model="form.hide_num" label="" placeholder="" />时，隐藏开团按钮</div>
      <van-field name="checkbox" label="团长福利">
        <template #input>
          <van-checkbox checked-color="#ee0a24" v-model="form.is_coupon" shape="square" icon-size="18px">团长送优惠券 </van-checkbox>
        </template>
      </van-field>
      <!--团长福利 团长送优惠券 -->
      <div class="coupon-box" v-if="form.is_coupon">
        <div class="select-btn btn-class bg-color" v-if="form.is_coupon" @click="openCoupon">+ 选择优惠券</div>
        <div class="coupon-list">
          <div class="coupon-child" v-for="(item, i) in form.coupon" :key="i">
            <div class="coupon-name">{{ item.name }}</div>
            <div class="coupon-num">赠送 <input type="number" v-model="item.coupon_num" /> 张</div>
            <div class="coupon-del del-color" @click="delCoupon(i)">删除</div>
          </div>
        </div>
      </div>
      <!-- ------------end--------------- -->
      <van-field name="checkbox" label="老拉新">
        <template #input>
          <van-checkbox checked-color="#ee0a24" v-model="form.is_lead" shape="square" icon-size="18px">开启老拉新 <i class="iconfont icon-ht_tips" @click.stop="showTextPopup1"></i></van-checkbox>
        </template>
      </van-field>
      <van-field v-if="!form.is_lead" v-model="form.setting" label="拼团设置" placeholder="每人最多参加几次不同的团" />
      <!-- ------------end--------------- -->
      <div class="big-titel" style="padding: 0 0.938rem;">活动分享</div>
      <div class="share-config">
        <div class="config-title">标题</div>
        <div class="config-content">
          <van-field v-model="form.share_title" rows="2" autosize ref="share_title" type="textarea" placeholder="原价￥《商品最高价》，现价￥《商品最低价》起，参加《拼团活动名称》即可享受" />
        </div>
        <div class="add-confid">
          <div>点击添加数据</div>
          <div class="add-btn">
            <div class="btn-class" v-for="(item, index) in keywords.share_title" :key="index" @click="addContent('share_title', index, 1)">{{ item }}</div>
          </div>
        </div>
        <!-- ------------end--------------- -->
        <div class="config-title">商家说明</div>
        <div class="config-content">
          <van-field v-model="form.share_content" rows="2" ref="share_content" autosize type="textarea" placeholder="活动商品数量有限，先到先得" />
        </div>
        <div class="add-confid">
          <div>点击添加数据</div>
          <div class="add-btn">
            <div class="btn-class" v-for="(item, index) in keywords.share_content" :key="index" @click="addContent('share_content', index, 2)">{{ item }}</div>
          </div>
        </div>
        <!-- ------------end--------------- -->
        <div class="big-titel" style="padding: 0;">活动详情分享</div>
        <div class="config-title">标题</div>
        <div class="config-content">
          <van-field v-model="form.desc_title" rows="2" autosize ref="desc_title" type="textarea" placeholder="我已经参加了《团长名称》发起的拼团" />
        </div>
        <div class="add-confid">
          <div>点击添加数据</div>
          <div class="add-btn">
            <div class="btn-class" v-for="(item, index) in keywords.desc_title" :key="index" @click="addContent('desc_title', index, 3)">{{ item }}</div>
          </div>
        </div>
        <!-- ------------end--------------- -->
        <div class="config-title">商家说明</div>
        <div class="config-content">
          <van-field v-model="form.desc_content" rows="2" ref="desc_content" autosize type="textarea" placeholder="满足《拼团人数》人即可享受拼团优惠，我已经参加，你也来吧。" />
        </div>
        <div class="add-confid">
          <div>点击添加数据</div>
          <div class="add-btn">
            <div class="btn-class" v-for="(item, index) in keywords.desc_content" :key="index" @click="addContent('desc_content', index, 4)">{{ item }}</div>
          </div>
        </div>
        <!-- ------------end--------------- -->
        <div class="next-btn" @click="next">下一步</div>
      </div>
    </div>
    <!-- ------------end--------------- -->
    <!-- <van-popup v-model="show" position="right" :style="{ height: '100%', width: '100%' }"> -->
    <!-- 第二页start -->
    <div id="groupDataStatistics" v-show="step == 2">
      <van-nav-bar title="设置拼团价" />
      <van-sticky>
        <div class="list line">
          <div class="list-small">规格</div>
          <div class="list-small">原价(元)</div>
          <div class="list-big">拼团价格</div>
          <div class="list-big">活动库存</div>
          <div class="list-big">限购件数(0为不限购)</div>
        </div>
      </van-sticky>
      <div class="list-main">
        <div class="list " v-for="(item, index) in form.has_many_options" :key="index">
          <div class="list-small">{{ item.option_title }}</div>
          <div class="list-small">{{ item.option_price }}</div>
          <div class="list-big">
            <div class="list-child" v-for="(item1, index1) in item.has_many_option_level" :key="index1">
              <div class="list-child-margin">{{ item1.member_num }}人团 <input type="number" v-model="item1.group_price" /> 元</div>
            </div>
          </div>
          <div class="list-big">
            <div class="list-child">
              <div class="list-child-margin"><input type="number" v-model="item.stock" /></div>
            </div>
          </div>
          <div class="list-big">
            <div class="list-child">
              <div class="list-child-margin"><input type="number" v-model="item.buy_limit" /></div>
            </div>
          </div>
        </div>
      </div>
      <div class="next-btn-box">
        <div class="next-btn" @click="last" style="background: #fff; color: #666; border: 1px solid #ececec;">上一步</div>
        <div class="next-btn" @click="submitForm('form')">保存</div>
      </div>
    </div>
    <!-- </van-popup> -->
    <van-popup v-model="showSearchGood" class="search-good-class" position="bottom" :style="{ height: '80%', width: '100%' }">
      <van-nav-bar title="选择您的商品" right-text="关闭" @click-right="showSearchGood = false" />
      <div class="searchgood-top">
        <!-- <div class="big-title">选择您的商品</div> -->
        <van-search v-model="kwd" shape="round" show-action placeholder="请输入标题" @search="getChildCate">
          <template #action>
            <div @click="getChildCate">搜索</div>
          </template>
        </van-search>
        <van-dropdown-menu class="classic">
          <van-dropdown-item v-model="category1" :disabled="category1_disabled" :options="categoryOption1" @change="selectCate1" />
          <van-dropdown-item v-model="category2" :disabled="category2_disabled" :options="categoryOption2" ref="categoryShow2" @change="selectCate2" />
        </van-dropdown-menu>
      </div>
      <van-radio-group v-model="goodradio" class="search-goodlist">
        <van-cell-group>
          <van-cell clickable @click="clickGoodRadio(item)" class="goodchild" v-for="(item, i) in listOne" :key="i">
            <template #title>
              <van-radio :name="item" :disabled="item.has_many_activity_goods_count >= 1 ? true : false" checked-color="#ee0a24" />
              <div class="search-goodlist-main">
                <img :src="item.thumb" alt="" />
                <div class="search-goodlist-main-right">
                  <div class="good-title">{{ item.title }}</div>
                  <div class="good-other">
                    <div style="color: #ff2c29;">ID：{{ item.id }}</div>
                    <div style="color: #666;">库存：{{ item.stock }}</div>
                  </div>
                  <div class="good-price">{{ $i18n.t("money") }}{{ item.price }}</div>
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <div class="good-more-btn" v-if="isLoadMore" @click="getMores">加载更多</div>
    </van-popup>
    <van-popup v-model="showStartTime" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker v-model="currentStartTime" type="datetime" title="选择开始时间" :min-date="minDate" @cancel="showStartTime = false" @confirm="confirmStartTime" />
    </van-popup>
    <van-popup v-model="showEndTime" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker v-model="currentEndTime" type="datetime" cancel-button-text="重置" title="选择结束时间" :min-date="minDate" @cancel="cancelEndtTime" @confirm="confirmEndtTime" />
    </van-popup>
    <van-popup v-model="coupon_show" position="bottom" :close-on-click-overlay="false" :style="{ height: '80%', width: '100%' }">
      <van-nav-bar title="选择优惠券" right-text="确定" @click-right="onCloneCoupon" />
      <div class="coupon_list">
        <van-search v-model="coupon_keyword" shape="round" show-action placeholder="请输入标题" @search="searchCoupon">
          <template #action>
            <div @click="searchCoupon">搜索</div>
          </template>
        </van-search>
        <van-checkbox-group v-model="coupon_result">
          <van-checkbox :name="i" @click="chooseCoupon(item, i)" v-for="(item, i) in coupon_list" :key="i">
            <div class="shopCoupon">
              <div class="shopCouponNew">
                <div class="left">
                  <div class="postLeft" :style="{ backgroundImage: `url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponsbg_1.png)` }">
                    <template v-if="item.coupon_method == 1">
                      <span class="textOne" :style="{ fontSize: item.deduct.length > 5 ? '0.7rem' : '' }"> {{ $i18n.t("money") }}{{ item.deduct }} </span>
                      <div class="line"></div>
                      <span class="textTwo">满{{ item.enough }}可用</span>
                    </template>
                    <template v-if="item.coupon_method == 2">
                      <span class="textOne">{{ item.discount }}折</span>
                      <div class="line"></div>
                      <span class="textTwo">满{{ item.enough }}立享</span>
                    </template>
                  </div>
                </div>
                <div class="right">
                  <div class="coupon_name">{{ item.name }}</div>
                  <div class="coupon_total">剩余数量：{{ item.total - item.enough > 0 ? item.total - item.enough : 0 }}</div>
                </div>
              </div>
            </div>
          </van-checkbox>
        </van-checkbox-group>
        <div style="color: #666;" v-if="coupon_list.length == 0">没有符合条件的优惠券 ~</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import createGroup_controller from "./createGroup_controller";
export default createGroup_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#createGroup {
  padding: 0 0 80px;

  .upload-img-box {
    padding: 0.625rem;
    display: flex;
    background: #fff;
    border-bottom: 1px solid #f5f5f5;

    .selest-goods {
      display: flex;
      width: 100%;

      img {
        width: 3.875rem;
        height: 3.875rem;
        margin: 0 0.875rem 0 0;
      }

      .goods-right {
        flex: 1;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;

        .g-titles {
          font-size: 0.75rem;
          color: #666;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }
    }
  }

  .search-good-class {
    display: flex;
    flex-direction: column;

    /deep/.van-dropdown-menu__bar {
      box-shadow: none;
      border-bottom: 1px solid #f7f8fa;
      height: 36px;
    }

    .classic {
      background: #fff;
    }

    .big-title {
      font-size: 1.25rem;
      color: #000;
      font-weight: bold;
      text-align: left;
      padding: 0.875rem 0.875rem 0;
    }

    .search-goodlist {
      text-align: left;
      flex: 1;
      overflow: scroll;

      /deep/.van-cell__title {
        display: flex;

        .search-goodlist-title {
          flex: 1;
          margin-left: 0.875rem;
        }
      }

      .search-goodlist-main-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .search-goodlist-main {
        display: flex;
        flex: 1;
        margin-left: 0.875rem;

        img {
          width: 6.25rem;
          height: 6.25rem;
          margin: 0 0.875rem 0 0;
          border-radius: 0.5rem;
        }

        .good-title {
          line-height: 1.25rem;
          color: #000;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .good-other {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .good-price {
          color: #ff2c29;
          font-weight: bold;
        }
      }
    }
  }

  .file-diystyle {
    display: flex;
    background: #fff;
    align-items: center;
    line-height: 24px;
    padding: 10px 16px;
    color: #646566;

    /deep/.van-cell {
      width: 5rem;
      padding: 0 8px;
      margin: 0 8px;
      background: #dedede;
    }
  }

  .coupon_list {
    .shopCoupon {
      margin: 0.5rem 0.88rem;
      width: 19.66rem;
      box-shadow: 0.03rem 0.12rem 0.44rem 0.2rem rgba(81, 81, 81, 0.52);
      position: relative;
      margin-bottom: 1rem;

      .shopCouponNew {
        width: 19.66rem;
        height: 6.75rem;
        display: flex;

        .left {
          width: 8.25rem;
          height: 6.75rem;
          position: relative;

          .postLeft {
            position: absolute;
            right: 16px;
            top: 0;
            width: 8.28rem;
            height: 6.81rem;
            background-repeat: no-repeat;
            background-size: cover;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            // background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponsbg_1.png');
            .line {
              width: 6.375rem;
              border: dashed 0.043rem #f5f5f5;
              margin-left: 0.6rem;
            }

            .Chapter_number {
              font-size: 0.6rem;
              color: #fff;
              position: absolute;
              top: 0.36rem;
              left: 0.6rem;
              width: 2rem;
              text-align: center;
            }

            .textOne {
              font-size: 1.63rem;
              color: #fff;
              margin-top: 0.8rem;
              // margin-left: 0.6rem;
              margin-bottom: 0.6rem;
              word-break: break-all;
            }

            .textTwo {
              font-size: 0.69rem;
              line-height: 0.84rem;
              color: #fff;
              margin-top: 0.72rem;
              margin-bottom: 0.5rem;
            }

            .tapBox {
              width: 4.66rem;
              height: 1.34rem;
              background-color: #fff;
              border-radius: 0.43rem;
              line-height: 1.44rem;

              span {
                color: #fba560;
                font-size: 0.79rem;
                letter-spacing: 0.08rem;
              }
            }
          }
        }

        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          padding: 0.75rem 0.875rem 0.75rem 0;

          .coupon_name {
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .coupon_total {
            font-size: 0.75rem;
          }
        }
      }
    }
  }

  .text {
    font-size: 0.625rem;
    color: #f36f6f;
    padding: 0.625rem;
    text-align: left;
    background: #fff;
    margin-bottom: 0.625rem;
  }

  .btn-class {
    padding: 0 0.25rem;
    height: 1.25rem;
    line-height: 1.25rem;
    border: solid 1px #f14e4e;
    display: block;
    font-size: 0.75rem;
    border-radius: 0.125rem;
  }

  .bg-color {
    background: #f14e4e;
    color: #fff;
  }

  .add-margin {
    margin: 0 0.625rem;
  }

  .small-text {
    font-size: 0.75rem;
    color: #999;
  }

  .del-color,
  .icon-ht_tips {
    color: #f14e4e;
  }

  .level-box {
    padding: 0 0.938rem;
    background: #fff;

    .add-level {
      border-bottom: 1px solid #ebebeb;

      .add-level-title {
        height: 1.625rem;
        line-height: 1.625rem;
        background-color: #f3f3f3;
        display: flex;
      }

      .w20 {
        width: 20%;
      }

      .w30 {
        width: 30%;
        display: flex;
        align-items: center;
      }

      .no-blank {
        padding: 0.875rem 0;
      }

      .level-edit {
        display: flex;
        align-items: center;
        color: #202020;
        height: 3.125rem;
        line-height: 3.125rem;

        input {
          width: 3.75rem;
          height: 1.875rem;
          line-height: 1.875rem;
          font-size: 14px;
          border: solid 1px #999;
        }
      }
    }
  }

  .big-titel {
    display: flex;
    align-items: center;
    width: 100%;
    height: 3.125rem;
    line-height: 3.125rem;
    font-size: 0.938rem;
  }

  .coupon-box {
    display: flex;
    font-size: 0.75rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;

    .select-btn {
      width: 5rem;
      margin: 0.625rem 0;
    }

    .coupon-list {
      width: 100%;
      padding: 0 0.938rem;

      .coupon-child {
        display: flex;
        align-items: center;
        width: 100%;
        height: 2.125rem;
        flex-wrap: nowrap;

        .coupon-name {
          padding: 0 0.25rem;
          width: 5.375rem;
          height: 1.438rem;
          background-color: #e6e6e6;
          border-radius: 0.125rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }

        .coupon-num {
          flex: 1;
          text-align: left;
          padding: 0 0.625rem;

          input {
            width: 3.75rem;
            height: 1.25rem;
            border: solid 1px #999;
          }
        }

        .coupon-del {
          width: 20%;
        }
      }
    }
  }

  .share-config {
    padding: 0 0.938rem 1rem;
    background: #fff;

    .config-title {
      height: 2.375rem;
      line-height: 2.375rem;
      text-align: left;
    }

    .config-content {
      border: 1px solid #eaeaea;
    }

    .add-confid {
      margin: 0.5rem 0;
      display: flex;

      .add-btn {
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        .btn-class {
          color: #f14e4e;
          margin-left: 0.5rem;
          margin-bottom: 0.5rem;
        }
      }
    }
  }

  .next-btn {
    width: 19.125rem;
    height: 2.5rem;
    line-height: 2.5rem;
    background-color: #f14e4e;
    margin: 1rem auto;
    color: #fff;
  }

  .disableds-input {
    background: #e4e7ed;
    border: none !important;
    color: #c0c4cc;
  }

  #groupDataStatistics {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: scroll;
    background: #fff;

    .list {
      display: flex;
      align-items: center;
      margin-bottom: 0.625rem;
      background: #fff;
      width: fit-content;
      padding: 0.625rem 0;

      .list-small {
        width: 4.875rem;
        flex-shrink: 0;
      }

      .list-big {
        flex-shrink: 0;
        width: 9.875rem;
      }

      .list-child {
        margin: 0.5rem 0;

        input {
          width: 4.5rem;
          height: 1.25rem;
          border: solid 0.031rem #999;
        }
      }
    }

    .list-main {
      max-height: 70vh;
      overflow: scroll;
    }

    .next-btn-box {
      display: flex;
      justify-content: space-between;

      .next-btn {
        width: 45%;
      }
    }

    .line {
      height: 2.813rem;
      line-height: 2.813rem;
      margin: 0;
      padding: 0;

      .list-small,
      .list-big {
        background: #f5f5f5;
      }
    }
  }

  .good-more-btn {
    padding: 15px 0 10px;
    font-size: 16px;
    text-align: center;
    color: #999;
  }
}
</style>
