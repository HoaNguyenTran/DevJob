/* eslint-disable jsx-a11y/label-has-associated-control */
import { getTransactionApi } from 'api/client/payment'
import React, { useState, useEffect } from 'react'
import { useAppSelector } from 'src/redux'
import { formatDiamond, handleError } from 'src/utils/helper'
import { DatePicker, Empty, Form, Pagination } from 'antd'
import { startOfToday } from 'date-fns'
import moment from 'moment'
import { configConstant } from 'src/constants/configConstant'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import styles from "./Transaction.module.scss"



const Transaction = (): JSX.Element => {
  const [form] = Form.useForm();
  const profile = useAppSelector(state => state.user.profile || {})
  const disabledDatePost = current => current && new Date(current) > startOfToday()

  const screen = useWindowDimensions()
  const translateX = screen.width && screen.width > 516 ? 244 : 220

  const [loading, setLoading] = useState(false)

  const [timeTransaction, setTimeTransaction] = useState<any>({})
  const [typeTransaction, setTypeTransaction] = useState(0)
  const [pageTransaction, setPageTransaction] = useState(1)
  const [dataTransaction, setDataTransaction] = useState<TransactionGlobal.TransactionHistoryResponse>({} as TransactionGlobal.TransactionHistoryResponse)

  // console.log(moment().startOf("D").unix());


  const fetchData = async () => {
    setLoading(true)
    try {
      let query: any = { page: pageTransaction, transType: typeTransaction }
      if (timeTransaction.fromDate) query = { ...query, ...timeTransaction }

      const { data } = await getTransactionApi(query)

      setDataTransaction(data)
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
      setDataTransaction({} as TransactionGlobal.TransactionHistoryResponse)
    } finally {
      setLoading(false)
    }
  }

  const onFinishDate = (values) =>
    values.time
      ? setTimeTransaction({ fromDate: moment(values.time[0]).unix(), toDate: moment(values.time[1]).startOf("D").unix() })
      : setTimeTransaction({})


  useEffect(() => {
    fetchData()
  }, [typeTransaction, pageTransaction, timeTransaction])


  const renderPagi = ({ totalItem, currentPage }) => (
    <Pagination
      total={totalItem}
      current={currentPage}
      onChange={pageNumber => setPageTransaction(pageNumber)}
      // className={styles.candidate_pagi}
      hideOnSinglePage
    />
  )


  const renderDataTransaction = <div>
    {(dataTransaction.data || []).map(transaction => <div key={transaction.transId} className={styles.transaction_item}>
      <div className={styles.item_inner}>
        <div className={styles.item_info}>
          <div className={styles.item_time}>
            <div>
              {moment.unix(Number(transaction.transTime)).format(`DD-MM-YYYY`)}
            </div>
            <div>
              {moment.unix(Number(transaction.transTime)).format(`hh:mm`)}
            </div>
          </div>
          <div className={styles.item_content}>{transaction.logType === 3
            ? <div>{transaction.detail}</div>
            : <div>Mua KC</div>
          }</div>
        </div>
        <div className={styles.item_coin} style={{ color: transaction.logType === 3 ? "var(--red-color)" : "var(--green-color)" }}>{transaction.logType === 3 ? "-" : "+"} {formatDiamond(transaction.coin)} KC</div>
      </div>
    </div>)}
    <div className={styles.transaction_pagi}>
      {renderPagi({ totalItem: dataTransaction.meta?.pagination?.total || 0, currentPage: pageTransaction })}
    </div>
  </div>


  return (
    <div className={`transaction ${styles.transaction}`}>
      <div className={styles.transaction_wrap}>
        <div className={styles.transaction_header}>
          <div className={styles.header_inner}>
            <div className={styles.left}>
              <div className={styles.title}>Tên người dùng:</div>
              <div className={styles.name}>{profile.name}</div>
            </div>
            <div className={styles.right}>
              <div className={styles.title}>Tài khoản của bạn còn:</div>
              <div className={styles.wallet}>


                <span>{formatDiamond(profile.walletValue)}</span>
                &nbsp;
                <img src="/assets/icons/color/diamond.svg" alt="" /></div>

            </div>
          </div>
        </div>
        <div className={styles.transaction_main}>
          <Form
            form={form}
            onFinish={onFinishDate}
          >
            <div className={styles.transaction_time}>
              <Form.Item name="time">
                <DatePicker.RangePicker
                  placeholder={['Từ ngày', 'Đến ngày']}
                  allowClear
                  format={configConstant.displayTime.DDMMYYY}
                  disabledDate={disabledDatePost}
                  defaultPickerValue={[moment().subtract(2, 'months'), moment().subtract(1, 'months')]} />
              </Form.Item>
              <Form.Item>
                <button type="submit">Lọc</button>
              </Form.Item>
            </div>
          </Form>
          <div className={styles.transaction_tab}>
            <div className={styles.transaction_overlay} style={{ transform: `translateX(${(typeTransaction) * translateX}px)` }} />
            <div className={styles.tab_tab} onClick={() => { setTypeTransaction(0); setPageTransaction(1) }}>
              <span>
                Toàn bộ
              </span>
            </div>
            <div className={styles.tab_tab} onClick={() => { setTypeTransaction(1); setPageTransaction(1) }}>
              <span>
                Nạp kim cương
              </span>
            </div>
            <div className={styles.tab_tab} onClick={() => { setTypeTransaction(2); setPageTransaction(1) }}>
              <span>
                Tiêu kim cương
              </span>
            </div>
          </div>
          {!loading && <div>
            {dataTransaction.data ?
              <div>{renderDataTransaction}</div> :
              <div className={styles.transaction_empty}>
                <Empty description="Không có giao dịch nào!" />
              </div>
            }
          </div>}
        </div>
      </div>
    </div>
  )
}
export default Transaction