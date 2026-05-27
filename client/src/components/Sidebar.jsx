import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

const links = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/student/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
    { to: '/student/assignments', label: 'Assignments', icon: 'bi-journal-text' },
    { to: '/student/exams', label: 'Exams', icon: 'bi-pencil-square' },
    { to: '/student/results', label: 'Results', icon: 'bi-trophy' },
  ],
  teacher: [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/teacher/attendance', label: 'Mark Attendance', icon: 'bi-calendar-check' },
    { to: '/teacher/assignments', label: 'Assignments', icon: 'bi-journal-text' },
    { to: '/teacher/results', label: 'Results', icon: 'bi-trophy' },
    { to: '/teacher/notifications', label: 'Notifications', icon: 'bi-bell' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/admin/users', label: 'Users', icon: 'bi-people' },
    { to: '/admin/classes', label: 'Classes', icon: 'bi-building' },
    { to: '/admin/subjects', label: 'Subjects', icon: 'bi-book' },
    { to: '/admin/gallery', label: 'Gallery', icon: 'bi-images' },
  ],
}

export default function Sidebar({ role }) {
  const items = links[role] || []
  return (
    <Nav className="flex-column bg-white shadow-sm rounded p-3" style={{ minHeight: '70vh' }}>
      <h6 className="text-muted text-uppercase mb-3 px-2">{role} Menu</h6>
      {items.map((link) => (
        <Nav.Link
          key={link.to}
          as={NavLink}
          to={link.to}
          end
          className="text-dark rounded mb-1"
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#0d6efd' : 'transparent',
            color: isActive ? '#fff' : '#212529',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          {link.label}
        </Nav.Link>
      ))}
    </Nav>
  )
}
