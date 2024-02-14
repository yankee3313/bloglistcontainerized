import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(username, password)
  }

  return (
    <div>
      <h2>Log in to application</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>
          username:</Form.Label>
          <Form.Control
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <Form.Label>
          password:
          </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button variant="primary" type="submit">
          login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm
