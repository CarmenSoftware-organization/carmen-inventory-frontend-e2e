# Notifications — Test Cases

_Test-case catalog (documentation only; no automated Playwright spec yet). Authored from the React app module at `routes/notifications`. Follows the TC-ID scheme in `docs/test-id-scheme.md`._

**Module:** Notifications
**Frontend route:** `routes/notifications`  •  **URL:** `/notifications`
**Prefix:** `NTFY`
**Default role:** Admin (`admin@blueledgers.com`, active BU = `BLAVG`)
**Total test cases:** 40

> โมดูลนี้มีสองพื้นผิว: **หน้า `/notifications`** (`routes/notifications/notification-content.tsx`) และ **กระดิ่งบน navbar** (`components/navbar/notification.tsx` ที่ `navbar.tsx` เรนเดอร์อยู่). หน้า `/notifications` มี header = ไอคอนกระดิ่งในกรอบ + หัวข้อ `Notifications` + แท็บ `All` / `Unread` (แท็บ Unread มี badge จำนวนยังไม่อ่าน) และปุ่มชุดขวา `Select` กับ `Mark all as read`. รายการเป็น **การ์ดจัดกลุ่ม** ไม่ใช่ flat list: section `Broadcasts` มาก่อน แล้วตามด้วยหนึ่ง section ต่อหนึ่ง `metadata.bu` (ไม่มีค่า → หัวข้อ `Personal`). แต่ละแถวแสดงจุดน้ำเงินเมื่อยังไม่อ่าน, tile ไอคอนตาม `doc_type`, title + ป้าย `bu_code`, เวลาแบบ relative และข้อความย่อ 2 บรรทัด. แถวที่ resolve เป็น internal path ได้จะเป็น `<Link>` ส่วนแถวที่ไม่ได้จะเป็น `<button>` ที่เปิด `NotificationDetailDialog`. ด้านล่างมีปุ่ม `Load more` เมื่อยังมีหน้าถัดไป. กระดิ่งบน navbar เป็น popover ของ **รายการที่ยังไม่อ่าน 10 ใบแรก** พร้อมปุ่ม `Clear` (= mark all read), ปุ่มเปิดหน้ารวม และปุ่มติ๊กรายใบ. ชั้นข้อมูลอยู่บน TanStack Query (`hooks/use-notification.ts`) โดย REST เป็นแหล่งความจริงเดียว และมี WebSocket คอยส่งสัญญาณให้ invalidate.

