import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/public/Home'
import About from './pages/public/About'
import Gallery from './pages/public/Gallery'
import Login from './pages/public/Login'

import StudentDashboard from './pages/student/StudentDashboard'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentAssignments from './pages/student/StudentAssignments'
import StudentExams from './pages/student/StudentExams'
import StudentResults from './pages/student/StudentResults'

import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherAttendance from './pages/teacher/TeacherAttendance'
import TeacherAssignments from './pages/teacher/TeacherAssignments'
import TeacherResults from './pages/teacher/TeacherResults'
import TeacherNotifications from './pages/teacher/TeacherNotifications'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminClasses from './pages/admin/AdminClasses'
import AdminSubjects from './pages/admin/AdminSubjects'
import AdminGallery from './pages/admin/AdminGallery'
import AppShell from './components/AppShell'
import CampusDashboard from './pages/CampusDashboard'

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute roles={['admin', 'SUPER_ADMIN', 'INSTITUTION_ADMIN']}><AppShell /></ProtectedRoute>}>
            <Route path="/dashboard" element={<CampusDashboard />} />
            <Route path="/students" element={<AdminUsers />} />
            <Route path="/academics" element={<AdminClasses />} />
            <Route path="/settings" element={<AdminSubjects />} />
            <Route path="/admissions" element={<CampusDashboard />} />
            <Route path="/attendance" element={<CampusDashboard />} />
            <Route path="/timetable" element={<CampusDashboard />} />
            <Route path="/exams" element={<CampusDashboard />} />
            <Route path="/fees" element={<CampusDashboard />} />
            <Route path="/reports" element={<CampusDashboard />} />
          </Route>

          <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute roles={['student']}><StudentAttendance /></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute roles={['student']}><StudentAssignments /></ProtectedRoute>} />
          <Route path="/student/exams" element={<ProtectedRoute roles={['student']}><StudentExams /></ProtectedRoute>} />
          <Route path="/student/results" element={<ProtectedRoute roles={['student']}><StudentResults /></ProtectedRoute>} />

          <Route path="/teacher/dashboard" element={<ProtectedRoute roles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/attendance" element={<ProtectedRoute roles={['teacher']}><TeacherAttendance /></ProtectedRoute>} />
          <Route path="/teacher/assignments" element={<ProtectedRoute roles={['teacher']}><TeacherAssignments /></ProtectedRoute>} />
          <Route path="/teacher/results" element={<ProtectedRoute roles={['teacher']}><TeacherResults /></ProtectedRoute>} />
          <Route path="/teacher/notifications" element={<ProtectedRoute roles={['teacher']}><TeacherNotifications /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/classes" element={<ProtectedRoute roles={['admin']}><AdminClasses /></ProtectedRoute>} />
          <Route path="/admin/subjects" element={<ProtectedRoute roles={['admin']}><AdminSubjects /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute roles={['admin']}><AdminGallery /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
