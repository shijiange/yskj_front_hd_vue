<!-- 新人奖 -->
<template>
  <div id="newcomer_award">
    <div class="newcomer_award_templet newcomer_award_templet1"
         v-if="type == 0">
      <div class="title">{{title}}</div>
      <div class="cupcon_list">
        <div class="cupcon_child"
             v-for="item in list"
             :key="item.id">
          <template v-if="item.prize_type == 1">
            <div class="c_left_1">
              <template v-if="item.has_one_coupon.coupon_method == 1">
                <div class="currency">{{ $i18n.t('money') }}</div>
                <div class="price">{{item.has_one_coupon.deduct}}</div>
              </template>
              <template v-if="item.has_one_coupon.coupon_method == 2">
                <div class="price">{{item.has_one_coupon.discount}}</div>
                <div style="font-size: 1.25rem;">折</div>
              </template>
            </div>
            <div class="c_right_1">
              <div class="c_name_1">{{item.has_one_coupon.name}}</div>
              <div class="c_condition_1">满{{item.has_one_coupon.enough}}可用</div>
            </div>
          </template>
          <template v-if="item.prize_type != 1">
            <div class="c_left_1">
              <div class="price">{{item.prize_type==2?item.point:(item.prize_type==3?item.love:item.amount)}}</div>
            </div>
            <div class="c_right_1">
              <div class="c_name_1">{{item.name}}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="liqun_btn"
           @click.stop="closeBtn">立即领取</div>
      <div class="close_btn"
           @click.stop="closeBtn">
        <i class="iconfont icon-adsystem_icon_cancle"></i>
      </div>
    </div>
    <div class="newcomer_award_templet newcomer_award_templet2"
         v-if="type == 1">
      <div class="title">{{title}}</div>
      <div class="cupcon_list">
        <div class="cupcon_child"
             v-for="item in list"
             :key="item.id">
          <template v-if="item.prize_type == 1">
            <div class="c_left_1">
              <template v-if="item.has_one_coupon.coupon_method == 1">
                <div class="currency">{{ $i18n.t('money') }}</div>
                <div class="price">{{item.has_one_coupon.deduct}}</div>
              </template>
              <template v-if="item.has_one_coupon.coupon_method == 2">
                <div class="price">{{item.has_one_coupon.discount}}</div>
                <div style="font-size: 1.25rem;">折</div>
              </template>
            </div>
            <div class="c_right_1">
              <div class="c_name_1">{{item.has_one_coupon.name}}</div>
              <div class="c_condition_1">满{{item.has_one_coupon.enough}}可用</div>
            </div>
          </template>

          <template v-if="item.prize_type != 1">
            <div class="c_left_1">
              <div class="price">{{item.prize_type==2?item.point:(item.prize_type==3?item.love:item.amount)}}</div>
            </div>
            <div class="c_right_1">
              <div class="c_name_1">{{item.name}}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="liqun_btn"
           @click.stop="closeBtn">立即领取</div>
      <div class="close_btn"
           @click.stop="closeBtn">
        <i class="iconfont icon-guanbi"></i>
      </div>
    </div>
    <div class="newcomer_award_templet newcomer_award_templet3"
         v-if="type == 2">
      <div class="title">{{title}}</div>
      <div class="cupcon_list">
        <div class="cupcon_child"
             v-for="item in list"
             :key="item.id">
          <template v-if="item.prize_type == 1">
            <div class="border_box">
              <div class="c_left_1">
                <template v-if="item.has_one_coupon.coupon_method == 1">
                  <div class="currency">{{ $i18n.t('money') }}</div>
                  <div class="price">{{item.has_one_coupon.deduct}}</div>
                </template>
                <template v-if="item.has_one_coupon.coupon_method == 2">
                  <div class="price">{{item.has_one_coupon.discount}}</div>
                  <div style="font-size: 1.25rem;">折</div>
                </template>
              </div>
              <div class="c_right_1">
                <div class="c_name_1">{{item.has_one_coupon.name}}</div>
                <div class="c_condition_1">满{{item.has_one_coupon.enough}}可用</div>
              </div>
            </div>
          </template>

          <template v-if="item.prize_type != 1">
            <div class="border_box">
              <div class="c_left_1">
                <div class="price">{{item.prize_type==2?item.point:(item.prize_type==3?item.love:item.amount)}}</div>
              </div>
              <div class="c_right_1">
                <div class="c_name_1">{{item.name}}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="liqun_btn"
           @click.stop="closeBtn">立即领取</div>
      <div class="close_btn"
           @click.stop="closeBtn">
        <i class="iconfont icon-adsystem_icon_cancle"></i>
      </div>
    </div>
    <div class="newcomer_award_templet newcomer_award_templet4"
         v-if="type == 3">
      <div class="title">{{title}}</div>
      <div class="cupcon_list">
        <div class="cupcon_child"
             v-for="item in list"
             :key="item.id">
          <template v-if="item.prize_type == 1">
            <div class="c_right_1">
              <div class="c_name_1">{{item.has_one_coupon.name}}</div>
              <div class="c_condition_1">满{{item.has_one_coupon.enough}}可用</div>
            </div>
            <div class="c_left_1">
              <template v-if="item.has_one_coupon.coupon_method == 1">
                <div class="currency">{{ $i18n.t('money') }}</div>
                <div class="price">{{item.has_one_coupon.deduct}}</div>
              </template>
              <template v-if="item.has_one_coupon.coupon_method == 2">
                <div class="price">{{item.has_one_coupon.discount}}</div>
                <div style="font-size: 1.25rem; color: #fff;">折</div>
              </template>
            </div>
          </template>

          <template v-if="item.prize_type != 1">
            <div class="c_right_1">
              <div class="c_name_1">{{item.name}}</div>
            </div>
            <div class="c_left_1">
              <div class="price">{{item.prize_type==2?item.point:(item.prize_type==3?item.love:item.amount)}}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="liqun_btn"
           @click.stop="closeBtn">立即领取</div>
      <div class="close_btn"
           @click.stop="closeBtn">
        <i class="iconfont icon-guanbi"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['data'],
  data() {
    return {
      type:0,
      title:'',
      list:[]
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.type = this.data.activity.background_type;
    this.title = this.data.activity.title||'新人专享';
    this.list = this.data.prize;
  },

  methods: {
    closeBtn(){
      this.$emit("cloneNewcomerAward",false);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newcomer_award {
  width: 18.125rem;
}

#newcomer_award .newcomer_award_templet1 {
  position: relative;
  width: 18.125rem;
  height: 28.125rem;
  background-image: url('../assets/images/newcomer/popupbg_1@3x.png');
  background-size: 100% 100%;
  padding: 0 0.875rem;
  margin-bottom: 3rem;
}

#newcomer_award .newcomer_award_templet1 .close_btn {
  position: absolute;
  bottom: -3.5rem;
  left: 0;
  width: 100%;
  text-align: center;
}

#newcomer_award .newcomer_award_templet1 .close_btn {
  z-index: 9999;
}

