

import { Toast } from 'vant';

export default {
  data(){
    return {
      ruleFlag:false,
      ruleContext:'',
      provinceList:[],	//省
      cityList:[],	//市
      areaList:[],	//区
      streetList:[],	//街道

      provinceItem:null,
      cityItem:null,
      areaItem:null,
      streetItem:null,
			
      flootIndex:null,
			
      currentSelectedLevel:0,

      renderingList:[],
      childrenList:[]
    };
  },
  created(){
    //this.initData();
    //this.setRendering();
    // this.getProvinceList(0);
    // this.getRule();
  },
  activated(){
    this.initData();
    this.getProvinceList(0);
    this.getRule();

  },
  methods:{
    initData(){
      this.currentSelectedLevel = 0;
      this.provinceList=[];
      this.cityList=[];
      this.areaItem=[];
      this.streetItem=[];
      this.provinceItem=null;
      this.cityItem = null;
      this.areaItem=null;
      this.streetItem=null;
      this.flootIndex = null;
    },
    async getProvinceList(parent_id){
			

      Toast.loading({
        message: '搜索中',
        forbidClick: true,
      });
      let res = await $http.get("plugin.agent-enquiry.Frontend.controllers.list.get-area",{
        parent_id
      });
      Toast.clear();
      if(res.result !=1 ){
        Toast(res.msg);
        return;
      }
      if(res.data.leng == 0){
        Toast("没下级了");
        return;
      }
			
			
      this.currentSelectedLevel++;

      if(this.currentSelectedLevel==1){
        this.provinceList = res.data;
        this.setRendering();
      }else if(this.currentSelectedLevel==2){
        this.cityList = res.data;
      }else if(this.currentSelectedLevel==3){
        this.areaList = res.data;
      }else if(this.currentSelectedLevel==4){
        this.streetList = res.data;
      }

      if(this.currentSelectedLevel!=1){
        this.childrenList = res.data;
      }
			
			
			

    },
    setRendering(){
      this.renderingList = [];
      let leng = Math.ceil(this.provinceList.length/4);
      let index = 0;
      for(let i=0;i<leng;i++){
        let arr = [];
        console.log(index);
        for(let j=index;j<this.provinceList.length;j++){
          arr.push(this.provinceList[j]);
          if((j+1)==this.provinceList.length){
            this.renderingList.push(arr);
            break;
          }else if(arr.length==4){
            index=j+1;
            this.renderingList.push(arr);
            break;
          }
					
        }
      }
      console.log(this.renderingList);

    },
    handChildren(item){
      console.log(this.currentSelectedLevel);
      if(this.currentSelectedLevel == 2){
        this.cityItem = item;
      }else if(this.currentSelectedLevel == 3){
        this.areaItem = item;
      }else if(this.currentSelectedLevel == 4){
        this.streetItem = item;
      }
      if(this.currentSelectedLevel == 4) return;
			
      this.getProvinceList(item.id);
    },
    handProvinceClick(item,floor){
      if(this.provinceItem && item.id == this.provinceItem.id){
        console.log('1');
      }else {
        this.currentSelectedLevel=1;
        this.cityItem=null;
        this.areaItem=null;
        this.streetItem=null;
        this.flootIndex = floor;
        this.provinceItem = item;
        this.getProvinceList(item.id);
      }
			
    },

    handSelectedProvince(){
      this.cityItem=null;
      this.areaItem=null;
      this.streetItem=null;
			
      this.currentSelectedLevel = 2;
      this.childrenList = this.cityList;
    },
    handSelectedCity(){
      this.areaItem=null;
      this.streetItem=null;
      console.log(this.areaList);
      this.currentSelectedLevel = 3;
      this.childrenList = this.areaList;
    },
    handSelectedArea(){
      this.streetItem=null;
    },
    gotoResult(){
      console.log(this.currentSelectedLevel);
      let {provinceItem,cityItem,areaItem,streetItem} = this;
      let obj = null;
      if(streetItem != null){
        obj = streetItem;
      }else if(areaItem != null){
        obj = areaItem;
      }else if(cityItem != null){
        obj = cityItem;
      }else if(provinceItem != null){
        obj = provinceItem;
      }

      if(obj == null) return Toast("请选择需要查询的区域");
      console.log(obj);
      this.$router.push(
        this.fun.getUrl("regionalAgentResult",{},{area_id:obj.id,level:obj.level})
      );

    },
    gotoSearch(){
      this.$router.push(
        this.fun.getUrl("regionalAgentSearch",{},{})
      );
    },
    async getRule(){
      let res = await $http.get("plugin.agent-enquiry.Frontend.controllers.list.get-rule");
      if(res.result !=1 ){
        Toast(res.msg);
        return;
      }
      this.ruleContext = res.data;
      console.log(res.data);
    }
  }
};