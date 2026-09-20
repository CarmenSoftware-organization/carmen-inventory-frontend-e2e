# Workflow Configuration — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/system-admin/workflow` (`workflow-doc-type.route.tsx`, `workflow-new.route.tsx`, `workflow-edit.route.tsx`, `wf-component.tsx`, `use-wf-table.tsx`, `wf-row-actions.tsx`, `wf-new-form.tsx`, `wf-edit-content.tsx`, `wf-detail.tsx`, `wf-header.tsx`, `wf-general.tsx`, `wf-stages.tsx`, `wf-stage-list.tsx`, `wf-stage-detail.tsx`, `wf-stage-general.tsx`, `wf-stage-users.tsx`, `wf-products.tsx`, `wf-routing.tsx`, `wf-insights.tsx`, `wf-diagram.tsx`, `wf-flow-strip.tsx`, `wf-validate.ts`, `wf-validation-panel.tsx`, `wf-structure-lock-notice.tsx`, `wf-signature-limit.ts`, `wf-form-schema.ts`, `use-wf-mutations.ts`, `use-wf-row-mutations.ts`, `use-wf-availability.ts`) plus `routes/router.tsx`, `hooks/use-workflow.ts`, `constant/workflow.ts`, `constant/module-list.ts`, `constant/permissions.ts`, `components/route-guard.tsx`, `components/auth/require-auth.tsx` และข้อความจาก `messages/en.json`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Platform / System Admin — Workflow Configuration
**Frontend route:** `routes/system-admin/workflow`  •  **URL:** `/system-admin/workflow` (และ `/system-admin/workflow/purchase-request`, `/system-admin/workflow/purchase-order`, `/system-admin/workflow/store-requisition`, `/system-admin/workflow/new`, `/system-admin/workflow/:id`)
**Prefix:** `WF`
**Default role:** Platform Admin (admin@blueledgers.com, active BU = BLAVG)
**Total test cases:** 55

