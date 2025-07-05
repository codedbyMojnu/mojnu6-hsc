import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function ApprovedTransactionList() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await api.get("/api/transactions", { headers: { Authorization: `Bearer ${user?.token}` } });
        if (res.status === 200) {
          const approved = res.data.filter((tx) => tx.approveStatus === "approved");
          setTransactions(approved);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    }
    fetchTransactions();
  }, [user]);

  return (
    <div className="p-8 bg-[--primary-bg] text-[--text-color]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-500 mb-6">Approved Transactions</h1>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-[--secondary-bg]">
              <tr>
                <th className="p-4 font-bold">Username</th>
                <th className="p-4 font-bold">Transaction ID</th>
                <th className="p-4 font-bold">Package</th>
                <th className="p-4 font-bold">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-500">No approved transactions.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">{tx.username}</td>
                    <td className="p-4">{tx.transactionId}</td>
                    <td className="p-4">{tx.selectedPackage}</td>
                    <td className="p-4">{new Date(tx.updatedAt || tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
