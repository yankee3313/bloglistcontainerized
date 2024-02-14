import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '../reducers/blogReducer'

const CommentForm = ({ blog }) => {
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(addComment(blog, comment))
    setComment('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="comment"
            placeholder="Enter your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit">add comment</button>
        </div>
      </form>
    </div>
  )
}

export default CommentForm
