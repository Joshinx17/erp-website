import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { attendanceAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function StudentAttendance() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    attendanceAPI.getMy(user._id)
      .then((res) => setRecords(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user._id])

  const present = records.filter((r) => r.status === 'Present').length
  const absent = records.filter((r) => r.status === 'Absent').length
  const leave = records.filter((r) => r.status === 'Leave').length
  const percentage = records.length > 0 ? Math.round((present / records.length) * 100) : 0

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="student" /></Col>
        <Col md={9}>
          <h3 className="mb-4">My Attendance</h3>
          <Row className="g-3 mb-4">
            <Col><Card className="shadow-sm text-center p-3"><h4 className="text-success">{present}</h4><small>Present</small></Card></Col>
            <Col><Card className="shadow-sm text-center p-3"><h4 className="text-danger">{absent}</h4><small>Absent</small></Card></Col>
            <Col><Card className="shadow-sm text-center p-3"><h4 className="text-warning">{leave}</h4><small>Leave</small></Card></Col>
            <Col><Card className="shadow-sm text-center p-3"><h4 className="text-primary">{percentage}%</h4><small>Percentage</small></Card></Col>
          </Row>
          <Card className="shadow-sm">
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={4} className="text-center text-muted">No attendance records</td></tr>
                  ) : records.map((r) => (
                    <tr key={r._id}>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td>{r.subject?.name || 'General'}</td>
                      <td>
                        <Badge bg={r.status === 'Present' ? 'success' : r.status === 'Absent' ? 'danger' : 'warning'}>
                          {r.status}
                        </Badge>
                      </td>
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
