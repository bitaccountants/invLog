import { StatsRow } from "./StatsRow";
import { TransactionButtons } from "./TransactionButtons";
import { TransactionTable } from "./TransactionTable";

export default function Dashboard() {
  return (
    <div className="container py-12">
      <StatsRow />
      <TransactionButtons />
      <TransactionTable />
    </div>
  );
}
