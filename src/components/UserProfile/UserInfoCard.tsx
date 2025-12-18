import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleChangePassword = () => {
    // API call goes here later
    console.log("Password changed");
    closeModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* LEFT: Info */}
        <div>
          <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            Personal & Business Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {/* First Name */}
            <Info label="First Name" value="Musharof" />

            {/* Last Name */}
            <Info label="Last Name" value="Chowdhury" />

            {/* Business Name */}
            <Info label="Business Name" value="Pimjo Technologies Pvt Ltd" />

            {/* Business Type */}
            <Info label="Business Type" value="Private Limited" />

            {/* Registration No */}
            <Info
              label="Gumasta / MSME / GST No."
              value="GSTIN29ABCDE1234F1Z5"
            />

            {/* Mobile */}
            <Info label="Mobile" value="+91 93633 98460" />

            {/* Email */}
            <Info label="Email Address" value="randomuser@pimjo.com" />
          </div>
        </div>

        {/* RIGHT: Change password button */}
        <div className="flex justify-start lg:justify-end">
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            🔐 Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md m-4">
        <div className="rounded-2xl bg-white p-6 dark:bg-gray-900">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
            Change Password
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Update your account password.
          </p>

          <form className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" />
            </div>

            <div>
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Confirm new password" />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleChangePassword}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------- Reusable read-only field ---------------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {value}
      </p>
    </div>
  );
}