#newcomer_award .newcomer_award_templet .close_btn i {
  font-size: 3rem;
  color: #fff;
  font-weight: 400;
}

#newcomer_award .newcomer_award_templet .title {
  padding-top: 4.375rem;
  font-size: 1.75rem;
  color: #fff;
  text-align: left;
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 规定段落中的文本不进行换行 */
}

#newcomer_award .newcomer_award_templet .cupcon_list {
  // display: flex;
  // flex-direction: column;
  margin-top: 1.875rem;
  height: 14.5rem;
  overflow: scroll;
}

#newcomer_award .newcomer_award_templet .cupcon_list .cupcon_child {
  height: 3.875rem;
  width: 100%;
  border-radius: 0.375rem;
  display: flex;
  margin-bottom: 1rem;
  position: relative;
}

#newcomer_award .newcomer_award_templet1 .cupcon_list .cupcon_child {
  background:
    radial-gradient(circle at right top, transparent 5px, #fffeed 0) top left / 5rem 51% no-repeat,
    radial-gradient(circle at right bottom, transparent 5px, #fffeed 0) bottom left / 5rem 51% no-repeat,
    radial-gradient(circle at left top, transparent 5px, #fffeed 0) 5rem 0/230px 51% no-repeat,
    radial-gradient(circle at left bottom, transparent 5px, #fffeed 0) 5rem 1.9375rem /230px 50% no-repeat,
    radial-gradient(circle at 5px 1.95rem, transparent 5px, #fffeed 0) 290px 0/10px 100px no-repeat;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
}

#newcomer_award .newcomer_award_templet1 .cupcon_list .cupcon_child::after {
  content: '';
  height: 2.5rem;
  border: 1px dashed #595959;
  position: absolute;
  left: 5rem;
  top: 0;
  bottom: 0;
  margin: auto;
}

#newcomer_award .newcomer_award_templet .cupcon_list .cupcon_child .c_left_1 {
  width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  color: #d12820;
}

#newcomer_award .newcomer_award_templet .cupcon_list .cupcon_child .c_left_1 .currency {
  font-size: 0.875rem;
  // height: 0.75rem;
}

#newcomer_award .newcomer_award_templet .cupcon_list .cupcon_child .c_left_1 .price {
  font-size: 1.125rem;
}

