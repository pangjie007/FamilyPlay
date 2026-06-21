import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ControllerApp } from './ControllerApp';

describe('ControllerApp', () => {
  it('shows join form and controller actions', () => {
    render(<ControllerApp />);

    expect(screen.getByRole('heading', { name: '手机控制器' })).toBeInTheDocument();
    expect(screen.getByLabelText('房间码')).toBeInTheDocument();
    expect(screen.getByLabelText('昵称')).toBeInTheDocument();
    expect(screen.getByText('加入房间')).toBeInTheDocument();
    expect(screen.getByText('传递')).toBeInTheDocument();
    expect(screen.getByText('冲刺')).toBeInTheDocument();
    expect(screen.getByText('选择宝箱')).toBeInTheDocument();
  });
});