> หมายเหตุสำคัญสำหรับผู้รีวิว:
>
> 1. **ข้อมูลของโมดูลนี้สร้างเองผ่าน UI ไม่ได้** — การแจ้งเตือนเกิดจากกิจกรรมของระบบ (เอกสารเข้าคิวอนุมัติ, คอมเมนต์, ประกาศจากผู้ดูแล) ไม่มีปุ่ม "สร้างการแจ้งเตือน" ในแอป. เคสส่วนใหญ่จึงต้อง **มีการแจ้งเตือนค้างอยู่ก่อน**:
>    - **รันได้กับบัญชีที่ไม่มีการแจ้งเตือนเลย:** TC-NTFY-010001, 010014, 010015, 010017, 090001, 090002, 090003, 090004, 090006, 100001, 100002
>    - **ต้องมีการแจ้งเตือนอย่างน้อย 1 ใบ:** TC-NTFY-010005, 010010, 010016, 020001–020003, 020005–020008, 040001, 040007, 040008, 100003
>    - **ต้องมีใบที่ยังไม่อ่าน (unread):** TC-NTFY-010003, 010004, 010006, 040002, 040003
>    - **ต้องมีใบที่ยังไม่อ่านหลายใบ:** TC-NTFY-040004, 040005, 040006 (ต้อง ≥ 2), 090005 (ต้อง > 9)
>    - **ต้องมีข้อมูลเฉพาะทางที่ seed ผ่าน UI ไม่ได้:** TC-NTFY-010007 และ 010013 ต้องมี broadcast (`source === "broadcast"`), 010008 ต้องมีใบที่ `metadata.bu` ต่างกัน, 010009 ต้องมีเกิน 20 ใบ (`PAGE_SIZE = 20`), 010011 ต้องมี `metadata.bu_code`, 010012 ต้องมี `event === "comment"`, 020007 ต้องมีข้อความที่มีลิงก์รูป `[ชื่อ](/path)`
> 2. **การกดอ่านเปลี่ยนสถานะถาวรบน backend — นี่คือ blocker ของการรันซ้ำ.** `PUT /api/notifications/:id/read` และ `PUT /api/notifications/mark-all-read` ไม่มีทางย้อนกลับผ่าน UI (ไม่มีปุ่ม "mark as unread"). เคสทุกตัวในบล็อก 04 รวมถึง 020001/020002 (ซึ่ง **กดแล้ว mark read เป็นผลข้างเคียง**) จึง **กินใบที่ยังไม่อ่านไปหนึ่งใบต่อการรันหนึ่งครั้ง** และ TC-NTFY-040002/040003 จะล้างทั้งกล่องทิ้ง. ลำดับที่แนะนำคือรันเคสอ่านอย่างเดียวให้หมดก่อน แล้วปิดท้ายด้วยบล็อก 04 และห้ามเอา `Mark all as read` ไว้กลางชุด.
> 3. **UI เป็นภาษาอังกฤษโดยดีฟอลต์** (`DEFAULT_LOCALE = "en"` ใน `i18n/config.ts`) ข้อความที่อ้างในทุกเคสจึงเป็นสตริงจาก `messages/en.json` และ **มีสามปุ่มที่ hardcode ภาษาอังกฤษไว้ในโค้ด ไม่ผ่าน i18n เลย**: `Select` / `Cancel`, `Mark as Read` (บนแถบลอย) และ `View All Notifications` (ในสถานะว่างของแท็บ Unread) — เปลี่ยนภาษาแล้วยังเป็นอังกฤษอยู่ ไม่ใช่บั๊กของเทส.
> 4. **ปุ่ม `Select` / `Mark all as read` อาจโผล่ทั้งที่ไม่มี unread** — เงื่อนไขคือ `hasUnread = unreadCount !== 0` โดย `unreadCount` มาจาก `summary.unread` ของ response. `summary` เป็น optional ตามสัญญา (**ไม่มี = "นับไม่ได้" ไม่ใช่ศูนย์**) ดังนั้นเมื่อ backend ไม่ส่ง summary มา `unreadCount` เป็น `undefined` และปุ่มจะแสดง. TC-NTFY-090004 จึงต้องยืนยันบนแท็บ `Unread` (ซึ่งใช้ `paginate.total` ของ endpoint `/unread` โดยตรง จึงเป็น 0 ได้จริง) ไม่ใช่แท็บ `All`.
> 5. **เคสเดิมสองตัวถูกลบเพราะขัดกับโค้ดปัจจุบัน** (ID ทั้งสองห้ามนำกลับมาใช้ซ้ำ):
>    - **TC-NTFY-010002** ยืนยันว่า header มี "badge นับจำนวนรวม (`items.length`)" — header ไม่มี badge จำนวนรวมแล้ว มีแต่ badge จำนวน **ยังไม่อ่าน** บนแท็บ `Unread` ซึ่ง TC-NTFY-010003 ครอบอยู่
>    - **TC-NTFY-020004** ยืนยันว่า detail dialog มีปุ่ม `Open` (ไอคอน `ExternalLink`) สำหรับลิงก์ภายนอก — footer ของ dialog ปัจจุบันมีเพียงปุ่ม `Close` ปุ่มเดียว และทั้งโมดูล **ไม่มีเส้นทาง external link เหลืออยู่เลย**: `getNotificationHref` คืนได้แค่ route คงที่ + id เท่านั้น แล้วยังผ่าน `safeInternalHref` ที่ปฏิเสธ URL ที่มี scheme ทุกชนิด
> 6. **สอง key ที่ชื่อคล้ายกันแต่คนละเรื่อง** — หัวข้อ section ของรายการ personal อ่านจาก `metadata.bu` ส่วนป้ายเล็กข้างชื่อเรื่องอ่านจาก `metadata.bu_code`. ใบหนึ่งอาจมีอย่างใดอย่างหนึ่ง ทั้งคู่ หรือไม่มีเลย อย่า assert ว่าตัวหนึ่งบอกอีกตัวหนึ่งได้.
> 7. **`mark as read` ของแถว broadcast ต้องส่ง `source` กลับไปใน body** (`{ source: "broadcast" }`) เพื่อให้ backend เขียนลงตารางที่ถูก. ถ้าเห็นอาการ "กดอ่านประกาศแล้วเด้งกลับเป็นยังไม่อ่านหลังรีเฟรช" ให้ดู request body ก่อนสรุปว่าเป็นบั๊กของ UI.
> 8. **mark-read เป็น optimistic** — แถวหายออกจากแคชฝั่ง "ยังไม่อ่าน" ทันทีก่อน response กลับ แล้วจึง invalidate ตามหลัง. ถ้าคำขอล้มเหลว โค้ดจะ rollback ค่ากลับ ดังนั้นเคสกลุ่ม 04 ควร assert ทั้ง "เปลี่ยนทันที" และ "ยังคงเดิมหลังรีโหลดหน้า" ไม่ใช่อย่างใดอย่างหนึ่ง.
> 9. **แคชของ detail dialog อยู่คนละ prefix และไม่ถูก invalidate ตามรายการ** (`QUERY_KEYS.NOTIFICATION_DETAIL`) — ตั้งใจ เพราะ dialog ไม่ได้แสดง `is_read`. อย่าคาดหวังว่าเปิด dialog ซ้ำแล้วจะเห็นสถานะอ่าน/ยังไม่อ่านเปลี่ยน.
> 10. **`NotificationDetailDialog` เป็น `Dialog` ปกติ (`role="dialog"`) และปิดปุ่มกากบาทไว้** (`showCloseButton={false}`) — ปิดได้ทาง ปุ่ม `Close` ที่ footer, Escape หรือคลิกฉากหลังเท่านั้น. locator ต้องเป็น `getByRole("dialog")` ไม่ใช่ `alertdialog`.
> 11. **การสลับแท็บใช้ `document.startViewTransition` เมื่อเบราว์เซอร์รองรับ** และแถวมี entry animation หน่วงตามลำดับ (`animationDelay: index * 50ms`) — รอด้วย assertion ของ Playwright ที่ auto-retry อย่าใช้เวลาคงที่.
> 12. **หน้านี้ไม่มี permission gate รายหน้า** — `notifications` เป็นลูกของ `ProtectedShell` (`RequireAuth`) เฉย ๆ ไม่มี `RouteGuard`/permission ใด ๆ ทุก role ที่ล็อกอินจึงเข้าได้ (TC-NTFY-100002). ตัวกรองว่าใครเห็นใบไหนอยู่ฝั่ง backend ล้วน ๆ.
> 13. **เวลาบนแถวเป็น relative ตาม `Intl.RelativeTimeFormat`** (`"3 days ago"`, `"yesterday"`) และเวลาเต็มอยู่ใน attribute `title` เท่านั้น — assert ข้อความเต็มด้วยการอ่าน `title` ไม่ใช่ text content. ส่วนใน dialog แสดง **เฉพาะวันที่** (`dateStyle: "medium"`) ไม่มีเวลา.

