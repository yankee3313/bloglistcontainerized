import { useEffect, useRef } from 'react'
import { Table } from 'react-bootstrap'
import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'
import { useDispatch, useSelector } from 'react-redux'
import { notifChange } from './reducers/notifReducer'
import { initializeBlogs, createBlog, likeBlog, removeBlog, addComment } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import { useParams, Route, Routes, Link, useNavigate } from 'react-router-dom'

import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import CommentForm from './components/CommentForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Footer from './components/Footer'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const blogFormRef = useRef()

  useEffect(() => {
    const user = storageService.loadUser()
    console.log('Loaded user:', user)
    if (user) {
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const notifyWith = (message, type) => {
    dispatch(notifChange(message, type, 10))
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      storageService.saveUser(user)
      blogService.setToken(user.token)
      dispatch(setUser(user))
      notifyWith('welcome!')
    } catch (e) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const logout = () => {
    storageService.removeUser()
    dispatch(clearUser())
    blogService.setToken(null)
    notifyWith('logged out')
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      dispatch(createBlog(newBlog))
      notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`)
      blogFormRef.current.toggleVisibility()
    } catch (e) {
      notifyWith(e.response.data.error, 'error')
    }
  }

  const handleLike = async (blog) => {
    try {
      await dispatch(likeBlog(blog))
      notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`)
    } catch (e) {
      notifyWith('error liking blog', 'error')
    }
  }

  const handleAddComment = async (blog, comment) => {
    try {
      await dispatch(addComment(blog, comment))
      notifyWith(`A comment added for the blog '${blog.title}' by '${blog.author}'`)
    } catch (e) {
      notifyWith('error commenting blog', 'error')
    }
  }

  const handleRemove = async (blog) => {
    const ok = window.confirm(
      `Are you sure you want to remove '${blog.title}' by ${blog.author}`
    )
    if (ok) {
      try {
        await dispatch(removeBlog(blog.id))
        navigate('/')
        notifyWith(`The blog '${blog.title}' by '${blog.author}' removed`)
      } catch (e) {
        notifyWith('failed to remove blog', 'error')
      }
    }}

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm login={login} />
      </div>
    )
  }

  /*
  const blogMatch = useMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find(b => b.id === Number(blogMatch.params.id))
    : null
  */

  const SoloBlog = () => {
    const { id } = useParams()
    const blog = blogs.find(n => n.id === id)
    const canRemove = user && blog.user.username === user.username
    return (
      <div>
        <h2>Ross&#39;s blog app</h2>
        <Notification />
        <div>
          <h2>{blog.title}</h2>
          <a href={blog.url}>{blog.url}</a>
          <div>{blog.likes} likes<button onClick={() => handleLike(blog)}>like</button></div>
          <div>added by {blog.user.name}</div>
          {canRemove && <button onClick={() => handleRemove(blog)}>delete</button>}
          <h2>comments</h2>
          <CommentForm blog={blog} addComment={handleAddComment}/>
          <ul>
            {blog.comments.map(comment => (
              <li key={comment}>
                {comment}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }


  const Home = () => {
    const byLikes = (b1, b2) => b2.likes - b1.likes

    const padding = {
      padding: 5
    }

    return (
      <div>
        <h2>Ross&#39;s blog app</h2>
        <Notification />
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <NewBlog style = {padding} createBlog={handleCreateBlog} />
        </Togglable>
        <Table striped>
          <thead>
            <tr>
              <th style={{ fontSize: 24 }}>Blog list</th>
            </tr>
          </thead>
          <tbody>
            {blogs.sort(byLikes).map((blog) => (
              <tr key={blog.id} ><td>
                <Link style={padding} to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
              </td></tr>
            ))}
          </tbody>
        </Table>
      </div>
    )}

  const Users = () => {

    const userBlogCounts = blogs.reduce((countMap, blog) => {
      const userName = blog.user.name
      countMap[userName] = (countMap[userName] || 0) + 1
      return countMap
    }, {})

    return (
      <div>
        <h2>Ross&#39;s blog app</h2>
        <Notification />
        <h2>Users</h2>
        <Table striped>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(userBlogCounts).map(([user, count]) => {
              const userBlog = blogs.find((blog) => blog.user.name === user)
              return (
                <tr key={user}>
                  <td>
                    <Link to={`/users/${userBlog.user.id}`}>{user}</Link>
                  </td>
                  <td>{count}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }

  const User = () => {
    const { id } = useParams()
    const userBlogs = blogs.filter(blog => blog.user.id === id)

    if (!user) {
      return null
    }
    return (
      <div>
        <h2>Ross&#39;s blog app</h2>
        <Notification style={padding}/>
        <h3>User: {userBlogs[0].user.name}</h3>
        <h4>added blogs</h4>
        <ul>
          {userBlogs.map(blog => (
            <li key={blog.id}>
              {blog.title}
            </li>
          ))}
        </ul>
      </div>
    )}

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/users/:id" element={<User/>} />
        <Route path="/blogs/:id" element={<SoloBlog/>} />
      </Routes>

      <Footer/>
    </div>
  )
}

export default App
