import { CaretDownOutlined, DownOutlined } from '@ant-design/icons'
import { Col, Dropdown, Menu, Modal, Row, } from 'antd'
import { getDetailJobApi, getSearchJobApi } from 'api/client/job'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import Map from 'src/components/elements/Map/Map'

import { useAppSelector } from 'src/redux'
import JobAndDetail from 'src/components/elements/JobAndDetail'
import { handleError } from 'src/utils/helper'
import styles from "./SuitableDistance.module.scss";

const distanceList = [
  {
    key: 0,
    label: "Dưới 3Km",
    distance: 3000
  },
  {
    key: 1,
    label: "Dưới 5 Km",
    distance: 5000
  },
  {
    key: 2,
    label: "Dưới 10 Km",
    distance: 10000
  },
  {
    key: 3,
    label: "Trên 10 Km",
    distance: 20000
  },
  {
    key: 4,
    label: "Bất kể khoảng cách",
    distance: 2000000
  },
]

const suitableDistance = () => {
  const { addresses = [] } = useAppSelector(state => state.user.profile)
  const [jobs, setJobs] = useState<any>()
  const router = useRouter()
  const [isModalMap, setIsModalMap] = useState(false)

  const { address = "", latitude = 0, longitude = 0 } = router.query

  const location = {
    address: address || addresses?.[0]?.address || "",
    latitude: latitude || addresses?.[0]?.latitude || 0,
    longitude: longitude || addresses?.[0]?.longitude || 0
  }

  const distanceSearch = parseInt(String(router.query.distance), 10) || distanceList[0].distance

  useEffect(() => {
    const mainAddress = addresses.find(i => i.main === 1);
    if (mainAddress) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: router.query.page || 1,
          longitude: router.query.longitude || mainAddress.longitude,
          latitude: router.query.latitude || mainAddress.latitude,
          address: router.query.address || mainAddress.address,
          distance: router.query.distance || 10000
        }
      })
    } else {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: router.query.page || 1,
          distance: router.query.distance || 10000
        }
      })
    }
  }, [])

  useEffect(() => {
    if (router.query.jobId) {
      activeItemGroup(Number(router.query.jobId))
    }
    getJob();
  }, [JSON.stringify(router.query)])

  const activeItemGroup = (id) => {
    const newDataGroups = (jobs?.data || []).map(item => ({
      ...item,
      isActive: item.id === id
    }));
    setJobs({
      ...jobs,
      data: newDataGroups
    })
  }

  const getJob = async () => {
    const { page = 1 } = router.query
    handlerCallApi({ distance: distanceSearch, locationType: 1, longitude: location.longitude, latitude: location.latitude, page })
  }

  const handleAddress = (data) => {
    const query: any = {
      ...router.query,
      longitude: data.longitude,
      latitude: data.latitude,
      address: data.address,
      page: 1
    }
    if (query.jobId) {
      delete query.jobId
    }
    router.push({
      pathname: router.pathname,
      query
    })
  }

  const loadingDataPreview = async (id) => {
    try {
      const { data } = await getDetailJobApi(id);
      return data;
    } catch (error) {
      handleError(error)
    }
  }

  const handlerCallApi = async (params) => {
    try {
      const resData = await getSearchJobApi(params)

      let newDataGroups = resData.data.data;
      if (router.query.jobId) {
        if (router.query.isOtherPage) {
          const data = await loadingDataPreview(Number(router.query.jobId));
          newDataGroups = newDataGroups.filter(item => item.id !== Number(data?.id));
          newDataGroups.unshift(data)
        }
        newDataGroups = newDataGroups.map(item => ({
          ...item,
          isActive: item.id === Number(router.query.jobId)
        }));
      }

      setJobs({
        ...resData.data,
        data: newDataGroups
      })
    } catch (error) {
      // message.error('Không tìm thấy kết quả nào!')
      setJobs({ data: [] })
    } finally {
      // setLoading(false)
    }
  }

  const handleSearch = async (page = 1) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 1
      }
    })
  }

  const onSelectDistance = ({ key }) => {
    const query: any = {
      ...router.query,
      distance: parseInt(key, 10),
      page: 1
    }
    if (query.jobId) {
      delete query.jobId
    }
    router.push({
      pathname: router.pathname,
      query
    })
  }


  const onSelectAddress = ({ key }) => {
    const current = addresses.find(i => i.id === parseInt(key, 10))
    if (current) {
      const query: any = {
        ...router.query,
        longitude: current.longitude,
        latitude: current.latitude,
        address: current.address,
        page: 1
      }
      if (query.jobId) {
        delete query.jobId
      }
      router.push({
        pathname: router.pathname,
        query
      })
    }
  }

  const menuDistance = (
    <Menu onClick={onSelectDistance}>
      {
        distanceList.map(i => (
          <Menu.Item key={i.distance}>
            <div>
              {i.label}
            </div>
          </Menu.Item>
        ))
      }
    </Menu>
  );

  const menuAddress = (
    <Menu onClick={onSelectAddress}>
      {
        addresses.map(i => (
          <Menu.Item key={i.id}>
            <div>
              {i.address}
            </div>
          </Menu.Item>
        ))
      }
    </Menu>
  );



  return (
    <div className={styles.main}>
      <div className={styles.main_wrap}>
        <div className={styles.main_wrap_header}>
          <div className={styles.main_wrap_header_title}>
            Địa chỉ của bạn
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Dropdown overlay={menuAddress}>
                <div className={styles.address}>
                  <div className={styles.address_name}>
                    {location.address}
                  </div>
                  <DownOutlined />
                </div>
              </Dropdown>

            </Col>
            <Col xs={12} md={4}>
              <div className={styles.btn_search} onClick={() => handleSearch()}>
                Tìm kiếm
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className={styles.btn_map} onClick={() => setIsModalMap(true)}>
                Tìm trên bản đồ
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.main_wrap_filter}>
          <Row>
            <Col xs={24} md={12} className={styles.main_wrap_filter_distance}>
              <div>
                Danh sách Job
              </div>
              <Dropdown overlay={menuDistance}>
                <div className={styles.main_wrap_filter_distance_select}>
                  <div className={styles.main_wrap_filter_distance_select_text}>
                    {distanceList.find(i => i.distance === distanceSearch)?.label || ""}
                  </div>
                  <CaretDownOutlined style={{ color: "#6E00C2" }} />
                </div>
              </Dropdown>

            </Col>
          </Row>
        </div>
        <JobAndDetail data={jobs} />
      </div>
      <Modal
        onCancel={() => setIsModalMap(false)}
        visible={isModalMap}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">{`Thêm địa chỉ  `}</div>
          <Map handlePostAddress={handleAddress} handleCloseModalMap={() => setIsModalMap(false)} />
        </div>
      </Modal>
    </div>
  )
}

export default suitableDistance

export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies[storageConstant.cookie.accessToken]) {
    return {
      redirect: {
        destination: `${routerPathConstant.signIn}?next=${encodeURIComponent(ctx.req.url)}`,
        permanent: false,
      },
      props: {},
    }
  }
  setUserRoleCookieSSR({ ctx, role: roleConstant.EE.key })
  return { props: {} }
}