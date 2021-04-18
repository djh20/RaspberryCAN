import App from './app/App';

console.log("Starting...");

const app = new App();
app.start().then(() => console.log("Ready!"));