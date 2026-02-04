import { useState } from "react";
import ExpenseItem from "./ExpenseItem";
import ExpenseDetails from "./ExpenseDetails";

export default function ExpenseList({ expenses, onDelete }) {
  const [selectedExpense, setSelectedExpense] = useState(null);

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-30">
        <p className="text-[10px] font-black uppercase tracking-widest text-secondary-400">Sin movimientos registrados</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {expenses.map((e) => (
          <ExpenseItem
            key={e.id}
            expense={e}
            onDelete={onDelete}
            onSelect={setSelectedExpense}
          />
        ))}
      </div>

      <ExpenseDetails
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />
    </>
  );
}