> หมายเหตุสำคัญสำหรับผู้รีวิว:
> 1. **`/system-admin/workflow` ไม่ใช่หน้ารายการอีกต่อไป — เป็น redirect** ใน `routes/router.tsx` เส้นนี้คือ `<Navigate to="/system-admin/workflow/purchase-request" replace />` เปล่า ๆ ไม่มีคอมโพเนนต์ของตัวเอง ทุกเทสที่เคยชี้ URL นี้เป็น "หน้า list" ถูกแก้ให้ชี้ `/system-admin/workflow/purchase-request` แล้ว (ดู TC-WF-010008)
> 2. **เลิกมีหน้ารายการรวมทุกชนิดแล้ว** (คอมมิต `f3e13d30` "แยกหน้าตามชนิดใบให้สุด เลิกมีหน้ารายการรวม") — สาม route ย่อย `purchase-request` / `purchase-order` / `store-requisition` ใช้ไฟล์เดียวกันคือ `workflow-doc-type.route.tsx` ซึ่งอ่าน slug จาก segment สุดท้ายของ URL แล้วส่งให้ `WorkflowComponent` แต่ละชนิด **ยิงคนละ endpoint** (`GET /config/{bu}/workflows/{slug}`) ไม่ใช่การกรองจากชุดเดียวกัน
> 3. **หน้ารายการไม่มี filter เหลืออยู่เลย** — `wf-component.tsx` มีแค่ `DocumentListHeader` + ปุ่ม New Workflow + `SearchInput` ไม่มี `StatusFilter` ไม่มี `MultiSelectFilter` ไม่มี `ActiveFilterBar` เทสเดิม TC-WF-010004 / TC-WF-010005 / TC-WF-010007 จึงถูก**ลบทั้งบล็อก** เพราะทดสอบสิ่งที่ไม่มีแล้ว (การกรองตามชนิดถูกแทนที่ด้วยการแยก route)
> 4. **คอลัมน์ "Workflow Type" ในตารางหายไปแล้ว** — คอลัมน์ปัจจุบันคือ Name / Flow / Updated / Status / (action) ชนิดของ workflow กลายเป็นตัวหน้าเพจไปแล้วจึงไม่ต้องซ้ำในทุกแถว ส่วนป้ายชนิดยังเหลืออยู่ที่ header ของหน้า detail
> 5. **`SearchInput` ยิงค้นหาเมื่อกด Enter หรือกดปุ่มแว่นขยายเท่านั้น** ไม่ใช่ debounce ตามการพิมพ์ (`components/search-input.tsx`) และเมื่อมีข้อความอยู่แล้วปุ่มขวาจะกลายเป็นปุ่ม **ล้าง** ไม่ใช่ปุ่มค้น
> 6. **ปุ่ม New Workflow ล็อกชนิดให้** — พาไป `/system-admin/workflow/new?type=<slug>` และ `workflow-new.route.tsx` แปลง slug เป็น `lockedType` ทำให้ Select "Workflow Type" ถูก disable ส่วนการเปิด `/system-admin/workflow/new` เปล่า ๆ ยังเลือกชนิดเองได้ และ `?type=` ที่สะกดไม่ตรงจะถูก redirect กลับ `purchase-request`
> 7. **ลบ TC-WF-200002 (ไม่เลือกประเภทต้องแสดง error)** — กฎ zod `workflow_type.min(1)` ยังอยู่ แต่ UI ทำให้ค่านี้ว่างไม่ได้: `EMPTY_FORM` ตั้งต้นเป็น `WORKFLOW_TYPE.PR` และ `Select` ไม่มีตัวเลือกว่าง เคสนี้จึงยืนยันผ่านหน้าจอไม่ได้ (ยังถูกคุมด้วย unit test `wf-form-schema.test.ts`)
> 8. **RouteGuard บังคับสิทธิ์จริงที่ระดับ route** — `components/route-guard.tsx` ถูก mount ใน `routes/root-layout.tsx` ตรวจ license ก่อน permission โดย `isAdmin` **bypass permission ได้แต่ bypass license ไม่ได้** ทั้ง `/system-admin/workflow*` ผูกกับ `licenseFeature: "system_admin.workflow"` และ `PERMISSIONS.system_configuration.view` ใน `constant/module-list.ts`
> 9. **Dialog ลบ stage ใช้สตริงของการลบ workflow** — `wf-stage-list.tsx` ส่ง `t("deleteTitle")` ("Delete Workflow") กับ `t("deleteConfirm")` เข้า `DeleteDialog` ทั้งที่ `messages/en.json` มีคีย์ `deleteStage` / `deleteStageConfirm` อยู่แล้วแต่ไม่มีใครเรียก — เคส TC-WF-400004 จึง assert ข้อความตามที่แอปแสดงจริง ไม่ใช่ตามที่คีย์ตั้งใจไว้ ถ้าจะแก้ให้ถูกต้องเป็นงานฝั่งแอป
> 10. **เอกสารที่เดินอยู่ล็อกแค่บางส่วน ไม่ใช่ทั้งฟอร์ม** — `use-wf-availability.ts` ถาม `GET .../{id}/edit-availability` คืน `can_edit_stages` / `can_delete` + จำนวนเอกสาร draft/in_progress/done · `can_edit_stages=false` ปิดเฉพาะรายการ stage กับ Global Routing แล้วขึ้นแบนเนอร์ `WfStructureLockNotice` ส่วน `can_delete=false` ทำให้ปุ่ม Delete เปิด `WarningDialog` แทน `DeleteDialog` · ถ้า query ยังไม่ตอบหรือโหลดไม่สำเร็จ หน้าจอ **ไม่ล็อก** แล้วปล่อยให้ backend ปฏิเสธเอง
> 11. **Validation panel ปิดอยู่เป็นค่าเริ่มต้น** — เป็น `Collapsible` ที่ header สรุปจำนวน issue + badge "N errors" / "N warnings" ต้องกดหัวข้อเพื่อขยายก่อนจึงจะเห็นรายการและกดกระโดดไป stage ได้
> 12. **Diagram เป็น ReactFlow (`@xyflow/react`) แนวตั้ง** อยู่ซ้ายของฟอร์ม แสดงเฉพาะเมื่อมี stage และลากสลับลำดับได้เฉพาะตอนอยู่ในโหมดแก้ไข
> 13. **ปุ่ม Cancel ในโหมดแก้ที่หน้า detail ไม่เด้ง Discard dialog** — `handleCancel` เรียก `form.reset()` ตรง ๆ กล่องยืนยันมีเฉพาะตอน **navigate ออกจากหน้า** (navigation guard) ต่างจากฟอร์มสร้างที่ปุ่ม Cancel/Back ผูกกับ `useDiscardConfirm`
> 14. **เคสที่ต้องเตรียมข้อมูลเป็นพิเศษ**: TC-WF-040007 / TC-WF-050004 ต้องมี workflow ที่มีเอกสารสถานะ in progress, TC-WF-400011 ต้องมี workflow ที่เปิด "Show signature in report" ครบ 5 stage, TC-WF-900004 ต้องมี workflow ที่ `data` เป็นรูปแบบเก่าจน `parseWorkflowData` ไม่ผ่าน

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-WF-010001 | หน้ารายการ workflow ของ Purchase Request โหลดสำเร็จ | High | Smoke |
| TC-WF-010002 | คอลัมน์ Name / Flow / Updated / Status แสดงครบ | High | Functional |
| TC-WF-010003 | ค้นหา workflow ด้วยชื่อแล้วกรองรายการได้ | Medium | Functional |
| TC-WF-010006 | workflow ที่ inactive แสดงไอคอน Lock และชื่อขีดฆ่า | Medium | Functional |
| TC-WF-010008 | เปิด `/system-admin/workflow` แล้วถูก redirect ไปหน้า Purchase Request | High | Smoke |
| TC-WF-010009 | สลับไปหน้า Purchase Order และ Store Requisition แล้วหัวเรื่องเปลี่ยนตามชนิด | High | Functional |
| TC-WF-010010 | เมนูย่อยใต้กลุ่ม Workflow มีครบสามชนิดเอกสารและคลังข้อความแจ้งเตือน | Medium | Functional |
| TC-WF-010011 | ปุ่ม New Workflow พาไปฟอร์มสร้างพร้อม query `?type=` ของหน้านั้น | High | Functional |
| TC-WF-020001 | เปิดหน้า detail ของ workflow จากชื่อในตารางสำเร็จ | High | Smoke |
| TC-WF-020002 | Tabs General / Stages / Global Routing / Products / Insights ครบและสลับได้ | High | Functional |
| TC-WF-020003 | Validation panel และ diagram แสดงเมื่อ workflow มี stage | Medium | Functional |
| TC-WF-020004 | header ของ detail แสดงสถานะ ชนิด และจำนวนเอกสารแยกตามสถานะ | Medium | Functional |
| TC-WF-020005 | tab Insights แสดงสถิติย่อและการ์ดวิเคราะห์สี่ใบ | Medium | Functional |
| TC-WF-020006 | เปิด workflow ที่ไม่มีอยู่จริงแล้วเจอหน้าข้อผิดพลาดพร้อมทางออก | Medium | Negative |
| TC-WF-030001 | เปิดฟอร์มสร้าง workflow สำเร็จและเห็นสองส่วนของฟอร์ม | High | Smoke |
| TC-WF-030002 | สร้าง workflow ขั้นต่ำ (ชื่อ + ชนิด) สำเร็จ | High | CRUD |
| TC-WF-030003 | สร้าง workflow พร้อมคำอธิบายและปิดสถานะใช้งาน | Medium | CRUD |
| TC-WF-030004 | เข้าฟอร์มสร้างจากปุ่ม New Workflow แล้วชนิดถูกล็อกไว้ | High | Functional |
| TC-WF-030005 | เปิดฟอร์มสร้างด้วย `?type=` ที่ไม่รู้จักแล้วถูก redirect | Medium | Negative |
| TC-WF-030006 | เปิดฟอร์มสร้างโดยไม่มี `?type=` แล้วเลือกชนิดได้เองครบสามตัวเลือก | Medium | Functional |
| TC-WF-030007 | ออกจากฟอร์มสร้างขณะกรอกค้างแล้วเจอกล่องยืนยันทิ้งข้อมูล | Medium | Alternate Flow |
| TC-WF-040001 | แก้ชื่อและคำอธิบายใน tab General แล้วบันทึกสำเร็จ | High | CRUD |
| TC-WF-040002 | สลับสถานะใช้งานในหน้า detail แล้วบันทึกค่าคงอยู่ | Medium | CRUD |
| TC-WF-040003 | ออกจากหน้า detail ขณะแก้ค้างแล้วเจอกล่องยืนยันทิ้งข้อมูล | Medium | Functional |
| TC-WF-040004 | กด Edit แล้วเข้าโหมดแก้ไข ปุ่มและหัวเรื่องเปลี่ยนครบ | High | Functional |
| TC-WF-040005 | กด Cancel ในโหมดแก้ไขแล้วค่ากลับเป็นค่าเดิมโดยไม่มีกล่องยืนยัน | Medium | Alternate Flow |
| TC-WF-040006 | workflow ชนิด Purchase Order มีตัวเลือกรับลายเซ็นจาก PR ต้นทาง | Medium | Functional |
| TC-WF-040007 | workflow ที่มีเอกสารดำเนินการอยู่ถูกล็อกเฉพาะส่วน stage พร้อมแบนเนอร์อธิบาย | High | Functional |
| TC-WF-050001 | เปิดกล่องยืนยันลบจากเมนูในแถวแล้วยกเลิก | Medium | Alternate Flow |
| TC-WF-050002 | ลบ workflow จากเมนูในแถวสำเร็จ | High | CRUD |
| TC-WF-050003 | ลบ workflow จากปุ่ม Delete ในหน้า detail สำเร็จ | High | CRUD |
| TC-WF-050004 | ลบ workflow ที่มีเอกสารดำเนินการอยู่ไม่ได้ และได้กล่องอธิบายเหตุผล | High | Negative |
| TC-WF-100001 | ผู้ใช้ที่ไม่มีสิทธิ์เปิด URL ตรงแล้วเจอกล่องปฏิเสธการเข้าถึง | High | Authorization |
| TC-WF-100002 | เข้าหน้า workflow โดยไม่ได้ล็อกอินแล้วถูกส่งไป `/login` | High | Auth-guard |
| TC-WF-100003 | เมนู Workflow ไม่ปรากฏใน sidebar สำหรับผู้ใช้ที่ไม่มีสิทธิ์ | High | Authorization |
| TC-WF-200001 | สร้าง workflow โดยไม่กรอกชื่อแล้วขึ้นข้อความบังคับกรอก | High | Validation |
| TC-WF-200003 | ชื่อ workflow ถูกจำกัดไม่เกิน 100 ตัวอักษร | Medium | Validation |
| TC-WF-200004 | คำอธิบาย workflow ถูกจำกัดไม่เกิน 256 ตัวอักษร | Low | Validation |
| TC-WF-200005 | ชื่อ stage ยาวเกิน 100 ตัวอักษรทำให้บันทึกไม่ผ่านและ tab Stages ขึ้นจุดแดง | Medium | Validation |
| TC-WF-400001 | เมนู Duplicate สร้างสำเนา workflow พร้อมคำต่อท้าย (Copy) | High | Functional |
| TC-WF-400002 | เมนู Activate / Deactivate สลับสถานะพร้อม toast เฉพาะทาง | High | Functional |
| TC-WF-400003 | เพิ่ม stage ใหม่แล้วถูกแทรกก่อน stage สุดท้ายพร้อมค่าตั้งต้น | High | Functional |
| TC-WF-400004 | ลบ stage กลางได้ แต่ stage แรกและสุดท้ายไม่มีปุ่มลบ | High | Functional |
| TC-WF-400005 | กำหนดผู้อนุมัติให้ stage กลางและถอนออกได้ | High | Functional |
| TC-WF-400006 | ติ๊ก Is HOD แล้วรายชื่อผู้อนุมัติถูกล้างและแทนด้วยกล่องแจ้ง | Medium | Functional |
| TC-WF-400007 | ลากสลับลำดับ stage กลางได้ แต่สลับกับ stage แรก/สุดท้ายไม่ได้ | Medium | Functional |
| TC-WF-400008 | ค้นหา stage ในรายการด้านซ้ายแล้วกรองเฉพาะที่ตรงคำค้น | Low | Functional |
| TC-WF-400009 | tab Products เลือกสินค้าได้ในโหมดแก้ และแสดงเป็นตารางในโหมดอ่าน | Medium | Functional |
| TC-WF-400010 | tab Global Routing เพิ่มกฎใหม่พร้อมค่าตั้งต้นและลบกฎได้ | Medium | Functional |
| TC-WF-400011 | ติ๊กแสดงลายเซ็นได้ไม่เกิน 5 stage พร้อมข้อความบอกเพดาน | Medium | Edge Case |
| TC-WF-400012 | stage ที่เป็น HOD แสดงไอคอนมงกุฎในคอลัมน์ Flow | Low | Functional |
| TC-WF-900001 | validation panel เตือนเมื่อ stage กลางไม่มีผู้อนุมัติหรือไม่มี action | High | Edge Case |
| TC-WF-900002 | workflow ที่ไม่มีปัญหาแสดงแถบพร้อมใช้งาน | Medium | Edge Case |
| TC-WF-900003 | ตั้งชื่อ stage ซ้ำกันแล้ว validation panel แจ้งชื่อซ้ำ | Medium | Edge Case |
| TC-WF-900004 | workflow ที่ข้อมูลเป็นรูปแบบเก่าเปิดแก้ไขไม่ได้และแจ้งเหตุผล | High | Edge Case |

