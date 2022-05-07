import FastestValidator from 'fastest-validator'
import { configConstant } from 'src/constants/configConstant';

const v = new FastestValidator();

// pass 3 parameters respectively "name of api", schemas, response of api
// how to create reference schema at https://github.com/icebob/fastest-validator or entities file
export const validateResponse = async (api, schemas, response, log?: false) => {
  if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.development) {
    // if (log) console.log(`${api}()`, response);
    // const check = v.compile(schemas);
    // const flag = await check(response)
    // if (flag !== true) console.error(api, flag);
  }
}
