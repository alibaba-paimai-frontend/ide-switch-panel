import styled from 'styled-components';
import { Button } from 'antd';
import { IBaseStyledProps } from 'ide-lib-base-component';
import { ISwitchPanelProps } from './index';

interface IStyledProps extends ISwitchPanelProps, IBaseStyledProps {}

export const StyledContainer = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {} // 优先级会高一些，行内样式
})<IStyledProps>`
  display: flex;
  position: relative;
  flex-flow: column;

  & .ant-btn-group {
    display: flex;
  }
`;

export const StyledPanelWrap = styled.div`
  visibility: ${(props: IStyledProps) =>
    props.visible ? 'visible' : 'hidden'};
  z-index: ${(props: IStyledProps) => (props.visible ? 'inherit' : '-1')};
  position: absolute;
  left: 0;
  top: 0;
`;
