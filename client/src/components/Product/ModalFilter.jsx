import { RxCross1 } from "react-icons/rx";

const ModalFilter = ({
  categories,
  selectedCategory,
  handleCategoryChange,
  setModalFilter,
  sortBy,
  handleSortChange,
}) => {
  const handleSortAndClose = (value) => {
    handleSortChange(value);
    // setModalFilter(false);
  };

  const handleCategoryAndClose = (value) => {
    handleCategoryChange(value);
    // setModalFilter(false);
  };
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
        {/* ปุ่มปิด modal */}
        <button
          onClick={() => setModalFilter(false)}
          className="absolute top-3 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-300"
        >
          <RxCross1 className="h-5 w-5" />
        </button>

        {/* ส่วน Sort */}
        <div className="border-b-1 py-3">
          <h2 className="mb-2 text-xl font-bold">เรียงตาม</h2>

          <div className="inline-block">
            <div
              className="flex items-center"
              onClick={() => handleSortAndClose("createdAt_desc")}
            >
              <input
                type="radio"
                name="sort-by"
                value="createdAt_desc"
                checked={sortBy === "createdAt_desc"}
                className="form-radio h-5 w-5 cursor-pointer text-blue-600"
              />
              <label className="cursor-pointer p-3">ใหม่ล่าสุด</label>
            </div>

            <div
              className="flex items-center"
              onClick={() => handleSortAndClose("price_desc")}
            >
              <input
                type="radio"
                name="sort-by"
                value="price_desc"
                checked={sortBy === "price_desc"}
                className="form-radio h-5 w-5 cursor-pointer text-blue-600"
              />
              <label className="cursor-pointer p-3">ราคา: สูง-ต่ำ</label>
            </div>

            <div
              className="flex items-center"
              onClick={() => handleSortAndClose("price_asc")}
            >
              <input
                type="radio"
                name="sort-by"
                value="price_asc"
                checked={sortBy === "price_asc"}
                className="form-radio h-5 w-5 cursor-pointer text-blue-600"
              />
              <label className="cursor-pointer p-3">ราคา: ต่ำ-สูง</label>
            </div>
          </div>
        </div>

        {/* ส่วน Category */}
        <div className="border-b-1 py-3">
          <h2 className="mb-4 text-xl font-bold">หมวดหมู่</h2>
          {categories.map((cat) => (
            <div
              className="flex flex-col space-y-2"
              onClick={() => handleCategoryAndClose(cat._id)}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={cat._id}
                  checked={selectedCategory === cat._id}
                  className="form-radio h-5 w-5 cursor-pointer text-blue-600"
                />
                <label key={cat._id} className="cursor-pointer p-3">
                  {cat.name}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ModalFilter;
