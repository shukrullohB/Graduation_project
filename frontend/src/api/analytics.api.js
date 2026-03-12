import http from "./http";
import {
  DEMO_MODE,
  mockAnalyticsStudent,
  mockAnalyticsTeacher,
} from "./mockData";

export const getStudentAnalytics = () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockAnalyticsStudent });
  return http.get("/analytics/student");
};

export const getTeacherAnalytics = () => {
  if (DEMO_MODE) return Promise.resolve({ data: mockAnalyticsTeacher });
  return http.get("/analytics/teacher");
};
