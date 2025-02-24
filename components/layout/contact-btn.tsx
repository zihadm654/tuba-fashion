import Link from "next/link";
import { Mail } from "lucide-react";

import { Icons } from "../shared/icons";

const ContactBtn = () => {
  return (
    <div className="bg-primary justify-right fixed right-3 bottom-3 z-50 m-2 flex cursor-pointer items-center rounded-full p-2 text-black shadow-lg">
      <Link
        href={"https://wa.me/88001576926487?text=Hey+there,+I+have+a+question!"}
        target="_blank"
        rel="noreferrer"
      >
        <Mail className="size-10" />
      </Link>
    </div>
  );
};

export default ContactBtn;