## Test Cases at a Glance
| TC | Title | Priority | Test Type |
| --- | --- | --- | --- |
| TC-NTFY-010001 | หน้า Notifications โหลดและแสดง header ครบ | High | Smoke |
| TC-NTFY-010003 | แท็บ Unread แสดง badge จำนวนที่ยังไม่อ่าน | Medium | Functional |
| TC-NTFY-010004 | แถวที่ยังไม่อ่านมีจุดน้ำเงิน พื้นหลังเน้น และป้าย Unread | Medium | Functional |
| TC-NTFY-010005 | แต่ละแถวแสดง title / ข้อความย่อ / เวลาแบบ relative | Medium | Functional |
| TC-NTFY-010006 | สลับไปแท็บ Unread แล้วเหลือเฉพาะใบที่ยังไม่อ่าน | High | Functional |
| TC-NTFY-010007 | รายการ broadcast อยู่ใน section Broadcasts บนสุด | Medium | Functional |
| TC-NTFY-010008 | รายการ personal จัดกลุ่มตามหัวข้อ BU | Medium | Functional |
| TC-NTFY-010009 | ปุ่ม Load more โหลดหน้าถัดไปต่อท้ายรายการ | Medium | Functional |
| TC-NTFY-010010 | tile ไอคอนของแถวมาจาก doc_type และ fallback เป็นกระดิ่ง | Low | Functional |
| TC-NTFY-010011 | ป้าย bu_code แสดงข้างชื่อเรื่อง | Low | Functional |
| TC-NTFY-010012 | ตราคอมเมนต์แสดงเมื่อ event เป็น comment | Low | Functional |
| TC-NTFY-010013 | แถว broadcast เปลี่ยนสีและไอคอนตาม severity | Low | Functional |
| TC-NTFY-010014 | สถานะ loading แสดง skeleton ก่อนรายการมา | Low | Functional |
| TC-NTFY-010015 | กระดิ่งบน navbar เปิด popover รายการที่ยังไม่อ่าน | High | Smoke |
| TC-NTFY-010016 | badge บนกระดิ่งแสดงจำนวนที่ยังไม่อ่าน | Medium | Functional |
| TC-NTFY-010017 | ปุ่มเปิดหน้ารวมใน popover นำไป /notifications | Medium | Functional |
| TC-NTFY-020001 | คลิกแถวที่มี internal link นำไปหน้าเอกสารต้นทาง | High | Functional |
| TC-NTFY-020002 | คลิกแถวที่ไม่มีลิงก์เปิด NotificationDetailDialog | High | Functional |
| TC-NTFY-020003 | detail dialog แสดง title / วันที่ / ป้าย doc_type / ข้อความเต็ม | Medium | Functional |
| TC-NTFY-020005 | ปิด detail dialog ด้วยปุ่ม Close | Medium | Functional |
| TC-NTFY-020006 | detail dialog แสดง skeleton ระหว่างโหลดรายละเอียด | Low | Functional |
| TC-NTFY-020007 | ลิงก์ในข้อความถูกเรนเดอร์เป็นลิงก์ที่กดได้ | Low | Functional |
| TC-NTFY-020008 | คลิกรายการใน popover ที่มีลิงก์ ปิด popover แล้วนำทาง | Medium | Functional |
| TC-NTFY-040001 | ปุ่มติ๊กในรายการของ popover ทำเครื่องหมายอ่านแล้วรายใบ | Medium | Functional |
| TC-NTFY-040002 | ปุ่ม Clear ใน popover ทำเครื่องหมายอ่านแล้วทั้งหมด | Medium | Functional |
| TC-NTFY-040003 | ปุ่ม Mark all as read บนหน้า /notifications | High | Functional |
| TC-NTFY-040004 | โหมด Select เลือกหลายใบแล้วกด Mark as Read | High | Functional |
| TC-NTFY-040005 | โหมด Select เปิด checkbox เฉพาะแถวที่ยังไม่อ่าน | Medium | Functional |
| TC-NTFY-040006 | ปุ่ม Cancel ออกจากโหมด Select และล้างการเลือก | Medium | Functional |
| TC-NTFY-040007 | กดแถวที่ไม่มีลิงก์ ทำเครื่องหมายอ่านแล้วพร้อมเปิด dialog | Medium | Functional |
| TC-NTFY-040008 | กดแถวที่มีลิงก์ ทำเครื่องหมายอ่านแล้วก่อนนำทาง | Medium | Functional |
| TC-NTFY-090001 | empty state ของแท็บ All เมื่อไม่มีการแจ้งเตือน | Medium | Edge Case |
| TC-NTFY-090002 | แสดงข้อความ error เมื่อโหลดรายการล้มเหลว | Medium | Negative |
| TC-NTFY-090003 | empty state ของแท็บ Unread และปุ่มกลับไปแท็บ All | Medium | Edge Case |
| TC-NTFY-090004 | ไม่มี unread แล้วปุ่ม Select / Mark all as read ไม่แสดง | Medium | Edge Case |
| TC-NTFY-090005 | badge กระดิ่งแสดง 9+ เมื่อยังไม่อ่านเกินเก้าใบ | Low | Edge Case |
| TC-NTFY-090006 | popover แสดง empty state เมื่อไม่มีใบที่ยังไม่อ่าน | Medium | Edge Case |
| TC-NTFY-100001 | ผู้ใช้ไม่ login ถูก redirect ไป /login | High | Auth-guard |
| TC-NTFY-100002 | ทุก role ที่ล็อกอินเข้า /notifications ได้ | Medium | Authorization |
| TC-NTFY-100003 | ลิงก์ของทุกแถวเป็น internal path เท่านั้น | Medium | Security |

