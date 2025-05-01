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
            sending: false,
            userId: null,
            inputName: "",
            inputPic: "",
            inputPronouns: "",
            inputBio: "",
        };
    },

    mounted() {
        const params = new URLSearchParams(window.location.search);
        this.userId = params.get('id');
    },

    methods: {
        async createProfile(session, user) {
            const loading = document.getElementById("send-message-loading");
			loading.style.display = "";

            await this.$graffiti.put(
				{
					value: {
						object: {
							name: this.inputName,
                            pic: this.inputPic,
                            pronouns: this.inputPronouns,
                            bio: this.inputBio,
						}
					},
					channels: [user],
				},
				session,
			);

            loading.style.display = "none";
        },

        async renameName(session, url) {
            const newName = prompt("Edit Name:");
			if (newName === null) {
				return;
			}

			await this.$graffiti.patch(
				{"value": [{"op": "replace", "path": "/object/name", "value": newName}]},
				url,
				session,
			);
        },

        async renamePic(session, url) {
            const newName = prompt("Edit Pic:");
			if (newName === null) {
				return;
			}

			await this.$graffiti.patch(
				{"value": [{"op": "replace", "path": "/object/pic", "value": newName}]},
				url,
				session,
			);
        },

        async renamePronouns(session, url) {
            const newName = prompt("Edit Pronouns:");
			if (newName === null) {
				return;
			}

			await this.$graffiti.patch(
				{"value": [{"op": "replace", "path": "/object/pronouns", "value": newName}]},
				url,
				session,
			);
        },

        async renameBio(session, url) {
            const newName = prompt("Edit Bio:");
			if (newName === null) {
				return;
			}

			await this.$graffiti.patch(
				{"value": [{"op": "replace", "path": "/object/bio", "value": newName}]},
				url,
				session,
			);
        }
    },
})
.use(GraffitiPlugin, {
	graffiti: new GraffitiLocal(),
	// graffiti: new GraffitiRemote(),
})
.mount("#app");