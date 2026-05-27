import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      navigate(`/${data.role}/dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const quickFill = (e, p) => { setEmail(e); setPassword(p) }

  return (
    <Container className="py-5" style={{ maxWidth: '450px' }}>
      <Card className="shadow">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4 text-primary">HAJ ERP Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Login'}
            </Button>
          </Form>
          <hr />
          <p className="text-center text-muted small mb-2">Quick Login (Demo)</p>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" size="sm" onClick={() => quickFill('admin@haj.edu', 'admin123')}>Admin Login</Button>
            <Button variant="outline-success" size="sm" onClick={() => quickFill('sharma@haj.edu', 'teacher123')}>Teacher Login</Button>
            <Button variant="outline-info" size="sm" onClick={() => quickFill('joshin@haj.edu', 'student123')}>Student Login</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}
