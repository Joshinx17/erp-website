import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner } from 'react-bootstrap'
import { subjectAPI, teacherAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', description: '', teacher: '' })

  useEffect(() => {
    Promise.all([
      subjectAPI.getAll(),
      teacherAPI.getAll(),
    ]).then(([s, t]) => {
      setSubjects(s.data)
      setTeachers(t.data)
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const openEdit = (sub) => {
    setEditing(sub._id)
    setForm({ name: sub.name, code: sub.code, description: sub.description || '', teacher: sub.teacher?._id || '' })
    setShowModal(true)
  }

  const resetForm = () => { setForm({ name: '', code: '', description: '', teacher: '' }); setEditing(null) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) await subjectAPI.update(editing, form)
      else await subjectAPI.create(form)
      const res = await subjectAPI.getAll()
      setSubjects(res.data)
      setShowModal(false)
      resetForm()
    } catch (err) { alert(err.response?.data?.message || 'Error saving') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return
    await subjectAPI.delete(id)
    setSubjects(subjects.filter((s) => s._id !== id))
  }

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="admin" /></Col>
        <Col md={9}>
          <div className="d-flex justify-content-between mb-3">
            <h3>Subject Management</h3>
            <Button onClick={() => { resetForm(); setShowModal(true) }}>+ New Subject</Button>
          </div>
          <Card className="shadow-sm">
            <Card.Body>
              <Table striped hover responsive>
                <thead><tr><th>Code</th><th>Name</th><th>Teacher</th><th>Actions</th></tr></thead>
                <tbody>
                  {subjects.length === 0 ? <tr><td colSpan={4} className="text-center text-muted">No subjects</td></tr>
                  : subjects.map((s) => (
                    <tr key={s._id}>
                      <td className="fw-bold">{s.code}</td>
                      <td>{s.name}</td>
                      <td>{s.teacher?.name || 'Unassigned'}</td>
                      <td>
                        <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEdit(s)}>Edit</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(s._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{editing ? 'Edit' : 'New'} Subject</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Code</Form.Label><Form.Control value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Assign Teacher</Form.Label><Form.Select value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}><option value="">Unassigned</option>{teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}</Form.Select></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}
