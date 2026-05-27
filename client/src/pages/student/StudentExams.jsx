import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { examAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function StudentExams() {
  const { user } = useAuth()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    examAPI.getAll()
      .then((res) => setExams(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  const upcoming = exams.filter((e) => new Date(e.date) >= new Date())
  const past = exams.filter((e) => new Date(e.date) < new Date())

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="student" /></Col>
        <Col md={9}>
          <h3 className="mb-4">Exams</h3>
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold">Upcoming Exams</Card.Header>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr><th>Title</th><th>Subject</th><th>Date</th><th>Time</th><th>Duration</th><th>Marks</th></tr>
                </thead>
                <tbody>
                  {upcoming.length === 0 ? (
                    <tr><td colSpan={6} className="text-muted text-center">No upcoming exams</td></tr>
                  ) : upcoming.map((e) => (
                    <tr key={e._id}>
                      <td className="fw-bold">{e.title}</td>
                      <td>{e.subject?.name}</td>
                      <td>{new Date(e.date).toLocaleDateString()}</td>
                      <td>{e.startTime}</td>
                      <td>{e.duration} min</td>
                      <td>{e.totalMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Past Exams</Card.Header>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr><th>Title</th><th>Subject</th><th>Date</th><th>Marks</th></tr>
                </thead>
                <tbody>
                  {past.length === 0 ? (
                    <tr><td colSpan={4} className="text-muted text-center">No past exams</td></tr>
                  ) : past.map((e) => (
                    <tr key={e._id}>
                      <td>{e.title}</td>
                      <td>{e.subject?.name}</td>
                      <td>{new Date(e.date).toLocaleDateString()}</td>
                      <td>{e.totalMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
