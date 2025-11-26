<template>
  <view class="p-10px formCon" v-if="steep === 1">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <view class="uploadTip">
        <view class="tipH6">请上传代办人二代身份证</view>
        <view class="tipP">确保证件清晰完整</view>
      </view>
      <view class="pt-20px">
        <wd-form ref="formPhoto" :model="modelPhoto">
          <view class="mb-20px" @click="upload('3', '1')">
            <Card-Upload :type="3" :imgUrl="dbrCardUrl" />
          </view>
          <view @click="upload('4', '1')">
            <Card-Upload :type="4" :imgUrl="dbrCardUrl2" />
          </view>
        </wd-form>
      </view>
    </view>
    <view class="bottomBtn2">
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(2, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>

  <view class="p-10px formCon" v-if="steep === 2">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <view class="partTitle">
        <text>代办人基础信息</text>
      </view>
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <wd-input
            label="代办人姓名"
            label-width="130px"
            type="text"
            v-model="model.dbrName"
            align-right
            placeholder="请输入代办人姓名"
            :rules="rules.dbrName"
            prop="dbrName"
            :maxlength="20"
            custom-input-class="custom-input-right"
            @blur="checkPhoneNum($event, 'dbrName')"
          />
          <wd-input
            label="代办人证件号码"
            label-width="130px"
            type="text"
            v-model="model.dbrZjhm"
            align-right
            placeholder="请输入代办人证件号码"
            :rules="rules.dbrZjhm"
            prop="dbrZjhm"
            custom-input-class="custom-input-right"
            :maxlength="18"
            :mixlength="16"
            @blur="getIdCardInfo($event, 'dbrSex')"
          />
          <wd-number-keyboard
            v-model:visible="visible"
            v-model="model.dbrZjhm"
            :maxlength="18"
            extra-key="X"
            close-text="完成"
          ></wd-number-keyboard>
          <wd-picker
            :columns="[cardType[0]]"
            custom-value-class="custom-input-right"
            label="代办人证件类型"
            label-width="130px"
            align-right
            v-model="model.dbrType"
            :rules="rules.dbrType"
            prop="dbrType"
          />
          <wd-picker
            :columns="sexList"
            custom-value-class="custom-input-right"
            label="代办人性别"
            v-model="model.dbrSex"
            align-right
            :rules="rules.dbrSex"
            prop="dbrSex"
            readonly
          />
          <wd-input
            label="手机号码"
            label-width="130px"
            type="text"
            v-model="model.dbrPhone"
            align-right
            placeholder="请输入手机号码"
            :rules="rules.dbrPhone"
            prop="dbrPhone"
            custom-input-class="custom-input-right"
            :maxlength="14"
            @blur="checkPhoneNum($event, 'dbrPhone')"
          />
          <wd-picker
            :columns="applicantList"
            custom-value-class="custom-input-right"
            label="亲属关系"
            v-model="model.familyRelation"
            align-right
            :rules="rules.familyRelation"
            prop="familyRelation"
            @confirm="checkRelation"
          />
          <wd-input
            label="代办人家庭住址"
            label-width="130px"
            type="text"
            v-model="model.dbrAddress"
            align-right
            placeholder="请输入代办人家庭住址"
            :rules="rules.dbrAddress"
            :maxlength="70"
            prop="dbrAddress"
            custom-input-class="custom-input-right"
          />
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(1, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(3, '1')" block>
        确认信息
      </wd-button>
    </view>
  </view>

  <view class="formCon" v-if="steep === 3">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <view class="collectionMethod">
        <text
          class="methodItem"
          :class="{ activeItem: item.value === model.isHkb }"
          v-for="item in collectionList"
          :key="item.value"
          @click="chooseCollect(item)"
        >
          {{ item.name }}
        </text>
      </view>
      <view class="pt-20px">
        <wd-form ref="formPhoto" :model="modelPhoto" v-if="model.isHkb === '0'">
          <view class="mb-20px" @click="upload('1', '1')">
            <Card-Upload :type="1" :imgUrl="cardUrl1" />
          </view>
          <view @click="upload('2', '1')">
            <Card-Upload :type="2" :imgUrl="cardUrl2" />
          </view>
        </wd-form>
        <wd-form ref="formPhoto" :model="modelPhoto" v-if="model.isHkb === '1'">
          <view class="mb-20px" @click="upload('6', '1')">
            <Card-Upload :type="6" :imgUrl="cardUrl4" />
          </view>
          <view @click="upload('5', '1')">
            <Card-Upload :type="5" :imgUrl="cardUrl3" />
          </view>
        </wd-form>
      </view>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(2, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(4, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>

  <view class="p-10px py-20px formCon" v-if="steep === 4">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <view class="partTitle">
        <text>申领人基础信息</text>
      </view>
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <wd-input
            label="申领人姓名"
            label-width="100px"
            type="text"
            v-model="model.name"
            align-right
            placeholder="请输入申领人姓名"
            :rules="rules.name"
            prop="name"
            custom-input-class="custom-input-right"
            @blur="checkPhoneNum($event, 'name')"
            :maxlength="20"
          />
          <wd-input
            label="申领人身份证号"
            label-width="120px"
            type="text"
            v-model="model.idCardNumber"
            align-right
            placeholder="请输入申领人身份证号码"
            :rules="rules.idCardNumber"
            prop="idCardNumber"
            custom-input-class="custom-input-right"
            :maxlength="18"
            :mixlength="16"
            @blur="getIdCardInfo($event, 'sex', 'birthdate')"
          />
          <wd-number-keyboard
            v-model:visible="visible"
            v-model="model.idCardNumber"
            :maxlength="18"
            extra-key="X"
            close-text="完成"
          ></wd-number-keyboard>
          <wd-picker
            :columns="cardType"
            custom-value-class="custom-input-right"
            label="申领人证件类型"
            label-width="120px"
            align-right
            v-model="model.idCardType"
            :rules="rules.idCardType"
            prop="idCardType"
            readonly
          />
          <wd-picker
            :columns="sexList"
            custom-value-class="custom-input-right"
            label="申领人性别"
            align-right
            v-model="model.sex"
            :rules="rules.sex"
            prop="sex"
          />
          <wd-input
            label="手机号码"
            label-width="100px"
            type="text"
            align-right
            v-model="model.phoneNumber"
            placeholder="请输入手机号码"
            :rules="rules.phoneNumber"
            prop="phoneNumber"
            custom-input-class="custom-input-right"
            :maxlength="11"
            @blur="checkPhoneNum($event, 'phoneNumber')"
          />
          <wd-picker
            :columns="regionList2"
            custom-value-class="custom-input-right"
            label="国籍/地区"
            align-right
            v-model="model.nationality"
            :rules="rules.nationality"
            prop="nationality"
            readonly
          />
          <wd-picker
            :columns="ethniCodeList"
            custom-value-class="custom-input-right"
            label="民族"
            align-right
            v-model="model.nation"
            :rules="rules.nation"
            prop="nation"
          />
          <wd-datetime-picker
            type="date"
            label-width="150px"
            custom-value-class="custom-input-right"
            label="出生日期"
            v-model="model.birthdate"
            :rules="rules.birthdate"
            prop="birthdate"
            align-right
            :maxDate="maxCurrentDate"
            :minDate="minDate"
            :default-value="defaultDate"
            readonly
          />
          <template v-if="model.idCardType == '1'">
            <wd-datetime-picker
              type="date"
              label-width="150px"
              custom-value-class="custom-input-right"
              label="证件有效起始日期"
              v-model="model.startDate"
              :rules="rules.startDate"
              prop="startDate"
              align-right
              :maxDate="maxCurrentDate"
              :minDate="minDate"
              :default-value="defaultDate"
              @confirm="checkStartDate"
            />
            <wd-datetime-picker
              type="date"
              label-width="150px"
              custom-value-class="custom-input-right"
              label="证件有效结束日期"
              v-model="model.endDate"
              :rules="rules.endDate"
              prop="endDate"
              align-right
              :maxDate="maxDate"
              :minDate="minDate"
              :default-value="defaultDate"
              @confirm="checkEndDate"
            />
          </template>
          <wd-input
            label="家庭住址"
            v-model="model.address"
            :rules="rules.address"
            :maxlength="70"
            prop="address"
            label-width="100px"
            type="text"
            align-right
            placeholder="请输入家庭住址"
            custom-input-class="custom-input-right"
          />
          <wd-picker
            :columns="occupationList"
            custom-value-class="custom-input-right"
            custom-class="hasBg"
            label="职业"
            align-right
            v-model="model.work"
            :rules="rules.work"
            prop="work"
          />
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(3, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(5, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>

  <view class="p-10px py-20px formCon" v-if="steep === 5">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <view class="partTitle">
        <text>领取方式</text>
      </view>
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <view class="formLine">
            <view class="formLabel">领取方式</view>
            <wd-radio-group
              shape="dot"
              v-model="model.isPostcard"
              :rules="rules.isPostcard"
              prop="isPostcard"
              inline
              @change="change"
            >
              <wd-radio :value="item.value" v-for="item in postList" :key="item.value">
                {{ item.label }}
              </wd-radio>
            </wd-radio-group>
          </view>
          <wd-picker
            :columns="areaCodeList"
            custom-value-class="custom-input-right"
            label="申领地区"
            align-right
            v-model="model.areaCode"
            :rules="rules.areaCode"
            prop="areaCode"
            @confirm="handleChange1"
          />
          <wd-picker
            :columns="bankCodeList"
            custom-value-class="custom-input-right"
            label="申领银行"
            align-right
            v-model="model.bankCode"
            :rules="rules.bankCode"
            prop="bankCode"
            @confirm="handleChange"
            :disabled="
              promotionDate && promotionDate.isPromotion && promotionDate.promoterType === '2'
            "
          />
          <wd-picker
            :columns="bankBranchList"
            custom-value-class="custom-input-right"
            label="申领网点"
            align-right
            v-model="model.bankBranchCode"
            :rules="rules.bankBranchCode"
            :column-change="onChangeDistrict"
            prop="bankBranchCode"
            :disabled="!model.areaCode && !model.isPostcard && !model.bankCode"
          />
          <template v-if="model.isPostcard === '1'">
            <wd-input
              label="收件人姓名"
              align-right
              v-model="model.postcardName"
              :rules="rules.postcardName"
              prop="postcardName"
              label-width="100px"
              type="text"
              placeholder="请输入收件人姓名"
              :maxlength="20"
              custom-input-class="custom-input-right"
              custom-class="hasBg"
              @blur="checkPhoneNum($event, 'postcardName')"
            />
            <wd-input
              label="收件人手机号"
              v-model="model.postcardPhone"
              :rules="rules.postcardPhone"
              prop="postcardPhone"
              label-width="100px"
              type="text"
              align-right
              placeholder="请输入收件人手机号"
              :maxlength="14"
              custom-input-class="custom-input-right"
              custom-class="hasBg"
              @blur="checkPhoneNum($event, 'postcardPhone')"
            />
            <wd-input
              label="收件地址"
              v-model="model.postcardaddress"
              :rules="rules.postcardaddress"
              prop="postcardaddress"
              label-width="100px"
              type="text"
              align-right
              :maxlength="70"
              placeholder="请输入收件地址"
              custom-input-class="custom-input-right"
              custom-class="hasBg"
            />
          </template>
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(4, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(6, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>

  <!-- <view class="p-10px py-20px formCon" v-if="steep === 6">
    <view class="rounded-10px pb-20px overflow-hidden bg-#fff formView">
      <view class="partTitle">
        <text>确认信息</text>
      </view>
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <wd-cell title="姓名" title-width="100px">
            <text custom-class="custom-value">{{ model.name }}</text>
          </wd-cell>
          <wd-cell title="身份证号码" title-width="100px">
            <text custom-class="custom-value">{{ model.idCardNumber }}</text>
          </wd-cell>
          <wd-picker
            :columns="cardType"
            custom-value-class="custom-input-right"
            label="证件类型"
            align-right
            v-model="model.idCardType"
            readonly
          />
          <wd-picker
            :columns="sexList"
            custom-value-class="custom-input-right"
            label="性别"
            align-right
            v-model="model.sex"
            readonly
          />
          <wd-cell title="手机号码" title-width="100px">
            <text custom-class="custom-value">{{ model.phoneNumber }}</text>
          </wd-cell>
          <wd-datetime-picker
            type="date"
            label-width="150px"
            custom-value-class="custom-input-right"
            label="出生日期"
            v-model="model.birthdate"
            align-right
            readonly
          />
          <wd-picker
            :columns="regionList2"
            custom-value-class="custom-input-right"
            label="国籍/地区"
            align-right
            v-model="model.nationality"
            readonly
          />
          <wd-picker
            :columns="ethniCodeList"
            custom-value-class="custom-input-right"
            label="民族"
            align-right
            v-model="model.nation"
            readonly
          />
          <template v-if="model.idCardType == '1'">
            <wd-datetime-picker
              type="date"
              label-width="150px"
              custom-value-class="custom-input-right"
              label="证件有效起始日期"
              v-model="model.startDate"
              align-right
              readonly
            />
            <wd-datetime-picker
              type="date"
              label-width="150px"
              custom-value-class="custom-input-right"
              label="证件有效结束日期"
              v-model="model.endDate"
              align-right
              readonly
            />
          </template>
          <wd-cell title="家庭住址" title-width="100px">
            <text custom-class="custom-value">{{ model.address }}</text>
          </wd-cell>
          <wd-picker
            :columns="occupationList"
            custom-value-class="custom-input-right"
            label="职业"
            align-right
            v-model="model.work"
            readonly
          />
          <wd-picker
            :columns="areaCodeList"
            custom-value-class="custom-input-right"
            label="申领地区"
            align-right
            v-model="model.areaCode"
            readonly
          />
          <wd-picker
            :columns="bankCodeList"
            custom-value-class="custom-input-right"
            label="申领银行"
            align-right
            v-model="model.bankCode"
            readonly
          />
          <wd-picker
            :columns="bankBranchList"
            custom-value-class="custom-input-right"
            label="申领网点"
            align-right
            v-model="model.bankBranchCode"
            readonly
          />
          <template v-if="model.isPostcard === '1'">
            <wd-cell title="是否邮寄" title-width="100px">
              <text custom-class="custom-value">是</text>
            </wd-cell>
            <wd-cell title="收件人姓名" title-width="100px">
              <text custom-class="custom-value">{{ model.postcardName }}</text>
            </wd-cell>
            <wd-cell title="收件人手机号" title-width="100px">
              <text custom-class="custom-value">{{ model.postcardPhone }}</text>
            </wd-cell>
            <wd-cell title="收件地址" title-width="100px">
              <text custom-class="custom-value">{{ model.postcardaddress }}</text>
            </wd-cell>
          </template>
          <wd-cell title="是否邮寄" title-width="100px" v-if="model.isPostcard === '0'">
            <text custom-class="custom-value">否</text>
          </wd-cell>
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(5, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(7, '1')" block>
        下一步
      </wd-button>
    </view>
  </view> -->

  <view class="p-10px py-20px formCon" v-if="steep === 6">
    <view class="rounded-10px pb-20px overflow-hidden bg-#fff formView">
      <view class="partTitle">
        <text>确认信息</text>
      </view>
      <wd-form ref="form" :model="model">
        <wd-cell-group border>
          <wd-cell required title="姓名" title-width="100px">
            <text custom-class="custom-value">{{ model.name }}</text>
          </wd-cell>
          <wd-cell required title="身份证号码" title-width="100px">
            <text custom-class="custom-value">{{ model.idCardNumber }}</text>
          </wd-cell>
          <wd-cell required title="证件类型" :value="getLabelByValue(cardType, model.idCardType)" />
          <wd-cell required title="性别" :value="getLabelByValue(sexList, model.sex)" />
          <wd-cell required title="手机号码" title-width="100px">
            <text custom-class="custom-value">{{ model.phoneNumber }}</text>
          </wd-cell>
          <wd-cell required title="出生日期" :value="getDateShow(model.birthdate)" />
          <wd-cell
            required
            title="国籍/地区"
            :value="getLabelByValue(regionList2, model.nationality)"
          />
          <wd-cell required title="民族" :value="getLabelByValue(ethniCodeList, model.nation)" />
          <template v-if="model.idCardType == '1'">
            <wd-cell required title="证件有效起始日期" :value="getDateShow(model.startDate)" />
            <wd-cell required title="证件有效结束日期" :value="getDateShow(model.endDate)" />
          </template>
          <wd-cell required title="家庭住址" title-width="100px">
            <text custom-class="custom-value">{{ model.address }}</text>
          </wd-cell>
          <wd-cell required title="职业" :value="getLabelByValue(occupationList, model.work)" />
          <wd-cell
            required
            title="申领地区"
            :value="getLabelByValue(areaCodeList, model.areaCode)"
          />
          <wd-cell
            required
            title="申领银行"
            :value="getLabelByValue(bankCodeList, model.bankCode)"
          />
          <wd-cell
            required
            title="申领网点"
            :value="getLabelByValue(bankBranchList, model.bankBranchCode)"
          />
          <template v-if="model.isPostcard === '1'">
            <wd-cell required title="是否邮寄" title-width="100px">
              <text custom-class="custom-value">是</text>
            </wd-cell>
            <wd-cell required title="收件人姓名" title-width="100px">
              <text custom-class="custom-value">{{ model.postcardName }}</text>
            </wd-cell>
            <wd-cell required title="收件人手机号" title-width="100px">
              <text custom-class="custom-value">{{ model.postcardPhone }}</text>
            </wd-cell>
            <wd-cell required title="收件地址" title-width="100px">
              <text custom-class="custom-value">{{ model.postcardaddress }}</text>
            </wd-cell>
          </template>
          <wd-cell required title="是否邮寄" title-width="100px" v-if="model.isPostcard === '0'">
            <text custom-class="custom-value">否</text>
          </wd-cell>
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(5, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(7, '1')" block>
        下一步
      </wd-button>
    </view>
  </view>

  <view class="formCon" v-if="steep === 7">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <view class="photoRequire">
        <view class="desTitle" style="font-weight: bold">注意事项：</view>
        <view class="requireLine">
          七周岁以下持卡人申请，照片不需要上传，系统默认为卡通头像;七周岁及以上持卡人需要上传真人头像。
        </view>
        <view class="requireLine">
          社保卡电子照片要求:深色上衣，白色免冠1寸照片，照片尺寸358*441像素，分辨率350dpi。
        </view>
        <view class="requireLine">所有上传照片需清晰且未遮挡，请勿进行美化和修改。</view>
      </view>
      <view class="rounded-10px overflow-hidden bg-#fff uploadCon">
        <view class="imgFlex">
          <view class="photoExample">
            <view class="photoName">照片样例</view>
            <view
              class="exampleImg"
              :style="`background-image: url(${card3});background-size:100% 100%`"
            ></view>
          </view>
          <view class="photoExample">
            <view class="photoName">上传照片</view>
            <wd-form class="exampleImg" ref="formPhoto" :model="modelPhoto">
              <view>
                <view @click="upload('0', '1')">
                  <Card-Upload :type="0" :imgUrl="cardUrl0" />
                </view>
              </view>
            </wd-form>
          </view>
        </view>
        <view class="handleTip">
          <view class="desTitle">操作流程</view>
          <view class="requireLine">
            点击上传照片，审核通过后完成照片上传，若未通过审核则需根据提示重新上传。
          </view>
        </view>
        <view class="handleTip">
          <view class="desTitle">重要提示</view>
          <view class="requireLine">
            请确保上传照片符合照片要求，如遇平台审核照片不通过时，请务必检查照片是否符合要求！
          </view>
          <view
            class="requireLine"
            style="color: red"
            v-if="model.idCardNumber && getAgeFromIdCard(model.idCardNumber) < 7"
          >
            未成年人代办可不上传照片，系统获取默认照片。
          </view>
        </view>
      </view>
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(6, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button type="primary" :round="false" size="medium" @click="nextStep(8, '1')" block>
        确认上传
      </wd-button>
    </view>
  </view>

  <view class="p-10px py-20px formCon" v-if="steep === 8">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <Card-Preview
        :photoUrl="cardUrl0"
        :personName="model.name"
        :idCardNumber="model.idCardNumber"
        :backName="backName"
      />
    </view>
    <view class="bottomBtn">
      <wd-button
        class="prevBtn"
        type="primary"
        :round="false"
        size="medium"
        @click="nextStep(7, '2')"
        custom-class="custom-class-mine-dyinfo"
        block
      >
        上一步
      </wd-button>
      <wd-button
        type="primary"
        :round="false"
        size="medium"
        :loading="submitLoading"
        @click="submitCard(form, 9)"
        block
      >
        确认提交
      </wd-button>
    </view>
  </view>

  <view class="p-10px py-20px formCon" v-if="steep === 9">
    <view class="rounded-10px overflow-hidden bg-#fff formView">
      <Claim-Results
        :personName="model.name"
        :idCardNumber="model.idCardNumber"
        :batchNumber="batchNumber"
      />
    </view>
  </view>
  <wd-message-box></wd-message-box>
</template>
<script lang="ts" setup>
import { promotionDateStore, useUserStore } from '@/store'
import { changeDict, clearSpace } from '@/utils'
import { Toast } from '@/utils/uniapi/prompt'
import dayjs from 'dayjs'
import qs from 'qs'
import { useMessage } from 'wot-design-uni'
import useCardApply from '../hooks/useCardApply'
import useCardBhk from '../hooks/useCardBhk'
import useCardJuvenApply from '../hooks/useCardJuvenApply'
import {
  applicantList,
  cardType,
  ethniCodeList,
  occupationList,
  regionList2,
  sexList,
} from '../types/dict'
import CardUpload from './CardUpload.vue'
import CardPreview from './cardPreview.vue'
import ClaimResults from './claimResults.vue'

import { getCardcheckInfo } from '@/service/api/cardServe'
import isObject from 'lodash/isObject'
import { storeToRefs } from 'pinia'
import { carmeraUrl } from '../types/l-painter/carmera'
const { promotionDate } = storeToRefs(promotionDateStore())
const card3 = ref(
  'https://oss.xay.xacloudy.cn/images/2025-04/ad13d3be-a03d-4cdb-b7ee-0a9ef026ac156tZl9vb9FE0W57b73f4247285f581851faeb5752a9b2.png',
)

const message = useMessage()
const {
  modelPhoto,
  model,
  rules,
  modelId,
  applyType,
  steep,
  batchNumber,
  submitCard,
  submitStepCard,
  submitStatus,
  statusDel,
  sendApplyInfo,
  getGenderFromIdCard,
  getBirthDateFromIdCard,
  submitLoading,
  promoteInfo,
  bankLabelList,
} = useCardJuvenApply()

const { sedBankCodeById } = useCardApply()

const minDate = dayjs('191000101').valueOf()
const maxDate = dayjs('20991225').valueOf()
const curYear = ref(dayjs().year() + '')
const curMonth = ref(dayjs().month() + 1 >= 10 ? dayjs().month() + 1 : '0' + (dayjs().month() + 1))
const curDay = ref(dayjs().date() + '')
const maxCurrentDate = dayjs(curYear.value + curMonth.value + curDay.value).valueOf()
const defaultDate = ref<number>(Date.now())

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const { sendBranches } = useCardBhk()
const visible = ref<boolean>(false)
const formPhoto = ref(null)

const form = ref(null)

// 提取生份证号信息
const getIdCardInfo = (data, sex?: string, birthday?: string) => {
  console.log(data, '.............data')
  if (data.value.length === 18) {
    if (data.value.indexOf('x') > -1) {
      Toast('请检查身份证号码是否正确！')
      return
    }
    if (sex) {
      model.value[sex] = data.value.substr(16, 1) % 2 === 1 ? '1' : '2'
    }
    if (birthday) {
      model.value[birthday] = new Date(
        data.value.substr(6, 4) + '-' + data.value.substr(10, 2) + '-' + data.value.substr(12, 2),
      ).getTime()
    }
    // if (model.value.familyRelation) {
    //   setTimeout(() => {
    //     model.value.familyRelation = ''
    //   }, 100)
    // }
  } else {
    Toast('请检查身份证号码是否正确！')
  }
}

// 错误提示
watch(
  () => submitStatus.value,
  () => {
    message.alert({
      msg: statusDel.value,
      title: '提示',
    })
  },
  { deep: true },
)

async function upload(photoType: string, type: string) {
  const data = { photoType, type, zjhm: userInfo.value.idCardNumber }
  const queryStr = qs.stringify(data)
  uni.navigateTo({
    url: `${carmeraUrl()}?${queryStr}`,
    events: {
      // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      camera: function (data) {
        console.log('监听到数据回传', data.cameraData)
        // 处理回传数据
        changeCamearData(data.cameraData)
      },
      hkbInfo: function (data) {
        console.log('监听到hkb数据回传', data.hkbInfo)
        // 处理回传数据
        changeHkbInfo(data.hkbInfo)
      },
    },
  })
}

const dbrCardUrl = ref()
const dbrCardUrl2 = ref()

const cardUrl0 = ref()
const cardUrl1 = ref('')
const cardUrl2 = ref('')
const cardUrl3 = ref('')
const cardUrl4 = ref('')

const birthdate = ref('')
const nation = ref('')
function changeCamearData(cameraData) {
  console.log('识别信息', cameraData.type, cameraData)
  if (cameraData.type === 2) {
    cardUrl2.value = cameraData.url
    model.value.idCardBackPhotoId = cameraData.id
    const { words_result: wordsResult }: any = cameraData.data
    model.value.name = wordsResult['姓名']?.words
    model.value.idCardNumber = wordsResult['公民身份号码']?.words
    model.value.address = wordsResult['住址']?.words

    // console.log(model.value.idCardNumber, 'model.value.idCardNumbermodel.value.idCardNumbermodel.value.idCardNumbermodel.value.idCardNumber')
    if (model.value.idCardNumber) {
      getIdCardInfo({ value: model.value.idCardNumber }, 'sex', 'birthdate')
    }
    // model.value.sex = changeDict(sexList, wordsResult['性别']?.words, 'value', 'label')
    // model.birthdate.value = wordsResult['出生']?.words || ''
    // 民族信息填充表单
    const nac = wordsResult['民族'].words
    const filteredPeople = ethniCodeList.filter((person) =>
      person.label.toLowerCase().includes(nac.toLowerCase()),
    )
    nation.value = filteredPeople[0]?.value ? filteredPeople[0]?.value.toString() : '99'
    model.value.nation = nation.value ? nation.value : ''
  }
  if (cameraData.type === 1) {
    cardUrl1.value = cameraData.url
    const { words_result: wordsResult }: any = cameraData.data
    model.value.idCardFrontPhotoId = cameraData.id
    model.value.startDate = dayjs(wordsResult['签发日期']?.words).valueOf() || ''
    model.value.endDate = dayjs(wordsResult['失效日期']?.words).valueOf() || ''
  }
  if (cameraData.type === 0) {
    cardUrl0.value = cameraData.url
    model.value.photoId = cameraData.id
  }
  // 代办人国徽面
  if (cameraData.type === 3) {
    dbrCardUrl.value = cameraData.url
    model.value.dbrIdCardFrontPhotoId = cameraData.id
  }
  // 代办人人像面
  if (cameraData.type === 4) {
    dbrCardUrl2.value = cameraData.url
    const { words_result: wordsResult }: any = cameraData.data
    model.value.dbrIdCardBackPhotoId = cameraData.id
    console.log('words_result: ', wordsResult)
    model.value.dbrName = wordsResult['姓名']?.words
    model.value.dbrZjhm = wordsResult['公民身份号码']?.words
    model.value.dbrSex = changeDict(sexList, wordsResult['性别']?.words, 'value', 'label')
    model.value.dbrAddress = wordsResult['住址']?.words || ''
  }
}

function changeHkbInfo(hkbInfo) {
  if (hkbInfo.type === 0) {
    cardUrl0.value = hkbInfo.url
    model.value.photoId = hkbInfo.id
  }
  if (hkbInfo.type === 5) {
    cardUrl3.value = hkbInfo.url
    model.value.idCardFrontPhotoId = hkbInfo.id
  }
  if (hkbInfo.type === 6) {
    cardUrl4.value = hkbInfo.url
    model.value.idCardBackPhotoId = hkbInfo.id
  }
}

// 处理手机号码空格字符
const checkPhoneNum = ({ value }, attr) => {
  if (value) {
    model.value[attr] = clearSpace(value)
  }
}

// 限制身份证有效时间
const checkStartDate = ({ value }) => {
  if (model.value.endDate && value >= model.value.endDate) {
    model.value.startDate = null
    message.alert({
      msg: '证件有效起始日期不能等于或晚于结束日期',
      title: '提示',
      closeOnClickModal: false,
    })

    return false
  }
}

const checkEndDate = ({ value }) => {
  if (model.value.startDate && value <= model.value.startDate) {
    model.value.endDate = null
    message.alert({
      msg: '证件有效结束日期不能等于或早于起始日期',
      title: '提示',
      closeOnClickModal: false,
    })

    return false
  }
}

const bankBranchList = ref([])
const backName = ref('')
const bankCodeList = ref([])
const areaCodeList = ref([])

const handleChange1 = async () => {
  model.value.bankCode = ''
  await handleChange()
  if (
    isObject(promotionDate.value) &&
    Object.values(promotionDate.value).length !== 0 &&
    promotionDate.value.promoterType === '2' &&
    promotionDate.value.isPromotion
  ) {
    await getBankCodeByIdDate()
    console.log('getPromoterById', promoteInfo.value)
    // model.value.bankCode = getLabelByLabel(bankCodeList.value, promoteInfo.value.bankName)
    model.value.bankCode = promoteInfo.value.bankCode
    if (model.value.bankCode) {
      await handleChange()
    } else {
      Toast('当前区域没有查询到可支持线上申领的银行！')
      model.value.bankBranchCode = ''
      bankBranchList.value = []
    }
    console.log(' model.value.bankCode', model.value.bankCode)
  }
}

// 查询邮寄银行网点
const handleChange = async () => {
  model.value.bankBranchCode = ''
  try {
    const params = {
      yhdm: model.value.bankCode,
      areaCode: model.value.areaCode,
      isMail: model.value.isPostcard,
    }

    const res: any = await sendBranches(params)
    if (res.code === '200') {
      const data = res.data.dataList
      bankCodeList.value = res.data.dict ? res.data.dict : []
      bankLabelList.value = res.data.dict ? res.data.dict : []
      bankBranchList.value = data?.length
        ? data.map((v) => {
            return { value: v.wdCode, label: v.name }
          })
        : []
      bankCodeList.value.forEach((item) => {
        if (item.value === model.value.bankCode) {
          backName.value = item.label
        }
      })
    }
  } catch (error) {
    bankBranchList.value = []
  }
}
// 查询申领地区
const handleChangeArea = async () => {
  if (
    isObject(promotionDate.value) &&
    Object.values(promotionDate.value).length !== 0 &&
    promotionDate.value.promoterType === '2' &&
    promotionDate.value.isPromotion
  ) {
    await getBankCodeByIdDate()
    console.log('getPromoterById', promoteInfo.value)
    model.value.bankCode = promoteInfo.value.bankCode
    try {
      const params = {
        // yhdm: model.value.bankCode,
        areaCode: '',
        yhdm: model.value.bankCode ? model.value.bankCode : '',
        isMail: model.value.isPostcard,
      }

      const res: any = await sendBranches(params)
      if (res.code === '200') {
        areaCodeList.value = res.data.dict ? res.data.dict : []
        console.log('handleChangeArea', res)
      }
    } catch (error) {
      areaCodeList.value = []
    }
  } else {
    try {
      const params = {
        areaCode: '',
        yhdm: '',
        isMail: model.value.isPostcard,
      }

      const res: any = await sendBranches(params)
      if (res.code === '200') {
        areaCodeList.value = res.data.dict ? res.data.dict : []
        console.log('handleChangeArea', res)
      }
    } catch (error) {
      areaCodeList.value = []
    }
  }
}

// 处理picker中命题过长
const onChangeDistrict = (value) => {
  if (value.label.length > 20) {
    Toast(value.label)
  }
}

// 上一步下一步（step为目标步骤；type：1为下一步，2为上一步）
const nextStep = (step, type) => {
  console.log('step, type: ', step, type)
  if (type === '2') {
    steep.value = step
  } else if (type === '1') {
    if (step === 1) {
      steep.value = step
    } else if (step === 2) {
      // steep.value = step
      // 情况1：两个文件都没上传
      if (
        !(model.value.dbrIdCardFrontPhotoId && dbrCardUrl.value) &&
        !(model.value.dbrIdCardBackPhotoId && dbrCardUrl2.value)
      ) {
        return message.alert({
          msg: '请上传身份证证件照',
          title: '提示',
          closeOnClickModal: false,
        })
      }
      // 情况2：只上传了国徽面
      else if (
        model.value.dbrIdCardFrontPhotoId &&
        dbrCardUrl.value &&
        !(model.value.dbrIdCardBackPhotoId && dbrCardUrl2.value)
      ) {
        return message.alert({
          msg: '请继续上传身份证人像面照片',
          title: '提示',
          closeOnClickModal: false,
        })
      }
      // 情况3：只上传了人像面
      else if (
        !(model.value.dbrIdCardFrontPhotoId && dbrCardUrl.value) &&
        model.value.dbrIdCardBackPhotoId &&
        dbrCardUrl2.value
      ) {
        return message.alert({
          msg: '请先上传身份证国徽面照片',
          title: '提示',
          closeOnClickModal: false,
        })
      }
      // 情况4：两个文件都已上传
      else {
        steep.value = step
      }
    } else if (step === 3) {
      form.value
        .validate()
        .then(({ valid, errors }) => {
          if (valid) {
            if (!checkRelation('')) {
              return Toast('亲属关系与性别不符，请重新选择！')
            } else if (model.value.dbrZjhm !== userInfo.value.idCardNumber) {
              return Toast('代办人证件号码与实名认证的证件号码不一致，请检查后重试！')
            } else {
              submitStepCard(form.value, step)
            }
          }
        })
        .catch((error) => {
          console.log(error, 'error')
        })
    } else if (step === 4) {
      if (model.value.idCardFrontPhotoId && model.value.idCardBackPhotoId) {
        submitStepCard(form.value, step)
      } else {
        let msg = ''
        if (model.value.isHkb === '0') {
          msg = '请先上传证件照片！'
        } else if (model.value.isHkb === '1') {
          msg = '请先上传户口本照片！'
        }

        message.alert({
          msg,
          title: '提示',
          closeOnClickModal: false,
        })
      }
      model.value.areaCode = ''
      model.value.bankCode = ''
      model.value.bankBranchCode = ''
    } else if (step === 5) {
      const sex2 = getsex2(model.value.idCardNumber) === '子' ? '1' : '2'

      if (model.value.familyRelation[model.value.familyRelation.length - 1] !== sex2) {
        Toast('亲属关系与性别不符，请重新选择！')
        return false
      } else {
        form.value
          .validate()
          .then(async ({ valid, errors }) => {
            if (valid) {
              if (!model.value.idCardNumber) return

              // 验证当前代未成年-的申领是否已经领取过
              const res = await getCardcheckInfo(
                {
                  xm: model.value.name,
                  zjhm: model.value.idCardNumber,
                  zkType: '1',
                  zjlx: model.value.idCardType,
                  wdcode: '999-130632004',
                  areaCode: 'CHN',
                },
                false,
              )
              if (res.code === '200' && res.data.resultCode === '0') {
                // 不可申请制卡
                Toast('当前申领人已申领社保卡！')
                return
              }

              const age = getAgeFromIdCard(model.value.idCardNumber)
              if (age > 16) {
                return message.alert({
                  msg: '申领人年龄超过16岁，不能代申领！',
                  title: '提示',
                  closeOnClickModal: false,
                })
              }
              if (model.value.dbrZjhm === model.value.idCardNumber) {
                return message.alert({
                  msg: '申领人证件号码不能和代办人证件号码相同',
                  title: '提示',
                  closeOnClickModal: false,
                })
              }
              if (model.value.idCardType === '1') {
                // 校验出生日期
                const birthDate = dayjs(model.value.birthdate).format('YYYY-MM-DD')
                const startDate = dayjs(model.value.startDate).format('YYYY-MM-DD')
                const endDate = dayjs(model.value.endDate).format('YYYY-MM-DD')
                if (birthDate > startDate) {
                  return Toast('出生日期不能晚于证件有效起始日期')
                }
                if (birthDate > endDate) {
                  return Toast('出生日期不能晚于证件有效结束日期')
                }
              }
              handleChangeArea()
              console.log(model.value, '...................')
              submitStepCard(form.value, step)
            }
          })
          .catch((error) => {
            console.log(error, 'error')
          })
      }
      // handleChange()
    } else if (step === 6) {
      form.value
        .validate()
        .then(({ valid, errors }) => {
          if (valid) {
            submitStepCard(form.value, step)
          }
        })
        .catch((error) => {
          console.log(error, 'error')
        })
    } else if (step === 7) {
      form.value
        .validate()
        .then(({ valid, errors }) => {
          if (valid) {
            steep.value = step
          }
        })
        .catch((error) => {
          console.log(error, 'error')
        })
    } else if (step === 8) {
      if (!model.value.idCardNumber) return
      const age = getAgeFromIdCard(model.value.idCardNumber)
      if (age <= 6) {
        steep.value = step
      } else {
        if (model.value.photoId && cardUrl0.value) {
          submitStepCard(form.value, step)
        } else {
          message.alert({
            msg: '请先上传人像照片',
            title: '提示',
            closeOnClickModal: false,
          })
        }
      }
    } else if (step === 9) {
      submitStepCard(form.value, step)
    }
  }
}
function change(e) {
  model.value.areaCode = ''
  model.value.bankCode = ''
  model.value.bankBranchCode = ''
  bankCodeList.value = []
  bankBranchList.value = []
  areaCodeList.value = []
  handleChangeArea()
}
// 获取信息详情
const getDetailInfo = async () => {
  const returnData: Record<string, any> = await sendApplyInfo({
    idCardNumber: userInfo.value.idCardNumber,
    applyType: '2',
  })
  for (const key in returnData) {
    if (Object.prototype.hasOwnProperty.call(model.value, key) && returnData[key]) {
      // 如果存在，则更新属性值
      if (returnData[key]) {
        model.value[key] = returnData[key]
      }
    }
  }
  model.value.areaCode = ''
  model.value.bankCode = ''
  model.value.bankBranchCode = ''
  model.value.isPostcard = '0'
  // await handleChange()
  // if (promoterId.value) {
  //   await getPromoterById()
  //   console.log('getPromoterById', promoteInfo.value)
  //   if (promoteInfo.value.attribute === 1) {
  //     model.value.bankCode = getLabelByLabel(bankCodeList.value, promoteInfo.value.bankName)
  //     if (model.value.bankCode) {
  //       await handleChange()
  //     } else {
  //       Toast('当前区域没有查询到可支持线上申领的银行！')
  //       model.value.bankBranchCode = ''
  //       bankBranchList.value = []
  //     }
  //     console.log(' model.value.bankCode', model.value.bankCode)
  //   }
  // }
  model.value.birthdate = dayjs(returnData.birthdate).valueOf().toString()
  model.value.startDate = dayjs(returnData.startDate).valueOf()
  model.value.endDate = dayjs(returnData.endDate).valueOf()
  modelId.value = returnData.id

  model.value.photoId = ''
  model.value.dbrIdCardFrontPhotoId = ''
  model.value.dbrIdCardBackPhotoId = ''
  model.value.idCardFrontPhotoId = ''
  model.value.idCardBackPhotoId = ''
  applyType.value = returnData.applyType
  model.value.areaCode = ''
  model.value.bankCode = ''
  model.value.bankBranchCode = ''
}

const postList = ref([
  { label: '现场领取', value: '0' },
  { label: '邮寄', value: '1' },
])

const collectionList = ref([
  { name: '申领人有身份证', value: '0' },
  { name: '申领人无身份证', value: '1' },
])

// 选择申领方式
const chooseCollect = (item) => {
  model.value.isHkb = item.value

  model.value.idCardFrontPhotoId = ''
  model.value.idCardBackPhotoId = ''
  if (item.value === '1') {
    cardUrl1.value = ''
    cardUrl2.value = ''
  } else if (item.value === '0') {
    cardUrl3.value = ''
    cardUrl4.value = ''
  }
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}

/**
 * 从18位身份证号中获取年龄
 * @param idCard 18位身份证号码
 * @returns 年龄（周岁）
 */
function getAgeFromIdCard(idCard: string): number {
  // 验证身份证号长度
  if (idCard.length !== 18) {
    throw new Error('身份证号必须是18位')
  }

  // 提取出生年月日部分（第7到14位）
  const birthDateStr = idCard.substring(6, 14)

  // 解析出生年月日
  const birthYear = parseInt(birthDateStr.substring(0, 4), 10)
  const birthMonth = parseInt(birthDateStr.substring(4, 6), 10) - 1 // 月份从0开始
  const birthDay = parseInt(birthDateStr.substring(6, 8), 10)

  // 获取当前日期
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()

  // 计算年龄
  let age = currentYear - birthYear

  // 如果当前月份小于出生月份，或者月份相同但当前日小于出生日，年龄减1
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--
  }

  return age
}
const getsex2 = (idCard) => {
  // 检查身份证号码长度
  if (!idCard || (idCard.length !== 15 && idCard.length !== 18)) {
    return '身份证号码长度不正确'
  }

  // 获取第17位数字（15位身份证取最后一位，18位身份证取第17位）
  const genderDigit = idCard.length === 15 ? idCard.charAt(14) : idCard.charAt(16)

  // 判断性别
  return parseInt(genderDigit, 10) % 2 === 1 ? '子' : '女'
}
// const sex2 = getsex2(model.value.idCardNumber) === '子' ? '1' : '2'

const checkRelation = (value) => {
  if (model.value.dbrSex === '1') {
    if (model.value.familyRelation === '31' || model.value.familyRelation === '32') {
      setTimeout(() => {
        model.value.familyRelation = ''
      }, 100)
      Toast('亲属关系与性别不符，请重新选择！')
      return false
    }
    // if (model.value.familyRelation !== '2' + sex2) {
    //   setTimeout(() => {
    //     model.value.familyRelation = ''
    //   }, 100)
    //   Toast('亲属关系与性别不符，请重新选择！')
    //   return false
    // }
    return true
  }
  if (model.value.dbrSex === '2') {
    if (model.value.familyRelation === '21' || model.value.familyRelation === '22') {
      setTimeout(() => {
        model.value.familyRelation = ''
      }, 100)
      Toast('亲属关系与性别不符，请重新选择！')
      return false
    }
    // if (model.value.familyRelation !== '3' + sex2) {
    //   setTimeout(() => {
    //     model.value.familyRelation = ''
    //   }, 100)
    //   Toast('亲属关系与性别不符，请重新选择！')
    //   return false
    // }
    return true
  }
  return false
}

watch(
  () => model.value.idCardNumber,
  (val) => {
    if (val && val.length === 18) {
      model.value.birthdate = new Date(
        val.substr(6, 4) + '-' + val.substr(10, 2) + '-' + val.substr(12, 2),
      ).getTime()
    }
  },
  {
    immediate: true,
  },
)
watch(
  () => model.value.idCardType,
  (val) => {
    if (val === '1') {
      model.value.startDate = ''
      model.value.endDate = ''
    } else if (val === '8') {
      model.value.startDate = new Date('9999-12-31').getTime()
      model.value.endDate = new Date('9999-12-31').getTime()
    }
  },
  {
    immediate: true,
  },
)
watch(
  () => model.value.isHkb,
  (val) => {
    // 身份证
    if (val === '0') {
      model.value.idCardType = '1'
      // 户口本
    } else if (val === '1') {
      model.value.idCardType = '8'
      // model.value.birthdate = ''
      // model.value.endDate = new Date('9999-12-31').getTime()
    }
  },
  {
    immediate: true,
  },
)

// 回显字典值
const getLabelByValue = (list, value) => {
  const item = list.find((item) => item.value === value)
  return item ? item.label : '' // 如果找到对应的项，返回label，否则返回空字符串
}
// 回显label值
const getLabelByLabel = (list, label) => {
  const item = list.find((item) => item.label === label)
  return item ? item.value : '' // 如果找到对应的项，返回label，否则返回空字符串
}

// 日期回显
const getDateShow = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}
// 根据当前用户id 查询推广人信息
// const getPromoterById = async () => {
//   const params = {
//     id: promoterId.value,
//   }
//   const returnData: any = await sedGetPromoterById(params)
//   promoteInfo.value = returnData
//   console.log('sedGetPromoterByIdreturnData', returnData)
// }
// 根据id获取推广码详情
const getBankCodeByIdDate = async () => {
  const params = {
    id: promotionDate.value.bankCodeId,
  }
  const returnData: any = await sedBankCodeById(params)
  promoteInfo.value = returnData
  console.log('sedGetPromoterByIdreturnData', returnData)
}
onMounted(() => {
  steep.value = 1
  promoteInfo.value = null
  getDetailInfo()
})
</script>
<script lang="ts">
export default {
  options: {
    styleIsolation: 'shared',
  },
}
</script>
<style lang="scss" scoped>
:deep(.wd-picker__error-message),
:deep(.wd-input__error-message) {
  @apply text-right!;
}
:deep(.custom-input-right) {
  @apply text-right! color-#999999!;
}

.formCon {
  :deep(.uni-input-input) {
    color: #333;
  }
  :deep(.wd-picker__value) {
    color: #333 !important;
  }
  :deep(.wd-picker__placeholder) {
    color: #999 !important;
  }
  .formView {
    max-height: calc(100vh - 180px);
    overflow-y: auto;
  }
  .bottomBtn {
    position: fixed;
    right: 14px;
    bottom: 24px;
    left: 14px;
    display: flex;
    justify-content: space-between;
    :deep(.wd-button) {
      width: 47%;
      height: 40px;
    }
    .prevBtn {
      color: #2d69ef;
      background: #eff4ff;
      border: 1px solid #c7d9ff;
      border-radius: 6px 6px 6px 6px;
    }
  }
  .bottomBtn2 {
    position: fixed;
    right: 14px;
    bottom: 24px;
    left: 14px;
    // width: 94%;
    margin: 0 auto;
    text-align: center;
    :deep(.wd-button) {
      // width: 94% !important;
      height: 40px;
    }
  }
  .partTitle {
    padding-left: 15px;
    margin-bottom: 10px;
    text {
      display: inline-block;
      padding-left: 10px;
      font-size: 16px;
      line-height: 16px;
      border-left: 5px solid #2d69ef;
    }
  }
  .collectionMethod {
    display: flex;
    align-self: center;
    justify-content: space-evenly;
    padding: 0 10%;
    background: #f2f7fd;
    .methodItem {
      display: inline-block;
      width: 50%;
      height: 55px;
      font-size: 16px;
      line-height: 55px;
      color: #000;
      text-align: center;
    }
    .activeItem {
      position: relative;
      color: #2d69ef;
      &::after {
        position: absolute;
        bottom: 10px;
        left: 50%;
        width: 17px;
        height: 4px;
        content: '';
        background: #2d69ef;
        border-radius: 5px 5px 5px 5px;
        transform: translateX(-50%);
      }
    }
  }
}

.uploadTip {
  margin-top: 30px;
  text-align: center;
  .tipH6 {
    font-size: 20px;
    font-weight: 600;
    color: #000000;
  }
  .tipP {
    margin: 8px auto 16px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
  }
}

.photoRequire {
  padding: 20px 25px;
  background: #f2f7fd;
  border-bottom: 1px solid #dbe9fa;
}
.desTitle {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}
.requireLine {
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
  color: #666666;
}
.uploadCon {
  padding: 35px calc((100% - 300px - 40px) / 2) 0;
  .imgFlex {
    display: flex;
    justify-content: space-between;
  }
  .photoExample {
    box-sizing: border-box;
    width: 150px;
    height: 206px;
    padding: 14px;
    background: #f2f7fd;
    border: 1px solid #dbe9fa;
    border-radius: 5px;
  }
  .photoName {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    text-align: center;
  }
  .exampleImg {
    width: 120px;
    height: 148px;
  }
  .handleTip {
    margin-top: 36px;
  }
}
.formLine {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  .formLabel {
    position: relative;
    padding-left: 12px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    &:before {
      position: absolute;
      top: 50%;
      left: 0;
      display: inline-block;
      font-size: 18px;
      color: #fa4350;
      content: '*';
      transform: translateY(-50%);
    }
  }
}
:deep(.hasBg) {
  background-color: #f2f7fd !important;
  border-top: 1px solid #f1f1f1;
  .wd-picker__cell {
    background-color: #f2f7fd !important;
    border-top: 1px solid #f1f1f1;
  }
}
.hasBg {
  background-color: #f2f7fd !important;
  border-top: 1px solid #f1f1f1;
}
</style>
