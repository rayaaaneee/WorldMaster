import ItalyCustomMap from "@/asset/img/pages/home/custom-italy-map.svg";
import Button from "@/components/inputs/button";
import AppLogo from "@/components/svg/app-logo";
import Link from "next/link";
import { PiSignInLight } from "react-icons/pi";

const Home = () => {

  
  return (
    <div className="m-auto relative flex flex-col gap-7 justify-center items-center">
      <div className="absolute z-1 top-0 w-full h-full right-0 p-5">
        <AppLogo className="-z-1 w-44 absolute -top-24 -left-24 -rotate-12" />
        <ItalyCustomMap className="absolute -z-0 w-48 h-48 -right-14 -bottom-16 rotate-[60deg]" />
      </div>
      <div className="pointer-events-none relative z-0 flex flex-col w-full h-full gap-7 items-center justify-center ">
        <h1 className=" text-9xl font-bold text-[#847878]">WorldMaster</h1>
        <h2 className="text-5xl italic text-neutral-700">Train, learn and master the world</h2>
      </div>
        <Link href={'/signin'}>
          <Button className="mt-5">
            <p>Sign in</p>
            <PiSignInLight className="text-xl" />
          </Button>
        </Link>
    </div>
  );
}

export default Home;
