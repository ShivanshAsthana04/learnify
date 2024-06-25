import { Ctx } from "@common/ctx";
import { CourseStore } from "@course/ports";

export const listCoursesProvider = (store: CourseStore) => async (ctx: Ctx) => {
  return store.listCourses(ctx);
};
