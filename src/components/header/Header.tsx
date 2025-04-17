"use client";

import useBasketStore from "@/store/BasketStore";
import {
  ClerkLoaded,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { KeyRoundIcon } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { Button } from "../ui/button";

const Header = () => {
  const { user } = useUser();
  const itemsCount = useBasketStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  const createPassKey = async () => {
    try {
      await user?.createPasskey();
    } catch (error) {
      console.error("Error creating passkey:", JSON.stringify(error, null, 2));
    }
  };
  return (
    <header className="px-4 py-2 overflow-x-hidden">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0 transition-colors duration-300 ease-in-out"
        >
          Shopr
        </Link>

        <Form
          action="/search"
          className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="
          bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-4xl"
          />
        </Form>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 sm:flex-none">
          <Button asChild className="bg-blue-500 hover:bg-blue-700 font-bold">
            <Link href="/basket" className="relative">
              <TrolleyIcon className="!w-6 !h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-white w-5 h-5 flex items-center justify-center text-xs">
                {itemsCount}
              </span>
              <span>My Basket</span>
            </Link>
          </Button>

          {/* User area */}
          <ClerkLoaded>
            <SignedIn>
              <Button
                asChild
                className="bg-blue-500 hover:bg-blue-700 font-bold"
              >
                <Link href="/orders">
                  <PackageIcon className="!w-6 !h-6" />
                </Link>
                <span>My Orders</span>
              </Button>
              <div className="flex items-center space-x-2">
                <UserButton />

                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold">{user?.fullName}!</p>
                </div>
              </div>
              {user?.passkeys.length === 0 && (
                <Button
                  onClick={createPassKey}
                  variant="outline"
                  className="text-blue-500 animate-pulse hover:text-blue-700 font-bold"
                >
                  <span className="sm:block hidden">Create Pass Key</span>
                  <span className="sm:hidden block">
                    <KeyRoundIcon className="!w-4 !h-4" />
                  </span>
                </Button>
              )}
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};
export default Header;
