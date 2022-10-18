<template>
    <section id="edit-class">
        <c-title :hide="false" text='商品分类'></c-title>
        <section class="box">
            <ul class="name">
                <li style="line-height: 2.7rem;"><i class="iconfont icon-info-must"></i>分类名称：</li>
                <li style="line-height: 2.7rem;"><input type="text" placeholder="请输入分类名称" v-model="classify_name"></li>
            </ul>
            <!-- <ul class="class-img">
                <li><i class="iconfont icon-info-must"></i>分类图片</li>
                <div class="load-img">
                    <el-upload :action="uploadUrl" :on-preview="handlePreview" :limit="1" list-type="picture-card" :show-file-list="false" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-success="handleStoreSuccess">
								<img v-if="imageUrl" :src="imageUrl" class="avatar">
								<i v-else class="iconfont icon-photobzhaoxiang"></i>
					</el-upload>
                </div>
            </ul> -->
            <!-- <ul class="recommend">
                <li><i class="iconfont icon-info-must"></i>是否推荐</li>
                <li>
                    <el-radio-group v-model="isRecommend">
                        <el-radio label="是"></el-radio>
                        <el-radio label="否"></el-radio>
                    </el-radio-group>
                </li>
            </ul> -->
            <ul class="recommend">
                <li style="line-height: 2.7rem;"><i class="iconfont icon-info-must"></i>是否开启</li>
                <li>
                    <van-radio-group v-model="isOpen" style="margin-top: 0.65rem;">
                        <van-radio name="1" checked-color='#f15353' style="float: left; margin-left: 0.5rem;" >是</van-radio>
                        <van-radio name="0" checked-color='#f15353' style="float: left; margin-left: 0.5rem;" >否</van-radio>
                    </van-radio-group>
                    <!--<el-radio-group v-model="isOpen">-->
                        <!--<el-radio label="是"></el-radio>-->
                        <!--<el-radio label="否"></el-radio>-->
                    <!--</el-radio-group>-->
                </li>
            </ul>
            <section id="bottom">
                <button type="button" @click="sureEdit">确认编辑</button>
            </section>
        </section>
    </section>
</template>

<script>
import firstEdit from './first_edit_controller.js';
export default firstEdit;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.avatar {
  width: 100%;
  height: 100%;
}

#edit-class {
  background-color: #fff;

  .box {
    .name,
    .recommend {
      display: flex;
      height: 2.75rem;

      /* line-height: 2.75rem; */
      border-bottom: solid 0.0625rem #ebebeb;
      font-size: 16px;
      padding: 0 0.875rem;

      i {
        font-size: 12px;
        color: #f15353;
        margin-right: 0.375rem;
      }

      input {
        border: none;
      }

      li:first-child {
        width: 6.875rem;
        text-align: left;
      }
    }

    .class-img {
      text-align: left;
      font-size: 16px;
      padding: 0 0.875rem 0.625rem 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;

      li {
        height: 2.75rem;
        line-height: 2.75rem;
      }
      // .load-img{
      //     width:6.25rem;
      //     height:6.25rem;
      //     display: flex;
      //     justify-content: center;
      // }
      .icon-info-must {
        font-size: 12px;
        color: #f15353;
        margin-right: 0.375rem;
      }

      .icon-photobzhaoxiang {
        line-height: 5rem;
        font-size: 24px;
        color: #c9c9c9;
      }
    }

    #bottom {
      border-top: solid 0.0625rem #ebebeb;
      width: 100%;
      position: fixed;
      bottom: 0;
      background-color: #fff;
      padding: 0 0.875rem;
      font-size: 16px;

      button {
        color: #fff;
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        border-radius: 0.1875rem;
        background-color: #f15353;
        border: none;
        margin: 0.375rem 0;
      }
    }
  }
}
</style>