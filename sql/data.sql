-- seed users
INSERT INTO user_account (first_name, last_name, zagmail, major)
VALUES 
  ('Cooper', 'Braun', 'cbraun2@zagmail.gonzaga.edu', 'Computer Science'),
  ('Emeranzia', 'Robinson', 'erobinson4@zagmail.gonzaga.edu', 'Economics');

-- seed sections
INSERT INTO section (course_code, course_title, term, year, section_code, professor_name)
VALUES
  ('CPSC 321', 'Database Management Systems', 'Fall', 2025, '01', 'Dr. Bowers'),
  ('MATH 259', 'Calculus-Analytic Geometry III', 'Spring', 2025, '02', 'Dr. Alsaker');

-- seed a study group
INSERT INTO study_group (name, description, owner_user_id)
VALUES ('CPSC 321 Study Group', 'Weekly review for Database Management Systems', 1);

-- seed resources (one for a section, one inside a study group)
INSERT INTO resource (section_id, uploader_id, title, description, resource_type, resource_url, group_id)
VALUES
  (1, 1, 'ER Diagrams Notes', 'Lecture notes on ER modeling', 'notes', 'https://www.cs.gonzaga.edu/faculty/bowers/courses/cpsc321/lect-19.pdf', NULL),
  (1, 1, 'Dynamic SQL Notes', 'Lecture notes on dynamic SQL', 'notes', 'https://www.cs.gonzaga.edu/faculty/bowers/courses/cpsc321/lect-13.pdf', 1);