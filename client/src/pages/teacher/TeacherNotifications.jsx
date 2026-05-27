import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Modal, Form, ListGroup, Spinner, Alert } from 'react-bootstrap'
import { notificationAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function TeacherNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', targetRole: 'student', targetClass: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    notificationAPI.getAll()
      .then((res) => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await notificationAPI.create(form)
      const res = await notificationAPI.getAll()
      setNotifications(res.data)
      setShowModal(false)
      setForm({ title: '', message: '', targetRole: 'student', targetClass: '' })
      setMsg({ type: 'success', text: 'Notification sent!' })
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Error' })
    }
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="teacher" /></Col>
        <Col md={9}>
          {msg && <Alert variant={msg.type} dismissible onClose={() => setMsg('')}>{msg.text}</Alert>}
          <div className="d-flex justify-content-between mb-3">
            <h3>Notifications</h3>
            <Button onClick={() => setShowModal(true)}>+ New Notification</Button>
          </div>
          <Card className="shadow-sm">
            <ListGroup variant="flush">
              {notifications.length === 0 ? (
                <ListGroup.Item className="text-muted">No notifications</ListGroup.Item>
              ) : notifications.map((n) => (
                <ListGroup.Item key={n._id}>
                  <h5 className="mb-1">{n.title}</h5>
                  <p className="mb-1">{n.message}</p>
                  <small className="text-muted">Target: {n.targetRole} • {new Date(n.createdAt).toLocaleDateString()}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Send Notification</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Message</Form.Label><Form.Control as="textarea" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Target</Form.Label><Form.Select value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })}>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="all">Everyone</option>
            </Form.Select></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Send</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}