---
## TC-WF-010001 — หน้ารายการ workflow ของ Purchase Request โหลดสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin (admin@blueledgers.com) และ active BU = BLAVG
**Steps**
1. ไปที่ URL `/system-admin/workflow/purchase-request`
**Expected**
URL คงอยู่ที่ `/system-admin/workflow/purchase-request`, หัวเรื่องแสดง "Purchase Request Workflow" พร้อมคำอธิบายใต้หัวเรื่อง, ปุ่ม "New Workflow" ปรากฏ, ช่องค้นหาปรากฏ และตาราง DataGrid (หรือ empty state) แสดงผลภายใน 10 วินาที โดยมี badge จำนวนรายการข้างหัวเรื่องเมื่อมีข้อมูลอย่างน้อย 1 รายการ

---
## TC-WF-010002 — คอลัมน์ Name / Flow / Updated / Status แสดงครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/workflow/purchase-request` และมี workflow อย่างน้อย 1 รายการ
**Steps**
1. ดูหัวคอลัมน์ของตาราง
2. ดูข้อมูลในแถวแรก
**Expected**
หัวคอลัมน์มี Name, Flow, Updated, Status และคอลัมน์เมนูการกระทำท้ายแถว — **ไม่มี**คอลัมน์ "Workflow Type"; Name แสดงชื่อเป็นปุ่มกดได้, Flow แสดงแถบไอคอนของ stage (เริ่ม → กลาง → Completed พร้อม `+N` เมื่อ stage กลางเกิน 5), Updated แสดงเวลาแบบสัมพัทธ์พร้อม tooltip เวลาเต็มและชื่อผู้แก้ไข, Status แสดง badge Active/Inactive

---
## TC-WF-010003 — ค้นหา workflow ด้วยชื่อแล้วกรองรายการได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/workflow/purchase-request` และทราบชื่อ workflow ที่มีอยู่จริงอย่างน้อย 1 รายการ
**Steps**
1. พิมพ์คำค้นบางส่วนของชื่อ workflow ลงในช่องค้นหา
2. กด Enter
3. กดปุ่มล้าง (กากบาท) ท้ายช่องค้นหา
**Expected**
หลังกด Enter ตารางแสดงเฉพาะ workflow ที่ชื่อตรงคำค้น (การพิมพ์เฉย ๆ โดยไม่กด Enter ยังไม่กรอง) และหลังกดปุ่มล้าง ช่องค้นหาว่างและตารางกลับมาแสดงทุกรายการของชนิดนั้น

---
## TC-WF-010006 — workflow ที่ inactive แสดงไอคอน Lock และชื่อขีดฆ่า
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้ารายการของชนิดใดชนิดหนึ่ง และมี workflow ที่ `is_active = false` อย่างน้อย 1 รายการ
**Steps**
1. หาแถวของ workflow ที่สถานะเป็น Inactive
2. วางเมาส์บนไอคอนหน้าชื่อ
**Expected**
แถวนั้นแสดงไอคอน Lock หน้าชื่อ (aria-label และ tooltip เป็น "Inactive"), ชื่อมีเส้นขีดฆ่าและเป็นสีจาง, แถบ Flow มีความทึบลดลง และคอลัมน์ Status แสดง badge Inactive

---
## TC-WF-010008 — เปิด `/system-admin/workflow` แล้วถูก redirect ไปหน้า Purchase Request
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin
**Steps**
1. เปิด URL `/system-admin/workflow` ตรง ๆ
**Expected**
เบราว์เซอร์อยู่ที่ `/system-admin/workflow/purchase-request` (redirect แบบ `replace` จึงกด Back แล้วไม่วนกลับมาที่ `/system-admin/workflow`) และหน้าที่แสดงคือหน้ารายการ workflow ของ Purchase Request

---
## TC-WF-010009 — สลับไปหน้า Purchase Order และ Store Requisition แล้วหัวเรื่องเปลี่ยนตามชนิด
**Priority:** High · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Platform Admin
**Steps**
1. เปิด `/system-admin/workflow/purchase-order`
2. เปิด `/system-admin/workflow/store-requisition`
**Expected**
หน้าแรกแสดงหัวเรื่อง "Purchase Order Workflow" หน้าที่สองแสดง "Store Requisition Workflow" ทั้งสองหน้าโครงสร้างเหมือนกัน (ปุ่ม New Workflow + ช่องค้นหา + ตาราง) และรายการที่แสดงเป็นคนละชุดกับหน้า Purchase Request เพราะแต่ละหน้ายิง endpoint ของชนิดตัวเอง

---
## TC-WF-010010 — เมนูย่อยใต้กลุ่ม Workflow มีครบสามชนิดเอกสารและคลังข้อความแจ้งเตือน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Platform Admin และอยู่ในโมดูล System Administration
**Steps**
1. เปิดเมนูกลุ่ม Workflow ใน sidebar
2. คลิกเมนูย่อยรายการแรก
**Expected**
เห็นเมนูย่อยตามลำดับ: Purchase Request, Purchase Order, Store Requisition แล้วตามด้วย Notification Template; คลิกแล้วพาไป `/system-admin/workflow/purchase-request` และเมนูย่อยที่กำลังเปิดอยู่ถูกไฮไลต์ตาม path

