import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const SidebarFilter = ({categories,show,setShow,handleCategoryChange,selectedCategory}) => {


  const handleShow = () => {
    setShow(!show);
  };

  return (
    <div className="hidden pl-5 lg:block">
      <div className="sticky top-5">
        <div
          className="flex cursor-pointer justify-between"
          onClick={handleShow}
        >
          <h2 className="mb-4 text-xl font-bold">หมวดหมู่</h2>
          {show ? (
            <IoIosArrowUp className="text-xl" />
          ) : (
            <IoIosArrowDown className="text-xl" />
          )}
        </div>
        <div className={`flex flex-col ${show ? "" : "hidden"}`}>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryChange(cat._id)}
              className={`w-auto flex-none cursor-pointer rounded-md p-2 text-left transition-colors duration-200 lg:w-full ${
                selectedCategory === cat._id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <h2 className="mb-4 hidden text-xl font-bold lg:block">
          เลือกซื้อตามราคา
        </h2>
      </div>
    </div>
  );
};
export default SidebarFilter;
