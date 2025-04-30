import { createApp } from "vue";
import { GraffitiLocal } from "@graffiti-garden/implementation-local";
import { GraffitiRemote } from "@graffiti-garden/implementation-remote";
import { GraffitiPlugin } from "@graffiti-garden/wrapper-vue";
import { defineAsyncComponent } from "vue";
import { Navbar } from "./navbar.js";

createApp({
	components: { Navbar: defineAsyncComponent(Navbar)},

  	data() {
		return {
			myMessage: "",
			sending: false,
			groupName: "",
			currentGroupChannel: undefined,
		};
  	},

	methods: {
		async sendMessage(session) {
	  		if (!this.myMessage) return;

			const loading = document.getElementById("send-message-loading");
			loading.style.display = "";

	  		this.sending = true;

			await this.$graffiti.put(
				{
					value: {
						content: this.myMessage,
						published: Date.now(),
					},
					channels: this.currentGroupChannel,
				},
				session,
			);

	  		this.sending = false;
	  		this.myMessage = "";

			// Refocus the input field after sending the message
			await this.$nextTick();
			this.$refs.messageInput.focus();

			loading.style.display = "none";
		},

		async createGroupChat(session, user) {
			if (!this.groupName) {
				return;
			}

			const loading = document.getElementById("create-dm-loading");
			loading.style.opacity = 1;

			let newChannel = undefined;
			let newName = undefined;
			if (user < this.groupName) {
				newChannel = user + "-" + this.groupName;
				newName = user + " & " + this.groupName;
			} else {
				newChannel = this.groupName + "-" + user;
				newName = this.groupName + " & " + user;
			}

			await this.$graffiti.put(
				{
					value: {
						activity: 'Create',
						object: {
							type: 'Group Chat',
							name: newName,
							channel: newChannel,
						}
					},
					channels: [user, this.groupName],
				},
				session,
			);

			loading.style.opacity = 0;
			this.groupName = "";
		},

		setCurrentGroupChannel(channel) {
			this.currentGroupChannel = [channel];
		},

		async deleteMessage(session, url) {
			await this.$graffiti.delete(url, session);
		},

		async editMessage(session, url) {
			const newMessage = prompt("Edit Message:");
			if (newMessage === null) {
				return;
			}

			await this.$graffiti.patch(
				{"value": [{"op": "replace", "path": "/content", "value": newMessage}]},
				url,
				session,
			);
		},

		async renameGroupChat(session, url) {
			const newName = prompt("New Group Chat Name:");
			if (newName === null) {
				return;
			}

			await this.$graffiti.patch(
				{"value": [{"op": "replace", "path": "/object/name", "value": newName}]},
				url,
				session,
			);
		},

		async deleteGroupChat(session, url) {
			await this.$graffiti.delete(url, session);
		},

		goBackHome() {
			this.currentGroupChannel = undefined;
		}
  	},
})
.use(GraffitiPlugin, {
	graffiti: new GraffitiLocal(),
	// graffiti: new GraffitiRemote(),
})
.mount("#app");
