import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Spinner, ListGroup } from 'react-bootstrap'
import { dashboardAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardAPI.getAdmin()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="admin" /></Col>
        <Col md={9}>
          <h3 className="mb-4">Admin Dashboard</h3>
          <Row className="g-3 mb-4">
            <Col sm={6} lg={3}>
              <Card className="shadow-sm text-center p-3 border-primary">
                <Card.Title className="text-primary display-6">{data.totalStudents}</Card.Title>
                <Card.Text className="text-muted">Students</Card.Text>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="shadow-sm text-center p-3 border-success">
                <Card.Title className="text-success display-6">{data.totalTeachers}</Card.Title>
                <Card.Text className="text-muted">Teachers</Card.Text>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="shadow-sm text-center p-3 border-warning">
                <Card.Title className="text-warning display-6">{data.totalClasses}</Card.Title>
                <Card.Text className="text-muted">Classes</Card.Text>
              </Card>
            </Col>
            <Col sm={6} lg={3}>
              <Card className="shadow-sm text-center p-3 border-info">
                <Card.Title className="text-info display-6">{data.totalSubjects}</Card.Title>
                <Card.Text className="text-muted">Subjects</Card.Text>
              </Card>
            </Col>
          </Row>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Recent System Notifications</Card.Header>
            <ListGroup variant="flush">
              {data.recentNotifications?.length > 0 ? data.recentNotifications.map((n) => (
                <ListGroup.Item key={n._id}>
                  <div className="fw-bold">{n.title}</div>
                  <small className="text-muted">{n.message} — by {n.createdBy?.name}</small>
                </ListGroup.Item>
              )) : <ListGroup.Item className="text-muted">No notifications</ListGroup.Item>}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
