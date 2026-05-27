import { useState } from "react";
import PopUpModal from "../../shared/popup/Pop-Up-Modal";
import { Button } from "../../shared/button/Button";
import { changePasswordOTP, verifyChangePasswordOTP,changePassword } from "../../../services/auth-service";
import formStyle from "../../shared/Form.module.css";


function ChangePasswordFormModal({ onClose }) {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1 — kirim OTP
    const handleSendOTP = async () => {
        setLoading(true);
        setError("");
        try {
            await changePasswordOTP();
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2 — verifikasi OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setError("OTP is required");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await verifyChangePasswordOTP({ otp });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 3 — ganti password
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await changePassword({
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmPassword
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const stepTitles = {
        1: "Change Password",
        2: "Verify OTP",
        3: "Set New Password"
    };

    return (
        <PopUpModal title={stepTitles[step]} onClose={onClose}>

            {/* Step Indicator */}
            <div className={formStyle["step-indicator"]}>
                {[1, 2, 3].map((s) => (
                    <span key={s} className={`${formStyle.step} ${step === s ? formStyle["step-active"] : step > s ? formStyle["step-done"] : ""}`}>
                        {s}
                    </span>
                ))}
            </div>

            {/* Step 1 — kirim OTP */}
            {step === 1 && (
                <div className={formStyle["step-content"]}>
                    <p className={formStyle.subtitle}>
                        We'll send a verification code to your registered email.
                    </p>
                    {error && <p className={formStyle["error-text"]}>{error}</p>}
                    <div className={formStyle.actions}>
                        <Button variant="primary" onClick={handleSendOTP} disabled={loading} full>
                            {loading ? "Sending..." : "Send OTP"}
                        </Button>
                        <Button variant="outline" onClick={onClose} full>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2 — input OTP */}
            {step === 2 && (
                <form className={formStyle.form} onSubmit={handleVerifyOTP}>
                    <p className={formStyle.subtitle}>Enter the OTP sent to your email.</p>
                    <div className={formStyle.field}>
                        <label className={formStyle.label}>OTP Code</label>
                        <input
                            className={formStyle.input}
                            type="text"
                            placeholder="4-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={4}
                        />
                    </div>
                    {error && <p className={formStyle["error-text"]}>{error}</p>}
                    <div className={formStyle.actions}>
                        <Button variant="primary" type="submit" disabled={loading} full>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                        <Button variant="outline" onClick={() => setStep(1)} full>
                            Back
                        </Button>
                    </div>
                </form>
            )}

            {/* Step 3 — ganti password */}
            {step === 3 && (
                <form className={formStyle.form} onSubmit={handleChangePassword}>
                    <div className={formStyle.field}>
                        <label className={formStyle.label}>Current Password</label>
                        <div className={formStyle["input-wrapper"]}>
                            <input
                                className={formStyle.input}
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <button
                                className={formStyle["toggle-password"]}
                                type="button"
                                onClick={() => setShowCurrentPassword(prev => !prev)}
                                style={{
                                    right: "5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                }}
                            >
                                {showCurrentPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div className={formStyle.field}>
                        <label className={formStyle.label}>New Password</label>
                        <div className={formStyle["input-wrapper"]}>
                            <input
                                className={formStyle.input}
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                className={formStyle["toggle-password"]}
                                type="button"
                                onClick={() => setShowNewPassword(prev => !prev)}
                                style={{
                                    right: "5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                }}
                            >
                                {showNewPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div className={formStyle.field}>
                        <label className={formStyle.label}>Confirm New Password</label>
                        <div className={formStyle["input-wrapper"]}>
                            <input
                                className={formStyle.input}
                                type={showConfirmNewPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                className={formStyle["toggle-password"]}
                                type="button"
                                onClick={() => setShowConfirmNewPassword(prev => !prev)}
                                style={{
                                    right: "5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                }}
                            >
                                {showConfirmNewPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    {error && <p className={formStyle["error-text"]}>{error}</p>}
                    <div className={formStyle.actions}>
                        <Button variant="primary" type="submit" disabled={loading} full>
                            {loading ? "Loading..." : "Change Password"}
                        </Button>
                    </div>
                </form>
            )}

        </PopUpModal>
    );
}

export default ChangePasswordFormModal;