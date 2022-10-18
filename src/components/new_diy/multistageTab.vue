<template>
  <div :class="className" ref="tabInitBox">
    <div v-html="css"></div>
    <div style="display: flex" ref="u_moretabcontrol" class="u_moretabcontrol">
      <!-- 左边一级选项卡 :class="[isFixed ? 'leftIsfix' : '']"-->
      <div class="leftConten leftIsfix" v-if="datas.show_first_tab" @touchmove.stop>
        <div class="intoView" v-for="(item, index) in datas.list" @click="leftTapBtn(index)" :key="index" :class="[minR == index ? 'intoShowView' : '']">
          <img :src="item.image" v-if="item.image" />
          <div v-else v-html="sliceTxt(item.text)"></div>
        </div>
      </div>
      <!-- 右边 -->
      <div class="rightConten" :style="{ width: datas.show_first_tab ? '' : '100%' }" @scroll="scrollEvent" ref="searchBar" :class="[isFixed && datas.show_first_tab ? 'isrigheOverY' : '']">
        <div class="rightContenChild" v-for="(item, index) in datas.list" :key="index" ref="rightContenChild">
          <!-- 一级分类标题 -->
          <div class="featured nonefix" v-if="datas.is_show_first_tab_title">
            <div class="beforeLine"></div>
            {{ item.text }}
          </div>
          <!-- 二级导航定位模块 -->
          <div
            ref="twoClass"
            :class="[
              minR == index && isFixed && childPos ? (datas.show_first_tab ? 'twoIsfix classDivBox' : 'twoIsfixNoneOne classDivBox') : datas.show_first_tab ? 'twoNonefix' : 'twoNonefixOne',
              minR == index && fun.getPhoneEnv() == 3 && childPos ? 'pcStyle' : ''
            ]"
            v-if="datas.show_second_tab"
          >
            <div
              :class="[indata.tabSelectShow == indata.id ? 'selectDivClass' : '', datas.show_first_tab ? 'classDiv' : 'classDivNoneOne']"
              v-for="(indata, ind) in sliceMethod(allDatas[index], index, childPos, datas.show_first_tab, minR)"
              :key="ind"
              @click="tapClassDiv(index, ind)"
            >
              {{ indata.title }}
            </div>
            <div class="ChangeDiv" v-if="item.second_list.length > 7 && datas.show_first_tab && !childPos" @click="tapChange(index)">
              换一换
              <i class="iconfont icon-fontclass-tequanzhekou"></i>
            </div>
          </div>
          <div
            ref="twoClass"
            style="opacity: 0"
            :class="[
              minR == index && isFixed ? (datas.show_first_tab ? 'twoNonefix' : 'twoNonefixOne') : datas.show_first_tab ? 'twoNonefix' : 'twoNonefixOne',
              minR == index && fun.getPhoneEnv() == 3 ? 'pcStyle' : ''
            ]"
            v-if="datas.show_second_tab && minR == index && isFixed && childPos"
          >
            <div
              :class="[indata.tabSelectShow == indata.id ? 'selectDivClass' : '', datas.show_first_tab ? 'classDiv' : 'classDivNoneOne']"
              v-for="(indata, ind) in allDatas[index]"
              :key="ind"
              @click="tapClassDiv(index, ind)"
            >
              {{ indata.title }}
            </div>
            <div class="ChangeDiv" v-if="item.second_list.length > 7 && datas.show_first_tab" @click="tapChange(index)">
              换一换
              <i class="iconfont icon-fontclass-tequanzhekou"></i>
            </div>
          </div>

          <!-- 商品组，单图组 -->
          <div class="lisView">
            <template v-for="(info, ind) in infoDatas[index]">
              <component
                childComponent="tab"
                :leftShow="datas.show_first_tab"
                :childStyle="datas"
                :key="ind"
                :is="info.uikey"
                :id="`${info.id}-${index}-${ind}`"
                :page_id="page_id"
                :component_key="info.uikey"
                :datas="info.remote_data"
                :index="ind"
                @imgLoad="imgLoad"
                v-on:formSubmit="translateChild(item, info, index, ind)"
              >
              </component>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import U_goods from "components/new_diy/goods";
