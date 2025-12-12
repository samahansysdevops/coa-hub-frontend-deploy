"use client";
import Link from "next/link";
import { LuFacebook, LuTwitter } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-[#373C44] to-[#49515A] text-white py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-8">
        {/* Mobile: Logo on top, then title, nav, social. Desktop: Logo right, rest left. */}
        <div className="w-full md:w-auto flex flex-col md:flex-col items-start pl-0 md:pl-2 order-2 md:order-1">
          {/* mobile logo */}
          <div className="block md:hidden mb-4 w-full flex justify-center">
            <img
              src="/assets/images/footer-logo.png"
              alt="COA Footer Logo"
              className="w-32 h-auto"
            />
          </div>
          <div className="w-full md:w-auto">
            <span
              className="text-2xl tracking-wide text-[#E7EAEF] text-left"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              COMMISSION ON AUDIT
            </span>
            <div className="my-2">
              <hr className="border-[#6C7178] w-full md:w-[200px]" />
            </div>
          </div>
          <ul className="mb-2 mt-4 border-gray-400 flex flex-col items-start">
            <li>
              <Link
                href="/"
                className="font-montserrat text-lg hover:underline hover:underline-offset-4 transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/announcements"
                className="font-montserrat text-lg hover:underline hover:underline-offset-4 transition-all"
              >
                Announcements
              </Link>
            </li>
            <li>
              <Link
                href="/submission-bin"
                className="font-montserrat text-lg hover:underline hover:underline-offset-4 transition-all"
              >
                Submission Bins
              </Link>
            </li>
            <li>
              <Link
                href="/members"
                className="font-montserrat text-lg hover:underline hover:underline-offset-4 transition-all"
              >
                Members
              </Link>
            </li>
          </ul>
          <div className="flex gap-4 mt-8 justify-start w-full">
            <a
              href="https://www.facebook.com/addu.coa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:opacity-80 transition-opacity"
            >
              <LuFacebook className="w-7 h-7" />
            </a>
            <a
              href="https://x.com/addu_coa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:opacity-80 transition-opacity"
            >
              <LuTwitter className="w-7 h-7" />
            </a>
          </div>
        </div>
        {/* desktop logo on right */}
        <div className="hidden md:flex mt-8 md:mt-0 justify-center items-center w-full md:w-auto order-1 md:order-2">
          <img
            src="/assets/images/footer-logo.png"
            alt="COA Footer Logo"
            className="w-64 h-auto"
          />
        </div>
      </div>
    </footer>
  );
}
