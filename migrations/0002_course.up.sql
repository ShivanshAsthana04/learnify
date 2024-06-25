CREATE TABLE IF NOT EXISTS course (
  course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  syllabus TEXT NOT NULL,
  instructor_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson (
  lesson_id UUID DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content JSON NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
  PRIMARY KEY (lesson_id, course_id)
);