---
## TC-WF-010011 — ปุ่ม New Workflow พาไปฟอร์มสร้างพร้อม query `?type=` ของหน้านั้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/workflow/store-requisition`
**Steps**
1. กดปุ่ม "New Workflow"
**Expected**
navigate ไปยัง `/system-admin/workflow/new?type=store-requisition` และฟอร์มสร้างเปิดขึ้น (ทำเช่นเดียวกันจากหน้า purchase-request / purchase-order จะได้ `?type=` ตรงกับหน้านั้น)

---
## TC-WF-020001 — เปิดหน้า detail ของ workflow จากชื่อในตารางสำเร็จ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
อยู่ที่หน้ารายการและมี workflow อย่างน้อย 1 รายการ
**Steps**
1. คลิกชื่อ workflow ในคอลัมน์ Name
**Expected**
navigate ไปยัง `/system-admin/workflow/<uuid>`, header แสดงชื่อ workflow เป็นหัวเรื่อง พร้อมปุ่ม Activity, Edit และ Delete, มีปุ่มย้อนกลับ และฟอร์มเปิดในโหมดอ่าน (ทุกช่องใน tab General เป็น disabled)

---
## TC-WF-020002 — Tabs General / Stages / Global Routing / Products / Insights ครบและสลับได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดหน้า detail ของ workflow ที่มี stage, routing rule และ product อย่างน้อยอย่างละ 1
**Steps**
1. ดูแถบ Tabs
2. คลิกทีละ tab: General → Stages → Global Routing → Products → Insights
**Expected**
มี 5 tabs ตามลำดับนี้; tab Stages, Global Routing และ Products แสดง badge ตัวเลขจำนวนรายการของตัวเอง; ทุก tab สลับได้และเนื้อหาตรงกับชื่อ tab

---
## TC-WF-020003 — Validation panel และ diagram แสดงเมื่อ workflow มี stage
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดหน้า detail ของ workflow ที่มี stage อย่างน้อย 1
**Steps**
1. ดูพื้นที่เหนือฟอร์มและด้านซ้ายของฟอร์ม
2. คลิกโหนด stage กลางในไดอะแกรม
**Expected**
เหนือฟอร์มมีแถบสรุปผลตรวจสอบ (พร้อมใช้งาน หรือจำนวน issue พร้อม badge errors/warnings) และด้านซ้ายมีไดอะแกรมแนวตั้งของ stage; การคลิกโหนดทำให้ tab เปลี่ยนไปที่ Stages และ stage ที่คลิกถูกเลือกในรายการด้านซ้าย

---
## TC-WF-020004 — header ของ detail แสดงสถานะ ชนิด และจำนวนเอกสารแยกตามสถานะ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดหน้า detail ของ workflow ในโหมดอ่าน และ endpoint `edit-availability` ตอบสำเร็จ
**Steps**
1. ดูแถว badge ข้างหัวเรื่อง
**Expected**
เห็น badge สถานะ Active/Inactive, ตามด้วยชื่อชนิดของ workflow (Purchase Request / Purchase Order / Store Requisition) และตามด้วยจำนวนเอกสารสามค่า Draft / In progress / Done โดย In progress ถูกเน้นเป็นสีเตือนพร้อม title อธิบายว่าบล็อกการแก้เมื่อมีค่ามากกว่า 0; ถ้ามี description ของ workflow จะแสดงเป็นบรรทัดรองใต้หัวเรื่อง

---
## TC-WF-020005 — tab Insights แสดงสถิติย่อและการ์ดวิเคราะห์สี่ใบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดหน้า detail ของ workflow ที่มี stage อย่างน้อย 1
**Steps**
1. คลิก tab Insights
**Expected**
เห็นแถบสถิติย่อ (Cycle time, Approvers, HoD stages, Total users, Routing rules, Products) และการ์ดสี่ใบ: SLA breakdown, Role distribution, Action coverage, Notification recipients; ถ้า workflow ไม่มี stage เลยจะแสดงข้อความ "No stages configured." แทน

---
## TC-WF-020006 — เปิด workflow ที่ไม่มีอยู่จริงแล้วเจอหน้าข้อผิดพลาดพร้อมทางออก
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ล็อกอินเป็น Platform Admin
**Steps**
1. เปิด URL `/system-admin/workflow/<uuid ที่ไม่มีในระบบ>`
**Expected**
หน้าแสดงสถานะข้อผิดพลาดพร้อมข้อความ "Approval flow not found" และมีทางออกกลับไปที่ `/system-admin/workflow` (ซึ่ง redirect ต่อไปหน้า Purchase Request) โดยไม่มีฟอร์มแก้ไขเปิดขึ้น

---
## TC-WF-030001 — เปิดฟอร์มสร้าง workflow สำเร็จและเห็นสองส่วนของฟอร์ม
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น Platform Admin
**Steps**
1. เปิด `/system-admin/workflow/new`
**Expected**
เห็นหัวเรื่องของฟอร์มเพิ่ม Workflow พร้อมปุ่ม Cancel และปุ่ม "Create Workflow"; ส่วน "General" มีช่อง Workflow Name (บังคับ), Workflow Type (บังคับ) และ Description; ส่วน "Status" มีสวิตช์สถานะและกล่องข้อมูล "Default Configuration" ที่อธิบายว่าจะได้ 2 stage ตั้งต้นคือ Create Request (SLA 24 ชั่วโมง) และ Completed

---
## TC-WF-030002 — สร้าง workflow ขั้นต่ำ (ชื่อ + ชนิด) สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/workflow/new`
**Steps**
1. กรอก Workflow Name ด้วยชื่อที่ไม่ซ้ำ
2. เลือก Workflow Type
3. กด "Create Workflow"
**Expected**
แสดง toast สร้างสำเร็จ และ navigate แบบ replace ไปยัง `/system-admin/workflow/<id ใหม่>`; หน้า detail ที่เปิดขึ้นมี stage ตั้งต้น 2 รายการคือ Create Request และ Completed

---
## TC-WF-030003 — สร้าง workflow พร้อมคำอธิบายและปิดสถานะใช้งาน
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
อยู่ที่ `/system-admin/workflow/new`
**Steps**
1. กรอก Workflow Name และเลือก Workflow Type
2. กรอก Description
3. ปิดสวิตช์สถานะในส่วน Status
4. กด "Create Workflow"
**Expected**
สร้างสำเร็จพร้อม toast และเปิดหน้า detail ของรายการใหม่ โดย header แสดง badge Inactive และ description ที่กรอกไว้แสดงเป็นบรรทัดรอง; เมื่อกลับไปหน้ารายการของชนิดนั้น แถวใหม่แสดงไอคอน Lock และชื่อขีดฆ่า

---
## TC-WF-030004 — เข้าฟอร์มสร้างจากปุ่ม New Workflow แล้วชนิดถูกล็อกไว้
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่ `/system-admin/workflow/purchase-order`
**Steps**
1. กดปุ่ม "New Workflow"
2. พยายามเปิด Select "Workflow Type"
**Expected**
ฟอร์มเปิดที่ `/system-admin/workflow/new?type=purchase-order` โดยช่อง Workflow Type มีค่าเป็น Purchase Order และถูก disable — กดแล้วไม่มีรายการตัวเลือกเปิดออกมา ส่วนช่องอื่นยังกรอกได้ตามปกติ

---
## TC-WF-030005 — เปิดฟอร์มสร้างด้วย `?type=` ที่ไม่รู้จักแล้วถูก redirect
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
ล็อกอินเป็น Platform Admin
**Steps**
1. เปิด URL `/system-admin/workflow/new?type=not-a-doc-type`
**Expected**
ระบบไม่เปิดฟอร์มสร้าง แต่ redirect ไปยัง `/system-admin/workflow/purchase-request` (ไม่เดาชนิดให้ เพื่อกันการได้ฟอร์มที่ล็อกชนิดผิด)

