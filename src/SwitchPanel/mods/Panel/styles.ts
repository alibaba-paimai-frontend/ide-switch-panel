import styled from 'styled-components';
import { Button } from 'antd';
import { IBaseStyledProps } from 'ide-lib-base-component';
import { IPanelProps } from './index';

const ButtonGroup = Button.Group;

interface IStyledProps extends IPanelProps, IBaseStyledProps { }


export const StyledButtonGroup = styled(ButtonGroup)`
width: ${(props: IStyledProps) =>
        props.width ? `${props.width}px` : 'auto'};
  left: 0;
  bottom:0;
  &.ant-btn-group{
    position: absolute;
  }
`;
