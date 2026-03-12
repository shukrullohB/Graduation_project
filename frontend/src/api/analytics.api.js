import http from "./http";

export const getStudentAnalytics = () => http.get("/analytics/student");
export const getTeacherAnalytics = () => http.get("/analytics/teacher");
