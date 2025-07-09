import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useState} from "react";
import {useRouterState} from "@tanstack/react-router";

export function AnimationProvider({children}: {children: React.ReactNode}) {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={key} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.2}}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
