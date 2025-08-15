const AddressModal = ({ address, currentAddress, onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative h-[500px] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl sm:h-[600px] md:h-[650px]">
        <div className="flex items-center justify-between mb-6 border-b pb-2">
          <h1 className="text-center text-2xl font-bold flex-grow">เปลี่ยนที่อยู่</h1>
          <button
            onClick={onClose}
            className="ml-4 rounded-full bg-gray-200 p-2 text-gray-600 hover:bg-gray-300 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {address.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">ยังไม่มีที่อยู่ในระบบ</p>
        ) : (
          address.map((addr) => {
            const isSelected = currentAddress?._id === addr._id;

            return (
              <div
                key={addr._id}
                className="mb-4 rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-lg">{addr.name}</p>
                      <p className="text-sm text-gray-500">{addr.phone}</p>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {addr.addressLine} ตำบล{addr.subDistrict} อำเภอ{addr.district} จังหวัด{addr.province} {addr.postalCode}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) onSelect(addr);
                    }}
                    disabled={isSelected}
                    className={`ml-4 whitespace-nowrap rounded px-4 py-2 text-white shadow transition ${
                      isSelected
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSelected ? "เลือกแล้ว" : "ใช้ที่อยู่นี้"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AddressModal;
