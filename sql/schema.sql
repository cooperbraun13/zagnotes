DROP TABLE IF EXISTS study_group_member CASCADE;
DROP TABLE IF EXISTS study_group CASCADE;
DROP TABLE IF EXISTS flag CASCADE;
DROP TABLE IF EXISTS comment CASCADE;
DROP TABLE IF EXISTS rating CASCADE;
DROP TABLE IF EXISTS resource_tag CASCADE;
DROP TABLE IF EXISTS tag CASCADE;
DROP TABLE IF EXISTS resource CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS course CASCADE;
DROP TABLE IF EXISTS user_account CASCADE;

CREATE TABLE user_account (
  user_id SERIAL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  zagmail VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id),
  CONSTRAINT valid_zagmail CHECK (zagmail LIKE '%@zagmail.gonzaga.edu'),
  CONSTRAINT valid_name CHECK (first_name <> '' AND last_name <> '')
);

CREATE TABLE course (
  course_id SERIAL,
  course_title VARCHAR(100) NOT NULL,
  course_number VARCHAR(10) NOT NULL,
  dept_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (course_id),
  CONSTRAINT valid_course_title CHECK (course_title <> ''),
  CONSTRAINT valid_course_number CHECK (course_number <> ''),
  CONSTRAINT valid_dept_code CHECK (dept_code <> '')
);

CREATE TABLE section (
  section_id SERIAL,
  course_id INT NOT NULL,
  term VARCHAR(50) NOT NULL,
  section_code VARCHAR(10) NOT NULL,
  professor_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (section_id),
  FOREIGN KEY (course_id) REFERENCES course(course_id),
  CONSTRAINT valid_term CHECK (term IN ('winter', 'spring', 'summer', 'fall')),
  CONSTRAINT valid_section_code CHECK (section_code <> ''),
  CONSTRAINT valid_professor_name CHECK (professor_name <> '')
);

CREATE TABLE resource (
  resource_id SERIAL,
  section_id INT NOT NULL,
  uploader_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  DESCRIPTION VARCHAR(255) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_url VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMP,
  deleted_by INT,
  PRIMARY KEY (resource_id),
  FOREIGN KEY (section_id) REFERENCES section(section_id),
  FOREIGN KEY (uploader_id) REFERENCES user_account(user_id),
  FOREIGN KEY (deleted_by) REFERENCES user_account(user_id),
  CONSTRAINT valid_resource_title CHECK (title <> ''),
  CONSTRAINT valid_resource_description CHECK (description <> '')
);

CREATE TABLE tag (
  tag_id SERIAL,
  tag_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tag_id),
  CONSTRAINT valid_tag_name CHECK (tag_name <> '')
);

CREATE TABLE resource_tag (
  resource_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (resource_id, tag_id),
  FOREIGN KEY (resource_id) REFERENCES resource(resource_id),
  FOREIGN KEY (tag_id) REFERENCES tag(tag_id),
  CONSTRAINT valid_resource_tag_resource_id CHECK (resource_id > 0),
  CONSTRAINT valid_resource_tag_tag_id CHECK (tag_id > 0)
);

CREATE TABLE rating (
  rating_id SERIAL,
  resource_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (rating_id),
  FOREIGN KEY (resource_id) REFERENCES resource(resource_id),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT valid_rating_resource_id CHECK (resource_id > 0),
  CONSTRAINT valid_rating_user_id CHECK (user_id > 0)
);

CREATE TABLE comment (
  comment_id SERIAL,
  resource_id INT NOT NULL,
  user_id INT NOT NULL,
  comment_text VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (comment_id),
  FOREIGN KEY (resource_id) REFERENCES resource(resource_id),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT valid_comment_text CHECK (comment_text <> ''),
  CONSTRAINT valid_comment_resource_id CHECK (resource_id > 0),
  CONSTRAINT valid_comment_user_id CHECK (user_id > 0)
);

CREATE TABLE flag (
  flag_id SERIAL,
  resource_id INT NOT NULL,
  flagger_user_id INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_by INT,
  resolved_at TIMESTAMP,
  PRIMARY KEY (flag_id),
  FOREIGN KEY (resource_id) REFERENCES resource(resource_id),
  FOREIGN KEY (flagger_user_id) REFERENCES user_account(user_id),
  FOREIGN KEY (resolved_by) REFERENCES user_account(user_id),
  CONSTRAINT valid_flag_reason CHECK (reason <> ''),
  CONSTRAINT valid_flag_resource_id CHECK (resource_id > 0),
  CONSTRAINT valid_flagger_user_id CHECK (flagger_user_id > 0),
  CONSTRAINT valid_flag_status CHECK (status IN ('pending', 'resolved', 'dismissed')),
  CONSTRAINT valid_flag_resolved_by CHECK (resolved_by IS NULL OR resolved_by > 0)
);

CREATE TABLE study_group (
  group_id SERIAL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  owner_user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id),
  FOREIGN KEY (owner_user_id) REFERENCES user_account(user_id),
  CONSTRAINT valid_group_name CHECK (name <> ''),
  CONSTRAINT valid_group_description CHECK (description <> ''),
  CONSTRAINT valid_owner_user_id CHECK (owner_user_id > 0)
);

CREATE TABLE study_group_member (
  group_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id),
  FOREIGN KEY (group_id) REFERENCES study_group(group_id),
  FOREIGN KEY (user_id) REFERENCES user_account(user_id),
  CONSTRAINT valid_member_role CHECK (role IN ('owner', 'member')),
  CONSTRAINT valid_member_group_id CHECK (group_id > 0),
  CONSTRAINT valid_member_user_id CHECK (user_id > 0)
);