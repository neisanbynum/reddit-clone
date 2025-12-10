import { command, query } from '$app/server';
import { GetLegalNoticeFormSchema, LegalNoticeSchema } from '$remote/legal.schema';
import { LegalNotices } from '@/server/database';
import { error } from '@sveltejs/kit';

export const getLegalNoticeDates = query(GetLegalNoticeFormSchema, async ({ type, effective }) => {
	const policies = LegalNotices.find((notice) => notice.type === type && notice.effective <= effective).sort({ effective: -1 })

	const dates: Array<Date> = [];
	for await (const policy of policies) {
		dates.push(policy.effective);
	}
	return dates;
})

export const getLegalNotice = query(GetLegalNoticeFormSchema, async ({ type, effective }) => {
	const notice = await LegalNotices.findOne({ type, effective })
	if (!notice) {
		error(404, "No Legal Notice Found")
	}

	return notice.toJSON()
})

export const setLegalNotice = command(LegalNoticeSchema, async ({ type, effective, ...rest }) => {
	const notice = await LegalNotices.findOne({ type, effective })
	if (notice) {
		const update = await LegalNotices.updateOne(notice._id, (notice) => {
			Object.assign(notice, rest)
			notice.revision = new Date()
		})
		if (!update.acknowledged) {
			error(500, Object.values(update.errors).at(0) ?? "Failed to Update Legal Notice")
		}

		return { message: "Updated Legal Notice" }
	}

	const insert = await LegalNotices.insert({ type, effective, ...rest })
	if (!insert.acknowledged) {
		error(500, Object.values(insert.errors).at(0) ?? "Failed to Update Legal Notice")
	}

	return { message: "Created Legal Notice" }
})
