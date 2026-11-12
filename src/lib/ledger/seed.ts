import { addDaysISO, stamp } from "@/lib/ledger/format";
import type { Banner, Category, Company, Invoice, PaymentTerm, PurchaseOrder } from "@/lib/ledger/types";

export type LedgerData = {
  company: Company;
  categories: Category[];
  terms: PaymentTerm[];
  invoices: Invoice[];
  orders: PurchaseOrder[];
  bootstrapped: boolean;
  banner: Banner;
};

export function blankCompany(): Company {
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
    nextPo: 2001,
  };
}

export function blankData(): LedgerData {
  return {
    company: blankCompany(),
    categories: [],
    terms: [
      { id: "term_0", name: "Due on receipt", days: 0 },
      { id: "term_30", name: "Net 30", days: 30 },
    ],
    invoices: [],
    orders: [],
    bootstrapped: false,
    banner: "none",
  };
}

export function buildSample(today: string): LedgerData {
  const company: Company = {
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
    nextPo: 224,
  };

  const categories: Category[] = [
    { id: "cat_design", name: "Design fees", appliesTo: "invoice" },
    { id: "cat_site", name: "Site work", appliesTo: "both" },
    { id: "cat_materials", name: "Materials", appliesTo: "both" },
    { id: "cat_print", name: "Printing", appliesTo: "both" },
    { id: "cat_sub", name: "Subcontract", appliesTo: "both" },
    { id: "cat_freight", name: "Freight", appliesTo: "order" },
    { id: "cat_software", name: "Software", appliesTo: "invoice" },
  ];

  const terms: PaymentTerm[] = [
    { id: "term_0", name: "Due on receipt", days: 0 },
    { id: "term_15", name: "Net 15", days: 15 },
    { id: "term_30", name: "Net 30", days: 30 },
    { id: "term_45", name: "Net 45", days: 45 },
  ];

  const issued = (offset: number) => addDaysISO(today, offset);

  const invoices: Invoice[] = [
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
        address: "88 Front Avenue\nAstoria, OR 97103",
      },
      items: [
        {
          id: "li_1041_a",
          description: "Schematic design package",
          categoryId: "cat_design",
          quantity: 1,
          unitPrice: 4800,
        },
        {
          id: "li_1041_b",
          description: "Community workshop",
          categoryId: "cat_site",
          quantity: 2,
          unitPrice: 650,
        },
      ],
      taxEnabled: false,
      taxRate: 0,
      notes: "Please reference the library board approval from March. Workshop dates are confirmed.",
      currency: "USD",
      paidOn: null,
      updatedAt: stamp(issued(-2)),
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
        address: "14 Tanner Street\nPortland, OR 97214",
      },
      items: [
        {
          id: "li_1042_a",
          description: "Interior finish schedule",
          categoryId: "cat_design",
          quantity: 1,
          unitPrice: 2200,
        },
        {
          id: "li_1042_b",
          description: "Material sample set",
          categoryId: "cat_materials",
          quantity: 1,
          unitPrice: 340,
        },
      ],
      taxEnabled: true,
      taxRate: 8.5,
      notes: "The retainer does not cover samples. Please pay against this invoice number.",
      currency: "USD",
      paidOn: null,
      updatedAt: stamp(issued(-1)),
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
        address: "500 Division Street\nPortland, OR 97202",
      },
      items: [
        {
          id: "li_1040_a",
          description: "Signage drawings",
          categoryId: "cat_design",
          quantity: 1,
          unitPrice: 1600,
        },
      ],
      taxEnabled: false,
      taxRate: 0,
      notes: "Thank you. Paid by transfer.",
      currency: "USD",
      paidOn: issued(-8),
      updatedAt: stamp(issued(-8)),
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
        address: "9 Oak Lane\nLake Oswego, OR 97034",
      },
      items: [
        {
          id: "li_1043_a",
          description: "Concept hours",
          categoryId: "cat_design",
          quantity: 6,
          unitPrice: 180,
        },
      ],
      taxEnabled: true,
      taxRate: 8.5,
      notes: "",
      currency: "USD",
      paidOn: null,
      updatedAt: stamp(today),
    },
  ];

  const orders: PurchaseOrder[] = [
    {
      id: "po_221",
      number: "PO-221",
      status: "open",
      issueDate: issued(-10),
      expectedDate: issued(-1),
      vendor: {
        name: "Sable Paper Co.",
        email: "orders@sablepaper.example",
        address: "220 Industrial Way\nPortland, OR 97217",
      },
      shipTo: "Northline Atelier\n412 Harbor Street, Suite 3\nPortland, OR 97214",
      items: [
        {
          id: "li_221_a",
          description: "Cotton paper, 100 lb, warm white",
          categoryId: "cat_print",
          quantity: 200,
          unitPrice: 1.85,
        },
      ],
      taxEnabled: false,
      taxRate: 0,
      notes: "Leave with the front desk if the studio is closed.",
      currency: "USD",
      receivedOn: null,
      updatedAt: stamp(issued(-1)),
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
        address: "18 River Road\nOregon City, OR 97045",
      },
      shipTo: "Northline Atelier\n412 Harbor Street, loading dock\nPortland, OR 97214",
      items: [
        {
          id: "li_220_a",
          description: "White oak slab, 8 ft",
          categoryId: "cat_materials",
          quantity: 1,
          unitPrice: 1860,
        },
        {
          id: "li_220_b",
          description: "Delivery",
          categoryId: "cat_freight",
          quantity: 1,
          unitPrice: 140,
        },
      ],
      taxEnabled: false,
      taxRate: 0,
      notes: "Call the studio one hour before the truck arrives. The dock faces Salmon Street.",
      currency: "USD",
      receivedOn: null,
      updatedAt: stamp(issued(-1)),
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
        address: "640 Belmont Street\nPortland, OR 97214",
      },
      shipTo: "Northline Atelier\n412 Harbor Street, Suite 3\nPortland, OR 97214",
      items: [
        {
          id: "li_222_a",
          description: "Bound presentation sets",
          categoryId: "cat_print",
          quantity: 12,
          unitPrice: 48,
        },
      ],
      taxEnabled: false,
      taxRate: 0,
      notes: "Saddle stitch. Cover stock to match the oak sample.",
      currency: "USD",
      receivedOn: null,
      updatedAt: stamp(today),
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
        address: "77 Powell Boulevard\nPortland, OR 97202",
      },
      shipTo: "Northline Atelier\n412 Harbor Street, Suite 3\nPortland, OR 97214",
      items: [
        {
          id: "li_218_a",
          description: "Cabinet pulls, unlacquered brass",
          categoryId: "cat_materials",
          quantity: 40,
          unitPrice: 12.5,
        },
      ],
      taxEnabled: false,
      taxRate: 0,
      notes: "Checked in against the packing slip.",
      currency: "USD",
      receivedOn: issued(-8),
      updatedAt: stamp(issued(-8)),
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
        address: "3 Quarry Road\nDundee, OR 97115",
      },
      shipTo: "Northline Atelier\n412 Harbor Street, Suite 3\nPortland, OR 97214",
      items: [
        {
          id: "li_223_a",
          description: "Honed limestone sample",
          categoryId: "cat_materials",
          quantity: 3,
          unitPrice: 90,
        },
      ],
      taxEnabled: false,
      taxRate: 0,
      notes: "",
      currency: "USD",
      receivedOn: null,
      updatedAt: stamp(today),
    },
  ];

  return {
    company,
    categories,
    terms,
    invoices,
    orders,
    bootstrapped: true,
    banner: "sample",
  };
}
