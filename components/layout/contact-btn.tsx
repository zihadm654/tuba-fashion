import Link from "next/link";
import { Mail } from "lucide-react";

import { Icons } from "../shared/icons";
import MaxWidthWrapper from "../shared/max-width-wrapper";

const ContactBtn = () => {
  return (
    <MaxWidthWrapper className="relative">
      <div className="bg-primary dark:bg-accent justify-right fixed right-5 bottom-3 z-50 m-2 flex cursor-pointer items-center rounded-full p-2">
        <Link
          href={
            "https://wa.me/88001776708038?text=Hey+there,+I+have+a+question!"
          }
          target="_blank"
          rel="noreferrer"
        >
          <Mail className="size-10 text-white shadow-lg dark:text-black" />
        </Link>
      </div>
    </MaxWidthWrapper>
  );
};

export default ContactBtn;
