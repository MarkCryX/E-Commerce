import { useEffect, useState } from "react";
import { createProduct, updateProductById } from "@/api/product";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "@/api/cloudinary";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import { fetchCategory } from "@/api/category";

const ProductForm = ({ mode, productData, onSuccess, closemodal }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({}); // เก็บ progress ของแต่ละไฟล์ เช่น { "file1.jpg": 50, "file2.png": 80 }
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: 1,
    description: "",
    sizes: [],
    colors: [],
    sizesString: "", // เพิ่ม field ใหม่
    colorsString: "", // เพิ่ม field ใหม่
    category: "",
    images: [],
  });

  const fetchCategories = async () => {
    try {
      const response = await fetchCategory();
      setCategories(response);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", error);
      setError(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageUploadLoading(true);
    setError(null);

    try {
      const uploadedImages = [];
      for (const file of files) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        let processedFile = file;
        try {
          const compressedFile = await imageCompression(file, options);
          processedFile = compressedFile;
        } catch (compressionError) {
          // เปลี่ยนชื่อ error เป็น compressionError เพื่อให้ชัดเจน
          console.error("Error during image compression:", compressionError);
          // processedFile ยังคงเป็น 'file' (ไฟล์ต้นฉบับ) อยู่แล้ว
          toast.warn(
            `ไม่สามารถบีบอัดรูปภาพ ${file.name} ได้ จะอัปโหลดไฟล์ต้นฉบับแทน`,
          );
        }

        // ส่งไฟล์ที่บีบอัดแล้ว (หรือต้นฉบับ) ไป Backend
        const result = await uploadImageToCloudinary(
          processedFile,
          (percent) => {
            // อัปเดต progress ของไฟล์นั้นๆ
            setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
          },
        );
        uploadedImages.push(result);
        setUploadProgress((prev) => {
          // ลบ progress ของไฟล์ที่เสร็จแล้วออกเมื่ออัปโหลดสมบูรณ์
          const newState = { ...prev };
          delete newState[file.name];
          return newState;
        });
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
      e.target.value = null; // เคลียร์ input field เพื่อให้สามารถเลือกไฟล์เดิมซ้ำได้
      toast.success("อัปโหลดรูปภาพสำเร็จ!");
    } catch (err) {
      console.error("Error uploading images:", err);
      const message = extractErrorMessage(err);
      setError("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: " + message);
      toast.error("อัปโหลดรูปภาพไม่สำเร็จ: " + message);
      // ในกรณีที่เกิด error ใหญ่ (เช่น เน็ตหลุดระหว่างอัปโหลดหลายรูป)
      // อาจจะต้องล้าง uploadProgress ทั้งหมดด้วย
      setUploadProgress({});
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleRemoveImage = async (imageToRemove) => {
    if (!window.confirm("คุณต้องการลบรูปภาพนี้ใช่หรือไม่?")) {
      return;
    }

    try {
      const response = await deleteImageFromCloudinary(imageToRemove.public_id);
      toast.success(response.message);

      setForm((prev) => ({
        ...prev,
        images: prev.images.filter(
          (img) => img.public_id !== imageToRemove.public_id,
        ),
      }));
    } catch (err) {
      console.error("Error removing image:", err);
      const message = extractErrorMessage(err);
      setError("เกิดข้อผิดพลาดในการลบรูปภาพ: " + message);
      toast.error("ลบรูปภาพไม่สำเร็จ: " + message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.price ||
      !form.quantity ||
      !form.category ||
      form.sizes.length === 0 ||
      form.colors.length === 0 ||
      !form.description.trim() ||
      form.images.length === 0
    ) {
      setError(
        "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและอัปโหลดรูปภาพอย่างน้อย 1 รูป",
      );
      toast.error(
        "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนและอัปโหลดรูปภาพอย่างน้อย 1 รูป",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      const productDataToSubmit = { ...form };

      if (mode === "create") {
        response = await createProduct(productDataToSubmit);
      } else if (mode === "edit" && productData) {
        response = await updateProductById(
          productData._id,
          productDataToSubmit,
        );
      } else {
        throw new Error("Invalid mode for product form.");
      }

      toast.success(response || "ดำเนินการสำเร็จ!");
      if (onSuccess) onSuccess();
      if (closemodal) closemodal();

      navigate("/admin/manage-product");
    } catch (err) {
      console.error("Error submitting product form:", err);
      const message = extractErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && productData) {
      setForm({
        name: productData.name || "",
        price: productData.price || "",
        quantity: productData.quantity || 1,
        description: productData.description || "",
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        sizesString: productData.sizes ? productData.sizes.join(", ") : "", // ตั้งค่าเริ่มต้น
        colorsString: productData.colors ? productData.colors.join(", ") : "", // ตั้งค่าเริ่มต้น
        category: productData.category._id || "",
        images: productData.images || [],
      });
    } else if (mode === "create") {
      setForm({
        name: "",
        price: "",
        quantity: 1,
        description: "",
        sizes: [],
        colors: [],
        category: "",
        images: [],
      });
      setError(null);
    }
  }, [mode, productData]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // นับจำนวนไฟล์ที่กำลังอัปโหลด
  const uploadingFileCount = Object.keys(uploadProgress).length;
  // นับจำนวนไฟล์ที่อัปโหลดเสร็จแล้ว
  const uploadedFileCount = form.images.length;

  return (
    <div className="mt-4">
      <form className="text-lg" onSubmit={handleSubmit}>
        {/* กล่องใหญ่ แบ่ง 2 col */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* col 1 */}
          <div className="">
            <div className="">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                ชื่อสินค้า
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-md border border-gray-200 p-2"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  ราคา
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  className="w-full rounded-md border border-gray-200 p-2"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  จำนวนสินค้า
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  className="w-full rounded-md border border-gray-200 p-2"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  หมวดหมู่
                </label>
                <select
                  name="category"
                  id="category"
                  required
                  className="w-full rounded-md border border-gray-200 p-2"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    เลือกหมวดหมู่
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="images"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  อัปโหลดรูปภาพ
                </label>
                <input
                  id="images"
                  type="file"
                  multiple
                  className="w-full cursor-pointer rounded border border-gray-300 px-3 py-2 text-sm shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleImageChange}
                  disabled={imageUploadLoading}
                />

                {/* แสดงสถานะการอัปโหลด */}
                {imageUploadLoading && (
                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="mb-2 text-sm font-medium text-blue-700">
                      กำลังอัปโหลดรูปภาพ {uploadingFileCount} ไฟล์...
                    </p>
                    {Object.entries(uploadProgress).map(
                      ([fileName, percent]) => (
                        <div key={fileName} className="mb-3">
                          <p className="mb-1 text-xs text-gray-700">
                            {fileName}: {percent}%
                          </p>
                          <div className="h-2 w-full rounded bg-gray-200">
                            <div
                              className="h-2 rounded bg-blue-500 transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="sizes"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  ไซส์ (คั่นด้วยเครื่องหมายจุลภาค เช่น 38,39,40)
                </label>
                <input
                  type="text"
                  id="sizes"
                  name="sizes"
                  className="w-full rounded-md border border-gray-200 p-2"
                  value={form.sizesString || ""}
                  onChange={(e) => {
                    const sizesString = e.target.value;
                    const sizesArray = sizesString
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s !== "");

                    setForm((prev) => ({
                      ...prev,
                      sizes: sizesArray,
                      sizesString: sizesString, // เก็บค่า string ไว้ด้วย
                    }));
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="colors"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  สี (คั่นด้วยเครื่องหมายจุลภาค เช่น ดำ,ขาว)
                </label>
                <input
                  type="text"
                  id="colors"
                  name="colors"
                  className="w-full rounded-md border border-gray-200 p-2"
                  value={form.colorsString || ""}
                  onChange={(e) => {
                    const colorsString = e.target.value;
                    const colorsArray = colorsString
                      .split(",")
                      .map((color) => color.trim())
                      .filter((color) => color !== "");

                    setForm((prev) => ({
                      ...prev,
                      colors: colorsArray,
                      colorsString: colorsString, // เก็บค่า string ไว้ด้วย
                    }));
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                รายละเอียดสินค้า
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="w-full rounded-md border border-gray-200 p-2"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* col 2  */}
          <div>
            <h2 className="text-center">
              รูปภาพที่อัปโหลด ({uploadedFileCount} รูป)
            </h2>
            <div className="grid max-h-[400px] grid-cols-2 gap-4 overflow-y-auto rounded-md border border-gray-200 p-2 sm:grid-cols-3 md:grid-cols-4">
              {form.images.length > 0 ? (
                form.images.map((img, index) => (
                  <div
                    key={img.public_id || index}
                    className="relative aspect-square w-full overflow-hidden rounded border border-gray-300 shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={`Product Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-xs text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      title="ลบรูปภาพ"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  ไม่มีรูปภาพที่อัปโหลด
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="col-span-2 rounded bg-green-500 p-2 text-center text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading || imageUploadLoading}
          >
            {loading
              ? mode === "create"
                ? "กำลังเพิ่ม..."
                : "กำลังบันทึก..."
              : mode === "create"
                ? "เพิ่มสินค้า"
                : "บันทึกการแก้ไข"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default ProductForm;
