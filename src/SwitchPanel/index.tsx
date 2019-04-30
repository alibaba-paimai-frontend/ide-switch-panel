import React, { useCallback, useEffect, useState } from 'react';
import { IBaseTheme, IBaseComponentProps } from 'ide-lib-base-component';

import { TComponentCurrying } from 'ide-lib-engine';

import { StyledContainer, StyledPanelWrap } from './styles';

import { ISubProps } from './subs';
import { EPanelType, Panels, IPanel, IPanelProps} from './mods/Panel';

export interface ISwitchPanelEvent { }
// export interface ISwitchPanelStyles extends IBaseStyles {
//   container?: React.CSSProperties;
// }

export interface ISwitchPanelTheme extends IBaseTheme {
  main: string;
}

export interface ISwitchPanelProps
  extends ISwitchPanelEvent,
  IPanelProps,
  ISubProps,
  IBaseComponentProps {

  /**
   * 容器的高度
   *
   * @type {(number | string)}
   * @memberof ISwitchPanelProps
   */
  height?: number | string;
}

export const DEFAULT_PROPS: ISwitchPanelProps = {
  selectedIndex: 0,
  buttonHeight: 30,
  panels: [
    {
      id: 'preview',
      title: '页面预览',
      type: EPanelType.iframe
    },
    {
      id: 'schema',
      title: 'Schema',
      type: EPanelType.editor
    },
    {
      id: 'fns',
      title: '回调函数',
      type: EPanelType.editor
    }
  ],
  width: '100%',
  theme: {
    main: '#25ab68'
  },
  styles: {
    container: {}
  }
};

export const SwitchPanelCurrying: TComponentCurrying<
  ISwitchPanelProps,
  ISubProps
> = subComponents => props => {
  const { CodeEditor: CodeEditorComponent, IFrame: IFrameComponent } = subComponents as Record<
  string,
  React.FunctionComponent<typeof props>
  >;

  const mergedProps = Object.assign({}, DEFAULT_PROPS, props);
  const {
    codeEditor = {},
    previewer = {},
    styles,
    panels,
    selectedIndex,
    height,
    width,
    buttonHeight
  } = mergedProps;

  // 需要同步更新子元素的宽度
  codeEditor.width = width;
  codeEditor.height = height;
  codeEditor.visible = true;

  previewer.styles = previewer.styles || {};
  previewer.styles.container = Object.assign(
    {},
    previewer.styles.container || {},
    { width, height }
  );

  const [pIndex, setPIndex] = useState(selectedIndex);

  useEffect(() => {
    setPIndex(props.selectedIndex);
  }, [props.selectedIndex]);

  const onSwitchPanel = useCallback(
    (panel: IPanel, index: number) => {
      if (index === pIndex) return;
      setPIndex(index);
      props.onSwitch && props.onSwitch(panel, index);
    },
    [props.onSwitch, pIndex]
  );

  // 根据当前的选择的配置项，获取其中的 props ，然后 merge 过来，自定义配置的优先级最高
  const selectedPanel = panels[+pIndex];

  return (
    <StyledContainer
      style={styles.container}
      height={height}
      buttonHeight={buttonHeight}
      width={width}
      // ref={this.root}
      className="ide-switch-panel-container"
    >
      <StyledPanelWrap visible={selectedPanel.type === EPanelType.iframe}>
        <IFrameComponent {...previewer} />
      </StyledPanelWrap>

      <StyledPanelWrap visible={selectedPanel.type === EPanelType.editor}>
        <CodeEditorComponent {...codeEditor} />
      </StyledPanelWrap>
      <Panels
        panels={panels}
        width={width}
        buttonHeight={buttonHeight}
        selectedIndex={pIndex}
        onSwitch={onSwitchPanel}
      />
    </StyledContainer>
  );
};
