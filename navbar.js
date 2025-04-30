export async function Navbar() {
    return {
      template: await fetch("./navbar.html").then((r) => r.text()),
    };
}