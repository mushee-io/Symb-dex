import { AllowanceManager } from "@/components/allowance-manager";

export const metadata = { title: "Token Approvals" };

export default function ApprovalsPage() {
  return <main className="shell subpage">
    <div className="page-heading">
      <span className="eyebrow">TOKEN PERMISSIONS</span><h1>Approvals</h1>
      <p>Inspect and manage exact-value ERC-20 allowances to Symb’s reviewed router once deployed. Approval functionality is unavailable during development.</p>
    </div>
    <AllowanceManager />
  </main>;
}
