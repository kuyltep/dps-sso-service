-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'UNIVERSITY_ADMIN', 'EMPLOYEE', 'COMPANY_ADMIN');

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "about_me" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "study_year" INTEGER NOT NULL,
    "faculty" VARCHAR(255) NOT NULL,
    "speciality" VARCHAR(255) NOT NULL,
    "university_name" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "login" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "position" TEXT,
    "phone_number" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "user_id" TEXT NOT NULL,
    "vacancies_id" TEXT[],
    "company_name" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "employee_phone_number_key" ON "employee"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");
