<!-- 预约商品相关项目 -->
<template>
  <div>
    <div id="comment">
      <!-- 预约商品相关项目 -->
      <div class="evaTop">
        <div class="evaTitle">相关{{ appointmentLang.project }}</div>
        <div class="evaTo" style="color: #ed0606;" @click="gotoProjects()">更多&nbsp;<i class="fa fa-angle-right" style="font-size: 20px;"></i></div>
      </div>
      <div class="ecaBottom" v-if="!fun.isTextEmpty(projects)">
        <van-swipe :loop="false" :width="215" class="evaLoop" :show-indicators="false">
          <van-swipe-item v-for="item in projects.slice(0, 5)" :key="item.project_id">
            <div class="evaLoopmain projects" @click="goProjectDetails(item.project_id)">
              <img :src="item.thumb" alt />
              <div class="user">
                <div class="text" style="-webkit-box-orient: vertical;">{{ item.project_title }}</div>
              </div>
              <div style="color: #999;">{{ item.service_count }}次</div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div v-if="fun.isTextEmpty(projects)" style="padding: 0.875rem; color: #999;">抱歉，暂无相关{{ appointmentLang.project }} ~</div>
    </div>
    <van-popup v-model="showProjects" position="bottom" :style="{ height: '80%', width: '100%' }" get-container="#appMain">
      <van-nav-bar :title="'全部相关' + appointmentLang.project" class="pcStyle_ydT" right-text="关闭 " @click-right="showProjects = false">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="showProjects = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <!-- 全部相关项目 -->
      <div class="projects1" v-for="item in projects" :key="item.project_id" @click="goProjectDetails(item.project_id)">
        <img :src="item.thumb" alt="" />
        <div class="user">
          <div class="text" style="-webkit-box-orient: vertical;">{{ item.project_title }}</div>
          <div style="color: #999; line-height: 2rem; text-align: right;">{{ item.service_count }}次</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      showProjects: false,
      projects: []
    };
  },

  mounted() {
    this.getProject();
  },

  components: {},

  computed: {
    appointmentLang() {
      if (this.$store.state.shopLanguage.appointment) {
        return this.$store.state.shopLanguage.appointment;
      } else {
        return { worker: "技师", project: "项目", service: "服务" };
      }
    }
  },

  methods: {
    gotoProjects() {
      this.showProjects = true;
    },
    goProjectDetails(id) {
      this.$router.push(this.fun.getUrl("ProjectDetails", { project_id: id }));
    },
    getProject() {
      $http
        .get("plugin.appointment.frontend.project.get-list-by-goods-id", { goods_id: this.$route.params.id })
        .then(response => {
          if (response.result === 1) {
            this.projects = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.pcStyle_ydT {
  width: 375px;
  left: 50% !important;
  margin-left: -187.5px;
}

#comment {
  margin: 10px;
  border-radius: 10px;
  padding: 10px;
  background: #fff;

  .evaTop {
    padding: 0 0.75rem;
    height: 2.375rem;
    line-height: 2.375rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .evaTo {
      display: flex;
      align-items: center;
    }
  }

  .ecaBottom {
    .evaLoop {
      text-align: left;

      .evaLoopmain {
        display: flex;
        flex-wrap: wrap;
        padding: 0.875rem 0.625rem;
        width: 200px;
        height: 6.25rem;
        overflow: hidden;
        margin: 0.875rem;
        margin-top: 0.5rem;
        -moz-box-shadow: 0 3px 15px #e6e6e6;
        -webkit-box-shadow: 0 3px 15px #e6e6e6;
        box-shadow: 0 3px 15px #e6e6e6;
        border-radius: 6px;

        img {
          width: 1.875rem;
          height: 1.875rem;
          border-radius: 100%;
          margin-right: 0.5rem;
        }

        .user {
          flex: 8;

          .username {
            width: 5rem;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }
        }

        .text {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-height: 1.25rem;
        }
      }

      .projects {
        height: 5rem;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 100%;
          margin-right: 0.5rem;
        }
      }
    }
  }
}

.projects1 {
  display: flex;
  text-align: left;
  padding: 0 1rem;
  margin-bottom: 0.5rem;

  img {
    width: 5rem;
    height: 5rem;
    border-radius: 15px;
    margin-right: 0.5rem;
  }

  .user {
    flex: 1;
  }

  .text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.25rem;
  }
}
</style>
