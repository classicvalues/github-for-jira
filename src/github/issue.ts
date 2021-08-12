import { CustomContext } from "./middleware";
import JiraClient from "../backend/models/jira-client";

export default async (context: CustomContext, _: JiraClient, util) => {
	const { issue } = context.payload;

	const linkifiedBody = await util.unfurl(issue.body);
	if (!linkifiedBody) {
		context.log({ noop: "no_linkified_body_issue" }, "Halting further execution for issue since linkifiedBody is empty");
		return;
	}

	const editedIssue = context.issue({
		body: linkifiedBody,
		id: issue.id
	});

	await context.github.issues.update(editedIssue);
};
