import { getProfileSSRApi } from 'api/server/user'
import { Base64 } from 'js-base64'
import nookies from "nookies"
import React, { FC } from 'react'
import UserDetail from 'src/components/modules/UserDetail/UserDetail'
import { storageConstant } from 'src/constants/storageConstant'


const UserPage: FC<any> = ({ userData }) => 
    <div className='py-3'>
      <UserDetail userData={userData}/> 
    </div>
  

export async function getServerSideProps(ctx) {
  const { usercode } = ctx.query;
  try {
    const user = await getProfileSSRApi(
      usercode,
      Base64.decode(nookies.get(ctx)[storageConstant.cookie.accessToken]),
    )
    return {
      props: {
        userData: user.data?.data,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default UserPage