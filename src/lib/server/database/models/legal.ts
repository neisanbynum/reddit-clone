import { LegalNoticeSchema, type LegalNoticeTypeSchema } from '$remote/legal.schema';
import { type Data, Model } from '@neisanworks/neisan-mongo';
import z from 'zod/v4'

export class LegalNoticeModel extends Model<LegalNoticeSchema> {
	type!: z.infer<LegalNoticeTypeSchema>
	effective!: Date;
	revision!: Date;
	body!: string;

	constructor(data: Data) {
		super(LegalNoticeSchema);
		this.hydrate(data);
	}
}