---
## TC-WF-030006 — เปิดฟอร์มสร้างโดยไม่มี `?type=` แล้วเลือกชนิดได้เองครบสามตัวเลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินเป็น Platform Admin
**Steps**
1. เปิด `/system-admin/workflow/new` (ไม่มี query string)
2. เปิด Select "Workflow Type"
**Expected**
ฟอร์มเปิดตามปกติ, Select เปิดได้และมีตัวเลือกสามรายการ: Purchase Request, Store Requisition, Purchase Order; เลือกตัวใดก็ได้แล้วค่าจะถูกตั้งตามที่เลือก

---
## TC-WF-030007 — ออกจากฟอร์มสร้างขณะกรอกค้างแล้วเจอกล่องยืนยันทิ้งข้อมูล
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่ `/system-admin/workflow/new` และยังไม่ได้กดสร้าง
**Steps**
1. กรอก Workflow Name ให้ฟอร์มมีการเปลี่ยนแปลง
2. กดปุ่ม Cancel (หรือปุ่มย้อนกลับที่หัวฟอร์ม)
3. ในกล่องที่เด้งขึ้นกดยกเลิก
4. ทำซ้ำข้อ 2 แล้วกดยืนยันทิ้งข้อมูล
**Expected**
ขั้นที่ 2 มีกล่องยืนยันทิ้งข้อมูลแบบเตือนเด้งขึ้น; กดยกเลิกแล้วยังอยู่ที่ฟอร์มเดิมพร้อมค่าที่กรอกไว้; กดยืนยันแล้วออกจากฟอร์มกลับไปที่ `/system-admin/workflow` (ซึ่ง redirect ต่อไปหน้า Purchase Request) โดยไม่มี workflow ใหม่ถูกสร้าง

---
## TC-WF-040001 — แก้ชื่อและคำอธิบายใน tab General แล้วบันทึกสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เปิดหน้า detail ของ workflow ทดสอบที่ไม่มีเอกสารสถานะ in progress
**Steps**
1. กดปุ่ม Edit ที่ header
2. ที่ tab General แก้ Workflow Name และ Description
3. กดปุ่ม "Save Changes"
**Expected**
แสดง toast บันทึกสำเร็จ, หน้ากลับสู่โหมดอ่าน (ปุ่มกลับเป็น Edit/Delete) และค่าที่แก้แสดงในหัวเรื่องกับบรรทัดรอง; รีโหลดหน้าแล้วค่ายังคงอยู่

---
## TC-WF-040002 — สลับสถานะใช้งานในหน้า detail แล้วบันทึกค่าคงอยู่
**Priority:** Medium · **Test Type:** CRUD
**Preconditions**
เปิดหน้า detail ของ workflow ทดสอบที่สถานะเป็น Active
**Steps**
1. กด Edit
2. ที่ tab General สลับสวิตช์สถานะเป็นปิด
3. กด "Save Changes"
**Expected**
toast บันทึกสำเร็จปรากฏ, header แสดง badge Inactive และเมื่อกลับไปหน้ารายการของชนิดนั้น แถวของ workflow แสดงเป็น Inactive

---
## TC-WF-040003 — ออกจากหน้า detail ขณะแก้ค้างแล้วเจอกล่องยืนยันทิ้งข้อมูล
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail และได้แก้ค่าในฟอร์มแล้ว (ยังไม่ได้บันทึก)
**Steps**
1. แก้ค่าใด ๆ ในฟอร์ม
2. กดปุ่มย้อนกลับที่หัวหน้า หรือคลิกเมนูอื่นใน sidebar
3. กดยกเลิกในกล่องที่เด้งขึ้น
4. ทำซ้ำข้อ 2 แล้วกดยืนยันทิ้งข้อมูล
**Expected**
ขั้นที่ 2 มีกล่องยืนยันทิ้งข้อมูลแบบเตือนเด้งขึ้น; กดยกเลิกแล้วยังอยู่หน้าเดิมพร้อมค่าที่แก้; กดยืนยันแล้วออกจากหน้าไปยังปลายทางที่เลือก และการเปลี่ยนแปลงไม่ถูกบันทึก

---
## TC-WF-040004 — กด Edit แล้วเข้าโหมดแก้ไข ปุ่มและหัวเรื่องเปลี่ยนครบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
เปิดหน้า detail ของ workflow ในโหมดอ่าน
**Steps**
1. กดปุ่ม Edit
**Expected**
หัวเรื่องเปลี่ยนจากชื่อ workflow เป็น "Edit Workflow", แถว badge (สถานะ/ชนิด/จำนวนเอกสาร) หายไป, ปุ่มเปลี่ยนเป็น Activity + Cancel + "Save Changes" และช่องใน tab General เปิดให้แก้ได้

---
## TC-WF-040005 — กด Cancel ในโหมดแก้ไขแล้วค่ากลับเป็นค่าเดิมโดยไม่มีกล่องยืนยัน
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail
**Steps**
1. แก้ Workflow Name เป็นค่าใหม่
2. กดปุ่ม Cancel ที่ header
**Expected**
ฟอร์มกลับเป็นค่าเดิมทันทีและกลับสู่โหมดอ่าน **โดยไม่มีกล่องยืนยันทิ้งข้อมูลเด้งขึ้น** (กล่องยืนยันมีเฉพาะตอน navigate ออกจากหน้า — ดู TC-WF-040003); หัวเรื่องกลับมาแสดงชื่อเดิมของ workflow

---
## TC-WF-040006 — workflow ชนิด Purchase Order มีตัวเลือกรับลายเซ็นจาก PR ต้นทาง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มี workflow ชนิด Purchase Order และ workflow ชนิด Purchase Request อย่างละ 1 รายการ
**Steps**
1. เปิด detail ของ workflow ชนิด Purchase Order แล้วกด Edit
2. ดู tab General
3. เปิด detail ของ workflow ชนิด Purchase Request แล้วกด Edit และดู tab General
**Expected**
เฉพาะ workflow ชนิด Purchase Order เท่านั้นที่มี checkbox "Inherit signatures from source PR" พร้อมคำอธิบายใต้ป้าย; workflow ชนิด Purchase Request (และ Store Requisition) ไม่มี checkbox นี้

---
## TC-WF-040007 — workflow ที่มีเอกสารดำเนินการอยู่ถูกล็อกเฉพาะส่วน stage พร้อมแบนเนอร์อธิบาย
**Priority:** High · **Test Type:** Functional
**Preconditions**
มี workflow ที่ `edit-availability` ตอบ `can_edit_stages = false` (มีเอกสารสถานะ in progress อย่างน้อย 1 ใบ) — ต้องเตรียมข้อมูลฝั่ง backend ก่อน
**Steps**
1. เปิด detail ของ workflow นั้นแล้วกด Edit
2. ไปที่ tab Stages
3. ไปที่ tab General และ tab Products
**Expected**
tab Stages แสดงแบนเนอร์เตือนพร้อมไอคอนกุญแจที่บอกจำนวนเอกสารที่กำลังเดินอยู่, ปุ่ม Add ในรายการ stage หายไป, ปุ่มลบ stage หายไป และช่อง Stage Name ถูก disable — ขณะที่ tab General (ชื่อ/คำอธิบาย/สถานะ) และ tab Products ยังแก้และบันทึกได้ตามปกติ

---
## TC-WF-050001 — เปิดกล่องยืนยันลบจากเมนูในแถวแล้วยกเลิก
**Priority:** Medium · **Test Type:** Alternate Flow
**Preconditions**
อยู่ที่หน้ารายการและมี workflow อย่างน้อย 1 รายการ
**Steps**
1. กดปุ่มเมนูการกระทำท้ายแถว
2. เลือก Delete
3. ในกล่องยืนยันกดปุ่มยกเลิก
**Expected**
กล่องยืนยันแสดงชื่อ workflow ในข้อความ; หลังกดยกเลิกกล่องปิดลงและแถว workflow ยังคงอยู่ในตาราง ไม่มี toast ใด ๆ

