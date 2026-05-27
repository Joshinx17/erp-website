const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: '../.env' });

const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Class = require('./models/Class');
const Subject = require('./models/Subject');
const Notification = require('./models/Notification');
const GalleryItem = require('./models/GalleryItem');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      Notification.deleteMany({}),
      GalleryItem.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@haj.edu',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
    });
    console.log('Admin created (admin@haj.edu / admin123)');

    const teacherUser = await Teacher.create({
      name: 'Dr. Sharma',
      email: 'sharma@haj.edu',
      password: 'teacher123',
      role: 'teacher',
      phone: '9876543211',
      employeeId: 'TCH001',
      department: 'Computer Science',
      qualification: 'PhD in Computer Science',
    });
    console.log('Teacher created (sharma@haj.edu / teacher123)');

    const class10 = await Class.create({
      name: 'Class 10',
      section: 'A',
      classTeacher: teacherUser._id,
      academicYear: '2024-2025',
    });

    const class12 = await Class.create({
      name: 'Class 12',
      section: 'A',
      classTeacher: teacherUser._id,
      academicYear: '2024-2025',
    });
    console.log('Classes created');

    const subjectMath = await Subject.create({
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Advanced Mathematics',
      teacher: teacherUser._id,
    });

    const subjectPhysics = await Subject.create({
      name: 'Physics',
      code: 'PHY101',
      description: 'Fundamentals of Physics',
      teacher: teacherUser._id,
    });

    const subjectCS = await Subject.create({
      name: 'Computer Science',
      code: 'CS101',
      description: 'Introduction to Computer Science',
      teacher: teacherUser._id,
    });
    console.log('Subjects created');

    class10.subjects = [subjectMath._id, subjectPhysics._id];
    class12.subjects = [subjectMath._id, subjectCS._id];
    await class10.save();
    await class12.save();

    teacherUser.subjects = [subjectMath._id, subjectPhysics._id, subjectCS._id];
    await teacherUser.save();

    const student1 = await Student.create({
      name: 'Joshin',
      email: 'joshin@haj.edu',
      password: 'student123',
      role: 'student',
      phone: '9876543212',
      rollNumber: 'S001',
      admissionNumber: 'ADM001',
      class: class10._id,
      section: 'A',
      fatherName: 'Rajesh',
      motherName: 'Sunita',
      dob: new Date('2003-06-17'),
    });

    const student2 = await Student.create({
      name: 'Priya',
      email: 'priya@haj.edu',
      password: 'student123',
      role: 'student',
      phone: '9876543213',
      rollNumber: 'S002',
      admissionNumber: 'ADM002',
      class: class10._id,
      section: 'A',
      fatherName: 'Amit',
      motherName: 'Neha',
      dob: new Date('2004-02-14'),
    });

    const student3 = await Student.create({
      name: 'Arjun',
      email: 'arjun@haj.edu',
      password: 'student123',
      role: 'student',
      phone: '9876543214',
      rollNumber: 'S003',
      admissionNumber: 'ADM003',
      class: class12._id,
      section: 'A',
      fatherName: 'Vikram',
      motherName: 'Lakshmi',
      dob: new Date('2003-11-05'),
    });
    console.log('Students created (joshin@haj.edu, priya@haj.edu, arjun@haj.edu / student123)');

    await GalleryItem.create([
      {
        title: 'Annual Day 2024',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800',
        description: 'Annual Day celebration at HAJ School of Engineering',
        uploadedBy: admin._id,
      },
      {
        title: 'Science Exhibition',
        imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
        description: 'Students presenting their science projects',
        uploadedBy: admin._id,
      },
      {
        title: 'Sports Day',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=800',
        description: 'Annual sports meet 2024',
        uploadedBy: admin._id,
      },
      {
        title: 'Library',
        imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
        description: 'Our state-of-the-art library',
        uploadedBy: admin._id,
      },
      {
        title: 'Computer Lab',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        description: 'Modern computer science lab',
        uploadedBy: admin._id,
      },
    ]);
    console.log('Gallery items created');

    await Notification.create([
      {
        title: 'Welcome to New Academic Year',
        message: 'Classes will commence from July 1st. Please check your schedules.',
        targetRole: 'all',
        createdBy: admin._id,
      },
      {
        title: 'Mid-Term Exam Schedule',
        message: 'Mid-term examinations will start from September 15th. Prepare well!',
        targetRole: 'student',
        createdBy: teacherUser._id,
      },
      {
        title: 'Staff Meeting',
        message: 'All teachers are requested to attend the staff meeting on Friday at 3 PM.',
        targetRole: 'teacher',
        createdBy: admin._id,
      },
    ]);
    console.log('Notifications created');

    console.log('\n--- SEED COMPLETE ---');
    console.log('Login Credentials:');
    console.log('  Admin:   admin@haj.edu / admin123');
    console.log('  Teacher: sharma@haj.edu / teacher123');
    console.log('  Student: joshin@haj.edu / student123');
    console.log('  Student: priya@haj.edu / student123');
    console.log('  Student: arjun@haj.edu / student123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
