import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Spinner, Badge, ListGroup } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { dashboardAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getStudent()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}>
          <Sidebar role="student" />
        </Col>
        <Col md={9}>
          <h3 className="mb-4">Welcome, {user?.name}!</h3>
          <Row className="g-3 mb-4">
            <Col sm={6} lg={3}>
              <Card className="shadow-sm text-center p-3">
                <Card.Title className="text-primary display-6">{data.attendancePercentage}%</Card.Title>
                <Card.Text className="text-muted">Attendance</Card.Text>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="shadow-sm text-center p-3">
                <Card.Title className="text-success display-6">{data.presentCount}</Card.Title>
                <Card.Text className="text-muted">Days Present</Card.Text>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="shadow-sm text-center p-3">
                <Card.Title className="text-warning display-6">{data.upcomingExams?.length || 0}</Card.Title>
                <Card.Text className="text-muted">Upcoming Exams</Card.Text>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="shadow-sm text-center p-3">
                <Card.Title className="text-info display-6">{data.pendingAssignments?.length || 0}</Card.Title>
                <Card.Text className="text-muted">Pending Assignments</Card.Text>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Header className="fw-bold">Upcoming Exams</Card.Header>
                <ListGroup variant="flush">
                  {data.upcomingExams?.length > 0 ? data.upcomingExams.map((exam) => (
                    <ListGroup.Item key={exam._id}>
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{exam.title}</span>
                        <Badge bg="primary" pill>{exam.subject?.name}</Badge>
                      </div>
                      <small className="text-muted">{new Date(exam.date).toLocaleDateString()}</small>
                    </ListGroup.Item>
                  )) : <ListGroup.Item className="text-muted">No upcoming exams</ListGroup.Item>}
                </ListGroup>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Header className="fw-bold">Pending Assignments</Card.Header>
                <ListGroup variant="flush">
                  {data.pendingAssignments?.length > 0 ? data.pendingAssignments.map((a) => (
                    <ListGroup.Item key={a._id}>
                      <div className="fw-bold">{a.title}</div>
                      <small className="text-muted">{a.subject?.name} — Due: {new Date(a.dueDate).toLocaleDateString()}</small>
                    </ListGroup.Item>
                  )) : <ListGroup.Item className="text-muted">No pending assignments</ListGroup.Item>}
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm mt-4">
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
