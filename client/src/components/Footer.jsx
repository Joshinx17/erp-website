import { Container } from 'react-bootstrap'

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-1">&copy; {new Date().getFullYear()} HAJ School of Engineering. All rights reserved.</p>
        <small className="text-muted">Empowering Education Through Technology</small>
      </Container>
    </footer>
  )
}
