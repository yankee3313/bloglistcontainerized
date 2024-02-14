import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'LIKE':
    return state.map(b => b.id === action.data.id ? action.data : b)
  case 'REMOVE':
    return state.filter((b) => b.id !== action.data)
  case 'ADD_COMMENT':
    return state.map(b => b.id === action.data.id ? action.data : b)
  case 'INIT_BLOGS':
    return action.data
  default:
    return state
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    await blogService.update(updatedBlog)
    dispatch({
      type: 'LIKE',
      data: updatedBlog,
    })
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch({
      type: 'REMOVE',
      data: id,
    })
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export const addComment = (blog, comment) => {
  return async (dispatch) => {
    const updatedBlog = { ...blog, comments: blog.comments.concat(comment) }
    await blogService.update(updatedBlog)
    dispatch({
      type: 'ADD_COMMENT',
      data: updatedBlog,
    })
  }
}

export default blogReducer