---
## TC-WF-050002 — ลบ workflow จากเมนูในแถวสำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
มี workflow ทดสอบที่ไม่มีเอกสารผูกอยู่ (สร้างขึ้นใหม่จาก TC-WF-030002 ได้)
**Steps**
1. ที่หน้ารายการ กดเมนูการกระทำของแถวนั้น
2. เลือก Delete
3. กดยืนยันในกล่อง
**Expected**
แสดง toast ลบสำเร็จ และแถวของ workflow หายจากตาราง

---
## TC-WF-050003 — ลบ workflow จากปุ่ม Delete ในหน้า detail สำเร็จ
**Priority:** High · **Test Type:** CRUD
**Preconditions**
เปิดหน้า detail (โหมดอ่าน) ของ workflow ทดสอบที่ไม่มีเอกสารผูกอยู่
**Steps**
1. กดปุ่ม Delete ที่ header
2. กดยืนยันในกล่อง
**Expected**
กล่องยืนยันแสดงชื่อ workflow; หลังยืนยันจะมี toast ลบสำเร็จ และระบบ navigate กลับไปที่ `/system-admin/workflow` (ซึ่ง redirect ต่อไปหน้า Purchase Request) โดยไม่มีรายการนั้นในตารางแล้ว

---
## TC-WF-050004 — ลบ workflow ที่มีเอกสารดำเนินการอยู่ไม่ได้ และได้กล่องอธิบายเหตุผล
**Priority:** High · **Test Type:** Negative
**Preconditions**
มี workflow ที่ `edit-availability` ตอบ `can_delete = false` (มีเอกสารสถานะ in progress) — ต้องเตรียมข้อมูลฝั่ง backend ก่อน
**Steps**
1. เปิด detail ของ workflow นั้นในโหมดอ่าน
2. กดปุ่ม Delete ที่ header
3. กดปุ่มปิดในกล่องที่เด้งขึ้น
**Expected**
ระบบ **ไม่เปิดกล่องยืนยันลบ** แต่เปิดกล่องเตือนหัวข้อ "Can't delete this workflow yet" ที่ระบุจำนวนเอกสารที่ยังดำเนินการอยู่และเหตุผล; กดปิดแล้วกล่องหายไปและ workflow ยังอยู่ครบ ไม่มีคำขอลบถูกส่ง

---
## TC-WF-100001 — ผู้ใช้ที่ไม่มีสิทธิ์เปิด URL ตรงแล้วเจอกล่องปฏิเสธการเข้าถึง
**Priority:** High · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วยผู้ใช้ที่ไม่มีสิทธิ์ `system_configuration.view` และไม่ใช่ admin (เช่น requestor@blueledgers.com) โดย BU ยังมี license `system_admin.workflow`
**Steps**
1. เปิด URL `/system-admin/workflow/purchase-request` ตรง ๆ
**Expected**
ระบบไม่แสดงรายการ workflow แต่แสดงกล่องปฏิเสธการเข้าถึง (role=alert) พร้อมไอคอนโล่ขีดฆ่า ข้อความให้ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์ และปุ่มพาไปหน้าที่ผู้ใช้เข้าถึงได้; ไม่มีคำขอรายการ workflow ถูกยิงจากหน้านี้

---
## TC-WF-100002 — เข้าหน้า workflow โดยไม่ได้ล็อกอินแล้วถูกส่งไป `/login`
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session / ไม่ได้ล็อกอิน (ล้าง storage state)
**Steps**
1. เปิด URL `/system-admin/workflow/purchase-request` ตรง ๆ
**Expected**
ถูก redirect ไปยัง `/login` ทันทีและไม่มีข้อมูล workflow แสดงบนหน้าจอ

---
## TC-WF-100003 — เมนู Workflow ไม่ปรากฏใน sidebar สำหรับผู้ใช้ที่ไม่มีสิทธิ์
**Priority:** High · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วยผู้ใช้ที่ไม่มีสิทธิ์ `system_configuration.view` และไม่ใช่ admin
**Steps**
1. เปิดโมดูล System Administration จากตัวเลือกโมดูล
2. ดูรายการเมนูใน sidebar
**Expected**
ไม่มีเมนู Workflow (และเมนูย่อยสามชนิดเอกสาร) ให้กดใน sidebar — การกันการเข้าถึงข้อมูลจริงยังเป็นหน้าที่ของ backend อีกชั้น

---
## TC-WF-200001 — สร้าง workflow โดยไม่กรอกชื่อแล้วขึ้นข้อความบังคับกรอก
**Priority:** High · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/workflow/new`
**Steps**
1. เว้นช่อง Workflow Name ว่างไว้
2. กดปุ่ม "Create Workflow"
**Expected**
แสดงข้อความบังคับกรอกใต้ช่อง Workflow Name, ช่องถูกทำเครื่องหมายว่าไม่ผ่าน, หน้าจอเลื่อนไปยังช่องแรกที่ไม่ผ่าน, ฟอร์มไม่ถูก submit และไม่มี toast สร้างสำเร็จ

---
## TC-WF-200003 — ชื่อ workflow ถูกจำกัดไม่เกิน 100 ตัวอักษร
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/workflow/new`
**Steps**
1. พิมพ์หรือวางข้อความยาวเกิน 100 ตัวอักษรลงในช่อง Workflow Name
**Expected**
ค่าที่อยู่ในช่องถูกตัดให้เหลือไม่เกิน 100 ตัวอักษร (ข้อจำกัดที่ตัวช่องกรอก ไม่ใช่ข้อความ error)

---
## TC-WF-200004 — คำอธิบาย workflow ถูกจำกัดไม่เกิน 256 ตัวอักษร
**Priority:** Low · **Test Type:** Validation
**Preconditions**
อยู่ที่ `/system-admin/workflow/new`
**Steps**
1. พิมพ์หรือวางข้อความยาวเกิน 256 ตัวอักษรลงในช่อง Description
**Expected**
ค่าที่อยู่ในช่องถูกตัดให้เหลือไม่เกิน 256 ตัวอักษร (ใช้กับช่อง Description ใน tab General ของหน้า detail เช่นกัน)

---
## TC-WF-200005 — ชื่อ stage ยาวเกิน 100 ตัวอักษรทำให้บันทึกไม่ผ่านและ tab Stages ขึ้นจุดแดง
**Priority:** Medium · **Test Type:** Validation
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail และมี stage กลางอย่างน้อย 1 รายการ
**Steps**
1. เลือก stage กลาง แล้วที่ tab General ของ stage วางข้อความยาวเกิน 100 ตัวอักษรลงในช่อง Stage Name
2. กด "Save Changes"
**Expected**
ฟอร์มไม่ถูกบันทึก (ไม่มี toast บันทึกสำเร็จ), tab Stages แสดงจุดสีแดงมุมขวาเพื่อบอกว่ามีข้อผิดพลาดในส่วนนี้ และหน้าจอเลื่อนไปยังช่องแรกที่ไม่ผ่าน; ช่อง Stage Name **ไม่มี** ข้อจำกัดความยาวที่ตัวช่อง — กติกาบังคับตอน submit เท่านั้น

---
## TC-WF-400001 — เมนู Duplicate สร้างสำเนา workflow พร้อมคำต่อท้าย (Copy)
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้ารายการ และมี workflow ที่ทราบชื่อ 1 รายการ
**Steps**
1. กดเมนูการกระทำท้ายแถวของ workflow นั้น
2. เลือก Duplicate
**Expected**
แสดง toast "Workflow duplicated" และในตารางมีรายการใหม่ชื่อ "<ชื่อเดิม> (Copy)" เพิ่มขึ้น 1 รายการ โดยสำเนาถือ stage และค่าตั้งค่าชุดเดียวกับต้นฉบับ; ระหว่างทำงานปุ่มเมนูของแถวนั้นถูก disable

