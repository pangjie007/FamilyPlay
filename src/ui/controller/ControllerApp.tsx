export function ControllerApp() {
  return (
    <section className="controller-shell">
      <h1>手机控制器</h1>
      <form className="join-form">
        <label>
          房间码
          <input name="roomId" placeholder="FAMILY" />
        </label>
        <label>
          昵称
          <input name="nickname" placeholder="豆豆" />
        </label>
        <button type="button">加入房间</button>
      </form>

      <section className="control-pad" aria-label="控制面板">
        <button type="button">传递</button>
        <button type="button">冲刺</button>
        <button type="button">选择宝箱</button>
      </section>
    </section>
  );
}
