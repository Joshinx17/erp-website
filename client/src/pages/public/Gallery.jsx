import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import { galleryAPI } from '../../api'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    galleryAPI.getAll()
      .then((res) => setItems(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Gallery</h1>
      <p className="text-center text-muted mb-5">Moments captured at HAJ School of Engineering</p>
      {items.length === 0 ? (
        <p className="text-center text-muted">No gallery images yet.</p>
      ) : (
        <Row className="g-4">
          {items.map((item) => (
            <Col key={item._id} sm={6} md={4} lg={3}>
              <Card className="shadow-sm h-100">
                <Card.Img
                  variant="top"
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  {item.description && (
                    <Card.Text className="text-muted small">{item.description}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
