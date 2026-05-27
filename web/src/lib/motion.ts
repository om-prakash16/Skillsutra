export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export const hoverScale = {
  scale: 1.01,
  y: -2,
  transition: springTransition,
};

export const tapScale = {
  scale: 0.98,
  transition: springTransition,
};

export const fadeUpVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springTransition
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};
