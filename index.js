const fn = require("./contacts");
const yargs = require("yargs");

function invokeAction({
	action,
	id,
	name,
	email,
	phone,
}) {
	switch (action) {
		case "list":
			fn.listContacts().then((res) =>
				console.table(res)
			);

			break;

		case "get":
			fn.getContactById(
				id
			).then((res) => console.log(res));

			break;

		case "add":
			fn.addContact(
				name,
				email,
				phone
			).then((res) => console.log(res));

			// ... name email phone
			break;

		case "remove":
			fn.removeContact(id).then((res) =>
				console.log(res)
			);

			// ... id
			break;

		default:
			console.warn(
				"\x1B[31m Unknown action type!"
			);
	}
}

invokeAction(yargs.argv);
