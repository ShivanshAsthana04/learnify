import { CourseStore } from "@course/ports";
import {
  createCourseProvider,
  createCourseRequestSchema,
  createLessonProvider,
  createLessonRequestSchema,
  deleteCourseProvider,
  deleteCourseRequestSchema,
  deleteLessonProvider,
  deleteLessonRequestSchema,
  getCourseProvider,
  getCourseRequestSchema,
  getLessonProvider,
  getLessonRequestSchema,
  listCoursesProvider,
  listLessonsProvider,
  listLessonsRequestSchema,
  updateCourseProvider,
  updateCourseRequestSchema,
  updateLessonProvider,
  updateLessonRequestSchema,
} from "@course/usecase";
import express from "express";
import { sendCourseDomainError } from "../client-error";
import { requiresAdminPriviliges } from "../middleware";

export const coursesRouter = (courseStore: CourseStore) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const listCourses = listCoursesProvider(courseStore);
    const result = await listCourses(req.ctx);
    if (result.ok) {
      res.status(200).send(result.data);
    } else {
      sendCourseDomainError(res, result.error);
    }
  });

  router.post("/", requiresAdminPriviliges(), async (req, res) => {
    const createCourseRequest = createCourseRequestSchema.parse(req.body);
    const createCourse = createCourseProvider(courseStore);
    const result = await createCourse(req.ctx, createCourseRequest);
    if (result.ok) {
      res.status(201).send(result.data);
    } else {
      sendCourseDomainError(res, result.error);
    }
  });

  router.get("/:courseId", async (req, res) => {
    const getCourseRequest = getCourseRequestSchema.parse({
      courseId: req.params.courseId,
    });
    const getCourse = getCourseProvider(courseStore);
    const result = await getCourse(req.ctx, getCourseRequest);
    if (result.ok) {
      res.status(200).send(result.data);
    } else {
      sendCourseDomainError(res, result.error);
    }
  });

  router.put("/:courseId", requiresAdminPriviliges(), async (req, res) => {
    const updateCouseRequst = updateCourseRequestSchema.parse({
      courseId: req.params.courseId,
      courseDetails: req.body,
    });
    const updateCourse = updateCourseProvider(courseStore);
    const result = await updateCourse(req.ctx, updateCouseRequst);
    if (result.ok) {
      res.status(200).send(result.data);
    } else {
      sendCourseDomainError(res, result.error);
    }
  });

  router.delete("/:courseId", requiresAdminPriviliges(), async (req, res) => {
    const deleteCourseRequest = deleteCourseRequestSchema.parse({
      courseId: req.params.courseId,
    });
    const deleteCourse = deleteCourseProvider(courseStore);
    const result = await deleteCourse(req.ctx, deleteCourseRequest);
    if (result.ok) {
      res.status(204).send();
    } else {
      sendCourseDomainError(res, result.error);
    }
  });

  router.get("/:courseId/lessons", async (req, res) => {
    const listLessonsRequest = listLessonsRequestSchema.parse({
      courseId: req.params.courseId,
    });
    const listLessons = listLessonsProvider(courseStore);
    const result = await listLessons(req.ctx, listLessonsRequest);
    if (result.ok) {
      res.status(200).send(result.data);
    } else {
      sendCourseDomainError(res, result.error);
    }
  });

  router.post(
    "/:courseId/lessons",
    requiresAdminPriviliges(),
    async (req, res) => {
      console.log("Creating lesson");
      const createLessonRequest = createLessonRequestSchema.parse({
        courseId: req.params.courseId,
        lessonDetails: req.body,
      });
      console.log(createLessonRequest);
      const createLesson = createLessonProvider(courseStore);
      const result = await createLesson(req.ctx, createLessonRequest);
      if (result.ok) {
        res.status(200).send(result.data);
      } else {
        sendCourseDomainError(res, result.error);
      }
    }
  );

  router.get("/:courseId/lessons/:lessonId", async (req, res) => {
    const getLessonRequest = getLessonRequestSchema.parse({
      courseId: req.params.courseId,
      lessonId: req.params.lessonId,
    });
    const getLesson = getLessonProvider(courseStore);
    const result = await getLesson(req.ctx, getLessonRequest);
    if (result.ok) {
      res.status(200).send(result.data);
    } else {
      sendCourseDomainError(res, result.error);
    }
  });

  router.put(
    "/:courseId/lessons/:lessonId",
    requiresAdminPriviliges(),
    async (req, res) => {
      const updateLessonRequest = updateLessonRequestSchema.parse({
        courseId: req.params.courseId,
        lessonId: req.params.lessonId,
        lessonDetails: req.body,
      });
      const updateLesson = updateLessonProvider(courseStore);
      const result = await updateLesson(req.ctx, updateLessonRequest);
      if (result.ok) {
        res.status(200).send(result.data);
      } else {
        sendCourseDomainError(res, result.error);
      }
    }
  );

  router.delete(
    "/:courseId/lessons/:lessonId",
    requiresAdminPriviliges(),
    async (req, res) => {
      const deleteLessonRequest = deleteLessonRequestSchema.parse({
        courseId: req.params.courseId,
        lessonId: req.params.lessonId,
      });
      const deleteLesson = deleteLessonProvider(courseStore);
      const result = await deleteLesson(req.ctx, deleteLessonRequest);
      if (result.ok) {
        res.status(204).send();
      } else {
        sendCourseDomainError(res, result.error);
      }
    }
  );

  return router;
};
