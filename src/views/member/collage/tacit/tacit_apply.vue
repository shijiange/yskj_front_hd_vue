<template>
  <div class="page">
    <c-title text="会员申请"></c-title>
    <div class="headerTag">
      <div class="headerTagItem" v-for="item in applyLevelList" :key="item.id" :class="[headerTagIndex == item.id ? 'active' : '']" @click="setHeaderTagIndex(item.id)">
        <span>{{ item.name }}</span>
      </div>
      <!--
			<div class="headerTagItem" :class="[headerTagIndex==1 ? 'active' : '']" @click="setHeaderTagIndex(1)">
				<span>等级名称</span>
			</div> -->
    </div>

    <div class="wrapper" v-if="!conditionFlag">
      <div class="applyInfo">申请信息</div>
      <div id="member">
        <!-- <div id="tool" style="">
					<dt v-if="thumb">
						<img :src="thumb" style="width: 100% ;height: 9.675rem;"/>
					</dt>
				</div> -->
        <div style="height: 0.005rem; clear: both;"></div>
        <div class="diyform" v-if="status === 0">
          <template v-for="(item, key) in diydata">
            <template v-if="item.type == 'diyinput'">
              <div class="inputWrapper" :key="key">
                <div class="ps">
                  <span>{{ item.data.tp_name === "" ? "输入框" : `${item.data.tp_name}` }}</span>
                  <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
                </div>
                <input type="text" class="input" :required="item.data.tp_must == 1" v-model="item.value" :placeholder="item.data.placeholder" />
                <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
              </div>
            </template>

            <template v-if="item.type == 'diyusername'">
              <div class="inputWrapper" :key="key">
                <div class="ps">
                  <span>{{ item.data.tp_name === "" ? "输入框" : `${item.data.tp_name}` }}</span>
                  <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
                </div>
                <input type="text" class="input" :required="item.data.tp_must == 1" v-model="item.value" :placeholder="item.data.placeholder" />
                <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
              </div>
            </template>

            <template v-if="item.type == 'diypwd'">
              <div class="inputWrapper" :key="key">
                <div class="ps">
                  <span>{{ item.data.tp_name === "" ? "密码" : `${item.data.tp_name}` }}</span>
                  <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
                </div>
                <input type="password" class="input" :required="item.data.tp_must == 1" v-model="item.value" :placeholder="item.data.placeholder" />
                <i style="visibility: hidden; width: 0.5rem;" class="iconfont"></i>
              </div>
            </template>

            <template v-if="item.type == 'diytextarea'">
              <div :key="key" style="display: flex; border-bottom: 0.031rem solid #dee2ee; margin-left: 1rem; margin-right: 1.4rem; padding-top: 0.5rem;">
                <!-- <span style="color:red;line-height:200%;">*</span> -->
                <template>
                  <van-field style="padding: 0;" v-model="item.value" rows="3" autosize maxlength="100" type="textarea" input-align="right" :border="false" :placeholder="item.data.placeholder">
                    <span slot="label" v-html="diytextareaName(item.data)"></span>
                  </van-field>
                </template>
              </div>
            </template>

            <template v-if="item.type == 'diycheckbox'">
              <div :key="key" style="border-bottom: 0.031rem solid #dee2ee; margin-left: 1rem; margin-right: 1rem;">
                <div style="margin-top: 0.8rem;">
                  {{ item.data.tp_name }}
                  <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
                </div>
                <van-checkbox-group v-model="item.value">
                  <van-cell-group :border="false">
                    <van-cell :key="ritem" v-for="(ritem, index) in item.data.tp_text" :title="ritem" clickable @click="toggle(index)">
                      <template #right-icon>
                        <van-checkbox checked-color="#fe5d5a" :name="ritem" ref="checkboxes" />
                      </template>
                    </van-cell>
                  </van-cell-group>
                </van-checkbox-group>
              </div>
            </template>

            <template v-if="item.type == 'diyselect'">
              <div class="inputWrapper" @click="openDiyradioPopup(item)" :key="key">
                <div class="ps">
                  <span> {{ item.data.tp_name === "" ? "单选框" : item.data.tp_name }}</span>
                  <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
                </div>
                <div class="input">{{ item.value }}</div>
                <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
              </div>

              <!-- <div class="inputWrapper" :key="key">
								<div class="ps">
									<span style="color:red;line-height:200%;" v-if="item.data.tp_must == 1">*</span>
									<span>{{ item.data.tp_name }}</span>
									<span style="color:red;">*</span>
								</div>
								<div class="input">
									<select slot="right" v-model="item.value" style="border:none;direction:rtl;">
										<option value="">请选择{{ item.data.tp_name }}</option>
										<option :value="sitem" :key="sitem" v-for="sitem in item.data.tp_text">{{sitem}}</option>
									</select>
								</div>
								<i style="font-size:1.5rem;height:1.5rem;" class="iconfont icon-advertise-next"></i>
							</div> -->
            </template>

            <template v-if="item.type == 'diyradio'">
              <div class="inputWrapper" @click="openDiyradioPopup(item)" :key="key">
                <div class="ps">
                  <span> {{ item.data.tp_name === "" ? "单选框" : item.data.tp_name }}</span>
                  <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
                </div>
                <div class="input">{{ item.value }}</div>
                <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
              </div>

              <!-- <div :key="key" style="border-bottom: 0.031rem solid #dee2ee;margin-left:1rem;margin-right: 1rem;">
								<div style="margin-top:0.8rem;">
									<span style="color:red;line-height:200%;" v-if="item.data.tp_must == 1">*</span>
									{{item.data.tp_name}}
								</div>

								<van-radio-group v-model="item.value">
									<van-cell-group :border="false">
										<van-cell :key="ritem" v-for="ritem in item.data.tp_text" :title="ritem" clickable @click="item.value = ritem">
											<template #right-icon>
												<van-radio checked-color="#fe5d5a" :name="ritem" />
											</template>
										</van-cell>
									</van-cell-group>
								</van-radio-group> -->

              <!-- </div> -->
            </template>

            <template v-if="item.type == 'diyimg'">
              <van-cell-group :key="key" style="padding-left: 0; margin-left: 1rem; margin-right: 1rem;" class="blcok" :border="false">
                <div style="margin-top: 0.8rem;">
                  {{ item.data.tp_name === "" ? "图片：" : `${item.data.tp_name}：` }}
                </div>
                <div class="clearfloat" style="width: 100%; text-align: left; padding: 1rem; padding-left: 0; padding-top: 0.4rem;">
                  <template v-if="item.data.tp_max > 1">
                    <template v-for="(val, index) in item[item.name + 'Value2']">
                      <div class="photobox" style="float: left; max-width: 25%;" :key="index">
                        <img :src="val.url" style="max-width: 5rem;" />
                        <van-icon @click="removeImg_1(item, index)" name="close" style="width: 1.2rem; height: 1.2rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;" />
                      </div>
                    </template>

                    <div @click="chooseUpload(item.name)">
                      <van-uploader :disabled="item[item.name + 'Length'].length >= item.data.tp_max" :after-read="onRead_2">
                        <div style="padding-left: 1rem; padding-top: 1rem; margin-left: 0.2rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda;">
                          <img :src="require('../../../../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar" />
                        </div>
                      </van-uploader>
                    </div>
                  </template>
                  <template v-if="item.data.tp_max == 1">
                    <template v-for="(val, index) in item[item.name + 'Value2']">
                      <div class="photobox" style="float: left; width: 20.031rem; height: 10.625rem; margin-left: 1rem; margin-top: 1rem;" :key="index">
                        <img :src="val.url" style="width: 20.031rem; height: 10.625rem;" />
                        <van-icon
                          @click="removeImg_1(item, index)"
                          size="2rem"
                          name="close"
                          style="width: 2rem; height: 2rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;"
                        />
                      </div>
                    </template>

                    <div @click="chooseUpload(item.name)" v-if="item[item.name + 'Value2'].length == 0">
                      <van-uploader :disabled="item[item.name + 'Length'].length >= item.data.tp_max" :after-read="onRead_2">
                        <div style="padding-left: 0.5rem; padding-top: 0.5rem;">
                          <img style="width: 20.031rem; height: 10.625rem;" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/azfw_imgsend@2x.png" class="avatar" />
                        </div>
                      </van-uploader>
                    </div>
                  </template>
                </div>
              </van-cell-group>
            </template>

            <template v-if="item.type == 'diycity'">
              <div class="inputWrapper" @click.stop="showCity = true" @click="openCity(item.name)" :key="key">
                <div class="ps">
                  <span>{{ item.data.tp_name }}：</span>
                  <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
                </div>
                <div class="input">{{ item.value || item.data.tp_name }}</div>
                <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
              </div>
            </template>

            <template v-if="item.type == 'diydate'">
              <div class="inputWrapper" @click="openPicker(item.name)" :key="key">
                <div class="ps">
                  <span>{{ item.data.tp_name === "" ? "日期" : `${item.data.tp_name}` }}</span>
                  <span style="color: red; line-height: 200%;" v-if="item.data.tp_must == 1">*</span>
                </div>
                <div class="input">{{ item.value }}</div>
                <i style="font-size: 1.5rem;" class="iconfont icon-advertise-next"></i>
              </div>
            </template>
          </template>
        </div>

        <div class="diyform" v-if="status === 1">
          <van-cell-group :border="false" v-for="(item, j) in datas" :key="j" :title="item.data_type != '1' && item.data_type != '5' ? '' : item.title">
            <van-cell :border="false" center v-if="item.data_type != '1' && item.data_type != '5'" readonly>
              <span slot="title">{{ item.title }}</span>
              <span slot="default">{{ item.value }}</span>
            </van-cell>
            <van-cell :border="false" center v-if="item.data_type == '1'" class="textarea">
              <van-field v-model="item.value" readonly rows="3" autosize type="textarea" placeholder="" show-word-limit />
            </van-cell>

            <van-cell :border="false" center v-if="item.data_type == '5'">
              <template slot="default" style="width: 100%; text-align: left;" v-for="(item1, index1) in item.value">
                <div :key="index1" class="photobox" style="float: right; max-width: 25%; margin-top: 0.5rem;">
                  <img :src="item1" style="max-width: 5rem;" />
                </div>
              </template>
            </van-cell>
          </van-cell-group>
        </div>

        <van-popup v-model="diyradioPopupShow" round position="bottom">
          <van-picker show-toolbar :columns="diyradioPopupColumns" @cancel="diyradioPopupShow = false" @confirm="callbackDiyradioPopup" />
        </van-popup>

        <van-popup v-model="pickerShow" position="bottom">
          <van-datetime-picker type="date" title="选择年月日" v-model="pickerValue" @cancel="pickerShow = false" @confirm="setDate" />
        </van-popup>

        <yd-cityselect v-model="showCity" :callback="setCity" :items="district" id="yd-cityselect"></yd-cityselect>

        <div style="height: 0.625rem; clear: both;"></div>
        <div style="width: 90%; margin: 0 auto; padding-bottom: 1.5rem;">
          <van-button color="#fe5d5a" size="large" style="height: 40px;" @click.native="submit" type="primary" v-if="status === 0">提交 </van-button>
          <van-button color="#fe5d5a" style="height: 40px;" size="large" type="danger" v-if="status === 1">已提交 </van-button>
          <!-- 是否同意协议 -->
          <div style="display: flex; padding-top: 0.5rem;" v-if="status === 0">
            <van-checkbox v-model="agreementChoose" shape="square" icon-size="15px" checked-color="#f15353"></van-checkbox><span style="margin-left: 5px;">阅读并同意</span
            ><i @click="agreementShow = true" style="color: #ff5959;">《申请协议》</i>
          </div>
        </div>
        <div style="width: 100%; padding: 0.5rem 0.5rem 5rem 0.5rem; background-color: #fff;">
          <div v-html="description"></div>
        </div>
      </div>
    </div>

    <div class="condition" v-if="conditionFlag">
      <div class="conditionWrapper">
        <div class="applyInfo">申请条件</div>
        <div class="conditionItems">
          <div class="conditionItem" v-if="team_performance_amount != null">
            <div class="img">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/collage_apply_icon_1.png" alt="" />
            </div>
            <div class="ri">
              <div class="c1">团队拼单业绩达到{{ team_performance_amount.amount }}元</div>
              <div class="c2">您还差{{ team_performance_amount.team_amount }}元</div>
            </div>
          </div>
          <div class="conditionItem" v-if="direct_push != null">
            <div class="img">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/collage_apply_icon_2.png" alt="" />
            </div>
            <div class="ri">
              <div class="c1">直推会员达到{{ direct_push.push }}个</div>
              <div class="c2">您还差{{ direct_push.push_people }}个</div>
            </div>
          </div>
          <template v-if="member_level.length > 0">
            <div class="conditionItem" v-for="(item, key) in member_level" :key="key" style="height: auto;">
              <div class="img" style="align-self: flex-start; height: 4.4rem; display: flex; align-items: center;">
                <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/collage_apply_icon_3.png" alt="" />
              </div>
              <div style="flex: 1;">
                <div class="ri">
                  <div class="c1">{{ item.name }}等级人数满{{ item.level_num }}人</div>
                  <div class="c2">您还差{{ item.level }}人</div>
                </div>
              </div>
            </div>
          </template>
          <div class="conditionItem" v-if="goods.length > 0">
            <div class="img">
              <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/collage_apply_icon_4.png" alt="" />
            </div>
            <div class="ri">
              <div class="c1">购买以下商品</div>
            </div>
          </div>
        </div>
      </div>
      <div class="conditionGoods">
        <c-goodsList :goods="goods" goods_template="01" text="搜索结果" class="osll"></c-goodsList>
      </div>
    </div>

    <!-- 申请协议 -->
    <van-popup v-model="agreementShow" :style="{ width: '100%', height: '100%', overflow: auto }" position="right">
      <van-nav-bar title="申请协议">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="agreementShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <!-- <div style="clear:both;margin-top:40px;"></div> -->
      <div v-html="agreementText"></div>
    </van-popup>
  </div>
