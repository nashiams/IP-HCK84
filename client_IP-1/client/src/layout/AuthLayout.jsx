import { Link, Navigate, Outlet, useNavigate } from "react-router";

import { useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/NavBar";

export default function AuthLayout() {
  // protecting your page from unauthenticated user

  const token = localStorage.getItem("access_token");
  // kalo dia belum login

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Opps",
        text: "Kamu belum login",
        icon: "error",
      });
      return navigate("/login");
    }
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
