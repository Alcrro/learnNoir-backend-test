CREATE INDEX idx_activity_lesson
ON lesson_activities(lesson_id);

CREATE INDEX idx_progress_user
ON user_activity_progress(user_id);

CREATE INDEX idx_progress_activity
ON user_activity_progress(activity_id);