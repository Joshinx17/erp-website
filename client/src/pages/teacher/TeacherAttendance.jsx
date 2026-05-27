import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Table, Spinner, Alert } from 'react-bootstrap'
import { attendanceAPI, classAPI, studentAPI } from '../../api'
import Sidebar from '../../components/Sidebar'

export default function TeacherAttendance() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    classAPI.getAll().then((res) => setClasses(res.data)).catch(() => {})
  }, [])

  const loadStudents = async () => {
    if (!selectedClass) return
    setLoading(true)
    try {
      const res = await studentAPI.getAll({ class: selectedClass })
      setStudents(res.data)
      const init = {}
      res.data.forEach((s) => { init[s._id] = 'Present' })
      setRecords(init)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (selectedClass) loadStudents() }, [selectedClass])

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    try {
      const payload = Object.entries(records).map(([student, status]) => ({
        student, class: selectedClass, date, status,
      }))
      await attendanceAPI.mark({ records: payload })
      setMsg({ type: 'success', text: 'Attendance saved successfully!' })
    } catch (err) {
      setMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to save' })
    } finally { setSaving(false) }
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={3}><Sidebar role="teacher" /></Col>
        <Col md={9}>
          <h3 className="mb-4">Mark Attendance</h3>
          {msg && <Alert variant={msg.type}>{msg.text}</Alert>}
          <Row className="g-3 mb-3">
            <Col sm={4}>
              <Form.Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                <option value="">Select Class</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
              </Form.Select>
            </Col>
            <Col sm={4}>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Col>
          </Row>
          {loading ? <Spinner /> : students.length > 0 && (
            <>
              <Card className="shadow-sm">
                <Card.Body>
                  <Table striped hover>
                    <thead>
                      <tr><th>Roll No</th><th>Name</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s._id}>
                          <td>{s.rollNumber}</td>
                          <td>{s.name}</td>
                          <td>
                            <Form.Select
                              size="sm"
                              style={{ width: '120px' }}
                              value={records[s._id] || 'Present'}
                              onChange={(e) => setRecords({ ...records, [s._id]: e.target.value })}
                            >
                              <option value="Present">Present</option>
                              <option value="Absent">Absent</option>
                              <option value="Leave">Leave</option>
                            </Form.Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Button className="mt-3" variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? <Spinner size="sm" /> : 'Save Attendance'}
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}
