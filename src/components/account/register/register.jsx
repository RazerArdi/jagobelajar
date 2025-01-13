import React, { useState } from 'react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import useAuth from '@/Database/Auth/auth';
import axios from 'axios';

const RegisterArea = () => {
    const { register } = useAuth(); // Use register method
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '', // Add password_confirmation
        username: '',
        foto: null, // Foto field remains optional
    });
    const [recaptchaToken, setRecaptchaToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            // If no file is selected, just return
            setFormData((prev) => ({ ...prev, foto: null }));
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'File harus berupa gambar PNG, JPEG, atau GIF.',
                confirmButtonText: 'OK',
            });
            setFormData((prev) => ({ ...prev, foto: null }));
            return;
        }

        if (file.size / (1024 * 1024) > 8) { // Limit the file size to 8MB
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ukuran file tidak boleh lebih dari 8MB.',
                confirmButtonText: 'OK',
            });
            setFormData((prev) => ({ ...prev, foto: null }));
            return;
        }

        const image = new Image();
        image.onload = () => {
            const { width, height } = image;
            if (width !== height) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Rasio gambar harus 1:1.',
                    confirmButtonText: 'OK',
                });
                setFormData((prev) => ({ ...prev, foto: null }));
                return;
            }
            setFormData((prev) => ({ ...prev, foto: file }));
        };
        image.src = URL.createObjectURL(file);
    };

    const handleRecaptchaChange = (token) => {
        if (token) {
            Swal.fire({
                icon: 'success',
                title: 'Verified',
                text: 'reCAPTCHA berhasil diverifikasi.',
            });
            setRecaptchaToken(token);
        } else {
            setRecaptchaToken('');
        }
    };

    const uploadFile = async () => {
        if (!formData.foto) return null; // If no file, return null

        const fileData = new FormData();
        fileData.append('file', formData.foto);
        const response = await axios.post(
            'https://jagobelajar.cloud/api/upload',
            fileData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return response.data.url;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!recaptchaToken) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Silakan verifikasi reCAPTCHA.',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Check if password and password_confirmation match
        if (formData.password !== formData.password_confirmation) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password dan konfirmasi password tidak cocok.',
                confirmButtonText: 'OK',
            });
            return;
        }

        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!regex.test(formData.password)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password harus terdiri minimal 8 karakter, setidaknya satu huruf besar, satu huruf kecil, satu simbol, dan satu angka.',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (formData.username.length < 4) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username harus minimal 4 karakter.',
                confirmButtonText: 'OK',
            });
            return;
        }

        setIsLoading(true);

        try {
            const fotoUrl = await uploadFile();
            const response = await register({
                ...formData,
                foto: fotoUrl, // foto may be null if not uploaded
                recaptcha_token: recaptchaToken,
            });

            // On successful registration, show success message and redirect
            Swal.fire({
                icon: 'success',
                title: 'Pendaftaran Berhasil',
                text: 'Registrasi berhasil, silahkan login.',
                confirmButtonText: 'OK',
            }).then(() => {
                window.location.href = '/login'; // Redirect to login page
            });
        } catch (error) {
            setErrorMessage(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="tp-about-area pt-120 pb-120">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-lg-5">
                            <div className="ab-wrapper-4 p-relative">
                                <div className="ab-right-img mb-10">
                                    <img src="/assets/img/Register.svg" alt="theme-pure" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7">
                            <div className="tp-about-info-wrapper pl-50">
                                <div className="tp-section-box tp-section-box-2 p-relative">
                                    <h2 className="tp-section-title mb-10">Register</h2>
                                    <p style={{ textAlign: 'justify' }}>
                                        Syarat dan ketentuan dibuat untuk melindungi hak dan kepentingan semua pihak yang terlibat dalam proses pendaftaran. Membaca dan memahami syarat dan ketentuan akan membantu Anda menghindari kesalahpahaman dan permasalahan di kemudian hari.
                                        <strong><a href="/terms_and_use" style={{ textDecoration: 'underline' }}> Baca Disini</a></strong>
                                        <strong> <br /> Mohon baca syarat dan ketentuan sebelum mendaftar.</strong>
                                    </p>
                                    <p style={{ textAlign: 'justify' }}>
                                        Daftar platform kami mudah & nikmati akses penuh via Google, Google, atau Github! <strong> Pendaftaran manual (tanpa akses penuh) hanya untuk tamu yang ingin mencoba platform ini. </strong>
                                    </p>
                                </div>
                                <hr className="mt-5 mb-10" />
                                <div className="tp-ab-meta">
                                    <div className="about-meta-img d-flex">
                                        <div className="tp-ab-meta-text pl-10" style={{ textAlign: 'justify' }}>
                                            <form onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <label htmlFor="name">Nama:</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        className="form-control"
                                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="username">Username</label>
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        className="form-control"
                                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email:</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password">Password:</label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        className="form-control"
                                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password_confirmation">Confirm Password:</label>
                                                    <input
                                                        type="password"
                                                        id="password_confirmation"
                                                        name="password_confirmation"
                                                        className="form-control"
                                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group pt-20">
                                                    <label htmlFor="profilePicture" className="pb-10">Upload Foto Profil:</label>
                                                    <input
                                                        type="file"
                                                        id="foto"
                                                        className="form-control-file"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                    />
                                                </div>
                                                <p className="form-group pt-10"><strong>Gambar harus JPG/PNG, rasio 1:1 (misalnya, 500x500 piksel), dan tidak lebih dari 8MB.</strong></p>
                                                <ReCAPTCHA
                                                    sitekey="6LdoULYqAAAAAImONmDVr9GOVA5ocZTzWT7WFT3W"
                                                    onChange={handleRecaptchaChange}
                                                />
                                                <button type="submit" className="btn mt-10" style={{ backgroundColor: '#111F2C', color: '#ffffff' }}>
                                                    {isLoading ? 'Loading...' : 'Register'}
                                                </button>
                                            </form>
                                            <p style={{ color: '#111F2C' }}>
                                                Sudah punya akun? <Link href="/login" style={{ textDecoration: 'underline' }}>Masuk sekarang</Link>.
                                            </p>
                                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-30 mb-35" />
                                <div className="tp-ab-4-list"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterArea;
