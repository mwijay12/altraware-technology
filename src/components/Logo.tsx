/* Brand logo — the purple cloud-infinity mark.
   Served locally from /public for 100% offline reliability;
   swap to a Cloudinary URL later by changing this one src. */

export default function Logo({ className = "w-10 h-10 rounded-xl" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="Altraware Technology logo" className={`${className} object-contain`} />
  );
}