import React, { useEffect, useRef, useState } from 'react'

import { Button, Checkbox, Form, message, Row, TimePicker } from 'antd'
import moment from 'moment'
import { useAppSelector } from 'src/redux'

import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'

import { getUserScheduleApi, postUserSchedule } from '../../api/client/user'
import styles from './freetime.module.scss'

const ALL_DAY_OF_WEEK = 1
const timeFormat = 'HH:mm'
const FreeTime = (): JSX.Element => {
  const [form] = Form.useForm()
  const { profile } = useAppSelector(state => state.user)
  const [userSchedule, setUserSchedule] = React.useState<any>([])
  const checkListDays = useRef<number[]>([])
  const { DayOfWeek, DayOfWeek: dayList = [] } = useAppSelector(state => state.initData.data)
  const arrDay: number[] = dayList.map(item => item.id)

  const [valueForm, setValueForm] = useState<any>({})

  const handleChangeDayOfWeek = listDaysOfWeek => {
    form.setFieldsValue({})
    if (listDaysOfWeek.includes(1)) {
      if (!checkListDays.current.includes(1)) {
        form.setFieldsValue({ dayOfWeek: arrDay })
        checkListDays.current = arrDay
      } else {
        const filterArr = listDaysOfWeek.filter(item => item !== 1)
        form.setFieldsValue({ dayOfWeek: filterArr })
        checkListDays.current = filterArr
      }

    } else if (listDaysOfWeek.length === 7) {
      if (!checkListDays.current.includes(1)) {
        form.setFieldsValue({ dayOfWeek: arrDay })
        checkListDays.current = arrDay
      } else {
        form.setFieldsValue({ dayOfWeek: [] })
        checkListDays.current = []
      }
    } else {
      checkListDays.current = listDaysOfWeek
      form.setFieldsValue({ dayOfWeek: listDaysOfWeek })
    }
  }

  const convertDoubleToTime = (item: any) => {
    const hour = Math.floor(item)
    const min = Math.round((item - hour) * 60)
    return `${hour}:${min}`
  }

  const converTimeToDouble = (timeFloat: any) => {
    const currentTime = timeFloat.split(':')
    const hour = parseFloat(currentTime[0])
    const min = parseFloat(currentTime[1])
    return (hour + min / 60).toFixed(2)
  }

  const getData = async () => {
    const result = await getUserScheduleApi()
    if (result.data.data) {
      const days = result.data.data.reduce(
        (list: any[], current: any) =>
          list.includes(current.dayOfWeek) ? list : [...list, current.dayOfWeek],
        [],
      )


      handleChangeDayOfWeek(days)

      const listSelectedDay = days.includes(ALL_DAY_OF_WEEK)
        ? DayOfWeek.filter((i: any) => i.id !== ALL_DAY_OF_WEEK).map((i: any) => i.id)
        : days.filter((i: number) => i !== ALL_DAY_OF_WEEK)

      const firstItem = result.data.data?.[0]?.dayOfWeek

      if (firstItem !== undefined) {
        const listTimer = result.data.data
          .filter((i: any) => i.dayOfWeek === firstItem)
          .map((i: any) => ({
            from: convertDoubleToTime(i.workingTimeFrom),
            to: convertDoubleToTime(i.workingTimeTo),
          }))
        if (listTimer.length > 0) {
          setUserSchedule(listTimer)
        }
      }
    }
  }

  const onPressSave = async () => {
    if (userSchedule.length <= 0 || userSchedule.find(i => !i.from || !i.to)) {
      message.warning('Bạn cần phải điền Khoảng thời gian rảnh!')
      return
    }

    let body
    if (checkListDays.current.length === 7) {
      body = userSchedule.map((i: { from: string; to: string }) => ({
        dayOfWeek: 1,
        shiftId: 0,
        workingTimeFrom: parseFloat(converTimeToDouble(i.from) || '0'),
        workingTimeTo: parseFloat(converTimeToDouble(i.to) || '0'),
      }))
    } else {
      body = checkListDays.current.reduce((list: any[], current: any) => {
        const schedulesList = userSchedule.map((i: { from: string; to: string }) => ({
          dayOfWeek: current,
          shiftId: 0,
          workingTimeFrom: parseFloat(converTimeToDouble(i.from) || '0'),
          workingTimeTo: parseFloat(converTimeToDouble(i.to) || '0'),
        }))
        return [...list, ...schedulesList]
      }, [])
    }

    try {
      await postUserSchedule(profile.id, body).then((res) => {
        message.success('Chỉnh sửa thời gian rảnh thành công!')
      })
    } catch (error) {
      message.error('Chỉnh sửa thời gian rảnh thất bại!')
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const onChangeTime = (changeTime, index, type) => {
    const time = changeTime ? moment(changeTime).format(timeFormat) : ""
    setUserSchedule(userSchedule.map((i, ind) => (ind === index ? { ...i, [type]: time } : i)))
  }

  return (
    <div className={`freetime ${styles.main}`}>
      <Form form={form} className={styles.wrap}>
        <div className={styles.container}>
          <h2 className={styles.title}>
            Thời gian rảnh
          </h2>
          <div className={styles.schedule}>
            <Row>
              <div className={styles.schedule_title}>Chọn khoảng thời gian</div>
            </Row>
            {userSchedule?.map((item, index) => (
              <Form.Item key={index} name="timeSchedules">
                <div key={index} className={styles.timeItem}>
                  <div key={index} className={styles.timeBlock}>
                    <div className={styles.timeInput}>
                      {`Từ \t`}{' '}
                      <TimePicker
                        onChange={value => onChangeTime(value, index, 'from')}
                        defaultValue={moment(item.from, timeFormat)}
                        format={timeFormat}
                        className={styles.time_picker_input}
                      />
                    </div>
                    <div className={styles.timeInput}>
                      Đến{' '}
                      <TimePicker
                        onChange={value => onChangeTime(value, index, 'to')}
                        defaultValue={moment(item.to, timeFormat)}
                        format={timeFormat}
                        className={styles.time_picker_input}
                      />
                    </div>
                  </div>
                  <Button
                    type="dashed"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    size="small"
                    style={{ marginLeft: 20 }}
                    onClick={() => setUserSchedule(userSchedule.filter((i, ind) => index !== ind))}
                  />
                </div>
              </Form.Item>
            ))}
            {userSchedule.length < 3 ? (
              <div className={styles.button}>
                <div
                  className={styles.buttonNew}
                  onClick={() => {
                    setUserSchedule([...userSchedule, { from: '00:00', to: '00:00' }])
                  }}
                >
                  <PlusCircleOutlined className={styles.button_icon} size={24} />
                  Thêm mới
                </div>
              </div>
            ) : null}
          </div>


          <div className={styles.day_of_week}>
            <div className={styles.day_of_week_title}>Chọn thứ trong tuần</div>
            <Form.Item
              name="dayOfWeek"
              rules={[
                {
                  required: true,
                  message: 'Ngày làm việc không được để trống!',
                },
              ]}
            >
              <Checkbox.Group onChange={handleChangeDayOfWeek} className={styles.day_of_week_list}>
                {dayList.map(item => (
                  <Checkbox key={item.id} value={item.id}>
                    <div className={styles.day_of_week_item}>
                      {item.name}
                    </div>
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>
        </div>
        <div className={styles.button_save}>
          <div
            className={styles.button_save_freetime}
            // Note how the "error" class is accessed as a property on the imported
            // `styles` object.
            // className={styles.button}
            onClick={() => {
              form.submit()
              form
                .validateFields()
                .then(() => {
                  setValueForm({ ...valueForm, 'freeTime': userSchedule })
                  onPressSave()
                })
                .catch(() => {
                  message.warning('Bạn cần phải điền đầy đủ thời gian và ngày có thời gian rảnh!')
                })
            }}
          >
            Lưu
          </div>
        </div>
      </Form>
    </div>
  )
}
export default FreeTime

export async function getServerSideProps(ctx) {
  return { props: {} }
}