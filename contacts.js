const fs = require("fs");
const path = require("path");
const contactsPath = path.join(
	__dirname,
	"./db/contacts.json"
);

async function listContacts() {
	try {
		return await fs.promises.readFile(
			contactsPath,
			"utf-8"
		);
	} catch (error) {
		return error;
	}
}

async function getContactById(
	contactId
) {
	try {
		const contacts = await listContacts();

		return JSON.parse(contacts).find(
			(item) => {
				return item.id === contactId;
			}
		);
	} catch (error) {}
}

async function removeContact(
	contactId
) {
	try {
		const contacts = await listContacts();
		const deleteContact = JSON.parse(
			contacts
		).filter((item) => {
			return item.id !== contactId;
		});

		await fs.promises.writeFile(
			contactsPath,
			JSON.stringify(deleteContact)
		);
		return { status: "success" };
	} catch (error) {
		return error;
	}
}

async function addContact(
	name,
	email,
	phone
) {
	try {
		const contacts = await listContacts();
		const hasEmail = uniqueEmail(
			email,
			contacts
		);
		console.log(hasEmail);
		if (hasEmail) {
			return {
				status: 418,
				user: "created",
			};
		}

		const obj = {
			name,
			email,
			phone,
			id: Date.now(),
		};
		const newContacts = [
			...JSON.parse(contacts),
		];
		newContacts.push(obj);

		await fs.promises.writeFile(
			contactsPath,
			JSON.stringify(newContacts)
		);
		return { status: 201, obj };
	} catch (error) {
		return error;
	}
}

function uniqueEmail(email, contacts) {
	return JSON.parse(contacts).some(
		(item) => item.email === email
	);
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
};
