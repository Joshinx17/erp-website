import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap'
import { resultAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function StudentResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    resultAPI.getMy()
      .then((res) => setResults(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  const totalObtained = results.reduce((s, r) => s + r.marksObtained, 0)
  const totalMarks = results.reduce((s, r) => s + r.totalMarks, 0)
  const percentage = totalMarks > 0 ? Math.round((totalObtained / totalMarks) * 100) : 0

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="student" /></Col>
        <Col md={9}>
          <h3 className="mb-4">My Results</h3>
          <Row className="g-3 mb-4">
            <Col><Card className="shadow-sm text-center p-3"><h4 className="text-primary">{results.length}</h4><small>Subjects</small></Card></Col>
            <Col><Card className="shadow-sm text-center p-3"><h4 className="text-success">{totalObtained}/{totalMarks}</h4><small>Total Marks</small></Card></Col>
            <Col><Card className="shadow-sm text-center p-3"><h4 className="text-info">{percentage}%</h4><small>Percentage</small></Card></Col>
          </Row>
          <Card className="shadow-sm">
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr><th>Exam</th><th>Subject</th><th>Marks Obtained</th><th>Total</th><th>Grade</th><th>Remark</th></tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted">No results available</td></tr>
                  ) : results.map((r) => (
                    <tr key={r._id}>
                      <td>{r.exam?.title}</td>
                      <td>{r.subject?.name}</td>
                      <td className="fw-bold">{r.marksObtained}</td>
                      <td>{r.totalMarks}</td>
                      <td><Badge bg={r.marksObtained >= r.totalMarks * 0.6 ? 'success' : 'danger'}>{r.grade || (r.marksObtained >= r.totalMarks * 0.6 ? 'Pass' : 'Fail')}</Badge></td>
                      <td>{r.remark || '-'}</td>
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
