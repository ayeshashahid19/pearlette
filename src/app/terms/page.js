import PolicyPage, { policySection } from "../components/PolicyPage";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Terms for using Pearlette.pk and purchasing handcrafted jewelry.",
};

export default function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions" updated="24-08-2026">
      {policySection("Orders", [
        "All orders are subject to confirmation. Prices are listed in Pakistani Rupees (PKR) and may change without notice; the price shown at checkout is the price you pay.",
      ])}
      {policySection("Payment", [
        "Standard orders are payable in full via Cash on Delivery at the time of delivery.",
        "Custom pieces require a 50% advance payment before crafting begins; the remaining 50% is payable via Cash on Delivery. The advance payment process will be confirmed with you directly by our team.",
      ])}
      {policySection("Custom Orders", [
        "Custom pieces typically take 3-5 days. Because each piece is handmade specifically for you, custom orders cannot be cancelled once crafting has started.",
      ])}
      {policySection("Handmade Nature", [
        "Every item is handcrafted, so slight variations make each piece unique and are not considered defects.",
      ])}
    </PolicyPage>
  );
}
