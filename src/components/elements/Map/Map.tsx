import ReactMapGL, { Marker } from '@goongmaps/goong-map-react'
import { message, Spin } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppSelector } from 'src/redux'
import { handleError } from 'src/utils/helper'
import styles from './Map.module.scss'

interface IProps {
  handlePostAddress(data): void
  handleCloseModalMap(): void
  initLocation?: CommonGlobal.AddressUser
  handleChangeMainAddress?: (data) => void
}

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`

const pinStyle = {
  fill: '#d00',
  stroke: 'none',
}

function Pin(props) {
  const { size = 20 } = props

  return (
    <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
      <path d={ICON} />
    </svg>
  )
}

const Map = (props: IProps): JSX.Element => {
  const {
    initLocation,
    handlePostAddress,
    handleCloseModalMap,
    handleChangeMainAddress,
  } = props

  const { FjobProvince: provinceList, FjobDistrict: districtList, FjobCommune: communeList } = useAppSelector(state => state.initData.data)

  const { latitude = 21.0377606916171, longitude = 105.83626031063875 } = (JSON.parse(localStorage.getItem(storageConstant.localStorage.geolocation) || "{}"))

  const [viewport, setViewport] = useState({
    latitude: initLocation?.latitude || 21.0377606916171,
    longitude: initLocation?.longitude || 105.83626031063875,
    zoom: 14,
  })

  const [txtSearch, setTxtSearch] = useState(initLocation?.address ?? '')

  const [listAddress, setListAddress] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(initLocation ?? undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setSelected(initLocation)
  }, [initLocation])

  const onPressSearch = async () => {
    setLoading(true)
    if (txtSearch.trim()) {
      const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${process.env.NEXT_PUBLIC_GOONG_KEY_API}&input=${txtSearch.trim()}`
      try {
        const { data } = await axios.get(url)
        if (data.predictions?.length) {
          setListAddress(data.predictions)
        } else message.error('Không tìm thấy địa chỉ nào!')
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    }
  }

  const onSelectAddress = async item => {
    const url = `https://rsapi.goong.io/geocode?place_id=${item.place_id}&api_key=${process.env.NEXT_PUBLIC_GOONG_KEY_API}`
    const res = await fetch(url)
    const resData = await res.json()

    if (resData?.results?.[0]) {
      const addressDetail = resData?.results?.[0]
      const index = addressDetail.address_components.length - 1

      const provinceId =
        provinceList.find(
          i => i.name.lastIndexOf(addressDetail.address_components?.[index]?.short_name) >= 0,
        )?.id || 0
      const districtId =
        districtList.find(
          i =>
            i.provinceId === provinceId &&
            i.name.lastIndexOf(addressDetail.address_components?.[index - 1]?.short_name) >= 0,
        )?.id || 0
      const communeId =
        communeList.find(
          i =>
            i.districtId === districtId &&
            i.name.lastIndexOf(addressDetail.address_components?.[index - 2]?.short_name) >= 0,
        )?.id || 0

      setTxtSearch(addressDetail.formatted_address)
      setSelected({
        address: addressDetail.formatted_address,
        latitude: addressDetail.geometry.location.lat,
        longitude: addressDetail.geometry.location.lng,
        provinceId,
        districtId,
        communeId,
      })
      setViewport({
        latitude: addressDetail.geometry.location.lat,
        longitude: addressDetail.geometry.location.lng,
        zoom: 14,
      })

      setListAddress([])
    }
  }

  const closeMapModal = () => {
    setTxtSearch('')
    setSelected(undefined)
    handleCloseModalMap()
    setListAddress([])
  }

  return (
    <div className={`map ${styles.map}`}>
      <div className={styles.map_header}>
        <input
          onKeyPress={e => {
            if (e.key === 'Enter') {
              onPressSearch()
            }
          }}
          className={styles.map_header_input}
          onChange={e => setTxtSearch(e.target.value)}
          value={txtSearch}
          placeholder="Nhập địa chỉ ..."
        />
        <button className={styles.map_header_btn} type="button" onClick={onPressSearch}>
          Tìm kiếm
        </button>
      </div>

      <div className={styles.map_main_list}>
        {(loading) ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          listAddress?.length > 0 && txtSearch &&
          listAddress.map((item, idx) => (
            <div key={idx} className={styles.map_main_item} onClick={() => onSelectAddress(item)}>
              {item.description}
            </div>
          ))
        )}
      </div>

      <ReactMapGL
        {...viewport}
        // mapStyle="https://tiles.goong.io/assets/goong_map_web.json'"
        goongApiAccessToken={process.env.NEXT_PUBLIC_GOONG_KEY_MAP}
        width="100%"
        height={400}
        // onLoad={onMapLoad}
        onViewportChange={view => setViewport(view)}
        reuseMaps
      >
        {viewport && (
          <Marker
            longitude={viewport.longitude}
            latitude={viewport.latitude}
            offsetTop={-20}
            offsetLeft={-10}
            // draggable
            // onDragStart={e => console.log("1", e)}
            // onDrag={e => console.log("2", e)}
            // onDragEnd={e => console.log("3", e)}
          >
            <Pin size={20} />
          </Marker>
        )}
      </ReactMapGL>




      {selected && Object.keys(selected).length && txtSearch && (
        <div className={styles.map_btn}>
          <button
            type="button"
            onClick={() => {
              closeMapModal()
              handlePostAddress(selected)
            }}
          >
            Xác nhận
          </button>

          {handleChangeMainAddress && !initLocation?.isMain && (
            <button
              type="button"
              style={{ backgroundColor: 'green', border: 'none' }}
              onClick={() => {
                closeMapModal()
                if (handleChangeMainAddress) handleChangeMainAddress(selected)
              }}
            >
              Chọn địa chỉ mặc định
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Map

Map.defaultProps = {
  initLocation: {},
  handleChangeMainAddress: null
}
