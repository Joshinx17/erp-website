export const initialData = {
  institution: { name: 'Northstar Academy', type: 'School', campus: 'Main Campus', year: '2026–27' },
  students: [
    { id: 'STU-26041', name: 'Aarav Mehta', className: 'Grade 10 · A', guardian: 'Kiran Mehta', phone: '+91 98765 22104', attendance: 94, fees: 'Paid', status: 'Active', initials: 'AM', color: 'blue' },
    { id: 'STU-26042', name: 'Zoya Khan', className: 'Grade 10 · A', guardian: 'Sana Khan', phone: '+91 98765 22105', attendance: 89, fees: 'Due', status: 'Active', initials: 'ZK', color: 'amber' },
    { id: 'STU-26043', name: 'Vihaan Iyer', className: 'Grade 10 · A', guardian: 'R. Iyer', phone: '+91 98765 22106', attendance: 97, fees: 'Paid', status: 'Active', initials: 'VI', color: 'green' },
    { id: 'STU-26044', name: 'Ananya Sharma', className: 'Grade 9 · B', guardian: 'M. Sharma', phone: '+91 98765 22107', attendance: 81, fees: 'Partial', status: 'Active', initials: 'AS', color: 'violet' },
    { id: 'STU-26045', name: 'Arjun Nair', className: 'Grade 12 · Science', guardian: 'L. Nair', phone: '+91 98765 22108', attendance: 92, fees: 'Paid', status: 'Active', initials: 'AN', color: 'rose' },
    { id: 'STU-26046', name: 'Meera Joshi', className: 'Grade 11 · Commerce', guardian: 'D. Joshi', phone: '+91 98765 22109', attendance: 96, fees: 'Paid', status: 'Active', initials: 'MJ', color: 'slate' },
  ],
  applications: [
    { id: 'APP-1208', name: 'Ishaan Kapoor', programme: 'Grade 8', stage: 'Enquiry', date: 'Today', initials: 'IK' },
    { id: 'APP-1209', name: 'Nitya Rao', programme: 'Grade 11 · Science', stage: 'Application', date: 'Today', initials: 'NR' },
    { id: 'APP-1194', name: 'Kabir Singh', programme: 'Grade 10', stage: 'Documents pending', date: 'Yesterday', initials: 'KS' },
    { id: 'APP-1188', name: 'Aditi Verma', programme: 'Grade 9', stage: 'Under review', date: '28 Sep', initials: 'AV' },
    { id: 'APP-1179', name: 'Neil D’Souza', programme: 'Grade 12 · Commerce', stage: 'Approved', date: '26 Sep', initials: 'ND' },
  ],
  activity: [
    { time: '09:42', title: 'Fee payment recorded', detail: '₹18,500 received for Aarav Mehta', kind: 'finance' },
    { time: '09:18', title: 'Attendance submitted', detail: 'Grade 10 A · Mathematics', kind: 'academic' },
    { time: '08:55', title: 'New admission application', detail: 'Nitya Rao applied for Grade 11 Science', kind: 'admissions' },
    { time: 'Yesterday', title: 'Circular published', detail: 'Inter-house athletics meet', kind: 'notice' },
  ],
}
