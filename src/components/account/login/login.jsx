import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/router";
import useAuth from "../../../../Database/Auth/auth";

const LoginArea = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleRecaptchaChange = (token) => setRecaptchaToken(token);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setErrorMessage("");
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
  };

  const handleLoginWithEmailAndPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!recaptchaToken) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Silakan verifikasi reCAPTCHA terlebih dahulu.",
        confirmButtonText: "OK",
        confirmButtonColor: "#111F2C",
      });
      return;
    }

    try {
      const response = await login(email, password);
      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Selamat datang di platform kami!",
          confirmButtonColor: "#111F2C",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/");
      } else {
        setErrorMessage(response.error);
        await Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: response.error,
          confirmButtonText: "OK",
          confirmButtonColor: "#111F2C",
          showCancelButton: true,
          cancelButtonText: "Refresh Page",
        }).then((result) => {
          if (
            result.isDismissed &&
            result.dismiss === Swal.DismissReason.cancel
          ) {
            window.location.reload();
          } else {
            setEmail("");
            setPassword("");
            if (window.grecaptcha) {
              window.grecaptcha.reset();
            }
            setRecaptchaToken("");
          }
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "Terjadi kesalahan sistem. Silakan coba lagi.";
      setErrorMessage(errorMessage);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "#111F2C",
        showCancelButton: true,
        cancelButtonText: "Refresh Page",
      }).then((result) => {
        if (
          result.isDismissed &&
          result.dismiss === Swal.DismissReason.cancel
        ) {
          window.location.reload();
        } else {
          setEmail("");
          setPassword("");
          if (window.grecaptcha) {
            window.grecaptcha.reset();
          }
          setRecaptchaToken("");
        }
      });
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
  };

  const handleGitHubSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github/redirect`;
  };

  return (
    <div className="tp-about-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-5">
            <div className="ab-wrapper-4 p-relative">
              <div className="ab-right-img mb-10">
                <img src="/assets/img/Login.svg" alt="theme-pure" />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-7">
            <div className="tp-about-info-wrapper pl-50">
              <div className="tp-section-box tp-section-box-2 p-relative">
                <h2 className="tp-section-title mb-10">Login</h2>
                <p style={{ textAlign: "justify" }}>
                  Masuk platform kami mudah & nikmati akses penuh via Google,
                  atau Github!{" "}
                  <strong>
                    Pendaftaran manual (tanpa akses penuh) hanya untuk tamu yang
                    ingin mencoba platform ini.
                  </strong>
                </p>
              </div>
              <hr className="mt-5 mb-10" />
              <div className="tp-ab-meta">
                <div className="about-meta-img d-flex">
                  <div
                    className="tp-ab-meta-text pl-10"
                    style={{ textAlign: "justify" }}
                  >
                    <form onSubmit={handleLoginWithEmailAndPassword}>
                      <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email} // Add value prop for controlled component
                          className="form-control"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                          onChange={handleEmailChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={password} // Add value prop for controlled component
                          className="form-control"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#000000",
                          }}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      {errorMessage && (
                        <p style={{ color: "red" }}>{errorMessage}</p>
                      )}
                      <p style={{ color: "#111F2C" }}>
                        Jika belum punya akun,{" "}
                        <Link
                          href="/register"
                          style={{ textDecoration: "underline" }}
                        >
                          daftar sekarang
                        </Link>
                        .
                      </p>
                      <ReCAPTCHA
                                              sitekey="6LdoULYqAAAAAImONmDVr9GOVA5ocZTzWT7WFT3W"
                        onChange={handleRecaptchaChange}
                      />
                      <button
                        type="submit"
                        className="btn mt-10"
                        style={{ backgroundColor: "#111F2C", color: "#ffffff" }}
                      >
                        Login
                      </button>
                    </form>
                    <div className="login-other-options">
                      <p style={{ color: "#111F2C", marginTop: "20px" }}>
                        Atau login dengan:
                      </p>
                      <button
                        className="btn btn-outline-light mr-2"
                        onClick={handleGoogleSignIn}
                      >
                        <img
                          src="/assets/img/google-color-svgrepo-com.svg"
                          alt="theme-pure"
                          width={32}
                        />
                      </button>
                      <button
                        className="btn btn-outline-light"
                        onClick={handleGitHubSignIn}
                      >
                        <img
                          src="/assets/img/github-142-svgrepo-com.svg"
                          alt="theme-pure"
                          width={32}
                        />
                      </button>
                    </div>
                    <p className="forger pt-10" style={{ color: "#111F2C" }}>
                      Lupa Password?{" "}
                      <Link
                        href="/resetPassword"
                        style={{ textDecoration: "underline" }}
                      >
                        reset sekarang
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
              <hr className="mt-30 mb-35" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginArea;
