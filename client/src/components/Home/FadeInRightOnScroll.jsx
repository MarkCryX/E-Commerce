import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const FadeInRightOnScroll = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true }); // ให้ทำแค่รอบเดียวตอนเห็น

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white p-10 shadow-md"
    >
      <h2 className="text-2xl font-bold">Scroll มาถึงแล้วเฟด!</h2>
      <p className="text-gray-600">ข้อความนี้จะปรากฏขึ้นเมื่อเลื่อนมาถึง</p>
    </motion.div>
  );
};

export default FadeInRightOnScroll;
