import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

const OTP_LENGTH = 6;
const MAX_RESEND = 3;

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [showPassword, setShowPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    otp?: string;
  }>({});

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ---------------- Timer ---------------- */
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- Send OTP ---------------- */
  const sendOtp = async () => {
    if (resendCount >= MAX_RESEND) {
      setErrors({ otp: "OTP resend limit reached" });
      return;
    }

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setOtpSent(true);
      setTimer(60);
      setOtp(Array(OTP_LENGTH).fill(""));
      setResendCount(c => c + 1);

      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setErrors({ email: "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP Change ---------------- */
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  /* ---------------- OTP Backspace ---------------- */
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /* ---------------- OTP Paste ---------------- */
  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const newOtp = pasted.split("");
    while (newOtp.length < OTP_LENGTH) newOtp.push("");

    setOtp(newOtp);

    const lastIndex = Math.min(pasted.length - 1, OTP_LENGTH - 1);
    setTimeout(() => otpRefs.current[lastIndex]?.focus(), 0);
  };

  /* ---------------- Sign In ---------------- */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");

    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (otpValue.length !== OTP_LENGTH)
      newErrors.otp = "Enter 6-digit OTP";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          otp: otpValue,
        }),
      });

      if (!res.ok) throw new Error();
      alert("Login successful");
    } catch {
      setErrors({ otp: "Invalid OTP or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500">
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm">
          Sign In
        </h1>

        <form onSubmit={handleSignIn} className="space-y-6">
          {/* Email */}
          <div>
            <Label>Email *</Label>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="info@gmail.com"
            />
            {errors.email && (
              <p className="text-sm text-error-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Send OTP */}
          {!otpSent && (
            <Button onClick={sendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          )}

          {/* OTP */}
          {otpSent && (
            <div>
              <Label>OTP *</Label>
              <div className="flex gap-2 mt-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      if (el) otpRefs.current[i] = el;
                    }}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(e.target.value, i)
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(e, i)
                    }
                    onPaste={handleOtpPaste}
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-12 h-12 text-center border rounded-lg text-lg focus:ring-2 focus:ring-brand-500"
                  />
                ))}
              </div>

              {errors.otp && (
                <p className="text-sm text-error-500 mt-1">{errors.otp}</p>
              )}

              <div className="mt-2 text-sm">
                {resendCount >= MAX_RESEND ? (
                  <span className="text-error-500">
                    OTP resend limit reached
                  </span>
                ) : timer > 0 ? (
                  <span className="text-gray-500">
                    Resend OTP in {timer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="text-brand-500 hover:underline"
                  >
                    Resend OTP ({MAX_RESEND - resendCount} left)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Password */}
          {otpSent && (
            <div>
              <Label>Password *</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                </span>
              </div>
              {errors.password && (
                <p className="text-sm text-error-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Sign In */}
          {otpSent && (
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