---
## TC-WF-400002 — เมนู Activate / Deactivate สลับสถานะพร้อม toast เฉพาะทาง
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ที่หน้ารายการ และมี workflow ทั้งที่ Active และ Inactive อย่างละ 1 รายการ
**Steps**
1. ที่ workflow ที่ Active เปิดเมนูการกระทำ แล้วเลือก Deactivate
2. ที่ workflow ที่ Inactive เปิดเมนูการกระทำ แล้วเลือก Activate
**Expected**
เมนูแสดงเฉพาะตัวเลือกที่ตรงข้ามกับสถานะปัจจุบัน; ขั้นที่ 1 ได้ toast "Workflow deactivated" แล้วแถวเปลี่ยนเป็น Inactive (ไอคอน Lock + ชื่อขีดฆ่า), ขั้นที่ 2 ได้ toast "Workflow activated" แล้วแถวกลับเป็น Active

---
## TC-WF-400003 — เพิ่ม stage ใหม่แล้วถูกแทรกก่อน stage สุดท้ายพร้อมค่าตั้งต้น
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail, tab Stages เปิดอยู่ และ workflow ไม่ถูกล็อกโครงสร้าง
**Steps**
1. ที่หัวรายการ stage ด้านซ้าย กดปุ่ม "Add"
2. ดูตำแหน่งของ stage ใหม่และค่าใน tab General ของ stage นั้น
**Expected**
stage ใหม่ชื่อ "New Stage 1" (เลขเพิ่มขึ้นถ้าชื่อซ้ำ) ถูกแทรก **ก่อน** stage สุดท้ายและถูกเลือกอัตโนมัติ; ค่าตั้งต้นคือ Role = Approve, SLA = 24 Hours และ action Approve/Reject/Send Back เปิดอยู่ ส่วน Submit ปิด; badge จำนวนบน tab Stages และไดอะแกรมเพิ่มขึ้นตาม

---
## TC-WF-400004 — ลบ stage กลางได้ แต่ stage แรกและสุดท้ายไม่มีปุ่มลบ
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail และ workflow มี stage กลางอย่างน้อย 1 รายการ (นอกจาก Create Request และ Completed)
**Steps**
1. เลือก stage กลาง แล้วกดปุ่มลบในรายการด้านซ้าย
2. กดยืนยันในกล่องที่เด้งขึ้น
3. เลือก stage แรก แล้วเลือก stage สุดท้าย
**Expected**
stage กลางถูกลบออกจากรายการหลังยืนยัน และตัวที่ถูกเลือกเลื่อนไปยัง stage ก่อนหน้า; stage แรกและ stage สุดท้ายไม่มีปุ่มลบให้กด; stage สุดท้ายแสดงหน้า "Completed Stage" แบบอ่านอย่างเดียวแทนแท็บตั้งค่า · หมายเหตุ: กล่องยืนยันลบ stage ใช้หัวข้อ "Delete Workflow" ตามข้อ 9 ของหมายเหตุผู้รีวิว — assert ตามข้อความที่แอปแสดงจริง

---
## TC-WF-400005 — กำหนดผู้อนุมัติให้ stage กลางและถอนออกได้
**Priority:** High · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail, เลือก stage กลางที่ยังไม่ได้ติ๊ก Is HOD และระบบมีผู้ใช้อย่างน้อย 2 คน
**Steps**
1. ที่รายละเอียด stage เปิดแท็บ "Assigned Users"
2. พิมพ์คำค้นในช่องค้นหาผู้ใช้
3. กดปุ่ม Assign ที่ผู้ใช้รายหนึ่ง
4. กดปุ่ม Unassign ที่ผู้ใช้คนเดิม
**Expected**
ช่องค้นหากรองรายชื่อตามชื่อ/นามสกุล/อีเมล; หลังกด Assign ผู้ใช้ถูกไฮไลต์เป็นรายการที่เลือกแล้ว ถูกเรียงขึ้นด้านบน และ badge จำนวนบนแท็บ Assigned Users เพิ่มขึ้น; หลังกด Unassign ผู้ใช้ถูกถอดออกและ badge ลดลง; เมื่อมีคำค้นอยู่ ปุ่มกวาดทั้งชุดจะเปลี่ยนเป็น "Assign Filtered" / "Unassign Filtered"

---
## TC-WF-400006 — ติ๊ก Is HOD แล้วรายชื่อผู้อนุมัติถูกล้างและแทนด้วยกล่องแจ้ง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail และเลือก stage กลางที่มีผู้อนุมัติอยู่แล้วอย่างน้อย 1 คน
**Steps**
1. ที่แท็บ Assigned Users ติ๊ก checkbox "Is HOD"
**Expected**
รายชื่อผู้อนุมัติของ stage ถูกล้างจนหมด, badge จำนวนบนแท็บหายไป และพื้นที่รายชื่อถูกแทนด้วยกล่องเตือนพร้อมไอคอนกุญแจข้อความ "HOD mode enabled. Approval routed to Head of Department." — เลือกผู้ใช้รายตัวไม่ได้อีก; checkbox "Is HOD" มีเฉพาะ stage กลางเท่านั้น

---
## TC-WF-400007 — ลากสลับลำดับ stage กลางได้ แต่สลับกับ stage แรก/สุดท้ายไม่ได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail, workflow มี stage กลางอย่างน้อย 2 รายการ และไม่ถูกล็อกโครงสร้าง; ช่องค้นหา stage ต้องว่าง
**Steps**
1. ลากจุดจับของ stage กลางตัวที่สองขึ้นไปวางเหนือ stage กลางตัวแรก
2. ลอง ลาก stage กลางไปวางที่ตำแหน่งแรกสุด (เหนือ Create Request)
**Expected**
ขั้นที่ 1 ลำดับของสอง stage กลางสลับกันและ stage ที่ลากยังคงถูกเลือกอยู่ พร้อมไดอะแกรมอัปเดตตาม; ขั้นที่ 2 ลำดับไม่เปลี่ยน — stage แรกและ stage สุดท้ายตรึงตำแหน่งไว้เสมอ

---
## TC-WF-400008 — ค้นหา stage ในรายการด้านซ้ายแล้วกรองเฉพาะที่ตรงคำค้น
**Priority:** Low · **Test Type:** Functional
**Preconditions**
เปิดหน้า detail ที่ tab Stages และ workflow มี stage ตั้งแต่ 3 รายการขึ้นไป
**Steps**
1. พิมพ์ชื่อบางส่วนของ stage ลงในช่องค้นหาเหนือรายการ stage
2. ล้างคำค้น
3. พิมพ์คำที่ไม่ตรงกับ stage ใดเลย
**Expected**
ขั้นที่ 1 รายการแสดงเฉพาะ stage ที่ชื่อตรงคำค้น (ไม่สนตัวพิมพ์ใหญ่เล็ก) และระหว่างที่มีคำค้นจะลากสลับลำดับไม่ได้; ขั้นที่ 2 รายการกลับมาครบ; ขั้นที่ 3 แสดงสถานะว่างพร้อมไอคอนและข้อความว่าไม่พบข้อมูล

