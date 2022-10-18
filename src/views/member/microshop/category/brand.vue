<template>
	<div id="brand">
		<c-title :hide="false" text='品牌'></c-title>
		<div id="category-content" ref="menucontent">
			<div id="carcontent">
		<div class="branch" v-if="0"><img :src="list.branch"/></div>
			<ul>
				<li v-for="(brand,index) in contentlist.data" :key="index">
					<router-link :to="fun.getUrl('brandgoods',{id:brand.id,fromHome: 1})">
						<div class="thumb"><img :src="brand.logo" />{{brand.logo}}</div>
						<span>{{brand.name}}</span>
					</router-link>
				</li>
			</ul>

			</div>
		</div>
<div style="height: 5rem; clear: both; display: block;"></div>
	</div>
</template>

<script>
// import { mapState } from 'vuex';
import cTitle from 'components/title';
// import cCarcontent from 'components/carcontent';
import BScroll from 'better-scroll';

export default {
  data() {
    return {
      active: 99,
      allLoaded: false,
      topStatus: '',
      turl: '/category',
      arg: { index: 10, item: 'pinch' },
      list: [],
      toi:this.fun.getKeyByI(),
      types:this.fun.getTyep(),
      contentlist: {}
    };
  },
  methods: {
    tabsa(n, i) {

      this.$refs.bplista.className='';
      this.active = n;
      this.getContentlist(i);
    },
    bpfun(){
      this.active=99;
      this.$refs.bplista.className='active';
      this.$router.push('/brand');
    },
    getContentlist(id){
      $http.get('goods.brand.get-brand').then((json) => {
        if(json.result == 1) {
          this.contentlist=json.data;
          console.log(json.data);
          //						 this.$nextTick(() => {
          //						 	this._initScroll(this.$refs.menucontent)
          //						 })
        }
      });
    },
    _initScroll (doc) {
      this.menuScroll = new BScroll(doc, {click: true});
    }
  },
  mounted(){

    this.getContentlist();

  },
  components: { cTitle }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#brand {
  #rootlists {
    height: 100vh;
    overflow: hidden;
    width: 23%;
    float: left;
    border-right: 0.0625rem solid #d9d9d9;
  }

  #category-content {
    margin-top: 3.125rem;
    background: #fff;
    overflow: hidden;
    width: 100%;

    #carcontent {
      padding: 1.25rem 0;
      word-wrap: break-word;
    }
  }
}

#rootList {
  width: 100%;
  background: #fff;
  font-size: 12px;

  .active {
    color: red;
  }

  li {
    line-height: 2.875rem;
    border-bottom: solid 0.0625rem #e5e5e5;
  }
}

#carcontent {
  background: #fff;
  color: #686868;
  .sote { clear: both; overflow: hidden; }
  h3 { text-align: left; font-size: 14px; margin: 0; padding: 0.3125rem 0.4375rem; font-weight: normal; display: block; clear: both; color: #000; }

  a span {
    height: 1.9375rem;
    color: #686868;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    overflow: hidden;
  }
  .branch img { width: 100%; }
  .thumb { line-height: 25vw; height: 25vw; overflow: hidden; }
  ul { margin-right: -1.875rem; clear: both; }

  li {
    width: 22%;
    text-align: center;
    float: left;
    margin-bottom: 0.625rem;
    margin-right: 1%;
    font-size: 12px;
    box-sizing: border-box;
    img { width: 80%; }
  }
}
</style>
