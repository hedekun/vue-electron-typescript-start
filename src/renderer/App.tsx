import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
  private mounted() {
    this.$electron.ipcRenderer.on("will-close", () => {
      // do something
      this.$electron.ipcRenderer.send("app-exit");
    });
  }

  private render() {
    return (
      <div id="app">
        <router-view />
      </div>
    );
  }
}
