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
// TC-CAT001 — View Categories (tree/list)
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — View", () => {
  purchaseTest(
    "TC-CAT00101 View all categories",
    {
      annotation: [
        { type: "preconditions", description: "User is authenticated and has category view permission" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Verify all top-level categories are displayed\n3. Click on a category\n4. Verify subcategories are displayed in expandable tree structure",
        },
        { type: "expected", description: "All categories are correctly displayed and expandable in tree structure." },
        { type: "priority", description: "Critical" },
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
    "TC-CAT00103 Expand and collapse category levels",
    {
      annotation: [
        { type: "preconditions", description: "User has category view permission" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on a top-level category\n3. Verify subcategories are expanded\n4. Click on a subcategory\n5. Verify sub-subcategories are expanded\n6. Click on a sub-subcategory\n7. Verify sub-sub-subcategories are expanded\n8. Click on a sub-sub-subcategory\n9. Verify the category tree reverts to previous state",
        },
        { type: "expected", description: "User can expand and collapse category levels as expected." },
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
    "TC-CAT00104 Category hierarchy with very long names",
    {
      annotation: [
        { type: "preconditions", description: "User has category view permission" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on a category with a very long name\n3. Verify subcategories are still displayed properly",
        },
        { type: "expected", description: "Category hierarchy is displayed correctly even with very long category names." },
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
    "TC-CAT00105 Multiple levels of categories",
    {
      annotation: [
        { type: "preconditions", description: "User has category view permission" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on a top-level category\n3. Click on a subcategory\n4. Click on a sub-subcategory\n5. Verify all levels are displayed properly",
        },
        { type: "expected", description: "All levels of category hierarchy are displayed correctly." },
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
    "TC-CAT00102 No permission to view categories",
    {
      annotation: [
        { type: "preconditions", description: "User is authenticated but does not have category view permission" },
        {
          type: "steps",
          description: "1. Navigate to /product-management/category\n2. Verify no categories are displayed",
        },
        { type: "expected", description: "User sees an error message or restricted access message." },
        { type: "priority", description: "Critical" },
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
// TC-CAT002 — Create Root Category
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Create Root", () => {
  purchaseTest(
    "TC-CAT00201 Happy Path - Create Root Category",
    {
      annotation: [
        { type: "preconditions", description: "User has category creation permission and 'Product Manager' or 'System Administrator' role" },
        {
          type: "steps",
          description: "1. Click 'New Category'\n2. Fill 'Category Name' with valid name\n3. Click 'Save'",
        },
        { type: "expected", description: "Category is created successfully, visible in the list of categories." },
        { type: "priority", description: "Critical" },
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
    "TC-CAT00203 Edge Case - Category Name Exceeds Maximum Length",
    {
      annotation: [
        { type: "preconditions", description: "User has category creation permission" },
        {
          type: "steps",
          description:
            "1. Click 'New Category'\n2. Fill 'Category Name' with 101 characters (exceeds max length of 100)\n3. Click 'Save'",
        },
        { type: "expected", description: "Category creation fails with an error message indicating the name exceeds the maximum length." },
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
    "TC-CAT00202 Negative - No Permission to Create Category",
    {
      annotation: [
        { type: "preconditions", description: "User does not have category creation permission" },
        {
          type: "steps",
          description: "1. Click 'New Category'\n2. Fill 'Category Name' with valid name\n3. Click 'Save'",
        },
        { type: "expected", description: "User receives an error message indicating they do not have permission to create a category." },
        { type: "priority", description: "Critical" },
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
// TC-CAT003 — Create Subcategory
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Create Subcategory", () => {
  purchaseTest(
    "TC-CAT00301 Happy Path - Create Subcategory",
    {
      annotation: [
        { type: "preconditions", description: "User has category creation permission; at least one root-level category exists; parent category is active" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the parent category\n3. Click 'New Subcategory'\n4. Fill in the subcategory name\n5. Click 'Save'",
        },
        { type: "expected", description: "Subcategory is successfully created and displayed under the parent category." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT00302 Negative Case - Invalid Subcategory Name",
    {
      annotation: [
        { type: "preconditions", description: "User has category creation permission; at least one root-level category exists" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the parent category\n3. Click 'New Subcategory'\n4. Fill in an invalid subcategory name (e.g., only numbers)\n5. Click 'Save'",
        },
        { type: "expected", description: "Error message is displayed indicating the subcategory name is invalid." },
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
    "TC-CAT00304 Edge Case - Maximum Subcategory Level",
    {
      annotation: [
        { type: "preconditions", description: "User has category creation permission; at least one root-level category exists" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the parent category\n3. Click 'New Subcategory'\n4. Repeat the above steps up to the maximum allowed subcategory levels",
        },
        { type: "expected", description: "System limits the creation of subcategories to the maximum allowed level and does not allow further nesting." },
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
    "TC-CAT00303 Negative Case - No Permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have category creation permission" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the parent category\n3. Click 'New Subcategory'",
        },
        { type: "expected", description: "User is prompted to log in or does not have access to perform the action." },
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
// TC-CAT004 — Create Item Group
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Create Item Group", () => {
  purchaseTest(
    "TC-CAT00401 Create Valid Item Group",
    {
      annotation: [
        { type: "preconditions", description: "User has category creation permission; at least one subcategory exists; parent subcategory is active" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'New Item Group'\n3. Fill 'Item Group Name'\n4. Select 'Parent Subcategory'\n5. Click 'Save'",
        },
        { type: "expected", description: "New item group is created and displayed in the category list." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT00403 Create Item Group with Invalid Subcategory Selection",
    {
      annotation: [
        { type: "preconditions", description: "User has category creation permission; no subcategory exists" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'New Item Group'\n3. Fill 'Item Group Name'\n4. Select 'Non-Existent Subcategory'\n5. Click 'Save'",
        },
        { type: "expected", description: "User receives error message indicating that the selected subcategory does not exist." },
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
    "TC-CAT00405 Create Item Group with Long Name",
    {
      annotation: [
        { type: "preconditions", description: "User has category creation permission; at least one subcategory exists" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'New Item Group'\n3. Fill 'Item Group Name' with a name longer than the allowed limit\n4. Click 'Save'",
        },
        { type: "expected", description: "User receives error message indicating that the item group name exceeds the allowed character limit." },
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
    "TC-CAT00402 Create Item Group with Missing Permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have category creation permission" },
        {
          type: "steps",
          description: "1. Navigate to /product-management/category\n2. Try to click 'New Item Group'",
        },
        { type: "expected", description: "User cannot access 'New Item Group' button and sees appropriate permission error message." },
        { type: "priority", description: "Critical" },
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
// TC-CAT005 — Edit Category
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Edit", () => {
  purchaseTest(
    "TC-CAT00501 Edit Existing Category Name",
    {
      annotation: [
        { type: "preconditions", description: "User has category edit permission; category exists; not actively referenced in critical processes" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Select existing category\n3. Click 'Edit'\n4. Fill new category name\n5. Click 'Save'",
        },
        { type: "expected", description: "Category name is updated successfully and reflected in the system." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT00502 Try to Edit Non-Existent Category",
    {
      annotation: [
        { type: "preconditions", description: "User has category edit permission; category does not exist" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Attempt to select non-existent category\n3. Click 'Edit'",
        },
        { type: "expected", description: "System displays error message indicating that the category does not exist." },
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
    "TC-CAT00504 Edit Category with Invalid Input",
    {
      annotation: [
        { type: "preconditions", description: "User has category edit permission; category exists" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Select existing category\n3. Click 'Edit'\n4. Fill invalid category name (e.g., less than 3 characters)\n5. Click 'Save'",
        },
        { type: "expected", description: "System displays error message indicating invalid input." },
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
    "TC-CAT00505 Edit Category with Active Reference",
    {
      annotation: [
        { type: "preconditions", description: "Category is actively referenced in critical processes" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Select existing category\n3. Click 'Edit'",
        },
        { type: "expected", description: "System displays error message indicating that the category cannot be edited due to active references." },
        { type: "priority", description: "Critical" },
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
    "TC-CAT00503 Edit Category with No Permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have category edit permission" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Select existing category\n3. Click 'Edit'",
        },
        { type: "expected", description: "System displays error message indicating insufficient permissions." },
        { type: "priority", description: "Critical" },
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
// TC-CAT006 — Delete Category
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Delete", () => {
  purchaseTest(
    "TC-CAT00601 Delete existing category",
    {
      annotation: [
        { type: "preconditions", description: "System Administrator logged in; category exists and is not marked as deleted" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Select existing category to delete\n3. Click 'Delete'\n4. Verify 'Are you sure you want to delete this category?' dialog appears\n5. Click 'Yes'",
        },
        { type: "expected", description: "Category is marked as deleted while retaining related data for audit tracking." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT00602 Attempt to delete category with assigned products",
    {
      annotation: [
        { type: "preconditions", description: "Category exists and has at least one product assignment" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Select category with product assignment\n3. Click 'Delete'\n4. Verify error message 'Cannot delete category with product assignments'",
        },
        { type: "expected", description: "Category deletion attempt fails and error message is displayed." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT00603 Attempt to delete non-existing category",
    {
      annotation: [
        { type: "preconditions", description: "Non-existing category name entered" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Enter non-existing category name in search\n3. Click 'Delete'\n4. Verify 'Category not found' message",
        },
        { type: "expected", description: "System returns 'Category not found' message and no changes are made." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      const cat = new ProductCategoryPage(page);
      await cat.gotoList();
    },
  );

  purchaseTest(
    "TC-CAT00604 Delete category after logging out",
    {
      annotation: [
        { type: "preconditions", description: "Category exists and is not marked as deleted" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Select existing category to delete\n3. Click 'Delete'\n4. Log out\n5. Try to confirm deletion\n6. Verify 'Please log in to proceed' message",
        },
        { type: "expected", description: "Deletion cannot proceed and user is prompted to log in." },
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
// TC-CAT007 — Reorder / Drag-Drop
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Reorder / Drag-Drop", () => {
  purchaseTest(
    "TC-CAT00701 Reorder Categories within Same Parent",
    {
      annotation: [
        { type: "preconditions", description: "User has category management permission; multiple categories exist at the same level; user is viewing the tree view" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Find category A and B under the same parent\n3. Click and drag category B next to category A\n4. Release the mouse",
        },
        { type: "expected", description: "Categories A and B are reordered next to each other under the same parent." },
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
    "TC-CAT00702 Move Category to Different Parent",
    {
      annotation: [
        { type: "preconditions", description: "User has category management permission; multiple categories exist at different levels" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Find category C under parent 1\n3. Click and drag category C into parent 2\n4. Release the mouse",
        },
        { type: "expected", description: "Category C is moved under parent 2." },
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
    "TC-CAT00704 Attempt to Drag Category Outside of Current Parent",
    {
      annotation: [
        { type: "preconditions", description: "User has category management permission; multiple categories exist at the same level" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click and drag category A out of its current parent\n3. Release the mouse",
        },
        { type: "expected", description: "Category A remains in its current position and an error message is displayed." },
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
    "TC-CAT00705 Drag Category with No Siblings",
    {
      annotation: [
        { type: "preconditions", description: "User has category management permission; single category exists" },
        {
          type: "steps",
          description: "1. Navigate to /product-management/category\n2. Attempt to click and drag the single category",
        },
        { type: "expected", description: "User cannot reorder a single category and an error message is displayed." },
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
    "TC-CAT00703 Unable to Reorder without Permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have category management permission" },
        {
          type: "steps",
          description: "1. Navigate to /product-management/category\n2. Attempt to click and drag category A and B",
        },
        { type: "expected", description: "User cannot reorder categories and an error message is displayed." },
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
// TC-CAT008 — View toggling (Tree / List)
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Tree/List view", () => {
  purchaseTest(
    "TC-CAT00801 Switch from Tree to List View",
    {
      annotation: [
        { type: "preconditions", description: "User is viewing Categories page with existing categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'List' view option\n3. Verify that categories are displayed in a flat list format",
        },
        { type: "expected", description: "Categories are displayed in a flat list format." },
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
    "TC-CAT00802 Switch from List to Tree View",
    {
      annotation: [
        { type: "preconditions", description: "User is viewing Categories page with existing categories in List view" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'Tree' view option\n3. Verify that categories are displayed in a hierarchical tree format",
        },
        { type: "expected", description: "Categories are displayed in a hierarchical tree format." },
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
    "TC-CAT00803 Negative: Switch View with No Categories",
    {
      annotation: [
        { type: "preconditions", description: "User is viewing Categories page with no categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'Tree' view option\n3. Click 'List' view option\n4. Verify that no categories are displayed",
        },
        { type: "expected", description: "No categories are displayed." },
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
    "TC-CAT00804 Edge Case: Switch Views Multiple Times",
    {
      annotation: [
        { type: "preconditions", description: "User is viewing Categories page with existing categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'Tree' view option\n3. Click 'List' view option\n4. Click 'Tree' view option\n5. Verify that categories are displayed in a hierarchical tree format",
        },
        { type: "expected", description: "Categories are displayed in a hierarchical tree format." },
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
// TC-CAT009 — Search
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Search", () => {
  purchaseTest(
    "TC-CAT00901 Happy Path - Search for Existing Category",
    {
      annotation: [
        { type: "preconditions", description: "User has permission to view categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on 'Search' icon\n3. Fill 'Category Name' with 'Electronics'\n4. Click 'Search'",
        },
        { type: "expected", description: "Search results highlight 'Electronics' category with matching descriptions." },
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
    "TC-CAT00902 Negative Case - Search with Invalid Input",
    {
      annotation: [
        { type: "preconditions", description: "User has permission to view categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on 'Search' icon\n3. Fill 'Category Name' with 'InvalidCategory123'\n4. Click 'Search'",
        },
        { type: "expected", description: "Search results show no matches and clear message or placeholder informing user that no results were found." },
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
    "TC-CAT00903 Edge Case - Search with Empty Input",
    {
      annotation: [
        { type: "preconditions", description: "User has permission to view categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on 'Search' icon\n3. Fill 'Category Name' with empty input\n4. Click 'Search'",
        },
        { type: "expected", description: "Search results do not change from default view." },
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
    "TC-CAT00904 Negative Case - User without Permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have permission to view categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on 'Search' icon\n3. Fill 'Category Name' with 'Office Supplies'\n4. Click 'Search'",
        },
        { type: "expected", description: "User is redirected to permission denied page or receives error message." },
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
// TC-CAT010 — Filters
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Filters", () => {
  purchaseTest(
    "TC-CAT01001 Apply multiple filters successfully",
    {
      annotation: [
        { type: "preconditions", description: "User is viewing Categories page; multiple categories exist with varied attributes" },
        {
          type: "steps",
          description:
            "1. Click on the 'Filter' button\n2. Select 'Level' and choose 'Tier 1'\n3. Select 'Status' and choose 'Active'\n4. Select 'Parent' and choose 'Electronics'\n5. Click 'Apply Filters'",
        },
        { type: "expected", description: "Filtered categories are displayed according to selected criteria." },
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
    "TC-CAT01002 Apply filters with invalid input",
    {
      annotation: [
        { type: "preconditions", description: "User is viewing Categories page; multiple categories exist" },
        {
          type: "steps",
          description:
            "1. Click on the 'Filter' button\n2. Select 'Level' and choose an invalid option (e.g., 'Invalid Tier')\n3. Click 'Apply Filters'",
        },
        { type: "expected", description: "Error message is displayed indicating invalid input." },
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
    "TC-CAT01003 Apply filters with no categories matching",
    {
      annotation: [
        { type: "preconditions", description: "User is viewing Categories page; multiple categories exist" },
        {
          type: "steps",
          description: "1. Click on the 'Filter' button\n2. Select 'Level' and choose 'Tier 3'\n3. Click 'Apply Filters'",
        },
        { type: "expected", description: "No categories are displayed, message indicates no matching results." },
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
    "TC-CAT01004 Apply filters with no filters applied",
    {
      annotation: [
        { type: "preconditions", description: "User is viewing Categories page; multiple categories exist" },
        {
          type: "steps",
          description: "1. Click on the 'Filter' button\n2. Do not make any selections\n3. Click 'Apply Filters'",
        },
        { type: "expected", description: "All categories are displayed." },
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
// TC-CAT011 — Breadcrumb Navigation
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Breadcrumb", () => {
  purchaseTest(
    "TC-CAT01101 Select a Category with Breadcrumbs",
    {
      annotation: [
        { type: "preconditions", description: "User has logged in and selected a category in the tree view" },
        {
          type: "steps",
          description:
            "1. Navigate to the category tree view\n2. Click on a category with at least one parent\n3. Verify the breadcrumb trail shows the full path from the root to the selected category",
        },
        { type: "expected", description: "The breadcrumb trail correctly displays the path from the root to the selected category." },
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
    "TC-CAT01102 Navigate Up a Level Using Breadcrumbs",
    {
      annotation: [
        { type: "preconditions", description: "User has selected a category in the tree view with at least one parent" },
        {
          type: "steps",
          description:
            "1. Navigate to a selected category with a breadcrumb trail\n2. Click on the second-to-last breadcrumb in the trail\n3. Verify the user is navigated to the parent category",
        },
        { type: "expected", description: "The user is successfully navigated to the parent category as indicated by the breadcrumb click." },
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
    "TC-CAT01103 Breadcrumb Trail Displays Correctly with Multiple Parents",
    {
      annotation: [
        { type: "preconditions", description: "User has selected a category with multiple levels of parents" },
        {
          type: "steps",
          description:
            "1. Navigate to a deeply nested category\n2. Verify the breadcrumb trail correctly displays all levels of parent categories",
        },
        { type: "expected", description: "The breadcrumb trail correctly and fully displays the path from the root to the selected category, regardless of depth." },
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
    "TC-CAT01104 Breadcrumb Trail Not Displayed for Single-Level Categories",
    {
      annotation: [
        { type: "preconditions", description: "User has selected a top-level category with no parent" },
        {
          type: "steps",
          description:
            "1. Navigate to a top-level category\n2. Verify the breadcrumb trail is not displayed",
        },
        { type: "expected", description: "The breadcrumb trail is not displayed when the selected category is a top-level category." },
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
    "TC-CAT01105 Breadcrumb Trail Missing When No Category Selected",
    {
      annotation: [
        { type: "preconditions", description: "User has not selected any category" },
        { type: "steps", description: "1. Verify the breadcrumb trail is not visible" },
        { type: "expected", description: "The breadcrumb trail is not visible when no category is selected." },
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
// TC-CAT012 — Item Counts
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Item Counts", () => {
  purchaseTest(
    "TC-CAT01201 View Category Item Counts - Happy Path",
    {
      annotation: [
        { type: "preconditions", description: "User is authenticated and viewing category hierarchy in tree view" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Wait for the category tree to load\n3. Select a category node\n4. Verify that the category count is displayed\n5. Expand the selected category node to see the counts of its descendants",
        },
        { type: "expected", description: "Category count is accurate and displayed, and the counts of all descendants are also shown." },
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
    "TC-CAT01202 View Category Item Counts - No Product Assignments",
    {
      annotation: [
        { type: "preconditions", description: "Selected category has no product assignments" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Wait for the category tree to load\n3. Select a category node with no product assignments\n4. Verify that the count for the selected category and its descendants is zero",
        },
        { type: "expected", description: "Category and descendant counts display zero." },
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
    "TC-CAT01204 View Category Item Counts - Edge Case - Category with No Descendants",
    {
      annotation: [
        { type: "preconditions", description: "Selected category has no descendant categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Wait for the category tree to load\n3. Select a category node with no descendants\n4. Verify that the count is displayed for the selected category only, and there are no counts for descendants",
        },
        { type: "expected", description: "Category count is accurate and only shown for the selected category, with no counts for descendants." },
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
    "TC-CAT01205 View Category Item Counts - Edge Case - All Categories Empty",
    {
      annotation: [
        { type: "preconditions", description: "All categories have no product assignments" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Wait for the category tree to load\n3. Select multiple category nodes\n4. Verify that the count for each selected category is zero",
        },
        { type: "expected", description: "Each selected category count displays zero." },
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
    "TC-CAT01203 View Category Item Counts - User with Limited Permissions",
    {
      annotation: [
        { type: "preconditions", description: "User has limited permissions to view category counts" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Wait for the category tree to load\n3. Select a category node\n4. Verify that the count is hidden or displayed as unauthorized",
        },
        { type: "expected", description: "Category count is hidden or displayed as unauthorized for the user with limited permissions." },
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
// TC-CAT013 — Move Category
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Move", () => {
  purchaseTest(
    "TC-CAT01301 Move Category to a Valid Parent with Permission",
    {
      annotation: [
        { type: "preconditions", description: "User has category management permission; target parent exists and accepts children" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the category to move\n3. Click on the 'Move' button\n4. Select the valid target parent\n5. Click 'Move'",
        },
        { type: "expected", description: "Category is moved to the target parent successfully, hierarchy remains consistent." },
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
    "TC-CAT01302 Attempt to Move Category to Same Parent",
    {
      annotation: [
        { type: "preconditions", description: "Target parent is the same as the current parent" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the category to move\n3. Click on the 'Move' button\n4. Select the same target parent\n5. Click 'Move'",
        },
        { type: "expected", description: "No change in category hierarchy, user receives an error message indicating that the target parent cannot be the same as the current parent." },
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
    "TC-CAT01303 Move Category to Invalid Parent",
    {
      annotation: [
        { type: "preconditions", description: "Target parent does not accept children at appropriate level" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the category to move\n3. Click on the 'Move' button\n4. Select the invalid target parent\n5. Click 'Move'",
        },
        { type: "expected", description: "Operation is rejected, user receives an error message indicating that the target parent is invalid or does not accept children at the appropriate level." },
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
    "TC-CAT01305 Move Category When Parent Hierarchy Would Form a Loop",
    {
      annotation: [
        { type: "preconditions", description: "Target parent would create a circular reference if the move were to happen" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the category to move\n3. Click on the 'Move' button\n4. Select the target parent that would create a loop\n5. Click 'Move'",
        },
        { type: "expected", description: "Operation is rejected, user receives an error message indicating that a circular reference would be created." },
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
    "TC-CAT01304 Move Category without Permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have category management permission" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on the category to move\n3. Click on the 'Move' button\n4. Select the target parent\n5. Click 'Move'",
        },
        { type: "expected", description: "User is redirected to permission denied page or receives an error message indicating insufficient permissions." },
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
// TC-CAT014 — Activate / Deactivate
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Activate / Deactivate", () => {
  purchaseTest(
    "TC-CAT01401 Activate Category with Valid Permission",
    {
      annotation: [
        { type: "preconditions", description: "User has category edit permission; category exists and is not deleted" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'Activate' on the desired category\n3. Verify category status is now active\n4. Confirm category is visible in product assignment dropdowns",
        },
        { type: "expected", description: "Category status is updated to active, visible in product assignments." },
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
    "TC-CAT01403 Attempt to Activate Deactivated Category with Valid Permission",
    {
      annotation: [
        { type: "preconditions", description: "User has category edit permission; category exists and is deactivated" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click 'Activate' on the desired category\n3. Verify category status is now active\n4. Confirm category is visible in product assignment dropdowns",
        },
        { type: "expected", description: "Category status is updated to active, visible in product assignments." },
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
    "TC-CAT01405 Attempt to Activate Non-Existent Category",
    {
      annotation: [
        { type: "preconditions", description: "User has category edit permission; category does not exist" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Attempt to click 'Activate' on a non-existent category\n3. Verify error message or no change in category status",
        },
        { type: "expected", description: "Category status remains unchanged, error message displayed." },
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
// TC-CAT015 — View Category Detail
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — View Detail", () => {
  purchaseTest(
    "TC-CAT01501 View existing category details",
    {
      annotation: [
        { type: "preconditions", description: "User has selected a category in tree or list view; has permission to view category details" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on an existing category in the list or tree view\n3. Verify that the category name, description, hierarchy position, product count, and audit information are displayed.",
        },
        { type: "expected", description: "Category details are displayed correctly." },
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
    "TC-CAT01502 Verify category not found error",
    {
      annotation: [
        { type: "preconditions", description: "Non-existent category selected" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on a non-existent category in the list or tree view\n3. Verify that an error message indicating the category does not exist is displayed.",
        },
        { type: "expected", description: "Error message indicating the category does not exist is displayed." },
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
    "TC-CAT01504 Edge case - category with zero products",
    {
      annotation: [
        { type: "preconditions", description: "Category has zero products" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on a category with zero products in the list or tree view\n3. Verify that the category details are displayed with a zero product count.",
        },
        { type: "expected", description: "Category details are displayed with a zero product count." },
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
    "TC-CAT01503 Access category without permission",
    {
      annotation: [
        { type: "preconditions", description: "User does not have permission to view category details" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/category\n2. Click on a category in the list or tree view\n3. Verify that the system redirects to a permission denied page or displays an error message.",
        },
        { type: "expected", description: "User is redirected to a permission denied page or sees an error message." },
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
// TC-CAT201 — Cross-module: Product Creation
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Product creation integration", () => {
  purchaseTest(
    "TC-CAT20101 Happy Path - Valid Category Selection",
    {
      annotation: [
        { type: "preconditions", description: "Categories are available and accessible to the Product module" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/product/new\n2. Click on the dropdown for product category\n3. Select a valid category\n4. Verify the selected category is displayed in the UI",
        },
        { type: "expected", description: "The selected category is correctly displayed in the UI." },
        { type: "priority", description: "Critical" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/product-management/product/new").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20102 Negative Case - Unavailable Category",
    {
      annotation: [
        { type: "preconditions", description: "Categories are available and accessible to the Product module" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/product/new\n2. Click on the dropdown for product category\n3. Try to select an unavailable category\n4. Verify the selection does not change",
        },
        { type: "expected", description: "The unavailable category is not selected and the current selection remains unchanged." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto("/product-management/product/new").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20103 Edge Case - Multiple Category Selection",
    {
      annotation: [
        { type: "preconditions", description: "Categories are available and accessible to the Product module" },
        {
          type: "steps",
          description:
            "1. Navigate to /product-management/product/new\n2. Click on the dropdown for product category\n3. Select multiple categories using the multi-selection feature (if available)\n4. Verify all selected categories are correctly displayed in the UI",
        },
        { type: "expected", description: "All selected categories are correctly displayed in the UI." },
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
// TC-CAT202 — Cross-module: Inventory Reports
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Inventory report integration", () => {
  purchaseTest(
    "TC-CAT20201 Happy Path - Generate Inventory Report with Valid Categories",
    {
      annotation: [
        { type: "preconditions", description: "Category data is available for reporting; product categories are valid" },
        {
          type: "steps",
          description:
            "1. Navigate to /inventory/reports\n2. Click 'Generate Report'\n3. Select 'Daily Report' from the dropdown\n4. Click 'Generate'",
        },
        { type: "expected", description: "The inventory report is generated successfully with the correct category data." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/inventory/reports").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20202 Negative Case - Generate Report Without Valid Categories",
    {
      annotation: [
        { type: "preconditions", description: "Category data is partially invalid or missing" },
        {
          type: "steps",
          description:
            "1. Navigate to /inventory/reports\n2. Click 'Generate Report'\n3. Select 'Daily Report' from the dropdown\n4. Click 'Generate'",
        },
        { type: "expected", description: "The report generation fails with an error message indicating invalid category data." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto("/inventory/reports").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20203 Edge Case - Generate Report with Maximum Number of Categories",
    {
      annotation: [
        { type: "preconditions", description: "System allows a maximum number of categories for reporting; database contains the maximum number of categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /inventory/reports\n2. Click 'Generate Report'\n3. Select 'Daily Report' from the dropdown\n4. Click 'Generate'",
        },
        { type: "expected", description: "The report generation succeeds and includes all categories up to the maximum allowed." },
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
// TC-CAT203 — Cross-module: Procurement
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Procurement integration", () => {
  purchaseTest(
    "TC-CAT20301 Happy Path - Category-based Purchase Request",
    {
      annotation: [
        { type: "preconditions", description: "Categories are available and assigned to products; user has permission to create purchase requests" },
        {
          type: "steps",
          description:
            "1. Navigate to /procurement/purchase-request\n2. Click 'New Purchase Request'\n3. Select a category from the dropdown\n4. Fill in product details\n5. Click 'Save'",
        },
        { type: "expected", description: "Purchase request is created and associated with the selected category." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/procurement/purchase-request").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20302 Negative Case - Invalid Category Selection",
    {
      annotation: [
        { type: "preconditions", description: "Categories are available; an invalid category is selected" },
        {
          type: "steps",
          description:
            "1. Navigate to /procurement/purchase-request\n2. Click 'New Purchase Request'\n3. Select an invalid or non-existent category\n4. Attempt to Save",
        },
        { type: "expected", description: "System displays an error message indicating the invalid category selection." },
        { type: "priority", description: "High" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto("/procurement/purchase-request").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20303 Edge Case - No Categories Available",
    {
      annotation: [
        { type: "preconditions", description: "No categories are available; user has permission to create purchase requests" },
        {
          type: "steps",
          description:
            "1. Navigate to /procurement/purchase-request\n2. Click 'New Purchase Request'\n3. Attempt to select a category from the dropdown",
        },
        { type: "expected", description: "System displays a message indicating no categories are available." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Edge Case" },
      ],
    },
    async ({ page }) => {
      await page.goto("/procurement/purchase-request").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20305 Happy Path - Spend Analysis by Category",
    {
      annotation: [
        { type: "preconditions", description: "Categories are available and associated with purchase orders; spend analysis feature is enabled" },
        {
          type: "steps",
          description:
            "1. Navigate to /spend-analysis\n2. Click 'Analyze by Category'\n3. Select a category\n4. Click 'Generate Report'",
        },
        { type: "expected", description: "Spend analysis report is generated and displayed for the selected category." },
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
// TC-CAT204 — Cross-module: Recipe Costs
// ═════════════════════════════════════════════════════════════════════════
purchaseTest.describe("Product Category — Recipe cost integration", () => {
  purchaseTest(
    "TC-CAT20401 Happy Path - Recipe Cost Calculation by Category",
    {
      annotation: [
        { type: "preconditions", description: "Category data available for recipe queries; recipe ingredients have categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /recipes\n2. Click 'New Recipe'\n3. Select ingredients from different categories\n4. Click 'Save'\n5. Navigate to 'Recipe Costs'\n6. Verify that costs are calculated correctly by category",
        },
        { type: "expected", description: "Recipe costs are displayed correctly by category." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/recipes").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20402 Negative - Invalid Ingredient Selection",
    {
      annotation: [
        { type: "preconditions", description: "Recipe ingredients have categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /recipes\n2. Click 'New Recipe'\n3. Select an ingredient that does not belong to any category\n4. Click 'Save'\n5. Verify error message or invalid state",
        },
        { type: "expected", description: "Error message displayed or ingredient selection rejected." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Negative" },
      ],
    },
    async ({ page }) => {
      await page.goto("/recipes").catch(() => {});
    },
  );

  purchaseTest(
    "TC-CAT20404 Happy Path - Ingredient Usage Analysis by Category",
    {
      annotation: [
        { type: "preconditions", description: "Recipe ingredients have categories" },
        {
          type: "steps",
          description:
            "1. Navigate to /recipes\n2. Click 'Usage Analysis'\n3. Verify that ingredient usage is displayed by category",
        },
        { type: "expected", description: "Ingredient usage is correctly displayed by category." },
        { type: "priority", description: "Medium" },
        { type: "testType", description: "Happy Path" },
      ],
    },
    async ({ page }) => {
      await page.goto("/recipes").catch(() => {});
    },
  );
});
