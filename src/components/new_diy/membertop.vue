<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="html-box" v-if="datas.preview_color">

      <div class="header" v-if="datas.style_align == 'left' && datas.choose_style == 'one'">
        <div class="header-info">
          <div class="left" @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-info">
            <div class="user-name name-one">
              <span class="name-a nickname">{{ member_item.nickname }}</span>
              <img   src="../../assets/images/micro_communities/home_autograph@2x.png"  @click="introductionInp"  style="width:20px;height:auto;"/>
              <span class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }} </span>
            </div>
            <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
              <input type="hidden" v-model="member_item.inviteCode.code" />
              <span class="inviteTxt">邀请码：{{ member_item.inviteCode.code }}</span>
              <button class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError">
                复制
              </button>
            </div>
          </div>
          <div class="member-box" style="z-index: 2;" v-if="datas.show_grade" @click="gotoMemberGrade">
            <i class="iconfont icon-member-enter"></i>
            <div class="font" style="max-width: 3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ datas.grade_type == '1'? member_item.level_name :datas.levelname }}</div>
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>

      <div class="header" v-if="datas.style_align == 'right' && datas.choose_style == 'one'">
        <div class="header-info">
          <div class="user-info">
            <div class="user-name name-one">
              <span class="name-a nickname">{{ member_item.nickname }}</span>
              <img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <span class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }} </span>
            </div>
            <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
              <input type="hidden" v-model="member_item.inviteCode.code" />
              <span class="inviteTxt">邀请码：{{ member_item.inviteCode.code }}</span>
              <button class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError">
                复制
              </button>
            </div>
          </div>
          <div class="left" style="margin-right: 28%;"   @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="member-box" style="z-index: 2;" v-if="datas.show_grade" @click="gotoMemberGrade">
            <i class="iconfont icon-member-enter"></i>
            <div class="font" style="max-width: 3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ datas.grade_type == '1'? member_item.level_name :datas.levelname }}</div>
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>

      <div class="header" v-if="datas.style_align == 'center' && datas.choose_style == 'one'">
        <div class="header-info_center">
          <div class="left"  @click="seeAvatarImg(member_item.uid)"">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-info" style="margin-left: 0;">
            <div class="user-name name-one">
              <span class="name-a nickname">{{ member_item.nickname }}</span>
              <img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <span class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }} </span>
            </div>
            <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
              <input type="hidden" v-model="member_item.inviteCode.code" />
              <span class="inviteTxt">邀请码：{{ member_item.inviteCode.code }}</span>
              <button class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError">
                复制
              </button>
            </div>
          </div>
          <div class="member-box" style="z-index: 2;" v-if="datas.show_grade" @click="gotoMemberGrade">
            <i class="iconfont icon-member-enter"></i>
            <div class="font" style="max-width: 5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ datas.grade_type == '1'? member_item.level_name :datas.levelname }}</div>
            <i class="fa fa-angle-right"></i>
          </div>
        </div>
      </div>

      <div class="header-two-left" v-if="datas.style_align == 'left' && datas.choose_style == 'two'">
        <div class="header-info">
          <div class="left"  @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-info">
            <div class="user-name">
              <div class="name-a nickname" style="max-width: 11.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }}</div>
            </div>
            <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
              <div class="name-a inviteTxt">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
          <div class="member-box"  v-if="datas.show_grade" @click="gotoMemberGrade">
            <div class="box">
              <i class="iconfont icon-member-enter"></i>
              <div class="level">{{datas.grade_type == '1'? member_item.level_name :datas.levelname}}</div>
              <div class="member_btn">
                <span>点击查看</span>
                <i class="iconfont icon-member_look"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="header-two-center" v-if="datas.style_align == 'center' && datas.choose_style == 'two'">
        <div class="header-info">
          <div class="left"  @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-name">
            <div class="name-a nickname" style="max-width: 15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
            <div class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }}</div>
          </div>
          <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
            <div class="name-a inviteTxt">邀请码：{{ member_item.inviteCode.code }}</div>
            <div class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                 v-clipboard:success="onCopy"
                 v-clipboard:error="onError">复制</div>
          </div>
          <div class="member-box" v-if="datas.show_grade" @click="gotoMemberGrade">
            <div class="box">
              <i class="iconfont icon-member-enter"></i>
              <div class="level">{{datas.grade_type == '1'? member_item.level_name :datas.levelname}}</div>
              <div class="member_btn">
                <span>点击查看</span>
                <i class="iconfont icon-member_look"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="header-two-right" v-if="datas.style_align == 'right' && datas.choose_style == 'two'">
        <div class="header-info">
          <div class="user-info">
            <div class="user-name">
              <div class="name-a nickname" style="max-width: 11.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }}</div>
            </div>
            <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
              <div class="name-a inviteTxt">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
          <div class="left"   @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="member-box" v-if="datas.show_grade" @click="gotoMemberGrade">
            <div class="box">
              <i class="iconfont icon-member-enter"></i>
              <div class="level">{{datas.grade_type == '1'? member_item.level_name :datas.levelname}}</div>
              <div class="member_btn">
                <span>点击查看</span>
                <i class="iconfont icon-member_look"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="header-three-left" v-if="datas.style_align == 'left' && datas.choose_style == 'three'">
        <div class="header-info">
          <div class="left"  @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-info">
            <div class="user-name">
              <div class="name-a nickname" style="max-width: 6rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }}</div>
            </div>
            <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
              <div class="name-a inviteTxt">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
          <div class="member-box" style="position: absolute; right: 0; bottom: 0;" v-if="datas.show_grade" @click="gotoMemberGrade">
            <div class="box">
              <div class="level">
                <i class="iconfont icon-member-enter"></i>
                {{datas.grade_type == '1'? member_item.level_name :datas.levelname}}
              </div>
              <div class="member_btn">
                点击查看
                <i class="iconfont icon-member_look"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="header-three-center"
        v-if="datas.style_align == 'center' && datas.choose_style == 'three'"
      >
        <div class="header-info">
          <div class="left">
            <div class="left-a"  @click="seeAvatarImg(member_item.uid)">
              <img :src="member_item.avatar"/>
            </div>
          </div>
          <div style="width: 5rem;"></div>
          <div class="user-info" :style="{flex: datas.show_grade?'1':'',marginLeft: datas.show_grade?'15px':'30px'}">
            <div class="user-name">
              <div class="name-a nickname" style="max-width: 6rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }}</div>
            </div>
            <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
              <div class="name-a inviteTxt">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
          <div class="member-box" v-if="datas.show_grade" @click="gotoMemberGrade">
            <div class="box">
              <div class="level">
                <i class="iconfont icon-member-enter"></i>
                {{datas.grade_type == '1'? member_item.level_name :datas.levelname}}
              </div>
              <div class="member_btn">
                点击查看
                <i class="iconfont icon-member_look"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="header-three-right"
        v-if="datas.style_align == 'right' && datas.choose_style == 'three'"
      >
        <div class="header-info">
          <div class="user-info">
            <div class="user-name">
              <div class="name-a nickname" style="max-width: 6rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b idStyle" v-if="datas.show_ID">ID:{{ member_item.uid }}</div>
            </div>
            <div class="name_invite" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
              <div class="name-a inviteTxt">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
          <div class="left" style="margin-right: 85px;"   @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="member-box" style="position: absolute; right: 0; bottom: 0;" v-if="datas.show_grade" @click="gotoMemberGrade">
            <div class="box">
              <div class="level">
                <i class="iconfont icon-member-enter"></i>
                {{datas.grade_type == '1'? member_item.level_name :datas.levelname}}
              </div>
              <div class="member_btn">
                点击查看
                <i class="iconfont icon-member_look"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="header-four-left"
        v-if="datas.style_align == 'left' && datas.choose_style == 'four'"
      >
        <div class="header-info">
          <div class="left"   @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-info">
            <div class="user-name">
              <div class="name-a nickname" style="width: 9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b" v-if="datas.show_grade" @click="gotoMemberGrade">
                <div class="name-b0">
                  <div class="name-b-a">
                    <i class="iconfont icon-member-enter"></i>
                  </div>
                </div>
                <div class="name-b-b" style="font-size: 12px; max-width: 7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{datas.grade_type == '1'? member_item.level_name :datas.levelname}}</div>
              </div>
            </div>
            <div class="name_invite">
              <div class="name-c idStyle" v-if="datas.show_ID">ID：{{ member_item.uid }}</div>
              <div class="name-a inviteTxt" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="header-four-center"
        v-if="datas.style_align == 'center' && datas.choose_style == 'four'"
      >
        <div class="header-info">
          <div class="left" :style="{ marginBottom: datas.show_grade?'':'8px'}"   @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-level" v-if="datas.show_grade" @click="gotoMemberGrade">
            <div class="name-b">
              <div class="name-b0">
                <div class="name-b-a">
                  <i class="iconfont icon-member-enter"></i>
                </div>
              </div>
              <div class="name-b-b" style="font-size: 12px; max-width: 7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{datas.grade_type == '1'? member_item.level_name :datas.levelname}}</div>
            </div>
          </div>
          <div class="user-name nickname" style="display: block; max-width: 20rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
          <div class="name_invite">
            <div class="name-c idStyle" v-if="datas.show_ID">ID：{{ member_item.uid }}</div>
            <div class="name-a inviteTxt" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">邀请码：{{ member_item.inviteCode.code }}</div>
            <div class="copybtn" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status" v-clipboard:copy="member_item.inviteCode.code"
                 v-clipboard:success="onCopy"
                 v-clipboard:error="onError">复制</div>
          </div>
        </div>
      </div>

      <div
        class="header-four-right"
        v-if="datas.style_align == 'right' && datas.choose_style == 'four'"
      >
        <div class="header-info">
          <div class="user-info">
            <div class="user-name">
              <div class="name-a nickname" style="width: 9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b" v-if="datas.show_grade" @click="gotoMemberGrade">
                <div class="name-b0">
                  <div class="name-b-a">
                    <i class="iconfont icon-member-enter"></i>
                  </div>
                </div>
                <div class="name-b-b" style="font-size: 12px; max-width: 7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{datas.grade_type == '1'? member_item.level_name :datas.levelname}}</div>
              </div>
            </div>
            <div class="name_invite">
              <div class="name-c idStyle" v-if="datas.show_ID">ID：{{ member_item.uid }}</div>
              <div class="name-a inviteTxt" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
          <div class="left"  @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
        </div>
      </div>

      <div
        class="header-five-left"
        v-if="datas.style_align == 'left' && datas.choose_style == 'five'"
      >
        <div class="header-info">
          <div class="left"  @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-info">
            <div class="user-name">
              <div class="name-a nickname" style="width: 9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b" style="font-size: 12px; max-width: 7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" v-if="datas.show_grade" @click="gotoMemberGrade">
                <i class="iconfont icon-member-enter"></i>
                {{datas.grade_type == '1'? member_item.level_name :datas.levelname}}
              </div>
            </div>
            <div class="name_invite">
              <div class="name-c idStyle" v-if="datas.show_ID">ID：{{ member_item.uid }}</div>
              <div class="name-a inviteTxt" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="header-five-center"
        v-if="datas.style_align == 'center' && datas.choose_style == 'five'"
      >
        <div class="header-info">
          <div class="left" :style="{ marginBottom: datas.show_grade?'':'8px'}"  @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
          <div class="user-level" v-if="datas.show_grade" @click="gotoMemberGrade">
            <div class="name-b" style="font-size: 12px; max-width: 7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 24px;">
              <i class="iconfont icon-member-enter"></i>
              {{datas.grade_type == '1'? member_item.level_name :datas.levelname}}
            </div>
          </div>
          <div class="user-name nickname" style="display: block; max-width: 20rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
          <div class="name_invite">
            <div class="name-c idStyle" v-if="datas.show_ID">ID：{{ member_item.uid }}</div>
            <div class="name-a inviteTxt" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">邀请码：{{ member_item.inviteCode.code }}</div>
            <div class="copybtn" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status" v-clipboard:copy="member_item.inviteCode.code"
                 v-clipboard:success="onCopy"
                 v-clipboard:error="onError">复制</div>
          </div>
        </div>
      </div>

      <div
        class="header-five-right"
        v-if="datas.style_align == 'right' && datas.choose_style == 'five'"
      >
        <div class="header-info">

          <div class="user-info">
            <div class="user-name">
              <div class="name-a nickname" style="width: 9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ member_item.nickname }}</div><img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
              <div class="name-b" style="font-size: 12px; max-width: 7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" v-if="datas.show_grade" @click="gotoMemberGrade">
                <i class="iconfont icon-member-enter"></i>
                {{datas.grade_type == '1'? member_item.level_name :datas.levelname}}
              </div>
            </div>
            <div class="name_invite">
              <div class="name-c idStyle" v-if="datas.show_ID">ID：{{ member_item.uid }}</div>
              <div class="name-a inviteTxt" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">邀请码：{{ member_item.inviteCode.code }}</div>
              <div class="copybtn" v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status" v-clipboard:copy="member_item.inviteCode.code"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制</div>
            </div>
          </div>
          <div class="left"  @click="seeAvatarImg(member_item.uid)">
            <img :src="member_item.avatar"/>
          </div>
        </div>
      </div>    

      <van-popup v-model="mainCommentShow" position="bottom" >
        <div class="replyMainComment">
          <div class="left">
            <van-field v-model="maincomment"  rows="1" autosize type="textarea" placeholder="请填写你的新昵称" />
          </div>
          <div class="right" @click="subMainBtn">发送</div>
        </div>
      </van-popup>

    </div>
  </div>
