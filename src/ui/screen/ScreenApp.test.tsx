import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScreenApp } from './ScreenApp';

describe('ScreenApp', () => {
  it('shows room creation, game list, and airplane battle coming soon', () => {
    render(<ScreenApp />);

    expect(screen.getByRole('heading', { name: '家庭派对智慧屏' })).toBeInTheDocument();
    expect(screen.getByText('创建房间')).toBeInTheDocument();
    expect(screen.getByText('炸弹传传传')).toBeInTheDocument();
    expect(screen.getByText('家庭怪兽赛跑')).toBeInTheDocument();
    expect(screen.getByText('宝藏大乱斗')).toBeInTheDocument();
    expect(screen.getByText('飞机大战')).toBeInTheDocument();
    expect(screen.getByText('即将上线')).toBeInTheDocument();
  });
});