</template>

<script>
import tacitApplyController from "./tacit_apply_controller";

export default tacitApplyController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  min-height: 100vh;
  text-align: left;
}

.headerTag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.594rem;
  overflow: scroll;
  background: rgb(246, 248, 252);

  .headerTagItem {
    padding: 0 0.8rem;
    height: 2.594rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666;
    font-size: 0.875rem;
    font-weight: bold;
    white-space: nowrap;

    &.active {
      position: relative;
      color: #ff2c29;

      &::after {
        content: "";
        display: block;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        border-bottom: 0.469rem solid #fff;
        border-left: 0.469rem solid transparent;
        border-right: 0.469rem solid transparent;
      }
    }
  }
}

.applyInfo {
  margin-left: 1rem;
  display: flex;
  align-items: center;
  height: 0.875rem;
  letter-spacing: 0.044rem;
  color: #ff2c29;
  font-size: 0.875rem;
  padding-left: 0.875rem;
  border-left: 0.18rem solid #ff2c29;
}

.wrapper {
  min-height: 87vh;
  padding-top: 0.6rem;
  background: #fff;
}

.condition {
  .conditionWrapper {
    padding-top: 0.6rem;
    background: #fff;

    .conditionItems {
      .conditionItem {
        height: 4.4rem;
        display: flex;
        padding-left: 1.06rem;
        align-items: center;

        .img {
          width: 2.5rem;
          height: 2.5rem;

          img {
            width: 2.5rem;
            height: 2.5rem;
          }
        }

        .ri {
          margin-left: 0.938rem;
          flex: 1;
          padding: 0.7rem 0;
          height: 4.4rem;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          border-bottom: 0.031rem solid #f5f5f5;

          .c1 {
            font-size: 0.938rem;
            color: #333;
          }

          .c2 {
            color: #f14e4e;
            font-size: 0.813rem;
          }
        }
      }
    }
  }
}

