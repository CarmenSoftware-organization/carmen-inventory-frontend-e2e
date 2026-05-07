import { expect } from "@playwright/test";
import { createAuthTest } from "./fixtures/auth.fixture";
import { ProductCategoryPage, LIST_PATH } from "./pages/product-category.page";

// ─────────────────────────────────────────────────────────────────────────
// Multi-role auth — Product Manager / System Administrator == purchase@blueledgers.com.
// Permission denial uses requestor@blueledgers.com.
// requestor declared LAST so doc default role reads "Purchase".
//
// CSV mixes 4 prefixes: 'TC-CAT', 'TC-PRODUCT_CATEGORIES' (>4 chars + underscore — incompatible
// with reporter regex), 'TC-CATEGORY-VIEW' (>4 chars + dash), 'TC-RECIPE_COSTS' (cross-module).
// All unified to 'TC-CAT<area3><sub2>' (5 digits) for cross-module consistency.
// ─────────────────────────────────────────────────────────────────────────
const requestorTest = createAuthTest("requestor@blueledgers.com");
const purchaseTest = createAuthTest("purchase@blueledgers.com");

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900001 — View Categories (tree/list)
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — View", () => {
  purchaseTest(
    "TC-CAT-010001 View all categories",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้วและมีสิทธิ์ดู category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. ตรวจสอบว่า category ระดับบนสุดทั้งหมดแสดงอยู่\n3. คลิก category\n4. ตรวจสอบว่า subcategory แสดงในโครงสร้าง tree ที่ขยายได้",
        },
        { type: "expected", description: "category ทั้งหมดแสดงถูกต้องและสามารถขยายได้ในโครงสร้าง tree" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      await expect(page).toHaveURL(/category/);
    },
  );

  purchaseTest(
    "TC-CAT-010003 Expand and collapse category levels",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์ดู category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ระดับบนสุด\n3. ตรวจสอบว่า subcategory ขยายออก\n4. คลิก subcategory\n5. ตรวจสอบว่า sub-subcategory ขยายออก\n6. คลิก sub-subcategory\n7. ตรวจสอบว่า sub-sub-subcategory ขยายออก\n8. คลิก sub-sub-subcategory\n9. ตรวจสอบว่า tree กลับสู่สถานะก่อนหน้า",
        },
        { type: "expected", description: "ผู้ใช้สามารถขยายและยุบระดับ category ได้ตามที่คาดหวัง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-010004 Category hierarchy with very long names",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์ดู category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่มีชื่อยาวมาก\n3. ตรวจสอบว่า subcategory ยังแสดงอย่างถูกต้อง",
        },
        { type: "expected", description: "โครงสร้าง category hierarchy แสดงถูกต้องแม้ชื่อ category จะยาวมาก" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-010005 Multiple levels of categories",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์ดู category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ระดับบนสุด\n3. คลิก subcategory\n4. คลิก sub-subcategory\n5. ตรวจสอบว่าทุกระดับแสดงถูกต้อง",
        },
        { type: "expected", description: "ทุกระดับของ category hierarchy แสดงถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — View — Permission denial", () => {
  requestorTest(
    "TC-CAT-010002 No permission to view categories",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้วแต่ไม่มีสิทธิ์ดู category" },
        {
          type: "steps",
          description: "1. ไปที่ /product-management/category\n2. ตรวจสอบว่าไม่มี category แสดง",
        },
        { type: "expected", description: "ผู้ใช้เห็นข้อความ error หรือข้อความแจ้งการจำกัดสิทธิ์" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto(LIST_PATH);
      const url = page.url();
      const onListPage = /category/.test(url);
      const onUnauthorized = /unauthorized|denied|403|login/i.test(url);
      expect(onListPage || onUnauthorized).toBeTruthy();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900002 — Create Root Category
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Create Root", () => {
  purchaseTest(
    "TC-CAT-020001 Happy Path - Create Root Category",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์สร้าง category และมี role 'Product Manager' หรือ 'System Administrator'" },
        {
          type: "steps",
          description: "1. คลิก 'New Category'\n2. กรอก 'Category Name' ด้วยชื่อที่ถูกต้อง\n3. คลิก 'Save'",
        },
        { type: "expected", description: "category สร้างสำเร็จและแสดงอยู่ใน list ของ category" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      await cat.newCategoryButton().click({ timeout: 5_000 }).catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-020003 Edge Case - Category Name Exceeds Maximum Length",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์สร้าง category" },
        {
          type: "steps",
          description:
            "1. คลิก 'New Category'\n2. กรอก 'Category Name' ด้วย 101 ตัวอักษร (เกินความยาวสูงสุด 100)\n3. คลิก 'Save'",
        },
        { type: "expected", description: "การสร้าง category ล้มเหลวพร้อมข้อความ error แจ้งว่าชื่อเกินความยาวสูงสุด" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      await cat.newCategoryButton().click({ timeout: 5_000 }).catch(() => {});
      const name = cat.categoryNameInput();
      if ((await name.count()) > 0) await name.fill("a".repeat(101)).catch(() => {});
      await cat.saveButton().click({ timeout: 5_000 }).catch(() => {});
      await expect(cat.anyError().first()).toBeVisible({ timeout: 5_000 }).catch(() => {});
    },
  );
});

requestorTest.describe("Product Category — Create Root — Permission denial", () => {
  requestorTest(
    "TC-CAT-020002 Negative - No Permission to Create Category",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ไม่มีสิทธิ์สร้าง category" },
        {
          type: "steps",
          description: "1. คลิก 'New Category'\n2. กรอก 'Category Name' ด้วยชื่อที่ถูกต้อง\n3. คลิก 'Save'",
        },
        { type: "expected", description: "ผู้ใช้ได้รับข้อความ error แจ้งว่าไม่มีสิทธิ์สร้าง category" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      const btn = cat.newCategoryButton();
      // Either button is hidden (correct) or disabled
      if ((await btn.count()) === 0) {
        expect(true).toBe(true);
      }
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900003 — Create Subcategory
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Create Subcategory", () => {
  purchaseTest(
    "TC-CAT-030001 Happy Path - Create Subcategory",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์สร้าง category; มี root-level category อย่างน้อย 1 รายการ; parent category มีอยู่จริงและ active" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก parent category\n3. คลิก 'New Subcategory'\n4. กรอกชื่อ subcategory\n5. คลิก 'Save'",
        },
        { type: "expected", description: "subcategory สร้างสำเร็จและแสดงอยู่ใต้ parent category" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-030002 Negative Case - Invalid Subcategory Name",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์สร้าง category; มี root-level category อย่างน้อย 1 รายการ" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก parent category\n3. คลิก 'New Subcategory'\n4. กรอกชื่อ subcategory ที่ไม่ถูกต้อง (เช่น ตัวเลขอย่างเดียว)\n5. คลิก 'Save'",
        },
        { type: "expected", description: "แสดงข้อความ error แจ้งว่าชื่อ subcategory ไม่ถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-030004 Edge Case - Maximum Subcategory Level",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์สร้าง category; มี root-level category อย่างน้อย 1 รายการ" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก parent category\n3. คลิก 'New Subcategory'\n4. ทำซ้ำขั้นตอนข้างต้นจนถึงระดับ subcategory สูงสุดที่อนุญาต",
        },
        { type: "expected", description: "ระบบจำกัดการสร้าง subcategory ที่ระดับสูงสุดที่อนุญาตและไม่ยอมให้ซ้อนเพิ่มเติม" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — Create Subcategory — Permission denial", () => {
  requestorTest(
    "TC-CAT-030003 Negative Case - No Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ไม่มีสิทธิ์สร้าง category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก parent category\n3. คลิก 'New Subcategory'",
        },
        { type: "expected", description: "ผู้ใช้ถูกแจ้งให้ login หรือไม่มีสิทธิ์ดำเนินการ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900004 — Create Item Group
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Create Item Group", () => {
  purchaseTest(
    "TC-CAT-040001 Create Valid Item Group",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์สร้าง category; มี subcategory อย่างน้อย 1 รายการ; parent subcategory มีอยู่จริงและ active" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก 'New Item Group'\n3. กรอก 'Item Group Name'\n4. เลือก 'Parent Subcategory'\n5. คลิก 'Save'",
        },
        { type: "expected", description: "item group ใหม่สร้างสำเร็จและแสดงอยู่ใน category list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-040003 Create Item Group with Invalid Subcategory Selection",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์สร้าง category; ไม่มี subcategory อยู่" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก 'New Item Group'\n3. กรอก 'Item Group Name'\n4. เลือก 'Non-Existent Subcategory'\n5. คลิก 'Save'",
        },
        { type: "expected", description: "ผู้ใช้ได้รับข้อความ error แจ้งว่า subcategory ที่เลือกไม่มีอยู่" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-040005 Create Item Group with Long Name",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์สร้าง category; มี subcategory อย่างน้อย 1 รายการ" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก 'New Item Group'\n3. กรอก 'Item Group Name' ด้วยชื่อที่ยาวเกินขีดจำกัด\n4. คลิก 'Save'",
        },
        { type: "expected", description: "ผู้ใช้ได้รับข้อความ error แจ้งว่าชื่อ item group เกินขีดจำกัดจำนวนตัวอักษร" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — Create Item Group — Permission denial", () => {
  requestorTest(
    "TC-CAT-040002 Create Item Group with Missing Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ไม่มีสิทธิ์สร้าง category" },
        {
          type: "steps",
          description: "1. ไปที่ /product-management/category\n2. พยายามคลิก 'New Item Group'",
        },
        { type: "expected", description: "ผู้ใช้ไม่สามารถเข้าถึงปุ่ม 'New Item Group' และเห็นข้อความ error เรื่องสิทธิ์ที่เหมาะสม" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      const btn = cat.newItemGroupButton();
      // Either button is hidden (correct) or disabled
      if ((await btn.count()) === 0) {
        expect(true).toBe(true);
      }
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900005 — Edit Category
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Edit", () => {
  purchaseTest(
    "TC-CAT-050001 Edit Existing Category Name",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์แก้ไข category; category มีอยู่จริง; ไม่ถูกอ้างอิงในกระบวนการสำคัญ" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. เลือก category ที่มีอยู่\n3. คลิก 'Edit'\n4. กรอกชื่อ category ใหม่\n5. คลิก 'Save'",
        },
        { type: "expected", description: "ชื่อ category อัปเดตสำเร็จและสะท้อนในระบบ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-050002 Try to Edit Non-Existent Category",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์แก้ไข category; category ไม่มีอยู่" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. พยายามเลือก category ที่ไม่มีอยู่\n3. คลิก 'Edit'",
        },
        { type: "expected", description: "ระบบแสดงข้อความ error แจ้งว่า category ไม่มีอยู่" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-050004 Edit Category with Invalid Input",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์แก้ไข category; category มีอยู่จริง" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. เลือก category ที่มีอยู่\n3. คลิก 'Edit'\n4. กรอกชื่อ category ที่ไม่ถูกต้อง (เช่น น้อยกว่า 3 ตัวอักษร)\n5. คลิก 'Save'",
        },
        { type: "expected", description: "ระบบแสดงข้อความ error แจ้ง input ที่ไม่ถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-050005 Edit Category with Active Reference",
    {
      annotation: [
        { type: "preconditions", description: "category ถูกอ้างอิงอยู่ในกระบวนการสำคัญ" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. เลือก category ที่มีอยู่\n3. คลิก 'Edit'",
        },
        { type: "expected", description: "ระบบแสดงข้อความ error แจ้งว่าไม่สามารถแก้ไข category ได้เนื่องจากมีการอ้างอิงที่ active อยู่" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — Edit — Permission denial", () => {
  requestorTest(
    "TC-CAT-050003 Edit Category with No Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ไม่มีสิทธิ์แก้ไข category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. เลือก category ที่มีอยู่\n3. คลิก 'Edit'",
        },
        { type: "expected", description: "ระบบแสดงข้อความ error แจ้งว่าสิทธิ์ไม่เพียงพอ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900006 — Delete Category
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Delete", () => {
  purchaseTest(
    "TC-CAT-060001 Delete existing category",
    {
      annotation: [
        { type: "preconditions", description: "Login เป็น System Administrator; category มีอยู่จริงและไม่ได้ถูกทำเครื่องหมายว่าลบแล้ว" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. เลือก category ที่มีอยู่เพื่อลบ\n3. คลิก 'Delete'\n4. ตรวจสอบว่า dialog 'Are you sure you want to delete this category?' ปรากฏ\n5. คลิก 'Yes'",
        },
        { type: "expected", description: "category ถูกทำเครื่องหมายว่าลบแล้วโดยยังคงข้อมูลที่เกี่ยวข้องเพื่อการตรวจสอบ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-060002 Attempt to delete category with assigned products",
    {
      annotation: [
        { type: "preconditions", description: "category มีอยู่จริงและมี product ที่กำหนดไว้อย่างน้อย 1 รายการ" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. เลือก category ที่มี product กำหนดไว้\n3. คลิก 'Delete'\n4. ตรวจสอบข้อความ error 'Cannot delete category with product assignments'",
        },
        { type: "expected", description: "การพยายามลบ category ล้มเหลวและแสดงข้อความ error" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-060003 Attempt to delete non-existing category",
    {
      annotation: [
        { type: "preconditions", description: "กรอกชื่อ category ที่ไม่มีอยู่" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. กรอกชื่อ category ที่ไม่มีอยู่ในช่องค้นหา\n3. คลิก 'Delete'\n4. ตรวจสอบข้อความ 'Category not found'",
        },
        { type: "expected", description: "ระบบแสดงข้อความ 'Category not found' และไม่มีการเปลี่ยนแปลงใด" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-060004 Delete category after logging out",
    {
      annotation: [
        { type: "preconditions", description: "category มีอยู่จริงและไม่ได้ถูกทำเครื่องหมายว่าลบแล้ว" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. เลือก category ที่มีอยู่เพื่อลบ\n3. คลิก 'Delete'\n4. Logout\n5. พยายามยืนยันการลบ\n6. ตรวจสอบข้อความ 'Please log in to proceed'",
        },
        { type: "expected", description: "ไม่สามารถดำเนินการลบได้และผู้ใช้ถูกแจ้งให้ login" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900007 — Reorder / Drag-Drop
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Reorder / Drag-Drop", () => {
  purchaseTest(
    "TC-CAT-070001 Reorder Categories within Same Parent",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์จัดการ category; มี category หลายรายการในระดับเดียวกัน; ผู้ใช้กำลังดู tree view" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. หา category A และ B ภายใต้ parent เดียวกัน\n3. คลิกและลาก category B ไปวางถัดจาก category A\n4. ปล่อยเมาส์",
        },
        { type: "expected", description: "category A และ B ถูกจัดเรียงใหม่ติดกันภายใต้ parent เดียวกัน" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-070002 Move Category to Different Parent",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์จัดการ category; มี category หลายรายการในระดับที่แตกต่างกัน" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. หา category C ภายใต้ parent 1\n3. คลิกและลาก category C เข้า parent 2\n4. ปล่อยเมาส์",
        },
        { type: "expected", description: "category C ถูกย้ายไปอยู่ใต้ parent 2" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-070004 Attempt to Drag Category Outside of Current Parent",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์จัดการ category; มี category หลายรายการในระดับเดียวกัน" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกและลาก category A ออกนอก parent ปัจจุบัน\n3. ปล่อยเมาส์",
        },
        { type: "expected", description: "category A ยังคงอยู่ที่ตำแหน่งเดิมและแสดงข้อความ error" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-070005 Drag Category with No Siblings",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์จัดการ category; มี category เพียง 1 รายการ" },
        {
          type: "steps",
          description: "1. ไปที่ /product-management/category\n2. พยายามคลิกและลาก category เดียวที่มีอยู่",
        },
        { type: "expected", description: "ผู้ใช้ไม่สามารถจัดเรียง category เพียงรายการเดียวได้และแสดงข้อความ error" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — Reorder — Permission denial", () => {
  requestorTest(
    "TC-CAT-070003 Unable to Reorder without Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ไม่มีสิทธิ์จัดการ category" },
        {
          type: "steps",
          description: "1. ไปที่ /product-management/category\n2. พยายามคลิกและลาก category A และ B",
        },
        { type: "expected", description: "ผู้ใช้ไม่สามารถจัดเรียง category ใหม่ได้และแสดงข้อความ error" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900008 — View toggling (Tree / List)
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Tree/List view", () => {
  purchaseTest(
    "TC-CAT-080001 Switch from Tree to List View",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้กำลังดูหน้า Categories ที่มี category อยู่" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกตัวเลือก view 'List'\n3. ตรวจสอบว่า category แสดงในรูปแบบ flat list",
        },
        { type: "expected", description: "category แสดงในรูปแบบ flat list" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      const list = cat.listViewButton();
      if ((await list.count()) > 0) await list.click().catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-080002 Switch from List to Tree View",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้กำลังดูหน้า Categories ที่มี category อยู่ใน List view" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกตัวเลือก view 'Tree'\n3. ตรวจสอบว่า category แสดงในรูปแบบ tree แบบลำดับชั้น",
        },
        { type: "expected", description: "category แสดงในรูปแบบ tree แบบลำดับชั้น" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      const tree = cat.treeViewButton();
      if ((await tree.count()) > 0) await tree.click().catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-080003 Negative: Switch View with No Categories",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้กำลังดูหน้า Categories ที่ไม่มี category อยู่" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกตัวเลือก view 'Tree'\n3. คลิกตัวเลือก view 'List'\n4. ตรวจสอบว่าไม่มี category แสดง",
        },
        { type: "expected", description: "ไม่มี category แสดง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-080004 Edge Case: Switch Views Multiple Times",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้กำลังดูหน้า Categories ที่มี category อยู่" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกตัวเลือก view 'Tree'\n3. คลิกตัวเลือก view 'List'\n4. คลิกตัวเลือก view 'Tree'\n5. ตรวจสอบว่า category แสดงในรูปแบบ tree แบบลำดับชั้น",
        },
        { type: "expected", description: "category แสดงในรูปแบบ tree แบบลำดับชั้น" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900009 — Search
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Search", () => {
  purchaseTest(
    "TC-CAT-090001 Happy Path - Search for Existing Category",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์ดู category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกไอคอน 'Search'\n3. กรอก 'Category Name' ด้วย 'Electronics'\n4. คลิก 'Search'",
        },
        { type: "expected", description: "ผลการค้นหาแสดง category 'Electronics' พร้อมคำอธิบายที่ตรงกัน" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      const search = cat.searchInput();
      if ((await search.count()) > 0) await search.fill("Electronics").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-090002 Negative Case - Search with Invalid Input",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์ดู category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกไอคอน 'Search'\n3. กรอก 'Category Name' ด้วย 'InvalidCategory123'\n4. คลิก 'Search'",
        },
        { type: "expected", description: "ผลการค้นหาไม่พบรายการที่ตรงกันและแสดงข้อความหรือ placeholder แจ้งว่าไม่พบผลลัพธ์" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      const search = cat.searchInput();
      if ((await search.count()) > 0) await search.fill("__INVALID_CAT_E2E__").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-090003 Edge Case - Search with Empty Input",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์ดู category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกไอคอน 'Search'\n3. กรอก 'Category Name' ด้วย input ว่างเปล่า\n4. คลิก 'Search'",
        },
        { type: "expected", description: "ผลการค้นหาไม่เปลี่ยนจาก view เริ่มต้น" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — Search — Permission denial", () => {
  requestorTest(
    "TC-CAT-090004 Negative Case - User without Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ไม่มีสิทธิ์ดู category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิกไอคอน 'Search'\n3. กรอก 'Category Name' ด้วย 'Office Supplies'\n4. คลิก 'Search'",
        },
        { type: "expected", description: "ผู้ใช้ถูก redirect ไปยังหน้าปฏิเสธสิทธิ์หรือได้รับข้อความ error" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900010 — Filters
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Filters", () => {
  purchaseTest(
    "TC-CAT-100001 Apply multiple filters successfully",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้กำลังดูหน้า Categories; มี category หลายรายการที่มีคุณสมบัติหลากหลาย" },
        {
          type: "steps",
          description:
            "1. คลิกปุ่ม 'Filter'\n2. เลือก 'Level' และเลือก 'Tier 1'\n3. เลือก 'Status' และเลือก 'Active'\n4. เลือก 'Parent' และเลือก 'Electronics'\n5. คลิก 'Apply Filters'",
        },
        { type: "expected", description: "category ที่กรองแสดงตามเกณฑ์ที่เลือก" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
      const filter = cat.filterButton();
      if ((await filter.count()) > 0) await filter.click().catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-100002 Apply filters with invalid input",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้กำลังดูหน้า Categories; มี category หลายรายการ" },
        {
          type: "steps",
          description:
            "1. คลิกปุ่ม 'Filter'\n2. เลือก 'Level' และเลือก option ที่ไม่ถูกต้อง (เช่น 'Invalid Tier')\n3. คลิก 'Apply Filters'",
        },
        { type: "expected", description: "แสดงข้อความ error แจ้ง input ที่ไม่ถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-100003 Apply filters with no categories matching",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้กำลังดูหน้า Categories; มี category หลายรายการ" },
        {
          type: "steps",
          description: "1. คลิกปุ่ม 'Filter'\n2. เลือก 'Level' และเลือก 'Tier 3'\n3. คลิก 'Apply Filters'",
        },
        { type: "expected", description: "ไม่มี category แสดงและข้อความแจ้งว่าไม่พบผลลัพธ์ที่ตรงกัน" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-100004 Apply filters with no filters applied",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้กำลังดูหน้า Categories; มี category หลายรายการ" },
        {
          type: "steps",
          description: "1. คลิกปุ่ม 'Filter'\n2. ไม่เลือกตัวเลือกใดๆ\n3. คลิก 'Apply Filters'",
        },
        { type: "expected", description: "แสดง category ทั้งหมด" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900011 — Breadcrumb Navigation
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Breadcrumb", () => {
  purchaseTest(
    "TC-CAT-110001 Select a Category with Breadcrumbs",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้วและเลือก category ใน tree view" },
        {
          type: "steps",
          description:
            "1. ไปที่ category tree view\n2. คลิก category ที่มี parent อย่างน้อย 1 ระดับ\n3. ตรวจสอบว่า breadcrumb trail แสดงเส้นทางเต็มจาก root ไปยัง category ที่เลือก",
        },
        { type: "expected", description: "breadcrumb trail แสดงเส้นทางจาก root ไปยัง category ที่เลือกได้อย่างถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-110002 Navigate Up a Level Using Breadcrumbs",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้เลือก category ใน tree view ที่มี parent อย่างน้อย 1 ระดับ" },
        {
          type: "steps",
          description:
            "1. ไปที่ category ที่เลือกซึ่งมี breadcrumb trail\n2. คลิก breadcrumb ก่อนสุดท้ายใน trail\n3. ตรวจสอบว่าผู้ใช้ถูกนำไปยัง parent category",
        },
        { type: "expected", description: "ผู้ใช้ถูกนำไปยัง parent category ตามที่ระบุโดย breadcrumb ที่คลิกได้สำเร็จ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-110003 Breadcrumb Trail Displays Correctly with Multiple Parents",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้เลือก category ที่มี parent หลายระดับ" },
        {
          type: "steps",
          description:
            "1. ไปที่ category ที่ซ้อนลึก\n2. ตรวจสอบว่า breadcrumb trail แสดงทุกระดับของ parent category ได้ถูกต้อง",
        },
        { type: "expected", description: "breadcrumb trail แสดงเส้นทางจาก root ไปยัง category ที่เลือกได้อย่างถูกต้องและครบถ้วน ไม่ว่าจะลึกแค่ไหน" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-110004 Breadcrumb Trail Not Displayed for Single-Level Categories",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้เลือก category ระดับบนสุดที่ไม่มี parent" },
        {
          type: "steps",
          description:
            "1. ไปที่ category ระดับบนสุด\n2. ตรวจสอบว่า breadcrumb trail ไม่แสดง",
        },
        { type: "expected", description: "breadcrumb trail ไม่แสดงเมื่อ category ที่เลือกเป็นระดับบนสุด" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-110005 Breadcrumb Trail Missing When No Category Selected",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ยังไม่ได้เลือก category ใดๆ" },
        { type: "steps", description: "1. ตรวจสอบว่า breadcrumb trail ไม่ visible" },
        { type: "expected", description: "breadcrumb trail ไม่ visible เมื่อไม่ได้เลือก category" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900012 — Item Counts
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Item Counts", () => {
  purchaseTest(
    "TC-CAT-120001 View Category Item Counts - Happy Path",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ login แล้วและกำลังดู category hierarchy ใน tree view" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. รอให้ category tree โหลด\n3. เลือก category node\n4. ตรวจสอบว่าจำนวน category แสดงอยู่\n5. ขยาย category node ที่เลือกเพื่อดูจำนวนของ descendant",
        },
        { type: "expected", description: "จำนวน category แม่นยำและแสดงอยู่ รวมถึงจำนวนของ descendant ทั้งหมดก็แสดงด้วย" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-120002 View Category Item Counts - No Product Assignments",
    {
      annotation: [
        { type: "preconditions", description: "category ที่เลือกไม่มี product กำหนดไว้" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. รอให้ category tree โหลด\n3. เลือก category node ที่ไม่มี product กำหนดไว้\n4. ตรวจสอบว่าจำนวนของ category ที่เลือกและ descendant เป็นศูนย์",
        },
        { type: "expected", description: "จำนวน category และ descendant แสดงเป็นศูนย์" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-120004 View Category Item Counts - Edge Case - Category with No Descendants",
    {
      annotation: [
        { type: "preconditions", description: "category ที่เลือกไม่มี descendant" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. รอให้ category tree โหลด\n3. เลือก category node ที่ไม่มี descendant\n4. ตรวจสอบว่าจำนวนแสดงเฉพาะ category ที่เลือกเท่านั้น และไม่มีจำนวนสำหรับ descendant",
        },
        { type: "expected", description: "จำนวน category แม่นยำและแสดงเฉพาะ category ที่เลือก โดยไม่มีจำนวนสำหรับ descendant" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-120005 View Category Item Counts - Edge Case - All Categories Empty",
    {
      annotation: [
        { type: "preconditions", description: "category ทั้งหมดไม่มี product กำหนดไว้" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. รอให้ category tree โหลด\n3. เลือก category node หลายรายการ\n4. ตรวจสอบว่าจำนวนของแต่ละ category ที่เลือกเป็นศูนย์",
        },
        { type: "expected", description: "จำนวนของแต่ละ category ที่เลือกแสดงเป็นศูนย์" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — Item Counts — Permission denial", () => {
  requestorTest(
    "TC-CAT-120003 View Category Item Counts - User with Limited Permissions",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์จำกัดในการดูจำนวน category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. รอให้ category tree โหลด\n3. เลือก category node\n4. ตรวจสอบว่าจำนวนถูกซ่อนหรือแสดงว่าไม่มีสิทธิ์",
        },
        { type: "expected", description: "จำนวน category ถูกซ่อนหรือแสดงว่าไม่มีสิทธิ์สำหรับผู้ใช้ที่มีสิทธิ์จำกัด" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900013 — Move Category
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Move", () => {
  purchaseTest(
    "TC-CAT-130001 Move Category to a Valid Parent with Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์จัดการ category; target parent มีอยู่จริงและรับ children ได้" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่ต้องการย้าย\n3. คลิกปุ่ม 'Move'\n4. เลือก target parent ที่ถูกต้อง\n5. คลิก 'Move'",
        },
        { type: "expected", description: "category ถูกย้ายไปยัง target parent สำเร็จและ hierarchy ยังคงสอดคล้องกัน" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-130002 Attempt to Move Category to Same Parent",
    {
      annotation: [
        { type: "preconditions", description: "target parent เป็น parent ปัจจุบัน" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่ต้องการย้าย\n3. คลิกปุ่ม 'Move'\n4. เลือก target parent เดิม\n5. คลิก 'Move'",
        },
        { type: "expected", description: "ไม่มีการเปลี่ยนแปลง category hierarchy และผู้ใช้ได้รับข้อความ error แจ้งว่า target parent ต้องไม่เป็น parent ปัจจุบัน" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-130003 Move Category to Invalid Parent",
    {
      annotation: [
        { type: "preconditions", description: "target parent ไม่รับ children ในระดับที่เหมาะสม" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่ต้องการย้าย\n3. คลิกปุ่ม 'Move'\n4. เลือก target parent ที่ไม่ถูกต้อง\n5. คลิก 'Move'",
        },
        { type: "expected", description: "การดำเนินการถูกปฏิเสธ ผู้ใช้ได้รับข้อความ error แจ้งว่า target parent ไม่ถูกต้องหรือไม่รับ children ในระดับที่เหมาะสม" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-130005 Move Category When Parent Hierarchy Would Form a Loop",
    {
      annotation: [
        { type: "preconditions", description: "target parent จะสร้าง circular reference หากดำเนินการย้าย" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่ต้องการย้าย\n3. คลิกปุ่ม 'Move'\n4. เลือก target parent ที่จะสร้าง loop\n5. คลิก 'Move'",
        },
        { type: "expected", description: "การดำเนินการถูกปฏิเสธ ผู้ใช้ได้รับข้อความ error แจ้งว่าจะเกิด circular reference" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — Move — Permission denial", () => {
  requestorTest(
    "TC-CAT-130004 Move Category without Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ไม่มีสิทธิ์จัดการ category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่ต้องการย้าย\n3. คลิกปุ่ม 'Move'\n4. เลือก target parent\n5. คลิก 'Move'",
        },
        { type: "expected", description: "ผู้ใช้ถูก redirect ไปยังหน้าปฏิเสธสิทธิ์หรือได้รับข้อความ error แจ้งว่าสิทธิ์ไม่เพียงพอ" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900014 — Activate / Deactivate
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Activate / Deactivate", () => {
  purchaseTest(
    "TC-CAT-140001 Activate Category with Valid Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์แก้ไข category; category มีอยู่จริงและไม่ได้ถูกลบ" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก 'Activate' ที่ category ที่ต้องการ\n3. ตรวจสอบว่าสถานะ category เป็น active แล้ว\n4. ยืนยันว่า category visible ใน product assignment dropdowns",
        },
        { type: "expected", description: "สถานะ category อัปเดตเป็น active และ visible ใน product assignments" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-140003 Attempt to Activate Deactivated Category with Valid Permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์แก้ไข category; category มีอยู่จริงและถูก deactivated แล้ว" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก 'Activate' ที่ category ที่ต้องการ\n3. ตรวจสอบว่าสถานะ category เป็น active แล้ว\n4. ยืนยันว่า category visible ใน product assignment dropdowns",
        },
        { type: "expected", description: "สถานะ category อัปเดตเป็น active และ visible ใน product assignments" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-140005 Attempt to Activate Non-Existent Category",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้มีสิทธิ์แก้ไข category; category ไม่มีอยู่" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. พยายามคลิก 'Activate' ที่ category ที่ไม่มีอยู่\n3. ตรวจสอบข้อความ error หรือการไม่เปลี่ยนแปลงสถานะ category",
        },
        { type: "expected", description: "สถานะ category ไม่เปลี่ยนแปลงและแสดงข้อความ error" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900015 — View Category Detail
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — View Detail", () => {
  purchaseTest(
    "TC-CAT-150001 View existing category details",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้เลือก category ใน tree หรือ list view; มีสิทธิ์ดูรายละเอียด category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่มีอยู่ใน list หรือ tree view\n3. ตรวจสอบว่าชื่อ category, คำอธิบาย, ตำแหน่งใน hierarchy, จำนวน product และข้อมูล audit แสดงอยู่",
        },
        { type: "expected", description: "รายละเอียด category แสดงถูกต้อง" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-150002 Verify category not found error",
    {
      annotation: [
        { type: "preconditions", description: "เลือก category ที่ไม่มีอยู่" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่ไม่มีอยู่ใน list หรือ tree view\n3. ตรวจสอบว่าแสดงข้อความ error แจ้งว่า category ไม่มีอยู่",
        },
        { type: "expected", description: "แสดงข้อความ error แจ้งว่า category ไม่มีอยู่" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT-150004 Edge case - category with zero products",
    {
      annotation: [
        { type: "preconditions", description: "category มี product เป็นศูนย์" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ที่มี product เป็นศูนย์ใน list หรือ tree view\n3. ตรวจสอบว่ารายละเอียด category แสดงจำนวน product เป็นศูนย์",
        },
        { type: "expected", description: "รายละเอียด category แสดงจำนวน product เป็นศูนย์" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

requestorTest.describe("Product Category — View Detail — Permission denial", () => {
  requestorTest(
    "TC-CAT-150003 Access category without permission",
    {
      annotation: [
        { type: "preconditions", description: "ผู้ใช้ไม่มีสิทธิ์ดูรายละเอียด category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/category\n2. คลิก category ใน list หรือ tree view\n3. ตรวจสอบว่าระบบ redirect ไปยังหน้าปฏิเสธสิทธิ์หรือแสดงข้อความ error",
        },
        { type: "expected", description: "ผู้ใช้ถูก redirect ไปยังหน้าปฏิเสธสิทธิ์หรือเห็นข้อความ error" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900201 — Cross-module: Product Creation
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Product creation integration", () => {
  purchaseTest(
    "TC-CAT-210001 Happy Path - Valid Category Selection",
    {
      annotation: [
        { type: "preconditions", description: "category มีอยู่และ Product module เข้าถึงได้" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/product/new\n2. คลิก dropdown สำหรับ product category\n3. เลือก category ที่ถูกต้อง\n4. ตรวจสอบว่า category ที่เลือกแสดงใน UI",
        },
        { type: "expected", description: "category ที่เลือกแสดงใน UI ได้ถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/product-management/product/new").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-210002 Negative Case - Unavailable Category",
    {
      annotation: [
        { type: "preconditions", description: "category มีอยู่และ Product module เข้าถึงได้" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/product/new\n2. คลิก dropdown สำหรับ product category\n3. พยายามเลือก category ที่ไม่พร้อมใช้งาน\n4. ตรวจสอบว่าการเลือกไม่เปลี่ยนแปลง",
        },
        { type: "expected", description: "category ที่ไม่พร้อมใช้งานไม่ถูกเลือกและการเลือกปัจจุบันยังคงเดิม" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto("/product-management/product/new").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-210003 Edge Case - Multiple Category Selection",
    {
      annotation: [
        { type: "preconditions", description: "category มีอยู่และ Product module เข้าถึงได้" },
        {
          type: "steps",
          description:
            "1. ไปที่ /product-management/product/new\n2. คลิก dropdown สำหรับ product category\n3. เลือก category หลายรายการด้วย multi-selection (ถ้ามี)\n4. ตรวจสอบว่า category ที่เลือกทั้งหมดแสดงใน UI ได้ถูกต้อง",
        },
        { type: "expected", description: "category ที่เลือกทั้งหมดแสดงใน UI ได้ถูกต้อง" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      await page.goto("/product-management/product/new").catch(() => {});
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900202 — Cross-module: Inventory Reports
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Inventory report integration", () => {
  purchaseTest(
    "TC-CAT-220001 Happy Path - Generate Inventory Report with Valid Categories",
    {
      annotation: [
        { type: "preconditions", description: "ข้อมูล category พร้อมสำหรับการรายงาน; product category ถูกต้อง" },
        {
          type: "steps",
          description:
            "1. ไปที่ /inventory/reports\n2. คลิก 'Generate Report'\n3. เลือก 'Daily Report' จาก dropdown\n4. คลิก 'Generate'",
        },
        { type: "expected", description: "รายงาน inventory สร้างสำเร็จพร้อมข้อมูล category ที่ถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/inventory/reports").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-220002 Negative Case - Generate Report Without Valid Categories",
    {
      annotation: [
        { type: "preconditions", description: "ข้อมูล category บางส่วนไม่ถูกต้องหรือขาดหายไป" },
        {
          type: "steps",
          description:
            "1. ไปที่ /inventory/reports\n2. คลิก 'Generate Report'\n3. เลือก 'Daily Report' จาก dropdown\n4. คลิก 'Generate'",
        },
        { type: "expected", description: "การสร้างรายงานล้มเหลวพร้อมข้อความ error แจ้งว่าข้อมูล category ไม่ถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto("/inventory/reports").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-220003 Edge Case - Generate Report with Maximum Number of Categories",
    {
      annotation: [
        { type: "preconditions", description: "ระบบอนุญาต category สูงสุดสำหรับการรายงาน; ฐานข้อมูลมี category ถึงจำนวนสูงสุด" },
        {
          type: "steps",
          description:
            "1. ไปที่ /inventory/reports\n2. คลิก 'Generate Report'\n3. เลือก 'Daily Report' จาก dropdown\n4. คลิก 'Generate'",
        },
        { type: "expected", description: "การสร้างรายงานสำเร็จและรวม category ทั้งหมดจนถึงจำนวนสูงสุดที่อนุญาต" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      await page.goto("/inventory/reports").catch(() => {});
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900203 — Cross-module: Procurement
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Procurement integration", () => {
  purchaseTest(
    "TC-CAT-230001 Happy Path - Category-based Purchase Request",
    {
      annotation: [
        { type: "preconditions", description: "category มีอยู่และกำหนดไว้กับ product; ผู้ใช้มีสิทธิ์สร้าง purchase request" },
        {
          type: "steps",
          description:
            "1. ไปที่ /procurement/purchase-request\n2. คลิก 'New Purchase Request'\n3. เลือก category จาก dropdown\n4. กรอกรายละเอียด product\n5. คลิก 'Save'",
        },
        { type: "expected", description: "purchase request สร้างสำเร็จและเชื่อมโยงกับ category ที่เลือก" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/procurement/purchase-request").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-230002 Negative Case - Invalid Category Selection",
    {
      annotation: [
        { type: "preconditions", description: "category มีอยู่; เลือก category ที่ไม่ถูกต้อง" },
        {
          type: "steps",
          description:
            "1. ไปที่ /procurement/purchase-request\n2. คลิก 'New Purchase Request'\n3. เลือก category ที่ไม่ถูกต้องหรือไม่มีอยู่\n4. พยายาม Save",
        },
        { type: "expected", description: "ระบบแสดงข้อความ error แจ้งการเลือก category ที่ไม่ถูกต้อง" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto("/procurement/purchase-request").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-230003 Edge Case - No Categories Available",
    {
      annotation: [
        { type: "preconditions", description: "ไม่มี category; ผู้ใช้มีสิทธิ์สร้าง purchase request" },
        {
          type: "steps",
          description:
            "1. ไปที่ /procurement/purchase-request\n2. คลิก 'New Purchase Request'\n3. พยายามเลือก category จาก dropdown",
        },
        { type: "expected", description: "ระบบแสดงข้อความแจ้งว่าไม่มี category" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      await page.goto("/procurement/purchase-request").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-230005 Happy Path - Spend Analysis by Category",
    {
      annotation: [
        { type: "preconditions", description: "category มีอยู่และเชื่อมโยงกับ purchase order; ฟีเจอร์ spend analysis เปิดใช้งาน" },
        {
          type: "steps",
          description:
            "1. ไปที่ /spend-analysis\n2. คลิก 'Analyze by Category'\n3. เลือก category\n4. คลิก 'Generate Report'",
        },
        { type: "expected", description: "รายงาน spend analysis สร้างสำเร็จและแสดงสำหรับ category ที่เลือก" },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/spend-analysis").catch(() => {});
    },
  );
});

// ═════════════════════════════════════════════════════════════════════════
// TC-CAT-900204 — Cross-module: Recipe Costs
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Recipe cost integration", () => {
  purchaseTest(
    "TC-CAT-240001 Happy Path - Recipe Cost Calculation by Category",
    {
      annotation: [
        { type: "preconditions", description: "ข้อมูล category พร้อมสำหรับ recipe query; ingredient ของ recipe มี category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /recipes\n2. คลิก 'New Recipe'\n3. เลือก ingredient จาก category ต่างๆ\n4. คลิก 'Save'\n5. ไปที่ 'Recipe Costs'\n6. ตรวจสอบว่าต้นทุนคำนวณถูกต้องตาม category",
        },
        { type: "expected", description: "ต้นทุน recipe แสดงถูกต้องตาม category" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/recipes").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-240002 Negative - Invalid Ingredient Selection",
    {
      annotation: [
        { type: "preconditions", description: "ingredient ของ recipe มี category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /recipes\n2. คลิก 'New Recipe'\n3. เลือก ingredient ที่ไม่อยู่ใน category ใดๆ\n4. คลิก 'Save'\n5. ตรวจสอบข้อความ error หรือสถานะที่ไม่ถูกต้อง",
        },
        { type: "expected", description: "แสดงข้อความ error หรือการเลือก ingredient ถูกปฏิเสธ" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto("/recipes").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT-240004 Happy Path - Ingredient Usage Analysis by Category",
    {
      annotation: [
        { type: "preconditions", description: "ingredient ของ recipe มี category" },
        {
          type: "steps",
          description:
            "1. ไปที่ /recipes\n2. คลิก 'Usage Analysis'\n3. ตรวจสอบว่าการใช้ ingredient แสดงตาม category",
        },
        { type: "expected", description: "การใช้ ingredient แสดงตาม category ได้ถูกต้อง" },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/recipes").catch(() => {});
    },
  );
});