---
## TC-NTFY-010001 — หน้า Notifications โหลดและแสดง header ครบ
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น `admin@blueledgers.com` (active BU = `BLAVG`) — รันได้แม้ไม่มีการแจ้งเตือนเลย
**Steps**
1. ไปที่ `/notifications`
2. รอ skeleton หาย
**Expected**
URL ตรงกับ `/notifications`; แสดงหัวข้อระดับ 1 `Notifications` พร้อมไอคอนกระดิ่ง และแท็บสองตัวคือ `All` (ถูกเลือกอยู่) กับ `Unread`

---
## TC-NTFY-010003 — แท็บ Unread แสดง badge จำนวนที่ยังไม่อ่าน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านอย่างน้อย 1 ใบ; อยู่ที่ `/notifications` แท็บ `All`
**Steps**
1. ดูตัวเลขที่ต่อท้ายข้อความ `Unread` บนแท็บ
2. สลับไปแท็บ `Unread` แล้วนับจำนวนแถวที่แสดง
**Expected**
แท็บ `Unread` มี badge ตัวเลข > 0 (จัดรูปแบบด้วย `toLocaleString`) และตัวเลขนั้นตรงกับจำนวนใบที่ยังไม่อ่านทั้งหมด (ไม่ใช่แค่หน้าแรก) — ดูหมายเหตุข้อ 4 เมื่อ badge หายไปทั้งที่มี unread

---
## TC-NTFY-010004 — แถวที่ยังไม่อ่านมีจุดน้ำเงิน พื้นหลังเน้น และป้าย Unread
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ `is_read === false`; อยู่ที่ `/notifications` แท็บ `Unread`
**Steps**
1. ดูแถวแรกของรายการ
**Expected**
แถวแสดงจุดวงกลมสี primary ทางซ้ายสุด, การ์ดมีพื้นหลัง/ring เน้นต่างจากแถวที่อ่านแล้ว, ชื่อเรื่องเป็นตัวหนา และมีข้อความ `Unread` แบบ screen-reader-only อยู่ในแถว

---
## TC-NTFY-010005 — แต่ละแถวแสดง title / ข้อความย่อ / เวลาแบบ relative
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนอย่างน้อย 1 ใบ; อยู่ที่ `/notifications`
**Steps**
1. ดูเนื้อหาของแถวแรก
2. อ่าน attribute `title` ของข้อความเวลา
**Expected**
แถวแสดงชื่อเรื่อง (ตัดท้ายด้วย ellipsis เมื่อยาว), ข้อความไม่เกิน 2 บรรทัด และเวลาแบบ relative เช่น `3 days ago`; attribute `title` ของเวลาเป็นวันที่-เวลาเต็มรูป `DD MMM YYYY, HH:mm`

---
## TC-NTFY-010006 — สลับไปแท็บ Unread แล้วเหลือเฉพาะใบที่ยังไม่อ่าน
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีทั้งใบที่อ่านแล้วและยังไม่อ่านอยู่ในกล่อง; อยู่ที่ `/notifications` แท็บ `All`
**Steps**
1. กดแท็บ `Unread`
2. รอรายการโหลดใหม่
**Expected**
ทุกแถวที่เหลือมีจุด unread ครบทุกแถว (ไม่มีแถวที่อ่านแล้วปน) และจำนวนแถวน้อยกว่าหรือเท่ากับตอนอยู่แท็บ `All`; กดแท็บ `All` กลับแล้วรายการเดิมกลับมา

---
## TC-NTFY-010007 — รายการ broadcast อยู่ใน section Broadcasts บนสุด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ `source === "broadcast"` อย่างน้อย 1 ใบ (ประกาศจากผู้ดูแลระบบ — seed ผ่าน UI ของโมดูลนี้ไม่ได้); อยู่ที่ `/notifications`
**Steps**
1. ดูหัวข้อ section แรกของรายการ
**Expected**
section แรกมีหัวข้อ `Broadcasts` และบรรจุเฉพาะใบ broadcast; section ของรายการ personal อยู่ถัดลงไปเสมอ

---
## TC-NTFY-010008 — รายการ personal จัดกลุ่มตามหัวข้อ BU
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือน personal ที่ `metadata.bu` มีค่า และ/หรือใบที่ไม่มีค่านั้น; อยู่ที่ `/notifications`
**Steps**
1. ไล่ดูหัวข้อ section ทั้งหมดใต้ `Broadcasts`
**Expected**
แต่ละ section มีหัวข้อเป็นชื่อ BU จาก `metadata.bu`; ใบที่ไม่มี `metadata.bu` รวมอยู่ใต้หัวข้อ `Personal`; ไม่มีใบ personal ใบใดหลุดออกนอก section

---
## TC-NTFY-010009 — ปุ่ม Load more โหลดหน้าถัดไปต่อท้ายรายการ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
บัญชีมีการแจ้งเตือนมากกว่า 20 ใบ (`PAGE_SIZE = 20`); อยู่ที่ `/notifications` แท็บ `All`
**Steps**
1. เลื่อนลงท้ายรายการ
2. กดปุ่ม `Load more`
3. รอปุ่มกลับมากดได้อีกครั้ง
**Expected**
ก่อนกดมีปุ่ม `Load more`; หลังกดจำนวนแถวเพิ่มขึ้นโดยแถวเดิมยังอยู่ที่เดิม; ระหว่างโหลดปุ่มถูก disable; เมื่อไม่มีหน้าถัดไปแล้วปุ่มหายไป