import U_simplegraph from "components/new_diy/simplegraph";
const documentElement = document.documentElement;
const body = document.body;
// 自定义样式
const css = function () {
  if (this.datas.preview_color) {
    const {
      preview_color,
      first_tab_color,
      first_tab_bg_color,
      first_tab_active_color,
      first_tab_active_bg_color,
      first_tab_title_color,
      // show_second_tab, //二级选项卡是否显示
      second_tab_color,
      second_tab_bg_color,
      second_tab_active_color,
      second_tab_active_bg_color,
      show_second_border, // 二级选项卡边框是否显示
      second_border_color
      // check_more_color,商品组查看更多文字颜色
      // check_more_bg_color 商品组查看更多背景颜色
    } = this.datas;

    return `
        .component-${this.id} .u_moretabcontrol{
          background-color: ${preview_color};
        }
        .component-${this.id} .classDivBox{
          background-color: ${preview_color};
        }
        .component-${this.id} .leftConten{
          color: ${first_tab_color};
          background-color: ${first_tab_bg_color};
        }
        .component-${this.id} .intoShowView{
          background-color:${first_tab_active_bg_color};
          color:${first_tab_active_color};
        }
        .component-${this.id} .featured{
          color:${first_tab_title_color};
        }
        .component-${this.id} .beforeLine{
          background-color:${first_tab_title_color};
        }
        .component-${this.id} .classDiv{
          color:${second_tab_color};
          background-color:${second_tab_bg_color};
          border: ${show_second_border ? "solid 0.03rem" + second_border_color : "none"};
        }
        .component-${this.id} .classDivNoneOne{
          color:${second_tab_color};
          background-color:${second_tab_bg_color};
          border: ${show_second_border ? "solid 0.03rem" + second_border_color : "none"};
        }
        .component-${this.id} .ChangeDiv{
          color:${second_tab_color};
          background-color:${second_tab_bg_color};
          border: ${show_second_border ? "solid 0.03rem" + second_border_color : "none"};
        }
        .component-${this.id} .selectDivClass{
          color:${second_tab_active_color};
          background-color:${second_tab_active_bg_color};
          border: ${show_second_border ? "solid 0.03rem" + second_border_color : "none"};
        }
    `;
  }
};
export default {
  props: ["isBottom", "lastIndex", "index", "page_id", "id", "datas", "component_key", "tabcontrol", "isLast", "plugin_active"],
  data() {
    return {
      noticeWidth: "375",
      minR: 0,
      isFixed: false,
      //一级选项卡是否显示
      show_first_tab: true,
      // 一级选项卡是否显示对应标题
      is_show_first_tab_title: true,
      // 二级选项卡隐藏
      twosTabShow: true,
      // 二级分类可以置顶
      childPos: false,
      // 页面显示的数组
      infoDatas: [],
      // 分类显示的数组
      allDatas: [],
      listHeight: [],
      recordTop: "",
      // 未截取的分类数组
      orallDatas: []
    };
  },
  activated() {
    this.$nextTick(() => {
      // 重新监听
      window.addEventListener("scroll", this.handleScroll);
      setTimeout(() => {
        // 延迟获取高度
        this.getBoxHeight();
      }, 300);
    });
  },
  mounted() {
    let arr = this.datas.list;
    let navDatas = [];
    arr.forEach(element => {
      if (element.second_list[0]) {
        this.infoDatas.push(element.second_list[0].components);
      } else {
        this.infoDatas.push([]);
      }
      navDatas.push(element.second_list);
    });
    navDatas.forEach((element, k) => {
      //开启了一级导航才显示换一换
      // if (element.length > 6 && this.datas.show_first_tab) {
      //   element = element.slice(0, 7);
      // }
      element.forEach((el, i) => {
        if (i == 0) {
          el.tabSelectShow = el.id;
        }
      });
      this.allDatas.push(element);
    });
    this.show_first_tab = this.datas.show_first_tab;
    if (this.fun.getPhoneEnv() == 3) {
      this.noticeWidth = "375";
    } else {
      this.noticeWidth = document.body.clientWidth;
    }

    this.$nextTick(() => {
      window.addEventListener("scroll", this.handleScroll);
      setTimeout(() => {
        // 延迟获取高度
        this.getBoxHeight();
      }, 300);
    });
  },
  deactivated() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  watch: {},

  methods: {
    sliceMethod(info = [], index, status, show, minR) {
      if (minR == index) {
        if (show && status) {
          if (info.length < this.datas.list[this.minR].second_list.length) {
            this.$set(this.allDatas, index, this.datas.list[this.minR].second_list);
            return this.allDatas;
          }
          this.allDatas[index] = info;
          return info;
        } else {
          if (info.length <= 7) {
            return info;
          } else {
            let ainfo = info.slice(0, 7);
            this.allDatas[index] = ainfo;
            return ainfo;
          }
        }
      } else {
        return info;
      }
    },
    sliceTxt(str) {
      if (str.length > 2) {
        let strO = str.slice(0, 2);
        let strL = str.slice(2, str.length);
        return strO + "</br>" + strL;
      } else {
        return str;
      }
    },
    touchmoveTap(e) {},
    // 换一换
    async tapChange(index) {
      let second_list = this.datas.list[index].second_list;
      let allDatas = this.allDatas[index];
      let lastInd = allDatas.length - 1;
      let lastIndId = allDatas[allDatas.length - 1].id;
      let isLast = await this.tapchangeOne(lastInd, second_list, lastIndId);
      let arr;
      console.log(this.allDatas[index]);
      if (typeof isLast == "object") {
        arr = second_list.slice(isLast.ind, isLast.listinid);
      } else {
        arr = second_list.slice(lastInd + 1, isLast);
      }
      this.allDatas[index] = arr;
      this.$set(this.allDatas, index, arr);
    },
    tapchangeOne(lastInd, second_list, lastIndId) {
      return new Promise((resove, reject) => {
        let listinid = second_list.length - 1;
        second_list.forEach((element, i) => {
          if (element.id == lastIndId) {
            console.log(i);
            if (i == listinid) {
              let objind = {
                ind: 0,
                listinid: 7
              };
              resove(objind);
            }
            if (listinid - i >= 8) {
              console.log(listinid, i);
              resove(listinid);
            } else {
              let objind = {
                ind: i,
                listinid: listinid + 1
              };
              resove(objind);
            }
          }
        });
      });
    },
    // 换一换end
    // 多项选项卡 加载更多
    getKeyInd(allinfo, info, index) {
      return new Promise((resove, reject) => {
        let ainfo = allinfo[index];
        ainfo.forEach((element, i) => {
          if (element.tabSelectShow == element.id) {
            //取选中的数组
            resove(element);
          }
        });
      });
    },
    getAllKey(list, totalAll) {
      return new Promise((resove, reject) => {
        let all = totalAll.second_list;
        all.forEach((element, i) => {
          if (element.id == list.id) {
            //取选中的索引
            resove(i);
          }
        });
      });
    },
    // 查看更多
    async translateChild(item, info, index, ind) {
      let json = {
        page: info.remote_data.list.current_page + 1,
        decorate_id: this.page_id,
        component_id: this.id,
        component_key: this.component_key
      };
      let secondList = await this.getKeyInd(this.allDatas, info, index);
      let secondkey = await this.getAllKey(secondList, item);
      json.component_info = {
        list_key: index,
        second_list_key: secondkey,
        components_key: ind
      };
      json.component_info = JSON.stringify(json.component_info);
      $http.get("home-page.get-decorate-page", json, "loading").then(
        response => {
          if (response.result === 1) {
            let arr = [];
            arr = this.infoDatas[index][ind].remote_data.list.data.concat(response.data.data);
            this.infoDatas[index][ind].remote_data.list.data = arr;
            this.infoDatas[index][ind].remote_data.list.current_page = response.data.current_page;
            this.infoDatas[index][ind].remote_data.list.last_page = response.data.last_page;
            // 因为分页返回页数不准。每次要检查下一页分页是否有数据，后端提供的方案 #84138
            // this.checkMore(json, index, ind);
          }
        },
        function (response) {
          console.error(response);
          // error callback
        }
      );
    },
    // checkMore(json, index, ind) {
    //   json.page = json.page + 1;
    //   $http.get("home-page.get-decorate-page", json, "loading").then(
    //     response => {
    //       if (response.result === 1) {
    //         console.log(response.data.data);
    //         if (!response.data.data) {
    //           this.infoDatas[index][ind].remote_data.list.current_page = json.page - 1;
    //           this.infoDatas[index][ind].remote_data.list.last_page = json.page - 1;
    //           return;
    //         }
    //       }
    //     },
    //     function (response) {
    //       console.error(response);
    //       // error callback
    //     }
    //   );
    // },
    // 请求分类数据
    tapClassGet(json, index, ind, i) {
      return new Promise((resolve, reject) => {
        $http
          .post("home-page.get-decorate-page", json, "")
          .then(response => {
            if (response.result === 1) {
              let arr = response.data;
              // console.log(this.infoDatas, index, i);
              this.infoDatas[index][i].remote_data.list = arr;
              // this.childPos = false;
              this.getBoxHeight();
              this.leftTapBtn(index);
              resolve(true);
            }
          })
          .catch(err => {
            console.error(err, "app");
          });
      });
    },
    // 点击分类
    async tapClassDiv(index, ind) {
      // let component = this.datas.list[index].second_list[ind].components;
      // this.infoDatas[index].tabSelectShow = ind;
      let isnavId = this.allDatas[index][ind].id;
      let datasinfo = this.datas.list[index].second_list;
      let indexListTap = await this.tapClassDivGetind(datasinfo, isnavId);
      // 修改选中
      datasinfo.forEach(element => {
        element.tabSelectShow = "";
        if (element.id == isnavId) {
          element.tabSelectShow = element.id;
        }
      });
      //修改选中的数组
      this.$set(this.allDatas, index, this.allDatas[index]);
      let component = indexListTap.info.components;
      let componentKeyInd = indexListTap.key;
      this.$set(this.infoDatas, index, this.datas.list[index].second_list[componentKeyInd].components);

      for (let i = 0; i < component.length; i++) {
        if (component[i].uikey == "U_goods") {
          let json = {
            page: 1,
            decorate_id: this.page_id,
            component_id: this.id,
            component_key: this.component_key
          };
          json.component_info = {
            list_key: index,
            second_list_key: componentKeyInd,
            components_key: i
          };
          json.component_info = JSON.stringify(json.component_info);
          await this.tapClassGet(json, index, ind, i);
        }
      }
    },
    tapClassDivGetind(all, isnavId) {
      return new Promise((resolve, reject) => {
        all.forEach((element, i) => {
          if (element.id == isnavId) {
            let json = {
              key: i,
              info: element
            };
            resolve(json);
          }
        });
      });
    },
    leftTapBtn(ind) {
      let u_moretab = this.$refs.u_moretabcontrol;
      if (this.isFixed) {
        // let htma = document.getElementsByClassName("rightContenChild")[ind];
        // htma.scrollIntoView({ behavior: "smooth" });
        this.minR = ind;
        window.scrollTo(0, u_moretab.offsetTop + (this.listHeight[ind] + 5));
        // this.returnControl = false;
        // this.childPos = false;
      } else {
        window.scrollTo(0, u_moretab.offsetTop + (this.listHeight[ind] + 5));
      }
    },
    // stickChange(e) {
    //   if (!e.isFixed) {
    //     this.returnControl = true;
    //     this.childPos = false;
    //   }
    //   this.isFixed = e.isFixed;
    // },
    scrollEvent(e) {
      // let box = this.$refs.searchBar;
      var $this = this;
      // 监听这个dom的scroll事件
      // box.ontouchmove = () => {
      //   $this.handleScroll();
      // };
      // if(box.scrollTop == 0){
      //   window.scrollTo(0, this.$refs.tabInitBox.offsetTop-30);
      // }
      $this.handleScroll();
    },
    //获取滚动条当前的位置
    getScrollTop() {
      var scrollTop = 0;
      if (documentElement && documentElement.scrollTop) {
        scrollTop = documentElement.scrollTop;
      } else if (body) {
        scrollTop = body.scrollTop;
      }
      return scrollTop;
    },
    imgLoad(e) {
      this.getBoxHeight();
    },
    getBoxHeight() {
      this.listHeight = [];
      let rightItems = this.$refs.rightContenChild; //获取指定类名的所有元素
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < rightItems.length; i++) {
        let item = rightItems[i]; // 右边的每一个模块（蓝色标题 + 标题下面所带的内容）
        height += item.clientHeight;
        this.listHeight.push(height); // 把右边模块内容的高度全都放到一个数组中
      }
    },
    handleScroll() {
      let u_tab = this.$refs.u_moretabcontrol;
      // let oneHeight = document.scrollingElement.scrollTop || documentElement.scrollTop || body.scrollTop;
      // console.log(document.scrollingElement.scrollTop , documentElement.scrollTop , body.scrollTop)
      if (u_tab.offsetTop <= this.getScrollTop()) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
      this.getBoxHeight();
      // let scro = this.throlis();
      // if (!scro) return;
      // 右侧二级父元素 ref
      // let box = this.$refs.u_moretabcontrol;
      // 右侧二级内容子元素 ref
      // let min = this.$refs.rightContenChild;
      // checkarr 取当前是哪个子元素
      this.minR = this.checkarr(this.getScrollTop(), this.listHeight) ? this.checkarr(this.getScrollTop(), this.listHeight) : 0;
      this.changLeft(this.minR);
    },
    changLeft(minRR) {
      // console.log(this.recordTop , minRR)
      if (this.recordTop != minRR) {
        this.recordTop = minRR;
      } else if (this.recordTop == minRR) {
        // console.log('还在当前一级，左边不动');
        return;
      }
      if (this.isFixed) {
        let htma = document.getElementsByClassName("intoView");
        // let leftheight = document.getElementsByClassName("leftConten")[0].scrollHeight;
        if (this.minR <= 4) {
          document.getElementsByClassName("leftConten")[0].scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        let offsetTopmin = htma[this.minR - 4].offsetTop;
        console.log(offsetTopmin);
        document.getElementsByClassName("leftConten")[0].scrollTo({ top: offsetTopmin, behavior: "smooth" });
      }
    },
    showPos(min, minR) {
      // 右元素滚动距离
      let minRectHeight = Math.abs(min[minR].getBoundingClientRect().top);
      // 子元素高度
      let minOffsetHeight = min[minR].offsetHeight;
      // let twoClass = this.$refs.twoClass[minR].offsetHeight;
      if (minRectHeight < 99) {
        return false;
      }
      if (minRectHeight >= 99 && minRectHeight <= minOffsetHeight - 150) {
        return true;
      }
      if (minRectHeight > minOffsetHeight - 150) {
        return false;
      }
    },
    checkarr(Top, min) {
      let ind;
      let u_moretab = this.$refs.u_moretabcontrol;
      for (let i = 0; i < min.length; i++) {
        if (Top >= min[i] + u_moretab.offsetTop && Top < min[i + 1] + u_moretab.offsetTop) {
          ind = i;
        }
      }
      // console.log(Top , min[ind + 1] + u_moretab.offsetTop - 100)
      // console.log(u_moretab.offsetTop)
      if (Top >= min[ind] + u_moretab.offsetTop + 50 && Top < min[ind + 1] + u_moretab.offsetTop - 100) {
        this.childPos = true;
      } else {
        this.childPos = false;
      }
      return ind;
    }
    // throlis() {
    //   if (!this.returnControl) return false;
    //   this.returnControl = false;
    //   setTimeout(() => {
    //     this.returnControl = true;
    //   }, 100);
    //   return true;
    // },
    // gtouchstart(e) {
    //   this.returnControl = true;
    // },
    // gtouchend() {
    //   let box = this.$refs.searchBar;
    //   if (box.scrollTop < 10) {
    //     this.$refs.stickybox.style = "position: relative;overflow: hidden;height: 100vh;";
    //     console.log(this.$refs.stickybox.style);
    //     this.isFixed = false;
    //   }
    // }
  },
  components: {
    U_goods,
    U_simplegraph
  }
};
</script>
<style lang="scss" scoped>
.intoShowView {
  animation: ident 0.3s;
}

