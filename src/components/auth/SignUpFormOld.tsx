import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Select from "../form/Select";
import { useRegisterMutation, useSendOtpMutation, useVerifyOtpMutation } from "../../features/api/apiSlice";

const OTP_LENGTH = 6;

/* -------- Optional ID Regex -------- */
const GST_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const MSME_REGEX = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
const GUMASTA_REGEX = /^[A-Z0-9/-]{6,20}$/;

export default function SignUpForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    businessType: "",
    email: "",
    mobile: "",
    optionalId: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* -------- OTP -------- */
  const [emailOtp, setEmailOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [mobileOtp, setMobileOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const emailRefs = useRef<(HTMLInputElement | null)[]>([]);
  const mobileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [sendOtpMutation] = useSendOtpMutation();
  const [register] = useRegisterMutation();

  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [verifyOtpMutation] = useVerifyOtpMutation();
  const navigate = useNavigate();

  /* -------- Send OTP -------- */
  const handleSendOtp = async (method: "EMAIL" | "MOBILE" | "BOTH" = "BOTH") => {
    const e: Record<string, string> = {};

    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (!form.businessName) e.businessName = "Required";
    if (!form.businessType) e.businessType = "Required";
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Invalid mobile";
    if (!form.email) e.email = "Required";
    if (!acceptedTerms) e.terms = "Accept terms";
    // mobile must start with 6-9
    if (form.mobile && !/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter valid 10-digit mobile starting with 6-9";

    if (form.optionalId) {
      const v = form.optionalId.trim();
      const valid =
        GST_REGEX.test(v) ||
        MSME_REGEX.test(v) ||
        GUMASTA_REGEX.test(v);

      if (!valid) {
        e.optionalId =
          "Enter valid GST / MSME (UDYAM) / Gumasta number";
      }
    }

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});

    try {
      if (method === "BOTH") {
        const triggers: any[] = [];
        if (form.email) triggers.push(sendOtpMutation({ contactMethod: "EMAIL", contactValue: form.email, purpose: "SIGNUP" }));
        if (form.mobile) triggers.push(sendOtpMutation({ contactMethod: "MOBILE", contactValue: form.mobile, purpose: "SIGNUP" }));
        await Promise.all(triggers.map((t: any) => t.unwrap()));
      } else if (method === "EMAIL") {
        await sendOtpMutation({ contactMethod: "EMAIL", contactValue: form.email, purpose: "SIGNUP" }).unwrap();
      } else {
        await sendOtpMutation({ contactMethod: "MOBILE", contactValue: form.mobile, purpose: "SIGNUP" }).unwrap();
      }

      setStep(2);
      setTimeout(() => emailRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setErrors({ email: err?.data?.message || err?.message || "Failed to send OTP" });
    }
  }; 

  /* -------- OTP Input -------- */
  const handleOtpChange = (
    value: string,
    i: number,
    type: "email" | "mobile"
  ) => {
    if (!/^\d?$/.test(value)) return;
    const arr = type === "email" ? [...emailOtp] : [...mobileOtp];
    arr[i] = value;
    type === "email" ? setEmailOtp(arr) : setMobileOtp(arr);

    const refs = type === "email" ? emailRefs : mobileRefs;
    if (value && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    type: "email" | "mobile"
  ) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    const filled = [
      ...digits,
      ...Array(OTP_LENGTH - digits.length).fill(""),
    ];
    type === "email" ? setEmailOtp(filled) : setMobileOtp(filled);
  };

  const verifyEmailOtp = async () => {
    const code = emailOtp.join("");
    if (code.length !== OTP_LENGTH) {
      setErrors({ otp: "Enter 6-digit OTP" });
      return;
    }
    try {
      await verifyOtpMutation({ contactMethod: "EMAIL", contactValue: form.email, purpose: "SIGNUP", otp: code }).unwrap();
      setEmailVerified(true);
    } catch (err: any) {
      setErrors({ otp: err?.data?.message || err?.message || "Invalid OTP" });
    }
  };

  const verifyMobileOtp = async () => {
    const code = mobileOtp.join("");
    if (code.length !== OTP_LENGTH) {
      setErrors({ otp: "Enter 6-digit OTP" });
      return;
    }
    try {
      await verifyOtpMutation({ contactMethod: "MOBILE", contactValue: form.mobile, purpose: "SIGNUP", otp: code }).unwrap();
      setMobileVerified(true);
    } catch (err: any) {
      setErrors({ otp: err?.data?.message || err?.message || "Invalid OTP" });
    }
  };

  useEffect(() => {
    if (emailVerified && mobileVerified) setStep(3);
  }, [emailVerified, mobileVerified]);

  /* -------- Password -------- */
  const validatePassword = () => {
    const rule = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/;
    if (!rule.test(form.password))
      return "Password must contain 1 uppercase & 1 special character";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePassword();
    if (err) {
      setErrors({ password: err });
      return;
    }

    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setErrors({ email: "Enter a valid email" });
      return;
    }
    if (!form.mobile || !/^[6-9]\d{9}$/.test(form.mobile)) {
      setErrors({ mobile: "Enter valid 10-digit mobile starting with 6-9" });
      return;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobile: form.mobile,
      password: form.password,
      businessType: ((): string => {
        const m = (form.businessType || "").toLowerCase();
        if (m.includes("public")) return "PUBLIC";
        if (m.includes("private")) return "PRIVATE";
        if (m.includes("llp")) return "LLP";
        return m.toUpperCase() || "PROPRIETOR";
      })(),
      businessName: form.businessName,
      registrationNo: form.optionalId ? form.optionalId : null,
    };

    try {
      await register(payload).unwrap();
      navigate("/signin");
    } catch (err: any) {
      setErrors({ email: err?.data?.message || err?.message || "Failed to register" });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto overflow-y-auto no-scrollbar px-1 pt-12">
      <div className="space-y-4">
        {/* -------- STEP 1 -------- */}
        {step === 1 && (
          <>
            <h1 className="text-center font-semibold text-title-sm">
              Sign Up
            </h1>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name <span style={{ color: "red" }}>*</span></Label>
                <Input
                  placeholder="First Name"
                  onChange={(e) =>
                    updateField("firstName", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Last Name <span style={{ color: "red" }}>*</span></Label>
                <Input
                  placeholder="Last Name"
                  onChange={(e) =>
                    updateField("lastName", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Label>Business Name <span style={{ color: "red" }}>*</span></Label>
              <Input
                placeholder="Business Name"
                onChange={(e) =>
                  updateField("businessName", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Business Type <span style={{ color: "red" }}>*</span></Label>
              <Select
                placeholder="Select Business Type"
                defaultValue={form.businessType}
                options={[
                  { value: "Proprietor", label: "Proprietor" },
                  { value: "Private", label: "Private" },
                  { value: "LLP", label: "LLP" },
                  {
                    value: "Public / Listed",
                    label: "Public / Listed",
                  },
                ]}
                onChange={(v) =>
                  updateField("businessType", v)
                }
              />
            </div>

            <div>
              <Label>Mobile <span style={{ color: "red" }}>*</span></Label>
              <Input
                type="tel"
                placeholder="Mobile"
                className="w-full px-4 py-3 border rounded-lg"
                onChange={(e) =>
                  updateField("mobile", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Email <span style={{ color: "red" }}>*</span></Label>
              <Input
                placeholder="Email"
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
              />
            </div>

            <div>
              <Label>GST / MSME / Gumasta No.</Label>
              <Input
                placeholder="Enter ID number"
                value={form.optionalId}
                onChange={(e) =>
                  updateField("optionalId", e.target.value)
                }
              />
              {errors.optionalId && (
                <p className="text-sm text-error-500">
                  {errors.optionalId}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={acceptedTerms}
                onChange={setAcceptedTerms}
              />
              <span className="text-sm">
                I agree to the Terms & Conditions <span style={{ color: "red" }}>*</span>
              </span>
            </div>

            <button
              onClick={() => handleSendOtp("BOTH")}
              className="w-full h-9 items-center justify-center rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500 mb-10"
            >
              Send OTP
            </button>
          </>
        )}

        {/* -------- STEP 2 -------- */}
        {step === 2 && (
          <div className="space-y-6">

            <h1 className="text-center font-semibold text-title-sm">
              OTP Verification
            </h1>


            <Label>Email OTP</Label>
            <div className="flex justify-center gap-2">
              {emailOtp.map((_, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    emailRefs.current[i] = el;
                  }}
                  maxLength={1}
                  disabled={emailVerified}
                  onPaste={(e) => handleOtpPaste(e, "email")}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, i, "email")
                  }
                  className="w-10 h-10 border rounded text-center"
                />
              ))}
            </div>


            {emailVerified && (
              <p className="text-center text-success-600 text-sm">
                ✅ Email OTP verified
              </p>
            )}

            <button
              onClick={verifyEmailOtp}
              disabled={emailVerified}
              className="w-full h-9 items-center justify-center rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500 mb-10"
            >
              Verify Email OTP
            </button>

            <Label>Mobile OTP</Label>
            <div className="flex justify-center gap-2">
              {mobileOtp.map((_, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    mobileRefs.current[i] = el;
                  }}
                  maxLength={1}
                  disabled={mobileVerified}
                  onPaste={(e) => handleOtpPaste(e, "mobile")}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, i, "mobile")
                  }
                  className="w-10 h-10 border rounded text-center"
                />
              ))}
            </div>


            {mobileVerified && (
              <p className="text-center text-success-600 text-sm">
                ✅ Mobile OTP verified
              </p>
            )}

            <button
              onClick={verifyMobileOtp}
              disabled={mobileVerified}
              className="w-full h-9 items-center justify-center rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500 mb-10"
            >
              Verify Mobile OTP
            </button>
          </div>
        )}

        {/* -------- STEP 3 -------- */}
        {step === 3 && (
          <>
            <h1 className="text-center font-semibold text-title-sm">
              Generate Password
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Create Password */}
              <Label>Create Password</Label>
              <div className="relative">
                <Input
                  type={showCreatePassword ? "text" : "password"}
                  placeholder="Create Password"
                  onChange={(e) =>
                    updateField("password", e.target.value)
                  }
                />
                <span
                  onClick={() =>
                    setShowCreatePassword((v) => !v)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showCreatePassword ? <EyeIcon /> : <EyeCloseIcon />}
                </span>
              </div>

              {/* Confirm Password */}
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                />
                <span
                  onClick={() =>
                    setShowConfirmPassword((v) => !v)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? <EyeIcon /> : <EyeCloseIcon />}
                </span>
              </div>

              {errors.password && (
                <p className="text-sm text-error-500">
                  {errors.password}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-9 flex items-center justify-center rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500 mb-10"
              >
                Create Account
              </button>
            </form>

          </>
        )}
      </div>
    </div>
  );
}
