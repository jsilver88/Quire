import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as FileText, c as ChevronLeft, i as LayoutDashboard, o as ClipboardList, r as Settings, s as ChevronRight, t as X } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-CCfCTH3C.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as eachDayOfInterval, c as startOfWeek, i as startOfMonth, l as addMonths, n as format, o as endOfMonth, r as endOfWeek, s as isSameDay, t as isSameMonth } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-oApXjZRa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonStyles = cva("inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50", {
	variants: { variant: {
		primary: "bg-ink text-paper hover:bg-ink/90",
		secondary: "border border-line bg-paper text-ink hover:bg-wash",
		ghost: "text-ink hover:bg-wash",
		danger: "text-due hover:bg-due-bg"
	} },
	defaultVariants: { variant: "secondary" }
});
function Button({ variant, className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonStyles({ variant }), className),
		...props
	});
}
var tones = {
	paid: "bg-paid-bg text-paid",
	due: "bg-due-bg text-due",
	neutral: "bg-wash text-muted"
};
function Badge({ tone, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium", tones[tone]),
		children
	});
}
function uid() {
	return crypto.randomUUID();
}
function round2(value) {
	if (!Number.isFinite(value)) return 0;
	return Math.round((value + Number.EPSILON) * 100) / 100;
}
function money(amount, currency) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(round2(amount));
}
function formatQty(value) {
	return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(round2(value));
}
function todayISO(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseISODate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y || 1970, (m || 1) - 1, d || 1);
}
function addDaysISO(iso, days) {
	const date = parseISODate(iso);
	date.setDate(date.getDate() + days);
	return todayISO(date);
}
function daysBetween(from, to) {
	const a = parseISODate(from).getTime();
	const b = parseISODate(to).getTime();
	return Math.round((b - a) / 864e5);
}
function formatPretty(iso) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "—";
	return parseISODate(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function formatLong(iso) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
	return parseISODate(iso).toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric"
	});
}
function formatAgenda(iso) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
	return parseISODate(iso).toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric"
	});
}
function stamp(iso) {
	return `${iso}T15:00:00.000Z`;
}
function invoiceTone(invoice, today) {
	if (invoice.status === "paid") return {
		label: "Paid",
		tone: "paid"
	};
	if (invoice.status === "draft") return {
		label: "Draft",
		tone: "neutral"
	};
	if (invoice.dueDate < today) return {
		label: "Overdue",
		tone: "due"
	};
	return {
		label: "Unpaid",
		tone: "neutral"
	};
}
function orderTone(order, today) {
	if (order.status === "received") return {
		label: "Received",
		tone: "paid"
	};
	if (order.status === "closed") return {
		label: "Closed",
		tone: "neutral"
	};
	if (order.status === "draft") return {
		label: "Draft",
		tone: "neutral"
	};
	if (order.expectedDate < today) return {
		label: "Overdue",
		tone: "due"
	};
	if (order.status === "scheduled") return {
		label: "Scheduled",
		tone: "neutral"
	};
	return {
		label: "Open",
		tone: "neutral"
	};
}
function invoiceOverdue(invoice, today) {
	return invoice.status === "unpaid" && invoice.dueDate < today;
}
function orderOverdue(order, today) {
	return (order.status === "open" || order.status === "scheduled") && order.expectedDate < today;
}
function orderOnSchedule(order) {
	return order.status === "open" || order.status === "scheduled" || order.status === "received";
}
function safeFilename(name) {
	return `${name.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "document"}.pdf`;
}
function lineAmount(item) {
	return round2(item.quantity * item.unitPrice);
}
function summarize(items, taxEnabled, taxRate) {
	const subtotal = round2(items.reduce((sum, item) => sum + lineAmount(item), 0));
	const tax = taxEnabled ? round2(subtotal * (taxRate / 100)) : 0;
	return {
		subtotal,
		tax,
		total: round2(subtotal + tax)
	};
}
function categoriesFor(categories, kind) {
	return categories.filter((category) => category.appliesTo === "both" || category.appliesTo === kind);
}
function categoryName(categories, id) {
	if (!id) return "Uncategorized";
	return categories.find((category) => category.id === id)?.name ?? "Uncategorized";
}
function blankLine(categories, kind) {
	const category = categoriesFor(categories, kind)[0];
	return {
		id: uid(),
		description: "",
		categoryId: category?.id ?? "",
		quantity: 1,
		unitPrice: 0
	};
}
function outstandingByCurrency(invoices, preferred) {
	const map = /* @__PURE__ */ new Map();
	for (const invoice of invoices) {
		if (invoice.status !== "unpaid") continue;
		const total = summarize(invoice.items, invoice.taxEnabled, invoice.taxRate).total;
		map.set(invoice.currency, round2((map.get(invoice.currency) ?? 0) + total));
	}
	return [...map.entries()].sort((a, b) => {
		if (a[0] === preferred) return -1;
		if (b[0] === preferred) return 1;
		return b[1] - a[1];
	});
}
function billedByCategory(invoices, categories) {
	const map = /* @__PURE__ */ new Map();
	for (const invoice of invoices) {
		if (invoice.status === "draft") continue;
		for (const item of invoice.items) {
			const key = item.categoryId || "none";
			map.set(key, round2((map.get(key) ?? 0) + lineAmount(item)));
		}
	}
	return [...map.entries()].map(([id, amount]) => ({
		id,
		name: id === "none" ? "Uncategorized" : categoryName(categories, id),
		amount
	})).filter((row) => row.amount > 0).sort((a, b) => b.amount - a.amount);
}
function blankParty() {
	return {
		name: "",
		email: "",
		address: ""
	};
}
function blankCompany() {
	return {
		name: "",
		email: "",
		phone: "",
		address: "",
		taxId: "",
		currency: "USD",
		defaultTaxRate: 0,
		invoicePrefix: "INV-",
		poPrefix: "PO-",
		nextInvoice: 1001,
		nextPo: 2001
	};
}
function blankData() {
	return {
		company: blankCompany(),
		categories: [],
		terms: [{
			id: "term_0",
			name: "Due on receipt",
			days: 0
		}, {
			id: "term_30",
			name: "Net 30",
			days: 30
		}],
		invoices: [],
		orders: [],
		bootstrapped: false,
		banner: "none"
	};
}
function buildSample(today) {
	const company = {
		name: "Northline Atelier",
		email: "hello@northline.example",
		phone: "(503) 555-0148",
		address: "412 Harbor Street, Suite 3\nPortland, OR 97214",
		taxId: "93-1842201",
		currency: "USD",
		defaultTaxRate: 0,
		invoicePrefix: "INV-",
		poPrefix: "PO-",
		nextInvoice: 1044,
		nextPo: 224
	};
	const categories = [
		{
			id: "cat_design",
			name: "Design fees",
			appliesTo: "invoice"
		},
		{
			id: "cat_site",
			name: "Site work",
			appliesTo: "both"
		},
		{
			id: "cat_materials",
			name: "Materials",
			appliesTo: "both"
		},
		{
			id: "cat_print",
			name: "Printing",
			appliesTo: "both"
		},
		{
			id: "cat_sub",
			name: "Subcontract",
			appliesTo: "both"
		},
		{
			id: "cat_freight",
			name: "Freight",
			appliesTo: "order"
		},
		{
			id: "cat_software",
			name: "Software",
			appliesTo: "invoice"
		}
	];
	const terms = [
		{
			id: "term_0",
			name: "Due on receipt",
			days: 0
		},
		{
			id: "term_15",
			name: "Net 15",
			days: 15
		},
		{
			id: "term_30",
			name: "Net 30",
			days: 30
		},
		{
			id: "term_45",
			name: "Net 45",
			days: 45
		}
	];
	const issued = (offset) => addDaysISO(today, offset);
	return {
		company,
		categories,
		terms,
		invoices: [
			{
				id: "inv_1041",
				number: "INV-1041",
				status: "unpaid",
				issueDate: issued(-16),
				dueDate: issued(14),
				termId: "term_30",
				client: {
					name: "Harbor Civic Library",
					email: "ada.moreau@example.com",
					address: "88 Front Avenue\nAstoria, OR 97103"
				},
				items: [{
					id: "li_1041_a",
					description: "Schematic design package",
					categoryId: "cat_design",
					quantity: 1,
					unitPrice: 4800
				}, {
					id: "li_1041_b",
					description: "Community workshop",
					categoryId: "cat_site",
					quantity: 2,
					unitPrice: 650
				}],
				taxEnabled: false,
				taxRate: 0,
				notes: "Please reference the library board approval from March. Workshop dates are confirmed.",
				currency: "USD",
				paidOn: null,
				updatedAt: stamp(issued(-2))
			},
			{
				id: "inv_1042",
				number: "INV-1042",
				status: "unpaid",
				issueDate: issued(-12),
				dueDate: issued(3),
				termId: "term_15",
				client: {
					name: "Keel & Rowe Interiors",
					email: "studio@keelrowe.example",
					address: "14 Tanner Street\nPortland, OR 97214"
				},
				items: [{
					id: "li_1042_a",
					description: "Interior finish schedule",
					categoryId: "cat_design",
					quantity: 1,
					unitPrice: 2200
				}, {
					id: "li_1042_b",
					description: "Material sample set",
					categoryId: "cat_materials",
					quantity: 1,
					unitPrice: 340
				}],
				taxEnabled: true,
				taxRate: 8.5,
				notes: "The retainer does not cover samples. Please pay against this invoice number.",
				currency: "USD",
				paidOn: null,
				updatedAt: stamp(issued(-1))
			},
			{
				id: "inv_1040",
				number: "INV-1040",
				status: "paid",
				issueDate: issued(-40),
				dueDate: issued(-10),
				termId: "term_30",
				client: {
					name: "Fieldhouse Market",
					email: "accounts@fieldhouse.example",
					address: "500 Division Street\nPortland, OR 97202"
				},
				items: [{
					id: "li_1040_a",
					description: "Signage drawings",
					categoryId: "cat_design",
					quantity: 1,
					unitPrice: 1600
				}],
				taxEnabled: false,
				taxRate: 0,
				notes: "Thank you. Paid by transfer.",
				currency: "USD",
				paidOn: issued(-8),
				updatedAt: stamp(issued(-8))
			},
			{
				id: "inv_1043",
				number: "INV-1043",
				status: "draft",
				issueDate: today,
				dueDate: issued(30),
				termId: "term_30",
				client: {
					name: "Oak Lane Residence",
					email: "m.oak@example.com",
					address: "9 Oak Lane\nLake Oswego, OR 97034"
				},
				items: [{
					id: "li_1043_a",
					description: "Concept hours",
					categoryId: "cat_design",
					quantity: 6,
					unitPrice: 180
				}],
				taxEnabled: true,
				taxRate: 8.5,
				notes: "",
				currency: "USD",
				paidOn: null,
				updatedAt: stamp(today)
			}
		],
		orders: [
			{
				id: "po_221",
				number: "PO-221",
				status: "open",
				issueDate: issued(-10),
				expectedDate: issued(-1),
				vendor: {
					name: "Sable Paper Co.",
					email: "orders@sablepaper.example",
					address: "220 Industrial Way\nPortland, OR 97217"
				},
				shipTo: "Northline Atelier\n412 Harbor Street, Suite 3\nPortland, OR 97214",
				items: [{
					id: "li_221_a",
					description: "Cotton paper, 100 lb, warm white",
					categoryId: "cat_print",
					quantity: 200,
					unitPrice: 1.85
				}],
				taxEnabled: false,
				taxRate: 0,
				notes: "Leave with the front desk if the studio is closed.",
				currency: "USD",
				receivedOn: null,
				updatedAt: stamp(issued(-1))
			},
			{
				id: "po_220",
				number: "PO-220",
				status: "scheduled",
				issueDate: issued(-2),
				expectedDate: issued(3),
				vendor: {
					name: "Calder Millwork",
					email: "desk@caldermill.example",
					address: "18 River Road\nOregon City, OR 97045"
				},
				shipTo: "Northline Atelier\n412 Harbor Street, loading dock\nPortland, OR 97214",
				items: [{
					id: "li_220_a",
					description: "White oak slab, 8 ft",
					categoryId: "cat_materials",
					quantity: 1,
					unitPrice: 1860
				}, {
					id: "li_220_b",
					description: "Delivery",
					categoryId: "cat_freight",
					quantity: 1,
					unitPrice: 140
				}],
				taxEnabled: false,
				taxRate: 0,
				notes: "Call the studio one hour before the truck arrives. The dock faces Salmon Street.",
				currency: "USD",
				receivedOn: null,
				updatedAt: stamp(issued(-1))
			},
			{
				id: "po_222",
				number: "PO-222",
				status: "scheduled",
				issueDate: issued(-1),
				expectedDate: issued(5),
				vendor: {
					name: "Lumen Print",
					email: "jobs@lumenprint.example",
					address: "640 Belmont Street\nPortland, OR 97214"
				},
				shipTo: "Northline Atelier\n412 Harbor Street, Suite 3\nPortland, OR 97214",
				items: [{
					id: "li_222_a",
					description: "Bound presentation sets",
					categoryId: "cat_print",
					quantity: 12,
					unitPrice: 48
				}],
				taxEnabled: false,
				taxRate: 0,
				notes: "Saddle stitch. Cover stock to match the oak sample.",
				currency: "USD",
				receivedOn: null,
				updatedAt: stamp(today)
			},
			{
				id: "po_218",
				number: "PO-218",
				status: "received",
				issueDate: issued(-20),
				expectedDate: issued(-8),
				vendor: {
					name: "Finch Hardware",
					email: "sales@finchhw.example",
					address: "77 Powell Boulevard\nPortland, OR 97202"
				},
				shipTo: "Northline Atelier\n412 Harbor Street, Suite 3\nPortland, OR 97214",
				items: [{
					id: "li_218_a",
					description: "Cabinet pulls, unlacquered brass",
					categoryId: "cat_materials",
					quantity: 40,
					unitPrice: 12.5
				}],
				taxEnabled: false,
				taxRate: 0,
				notes: "Checked in against the packing slip.",
				currency: "USD",
				receivedOn: issued(-8),
				updatedAt: stamp(issued(-8))
			},
			{
				id: "po_223",
				number: "PO-223",
				status: "draft",
				issueDate: today,
				expectedDate: issued(18),
				vendor: {
					name: "Isle Stone",
					email: "hello@islestone.example",
					address: "3 Quarry Road\nDundee, OR 97115"
				},
				shipTo: "Northline Atelier\n412 Harbor Street, Suite 3\nPortland, OR 97214",
				items: [{
					id: "li_223_a",
					description: "Honed limestone sample",
					categoryId: "cat_materials",
					quantity: 3,
					unitPrice: 90
				}],
				taxEnabled: false,
				taxRate: 0,
				notes: "",
				currency: "USD",
				receivedOn: null,
				updatedAt: stamp(today)
			}
		],
		bootstrapped: true,
		banner: "sample"
	};
}
function touch(doc, patch) {
	return {
		...doc,
		...patch,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function clearCategory(items, id) {
	return items.map((item) => item.categoryId === id ? {
		...item,
		categoryId: ""
	} : item);
}
var useLedger = create()(persist((set, get) => ({
	...blankData(),
	updateCompany: (patch) => set((state) => ({ company: {
		...state.company,
		...patch
	} })),
	addCategory: (name, appliesTo) => set((state) => ({ categories: [...state.categories, {
		id: uid(),
		name: name.trim(),
		appliesTo
	}] })),
	updateCategory: (id, patch) => set((state) => ({ categories: state.categories.map((category) => category.id === id ? {
		...category,
		...patch,
		name: patch.name?.trim() ?? category.name
	} : category) })),
	removeCategory: (id) => set((state) => ({
		categories: state.categories.filter((category) => category.id !== id),
		invoices: state.invoices.map((invoice) => ({
			...invoice,
			items: clearCategory(invoice.items, id)
		})),
		orders: state.orders.map((order) => ({
			...order,
			items: clearCategory(order.items, id)
		}))
	})),
	addTerm: (name, days) => set((state) => ({ terms: [...state.terms, {
		id: uid(),
		name: name.trim(),
		days
	}] })),
	updateTerm: (id, patch) => set((state) => ({ terms: state.terms.map((term) => term.id === id ? {
		...term,
		...patch
	} : term) })),
	removeTerm: (id) => set((state) => ({
		terms: state.terms.filter((term) => term.id !== id),
		invoices: state.invoices.map((invoice) => invoice.termId === id ? {
			...invoice,
			termId: ""
		} : invoice)
	})),
	createInvoice: () => {
		const state = get();
		const id = uid();
		const today = todayISO();
		const term = state.terms.find((item) => item.days === 30) ?? state.terms[0];
		set({
			invoices: [{
				id,
				number: `${state.company.invoicePrefix}${state.company.nextInvoice}`,
				status: "draft",
				issueDate: today,
				dueDate: addDaysISO(today, term?.days ?? 30),
				termId: term?.id ?? "",
				client: blankParty(),
				items: [blankLine(state.categories, "invoice")],
				taxEnabled: state.company.defaultTaxRate > 0,
				taxRate: state.company.defaultTaxRate,
				notes: "",
				currency: state.company.currency,
				paidOn: null,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, ...state.invoices],
			company: {
				...state.company,
				nextInvoice: state.company.nextInvoice + 1
			}
		});
		return id;
	},
	updateInvoice: (id, patch) => set((state) => ({ invoices: state.invoices.map((invoice) => invoice.id === id ? touch(invoice, patch) : invoice) })),
	setInvoiceStatus: (id, status) => set((state) => ({ invoices: state.invoices.map((invoice) => {
		if (invoice.id !== id) return invoice;
		const today = todayISO();
		return touch(invoice, {
			status,
			paidOn: status === "paid" ? invoice.paidOn ?? today : null
		});
	}) })),
	deleteInvoice: (id) => set((state) => ({ invoices: state.invoices.filter((invoice) => invoice.id !== id) })),
	createOrder: () => {
		const state = get();
		const id = uid();
		const today = todayISO();
		set({
			orders: [{
				id,
				number: `${state.company.poPrefix}${state.company.nextPo}`,
				status: "draft",
				issueDate: today,
				expectedDate: addDaysISO(today, 7),
				vendor: blankParty(),
				shipTo: state.company.address,
				items: [blankLine(state.categories, "order")],
				taxEnabled: state.company.defaultTaxRate > 0,
				taxRate: state.company.defaultTaxRate,
				notes: "",
				currency: state.company.currency,
				receivedOn: null,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}, ...state.orders],
			company: {
				...state.company,
				nextPo: state.company.nextPo + 1
			}
		});
		return id;
	},
	updateOrder: (id, patch) => set((state) => ({ orders: state.orders.map((order) => order.id === id ? touch(order, patch) : order) })),
	setOrderStatus: (id, status) => set((state) => ({ orders: state.orders.map((order) => {
		if (order.id !== id) return order;
		const today = todayISO();
		return touch(order, {
			status,
			receivedOn: status === "received" ? order.receivedOn ?? today : status === "received" || status === "closed" ? order.receivedOn : null
		});
	}) })),
	deleteOrder: (id) => set((state) => ({ orders: state.orders.filter((order) => order.id !== id) })),
	dismissBanner: () => set({ banner: "none" }),
	loadSample: () => set(buildSample(todayISO())),
	clearDocuments: () => set({
		invoices: [],
		orders: [],
		banner: "none"
	})
}), {
	name: "quire-ledger-v1",
	skipHydration: true,
	partialize: (state) => ({
		company: state.company,
		categories: state.categories,
		terms: state.terms,
		invoices: state.invoices,
		orders: state.orders,
		bootstrapped: state.bootstrapped,
		banner: state.banner
	}),
	storage: createJSONStorage(() => localStorage)
}));
function Desk({ today, onOpenInvoice, onOpenOrder, onNewInvoice, onNewOrder }) {
	const company = useLedger((state) => state.company);
	const invoices = useLedger((state) => state.invoices);
	const orders = useLedger((state) => state.orders);
	const categories = useLedger((state) => state.categories);
	const outstanding = outstandingByCurrency(invoices, company.currency);
	const bars = billedByCategory(invoices.filter((invoice) => invoice.currency === company.currency), categories);
	const maxBar = bars[0]?.amount ?? 0;
	const attention = [...invoices.filter((invoice) => invoiceOverdue(invoice, today) || invoice.status === "unpaid" && daysBetween(today, invoice.dueDate) <= 3 && daysBetween(today, invoice.dueDate) >= 0).map((invoice) => ({
		id: invoice.id,
		kind: "invoice",
		title: invoice.number,
		who: invoice.client.name || "Unnamed client",
		when: invoiceOverdue(invoice, today) ? `Overdue ${formatAgenda(invoice.dueDate)}` : `Due ${formatAgenda(invoice.dueDate)}`,
		sort: invoice.dueDate,
		amount: money(summarize(invoice.items, invoice.taxEnabled, invoice.taxRate).total, invoice.currency),
		tone: invoiceTone(invoice, today).tone,
		label: invoiceTone(invoice, today).label
	})), ...orders.filter((order) => orderOverdue(order, today)).map((order) => ({
		id: order.id,
		kind: "order",
		title: order.number,
		who: order.vendor.name || "Unnamed vendor",
		when: `Expected ${formatAgenda(order.expectedDate)}`,
		sort: order.expectedDate,
		amount: money(summarize(order.items, order.taxEnabled, order.taxRate).total, order.currency),
		tone: orderTone(order, today).tone,
		label: orderTone(order, today).label
	}))];
	const upcoming = [...orders.filter((order) => (order.status === "open" || order.status === "scheduled") && daysBetween(today, order.expectedDate) >= 0 && daysBetween(today, order.expectedDate) <= 14).map((order) => ({
		id: order.id,
		kind: "order",
		title: order.number,
		who: order.vendor.name || "Unnamed vendor",
		when: formatAgenda(order.expectedDate),
		sort: order.expectedDate,
		amount: money(summarize(order.items, order.taxEnabled, order.taxRate).total, order.currency)
	})), ...invoices.filter((invoice) => invoice.status === "unpaid" && daysBetween(today, invoice.dueDate) > 3 && daysBetween(today, invoice.dueDate) <= 21).map((invoice) => ({
		id: invoice.id,
		kind: "invoice",
		title: invoice.number,
		who: invoice.client.name || "Unnamed client",
		when: `Due ${formatAgenda(invoice.dueDate)}`,
		sort: invoice.dueDate,
		amount: money(summarize(invoice.items, invoice.taxEnabled, invoice.taxRate).total, invoice.currency)
	}))].sort((a, b) => a.sort.localeCompare(b.sort));
	const landingWeek = orders.filter((order) => (order.status === "open" || order.status === "scheduled") && daysBetween(today, order.expectedDate) >= 0 && daysBetween(today, order.expectedDate) <= 6).length;
	const openOrders = orders.filter((order) => order.status === "open" || order.status === "scheduled").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: formatLong(today)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl tracking-tight text-ink",
					children: "Desk"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: onNewInvoice,
						children: "New invoice"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: onNewOrder,
						children: "New purchase order"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-2xl border border-line bg-surface p-4 sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Outstanding"
						}), outstanding.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-4xl tracking-tight tabular-nums",
							children: money(0, company.currency)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid gap-1",
							children: outstanding.map(([currency, amount]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-4xl tracking-tight tabular-nums",
								children: money(amount, currency)
							}, currency))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-2xl border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Needs a look"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-4xl tracking-tight tabular-nums",
								children: attention.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-faint",
								children: "Due within three days, or late"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-2xl border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "On the schedule"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-4xl tracking-tight tabular-nums",
								children: landingWeek
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-faint",
								children: [
									openOrders,
									" still out, ",
									landingWeek,
									" landing this week"
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Needs attention"
					}), attention.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Nothing overdue, and nothing due in the next three days."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-line",
						children: attention.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => item.kind === "invoice" ? onOpenInvoice(item.id) : onOpenOrder(item.id),
							className: "flex w-full min-h-11 items-center justify-between gap-3 py-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: item.tone,
										children: item.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block truncate text-sm text-muted",
									children: [
										item.who,
										" · ",
										item.when
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-sm tabular-nums",
								children: item.amount
							})]
						}) }, `${item.kind}-${item.id}`))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Coming up"
					}), upcoming.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "No deliveries or invoice due dates in the next few weeks."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-line",
						children: upcoming.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => item.kind === "invoice" ? onOpenInvoice(item.id) : onOpenOrder(item.id),
							className: "flex w-full min-h-11 items-center justify-between gap-3 py-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block truncate text-sm text-muted",
									children: [
										item.who,
										" · ",
										item.when
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-sm tabular-nums",
								children: item.amount
							})]
						}) }, `${item.kind}-${item.id}`))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Billed by category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Before tax, excluding drafts. Categories are yours to rename in Settings."
					}),
					bars.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Categories fill in as you bill."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-3",
						children: bars.map((bar) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: bar.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: money(bar.amount, company.currency)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-2 rounded-full bg-wash",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 rounded-full bg-ink",
								style: { width: `${Math.max(4, Math.round(bar.amount / maxBar * 100))}%` }
							})
						})] }, bar.id))
					})
				]
			})
		]
	});
}
function Modal({ open, title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			if (!next) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "dialog-shade fixed inset-0 z-40 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "dialog-pop fixed inset-x-4 top-8 bottom-8 z-50 mx-auto max-w-xl overflow-y-auto rounded-2xl bg-paper p-4 text-ink shadow-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:inset-x-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-2xl tracking-tight",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					className: "inline-flex size-11 items-center justify-center rounded-sm text-muted hover:bg-wash",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "size-4",
						"aria-hidden": true
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children
			})]
		})] })
	});
}
var fieldClass = "min-h-11 w-full rounded-sm border border-line bg-paper px-3 text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
function Field({ label, hint, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("grid gap-1.5 text-sm", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-ink",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-faint",
				children: hint
			}) : null
		]
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn(fieldClass, className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn(fieldClass, "min-h-28 py-2", className),
		...props
	});
}
function Select({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn(fieldClass, className),
		...props
	});
}
function DecimalInput({ value, onValueChange, label, max, allowEmptyZero = true }) {
	const [draft, setDraft] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		"aria-label": label,
		inputMode: "decimal",
		autoComplete: "off",
		className: fieldClass,
		value: draft ?? (allowEmptyZero && value === 0 ? "0" : String(value)),
		onFocus: () => setDraft(String(value)),
		onChange: (event) => {
			const next = event.target.value;
			if (!/^\d*\.?\d{0,2}$/.test(next)) return;
			setDraft(next);
			if (next === "" || next === ".") {
				onValueChange(0);
				return;
			}
			const parsed = Number(next);
			if (!Number.isFinite(parsed)) return;
			if (max != null && parsed > max) return;
			onValueChange(parsed);
		},
		onBlur: () => setDraft(null)
	});
}
function totalLines(doc) {
	const lines = [{
		label: "Subtotal",
		value: money(doc.subtotal, doc.currency)
	}];
	if (doc.taxEnabled) lines.push({
		label: `Tax ${trimRate(doc.taxRate)}%`,
		value: money(doc.tax, doc.currency)
	});
	lines.push({
		label: "Total",
		value: money(doc.total, doc.currency)
	});
	return lines;
}
function trimRate(rate) {
	return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(rate);
}
function buildMail(doc) {
	const lines = [
		`${doc.kindLabel} ${doc.number}`,
		`From: ${doc.companyName}`,
		`${doc.partyLabel}: ${doc.partyMissing ? "(not set)" : doc.partyName}`,
		"",
		...doc.facts.map((fact) => `${fact.label}: ${fact.value}`),
		`Status: ${doc.statusLabel}`,
		"",
		"Items:",
		...doc.rows.map((row) => `- ${row.description} (${row.category})  ${formatQty(row.quantity)} x ${money(row.unitPrice, doc.currency)} = ${money(row.amount, doc.currency)}`),
		"",
		...totalLines(doc).map((line) => `${line.label}: ${line.value}`),
		""
	];
	if (doc.shipTo) lines.push("Ship to:", doc.shipTo, "");
	if (doc.notes.trim()) lines.push("Notes:", doc.notes.trim(), "");
	lines.push("A PDF of this document is ready to attach.");
	const body = lines.join("\n");
	const subject = `${doc.kindLabel} ${doc.number} from ${doc.companyName}`;
	return {
		to: doc.partyEmail,
		subject,
		body: body.length > 1800 ? `${body.slice(0, 1750)}\n\n...` : body
	};
}
function openMailto(draft) {
	const href = `mailto:${encodeURIComponent(draft.to)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
	window.location.href = href;
}
var INK = [
	28,
	29,
	26
];
var MUTED = [
	92,
	95,
	89
];
var LINE = [
	227,
	225,
	216
];
var WASH = [
	243,
	242,
	238
];
var LEFT = 48;
var RIGHT = 564;
var WIDTH = 516;
function pdfSafe(value) {
	return value.replace(/\u2014|\u2013/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, "\"").replace(/\u2026/g, "...").replace(/\u2022/g, "-").replace(/\u00A0/g, " ").replace(/[^\t\n\r\x20-\xFF]/g, "");
}
function pdfMoney(amount, currency) {
	const formatted = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
	if (currency === "USD") return `$${formatted}`;
	if (currency === "GBP") return `£${formatted}`;
	if (currency === "CAD") return `CA$${formatted}`;
	if (currency === "AUD") return `A$${formatted}`;
	if (currency === "NZD") return `NZ$${formatted}`;
	return `${currency} ${formatted}`;
}
function wrap(doc, text, width) {
	const clean = pdfSafe(text).replace(/[ \t]+/g, " ").trim();
	if (!clean) return [];
	const raw = doc.splitTextToSize(clean, width);
	return Array.isArray(raw) ? raw : [raw];
}
function drawTableHeader(doc, y) {
	doc.setFillColor(...INK);
	doc.rect(LEFT, y, WIDTH, 22, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(8);
	const baseline = y + 14;
	doc.text("Description", 56, baseline);
	doc.text("Category", 276, baseline);
	doc.text("Qty", 416, baseline, { align: "right" });
	doc.text("Rate", 490, baseline, { align: "right" });
	doc.text("Amount", 556, baseline, { align: "right" });
	return y + 22;
}
function paintHeader(doc, model) {
	doc.setFillColor(...INK);
	doc.rect(LEFT, 40, WIDTH, 4, "F");
	doc.setTextColor(...INK);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	const nameLines = wrap(doc, model.companyName, 320);
	let y = 68;
	for (const line of nameLines.length ? nameLines : ["Your business"]) {
		doc.text(line, LEFT, y);
		y += 20;
	}
	doc.setFontSize(11);
	doc.text(model.kindLabel.toUpperCase(), RIGHT, 68, { align: "right" });
	doc.setFontSize(12);
	doc.text(pdfSafe(model.number), RIGHT, 86, { align: "right" });
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(...MUTED);
	doc.text(pdfSafe(model.statusLabel), RIGHT, 102, { align: "right" });
	doc.setFontSize(9);
	let lineY = y;
	for (const line of model.companyLines) {
		const wrapped = wrap(doc, line, 300);
		for (const part of wrapped) {
			doc.text(part, LEFT, lineY);
			lineY += 12;
		}
	}
	y = Math.max(lineY, 116) + 10;
	doc.setDrawColor(...LINE);
	doc.setLineWidth(1);
	doc.line(LEFT, y, RIGHT, y);
	y += 20;
	doc.setTextColor(...MUTED);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(8);
	doc.text(model.partyLabel.toUpperCase(), LEFT, y);
	doc.setTextColor(...INK);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(11);
	y += 16;
	doc.text(pdfSafe(model.partyMissing ? model.partyLabel : model.partyName), LEFT, y);
	y += 14;
	doc.setFont("helvetica", "normal");
	doc.setFontSize(9);
	doc.setTextColor(...MUTED);
	const partyStart = y;
	for (const line of model.partyLines) for (const part of wrap(doc, line, 250)) {
		doc.text(part, LEFT, y);
		y += 12;
	}
	if (model.partyEmail) {
		doc.text(pdfSafe(model.partyEmail), LEFT, y);
		y += 12;
	}
	let factY = partyStart - 30;
	doc.setFontSize(9);
	for (const fact of model.facts) {
		doc.setFont("helvetica", "normal");
		doc.setTextColor(...MUTED);
		doc.text(fact.label, 400, factY);
		doc.setFont("helvetica", "bold");
		doc.setTextColor(...INK);
		doc.text(pdfSafe(fact.value), RIGHT, factY, { align: "right" });
		factY += 16;
	}
	y = Math.max(y, factY) + 8;
	if (model.shipTo) {
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		doc.text("SHIP TO", LEFT, y);
		y += 14;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9);
		doc.setTextColor(...INK);
		for (const line of model.shipTo.split(/\n+/)) for (const part of wrap(doc, line, WIDTH)) {
			doc.text(part, LEFT, y);
			y += 12;
		}
		y += 6;
	}
	return y + 6;
}
async function buildPdf(model) {
	const { jsPDF } = await import("../_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const doc = new jsPDF({
		unit: "pt",
		format: "letter"
	});
	let y = paintHeader(doc, model);
	const ensure = (needed) => {
		if (y + needed <= 730) return;
		doc.addPage();
		y = 48;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(9);
		doc.setTextColor(...INK);
		doc.text(pdfSafe(`${model.kindLabel} ${model.number}`), LEFT, y);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(...MUTED);
		doc.text("Continued", RIGHT, y, { align: "right" });
		y += 16;
		y = drawTableHeader(doc, y);
	};
	y = drawTableHeader(doc, y);
	model.rows.forEach((row, index) => {
		const desc = wrap(doc, row.description, 200);
		const cat = wrap(doc, row.category, 80);
		const rowH = Math.max(desc.length, cat.length, 1) * 12 + 10;
		ensure(rowH);
		if (index % 2 === 1) {
			doc.setFillColor(...WASH);
			doc.rect(LEFT, y, WIDTH, rowH, "F");
		}
		const baseline = y + 16;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9);
		doc.setTextColor(...INK);
		desc.forEach((line, i) => doc.text(line, 56, baseline + i * 12));
		doc.setTextColor(...MUTED);
		cat.forEach((line, i) => doc.text(line, 276, baseline + i * 12));
		doc.setTextColor(...INK);
		doc.text(formatQty(row.quantity), 416, baseline, { align: "right" });
		doc.text(pdfMoney(row.unitPrice, model.currency), 490, baseline, { align: "right" });
		doc.text(pdfMoney(row.amount, model.currency), 556, baseline, { align: "right" });
		y += rowH;
	});
	if (model.rows.length === 0) {
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9);
		doc.setTextColor(...MUTED);
		doc.text("No line items yet.", 56, y + 16);
		y += 28;
	}
	ensure(80);
	y += 12;
	const totals = [[
		"Subtotal",
		pdfMoney(model.subtotal, model.currency),
		false
	]];
	if (model.taxEnabled) {
		const rate = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(model.taxRate);
		totals.push([
			`Tax ${rate}%`,
			pdfMoney(model.tax, model.currency),
			false
		]);
	}
	totals.push([
		"Total",
		pdfMoney(model.total, model.currency),
		true
	]);
	for (const [label, value, strong] of totals) {
		if (strong) {
			doc.setDrawColor(...INK);
			doc.setLineWidth(1);
			doc.line(380, y, RIGHT, y);
			y += 16;
			doc.setFont("helvetica", "bold");
			doc.setFontSize(12);
		} else {
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
		}
		doc.setTextColor(...MUTED);
		doc.text(label, 400, y);
		doc.setTextColor(...INK);
		doc.text(value, RIGHT, y, { align: "right" });
		y += strong ? 20 : 14;
	}
	const noteLines = model.notes.split(/\n/).flatMap((paragraph) => {
		const trimmed = paragraph.trim();
		if (!trimmed) return [""];
		return wrap(doc, trimmed, WIDTH);
	});
	if (noteLines.some((line) => line.trim())) {
		ensure(36);
		y += 8;
		doc.setDrawColor(...LINE);
		doc.line(LEFT, y, RIGHT, y);
		y += 18;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		doc.text("NOTES", LEFT, y);
		y += 14;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9);
		doc.setTextColor(...INK);
		for (const line of noteLines) {
			ensure(14);
			if (line) doc.text(line, LEFT, y);
			y += 12;
		}
	}
	const pages = doc.getNumberOfPages();
	for (let page = 1; page <= pages; page += 1) {
		doc.setPage(page);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		doc.text(pdfSafe(`${model.kindLabel} ${model.number}`), LEFT, 774);
		doc.text(`Page ${page} of ${pages}`, RIGHT, 774, { align: "right" });
	}
	return doc.output("blob");
}
function saveBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function sharePdf(blob, filename, title) {
	const file = new File([blob], filename, { type: "application/pdf" });
	if (!navigator.canShare?.({ files: [file] })) return "unavailable";
	try {
		await navigator.share({
			files: [file],
			title
		});
		return "shared";
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
		throw error;
	}
}
function EmailDialog({ open, draft, doc, onChange, onClose }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!draft || !doc) return null;
	async function download() {
		if (!doc) return;
		setBusy(true);
		try {
			saveBlob(await buildPdf(doc), doc.filename);
			toast("PDF downloaded. Attach it in your email.");
		} catch {
			toast("Could not create the PDF.");
		} finally {
			setBusy(false);
		}
	}
	async function share() {
		if (!doc) return;
		setBusy(true);
		try {
			const blob = await buildPdf(doc);
			const result = await sharePdf(blob, doc.filename, `${doc.kindLabel} ${doc.number}`);
			if (result === "unavailable") {
				saveBlob(blob, doc.filename);
				toast("This browser cannot share files. The PDF was downloaded instead.");
			} else if (result === "shared") toast("PDF shared.");
		} catch {
			toast("Could not share the PDF.");
		} finally {
			setBusy(false);
		}
	}
	async function copy() {
		try {
			await navigator.clipboard.writeText(`To: ${draft?.to ?? ""}\nSubject: ${draft?.subject ?? ""}\n\n${draft?.body ?? ""}`);
			toast("Message copied.");
		} catch {
			toast("Could not copy the message.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		open,
		title: "Email this document",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "This opens your email app with the summary filled in. Browsers cannot attach a file to that draft, so download the PDF and add it yourself. On a phone, Share PDF can hand the file to Mail."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "To",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: draft.to,
							autoComplete: "email",
							onChange: (event) => onChange({
								...draft,
								to: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Subject",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.subject,
							onChange: (event) => onChange({
								...draft,
								subject: event.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: draft.body,
							onChange: (event) => onChange({
								...draft,
								body: event.target.value
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: busy,
						onClick: () => openMailto(draft),
						children: "Open email app"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void download(),
						children: busy ? "Preparing…" : "Download PDF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void share(),
						children: "Share PDF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => void copy(),
						children: "Copy message"
					})
				]
			})
		]
	});
}
function mailFor(doc) {
	return buildMail(doc);
}
function LineItems({ kind, items, categories, currency, onChange }) {
	const options = categoriesFor(categories, kind);
	function update(id, patch) {
		onChange(items.map((item) => item.id === id ? {
			...item,
			...patch
		} : item));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-line bg-paper p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Description",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: item.description,
							placeholder: "What this line is for",
							onChange: (event) => update(item.id, { description: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: item.categoryId,
							onChange: (event) => update(item.id, { categoryId: event.target.value }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Uncategorized"
							}), options.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: category.id,
								children: category.name
							}, category.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Qty",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecimalInput, {
							label: `Quantity for line ${index + 1}`,
							value: item.quantity,
							onValueChange: (quantity) => update(item.id, { quantity })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Rate",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecimalInput, {
							label: `Rate for line ${index + 1}`,
							value: item.unitPrice,
							onValueChange: (unitPrice) => update(item.id, { unitPrice })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: "Amount"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium tabular-nums",
							children: money(lineAmount(item), currency)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => onChange(items.filter((row) => row.id !== item.id)),
							children: "Remove"
						})]
					})
				]
			})
		}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			onClick: () => onChange([...items, blankLine(categories, kind)]),
			children: "Add line"
		})]
	});
}
function rateLabel(rate) {
	return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(rate);
}
function Paper({ doc }) {
	const totals = [
		{
			label: "Subtotal",
			value: money(doc.subtotal, doc.currency)
		},
		...doc.taxEnabled ? [{
			label: `Tax ${rateLabel(doc.taxRate)}%`,
			value: money(doc.tax, doc.currency)
		}] : [],
		{
			label: "Total",
			value: money(doc.total, doc.currency),
			emphasize: true
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-sm border border-line bg-paper text-ink shadow-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 bg-ink" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl tracking-tight",
							children: doc.companyName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 space-y-0.5 text-sm text-muted",
							children: doc.companyLines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "break-words",
								children: line
							}, line))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-left sm:text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-muted uppercase",
								children: doc.kindLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display text-2xl tracking-tight tabular-nums",
								children: doc.number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: doc.tone,
									children: doc.statusLabel
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-faint uppercase",
								children: doc.partyLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("mt-1 text-base font-medium", doc.partyMissing && "text-faint"),
								children: doc.partyName
							}),
							doc.partyLines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm break-words text-muted",
								children: line
							}, line)),
							doc.partyEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm break-all text-muted",
								children: doc.partyEmail
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "grid grid-cols-2 gap-x-3 gap-y-2 sm:justify-items-end",
						children: doc.facts.map((fact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "contents",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-sm text-faint",
								children: fact.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-sm font-medium tabular-nums sm:text-right",
								children: fact.value
							})]
						}, fact.label))
					})]
				}),
				doc.shipTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-faint uppercase",
						children: "Ship to"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm whitespace-pre-line text-muted",
						children: doc.shipTo
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-ink text-xs tracking-wide text-muted uppercase",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Description"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right font-medium",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right font-medium",
									children: "Rate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right font-medium",
									children: "Amount"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: doc.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 5,
							className: "py-4 text-muted",
							children: "No line items yet."
						}) }) : doc.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3",
									children: row.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3 text-muted",
									children: row.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-right tabular-nums",
									children: formatQty(row.quantity)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-right tabular-nums",
									children: money(row.unitPrice, doc.currency)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-right tabular-nums",
									children: money(row.amount, doc.currency)
								})
							]
						}, row.id)) })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 ml-auto grid max-w-xs gap-1 text-sm",
					children: totals.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex justify-between gap-6", line.emphasize && "mt-1 border-t border-ink pt-2 text-base font-medium"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: line.emphasize ? "text-ink" : "text-muted",
							children: line.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "tabular-nums",
							children: line.value
						})]
					}, line.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 border-t border-line pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs font-medium tracking-widest text-faint uppercase",
						children: "Notes"
					}), doc.notes.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm whitespace-pre-line text-ink",
						children: doc.notes
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-faint",
						children: "Notes appear here, at the bottom of the document."
					})]
				})
			]
		})]
	});
}
function ChoiceRow({ value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children: options.map((option) => {
			const selected = option.value === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-pressed": selected,
				onClick: () => onChange(option.value),
				className: cn("min-h-11 rounded-sm px-3 text-sm font-medium", selected ? "bg-ink text-paper" : "bg-wash text-muted"),
				children: option.label
			}, option.value);
		})
	});
}
function Switch({ checked, onCheckedChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		"aria-label": label,
		onClick: () => onCheckedChange(!checked),
		className: "inline-flex h-11 w-14 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("relative h-7 w-12 rounded-full", checked ? "bg-ink" : "bg-line-strong"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-1 left-1 size-5 rounded-full bg-paper transition-transform", checked && "translate-x-5") })
		})
	});
}
function companyLines(company) {
	const lines = [];
	if (company.address.trim()) lines.push(...company.address.split(/\n+/).map((line) => line.trim()).filter(Boolean));
	if (company.phone.trim()) lines.push(company.phone.trim());
	if (company.email.trim()) lines.push(company.email.trim());
	if (company.taxId.trim()) lines.push(`Tax ID ${company.taxId.trim()}`);
	return lines;
}
function partyLines(address) {
	return address.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}
function rowsFor(items, categories) {
	return items.map((item) => ({
		id: item.id,
		description: item.description.trim() || "Line item",
		category: categoryName(categories, item.categoryId),
		quantity: item.quantity,
		unitPrice: item.unitPrice,
		amount: lineAmount(item)
	}));
}
function presentInvoice(invoice, company, categories, terms, today) {
	const badge = invoiceTone(invoice, today);
	const totals = summarize(invoice.items, invoice.taxEnabled, invoice.taxRate);
	const term = terms.find((item) => item.id === invoice.termId);
	const facts = [{
		label: "Issued",
		value: formatPretty(invoice.issueDate)
	}, {
		label: "Due",
		value: formatPretty(invoice.dueDate)
	}];
	if (term) facts.push({
		label: "Terms",
		value: term.name
	});
	if (invoice.status === "paid" && invoice.paidOn) facts.push({
		label: "Paid",
		value: formatPretty(invoice.paidOn)
	});
	return {
		kind: "invoice",
		kindLabel: "Invoice",
		filename: safeFilename(invoice.number || "invoice"),
		number: invoice.number || "Draft",
		statusLabel: badge.label,
		tone: badge.tone,
		companyName: company.name.trim() || "Your business",
		companyLines: companyLines(company),
		partyLabel: "Bill to",
		partyName: invoice.client.name.trim() || "Client name",
		partyMissing: !invoice.client.name.trim(),
		partyEmail: invoice.client.email.trim(),
		partyLines: partyLines(invoice.client.address),
		facts,
		shipTo: "",
		rows: rowsFor(invoice.items, categories),
		notes: invoice.notes,
		taxEnabled: invoice.taxEnabled,
		taxRate: invoice.taxRate,
		...totals,
		currency: invoice.currency
	};
}
function presentOrder(order, company, categories, today) {
	const badge = orderTone(order, today);
	const totals = summarize(order.items, order.taxEnabled, order.taxRate);
	const facts = [{
		label: "Issued",
		value: formatPretty(order.issueDate)
	}, {
		label: "Expected",
		value: formatPretty(order.expectedDate)
	}];
	if (order.receivedOn) facts.push({
		label: "Received",
		value: formatPretty(order.receivedOn)
	});
	return {
		kind: "order",
		kindLabel: "Purchase order",
		filename: safeFilename(order.number || "purchase-order"),
		number: order.number || "Draft",
		statusLabel: badge.label,
		tone: badge.tone,
		companyName: company.name.trim() || "Your business",
		companyLines: companyLines(company),
		partyLabel: "Vendor",
		partyName: order.vendor.name.trim() || "Vendor name",
		partyMissing: !order.vendor.name.trim(),
		partyEmail: order.vendor.email.trim(),
		partyLines: partyLines(order.vendor.address),
		facts,
		shipTo: order.shipTo.trim(),
		rows: rowsFor(order.items, categories),
		notes: order.notes,
		taxEnabled: order.taxEnabled,
		taxRate: order.taxRate,
		...totals,
		currency: order.currency
	};
}
var CURRENCIES = [
	"USD",
	"EUR",
	"GBP",
	"CAD",
	"AUD",
	"NZD"
];
var INVOICE_STATUS = [
	{
		value: "draft",
		label: "Draft"
	},
	{
		value: "unpaid",
		label: "Unpaid"
	},
	{
		value: "paid",
		label: "Paid"
	}
];
var ORDER_STATUS = [
	{
		value: "draft",
		label: "Draft"
	},
	{
		value: "open",
		label: "Open"
	},
	{
		value: "scheduled",
		label: "Scheduled"
	},
	{
		value: "received",
		label: "Received"
	},
	{
		value: "closed",
		label: "Closed"
	}
];
function DocumentEditor({ kind, id, today, onBack }) {
	const invoice = useLedger((state) => state.invoices.find((item) => item.id === id));
	const order = useLedger((state) => state.orders.find((item) => item.id === id));
	const company = useLedger((state) => state.company);
	const categories = useLedger((state) => state.categories);
	const terms = useLedger((state) => state.terms);
	const updateInvoice = useLedger((state) => state.updateInvoice);
	const updateOrder = useLedger((state) => state.updateOrder);
	const setInvoiceStatus = useLedger((state) => state.setInvoiceStatus);
	const setOrderStatus = useLedger((state) => state.setOrderStatus);
	const deleteInvoice = useLedger((state) => state.deleteInvoice);
	const deleteOrder = useLedger((state) => state.deleteOrder);
	const [pane, setPane] = (0, import_react.useState)("edit");
	const [mailOpen, setMailOpen] = (0, import_react.useState)(false);
	const [mail, setMail] = (0, import_react.useState)(null);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const presented = kind === "invoice" && invoice ? presentInvoice(invoice, company, categories, terms, today) : kind === "order" && order ? presentOrder(order, company, categories, today) : null;
	if (!presented || kind === "invoice" && !invoice || kind === "order" && !order) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-surface p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "This document is no longer in your books."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			onClick: onBack,
			children: "Back"
		})]
	});
	const doc = presented;
	const totals = summarize(kind === "invoice" ? invoice.items : order.items, kind === "invoice" ? invoice.taxEnabled : order.taxEnabled, kind === "invoice" ? invoice.taxRate : order.taxRate);
	async function download() {
		setBusy(true);
		try {
			saveBlob(await buildPdf(doc), doc.filename);
			toast("PDF downloaded.");
		} catch {
			toast("Could not create the PDF.");
		} finally {
			setBusy(false);
		}
	}
	function remove() {
		if (kind === "invoice") deleteInvoice(id);
		else deleteOrder(id);
		toast("Document removed.");
		onBack();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onBack,
					children: kind === "invoice" ? "All invoices" : "All orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: busy,
						onClick: () => void download(),
						children: busy ? "Preparing…" : "Download PDF"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => {
							setMail(mailFor(doc));
							setMailOpen(true);
						},
						children: "Email"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": pane === "edit",
					onClick: () => setPane("edit"),
					className: cn("min-h-11 flex-1 rounded-sm text-sm font-medium", pane === "edit" ? "bg-ink text-paper" : "bg-wash text-muted"),
					children: "Edit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": pane === "preview",
					onClick: () => setPane("preview"),
					className: cn("min-h-11 flex-1 rounded-sm text-sm font-medium", pane === "preview" ? "bg-ink text-paper" : "bg-wash text-muted"),
					children: "Preview"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid items-start gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("grid gap-4", pane === "preview" && "hidden lg:grid"),
					children: [
						kind === "invoice" && invoice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceFields, {
							invoice,
							terms,
							onChange: (patch) => updateInvoice(id, patch),
							onStatus: (status) => {
								setInvoiceStatus(id, status);
								toast(status === "paid" ? "Marked paid." : status === "unpaid" ? "Marked unpaid." : "Saved as draft.");
							}
						}) : null,
						kind === "order" && order ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderFields, {
							order,
							onChange: (patch) => updateOrder(id, patch),
							onStatus: (status) => {
								setOrderStatus(id, status);
								toast(status === "received" ? "Marked received." : "Status updated.");
							}
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "grid gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl tracking-tight",
								children: "Line items"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineItems, {
								kind,
								categories,
								currency: kind === "invoice" ? invoice.currency : order.currency,
								items: kind === "invoice" ? invoice.items : order.items,
								onChange: (items) => kind === "invoice" ? updateInvoice(id, { items }) : updateOrder(id, { items })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-2xl border border-line bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: "Tax"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-faint",
										children: "Optional. Applied once, to the subtotal."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										label: "Apply tax",
										checked: kind === "invoice" ? invoice.taxEnabled : order.taxEnabled,
										onCheckedChange: (taxEnabled) => kind === "invoice" ? updateInvoice(id, { taxEnabled }) : updateOrder(id, { taxEnabled })
									})]
								}),
								(kind === "invoice" ? invoice.taxEnabled : order.taxEnabled) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 max-w-40",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Rate (%)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecimalInput, {
											label: "Tax rate",
											max: 100,
											value: kind === "invoice" ? invoice.taxRate : order.taxRate,
											onValueChange: (taxRate) => kind === "invoice" ? updateInvoice(id, { taxRate }) : updateOrder(id, { taxRate })
										})
									})
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-4 grid gap-1 border-t border-line pt-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted",
												children: "Subtotal"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "tabular-nums",
												children: money(totals.subtotal, doc.currency)
											})]
										}),
										doc.taxEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted",
												children: "Tax"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "tabular-nums",
												children: money(totals.tax, doc.currency)
											})]
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-base font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "tabular-nums",
												children: money(totals.total, doc.currency)
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Notes",
							hint: "Printed at the bottom of the PDF.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: kind === "invoice" ? invoice.notes : order.notes,
								placeholder: "Payment details, delivery instructions, a thank-you.",
								onChange: (event) => kind === "invoice" ? updateInvoice(id, { notes: event.target.value }) : updateOrder(id, { notes: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "danger",
							onClick: () => setConfirmDelete(true),
							children: ["Delete ", kind === "invoice" ? "invoice" : "purchase order"]
						}) })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(pane === "edit" && "hidden lg:block"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paper, { doc })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailDialog, {
				open: mailOpen,
				draft: mail,
				doc,
				onChange: setMail,
				onClose: () => setMailOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				open: confirmDelete,
				title: "Delete this document?",
				onClose: () => setConfirmDelete(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [doc.number, " will be removed from this browser. This does not email anyone."]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: remove,
						children: "Delete"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setConfirmDelete(false),
						children: "Keep it"
					})]
				})]
			})
		]
	});
}
function InvoiceFields({ invoice, terms, onChange, onStatus }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
				value: invoice.status,
				options: INVOICE_STATUS,
				onChange: onStatus
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Drafts stay off the outstanding total until you mark them unpaid."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: invoice.number,
							onChange: (event) => onChange({ number: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Currency",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: invoice.currency,
							onChange: (event) => onChange({ currency: event.target.value }),
							children: CURRENCIES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: code,
								children: code
							}, code))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Issued",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: invoice.issueDate,
							onChange: (event) => {
								const issueDate = event.target.value;
								const term = terms.find((item) => item.id === invoice.termId);
								onChange({
									issueDate,
									dueDate: term ? addDaysISO(issueDate, term.days) : invoice.dueDate
								});
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Due",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: invoice.dueDate,
							onChange: (event) => onChange({
								dueDate: event.target.value,
								termId: ""
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Billing terms",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: invoice.termId,
							onChange: (event) => {
								const termId = event.target.value;
								const term = terms.find((item) => item.id === termId);
								onChange({
									termId,
									dueDate: term ? addDaysISO(invoice.issueDate, term.days) : invoice.dueDate
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Custom due date"
							}), terms.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: term.id,
								children: term.name
							}, term.id))]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Client"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: invoice.client.name,
							autoComplete: "organization",
							onChange: (event) => onChange({ client: {
								...invoice.client,
								name: event.target.value
							} })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: invoice.client.email,
							autoComplete: "email",
							onChange: (event) => onChange({ client: {
								...invoice.client,
								email: event.target.value
							} })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: invoice.client.address,
							onChange: (event) => onChange({ client: {
								...invoice.client,
								address: event.target.value
							} })
						})
					})
				]
			})
		]
	});
}
function OrderFields({ order, onChange, onStatus }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
				value: order.status,
				options: ORDER_STATUS,
				onChange: onStatus
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Open and scheduled orders land on the calendar by expected date."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Number",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: order.number,
							onChange: (event) => onChange({ number: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Currency",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: order.currency,
							onChange: (event) => onChange({ currency: event.target.value }),
							children: CURRENCIES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: code,
								children: code
							}, code))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Issued",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: order.issueDate,
							onChange: (event) => onChange({ issueDate: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Expected",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: order.expectedDate,
							onChange: (event) => onChange({ expectedDate: event.target.value })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Vendor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: order.vendor.name,
							autoComplete: "organization",
							onChange: (event) => onChange({ vendor: {
								...order.vendor,
								name: event.target.value
							} })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: order.vendor.email,
							autoComplete: "email",
							onChange: (event) => onChange({ vendor: {
								...order.vendor,
								email: event.target.value
							} })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: order.vendor.address,
							onChange: (event) => onChange({ vendor: {
								...order.vendor,
								address: event.target.value
							} })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Ship to",
						hint: "Printed on the purchase order.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: order.shipTo,
							onChange: (event) => onChange({ shipTo: event.target.value })
						})
					})
				]
			})
		]
	});
}
function InvoiceList({ today, onOpen, onCreate }) {
	const invoices = useLedger((state) => state.invoices);
	const company = useLedger((state) => state.company);
	const categories = useLedger((state) => state.categories);
	const terms = useLedger((state) => state.terms);
	const setInvoiceStatus = useLedger((state) => state.setInvoiceStatus);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const counts = {
		all: invoices.length,
		draft: invoices.filter((invoice) => invoice.status === "draft").length,
		unpaid: invoices.filter((invoice) => invoice.status === "unpaid" && !invoiceOverdue(invoice, today)).length,
		overdue: invoices.filter((invoice) => invoiceOverdue(invoice, today)).length,
		paid: invoices.filter((invoice) => invoice.status === "paid").length
	};
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return invoices.filter((invoice) => {
			if (filter === "draft") return invoice.status === "draft";
			if (filter === "paid") return invoice.status === "paid";
			if (filter === "overdue") return invoiceOverdue(invoice, today);
			if (filter === "unpaid") return invoice.status === "unpaid" && !invoiceOverdue(invoice, today);
			return true;
		}).filter((invoice) => {
			if (!q) return true;
			return [
				invoice.number,
				invoice.client.name,
				invoice.client.email,
				invoice.notes,
				...invoice.items.map((item) => item.description)
			].join(" ").toLowerCase().includes(q);
		}).sort((a, b) => a.issueDate === b.issueDate ? b.number.localeCompare(a.number) : b.issueDate.localeCompare(a.issueDate));
	}, [
		filter,
		invoices,
		query,
		today
	]);
	async function download(id) {
		const invoice = invoices.find((item) => item.id === id);
		if (!invoice) return;
		setBusyId(id);
		try {
			const doc = presentInvoice(invoice, company, categories, terms, today);
			saveBlob(await buildPdf(doc), doc.filename);
			toast("PDF downloaded.");
		} catch {
			toast("Could not create the PDF.");
		} finally {
			setBusyId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Invoices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Mark them paid or unpaid, then download or email a PDF."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: onCreate,
					children: "New invoice"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Search number, client, or note",
					"aria-label": "Search invoices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
					value: filter,
					onChange: setFilter,
					options: [
						{
							value: "all",
							label: `All ${counts.all}`
						},
						{
							value: "unpaid",
							label: `Unpaid ${counts.unpaid}`
						},
						{
							value: "overdue",
							label: `Overdue ${counts.overdue}`
						},
						{
							value: "draft",
							label: `Draft ${counts.draft}`
						},
						{
							value: "paid",
							label: `Paid ${counts.paid}`
						}
					]
				})]
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "No invoices here"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: invoices.length === 0 ? "Create one, add line items, and download a PDF." : "Nothing matches this filter."
					}),
					invoices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "primary",
						onClick: onCreate,
						children: "New invoice"
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: visible.map((invoice) => {
					const badge = invoiceTone(invoice, today);
					const total = summarize(invoice.items, invoice.taxEnabled, invoice.taxRate).total;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl border border-line bg-surface p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: invoice.number
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: badge.tone,
											children: badge.label
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 truncate text-sm text-muted",
										children: invoice.client.name || "Unnamed client"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-faint",
										children: [
											"Issued ",
											formatPretty(invoice.issueDate),
											" · Due ",
											formatPretty(invoice.dueDate)
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl tabular-nums",
								children: money(total, invoice.currency)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => onOpen(invoice.id),
									children: "Open"
								}),
								invoice.status === "paid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => setInvoiceStatus(invoice.id, "unpaid"),
									children: "Mark unpaid"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => setInvoiceStatus(invoice.id, "paid"),
									children: "Mark paid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: busyId === invoice.id,
									onClick: () => void download(invoice.id),
									children: busyId === invoice.id ? "Preparing…" : "PDF"
								})
							]
						})]
					}, invoice.id);
				})
			})
		]
	});
}
function OrderBoard({ today, onOpen, onCreate }) {
	const orders = useLedger((state) => state.orders);
	const updateOrder = useLedger((state) => state.updateOrder);
	const setOrderStatus = useLedger((state) => state.setOrderStatus);
	const [cursor, setCursor] = (0, import_react.useState)(() => startOfMonth(parseISODate(today)));
	const [selected, setSelected] = (0, import_react.useState)(today);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const days = eachDayOfInterval({
		start: startOfWeek(startOfMonth(cursor)),
		end: endOfWeek(endOfMonth(cursor))
	});
	const byDate = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const order of orders) {
			if (!orderOnSchedule(order)) continue;
			const list = map.get(order.expectedDate) ?? [];
			list.push(order);
			map.set(order.expectedDate, list);
		}
		return map;
	}, [orders]);
	const selectedOrders = (byDate.get(selected) ?? []).slice().sort((a, b) => a.number.localeCompare(b.number));
	const overdue = orders.filter((order) => orderOverdue(order, today));
	const visible = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return orders.filter((order) => {
			if (filter === "overdue") return orderOverdue(order, today);
			if (filter === "all") return true;
			return order.status === filter;
		}).filter((order) => {
			if (!q) return true;
			return [
				order.number,
				order.vendor.name,
				order.vendor.email,
				order.notes,
				order.shipTo
			].join(" ").toLowerCase().includes(q);
		}).sort((a, b) => a.expectedDate.localeCompare(b.expectedDate) || a.number.localeCompare(b.number));
	}, [
		filter,
		orders,
		query,
		today
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Purchase orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "The expected date is the schedule. Reschedule it here or in the order."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: onCreate,
					children: "New purchase order"
				})]
			}),
			overdue.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "due",
						children: "Overdue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [overdue.length, " past the expected date and not received."]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 divide-y divide-line",
					children: overdue.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-h-11 text-left text-sm font-medium",
							onClick: () => onOpen(order.id),
							children: [
								order.number,
								" · ",
								order.vendor.name || "Unnamed vendor",
								" · ",
								formatAgenda(order.expectedDate)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setOrderStatus(order.id, "received"),
							children: "Mark received"
						})]
					}, order.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl tracking-tight",
								children: format(cursor, "MMMM yyyy")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Previous month",
										className: "inline-flex size-11 items-center justify-center rounded-sm hover:bg-wash",
										onClick: () => setCursor((value) => addMonths(value, -1)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
											className: "size-4",
											"aria-hidden": true
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "min-h-11 rounded-sm px-3 text-sm font-medium hover:bg-wash",
										onClick: () => {
											setCursor(startOfMonth(parseISODate(today)));
											setSelected(today);
										},
										children: "Today"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Next month",
										className: "inline-flex size-11 items-center justify-center rounded-sm hover:bg-wash",
										onClick: () => setCursor((value) => addMonths(value, 1)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
											className: "size-4",
											"aria-hidden": true
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-7 gap-1 text-center text-xs text-faint",
							children: [
								"Sun",
								"Mon",
								"Tue",
								"Wed",
								"Thu",
								"Fri",
								"Sat"
							].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-1",
								children: label
							}, label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-7 gap-1",
							children: days.map((day) => {
								const iso = todayISO(day);
								const list = byDate.get(iso) ?? [];
								const selectedDay = iso === selected;
								const inMonth = isSameMonth(day, cursor);
								const isToday = isSameDay(day, parseISODate(today));
								const hasOverdue = list.some((order) => orderOverdue(order, today));
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSelected(iso),
									"aria-pressed": selectedDay,
									"aria-label": formatLong(iso),
									className: cn("flex h-12 flex-col items-center justify-center rounded-sm text-sm tabular-nums", selectedDay ? "bg-ink text-paper" : "hover:bg-wash", !inMonth && !selectedDay && "text-faint", isToday && !selectedDay && "ring-1 ring-ink"),
									children: [format(day, "d"), list.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-0.5 size-1.5 rounded-full", hasOverdue ? "bg-due" : selectedDay ? "bg-paper" : "bg-ink") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-0.5 size-1.5" })]
								}, iso);
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: formatLong(selected)
					}), selectedOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Nothing landing this day."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-3",
						children: selectedOrders.map((order) => {
							const badge = orderTone(order, today);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl border border-line p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-left font-medium",
											onClick: () => onOpen(order.id),
											children: order.number
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: badge.tone,
											children: badge.label
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: order.vendor.name || "Unnamed vendor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm tabular-nums",
										children: money(summarize(order.items, order.taxEnabled, order.taxRate).total, order.currency)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex flex-wrap items-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "grid gap-1 text-xs text-faint",
											children: ["Reschedule", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "min-h-11 rounded-sm border border-line bg-paper px-3 text-sm text-ink",
												value: order.expectedDate,
												"aria-label": `Reschedule ${order.number}`,
												onChange: (event) => updateOrder(order.id, { expectedDate: event.target.value })
											})]
										}), order.status === "received" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: () => setOrderStatus(order.id, "open"),
											children: "Reopen"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: () => setOrderStatus(order.id, "received"),
											children: "Mark received"
										})]
									})
								]
							}, order.id);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search number, vendor, or note",
						"aria-label": "Search purchase orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChoiceRow, {
						value: filter,
						onChange: setFilter,
						options: [
							{
								value: "all",
								label: "All"
							},
							{
								value: "open",
								label: "Open"
							},
							{
								value: "scheduled",
								label: "Scheduled"
							},
							{
								value: "overdue",
								label: "Overdue"
							},
							{
								value: "received",
								label: "Received"
							},
							{
								value: "draft",
								label: "Draft"
							},
							{
								value: "closed",
								label: "Closed"
							}
						]
					}),
					visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl",
							children: "No purchase orders here"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: orders.length === 0 ? "Issue one and put the delivery on the calendar." : "Nothing matches this filter."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3",
						children: visible.map((order) => {
							const badge = orderTone(order, today);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-2xl border border-line bg-surface p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium",
													children: order.number
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													tone: badge.tone,
													children: badge.label
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 truncate text-sm text-muted",
												children: order.vendor.name || "Unnamed vendor"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-faint",
												children: ["Expected ", formatAgenda(order.expectedDate)]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl tabular-nums",
										children: money(summarize(order.items, order.taxEnabled, order.taxRate).total, order.currency)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => onOpen(order.id),
										children: "Open"
									}), order.status !== "received" && order.status !== "closed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setOrderStatus(order.id, "received"),
										children: "Mark received"
									}) : null]
								})]
							}, order.id);
						})
					})
				]
			})
		]
	});
}
function SettingsPanel() {
	const company = useLedger((state) => state.company);
	const categories = useLedger((state) => state.categories);
	const terms = useLedger((state) => state.terms);
	const updateCompany = useLedger((state) => state.updateCompany);
	const addCategory = useLedger((state) => state.addCategory);
	const updateCategory = useLedger((state) => state.updateCategory);
	const removeCategory = useLedger((state) => state.removeCategory);
	const addTerm = useLedger((state) => state.addTerm);
	const updateTerm = useLedger((state) => state.updateTerm);
	const removeTerm = useLedger((state) => state.removeTerm);
	const loadSample = useLedger((state) => state.loadSample);
	const clearDocuments = useLedger((state) => state.clearDocuments);
	const [categoryName, setCategoryName] = (0, import_react.useState)("");
	const [appliesTo, setAppliesTo] = (0, import_react.useState)("both");
	const [termName, setTermName] = (0, import_react.useState)("");
	const [termDays, setTermDays] = (0, import_react.useState)("30");
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	function addNewCategory() {
		const name = categoryName.trim();
		if (!name) return;
		addCategory(name, appliesTo);
		setCategoryName("");
	}
	function addNewTerm() {
		const name = termName.trim();
		const days = Number(termDays);
		if (!name || !Number.isFinite(days)) return;
		addTerm(name, Math.max(0, Math.min(365, Math.round(days))));
		setTermName("");
		setTermDays("30");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: "Quire keeps your books in this browser only. They are not uploaded to an account. Download a PDF when you need a copy somewhere else."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Business"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: company.name,
								onChange: (event) => updateCompany({ name: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: company.email,
								onChange: (event) => updateCompany({ email: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: company.phone,
								onChange: (event) => updateCompany({ phone: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tax ID",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: company.taxId,
								onChange: (event) => updateCompany({ taxId: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: company.address,
								onChange: (event) => updateCompany({ address: event.target.value })
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Numbering and tax"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Currency",
							hint: "Used on new documents.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: company.currency,
								onChange: (event) => updateCompany({ currency: event.target.value }),
								children: CURRENCIES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: code,
									children: code
								}, code))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Default tax rate",
							hint: "New documents start with tax on when this is above zero.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecimalInput, {
								label: "Default tax rate",
								max: 100,
								value: company.defaultTaxRate,
								onValueChange: (defaultTaxRate) => updateCompany({ defaultTaxRate })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Invoice prefix",
							hint: `Next invoice will be ${company.invoicePrefix}${company.nextInvoice}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: company.invoicePrefix,
								onChange: (event) => updateCompany({ invoicePrefix: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Next invoice number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: String(company.nextInvoice),
								onChange: (event) => {
									const next = Number(event.target.value.replace(/[^\d]/g, ""));
									updateCompany({ nextInvoice: next > 0 ? next : 1 });
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "PO prefix",
							hint: `Next order will be ${company.poPrefix}${company.nextPo}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: company.poPrefix,
								onChange: (event) => updateCompany({ poPrefix: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Next PO number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								inputMode: "numeric",
								value: String(company.nextPo),
								onChange: (event) => {
									const next = Number(event.target.value.replace(/[^\d]/g, ""));
									updateCompany({ nextPo: next > 0 ? next : 1 });
								}
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-2xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Categories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "These are the options on each invoice and purchase-order line."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3",
						children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-2 md:flex-row md:items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "md:flex-1",
									"aria-label": `Category name ${category.name}`,
									value: category.name,
									onChange: (event) => updateCategory(category.id, { name: event.target.value })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									className: "md:w-56",
									"aria-label": `Where ${category.name} applies`,
									value: category.appliesTo,
									onChange: (event) => updateCategory(category.id, { appliesTo: event.target.value }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "both",
											children: "Invoices and orders"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "invoice",
											children: "Invoices only"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "order",
											children: "Purchase orders only"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => removeCategory(category.id),
									children: "Remove"
								})
							]
						}, category.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 md:flex-row md:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "md:flex-1",
								"aria-label": "New category name",
								placeholder: "New category",
								value: categoryName,
								onChange: (event) => setCategoryName(event.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								className: "md:w-56",
								"aria-label": "New category applies to",
								value: appliesTo,
								onChange: (event) => setAppliesTo(event.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "both",
										children: "Invoices and orders"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "invoice",
										children: "Invoices only"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "order",
										children: "Purchase orders only"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: addNewCategory,
								children: "Add category"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-2xl border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl tracking-tight",
						children: "Billing terms"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Choosing a term sets the invoice due date from the issue date."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3",
						children: terms.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-2 md:flex-row md:items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "md:flex-1",
									"aria-label": `Term name ${term.name}`,
									value: term.name,
									onChange: (event) => updateTerm(term.id, { name: event.target.value })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "md:w-32",
									"aria-label": `Days for ${term.name}`,
									inputMode: "numeric",
									value: String(term.days),
									onChange: (event) => {
										const days = Number(event.target.value.replace(/[^\d]/g, ""));
										updateTerm(term.id, { days: Number.isFinite(days) ? Math.min(365, days) : 0 });
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => removeTerm(term.id),
									children: "Remove"
								})
							]
						}, term.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 md:flex-row md:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "md:flex-1",
								"aria-label": "New term name",
								placeholder: "Net 60",
								value: termName,
								onChange: (event) => setTermName(event.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "md:w-32",
								"aria-label": "New term days",
								inputMode: "numeric",
								value: termDays,
								onChange: (event) => setTermDays(event.target.value.replace(/[^\d]/g, "").slice(0, 3))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: addNewTerm,
								children: "Add term"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 rounded-2xl border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Books"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setConfirm("sample"),
						children: "Restore sample books"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => setConfirm("clear"),
						children: "Remove all documents"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				open: confirm !== null,
				title: confirm === "sample" ? "Restore the sample?" : "Remove every document?",
				onClose: () => setConfirm(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: confirm === "sample" ? "This replaces the current invoices and purchase orders with the Northline Atelier sample. Your business profile is replaced too." : "Invoices and purchase orders will be deleted from this browser. Your business profile, categories, and billing terms stay."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: confirm === "clear" ? "danger" : "primary",
						onClick: () => {
							if (confirm === "sample") {
								loadSample();
								toast("Sample books restored.");
							} else {
								clearDocuments();
								toast("Documents removed.");
							}
							setConfirm(null);
						},
						children: confirm === "sample" ? "Restore sample" : "Remove documents"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => setConfirm(null),
						children: "Cancel"
					})]
				})]
			})
		]
	});
}
var NAV = [
	{
		view: "desk",
		label: "Desk",
		icon: LayoutDashboard
	},
	{
		view: "invoices",
		label: "Invoices",
		icon: FileText
	},
	{
		view: "orders",
		label: "Orders",
		icon: ClipboardList
	},
	{
		view: "settings",
		label: "Settings",
		icon: Settings
	}
];
function isActive(current, item) {
	if (item === "invoices") return current === "invoices" || current === "invoice";
	if (item === "orders") return current === "orders" || current === "order";
	return current === item;
}
function Shell({ view, onNavigate, children }) {
	const company = useLedger((state) => state.company);
	const unpaid = useLedger((state) => state.invoices.filter((invoice) => invoice.status === "unpaid").length);
	const activeOrders = useLedger((state) => state.orders.filter((order) => order.status === "open" || order.status === "scheduled").length);
	const banner = useLedger((state) => state.banner);
	const dismissBanner = useLedger((state) => state.dismissBanner);
	const counts = {
		invoices: unpaid,
		orders: activeOrders
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg md:flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl tracking-tight text-ink",
					children: "Quire"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Invoices and purchase orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-8 grid gap-1",
					"aria-label": "Primary",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavButton, {
						item,
						active: isActive(view, item.view),
						count: counts[item.view],
						onNavigate
					}, item.view))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium text-ink",
						children: company.name || "Your business"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-faint",
						children: company.email || "Saved in this browser"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 border-b border-line bg-bg md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl leading-none text-ink",
						children: "Quire"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-40 truncate text-xs text-muted",
						children: company.name || "Your business"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex gap-2 overflow-x-auto px-4 pb-3",
					"aria-label": "Primary",
					children: NAV.map((item) => {
						const active = isActive(view, item.view);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-current": active ? "page" : void 0,
							onClick: () => onNavigate(item.view),
							className: cn("inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm px-3 text-sm font-medium", active ? "bg-ink text-paper" : "bg-surface text-ink"),
							children: [item.label, counts[item.view] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-xs opacity-70",
								children: counts[item.view]
							}) : null]
						}, item.view);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-6xl px-4 py-5 md:px-8 md:py-8",
				children: [banner === "sample" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-sm text-muted",
						children: "Sample books for Northline Atelier are in this browser. Clear them in Settings when you want your own."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onNavigate("settings"),
							className: "min-h-11 rounded-sm px-3 text-sm font-medium text-ink hover:bg-wash",
							children: "Settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: dismissBanner,
							className: "min-h-11 rounded-sm px-3 text-sm font-medium text-muted hover:bg-wash",
							children: "Dismiss"
						})]
					})]
				}) : null, children]
			})]
		})]
	});
}
function NavButton({ item, active, count, onNavigate }) {
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-current": active ? "page" : void 0,
		onClick: () => onNavigate(item.view),
		className: cn("flex min-h-11 items-center justify-between rounded-sm px-3 text-left text-sm font-medium", active ? "bg-ink text-paper" : "text-ink hover:bg-wash"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "size-4",
				"aria-hidden": true
			}), item.label]
		}), count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums text-xs opacity-70",
			children: count
		}) : null]
	});
}
function Home() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [today, setToday] = (0, import_react.useState)(todayISO());
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			await useLedger.persist.rehydrate();
			if (cancelled) return;
			if (!useLedger.getState().bootstrapped) useLedger.getState().loadSample();
			if (cancelled) return;
			setToday(todayISO());
			setReady(true);
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		document.title = `${{
			desk: "Desk",
			invoices: "Invoices",
			invoice: "Invoice",
			orders: "Purchase orders",
			order: "Purchase order",
			settings: "Settings"
		}[search.view]} · Quire`;
	}, [search.view]);
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [search.view, search.id]);
	function go(view, id) {
		navigate({ search: id ? {
			view,
			id
		} : { view } });
	}
	function newInvoice() {
		go("invoice", useLedger.getState().createInvoice());
	}
	function newOrder() {
		go("order", useLedger.getState().createOrder());
	}
	const view = search.view;
	const id = search.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		view,
		onNavigate: (next) => go(next),
		children: [!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Opening your books…"
		}) : view === "desk" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Desk, {
			today,
			onOpenInvoice: (docId) => go("invoice", docId),
			onOpenOrder: (docId) => go("order", docId),
			onNewInvoice: newInvoice,
			onNewOrder: newOrder
		}) : view === "invoices" || view === "invoice" && !id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvoiceList, {
			today,
			onOpen: (docId) => go("invoice", docId),
			onCreate: newInvoice
		}) : view === "invoice" && id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentEditor, {
			kind: "invoice",
			id,
			today,
			onBack: () => go("invoices")
		}) : view === "orders" || view === "order" && !id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderBoard, {
			today,
			onOpen: (docId) => go("order", docId),
			onCreate: newOrder
		}) : view === "order" && id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentEditor, {
			kind: "order",
			id,
			today,
			onBack: () => go("orders")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "bottom-center",
			toastOptions: { className: "quire-toast" }
		})]
	});
}
//#endregion
export { Home as component };
