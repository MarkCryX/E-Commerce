import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth"; 
import {
  updateIsDefaultAddress,
  createAddress,
  deleteAddress,
  updateAdress,
} from "@/api/user";
import { useState } from "react";
import { extractErrorMessage } from "@/utils/errorHelper";
import AddressCard from "@/components/User/Adress/AddressCard";

const AddressesPage = () => {
  const { user, loading, setUser } = useAuth();
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [mode, setMode] = useState("create");

  const handleIsDefault = async (addressId) => {
    try {
      const response = await updateIsDefaultAddress(addressId);
      const { addresses, message } = response;

      setUser((prevUser) => ({
        ...prevUser,
        addresses: [...addresses],
      }));

      toast.success(message);
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (mode === "create") {
        const response = await createAddress(formData);
        const { addresses, message } = response;
        toast.success(message);
        setModal(false);
        setUser((prev) => ({
          ...prev,
          addresses: addresses,
        }));
      } else {
        const response = await updateAdress(formData, formData._id);
        const { addresses, message } = response;
        toast.success(message);
        setModal(false);
        setUser((prev) => ({
          ...prev,
          addresses: addresses,
        }));
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }
  };

  const handleDeleteAdress = async (addressId) => {
    try {
      const response = await deleteAddress(addressId);
      const { addresses, message } = response;

      setUser((prevUser) => ({
        ...prevUser,
        addresses: addresses,
      }));
      toast.success(message);
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }
  };

  const handleAdd = () => {
    setMode("create");
    setEditData(null);
    setModal(true);
  };

  const handleEdit = (address) => {
    setMode("edit");
    setEditData(address);
    setModal(true);
  };

  return (
    <div className="my-8 rounded-sm bg-white py-6 shadow-sm">
      <div className="flex items-center justify-between border-b pr-6 pb-6 pl-6">
        <p>ที่อยู่ของฉัน</p>
        <button
          className="cursor-pointer bg-blue-500 p-2 text-white hover:bg-blue-600"
          onClick={() => handleAdd()}
        >
          + เพิ่มที่อยู่
        </button>
      </div>
      <div className="">
        {user.addresses.length > 0 ? (
          <div>
            {[...user.addresses]
              .sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
              .map((addr) => (
                <div
                  key={addr._id}
                  className="flex justify-between border-b p-6 font-light"
                >
                  <div>
                    <div className="flex">
                      <p className="border-r border-gray-400 pr-3 font-medium">
                        {addr.name}
                      </p>
                      <p className="pl-3">เบอร์ {addr.phone}</p>
                    </div>
                    <p>{addr.addressLine}</p>
                    <div className="flex gap-2">
                      <p>ตำบล {addr.subDistrict}</p>
                      <p>อำเภอ {addr.district}</p>
                      <p>จังหวัด {addr.province}</p>
                      <p>รหัสไปรณี {addr.postalCode}</p>
                    </div>
                    <div className="mt-3">
                      <p
                        className={`inline p-1 text-blue-400 ${addr.isDefault ? "border border-blue-500" : ""}`}
                      >
                        {addr.isDefault ? "ค่าเริ่มต้น" : ""}
                      </p>
                    </div>
                  </div>
                  <div className={`flex flex-col`}>
                    <div className="mb-3 flex justify-end gap-5">
                      <button
                        className="cursor-pointer font-normal text-blue-500"
                        onClick={() => handleEdit(addr)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="cursor-pointer font-normal text-blue-500"
                        onClick={() => handleDeleteAdress(addr._id)}
                      >
                        ลบ
                      </button>
                    </div>
                    <button
                      className={`cursor-pointer border border-black/50 px-3 py-1 font-normal ${addr.isDefault ? "opacity-60" : ""} `}
                      disabled={addr.isDefault}
                      onClick={() => handleIsDefault(addr._id)}
                    >
                      {addr.isDefault ? "ค่าเริ่มต้น" : "ตั้งเป็นค่าเริ่มต้น"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center">
            <p>กรุณาเพิ่มที่อยู่</p>
          </div>
        )}
      </div>
      {modal && (
        <AddressCard
          mode={mode}
          setModal={setModal}
          addressData={editData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
export default AddressesPage;
