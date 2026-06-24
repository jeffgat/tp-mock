import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  LayoutDashboard,
  Bell,
  Shuffle,
  TrendingUp,
  Link2,
  ArrowLeftRight,
  Settings,
  BarChart2,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  Plus,
  Sparkles,
  LifeBuoy,
  BookOpen,
  Eye,
  Lock,
  X,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ── Color tokens from the sidebar screenshot ──────────────────────────────────
const C = {
  sidebarBg: "#273643",
  sidebarSurface: "#33404e",
  sidebarBorder: "#202937",
  sidebarText: "#d2d5db",
  sidebarMuted: "#9ba1ae",
  activeBlue: "#3b82dc",
  logoBlue: "#63c0fa",
  accentGreen: "#4fc660",
  mainBg: "#f5f7fa",
  cardBg: "#ffffff",
  cardBorder: "#e1e6ee",
  textPrimary: "#0f1f2e",
  textSecondary: "#5f7a8c",
  red: "#ef4444",
  green: "#22c55e",
  toggleGreen: "#22c55e",
};

// ── Data ──────────────────────────────────────────────────────────────────────
interface NavEntry {
  icon: ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  label: string;
  badge?: boolean;
  active?: boolean;
  chevron?: boolean;
}

const navSections: { items: NavEntry[] }[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard" },
      { icon: Bell, label: "Notifications", badge: true },
    ],
  },
  {
    items: [
      { icon: Shuffle, label: "Strategies / Subscriptions", active: true },
      { icon: Link2, label: "Brokers", chevron: true },
    ],
  },
  {
    items: [
      { icon: ArrowLeftRight, label: "Trades / Signals" },
    ],
  },
  {
    items: [
      { icon: Settings, label: "Account", chevron: true },
      { icon: BarChart2, label: "Indicators" },
      { icon: LogOut, label: "Logout" },
    ],
  },
];

interface Subscription {
  name: string;
  detail: string;
  pnl: string;
  active: boolean;
}

interface Account {
  id: number;
  initial: string;
  color: string;
  name: string;
  balance: string;
  pnl: string;
  pnlPct: string;
  positive: boolean;
  positions: string;
  activeSubs: string;
  subscriptions?: Subscription[];
}

const accounts: Account[] = [
  {
    id: 1,
    initial: "T",
    color: "#3b7ff5",
    name: "Tradeify 2",
    balance: "$99,558.89",
    pnl: "-$441.11",
    pnlPct: "-0.44%",
    positive: false,
    positions: "1 / 1",
    activeSubs: "2 / 2",
    subscriptions: [
      { name: "EMA 9/21 Cross", detail: "MNQ · 2 contracts", pnl: "+$1,240.50", active: true },
      { name: "ORB Breakout", detail: "ES · 1 contract", pnl: "-$320.00", active: true },
    ],
  },
  {
    id: 2,
    initial: "M",
    color: "#64748b",
    name: "apex funded 1",
    balance: "$49,263.26",
    pnl: "-$736.74",
    pnlPct: "-1.47%",
    positive: false,
    positions: "0 / 1",
    activeSubs: "—",
  },
  {
    id: 3,
    initial: "M",
    color: "#64748b",
    name: "apex funded 2",
    balance: "$51,475.94",
    pnl: "+$1,475.94",
    pnlPct: "+2.95%",
    positive: true,
    positions: "2 / 2",
    activeSubs: "—",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────
function Toggle({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        background: on ? C.toggleGreen : "#475569",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

function NavItem({ item }: { item: NavEntry }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 14px",
        cursor: "pointer",
        background: item.active ? C.activeBlue : hovered ? C.sidebarSurface : "transparent",
        color: item.active ? "#fff" : C.sidebarText,
        position: "relative",
        transition: "background 0.15s",
      }}
    >
      <div style={{ position: "relative" }}>
        <item.icon size={18} strokeWidth={2.2} />
        {item.badge && (
          <div style={{ position: "absolute", top: -5, right: -5, width: 12, height: 12 }}>
            <div
              className="notif-pulse-ring"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "#ef4444",
                border: "2px solid #fff",
              }}
            />
          </div>
        )}
      </div>
      <span style={{ fontSize: 13, fontWeight: item.active ? 700 : 600, flex: 1, letterSpacing: 0, whiteSpace: "nowrap" }}>
        {item.label}
      </span>
      {item.chevron && <ChevronRight size={16} color={C.sidebarText} />}
    </div>
  );
}

function AccountRow({ account }: { account: Account }) {
  const [expanded, setExpanded] = useState(account.id === 1);

  return (
    <div
      style={{
        background: C.cardBg,
        borderRadius: 10,
        border: `1px solid ${C.cardBorder}`,
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      {/* Header row */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 20px",
          cursor: "pointer",
          gap: 14,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: account.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          {account.initial}
        </div>

        {/* Name + balance */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: C.textSecondary }}>{account.name}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary }}>{account.balance}</div>
        </div>

        {/* P&L + positions */}
        <div style={{ textAlign: "right", marginRight: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: account.positive ? C.green : C.red }}>
            {account.pnl}
          </div>
          <div style={{ fontSize: 12, color: account.positive ? C.green : C.red }}>{account.pnlPct}</div>
        </div>

        {/* Positions badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "#f1f5f9",
              borderRadius: 6,
              padding: "3px 8px",
              fontSize: 12,
              color: C.textSecondary,
              whiteSpace: "nowrap",
            }}
          >
            <ArrowLeftRight size={11} />
            {account.positions}
          </div>
        </div>

        {/* Chevron */}
        <div style={{ color: C.textSecondary }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && account.subscriptions && (
        <div style={{ borderTop: `1px solid ${C.cardBorder}` }}>
          {/* Stats bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              padding: "14px 20px",
              gap: 12,
              background: "#f8fafc",
              borderBottom: `1px solid ${C.cardBorder}`,
            }}
          >
            {[
              { label: "TOTAL P&L", value: account.pnl, sub: account.pnlPct, colored: true },
              { label: "BALANCE", value: account.balance, sub: "Account equity" },
              { label: "ACTIVE SUBS", value: account.activeSubs, sub: "Enabled / linked" },
              { label: "OPEN POSITIONS", value: account.positions, sub: "Live in market" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.textSecondary, letterSpacing: "0.05em", marginBottom: 4 }}>
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: stat.colored ? (account.positive ? C.green : C.red) : C.textPrimary,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: stat.colored ? (account.positive ? C.green : C.red) : C.textSecondary }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Subscriptions */}
          <div style={{ padding: "14px 20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Subscriptions</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>
                {account.subscriptions.length} linked to this account
              </div>
            </div>

            {account.subscriptions.map((sub, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < (account.subscriptions?.length ?? 0) - 1 ? `1px solid ${C.cardBorder}` : "none",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: C.green,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{sub.name}</div>
                  <div style={{ fontSize: 11, color: C.textSecondary }}>{sub.detail}</div>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: sub.pnl.startsWith("+") ? C.green : C.red,
                    marginRight: 12,
                  }}
                >
                  {sub.pnl}
                </div>
                <Toggle on={sub.active} />
                <div style={{ color: "#94a3b8", cursor: "pointer", marginLeft: 4 }}>
                  <X size={14} />
                </div>
              </div>
            ))}

            {/* Add subscription */}
            <button
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                background: C.activeBlue,
                color: "#fff",
                border: "none",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Plus size={14} />
              Add subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type ActivityStatus = "Completed" | "Rejected" | "Failed";

interface ActivityRow {
  id: string;
  action: string;
  price?: string;
  symbol: string;
  assetClass: string;
  strategy: string;
  webhook: string;
  account: string;
  broker: string;
  fills: string;
  status: ActivityStatus;
  timestamp: string;
  latency: string;
}

const activityRows: ActivityRow[] = [
  {
    id: "SIG-1047",
    action: "Exit",
    symbol: "MESU2026",
    assetClass: "Futures",
    strategy: "ALPHA_V1",
    webhook: "**8edf",
    account: "funded 2",
    broker: "Tradovate",
    fills: "0 / 2",
    status: "Rejected",
    timestamp: "06/24/2026 12:37:10.785 PM EDT",
    latency: "199ms",
  },
  {
    id: "SIG-1046",
    action: "Exit",
    symbol: "MESU2026",
    assetClass: "Futures",
    strategy: "ALPHA_V1",
    webhook: "**8edf",
    account: "funded",
    broker: "Tradovate",
    fills: "0 / 2",
    status: "Rejected",
    timestamp: "06/24/2026 12:37:10.785 PM EDT",
    latency: "192ms",
  },
  {
    id: "SIG-1045",
    action: "Cancel",
    symbol: "MESU2026",
    assetClass: "Futures",
    strategy: "ALPHA_V1",
    webhook: "**8edf",
    account: "funded 2",
    broker: "Tradovate",
    fills: "0 / 2",
    status: "Rejected",
    timestamp: "06/24/2026 12:37:10.443 PM EDT",
    latency: "213ms",
  },
  {
    id: "SIG-1044",
    action: "Buy",
    price: "$7,471.75",
    symbol: "MESU2026",
    assetClass: "Futures",
    strategy: "ALPHA_V1",
    webhook: "**8edf",
    account: "funded",
    broker: "Tradovate",
    fills: "2 / 2",
    status: "Completed",
    timestamp: "06/24/2026 10:50:00.381 AM EDT",
    latency: "509ms",
  },
  {
    id: "SIG-1043",
    action: "Buy",
    price: "$7,471.75",
    symbol: "MESU2026",
    assetClass: "Futures",
    strategy: "ALPHA_V1",
    webhook: "**8edf",
    account: "funded 2",
    broker: "Tradovate",
    fills: "2 / 2",
    status: "Completed",
    timestamp: "06/24/2026 10:50:00.381 AM EDT",
    latency: "260ms",
  },
  {
    id: "SIG-1042",
    action: "Flat",
    price: "$7,479.60",
    symbol: "MESU2026",
    assetClass: "Futures",
    strategy: "ALPHA_V1",
    webhook: "**8edf",
    account: "funded",
    broker: "Tradovate",
    fills: "2 / 2",
    status: "Completed",
    timestamp: "06/23/2026 09:57:10.479 AM EDT",
    latency: "265ms",
  },
  {
    id: "SIG-1041",
    action: "Exit",
    symbol: "MESU2026",
    assetClass: "Futures",
    strategy: "ALPHA_V1",
    webhook: "**8edf",
    account: "funded 2",
    broker: "Tradovate",
    fills: "0 / 2",
    status: "Rejected",
    timestamp: "06/23/2026 10:09:39.763 AM EDT",
    latency: "199ms",
  },
];

function EmptyField({ chevron = false }: { chevron?: boolean }) {
  return (
    <div
      style={{
        height: 36,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 6,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 10px",
      }}
    >
      {chevron && <ChevronDown size={16} color={C.textSecondary} />}
    </div>
  );
}

function SegmentedControl({ options }: { options: string[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        gap: 3,
        padding: 3,
        borderRadius: 6,
        background: "#f0f2f5",
        border: `1px solid ${C.cardBorder}`,
      }}
    >
      {options.map((option, index) => (
        <button
          key={option}
          style={{
            minHeight: 32,
            border: "none",
            borderRadius: 5,
            background: index === 0 ? "#fff" : "transparent",
            boxShadow: index === 0 ? "0 1px 2px rgba(15,31,46,0.12)" : "none",
            color: index === 0 ? C.textPrimary : C.textSecondary,
            fontSize: 12,
            fontWeight: index === 0 ? 600 : 500,
            cursor: "pointer",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function FilterPanel() {
  const fields = [
    { label: "Trade or Signal ID" },
    { label: "Date range", chevron: true },
    { label: "Connected broker", chevron: true },
    { label: "Strategy", chevron: true },
    { label: "Strategy subscription", chevron: true },
    { label: "Ticker" },
    { label: "Webhook URL" },
  ];

  return (
    <aside
      style={{
        width: 232,
        minWidth: 232,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 4,
        overflow: "hidden",
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          height: 42,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 12px",
          borderBottom: `1px solid ${C.cardBorder}`,
        }}
      >
        <Search size={21} color="#667085" />
        <span style={{ fontSize: 14, color: C.textPrimary, fontWeight: 700, letterSpacing: "0.02em" }}>SEARCH</span>
      </div>
      <div style={{ padding: 16, display: "grid", gap: 14 }}>
        {fields.map((field) => (
          <label key={field.label} style={{ display: "grid", gap: 7 }}>
            <span style={{ fontSize: 14, color: C.textPrimary, fontWeight: 600 }}>{field.label}</span>
            <EmptyField chevron={field.chevron} />
          </label>
        ))}

        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ fontSize: 14, color: C.textPrimary, fontWeight: 600 }}>Status</span>
          <SegmentedControl options={["All", "Done", "Rejected", "Failed"]} />
        </label>

        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ fontSize: 14, color: C.textPrimary, fontWeight: 600 }}>Mode</span>
          <SegmentedControl options={["All", "Live", "Paper"]} />
        </label>

        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ fontSize: 14, color: C.textPrimary, fontWeight: 600 }}>Asset class</span>
          <SegmentedControl options={["All", "Stocks", "Options", "Futures"]} />
        </label>
      </div>
    </aside>
  );
}

function ActivityStatusPill({ row }: { row: ActivityRow }) {
  const isCompleted = row.status === "Completed";

  return (
    <div style={{ display: "grid", justifyItems: "end", gap: 5 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          color: isCompleted ? "#43a054" : "#ff9800",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {isCompleted ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
        <span>{row.fills}</span>
      </div>
      <div
        style={{
          color: isCompleted ? "#43a054" : "#ff9800",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {row.status}
      </div>
    </div>
  );
}

function ActivityRowItem({ row }: { row: ActivityRow }) {
  const actionColor = row.action === "Buy" ? "#43a054" : C.red;

  return (
    <div
      style={{
        minHeight: 86,
        display: "grid",
        gridTemplateColumns: "28px minmax(260px, 1fr) minmax(230px, 310px) 130px 22px",
        alignItems: "center",
        gap: 16,
        padding: "14px 18px",
        borderTop: `1px solid ${C.cardBorder}`,
        background: "#fff",
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${C.cardBorder}` }} />

      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 3 }}>
          <span style={{ color: actionColor, fontSize: 15, fontWeight: 700 }}>{row.action}</span>
          {row.price && <span style={{ color: "#7b8494", fontSize: 12, fontWeight: 600 }}>@ {row.price}</span>}
        </div>
        <div style={{ fontSize: 15, color: "#111827", fontWeight: 800, lineHeight: 1.2 }}>{row.symbol}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: C.textSecondary, fontSize: 12, marginTop: 5 }}>
          <span>{row.assetClass}</span>
          <span>{row.strategy}</span>
          <span>{row.webhook}</span>
          <span>{row.id}</span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 4, justifyItems: "end", color: C.textSecondary, fontSize: 12 }}>
        <a style={{ color: C.textSecondary, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer", fontSize: 13 }}>
          {row.timestamp}
        </a>
        <div>
          {row.account} · {row.broker} · {row.latency}
        </div>
      </div>

      <ActivityStatusPill row={row} />

      <ChevronRight size={20} color="#7b8494" />
    </div>
  );
}

function ActivityList() {
  return (
    <section
      style={{
        flex: 1,
        minWidth: 640,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${C.cardBorder}` }} />
        <ArrowLeftRight size={18} color="#667085" />
        <span style={{ fontSize: 14, color: C.textPrimary, fontWeight: 800, letterSpacing: "0.02em" }}>
          TRADES / SIGNALS
        </span>
        <button
          style={{
            marginLeft: "auto",
            height: 34,
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 7,
            background: "#fff",
            color: C.textPrimary,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {activityRows.map((row) => (
        <ActivityRowItem key={row.id} row={row} />
      ))}
    </section>
  );
}

interface StrategySubscription {
  account: string;
  broker: string;
  accountId: string;
  status: "Enabled" | "Paused";
  mode: "Auto Submit" | "Manual";
  pnl: string;
}

interface StrategyRouteRow {
  name: string;
  assetClass: string;
  rule: string;
  webhook: string;
  allowAnyTicker: boolean;
  enabled: boolean;
  autoSubmit: boolean;
  subscriptions: StrategySubscription[];
}

const strategyRows: StrategyRouteRow[] = [
  {
    name: "[FAST_V2] 4-Legs, $250 Risk",
    assetClass: "Futures",
    rule: "Take long side on 3 tickers",
    webhook: "**2721",
    allowAnyTicker: false,
    enabled: true,
    autoSubmit: true,
    subscriptions: [],
  },
  {
    name: "ALPHA_V1",
    assetClass: "Futures",
    rule: "Take both sides on 3 tickers",
    webhook: "**8edf",
    allowAnyTicker: true,
    enabled: true,
    autoSubmit: true,
    subscriptions: [
      {
        account: "funded 2 - alpha_v1",
        broker: "apex funded 2",
        accountId: "PAAPEX3253070000016",
        status: "Enabled",
        mode: "Auto Submit",
        pnl: "+$1,475.94",
      },
      {
        account: "funded - alpha_v1",
        broker: "Tradeify 2",
        accountId: "FTDFYL100481088047",
        status: "Enabled",
        mode: "Auto Submit",
        pnl: "-$441.11",
      },
    ],
  },
];

function StrategyFilterPanel() {
  const fields = [
    { label: "Name" },
    { label: "Ticker" },
    { label: "Webhook URL" },
  ];

  return (
    <aside
      style={{
        width: 292,
        minWidth: 292,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 8,
        overflow: "hidden",
        alignSelf: "flex-start",
      }}
    >
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          borderBottom: `1px solid ${C.cardBorder}`,
        }}
      >
        <Search size={18} color="#667085" />
        <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 800, letterSpacing: "0.02em" }}>SEARCH</span>
      </div>
      <div style={{ padding: 12, display: "grid", gap: 12 }}>
        {fields.map((field) => (
          <label key={field.label} style={{ display: "grid", gap: 7 }}>
            <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 700 }}>{field.label}</span>
            <EmptyField chevron={field.chevron} />
          </label>
        ))}

        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 700 }}>Allow any ticker</span>
          <SegmentedControl options={["Both", "Yes", "No"]} />
        </label>

        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 700 }}>Asset class</span>
          <SegmentedControl options={["All", "Stocks", "Options", "Futures"]} />
        </label>

        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 700 }}>Enabled</span>
          <SegmentedControl options={["Both", "Yes", "No"]} />
        </label>

        <label style={{ display: "grid", gap: 7 }}>
          <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 700 }}>Sort order</span>
          <SegmentedControl options={["Default", "Name (A-Z)", "Newest First"]} />
        </label>
      </div>
    </aside>
  );
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "blue" }) {
  const styles = {
    neutral: { background: "#fff", color: C.textPrimary, border: C.cardBorder },
    green: { background: "#ecfdf3", color: "#159947", border: "#a7efbd" },
    blue: { background: "#eef7ff", color: C.activeBlue, border: "#b8dcff" },
  }[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        minHeight: 22,
        padding: "0 8px",
        borderRadius: 5,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function StrategyRowItem({ row }: { row: StrategyRouteRow }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "24px minmax(0, 1fr)",
        gap: 12,
        padding: "18px 14px",
        borderTop: `1px solid ${C.cardBorder}`,
        background: "#fff",
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${C.cardBorder}`, marginTop: 3 }} />

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, color: "#536071", fontSize: 16, lineHeight: 1.25, fontWeight: 700 }}>
              {row.name}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 6, color: C.textSecondary, fontSize: 11 }}>
              <span>{row.assetClass}</span>
              <span>{row.rule}</span>
              <span>{row.webhook}</span>
            </div>
          </div>
          <Badge>{row.subscriptions.length} Subscriptions</Badge>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          <Badge tone="green"><CheckCircle2 size={12} /> Enabled</Badge>
          <Badge tone="blue"><Sparkles size={12} /> Auto Submit</Badge>
          <Badge>{row.allowAnyTicker ? "Any ticker" : "Restricted tickers"}</Badge>
        </div>

        {row.subscriptions.length > 0 && (
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            {row.subscriptions.map((sub) => (
              <div
                key={`${row.name}-${sub.account}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 1fr) minmax(170px, 240px) 92px 20px",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: `1px solid ${C.cardBorder}`,
                  background: "#fbfcfe",
                }}
              >
                <div>
                  <div style={{ color: C.textPrimary, fontSize: 13, fontWeight: 700 }}>{sub.account}</div>
                  <div style={{ color: C.textSecondary, fontSize: 11, marginTop: 3 }}>
                    {sub.broker} · {sub.accountId}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
                  <Badge tone="green">{sub.status}</Badge>
                  <Badge tone="blue">{sub.mode}</Badge>
                </div>
                <div style={{ color: sub.pnl.startsWith("+") ? C.green : C.red, fontSize: 13, fontWeight: 800, textAlign: "right" }}>
                  {sub.pnl}
                </div>
                <ChevronRight size={18} color="#7b8494" />
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginTop: 12 }}>
          {["Dashboard", "Signals", "Trades", "Subscribe", "Edit"].map((action) => (
            <button
              key={action}
              style={{
                minHeight: 32,
                padding: "0 11px",
                border: `1px solid ${C.cardBorder}`,
                borderRadius: 5,
                background: "#fff",
                color: C.textPrimary,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {action}
            </button>
          ))}
          <button
            aria-label="More"
            style={{
              width: 32,
              height: 32,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 5,
              background: "#fff",
              color: C.textPrimary,
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ⋮
          </button>
        </div>
      </div>
    </div>
  );
}

function StrategySubscriptionList() {
  return (
    <section
      style={{
        flex: 1,
        minWidth: 600,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 42,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 12px",
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${C.cardBorder}` }} />
        <Shuffle size={17} color="#667085" />
        <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 800, letterSpacing: "0.02em" }}>
          STRATEGIES / SUBSCRIPTIONS
        </span>
        <button
          style={{
            marginLeft: "auto",
            height: 32,
            padding: "0 11px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 5,
            background: "#fff",
            color: C.textPrimary,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {strategyRows.map((row) => (
        <StrategyRowItem key={row.name} row={row} />
      ))}
    </section>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Satoshi', sans-serif", background: C.mainBg }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 208,
          minWidth: 208,
          background: C.sidebarBg,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "12px 14px 11px", borderBottom: `1px solid ${C.sidebarBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                background: C.activeBlue,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={15} color="#fff" strokeWidth={2.6} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              traderspost<span style={{ color: C.logoBlue }}>mock</span>
            </span>
          </div>
        </div>

        {/* Setup progress */}
        <div
          style={{
            margin: "10px 12px 12px",
            padding: "6px 0",
            background: "transparent",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              background: "#f3fdf5",
              color: C.accentGreen,
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 5,
              border: `1px solid ${C.accentGreen}`,
            }}
          >
            6/7
          </div>
          <span style={{ fontSize: 13, color: C.sidebarMuted, fontWeight: 600 }}>Setup</span>
          <ChevronDown size={16} color={C.sidebarMuted} style={{ marginLeft: "auto" }} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0" }}>
          {navSections.map((section, si) => (
            <div key={si}>
              {section.items.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
              {si < navSections.length - 1 && (
                <div style={{ height: 1, background: C.sidebarBorder, margin: "9px 0" }} />
              )}
            </div>
          ))}
        </nav>

        {/* Bottom user panel */}
        <div style={{ borderTop: `1px solid ${C.sidebarBorder}`, padding: "14px 12px 0" }}>
          {/* User row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: C.sidebarSurface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              J
            </div>
            <span style={{ fontSize: 13, color: "#ffffff", fontWeight: 700, flex: 1 }}>jeff.gtbn</span>
            <Eye size={16} color={C.activeBlue} />
            <Lock size={16} color="#ffffff" />
          </div>

          {/* Plan info */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              Your Starter Plan
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {[
                { label: "Live", value: "0 / 1" },
                { label: "Paper", value: "3 / 4" },
                { label: "Asset", value: "1 / 1" },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: 11, color: C.sidebarMuted, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: C.sidebarMuted, fontWeight: 500 }}>
                    <span style={{ color: C.logoBlue, fontWeight: 700 }}>{item.value.split(" / ")[0]}</span>
                    {" / "}{item.value.split(" / ")[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <button
            style={{
              width: "100%",
              padding: "10px 10px",
              background: C.sidebarSurface,
              color: "#ffffff",
              border: "1px solid #445262",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <Plus size={16} />
            Add More Brokers
          </button>
          <button
            style={{
              width: "100%",
              padding: "11px 10px",
              background: C.activeBlue,
              color: "#fff",
              border: "none",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <Sparkles size={16} />
            Upgrade to Basic
          </button>

          {/* Support / Docs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 42,
              borderTop: `1px solid ${C.sidebarBorder}`,
              margin: "0 -12px",
              padding: "14px 12px 16px",
            }}
          >
            {[
              { icon: LifeBuoy, label: "Support" },
              { icon: BookOpen, label: "Docs" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.sidebarMuted,
                  cursor: "pointer",
                }}
              >
                <item.icon size={15} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 40,
            padding: "0 12px",
            background: C.cardBg,
            borderBottom: `1px solid ${C.cardBorder}`,
            fontSize: 12,
            color: C.textSecondary,
          }}
        >
          <Home size={14} />
          <ChevronRight size={13} />
          <span style={{ color: C.textPrimary, fontWeight: 500 }}>Strategies / Subscriptions</span>
          <button
            style={{
              marginLeft: "auto",
              height: 32,
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              gap: 7,
              border: "none",
              borderRadius: 5,
              background: "#233442",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Plus size={14} />
            New Strategy
          </button>
        </div>

        {/* Page content */}
        <div
          style={{
            padding: "10px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            minWidth: 0,
          }}
        >
          <StrategyFilterPanel />
          <StrategySubscriptionList />
        </div>
      </main>
    </div>
  );
}
