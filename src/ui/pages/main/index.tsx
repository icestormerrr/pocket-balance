import {Scale} from "lucide-react";

const MainPage = () => {
  return (
    <div className={"flex flex-col justify-center items-center gap-5 h-[84vh]"}>
      <Scale size={128} strokeWidth={1.25} />
      <h1 className={"text-3xl font-semibold"}>Pocket balance</h1>
    </div>
  );
};

export default MainPage;
