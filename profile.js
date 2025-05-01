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
    },
})
.use(GraffitiPlugin, {
	graffiti: new GraffitiLocal(),
	// graffiti: new GraffitiRemote(),
})
.mount("#app");