@keyframes ident {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 1;
  }
}

.pcStyle {
  width: 325px;
  margin: 0 auto;
}
// 一级分类
.leftConten {
  // position: fixed;
  // top: 0;
  height: calc(100vh - 50px);
  padding-bottom: 15vh;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  .intoViewActive {
    z-index: 999;
    position: absolute;
    width: 57px;
    height: 4.06rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    margin-left: -1px;
  }

  .intoView {
    z-index: 999;
    position: relative;
    width: 57px;
    height: 4.06rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    margin-left: -1px;

    img {
      width: 100%;
      display: block;
      font-size: 0;
    }
  }
}
//置顶样式
.isrigheOverY {
  width: 85% !important;
  // overflow-y: auto;
  // padding-bottom: 15vh;
}

.leftIsfix {
  overflow-y: auto;
  position: sticky;
  top: 0;
  left: 0;
}
// 一级分类标题置顶 start
.isfix {
  position: fixed;
  transition: 0.3s;
  top: 0;
  z-index: 9;
}

.nonefix {
  transition: 0.3s;
}
// 一级分类标题置顶 end
// 二级选项卡 start 一级选项卡显示的样式
.twoIsfix {
  position: sticky;
  transition: 0.3s;
  top: 0;
  left: 57px;
  right: 0;
  z-index: 9;
  display: flex;
  overflow-x: auto;
  // flex-wrap: wrap;
  padding-top: 0.3rem;
  padding-left: 0.3rem;

  .classDiv {
    margin-right: 0.35rem;
  }

  .ChangeDiv {
    // margin-left: 0.3rem;
    // margin-right: 0.35rem;
  }
}
// 一级选项卡不显示的样式
.twoIsfixNoneOne {
  position: sticky;
  transition: 0.3s;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
  display: flex;
  overflow-x: auto;
  padding-top: 0.3rem;
  padding-left: 0.3rem;
}

