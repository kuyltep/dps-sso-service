-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_user_id_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_user_id_fkey";

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
