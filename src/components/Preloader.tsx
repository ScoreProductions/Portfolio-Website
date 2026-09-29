"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader({ name }: { name: string }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("loaded") === "1";
    let n = 0;
    const id = setInterval(() => {
      n = seen ? 100 : Math.min(100, n + Math.ceil(Math.random() * 9));
      setCount(n);
      if (n === 100) {
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem("loaded", "1");
          setDone(true);
        }, seen ? 0 : 350);
      }
    }, seen ? 0 : 45);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col justify-between bg-accent p-5 text-white md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="text-sm font-medium uppercase tracking-[0.3em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {name}
          </motion.span>
          <span className="self-end text-[28vw] font-semibold leading-[0.8] tracking-tighter tabular-nums md:text-[18vw]">
            {count}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
