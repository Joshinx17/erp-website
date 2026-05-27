import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Spinner, ListGroup } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { dashboardAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getTeacher()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="teacher" /></Col>
        <Col md={9}>
          <h3 className="mb-4">Welcome, {user?.name}!</h3>
          <Row className="g-3 mb-4">
            <Col sm={4}>
              <Card className="shadow-sm text-center p-3">
                <Card.Title className="text-primary display-6">{data.totalStudents}</Card.Title>
                <Card.Text className="text-muted">Students</Card.Text>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="shadow-sm text-center p-3">
                <Card.Title className="text-success display-6">{data.totalAssignments}</Card.Title>
                <Card.Text className="text-muted">Assignments</Card.Text>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="shadow-sm text-center p-3">
                <Card.Title className="text-warning display-6">{data.totalExams}</Card.Title>
                <Card.Text className="text-muted">Exams</Card.Text>
              </Card>
            </Col>
          </Row>
          {data.classes?.length > 0 && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="fw-bold">My Classes</Card.Header>
              <ListGroup variant="flush">
                {data.classes.map((c) => (
                  <ListGroup.Item key={c._id}>{c.name} - Section {c.section}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Recent Notifications</Card.Header>
            <ListGroup variant="flush">
              {data.recentNotifications?.length > 0 ? data.recentNotifications.map((n) => (
                <ListGroup.Item key={n._id}>
                  <div className="fw-bold">{n.title}</div>
                  <small className="text-muted">{n.message}</small>
                </ListGroup.Item>
              )) : <ListGroup.Item className="text-muted">No notifications</ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
