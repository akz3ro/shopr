"use client";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import BasketButton from "@/components/basket/BasketButton";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { imageUrlFor } from "@/lib/imageUrlFor";
import useBasketStore from "@/store/BasketStore";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const variants = {
  hidden: { opacity: 0.2 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const BasketPage = () => {
  const { getGroupedItems, getTotalPrice } = useBasketStore();
  const items = getGroupedItems();

  const [isClient, setIsClient] = useState(false);

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCheckout = () => {
    if (!isSignedIn) return;

    startTransition(async () => {
      try {
        const metadata: Metadata = {
          orderNumber: crypto.randomUUID(),
          customerName: user?.fullName ?? "Anonymous",
          customerEmail: user?.emailAddresses[0]?.emailAddress ?? "Anonymous",
          clerkUserId: user!.id,
        };

        const checkoutUrl = await createCheckoutSession(items, metadata);

        if (checkoutUrl) router.push(checkoutUrl);
      } catch (error) {
        console.error("Error during checkout:", error);
      }
    });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Your Basket</h1>
        <p className="text-gray-600 text-lg">Your basket is empty.</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Basket</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {items.map((item) => (
            <AnimatePresence key={item.product._id}>
              <motion.div
                variants={variants}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-4 p-4 border rounded flex items-center justify-between shadow-sm"
              >
                <Link
                  href={`/product/${item.product.slug?.current}`}
                  className="flex items-center  flex-1 min-w-0"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                    {item.product.image && (
                      <Image
                        src={imageUrlFor(item.product.image).url()}
                        alt={item.product.title || "Product Image"}
                        width={96}
                        height={96}
                        className="object-cover rounded w-full h-full"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={imageUrlFor(item.product.image)
                          .width(10)
                          .height(10)
                          .url()}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold truncate">
                      {item.product.title}
                    </h2>
                    <p className="text-sm sm:text-base">
                      Price: $
                      {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </Link>

                <div>
                  <BasketButton product={item.product} />
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto shadow-sm">
          <h3 className="text-xl font-semibold">Order Summary</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items:</span>
              <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </p>
          </div>
          {isSignedIn ? (
            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-300"
            >
              {isPending ? (
                <>
                  <Loader2Icon className="animate-spin mr-2" />
                  <span className="animate-pulse">Processing...</span>
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600">
                Sign In to Checkout
              </Button>
            </SignInButton>
          )}
        </div>
        {/* Spacer for fixed checkout on mobile */}
        <div className="h-64 lg:h-0" />
      </div>
    </main>
  );
};
export default BasketPage;
