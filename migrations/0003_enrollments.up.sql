CREATE TABLE IF NOT EXISTS enrollments (
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,

  PRIMARY KEY (user_id, course_id)
);