---
## TC-NTFY-010010 — tile ไอคอนของแถวมาจาก doc_type และ fallback เป็นกระดิ่ง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนอย่างน้อย 1 ใบ; อยู่ที่ `/notifications`
**Steps**
1. ดูไอคอนนำหน้าของแต่ละแถว
**Expected**
แถวที่ `doc_type` เป็นเอกสาร 5 ชนิด (purchase_request / purchase_order / good_received_note / credit_note / store_requisition) แสดง tile ของโมดูลนั้น; แถวที่ `doc_type` เป็น `system` / `business_unit` หรือไม่มีค่า แสดงไอคอนกระดิ่งบนพื้น primary แทน

---
## TC-NTFY-010011 — ป้าย bu_code แสดงข้างชื่อเรื่อง
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ `metadata.bu_code` มีค่า; อยู่ที่ `/notifications`
**Steps**
1. ดูข้างชื่อเรื่องของแถวนั้น
**Expected**
มีป้ายเล็กตัวพิมพ์ใหญ่แสดงค่าจาก `metadata.bu_code`; แถวที่ไม่มีคีย์นี้ไม่มีป้าย (ดูหมายเหตุข้อ 6 — คนละคีย์กับหัวข้อ section)

---
## TC-NTFY-010012 — ตราคอมเมนต์แสดงเมื่อ event เป็น comment
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ `event === "comment"` (เกิดจากมีคนคอมเมนต์ในเอกสาร); อยู่ที่ `/notifications`
**Steps**
1. ดูมุมล่างขวาของ tile ไอคอนในแถวนั้น
**Expected**
มีตราเล็กรูปกล่องข้อความซ้อนอยู่ พร้อมข้อความ screen-reader-only `Comment`; แถวที่ `event` เป็นค่าอื่นไม่มีตรานี้

---
## TC-NTFY-010013 — แถว broadcast เปลี่ยนสีและไอคอนตาม severity
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มี broadcast ที่ `metadata.severity` เป็นค่าใดค่าหนึ่งใน INFO / WARNING / CRITICAL / MAINTENANCE; อยู่ที่ `/notifications`
**Steps**
1. ดูพื้นหลังการ์ดและไอคอนนำหน้าของแถว broadcast
**Expected**
พื้นหลัง/ring ของการ์ดเป็นโทนตาม severity (info / warning / destructive / muted) และไอคอน fallback เปลี่ยนตามไปด้วย (Info / AlertTriangle / AlertCircle / Wrench); ค่าที่ไม่ตรงชุดนี้ตกไปที่ INFO

---
## TC-NTFY-010014 — สถานะ loading แสดง skeleton ก่อนรายการมา
**Priority:** Low · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว; หน่วง response ของ `GET /api/notifications` ผ่าน route interception
**Steps**
1. ไปที่ `/notifications`
2. ดูพื้นที่รายการก่อน response กลับมา
**Expected**
แสดงการ์ด skeleton หลายแถวแทนรายการ; เมื่อ response กลับมา skeleton หายและรายการ (หรือ empty state) เข้าแทนที่

---
## TC-NTFY-010015 — กระดิ่งบน navbar เปิด popover รายการที่ยังไม่อ่าน
**Priority:** High · **Test Type:** Smoke
**Preconditions**
ล็อกอินเป็น `admin@blueledgers.com`; อยู่หน้าใดก็ได้ที่มี navbar (เช่น `/dashboard`)
**Steps**
1. กดปุ่มกระดิ่งบน navbar
2. รอ popover เปิด
**Expected**
popover เปิดพร้อมหัวข้อ `Notifications`, ปุ่มเปิดหน้ารวม และรายการที่ยังไม่อ่านไม่เกิน 10 แถว (หรือ empty state เมื่อไม่มี)

---
## TC-NTFY-010016 — badge บนกระดิ่งแสดงจำนวนที่ยังไม่อ่าน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่าน 1–9 ใบ; อยู่หน้าที่มี navbar
**Steps**
1. ดู badge มุมขวาบนของปุ่มกระดิ่ง
2. เปิด popover แล้วดูตัวเลขข้างหัวข้อ `Notifications`
**Expected**
badge บนกระดิ่งแสดงตัวเลขจำนวนที่ยังไม่อ่าน และตัวเลขข้างหัวข้อใน popover เป็นค่าเดียวกัน; เมื่อจำนวนเป็น 0 badge ไม่แสดงเลย

---
## TC-NTFY-010017 — ปุ่มเปิดหน้ารวมใน popover นำไป /notifications
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
ล็อกอินแล้ว; อยู่หน้าที่มี navbar และไม่ใช่ `/notifications` — รันได้แม้ไม่มีการแจ้งเตือนเลย
**Steps**
1. เปิด popover กระดิ่ง
2. กดปุ่มที่มี aria-label `View all notifications`
**Expected**
นำทางไป `/notifications` และ popover ปิดลง

---
## TC-NTFY-020001 — คลิกแถวที่มี internal link นำไปหน้าเอกสารต้นทาง
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ `doc_type` เป็นเอกสารและ `metadata.id` (หรือคีย์เก่า `pr_id`/`po_id`/`sr_id`/`grn_id`/`cn_id`) มีค่า; อยู่ที่ `/notifications`
**Steps**
1. คลิกแถวที่เป็นลิงก์
**Expected**
นำทางไป `/<เส้นทางของ doc_type>/<id>` เช่น `/procurement/purchase-request/<uuid>` และหน้าเอกสารนั้นโหลดขึ้นมา — หมายเหตุ: การคลิกนี้ทำเครื่องหมายอ่านแล้วไปด้วย (ดูหมายเหตุข้อ 2)

