import { Instance } from 'mobx-state-tree';
import { initSuitsFromConfig } from 'ide-lib-engine';

export * from './SwitchPanel/config';
export * from './SwitchPanel/';
export * from './SwitchPanel/mods/Panel';

import { SwitchPanelCurrying } from './SwitchPanel/';
import { configSwitchPanel } from './SwitchPanel/config';

const {
    ComponentModel: SwitchPanelModel,
    NormalComponent: SwitchPanel,
    ComponentHOC: SwitchPanelHOC,
    ComponentAddStore: SwitchPanelAddStore,
    ComponentFactory: SwitchPanelFactory
} = initSuitsFromConfig(SwitchPanelCurrying,configSwitchPanel);

export {
    SwitchPanelModel,
    SwitchPanel,
    SwitchPanelHOC,
    SwitchPanelAddStore,
    SwitchPanelFactory
};

export interface ISwitchPanelModel extends Instance<typeof SwitchPanelModel> { }