.inputWrapper {
  margin-left: 1rem;
  margin-right: 1rem;
  padding-right: 0.3rem;
  text-align: left;
  height: 2.938rem;
  display: flex;
  align-items: center;
  padding-left: 0.2rem;
  border-bottom: 0.031rem solid #dee2ee;

  .ps {
    width: 5.625rem;
    color: #333;
    font-size: 0.875rem;
    letter-spacing: 0.044rem;
  }

  .input {
    text-align: right;
    flex: 1;
    letter-spacing: 0.044rem;
    color: #999;
    font-size: 0.875rem;
    border: none;

    &::-webkit-input-placeholder {
      color: #999;
    }
  }
}

.checkbox {
  background: #fff;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  border-bottom: 0.0625rem solid #ece9e9;
  text-align: left;
  padding-left: 0.75rem;
}

.photobox {
  position: relative;
  width: 5rem;
  height: 5rem;
  border: 1px dashed #c0ccda;

  /* float: left; */
  margin-right: 0.2rem;
  margin-left: 0.2rem;
  margin-bottom: 0.2rem;

  img {
    width: 100%;
    height: 100%;
  }
}

/* 清除浮动代码 */
.clearfloat::after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}

.clearfloat {
  zoom: 1;
}

input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #333;
}

input::-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #333;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #333;
}

input::-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #333;
}

.bgNone {
  background-color: none;
}

.textarea {
  padding: 10px 5px;

  /deep/textarea {
    color: #555;
  }
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
