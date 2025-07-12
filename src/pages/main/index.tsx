import {Scale} from "lucide-react";

export default function MainPage() {
  return (
    <div className={"flex flex-col justify-center items-center gap-5 h-[90vh]"}>
      <Scale size={128} strokeWidth={1.25} />
      <h1 className={"text-3xl font-semibold"}>Pocket balance</h1>
    </div>
  );
}
