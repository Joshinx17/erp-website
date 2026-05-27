import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Spinner, Badge, Tabs, Tab } from 'react-bootstrap'
import { studentAPI, teacherAPI, authAPI, classAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function AdminUsers() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('student')
  const [form, setForm] = useState({})

  useEffect(() => {
    Promise.all([
      studentAPI.getAll(),
      teacherAPI.getAll(),
      classAPI.getAll(),
    ]).then(([s, t, c]) => {
      setStudents(s.data)
      setTeachers(t.data)
      setClasses(c.data)
    }).catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  const openCreate = (type) => {
    setModalType(type)
    setForm(type === 'student'
      ? { name: '', email: '', password: 'pass123', phone: '', rollNumber: '', admissionNumber: '', class: '', section: 'A', fatherName: '', motherName: '' }
      : { name: '', email: '', password: 'pass123', phone: '', employeeId: '', department: '', qualification: '' }
    )
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await authAPI.register({ ...form, role: modalType })
      const [s, t] = await Promise.all([studentAPI.getAll(), teacherAPI.getAll()])
      setStudents(s.data)
      setTeachers(t.data)
      setShowModal(false)
    } catch (err) { alert(err.response?.data?.message || 'Error creating user') }
  }

  const handleDelete = async (id, type) => {
    if (!window.confirm('Delete this user?')) return
    try {
      if (type === 'student') { await studentAPI.delete(id); setStudents(students.filter((s) => s._id !== id)) }
      else { await teacherAPI.delete(id); setTeachers(teachers.filter((t) => t._id !== id)) }
    } catch (err) { alert('Error deleting') }
  }

  if (loading) return <Container className="py-5 text-center"><Spinner animation="border" /></Container>

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="admin" /></Col>
        <Col md={9}>
          <h3 className="mb-4">User Management</h3>
          <Tabs defaultActiveKey="students" className="mb-3">
            <Tab eventKey="students" title={`Students (${students.length})`}>
              <div className="text-end mb-2"><Button size="sm" onClick={() => openCreate('student')}>+ Add Student</Button></div>
              <Card className="shadow-sm">
                <Card.Body>
                  <Table striped hover responsive size="sm">
                    <thead><tr><th>Roll</th><th>Name</th><th>Email</th><th>Class</th><th>Phone</th><th>Actions</th></tr></thead>
                    <tbody>
                      {students.length === 0 ? <tr><td colSpan={6} className="text-center text-muted">No students</td></tr>
                      : students.map((s) => (
                        <tr key={s._id}>
                          <td>{s.rollNumber}</td>
                          <td>{s.name}</td>
                          <td>{s.email}</td>
                          <td>{s.class?.name || '-'}</td>
                          <td>{s.phone}</td>
                          <td><Button size="sm" variant="outline-danger" onClick={() => handleDelete(s._id, 'student')}>Delete</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="teachers" title={`Teachers (${teachers.length})`}>
              <div className="text-end mb-2"><Button size="sm" onClick={() => openCreate('teacher')}>+ Add Teacher</Button></div>
              <Card className="shadow-sm">
                <Card.Body>
                  <Table striped hover responsive size="sm">
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Phone</th><th>Actions</th></tr></thead>
                    <tbody>
                      {teachers.length === 0 ? <tr><td colSpan={6} className="text-center text-muted">No teachers</td></tr>
                      : teachers.map((t) => (
                        <tr key={t._id}>
                          <td>{t.employeeId}</td>
                          <td>{t.name}</td>
                          <td>{t.email}</td>
                          <td>{t.department}</td>
                          <td>{t.phone}</td>
                          <td><Button size="sm" variant="outline-danger" onClick={() => handleDelete(t._id, 'teacher')}>Delete</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Add {modalType === 'student' ? 'Student' : 'Teacher'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Name</Form.Label><Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Password</Form.Label><Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Phone</Form.Label><Form.Control value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Form.Group></Col>
            </Row>
            {modalType === 'student' ? (
              <>
                <Row>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>Roll Number</Form.Label><Form.Control value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} required /></Form.Group></Col>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>Admission No</Form.Label><Form.Control value={form.admissionNumber} onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} required /></Form.Group></Col>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>Section</Form.Label><Form.Control value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} /></Form.Group></Col>
                </Row>
                <Row>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Class</Form.Label><Form.Select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} required><option value="">Select Class</option>{classes.map((c) => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}</Form.Select></Form.Group></Col>
                  <Col md={6}><Form.Group className="mb-3"><Form.Label>Father's Name</Form.Label><Form.Control value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} /></Form.Group></Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>Employee ID</Form.Label><Form.Control value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required /></Form.Group></Col>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>Department</Form.Label><Form.Control value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></Form.Group></Col>
                  <Col md={4}><Form.Group className="mb-3"><Form.Label>Qualification</Form.Label><Form.Control value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} /></Form.Group></Col>
                </Row>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create User</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}
