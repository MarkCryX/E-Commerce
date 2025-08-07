function Footer() {
  return (
    <footer className="container mx-auto pt-20">
      <div className="lg:grid lg:grid-cols-[2fr_2fr]">
        <div className="space-y-7 pb-10 text-start text-xl lg:pb-0">
          <h2 className="text-5xl">Shopper.</h2>
          <div className="space-y-2 font-light">
            <p>Helloshopper@gmail.com</p>
            <p>084-965-8297</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <div>
            <h3 className="text-xl">Home</h3>
            <div className="mt-4 space-y-3 font-light text-gray-500">
              <p>New & Featured</p>
              <p>Men</p>
              <p>Women</p>
              <p>Sale</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl">Company</h3>
            <div className="mt-4 space-y-3 font-light text-gray-500">
              <p>About Us</p>
              <p>Community</p>
              <p>Reviews</p>
              <p>FAQ's</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl">Social</h3>
            <div className="mt-4 space-y-3 font-light text-gray-500">
              <p>Instagram</p>
              <p>Facebook</p>
              <p>X</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl">Support</h3>
            <div className="mt-4 space-y-3 font-light text-gray-500">
              <p>Privacy Policy</p>
              <p>Term & Condition</p>
              <p>Help Center</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 border-t-1 py-5 text-center">
        &#169; {`${new Date().getFullYear()} All rights reserved`}
      </p>
    </footer>
  );
}
export default Footer;
