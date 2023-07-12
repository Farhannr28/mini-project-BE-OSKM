import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const crudRouter = createTRPCRouter({
  getStudentsWithCoursesOnId: publicProcedure
    .input(z.object({ studentId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: data student berdasarkan id yang diberikan, kalau id tidak diberikan, fetch semua data
    }),

  getAllCourses: publicProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
    // Expected output: seluruh data course yang ada
  }),

  getStudentsListOnCourseId: publicProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: data course berdasarkan id yang diberikan beserta seluruh student yang mengikutinya
    }),

  insertNewStudent: publicProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert
    }),

  insertNewCourse: publicProcedure
    .input(z.object({ name: z.string(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert
    }),

  enrollNewStudent: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di insert, enrollment_date mengikuti waktu ketika fungsi dijalankan
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
      // TODO: isi logic disini
      // Expected output: hasil data yang di update berdasarkan courseId yang diberikan, apabila name atau credits tidak diberikan, tidak usah di update
    }),

  removeStudentfromCourse: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      // Expected output: hasil data yang di delete
    })
});
