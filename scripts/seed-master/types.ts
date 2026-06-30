export interface SeedConfig {
  backendUrl: string;
  xAppId: string;
  buCode: string;
  email: string;
  password: string;
}

export type EntityName =
  | "currency" | "unit" | "tax-profile" | "delivery-point" | "department"
  | "store-location" | "item-group" | "vendor" | "product";

export const ALL_ENTITIES: EntityName[] = [
  "currency", "unit", "tax-profile", "delivery-point", "department",
  "store-location", "item-group", "vendor", "product",
];

export interface SeedResult {
  entity: string;
  key: string;
  status: "created" | "skipped" | "failed";
  error?: string;
}

/** One spreadsheet row as keyed by its header cells. */
export type Row = Record<string, unknown>;

export interface RawRows {
  currency: Row[];
  unit: Row[];
  taxProfile: Row[];
  deliveryPoint: Row[];
  department: Row[];
  storeLocation: Row[];
  itemGroup: Row[];
  vendor: Row[];
  product: Row[];
}

/** Real backend paths — the SPA's `/api/proxy` prefix is dropped. */
export const ENDPOINTS = {
  login: () => `/api/auth/login`,
  currencies: (bu: string) => `/api/config/${bu}/currencies`,
  units: (bu: string) => `/api/config/${bu}/units`,
  taxProfiles: (bu: string) => `/api/config/${bu}/tax-profiles`,
  deliveryPoints: (bu: string) => `/api/config/${bu}/delivery-points`,
  departments: (bu: string) => `/api/config/${bu}/departments`,
  locations: (bu: string) => `/api/config/${bu}/locations`,
  productCategories: (bu: string) => `/api/config/${bu}/product-categories`,
  productSubCategories: (bu: string) => `/api/config/${bu}/product-sub-categories`,
  productItemGroups: (bu: string) => `/api/config/${bu}/product-item-groups`,
  vendors: (bu: string) => `/api/config/${bu}/vendors`,
  products: (bu: string) => `/api/config/${bu}/products`,
} as const;

interface TransferPayload {
  add: { id: string }[];
  remove: { id: string }[];
}

export interface CreateCurrencyDto {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  description: string;
  decimal_places: number;
  is_active: boolean;
}

export interface CreateUnitDto {
  name: string;
  description: string;
  is_active: boolean;
}

export interface CreateTaxProfileDto {
  name: string;
  tax_rate: number;
  is_active: boolean;
}

export interface CreateDeliveryPointDto {
  name: string;
  is_active: boolean;
}

export interface CreateDepartmentDto {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  department_users: TransferPayload;
  hod_users: TransferPayload;
}

export type InventoryType = "inventory" | "direct" | "consignment";
export type PhysicalCountType = "yes" | "no";

export interface CreateLocationDto {
  code: string;
  name: string;
  location_type: InventoryType;
  physical_count_type: PhysicalCountType;
  description: string;
  is_active: boolean;
  delivery_point_id?: string;
  delivery_point_name?: string;
  users: TransferPayload;
  products: TransferPayload;
}

export interface CreateCategoryDto {
  code: string;
  name: string;
  is_active: boolean;
}

export interface CreateSubCategoryDto {
  code: string;
  name: string;
  is_active: boolean;
  product_category_id: string;
  cascade_deviation: boolean;
}

export interface CreateItemGroupDto {
  code: string;
  name: string;
  is_active: boolean;
  product_subcategory_id: string;
  cascade_deviation: boolean;
}

export interface PlannedSubCategory {
  code: string;
  name: string;
  parentCategoryCode: string;
}

export interface PlannedItemGroup {
  code: string;
  name: string;
  parentSubCategoryCode: string;
}

export interface ItemGroupTree {
  categories: CreateCategoryDto[];
  subcategories: PlannedSubCategory[];
  itemGroups: PlannedItemGroup[];
}

interface VendorInfoItem { label: string; value: string; data_type: string; }
// Mirrors backend enum_vendor_address_type — keep in sync so an invalid literal
// (e.g. the old "main") fails at compile time instead of a runtime 400.
type VendorAddressType = "contact_address" | "mailing_address" | "register_address";
interface VendorAddressPayload {
  address_type: VendorAddressType;
  address_line1: string;
  address_line2: string;
  city: string;
  district: string;
  sub_district: string;
  province: string;
  postal_code: string;
  country: string;
}
interface VendorContactPayload {
  name: string;
  email: string;
  phone: string;
  is_primary: boolean;
}

export interface CreateVendorDto {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  business_type: { id: string; name: string }[];
  info: VendorInfoItem[];
  vendor_address: { add: VendorAddressPayload[] };
  vendor_contact: { add: VendorContactPayload[] };
}

interface ProductInfoItem { label: string; value: string; data_type: string; }

export interface CreateProductDto {
  code: string;
  name: string;
  local_name: string;
  description: string;
  inventory_unit_id: string;
  product_item_group_id: string;
  product_status_type: "active" | "inactive";
  tax_profile_id: string | null;
  price_deviation_limit: number | null;
  qty_deviation_limit: number | null;
  product_info: {
    is_used_in_recipe: boolean;
    is_sold_directly: boolean;
    barcode: string;
    sku: string;
    price: number | null;
    info: ProductInfoItem[];
  };
}