.twoNonefix {
  transition: 0.3s;
  display: flex;
  flex-wrap: wrap;
  // padding-left: 0.3rem;
  padding-right: 0.4rem;

  .classDiv {
    margin-left: 0.35rem;
  }

  .ChangeDiv {
    margin-left: 0.35rem;
    // margin-right: 0.35rem;
  }
}

.twoNonefixOne {
  width: 100%;
  display: flex;
  overflow-x: auto;
  padding: 0.35rem 0.35rem 0 0.35rem;
}

// 二级选项卡 end
.isfixPadding {
  padding-top: 5rem;
}

.isfixPaddingShowNo {
  padding-top: 2rem;
}

// 二级
.rightConten {
  // min-height: 101vh;
  flex: 1;

  .rightContenChild {
    // width: 100%;
    // min-height: 101vh;

    // 二级分类
    .featured {
      width: 100%;
      text-align: left;
      padding: 0.6rem 0;
      font-size: 0.88rem;
      padding-left: 0.35rem;
      display: flex;
      align-content: center;
    }

    .beforeLine {
      width: 0.13rem;
      height: 1rem;
      margin-right: 0.3rem;
    }

    .selectDivClass {
      width: 4.53rem;
      text-align: center;
      padding: 0.35rem 0;
      // margin-bottom: 0.5rem;
      font-size: 0.75rem;
    }

    .classDiv {
      width: 23%;
      height: 2rem;
      text-align: center;
      padding: 0.35rem 0;
      margin-bottom: 5px;
      font-size: 0.75rem;
      flex-shrink: 0;
      // margin-right: 0.35rem;
    }
    // .classDiv:nth-child(n+5) {
    // margin-right: 0;
    // }
    .classDivNoneOne {
      width: 4.53rem;
      text-align: center;
      padding: 0.35rem 0;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
      flex-shrink: 0;
      margin-right: 1rem;
    }
    // 换一换标签
    .ChangeDiv {
      width: 4.53rem;
      height: 2rem;
      text-align: center;
      padding: 0.35rem 0;
      // margin-bottom: 0.5rem;
      font-size: 0.75rem;
      flex-shrink: 0;
      overflow: hidden;
      box-sizing: border-box;

      .iconfont {
        font-size: 14px;
      }
    }
  }
  // 列表
  .lisView {
    padding: 0.35rem;
    padding-top: 0;

    .lis {
      height: 3rem;
    }

    .lisGetMore {
      width: 16.88rem;
      height: 2.2rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.81rem;
      color: #fff;
      margin: 0 auto;
    }
  }
  // 置顶时占位
  .lisViewPos {
    // padding-top: ;
  }

  .maxBox {
    height: 5.3rem;
    opacity: 0;
  }
}
</style>