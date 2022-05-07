import { Col, Empty, Pagination, Row, Skeleton } from "antd";
import { useRouter } from "next/router";
import UserDetail from "src/components/modules/UserDetail/UserDetail";
import React, { useEffect, useState } from "react";
import { handleError, transformQueryToStr } from "src/utils/helper";
import { getProfileApi, getSearchUserApi } from "api/client/user";
import UserSearch from "../UserSearch";
import styles from "./CandidateAndDetail.module.scss";

const CandidateAndDetail = (): JSX.Element => {
  const router = useRouter()

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [dataUserList, setDataUserList] = useState<any>({})
  const [dataUserPreview, setDataUserPreview] = useState({});

  const onClickChangeUserPreview = (code) => {
    if (code !== String(router.query.code)) {
      setLoadingPreview(true)
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          code
        }
      })
    }
  }

  const fetchUserPreview = async () => {
    try {
      const { data } = await getProfileApi(String(router.query.code))
      setDataUserPreview(data.data)
    } catch (error) {
      handleError(error)
    } finally {
      setLoadingPreview(false)
    }
  }

  const fetchUserList = async () => {
    try {
      const { data } = await getSearchUserApi({ params: transformQueryToStr(router.query) })
      setDataUserList(data)
    } catch (error) {
      handleError(error)
      setDataUserList({ data: [] })
    }
  }


  const onChangePagi = (pageNumber: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: pageNumber
      }
    })
    window?.scrollTo(0, 0)
  }



  useEffect(() => {
    fetchUserList()
  }, [JSON.stringify(router.query)])

  useEffect(() => {
    if (router.query.code)
      fetchUserPreview()
  }, [router.query.code])



  return (
    <div className={`${styles.job} search`}>
      <div className={styles.job_main}>
        {
          dataUserList?.meta?.pagination?.total && (
            <div className={styles.job_main_header}>
              Tìm thấy <span className={styles.job_main_header_highlight}>{dataUserList?.meta?.pagination?.total} ứng viên</span> phù hợp với yêu cầu của bạn.
            </div>
          )
        }
        {!!Object.keys(dataUserList).length &&
          <Row className={styles.job_main_content}>
            {
              dataUserList.data.length ? (
                <Col md={router.query.code ? 12 : 24}>
                  <Row
                    className="justify-content-between" style={{
                      maxHeight: router.query.code ? "735px" : "unset",
                      overflow: router.query.code ? "auto" : "unset"
                    }}
                    gutter={[14, 14]}
                  >
                    {
                      dataUserList.data.map((user, i) => (
                        <Col key={i}
                          xs={24}
                          md={router.query.code ? 24 : 12}
                        >
                          <UserSearch
                            onClick={() => onClickChangeUserPreview(user.code)}
                            user={user}
                          />
                        </Col>
                      ))
                    }
                  </Row>
                  <div className={styles.job_main_content_pagi}>
                    <Pagination
                      total={dataUserList.meta.pagination.total}
                      current={dataUserList.meta.pagination.currentPage}
                      onChange={onChangePagi}
                      className={styles.candidate_pagi}
                      hideOnSinglePage
                    />
                  </div>
                </Col>
              ) : (
                <div className={styles.emptyResult}>
                  <Empty description="Không có ứng viên nào!" />
                </div>
              )
            }
            <>
              {
                !!router.query.code && !!Object.keys(dataUserPreview).length &&
                <Col md={12} className='pl-3' >
                  {
                    loadingPreview ?
                      <>
                        <Skeleton active className='p-4' />
                        <Skeleton active className='p-4 mt-2' />
                      </>
                      :
                      <div className='bg-white' style={{ maxHeight: "735px", overflow: "auto" }}>
                        <UserDetail userData={dataUserPreview} />
                      </div>
                  }
                </Col>
              }
            </>
          </Row>}
      </div>
    </div>
  )
}

export default CandidateAndDetail;