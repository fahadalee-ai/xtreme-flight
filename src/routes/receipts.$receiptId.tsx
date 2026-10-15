import { createFileRoute } from "@tanstack/react-router";
import { ReceiptScreen } from "../screens/ReceiptScreen";

export const Route = createFileRoute("/receipts/$receiptId")({
  component: ReceiptScreen,
});