</template>

<script>
import emptyImage from "@/assets/images/new_diy/image.png";
import { Toast } from 'vant';
// 自定义样式
const css = function() {
  if(this.datas.preview_color) {
    const {
      preview_color,
      text_color,
      invite_text_color,
      id_text_color
    } = this.datas;

    return `
      .component-${this.id} .html-box {
          background-color: ${preview_color.color};
          background-image: url(${preview_color.isColor == 2? preview_color.image: ''});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
      }

      .component-${this.id} .nickname {
          color: ${text_color};
      }

      .component-${this.id} .name_invite .inviteTxt {
          color: ${invite_text_color};
      }

      .component-${this.id} .idStyle{
        color:${id_text_color} !important;
      }
  `;
  }
};

export default {
  props: ["id", "datas", "member_item", "isClick"],
  data() {
    return {
      mainCommentShow: false,
      emptyImage,
      maincomment:''
    };
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
  },
  mounted() {},
  methods: {
    //点击头像跳转查看头像大图页面
    seeAvatarImg(userid){
      this.$router.push(this.fun.getUrl("MemberAvatar",{ id: userid }));
    },
    //修改昵称 start
    introductionInp() {
      this.mainCommentShow = true;
    },
    subMainBtn() {
      if (!this.maincomment) {
        Toast("请填写你的新昵称");
        return false;
      }
      let that = this;
      let dataJson = {};
      dataJson.nickname = that.maincomment;
      //alert('成功触发提交');
      $http
        .post("member.member.updNickname", dataJson, "")
        .then(response => {
          if (response.result == 1) {
            that.$set(that.member_item, "nickname", that.maincomment);
            Toast(response.msg);
            that.mainCommentShow = false;
          } else {
            Toast(response.msg);
            that.mainCommentShow = false;
          }
        });
    },
    //修改昵称  end
    gotoMemberGrade() {
      // grade_type：会员等级类型
      if (this.isClick && this.datas.grade_type == '1') {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      }else if (this.datas.grade_type == '2') {
        // 经销商等级
        if(!this.datas.levelname && !this.datas.isagent){
          this.$router.push(this.fun.getUrl("ExtensionApply"));
        }else {
          this.$router.push(this.fun.getUrl("teamAgentCenter"));
        }
      }else if (this.datas.grade_type == '3') {
        // 分销商等级
        if(!this.datas.levelname && !this.datas.isagent){
          this.$router.push(this.fun.getUrl("ExtensionApply"));
        }else {
          this.$router.push(this.fun.getUrl("distribution"));
        }
      }
    },
    // 复制邀请码
    onCopy: function(e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    width: 375/37.5rem;
  }

  .html-box {
    text-align: left;
    min-height: 30px;

    .copybtn {
      font-size: 12px;
      color: #666;
      background-color: #f5f5f5;
      border: solid 1px #ebebeb;
      border-radius: 32px;
      margin-left: 8px;
      padding: 0 12px;
      height: 26px;
      line-height: 22px;
    }

    .replyMainComment {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      padding-left: 1rem;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      .left {
        width: 18.13rem;
        background-color: #f5f5f5;
        padding: 0.2rem;
        .van-cell{
          padding:5px;
        }
      }

      .right {
        width: 3rem;
        height: 1.88rem;
        font-size: 0.94rem;
        line-height: 1.88rem;
        color: #333;
      }
    }
  }

  .header { 
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .icon {
      text-align: right;
      position: relative;

      i {
        font-size: 20px;
        color: #fff;
      }
    }

    .header-info {
      display: flex;
      position: relative;

      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;

        /* border: solid 2px #ebebeb; */
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .user-info {
        flex: 1;
        margin-left: 10px;
        text-align: left;
        color: #333;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name-one {
          line-height: 30px;
          color: #333;
          display: flex;
          align-items: center;
        }

        .name-a {
          font-size: 16px;
          font-weight: 600;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .name-b {
          background: #f5f5f5;
          border-radius: 25px;
          margin-left: 10px;
          padding: 0 10px;
          height: 28px;
          line-height: 27px;
          color: #333;
        }


        .name_invite {
          font-size: 13px;
          line-height: 30px;

          /* margin-top: 10px; */
        }

        .user-name {
          color: #333;
          line-height: 28px;
        }

        .user-other {
          color: #8c8c8c;
          line-height: 28px;
        }
      }

      .member-box {
        align-content: center;
        background: linear-gradient(to right, #3b3b4f, #9898a4);
        border-radius: 60px;
        display: flex;
        position: absolute;
        right: 0;
        color: #fff;
        padding: 0 6px;
        margin-top: 10px;

        .font {
          font-size: 12px;
          right: 14px;
          line-height: 30px;
        }

        .iconfont {
          font-size: 20px;
          color: #fff;
          margin-right: 4px;
        }

        .fa {
          line-height: 30px;
          font-size: 16px;
          color: #fff;
          margin-left: 6px;
        }

        .img {
          width: 96px;
          height: 32px;
          overflow: hidden;
          position: absolute;
          right: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .member-box {
        display: flex;
        align-content: center;
        position: absolute;
        right: 0;
        color: #fff;

        .font {
          font-size: 12px;
          right: 14px;
        }

        .iconfont {
          line-height: 30px;
          font-size: 20px;
        }

        .img {
          width: 96px;
          height: 32px;
          overflow: hidden;
          position: absolute;
          right: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .header-info_center {
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;

      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;

        /* border: solid 2px #ebebeb; */
        overflow: hidden;
        margin-bottom: 10px;

        img {
          width: 100%;
        }
      }

      .user-info {
        margin-left: 10px;
        text-align: left;
        color: #333;

        .name-one {
          line-height: 30px;
          color: #333;
          display: flex;
          align-items: center;

        }

        .name-a {
          font-size: 16px;
          font-weight: 600;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .name-b {
          background: #f5f5f5;
          border-radius: 25px;
          margin-left: 10px;
          padding: 0 10px;
          height: 28px;
          line-height: 27px;
          color: #333;
        }

        .name_invite {
          font-size: 13px;
          line-height: 30px;
        }

        .user-name {
          color: #333;
          line-height: 18px;
          margin: 0 auto 10px auto;
          justify-content: center;
        }

        .user-other {
          color: #8c8c8c;
          line-height: 18px;
        }
      }

      .member-box {
        align-content: center;
        background: linear-gradient(to right, #3b3b4f, #9898a4);
        border-radius: 60px;
        display: flex;
        position: absolute;
        right: 0;
        color: #fff;
        padding: 0 6px;
        margin-top: 17px;

        .font {
          font-size: 12px;
          right: 14px;
          line-height: 30px;
        }

        .iconfont {
          font-size: 20px;
          color: #fff;
          margin-right: 4px;
        }

        .fa {
          line-height: 30px;
          font-size: 16px;
          color: #fff;
          margin-left: 6px;
        }

        .img {
          width: 96px;
          height: 32px;
          overflow: hidden;
          position: absolute;
          right: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .member-box {
        display: flex;
        align-content: center;
        position: absolute;
        right: 0;
        color: #fff;

        .font {
          font-size: 12px;
          right: 14px;
        }

        .iconfont {
          line-height: 30px;
          font-size: 20px;
        }

        .img {
          width: 96px;
          height: 32px;
          overflow: hidden;
          position: absolute;
          right: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .header-two-left {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;
      flex-wrap: wrap;

      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-info {
        flex: 1;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-name {
          display: flex;
          line-height: 28px;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            background: #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            background: #fff;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
          }
        }
      }

      .member-box {
        margin-top: 5px;
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        overflow: hidden;

        .box {
          width: 98%;
          height: 40px;
          margin: 0 auto;
          padding: 0 10px;
          display: flex;
          border-radius: 8px;
          background: linear-gradient(to right, #3b3b4f, #9898a4);
          overflow: hidden;
          position: relative;
          color: #fff;

          .icon-member-enter {
            position: absolute;
            z-index: 0;
            top: -5px;
            left: -20px;
            font-size: 156px;
            color: #333;
            opacity: 0.4;
            transform: rotate(30deg);
            -webkit-transform: rotate(30deg);
            margin: 0 auto;
            height: 40px;
            line-height: 40px;
            border-radius: 8px 8px 0 0;
          }

          .level {
            flex: 1;
            z-index: 1;
            position: relative;
            line-height: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #e6c785;
          }

          .member_btn {
            background: linear-gradient(to right, #f2e1aa, #e6c785);
            color: #3c3c50;
            height: 30px;
            line-height: 30px;
            padding: 0 16px;
            border-radius: 16px;
            font-size: 12px;
            margin: auto 0;
          }
        }
      }
    }
  }

  .header-two-center {
    height: auto;

    /* background-color: #fff; */
    padding: 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      align-items: center;

      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10px;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-name {
        display: flex;
        line-height: 28px;
        margin-bottom: 10px;

        .name-a {
          font-size: 16px;

          /* color: #333; */
          font-weight: 600;
          margin-right: 10px;
        }

        .name-b {
          background: #f5f5f5;
          border-radius: 25px;
          padding: 0 15px;
        }
      }

      .name_invite {
        display: flex;
        line-height: 28px;

        .name-a {
          color: #333;
          font-size: 13px;
        }

        .name-b {
          margin-left: 10px;
          background: #fff;
          border: 1px solid #f5f5f5;
          border-radius: 25px;
          padding: 0 15px;
        }
      }

      .member-box {
        margin-top: 5px;
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        overflow: hidden;

        .box {
          width: 98%;
          height: 40px;
          margin: 0 auto;
          padding: 0 10px;
          display: flex;
          border-radius: 8px;
          background: linear-gradient(to right, #3b3b4f, #9898a4);
          overflow: hidden;
          position: relative;
          color: #fff;

          .icon-member-enter {
            position: absolute;
            z-index: 0;
            top: -5px;
            left: -20px;
            font-size: 156px;
            color: #333;
            opacity: 0.4;
            transform: rotate(30deg);
            -webkit-transform: rotate(30deg);
            margin: 0 auto;
            height: 40px;
            line-height: 40px;
            border-radius: 8px 8px 0 0;
          }

          .level {
            flex: 1;
            z-index: 1;
            position: relative;
            line-height: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #e6c785;
          }

          .member_btn {
            background: linear-gradient(to right, #f2e1aa, #e6c785);
            color: #3c3c50;
            height: 30px;
            line-height: 30px;
            padding: 0 16px;
            border-radius: 16px;
            font-size: 12px;
            margin: auto 0;
          }
        }
      }
    }
  }

  .header-two-right {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;
      flex-wrap: wrap;

      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-info {
        flex: 1;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-name {
          display: flex;
          line-height: 28px;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            background: #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            background: #fff;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
          }
        }
      }

      .member-box {
        margin-top: 5px;
        width: 100%;
        box-sizing: border-box;
        height: 40px;
        overflow: hidden;

        .box {
          width: 98%;
          height: 40px;
          margin: 0 auto;
          padding: 0 10px;
          display: flex;
          border-radius: 8px;
          background: linear-gradient(to right, #3b3b4f, #9898a4);
          overflow: hidden;
          position: relative;
          color: #fff;

          .icon-member-enter {
            position: absolute;
            z-index: 0;
            top: -5px;
            left: -20px;
            font-size: 156px;
            color: #333;
            opacity: 0.4;
            transform: rotate(30deg);
            -webkit-transform: rotate(30deg);
            margin: 0 auto;
            height: 40px;
            line-height: 40px;
            border-radius: 8px 8px 0 0;
          }

          .level {
            flex: 1;
            z-index: 1;
            position: relative;
            line-height: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #e6c785;
          }

          .member_btn {
            background: linear-gradient(to right, #f2e1aa, #e6c785);
            color: #3c3c50;
            height: 30px;
            line-height: 30px;
            padding: 0 16px;
            border-radius: 16px;
            font-size: 12px;
            margin: auto 0;
          }
        }
      }
    }
  }

  .header-three-left {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;

      /* flex-wrap: wrap; */
      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-info {
        flex: 1;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-name {
          display: flex;
          line-height: 28px;
          height: 32px;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            background: #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
            height: 28px;
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;
          height: 32px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            height: 28px;
            background: #fff;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
          }
        }
      }

      .member-box {
        margin-top: 5px;
        width: 100px;
        box-sizing: border-box;
        overflow: hidden;

        .box {
          height: 74px;
          overflow: hidden;
          position: relative;
          border-radius: 6px;
          padding: 2px 8px;
          background-image: url("../../assets/images/member/grade_bg@2x.png");
          background-repeat: no-repeat;
          background-position: -6px 0;

          .level {
            margin-top: 5px;
            margin-left: 16px;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            -webkit-align-items: center;
            color: #e6c785;
            font-size: 12px;
            transform: rotate(10deg);
            -webkit-transform: rotate(10deg);
          }

          .member_btn {
            transform: rotate(10deg);
            -webkit-transform: rotate(10deg);
            color: #e6c785;
            font-size: 12px;
            border-radius: 16px;
            border: 1px solid #e6c785;
            margin-left: 10px;
            padding-left: 3px;

            i {
              font-size: 10px;
            }
          }
        }
      }
    }
  }

  .header-three-center {
    height: auto;

    /* background-color: #fff; */
    padding-top: 20px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;
      flex-wrap: wrap;

      .left {
        width: 100%;
        height: 64px;
        margin-bottom: 5px;

        .left-a {
          text-align: center;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 64px;
            height: 64px;
            border-radius: 50%;

            /* border: solid 2px #ebebeb; */
          }
        }
      }

      .user-info {
        /* flex: 1; */
        margin-left: 15px;
        display: flex;
        flex-direction: column;

        .user-name {
          display: flex;
          line-height: 28px;
          margin-bottom: 5px;
          justify-content: center;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            background: #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;
          height: 32px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            height: 28px;
            background: #fff;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
          }
        }
      }

      .member-box {
        margin-top: 5px;
        width: 100px;
        box-sizing: border-box;
        overflow: hidden;

        .box {
          height: 74px;
          overflow: hidden;
          position: relative;
          border-radius: 6px;
          padding: 2px 8px;
          background-image: url("../../assets/images/member/grade_bg@2x.png");
          background-repeat: no-repeat;
          background-position: -6px 0;

          .level {
            margin-top: 5px;
            margin-left: 16px;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            -webkit-align-items: center;
            color: #e6c785;
            font-size: 12px;
            transform: rotate(10deg);
            -webkit-transform: rotate(10deg);
          }

          .member_btn {
            transform: rotate(10deg);
            -webkit-transform: rotate(10deg);
            color: #e6c785;
            font-size: 12px;
            border-radius: 16px;
            border: 1px solid #e6c785;
            margin-left: 10px;
            padding-left: 3px;

            i {
              font-size: 10px;
            }
          }
        }
      }
    }
  }

  .header-three-right {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;

      /* flex-wrap: wrap; */
      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-info {
        flex: 1;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-name {
          display: flex;
          line-height: 28px;
          height: 32px;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            background: #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
            height: 28px;
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;
          height: 32px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            height: 28px;
            background: #fff;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 15px;
          }
        }
      }

      .member-box {
        margin-top: 5px;
        width: 100px;
        box-sizing: border-box;
        overflow: hidden;

        .box {
          height: 74px;
          overflow: hidden;
          position: relative;
          border-radius: 6px;
          padding: 2px 8px;
          background-image: url("../../assets/images/member/grade_bg@2x.png");
          background-repeat: no-repeat;
          background-position: -6px 0;

          .level {
            margin-top: 5px;
            margin-left: 16px;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            -webkit-align-items: center;
            color: #e6c785;
            font-size: 12px;
            transform: rotate(10deg);
            -webkit-transform: rotate(10deg);
          }

          .member_btn {
            transform: rotate(10deg);
            -webkit-transform: rotate(10deg);
            color: #e6c785;
            font-size: 12px;
            border-radius: 16px;
            border: 1px solid #e6c785;
            margin-left: 10px;
            padding-left: 3px;

            i {
              font-size: 10px;
            }
          }
        }
      }
    }
  }

  .header-four-left {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;

      /* flex-wrap: wrap; */
      .left {
        flex: 0 0 64px;
        width: 64px;
        height: 64px;
        border-radius: 5px;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-info {
        flex: 1;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-name {
          display: flex;
          line-height: 28px;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            border-radius: 25px;
            color: #fff;
            display: flex;

            .name-b0 {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #a77844;
              z-index: 1;

              .name-b-a {
                width: 28px;
                line-height: 28px;
                height: 28px;
                margin: 2px 0 0 2px;
                border-radius: 50%;
                border: 1px solid #fff;
                background: #a77844;
                text-align: center;
              }
            }

            .name-b-b {
              padding: 0 10px;
              margin-top: 4px;
              border-radius: 0 16px 16px 0;
              line-height: 24px;
              height: 24px;
              background:
                linear-gradient(
                  to right,
                  #a77844,
                  #f2c691,
                  #f2c691,
                  #a77844
                );
              position: relative;
              left: -10px;
              z-index: 0;
            }
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            height: 24px;
            line-height: 24px;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 5px;
            background: #c4c4c4;
          }

          .name-c {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .header-four-center {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-level {
        position: relative;
        top: -15px;

        .name-b {
          border-radius: 25px;
          color: #fff;
          display: flex;

          .name-b0 {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #a77844;
            z-index: 1;

            .name-b-a {
              width: 28px;
              line-height: 28px;
              height: 28px;
              margin: 2px 0 0 2px;
              border-radius: 50%;
              border: 1px solid #fff;
              background: #a77844;
              text-align: center;
            }
          }

          .name-b-b {
            padding: 0 10px;
            margin-top: 4px;
            border-radius: 0 16px 16px 0;
            line-height: 24px;
            height: 24px;
            background:
              linear-gradient(
                to right,
                #a77844,
                #f2c691,
                #f2c691,
                #a77844
              );
            position: relative;
            left: -10px;
            z-index: 0;
          }
        }
      }

      .user-name {
        display: flex;
        line-height: 28px;
        font-size: 16px;

        /* color: #333; */
        font-weight: 600;
        position: relative;
        top: -7.5px;
      }

      .name_invite {
        display: flex;
        line-height: 28px;

        .name-a {
          color: #333;
          font-size: 13px;
        }

        .name-b {
          margin-left: 10px;
          height: 24px;
          line-height: 24px;
          border: 1px solid #f5f5f5;
          border-radius: 25px;
          padding: 0 5px;
          background: #c4c4c4;
        }

        .name-c {
          margin-right: 10px;
        }
      }
    }
  }

  .header-four-right {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;

      /* flex-wrap: wrap; */
      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-info {
        flex: 1;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-name {
          display: flex;
          line-height: 28px;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            border-radius: 25px;
            color: #fff;
            display: flex;

            .name-b0 {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #a77844;
              z-index: 1;

              .name-b-a {
                width: 28px;
                line-height: 28px;
                height: 28px;
                margin: 2px 0 0 2px;
                border-radius: 50%;
                border: 1px solid #fff;
                background: #a77844;
                text-align: center;
              }
            }

            .name-b-b {
              padding: 0 10px;
              margin-top: 4px;
              border-radius: 0 16px 16px 0;
              line-height: 24px;
              height: 24px;
              background:
                linear-gradient(
                  to right,
                  #a77844,
                  #f2c691,
                  #f2c691,
                  #a77844
                );
              position: relative;
              left: -10px;
              z-index: 0;
            }
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            height: 24px;
            line-height: 24px;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 5px;
            background: #c4c4c4;
          }

          .name-c {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .header-five-left {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;

      /* flex-wrap: wrap; */
      .left {
        width: 64px;
        height: 64px;
        border-radius: 5px;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-info {
        flex: 1;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-name {
          display: flex;
          line-height: 28px;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            color: #fff;
            padding: 0 10px;
            margin-top: 4px;
            line-height: 24px;
            border-radius: 16px;
            height: 24px;
            background:
              linear-gradient(
                to right,
                #3f3e3d,
                #6e6d6c,
                #a8a4a4,
                #a8a4a4,
                #6e6d6c,
                #3f3e3d
              );
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            height: 24px;
            line-height: 24px;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 5px;
            background: #c4c4c4;
          }

          .name-c {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .header-five-center {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-level {
        position: relative;
        top: -15px;

        .name-b {
          color: #fff;
          padding: 0 10px;
          margin-top: 4px;
          border-radius: 16px;
          height: 24px;
          background:
            linear-gradient(
              to right,
              #3f3e3d,
              #6e6d6c,
              #a8a4a4,
              #a8a4a4,
              #6e6d6c,
              #3f3e3d
            );
        }
      }

      .user-name {
        display: flex;
        line-height: 28px;
        font-size: 16px;

        /* color: #333; */
        font-weight: 600;
        position: relative;
        top: -7.5px;
      }

      .name_invite {
        display: flex;
        line-height: 28px;

        .name-a {
          color: #333;
          font-size: 13px;
        }

        .name-b {
          margin-left: 10px;
          height: 24px;
          line-height: 24px;
          border: 1px solid #f5f5f5;
          border-radius: 25px;
          padding: 0 5px;
          background: #c4c4c4;
        }

        .name-c {
          margin-right: 10px;
        }
      }
    }
  }

  .header-five-right {
    height: auto;

    /* background-color: #fff; */
    padding: 20px 10px;
    position: relative;
    color: #333;

    .header-info {
      display: flex;

      /* flex-wrap: wrap; */
      .left {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 64px;
          height: 64px;
          border-radius: 50%;

          /* border: solid 2px #ebebeb; */
        }
      }

      .user-info {
        flex: 1;
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .user-name {
          display: flex;
          line-height: 28px;

          .name-a {
            font-size: 16px;

            /* color: #333; */
            font-weight: 600;
            margin-right: 10px;
          }

          .name-b {
            color: #fff;
            padding: 0 10px;
            margin-top: 4px;
            line-height: 24px;
            border-radius: 16px;
            height: 24px;
            background:
              linear-gradient(
                to right,
                #3f3e3d,
                #6e6d6c,
                #a8a4a4,
                #a8a4a4,
                #6e6d6c,
                #3f3e3d
              );
          }
        }

        .name_invite {
          display: flex;
          line-height: 28px;

          .name-a {
            color: #333;
            font-size: 13px;
          }

          .name-b {
            margin-left: 10px;
            height: 24px;
            line-height: 24px;
            border: 1px solid #f5f5f5;
            border-radius: 25px;
            padding: 0 5px;
            background: #c4c4c4;
          }

          .name-c {
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
