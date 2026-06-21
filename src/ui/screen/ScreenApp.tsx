const games = [
  { title: '炸弹传传传', description: '倒计时传递炸弹，时间到触发温和挑战。', status: '可试玩' },
  { title: '家庭怪兽赛跑', description: '点击或摇一摇，让怪兽冲向终点。', status: '可试玩' },
  { title: '宝藏大乱斗', description: '轮流打开宝箱，收集金币和惊喜。', status: '可试玩' },
  { title: '飞机大战', description: '方向控制和协作射击 Spike。', status: '即将上线' },
];

export function ScreenApp() {
  return (
    <section className="screen-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">智慧屏主画面</p>
          <h1>家庭派对智慧屏</h1>
          <p>创建房间，让手机和平板成为全家的控制器。</p>
        </div>
        <button className="primary-action" type="button">
          创建房间
        </button>
      </header>

      <section className="game-grid" aria-label="游戏列表">
        {games.map((game) => (
          <article className="game-card" key={game.title}>
            <span>{game.status}</span>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
