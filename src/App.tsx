import { ControllerApp } from './ui/controller/ControllerApp';
import { ScreenApp } from './ui/screen/ScreenApp';

export function App() {
  const path = window.location.pathname;
  return path.includes('controller') ? <ControllerApp /> : <ScreenApp />;
}
