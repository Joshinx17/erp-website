import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner, Badge } from 'react-bootstrap'
import { assignmentAPI, classAPI, subjectAPI, submissionAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [submissions, setSubmissions] = useState({})
  const [gradeModal, setGradeModal] = useState(null)
  const [gradeData, setGradeData] = useState({ marks: '', feedback: '' })
  const [form, setForm] = useState({ title: '', description: '', subject: '', class: '', dueDate: '', totalMarks: 10, file: null })

  useEffect(() => {
    Promise.all([
      assignmentAPI.getAll({ teacher: 'me' }),
      classAPI.getAll(),
      subjectAPI.getAll(),
    ]).then(([a, c, s]) => {
      setAssignments(a.data)
      setClasses(c.data)
      setSubjects(s.data)
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const loadSubmissions = async (assignId) => {
    try {
      const res = await submissionAPI.getAll({ assignment: assignId })
      setSubmissions((prev) => ({ ...prev, [assignId]: res.data }))
    } catch (err) { console.error(err) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (k === 'file' ? v : true) fd.append(k, v) })
    if (form.file) fd.append('file', form.file)
    try {
      if (editing) {
        await assignmentAPI.update(editing, fd)
      } else {
        await assignmentAPI.create(fd)
      }
      const res = await assignmentAPI.getAll({ teacher: 'me' })
      setAssignments(res.data)
      setShowModal(false)
      resetForm()
    } catch (err) { alert(err.response?.data?.message || 'Error saving') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return
    await assignmentAPI.delete(id)
    setAssignments(assignments.filter((a) => a._id !== id))
  }

  const handleGrade = async (subId) => {
    try {
      await submissionAPI.grade(subId, gradeData)
      setGradeModal(null)
      loadSubmissions(gradeModal.assignment)
    } catch (err) { alert(err.response?.data?.message || 'Error grading') }
  }

  const resetForm = () => {
    setForm({ title: '', description: '', subject: '', class: '', dueDate: '', totalMarks: 10, file: null })
    setEditing(null)
  }

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="teacher" /></Col>
        <Col md={9}>
          <div className="d-flex justify-content-between mb-3">
            <h3>Assignments</h3>
            <Button onClick={() => { resetForm(); setShowModal(true) }}>+ New Assignment</Button>
          </div>
          {assignments.length === 0 ? (
            <Card className="shadow-sm p-5 text-center text-muted">No assignments created yet</Card>
          ) : assignments.map((a) => (
            <Card key={a._id} className="shadow-sm mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>{a.title}</h5>
                    <small className="text-muted">{a.subject?.name} • {a.class?.name} • Due: {new Date(a.dueDate).toLocaleDateString()}</small>
                    <p className="mt-1">{a.description}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-info" onClick={() => loadSubmissions(a._id)}>Submissions</Button>
                    <Button size="sm" variant="outline-primary" onClick={() => {
                      setForm({ title: a.title, description: a.description, subject: a.subject?._id, class: a.class?._id, dueDate: a.dueDate?.split('T')[0], totalMarks: a.totalMarks, file: null })
                      setEditing(a._id)
                      setShowModal(true)
                    }}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(a._id)}>Delete</Button>
                  </div>
                </div>
                {submissions[a._id] && (
                  <div className="mt-3 border-top pt-2">
                    <h6>Submissions ({submissions[a._id].length})</h6>
                    <Table size="sm">
                      <thead><tr><th>Student</th><th>File</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {submissions[a._id].map((s) => (
                          <tr key={s._id}>
                            <td>{s.student?.name}</td>
                            <td>{s.fileUrl && <a href={s.fileUrl} target="_blank" rel="noreferrer">View</a>}</td>
                            <td><Badge bg={s.status === 'graded' ? 'success' : 'warning'}>{s.status}</Badge></td>
                            <td>
                              {s.status === 'submitted' ? (
                                <Button size="sm" variant="success" onClick={() => setGradeModal(s)}>Grade</Button>
                              ) : `${s.marks}/${a.totalMarks}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>{editing ? 'Edit' : 'New'} Assignment</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Title</Form.Label><Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Form.Group></Col>
            <Col md={6}><Form.Group className="mb-3"><Form.Label>Total Marks</Form.Label><Form.Control type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} /></Form.Group></Col></Row>
            <Form.Group className="mb-3"><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Form.Group>
            <Row><Col md={4}><Form.Group className="mb-3"><Form.Label>Class</Form.Label><Form.Select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} required>{classes.map((c) => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}</Form.Select></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label>Subject</Form.Label><Form.Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>{subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</Form.Select></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label>Due Date</Form.Label><Form.Control type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required /></Form.Group></Col></Row>
            {!editing && <Form.Group className="mb-3"><Form.Label>Attachment (optional)</Form.Label><Form.Control type="file" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} /></Form.Group>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={!!gradeModal} onHide={() => setGradeModal(null)}>
        <Modal.Header closeButton><Modal.Title>Grade Submission</Modal.Title></Modal.Header>
        <Modal.Body>
          <p><strong>Student:</strong> {gradeModal?.student?.name}</p>
          <Form.Group className="mb-3"><Form.Label>Marks</Form.Label><Form.Control type="number" value={gradeData.marks} onChange={(e) => setGradeData({ ...gradeData, marks: e.target.value })} /></Form.Group>
          <Form.Group><Form.Label>Feedback</Form.Label><Form.Control as="textarea" rows={3} value={gradeData.feedback} onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })} /></Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setGradeModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={() => handleGrade(gradeModal._id)}>Submit Grade</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
