export function App() {
  const path = window.location.pathname;
  const mode = path.includes('controller') ? 'controller' : 'screen';

  return (
    <main className={`app app-${mode}`}>
      <h1>{mode === 'screen' ? '家庭派对智慧屏' : '手机控制器'}</h1>
      <p>Family Play MVP is bootstrapped.</p>
    </main>
  );
}
