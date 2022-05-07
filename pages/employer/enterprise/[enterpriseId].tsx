import React from 'react'
import EnterpriseDetail from 'src/components/modules/Enterprise/EnterpriseDetail/EnterpriseDetail';

const EnterpriseDetailPage = ({ dataSSR }) => (
    <div><EnterpriseDetail enterpriseId={dataSSR} /></div>
)

export default EnterpriseDetailPage

export async function getServerSideProps(ctx) {
  try {
    return { props: { dataSSR: Number(ctx.query.enterpriseId) } }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