#newcomer_award .newcomer_award_templet .cupcon_list .cupcon_child .c_right_1 {
  padding: 0 1rem;
  display: flex;
  text-align: left;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  overflow: hidden;
}

#newcomer_award .newcomer_award_templet .cupcon_list .cupcon_child .c_right_1 .c_name_1 {
  font-size: 1rem;
  font-weight: bold;
  color: #f23a56;
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 规定段落中的文本不进行换行 */
}

#newcomer_award .newcomer_award_templet .cupcon_list .cupcon_child .c_right_1 .c_condition_1 {
  font-size: 0.875rem;
  color: #feb669;
}

#newcomer_award .newcomer_award_templet .liqun_btn {
  width: 14rem;
  height: 3rem;
  line-height: 3rem;
  font-size: 1.25rem;
  color: #fff;
  background-color: #f29736;
  border-radius: 1.5rem;
  margin: 1rem auto 0;
}

#newcomer_award .newcomer_award_templet2,
#newcomer_award .newcomer_award_templet4 {
  position: relative;
  width: 18.125rem;
  height: 25.75rem;
  background-image: url('../assets/images/newcomer/popupbg_2@3x.png');
  background-size: 18.125rem 25.75rem;
  padding: 0 0.875rem;
}

#newcomer_award .newcomer_award_templet2 .title {
  padding-top: 1.625rem;
  color: #b07e54;
}

#newcomer_award .newcomer_award_templet2 .currency,
#newcomer_award .newcomer_award_templet2 .price,
#newcomer_award .newcomer_award_templet2 .cupcon_list .cupcon_child .c_right_1 .c_name_1,
#newcomer_award .newcomer_award_templet2 .cupcon_list .cupcon_child .c_right_1 .c_condition_1 {
  color: #ae784b;
}

#newcomer_award .newcomer_award_templet2 .cupcon_list .cupcon_child {
  background-image: linear-gradient(90deg, #f0e0c8 0%, #ebc8a7 47%, #e5af86 100%), linear-gradient(#fff, #fff);
  box-shadow: 0 0 0.5rem 0 rgba(101, 57, 24, 0.29);
}

#newcomer_award .newcomer_award_templet2 .cupcon_list .cupcon_child::after {
  content: '';
  height: 2.5rem;
  border: 1px dashed #fff;
  position: absolute;
  left: 5rem;
  top: 0;
  bottom: 0;
  margin: auto;
}

#newcomer_award .newcomer_award_templet2 .liqun_btn {
  background-color: #653918;
}

#newcomer_award .newcomer_award_templet2 .close_btn,
#newcomer_award .newcomer_award_templet4 .close_btn {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
}

#newcomer_award .newcomer_award_templet2 .close_btn i,
#newcomer_award .newcomer_award_templet4 .close_btn i {
  font-size: 1.25rem;
}

#newcomer_award .newcomer_award_templet3 {
  position: relative;
  width: 18.125rem;
  height: 32rem;
  background-image: url('../assets/images/newcomer/popupbg_3@3x.png');
  background-size: 18.125rem 32rem;
  padding: 0 0.875rem;
  margin-bottom: 2rem;
}

