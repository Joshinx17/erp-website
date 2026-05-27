import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Modal, Form, Spinner } from 'react-bootstrap'
import { galleryAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', image: null })

  useEffect(() => {
    galleryAPI.getAll()
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    if (form.image) fd.append('image', form.image)
    try {
      await galleryAPI.create(fd)
      const res = await galleryAPI.getAll()
      setItems(res.data)
      setShowModal(false)
      setForm({ title: '', description: '', image: null })
    } catch (err) { alert(err.response?.data?.message || 'Error uploading') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return
    await galleryAPI.delete(id)
    setItems(items.filter((i) => i._id !== id))
  }

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="admin" /></Col>
        <Col md={9}>
          <div className="d-flex justify-content-between mb-3">
            <h3>Gallery Management</h3>
            <Button onClick={() => setShowModal(true)}>+ Add Image</Button>
          </div>
          {items.length === 0 ? (
            <Card className="shadow-sm p-5 text-center text-muted">No gallery images uploaded yet</Card>
          ) : (
            <Row className="g-3">
              {items.map((item) => (
                <Col key={item._id} sm={6} md={4} lg={3}>
                  <Card className="shadow-sm">
                    <Card.Img variant="top" src={item.imageUrl} alt={item.title} style={{ height: '180px', objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title className="small">{item.title}</Card.Title>
                      {item.description && <Card.Text className="small text-muted">{item.description}</Card.Text>}
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Gallery Image</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Image File</Form.Label><Form.Control type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} required /></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Upload</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}
