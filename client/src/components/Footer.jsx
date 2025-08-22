import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="pt-20">
      <div className="container mx-auto gap-10 px-4 lg:grid lg:grid-cols-[2fr_3fr]">
        {/* Brand Info */}
        <div className="space-y-7 pb-10 text-start text-xl lg:pb-0">
          <h2 className="text-5xl font-bold">Shopper.</h2>
          <p className="font-light">ซื้อของออนไลน์ง่าย ปลอดภัย และรวดเร็ว</p>
          <div className="space-y-1 font-light">
            <p>
              Email:{" "}
              <a
                href="mailto:helloshopper@gmail.com"
                className="hover:underline"
              >
                helloshopper@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:0849658297" className="hover:underline">
                084-965-8297
              </a>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-gray-600">
            <a href="#" className="hover:text-red-500">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-600">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold">Home</h3>
            <ul className="mt-4 space-y-2 font-light text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  New & Featured
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Men
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Women
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Company</h3>
            <ul className="mt-4 space-y-2 font-light text-gray-600">
              <li>
                <a href="/about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Reviews
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQ's
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Support</h3>
            <ul className="mt-4 space-y-2 font-light text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Newsletter</h3>
            <p className="mt-2 font-light text-gray-600">
              รับข่าวสารและโปรโมชั่นก่อนใคร
            </p>
            <form className="mt-4 flex flex-col gap-2">
              <input
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                className="flex-1 rounded-md border border-gray-300 bg-gray-100 p-2 text-gray-800 placeholder-gray-500"
              />
              <button className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-500">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <p className="container mx-auto mt-10 border-t border-gray-300 py-5 text-center text-sm text-gray-500">
        &#169;{" "}
        {`Copyright ${new Date().getFullYear()} Shopper. All rights reserved.`}
      </p>
    </footer>
  );
}

export default Footer;