---
## TC-NTFY-020002 — คลิกแถวที่ไม่มีลิงก์เปิด NotificationDetailDialog
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ resolve เป็น internal path ไม่ได้ (เช่น `doc_type` เป็น `system` / `business_unit` หรือ metadata ไม่มี id); อยู่ที่ `/notifications`
**Steps**
1. คลิกแถวนั้น
**Expected**
URL ไม่เปลี่ยน และเปิด dialog (`role="dialog"`) ของการแจ้งเตือนใบที่เลือก — การคลิกนี้ทำเครื่องหมายอ่านแล้วไปด้วย

---
## TC-NTFY-020003 — detail dialog แสดง title / วันที่ / ป้าย doc_type / ข้อความเต็ม
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด NotificationDetailDialog ของใบหนึ่งแล้ว
**Steps**
1. ดูส่วนหัวของ dialog
2. ดูเนื้อหาในตัว dialog
**Expected**
ส่วนหัวแสดงชื่อเรื่องเป็น dialog title, วันที่สร้างแบบ `dateStyle: "medium"` (ไม่มีเวลา) และเมื่อใบนั้นมี `doc_type` จะมีป้ายตัวพิมพ์ใหญ่ต่อท้ายคั่นด้วยจุด เช่น `PURCHASE REQUEST` / `SYSTEM`; ตัว dialog แสดงข้อความเต็มโดยคงการขึ้นบรรทัดเดิมไว้

---
## TC-NTFY-020005 — ปิด detail dialog ด้วยปุ่ม Close
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
เปิด NotificationDetailDialog ของใบหนึ่งแล้ว
**Steps**
1. ดูปุ่มใน footer ของ dialog
2. กดปุ่ม `Close`
**Expected**
footer มีปุ่มเดียวคือ `Close` (ไม่มีปุ่มกากบาทมุมขวาบน และไม่มีปุ่มเปิดลิงก์ภายนอก); กดแล้ว dialog ปิดและกลับมาเห็นรายการเดิม; กด Escape ได้ผลเดียวกัน

---
## TC-NTFY-020006 — detail dialog แสดง skeleton ระหว่างโหลดรายละเอียด
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่เปิด dialog ได้; หน่วง response ของ `GET /api/notifications/:id` ผ่าน route interception
**Steps**
1. คลิกแถวเพื่อเปิด dialog
2. ดูส่วนหัวและตัว dialog ก่อน response กลับมา
**Expected**
ตำแหน่งชื่อเรื่องและข้อความแสดงเป็น skeleton; เมื่อ response กลับมา skeleton ถูกแทนที่ด้วยเนื้อหาจริง; ถ้า response ล้มเหลวจะแสดงกล่อง error พร้อมข้อความแทนที่ตัวเนื้อหา

---
## TC-NTFY-020007 — ลิงก์ในข้อความถูกเรนเดอร์เป็นลิงก์ที่กดได้
**Priority:** Low · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ `message` มีลิงก์รูป `[ข้อความ](/path)` (backend เป็นผู้ประกอบข้อความนี้); เปิด detail dialog ของใบนั้น
**Steps**
1. ดูข้อความใน dialog
2. กดที่ลิงก์
**Expected**
ส่วนที่เป็นลิงก์ถูกเรนเดอร์เป็น `<a>` มีเส้นใต้สี primary ส่วนข้อความรอบ ๆ ยังเป็นข้อความธรรมดา; กดแล้วนำทางไป path นั้น; หาก URL ในวงเล็บไม่ผ่านการตรวจความปลอดภัยจะเหลือเป็นข้อความเปล่า ๆ ไม่ใช่ลิงก์

---
## TC-NTFY-020008 — คลิกรายการใน popover ที่มีลิงก์ ปิด popover แล้วนำทาง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านและ resolve เป็นเอกสารได้; อยู่หน้าที่มี navbar
**Steps**
1. เปิด popover กระดิ่ง
2. คลิกรายการนั้น
**Expected**
popover ปิดลง, นำทางไปหน้าเอกสารต้นทาง และรายการนั้นถูกทำเครื่องหมายอ่านแล้ว (หายจาก popover เมื่อเปิดซ้ำ)

---
## TC-NTFY-040001 — ปุ่มติ๊กในรายการของ popover ทำเครื่องหมายอ่านแล้วรายใบ
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านอย่างน้อย 1 ใบ; อยู่หน้าที่มี navbar — **เคสนี้เปลี่ยนสถานะถาวร (หมายเหตุข้อ 2)**
**Steps**
1. เปิด popover กระดิ่ง
2. hover รายการแรกจนปุ่มติ๊ก (aria-label `Dismiss`) ปรากฏ
3. กดปุ่มติ๊ก
**Expected**
รายการหายจาก popover ทันที, badge บนกระดิ่งลดลง 1, popover ยังเปิดอยู่ (ไม่นำทางไปไหน); รีโหลดหน้าแล้วรายการยังไม่กลับมาและตัวเลขยังเท่าเดิม

---
## TC-NTFY-040002 — ปุ่ม Clear ใน popover ทำเครื่องหมายอ่านแล้วทั้งหมด
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านอย่างน้อย 1 ใบ; อยู่หน้าที่มี navbar — **เคสนี้ล้างกล่อง unread ทั้งกล่อง รันท้ายชุดเสมอ**
**Steps**
1. เปิด popover กระดิ่ง
2. กดปุ่ม `Clear` ที่หัว popover
**Expected**
รายการใน popover ว่างและขึ้น empty state, badge บนกระดิ่งหายไป, ปุ่ม `Clear` หายไปด้วย; รีโหลดหน้าแล้วสถานะยังเป็นแบบเดิม

