import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner } from 'react-bootstrap'
import { classAPI, teacherAPI, subjectAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', section: 'A', classTeacher: '', academicYear: '', subjects: [] })

  useEffect(() => {
    Promise.all([
      classAPI.getAll(),
      teacherAPI.getAll(),
      subjectAPI.getAll(),
    ]).then(([c, t, s]) => {
      setClasses(c.data)
      setTeachers(t.data)
      setSubjects(s.data)
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const openEdit = (cls) => {
    setEditing(cls._id)
    setForm({
      name: cls.name,
      section: cls.section,
      classTeacher: cls.classTeacher?._id || '',
      academicYear: cls.academicYear || '',
      subjects: cls.subjects?.map((s) => s._id) || [],
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setForm({ name: '', section: 'A', classTeacher: '', academicYear: '', subjects: [] })
    setEditing(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) await classAPI.update(editing, form)
      else await classAPI.create(form)
      const res = await classAPI.getAll()
      setClasses(res.data)
      setShowModal(false)
      resetForm()
    } catch (err) { alert(err.response?.data?.message || 'Error saving') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return
    await classAPI.delete(id)
    setClasses(classes.filter((c) => c._id !== id))
  }

  const handleSubjectToggle = (subId) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subId)
        ? prev.subjects.filter((s) => s !== subId)
        : [...prev.subjects, subId],
    }))
  }

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="admin" /></Col>
        <Col md={9}>
          <div className="d-flex justify-content-between mb-3">
            <h3>Class Management</h3>
            <Button onClick={() => { resetForm(); setShowModal(true) }}>+ New Class</Button>
          </div>
          <Card className="shadow-sm">
            <Card.Body>
              <Table striped hover responsive>
                <thead><tr><th>Name</th><th>Section</th><th>Class Teacher</th><th>Subjects</th><th>Year</th><th>Actions</th></tr></thead>
                <tbody>
                  {classes.length === 0 ? <tr><td colSpan={6} className="text-center text-muted">No classes</td></tr>
                  : classes.map((c) => (
                    <tr key={c._id}>
                      <td className="fw-bold">{c.name}</td>
                      <td>{c.section}</td>
                      <td>{c.classTeacher?.name || '-'}</td>
                      <td>{c.subjects?.map((s) => s.name).join(', ') || '-'}</td>
                      <td>{c.academicYear}</td>
                      <td>
                        <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEdit(c)}>Edit</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c._id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{editing ? 'Edit' : 'New'} Class</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Class Name</Form.Label><Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Class 10" /></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Section</Form.Label><Form.Control value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} /></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Academic Year</Form.Label><Form.Control value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} placeholder="2024-2025" /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label>Class Teacher</Form.Label><Form.Select value={form.classTeacher} onChange={(e) => setForm({ ...form, classTeacher: e.target.value })}><option value="">None</option>{teachers.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.employeeId})</option>)}</Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Subjects</Form.Label><div style={{ maxHeight: '200px', overflowY: 'auto' }}>{subjects.map((s) => (<Form.Check key={s._id} type="checkbox" label={`${s.name} (${s.code})`} checked={form.subjects.includes(s._id)} onChange={() => handleSubjectToggle(s._id)} />))}</div></Form.Group>
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
