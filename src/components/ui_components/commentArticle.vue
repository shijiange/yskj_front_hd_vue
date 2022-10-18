<template>
  <div class="comment">
    <div style="width: 100%; height: 0.31rem; background: #f2f2f2;"></div>
    <div class="title">评价详情</div>
    <div class="commentList">
      <div class="firstComment">
        <div class="userTop">
          <div class="image">
            <img src="" alt="" />
          </div>
          <div class="user">
            <div class="userName">小小小叶子</div>
            <div class="dateDay">2020.12.14 10:17</div>
            <div class="contenBox">
              <div class="txt">各类的服务很好！！！</div>
              <div class="contenImg">
                <img src="" alt="" />
              </div>
            </div>
          </div>
          <div class="reply" @click="replyBtn('小小小叶子','1')">回复</div>
        </div>
        <!-- 回复的评论 -->
        <div class="commentLis">
          <div class="userTop">
            <div class="image">
              <img src="" alt="" />
            </div>
            <div class="user">
              <div class="userName">小小小叶子</div>
              <div class="dateDay">2020.12.14 10:17</div>
              <div class="contenBox">
                <div class="txt">各类的服务很好！！！</div>
                <!-- <div class="contenImg">
                  <img src="" alt="" />
                </div> -->
              </div>
            </div>
            <div class="reply" @click="replyBtn('小小小叶子','1')">回复</div>
          </div>
        </div>
        <!-- 加在更多评论 -->
        <div class="commentLis">
          <div class="commentMore">
            更多
            <van-icon name="arrow-down" />
          </div>
        </div>
      </div>
      <div class="commentMore">
        展开更多的评论
        <van-icon name="arrow-down" />
      </div>
    </div>
    <!-- 回复输入框 -->
    <div class="replyInp">
      <div class="userImg">
        <img src="" alt="" />
      </div>
      <div class="inpNav" @click="subMainCommentBtn">
        <input disabled type="text" placeholder="来都来了，留下点什么吧"  />
      </div>
    </div>
    <yz-comment-input v-model="showCommentInput" v-on:confirm="subMainBtn" :options="commentInputOptions">
      <div class="commentInput-slot-style" v-if="commentInputOptions.type == 'reply'">
        回复<span class="selcolor">@{{ replyName }}</span>
      </div>
    </yz-comment-input>
  </div>
</template>
<script>
import yzCommentInput from "components/ui_components/yz_commentInput";
export default {
  props: {
    //弹窗是否显示，默认不显示
    showCarList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value2: "",
      showCommentInput: false,
      commentInputOptions: {},
      replyName:''
    };
  },
  components: { yzCommentInput },
  computed: {},
  methods: {

  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
