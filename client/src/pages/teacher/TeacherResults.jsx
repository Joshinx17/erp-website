import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner } from 'react-bootstrap'
import { resultAPI, examAPI, studentAPI, subjectAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function TeacherResults() {
  const [results, setResults] = useState([])
  const [exams, setExams] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ student: '', exam: '', subject: '', marksObtained: '', totalMarks: '', grade: '', remark: '' })

  useEffect(() => {
    Promise.all([
      resultAPI.getAll(),
      examAPI.getAll(),
      subjectAPI.getAll(),
    ]).then(([r, e, s]) => {
      setResults(r.data)
      setExams(e.data)
      setSubjects(s.data)
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const loadStudents = async () => {
    try {
      const res = await studentAPI.getAll()
      setStudents(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { if (showModal) loadStudents() }, [showModal])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await resultAPI.create(form)
      const res = await resultAPI.getAll()
      setResults(res.data)
      setShowModal(false)
      setForm({ student: '', exam: '', subject: '', marksObtained: '', totalMarks: '', grade: '', remark: '' })
    } catch (err) { alert(err.response?.data?.message || 'Error saving') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this result?')) return
    await resultAPI.delete(id)
    setResults(results.filter((r) => r._id !== id))
  }

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="teacher" /></Col>
        <Col md={9}>
          <div className="d-flex justify-content-between mb-3">
            <h3>Exam Results</h3>
            <Button onClick={() => setShowModal(true)}>+ Add Result</Button>
          </div>
          <Card className="shadow-sm">
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr><th>Student</th><th>Exam</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted">No results added</td></tr>
                  ) : results.map((r) => (
                    <tr key={r._id}>
                      <td>{r.student?.name}</td>
                      <td>{r.exam?.title}</td>
                      <td>{r.subject?.name}</td>
                      <td>{r.marksObtained}/{r.totalMarks}</td>
                      <td>{r.grade || '-'}</td>
                      <td><Button size="sm" variant="outline-danger" onClick={() => handleDelete(r._id)}>Delete</Button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Add Result</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Student</Form.Label><Form.Select value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} required><option value="">Select Student</option>{students.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}</Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Exam</Form.Label><Form.Select value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })} required><option value="">Select Exam</option>{exams.map((e) => <option key={e._id} value={e._id}>{e.title}</option>)}</Form.Select></Form.Group></Col>
            </Row>
            <Row>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Subject</Form.Label><Form.Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required><option value="">Select Subject</option>{subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</Form.Select></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Marks Obtained</Form.Label><Form.Control type="number" value={form.marksObtained} onChange={(e) => setForm({ ...form, marksObtained: e.target.value })} required /></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Total Marks</Form.Label><Form.Control type="number" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} required /></Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Grade</Form.Label><Form.Control value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="A+, B, etc" /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Remark</Form.Label><Form.Control value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} /></Form.Group></Col>
            </Row>
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
