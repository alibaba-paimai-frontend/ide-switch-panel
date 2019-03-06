import styled from 'styled-components';
import { Button } from 'antd';
import { IBaseStyledProps } from 'ide-lib-base-component';
import { ISwitchPanelProps } from './index';

const ButtonGroup = Button.Group;

interface IStyledProps extends ISwitchPanelProps, IBaseStyledProps { }


export const StyledContainer = styled.div`
  height: ${(props: IStyledProps) =>
  props.height ? ` ${props.height}px` : 'auto'};
  width: ${(props: IStyledProps) =>
    props.width ? `${props.width}px` : 'auto'};
  display: flex;
  position: relative;
  flex-flow: column;
  
  & .ant-btn-group {
    display: flex;
  }
`;

export const StyledButtonGroup = styled(ButtonGroup)`
width: ${(props: IStyledProps) =>
    props.width ? `${props.width}px` : 'auto'};
  left: 0;
  bottom:0;
  &.ant-btn-group{
    position: absolute;
  }
`;

export const StyledPanelWrap = styled.div`
  visibility: ${(props: IStyledProps) => (props.visible ? 'visible' : 'hidden')};
  z-index: ${(props: IStyledProps) => (props.visible ? 'inherit' : '-1')};
  position: absolute;
  left: 0;
  top: 0; 
`;

