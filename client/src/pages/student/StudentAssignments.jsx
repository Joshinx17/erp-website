import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, ListGroup, Badge, Button, Modal, Form, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { assignmentAPI, submissionAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function StudentAssignments() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [file, setFile] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    Promise.all([
      assignmentAPI.getAll(),
      submissionAPI.getMy(),
    ]).then(([a, s]) => {
      setAssignments(a.data)
      setSubmissions(s.data)
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const getSubmission = (assignmentId) => submissions.find((s) => s.assignment?._id === assignmentId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selected) return
    const formData = new FormData()
    formData.append('assignment', selected._id)
    if (file) formData.append('file', file)
    if (notes) formData.append('notes', notes)
    try {
      await submissionAPI.submit(formData)
      const res = await submissionAPI.getMy()
      setSubmissions(res.data)
      setShowModal(false)
      setFile(null)
      setNotes('')
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed')
    }
  }

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="student" /></Col>
        <Col md={9}>
          <h3 className="mb-4">Assignments</h3>
          <Card className="shadow-sm">
            <ListGroup variant="flush">
              {assignments.length === 0 ? (
                <ListGroup.Item className="text-muted">No assignments posted yet</ListGroup.Item>
              ) : assignments.map((a) => {
                const sub = getSubmission(a._id)
                return (
                  <ListGroup.Item key={a._id}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{a.title}</h5>
                        <small className="text-muted">{a.subject?.name} • Due: {new Date(a.dueDate).toLocaleDateString()}</small>
                        <p className="mb-1 mt-1">{a.description}</p>
                        {a.fileUrl && <a href={a.fileUrl} target="_blank" rel="noreferrer" className="small">View Attachment</a>}
                        {sub && (
                          <div className="mt-2">
                            <Badge bg={sub.status === 'graded' ? 'success' : 'warning'}>
                              {sub.status === 'graded' ? `Graded: ${sub.marks}/${a.totalMarks}` : 'Submitted'}
                            </Badge>
                            {sub.feedback && <p className="mt-1 small text-muted">Feedback: {sub.feedback}</p>}
                          </div>
                        )}
                      </div>
                      {!sub && (
                        <Button size="sm" variant="primary" onClick={() => { setSelected(a); setShowModal(true) }}>
                          Submit
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit: {selected?.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Upload File (PDF, DOC, ZIP)</Form.Label>
              <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}
