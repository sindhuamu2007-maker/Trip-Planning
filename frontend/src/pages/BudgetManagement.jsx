import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  AlertOctagon, 
  Plus, 
  Trash2, 
  PieChart as PieIcon, 
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import toast from 'react-hot-toast';

export default function BudgetManagement({
  destination = 'Goa',
  activeTrip,
  currentUser,
  onSelectTrip,
  onStartPlanning
}) {
  const [totalBudget, setTotalBudget] = useState(activeTrip?.budget?.total || 0);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [tripMembers, setTripMembers] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expenseError, setExpenseError] = useState('');
  const [savedTrips, setSavedTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [tripListError, setTripListError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [paidBy, setPaidBy] = useState(currentUser?.name || 'You');
  const [splitAmong, setSplitAmong] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoadingTrips(true);
    setTripListError('');
    axios.get('/api/v1/trips')
      .then((response) => {
        if (cancelled) return;
        if (!response.data?.success || !Array.isArray(response.data.trips)) {
          throw new Error(response.data?.message || 'Could not load your saved trips.');
        }
        setSavedTrips(response.data.trips);
        if (!activeTrip?._id && response.data.trips.length) {
          onSelectTrip?.(response.data.trips[0]);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setTripListError(error.response?.data?.message || error.message || 'Could not load your saved trips.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingTrips(false);
      });

    return () => { cancelled = true; };
  }, [activeTrip?._id, onSelectTrip]);

  useEffect(() => {
    let cancelled = false;
    if (!activeTrip?._id) {
      setExpenses([]);
      setTripMembers([]);
      setTotalBudget(0);
      setExpenseError('');
      setLoadingExpenses(false);
      return () => { cancelled = true; };
    }

    setExpenses([]);
    setTripMembers([]);
    setTotalBudget(Number(activeTrip.budget?.total) || 0);
    setLoadingExpenses(true);
    setExpenseError('');
    axios.get(`/api/v1/trips/${encodeURIComponent(activeTrip._id)}`)
      .then((response) => {
        if (cancelled) return;
        const trip = response.data?.trip;
        if (!response.data?.success || !trip) {
          throw new Error(response.data?.message || 'Could not load the selected trip.');
        }
        setTotalBudget(Number(trip.budget?.total) || 0);
        const memberNames = [
          trip.owner?.name,
          ...(trip.members || []).map((member) => member.user?.name || member.user?.email)
        ].filter(Boolean);
        setTripMembers([...new Set(memberNames)]);
        setExpenses((response.data.expenses || []).map((expense) => ({
          ...expense,
          id: expense._id,
          amount: Number(expense.amount) || 0
        })));
      })
      .catch((error) => {
        if (cancelled) return;
        setExpenseError(error.response?.data?.message || error.message || 'Could not load expenses for this trip.');
      })
      .finally(() => {
        if (!cancelled) setLoadingExpenses(false);
      });

    return () => { cancelled = true; };
  }, [activeTrip?._id]);

  const participants = useMemo(() => {
    const names = [
      activeTrip?.owner?.name,
      ...(activeTrip?.members || []).map((member) => member.user?.name || member.user?.email),
      ...tripMembers
    ].filter(Boolean);
    return [...new Set(names)];
  }, [activeTrip, tripMembers]);

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const predictedTotal = totalSpent;
  const isOverBudget = predictedTotal > totalBudget;
  const overrunDiff = predictedTotal - totalBudget;
  const travelerCount = Math.max(Number(activeTrip?.travelersCount) || participants.length, 1);
  const perTravelerCost = Math.round(totalSpent / travelerCount);
  const perMemberBudget = totalBudget / travelerCount;
  const expenseShares = useMemo(() => expenses.map((expense) => {
    const selectedPeople = Array.isArray(expense.splitAmong) && expense.splitAmong.length
      ? expense.splitAmong.filter((name) => participants.includes(name))
      : participants;
    const people = selectedPeople.length ? selectedPeople : participants;
    const totalCents = Math.round(expense.amount * 100);
    const baseCents = Math.floor(totalCents / people.length);
    let remainingCents = totalCents - baseCents * people.length;
    const shares = people.map((name) => {
      const shareCents = baseCents + (remainingCents > 0 ? 1 : 0);
      if (remainingCents > 0) remainingCents -= 1;
      return { name, amount: shareCents / 100 };
    });
    return { expense, people, shares };
  }), [expenses, participants]);
  const memberSpending = useMemo(() => {
    const spending = new Map(participants.map((name) => [name, 0]));
    expenseShares.forEach(({ shares }) => {
      shares.forEach(({ name, amount: share }) => {
        spending.set(name, (spending.get(name) || 0) + share);
      });
    });
    const displayedMembers = [...participants];
    while (displayedMembers.length < travelerCount) {
      displayedMembers.push(`Traveler ${displayedMembers.length + 1}`);
    }
    return displayedMembers.map((name) => ({
      name,
      budget: perMemberBudget,
      spent: spending.get(name) || 0,
      remaining: perMemberBudget - (spending.get(name) || 0)
    }));
  }, [expenseShares, participants, perMemberBudget]);
  const categoryDefinitions = [
    { name: 'Stay', category: 'Accommodation', budgetKey: 'accommodation', color: '#14213D' },
    { name: 'Transit', category: 'Transportation', budgetKey: 'transportation', color: '#16A6A1' },
    { name: 'Dining', category: 'Food & Dining', budgetKey: 'food', color: '#FF8066' },
    { name: 'Activities', category: 'Activities', budgetKey: 'activities', color: '#F4A261' },
    { name: 'Shopping', category: 'Shopping', budgetKey: null, color: '#8B5CF6' },
    { name: 'Emergency', category: 'Emergency', budgetKey: 'emergencyReserve', color: '#EF4444' },
    { name: 'Other', category: 'Other', budgetKey: null, color: '#64748B' }
  ];
  const categoryData = categoryDefinitions.map((definition) => {
    const spent = expenses
      .filter((expense) => expense.category === definition.category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return {
      ...definition,
      spent,
      budgeted: definition.budgetKey ? Number(activeTrip?.budget?.[definition.budgetKey]) || 0 : 0
    };
  }).filter((categoryItem) => categoryItem.spent > 0 || categoryItem.budgeted > 0);
  const settlements = useMemo(() => {
    if (!expenses.length || !participants.length) return [];
    const balancesInCents = new Map(participants.map((name) => [name, 0]));
    expenseShares.forEach(({ expense, shares }) => {
      const payer = expense.paidBy === 'You' ? currentUser?.name : expense.paidBy;
      if (balancesInCents.has(payer)) {
        balancesInCents.set(payer, balancesInCents.get(payer) + Math.round(expense.amount * 100));
      }
      shares.forEach(({ name, amount: share }) => {
        balancesInCents.set(name, balancesInCents.get(name) - Math.round(share * 100));
      });
    });
    const creditors = [...balancesInCents.entries()]
      .filter(([, balance]) => balance > 0)
      .map(([name, balance]) => ({ name, balance }));
    const debtors = [...balancesInCents.entries()]
      .filter(([, balance]) => balance < 0)
      .map(([name, balance]) => ({ name, balance: -balance }));
    const transfers = [];
    let creditorIndex = 0;
    let debtorIndex = 0;
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const amount = Math.min(creditors[creditorIndex].balance, debtors[debtorIndex].balance);
      transfers.push({
        from: debtors[debtorIndex].name,
        to: creditors[creditorIndex].name,
        amount: amount / 100
      });
      creditors[creditorIndex].balance -= amount;
      debtors[debtorIndex].balance -= amount;
      if (creditors[creditorIndex].balance === 0) creditorIndex += 1;
      if (debtors[debtorIndex].balance === 0) debtorIndex += 1;
    }
    return transfers;
  }, [expenses, participants, expenseShares, currentUser?.name]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!activeTrip?._id) {
      toast.error('Select a trip before recording an expense.');
      return;
    }
    if (!title.trim() || !amount || Number(amount) <= 0) {
      toast.error('Enter an expense title and a valid amount.');
      return;
    }

    const numAmount = Number(amount);
    try {
      const response = await axios.post(`/api/v1/trips/${encodeURIComponent(activeTrip._id)}/expenses`, {
        title: title.trim(),
        amount: numAmount,
        category,
        paidBy,
        splitAmong: splitAmong.length ? splitAmong : participants
      });
      if (!response.data?.success || !response.data?.expense) {
        throw new Error(response.data?.message || 'Could not save this expense.');
      }
      const savedExpense = { ...response.data.expense, id: response.data.expense._id };
      setExpenses((currentExpenses) => [savedExpense, ...currentExpenses]);
      setShowAddExpense(false);
      setTitle('');
      setAmount('');
      setSplitAmong(participants);
      toast.success('Expense saved to this trip.');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not save this expense.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await axios.delete(`/api/v1/trips/${encodeURIComponent(activeTrip._id)}/expenses/${encodeURIComponent(id)}`);
      if (!response.data?.success) throw new Error(response.data?.message || 'Could not remove this expense.');
      setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id));
      toast.success('Expense removed from this trip.');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Could not remove this expense.');
    }
  };

  if (!activeTrip?._id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <DollarSign className="mx-auto h-10 w-10 text-teal-600" />
          <h1 className="mt-4 text-2xl font-extrabold text-[#14213D]">Your trip budget & group expenses</h1>
          {loadingTrips ? (
            <p className="mt-2 text-sm text-slate-500">Loading your saved trips…</p>
          ) : savedTrips.length ? (
            <>
              <p className="mt-2 text-sm text-slate-500">Choose a saved trip to view per-person budget shares, expenses, and settlements.</p>
              <div className="mt-6 grid gap-3 text-left">
                {savedTrips.map((trip) => (
                  <button
                    key={trip._id}
                    onClick={() => onSelectTrip?.(trip)}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-400 hover:bg-teal-50"
                  >
                    <span>
                      <span className="block font-bold text-[#14213D]">{trip.title || trip.destination}</span>
                      <span className="mt-1 block text-xs text-slate-500">{trip.destination} · {trip.travelersCount || trip.members?.length || 1} travelers</span>
                    </span>
                    <span className="shrink-0 text-sm font-extrabold text-teal-700">₹{(Number(trip.budget?.total) || 0).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-slate-500">
                {tripListError || 'Create or join a saved trip first. Its total budget will be divided across the group here.'}
              </p>
              {onStartPlanning && (
                <button
                  onClick={onStartPlanning}
                  className="mt-5 rounded-xl bg-[#16A6A1] px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
                >
                  Create a trip with AI
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Trip spending summary • {activeTrip.destination || destination}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] mt-1">
            {activeTrip.title || `${activeTrip.destination || destination} Budget & Expense Center`}
          </h1>
          <p className="text-xs text-slate-500">
            Track the full trip budget, split expenses across selected members, and see who owes whom.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          {savedTrips.length > 1 && (
            <label className="text-xs font-semibold text-slate-500">
              Selected trip
              <select
                value={activeTrip._id}
                onChange={(event) => {
                  const trip = savedTrips.find((savedTrip) => savedTrip._id === event.target.value);
                  if (trip) onSelectTrip?.(trip);
                }}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              >
                {savedTrips.map((trip) => (
                  <option key={trip._id} value={trip._id}>{trip.title || trip.destination}</option>
                ))}
              </select>
            </label>
          )}
          <button
            onClick={() => {
              setPaidBy(participants.includes(currentUser?.name) ? currentUser.name : participants[0] || '');
              setSplitAmong(participants);
              setShowAddExpense(true);
            }}
            disabled={loadingExpenses}
            className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#16A6A1] to-[#FF8066] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Budget vs Current vs Predicted */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Trip Budget</p>
          <p className="text-2xl font-extrabold text-[#14213D]">₹{totalBudget.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Budget set for this trip</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Actual Spent So Far</p>
          <p className="text-2xl font-extrabold text-teal-600">₹{totalSpent.toLocaleString()}</p>
          <span className="text-[11px] text-teal-600 font-medium">{totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}% of target</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Recorded Spending</p>
          <p className={`text-2xl font-extrabold ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
            ₹{predictedTotal.toLocaleString()}
          </p>
          <span className={`text-[11px] font-bold ${isOverBudget ? 'text-rose-500' : 'text-emerald-500'}`}>
            {isOverBudget ? `₹${overrunDiff.toLocaleString()} over trip budget` : `₹${Math.max(totalBudget - predictedTotal, 0).toLocaleString()} remaining`}
          </span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Average Per Traveler</p>
          <p className="text-2xl font-extrabold text-[#14213D]">₹{perTravelerCost.toLocaleString()}</p>
          <span className="text-[11px] text-blue-600 font-medium">Split across {travelerCount} trip {travelerCount === 1 ? 'member' : 'members'}</span>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-[#14213D]">
              <Users className="h-5 w-5 text-teal-600" />
              Group Budget Split
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Trip budget of ₹{totalBudget.toLocaleString()} divided equally across {travelerCount} trip {travelerCount === 1 ? 'member' : 'members'}.
            </p>
          </div>
          <span className="text-sm font-extrabold text-teal-700">
            ₹{perMemberBudget.toLocaleString(undefined, { maximumFractionDigits: 2 })} budget per person
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {memberSpending.map((member) => (
            <div key={member.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-bold text-slate-800">{member.name}</span>
                <span className={`shrink-0 text-xs font-bold ${member.remaining < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {member.remaining < 0 ? 'Over share' : 'Remaining'} · ₹{Math.abs(member.remaining).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="mt-3 flex justify-between text-xs text-slate-600">
                <span>Budget share</span>
                <span>₹{member.budget.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-slate-600">
                <span>Shared expenses</span>
                <span>₹{member.spent.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full ${member.spent > member.budget ? 'bg-rose-500' : 'bg-teal-500'}`}
                  style={{ width: `${member.budget > 0 ? Math.min((member.spent / member.budget) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {expenseError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {expenseError}
        </div>
      )}

      {/* Recorded expense flags */}
      {expenses.some((expense) => expense.isAnomaly) && (
        <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 text-rose-900 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-start space-x-3">
              <AlertOctagon className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-rose-200 text-rose-800 px-2.5 py-0.5 rounded-full">
                    Expense flagged for review
                  </span>
                </div>
                {expenses.filter((expense) => expense.isAnomaly).map((expense) => (
                  <p key={expense.id} className="text-xs text-slate-700">
                    <strong>{expense.title}</strong> — ₹{expense.amount.toLocaleString()}. {expense.anomalyReason || 'Please review this saved transaction.'}
                  </p>
                ))}
              </div>
          </div>
        </div>
      )}

      {/* Category Chart & Group Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Budget Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#14213D] flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-teal-600" />
            <span>Category Spending vs Budget Allocation</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip 
                  formatter={(val, name) => [`₹${val.toLocaleString()}`, name === 'spent' ? 'Spent' : 'Budgeted']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1' }}
                />
                <Bar dataKey="budgeted" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="spent" fill="#16A6A1" radius={[4, 4, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Group Settlements Suggestions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-[#14213D] flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Automated Settlement Suggestions</span>
          </h3>

          <div className="space-y-3">
            {settlements.length ? settlements.map((settlement, index) => (
              <div key={`${settlement.from}-${settlement.to}-${index}`} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-slate-800">
                  {settlement.from} owes {settlement.to}
                </p>
                <span className="shrink-0 text-sm font-extrabold text-teal-700">₹{settlement.amount.toLocaleString()}</span>
              </div>
            )) : (
              <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                {expenses.length
                  ? 'Expenses are currently balanced between trip members.'
                  : 'Add trip expenses to calculate settlement suggestions.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-2">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-[#14213D]">Logged Expense Transactions</h3>
          <span className="text-xs text-slate-400">
            {loadingExpenses ? 'Loading…' : `${expenses.length} ${expenses.length === 1 ? 'record' : 'records'}`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4">Split Among</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">{exp.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{exp.paidBy}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {(Array.isArray(exp.splitAmong) && exp.splitAmong.length ? exp.splitAmong : participants).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">₹{exp.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {exp.isAnomaly ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                        ⚠ Review
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                        No review flag
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loadingExpenses && expenses.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-sm text-slate-500">
                    No expenses have been recorded for this trip yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-[#14213D] border-b pb-3">Record New Trip Expense</h3>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scuba diving ticket"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16A6A1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Activities">Activities</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paid By</label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {participants.map((participant) => (
                    <option key={participant} value={participant}>{participant}</option>
                  ))}
                </select>
              </div>

              <fieldset>
                <legend className="mb-1 font-semibold text-slate-700">Split equally among</legend>
                <div className="max-h-36 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                  {participants.map((participant) => (
                    <label key={participant} className="flex cursor-pointer items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={splitAmong.includes(participant)}
                        onChange={(event) => {
                          setSplitAmong((current) => {
                            const selected = current.length ? current : participants;
                            if (!event.target.checked && selected.length === 1) {
                              toast.error('At least one trip member must share the expense.');
                              return current;
                            }
                            return event.target.checked
                              ? [...new Set([...selected, participant])]
                              : selected.filter((name) => name !== participant);
                          });
                        }}
                        className="h-4 w-4 accent-[#16A6A1]"
                      />
                      <span>{participant}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Each selected member’s share is included in the trip balance and settlement calculation.
                </p>
                {Number(amount) > 0 && splitAmong.length > 0 && (
                  <p className="mt-2 rounded-lg bg-teal-50 px-3 py-2 font-semibold text-teal-800">
                    ₹{Number(amount).toLocaleString()} ÷ {splitAmong.length} {splitAmong.length === 1 ? 'person' : 'people'} = ₹{(Number(amount) / splitAmong.length).toLocaleString(undefined, { maximumFractionDigits: 2 })} per person
                  </p>
                )}
              </fieldset>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#16A6A1] text-white font-bold hover:bg-teal-700 transition"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
