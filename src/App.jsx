
import { useMemo, useState } from "react";
import {
  Home, Wallet, ClipboardList, ShoppingBasket, Users, Settings,
  Plus, Bell, Search, ChevronDown, ArrowUpRight, ArrowDownLeft,
  MoreHorizontal, Check, X, Trash2, Utensils, Zap, Droplets,
  Wifi, ShoppingBag, Coffee, CalendarDays, CircleDollarSign,
  Receipt, CheckCircle2, Menu, ArrowRight, Sparkles, HandCoins
} from "lucide-react";
import "./App.css";

const initialMembers = [
  { id: 1, name: "Vivan Garg", initials: "VG", color: "#8b79dc", role: "You" },
  { id: 2, name: "Aarav Mehta", initials: "AM", color: "#3e9fbb", role: "Roommate" },
  { id: 3, name: "Rohan Sharma", initials: "RS", color: "#d58a57", role: "Roommate" },
  { id: 4, name: "Kabir Singh", initials: "KS", color: "#58a78b", role: "Roommate" },
];

const initialExpenses = [
  { id: 1, title: "Grocery shopping", category: "Groceries", paidBy: 1, amount: 2400, date: "Nov 11", split: [1, 2, 3, 4] },
  { id: 2, title: "Electricity bill", category: "Utilities", paidBy: 2, amount: 1800, date: "Nov 10", split: [1, 2, 3, 4] },
  { id: 3, title: "Pizza night", category: "Food", paidBy: 3, amount: 1200, date: "Nov 09", split: [1, 2, 3, 4] },
  { id: 4, title: "Wi-Fi recharge", category: "Utilities", paidBy: 1, amount: 999, date: "Nov 08", split: [1, 2, 3, 4] },
  { id: 5, title: "Cleaning supplies", category: "Household", paidBy: 4, amount: 650, date: "Nov 07", split: [1, 2, 3, 4] },
];

const initialChores = [
  { id: 1, title: "Clean the kitchen", assignee: 1, day: "Today", done: false },
  { id: 2, title: "Take out the trash", assignee: 2, day: "Today", done: true },
  { id: 3, title: "Clean the bathroom", assignee: 3, day: "Tomorrow", done: false },
  { id: 4, title: "Buy drinking water", assignee: 4, day: "Tomorrow", done: false },
  { id: 5, title: "Mop common area", assignee: 2, day: "Friday", done: false },
];

const initialShopping = [
  { id: 1, name: "Milk", quantity: "2 packets", done: false },
  { id: 2, name: "Bread", quantity: "2 loaves", done: false },
  { id: 3, name: "Dishwashing liquid", quantity: "1 bottle", done: true },
  { id: 4, name: "Eggs", quantity: "1 tray", done: false },
  { id: 5, name: "Detergent", quantity: "1 pack", done: false },
];

