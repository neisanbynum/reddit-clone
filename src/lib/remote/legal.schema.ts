import { NewDateSchema } from '$remote/shared.schema';
import z from 'zod/v4';

export const LegalNoticeTypeSchema = z.literal(['privacy-policy', 'user-agreement'])
export type LegalNoticeTypeSchema = typeof LegalNoticeTypeSchema

export const LegalNoticeSchema = z.object({
    type: LegalNoticeTypeSchema.or(z.literal('')),
    effective: NewDateSchema({ message: 'Invalid Legal Notice Effective Date' }),
    revision: NewDateSchema({ message: 'Invalid Legal Notice Revision Date' }),
    body: z.string('Invalid Legal Notice Body Text')
});
export type LegalNoticeSchema = typeof LegalNoticeSchema;

export const GetLegalNoticeFormSchema = LegalNoticeSchema.pick({ type: true, effective: true })
