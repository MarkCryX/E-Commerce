import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const LandingBanner = () => {
  const TypewriterText = ({ text, speed = 20, className = "" }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
        if (index >= text.length) clearInterval(interval);
      }, speed);

      return () => clearInterval(interval);
    }, [text, speed]);

    return <p className={className}>{displayedText}</p>;
  };

  return (
    <div className="flex min-h-screen items-center bg-gray-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col">
          <motion.h1
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <h1 className="mt-10 text-[70px] font-semibold sm:text-[80px] md:text-[85px] lg:text-[75px] xl:text-[95px]">
              Find your <br /> dream snekers
            </h1>
          </motion.h1>
          <TypewriterText
            text="F ind your shoes from our various collections. Here shoes are endless, and profit is also endless."
            className="text-md my-10 max-w-md text-gray-600 sm:text-lg"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
              delay: 2.3,
            }}
          >
            <Link
              to="/product"
              className="mt-10 h-auto w-35 rounded-2xl bg-gray-700 p-2 text-center text-white hover:bg-gray-900"
            >
              Explore more
            </Link>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center">
          {/* พื้นหลัง motion วงกลมเรืองแสง */}
          <motion.div
            className="absolute h-[300px] w-[300px] rounded-full bg-gradient-to-br from-purple-400 to-blue-500 opacity-50 blur-3xl sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] lg:h-[450px] lg:w-[450px] xl:h-[500px] xl:w-[500px]"
            initial={{ scale: 0 }}
            animate={{ scale: [0.9, 1.05, 0.9] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.img
            src="https://res.cloudinary.com/dim59skus/image/upload/v1752657974/Pngtree_men_s_jogging_shoes_highly_20014121_gro6ds.png"
            alt="รองเท้าเด้ง"
            className="mx-auto w-[400px] sm:w-[500px] md:w-[700px] lg:w-[900px]"
            initial={{ opacity: 0, x: 100 }} // เริ่มจากด้านขวา
            animate={{
              opacity: 1,
              x: 0, // เคลื่อนเข้าไปตำแหน่งตรงกลาง
              y: [0, -30, 0], // เด้งขึ้นลง
            }}
            transition={{
              x: { duration: 1.2, ease: "easeOut" }, // เคลื่อนจากขวาเข้า
              opacity: { duration: 1.2 },
              y: {
                delay: 1.2, // เด้งหลังจากเข้าที่แล้ว
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default LandingBanner;
