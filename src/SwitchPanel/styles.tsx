import styled from 'styled-components';
import { Button } from 'antd';

const ButtonGroup = Button.Group;

interface IContainer {
  height?: number | string;
  width?: number | string;
}

export const StyledContainer = styled.div`
  height: ${(props: IContainer) =>
    props.height ? `${props.height}px` : 'auto'};
  width: ${(props: IContainer) =>
    props.width ? `${props.width}px` : 'auto'};
  display: flex;
  flex-flow: column;

  & .ant-btn-group {
    display: flex;
  }
`;

export const StyledButtonGroup = styled(ButtonGroup)``;

