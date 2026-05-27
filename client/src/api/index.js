import API from './axios'

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
}

export const dashboardAPI = {
  getAdmin: () => API.get('/dashboard/admin'),
  getTeacher: () => API.get('/dashboard/teacher'),
  getStudent: () => API.get('/dashboard/student'),
}

export const studentAPI = {
  getAll: (params) => API.get('/students', { params }),
  getById: (id) => API.get(`/students/${id}`),
  update: (id, data) => API.put(`/students/${id}`, data),
  delete: (id) => API.delete(`/students/${id}`),
}

export const teacherAPI = {
  getAll: () => API.get('/teachers'),
  getById: (id) => API.get(`/teachers/${id}`),
  update: (id, data) => API.put(`/teachers/${id}`, data),
  delete: (id) => API.delete(`/teachers/${id}`),
}

export const classAPI = {
  getAll: () => API.get('/classes'),
  getById: (id) => API.get(`/classes/${id}`),
  create: (data) => API.post('/classes', data),
  update: (id, data) => API.put(`/classes/${id}`, data),
  delete: (id) => API.delete(`/classes/${id}`),
}

export const subjectAPI = {
  getAll: (params) => API.get('/subjects', { params }),
  getById: (id) => API.get(`/subjects/${id}`),
  create: (data) => API.post('/subjects', data),
  update: (id, data) => API.put(`/subjects/${id}`, data),
  delete: (id) => API.delete(`/subjects/${id}`),
}

export const attendanceAPI = {
  mark: (data) => API.post('/attendance', data),
  getAll: (params) => API.get('/attendance', { params }),
  update: (id, data) => API.put(`/attendance/${id}`, data),
  getMy: (studentId) => API.get(`/attendance/my/${studentId}`),
}

export const assignmentAPI = {
  getAll: (params) => API.get('/assignments', { params }),
  getById: (id) => API.get(`/assignments/${id}`),
  getByClass: (classId) => API.get(`/assignments/class/${classId}`),
  create: (data) => API.post('/assignments', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/assignments/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/assignments/${id}`),
}

export const submissionAPI = {
  submit: (data) => API.post('/submissions', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => API.get('/submissions', { params }),
  getMy: () => API.get('/submissions/my'),
  grade: (id, data) => API.put(`/submissions/${id}/grade`, data),
}

export const examAPI = {
  getAll: (params) => API.get('/exams', { params }),
  getById: (id) => API.get(`/exams/${id}`),
  getByClass: (classId) => API.get(`/exams/class/${classId}`),
  create: (data) => API.post('/exams', data),
  update: (id, data) => API.put(`/exams/${id}`, data),
  delete: (id) => API.delete(`/exams/${id}`),
}

export const resultAPI = {
  getAll: (params) => API.get('/results', { params }),
  getMy: () => API.get('/results/my'),
  getById: (id) => API.get(`/results/${id}`),
  create: (data) => API.post('/results', data),
  update: (id, data) => API.put(`/results/${id}`, data),
  delete: (id) => API.delete(`/results/${id}`),
}

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  create: (data) => API.post('/notifications', data),
  delete: (id) => API.delete(`/notifications/${id}`),
}

export const galleryAPI = {
  getAll: () => API.get('/gallery'),
  create: (data) => API.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/gallery/${id}`),
}