---
## TC-NTFY-040003 — ปุ่ม Mark all as read บนหน้า /notifications
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านอย่างน้อย 1 ใบ; อยู่ที่ `/notifications` — **เคสนี้ล้างกล่อง unread ทั้งกล่อง**
**Steps**
1. กดปุ่ม `Mark all as read` มุมขวาของ header
2. รอปุ่มกลับมากดได้
**Expected**
ระหว่างส่งคำขอปุ่มถูก disable; เสร็จแล้ว badge บนแท็บ `Unread` หายไป, แท็บ `Unread` ขึ้น empty state และจุด unread บนทุกแถวของแท็บ `All` หายหมด; รีโหลดแล้วยังคงสถานะเดิม

---
## TC-NTFY-040004 — โหมด Select เลือกหลายใบแล้วกด Mark as Read
**Priority:** High · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านอย่างน้อย 2 ใบ; อยู่ที่ `/notifications` — **เคสนี้เปลี่ยนสถานะถาวรของใบที่เลือก**
**Steps**
1. กดปุ่ม `Select` (ปุ่มเปลี่ยนเป็น `Cancel`)
2. กดแถวที่ยังไม่อ่านสองแถว
3. กดปุ่ม `Mark as Read` บนแถบลอยด้านล่าง
**Expected**
เมื่อเลือกแล้วมีแถบลอยกลางล่างจอเขียนว่า `2 Selected`; หลังกดปุ่ม แถบลอยหายไป, ออกจากโหมด Select เอง (ปุ่มกลับเป็น `Select`), สองแถวนั้นเปลี่ยนเป็นอ่านแล้ว และจำนวนบนแท็บ `Unread` ลดลง 2

---
## TC-NTFY-040005 — โหมด Select เปิด checkbox เฉพาะแถวที่ยังไม่อ่าน
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีทั้งใบที่อ่านแล้วและยังไม่อ่านอยู่ในแท็บ `All`; อยู่ที่ `/notifications`
**Steps**
1. กดปุ่ม `Select`
2. เทียบแถวที่ยังไม่อ่านกับแถวที่อ่านแล้ว
**Expected**
เฉพาะแถวที่ยังไม่อ่านมี checkbox และกดเพื่อเลือกได้; แถวที่อ่านแล้วยังทำงานแบบเดิม (เป็นลิงก์ไปเอกสารหรือเปิด dialog) ไม่มี checkbox และกดแล้วไม่ถูกเลือก

---
## TC-NTFY-040006 — ปุ่ม Cancel ออกจากโหมด Select และล้างการเลือก
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีการแจ้งเตือนที่ยังไม่อ่านอย่างน้อย 2 ใบ; อยู่ที่ `/notifications`
**Steps**
1. กดปุ่ม `Select`
2. เลือกสองแถว
3. กดปุ่ม `Cancel`
4. กดปุ่ม `Select` อีกครั้ง
**Expected**
หลังกด `Cancel` แถบลอยหายไป, checkbox หายจากทุกแถว, ปุ่ม `Mark all as read` กลับมาแสดง และไม่มีใบใดถูกทำเครื่องหมายอ่านแล้ว; เข้าโหมด Select ใหม่แล้วไม่มีแถวใดถูกเลือกค้างไว้

---
## TC-NTFY-040007 — กดแถวที่ไม่มีลิงก์ ทำเครื่องหมายอ่านแล้วพร้อมเปิด dialog
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีใบที่ยังไม่อ่านและ resolve เป็นเอกสารไม่ได้; อยู่ที่ `/notifications` — **เคสนี้กินใบ unread ไปหนึ่งใบ**
**Steps**
1. คลิกแถวนั้น
2. ปิด dialog ด้วยปุ่ม `Close`
**Expected**
dialog เปิดขึ้น และเมื่อปิดแล้วแถวนั้นไม่มีจุด unread อีกต่อไป, จำนวนบนแท็บ `Unread` ลดลง 1; รีโหลดแล้วยังเป็นอ่านแล้ว

---
## TC-NTFY-040008 — กดแถวที่มีลิงก์ ทำเครื่องหมายอ่านแล้วก่อนนำทาง
**Priority:** Medium · **Test Type:** Functional
**Preconditions**
มีใบที่ยังไม่อ่านและ resolve เป็นเอกสารได้; อยู่ที่ `/notifications` — **เคสนี้กินใบ unread ไปหนึ่งใบ**
**Steps**
1. คลิกแถวนั้น
2. กดปุ่มย้อนกลับของเบราว์เซอร์กลับมา `/notifications`
**Expected**
หลังกลับมา แถวนั้นไม่มีจุด unread แล้วและจำนวนบนแท็บ `Unread` ลดลง 1

---
## TC-NTFY-090001 — empty state ของแท็บ All เมื่อไม่มีการแจ้งเตือน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
บัญชีที่ไม่มีการแจ้งเตือนเลย (หรือ stub `GET /api/notifications` ให้คืน `data: []`); อยู่ที่ `/notifications` แท็บ `All`
**Steps**
1. รอ skeleton หาย
**Expected**
แสดง empty state ไอคอนกระดิ่งขีดฆ่า พร้อมข้อความ `No Notifications Yet` และคำอธิบาย `You don't have any notifications yet.`; ไม่มี section `Broadcasts` และไม่มีปุ่ม `Load more`

