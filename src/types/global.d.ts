type Errors = string[]

type ErrorMsg = {
  response: {
    data: {
      message: string; errorCode: number; cause: {
        errorContent: { message: string }
      }
    }
  }
}

declare namespace Pagination {
  interface Pagi {
    meta: {
      pagination: {
        currentPage: number
        links: {
          next: string
          prev: string
        }
        limit: number
        total: number
        totalPages: number
      }
    }
  }

  // error.response.data
}
interface ErrorResponseApi {
  // error Ơ

  cause: string | unknown
  errorCode: number
  message: string
}