//indexCourseId.jsx
import React from "react";
import HeaderOne from "@/src/layout/headers/header";
import HeaderTwo from "@/src/layout/headers/header_3_user";
import Breadcrumb from "@/src/common/breadcrumbs/breadcrumb_5";
import Footer from "@/src/layout/footers/footer";
import CourseDetailPage from "../../../../../src/pages/kursus/[id]";
import useAuth from "../../../../../Database/Auth/auth";
import { useRouter } from "next/router";

const IndexCourseId = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <>
      {isLoggedIn ? <HeaderTwo /> : <HeaderOne />}
      <Breadcrumb title="Detail Course" innertitle="Course Details" />
      <main className="bg-gray-50 min-h-screen">
        {!isLoggedIn ? (
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Please Login
            </h2>
            <p className="mb-4 text-gray-600">
              You need to be logged in to view course details.
            </p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => router.push("/login")}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <CourseDetailPage />
        )}
      </main>
      <Footer />
    </>
  );
};

export default IndexCourseId;