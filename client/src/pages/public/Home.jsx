import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <>
      <section className="bg-primary text-white py-5">
        <Container className="text-center">
          <h1 className="display-4 fw-bold">HAJ School of Engineering</h1>
          <p className="lead mt-3">Most Premium Engineering Institution in the World</p>
          <p className="mb-4">Empowering the next generation of innovators and leaders since 2000.</p>
          {!user && (
            <Button as={Link} to="/login" variant="light" size="lg" className="px-5">
              Get Started
            </Button>
          )}
          {user && (
            <Button as={Link} to={`/${user.role}/dashboard`} variant="light" size="lg" className="px-5">
              Go to Dashboard
            </Button>
          )}
        </Container>
      </section>

      <Container className="py-5">
        <Row className="g-4">
          <Col md={4}>
            <div className="text-center p-4 border rounded shadow-sm h-100">
              <div className="display-6 text-primary mb-3">🎓</div>
              <h3>Quality Education</h3>
              <p className="text-muted">World-class curriculum designed by industry experts to prepare students for the future.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 border rounded shadow-sm h-100">
              <div className="display-6 text-primary mb-3">🔬</div>
              <h3>Modern Labs</h3>
              <p className="text-muted">State-of-the-art laboratories with cutting-edge equipment for hands-on learning.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center p-4 border rounded shadow-sm h-100">
              <div className="display-6 text-primary mb-3">🏆</div>
              <h3>Excellence</h3>
              <p className="text-muted">Consistently ranked among the top engineering institutions with outstanding results.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Why Choose HAJ?</h2>
          <Row className="g-3">
            <Col sm={6} md={3}>
              <div className="p-3 bg-white rounded shadow-sm text-center">
                <h5>Expert Faculty</h5>
                <small className="text-muted">Learn from PhD holders and industry veterans</small>
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className="p-3 bg-white rounded shadow-sm text-center">
                <h5>Placements</h5>
                <small className="text-muted">95% placement record with top companies</small>
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className="p-3 bg-white rounded shadow-sm text-center">
                <h5>Research</h5>
                <small className="text-muted">Active research centers and innovation labs</small>
              </div>
            </Col>
            <Col sm={6} md={3}>
              <div className="p-3 bg-white rounded shadow-sm text-center">
                <h5>Campus Life</h5>
                <small className="text-muted">Vibrant campus with clubs, sports & events</small>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}
