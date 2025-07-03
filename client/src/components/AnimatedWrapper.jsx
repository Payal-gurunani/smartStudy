import { motion } from "framer-motion";

const animationVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }, 
};

export default function AnimatedWrapper({ children }) {
  return (
    <motion.div
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
