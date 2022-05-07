declare namespace BlogGlobal {
  interface BlogFull extends Pagination.Pagi {
    data: Blog[]
  }

  interface Blog {
    [x: string]: number
    id: number
    status: number
    content: string
    imageUrl: string
    slug: string
    startTime: string
    summary: string
    title: string
    view: string
    fjobNewCategoryId: number
    newTag: {id: number, title: string}[]
  }
  interface CategoryBlog {
    id: number
    name: string
    type: number
  }
}
