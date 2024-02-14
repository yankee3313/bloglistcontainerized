import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {

  const style = {
    marginBottom: 2,
    padding: 5,
    borderStyle: 'solid',
  }

  const padding = {
    padding: 5
  }
  console.log(blog.id)

  return (
    <div style={style} className="blog">
      <Link key={blog.id} style={padding} to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
  }),
}

export default Blog