---
## TC-NTFY-090002 — แสดงข้อความ error เมื่อโหลดรายการล้มเหลว
**Priority:** Medium · **Test Type:** Negative
**Preconditions**
stub `GET /api/notifications` ให้คืนสถานะผิดพลาด (เช่น 500); ล็อกอินแล้ว
**Steps**
1. ไปที่ `/notifications`
2. รอการโหลดล้มเหลว
**Expected**
แสดงข้อความ error สีแดงเหนือพื้นที่รายการ, header กับแท็บยังอยู่ครบ และหน้าไม่ crash (ไม่ตกไปที่ error boundary)

---
## TC-NTFY-090003 — empty state ของแท็บ Unread และปุ่มกลับไปแท็บ All
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ไม่มีใบที่ยังไม่อ่าน (เช่น รันหลัง TC-NTFY-040003 หรือ stub `GET /api/notifications/unread` ให้คืน `data: []`); อยู่ที่ `/notifications`
**Steps**
1. กดแท็บ `Unread`
2. กดปุ่ม `View All Notifications` ใน empty state
**Expected**
แท็บ `Unread` แสดง `You're all caught up` พร้อมคำอธิบาย `You have no unread notifications.` และปุ่ม `View All Notifications`; กดปุ่มแล้วสลับกลับไปแท็บ `All` โดยไม่เปลี่ยน URL

---
## TC-NTFY-090004 — ไม่มี unread แล้วปุ่ม Select / Mark all as read ไม่แสดง
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ไม่มีใบที่ยังไม่อ่าน; อยู่ที่ `/notifications` และ **สลับไปแท็บ `Unread`** (ดูหมายเหตุข้อ 4 — บนแท็บ `All` ปุ่มอาจยังแสดงเมื่อ backend ไม่ส่ง summary)
**Steps**
1. กดแท็บ `Unread`
2. ดูมุมขวาของ header
**Expected**
ไม่มีปุ่ม `Select` และไม่มีปุ่ม `Mark all as read` ใน header; หัวข้อและแท็บยังแสดงตามปกติ

---
## TC-NTFY-090005 — badge กระดิ่งแสดง 9+ เมื่อยังไม่อ่านเกินเก้าใบ
**Priority:** Low · **Test Type:** Edge Case
**Preconditions**
มีใบที่ยังไม่อ่านมากกว่า 9 ใบ (หรือ stub `GET /api/notifications/unread` ให้ `paginate.total` > 9); อยู่หน้าที่มี navbar
**Steps**
1. ดู badge บนปุ่มกระดิ่ง
2. เปิด popover แล้วดูตัวเลขข้างหัวข้อ
**Expected**
badge บนกระดิ่งแสดงข้อความ `9+` (ไม่ใช่ตัวเลขจริง) ขณะที่ตัวเลขข้างหัวข้อใน popover ยังแสดงจำนวนเต็มจริง และ popover ยังแสดงรายการไม่เกิน 10 แถว

---
## TC-NTFY-090006 — popover แสดง empty state เมื่อไม่มีใบที่ยังไม่อ่าน
**Priority:** Medium · **Test Type:** Edge Case
**Preconditions**
ไม่มีใบที่ยังไม่อ่าน; อยู่หน้าที่มี navbar
**Steps**
1. เปิด popover กระดิ่ง
**Expected**
popover แสดง empty state ไอคอนกระดิ่งขีดฆ่า พร้อม `No Notifications Yet`; ไม่มี badge บนกระดิ่ง, ไม่มีปุ่ม `Clear` ที่หัว popover แต่ปุ่มเปิดหน้ารวมยังอยู่

---
## TC-NTFY-100001 — ผู้ใช้ไม่ login ถูก redirect ไป /login
**Priority:** High · **Test Type:** Auth-guard
**Preconditions**
ไม่มี session (browser context สะอาด ไม่ใช้ storageState)
**Steps**
1. เปิด `/notifications` ตรง ๆ โดยไม่ login
**Expected**
ถูก redirect ไป `/login` (แบบ replace) และฟอร์ม login แสดง; ไม่มีเนื้อหาของหน้า notifications ปรากฏระหว่างทาง

---
## TC-NTFY-100002 — ทุก role ที่ล็อกอินเข้า /notifications ได้
**Priority:** Medium · **Test Type:** Authorization
**Preconditions**
ล็อกอินด้วยแต่ละบัญชีใน `tests/test-users.ts` (Requestor / HOD / Purchase / FC / GM / Owner / StoreManager / Budget / Admin) — รันได้แม้บัญชีนั้นไม่มีการแจ้งเตือนเลย
**Steps**
1. ไปที่ `/notifications`
2. รอ skeleton หาย
**Expected**
ทุก role เห็นหัวข้อ `Notifications` และแท็บ `All` / `Unread`; ไม่มีหน้าจอ access denied และไม่ถูกเด้งไป landing page (หน้านี้ไม่มี permission gate — หมายเหตุข้อ 12) เนื้อหาที่เห็นอาจต่างกันตามสิทธิ์ฝั่ง backend

---
## TC-NTFY-100003 — ลิงก์ของทุกแถวเป็น internal path เท่านั้น
**Priority:** Medium · **Test Type:** Security
**Preconditions**
มีการแจ้งเตือนอย่างน้อย 1 ใบที่แสดงเป็นลิงก์; อยู่ที่ `/notifications`
**Steps**
1. อ่านค่า `href` ของทุกแถวที่เป็น `<a>`
**Expected**
ทุกค่าขึ้นต้นด้วย `/` เดียว (ไม่ใช่ `//`), ไม่มี scheme นำหน้า (`http:` / `javascript:` ฯลฯ) และไม่มี backslash — แถวที่ resolve เป็น path ปลอดภัยไม่ได้จะเป็น `<button>` เปิด dialog แทน ไม่ใช่ลิงก์เสีย