#newcomer_award .newcomer_award_templet3 .title {
  padding-top: 9.75rem;
  text-align: center;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list {
  padding: 0 1.5rem;
  height: 15rem;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child {
  background: #fff8ef;
  padding: 0.25rem;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child:first-child {
  height: 5.375rem;
  margin-top: -0.375rem;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child .border_box {
  border: solid 0.0625rem #ffd5d5;
  display: flex;
  border-radius: 0.5rem;
  width: 100%;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child .c_left_1 {
  width: 50%;
  color: #ff1556;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child .c_left_1 .price {
  font-size: 2rem;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child .c_right_1 {
  padding: 0 0.625rem;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child .c_right_1 .c_name_1,
#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child .c_right_1 .c_condition_1 {
  font-size: 0.875rem;
  color: #ff1556;
}

#newcomer_award .newcomer_award_templet3 .liqun_btn {
  margin-top: 0.875rem;
  background-color: #ffde66;
  color: #ff1556;
}

#newcomer_award .newcomer_award_templet3 .cupcon_list .cupcon_child::after {
  content: '';
  height: 2.5rem;
  border: 0.0625rem solid #ffa8a2;
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  margin: auto;
}

#newcomer_award .newcomer_award_templet3 .close_btn {
  position: absolute;
  top: 0.25rem;
  right: 0;
}

#newcomer_award .newcomer_award_templet4 {
  background-image: url('../assets/images/newcomer/popupbg_4@3x.png');
  height: 27.375rem;
  background-size: 18.125rem 27.375rem;
}

#newcomer_award .newcomer_award_templet4 .title {
  padding-top: 1.625rem;
  line-height: 3rem;
  color: #fff;
  font-weight: bold;
  position: relative;
}

#newcomer_award .newcomer_award_templet4 .title::after {
  content: '';
  width: 6rem;
  height: 5px;
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba($color: #fff, $alpha: 0.5);
}

#newcomer_award .newcomer_award_templet4 .cupcon_list {
  margin-top: 3.5rem;
}

#newcomer_award .newcomer_award_templet4 .cupcon_list .cupcon_child {
  background-color: #fcb906;
}

#newcomer_award .newcomer_award_templet4 .currency,
#newcomer_award .newcomer_award_templet4 .price,
#newcomer_award .newcomer_award_templet4 .cupcon_list .cupcon_child .c_right_1 .c_name_1,
#newcomer_award .newcomer_award_templet4 .cupcon_list .cupcon_child .c_right_1 .c_condition_1 {
  color: #fff;
}

#newcomer_award .newcomer_award_templet4 .cupcon_list .cupcon_child .c_left_1 {
  width: auto;
  flex: 1;
}

#newcomer_award .newcomer_award_templet4 .cupcon_list .cupcon_child .c_right_1 {
  width: 10.875rem;
  height: 3.875rem;
  flex: none;
}

#newcomer_award .newcomer_award_templet4 .cupcon_list .cupcon_child {
  background:
    radial-gradient(circle at right top, transparent 5px, #fcb906 0) top left / 10.875rem 51% no-repeat,
    radial-gradient(circle at right bottom, transparent 5px, #fcb906 0) bottom left / 10.875rem 51% no-repeat,
    radial-gradient(circle at left top, transparent 5px, #fcb906 0) 10.875rem 0/230px 51% no-repeat,
    radial-gradient(circle at left bottom, transparent 5px, #fcb906 0) 10.875rem 1.9375rem/230px 50% no-repeat,
    radial-gradient(circle at 5px 1.95rem, transparent 5px, #fcb906 0) 290px 0/10px 100px no-repeat;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2));
}

#newcomer_award .newcomer_award_templet4 .cupcon_list .cupcon_child::after {
  content: '';
  height: 2.5rem;
  border: 1px dashed #fff;
  position: absolute;
  left: 10.875rem;
  top: 0;
  bottom: 0;
  margin: auto;
}

#newcomer_award .newcomer_award_templet4 .liqun_btn {
  margin-top: 0.875rem;
  background-color: #05c676;
  color: #fff;
}
</style>