const categoryIcons = {
  Groceries: ShoppingBasket,
  Utilities: Zap,
  Food: Utensils,
  Household: Home,
  Transport: ShoppingBag,
  Other: Receipt,
};

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
}).format(value);

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [members] = useState(initialMembers);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [chores, setChores] = useState(initialChores);
  const [shopping, setShopping] = useState(initialShopping);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showChoreModal, setShowChoreModal] = useState(false);
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [expenseForm, setExpenseForm] = useState({
    title: "", amount: "", category: "Groceries", paidBy: "1", split: ["1", "2", "3", "4"],
  });
  const [choreForm, setChoreForm] = useState({
    title: "", assignee: "1", day: "Today",
  });
  const [shoppingForm, setShoppingForm] = useState({
    name: "", quantity: "1 item",
  });

  const balances = useMemo(() => {
    const result = Object.fromEntries(members.map((member) => [member.id, 0]));

    expenses.forEach((expense) => {
      const participants = expense.split.map(Number);
      if (!participants.length) return;
      const share = expense.amount / participants.length;
      result[expense.paidBy] += expense.amount;
      participants.forEach((id) => {
        result[id] -= share;
      });
    });

    return result;
  }, [expenses, members]);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingChores = chores.filter((chore) => !chore.done).length;
  const completedChores = chores.filter((chore) => chore.done).length;
  const completedShopping = shopping.filter((item) => item.done).length;

  const getMember = (id) => members.find((member) => member.id === Number(id));

  const addExpense = (event) => {
    event.preventDefault();
    if (!expenseForm.title.trim() || Number(expenseForm.amount) <= 0 || !expenseForm.split.length) return;

    setExpenses((previous) => [{
      id: Date.now(),
      title: expenseForm.title.trim(),
      amount: Number(expenseForm.amount),
      category: expenseForm.category,
      paidBy: Number(expenseForm.paidBy),
      split: expenseForm.split.map(Number),
      date: "Nov 11",
    }, ...previous]);

    setExpenseForm({ title: "", amount: "", category: "Groceries", paidBy: "1", split: ["1", "2", "3", "4"] });
    setShowExpenseModal(false);
  };

  const addChore = (event) => {
    event.preventDefault();
    if (!choreForm.title.trim()) return;
    setChores((previous) => [{
      id: Date.now(), title: choreForm.title.trim(),
      assignee: Number(choreForm.assignee), day: choreForm.day, done: false,
    }, ...previous]);
    setChoreForm({ title: "", assignee: "1", day: "Today" });
    setShowChoreModal(false);
  };

  const addShoppingItem = (event) => {
    event.preventDefault();
    if (!shoppingForm.name.trim()) return;
    setShopping((previous) => [{
      id: Date.now(), name: shoppingForm.name.trim(),
      quantity: shoppingForm.quantity, done: false,
    }, ...previous]);
    setShoppingForm({ name: "", quantity: "1 item" });
    setShowShoppingModal(false);
  };

  const toggleChore = (id) => setChores((previous) =>
    previous.map((chore) => chore.id === id ? { ...chore, done: !chore.done } : chore)
  );

  const toggleShopping = (id) => setShopping((previous) =>
    previous.map((item) => item.id === id ? { ...item, done: !item.done } : item)
  );

  const deleteExpense = (id) => setExpenses((previous) => previous.filter((item) => item.id !== id));
  const deleteChore = (id) => setChores((previous) => previous.filter((item) => item.id !== id));
  const deleteShopping = (id) => setShopping((previous) => previous.filter((item) => item.id !== id));

  // Greedy settlement: repeatedly match the largest debtor with the largest creditor.
  const settlements = useMemo(() => {
    const accounts = members.map((member) => ({
      id: member.id,
      balance: balances[member.id],
    }));
    const debtors = accounts.filter((account) => account.balance < -0.01)
      .map((account) => ({ ...account, balance: -account.balance }));
    const creditors = accounts.filter((account) => account.balance > 0.01)
      .map((account) => ({ ...account }));

    const result = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(debtors[i].balance, creditors[j].balance);
      if (amount > 0.01) {
        result.push({
          from: debtors[i].id,
          to: creditors[j].id,
          amount: Math.round(amount),
        });
      }
      debtors[i].balance -= amount;
      creditors[j].balance -= amount;
      if (debtors[i].balance < 0.01) i++;
      if (creditors[j].balance < 0.01) j++;
    }

    return result;
  }, [balances, members]);

  const filteredExpenses = expenses.filter((expense) =>
    expense.title.toLowerCase().includes(search.toLowerCase()) ||
    expense.category.toLowerCase().includes(search.toLowerCase())
  );

  const navItems = [
    { label: "Overview", icon: Home },
    { label: "Expenses", icon: Wallet },
    { label: "Chores", icon: ClipboardList },
    { label: "Shopping List", icon: ShoppingBasket },
    { label: "Settle Up", icon: HandCoins },
  ];

  const renderExpenses = (items) => (
    <div className="expense-list">
      {items.length === 0 && <div className="empty-message">No expenses found.</div>}
      {items.map((expense) => {
        const Icon = categoryIcons[expense.category] || Receipt;
        const payer = getMember(expense.paidBy);
        return (
          <div className="expense-row" key={expense.id}>
            <div className={`expense-icon ${expense.category.toLowerCase()}`}><Icon size={18} /></div>
            <div className="expense-info">
              <strong>{expense.title}</strong>
              <span>{payer?.name} paid · {expense.date}</span>
            </div>
            <div className="expense-amount">{money(expense.amount)}</div>
            <button className="delete-button" title="Delete expense" onClick={() => deleteExpense(expense.id)}><Trash2 size={15} /></button>
          </div>
        );
      })}
    </div>
  );

  const renderChores = (items) => (
    <div className="chore-list">
      {items.map((chore) => {
        const member = getMember(chore.assignee);
        return (
          <div className={`chore-row ${chore.done ? "chore-completed" : ""}`} key={chore.id}>
            <button className="chore-check" onClick={() => toggleChore(chore.id)}>{chore.done ? <CheckCircle2 size={20} /> : <span />}</button>
            <div className="chore-info"><strong>{chore.title}</strong><span>{chore.day} · {member?.name}</span></div>
            <div className="mini-avatar" style={{ background: member?.color }}>{member?.initials}</div>
            <button className="delete-button" onClick={() => deleteChore(chore.id)}><Trash2 size={14} /></button>
          </div>
        );
      })}
      {!items.length && <div className="empty-message">No chores yet. Add one to get started!</div>}
    </div>
  );

  const renderShopping = (items) => (
    <div className="shopping-list">
      {items.map((item) => (
        <div className={`shopping-row ${item.done ? "shopping-done" : ""}`} key={item.id}>
          <button className="shopping-check" onClick={() => toggleShopping(item.id)}>{item.done && <Check size={13} />}</button>
          <div className="shopping-info"><strong>{item.name}</strong><span>{item.quantity}</span></div>
          <button className="delete-button" onClick={() => deleteShopping(item.id)}><Trash2 size={14} /></button>
        </div>
      ))}
      {!items.length && <div className="empty-message">Your shopping list is empty.</div>}
    </div>
  );

  return (
    <div className="roomie-app">
      {mobileMenu && <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Home size={20} /></div>
          <span>roomie<span className="brand-dot">.</span></span>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}><X size={18} /></button>
        </div>

        <div className="home-switcher">
          <div className="home-avatar"><Home size={17} /></div>
          <div><strong>The Cozy Corner</strong><span>4 members · Shared home</span></div>
          <ChevronDown size={15} />
        </div>

        <div className="sidebar-label">YOUR HOME</div>
        <nav className="sidebar-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => { setActivePage(label); setMobileMenu(false); }}>
              <Icon size={18} /><span>{label}</span>
              {label === "Chores" && <small>{pendingChores}</small>}
            </button>
          ))}
        </nav>

        <div className="sidebar-label members-label">ROOMMATES <button onClick={() => setActivePage("Settle Up")}><Plus size={14} /></button></div>
        <div className="member-sidebar">
          {members.map((member) => (
            <div className="member-sidebar-row" key={member.id}>
              <div className="mini-avatar" style={{ background: member.color }}>{member.initials}</div>
              <span>{member.name}</span>
              {member.role === "You" && <small>You</small>}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="home-tip"><Sparkles size={17} /><strong>Living better, together.</strong><p>Little things add up. Keep your shared space happy!</p></div>
          <button className="nav-item" onClick={() => setActivePage("Settings")}><Settings size={18} /><span>Settings</span></button>
          <div className="profile-row"><div className="profile-avatar">VG</div><div><strong>Vivan Garg</strong><span>Home admin</span></div><MoreHorizontal size={19} /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setMobileMenu(true)}><Menu size={20} /></button>
            <div><div className="breadcrumb">The Cozy Corner <span>/</span> {activePage}</div><h1>{activePage}</h1></div>
          </div>
          <div className="topbar-right">
            <div className="search-field"><Search size={16} /><input placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <button className="notification-button"><Bell size={18} /><i /></button>
            <button className="primary-button" onClick={() => setShowExpenseModal(true)}><Plus size={17} /> Add expense</button>
          </div>
        </header>

        {activePage === "Overview" && (
          <>
            <section className="welcome-section">
              <div><span className="eyebrow">WEDNESDAY, NOVEMBER 11</span><h2>Home is better together. <span>✦</span></h2><p>Here's what's happening around The Cozy Corner.</p></div>
              <div className="welcome-decoration"><div className="welcome-circle"><Home size={30} /></div><span className="deco-dot dot-one" /><span className="deco-dot dot-two" /></div>
            </section>

            <section className="stats-grid">
              <StatCard icon={Wallet} label="Total shared spending" value={money(totalSpent)} note="Across all expenses" tone="green" />
              <StatCard icon={HandCoins} label="Pending settlements" value={settlements.length} note="Payments to settle up" tone="purple" />
              <StatCard icon={ClipboardList} label="Pending chores" value={pendingChores} note={`${completedChores} completed`} tone="orange" />
              <StatCard icon={ShoppingBasket} label="Shopping items" value={shopping.length - completedShopping} note={`${completedShopping} items checked off`} tone="blue" />
            </section>

            <section className="overview-grid">
              <div className="panel overview-expenses">
                <div className="panel-heading"><div><span className="eyebrow">SHARED FINANCES</span><h3>Recent expenses</h3></div><button className="view-link" onClick={() => setActivePage("Expenses")}>View all <ArrowRight size={14} /></button></div>
                {renderExpenses(expenses.slice(0, 4))}
              </div>
              <div className="panel balance-panel">
                <div className="panel-heading"><div><span className="eyebrow">YOUR BALANCE</span><h3>Where you stand</h3></div><CircleDollarSign size={20} className="panel-icon" /></div>
                <div className={`balance-number ${balances[1] >= 0 ? "positive" : "negative"}`}>{balances[1] >= 0 ? "+" : "-"}{money(Math.abs(Math.round(balances[1])))}</div>
                <p>{balances[1] >= 0 ? "You are owed money by your roommates." : "You owe money to your roommates."}</p>
                <div className="balance-divider" />
                {members.map((member) => (
                  <div className="balance-member" key={member.id}>
                    <div className="mini-avatar" style={{ background: member.color }}>{member.initials}</div>
                    <span>{member.name}{member.id === 1 ? " (You)" : ""}</span>
                    <strong className={balances[member.id] >= 0 ? "positive" : "negative"}>{balances[member.id] >= 0 ? "+" : "-"}{money(Math.abs(Math.round(balances[member.id])))}</strong>
                  </div>
                ))}
                <button className="settle-button" onClick={() => setActivePage("Settle Up")}>Settle balances <ArrowUpRight size={15} /></button>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="panel">
                <div className="panel-heading"><div><span className="eyebrow">SHARED RESPONSIBILITIES</span><h3>Upcoming chores</h3></div><button className="view-link" onClick={() => setActivePage("Chores")}>View all <ArrowRight size={14} /></button></div>
                {renderChores(chores.slice(0, 3))}
              </div>
              <div className="panel">
                <div className="panel-heading"><div><span className="eyebrow">THE GROCERY RUN</span><h3>Shopping list</h3></div><button className="view-link" onClick={() => setActivePage("Shopping List")}>View all <ArrowRight size={14} /></button></div>
                {renderShopping(shopping.slice(0, 4))}
              </div>
            </section>
          </>
        )}

        {activePage === "Expenses" && (
          <section className="page-content">
            <div className="page-intro"><div><h2>Shared expenses</h2><p>Keep every shared purchase in one place.</p></div><button className="primary-button" onClick={() => setShowExpenseModal(true)}><Plus size={16} /> Add expense</button></div>
            <div className="expense-summary">
              <div><span>Total expenses</span><strong>{money(totalSpent)}</strong></div>
              <div><span>Number of entries</span><strong>{expenses.length}</strong></div>
              <div><span>Roommates sharing</span><strong>{members.length}</strong></div>
            </div>
            <div className="panel page-panel"><div className="panel-heading"><h3>All transactions</h3><span className="muted-label">{filteredExpenses.length} entries</span></div>{renderExpenses(filteredExpenses)}</div>
          </section>
        )}

        {activePage === "Chores" && (
          <section className="page-content">
            <div className="page-intro"><div><h2>Chore board</h2><p>Share the work, keep the home happy.</p></div><button className="primary-button" onClick={() => setShowChoreModal(true)}><Plus size={16} /> Add chore</button></div>
            <div className="expense-summary"><div><span>Total chores</span><strong>{chores.length}</strong></div><div><span>Completed</span><strong>{completedChores}</strong></div><div><span>Remaining</span><strong>{pendingChores}</strong></div></div>
            <div className="panel page-panel"><div className="panel-heading"><h3>All chores</h3><span className="muted-label">{pendingChores} remaining</span></div>{renderChores(chores)}</div>
          </section>
        )}

        {activePage === "Shopping List" && (
          <section className="page-content">
            <div className="page-intro"><div><h2>Shared shopping list</h2><p>Never forget the essentials on your next grocery run.</p></div><button className="primary-button" onClick={() => setShowShoppingModal(true)}><Plus size={16} /> Add item</button></div>
            <div className="shopping-progress"><div><strong>{completedShopping} of {shopping.length}</strong><span>items picked up</span></div><div className="progress-track"><span style={{ width: `${shopping.length ? completedShopping / shopping.length * 100 : 0}%` }} /></div></div>
            <div className="panel page-panel"><div className="panel-heading"><h3>Shopping items</h3><span className="muted-label">{shopping.length - completedShopping} left to buy</span></div>{renderShopping(shopping)}</div>
          </section>
        )}

        {activePage === "Settle Up" && (
          <section className="page-content">
            <div className="page-intro"><div><h2>Settle up</h2><p>Everyone's balances, simplified into the fewest practical payments.</p></div></div>
            <div className="settlement-hero"><div className="settlement-hero-icon"><HandCoins size={25} /></div><div><span className="eyebrow">TOTAL SHARED SPENDING</span><strong>{money(totalSpent)}</strong><p>Across {members.length} roommates and {expenses.length} expenses</p></div></div>
            <div className="panel page-panel"><div className="panel-heading"><div><span className="eyebrow">SUGGESTED PAYMENTS</span><h3>Who pays whom?</h3></div><span className="settlement-count">{settlements.length} transfers</span></div>
              {settlements.length ? settlements.map((item, index) => {
                const from = getMember(item.from);
                const to = getMember(item.to);
                return <div className="settlement-row" key={index}><div className="settlement-person"><div className="mini-avatar" style={{ background: from.color }}>{from.initials}</div><div><strong>{from.name}</strong><span>Owes</span></div></div><div className="settlement-arrow"><ArrowRight size={19} /><strong>{money(item.amount)}</strong></div><div className="settlement-person"><div className="mini-avatar" style={{ background: to.color }}>{to.initials}</div><div><strong>{to.name}</strong><span>Receives</span></div></div></div>;
              }) : <div className="empty-message">Everyone is settled up! 🎉</div>}
              <p className="settlement-note"><Sparkles size={15} /> Suggested transfers are calculated from the current shared expense records. No actual payments are processed.</p>
            </div>
            <div className="panel page-panel balance-breakdown"><div className="panel-heading"><h3>Individual balances</h3></div>
              {members.map((member) => <div className="balance-member" key={member.id}><div className="mini-avatar" style={{ background: member.color }}>{member.initials}</div><span>{member.name}</span><strong className={balances[member.id] >= 0 ? "positive" : "negative"}>{balances[member.id] >= 0 ? "+" : "-"}{money(Math.abs(Math.round(balances[member.id])))}</strong></div>)}
            </div>
          </section>
        )}

        {activePage === "Settings" && <section className="empty-state"><Settings size={35} /><h2>Settings</h2><p>Home preferences will be available here soon.</p></section>}
      </main>

      {showExpenseModal && <Modal title="Add shared expense" subtitle="SHARED FINANCES" onClose={() => setShowExpenseModal(false)} onSubmit={addExpense}>
        <label>Expense name<input autoFocus placeholder="e.g. Dinner, groceries..." value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} required /></label>
        <label>Amount (₹)<input type="number" min="1" placeholder="Enter amount" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} required /></label>
        <label>Category<select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>{Object.keys(categoryIcons).map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Paid by<select value={expenseForm.paidBy} onChange={(e) => setExpenseForm({ ...expenseForm, paidBy: e.target.value })}>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
        <div className="split-picker"><span>Split between</span>{members.map((member) => <label className="split-option" key={member.id}><input type="checkbox" checked={expenseForm.split.includes(String(member.id))} onChange={(e) => setExpenseForm((previous) => ({ ...previous, split: e.target.checked ? [...previous.split, String(member.id)] : previous.split.filter((id) => id !== String(member.id)) }))} /><span className="mini-avatar" style={{ background: member.color }}>{member.initials}</span>{member.name}</label>)}</div>
        <button className="primary-button modal-submit" type="submit"><Plus size={16} /> Save expense</button>
      </Modal>}

      {showChoreModal && <Modal title="Add a chore" subtitle="SHARED RESPONSIBILITIES" onClose={() => setShowChoreModal(false)} onSubmit={addChore}>
        <label>Chore name<input autoFocus placeholder="e.g. Clean the kitchen" value={choreForm.title} onChange={(e) => setChoreForm({ ...choreForm, title: e.target.value })} required /></label>
        <label>Assign to<select value={choreForm.assignee} onChange={(e) => setChoreForm({ ...choreForm, assignee: e.target.value })}>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label>
        <label>Due date<select value={choreForm.day} onChange={(e) => setChoreForm({ ...choreForm, day: e.target.value })}><option>Today</option><option>Tomorrow</option><option>Friday</option><option>Weekend</option></select></label>
        <button className="primary-button modal-submit" type="submit"><Plus size={16} /> Add chore</button>
      </Modal>}

      {showShoppingModal && <Modal title="Add shopping item" subtitle="GROCERY LIST" onClose={() => setShowShoppingModal(false)} onSubmit={addShoppingItem}>
        <label>Item name<input autoFocus placeholder="e.g. Milk" value={shoppingForm.name} onChange={(e) => setShoppingForm({ ...shoppingForm, name: e.target.value })} required /></label>
        <label>Quantity<input placeholder="e.g. 2 packets" value={shoppingForm.quantity} onChange={(e) => setShoppingForm({ ...shoppingForm, quantity: e.target.value })} /></label>
        <button className="primary-button modal-submit" type="submit"><Plus size={16} /> Add item</button>
      </Modal>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note, tone }) {
  return <div className="stat-card"><div className="stat-card-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={19} /></div></div><strong>{value}</strong><small>{note}</small></div>;
}

function Modal({ title, subtitle, onClose, onSubmit, children }) {
  return <div className="modal-backdrop" onClick={onClose}><form className="roomie-modal" onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}><div className="modal-heading"><div><span className="eyebrow">{subtitle}</span><h2>{title}</h2></div><button type="button" className="close-button" onClick={onClose}><X size={19} /></button></div>{children}</form></div>;
}

export default App;
