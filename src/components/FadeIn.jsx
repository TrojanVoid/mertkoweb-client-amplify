import { motion } from 'framer-motion';

const fadeInVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
    },
  }),
};

const FadeIn = ({ children, className, delay = 0 }) => (
  <motion.div
    className={className}
    variants={fadeInVariant}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={delay / 1000}
  >
    {children}
  </motion.div>
);

export default FadeIn;
