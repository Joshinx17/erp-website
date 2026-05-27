import { Container, Row, Col } from 'react-bootstrap'

export default function About() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="mb-4">About HAJ School of Engineering</h1>
          <p className="lead text-muted">
            Founded with a vision to revolutionize engineering education, HAJ School of Engineering stands as a beacon
            of academic excellence and innovation.
          </p>
          <hr />
          <h4>Our Mission</h4>
          <p>
            To provide world-class engineering education that nurtures creativity, critical thinking, and
            technical expertise, preparing students to become leaders in the global technological landscape.
          </p>
          <h4 className="mt-4">Our Vision</h4>
          <p>
            To be recognized globally as a premier institution that produces innovative engineers and
            technologists who drive positive change in society.
          </p>
          <h4 className="mt-4">Core Values</h4>
          <ul>
            <li><strong>Excellence</strong> — Striving for the highest standards in education and research</li>
            <li><strong>Innovation</strong> — Encouraging creative thinking and problem-solving</li>
            <li><strong>Integrity</strong> — Upholding strong ethical values in all endeavors</li>
            <li><strong>Inclusivity</strong> — Fostering a diverse and welcoming community</li>
          </ul>
          <hr />
          <Row className="mt-4">
            <Col sm={6}>
              <h5>📍 Address</h5>
              <p className="text-muted">
                HAJ School of Engineering<br />
                Tech Park Avenue, Knowledge City<br />
                Bangalore, Karnataka - 560001
              </p>
            </Col>
            <Col sm={6}>
              <h5>📞 Contact</h5>
              <p className="text-muted">
                Phone: +91 98765 43210<br />
                Email: info@haj.edu<br />
                Website: www.haj.edu
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
