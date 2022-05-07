import React, { FC } from 'react'

import {
  Form,
  Input,
  Select,
} from 'antd'
import { useRouter } from 'next/router'
import { routerPathConstant } from 'src/constants/routerConstant'
import { useAppSelector } from 'src/redux'
import { filterSelectOption } from 'src/utils/helper'

import { CloseOutlined } from '@ant-design/icons'

import styles from './Banner.module.scss'

const Banner: FC = () => {
  const router = useRouter()
  const [form] = Form.useForm();
  const {
    FjobCategory: categoryList = [],
    FjobProvince: provinceList = [],
  } = useAppSelector(state => state.initData.data)

  const onSearchJob = (value) => {

    const query: { search?: string, categories?: string, provinceId?: string, locationType?: number } = {}
    const keyArr = ["search", "categories", "provinceId"]

    keyArr.forEach(element => {
      if (element === "provinceId" && value[element]) {
        query[element] = value[element]
        query.locationType = 2
      } else if (value[element]) query[element] = value[element]

      // console.log(value[element]);
    });

    router.push({
      pathname: routerPathConstant.search,
      query
    })
  }


  return (
    <div className={styles.homepage_banner}>
      <div className={styles.banner_wrap}>
        <div className={styles.banner_img}>
          <img alt="" src="/assets/images/homepage/banner/banner-01.png" />
        </div>
        <div className={styles.banner_search}>
          <div className={`homepage ${styles.inner}`}>
            <Form form={form} onFinish={onSearchJob} >
              <div className={styles.form}>
                <Form.Item name="search">
                  <Input style={{ height: "40px", borderRadius: "8px" }} placeholder="Việc làm, từ khóa hoặc công ty"
                    suffix={<CloseOutlined style={{ color: "grey" }} onClick={() => form.resetFields(["search"])} />} />
                </Form.Item>
                <Form.Item name="categories" >
                  <Select
                    placeholder="Tất cả ngành nghề"
                    allowClear
                    showSearch
                    filterOption={filterSelectOption}
                  >
                    {categoryList.filter(cate => cate.parentId === 0).map(item =>
                    (<Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>)
                    )}
                  </Select>
                </Form.Item>
                <Form.Item name="provinceId">
                  <Select placeholder="Tất cả địa điểm">
                    {provinceList.map(item =>
                    (<Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>)
                    )}
                  </Select>
                </Form.Item>
                <div className={styles.search}>
                  <button type="submit">
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner