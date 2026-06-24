import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
} from 'react';
import {
    Activity,
    AlertCircle,
    ArrowDown,
    BarChart2,
    BookOpen,
    Bot,
    CandlestickChart,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Copy,
    CreditCard,
    Download,
    Eye,
    HelpCircle,
    Home,
    Info,
    LayoutDashboard,
    LifeBuoy,
    Link2,
    Lock,
    LogOut,
    MoreVertical,
    Network,
    Plus,
    Radio,
    Repeat,
    Search,
    Settings,
    Shuffle,
    SlidersHorizontal,
    Sparkles,
    SquarePen,
    Terminal,
    TrendingUp,
    User,
    Webhook,
    X,
    type LucideIcon,
} from 'lucide-react';
import {
    BrowserRouter,
    Navigate,
    NavLink,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

interface NavItem {
    icon: LucideIcon;
    label: string;
    path?: string;
    chevron?: boolean;
    badge?: boolean;
}

interface NavSection {
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: Activity, label: 'Activity', path: '/activity' },
        ],
    },
    {
        items: [
            { icon: Shuffle, label: 'Strategies', path: '/strategies' },
            { icon: Link2, label: 'Brokers', path: '/brokers', chevron: true },
        ],
    },
    {
        items: [
            { icon: Settings, label: 'Account', path: '/account', chevron: true },
            { icon: BarChart2, label: 'Indicators', path: '/indicators' },
            { icon: LogOut, label: 'Logout' },
        ],
    },
];

const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/activity': 'Activity',
    '/strategies': 'Strategies',
    '/brokers': 'Brokers',
    '/account': 'Account',
    '/indicators': 'Indicators',
};

interface ActivityRow {
    id: string;
    action: 'Exit' | 'Cancel' | 'Buy' | 'Flat';
    symbol: string;
    price?: string;
    assetClass: string;
    strategy: string;
    webhook: string;
    account: string;
    broker: string;
    timestamp: string;
    latency: string;
    status: 'Rejected' | 'Completed';
    fills: '0 / 2' | '2 / 2';
    mode: 'Live' | 'Paper';
}

const activityRows: ActivityRow[] = [
    {
        id: 'evt-001',
        action: 'Exit',
        symbol: 'MESU2026',
        assetClass: 'Futures',
        strategy: 'BETA_V2',
        webhook: '**2721',
        account: 'funded 2 - alpha_v1',
        broker: 'lucid funded',
        timestamp: '06/24/2026 12:37:10.785 PM EDT',
        latency: '199ms',
        status: 'Rejected',
        fills: '0 / 2',
        mode: 'Paper',
    },
    {
        id: 'evt-002',
        action: 'Exit',
        symbol: 'MESU2026',
        assetClass: 'Futures',
        strategy: 'ALPHA_V1',
        webhook: '**8edf',
        account: 'funded - alpha_v1',
        broker: 'tradeify funded 1',
        timestamp: '06/24/2026 12:37:10.785 PM EDT',
        latency: '192ms',
        status: 'Rejected',
        fills: '0 / 2',
        mode: 'Paper',
    },
    {
        id: 'evt-003',
        action: 'Cancel',
        symbol: 'MESU2026',
        assetClass: 'Futures',
        strategy: 'BETA_V2',
        webhook: '**2721',
        account: 'funded 2 - alpha_v1',
        broker: 'apex funded 2',
        timestamp: '06/24/2026 12:37:10.443 PM EDT',
        latency: '213ms',
        status: 'Rejected',
        fills: '0 / 2',
        mode: 'Paper',
    },
    {
        id: 'evt-004',
        action: 'Buy',
        symbol: 'MESU2026',
        price: '$7,471.75',
        assetClass: 'Futures',
        strategy: 'BETA_V2',
        webhook: '**2721',
        account: 'funded 2 - alpha_v1',
        broker: 'apex funded 2',
        timestamp: '06/24/2026 10:50:00.381 AM EDT',
        latency: '509ms',
        status: 'Completed',
        fills: '2 / 2',
        mode: 'Paper',
    },
    {
        id: 'evt-005',
        action: 'Buy',
        symbol: 'MESU2026',
        price: '$7,471.75',
        assetClass: 'Futures',
        strategy: 'ALPHA_V1',
        webhook: '**8edf',
        account: 'funded - alpha_v1',
        broker: 'tradeify funded 1',
        timestamp: '06/24/2026 10:50:00.381 AM EDT',
        latency: '260ms',
        status: 'Completed',
        fills: '2 / 2',
        mode: 'Paper',
    },
    {
        id: 'evt-006',
        action: 'Flat',
        symbol: 'MESU2026',
        price: '$7,479.60',
        assetClass: 'Futures',
        strategy: 'ALPHA_V1',
        webhook: '**8edf',
        account: 'funded 2 - alpha_v1',
        broker: 'apex funded 2',
        timestamp: '06/23/2026 09:57:10.479 AM EDT',
        latency: '265ms',
        status: 'Completed',
        fills: '2 / 2',
        mode: 'Live',
    },
];

const darkToast = {
    style: {
        background: '#233744',
        border: '1px solid #34505f',
        color: '#f8fafc',
        boxShadow: '0 8px 24px rgba(15, 31, 46, 0.28)',
    },
    classNames: {
        title: '!text-[#f8fafc]',
        description: '!text-[#a9b5c1]',
    },
};

interface SignalTrade {
    account: string;
    reference: string;
    latency: string;
}

const SIGNAL_ID = '22f123bd-3bd7-4fcf-95a8-1f0c7a2e93d1';
const SIGNAL_USER_AGENT = 'Python/3.12 aiohttp';
const SIGNAL_IP_ADDRESS = 'IPv4 143.110.148.234';

function buildSignalTrades(row: ActivityRow): SignalTrade[] {
    return [
        {
            account: 'jeff.gtbn',
            reference: 'PAAPEX3253070000016 (48617990)',
            latency: row.latency,
        },
        {
            account: 'jeff.gtbn',
            reference: 'FTDFYL100481088047 (52668608)',
            latency: '192ms',
        },
    ];
}

function buildSignalPayload(row: ActivityRow): string {
    const payload: Record<string, string> = {
        ticker: row.symbol.slice(0, 3),
        action: row.action.toLowerCase(),
    };
    if (row.price) {
        payload.price = row.price.replace(/[$,]/g, '');
    }
    return JSON.stringify(payload, null, 4);
}

function CheckboxMark({ className = '' }: { className?: string }) {
    return (
        <div
            className={`h-[18px] w-[18px] rounded border border-[#e1e6ee] bg-white ${className}`}
        />
    );
}

interface ActivityFilters {
    activityId: string;
    activityType: string;
    dateRange: string;
    broker: string;
    strategy: string;
    subscription: string;
    ticker: string;
    webhook: string;
    status: string;
    mode: string;
    assetClass: string;
}

const defaultActivityFilters: ActivityFilters = {
    activityId: '',
    activityType: 'All',
    dateRange: 'All',
    broker: 'All',
    strategy: 'All',
    subscription: 'All',
    ticker: '',
    webhook: '',
    status: 'All',
    mode: 'All',
    assetClass: 'All',
};

function FieldInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}) {
    return (
        <input
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChange(event.target.value)
            }
            placeholder={placeholder}
            className="flex h-9 w-full rounded-md border border-[#e1e6ee] bg-white px-2.5 text-[13px] text-[#0f1f2e] outline-none transition-colors placeholder:text-[#a9b5c1] focus:border-[#3b82dc] focus:ring-2 focus:ring-[#3b82dc]/10"
        />
    );
}

function FieldSelect({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    onChange(event.target.value)
                }
                className="flex h-9 w-full appearance-none rounded-md border border-[#e1e6ee] bg-white px-2.5 pr-8 text-[13px] text-[#0f1f2e] outline-none transition-colors focus:border-[#3b82dc] focus:ring-2 focus:ring-[#3b82dc]/10">
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={16}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5f7a8c]"
            />
        </div>
    );
}

function SegmentedControl({
    options,
    value,
    onChange,
}: {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}) {
    const columnClass = options.length === 4 ? 'grid-cols-4' : 'grid-cols-3';

    return (
        <div
            className={`grid ${columnClass} gap-[3px] rounded-md border border-[#e1e6ee] bg-[#f0f2f5] p-[3px]`}>
            {options.map((option) => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(option)}
                    className={[
                        'min-h-8 rounded-[5px] border-0 px-2 text-xs font-medium',
                        value === option
                            ? 'bg-white text-[#0f1f2e] shadow-[0_1px_2px_rgba(15,31,46,0.12)]'
                            : 'bg-transparent text-[#5f7a8c]',
                    ].join(' ')}>
                    {option}
                </button>
            ))}
        </div>
    );
}

interface SetupStep {
    icon: LucideIcon;
    title: string;
    description: string;
    complete: boolean;
}

const setupSteps: SetupStep[] = [
    {
        icon: Link2,
        title: 'Connect broker',
        description: 'Connect a paper or live broker account to get started.',
        complete: true,
    },
    {
        icon: HelpCircle,
        title: 'Complete your profile',
        description:
            'Answer a few questions to help us understand your needs better.',
        complete: true,
    },
    {
        icon: Shuffle,
        title: 'Create strategy',
        description: 'Create a new strategy to start trading.',
        complete: true,
    },
    {
        icon: Activity,
        title: 'Subscribe to strategy',
        description: 'Subscribe to a strategy to connect it to your broker.',
        complete: true,
    },
    {
        icon: CheckCircle2,
        title: 'Enable strategy subscription',
        description: 'Enable your strategy subscription to go live.',
        complete: true,
    },
    {
        icon: Webhook,
        title: 'Submit signal',
        description: 'Submit a signal to test your strategy.',
        complete: false,
    },
    {
        icon: CreditCard,
        title: 'Upgrade',
        description: 'Upgrade to a paid plan for live auto trading.',
        complete: true,
    },
];

const brokerColors = [
    '#2f6df6',
    '#f5b301',
    '#f5732a',
    '#3aa85f',
    '#3b82dc',
    '#e8401f',
    '#1d4ed8',
    '#7c3aed',
    '#cf403b',
    '#f59e0b',
    '#8b5cf6',
    '#e0b400',
];

function SetupStepRow({ step, isLast }: { step: SetupStep; isLast: boolean }) {
    const StepIcon = step.complete ? step.icon : X;

    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div
                    className={[
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white',
                        step.complete ? 'bg-[#22b35e]' : 'bg-[#f5a623]',
                    ].join(' ')}>
                    <StepIcon size={16} strokeWidth={2.4} />
                </div>
                {!isLast && <div className="my-1 w-px flex-1 bg-[#e1e6ee]" />}
            </div>

            <div className={isLast ? '' : 'pb-5'}>
                <div className="flex items-center gap-1.5">
                    <span
                        className={[
                            'text-[13px] font-semibold uppercase tracking-[0.03em]',
                            step.complete ? 'text-[#1f2c38]' : 'text-[#e0922a]',
                        ].join(' ')}>
                        {step.title}
                    </span>
                    <ChevronRight size={15} className="text-[#a9b5c1]" />
                </div>
                <p className="mt-0.5 max-w-[300px] text-[13px] leading-snug text-[#5f7a8c]">
                    {step.description}
                </p>
            </div>
        </div>
    );
}

function FlowArrow() {
    return (
        <div className="flex justify-center py-2">
            <ArrowDown size={22} className="text-[#a9b5c1]" />
        </div>
    );
}

function FlowDiagram() {
    const providers = [CandlestickChart, Network, Terminal];

    return (
        <div className="flex flex-col items-center px-6 py-8">
            <div className="flex items-center gap-3">
                {providers.map((Icon, index) => (
                    <div
                        key={index}
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-[#dbe2ec] bg-white text-[#1f2c38]">
                        <Icon size={24} />
                    </div>
                ))}
            </div>
            <div className="mt-2 text-[13px] font-medium text-[#5f7a8c]">
                TradingView &amp; TrendSpider &amp; More
            </div>

            <FlowArrow />

            <div className="w-full max-w-[320px] rounded-xl border-2 border-[#bcd9f6] bg-[#f5faff] px-6 py-5">
                <div className="flex items-center justify-center gap-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-[#3b82dc]">
                        <TrendingUp
                            size={13}
                            strokeWidth={2.6}
                            className="text-white"
                        />
                    </div>
                    <span className="text-[15px] font-semibold text-[#1f2c38]">
                        TradersPost
                    </span>
                </div>

                <div className="mt-3 flex justify-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3b82dc]">
                        <Webhook size={20} className="text-white" />
                    </div>
                </div>
                <div className="mt-1.5 text-center text-[13px] font-semibold text-[#3b82dc]">
                    Strategy Webhook
                </div>

                <div className="flex justify-center py-1.5">
                    <ArrowDown size={20} className="text-[#9bbfe8]" />
                </div>

                <div className="flex justify-center gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82dc]">
                            <User size={16} className="text-white" />
                        </div>
                    ))}
                </div>
                <div className="mt-1.5 text-center text-[13px] font-semibold text-[#3b82dc]">
                    Subscriptions
                </div>
            </div>

            <FlowArrow />

            <div className="grid grid-cols-4 gap-3">
                {brokerColors.map((color, index) => (
                    <div
                        key={index}
                        className="h-11 w-11 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>
            <div className="mt-2 text-[13px] font-medium text-[#5f7a8c]">
                Brokers
            </div>
        </div>
    );
}

function SetupWizardModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    useEffect(() => {
        if (!open) {
            return;
        }
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f2e]/55 p-4 font-['Satoshi',sans-serif]"
            onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Setup Steps"
                onClick={(event) => event.stopPropagation()}
                className="flex max-h-[90vh] w-full max-w-[1180px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="flex items-start gap-3 px-6 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1f2c38] text-white">
                        <Settings size={18} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-[19px] font-bold text-[#0f1f2e]">
                            Setup Steps
                        </h2>
                        <p className="text-[13px] text-[#5f7a8c]">
                            Follow these steps to complete your account setup
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-8 w-8 items-center justify-center rounded-md text-[#5f7a8c] transition-colors hover:bg-[#f0f2f5] hover:text-[#0f1f2e]">
                        <X size={20} />
                    </button>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[420px_1fr]">
                    <div className="flex min-h-0 flex-col border-t border-[#e1e6ee] md:border-r">
                        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                            {setupSteps.map((step, index) => (
                                <SetupStepRow
                                    key={step.title}
                                    step={step}
                                    isLast={index === setupSteps.length - 1}
                                />
                            ))}
                        </div>
                        <div className="border-t border-[#e1e6ee] p-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full rounded-md bg-[#1f2c38] py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#28384a]">
                                Hide the setup wizard
                            </button>
                        </div>
                    </div>

                    <div className="min-h-0 overflow-y-auto border-t border-[#e1e6ee]">
                        <div className="border-b border-[#e1e6ee] px-6 py-5 text-center">
                            <h3 className="text-[18px] font-bold text-[#0f1f2e]">
                                How Automated Trading Works in TradersPost
                            </h3>
                            <p className="mx-auto mt-1.5 max-w-[520px] text-[13px] leading-snug text-[#5f7a8c]">
                                This shows how signals move through TradersPost from
                                signal providers like TradingView and TrendSpider to
                                your broker for execution.
                            </p>
                        </div>
                        <FlowDiagram />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Sidebar() {
    const [setupOpen, setSetupOpen] = useState(false);

    return (
        <aside className="sticky top-0 flex h-screen w-[208px] min-w-[208px] flex-col bg-[#233744] text-[#d2d5db]">
            <div className="border-b border-[#202937] px-3.5 py-3">
                <div className="flex items-center justify-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-[#3b82dc]">
                        <TrendingUp size={15} strokeWidth={2.6} className="text-white" />
                    </div>
                    <span className="text-lg font-semibold tracking-[-0.02em] text-white">
                        TradersPost<span className="text-[#63c0fa]">Mock</span>
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setSetupOpen(true)}
                className="mx-3 my-2.5 flex items-center gap-2.5 rounded-md py-1.5 text-left transition-colors hover:bg-[#1E2938]">
                <span className="rounded-[5px] border border-[#4fc660] bg-[#f3fdf5] px-2 py-[3px] text-xs font-medium text-[#4fc660]">
                    6/7
                </span>
                <span className="text-[13px] font-normal text-[#9ba1ae]">Setup</span>
                <ChevronDown size={16} className="ml-auto text-[#9ba1ae]" />
            </button>

            <SetupWizardModal
                open={setupOpen}
                onClose={() => setSetupOpen(false)}
            />

            <nav className="flex-1 overflow-y-auto">
                {navSections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        {section.items.map((item) => {
                            const content = () => (
                                <>
                                    <div className="relative flex shrink-0">
                                        <item.icon size={18} strokeWidth={2.2} />
                                        {item.badge && (
                                            <span className="absolute -right-[5px] -top-[5px] h-3 w-3 rounded-full border-2 border-[#273643] bg-[#ef4444]" />
                                        )}
                                    </div>
                                    <span
                                        className="flex-1 whitespace-nowrap text-[13px] font-medium tracking-[0.01em]">
                                        {item.label}
                                    </span>
                                    {item.chevron && (
                                        <ChevronRight
                                            size={16}
                                            className="text-[#d2d5db]"
                                        />
                                    )}
                                </>
                            );

                            const baseClass =
                                'flex h-[38px] cursor-pointer items-center gap-2.5 px-3.5 transition-colors';

                            if (!item.path) {
                                return (
                                    <div
                                        key={item.label}
                                        className={`${baseClass} bg-transparent text-[#d2d5db]`}>
                                        {content()}
                                    </div>
                                );
                            }

                            return (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        [
                                            baseClass,
                                            isActive
                                                ? 'bg-[#3b82dc] text-white'
                                                : 'bg-transparent text-[#ebedf0] hover:bg-[#1E2938]',
                                        ].join(' ')
                                    }>
                                    {() => content()}
                                </NavLink>
                            );
                        })}
                        {sectionIndex < navSections.length - 1 && (
                            <div className="my-[9px] h-px bg-[#202937]" />
                        )}
                    </div>
                ))}
            </nav>

            <div className="border-t border-[#202937] px-3 pb-0 pt-3.5">
                <div className="mb-3.5 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#33404e] text-[13px] font-medium text-white">
                        J
                    </div>
                    <span className="flex-1 text-[13px] font-normal text-white">
                        jeff.gtbn
                    </span>
                    <Eye size={16} className="text-[#3b82dc]" />
                    <Lock size={16} className="text-white" />
                </div>

                <div className="mb-4">
                    <div className="mb-2 text-[13px] font-medium text-white">
                        Your Starter Plan
                    </div>
                    <div className="flex justify-between">
                        {[
                            { label: 'Live', value: '0 / 1' },
                            { label: 'Paper', value: '3 / 4' },
                            { label: 'Asset', value: '1 / 1' },
                        ].map((item) => {
                            const [current, total] = item.value.split(' / ');
                            return (
                                <div key={item.label}>
                                    <div className="text-[11px] font-normal text-[#9ba1ae]">
                                        {item.label}
                                    </div>
                                    <div className="text-[13px] font-normal text-[#9ba1ae]">
                                        <span className="font-medium text-[#63c0fa]">
                                            {current}
                                        </span>{' '}
                                        / {total}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button className="mb-2.5 flex w-full items-center justify-center gap-2.5 rounded-[7px] border border-[#445262] bg-[#33404e] px-2.5 py-2.5 text-[13px] font-normal text-white">
                    <Plus size={16} />
                    Add More Brokers
                </button>
                <button className="mb-3.5 flex w-full items-center justify-center gap-2.5 rounded-[7px] bg-[#3b82dc] px-2.5 py-2.5 text-[13px] font-normal text-white">
                    <Sparkles size={16} />
                    Upgrade to Basic
                </button>

                <div className="-mx-3 flex justify-center gap-10 border-t border-[#202937] px-3 py-3.5 pb-4">
                    {[
                        { icon: LifeBuoy, label: 'Support' },
                        { icon: BookOpen, label: 'Docs' },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex cursor-pointer items-center gap-1.5 text-[13px] font-normal text-[#9ba1ae]">
                            <item.icon size={15} />
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

function uniqueOptions(values: string[]) {
    return ['All', ...Array.from(new Set(values))];
}

function ActivityFilterPanel({
    filters,
    onFilterChange,
    onClear,
}: {
    filters: ActivityFilters;
    onFilterChange: <K extends keyof ActivityFilters>(
        key: K,
        value: ActivityFilters[K],
    ) => void;
    onClear: () => void;
}) {
    const activityTypes = ['All', 'Buy', 'Exit', 'Cancel', 'Flat', 'Sell', 'Test'];
    const dateRanges = ['All', 'Today', 'Yesterday', 'Last 7 days', 'Older'];
    const brokers = uniqueOptions([
        ...activityRows.map((row) => row.broker),
        'Test broker',
    ]);
    const strategies = uniqueOptions([
        ...activityRows.map((row) => row.strategy),
        ...strategyItems.map((strategy) => strategy.name),
        'BETA_TEST',
    ]);
    const subscriptions = uniqueOptions([
        ...activityRows.map((row) => row.account),
        'demo subscription',
    ]);
    const statuses = ['All', 'Completed', 'Rejected', 'Pending', 'Test status'];

    return (
        <aside className="w-[292px] min-w-[292px] self-start overflow-hidden rounded border border-[#e1e6ee] bg-white">
            <div className="flex h-[42px] items-center gap-2.5 border-b border-[#e1e6ee] px-3">
                <Search size={18} className="text-[#667085]" />
                <span className="text-[13px] font-medium tracking-[0.02em] text-[#0f1f2e]">
                    SEARCH
                </span>
            </div>
            <div className="grid gap-3 p-3">
                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Activity ID
                    </span>
                    <FieldInput
                        value={filters.activityId}
                        onChange={(value) => onFilterChange('activityId', value)}
                        placeholder="evt-001"
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Activity type
                    </span>
                    <FieldSelect
                        value={filters.activityType}
                        onChange={(value) => onFilterChange('activityType', value)}
                        options={activityTypes}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Date range
                    </span>
                    <FieldSelect
                        value={filters.dateRange}
                        onChange={(value) => onFilterChange('dateRange', value)}
                        options={dateRanges}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Connected broker
                    </span>
                    <FieldSelect
                        value={filters.broker}
                        onChange={(value) => onFilterChange('broker', value)}
                        options={brokers}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Strategy
                    </span>
                    <FieldSelect
                        value={filters.strategy}
                        onChange={(value) => onFilterChange('strategy', value)}
                        options={strategies}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Strategy subscription
                    </span>
                    <FieldSelect
                        value={filters.subscription}
                        onChange={(value) => onFilterChange('subscription', value)}
                        options={subscriptions}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Ticker
                    </span>
                    <FieldInput
                        value={filters.ticker}
                        onChange={(value) => onFilterChange('ticker', value)}
                        placeholder="MESU2026"
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Webhook URL
                    </span>
                    <FieldInput
                        value={filters.webhook}
                        onChange={(value) => onFilterChange('webhook', value)}
                        placeholder="8edf"
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Status
                    </span>
                    <FieldSelect
                        value={filters.status}
                        onChange={(value) => onFilterChange('status', value)}
                        options={statuses}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">Mode</span>
                    <SegmentedControl
                        options={['All', 'Live', 'Paper']}
                        value={filters.mode}
                        onChange={(value) => onFilterChange('mode', value)}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Asset class
                    </span>
                    <SegmentedControl
                        options={['All', 'Stocks', 'Options', 'Futures']}
                        value={filters.assetClass}
                        onChange={(value) => onFilterChange('assetClass', value)}
                    />
                </label>

                <button
                    type="button"
                    onClick={onClear}
                    className="mt-1 h-9 rounded-md border border-[#e1e6ee] bg-white text-xs font-medium text-[#5f7a8c] transition-colors hover:border-[#c8d2df] hover:text-[#0f1f2e]">
                    Clear search
                </button>
            </div>
        </aside>
    );
}

function ActivityRowItem({ row }: { row: ActivityRow }) {
    const [expanded, setExpanded] = useState(false);
    const actionClass = row.action === 'Buy' ? 'text-[#43a054]' : 'text-[#cf403b]';
    const isCompleted = row.status === 'Completed';

    const copyWebhook = async (event: ReactMouseEvent) => {
        event.stopPropagation();
        await copyWebhookToClipboard(row.webhook);
    };

    return (
        <div className="border-t border-[#e1e6ee] bg-white">
            <div
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setExpanded((value) => !value);
                    }
                }}
                className="grid min-h-[78px] cursor-pointer grid-cols-[24px_minmax(190px,1fr)_minmax(220px,0.95fr)_96px_18px] items-center gap-3 px-3.5 py-3.5 transition-colors hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#3b82dc]/30">
                <CheckboxMark />

                <div className="min-w-0">
                    <div className="mb-1 flex items-baseline gap-1.5">
                        <span className={`text-[15px] font-medium ${actionClass}`}>
                            {row.action}
                        </span>
                        {row.price && (
                            <span className="text-xs text-[#7b8494]">@ {row.price}</span>
                        )}
                    </div>
                    <div className="text-[15px] font-medium leading-tight text-[#111827]">
                        {row.symbol}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5f7a8c]">
                        <MetaItem icon={BarChart2}>{row.assetClass}</MetaItem>
                        <MetaItem icon={Shuffle}>{row.strategy}</MetaItem>
                        <button
                            type="button"
                            onClick={copyWebhook}
                            className="flex items-center gap-1.5 rounded-sm text-left text-xs font-normal leading-none text-[#5f7a8c] transition-colors hover:text-[#0f1f2e] hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82dc]/30"
                            aria-label={`Copy webhook URL ${row.webhook}`}>
                            <Webhook size={14} className="text-[#a0adba]" />
                            {row.webhook}
                        </button>
                    </div>
                </div>

                <div className="min-w-0 text-right text-xs text-[#7b8494]">
                    <a className="cursor-pointer text-[13px] underline decoration-dashed underline-offset-4">
                        {row.timestamp}
                    </a>
                    <div className="mt-1 truncate">
                        {row.broker} · {row.latency}
                    </div>
                </div>

                <div className="grid min-w-0 justify-items-end gap-1">
                    <div
                        className={`flex items-center gap-1.5 whitespace-nowrap text-[15px] font-medium ${isCompleted ? 'text-[#43a054]' : 'text-[#ff9800]'}`}>
                        {isCompleted ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
                        <span>{row.fills}</span>
                    </div>
                    <div
                        className={`text-sm font-medium ${isCompleted ? 'text-[#43a054]' : 'text-[#ff9800]'}`}>
                        {row.status}
                    </div>
                </div>

                <ChevronRight
                    size={20}
                    className={`text-[#7b8494] transition-transform duration-300 ease-in-out ${expanded ? 'rotate-90' : ''}`}
                />
            </div>

            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}>
                <div className="overflow-hidden">
                    <ActivityRowDetail row={row} />
                </div>
            </div>
        </div>
    );
}

function DetailPanel({
    icon: Icon,
    title,
    action,
    children,
}: {
    icon: LucideIcon;
    title: string;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-md border border-[#e1e6ee] bg-white">
            <div className="flex h-9 items-center gap-2 border-b border-[#eef1f5] px-3">
                <Icon size={15} className="text-[#667085]" />
                <span className="text-[11px] font-semibold tracking-[0.06em] text-[#5f7a8c]">
                    {title}
                </span>
                {action && <div className="ml-auto flex items-center">{action}</div>}
            </div>
            <div className="px-3 py-2">{children}</div>
        </div>
    );
}

function DetailRow({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: ReactNode;
    mono?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-[#f2f4f7] py-2 last:border-b-0">
            <span className="text-xs text-[#5f7a8c]">{label}</span>
            <span
                className={`min-w-0 truncate text-right text-[13px] text-[#0f1f2e] ${mono ? 'font-mono' : ''}`}>
                {value}
            </span>
        </div>
    );
}

function ActivityRowDetail({ row }: { row: ActivityRow }) {
    const isCompleted = row.status === 'Completed';
    const trades = buildSignalTrades(row);
    const signalJson = buildSignalPayload(row);

    const copySignal = async () => {
        try {
            await navigator.clipboard.writeText(signalJson);
            toast('Signal copied', { duration: 1400, ...darkToast });
        } catch {
            toast.error('Unable to copy signal', { duration: 1600 });
        }
    };

    return (
        <div className="border-t border-[#e1e6ee] bg-[#f7f8fa] px-3.5 py-3.5">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="space-y-3">
                    <DetailPanel
                        icon={Radio}
                        title="SIGNAL"
                        action={
                            <button
                                type="button"
                                onClick={copySignal}
                                className="flex items-center gap-1.5 rounded-[5px] border border-[#e1e6ee] bg-white px-2 py-1 text-[11px] font-medium text-[#5f7a8c] transition-colors hover:border-[#c8d2df] hover:text-[#0f1f2e]">
                                <Copy size={13} />
                                Copy
                            </button>
                        }>
                        <pre className="overflow-x-auto rounded bg-[#f5f7f9] p-2.5 font-mono text-[12px] leading-relaxed text-[#0f1f2e]">
                            {signalJson}
                        </pre>
                    </DetailPanel>

                    <DetailPanel icon={Info} title="DETAILS">
                        <DetailRow label="Sent At" value="Not Provided" />
                        <DetailRow label="Received At" value={row.timestamp} mono />
                        <DetailRow label="Handled At" value={row.timestamp} mono />
                        <DetailRow label="Num Trades" value={trades.length} />
                        <DetailRow label="Signal ID" value={SIGNAL_ID} mono />
                        <DetailRow label="User Agent" value={SIGNAL_USER_AGENT} mono />
                        <DetailRow label="IP Address" value={SIGNAL_IP_ADDRESS} mono />
                    </DetailPanel>
                </div>

                <DetailPanel
                    icon={Repeat}
                    title="TRADES"
                    action={
                        <span
                            className={`flex items-center gap-1.5 text-[13px] font-medium ${isCompleted ? 'text-[#43a054]' : 'text-[#ff9800]'}`}>
                            {isCompleted ? (
                                <CheckCircle2 size={15} />
                            ) : (
                                <AlertCircle size={15} />
                            )}
                            {row.fills}
                        </span>
                    }>
                    <div
                        className={`mb-2.5 flex items-center justify-between rounded-md px-3 py-2 ${isCompleted ? 'bg-[#edf7ee]' : 'bg-[#fff5e8]'}`}>
                        <span
                            className={`flex items-center gap-2 text-[13px] font-medium ${isCompleted ? 'text-[#43a054]' : 'text-[#d98324]'}`}>
                            {isCompleted ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <AlertCircle size={16} />
                            )}
                            {row.status}
                        </span>
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-semibold text-[#5f7a8c]">
                            {trades.length}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {trades.map((trade) => (
                            <div
                                key={trade.reference}
                                className="flex items-center gap-3 rounded-md border border-[#eef1f5] px-3 py-2.5">
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#eef2f7]">
                                    <User size={16} className="text-[#5f7a8c]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-[13px] font-semibold text-[#111827]">
                                        {trade.account}
                                    </div>
                                    <div className="truncate font-mono text-xs text-[#5f7a8c]">
                                        {trade.reference}
                                    </div>
                                    <div className="mt-0.5 text-xs text-[#7b8494]">
                                        {isCompleted ? 'Filled' : 'Auto approved'} · {trade.latency}
                                    </div>
                                </div>
                                <ChevronRight size={16} className="shrink-0 text-[#b7c0cb]" />
                            </div>
                        ))}
                    </div>
                </DetailPanel>
            </div>
        </div>
    );
}

function ActivityList({ rows }: { rows: ActivityRow[] }) {
    return (
        <section className="min-w-[600px] flex-1 overflow-hidden rounded border border-[#e1e6ee] bg-white">
            <div className="flex h-[42px] items-center gap-2.5 px-3">
                <CheckboxMark />
                <Activity size={17} className="text-[#667085]" />
                <span className="text-[13px] font-medium tracking-[0.02em] text-[#0f1f2e]">
                    ACTIVITY
                </span>
                <button className="ml-auto flex h-8 items-center gap-[7px] rounded-[5px] border border-[#e1e6ee] bg-white px-2.5 text-xs font-normal text-[#0f1f2e]">
                    <CheckCircle2 size={16} />
                    Read All
                </button>
                <button className="flex h-8 items-center gap-[7px] rounded-[5px] border border-[#e1e6ee] bg-white px-2.5 text-xs font-normal text-[#0f1f2e]">
                    <Download size={16} />
                    Export
                </button>
            </div>

            {rows.length > 0 ? (
                rows.map((row) => <ActivityRowItem key={row.id} row={row} />)
            ) : (
                <div className="grid min-h-[180px] place-items-center border-t border-[#e1e6ee] px-6 text-center">
                    <div>
                        <div className="text-[15px] font-medium text-[#0f1f2e]">
                            No activity found
                        </div>
                        <div className="mt-1 text-xs text-[#5f7a8c]">
                            Try a different mock option or clear the search.
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function rowMatchesDateRange(row: ActivityRow, dateRange: string) {
    if (dateRange === 'All') {
        return true;
    }

    const isToday = row.timestamp.startsWith('06/24/2026');
    const isYesterday = row.timestamp.startsWith('06/23/2026');

    if (dateRange === 'Today') {
        return isToday;
    }

    if (dateRange === 'Yesterday') {
        return isYesterday;
    }

    if (dateRange === 'Last 7 days') {
        return isToday || isYesterday;
    }

    return !isToday && !isYesterday;
}

function textIncludes(value: string, query: string) {
    return value.toLowerCase().includes(query.trim().toLowerCase());
}

function filterActivityRows(rows: ActivityRow[], filters: ActivityFilters) {
    return rows.filter((row) => {
        if (
            filters.activityId &&
            !textIncludes(row.id, filters.activityId)
        ) {
            return false;
        }

        if (filters.ticker && !textIncludes(row.symbol, filters.ticker)) {
            return false;
        }

        if (filters.webhook && !textIncludes(row.webhook, filters.webhook)) {
            return false;
        }

        if (
            filters.activityType !== 'All' &&
            row.action !== filters.activityType
        ) {
            return false;
        }

        if (filters.broker !== 'All' && row.broker !== filters.broker) {
            return false;
        }

        if (filters.strategy !== 'All' && row.strategy !== filters.strategy) {
            return false;
        }

        if (
            filters.subscription !== 'All' &&
            row.account !== filters.subscription
        ) {
            return false;
        }

        if (filters.status !== 'All' && row.status !== filters.status) {
            return false;
        }

        if (filters.mode !== 'All' && row.mode !== filters.mode) {
            return false;
        }

        if (
            filters.assetClass !== 'All' &&
            row.assetClass !== filters.assetClass
        ) {
            return false;
        }

        return rowMatchesDateRange(row, filters.dateRange);
    });
}

interface Subscription {
    id: string;
    name: string;
    symbol: string;
    contracts: number;
    pnl: number;
    enabled: boolean;
}

interface PaperAccount {
    id: string;
    name: string;
    initial: string;
    accent: 'blue' | 'slate';
    balance: number;
    pnl: number;
    pnlPercent: number;
    openLive: number;
    openTotal: number;
    subscriptions: Subscription[];
}

const paperAccounts: PaperAccount[] = [
    {
        id: 'acct-tradeify-funded-1',
        name: 'tradeify funded 1',
        initial: 'T',
        accent: 'blue',
        balance: 99558.89,
        pnl: -441.11,
        pnlPercent: -0.44,
        openLive: 1,
        openTotal: 1,
        subscriptions: [
            {
                id: 'sub-ema',
                name: 'EMA 9/21 Cross',
                symbol: 'MNQ',
                contracts: 2,
                pnl: 1240.5,
                enabled: true,
            },
            {
                id: 'sub-orb',
                name: 'ORB Breakout',
                symbol: 'ES',
                contracts: 1,
                pnl: -320,
                enabled: true,
            },
        ],
    },
    {
        id: 'acct-lucid-eval-1',
        name: 'lucid eval 1',
        initial: 'M',
        accent: 'slate',
        balance: 49263.26,
        pnl: -736.74,
        pnlPercent: -1.47,
        openLive: 0,
        openTotal: 1,
        subscriptions: [
            {
                id: 'sub-vwap',
                name: 'VWAP Reversion',
                symbol: 'NQ',
                contracts: 1,
                pnl: -736.74,
                enabled: false,
            },
        ],
    },
    {
        id: 'acct-apex-2',
        name: 'apex funded 2',
        initial: 'M',
        accent: 'slate',
        balance: 51475.94,
        pnl: 1475.94,
        pnlPercent: 2.95,
        openLive: 2,
        openTotal: 2,
        subscriptions: [
            {
                id: 'sub-momentum',
                name: 'Momentum Pop',
                symbol: 'MES',
                contracts: 2,
                pnl: 980.2,
                enabled: true,
            },
            {
                id: 'sub-trend',
                name: 'Trend Rider',
                symbol: 'MNQ',
                contracts: 1,
                pnl: 495.74,
                enabled: true,
            },
        ],
    },
];

function formatCurrency(value: number) {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function formatSigned(value: number) {
    const formatted = formatCurrency(Math.abs(value));
    return value < 0 ? `-${formatted}` : `+${formatted}`;
}

function formatPercent(value: number) {
    const sign = value < 0 ? '-' : '+';
    return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function pnlColor(value: number) {
    return value < 0 ? 'text-[#cf403b]' : 'text-[#43a054]';
}

function Toggle({
    enabled,
    onToggle,
}: {
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={[
                'relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full transition-colors',
                enabled ? 'bg-[#4fc660]' : 'bg-[#cbd5e1]',
            ].join(' ')}>
            <span
                className={[
                    'inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-transform',
                    enabled ? 'translate-x-[20px]' : 'translate-x-[2px]',
                ].join(' ')}
            />
        </button>
    );
}

function AccountMetric({
    label,
    value,
    valueClass,
    caption,
}: {
    label: string;
    value: string;
    valueClass?: string;
    caption: string;
}) {
    return (
        <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a97a6]">
                {label}
            </div>
            <div
                className={`mt-1.5 text-[19px] font-semibold leading-tight ${valueClass ?? 'text-[#0f1f2e]'}`}>
                {value}
            </div>
            <div className="mt-0.5 text-xs text-[#7b8494]">{caption}</div>
        </div>
    );
}

function PaperAccountCard({
    account,
    expanded,
    onToggleExpand,
    onToggleSubscription,
}: {
    account: PaperAccount;
    expanded: boolean;
    onToggleExpand: () => void;
    onToggleSubscription: (subscriptionId: string) => void;
}) {
    const enabledCount = account.subscriptions.filter((sub) => sub.enabled).length;

    return (
        <section className="overflow-hidden rounded-lg border border-[#e1e6ee] bg-white shadow-[0_1px_2px_rgba(15,31,46,0.04)]">
            <button
                type="button"
                onClick={onToggleExpand}
                className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-[#f9fafc]">
                <div
                    className={[
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[15px] font-semibold text-white',
                        account.accent === 'blue' ? 'bg-[#3b82dc]' : 'bg-[#4a5563]',
                    ].join(' ')}>
                    {account.initial}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-[#5f7a8c]">
                        {account.name}
                    </div>
                    <div className="text-[22px] font-bold leading-tight text-[#0f1f2e]">
                        {formatCurrency(account.balance)}
                    </div>
                </div>

                <div className="text-right">
                    <div className={`text-[17px] font-semibold ${pnlColor(account.pnl)}`}>
                        {formatSigned(account.pnl)}
                    </div>
                    <div className={`text-[13px] font-medium ${pnlColor(account.pnl)}`}>
                        {formatPercent(account.pnlPercent)}
                    </div>
                </div>

                <div className="ml-1 flex items-center gap-1.5 rounded-md border border-[#e1e6ee] bg-[#f5f7fa] px-2 py-1 text-[13px] font-medium text-[#5f7a8c]">
                    <Repeat size={13} />
                    {account.openLive}
                </div>

                <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#7b8494] transition-transform duration-300 ease-in-out ${
                        expanded ? 'rotate-180' : ''
                    }`}
                />
            </button>

            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}>
                <div className="overflow-hidden">
                    <div className="border-t border-[#e1e6ee]">
                    <div className="grid grid-cols-2 gap-y-5 bg-[#fafbfc] px-4 py-4 sm:grid-cols-4">
                        <AccountMetric
                            label="Total P&L"
                            value={formatSigned(account.pnl)}
                            valueClass={pnlColor(account.pnl)}
                            caption={formatPercent(account.pnlPercent)}
                        />
                        <AccountMetric
                            label="Balance"
                            value={formatCurrency(account.balance)}
                            caption="Account equity"
                        />
                        <AccountMetric
                            label="Active strategies"
                            value={`${enabledCount}`}
                            caption="Enabled / linked"
                        />
                        <AccountMetric
                            label="Open positions"
                            value={`${account.openLive}`}
                            caption="Live in market"
                        />
                    </div>

                    <div className="px-4 pb-4 pt-1">
                        <div className="flex items-center justify-between py-2.5">
                            <span className="text-[13px] font-semibold text-[#0f1f2e]">
                                Strategies
                            </span>
                            <span className="text-xs text-[#7b8494]">
                                {account.subscriptions.length} linked to this account
                            </span>
                        </div>

                        {account.subscriptions.map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center gap-3 border-t border-[#eef1f5] py-3">
                                <span
                                    className={[
                                        'h-2 w-2 shrink-0 rounded-full',
                                        sub.enabled ? 'bg-[#43a054]' : 'bg-[#cbd5e1]',
                                    ].join(' ')}
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[14px] font-medium text-[#0f1f2e]">
                                        {sub.name}
                                    </div>
                                    <div className="text-xs text-[#7b8494]">
                                        {sub.symbol} · {sub.contracts} contract
                                        {sub.contracts === 1 ? '' : 's'}
                                    </div>
                                </div>
                                <span
                                    className={`text-[14px] font-semibold ${pnlColor(sub.pnl)}`}>
                                    {formatSigned(sub.pnl)}
                                </span>
                                <Toggle
                                    enabled={sub.enabled}
                                    onToggle={() => onToggleSubscription(sub.id)}
                                />
                                <button
                                    type="button"
                                    className="text-[#a9b5c1] transition-colors hover:text-[#cf403b]"
                                    aria-label={`Remove ${sub.name}`}>
                                    <X size={17} />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="mt-3 flex items-center gap-2 rounded-md bg-[#3b82dc] px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#3375c8]">
                            <Plus size={16} />
                            Add strategy
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DashboardPage() {
    const [accounts, setAccounts] = useState<PaperAccount[]>(paperAccounts);
    const [expandedId, setExpandedId] = useState<string | null>(
        paperAccounts[0]?.id ?? null,
    );

    const toggleSubscription = (accountId: string, subscriptionId: string) => {
        setAccounts((current) =>
            current.map((account) =>
                account.id !== accountId
                    ? account
                    : {
                          ...account,
                          subscriptions: account.subscriptions.map((sub) =>
                              sub.id === subscriptionId
                                  ? { ...sub, enabled: !sub.enabled }
                                  : sub,
                          ),
                      },
            ),
        );
    };

    return (
        <div className="mx-auto w-full max-w-[840px] p-5">
            <h1 className="text-[24px] font-bold tracking-[-0.01em] text-[#0f1f2e]">
                Paper Accounts
            </h1>
            <p className="mt-1 text-[13px] text-[#5f7a8c]">
                Click any account to expand it in place — manage subscriptions and see
                metrics without leaving the list.
            </p>

            <div className="mt-5 grid gap-3">
                {accounts.map((account) => (
                    <PaperAccountCard
                        key={account.id}
                        account={account}
                        expanded={expandedId === account.id}
                        onToggleExpand={() =>
                            setExpandedId((current) =>
                                current === account.id ? null : account.id,
                            )
                        }
                        onToggleSubscription={(subscriptionId) =>
                            toggleSubscription(account.id, subscriptionId)
                        }
                    />
                ))}
            </div>
        </div>
    );
}

interface StrategyItem {
    id: string;
    name: string;
    assetClass: 'Stocks' | 'Options' | 'Futures';
    description: string;
    tickers: string[];
    webhook: string;
    enabled: boolean;
    autoSubmit: boolean;
    accountCount: number;
    allowAnyTicker: boolean;
    thirdParty: boolean;
    order: number;
}

const strategyItems: StrategyItem[] = [
    {
        id: 'strat-alpha-v1',
        name: 'ALPHA_V1',
        assetClass: 'Futures',
        description: 'Take long side on 3 tickers',
        tickers: ['MESU2026', 'MNQU2026', 'MGCQ2026'],
        webhook: '**2721',
        enabled: true,
        autoSubmit: true,
        accountCount: 0,
        allowAnyTicker: false,
        thirdParty: false,
        order: 2,
    },
    {
        id: 'strat-beta-v2',
        name: 'BETA_V2',
        assetClass: 'Futures',
        description: 'Take long side on 3 tickers',
        tickers: ['MESU2026', 'MNQU2026', 'MGCQ2026'],
        webhook: '**8edf',
        enabled: true,
        autoSubmit: true,
        accountCount: 2,
        allowAnyTicker: true,
        thirdParty: false,
        order: 1,
    },
];

interface StrategyFilters {
    name: string;
    ticker: string;
    webhook: string;
    strategy: string;
    thirdParty: boolean;
    allowAnyTicker: string;
    assetClass: string;
    enabled: string;
    sortOrder: string;
}

const defaultStrategyFilters: StrategyFilters = {
    name: '',
    ticker: '',
    webhook: '',
    strategy: 'All',
    thirdParty: false,
    allowAnyTicker: 'Both',
    assetClass: 'All',
    enabled: 'Both',
    sortOrder: 'Default',
};

function matchesTriState(flag: boolean, value: string) {
    if (value === 'Both') {
        return true;
    }
    return value === 'Yes' ? flag : !flag;
}

function tickersMatch(tickers: string[], query: string) {
    if (!query.trim()) {
        return true;
    }
    return tickers.some((ticker) => textIncludes(ticker, query));
}

function StrategyFilterPanel({
    filters,
    onFilterChange,
    onClear,
}: {
    filters: StrategyFilters;
    onFilterChange: <K extends keyof StrategyFilters>(
        key: K,
        value: StrategyFilters[K],
    ) => void;
    onClear: () => void;
}) {
    const strategies = uniqueOptions(
        strategyItems.map((strategy) => strategy.name),
    );

    return (
        <aside className="w-[292px] min-w-[292px] self-start overflow-hidden rounded border border-[#e1e6ee] bg-white">
            <div className="flex h-[42px] items-center gap-2.5 border-b border-[#e1e6ee] px-3">
                <Search size={18} className="text-[#667085]" />
                <span className="text-[13px] font-medium tracking-[0.02em] text-[#0f1f2e]">
                    SEARCH
                </span>
            </div>
            <div className="grid gap-3 p-3">
                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Name
                    </span>
                    <FieldInput
                        value={filters.name}
                        onChange={(value) => onFilterChange('name', value)}
                        placeholder="ALPHA_V1"
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Strategy
                    </span>
                    <FieldSelect
                        value={filters.strategy}
                        onChange={(value) => onFilterChange('strategy', value)}
                        options={strategies}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Ticker
                    </span>
                    <FieldInput
                        value={filters.ticker}
                        onChange={(value) => onFilterChange('ticker', value)}
                        placeholder="MESU2026"
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Webhook URL
                    </span>
                    <FieldInput
                        value={filters.webhook}
                        onChange={(value) => onFilterChange('webhook', value)}
                        placeholder="8edf"
                    />
                </label>

                <label className="flex cursor-pointer items-center gap-2.5">
                    <button
                        type="button"
                        role="checkbox"
                        aria-checked={filters.thirdParty}
                        onClick={() =>
                            onFilterChange('thirdParty', !filters.thirdParty)
                        }
                        className={[
                            'flex h-[18px] w-[18px] items-center justify-center rounded border transition-colors',
                            filters.thirdParty
                                ? 'border-[#3b82dc] bg-[#3b82dc] text-white'
                                : 'border-[#e1e6ee] bg-white text-transparent',
                        ].join(' ')}>
                        <CheckCircle2 size={13} />
                    </button>
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Third party strategies
                    </span>
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Asset class
                    </span>
                    <SegmentedControl
                        options={['All', 'Stocks', 'Options', 'Futures']}
                        value={filters.assetClass}
                        onChange={(value) => onFilterChange('assetClass', value)}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Allow any ticker
                    </span>
                    <SegmentedControl
                        options={['Both', 'Yes', 'No']}
                        value={filters.allowAnyTicker}
                        onChange={(value) =>
                            onFilterChange('allowAnyTicker', value)
                        }
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Enabled
                    </span>
                    <SegmentedControl
                        options={['Both', 'Yes', 'No']}
                        value={filters.enabled}
                        onChange={(value) => onFilterChange('enabled', value)}
                    />
                </label>

                <label className="grid gap-[7px]">
                    <span className="text-[13px] font-normal text-[#0f1f2e]">
                        Sort order
                    </span>
                    <SegmentedControl
                        options={['Default', 'Name (A-Z)', 'Newest First']}
                        value={filters.sortOrder}
                        onChange={(value) => onFilterChange('sortOrder', value)}
                    />
                </label>

                <button
                    type="button"
                    onClick={onClear}
                    className="mt-1 h-9 rounded-md border border-[#e1e6ee] bg-white text-xs font-medium text-[#5f7a8c] transition-colors hover:border-[#c8d2df] hover:text-[#0f1f2e]">
                    Clear search
                </button>
            </div>
        </aside>
    );
}

function StatusBadge({
    icon: Icon,
    label,
    tone,
}: {
    icon: LucideIcon;
    label: string;
    tone: 'green' | 'blue' | 'muted';
}) {
    const tones = {
        green: 'border-[#bfe6c6] bg-[#f3fdf5] text-[#3a9d4e]',
        blue: 'border-[#bcd9f6] bg-[#eef6fd] text-[#3b82dc]',
        muted: 'border-[#e1e6ee] bg-white text-[#5f7a8c]',
    };

    return (
        <span
            className={`flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium ${tones[tone]}`}>
            <Icon size={14} />
            {label}
        </span>
    );
}

function CardAction({
    icon: Icon,
    label,
    onClick,
}: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-8 items-center gap-1.5 rounded-[6px] border border-[#e1e6ee] bg-white px-2.5 text-[13px] font-medium text-[#0f1f2e] transition-colors hover:bg-[#f9fafc]">
            <Icon size={15} className="text-[#5f7a8c]" />
            {label}
        </button>
    );
}

function MetaItem({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
    return (
        <span className="flex items-center gap-1.5">
            <Icon size={14} className="text-[#a0adba]" />
            {children}
        </span>
    );
}

async function copyWebhookToClipboard(webhook: string) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(webhook);
        } else if (!copyTextWithSelection(webhook)) {
            throw new Error('Clipboard copy failed');
        }
        toast('Webhook copied', {
            description: webhook,
            duration: 1600,
            style: {
                background: '#233744',
                border: '1px solid #34505f',
                color: '#f8fafc',
                boxShadow: '0 8px 24px rgba(15, 31, 46, 0.28)',
            },
            classNames: {
                title: '!text-[#f8fafc]',
                description: '!text-[#a9b5c1]',
            },
        });
    } catch {
        toast.error('Unable to copy webhook', {
            duration: 1800,
        });
    }
}

function copyTextWithSelection(value: string) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, value.length);

    try {
        return document.execCommand('copy');
    } finally {
        document.body.removeChild(textarea);
    }
}

function StrategyCardItem({ strategy }: { strategy: StrategyItem }) {
    const navigate = useNavigate();

    return (
        <div className="border-t border-[#e1e6ee] px-4 py-4">
            <div className="text-[17px] font-semibold text-[#33414f]">
                {strategy.name}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#5f7a8c]">
                <MetaItem icon={BarChart2}>{strategy.assetClass}</MetaItem>
                <MetaItem icon={SlidersHorizontal}>{strategy.description}</MetaItem>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge
                    icon={CheckCircle2}
                    label={strategy.enabled ? 'Enabled' : 'Disabled'}
                    tone={strategy.enabled ? 'green' : 'muted'}
                />
                {strategy.autoSubmit && (
                    <StatusBadge icon={Bot} label="Auto Submit" tone="blue" />
                )}
                <StatusBadge
                    icon={Link2}
                    label={`${strategy.accountCount} Account${strategy.accountCount === 1 ? '' : 's'}`}
                    tone="muted"
                />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <CardAction
                    icon={Activity}
                    label="Activity"
                    onClick={() =>
                        navigate(
                            `/activity?strategy=${encodeURIComponent(strategy.name)}`,
                        )
                    }
                />
                <CardAction
                    icon={Copy}
                    label="Copy webhook URL"
                    onClick={() => copyWebhookToClipboard(strategy.webhook)}
                />
                <CardAction icon={Plus} label="Add account" />
                <CardAction icon={SquarePen} label="Edit" />
                <button
                    type="button"
                    aria-label="More options"
                    className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#e1e6ee] bg-white text-[#5f7a8c] transition-colors hover:bg-[#f9fafc]">
                    <MoreVertical size={16} />
                </button>
            </div>
        </div>
    );
}

function CardListSection({
    icon: Icon,
    title,
    count,
    newLabel,
    emptyText,
    children,
}: {
    icon: LucideIcon;
    title: string;
    count: number;
    newLabel: string;
    emptyText: string;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded border border-[#e1e6ee] bg-white">
            <div className="flex h-[42px] items-center gap-2.5 px-3">
                <CheckboxMark />
                <Icon size={17} className="text-[#667085]" />
                <span className="text-[13px] font-medium tracking-[0.02em] text-[#0f1f2e]">
                    {title}
                </span>
                <button className="ml-auto flex h-8 items-center gap-[7px] rounded-[5px] bg-[#1f2c38] px-2.5 text-xs font-medium text-white">
                    <Plus size={15} />
                    {newLabel}
                </button>
                <button className="flex h-8 items-center gap-[7px] rounded-[5px] border border-[#e1e6ee] bg-white px-2.5 text-xs font-normal text-[#0f1f2e]">
                    <Download size={16} />
                    Export
                </button>
            </div>

            {count > 0 ? (
                children
            ) : (
                <div className="grid min-h-[140px] place-items-center border-t border-[#e1e6ee] px-6 text-center">
                    <div>
                        <div className="text-[15px] font-medium text-[#0f1f2e]">
                            {emptyText}
                        </div>
                        <div className="mt-1 text-xs text-[#5f7a8c]">
                            Try a different filter or clear the search.
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function sortByOrder<T extends { name: string; order: number }>(
    items: T[],
    sortOrder: string,
) {
    const copy = [...items];
    if (sortOrder === 'Name (A-Z)') {
        copy.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'Newest First') {
        copy.sort((a, b) => b.order - a.order);
    }
    return copy;
}

function filterStrategies(
    items: StrategyItem[],
    filters: StrategyFilters,
) {
    return items.filter((item) => {
        if (filters.strategy !== 'All' && item.name !== filters.strategy) {
            return false;
        }
        if (filters.name && !textIncludes(item.name, filters.name)) {
            return false;
        }
        if (filters.ticker && !tickersMatch(item.tickers, filters.ticker)) {
            return false;
        }
        if (filters.webhook && !textIncludes(item.webhook, filters.webhook)) {
            return false;
        }
        if (
            filters.assetClass !== 'All' &&
            item.assetClass !== filters.assetClass
        ) {
            return false;
        }
        if (!matchesTriState(item.allowAnyTicker, filters.allowAnyTicker)) {
            return false;
        }
        if (!matchesTriState(item.enabled, filters.enabled)) {
            return false;
        }
        if (filters.thirdParty && !item.thirdParty) {
            return false;
        }
        return true;
    });
}

function StrategiesPage() {
    const [filters, setFilters] = useState<StrategyFilters>(
        defaultStrategyFilters,
    );

    const filteredStrategies = useMemo(
        () => sortByOrder(filterStrategies(strategyItems, filters), filters.sortOrder),
        [filters],
    );

    const updateFilter = <K extends keyof StrategyFilters>(
        key: K,
        value: StrategyFilters[K],
    ) => {
        setFilters((current) => ({ ...current, [key]: value }));
    };

    return (
        <div className="flex min-w-0 items-start gap-2.5 p-2.5">
            <StrategyFilterPanel
                filters={filters}
                onFilterChange={updateFilter}
                onClear={() => setFilters(defaultStrategyFilters)}
            />

            <div className="grid min-w-[600px] flex-1 gap-2.5">
                <CardListSection
                    icon={Shuffle}
                    title="STRATEGIES"
                    count={filteredStrategies.length}
                    newLabel="New Strategy"
                    emptyText="No strategies found">
                    {filteredStrategies.map((strategy) => (
                        <StrategyCardItem key={strategy.id} strategy={strategy} />
                    ))}
                </CardListSection>
            </div>
        </div>
    );
}

function RoutePage({ title }: { title: string }) {
    return (
        <div className="p-2.5">
            <section className="rounded border border-[#e1e6ee] bg-white p-4">
                <h1 className="text-[18px] font-medium text-[#0f1f2e]">{title}</h1>
                <p className="mt-2 text-[13px] font-normal text-[#5f7a8c]">
                    Route placeholder for the {title.toLowerCase()} page.
                </p>
            </section>
        </div>
    );
}

function ActivityPage() {
    const [searchParams] = useSearchParams();
    const strategyParam = searchParams.get('strategy');

    const [filters, setFilters] = useState<ActivityFilters>(() =>
        strategyParam
            ? { ...defaultActivityFilters, strategy: strategyParam }
            : defaultActivityFilters,
    );

    useEffect(() => {
        if (strategyParam) {
            setFilters((current) => ({ ...current, strategy: strategyParam }));
        }
    }, [strategyParam]);

    const filteredRows = useMemo(
        () => filterActivityRows(activityRows, filters),
        [filters],
    );

    const updateFilter = <K extends keyof ActivityFilters>(
        key: K,
        value: ActivityFilters[K],
    ) => {
        setFilters((current) => ({ ...current, [key]: value }));
    };

    return (
        <div className="flex min-w-0 items-start gap-2.5 p-2.5">
            <ActivityFilterPanel
                filters={filters}
                onFilterChange={updateFilter}
                onClear={() => setFilters(defaultActivityFilters)}
            />
            <ActivityList rows={filteredRows} />
        </div>
    );
}

function Breadcrumb() {
    const location = useLocation();
    const title = routeTitles[location.pathname] ?? 'Activity';

    return (
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-[#e1e6ee] bg-white px-3 text-xs text-[#5f7a8c]">
            <Home size={14} />
            <ChevronRight size={13} />
            <span className="font-medium text-[#0f1f2e]">{title}</span>
        </div>
    );
}

function AppShell() {
    return (
        <div className="flex h-screen bg-[#f5f7fa] font-['Satoshi',sans-serif]">
            <Sidebar />

            <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                <Breadcrumb />
                <Routes>
                    <Route path="/" element={<Navigate to="/activity" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/activity" element={<ActivityPage />} />
                    <Route path="/strategies" element={<StrategiesPage />} />
                    <Route path="/brokers" element={<RoutePage title="Brokers" />} />
                    <Route path="/account" element={<RoutePage title="Account" />} />
                    <Route
                        path="/indicators"
                        element={<RoutePage title="Indicators" />}
                    />
                    <Route path="*" element={<Navigate to="/activity" replace />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppShell />
            <Toaster
                position="bottom-center"
                toastOptions={{
                    classNames: {
                        toast: 'w-auto min-w-[180px] rounded-md border border-[#d6dee8] bg-white px-3 py-2 text-sm shadow-lg',
                        title: 'text-[13px] font-medium text-[#0f1f2e]',
                        description: 'text-xs text-[#5f7a8c]',
                    },
                }}
            />
        </BrowserRouter>
    );
}
