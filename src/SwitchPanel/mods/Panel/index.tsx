import React, {useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'antd';

import { StyledButtonGroup} from './styles'


// 不同面板对应的类型，目前只有 编辑器 和 iframe 两种
export enum EPanelType {
    editor = 'editor',
    iframe = 'iframe'
}

export interface IPanel {
    id: string;
    title?: string;
    type: EPanelType; // 面板类型
}

export interface IPanelEvent {
    /**
     * 点击回调函数
     */
    onSwitch?: (panel: IPanel, index: number) => void;
}

export interface IPanelProps extends IPanelEvent {
    /**
     * 面板数据数组
     * 默认值：[]
     *
     * @type {IPanel[]} - 面板数组
     * @memberof ISwitchPanelProps
     */
    panels?: IPanel[];

    /**
     * 选中的 panel id 值
     * 默认值：''
     *
     * @type {string}
     * @memberof ISwitchPanelProps
     */
    selectedIndex?: number | string;

    /**
     * 容器的宽度
     *
     * @type {(number | string)}
     * @memberof ISwitchPanelProps
     */
    width?: number | string;

    /**
     * 按钮的高度
     *
     * @type {(number | string)}
     * @memberof ISwitchPanelProps
     */
    buttonHeight?: number | string;
}

export const Panels: React.FunctionComponent<IPanelProps> = observer(props => {
    const {
        panels = [],
        selectedIndex,
        onSwitch,
        width,
        buttonHeight = 30
    } = props;

    const onClickPanel = useCallback(
        (panel: IPanel, index: number) => {
            return function (e: React.MouseEvent) {
                onSwitch && onSwitch(panel, index);
            }
        },
        [onSwitch]
    );
    return (
        (panels.length && (
            <StyledButtonGroup width={width}>
                {panels.map((panel, i) => {
                    const { title } = panel;
                    return (
                        <Button
                            type={selectedIndex === i ? 'primary' : 'default'}
                            onClick={onClickPanel(panel, i)}
                            style={{
                                flex: '1',
                                borderRadius: 0,
                                height: buttonHeight
                            }}
                            size={'large'}
                            key={'' + i}
                        >
                            {title}
                        </Button>
                    );
                })}
            </StyledButtonGroup>
        )) ||
        null
    );
});


