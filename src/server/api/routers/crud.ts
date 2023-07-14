import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const crudRouter = createTRPCRouter({
  getStudentsWithCoursesOnId: publicProcedure
    .input(z.object({ studentId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      // Expected output: data student berdasarkan id yang diberikan, kalau id tidak diberikan, fetch semua data
      if (input.studentId) {
        const student = await ctx.prisma.student.findUnique({
          where: {student_id : input.studentId},
        });
        return student;
      } else {
        const all_student = await ctx.prisma.student.findMany({});
        return all_student;
      }
    }),

  getAllCourses: publicProcedure.query(async ({ ctx }) => {
    // Expected output: seluruh data course yang ada
    const all_course = await ctx.prisma.course.findMany({});
    return all_course;
  }),

  getStudentsListOnCourseId: publicProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Expected output: data course berdasarkan id yang diberikan beserta seluruh student yang mengikutinya
      const all_course = await ctx.prisma.enrollment.findUnique({
        where: {course_id: input.courseId},
        include: {student: true},
      });
      return all_course;
    }),

  insertNewStudent: publicProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Expected output: hasil data yang di insert
      const created_user = await ctx.prisma.user.create({
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
        },
      });
      return created_user;
    }),

  insertNewCourse: publicProcedure
    .input(z.object({ name: z.string(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Expected output: hasil data yang di insert
      const created_course = await ctx.prisma.course.create({
        data: {
          name: input.name,
          credits: input.credits
        },
      });
      return created_course;
    }),

  enrollNewStudent: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // Expected output: hasil data yang di insert, enrollment_date mengikuti waktu ketika fungsi dijalankan
      const created_enroll = await ctx.prisma.enrollment.create({
        data: {
          enrollment_date: new Date(),
          student_id: input.studentId,
          course_id: input.courseId,
        },
      });
      return created_enroll;
    }),

  updateCourseData: publicProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        name: z.string().optional(),
        credits: z.number().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Expected output: hasil data yang di update berdasarkan courseId yang diberikan, apabila name atau credits tidak diberikan, tidak usah di update
      const updated_course = await ctx.prisma.course.findUnique({
        where: {id: input.courseId,},
      });
      if (input.name){
        const updated_course = await ctx.prisma.course.update({
          where: {id: input.courseId,},
          data: {name: input.name,},
        });
      }
      if (input.credits){
        const updated_course = await ctx.prisma.course.update({
          where: {id: input.courseId,},
          data: {credits: input.credits,},
        });
      }
      return updated_course;
    }),

  removeStudentfromCourse: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // Expected output: hasil data yang di delete
      const delete_enrollment = await ctx.prisma.enrollment.delete({
        where: {
          student_id: input.studentId,
          course_id: input.courseId,
        },
      });
      return delete_enrollment;
    })
});