---
## TC-WF-400009 — tab Products เลือกสินค้าได้ในโหมดแก้ และแสดงเป็นตารางในโหมดอ่าน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิดหน้า detail ของ workflow และระบบมีสินค้าอย่างน้อย 1 รายการ
**Steps**
1. ที่โหมดอ่าน คลิก tab Products
2. กด Edit แล้วกลับมาที่ tab Products
3. ติ๊กสินค้า 1 รายการ แล้วใช้ checkbox เลือกทั้งหมด
4. กด "Save Changes"
**Expected**
โหมดอ่านแสดง **ตาราง** ของเฉพาะสินค้าที่ถูกเลือกไว้ พร้อมช่องค้นหาและตัวนับ "{n} selected"; โหมดแก้เปลี่ยนเป็นต้นไม้หมวดหมู่ที่ติ๊กได้ทั้งระดับหมวดและรายตัว โดย checkbox ของหมวดแสดงสถานะกึ่งเลือกเมื่อเลือกบางส่วน และ checkbox เลือกทั้งหมดทำงานกับรายการที่มองเห็นตามคำค้น; หลังบันทึกได้ toast สำเร็จ และ badge จำนวนบน tab Products อัปเดตตาม

---
## TC-WF-400010 — tab Global Routing เพิ่มกฎใหม่พร้อมค่าตั้งต้นและลบกฎได้
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail, workflow มี stage อย่างน้อย 2 รายการ และไม่ถูกล็อกโครงสร้าง
**Steps**
1. คลิก tab Global Routing
2. กดปุ่มเพิ่มกฎ
3. ดูค่าในฟอร์มของกฎที่ถูกสร้าง
4. ลบกฎที่เพิ่งเพิ่ม
**Expected**
ก่อนเพิ่มจะเห็นข้อความว่ายังไม่มีกฎ; หลังเพิ่มมีกฎชื่อ "New Rule 1" ถูกเลือกอยู่ โดย Trigger Stage ตั้งต้นเป็น stage แรกและ Target Stage ตั้งต้นเป็น stage สุดท้าย, Action เป็น Next Stage; badge จำนวนบน tab Global Routing เพิ่มขึ้น 1 และลดลงเมื่อลบกฎออก

---
## TC-WF-400011 — ติ๊กแสดงลายเซ็นได้ไม่เกิน 5 stage พร้อมข้อความบอกเพดาน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail ที่ workflow มี stage ที่ติ๊ก "Show signature in report" ไว้แล้วครบ 5 รายการ และมี stage ที่ยังไม่ติ๊กอีกอย่างน้อย 1 รายการ
**Steps**
1. เลือก stage ที่ยังไม่ได้ติ๊กแสดงลายเซ็น แล้วดูส่วน "Show signature in report" ใน tab General ของ stage
2. เลือก stage ที่ติ๊กไว้แล้ว แล้วดู checkbox เดียวกัน
**Expected**
ขั้นที่ 1 checkbox ถูก disable พร้อมข้อความ "Maximum 5 signatures per report" ใต้ช่อง; ขั้นที่ 2 checkbox ของ stage ที่ติ๊กไว้แล้วยังกดได้ (เอาออกได้) และเมื่อเอาออกแล้ว checkbox ของ stage ในขั้นที่ 1 จะกลับมากดได้

---
## TC-WF-400012 — stage ที่เป็น HOD แสดงไอคอนมงกุฎในคอลัมน์ Flow
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี workflow ที่มี stage กลางซึ่งติ๊ก Is HOD ไว้อย่างน้อย 1 รายการ
**Steps**
1. ไปที่หน้ารายการของชนิดนั้น
2. วางเมาส์บนโหนดของ stage ที่เป็น HOD ในคอลัมน์ Flow
**Expected**
โหนดของ stage นั้นแสดงไอคอนมงกุฎด้วยสีเตือน **แทน** ไอคอนของ role (ไม่ได้ซ้อนทับกัน) และ tooltip แสดงชื่อ stage ตามด้วย "· HOD"; โหนดแรกเป็นไอคอนเริ่มต้นและโหนดสุดท้ายเป็นไอคอนเครื่องหมายถูกเสมอ

---
## TC-WF-900001 — validation panel เตือนเมื่อ stage กลางไม่มีผู้อนุมัติหรือไม่มี action
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail และมี stage กลางที่ไม่ได้ติ๊ก Is HOD
**Steps**
1. ถอดผู้อนุมัติออกจาก stage กลางจนหมด และปิด action ทั้งหมดของ stage นั้น
2. ดูแถบสรุปผลตรวจสอบเหนือฟอร์ม แล้วกดขยาย
3. คลิกรายการปัญหาข้อใดข้อหนึ่ง
**Expected**
แถบเปลี่ยนเป็นไอคอนข้อผิดพลาดพร้อมจำนวน issue และ badge "N errors"; เมื่อขยายจะเห็นรายการปัญหา `Stage "<ชื่อ>" has no users assigned` และ `Stage "<ชื่อ>" has no actions enabled (Submit/Approve/Reject/Send Back)` พร้อมบรรทัดบอกชื่อ stage; คลิกแล้ว tab เปลี่ยนไป Stages และ stage ที่เป็นปัญหาถูกเลือก; รายการ stage ด้านซ้ายก็แสดงสัญลักษณ์เตือนของ stage นั้นด้วย

---
## TC-WF-900002 — workflow ที่ไม่มีปัญหาแสดงแถบพร้อมใช้งาน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
มี workflow ที่ stage แรกมี role เป็น Create, stage สุดท้ายชื่อ Completed, ชื่อ stage ไม่ซ้ำและไม่ว่าง และ stage กลางทุกตัวมีผู้อนุมัติ (หรือเป็น HOD), มี action เปิดอยู่ และ SLA มากกว่า 0
**Steps**
1. เปิดหน้า detail ของ workflow นั้น
2. ดูแถบเหนือฟอร์ม
**Expected**
แถบแสดงไอคอนเครื่องหมายถูกพร้อมข้อความ "Workflow ready · No issues found" และไม่มีส่วนขยายให้กด

---
## TC-WF-900003 — ตั้งชื่อ stage ซ้ำกันแล้ว validation panel แจ้งชื่อซ้ำ
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
อยู่ในโหมดแก้ไขของหน้า detail, workflow มี stage กลางอย่างน้อย 2 รายการ และไม่ถูกล็อกโครงสร้าง
**Steps**
1. แก้ชื่อ stage กลางตัวที่สองให้ตรงกับชื่อของ stage กลางตัวแรกเป๊ะ ๆ
2. กดขยายแถบสรุปผลตรวจสอบ
**Expected**
แถบนับ issue เพิ่มขึ้นและแสดงรายการ `Duplicate stage name: "<ชื่อ>"` **สองรายการ** (หนึ่งรายการต่อ stage ที่ชื่อซ้ำ) จัดเป็นระดับ error ทำให้จำนวน errors มากกว่า 0

---
## TC-WF-900004 — workflow ที่ข้อมูลเป็นรูปแบบเก่าเปิดแก้ไขไม่ได้และแจ้งเหตุผล
**Priority:** High · **Test Type:** Edge Case
**Preconditions**
มี workflow ที่ `data` ในฐานข้อมูลไม่ตรงกับ schema ปัจจุบัน (เช่นขาดคีย์ที่บังคับใน `stages`) — ต้องเตรียมข้อมูลฝั่ง backend ก่อน
**Steps**
1. เปิด URL `/system-admin/workflow/<id ของ workflow นั้น>`
2. กลับไปหน้ารายการ แล้วสั่ง Duplicate หรือ Deactivate ที่แถวเดียวกัน
**Expected**
ขั้นที่ 1 ระบบ **ไม่เปิดฟอร์มแก้ไข** แต่แสดงหน้าข้อความ "This workflow was saved in an older format and cannot be opened for editing. Please contact your system administrator." พร้อมทางกลับไป `/system-admin/workflow`; ขั้นที่ 2 คำสั่งจากแถวก็ไม่ทำงานและขึ้น toast ข้อความเดียวกัน — กันไม่ให้ stage จริงถูกเขียนทับด้วยค่าว่าง

---
