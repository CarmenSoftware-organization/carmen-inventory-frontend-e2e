import type { Page } from "@playwright/test";
import * as docs from "../movement/docs";
import { BU } from "./context";
import { L, SCN } from "./scenarios";

/**
 * The movement document helpers with the scenario's defaults filled in
 * (BU, location L, CN reason) — same call shapes the period-close phases were
 * written against.
 */
export type { CreatedDoc, Line, AdjustmentType } from "../movement/docs";
export const adjustmentUrl = docs.adjustmentUrl;

type Opt<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type GrnOpts = Parameters<typeof docs.createGrn>[1];
type AdjOpts = Parameters<typeof docs.createAdjustment>[1];
type CnOpts = Parameters<typeof docs.createCreditNote>[1];

export const createGrn = (page: Page, opts: Opt<GrnOpts, "bu" | "location">) =>
  docs.createGrn(page, { ...opts, bu: opts.bu ?? BU, location: opts.location ?? L.code });
export const commitGrn = (page: Page, id: string, bu: string = BU) => docs.commitGrn(page, id, bu);
export const grnById = (id: string, bu: string = BU) => docs.grnById(id, bu);
export const voidGrn = (page: Page, id: string, reason: string, bu: string = BU) => docs.voidGrn(page, id, reason, bu);
export const tryVoidGrn = (page: Page, id: string, reason: string, bu: string = BU) => docs.tryVoidGrn(page, id, reason, bu);
export const deleteGrnDraft = (page: Page, id: string, bu: string = BU) => docs.deleteGrnDraft(page, id, bu);

export const createAdjustment = (page: Page, opts: Opt<AdjOpts, "bu" | "location">) =>
  docs.createAdjustment(page, { ...opts, bu: opts.bu ?? BU, location: opts.location ?? L.code });
export const adjustmentById = (type: docs.AdjustmentType, id: string, bu: string = BU) => docs.adjustmentById(type, id, bu);
export const voidAdjustment = (page: Page, type: docs.AdjustmentType, id: string, reason: string, bu: string = BU) =>
  docs.voidAdjustment(page, type, id, reason, bu);
export const deleteAdjustment = (page: Page, type: docs.AdjustmentType, id: string, bu: string = BU) =>
  docs.deleteAdjustment(page, type, id, bu);

export const createCreditNote = (page: Page, opts: Opt<CnOpts, "bu" | "reason">) =>
  docs.createCreditNote(page, { ...opts, bu: opts.bu ?? BU, reason: opts.reason ?? SCN.cnReason });
export const cnById = (id: string, bu: string = BU) => docs.cnById(id, bu);
export const submitCreditNote = (page: Page, id: string, bu: string = BU) => docs.submitCreditNote(page, id, bu);
export const deleteCreditNoteDraft = (page: Page, id: string, bu: string = BU) => docs.deleteCreditNoteDraft(page, id, bu);
